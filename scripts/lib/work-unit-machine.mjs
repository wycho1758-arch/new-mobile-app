const schema = 'wu-status/v1';
const humanGateDecisionSchemaValue = 'human-gate/v1';

const stageOwners = new Map([
  ['00-product-planning', 'Product/Planning'],
  ['01-design', 'Design'],
  ['02-architecture', 'Mobile Architect'],
  ['03-contract-api', 'Backend/API Integrator'],
  ['04-mobile-app', 'Mobile App Dev'],
  ['05-qa-release', 'QA/Release'],
  ['06-gatekeeper', 'Release Gatekeeper (System)'],
  ['07-pr', 'Product/Planning'],
]);

const states = new Set([
  'planned',
  'in-progress',
  'blocked-human',
  'blocked-gate',
  'review-needed',
  'done',
  'not-applicable',
  'deferred',
]);

const reviewerStatuses = new Set(['pending', 'passed', 'failed', 'not-applicable']);
const humanGateStates = new Set(['pending', 'approved', 'rejected', 'deferred']);
const humanGateDecisions = new Set(['approved', 'rejected', 'deferred']);

const humanGateCategories = new Set([
  'production-submit',
  'payment-money-movement',
  'pii-privacy',
  'external-messaging',
  'legal-compliance',
  'business-budget-owner',
  'irreversible-scope-tradeoff',
  'failed-gate-risk',
]);

const verdictReviewers = new Set([
  'wm-implementation-reviewer',
  'wm-contract-reviewer',
  'po-planning-reviewer',
  'po-scope-gate-reviewer',
  'design-reviewer',
]);

const roles = new Set([
  ...stageOwners.values(),
  'Backend/API',
]);

const agentNames = new Set([
  'design-researcher',
  'design-reviewer',
  'mobile-contract-reviewer',
  'mobile-docs-researcher',
  'mobile-gate-fix-advisor',
  'mobile-implementation-reviewer',
  'po-docs-researcher',
  'po-planning-reviewer',
  'po-scope-gate-reviewer',
  'wm-contract-reviewer',
  'wm-docs-researcher',
  'wm-gate-fix-advisor',
  'wm-implementation-reviewer',
]);

const ignoredEvidenceMatchers = [
  /^\.evidence\/local(?:\/|$)/,
  /^\.evidence\/tmp(?:\/|$)/,
  /^\.evidence\/.*\.log$/,
  /^\.evidence\/.*\/raw(?:\/|$)/,
];

const evidenceLevelAliases = new Map([
  ['L0', 'L0'],
  ['jest', 'L0'],
  ['L1', 'L1'],
  ['rn-web', 'L1'],
  ['L2', 'L2'],
  ['eas-maestro', 'L2'],
  ['L3', 'L3'],
  ['human-device', 'L3'],
]);

const evidenceLevelRank = new Map([
  ['L0', 0],
  ['L1', 1],
  ['L2', 2],
  ['L3', 3],
]);

const evidenceKindLevels = new Map([
  ['jest-evidence', 'L0'],
  ['test-evidence', 'L0'],
  ['rn-web-evidence', 'L1'],
  ['playwright-evidence', 'L1'],
  ['eas-evidence', 'L2'],
  ['eas-maestro-evidence', 'L2'],
  ['native-evidence', 'L2'],
  ['mobile-mcp-evidence', 'L3'],
  ['human-device-evidence', 'L3'],
  ['device-evidence', 'L3'],
]);

function isPlainObject(value) {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function normalizeIdentity(value) {
  return String(value || '').toLowerCase().replace(/[^a-z0-9]+/g, '');
}

function fail(errors, source, message) {
  errors.push(`${source}: ${message}`);
}

function validateString(errors, source, label, value) {
  if (typeof value !== 'string' || value.trim() === '') {
    fail(errors, source, `${label} must be a non-empty string`);
    return false;
  }
  return true;
}

function validateEvidencePath(errors, source, evidencePath, label) {
  if (!validateString(errors, source, label, evidencePath)) return;
  if (pathHasBacktracking(evidencePath)) {
    fail(errors, source, `${label} must not contain path traversal`);
  }
  for (const matcher of ignoredEvidenceMatchers) {
    if (matcher.test(evidencePath)) {
      fail(errors, source, `${label} must not point at ignored local evidence path: ${evidencePath}`);
      return;
    }
  }
}

function isUrl(value) {
  return /^https:\/\//.test(value);
}

function validateDurableLink(errors, source, value, label) {
  if (!validateString(errors, source, label, value)) return;
  if (isUrl(value)) return;
  validateEvidencePath(errors, source, value, label);
}

function pathHasBacktracking(value) {
  return value.split('/').some((segment) => segment === '..');
}

function validateReviewer(errors, source, status) {
  if (!isPlainObject(status.reviewer)) {
    fail(errors, source, 'reviewer must be an object with the repo reviewer envelope fields');
    return;
  }

  const { reviewer } = status;
  if (typeof reviewer.required !== 'boolean') {
    fail(errors, source, 'reviewer.required must be boolean');
  }
  if (!reviewerStatuses.has(reviewer.status)) {
    fail(errors, source, `reviewer.status must be one of: ${Array.from(reviewerStatuses).join(', ')}`);
  }

  if (status.stage === '06-gatekeeper') {
    if (reviewer.required !== false || reviewer.status !== 'not-applicable') {
      fail(errors, source, 'Release Gatekeeper status must not require an LLM/custom-agent reviewer');
    }
    if (reviewer.agent !== null) {
      fail(errors, source, 'Release Gatekeeper status reviewer.agent must be null');
    }
    return;
  }

  if (reviewer.required === true) {
    if (!validateString(errors, source, 'reviewer.agent', reviewer.agent)) return;
    if (!verdictReviewers.has(reviewer.agent)) {
      fail(errors, source, `reviewer.agent must be a verdict-producing read-only reviewer: ${reviewer.agent}`);
    }
    if (normalizeIdentity(reviewer.agent) === normalizeIdentity(status.owner_role)) {
      fail(errors, source, 'owner_role must not self-approve as reviewer.agent');
    }
    if (roles.has(reviewer.agent)) {
      fail(errors, source, 'reviewer.agent must be an agent name, not an owning role');
    }
  } else if (reviewer.required === false && reviewer.agent !== null) {
    fail(errors, source, 'reviewer.agent must be null when reviewer.required is false');
  }

  if (reviewer.evidence !== null) {
    validateEvidencePath(errors, source, reviewer.evidence, 'reviewer.evidence');
  }
}

function validateEvidence(errors, source, status) {
  if (!Array.isArray(status.evidence)) {
    fail(errors, source, 'evidence must be an array');
    return;
  }

  for (const [index, item] of status.evidence.entries()) {
    if (!isPlainObject(item)) {
      fail(errors, source, `evidence[${index}] must be an object`);
      continue;
    }
    validateEvidencePath(errors, source, item.path, `evidence[${index}].path`);
    validateString(errors, source, `evidence[${index}].kind`, item.kind);
  }
}

// Managed-doc guidance P-1 (mobile-app-dev-team/19-entry-case-routing.md): marking the
// 01-design stage not-applicable requires durable non-goal justification evidence. The
// semantic relevance judgment stays process-owned; this only enforces that a not-applicable
// Design stage carries a durable non-goal evidence reference (the existing `non-goal` kind).
function validateDesignNotApplicableNonGoal(errors, source, status) {
  if (status.stage !== '01-design' || status.state !== 'not-applicable') return;
  const hasNonGoalEvidence = Array.isArray(status.evidence)
    && status.evidence.some((item) => isPlainObject(item) && item.kind === 'non-goal');
  if (!hasNonGoalEvidence) {
    fail(errors, source, "01-design in not-applicable state must carry durable 'non-goal' evidence (mobile-app-dev-team/19-entry-case-routing.md P-1)");
  }
}

function normalizeEvidenceLevel(value) {
  if (typeof value !== 'string') return null;
  return evidenceLevelAliases.get(value) || null;
}

function validateEvidenceLevel(errors, source, value, label) {
  const normalized = normalizeEvidenceLevel(value);
  if (!normalized) {
    fail(errors, source, `${label} must be one of: ${Array.from(evidenceLevelAliases.keys()).join(', ')}`);
    return null;
  }
  return normalized;
}

function evidenceSupportsLevel(item, requiredLevel) {
  if (!isPlainObject(item)) return false;
  const itemLevel = evidenceKindLevels.get(item.kind);
  if (!itemLevel) return false;
  return evidenceLevelRank.get(itemLevel) >= evidenceLevelRank.get(requiredLevel);
}

function hasEvidenceForLevel(status, level) {
  if (level === 'L0') return true;
  if (!Array.isArray(status.evidence)) return false;
  return status.evidence.some((item) => evidenceSupportsLevel(item, level));
}

function hasApprovedFailedGateRisk(status, options) {
  if (!Array.isArray(status.human_gates)) return false;
  return status.human_gates.some((gate) => {
    if (!isPlainObject(gate)) return false;
    if (gate.category !== 'failed-gate-risk' || gate.state !== 'approved') return false;
    const decision = options.humanGateDecisionsByPath?.get(gate.decision_path);
    if (!decision) return false;
    return decision.category === 'failed-gate-risk' && decision.decision === 'approved';
  });
}

function validateEvidenceLadder(errors, source, status, options) {
  if (status.evidence_ladder === undefined) return;
  if (!isPlainObject(status.evidence_ladder)) {
    fail(errors, source, 'evidence_ladder must be an object when present');
    return;
  }

  const required = status.evidence_ladder.required_level === undefined
    ? null
    : validateEvidenceLevel(errors, source, status.evidence_ladder.required_level, 'evidence_ladder.required_level');
  const achieved = status.evidence_ladder.achieved_level === undefined
    ? null
    : validateEvidenceLevel(errors, source, status.evidence_ladder.achieved_level, 'evidence_ladder.achieved_level');

  if (status.stage !== '05-qa-release' || status.state !== 'done') return;

  if (!required) {
    fail(errors, source, '05-qa-release done requires evidence_ladder.required_level');
    return;
  }
  if (!achieved) {
    fail(errors, source, '05-qa-release done requires evidence_ladder.achieved_level');
    return;
  }

  if (!hasEvidenceForLevel(status, achieved)) {
    fail(errors, source, `evidence_ladder.achieved_level ${status.evidence_ladder.achieved_level} must be backed by matching evidence kind`);
  }

  if (evidenceLevelRank.get(achieved) < evidenceLevelRank.get(required) && !hasApprovedFailedGateRisk(status, options)) {
    fail(errors, source, '05-qa-release done requires achieved evidence level to meet required_level or an approved failed-gate-risk human gate');
  }
}

function validateHumanGateReference(errors, source, gate, index, decisionsByPath) {
  const prefix = `human_gates[${index}]`;
  if (!isPlainObject(gate)) {
    fail(errors, source, `${prefix} must be an object`);
    return;
  }

  validateString(errors, source, `${prefix}.gate_id`, gate.gate_id);
  if (!humanGateCategories.has(gate.category)) {
    fail(errors, source, `${prefix}.category must be one of: ${Array.from(humanGateCategories).join(', ')}`);
  }
  if (!stageOwners.has(gate.blocking_stage)) {
    fail(errors, source, `${prefix}.blocking_stage must be one of: ${Array.from(stageOwners.keys()).join(', ')}`);
  }
  if (!humanGateStates.has(gate.state)) {
    fail(errors, source, `${prefix}.state must be one of: ${Array.from(humanGateStates).join(', ')}`);
  }

  if (gate.state === 'pending') {
    if (gate.decision_path !== undefined && typeof gate.decision_path === 'string') {
      if (pathHasBacktracking(gate.decision_path)) {
        fail(errors, source, `${prefix}.decision_path must not contain path traversal`);
      }
    }
    return;
  }

  if (!validateString(errors, source, `${prefix}.decision_path`, gate.decision_path)) return;
  if (pathHasBacktracking(gate.decision_path)) {
    fail(errors, source, `${prefix}.decision_path must not contain path traversal`);
    return;
  }

  if (!decisionsByPath) return;
  const decision = decisionsByPath.get(gate.decision_path);
  if (!decision) {
    fail(errors, source, `${prefix}.decision_path must point to an existing human-gate/v1 decision file: ${gate.decision_path}`);
    return;
  }
  if (decision.gate_id !== gate.gate_id) {
    fail(errors, source, `${prefix}.decision_path gate_id must match ${gate.gate_id}`);
  }
  if (decision.category !== gate.category) {
    fail(errors, source, `${prefix}.decision_path category must match ${gate.category}`);
  }
  if (decision.decision !== gate.state) {
    fail(errors, source, `${prefix}.decision_path decision must match state ${gate.state}`);
  }
}

function validateHumanGateReferences(errors, source, status, options) {
  if (!Array.isArray(status.human_gates)) {
    fail(errors, source, 'human_gates must be an array');
    return;
  }

  for (const [index, gate] of status.human_gates.entries()) {
    validateHumanGateReference(errors, source, gate, index, options.humanGateDecisionsByPath);
  }

  if (status.state === 'blocked-human' && status.human_gates.length === 0) {
    fail(errors, source, 'blocked-human status must include at least one human gate');
  }

  if (status.state === 'in-progress' && status.human_gates.length > 0) {
    for (const [index, gate] of status.human_gates.entries()) {
      if (isPlainObject(gate) && gate.state !== 'approved') {
        fail(errors, source, `human_gates[${index}] must be approved before blocked-human work resumes in-progress`);
      }
    }
  }
}

function validateHandoff(errors, source, status) {
  if (!isPlainObject(status.handoff)) {
    fail(errors, source, 'handoff must be an object');
    return;
  }
  validateString(errors, source, 'handoff.next_role', status.handoff.next_role);
  validateString(errors, source, 'handoff.next_artifact', status.handoff.next_artifact);
  if (typeof status.handoff.next_artifact === 'string' && pathHasBacktracking(status.handoff.next_artifact)) {
    fail(errors, source, 'handoff.next_artifact must not contain path traversal');
  }
}

function validateEvents(errors, source, status) {
  if (!Array.isArray(status.events) || status.events.length === 0) {
    fail(errors, source, 'events must be a non-empty append-only array');
    return;
  }

  for (const [index, event] of status.events.entries()) {
    if (!isPlainObject(event)) {
      fail(errors, source, `events[${index}] must be an object`);
      continue;
    }
    const expectedSeq = index + 1;
    if (event.seq !== expectedSeq) {
      fail(errors, source, `events[${index}].seq must be ${expectedSeq}`);
    }
    validateString(errors, source, `events[${index}].actor`, event.actor);
    validateString(errors, source, `events[${index}].action`, event.action);
    if (!validateString(errors, source, `events[${index}].at`, event.at)) continue;
    if (Number.isNaN(Date.parse(event.at))) {
      fail(errors, source, `events[${index}].at must be an ISO-8601 timestamp`);
    }
    if (index > 0 && Date.parse(event.at) < Date.parse(status.events[index - 1].at)) {
      fail(errors, source, `events[${index}].at must not go backwards`);
    }
  }
}

export function validateWorkUnitStatus(status, options = {}) {
  const source = options.source || '<status>';
  const errors = [];

  if (!isPlainObject(status)) {
    fail(errors, source, 'status must be a JSON object');
    return errors;
  }

  if (status.schema !== schema) {
    fail(errors, source, `schema must be ${schema}`);
  }

  validateString(errors, source, 'work_unit_id', status.work_unit_id);
  if (options.expectedWorkUnitId && status.work_unit_id !== options.expectedWorkUnitId) {
    fail(errors, source, `work_unit_id must match containing folder: ${options.expectedWorkUnitId}`);
  }

  if (!stageOwners.has(status.stage)) {
    fail(errors, source, `stage must be one of: ${Array.from(stageOwners.keys()).join(', ')}`);
  }
  if (!states.has(status.state)) {
    fail(errors, source, `state must be one of: ${Array.from(states).join(', ')}`);
  }

  if (!validateString(errors, source, 'owner_role', status.owner_role)) {
    return errors;
  }
  const expectedOwner = stageOwners.get(status.stage);
  if (expectedOwner && status.owner_role !== expectedOwner) {
    fail(errors, source, `owner_role for ${status.stage} must be ${expectedOwner}`);
  }

  if (!Number.isInteger(status.attempt) || status.attempt < 1) {
    fail(errors, source, 'attempt must be an integer greater than or equal to 1');
  }

  validateHumanGateReferences(errors, source, status, options);

  validateReviewer(errors, source, status);
  validateEvidence(errors, source, status);
  validateEvidenceLadder(errors, source, status, options);
  validateDesignNotApplicableNonGoal(errors, source, status);
  validateHandoff(errors, source, status);
  validateEvents(errors, source, status);

  return errors;
}

export const workUnitStatusSchema = schema;
export const humanGateDecisionSchema = humanGateDecisionSchemaValue;

export function validateHumanGateDecision(decision, options = {}) {
  const source = options.source || '<human-gate>';
  const errors = [];

  if (!isPlainObject(decision)) {
    fail(errors, source, 'human gate decision must be a JSON object');
    return errors;
  }

  if (decision.schema !== humanGateDecisionSchemaValue) {
    fail(errors, source, `schema must be ${humanGateDecisionSchemaValue}`);
  }

  validateString(errors, source, 'gate_id', decision.gate_id);
  if (options.expectedGateId && decision.gate_id !== options.expectedGateId) {
    fail(errors, source, `gate_id must match containing filename: ${options.expectedGateId}`);
  }

  if (!humanGateCategories.has(decision.category)) {
    fail(errors, source, `category must be one of: ${Array.from(humanGateCategories).join(', ')}`);
  }
  if (!humanGateDecisions.has(decision.decision)) {
    fail(errors, source, `decision must be one of: ${Array.from(humanGateDecisions).join(', ')}`);
  }

  validateString(errors, source, 'scope', decision.scope);

  if (!isPlainObject(decision.decided_by)) {
    fail(errors, source, 'decided_by must be an object');
  } else {
    validateString(errors, source, 'decided_by.name', decision.decided_by.name);
    validateString(errors, source, 'decided_by.contact', decision.decided_by.contact);
    validateString(errors, source, 'decided_by.channel', decision.decided_by.channel);
    const approver = normalizeIdentity(decision.decided_by.name);
    const forbidden = new Set([
      ...Array.from(roles, normalizeIdentity),
      ...Array.from(agentNames, normalizeIdentity),
      normalizeIdentity('Release Gatekeeper'),
      normalizeIdentity('Release Gatekeeper (System)'),
      normalizeIdentity('Gatekeeper'),
      normalizeIdentity('LLM'),
      normalizeIdentity('pod'),
    ]);
    if (forbidden.has(approver)) {
      fail(errors, source, 'decided_by.name must be a human approver, not a role, reviewer, agent, Gatekeeper, LLM, or pod identity');
    }
  }

  if (!validateString(errors, source, 'decision_reference', decision.decision_reference)) {
    // handled by validateString
  } else if (!/^https:\/\/github\.com\/[^/]+\/[^/]+\/(?:pull|issues)\/\d+#(?:issuecomment|pullrequestreview)-\d+$/.test(decision.decision_reference)) {
    fail(errors, source, 'decision_reference must be a GitHub issue comment or pull request review URL');
  }

  if (!validateString(errors, source, 'decided_at', decision.decided_at)) {
    // handled by validateString
  } else if (Number.isNaN(Date.parse(decision.decided_at))) {
    fail(errors, source, 'decided_at must be an ISO-8601 timestamp');
  }

  if (!Array.isArray(decision.residual_risk)) {
    fail(errors, source, 'residual_risk must be an array');
  }

  if (!Array.isArray(decision.evidence_links)) {
    fail(errors, source, 'evidence_links must be an array');
  } else {
    for (const [index, link] of decision.evidence_links.entries()) {
      validateDurableLink(errors, source, link, `evidence_links[${index}]`);
    }
  }

  if (decision.category === 'failed-gate-risk') {
    validateDurableLink(errors, source, decision.failed_check_reference, 'failed_check_reference');
  }

  // Human-authorized P-4 binding (mobile-app-dev-team/20-app-eas-ota-rollback-runbook.md;
  // mobile-app-dev-team/15-human-ops-live-readiness-annex.md Approval Envelope): a
  // production-submit human-gate decision is a live mutation and must record a rollback owner
  // and a rollback plan. Scoped to production-submit only (per xhigh decision); other
  // categories keep their existing requirements.
  if (decision.category === 'production-submit') {
    validateString(errors, source, 'rollback_owner', decision.rollback_owner);
    validateString(errors, source, 'rollback_plan', decision.rollback_plan);
  }

  return errors;
}
