#!/usr/bin/env node
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const FIXTURE_DIR = 'evals/local-harness/preflight/fixtures';
const RESULTS_PREFIX = 'evals/local-harness/results/';
const KEEP_FILE = `${RESULTS_PREFIX}.gitkeep`;
const APPROVED_LOCAL_HARNESS_PATHS = new Set([
  'package.json',
  'scripts/clean-tree-guard.mjs',
  'scripts/codex-preflight.mjs',
  'scripts/test-local-harness.mjs',
  `${RESULTS_PREFIX}.gitignore`,
  KEEP_FILE,
]);
const APPROVED_LOCAL_HARNESS_PREFIX = 'evals/local-harness/';
const ROOT_CONFIGS = [
  { envName: 'MOBILE_APP_ROOT', allowGeneratedResults: true },
];

function parseArgs(argv) {
  return {
    selfTest: argv.includes('--self-test'),
    json: argv.includes('--json'),
    enforce: argv.includes('--enforce'),
    allowLocalHarnessSource: argv.includes('--allow-local-harness-source'),
  };
}

function statusPath(line) {
  if (line.length <= 3) return '';
  return line.slice(3).replace(/^"|"$/g, '');
}

function isGeneratedResultLine(line, allowGeneratedResults) {
  if (!allowGeneratedResults) return false;
  const filePath = statusPath(line);
  return filePath.startsWith(RESULTS_PREFIX) && filePath !== KEEP_FILE;
}

function isApprovedLocalHarnessSourceLine(line, allowLocalHarnessSource) {
  if (!allowLocalHarnessSource) return false;
  const filePath = statusPath(line);
  return APPROVED_LOCAL_HARNESS_PATHS.has(filePath)
    || (filePath.startsWith(APPROVED_LOCAL_HARNESS_PREFIX) && !filePath.startsWith(RESULTS_PREFIX));
}

function evaluateStatus(statusLines, options = {}) {
  const allowGeneratedResults = options.allowGeneratedResults === true;
  const allowLocalHarnessSource = options.allowLocalHarnessSource === true;
  const unexpected = statusLines.filter((line) => (
    line.trim()
    && !isGeneratedResultLine(line, allowGeneratedResults)
    && !isApprovedLocalHarnessSourceLine(line, allowLocalHarnessSource)
  ));

  return {
    clean: unexpected.length === 0,
    unexpected,
    ignoredGeneratedResults: statusLines.filter((line) => isGeneratedResultLine(line, allowGeneratedResults)),
    ignoredLocalHarnessSource: statusLines.filter((line) => isApprovedLocalHarnessSourceLine(line, allowLocalHarnessSource)),
  };
}

function gitStatus(root, runner = spawnSync) {
  const result = runner('git', ['status', '--short', '--untracked-files=all'], {
    cwd: root,
    encoding: 'utf8',
  });

  if (result.status !== 0) {
    throw new Error(`git status failed in ${root}: ${result.stderr || result.stdout}`);
  }

  return result.stdout.split('\n').filter(Boolean);
}

function createFixtureGitStatusResolver(fixture) {
  const byRoot = new Map();
  const env = {};

  for (const root of fixture.roots) {
    const rootPath = `/${root.label.toLowerCase()}`;
    env[root.label] = rootPath;
    byRoot.set(rootPath, root.statusLines);
  }

  return {
    env,
    gitStatusResolver: (root) => byRoot.get(root) || [],
  };
}

function runGuard(env = process.env, options = {}) {
  const gitStatusResolver = options.gitStatusResolver || gitStatus;
  const existsResolver = options.existsResolver || fs.existsSync;
  const roots = ROOT_CONFIGS.map((config) => {
    const root = env[config.envName] || (config.envName === 'MOBILE_APP_ROOT' ? process.cwd() : null);
    if (!root) throw new Error(`${config.envName} is required`);
    if (!existsResolver(root)) throw new Error(`${config.envName} does not exist: ${root}`);

    const statusLines = gitStatusResolver(root);
    const evaluation = evaluateStatus(statusLines, {
      allowGeneratedResults: config.allowGeneratedResults,
      allowLocalHarnessSource: config.envName === 'MOBILE_APP_ROOT' && options.allowLocalHarnessSource === true,
    });

    return {
      label: config.envName,
      root,
      statusLines,
      ...evaluation,
    };
  });

  return {
    ok: roots.every((root) => root.clean),
    roots,
  };
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function arraysEqual(left, right) {
  return JSON.stringify(left) === JSON.stringify(right);
}

function runSelfTest() {
  const fixtureNames = ['clean-tree.valid.json', 'clean-tree.dirty.json'];
  const failures = [];

  for (const fixtureName of fixtureNames) {
    const fixture = readJson(path.join(FIXTURE_DIR, fixtureName));
    const resolver = createFixtureGitStatusResolver(fixture);
    const guardResult = runGuard(resolver.env, {
      gitStatusResolver: resolver.gitStatusResolver,
      existsResolver: () => true,
    });

    for (const root of fixture.roots) {
      const result = guardResult.roots.find((entry) => entry.label === root.label);

      if (result.clean !== root.expectedClean) {
        failures.push(`${fixtureName}/${root.label}: expected clean=${root.expectedClean}, got ${result.clean}`);
      }

      if (root.expectedUnexpected && !arraysEqual(result.unexpected, root.expectedUnexpected)) {
        failures.push(`${fixtureName}/${root.label}: unexpected lines mismatch`);
      }
    }
  }

  if (failures.length) {
    return { ok: false, failures };
  }

  return { ok: true, fixtures: fixtureNames };
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const result = args.selfTest ? runSelfTest() : runGuard(process.env, {
    allowLocalHarnessSource: args.allowLocalHarnessSource,
  });

  const exitCode = result.ok || !args.enforce ? 0 : 1;
  const payload = { ...result, advisoryOnly: !args.enforce };

  if (args.json) {
    process.stdout.write(`${JSON.stringify(payload, null, 2)}\n`);
  } else if (result.ok) {
    console.log(args.selfTest ? 'clean-tree-guard self-test passed' : 'clean-tree-guard passed');
  } else if (!args.enforce) {
    console.warn('clean-tree-guard advisory: dirty worktree accepted for in-progress runtime validation');
  } else {
    console.error(args.selfTest ? 'clean-tree-guard self-test failed' : 'clean-tree-guard failed');
    const failures = result.failures || result.roots?.flatMap((root) => root.unexpected.map((line) => `${root.label}: ${line}`)) || [];
    for (const failure of failures) console.error(`- ${failure}`);
  }

  process.exit(exitCode);
}

main();
