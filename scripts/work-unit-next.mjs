#!/usr/bin/env node
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {
  validateHumanGateDecision,
  validateWorkUnitStatus,
} from './lib/work-unit-machine.mjs';

const root = process.cwd();
const nextActionSchema = 'wm-next-action/v1';
const statusStates = new Set([
  'planned',
  'in-progress',
  'blocked-human',
  'blocked-gate',
  'review-needed',
  'done',
  'not-applicable',
  'deferred',
]);

function relative(file) {
  return path.relative(root, file).replaceAll(path.sep, '/');
}

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function writeJson(file, value) {
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`);
}

function normalizeIdentity(value) {
  return String(value || '').toLowerCase().replace(/[^a-z0-9]+/g, '');
}

function isWorkUnitStatusPath(input) {
  return input.endsWith('.json') || input.includes('/');
}

function resolveStatusFile(input) {
  if (!input) {
    throw new Error('usage: node scripts/work-unit-next.mjs <work-unit-id|status.json> [--role <role>] [--apply-transition <state>]');
  }
  if (isWorkUnitStatusPath(input)) {
    return path.resolve(root, input);
  }
  return path.join(root, 'docs/plans/work-units', input, 'status.json');
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

function loadWorkUnit(statusFile) {
  const status = readJson(statusFile);
  const workUnitDir = path.dirname(statusFile);
  const decisionsByPath = new Map();
  const errors = [];

  for (const file of humanGateDecisionFiles(workUnitDir)) {
    const decision = readJson(file);
    errors.push(...validateHumanGateDecision(decision, {
      source: relative(file),
      expectedGateId: expectedGateId(file),
    }));
    decisionsByPath.set(decisionPath(workUnitDir, file), decision);
  }

  errors.push(...validateWorkUnitStatus(status, {
    source: relative(statusFile),
    expectedWorkUnitId: path.basename(workUnitDir),
    humanGateDecisionsByPath: decisionsByPath,
  }));

  if (errors.length) {
    throw new Error(errors.map((error) => `- ${error}`).join('\n'));
  }

  return { status, statusFile, workUnitDir, decisionsByPath };
}

function reviewerRequirement(status) {
  if (!status.reviewer?.required) return null;
  if (status.reviewer.status === 'passed') return null;
  return {
    agent: status.reviewer.agent,
    status: status.reviewer.status,
    evidence: status.reviewer.evidence,
  };
}

function hasEvidence(status, kinds, pathPatterns = []) {
  return status.evidence.some((item) => {
    if (kinds.includes(item.kind)) return true;
    return pathPatterns.some((pattern) => pattern.test(item.path));
  });
}

function nativeEvidenceKindsForLevel(requiredLevel) {
  if (requiredLevel === 'L3' || requiredLevel === 'human-device') {
    return ['mobile-mcp-evidence', 'human-device-evidence', 'device-evidence'];
  }
  if (requiredLevel === 'L2' || requiredLevel === 'eas-maestro') {
    return ['native-evidence', 'eas-evidence', 'eas-maestro-evidence', 'mobile-mcp-evidence', 'human-device-evidence', 'device-evidence'];
  }
  return [];
}

function baseNext(status) {
  return {
    schema: nextActionSchema,
    work_unit_id: status.work_unit_id,
    current_stage: status.stage,
    current_state: status.state,
    owner_role: status.owner_role,
    allowed_actions: [],
    blocked_reasons: [],
    required_reviewer: null,
    required_human_gate: [],
    next_role: status.handoff.next_role,
    next_artifact: status.handoff.next_artifact,
    evidence_required: [],
    gatekeeper_mode: status.stage === '06-gatekeeper' ? 'deterministic-system' : null,
  };
}

export function resolveNextAction(status, options = {}) {
  const next = baseNext(status);
  const role = options.role || process.env.WM_ROLE;

  if (role && normalizeIdentity(role) !== normalizeIdentity(status.owner_role)) {
    next.blocked_reasons.push('role-mismatch');
    next.evidence_required.push('matching-role');
    return next;
  }

  if (status.state === 'done') {
    next.blocked_reasons.push('stage-complete');
    return next;
  }

  if (status.state === 'not-applicable' || status.state === 'deferred') {
    next.blocked_reasons.push('stage-not-executable');
    return next;
  }

  if (status.state === 'blocked-human') {
    const pending = status.human_gates.filter((gate) => gate.state !== 'approved');
    if (pending.length > 0) {
      next.blocked_reasons.push(pending.some((gate) => gate.state === 'pending') ? 'human-gate-pending' : 'human-gate-not-approved');
      next.required_human_gate = pending.map((gate) => ({
        gate_id: gate.gate_id,
        category: gate.category,
        state: gate.state,
      }));
      next.evidence_required.push('human-gate-decision');
      return next;
    }
    next.allowed_actions.push('resume-after-human-approval');
    next.evidence_required.push('stage-evidence');
    return next;
  }

  if (status.state === 'blocked-gate') {
    if (status.attempt >= 3) {
      next.blocked_reasons.push('retry-exhausted', 'failed-gate-risk-human-decision-required');
      next.required_human_gate.push({
        gate_id: 'failed-gate-risk',
        category: 'failed-gate-risk',
        state: 'pending',
      });
      next.evidence_required.push('human-gate-decision');
      return next;
    }
    next.allowed_actions.push('fix-failed-gate');
    next.blocked_reasons.push('gate-failed');
    next.evidence_required.push('failed-gate-fix-evidence');
    return next;
  }

  if (status.state === 'review-needed') {
    if (status.reviewer.required && status.reviewer.status === 'pending') {
      next.blocked_reasons.push('reviewer-pending');
      next.required_reviewer = reviewerRequirement(status);
      next.evidence_required.push('reviewer-evidence');
      return next;
    }
    if (status.reviewer.required && status.reviewer.status === 'failed') {
      next.allowed_actions.push('address-review-findings');
      next.blocked_reasons.push('reviewer-failed');
      next.required_reviewer = reviewerRequirement(status);
      next.evidence_required.push('review-fix-evidence');
      return next;
    }
    next.allowed_actions.push('advance-to-next-role');
    next.evidence_required.push('handoff-artifact');
    return next;
  }

  if (status.stage === '06-gatekeeper') {
    next.allowed_actions.push('run-deterministic-gates');
    next.evidence_required.push('test:runtime', 'turbo-lint-test', 'local-harness-when-runtime-changes');
    return next;
  }

  if (status.stage === '04-mobile-app') {
    const missing = [];
    if (!hasEvidence(status, ['design-handoff'], [/\/01-design\//])) missing.push('missing-design-handoff');
    if (!hasEvidence(status, ['architecture-note'], [/\/02-architecture\//])) missing.push('missing-architecture-note');
    if (!hasEvidence(status, ['api-contract'], [/\/03-contract-api\//])) missing.push('missing-api-contract');
    if (missing.length) {
      next.blocked_reasons.push(...missing);
      next.evidence_required.push('design-handoff', 'architecture-note', 'api-contract');
      return next;
    }
  }

  if (status.stage === '05-qa-release') {
    const requiredLevel = status.evidence_ladder?.required_level;
    const requiredNativeKinds = nativeEvidenceKindsForLevel(requiredLevel);
    if (requiredNativeKinds.length > 0 && !hasEvidence(status, requiredNativeKinds)) {
      next.blocked_reasons.push(`missing-evidence-level-${requiredLevel}`);
      next.evidence_required.push('native-evidence');
      return next;
    }
  }

  next.allowed_actions.push('continue-current-stage');
  if (status.stage === '02-architecture') {
    next.allowed_actions.push('coordinate-parallel-contract-api');
  }
  next.evidence_required.push('stage-evidence');
  return next;
}

function canWriteTransition(next) {
  return next.blocked_reasons.length === 0;
}

export function applyTransition(statusFile, transition, options = {}) {
  if (!statusStates.has(transition)) {
    throw new Error(`transition must be one of: ${Array.from(statusStates).join(', ')}`);
  }

  const loaded = loadWorkUnit(statusFile);
  const next = resolveNextAction(loaded.status, { role: options.role });
  if (!canWriteTransition(next)) {
    throw new Error(`cannot apply transition while resolver is blocked: ${next.blocked_reasons.join(', ')}`);
  }

  const updated = {
    ...loaded.status,
    state: transition,
    events: [
      ...loaded.status.events,
      {
        seq: loaded.status.events.length + 1,
        at: options.at || new Date().toISOString(),
        actor: options.actor || loaded.status.owner_role,
        action: `transition:${loaded.status.state}->${transition}`,
      },
    ],
  };

  const validationErrors = validateWorkUnitStatus(updated, {
    source: relative(statusFile),
    expectedWorkUnitId: path.basename(loaded.workUnitDir),
    humanGateDecisionsByPath: loaded.decisionsByPath,
  });
  if (validationErrors.length) {
    throw new Error(validationErrors.map((error) => `- ${error}`).join('\n'));
  }

  writeJson(statusFile, updated);
  return resolveNextAction(updated, { role: options.role });
}

function resolverFixtureDirs() {
  const baseDir = path.join(root, 'evals/work-units/fixtures/valid');
  return fs.readdirSync(baseDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && entry.name.startsWith('resolver-'))
    .map((entry) => path.join(baseDir, entry.name))
    .filter((dir) => fs.existsSync(path.join(dir, 'status.json')) && fs.existsSync(path.join(dir, 'expected-next.json')))
    .sort();
}

function assertDeepEqual(actual, expected, label, errors) {
  const actualJson = JSON.stringify(actual, null, 2);
  const expectedJson = JSON.stringify(expected, null, 2);
  if (actualJson !== expectedJson) {
    errors.push(`${label}: expected ${expectedJson}, got ${actualJson}`);
  }
}

function runSelfTest() {
  const errors = [];
  const dirs = resolverFixtureDirs();
  if (dirs.length < 12) {
    errors.push('self-test must include resolver fixtures for review, gate, human gate, role, QA, Gatekeeper, and transition paths');
  }

  for (const dir of dirs) {
    const loaded = loadWorkUnit(path.join(dir, 'status.json'));
    const actual = resolveNextAction(loaded.status);
    const expected = readJson(path.join(dir, 'expected-next.json'));
    assertDeepEqual(actual, expected, relative(dir), errors);
  }

  const roleFixture = loadWorkUnit(path.join(root, 'evals/work-units/fixtures/valid/resolver-role-filter/status.json'));
  const roleMismatch = resolveNextAction(roleFixture.status, { role: 'QA/Release' });
  if (!roleMismatch.blocked_reasons.includes('role-mismatch') || roleMismatch.allowed_actions.length !== 0) {
    errors.push('resolver-role-filter: role mismatch must block execution');
  }

  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'wm-next-action-'));
  try {
    const sourceDir = path.join(root, 'evals/work-units/fixtures/valid/resolver-apply-transition');
    const tempDir = path.join(tempRoot, 'resolver-apply-transition');
    fs.cpSync(sourceDir, tempDir, { recursive: true });
    const tempStatus = path.join(tempDir, 'status.json');
    const before = fs.readFileSync(tempStatus, 'utf8');
    try {
      applyTransition(tempStatus, 'invalid-state', { at: '2026-06-11T00:30:00.000Z' });
      errors.push('resolver-apply-transition: invalid transition unexpectedly passed');
    } catch {
      const after = fs.readFileSync(tempStatus, 'utf8');
      if (after !== before) {
        errors.push('resolver-apply-transition: invalid transition changed status.json');
      }
    }

    applyTransition(tempStatus, 'review-needed', {
      at: '2026-06-11T00:30:00.000Z',
      actor: 'Mobile App Dev',
    });
    const updated = readJson(tempStatus);
    if (updated.state !== 'review-needed') {
      errors.push('resolver-apply-transition: valid transition did not update state');
    }
    if (updated.events.length !== 2 || updated.events[1].seq !== 2) {
      errors.push('resolver-apply-transition: valid transition must append exactly one event');
    }
    const validationErrors = validateWorkUnitStatus(updated, {
      source: relative(tempStatus),
      expectedWorkUnitId: path.basename(tempDir),
    });
    errors.push(...validationErrors);
  } finally {
    fs.rmSync(tempRoot, { recursive: true, force: true });
  }

  if (errors.length) {
    throw new Error(errors.map((error) => `- ${error}`).join('\n'));
  }
}

function parseArgs(argv) {
  const options = {};
  const positional = [];
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === '--self-test') {
      options.selfTest = true;
    } else if (arg === '--role') {
      options.role = argv[++index];
    } else if (arg === '--apply-transition') {
      options.applyTransition = argv[++index];
    } else if (arg === '--actor') {
      options.actor = argv[++index];
    } else if (arg === '--at') {
      options.at = argv[++index];
    } else if (arg.startsWith('-')) {
      throw new Error(`unknown option: ${arg}`);
    } else {
      positional.push(arg);
    }
  }
  options.input = positional[0];
  return options;
}

function main() {
  const options = parseArgs(process.argv.slice(2));
  if (options.selfTest) {
    runSelfTest();
    console.log('Validated work-unit next-action resolver fixtures.');
    return;
  }

  const statusFile = resolveStatusFile(options.input);
  const output = options.applyTransition
    ? applyTransition(statusFile, options.applyTransition, options)
    : resolveNextAction(loadWorkUnit(statusFile).status, options);

  console.log(JSON.stringify(output, null, 2));
  if (output.blocked_reasons.includes('role-mismatch')) {
    process.exitCode = 2;
  }
}

try {
  main();
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
