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
    unameMachine: () => {
      const arm64Capable = run('sysctl', ['-n', 'hw.optional.arm64']);
      if (arm64Capable.status === 0 && arm64Capable.stdout.trim() === '1') return 'arm64';
      return run('/usr/bin/uname', ['-m']).stdout.trim() || run('uname', ['-m']).stdout.trim();
    },
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
    unameMachine: () => fixture.unameMachine,
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

function runtimeEnvironment() {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  const pnpmVersion = run('pnpm', ['--version']);
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

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function runSelfTest() {
  const fixtureNames = ['codex.valid-arm64.json', 'codex.invalid-x86_64.json', 'codex.invalid-missing-sentinel.json'];
  const failures = [];

  for (const fixtureName of fixtureNames) {
    const fixture = readJson(path.join(FIXTURE_DIR, fixtureName));
    const result = runPreflight({
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

  const result = runPreflight();
  if (!args.noWrite) writeResult(result);

  if (args.json) process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
  else if (result.status === 'available') console.log(`codex-preflight accepted ${result.acceptedPath} (${result.version})`);
  else console.log('codex-preflight skipped: no valid Codex binary');
}

main();
