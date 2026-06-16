#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const fixtureRoot = path.join(root, 'evals/team-doc-structure/fixtures');
const teamRoot = 'mobile-app-dev-team';
const sourceMapTargetPath = `${teamRoot}/source-map.md`;
const sourceMapLegacyPath = `${teamRoot}/99-source-map.md`;

const registry = [
  { legacyPath: `${teamRoot}/README.md`, targetPath: `${teamRoot}/README.md`, kind: 'file', surfaceClass: 'I1', strength: 'strong' },
  { legacyPath: `${teamRoot}/00-sot-and-principles.md`, targetPath: `${teamRoot}/governance/sot-and-principles.md`, kind: 'file', surfaceClass: 'G1', strength: 'medium' },
  { legacyPath: `${teamRoot}/01-team-composition.md`, targetPath: `${teamRoot}/organization/team-composition.md`, kind: 'file', surfaceClass: 'O1', strength: 'medium' },
  { legacyPath: `${teamRoot}/02-role-souls/`, targetPath: `${teamRoot}/runtime-sources/role-souls/`, kind: 'dir', surfaceClass: 'R2', strength: 'strong' },
  { legacyPath: `${teamRoot}/03-role-capability-matrix.md`, targetPath: `${teamRoot}/organization/role-capability-matrix.md`, kind: 'file', surfaceClass: 'O1', strength: 'medium' },
  { legacyPath: `${teamRoot}/04-skills-and-agents-matrix.md`, targetPath: `${teamRoot}/runtime-sources/codex-skill-agent-matrix.md`, kind: 'file', surfaceClass: 'C1', strength: 'strong' },
  { legacyPath: `${teamRoot}/05-work-processes.md`, targetPath: `${teamRoot}/workflows/work-processes.md`, kind: 'file', surfaceClass: 'W1', strength: 'medium' },
  { legacyPath: `${teamRoot}/06-gates-and-evidence.md`, targetPath: `${teamRoot}/governance/gates-and-evidence.md`, kind: 'file', surfaceClass: 'G1', strength: 'medium' },
  { legacyPath: `${teamRoot}/07-new-team-template-guide.md`, targetPath: `${teamRoot}/organization/new-team-template-guide.md`, kind: 'file', surfaceClass: 'O1', strength: 'low/medium' },
  { legacyPath: `${teamRoot}/09-pod-native-openclaw-skills/`, targetPath: `${teamRoot}/runtime-sources/pod-native-openclaw-skills/`, kind: 'dir', surfaceClass: 'R1', strength: 'strong' },
  { legacyPath: `${teamRoot}/10-github-artifact-workflow.md`, targetPath: `${teamRoot}/workflows/github-artifact-workflow.md`, kind: 'file', surfaceClass: 'W1', strength: 'medium' },
  { legacyPath: `${teamRoot}/14-native-e2e-strategy.md`, targetPath: `${teamRoot}/workflows/native-e2e-strategy.md`, kind: 'file', surfaceClass: 'W1', strength: 'medium' },
  { legacyPath: `${teamRoot}/15-human-ops-live-readiness-annex.md`, targetPath: `${teamRoot}/governance/human-ops-live-readiness-annex.md`, kind: 'file', surfaceClass: 'G1', strength: 'medium' },
  { legacyPath: `${teamRoot}/16-pod-environment-bootstrap.md`, targetPath: `${teamRoot}/runtime-sources/pod-environment-bootstrap.md`, kind: 'file', surfaceClass: 'R1', strength: 'strong' },
  { legacyPath: `${teamRoot}/17-orbstack-pod-config-values.md`, targetPath: `${teamRoot}/runtime-sources/orbstack-pod-config-values.md`, kind: 'file', surfaceClass: 'R1', strength: 'medium' },
  { legacyPath: `${teamRoot}/19-entry-case-routing.md`, targetPath: `${teamRoot}/workflows/entry-case-routing.md`, kind: 'file', surfaceClass: 'W1', strength: 'strong/medium' },
  { legacyPath: `${teamRoot}/20-app-eas-ota-rollback-runbook.md`, targetPath: `${teamRoot}/governance/app-eas-ota-rollback-runbook.md`, kind: 'file', surfaceClass: 'G1', strength: 'medium' },
  { legacyPath: `${teamRoot}/21-team-doc-validator-and-soul-runtime-explainer.md`, targetPath: `${teamRoot}/reports/team-doc-validator-and-soul-runtime-explainer.md`, kind: 'file', surfaceClass: 'P1', strength: 'low' },
  { legacyPath: `${teamRoot}/22-runtime-surface-classification-improvement-report.md`, targetPath: `${teamRoot}/reports/runtime-surface-classification-improvement-report.md`, kind: 'file', surfaceClass: 'P1', strength: 'low' },
  { legacyPath: `${teamRoot}/22-runtime-surface-classification-improvement-report-v2.md`, targetPath: `${teamRoot}/reports/runtime-surface-classification-improvement-report-v2.md`, kind: 'file', surfaceClass: 'P1', strength: 'low' },
  { legacyPath: `${teamRoot}/runtime-surface-structure-goal-plan.md`, targetPath: `${teamRoot}/reports/runtime-surface-structure-goal-plan.md`, kind: 'file', surfaceClass: 'P1', strength: 'low' },
  { legacyPath: sourceMapLegacyPath, targetPath: sourceMapTargetPath, kind: 'file', surfaceClass: 'I1', strength: 'strong' },
  { legacyPath: `${teamRoot}/ref-organization/00-orientation-and-sot/`, targetPath: `${teamRoot}/ref-organization/orientation-and-sot/`, kind: 'dir', surfaceClass: 'H1', strength: 'low/medium' },
  { legacyPath: `${teamRoot}/ref-organization/01-organization-model/`, targetPath: `${teamRoot}/ref-organization/organization-model/`, kind: 'dir', surfaceClass: 'H1', strength: 'low/medium' },
  { legacyPath: `${teamRoot}/ref-organization/02-runtime-surfaces/`, targetPath: `${teamRoot}/ref-organization/runtime-surfaces/`, kind: 'dir', surfaceClass: 'H1', strength: 'low/medium' },
  { legacyPath: `${teamRoot}/ref-organization/03-role-contracts-and-capabilities/`, targetPath: `${teamRoot}/ref-organization/role-contracts-and-capabilities/`, kind: 'dir', surfaceClass: 'H1', strength: 'low/medium' },
  { legacyPath: `${teamRoot}/ref-organization/04-workflows-and-handoffs/`, targetPath: `${teamRoot}/ref-organization/workflows-and-handoffs/`, kind: 'dir', surfaceClass: 'H1', strength: 'low/medium' },
  { legacyPath: `${teamRoot}/ref-organization/05-skills-agents-and-tools/`, targetPath: `${teamRoot}/ref-organization/skills-agents-and-tools/`, kind: 'dir', surfaceClass: 'H1', strength: 'low/medium' },
  { legacyPath: `${teamRoot}/ref-organization/06-gates-evidence-and-audit/`, targetPath: `${teamRoot}/ref-organization/gates-evidence-and-audit/`, kind: 'dir', surfaceClass: 'H1', strength: 'low/medium' },
  { legacyPath: `${teamRoot}/ref-organization/07-repo-template-and-runtime/`, targetPath: `${teamRoot}/ref-organization/repo-template-and-runtime/`, kind: 'dir', surfaceClass: 'H1', strength: 'low/medium' },
  { legacyPath: `${teamRoot}/ref-organization/08-new-organization-template/`, targetPath: `${teamRoot}/ref-organization/new-organization-template/`, kind: 'dir', surfaceClass: 'H1', strength: 'low/medium' },
  { legacyPath: `${teamRoot}/ref-organization/99-source-map-and-migration/`, targetPath: `${teamRoot}/ref-organization/source-map-and-migration/`, kind: 'dir', surfaceClass: 'H1', strength: 'low/medium' },
];

const completedPlanArchives = [
  { stalePath: `${teamRoot}/08-role-title-update-plan.md`, legacyArchivePath: `${teamRoot}/_archive/08-role-title-update-plan.md`, targetArchivePath: `${teamRoot}/_archive/completed-plans/role-title-update-plan.md` },
  { stalePath: `${teamRoot}/09-pod-native-openclaw-skill-plan.md`, legacyArchivePath: `${teamRoot}/_archive/09-pod-native-openclaw-skill-plan.md`, targetArchivePath: `${teamRoot}/_archive/completed-plans/pod-native-openclaw-skill-plan.md` },
  { stalePath: `${teamRoot}/11-openclaw-codex-completion-hooks-plan.md`, legacyArchivePath: `${teamRoot}/_archive/11-openclaw-codex-completion-hooks-plan.md`, targetArchivePath: `${teamRoot}/_archive/completed-plans/openclaw-codex-completion-hooks-plan.md` },
  { stalePath: `${teamRoot}/12-ref-organization-goal-plan.md`, legacyArchivePath: `${teamRoot}/_archive/12-ref-organization-goal-plan.md`, targetArchivePath: `${teamRoot}/_archive/completed-plans/ref-organization-goal-plan.md` },
  { stalePath: `${teamRoot}/13-pod-organization-e2e-improvement-plan.md`, legacyArchivePath: `${teamRoot}/_archive/13-pod-organization-e2e-improvement-plan.md`, targetArchivePath: `${teamRoot}/_archive/completed-plans/pod-organization-e2e-improvement-plan.md` },
  { stalePath: `${teamRoot}/18-orbstack-pod-config-setup-runbook-plan.md`, legacyArchivePath: `${teamRoot}/_archive/18-orbstack-pod-config-setup-runbook-plan.md`, targetArchivePath: `${teamRoot}/_archive/completed-plans/orbstack-pod-config-setup-runbook-plan.md` },
  { stalePath: `${teamRoot}/orbstack-pod-operator-input-request.md`, legacyArchivePath: `${teamRoot}/_archive/orbstack-pod-operator-input-request.md`, targetArchivePath: `${teamRoot}/_archive/completed-plans/orbstack-pod-operator-input-request.md` },
];

const runtimeSurfaceClasses = new Set(['R1', 'R2', 'C1']);
const sourceMapRequiredTerms = [
  'Runtime Surface Classes',
  'Old-To-New Rename Crosswalk',
  'Validator Responsibility Crosswalk',
  'Harness Applicability Crosswalk',
  'Historical/Archive Crosswalk',
  'External Proof Boundary',
  'source-map.md',
  'scripts/validate-team-doc-structure.mjs',
  'evals/team-doc-structure/fixtures/',
  'mobile-app-dev-team/governance/',
  'mobile-app-dev-team/organization/',
  'mobile-app-dev-team/workflows/',
  'mobile-app-dev-team/runtime-sources/codex-skill-agent-matrix.md',
  'mobile-app-dev-team/runtime-sources/pod-environment-bootstrap.md',
  'mobile-app-dev-team/runtime-sources/orbstack-pod-config-values.md',
  'mobile-app-dev-team/runtime-sources/pod-native-openclaw-skills/',
  'mobile-app-dev-team/reports/runtime-surface-structure-goal-plan.md',
];

function normalizePath(value) {
  return value.replace(/\\/g, '/').replace(/\/$/, '');
}

function markerPath(entry, mode) {
  const basePath = mode === 'target' ? entry.targetPath : entry.legacyPath;
  return entry.kind === 'dir' ? `${normalizePath(basePath)}/README.md` : normalizePath(basePath);
}

function pathExists(files, relativePath, kind = 'file') {
  const normalized = normalizePath(relativePath);
  if (kind === 'dir') {
    const prefix = `${normalized}/`;
    return Object.keys(files).some((file) => file === normalized || file.startsWith(prefix));
  }
  return Object.hasOwn(files, normalized);
}

function readFile(files, relativePath) {
  return files[normalizePath(relativePath)] ?? '';
}

function listRepoFiles(baseDir) {
  const absoluteBase = path.join(root, baseDir);
  if (!fs.existsSync(absoluteBase)) return {};
  const files = {};
  const stack = [absoluteBase];
  while (stack.length) {
    const current = stack.pop();
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      const absolute = path.join(current, entry.name);
      if (entry.isDirectory()) {
        stack.push(absolute);
      } else {
        const relative = normalizePath(path.relative(root, absolute));
        files[relative] = fs.readFileSync(absolute, 'utf8');
      }
    }
  }
  return files;
}

function buildSourceMapBody() {
  return [
    '# Source Map',
    '',
    '## Current Repo Sources',
    '',
    '- `REPO_OPERATIONS.md` owns repo-wide operating policy.',
    '',
    '## Runtime Surface Classes',
    '',
    '- `R1` pod-native runtime source.',
    '- `R2` role SOUL runtime source.',
    '- `C1` Codex runtime source.',
    '',
    '## Old-To-New Rename Crosswalk',
    '',
    '- `source-map.md` is the target source map name after numeric-prefix removal.',
    '- `mobile-app-dev-team/governance/` is the target governance document family.',
    '- `mobile-app-dev-team/organization/` is the target organization document family.',
    '- `mobile-app-dev-team/workflows/` is the target workflow document family.',
    '- `mobile-app-dev-team/runtime-sources/codex-skill-agent-matrix.md` is the target Codex skill and agent matrix path.',
    '- `mobile-app-dev-team/runtime-sources/pod-environment-bootstrap.md` is the target pod environment bootstrap path.',
    '- `mobile-app-dev-team/runtime-sources/orbstack-pod-config-values.md` is the target OrbStack pod config values path.',
    '- `mobile-app-dev-team/runtime-sources/pod-native-openclaw-skills/` is the target pod-native runtime-source path.',
    '- `mobile-app-dev-team/reports/runtime-surface-structure-goal-plan.md` is the target report path for the approved goal plan.',
    '',
    '## Validator Responsibility Crosswalk',
    '',
    '- `scripts/validate-team-doc-structure.mjs` validates the structure registry.',
    '- `evals/team-doc-structure/fixtures/` stores RED and valid registry fixtures.',
    '',
    '## Harness Applicability Crosswalk',
    '',
    '- `mobile-app-dev-team/reports/**` can skip local harness when no Codex runtime path changes.',
    '',
    '## Historical/Archive Crosswalk',
    '',
    '- `TEAM_DOC_ARCHIVE_MANIFEST.json` and `TEAM_DOC_ARCHIVE_BUNDLE.jsonl` preserve historical team-doc content.',
    '',
    '## External Proof Boundary',
    '',
    '- Local validators do not prove live OpenClaw, EAS, GitHub, Jira, or Confluence behavior.',
    '',
  ].join('\n');
}

function buildBaseFiles(base) {
  const files = {};
  files[markerPath(registry[0], 'target')] = '# Mobile App Dev Team\n';
  for (const entry of registry) {
    files[markerPath(entry, base)] = `# ${path.basename(markerPath(entry, base))}\n`;
  }
  if (base === 'legacy') {
    files[sourceMapLegacyPath] = buildSourceMapBody();
  } else {
    files[sourceMapTargetPath] = buildSourceMapBody();
  }
  for (const archive of completedPlanArchives) {
    const archivePath = base === 'legacy' ? archive.legacyArchivePath : archive.targetArchivePath;
    files[archivePath] = '# Archived Plan\n';
  }
  return files;
}

function applyFixture(baseFiles, fixture) {
  const files = { ...baseFiles };
  for (const removePath of fixture.remove ?? []) {
    delete files[normalizePath(removePath)];
  }
  for (const removePrefix of fixture.removePrefixes ?? []) {
    const prefix = normalizePath(removePrefix);
    for (const file of Object.keys(files)) {
      if (file === prefix || file.startsWith(`${prefix}/`)) delete files[file];
    }
  }
  for (const [file, body] of Object.entries(fixture.add ?? {})) {
    files[normalizePath(file)] = body;
  }
  for (const [file, body] of Object.entries(fixture.replace ?? {})) {
    files[normalizePath(file)] = body;
  }
  return files;
}

function validateStructure(files, options = {}) {
  const legacyCompatibility = options.legacyCompatibility ?? true;
  const finalSourceMap = options.finalSourceMap ?? false;
  const errors = [];
  const allowedNumericTopLevel = legacyCompatibility
    ? new Set(
      registry
        .map((entry) => normalizePath(entry.legacyPath))
        .filter((item) => item.startsWith(`${teamRoot}/`) && !item.slice(`${teamRoot}/`.length).includes('/'))
        .map((item) => item.slice(`${teamRoot}/`.length)),
    )
    : new Set();

  const sourceMapPath = pathExists(files, sourceMapTargetPath)
    ? sourceMapTargetPath
    : !finalSourceMap && legacyCompatibility && pathExists(files, sourceMapLegacyPath)
      ? sourceMapLegacyPath
      : null;
  if (!sourceMapPath) {
    errors.push(`missing source map: expected ${sourceMapTargetPath}${!finalSourceMap && legacyCompatibility ? ` or ${sourceMapLegacyPath}` : ''}`);
  } else {
    const sourceMapBody = readFile(files, sourceMapPath);
    for (const term of sourceMapRequiredTerms) {
      if (!sourceMapBody.includes(term)) {
        errors.push(`${sourceMapPath} missing structure registry term: ${term}`);
      }
    }
  }
  if (finalSourceMap && pathExists(files, sourceMapLegacyPath)) {
    errors.push(`legacy source map must be renamed to target path: ${sourceMapLegacyPath} -> ${sourceMapTargetPath}`);
  }

  for (const file of Object.keys(files)) {
    if (!file.startsWith(`${teamRoot}/`)) continue;
    const remainder = file.slice(`${teamRoot}/`.length);
    const topLevel = remainder.split('/')[0];
    if (/^\d{2}-/.test(topLevel) && !allowedNumericTopLevel.has(topLevel)) {
      errors.push(`unregistered numeric-prefix top-level path: ${teamRoot}/${topLevel}`);
    }
  }

  for (const archive of completedPlanArchives) {
    if (pathExists(files, archive.stalePath)) {
      errors.push(`completed plan must not be current top-level doc: ${archive.stalePath}`);
    }
    const hasTargetArchive = pathExists(files, archive.targetArchivePath);
    const hasLegacyArchive = legacyCompatibility && pathExists(files, archive.legacyArchivePath);
    if (!hasTargetArchive && !hasLegacyArchive) {
      errors.push(`missing completed-plan archive path: ${archive.targetArchivePath}${legacyCompatibility ? ` or ${archive.legacyArchivePath}` : ''}`);
    }
  }

  for (const entry of registry) {
    const hasTarget = pathExists(files, entry.targetPath, entry.kind);
    const hasLegacy = pathExists(files, entry.legacyPath, entry.kind);
    if (!hasTarget && !(legacyCompatibility && hasLegacy)) {
      errors.push(`missing structure registry path for ${entry.surfaceClass}: ${entry.targetPath}${legacyCompatibility ? ` or ${entry.legacyPath}` : ''}`);
    }
    if (!legacyCompatibility && runtimeSurfaceClasses.has(entry.surfaceClass) && hasLegacy && !hasTarget) {
      errors.push(`runtime source exists only at legacy path while target is missing: ${entry.legacyPath} -> ${entry.targetPath}`);
    }
    if (runtimeSurfaceClasses.has(entry.surfaceClass) && normalizePath(entry.targetPath).startsWith(`${teamRoot}/reports/`)) {
      errors.push(`runtime source registry target must not live under reports: ${entry.targetPath}`);
    }
  }

  for (const file of Object.keys(files)) {
    if (!file.startsWith(`${teamRoot}/reports/`)) continue;
    if (
      file.includes('/role-souls/')
      || file.includes('/pod-native-openclaw-skills/')
      || /\/[^/]+-soul\.md$/.test(file)
      || file.endsWith('/codex-skill-agent-matrix.md')
    ) {
      errors.push(`runtime source must not live under reports: ${file}`);
    }
  }

  return errors;
}

function loadFixture(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function runSelfTest() {
  const fixtureFiles = fs.readdirSync(fixtureRoot)
    .filter((file) => file.endsWith('.json'))
    .sort();
  const failures = [];
  for (const fileName of fixtureFiles) {
    const fixture = loadFixture(path.join(fixtureRoot, fileName));
    const base = fixture.base === 'target' ? 'target' : 'legacy';
    const files = applyFixture(buildBaseFiles(base), fixture);
    const errors = validateStructure(files, { legacyCompatibility: fixture.legacyCompatibility ?? true });
    const passed = errors.length === 0;
    if (passed !== fixture.shouldPass) {
      failures.push(`${fileName}: expected ${fixture.shouldPass ? 'pass' : 'fail'}, got ${passed ? 'pass' : 'fail'}${errors.length ? ` (${errors.join('; ')})` : ''}`);
      continue;
    }
    for (const expectedError of fixture.expectedErrors ?? []) {
      if (!errors.some((error) => error.includes(expectedError))) {
        failures.push(`${fileName}: missing expected error substring: ${expectedError}`);
      }
    }
  }
  if (failures.length) {
    console.error(failures.map((failure) => `- ${failure}`).join('\n'));
    process.exit(1);
  }
  console.log('Validated team-doc structure fixtures.');
}

if (process.argv.includes('--self-test')) {
  runSelfTest();
  process.exit(0);
}

const errors = validateStructure(listRepoFiles(teamRoot), { legacyCompatibility: false, finalSourceMap: true });
if (errors.length) {
  console.error(errors.map((error) => `- ${error}`).join('\n'));
  process.exit(1);
}

console.log('Validated mobile-app-dev-team structure registry.');
