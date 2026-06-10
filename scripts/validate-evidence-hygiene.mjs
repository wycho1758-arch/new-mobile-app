#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { findSecretLikeValues } from './lib/secret-patterns.mjs';

const root = process.cwd();
const fixtureDir = 'evals/local-harness/evidence-hygiene/fixtures';
const args = process.argv.slice(2);
const scanRoots = ['.evidence', 'docs/plans/work-units'];

const forbiddenPathRules = [
  { name: '.evidence/local', pattern: /^\.evidence\/local(?:\/|$)/ },
  { name: '.evidence/tmp', pattern: /^\.evidence\/tmp(?:\/|$)/ },
  { name: '.evidence/**/*.log', pattern: /^\.evidence\/.*\.log$/ },
  { name: '.evidence/**/raw', pattern: /^\.evidence\/.*\/raw(?:\/|$)/ },
];

function normalizePath(value) {
  return value.split(path.sep).join('/');
}

function listFiles(baseDir) {
  const absoluteBase = path.join(root, baseDir);
  if (!fs.existsSync(absoluteBase)) return [];
  const out = [];
  const stack = [absoluteBase];
  while (stack.length) {
    const current = stack.pop();
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      const absolute = path.join(current, entry.name);
      if (entry.isDirectory()) stack.push(absolute);
      else out.push(normalizePath(path.relative(root, absolute)));
    }
  }
  return out.sort();
}

function readFileMap() {
  const files = {};
  for (const scanRoot of scanRoots) {
    for (const relativePath of listFiles(scanRoot)) {
      files[relativePath] = fs.readFileSync(path.join(root, relativePath), 'utf8');
    }
  }
  return files;
}

function validateEvidenceHygiene(files = readFileMap()) {
  const errors = [];
  for (const [relativePath, body] of Object.entries(files).sort(([a], [b]) => a.localeCompare(b))) {
    for (const rule of forbiddenPathRules) {
      if (rule.pattern.test(relativePath)) {
        errors.push(`${relativePath}: forbidden evidence path (${rule.name})`);
      }
    }

    const e2eMatch = relativePath.match(/^\.evidence\/e2e-test\/([^/]+)(?:\/|$)/);
    if (e2eMatch && !/^\d{8}-\d{6}-[a-z0-9-]+$/.test(e2eMatch[1])) {
      errors.push(`${relativePath}: .evidence/e2e-test directory "${e2eMatch[1]}" must match YYYYMMDD-HHMMSS-slug`);
    }

    for (const match of findSecretLikeValues(body)) {
      errors.push(`${relativePath}:${match.line}: probable secret or concrete credential (${match.pattern})`);
    }
  }
  return errors;
}

function runSelfTest() {
  const fixtureFiles = fs.readdirSync(path.join(root, fixtureDir)).filter((file) => file.endsWith('.json')).sort();
  const failures = [];

  for (const file of fixtureFiles) {
    const fixturePath = path.join(root, fixtureDir, file);
    const fixture = JSON.parse(fs.readFileSync(fixturePath, 'utf8'));
    const errors = validateEvidenceHygiene(fixture.files || {});

    if (fixture.valid && errors.length > 0) {
      failures.push(`${file}: valid fixture failed:\n${errors.map((error) => `  - ${error}`).join('\n')}`);
    }
    if (!fixture.valid && errors.length === 0) {
      failures.push(`${file}: invalid fixture unexpectedly passed`);
    }
    for (const expectedError of fixture.expectedErrors || []) {
      if (!errors.some((error) => error.includes(expectedError))) {
        failures.push(`${file}: missing expected error containing "${expectedError}". Actual errors:\n${errors.map((error) => `  - ${error}`).join('\n')}`);
      }
    }
  }

  if (failures.length) {
    console.error(failures.map((failure) => `- ${failure}`).join('\n'));
    process.exit(1);
  }

  console.log('Validated evidence hygiene fixtures.');
}

if (args.includes('--self-test')) {
  runSelfTest();
} else {
  const errors = validateEvidenceHygiene();
  if (errors.length) {
    console.error(errors.map((error) => `- ${error}`).join('\n'));
    process.exit(1);
  }
  console.log('Validated evidence hygiene artifacts.');
}

export { validateEvidenceHygiene };
