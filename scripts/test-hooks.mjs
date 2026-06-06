#!/usr/bin/env node
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';

const cases = [
  {
    name: 'pretool denies destructive git',
    script: '.codex/hooks/mobile-pretool-policy.mjs',
    fixture: 'evals/hooks/fixtures/pretool-deny.json',
    exitCode: 2,
    includes: '"decision":"deny"',
  },
  {
    name: 'pretool allows npm test',
    script: '.codex/hooks/mobile-pretool-policy.mjs',
    fixture: 'evals/hooks/fixtures/pretool-allow.json',
    exitCode: 0,
    includes: '"decision":"approve"',
  },
  {
    name: 'posttool emits evidence reminder',
    script: '.codex/hooks/mobile-posttool-evidence-reminder.mjs',
    fixture: 'evals/hooks/fixtures/posttool-evidence.json',
    exitCode: 0,
    includes: 'Capture test/build/evidence',
  },
  {
    name: 'stop emits missing evidence advisory',
    script: '.codex/hooks/mobile-stop-gatekeeper-advisory.mjs',
    fixture: 'evals/hooks/fixtures/stop-missing-evidence.json',
    exitCode: 0,
    includes: 'missing mobile evidence',
  },
];

const failures = [];

for (const testCase of cases) {
  const input = fs.readFileSync(testCase.fixture, 'utf8');
  const result = spawnSync('node', [testCase.script], {
    input,
    encoding: 'utf8',
  });
  if (result.status !== testCase.exitCode) {
    failures.push(`${testCase.name}: expected exit ${testCase.exitCode}, got ${result.status}`);
  }
  if (!result.stdout.includes(testCase.includes)) {
    failures.push(`${testCase.name}: stdout did not include ${testCase.includes}; got ${result.stdout}`);
  }
}

if (failures.length) {
  console.error(failures.map((failure) => `- ${failure}`).join('\n'));
  process.exit(1);
}

console.log(`Passed ${cases.length} hook fixture tests.`);
