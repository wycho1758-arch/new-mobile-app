#!/usr/bin/env node
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const FIXTURE_DIR = 'evals/local-harness/preflight/fixtures';
const RESULT_FILE = 'evals/local-harness/results/preflight.json';
const DEFAULT_CANDIDATES = ['/opt/homebrew/bin/codex', '/usr/local/bin/codex'];
const READ_ONLY_SMOKE_ARGS = ['exec', '--sandbox', 'read-only', 'Return exactly: LOCAL_CODEX_HEADLESS_OK'];

function parseArgs(argv) {
  return {
    selfTest: argv.includes('--self-test'),
    json: argv.includes('--json'),
    noWrite: argv.includes('--no-write'),
    pod: argv.includes('--pod'),
  };
}

function unique(items) {
  return [...new Set(items.filter(Boolean))];
}

function candidatePaths(env = process.env) {
  return unique([env.CODEX_BIN, ...DEFAULT_CANDIDATES]);
}

function normalizeVersion(stdout) {
  return stdout.trim().split('\n')[0] || '';
}

function expectedArch(unameMachine) {
  if (unameMachine === 'arm64' || unameMachine === 'aarch64') return 'arm64';
  if (unameMachine === 'x86_64' || unameMachine === 'amd64') return 'x86_64';
  return unameMachine;
}

function fileMatchesHostArch(fileOutput, unameMachine) {
  const arch = expectedArch(unameMachine);
  if (arch === 'arm64') return /\barm64\b|aarch64/i.test(fileOutput);
  if (arch === 'x86_64') return /\bx86_64\b|amd64/i.test(fileOutput);
  return fileOutput.includes(arch);
}

function fileArch(fileOutput) {
  if (/\barm64\b|aarch64/i.test(fileOutput)) return 'arm64';
  if (/\bx86_64\b|amd64/i.test(fileOutput)) return 'x86_64';
  return 'unknown';
}

function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    cwd: options.cwd,
    encoding: 'utf8',
    timeout: options.timeoutMs || 30000,
  });

  return {
    status: result.status ?? 1,
    stdout: result.stdout || '',
    stderr: result.stderr || '',
  };
}

function createActualResolver() {
  return {
    platform: () => process.platform,
    unameMachine: () => {
      const arm64Capable = run('sysctl', ['-n', 'hw.optional.arm64']);
      if (arm64Capable.status === 0 && arm64Capable.stdout.trim() === '1') return 'arm64';
      return run('/usr/bin/uname', ['-m']).stdout.trim() || run('uname', ['-m']).stdout.trim();
    },
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
    probeCandidate: (candidate, unameMachine) => {
      let executable = false;
      try {
        fs.accessSync(candidate, fs.constants.X_OK);
        executable = true;
      } catch {
        executable = false;
      }

      const baseProbe = {
        path: candidate,
        exists: fs.existsSync(candidate),
        executable,
        fileOutput: run('file', [candidate]).stdout.trim(),
      };

      if (!baseProbe.exists || !baseProbe.executable || !fileMatchesHostArch(baseProbe.fileOutput, unameMachine)) {
        return {
          ...baseProbe,
          version: { status: null, stdout: '', stderr: 'not executed before arch validation' },
          execHelp: { status: null, stdout: '', stderr: 'not executed before arch validation' },
          smoke: { status: null, stdout: '', stderr: 'not executed before arch validation' },
        };
      }

      return {
        ...baseProbe,
        version: run(candidate, ['--version']),
        execHelp: run(candidate, ['exec', '--help']),
        smoke: run(candidate, READ_ONLY_SMOKE_ARGS, { timeoutMs: 60000 }),
      };
    },
  };
}

function createFixtureResolver(fixture) {
  const byPath = new Map(fixture.candidates.map((candidate) => [candidate.path, candidate]));
  return {
    platform: () => fixture.platform || 'darwin',
    unameMachine: () => fixture.unameMachine,
    command: (name) => fixture.commands?.[name] || { status: 1, stdout: '', stderr: `missing fixture command: ${name}` },
    readWorkspaceIdentity: () => fixture.files?.workspaceIdentity || '',
    codexConfigExists: () => Boolean(fixture.files?.codexConfigToml),
    probeCandidate: (candidatePath) => byPath.get(candidatePath) || {
      path: candidatePath,
      exists: false,
      executable: false,
      fileOutput: '',
      version: { status: 1, stdout: '', stderr: 'missing fixture candidate' },
      execHelp: { status: 1, stdout: '', stderr: 'missing fixture candidate' },
      smoke: { status: 1, stdout: '', stderr: 'missing fixture candidate' },
    },
  };
}

function rejection(reason, candidate, detail = {}) {
  return {
    path: candidate.path,
    accepted: false,
    reason,
    fileArch: fileArch(candidate.fileOutput || ''),
    ...detail,
  };
}

function evaluateCandidate(candidate, unameMachine) {
  if (!candidate.exists) return rejection('missing', candidate);
  if (!candidate.executable) return rejection('not-executable', candidate);
  if (!fileMatchesHostArch(candidate.fileOutput, unameMachine)) {
    return rejection('arch-mismatch', candidate, {
      hostArch: unameMachine,
      fileOutput: candidate.fileOutput,
    });
  }
  if (candidate.version.status !== 0) return rejection('version-failed', candidate, { stderr: candidate.version.stderr });
  if (candidate.execHelp.status !== 0) return rejection('exec-help-failed', candidate, { stderr: candidate.execHelp.stderr });
  if (candidate.smoke.status !== 0) return rejection('smoke-failed', candidate, { stderr: candidate.smoke.stderr });
  if (!candidate.smoke.stdout.includes('LOCAL_CODEX_HEADLESS_OK')) {
    return rejection('smoke-sentinel-missing', candidate, {
      stdout: candidate.smoke.stdout,
      stderr: candidate.smoke.stderr,
    });
  }

  return {
    path: candidate.path,
    accepted: true,
    reason: 'accepted',
    fileArch: fileArch(candidate.fileOutput || ''),
    version: normalizeVersion(candidate.version.stdout),
    smokeUsedSandboxReadOnly: true,
  };
}

function runPreflight(options = {}) {
  const env = options.env || process.env;
  const resolver = options.resolver || createActualResolver();
  const candidates = options.candidates || candidatePaths(env);
  const unameMachine = resolver.unameMachine();
  const probes = [];
  let accepted = null;

  for (const candidatePath of candidates) {
    const candidate = resolver.probeCandidate(candidatePath, unameMachine);
    const evaluated = evaluateCandidate(candidate, unameMachine);
    if (evaluated.accepted && !accepted) {
      accepted = evaluated;
      probes.push(evaluated);
    } else if (evaluated.accepted) {
      probes.push({
        ...evaluated,
        accepted: false,
        reason: 'not-selected-first-valid',
      });
    } else {
      probes.push(evaluated);
    }
  }

  const environment = runtimeEnvironment();

  if (accepted) {
    return {
      status: 'available',
      acceptedPath: accepted.path,
      version: accepted.version,
      hostArch: unameMachine,
      smokeCommand: ['codex', ...READ_ONLY_SMOKE_ARGS],
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
  return unique([env.CODEX_BIN, whichCodex.status === 0 ? whichCodex.stdout.trim() : '', ...DEFAULT_CANDIDATES]);
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
  const probes = [];
  let accepted = null;

  for (const candidatePath of candidates) {
    const candidate = resolver.probeCandidate(candidatePath, unameMachine);
    const evaluated = evaluateCandidate(candidate, unameMachine);
    if (evaluated.accepted && !accepted) {
      accepted = evaluated;
      probes.push(evaluated);
    } else if (evaluated.accepted) {
      probes.push({
        ...evaluated,
        accepted: false,
        reason: 'not-selected-first-valid',
      });
    } else {
      probes.push(evaluated);
    }
  }

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
    'codex.invalid-x86_64.json',
    'codex.invalid-missing-sentinel.json',
    'pod.invalid-pnpm-mismatch.json',
    'pod.valid-pnpm-match.json',
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
