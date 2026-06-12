#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import {
  validateHumanGateDecision,
  validateWorkUnitStatus,
} from './lib/work-unit-machine.mjs';

const root = process.cwd();
const args = process.argv.slice(2);
const errors = [];

function relative(file) {
  return path.relative(root, file).replaceAll(path.sep, '/');
}

function readJson(file, targetErrors = errors) {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch (error) {
    targetErrors.push(`${relative(file)}: invalid JSON: ${error.message}`);
    return null;
  }
}

function statusFilesUnder(baseDir) {
  if (!fs.existsSync(baseDir)) return [];
  const out = [];
  const stack = [baseDir];
  while (stack.length) {
    const current = stack.pop();
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      const absolute = path.join(current, entry.name);
      if (entry.isDirectory()) {
        stack.push(absolute);
      } else if (entry.isFile() && entry.name === 'status.json') {
        out.push(absolute);
      }
    }
  }
  return out.sort();
}

function topLevelWorkUnitStatusFiles() {
  const baseDir = path.join(root, 'docs/plans/work-units');
  if (!fs.existsSync(baseDir)) return [];
  return fs.readdirSync(baseDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => path.join(baseDir, entry.name, 'status.json'))
    .filter((file) => fs.existsSync(file))
    .sort();
}

function expectedWorkUnitId(file) {
  return path.basename(path.dirname(file));
}

function humanGateDecisionFiles(workUnitDir) {
  const files = [];
  const planningGateDir = path.join(workUnitDir, '00-product-planning/human-gates');
  if (fs.existsSync(planningGateDir)) {
    for (const entry of fs.readdirSync(planningGateDir, { withFileTypes: true })) {
      if (entry.isFile() && entry.name.endsWith('.json')) {
        files.push(path.join(planningGateDir, entry.name));
      }
    }
  }

  const releaseApproval = path.join(workUnitDir, '05-qa-release/human-approval.json');
  if (fs.existsSync(releaseApproval)) {
    files.push(releaseApproval);
  }

  return files.sort();
}

function expectedGateId(file) {
  if (path.basename(file) === 'human-approval.json') return undefined;
  return path.basename(file, '.json');
}

function decisionPath(workUnitDir, file) {
  return path.relative(workUnitDir, file).replaceAll(path.sep, '/');
}

function validateWorkUnitDirectory(statusFile, targetErrors = errors) {
  const status = readJson(statusFile, targetErrors);
  if (!status) return false;

  const workUnitDir = path.dirname(statusFile);
  const decisionsByPath = new Map();

  for (const file of humanGateDecisionFiles(workUnitDir)) {
    const decision = readJson(file, targetErrors);
    if (!decision) continue;
    const decisionErrors = validateHumanGateDecision(decision, {
      source: relative(file),
      expectedGateId: expectedGateId(file),
    });
    targetErrors.push(...decisionErrors);
    decisionsByPath.set(decisionPath(workUnitDir, file), decision);
  }

  const statusErrors = validateWorkUnitStatus(status, {
    source: relative(statusFile),
    expectedWorkUnitId: expectedWorkUnitId(statusFile),
    humanGateDecisionsByPath: decisionsByPath,
  });
  targetErrors.push(...statusErrors);
  return statusErrors.length === 0;
}

function validateFile(file) {
  return validateWorkUnitDirectory(file, errors);
}

function runSelfTest() {
  const validFiles = statusFilesUnder(path.join(root, 'evals/work-units/fixtures/valid'));
  const invalidFiles = statusFilesUnder(path.join(root, 'evals/work-units/fixtures/invalid'));

  if (validFiles.length === 0) {
    errors.push('self-test must include at least one valid work-unit fixture');
  }
  if (invalidFiles.length < 8) {
    errors.push('self-test must include invalid fixtures for schema, id, role, reviewer, gatekeeper, events, and evidence boundaries');
  }

  for (const file of validFiles) {
    validateFile(file);
  }

  for (const file of invalidFiles) {
    const fileErrors = [];
    validateWorkUnitDirectory(file, fileErrors);
    if (fileErrors.length === 0) {
      errors.push(`${relative(file)}: invalid fixture unexpectedly passed`);
    }
  }
}

if (args.includes('--self-test')) {
  runSelfTest();
} else {
  const explicitFiles = args.filter((arg) => !arg.startsWith('-'));
  const files = explicitFiles.length
    ? explicitFiles.map((file) => path.resolve(root, file))
    : topLevelWorkUnitStatusFiles();

  for (const file of files) {
    validateFile(file);
  }
}

if (errors.length) {
  console.error(errors.map((error) => `- ${error}`).join('\n'));
  process.exit(1);
}

console.log(args.includes('--self-test')
  ? 'Validated work-unit status fixtures.'
  : 'Validated work-unit status artifacts.');
