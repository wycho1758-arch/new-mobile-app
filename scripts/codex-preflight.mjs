#!/usr/bin/env node
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import {
  createActualCodexResolver,
  createFixtureCodexResolver,
  selectCodexBinary,
  unique,
} from './lib/codex-binary-resolver.mjs';

const FIXTURE_DIR = 'evals/local-harness/preflight/fixtures';
const RESULT_FILE = 'evals/local-harness/results/preflight.json';
const READ_ONLY_SMOKE_ARGS = ['exec', '--sandbox', 'read-only', 'Return exactly: LOCAL_CODEX_HEADLESS_OK'];

function parseArgs(argv) {
  return {
    selfTest: argv.includes('--self-test'),
    json: argv.includes('--json'),
    noWrite: argv.includes('--no-write'),
    pod: argv.includes('--pod'),
  };
}

function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    cwd: options.cwd,
    encoding: 'utf8',
    timeout: options.timeoutMs || 30000,
    shell: options.shell || false,
  });

  return {
    status: result.status ?? 1,
    stdout: result.stdout || '',
    stderr: result.stderr || '',
  };
}

function createActualResolver() {
  const codexResolver = createActualCodexResolver();
  return {
    platform: () => process.platform,
    unameMachine: () => codexResolver.hostArch(),
    hostArch: () => codexResolver.hostArch(),
    candidatePaths: (env = process.env) => codexResolver.candidatePaths(env),
    probeCandidate: (candidate, unameMachine) => codexResolver.probeCandidate(candidate, unameMachine),
    command: (name) => {
      const commands = {
        nodeVersion: () => ({ status: 0, stdout: `${process.version}\n`, stderr: '' }),
        pnpmVersion: () => run('pnpm', ['--version']),
        whichCodex: () => run('sh', ['-lc', 'command -v codex']),
        gitUserName: () => run('git', ['config', '--get', 'user.name']),
        gitUserEmail: () => run('git', ['config', '--get', 'user.email']),
        ghAuthStatus: () => run('gh', ['auth', 'status']),
        chromiumPath: () => run('sh', ['-lc', 'command -v chromium || command -v chromium-browser || command -v google-chrome || command -v google-chrome-stable']),
        codexMcpList: () => run('codex', ['mcp', 'list']),
        googleAdcStatus: () => run('sh', ['-lc', 'test -n "$GOOGLE_APPLICATION_CREDENTIALS" -a -f "$GOOGLE_APPLICATION_CREDENTIALS" || test -f "$HOME/.config/gcloud/application_default_credentials.json"']),
        googleCloudProjectStatus: () => run('sh', ['-lc', 'test -n "$GOOGLE_CLOUD_PROJECT" || test -n "$(gcloud config get-value project 2>/dev/null)"']),
      };
      return commands[name]?.() || { status: 1, stdout: '', stderr: `unknown command fixture: ${name}` };
    },
    readWorkspaceIdentity: () => {
      try {
        return fs.readFileSync('/workspace/IDENTITY', 'utf8').split('\n')[0].trim();
      } catch {
        return '';
      }
    },
    codexConfigExists: () => fs.existsSync('.codex/config.toml'),
  };
}

function createFixtureResolver(fixture) {
  const codexResolver = createFixtureCodexResolver(fixture);
  return {
    platform: () => fixture.platform || 'darwin',
    unameMachine: () => fixture.unameMachine,
    hostArch: () => fixture.unameMachine,
    candidatePaths: (env = fixture.env || {}) => codexResolver.candidatePaths(env),
    command: (name) => fixture.commands?.[name] || { status: 1, stdout: '', stderr: `missing fixture command: ${name}` },
    readWorkspaceIdentity: () => fixture.files?.workspaceIdentity || '',
    codexConfigExists: () => Boolean(fixture.files?.codexConfigToml),
    probeCandidate: (candidatePath, unameMachine) => codexResolver.probeCandidate(candidatePath, unameMachine),
  };
}

function addSmokeValidation(selection, resolver, unameMachine) {
  if (!selection.selected) return selection;

  const probes = [...selection.probes];
  const smokeCandidates = probes.filter((probe) => probe.reason === 'accepted' || probe.reason === 'not-selected-first-valid');

  for (const probe of smokeCandidates) {
    const candidate = resolver.probeCandidate(probe.path, unameMachine);
    const descriptor = candidate.descriptor || probe.descriptor || { command: probe.path, argsPrefix: [] };
    const smoke = candidate.smoke || run(descriptor.command, [...descriptor.argsPrefix, ...READ_ONLY_SMOKE_ARGS], {
      timeoutMs: 60000,
      shell: descriptor.shell,
    });
    const probeIndex = probes.findIndex((item) => item.path === probe.path);

    if (smoke.status !== 0 || !smoke.stdout.includes('LOCAL_CODEX_HEADLESS_OK')) {
      probes[probeIndex] = {
        ...probe,
        accepted: false,
        reason: smoke.status !== 0 ? 'smoke-failed' : 'smoke-sentinel-missing',
        stdout: smoke.stdout,
        stderr: smoke.stderr,
      };
      continue;
    }

    const selected = {
      ...probe,
      accepted: true,
      reason: 'accepted',
      smokeUsedSandboxReadOnly: true,
    };
    probes[probeIndex] = selected;
    return {
      ...selection,
      status: 'available',
      reason: 'accepted',
      acceptedPath: selected.path,
      version: selected.version,
      selected,
      probes,
    };
  }

  return {
    ...selection,
    status: 'skipped',
    reason: 'no-valid-codex-binary',
    acceptedPath: null,
    version: null,
    selected: null,
    probes,
  };
}

function runPreflight(options = {}) {
  const env = options.env || process.env;
  const resolver = options.resolver || createActualResolver();
  const candidates = options.candidates || resolver.candidatePaths(env);
  const unameMachine = resolver.unameMachine();
  const selection = addSmokeValidation(selectCodexBinary({ resolver, candidates, env, hostArch: unameMachine }), resolver, unameMachine);
  const accepted = selection.selected;
  const probes = selection.probes;

  const environment = runtimeEnvironment();

  if (accepted) {
    return {
      status: 'available',
      acceptedPath: accepted.path,
      version: accepted.version,
      hostArch: unameMachine,
      smokeCommand: [accepted.descriptor?.command || accepted.path, ...(accepted.descriptor?.argsPrefix || []), ...READ_ONLY_SMOKE_ARGS],
      smokeUsedSandboxReadOnly: true,
      environment,
      probes,
    };
  }

  return {
    status: 'skipped',
    reason: 'no-valid-codex-binary',
    hostArch: unameMachine,
    codexSmoke: 'skipped',
    smokeCommand: ['codex', ...READ_ONLY_SMOKE_ARGS],
    smokeUsedSandboxReadOnly: true,
    environment,
    probes,
  };
}

function runtimeEnvironment(options = {}) {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  const pnpmVersion = options.pnpmVersion || run('pnpm', ['--version']);
  const packageManager = packageJson.packageManager || null;
  const expectedPnpmVersion = packageManager?.startsWith('pnpm@') ? packageManager.slice('pnpm@'.length) : null;
  const actualPnpmVersion = pnpmVersion.status === 0 ? pnpmVersion.stdout.trim() : null;
  const comparisons = {
    packageManager: packageManager ? 'recorded' : 'not-declared',
    pnpmVersion: expectedPnpmVersion
      ? (actualPnpmVersion === expectedPnpmVersion ? 'match' : 'mismatch')
      : 'not-declared',
    nodeEngines: packageJson.engines?.node ? 'declared-not-evaluated' : 'not-declared',
  };

  return {
    nodeVersion: process.version,
    pnpmVersion: actualPnpmVersion,
    packageManager,
    engines: packageJson.engines || null,
    comparisons,
    mismatches: [
      ...(expectedPnpmVersion && actualPnpmVersion !== expectedPnpmVersion ? [{
        field: 'packageManager',
        expected: expectedPnpmVersion,
        actual: actualPnpmVersion,
      }] : []),
    ],
  };
}

function commandStatus(commandResult) {
  return commandResult.status === 0 ? 'available' : 'missing';
}

function parseNodeMajor(versionOutput) {
  const match = versionOutput.trim().match(/^v?(\d+)\./);
  return match ? Number(match[1]) : null;
}

function podCandidatePaths(env, resolver) {
  const whichCodex = resolver.command('whichCodex');
  return unique([env.CODEX_BIN, whichCodex.status === 0 ? whichCodex.stdout.trim() : '', ...resolver.candidatePaths(env)]);
}

function resolvePodRole(env, resolver) {
  const envRole = (env.WM_ROLE || '').trim();
  const fileRole = resolver.readWorkspaceIdentity();
  const role = envRole || fileRole;
  const expectedRole = (env.WM_EXPECTED_ROLE || env.EXPECTED_WM_ROLE || '').trim();
  return {
    role: role || null,
    source: envRole ? 'WM_ROLE' : (fileRole ? '/workspace/IDENTITY' : 'missing'),
    expectedRole: expectedRole || null,
    fileRole: fileRole || null,
  };
}

function roleSlug(value) {
  return String(value || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function isDesignRole(role) {
  return roleSlug(role) === 'design' || roleSlug(role) === 'wm-design';
}

function stitchPreflightStatus(role, env, resolver) {
  if (!isDesignRole(role.role)) {
    return {
      status: 'not-applicable',
      reason: 'non-design-role',
    };
  }

  const adc = resolver.command('googleAdcStatus');
  const project = resolver.command('googleCloudProjectStatus');
  const adcStatus = adc.status === 0 ? 'present' : 'missing';
  const projectStatus = project.status === 0 || env.GOOGLE_CLOUD_PROJECT ? 'configured' : 'missing';

  return {
    status: adcStatus === 'present' && projectStatus === 'configured' ? 'configured' : 'missing',
    adc: adcStatus,
    project: projectStatus,
    values: 'redacted',
  };
}

function addBlocker(blockers, reason, detail = {}) {
  blockers.push({ reason, ...detail });
}

function runPodPreflight(options = {}) {
  const env = options.env || process.env;
  const resolver = options.resolver || createActualResolver();
  const platform = resolver.platform();
  const unameMachine = resolver.unameMachine();
  const role = resolvePodRole(env, resolver);

  if (platform !== 'linux' && !role.role) {
    return {
      status: 'skipped',
      reason: 'pod-markers-not-found',
      hostArch: unameMachine,
      mode: 'pod',
      capabilities: {
        rn_web_e2e: false,
        native_e2e_local: false,
        eas_cloud: 'missing',
      },
    };
  }

  const candidates = options.candidates?.length ? options.candidates : podCandidatePaths(env, resolver);
  const selection = addSmokeValidation(selectCodexBinary({ resolver, candidates, env, hostArch: unameMachine }), resolver, unameMachine);
  const accepted = selection.selected;
  const probes = selection.probes;

  const nodeVersion = resolver.command('nodeVersion');
  const pnpmVersion = resolver.command('pnpmVersion');
  const gitUserName = resolver.command('gitUserName');
  const gitUserEmail = resolver.command('gitUserEmail');
  const ghAuthStatus = resolver.command('ghAuthStatus');
  const chromiumPath = resolver.command('chromiumPath');
  const codexMcpList = resolver.command('codexMcpList');
  const environment = runtimeEnvironment({ pnpmVersion });
  const nodeMajor = nodeVersion.status === 0 ? parseNodeMajor(nodeVersion.stdout) : null;
  const blockers = [];
  const stitch = stitchPreflightStatus(role, env, resolver);

  if (!role.role) addBlocker(blockers, 'missing-role-identity');
  if (role.expectedRole && role.role && role.role !== role.expectedRole) {
    addBlocker(blockers, 'role-identity-mismatch', {
      expected: role.expectedRole,
      actual: role.role,
    });
  }
  if (nodeMajor !== 22) {
    addBlocker(blockers, 'node-major-mismatch', {
      expected: 22,
      actual: nodeMajor,
    });
  }
  if (environment.comparisons.pnpmVersion === 'mismatch') {
    addBlocker(blockers, 'pnpm-pin-mismatch', environment.mismatches[0] || {});
  }
  if (!accepted) addBlocker(blockers, 'no-valid-codex-binary');
  if (gitUserName.status !== 0 || gitUserEmail.status !== 0) addBlocker(blockers, 'git-identity-missing');
  if (ghAuthStatus.status !== 0) addBlocker(blockers, 'github-auth-unavailable');
  if (!resolver.codexConfigExists()) addBlocker(blockers, 'codex-config-missing');
  if (codexMcpList.status !== 0) addBlocker(blockers, 'codex-mcp-unavailable');
  if (isDesignRole(role.role) && stitch.status !== 'configured') {
    addBlocker(blockers, 'stitch-preflight-missing', {
      adc: stitch.adc,
      project: stitch.project,
    });
  }

  const capabilities = {
    rn_web_e2e: chromiumPath.status === 0,
    native_e2e_local: false,
    eas_cloud: Object.hasOwn(env, 'EXPO_TOKEN') && env.EXPO_TOKEN ? 'configured' : 'missing',
  };
  const statusOnly = {
    git_identity: gitUserName.status === 0 && gitUserEmail.status === 0 ? 'configured' : 'missing',
    github_auth: commandStatus(ghAuthStatus),
    codex_config: resolver.codexConfigExists() ? 'present' : 'missing',
    codex_mcp: commandStatus(codexMcpList),
    chromium: commandStatus(chromiumPath),
  };
  const base = {
    status: blockers.length ? 'blocked' : 'available',
    mode: 'pod',
    acceptedPath: accepted?.path || null,
    version: accepted?.version || null,
    hostArch: unameMachine,
    role,
    node: {
      major: nodeMajor,
      status: nodeMajor === 22 ? 'match' : 'mismatch',
    },
    environment,
    capabilities,
    statusOnly,
    stitch,
    blockers,
    probes,
  };

  return base;
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function runSelfTest() {
  const fixtureNames = [
    'codex.valid-arm64.json',
    'codex.valid-darwin-arm64-skips-x86_64-first.json',
    'codex.valid-darwin-universal.json',
    'codex.valid-fallback-after-smoke-failure.json',
    'codex.valid-linux-homebrew.json',
    'codex.valid-windows-cmd.json',
    'codex.invalid-x86_64.json',
    'codex.invalid-missing-sentinel.json',
    'pod.invalid-pnpm-mismatch.json',
    'pod.valid-pnpm-match.json',
    'pod.valid-codex-node-wrapper.json',
    'pod.valid-codex-node-wrapper-x86_64.json',
    'pod.invalid-missing-role.json',
    'pod.invalid-role-mismatch.json',
    'pod.invalid-gh-auth.json',
    'pod.valid-no-chromium.json',
    'pod.valid-eas-present.json',
    'pod.local-skip.json',
    'pod.invalid-design-stitch-missing.json',
    'pod.valid-non-design-stitch-skip.json',
    'pod.valid-design-stitch-present-redacted.json',
  ];
  const failures = [];

  for (const fixtureName of fixtureNames) {
    const fixture = readJson(path.join(FIXTURE_DIR, fixtureName));
    const result = fixture.mode === 'pod'
      ? runPodPreflight({
        resolver: createFixtureResolver(fixture),
        candidates: fixture.candidates.map((candidate) => candidate.path),
        env: fixture.env || {},
        fixture,
      })
      : runPreflight({
        resolver: createFixtureResolver(fixture),
        candidates: fixture.candidates.map((candidate) => candidate.path),
        env: {},
      });

    if (result.status !== fixture.expected.status) {
      failures.push(`${fixtureName}: expected status ${fixture.expected.status}, got ${result.status}`);
    }

    if (fixture.expected.acceptedPath && result.acceptedPath !== fixture.expected.acceptedPath) {
      failures.push(`${fixtureName}: expected acceptedPath ${fixture.expected.acceptedPath}, got ${result.acceptedPath}`);
    }

    if (fixture.expected.version && result.version !== fixture.expected.version) {
      failures.push(`${fixtureName}: expected version ${fixture.expected.version}, got ${result.version}`);
    }

    if (fixture.expected.rejectionReason && !result.probes.some((probe) => probe.reason === fixture.expected.rejectionReason)) {
      failures.push(`${fixtureName}: expected rejection ${fixture.expected.rejectionReason}`);
    }

    if (fixture.expected.blockerReason && !result.blockers?.some((blocker) => blocker.reason === fixture.expected.blockerReason)) {
      failures.push(`${fixtureName}: expected blocker ${fixture.expected.blockerReason}`);
    }

    if (fixture.expected.reason && result.reason !== fixture.expected.reason) {
      failures.push(`${fixtureName}: expected reason ${fixture.expected.reason}, got ${result.reason}`);
    }

    if (Object.hasOwn(fixture.expected, 'rnWebE2e') && result.capabilities?.rn_web_e2e !== fixture.expected.rnWebE2e) {
      failures.push(`${fixtureName}: expected rn_web_e2e ${fixture.expected.rnWebE2e}, got ${result.capabilities?.rn_web_e2e}`);
    }

    if (Object.hasOwn(fixture.expected, 'nativeE2eLocal') && result.capabilities?.native_e2e_local !== fixture.expected.nativeE2eLocal) {
      failures.push(`${fixtureName}: expected native_e2e_local ${fixture.expected.nativeE2eLocal}, got ${result.capabilities?.native_e2e_local}`);
    }

    if (fixture.expected.easCloud && result.capabilities?.eas_cloud !== fixture.expected.easCloud) {
      failures.push(`${fixtureName}: expected eas_cloud ${fixture.expected.easCloud}, got ${result.capabilities?.eas_cloud}`);
    }

    if (fixture.expected.stitchStatus && result.stitch?.status !== fixture.expected.stitchStatus) {
      failures.push(`${fixtureName}: expected stitch status ${fixture.expected.stitchStatus}, got ${result.stitch?.status}`);
    }

    if (fixture.expected.pnpmComparison && result.environment?.comparisons?.pnpmVersion !== fixture.expected.pnpmComparison) {
      failures.push(`${fixtureName}: expected pnpm comparison ${fixture.expected.pnpmComparison}, got ${result.environment?.comparisons?.pnpmVersion}`);
    }

    const forbiddenOutputs = [
      ...(Array.isArray(fixture.expected.forbiddenOutputs) ? fixture.expected.forbiddenOutputs : []),
      ...(fixture.expected.forbiddenOutput ? [fixture.expected.forbiddenOutput] : []),
    ];

    for (const forbiddenOutput of forbiddenOutputs) {
      if (JSON.stringify(result).includes(forbiddenOutput)) {
        failures.push(`${fixtureName}: output includes forbidden fixture value`);
      }
    }
  }

  return failures.length ? { ok: false, failures } : { ok: true, fixtures: fixtureNames };
}

function writeResult(result) {
  fs.mkdirSync(path.dirname(RESULT_FILE), { recursive: true });
  fs.writeFileSync(RESULT_FILE, `${JSON.stringify(result, null, 2)}\n`);
}

function main() {
  const args = parseArgs(process.argv.slice(2));

  if (args.selfTest) {
    const result = runSelfTest();
    if (args.json) process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
    else if (result.ok) console.log('codex-preflight self-test passed');
    else {
      console.error('codex-preflight self-test failed');
      for (const failure of result.failures) console.error(`- ${failure}`);
    }
    process.exit(result.ok ? 0 : 1);
  }

  const result = args.pod ? runPodPreflight() : runPreflight();
  if (!args.noWrite) writeResult(result);

  if (args.json) process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
  else if (result.status === 'available') console.log(`codex-preflight accepted ${result.acceptedPath} (${result.version})`);
  else if (result.status === 'blocked') console.log(`codex-preflight blocked: ${result.blockers.map((blocker) => blocker.reason).join(', ')}`);
  else console.log(`codex-preflight skipped: ${result.reason || 'no valid Codex binary'}`);

  if (args.pod && result.status === 'blocked') process.exit(1);
}

main();
