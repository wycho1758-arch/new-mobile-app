#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const PRODUCT_ROOT = 'evals/local-harness/product-planning';
const ROLE_ROOT = 'evals/local-harness/roles';
const CODEX_SMOKE_ROOT = 'evals/local-harness/codex-smoke';
const GATEKEEPER_ROOT = 'evals/local-harness/gatekeeper';
const SNAPSHOT_PATH = 'evals/local-harness/sot/snapshot.json';
const PREFLIGHT_PATH = 'evals/local-harness/results/preflight.json';
const RESULTS_DIR = 'evals/local-harness/results';
const ROLE_FIXTURE_FILES = [
  'product-planning.context.json',
  'design.context.json',
  'mobile-architect.context.json',
  'mobile-app-dev.context.json',
  'backend-api-integrator.context.json',
  'qa-release.context.json',
];
const SMOKE_PROMPTS = [
  {
    role: 'mobile-app-dev',
    promptPath: 'evals/local-harness/codex-smoke/mobile-app-dev.prompt.md',
    resultPath: 'evals/local-harness/results/codex-smoke-mobile-app-dev.md',
    expectedSkill: '.agents/skills/mobile-app-dev-workflow/SKILL.md',
  },
  {
    role: 'backend-api-integrator',
    promptPath: 'evals/local-harness/codex-smoke/backend-api-integrator.prompt.md',
    resultPath: 'evals/local-harness/results/codex-smoke-backend-api-integrator.md',
    expectedSkill: '.agents/skills/mobile-backend-api-integrator-workflow/SKILL.md',
  },
];

function parseArgs(argv) {
  const stageIndex = argv.indexOf('--stage');
  return {
    stage: stageIndex >= 0 ? argv[stageIndex + 1] : 'all',
    selfTest: argv.includes('--self-test'),
    json: argv.includes('--json'),
  };
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function readText(filePath) {
  return fs.readFileSync(filePath, 'utf8');
}

function exists(filePath) {
  return fs.existsSync(filePath);
}

function addFailure(failures, reason, detail = {}) {
  failures.push({ reason, ...detail });
}

function validateProductPlanningFixtures(options = {}) {
  const root = options.root || PRODUCT_ROOT;
  const caseA = options.caseA || readJson(path.join(root, 'expected.case-a-owner-matrix.json'));
  const caseB = options.caseB || readJson(path.join(root, 'expected.case-b-task-breakdown.json'));
  const prdA = options.prdA || (exists(path.join(root, 'prd.case-a-bootstrap.fixture.md')) ? readText(path.join(root, 'prd.case-a-bootstrap.fixture.md')) : '');
  const prdB = options.prdB || (exists(path.join(root, 'prd.case-b.fixture.md')) ? readText(path.join(root, 'prd.case-b.fixture.md')) : '');
  const failures = [];

  for (const fileName of ['prd.case-a-bootstrap.fixture.md', 'prd.case-b.fixture.md', 'expected.case-a-owner-matrix.json', 'expected.case-b-task-breakdown.json']) {
    if (!options.caseA && !options.caseB && !exists(path.join(root, fileName))) addFailure(failures, 'missing fixture file', { fileName });
  }

  if (!caseA.steps?.length) addFailure(failures, 'missing Case A owner matrix');
  for (const [index, step] of (caseA.steps || []).entries()) {
    for (const field of ['step', 'owner', 'humanGate', 'sotMapping', 'evidence']) {
      if (step[field] === undefined || step[field] === '') addFailure(failures, 'missing Case A step field', { index, field });
    }
    if (!['agent', 'human'].includes(step.owner?.type)) addFailure(failures, 'invalid Case A owner type', { index });
    if (!step.owner?.role) addFailure(failures, 'missing Case A owner role', { index });
  }
  if (!caseA.steps?.some((step) => step.owner?.type === 'human' && /repo creation/i.test(step.step))) {
    addFailure(failures, 'Case A repo creation must be human-owned');
  }
  if (!caseA.steps?.some((step) => step.owner?.type === 'human' && /secret/i.test(step.step))) {
    addFailure(failures, 'Case A secret injection must be human-owned');
  }
  if (!caseA.steps?.some((step) => step.owner?.type === 'human' && /required check/i.test(step.step))) {
    addFailure(failures, 'Case A required check registration must be human-owned');
  }
  if (caseA.forbidden?.implementsCode !== false) addFailure(failures, 'Product/Planning fixture must not implement code');
  if (caseA.forbidden?.modifiesExternalRuntime !== false) addFailure(failures, 'Product/Planning fixture must not modify external runtime repositories');
  if (caseA.forbidden?.modelsGatekeeperAsLlm !== false) addFailure(failures, 'Gatekeeper must not be modeled as LLM');

  for (const [index, task] of (caseB.tasks || []).entries()) {
    for (const field of ['ownerRole', 'inputArtifact', 'outputArtifact', 'evidencePath', 'humanGate', 'nextRole']) {
      if (task[field] === undefined || task[field] === '') addFailure(failures, 'missing Case B task field', { index, field });
    }
  }
  if (!caseB.tasks?.some((task) => task.ownerRole === 'QA/Release')) addFailure(failures, 'missing QA/Release task');
  if (!caseB.tasks?.some((task) => task.apiNeeded === true || /API-needed/i.test(task.inputArtifact || ''))) {
    addFailure(failures, 'missing API-needed marker');
  }
  const categories = new Set(caseB.requiredHumanGateCategories || []);
  for (const category of [
    'production submit',
    'payment or money movement',
    'PII or privacy-sensitive behavior',
    'external messaging or email/SMS push',
    'legal/terms/contracts',
    'accepting risk after a gate failure',
  ]) {
    if (!categories.has(category)) addFailure(failures, 'missing human gate category', { category });
  }
  if (caseB.forbidden?.implementsCode !== false) addFailure(failures, 'Case B fixture must not implement code');
  if (caseB.forbidden?.modifiesExternalRuntime !== false) addFailure(failures, 'Case B fixture must not modify external runtime repositories');

  const combinedPrd = `${prdA}\n${prdB}`;
  if (!/Do not implement|Do not modify external platform\/runtime repositories/i.test(combinedPrd)) {
    addFailure(failures, 'PRD fixtures must state implementation/external runtime boundaries');
  }

  return {
    stage: 'product-planning',
    ok: failures.length === 0,
    failures,
    summary: {
      caseASteps: caseA.steps?.length || 0,
      caseBTasks: caseB.tasks?.length || 0,
    },
  };
}

function listFilesRecursive(dir) {
  if (!exists(dir)) return [];
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...listFilesRecursive(fullPath));
    else out.push(fullPath);
  }
  return out;
}

function listGitVisibleFiles() {
  const result = spawnSync('git', ['ls-files', '--cached', '--others', '--exclude-standard'], {
    encoding: 'utf8',
  });
  if (result.status !== 0) {
    throw new Error(`git ls-files failed: ${result.stderr || result.stdout}`);
  }
  return result.stdout.split('\n').filter(Boolean);
}

function isForbiddenGatekeeperSoulPath(filePath) {
  const normalized = filePath.replaceAll(path.sep, '/').toLowerCase();
  const segments = normalized.split('/');
  const baseName = segments.at(-1);
  const parentSegments = segments.slice(0, -1);
  return (baseName === 'soul.md' && parentSegments.some((segment) => segment.includes('gatekeeper')))
    || /gatekeeper[^/]*soul\.md$/i.test(normalized)
    || /soul[^/]*gatekeeper\.md$/i.test(normalized);
}

function validateStructure() {
  const snapshot = readJson(SNAPSHOT_PATH);
  const failures = [];
  const allowedSkills = new Set(snapshot.skillTaxonomy.allowedNativeDevSkills);
  const skillRoot = '.agents/skills';
  const agentRoot = '.codex/agents';

  const agentFiles = listFilesRecursive(agentRoot);
  for (const filePath of agentFiles) {
    const normalized = filePath.replaceAll(path.sep, '/');
    if (/\/cto[^/]*\.toml$/i.test(normalized)) addFailure(failures, 'forbidden CTO agent file', { filePath });
    if (/local-orchestrator/i.test(normalized)) addFailure(failures, 'forbidden local-orchestrator agent file', { filePath });
  }

  const skillDirs = exists(skillRoot)
    ? fs.readdirSync(skillRoot, { withFileTypes: true }).filter((entry) => entry.isDirectory()).map((entry) => entry.name)
    : [];
  for (const skill of skillDirs) {
    if (!allowedSkills.has(skill)) addFailure(failures, 'unexpected native skill slug', { skill });
  }

  if (exists('AGENTS.md')) {
    const agents = readText('AGENTS.md');
    if (/\bCTO\b|local-orchestrator|Gatekeeper SOUL\.md/i.test(agents)) {
      addFailure(failures, 'AGENTS.md registers forbidden runtime role');
    }
  }

  for (const filePath of listGitVisibleFiles()) {
    if (isForbiddenGatekeeperSoulPath(filePath)) {
      addFailure(failures, 'forbidden Gatekeeper SOUL.md file', { filePath });
    }
  }

  return {
    stage: 'structure',
    ok: failures.length === 0,
    failures,
    summary: {
      skillDirs,
      agentFiles: agentFiles.length,
    },
  };
}

function runStructureSelfTest() {
  const failures = [];
  const forbiddenPaths = [
    'evals/local-harness/gatekeeper/SOUL.md',
    'docs/mobile-gatekeeper/SOUL.md',
    'mobile-gatekeeper-soul.md',
    'soul-mobile-gatekeeper.md',
  ];
  const allowedPaths = [
    'evals/local-harness/gatekeeper/evidence.valid.json',
    'evals/local-harness/roles/README.md',
    'docs/mobile-gatekeeper/README.md',
  ];

  for (const filePath of forbiddenPaths) {
    if (!isForbiddenGatekeeperSoulPath(filePath)) addFailure(failures, 'forbidden Gatekeeper SOUL path was allowed', { filePath });
  }
  for (const filePath of allowedPaths) {
    if (isForbiddenGatekeeperSoulPath(filePath)) addFailure(failures, 'allowed non-SOUL path was rejected', { filePath });
  }

  return {
    stage: 'structure-self-test',
    ok: failures.length === 0,
    failures,
  };
}

function loadRoleFixtures(fileNames = ROLE_FIXTURE_FILES) {
  return fileNames.map((fileName) => readJson(path.join(ROLE_ROOT, fileName)));
}

function validateRoles(options = {}) {
  const snapshot = readJson(SNAPSHOT_PATH);
  const fixtures = options.fixtures || loadRoleFixtures();
  const failures = [];
  const drift = [];
  const expectedRoles = new Set(snapshot.roles.llm);
  const validCases = new Set(snapshot.caseRegistry.map((entry) => entry.case));
  const soulRegistry = new Map(snapshot.soulRegistry.map((entry) => [entry.role, entry]));

  if (fixtures.length !== 6) addFailure(failures, 'role count must be exactly 6', { count: fixtures.length });

  for (const fixture of fixtures) {
    if (!expectedRoles.has(fixture.role)) addFailure(failures, 'forbidden role fixture', { role: fixture.role });
    if (/CTO|local-orchestrator|Gatekeeper SOUL\.md/i.test(fixture.role)) {
      addFailure(failures, 'forbidden role fixture', { role: fixture.role });
    }
    if (fixture.type !== 'LLM') addFailure(failures, 'role fixture must be LLM', { role: fixture.role });
    if (!fixture.caseResponsibilities?.length) addFailure(failures, 'missing case responsibility', { role: fixture.role });
    if (!fixture.caseResponsibilities?.some((caseId) => validCases.has(caseId))) {
      addFailure(failures, 'missing valid Case A-H responsibility', { role: fixture.role });
    }

    const registry = soulRegistry.get(fixture.role);
    if (!registry) {
      addFailure(failures, 'missing role SOUL page in snapshot', { role: fixture.role });
    } else {
      if (fixture.soulPageId !== registry.pageId) {
        drift.push({ reason: 'SoT drift: SOUL page ID mismatch', role: fixture.role, expected: registry.pageId, actual: fixture.soulPageId });
      }
      if (fixture.soulPageVersion !== registry.pageVersion) {
        drift.push({ reason: 'SoT drift: SOUL page version mismatch', role: fixture.role, expected: registry.pageVersion, actual: fixture.soulPageVersion });
      }
      const boundaryText = Object.values(fixture.boundaryAssertions || {}).join(' ').toLowerCase();
      for (const keyword of registry.requiredBoundaryKeywords || []) {
        if (!boundaryText.includes(keyword.toLowerCase())) {
          addFailure(failures, 'missing boundary keyword from SOUL registry', { role: fixture.role, keyword });
        }
      }
    }

    for (const field of ['ownerResponsibility', 'forbiddenOwnershipTransfer', 'externalRuntimeModificationBoundary', 'humanGateBoundary']) {
      if (!fixture.boundaryAssertions?.[field]) addFailure(failures, 'missing boundary assertion', { role: fixture.role, field });
    }
    if (fixture.gatekeeperReferenceOnly !== true) addFailure(failures, 'Gatekeeper must be reference-only', { role: fixture.role });
  }

  const roleSet = new Set(fixtures.map((fixture) => fixture.role));
  for (const role of expectedRoles) {
    if (!roleSet.has(role)) addFailure(failures, 'missing expected role fixture', { role });
  }

  const readme = exists(path.join(ROLE_ROOT, 'README.md')) ? readText(path.join(ROLE_ROOT, 'README.md')) : '';
  if (!/Gatekeeper is not a role fixture/i.test(readme) || !/has no SOUL\.md/i.test(readme)) {
    addFailure(failures, 'roles README must explain Gatekeeper boundary');
  }

  return {
    stage: 'roles',
    ok: failures.length === 0 && drift.length === 0,
    failures,
    drift,
    summary: {
      roleCount: fixtures.length,
      roles: fixtures.map((fixture) => fixture.role),
    },
  };
}

function runProductPlanningSelfTest() {
  const valid = validateProductPlanningFixtures();
  const invalidFixture = readJson(path.join(PRODUCT_ROOT, 'selftest.invalid-missing-qa.json'));
  const missingFieldsFixture = readJson(path.join(PRODUCT_ROOT, 'selftest.invalid-missing-fields.json'));
  const invalid = validateProductPlanningFixtures({
    caseA: readJson(path.join(PRODUCT_ROOT, 'expected.case-a-owner-matrix.json')),
    caseB: invalidFixture.caseB,
    prdA: 'Do not implement code. Do not modify external platform/runtime repositories.',
    prdB: 'Do not implement code. Do not modify external platform/runtime repositories.',
  });
  const missingFields = validateProductPlanningFixtures({
    caseA: missingFieldsFixture.caseA,
    caseB: missingFieldsFixture.caseB,
    prdA: 'Do not implement code. Do not modify external platform/runtime repositories.',
    prdB: 'Do not implement code. Do not modify external platform/runtime repositories.',
  });

  const failures = [];
  if (!valid.ok) addFailure(failures, 'valid product-planning fixture failed', { failures: valid.failures });
  if (invalid.ok) addFailure(failures, 'invalid product-planning fixture passed');
  if (!invalid.failures.some((failure) => failure.reason === invalidFixture.expected.reason)) {
    addFailure(failures, 'invalid product-planning fixture failed for wrong reason', { failures: invalid.failures });
  }
  if (missingFields.ok) addFailure(failures, 'missing-fields product-planning fixture passed');
  if (!missingFields.failures.some((failure) => failure.reason === missingFieldsFixture.expected.reason)) {
    addFailure(failures, 'missing-fields product-planning fixture failed for wrong reason', { failures: missingFields.failures });
  }

  return {
    stage: 'product-planning-self-test',
    ok: failures.length === 0,
    failures,
  };
}

function runRolesSelfTest() {
  const valid = validateRoles();
  const missingRoleFixture = readJson(path.join(ROLE_ROOT, 'selftest.invalid-missing-role.json'));
  const missingRole = validateRoles({
    fixtures: loadRoleFixtures(missingRoleFixture.fixtures),
  });
  const ctoFixture = readJson(path.join(ROLE_ROOT, 'selftest.invalid-cto.json'));
  const cto = validateRoles({
    fixtures: [...loadRoleFixtures(), ctoFixture.extraFixture],
  });
  const gatekeeperFixture = readJson(path.join(ROLE_ROOT, 'selftest.invalid-gatekeeper-soul.json'));
  const gatekeeper = validateRoles({
    fixtures: [...loadRoleFixtures(), gatekeeperFixture.extraFixture],
  });
  const invalidCaseFixture = readJson(path.join(ROLE_ROOT, 'selftest.invalid-case.json'));
  const invalidCaseFixtures = loadRoleFixtures().map((fixture) => (
    fixture.role === invalidCaseFixture.mutateRole
      ? { ...fixture, caseResponsibilities: invalidCaseFixture.caseResponsibilities }
      : fixture
  ));
  const invalidCase = validateRoles({ fixtures: invalidCaseFixtures });

  const failures = [];
  if (!valid.ok) addFailure(failures, 'valid roles fixture failed', { failures: valid.failures });
  for (const [name, result, fixture] of [
    ['missing-role', missingRole, missingRoleFixture],
    ['cto', cto, ctoFixture],
    ['gatekeeper-soul', gatekeeper, gatekeeperFixture],
    ['invalid-case', invalidCase, invalidCaseFixture],
  ]) {
    if (result.ok) addFailure(failures, `${name} roles fixture passed`);
    if (!result.failures.some((failure) => failure.reason === fixture.expected.reason)) {
      addFailure(failures, `${name} roles fixture failed for wrong reason`, { failures: result.failures });
    }
  }

  return {
    stage: 'roles-self-test',
    ok: failures.length === 0,
    failures,
  };
}

function extractTrailingJsonBlock(text) {
  const match = text.match(/```json\s*([\s\S]*?)\s*```\s*$/);
  if (!match) return { ok: false, reason: 'missing-json-block' };
  try {
    return { ok: true, value: JSON.parse(match[1]) };
  } catch (error) {
    return { ok: false, reason: 'malformed-json', detail: error.message };
  }
}

function validateSmokeSchema(value, expected) {
  const failures = [];
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    addFailure(failures, 'smoke JSON must be object');
    return failures;
  }
  for (const field of ['role', 'used_skill', 'done_claimed', 'evidence_paths', 'owns_mobile_ui', 'owns_backend_api', 'requires_handoff', 'forbidden_boundary_crossed']) {
    if (value[field] === undefined) addFailure(failures, 'missing smoke field', { field });
  }
  if (value.role !== expected.role) addFailure(failures, 'smoke role mismatch');
  if (typeof value.used_skill !== 'string') addFailure(failures, 'invalid smoke used_skill');
  if (value.used_skill !== expected.expectedSkill) addFailure(failures, 'smoke used_skill mismatch');
  for (const field of ['done_claimed', 'owns_mobile_ui', 'owns_backend_api', 'requires_handoff', 'forbidden_boundary_crossed']) {
    if (typeof value[field] !== 'boolean') addFailure(failures, 'invalid smoke boolean field', { field });
  }
  if (!Array.isArray(value.evidence_paths)) addFailure(failures, 'invalid smoke evidence_paths');
  return failures;
}

function classifySmoke(expected, markdown) {
  const parsed = extractTrailingJsonBlock(markdown);
  if (!parsed.ok) return { status: 'warn-advisory', role: expected.role, warnings: [parsed.reason], parsed: null };
  const schemaFailures = validateSmokeSchema(parsed.value, expected);
  const warnings = schemaFailures.map((failure) => failure.reason);
  if (expected.role === 'mobile-app-dev' && parsed.value?.owns_backend_api === true) warnings.push('mobile-app-dev owns_backend_api advisory');
  if (expected.role === 'backend-api-integrator' && parsed.value?.owns_mobile_ui === true) warnings.push('backend-api-integrator owns_mobile_ui advisory');
  if (parsed.value?.done_claimed === true && Array.isArray(parsed.value.evidence_paths) && parsed.value.evidence_paths.length === 0) {
    warnings.push('done_claimed without evidence_paths');
  }
  if (parsed.value?.forbidden_boundary_crossed === true) warnings.push('forbidden boundary crossed');
  return {
    status: warnings.length ? 'warn-advisory' : 'passed-advisory',
    role: expected.role,
    warnings,
    parsed: parsed.value,
  };
}

function runCodexSmokeCommand(codexPath, prompt, lastMessagePath) {
  return spawnSync(codexPath, ['exec', '--sandbox', 'read-only', '--output-last-message', lastMessagePath, prompt], {
    encoding: 'utf8',
    timeout: 120000,
  });
}

function runCodexSmoke() {
  const preflight = exists(PREFLIGHT_PATH) ? readJson(PREFLIGHT_PATH) : { status: 'skipped' };
  const observations = [];

  if (preflight.status !== 'available') {
    const result = {
      stage: 'codex-smoke',
      ok: true,
      classification: 'best-effort/advisory',
      codexAvailable: false,
      observations,
      failures: [],
    };
    writeResult('codex-smoke', result);
    return result;
  }

  for (const smoke of SMOKE_PROMPTS) {
    const prompt = readText(smoke.promptPath);
    let finalOutput = '';
    let classification = { status: 'warn-advisory', role: smoke.role, warnings: ['not-run'], parsed: null };
    let attempts = 0;

    while (attempts < 3) {
      attempts += 1;
      const run = runCodexSmokeCommand(preflight.acceptedPath, prompt, smoke.resultPath);
      finalOutput = exists(smoke.resultPath)
        ? readText(smoke.resultPath)
        : `${run.stdout || ''}${run.stderr ? `\nSTDERR:\n${run.stderr}` : ''}`;
      classification = run.status === 0
        ? classifySmoke(smoke, finalOutput)
        : { status: 'warn-advisory', role: smoke.role, warnings: [`codex-exit-${run.status}`], parsed: null };
      if (classification.status === 'passed-advisory') break;
    }

    fs.writeFileSync(smoke.resultPath, finalOutput);
    observations.push({
      role: smoke.role,
      attempts,
      resultPath: smoke.resultPath,
      command: [preflight.acceptedPath, 'exec', '--sandbox', 'read-only', '--output-last-message', smoke.resultPath, smoke.promptPath],
      usedSandboxReadOnly: true,
      ...classification,
    });
  }

  const result = {
    stage: 'codex-smoke',
    ok: true,
    classification: 'best-effort/advisory',
    codexAvailable: true,
    observations,
    failures: [],
  };
  writeResult('codex-smoke', result);
  return result;
}

function runCodexSmokeSelfTest() {
  const mobileExpected = SMOKE_PROMPTS[0];
  const valid = classifySmoke(mobileExpected, readText(path.join(CODEX_SMOKE_ROOT, 'selftest.valid-output.md')));
  const invalid = classifySmoke(mobileExpected, readText(path.join(CODEX_SMOKE_ROOT, 'selftest.invalid-output.md')));
  const malformed = classifySmoke(mobileExpected, readText(path.join(CODEX_SMOKE_ROOT, 'selftest.malformed-output.md')));
  const schemaInvalid = classifySmoke(mobileExpected, readText(path.join(CODEX_SMOKE_ROOT, 'selftest.schema-invalid-output.md')));
  const wrongRole = classifySmoke(mobileExpected, readText(path.join(CODEX_SMOKE_ROOT, 'selftest.wrong-role-output.md')));
  const wrongSkill = classifySmoke(mobileExpected, readText(path.join(CODEX_SMOKE_ROOT, 'selftest.wrong-skill-output.md')));
  const wrongOwnership = classifySmoke(mobileExpected, readText(path.join(CODEX_SMOKE_ROOT, 'selftest.wrong-ownership-output.md')));
  const doneWithoutEvidence = classifySmoke(mobileExpected, readText(path.join(CODEX_SMOKE_ROOT, 'selftest.done-without-evidence-output.md')));
  const failures = [];
  if (valid.status !== 'passed-advisory') addFailure(failures, 'valid smoke output did not pass', { valid });
  if (invalid.status !== 'warn-advisory' || !invalid.warnings.includes('missing-json-block')) {
    addFailure(failures, 'invalid smoke output did not warn for missing JSON', { invalid });
  }
  if (malformed.status !== 'warn-advisory' || !malformed.warnings.includes('malformed-json')) addFailure(failures, 'malformed smoke output did not warn', { malformed });
  if (schemaInvalid.status !== 'warn-advisory' || !schemaInvalid.warnings.includes('smoke JSON must be object')) addFailure(failures, 'schema invalid smoke output did not warn', { schemaInvalid });
  if (wrongRole.status !== 'warn-advisory' || !wrongRole.warnings.includes('smoke role mismatch')) addFailure(failures, 'wrong role smoke output did not warn', { wrongRole });
  if (wrongSkill.status !== 'warn-advisory' || !wrongSkill.warnings.includes('smoke used_skill mismatch')) addFailure(failures, 'wrong skill smoke output did not warn', { wrongSkill });
  if (wrongOwnership.status !== 'warn-advisory' || !wrongOwnership.warnings.includes('mobile-app-dev owns_backend_api advisory')) addFailure(failures, 'wrong ownership smoke output did not warn', { wrongOwnership });
  if (doneWithoutEvidence.status !== 'warn-advisory' || !doneWithoutEvidence.warnings.includes('done_claimed without evidence_paths')) {
    addFailure(failures, 'done without evidence smoke output did not warn', { doneWithoutEvidence });
  }
  return {
    stage: 'codex-smoke-self-test',
    ok: failures.length === 0,
    failures,
  };
}

function evaluateGatekeeperEvidence(evidence) {
  const failures = [];
  const deferred = [];
  const resolvedCap = resolveReworkCap();
  const cap = resolvedCap.value;

  if (!evidence.task_id) addFailure(failures, 'task_id_exists');
  if (!evidence.branch || (evidence.task_id && !evidence.branch.includes(evidence.task_id))) addFailure(failures, 'branch_contains_task_id');
  if (evidence.pr?.body_has_evidence_link !== true) addFailure(failures, 'pr_body_has_evidence_link');
  if (!evidence.pr?.head_sha) addFailure(failures, 'pr_head_sha');
  if (!evidence.ci?.checkout_sha) addFailure(failures, 'ci_checkout_sha');
  if (!evidence.eas?.build_id) addFailure(failures, 'eas_build_id_exists');
  if (evidence.eas?.git_commit && evidence.ci?.checkout_sha && evidence.eas.git_commit !== evidence.ci.checkout_sha) {
    addFailure(failures, 'eas_build_git_commit_matches_expected_checkout_sha');
  }
  if (evidence.maestro?.passed !== true) addFailure(failures, 'maestro_passed');
  if (!evidence.review?.author || !evidence.review?.approver || evidence.review.author === evidence.review.approver) {
    addFailure(failures, 'approver_not_author');
  }
  if (typeof evidence.rework?.count !== 'number') addFailure(failures, 'rework_count_present');
  if (cap === null || cap === undefined) {
    deferred.push('deferred: cap value missing from SoT');
  } else if (typeof cap === 'number' && typeof evidence.rework?.count === 'number' && evidence.rework.count >= cap) {
    addFailure(failures, 'rework_count_lt_cap');
  }

  return {
    passed: failures.length === 0,
    failures,
    deferred,
    resolvedReworkCap: resolvedCap,
  };
}

function resolveReworkCap() {
  const configPath = '.codex/hooks/gatekeeper.config.json';
  if (exists(configPath)) {
    const config = readJson(configPath);
    if (typeof config.rework_cap === 'number') return { source: configPath, value: config.rework_cap };
  }
  const snapshot = readJson(SNAPSHOT_PATH);
  if (typeof snapshot.gatekeeper?.rework_cap === 'number') {
    return { source: SNAPSHOT_PATH, value: snapshot.gatekeeper.rework_cap };
  }
  return { source: 'missing-from-sot', value: null };
}

function validateGatekeeper() {
  const fixtures = [
    ['valid', 'evidence.valid.json'],
    ['missing-maestro', 'evidence.invalid.missing-maestro.json'],
    ['missing-evidence-link', 'evidence.invalid.missing-evidence-link.json'],
    ['author-approver', 'evidence.invalid.author-approver.json'],
    ['rework-cap', 'evidence.invalid.rework-cap-exceeded.json'],
  ];
  const results = fixtures.map(([name, fileName]) => {
    const evidence = readJson(path.join(GATEKEEPER_ROOT, fileName));
    const evaluated = evaluateGatekeeperEvidence(evidence);
    if (name === 'rework-cap' && evaluated.resolvedReworkCap.value === null && evaluated.failures.length === 0) {
      return {
        name,
        fileName,
        ...evaluated,
        passed: null,
        status: 'DEFERRED_UNTIL_REWORK_CAP_SOT',
      };
    }
    return {
      name,
      fileName,
      ...evaluated,
      status: evaluated.failures.length ? 'FAIL' : evaluated.deferred.length ? 'PASS_WITH_DEFERRED' : 'PASS',
    };
  });
  const failures = [];
  const valid = results.find((result) => result.name === 'valid');
  const missingMaestro = results.find((result) => result.name === 'missing-maestro');
  const missingEvidenceLink = results.find((result) => result.name === 'missing-evidence-link');
  const authorApprover = results.find((result) => result.name === 'author-approver');
  const reworkCap = results.find((result) => result.name === 'rework-cap');

  if (!valid.passed) addFailure(failures, 'valid evidence fixture failed', { result: valid });
  if (!missingMaestro.failures.some((failure) => failure.reason === 'maestro_passed')) addFailure(failures, 'missing Maestro fixture did not fail deterministically');
  if (!missingEvidenceLink.failures.some((failure) => failure.reason === 'pr_body_has_evidence_link')) {
    addFailure(failures, 'missing evidence link fixture did not fail deterministically');
  }
  if (!authorApprover.failures.some((failure) => failure.reason === 'approver_not_author')) addFailure(failures, 'author=approver fixture did not fail deterministically');
  if (reworkCap.resolvedReworkCap.value === null) {
    if (!reworkCap.deferred.includes('deferred: cap value missing from SoT')) addFailure(failures, 'rework cap missing threshold was not deferred');
    if (reworkCap.failures.some((failure) => failure.reason === 'rework_count_lt_cap')) {
      addFailure(failures, 'rework cap threshold was invented despite missing SoT');
    }
  } else if (!reworkCap.failures.some((failure) => failure.reason === 'rework_count_lt_cap')) {
    addFailure(failures, 'resolved rework cap fixture did not fail deterministically');
  }

  return {
    stage: 'gatekeeper',
    ok: failures.length === 0,
    failures,
    results,
  };
}

function runGatekeeperSelfTest() {
  const fixture = readJson(path.join(GATEKEEPER_ROOT, 'selftest.invalid-author-approver.json'));
  const result = evaluateGatekeeperEvidence(fixture.evidence);
  const failures = [];
  if (!result.failures.some((failure) => failure.reason === fixture.expectedReason)) {
    addFailure(failures, 'author=approver selftest failed for wrong reason', { result });
  }
  return {
    stage: 'gatekeeper-self-test',
    ok: failures.length === 0,
    failures,
  };
}

function validateSkillSlugRegistry() {
  const snapshot = readJson(SNAPSHOT_PATH);
  const failures = [];
  const allowed = new Set([
    ...snapshot.skillTaxonomy.mvpSkills,
    ...snapshot.skillTaxonomy.organizationRuntimeSkills,
    ...snapshot.skillTaxonomy.allowedNativeDevSkills,
  ]);
  for (const entry of snapshot.caseRegistry) {
    for (const skill of entry.skills || []) {
      if (!allowed.has(skill)) addFailure(failures, 'unexpected case skill slug', { case: entry.case, skill });
    }
  }
  return { failures, allowed: [...allowed] };
}

function extractReadmeSection(readme, startHeading, endHeading, failures) {
  const pattern = new RegExp(`## ${startHeading}\\n\\n([\\s\\S]*?)\\n\\n## ${endHeading}`);
  const match = readme.match(pattern);
  if (!match) {
    addFailure(failures, `missing ${startHeading} section in README`);
    return [];
  }
  return match[1].split('\n');
}

function runSummarySelfTest() {
  const missingAsserts = [];
  extractReadmeSection('## DOES NOT ASSERT\n\n- no external side effects\n\n## Confluence Sources', 'ASSERTS', 'DOES NOT ASSERT', missingAsserts);
  const missingDoesNotAssert = [];
  extractReadmeSection('## ASSERTS\n\n- local only\n\n## Confluence Sources', 'DOES NOT ASSERT', 'Confluence Sources', missingDoesNotAssert);
  const missingProofRows = validateSummaryProofRows('# Local Harness Summary\n\n- Case A: local fixture verified\n- Cross-cutting: local verified\n');
  const failures = [];

  if (!missingAsserts.some((failure) => failure.reason === 'missing ASSERTS section in README')) {
    addFailure(failures, 'missing ASSERTS self-test did not fail');
  }
  if (!missingDoesNotAssert.some((failure) => failure.reason === 'missing DOES NOT ASSERT section in README')) {
    addFailure(failures, 'missing DOES NOT ASSERT self-test did not fail');
  }
  if (!missingProofRows.some((failure) => failure.reason === 'missing proof-level row' && failure.row === 'B')) {
    addFailure(failures, 'missing proof-level row self-test did not fail');
  }

  return {
    stage: 'summary-self-test',
    ok: failures.length === 0,
    failures,
  };
}

function bucketProofLevel(localProofLevel) {
  if (/actual submit deferred|deferred/i.test(localProofLevel || '')) return 'deferred integration';
  if (/deterministic fixture check/i.test(localProofLevel || '')) return 'local verified';
  if (/fixture|repo structure|static check|headless smoke/i.test(localProofLevel || '')) return 'local fixture verified';
  return 'simulation only';
}

function validateSummaryProofRows(summaryText) {
  const failures = [];
  const expectedProofRows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'Cross-cutting'];
  for (const row of expectedProofRows) {
    const label = row === 'Cross-cutting' ? row : `Case ${row}`;
    if (!new RegExp(`^- ${label}: `, 'm').test(summaryText)) {
      addFailure(failures, 'missing proof-level row', { row });
    }
  }
  return failures;
}

function generateSummary(results) {
  const readme = readText('evals/local-harness/README.md');
  const snapshot = readJson(SNAPSHOT_PATH);
  const skillRegistry = validateSkillSlugRegistry();
  const summaryFailures = [];
  const resultMap = new Map(results.map((result) => [result.stage, result]));
  const proofMap = Object.fromEntries(snapshot.caseRegistry.map((entry) => [entry.case, bucketProofLevel(entry.localProofLevel)]));
  proofMap['Cross-cutting'] = 'local verified';
  const gatekeeperHasDeferred = resultMap.get('gatekeeper')?.results?.some((item) => (
    typeof item.status === 'string' && item.status.includes('DEFERRED')
  ));
  if (gatekeeperHasDeferred && proofMap.F === 'local verified') proofMap.F = 'local verified with deferred gate predicate';
  const fetchedAtMs = Date.parse(snapshot.fetchedAt);
  const stale = Number.isFinite(fetchedAtMs) && (Date.now() - fetchedAtMs > 7 * 24 * 60 * 60 * 1000);
  const lines = [];

  lines.push('# Local Harness Summary');
  lines.push('');
  lines.push('ASSERTS');
  lines.push(...extractReadmeSection(readme, 'ASSERTS', 'DOES NOT ASSERT', summaryFailures));
  lines.push('');
  lines.push('DOES NOT ASSERT');
  lines.push(...extractReadmeSection(readme, 'DOES NOT ASSERT', 'Confluence Sources', summaryFailures));
  lines.push('');
  lines.push('## Stage Results');
  for (const result of results) {
    const hasDeferred = result.results?.some((item) => typeof item.status === 'string' && item.status.includes('DEFERRED'));
    lines.push(`- ${result.stage}: ${result.ok ? (hasDeferred ? 'PASS_WITH_DEFERRED' : 'PASS') : 'FAIL'}`);
  }
  lines.push(`- codex headless smoke: ${resultMap.get('codex-smoke')?.classification || 'best-effort/advisory'}`);
  lines.push('');
  lines.push('## SoT Snapshot Mode');
  lines.push('- validation mode: offline snapshot');
  lines.push(`- snapshot fetchedAt: ${snapshot.fetchedAt}`);
  lines.push(`- snapshot staleness: ${stale ? 'STALE_SOT_SNAPSHOT' : 'fresh'}`);
  lines.push('');
  lines.push('## Case A-H Local Verification');
  const expectedProofRows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'Cross-cutting'];
  for (const row of expectedProofRows) {
    const proof = proofMap[row];
    if (!proof) summaryFailures.push({ reason: 'missing proof-level row', row });
    lines.push(`- ${row === 'Cross-cutting' ? row : `Case ${row}`}: ${proof || 'missing'}`);
  }
  lines.push('');
  lines.push('## Skill Registry');
  lines.push(`- allowed skill slugs: ${skillRegistry.allowed.join(', ')}`);
  lines.push(`- registry assertion: ${skillRegistry.failures.length ? 'FAIL' : 'PASS'}`);

  const summaryPath = path.join(RESULTS_DIR, 'summary.md');
  fs.writeFileSync(summaryPath, `${lines.join('\n')}\n`);
  summaryFailures.push(...validateSummaryProofRows(readText(summaryPath)));
  return {
    stage: 'summary',
    ok: summaryFailures.length === 0 && skillRegistry.failures.length === 0,
    failures: [...summaryFailures, ...skillRegistry.failures],
    staleSnapshot: stale,
  };
}

function writeResult(stage, result) {
  fs.mkdirSync(RESULTS_DIR, { recursive: true });
  fs.writeFileSync(path.join(RESULTS_DIR, `${stage}.json`), `${JSON.stringify(result, null, 2)}\n`);
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const results = [];
  const validStages = new Set(['all', 'product-planning', 'structure', 'roles', 'codex-smoke', 'gatekeeper']);

  if (!validStages.has(args.stage)) {
    console.error(`unknown stage: ${args.stage}`);
    process.exit(1);
  }

  if (args.selfTest) {
    if (args.stage === 'product-planning' || args.stage === 'all') results.push(runProductPlanningSelfTest());
    if (args.stage === 'structure' || args.stage === 'all') results.push(runStructureSelfTest());
    if (args.stage === 'roles' || args.stage === 'all') results.push(runRolesSelfTest());
    if (args.stage === 'codex-smoke' || args.stage === 'all') results.push(runCodexSmokeSelfTest());
    if (args.stage === 'gatekeeper' || args.stage === 'all') results.push(runGatekeeperSelfTest());
    if (args.stage === 'all') results.push(runSummarySelfTest());
  } else {
    if (args.stage === 'product-planning' || args.stage === 'all') {
      const result = validateProductPlanningFixtures();
      writeResult('product-planning', result);
      results.push(result);
    }
    if (args.stage === 'structure' || args.stage === 'all') {
      const result = validateStructure();
      writeResult('structure', result);
      results.push(result);
    }
    if (args.stage === 'roles' || args.stage === 'all') {
      const result = validateRoles();
      writeResult('roles', result);
      results.push(result);
    }
    if (args.stage === 'codex-smoke' || args.stage === 'all') results.push(runCodexSmoke());
    if (args.stage === 'gatekeeper' || args.stage === 'all') {
      const result = validateGatekeeper();
      writeResult('gatekeeper', result);
      results.push(result);
    }
    if (args.stage === 'all') {
      const skillRegistry = validateSkillSlugRegistry();
      if (skillRegistry.failures.length) results.push({ stage: 'skill-registry', ok: false, failures: skillRegistry.failures });
      results.push(generateSummary(results));
    }
  }

  const ok = results.every((result) => result.ok);
  const payload = { ok, results };

  if (args.json) process.stdout.write(`${JSON.stringify(payload, null, 2)}\n`);
  else if (ok) console.log(`${args.selfTest ? 'self-test' : 'local harness'} ${args.stage} passed`);
  else {
    console.error(`${args.selfTest ? 'self-test' : 'local harness'} ${args.stage} failed`);
    for (const result of results) {
      for (const failure of result.failures) console.error(`- ${result.stage}: ${failure.reason}`);
    }
  }

  process.exit(ok ? 0 : 1);
}

main();
