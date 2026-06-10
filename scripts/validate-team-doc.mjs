#!/usr/bin/env node
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const docRoot = path.join(root, 'team-doc');
const errors = [];

function fail(message) {
  errors.push(message);
}

function exists(relativePath) {
  return fs.existsSync(path.join(docRoot, relativePath));
}

function read(relativePath) {
  return fs.readFileSync(path.join(docRoot, relativePath), 'utf8');
}

function existsRoot(relativePath) {
  return fs.existsSync(path.join(root, relativePath));
}

function readRoot(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), 'utf8');
}

function listFiles(baseDir, predicate = () => true) {
  const absoluteBase = path.join(docRoot, baseDir);
  if (!fs.existsSync(absoluteBase)) return [];
  const out = [];
  const stack = [absoluteBase];
  while (stack.length) {
    const current = stack.pop();
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      const absolute = path.join(current, entry.name);
      if (entry.isDirectory()) {
        stack.push(absolute);
      } else {
        const relative = path.relative(docRoot, absolute);
        if (predicate(relative)) out.push(relative);
      }
    }
  }
  return out.sort();
}

function parseFrontmatter(body) {
  if (!body.startsWith('---\n')) return null;
  const end = body.indexOf('\n---\n', 4);
  if (end < 0) return null;
  const block = body.slice(4, end).trim();
  const data = {};
  for (const line of block.split('\n')) {
    const match = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (!match) continue;
    data[match[1]] = match[2].replace(/^"|"$/g, '');
  }
  return data;
}

const managedSkillMatrix = exists('mobile-app-dev-team/04-skills-and-agents-matrix.md')
  ? read('mobile-app-dev-team/04-skills-and-agents-matrix.md')
  : '';
const repoSkillRoot = path.join(root, '.agents/skills');
if (fs.existsSync(repoSkillRoot)) {
  const repoSkillSlugs = fs.readdirSync(repoSkillRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();
  for (const skillSlug of repoSkillSlugs) {
    if (managedSkillMatrix && !managedSkillMatrix.includes(`\`${skillSlug}\``)) {
      fail(`managed skill matrix missing active repo-local skill: ${skillSlug}`);
    }
  }
}

const generatedFiles = listFiles('mobile-app-dev-team', (file) => /\.(md|json|sh)$/.test(file));
const secretPatterns = [
  /\bsk-[A-Za-z0-9_-]{20,}\b/,
  /\bgh[pousr]_[A-Za-z0-9_]{20,}\b/,
  /\bxox[baprs]-[A-Za-z0-9-]{20,}\b/,
  /\beyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]{20,}\b/,
  /DATABASE_URL\s*=\s*["']?(postgres|mysql):\/\/(?!.*(example|placeholder|localhost|test))/i,
  /API_BEARER_TOKEN\s*=\s*["']?(?!test|placeholder|example)[A-Za-z0-9_.-]{12,}/i,
];

for (const file of generatedFiles) {
  const body = read(file);
  for (const pattern of secretPatterns) {
    if (pattern.test(body)) fail(`probable secret or concrete credential in team-doc/${file}`);
  }
}

function requireDocTerms(relativePath, terms) {
  if (!exists(relativePath)) {
    fail(`missing required role document: team-doc/${relativePath}`);
    return;
  }
  const body = read(relativePath);
  for (const term of terms) {
    if (!body.includes(term)) {
      fail(`team-doc/${relativePath} missing required role-boundary term: ${term}`);
    }
  }
}

function requireRootTerms(relativePath, terms) {
  if (!existsRoot(relativePath)) {
    fail(`missing required root document: ${relativePath}`);
    return;
  }
  const body = readRoot(relativePath);
  for (const term of terms) {
    if (!body.includes(term)) {
      fail(`${relativePath} missing required term: ${term}`);
    }
  }
}

function forbidDocTerms(relativePath, terms) {
  if (!exists(relativePath)) {
    fail(`missing required role document: team-doc/${relativePath}`);
    return;
  }
  const body = read(relativePath);
  for (const term of terms) {
    if (body.includes(term)) {
      fail(`team-doc/${relativePath} includes forbidden role-boundary term: ${term}`);
    }
  }
}

function requireNoDocTerms(relativePath, terms) {
  if (!exists(relativePath)) {
    fail(`missing required document: team-doc/${relativePath}`);
    return;
  }
  const body = read(relativePath);
  for (const term of terms) {
    if (body.includes(term)) {
      fail(`team-doc/${relativePath} includes forbidden term: ${term}`);
    }
  }
}

function requireOrderedTopLevelHeadings(relativePath, headings) {
  if (!exists(relativePath)) {
    fail(`missing required role document: team-doc/${relativePath}`);
    return;
  }

  const actualHeadings = read(relativePath)
    .split('\n')
    .filter((line) => /^#{1,2} /.test(line))
    .map((line) => line.trim());

  let start = 0;
  for (const expected of headings) {
    const index = actualHeadings.indexOf(expected, start);
    if (index < 0) {
      fail(`team-doc/${relativePath} missing ordered runtime SOUL heading: ${expected}`);
      return;
    }
    start = index + 1;
  }
}

const roleSoulRuntimeHeadings = [
  '## Identity',
  '## Responsibilities',
  '## Skills',
  '## Communication Style',
  '## Decision Making',
  '## Boundaries',
  '## Goals',
  '## Working Principles',
  '## Security Policy',
  '## Sub-Agent & Background Delegation (Mandatory)',
];

const managedTeamDocRoot = 'mobile-app-dev-team';
const githubArtifactWorkflowDoc = `${managedTeamDocRoot}/10-github-artifact-workflow.md`;
const podNativeOpenClawSkillRoot = `${managedTeamDocRoot}/09-pod-native-openclaw-skills`;
const codexCliAuthSetupSkillRoot = `${podNativeOpenClawSkillRoot}/codex-cli-auth-setup`;
const refOrganizationRoot = `${managedTeamDocRoot}/ref-organization`;

for (const relativePath of [
  `${managedTeamDocRoot}/README.md`,
  `${managedTeamDocRoot}/00-sot-and-principles.md`,
  `${managedTeamDocRoot}/01-team-composition.md`,
  `${managedTeamDocRoot}/02-role-souls/product-planning-soul.md`,
  `${managedTeamDocRoot}/02-role-souls/design-soul.md`,
  `${managedTeamDocRoot}/02-role-souls/mobile-architect-soul.md`,
  `${managedTeamDocRoot}/02-role-souls/mobile-app-dev-soul.md`,
  `${managedTeamDocRoot}/02-role-souls/backend-api-integrator-soul.md`,
  `${managedTeamDocRoot}/02-role-souls/qa-release-soul.md`,
  `${managedTeamDocRoot}/03-role-capability-matrix.md`,
  `${managedTeamDocRoot}/04-skills-and-agents-matrix.md`,
  `${managedTeamDocRoot}/05-work-processes.md`,
  `${managedTeamDocRoot}/06-gates-and-evidence.md`,
  `${managedTeamDocRoot}/07-new-team-template-guide.md`,
  githubArtifactWorkflowDoc,
  `${managedTeamDocRoot}/99-source-map.md`,
  `${podNativeOpenClawSkillRoot}/README.md`,
  `${codexCliAuthSetupSkillRoot}/SKILL.md`,
  `${codexCliAuthSetupSkillRoot}/scripts/codex-cli-precheck.sh`,
  `${codexCliAuthSetupSkillRoot}/references/report-template.md`,
]) {
  if (!exists(relativePath)) fail(`missing managed mobile app dev team doc: team-doc/${relativePath}`);
}

requireRootTerms('AGENTS.md', [
  '## OpenClaw And Codex Skill Routing',
  'Pod-native OpenClaw skill-only requests use `/workspace/skills/<slug>/SKILL.md` as the runtime shape',
  'team-doc/mobile-app-dev-team/09-pod-native-openclaw-skills/<slug>/',
  'Codex skill or agent requests use `.agents/skills/<skill-name>/SKILL.md` and `.codex/agents/<agent-name>.toml` for primary artifacts',
  'required validators, evals, scripts, and evidence may still be added when the change needs them',
]);

requireDocTerms(`${podNativeOpenClawSkillRoot}/README.md`, [
  'source-only',
  '/workspace/skills/<slug>/SKILL.md',
  'codex-cli-auth-setup',
  'Do not place repo-local Codex CLI artifacts here',
]);

requireRootTerms('docs/plans/work-units/README.md', [
  'docs/plans/work-units/<work-unit-id>/',
  'durable handoff',
  'GitHub branch/commit/PR',
  'status: required | not-applicable | deferred/non-goal',
  'PRD acceptance line or explicit non-goal reference',
  'owner',
  'input artifact',
  'output artifact',
  'acceptance criteria',
  'evidence requirement',
  'dependencies/blockers',
  'open decisions',
  'next responsible role',
  'P0',
  'P1',
  'design-pub-html/<YYYY-MM-DD>/<work-unit-id>/',
  '.evidence/e2e-test/<YYYYMMDD-HHMMSS>-<slug>/',
  '.evidence/local/',
  'Release Gatekeeper (System)',
]);

const sampleWorkUnitRoot = 'docs/plans/work-units/sample-role-handoff';
const sampleWorkUnitDirs = [
  '.',
  '00-product-planning',
  '01-design',
  '02-architecture',
  '03-contract-api',
  '04-mobile-app',
  '05-qa-release',
  '06-gatekeeper',
  '07-pr',
];

for (const dir of sampleWorkUnitDirs) {
  const sampleReadme = dir === '.'
    ? `${sampleWorkUnitRoot}/README.md`
    : `${sampleWorkUnitRoot}/${dir}/README.md`;
  if (!existsRoot(sampleReadme)) fail(`missing sample work-unit folder readme: ${sampleReadme}`);
}

requireRootTerms(`${sampleWorkUnitRoot}/README.md`, [
  'sample-role-handoff',
  'status: required | not-applicable | deferred/non-goal',
  'PRD acceptance line or explicit non-goal reference',
  'GitHub branch/commit/PR handoff link',
]);

requireDocTerms(githubArtifactWorkflowDoc, [
  '# GitHub Artifact Workflow',
  'pod-isolated',
  'No shared storage',
  'GitHub branch/commit/PR',
  'docs/plans/work-units/<work-unit-id>/',
  'status: required | not-applicable | deferred/non-goal',
  'PRD acceptance line or explicit non-goal reference',
  'owner',
  'input artifact',
  'output artifact',
  'acceptance criteria',
  'evidence requirement',
  'dependencies/blockers',
  'open decisions',
  'next responsible role',
  'P0 before Stitch generation',
  'P1 before HTML/image extraction',
  'fetch_screen_code',
  'code.html',
  'getHtml',
  'htmlCode.downloadUrl',
  'design-reviewer',
  'design-pub-html/<YYYY-MM-DD>/<work-unit-id>/',
  'option-a.html',
  'option-a.png',
  'option-b.html',
  'option-b.png',
  'manifest.json',
  'handoff.md',
  '.evidence/e2e-test/<YYYYMMDD-HHMMSS>-<slug>/',
  '.evidence/local/',
  '.evidence/tmp/',
  '.evidence/**/*.log',
  '.evidence/**/raw/',
  'mobile-mcp',
  'exit status',
  'No Gatekeeper SOUL.md',
  'does not prove actual OrbStack/OpenClaw pod execution',
]);

requireDocTerms(`${codexCliAuthSetupSkillRoot}/SKILL.md`, [
  'name: codex-cli-auth-setup',
  'description:',
  '# Codex CLI Auth Setup',
  '## Repo Operations Policy Reference',
  'REPO_OPERATIONS.md',
  'agent-neutral',
  'this agent',
  'Do not duplicate the full root policy',
  '/workspace/CODEX_MANAGED_PATHS.md',
  '/workspace/codex-hooks/codex-run',
  '/workspace/new-mobile-app/',
  'Project path',
  '/workspace/skills/codex-cli-auth-setup/scripts/codex-cli-precheck.sh',
  '--dangerously-bypass-approvals-and-sandbox',
  'Never print auth token values',
  'Report auth presence, file mode, key names, and health status only',
  'redaction',
]);

requireNoDocTerms(`${codexCliAuthSetupSkillRoot}/SKILL.md`, [
  'Boram MUST',
  'Boram must',
  'Boram SHOULD',
  'Boram should',
  'Recommended AGENTS.md policy wording:',
  'Allowed direct actions by this agent:',
  'This agent MUST NOT directly use read/edit/write for Codex-managed repo/path content',
]);

if (exists(`${codexCliAuthSetupSkillRoot}/SKILL.md`)) {
  const skillBody = read(`${codexCliAuthSetupSkillRoot}/SKILL.md`);
  if (/(^|\n)\s*(?:[-*]\s*)?Boram\s+(?:MUST|SHOULD|must|should)\b/.test(skillBody)) {
    fail(`pod-native OpenClaw AGENTS.md policy must use an agent-neutral subject, not Boram: team-doc/${codexCliAuthSetupSkillRoot}/SKILL.md`);
  }

  const skillFrontmatter = parseFrontmatter(read(`${codexCliAuthSetupSkillRoot}/SKILL.md`));
  if (!skillFrontmatter) {
    fail(`pod-native OpenClaw skill missing YAML frontmatter: team-doc/${codexCliAuthSetupSkillRoot}/SKILL.md`);
  } else {
    const keys = Object.keys(skillFrontmatter).sort();
    const unexpectedKeys = keys.filter((key) => !['description', 'name'].includes(key));
    if (skillFrontmatter.name !== 'codex-cli-auth-setup') {
      fail(`pod-native OpenClaw skill frontmatter name must be codex-cli-auth-setup: team-doc/${codexCliAuthSetupSkillRoot}/SKILL.md`);
    }
    if (!skillFrontmatter.description) {
      fail(`pod-native OpenClaw skill frontmatter missing description: team-doc/${codexCliAuthSetupSkillRoot}/SKILL.md`);
    }
    if (unexpectedKeys.length) {
      fail(`pod-native OpenClaw skill frontmatter must only include name and description: ${unexpectedKeys.join(', ')}`);
    }
  }
}

requireDocTerms(`${codexCliAuthSetupSkillRoot}/scripts/codex-cli-precheck.sh`, [
  'set -euo pipefail',
  'redact()',
  'auth/config status, redacted',
  'has_token_like_keys',
  'stored_api_key_present',
]);

requireNoDocTerms(`${codexCliAuthSetupSkillRoot}/scripts/codex-cli-precheck.sh`, [
  'cat ~/.codex/auth.json',
  'cat /root/.codex/auth.json',
  'print(data)',
  'json.dumps(data',
  'OPENAI_API_KEY=',
]);

requireDocTerms(`${codexCliAuthSetupSkillRoot}/references/report-template.md`, [
  'Codex CLI 설치/Auth/무승인 실행 보고',
  'Auth:',
  'auth token 값은 출력하지 않음',
  '--dangerously-bypass-approvals-and-sandbox',
  'status only',
]);

const codexCliPrecheckPath = path.join(docRoot, `${codexCliAuthSetupSkillRoot}/scripts/codex-cli-precheck.sh`);
if (fs.existsSync(codexCliPrecheckPath)) {
  const syntax = spawnSync('bash', ['-n', codexCliPrecheckPath], { encoding: 'utf8' });
  if (syntax.status !== 0) {
    fail(`codex-cli-precheck.sh must pass bash -n: ${syntax.stderr || syntax.stdout}`);
  }
}

const refOrganizationSections = [
  '00-orientation-and-sot',
  '01-organization-model',
  '02-runtime-surfaces',
  '03-role-contracts-and-capabilities',
  '04-workflows-and-handoffs',
  '05-skills-agents-and-tools',
  '06-gates-evidence-and-audit',
  '07-repo-template-and-runtime',
  '08-new-organization-template',
  '99-source-map-and-migration',
];

for (const relativePath of [
  `${refOrganizationRoot}/README.md`,
  ...refOrganizationSections.map((section) => `${refOrganizationRoot}/${section}/README.md`),
  `${refOrganizationRoot}/00-orientation-and-sot/current-project-vs-template.md`,
  `${refOrganizationRoot}/00-orientation-and-sot/purpose.md`,
  `${refOrganizationRoot}/00-orientation-and-sot/sot-priority.md`,
  `${refOrganizationRoot}/02-runtime-surfaces/repo-local-codex-runtime.md`,
  `${refOrganizationRoot}/02-runtime-surfaces/pod-native-openclaw-skills.md`,
  `${refOrganizationRoot}/02-runtime-surfaces/pod-codex-completion-hooks.md`,
  `${refOrganizationRoot}/02-runtime-surfaces/computer-use-and-tool-surfaces.md`,
  `${refOrganizationRoot}/01-organization-model/team-shape.md`,
  `${refOrganizationRoot}/01-organization-model/role-boundaries.md`,
  `${refOrganizationRoot}/01-organization-model/gatekeeper-model.md`,
  `${refOrganizationRoot}/03-role-contracts-and-capabilities/role-soul-template.md`,
  `${refOrganizationRoot}/03-role-contracts-and-capabilities/role-capability-matrix.md`,
  `${refOrganizationRoot}/03-role-contracts-and-capabilities/handoff-responsibilities.md`,
  `${refOrganizationRoot}/04-workflows-and-handoffs/lifecycle-workflow.md`,
  `${refOrganizationRoot}/04-workflows-and-handoffs/durable-github-work-unit.md`,
  `${refOrganizationRoot}/04-workflows-and-handoffs/scenario-overlays-a-h.md`,
  `${refOrganizationRoot}/04-workflows-and-handoffs/failure-loop.md`,
  `${refOrganizationRoot}/05-skills-agents-and-tools/active-skill-agent-policy.md`,
  `${refOrganizationRoot}/05-skills-agents-and-tools/skill-placement-policy.md`,
  `${refOrganizationRoot}/05-skills-agents-and-tools/reviewer-researcher-boundaries.md`,
  `${refOrganizationRoot}/05-skills-agents-and-tools/optional-tool-adoption.md`,
  `${refOrganizationRoot}/06-gates-evidence-and-audit/required-gates.md`,
  `${refOrganizationRoot}/06-gates-evidence-and-audit/evidence-rules.md`,
  `${refOrganizationRoot}/06-gates-evidence-and-audit/human-gates.md`,
  `${refOrganizationRoot}/06-gates-evidence-and-audit/audit-index.md`,
  `${refOrganizationRoot}/07-repo-template-and-runtime/repo-target-tree.md`,
  `${refOrganizationRoot}/07-repo-template-and-runtime/mobile-runtime.md`,
  `${refOrganizationRoot}/07-repo-template-and-runtime/optional-api.md`,
  `${refOrganizationRoot}/07-repo-template-and-runtime/ci-eas-railway.md`,
  `${refOrganizationRoot}/08-new-organization-template/create-new-team-guide.md`,
  `${refOrganizationRoot}/08-new-organization-template/variable-map.md`,
  `${refOrganizationRoot}/08-new-organization-template/checklist.md`,
  `${refOrganizationRoot}/99-source-map-and-migration/source-priority.md`,
  `${refOrganizationRoot}/99-source-map-and-migration/historical-vs-active.md`,
  `${refOrganizationRoot}/99-source-map-and-migration/old-to-new-crosswalk.md`,
  `${refOrganizationRoot}/99-source-map-and-migration/validator-requirements.md`,
]) {
  if (!exists(relativePath)) fail(`missing ref-organization checkpoint document: team-doc/${relativePath}`);
}

const refOrganizationStatusTerms = [
  'Status:',
  'Source class:',
  'Upstream SoT:',
  'Downstream consumers:',
  'Last reviewed date:',
  'Reviewer evidence:',
];

const allowedRefOrganizationStatuses = new Set([
  'reusable template guidance',
  'current-project example',
  'historical source migration',
  'active current SoT mirror',
]);

for (const relativePath of listFiles(refOrganizationRoot, (file) => file.endsWith('.md'))) {
  const body = read(relativePath);
  const topLines = body.split('\n').slice(0, 40).join('\n');
  for (const term of refOrganizationStatusTerms) {
    if (!topLines.includes(term)) {
      fail(`team-doc/${relativePath} missing ref-organization page status field: ${term}`);
    }
  }

  const statusMatch = topLines.match(/^Status:\s*(.+)$/m);
  if (statusMatch && !allowedRefOrganizationStatuses.has(statusMatch[1].trim())) {
    fail(`team-doc/${relativePath} has invalid ref-organization status: ${statusMatch[1].trim()}`);
  }
  const lastReviewedMatch = topLines.match(/^Last reviewed date:\s*(.+)$/m);
  if (lastReviewedMatch && !/^\d{4}-\d{2}-\d{2}$/.test(lastReviewedMatch[1].trim())) {
    fail(`team-doc/${relativePath} has invalid Last reviewed date format: ${lastReviewedMatch[1].trim()}`);
  }
  const reviewerEvidenceMatches = Array.from(topLines.matchAll(/^Reviewer evidence:\s*(.+)$/gm));
  for (const reviewerEvidenceMatch of reviewerEvidenceMatches) {
    const reviewerEvidence = reviewerEvidenceMatch[1].trim();
    if (/pending/i.test(reviewerEvidence)) {
      fail(`team-doc/${relativePath} has unresolved Reviewer evidence: ${reviewerEvidence}`);
    }
    if (!reviewerEvidence.startsWith('.evidence/reviews/')) {
      fail(`team-doc/${relativePath} Reviewer evidence must link .evidence/reviews/: ${reviewerEvidence}`);
    }
  }
}

const refOrganizationCrosswalk = `${refOrganizationRoot}/99-source-map-and-migration/old-to-new-crosswalk.md`;
if (exists(refOrganizationCrosswalk)) {
  const body = read(refOrganizationCrosswalk);
  const allowedCrosswalkStatuses = new Set([
    'move',
    'rewrite',
    'archive-as-scenario',
    'current-project-example',
    'drop-with-reason',
  ]);

  const rows = body
    .split('\n')
    .filter((line) => line.startsWith('| `team-doc/10-structured/'));

  for (const row of rows) {
    const cells = row.split('|').map((cell) => cell.trim());
    const [sourceCell, statusCell, targetCell, reasonCell] = cells.slice(1, 5);
    if (!allowedCrosswalkStatuses.has(statusCell)) {
      fail(`ref-organization crosswalk invalid status "${statusCell}" for ${sourceCell}`);
    }
    if (statusCell === 'drop-with-reason') {
      if (!reasonCell) fail(`ref-organization crosswalk drop-with-reason row missing reason: ${sourceCell}`);
      continue;
    }
    if (!targetCell) {
      fail(`ref-organization crosswalk row missing target: ${sourceCell}`);
      continue;
    }
    if (/Checkpoint|page status block/i.test(targetCell)) {
      fail(`ref-organization crosswalk target must contain repo-relative paths only: ${sourceCell}`);
    }
    const targetPaths = Array.from(targetCell.matchAll(/`([^`]+)`/g), (match) => match[1]);
    if (!targetPaths.length) {
      fail(`ref-organization crosswalk target must include at least one backticked repo-relative path: ${sourceCell}`);
    }
    for (const targetPath of targetPaths) {
      if (!targetPath.startsWith(`team-doc/${refOrganizationRoot}/`)) {
        fail(`ref-organization crosswalk target must live under team-doc/${refOrganizationRoot}: ${sourceCell} -> ${targetPath}`);
      }
      const targetRelativePath = targetPath.replace(/^team-doc\//, '');
      if (!targetRelativePath.endsWith('/')) {
        if (!exists(targetRelativePath)) {
          fail(`ref-organization crosswalk target does not exist: ${sourceCell} -> ${targetPath}`);
        }
      }
    }
  }
}

requireDocTerms(`${refOrganizationRoot}/99-source-map-and-migration/validator-requirements.md`, [
  'Last reviewed date',
  'computer-use/tool surfaces',
  'owner role or routing owner',
  'evidence boundary',
  'not a repo-local Codex artifact unless a SoT says so',
  'docs/plans/work-units/<work-unit-id>/',
  'Gatekeeper has no SOUL.md',
  'TEAM_DOC_ARCHIVE_MANIFEST.json',
  'TEAM_DOC_ARCHIVE_BUNDLE.jsonl',
  'do not enumerate the live',
]);

requireNoDocTerms(`${refOrganizationRoot}/99-source-map-and-migration/validator-requirements.md`, [
  'find team-doc/10-structured',
]);

requireDocTerms(refOrganizationCrosswalk, [
  'TEAM_DOC_ARCHIVE_MANIFEST.json',
  'TEAM_DOC_ARCHIVE_BUNDLE.jsonl',
  'Do not use the live `team-doc/10-structured/` directory as the coverage source',
]);

requireNoDocTerms(refOrganizationCrosswalk, [
  'find team-doc/10-structured',
]);

requireDocTerms(`${refOrganizationRoot}/02-runtime-surfaces/repo-local-codex-runtime.md`, [
  '.agents/skills/<skill-name>/SKILL.md',
  '.codex/agents/<agent-name>.toml',
  '.codex/hooks.json',
  '.codex/hooks/',
  '.codex/config.toml',
  'repo-local Codex',
  'not `/workspace/skills/<slug>/SKILL.md`',
  'not `/workspace/codex-hooks`',
]);

requireDocTerms(`${refOrganizationRoot}/00-orientation-and-sot/purpose.md`, [
  'reusable reference-organization',
  'current WonderMove mobile project',
  'TEAM_DOC_ARCHIVE_MANIFEST.json',
  'TEAM_DOC_ARCHIVE_BUNDLE.jsonl',
  'current SoT',
  'future organizations',
]);

requireDocTerms(`${refOrganizationRoot}/00-orientation-and-sot/sot-priority.md`, [
  'AGENTS.md',
  'PROJECT_ENVIRONMENT.md',
  '.agents/skills',
  '.codex/agents',
  'team-doc/mobile-app-dev-team',
  'TEAM_DOC_ARCHIVE_MANIFEST.json',
  'TEAM_DOC_ARCHIVE_BUNDLE.jsonl',
]);

requireDocTerms(`${refOrganizationRoot}/02-runtime-surfaces/pod-native-openclaw-skills.md`, [
  '/workspace/skills/<slug>/SKILL.md',
  'team-doc/mobile-app-dev-team/09-pod-native-openclaw-skills/<slug>/',
  'pod-native OpenClaw',
  'not `.agents/skills/<skill-name>/SKILL.md`',
  'source-only',
]);

requireDocTerms(`${refOrganizationRoot}/02-runtime-surfaces/pod-codex-completion-hooks.md`, [
  '/workspace/codex-hooks',
  'not `/workspace/skills/<slug>/SKILL.md`',
  'not `.codex/hooks`',
  'per-agent E2E',
  'local repo/source validation does not prove actual OpenClaw system event delivery',
]);

requireDocTerms(`${refOrganizationRoot}/02-runtime-surfaces/computer-use-and-tool-surfaces.md`, [
  'computer-use/tool surfaces',
  'owner role or routing owner',
  'allowed use cases',
  'evidence boundary',
  'human-gated',
  'not a repo-local Codex artifact unless a SoT says so',
]);

requireDocTerms(`${refOrganizationRoot}/01-organization-model/team-shape.md`, [
  'Display Title',
  'Operating Role',
  '6 LLM roles plus 1 non-LLM deterministic Gatekeeper',
  'future organizations may change role names or counts',
  'avoid adding roles until a repeated ownership gap exists',
  'non-LLM deterministic gates separately',
]);

requireDocTerms(`${refOrganizationRoot}/01-organization-model/role-boundaries.md`, [
  'Product/Planning',
  'Design',
  'Mobile Architect',
  'Mobile App Dev',
  'Backend/API Integrator',
  'QA/Release',
  'must not absorb',
  'packages/contracts',
  'read-only reviewer',
]);

requireDocTerms(`${refOrganizationRoot}/01-organization-model/gatekeeper-model.md`, [
  'Release Gatekeeper (System)',
  'non-LLM',
  'deterministic',
  'No Gatekeeper SOUL.md',
  'cannot replace human approval',
  'cannot accept failed-gate risk',
]);

requireDocTerms(`${refOrganizationRoot}/03-role-contracts-and-capabilities/role-soul-template.md`, [
  'Display Title',
  'Operating Role',
  'Authority Level',
  'Mission',
  'Responsibilities',
  'Inputs',
  'Outputs',
  'Available skills',
  'Available read-only agents',
  'Human gate triggers',
  'Gatekeeper does not inherit this template',
]);

requireDocTerms(`${refOrganizationRoot}/03-role-contracts-and-capabilities/role-capability-matrix.md`, [
  'Can Do',
  'Produces',
  'Must Handoff To',
  'Must Not Do',
  'Release Gatekeeper (System)',
  'LLM judgment',
  'SOUL.md',
  'owner',
  'input artifact',
  'output artifact',
  'acceptance criteria',
  'evidence requirement',
  'next responsible role',
  'GitHub branch/commit/PR',
  'docs/plans/work-units/<work-unit-id>/',
]);

requireDocTerms(`${refOrganizationRoot}/03-role-contracts-and-capabilities/handoff-responsibilities.md`, [
  'owner',
  'input artifact',
  'output artifact',
  'acceptance criteria',
  'evidence requirement',
  'next responsible role',
  'GitHub branch/commit/PR',
  'docs/plans/work-units/<work-unit-id>/',
]);

requireDocTerms(`${refOrganizationRoot}/04-workflows-and-handoffs/lifecycle-workflow.md`, [
  'Intake And Planning',
  'Design Readiness',
  'API Readiness',
  'Implementation',
  'QA And Release Evidence',
  'Failure Loop',
  'Reviewer(xhigh)',
  'docs/plans/work-units/<work-unit-id>/',
]);

requireDocTerms(`${refOrganizationRoot}/04-workflows-and-handoffs/durable-github-work-unit.md`, [
  'GitHub branch/commit/PR',
  'docs/plans/work-units/<work-unit-id>/',
  'status: required | not-applicable | deferred/non-goal',
  'PRD acceptance line or explicit non-goal reference',
  'owner',
  'input artifact',
  'output artifact',
  'acceptance criteria',
  'evidence requirement',
  'dependencies/blockers',
  'open decisions',
  'next responsible role',
  'handoff link',
  'canonical evidence',
  '.evidence/local/',
]);

requireDocTerms(`${refOrganizationRoot}/04-workflows-and-handoffs/scenario-overlays-a-h.md`, [
  'Case A',
  'Case B',
  'Case C',
  'Case D',
  'Case E',
  'Case F',
  'Case G',
  'Case H',
  'scenario overlays',
  'not primary navigation',
  'current SoT',
]);

requireDocTerms(`${refOrganizationRoot}/04-workflows-and-handoffs/failure-loop.md`, [
  'Failed check remains failed',
  'wm-gate-fix-advisor',
  'owning implementation workflow',
  'QA/Release',
  'Product/Planning',
  'human owner',
  'failed-gate risk acceptance',
]);

requireDocTerms(`${refOrganizationRoot}/05-skills-agents-and-tools/active-skill-agent-policy.md`, [
  'actual `.agents/skills` directory',
  'active repo-local skill',
  'legacy mobile-* agents',
  'read-only',
  'repo skills remain authoritative',
]);

requireDocTerms(`${refOrganizationRoot}/05-skills-agents-and-tools/skill-placement-policy.md`, [
  '.agents/skills/<skill-name>/SKILL.md',
  '/workspace/skills/<slug>/SKILL.md',
  '/workspace/codex-hooks',
  'computer-use/tool surfaces',
  'not a repo-local Codex artifact unless a SoT says so',
]);

requireDocTerms(`${refOrganizationRoot}/05-skills-agents-and-tools/reviewer-researcher-boundaries.md`, [
  'read-only',
  'source references',
  'must not recursively delegate',
  'must not edit files',
  'must not approve failed gates',
]);

requireDocTerms(`${refOrganizationRoot}/05-skills-agents-and-tools/optional-tool-adoption.md`, [
  'optional',
  'recurring process gap',
  'SoT',
  'validator',
  'human gate',
]);

requireDocTerms(`${refOrganizationRoot}/06-gates-evidence-and-audit/required-gates.md`, [
  'pnpm run validate:team-doc',
  'pnpm run test:runtime',
  'pnpm turbo run lint test',
  'pnpm run test:local-harness',
  'pnpm --filter mobile exec expo install --check',
  'codex mcp list',
  'mobile-mcp',
  'Maestro',
  'Release Gatekeeper (System)',
]);

requireDocTerms(`${refOrganizationRoot}/06-gates-evidence-and-audit/evidence-rules.md`, [
  'Done requires linked artifacts',
  'canonical evidence',
  '.evidence/e2e-test/<YYYYMMDD-HHMMSS>-<slug>/',
  'command output',
  'exit status',
  'must not print or persist secrets',
  '.evidence/local/',
]);

requireDocTerms(`${refOrganizationRoot}/06-gates-evidence-and-audit/human-gates.md`, [
  'Production submit',
  'Payment',
  'PII',
  'External messaging',
  'Legal',
  'Business/budget',
  'Irreversible scope tradeoff',
  'Accepting risk after a failed gate',
]);

requireDocTerms(`${refOrganizationRoot}/06-gates-evidence-and-audit/audit-index.md`, [
  'historical evidence',
  'current evidence',
  'source map',
  'reviewer evidence',
  'command output',
  'local validation does not prove actual OpenClaw pod execution',
]);

requireDocTerms(`${refOrganizationRoot}/07-repo-template-and-runtime/repo-target-tree.md`, [
  'apps/mobile',
  'apps/api',
  'packages/contracts',
  '.agents/skills',
  '.codex/agents',
  'current-project example',
  'future organizations may have different repo layouts',
]);

requireDocTerms(`${refOrganizationRoot}/07-repo-template-and-runtime/mobile-runtime.md`, [
  'Expo SDK 56',
  'React Native',
  'NativeWind',
  'testID',
  'mobile-mcp',
  'current-project example',
]);

requireDocTerms(`${refOrganizationRoot}/07-repo-template-and-runtime/optional-api.md`, [
  'apps/api',
  'packages/contracts',
  'single source of truth',
  'routes',
  'services',
  'db',
  'optional',
]);

requireDocTerms(`${refOrganizationRoot}/07-repo-template-and-runtime/ci-eas-railway.md`, [
  'quality gate',
  'pnpm run test:runtime',
  'pnpm turbo run lint test',
  'pnpm run test:local-harness',
  'EAS',
  'Railway',
  'does not prove full mobile release readiness',
]);

requireDocTerms(`${refOrganizationRoot}/08-new-organization-template/create-new-team-guide.md`, [
  'Freeze Source Inputs',
  'Define Team Shape',
  'Write Role SOUL.md Files',
  'Create Capability Matrix',
  'Create Skill/Agent Matrix',
  'Define Process',
  'Add Validation',
  'Reviewer(xhigh)',
]);

requireDocTerms(`${refOrganizationRoot}/08-new-organization-template/variable-map.md`, [
  'organization_name',
  'repo_root',
  'managed_docs_root',
  'runtime_surfaces',
  'role_families',
  'human_gates',
  'evidence_paths',
]);

requireDocTerms(`${refOrganizationRoot}/08-new-organization-template/checklist.md`, [
  'Source inputs frozen',
  'Runtime surfaces separated',
  'Roles and gates separated',
  'Durable handoff defined',
  'Reviewer(xhigh) completed',
  'Validation commands passed',
]);

requireDocTerms(`${refOrganizationRoot}/99-source-map-and-migration/source-priority.md`, [
  'AGENTS.md',
  'PROJECT_ENVIRONMENT.md',
  '.agents/skills',
  '.codex/agents',
  'team-doc/mobile-app-dev-team',
  'TEAM_DOC_ARCHIVE_MANIFEST.json',
  'TEAM_DOC_ARCHIVE_BUNDLE.jsonl',
]);

requireDocTerms(`${refOrganizationRoot}/99-source-map-and-migration/historical-vs-active.md`, [
  'active current SoT',
  'historical source',
  'current-project example',
  'reusable template guidance',
  'TEAM_DOC_ARCHIVE_MANIFEST.json',
  'TEAM_DOC_ARCHIVE_BUNDLE.jsonl',
  'current SoT wins',
]);

requireDocTerms(`${managedTeamDocRoot}/README.md`, [
  'ref-organization/',
  'Reference organization',
]);

requireDocTerms(`${managedTeamDocRoot}/99-source-map.md`, [
  'ref-organization',
  '12-ref-organization-goal-plan.md',
  'old-to-new-crosswalk.md',
]);

requireDocTerms(`${managedTeamDocRoot}/01-team-composition.md`, [
  '6 LLM roles plus 1 non-LLM deterministic Gatekeeper',
  'Chief Product Officer (CPO) / Product Delivery Lead',
  'Mobile Architect / Technical Lead',
  'Operating Role',
  'No Gatekeeper SOUL.md',
]);

requireDocTerms(`${managedTeamDocRoot}/04-skills-and-agents-matrix.md`, [
  'Active repo-local skills',
  'Chief Product Officer (CPO) / Product Delivery Lead',
  'Operating Role',
  '$wm routing',
  'legacy mobile-* agents',
]);

requireDocTerms(`${managedTeamDocRoot}/08-role-title-update-plan.md`, [
  'Chief Product Officer (CPO) / Product Delivery Lead',
  'Operating Role',
  'Do not use CTO as a runtime role, agent, fixture, SOUL identity, H1, or filename',
]);

forbidDocTerms(`${managedTeamDocRoot}/08-role-title-update-plan.md`, [
  'CTO / Mobile Technical Lead',
  '# CTO / Mobile Technical Lead SOUL.md',
]);

const allowedManagedCtoSafetySentence =
  'Do not use CTO as a runtime role, agent, fixture, SOUL identity, H1, or filename';
for (const relativePath of listFiles(managedTeamDocRoot, (file) => file.endsWith('.md'))) {
  const fileName = path.basename(relativePath);
  if (/(^|[-_. ])cto([-_. ]|$)/i.test(fileName)) {
    fail(`managed team doc filename must not introduce CTO: team-doc/${relativePath}`);
  }

  const bodyWithoutAllowedSafetySentence = read(relativePath).replaceAll(allowedManagedCtoSafetySentence, '');
  if (/\bCTO\b/i.test(bodyWithoutAllowedSafetySentence)) {
    fail(`managed team doc must not introduce CTO outside the approved safety sentence: team-doc/${relativePath}`);
  }
}

requireDocTerms(`${managedTeamDocRoot}/02-role-souls/product-planning-soul.md`, [
  'po-requirement-office-hours',
  'po-work-unit-planning-and-agent-sprint',
  'po-prd-to-execution',
  'po-planning-completeness-review',
  'Do not approve Design quality during P0/P1',
  'approve only PRD fit, non-goals, evidence readiness, and human-gate routing',
]);

requireDocTerms(`${managedTeamDocRoot}/02-role-souls/design-soul.md`, [
  'design-mobile-design-handoff',
  'design-stitch-mcp-operating-rules',
  'Stitch',
  'P0 and P1 packet preparation for Product/Planning scope/evidence approval',
  'Do not ask Product/Planning to own design quality',
]);

requireDocTerms(`${managedTeamDocRoot}/02-role-souls/mobile-architect-soul.md`, [
  'No dedicated repo-local skill is currently assigned to this role',
  'Do not absorb Mobile App Dev implementation ownership',
  'Do not absorb Backend/API Integrator service or API ownership',
]);

forbidDocTerms(`${managedTeamDocRoot}/02-role-souls/mobile-app-dev-soul.md`, [
  'Runtime template note: This document is a runtime `/workspace/SOUL.md` template for a generated Mobile App Dev agent. It is not a raw `create-full` `soulMd` seed payload. For seed payload generation, follow the platform injection rules recorded in the 01-5 SOUL source and OrbStack canary evidence instead of copying this file verbatim.',
]);

requireDocTerms(`${managedTeamDocRoot}/02-role-souls/mobile-app-dev-soul.md`, [
  'mobile-app-dev-workflow',
  'wm-implementation-reviewer',
  'wm-docs-researcher',
  'packages/contracts',
  'NativeWind',
  'React Native primitives',
  'testID',
  'shadcn/ui',
  'customer app config or secrets',
]);

requireDocTerms(`${managedTeamDocRoot}/02-role-souls/backend-api-integrator-soul.md`, [
  'mobile-backend-api-integrator-workflow',
  'packages/contracts',
  'Backend/API Service Owner',
  'backend implementation',
  'DB schema/migration',
  'deployment config',
  'runtime smoke',
  'rollback note',
  'service evidence',
]);

requireDocTerms(`${managedTeamDocRoot}/02-role-souls/qa-release-soul.md`, [
  'e2e-test',
  'qa-railway-workflow',
  'Do not treat RN Web evidence as native behavior proof',
  'Do not treat Railway deployment evidence as full mobile release readiness',
  'Do not accept failed gate risk on behalf of Product/Planning or a human owner',
]);

for (const [roleFile, title] of [
  ['product-planning-soul.md', '# Product/Planning SOUL.md'],
  ['design-soul.md', '# Design SOUL.md'],
  ['mobile-architect-soul.md', '# Mobile Architect SOUL.md'],
  ['mobile-app-dev-soul.md', '# Mobile App Dev SOUL.md'],
  ['backend-api-integrator-soul.md', '# Backend/API Integrator SOUL.md'],
  ['qa-release-soul.md', '# QA/Release SOUL.md'],
]) {
  requireOrderedTopLevelHeadings(`${managedTeamDocRoot}/02-role-souls/${roleFile}`, [
    title,
    ...roleSoulRuntimeHeadings,
  ]);
}

for (const [roleFile, displayTitle, operatingRole, authorityLevel] of [
  ['product-planning-soul.md', 'Chief Product Officer (CPO) / Product Delivery Lead', 'Product/Planning', 'Executive / Delivery Lead'],
  ['design-soul.md', 'Product Designer', 'Design', 'Practitioner'],
  ['mobile-architect-soul.md', 'Mobile Architect / Technical Lead', 'Mobile Architect', 'Technical Lead'],
  ['mobile-app-dev-soul.md', 'Mobile App Developer', 'Mobile App Dev', 'Practitioner'],
  ['backend-api-integrator-soul.md', 'Backend/API Engineer', 'Backend/API Integrator', 'Practitioner'],
  ['qa-release-soul.md', 'QA/Release Engineer', 'QA/Release', 'Practitioner / Reviewer'],
]) {
  requireDocTerms(`${managedTeamDocRoot}/02-role-souls/${roleFile}`, [
    `Display Title: ${displayTitle}`,
    `Operating Role: ${operatingRole}`,
    `Authority Level: ${authorityLevel}`,
  ]);
}

requireDocTerms(`${managedTeamDocRoot}/06-gates-and-evidence.md`, [
  'Release Gatekeeper (System)',
  'Railway Boundary',
  'It does not prove:',
  'Full production release approval',
  'docs/plans/work-units/<work-unit-id>/',
  'durable GitHub handoff',
  'canonical evidence',
]);

requireDocTerms(`${managedTeamDocRoot}/99-source-map.md`, [
  'Chief Product Officer (CPO) / Product Delivery Lead',
  'Operating Role',
  'active-vs-historical skill crosswalk',
  'mobile-api-contract',
  'mobile-qa-release',
  'qa-railway-workflow',
  '10-github-artifact-workflow.md',
  'docs/plans/work-units/<work-unit-id>/',
]);

if (errors.length) {
  console.error(errors.map((error) => `- ${error}`).join('\n'));
  process.exit(1);
}

console.log('Validated current team-doc managed docs.');
