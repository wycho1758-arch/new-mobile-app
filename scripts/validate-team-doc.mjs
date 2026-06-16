#!/usr/bin/env node
import { spawnSync } from 'node:child_process';
import path from 'node:path';

const root = process.cwd();

const checks = [
  ['runtime source docs', 'scripts/validate-runtime-sources.mjs', []],
  ['runtime routing support docs', 'scripts/validate-runtime-routing-support.mjs', []],
];

function runSelfTest() {
  const labels = checks.map(([label]) => label);
  const managedScopeReason = 'not a direct pod-native skill source, role SOUL source, Codex CLI runtime input, or required codex-role-workflow routing-support input';
  const forbiddenLabels = [
    'team-doc structure fixture self-test',
    'team-doc structure registry',
    'workflow docs',
    'governance docs',
    'reference docs',
    'managed-doc parity backstop',
  ];
  const requiredLabels = [
    'runtime source docs',
    'runtime routing support docs',
  ];
  const errors = [];

  for (const label of forbiddenLabels) {
    if (labels.includes(label)) {
      errors.push(`validate-team-doc active runtime wrapper must not run broad validator: ${label} (${managedScopeReason})`);
    }
  }
  for (const label of requiredLabels) {
    if (!labels.includes(label)) {
      errors.push(`validate-team-doc active runtime wrapper missing required validator: ${label}`);
    }
  }

  if (errors.length) {
    console.error(errors.map((error) => `- ${error}`).join('\n'));
    process.exit(1);
  }

  console.log('Validated validate-team-doc active managed runtime composition.');
}

if (process.argv.includes('--self-test')) {
  runSelfTest();
  process.exit(0);
}

runSelfTest();

for (const [label, scriptPath, args] of checks) {
  const result = spawnSync(process.execPath, [path.join(root, scriptPath), ...args], {
    cwd: root,
    encoding: 'utf8',
    stdio: 'inherit',
  });

  if ((result.status ?? 1) !== 0) {
    console.error(`validate-team-doc failed at ${label}`);
    process.exit(result.status ?? 1);
  }
}

console.log('Validated current mobile-app-dev-team surface validators.');
