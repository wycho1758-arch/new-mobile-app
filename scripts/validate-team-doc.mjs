#!/usr/bin/env node
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const docRoot = path.join(root, 'team-doc');
const errors = [];

const requiredDirs = [
  '.',
  '00-source',
  '10-structured',
  '10-structured/00-meta-process',
  '10-structured/01-mobile-org',
  '10-structured/02-workflows',
  '10-structured/03-skills',
  '10-structured/04-soul-contracts',
  '10-structured/05-repo-template',
  '10-structured/06-codex-runtime',
  '10-structured/07-evidence-and-audit',
  '_meta',
];

const allowedDocTypes = new Set([
  'policy',
  'procedure',
  'template',
  'reference',
  'registry',
  'evidence',
  'runtime',
  'role-contract',
  'operational-guide',
  'index',
]);

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

function readJson(relativePath) {
  try {
    return JSON.parse(read(relativePath));
  } catch (error) {
    fail(`${relativePath} must be valid JSON: ${error.message}`);
    return null;
  }
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

for (const dir of requiredDirs) {
  const readme = path.join(dir, 'readme.md');
  if (!exists(readme)) fail(`missing lowercase index: team-doc/${readme}`);
}

const pageMap = exists('_meta/confluence-page-map.json')
  ? readJson('_meta/confluence-page-map.json')
  : (fail('missing team-doc/_meta/confluence-page-map.json'), null);
const splitMap = exists('_meta/split-map.json')
  ? readJson('_meta/split-map.json')
  : (fail('missing team-doc/_meta/split-map.json'), null);

if (pageMap) {
  if (!pageMap.homePageId) fail('confluence-page-map.json missing homePageId');
  if (!pageMap.fetchedAt) fail('confluence-page-map.json missing fetchedAt');
  if (!Array.isArray(pageMap.nodes)) fail('confluence-page-map.json nodes must be an array');

  const nodes = Array.isArray(pageMap.nodes) ? pageMap.nodes : [];
  const pageNodes = nodes.filter((node) => node.type === 'page');
  if (!pageNodes.length) fail('confluence-page-map.json must include at least one page node');

  for (const node of pageNodes) {
    for (const key of ['id', 'title', 'version', 'url', 'sourcePath']) {
      if (!node[key]) fail(`page node missing ${key}: ${node.id || node.title || '<unknown>'}`);
    }
    if (node.sourcePath && !exists(node.sourcePath)) {
      fail(`sourcePath does not exist for page ${node.id}: ${node.sourcePath}`);
    }
    if (node.sourcePath && !node.sourcePath.startsWith('00-source/')) {
      fail(`sourcePath must live under 00-source for page ${node.id}: ${node.sourcePath}`);
    }
    if (node.depth > 0 && node.parentId && !node.sourcePath?.includes('/')) {
      fail(`sourcePath must mirror parent/child tree for page ${node.id}: ${node.sourcePath}`);
    }
  }
}

const sourceFiles = listFiles('00-source', (file) => file.endsWith('.md') && !file.endsWith('/readme.md'));
for (const file of sourceFiles) {
  const frontmatter = parseFrontmatter(read(file));
  if (!frontmatter) {
    fail(`source markdown missing frontmatter: team-doc/${file}`);
    continue;
  }
  for (const key of ['pageId', 'sourceTitle', 'sourceVersion', 'sourceUrl', 'fetchedAt']) {
    if (!frontmatter[key]) fail(`source markdown missing ${key}: team-doc/${file}`);
  }
}

const structuredFiles = listFiles(
  '10-structured',
  (file) => file.endsWith('.md') && !file.endsWith('/readme.md'),
);
for (const file of structuredFiles) {
  const frontmatter = parseFrontmatter(read(file));
  if (!frontmatter) {
    fail(`structured markdown missing frontmatter: team-doc/${file}`);
    continue;
  }
  for (const key of ['docType', 'sourcePageId', 'sourceTitle', 'sourceVersion', 'sourceHeading']) {
    if (!frontmatter[key]) fail(`structured markdown missing ${key}: team-doc/${file}`);
  }
  if (frontmatter.docType && !allowedDocTypes.has(frontmatter.docType)) {
    fail(`structured markdown has invalid docType "${frontmatter.docType}": team-doc/${file}`);
  }
}

const currentSkillMatrix = exists('10-structured/03-skills/mvp-skill-matrix.md')
  ? read('10-structured/03-skills/mvp-skill-matrix.md')
  : '';
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
    if (!currentSkillMatrix.includes(`\`${skillSlug}\``)) {
      fail(`current skill matrix missing generated repo skill: ${skillSlug}`);
    }
    if (managedSkillMatrix && !managedSkillMatrix.includes(`\`${skillSlug}\``)) {
      fail(`managed skill matrix missing active repo-local skill: ${skillSlug}`);
    }
  }
}

const obsoleteGeneratedSkillSlugs = [
  'mobile-prd-to-execution',
  'mobile-design-handoff',
  'mobile-api-contract',
  'mobile-qa-release',
  'mobile-gatekeeper',
  'mobile-project-bootstrap-workflow',
];

for (const file of structuredFiles) {
  const body = read(file);
  if (/Sentry|@sentry|SENTRY/.test(body)) {
    fail(`structured doc must not describe Sentry as current/default template scope: team-doc/${file}`);
  }
  if (/`title`, `counter`, `increment`/.test(body)) {
    fail(`structured doc has obsolete mobile testID set: team-doc/${file}`);
  }
  for (const slug of obsoleteGeneratedSkillSlugs) {
    if (body.includes(`\`${slug}\``)) {
      fail(`structured doc references obsolete generated skill slug ${slug}: team-doc/${file}`);
    }
  }
}

if (pageMap && splitMap) {
  if (!Array.isArray(splitMap.entries)) fail('split-map.json entries must be an array');
  const entries = Array.isArray(splitMap.entries) ? splitMap.entries : [];
  const entryByPage = new Map(entries.map((entry) => [String(entry.sourcePageId), entry]));
  const sourcePageIds = pageMap.nodes
    .filter((node) => node.type === 'page')
    .map((node) => String(node.id));

  for (const pageId of sourcePageIds) {
    const entry = entryByPage.get(pageId);
    if (!entry) {
      fail(`split-map.json missing source page ${pageId}`);
      continue;
    }
    if (!['split', 'index', 'source-only'].includes(entry.status)) {
      fail(`split-map entry ${pageId} has invalid status: ${entry.status}`);
    }
    if (!Array.isArray(entry.files) || entry.files.length === 0) {
      fail(`split-map entry ${pageId} must map to at least one file`);
      continue;
    }
    for (const file of entry.files) {
      if (!exists(file)) fail(`split-map entry ${pageId} references missing file: ${file}`);
    }
  }
}

const generatedFiles = listFiles('.', (file) => /\.(md|json|sh)$/.test(file));
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
  '## OpenClaw AGENTS.md Codex-only Repo Work Policy',
  'this agent MUST use Codex CLI as the execution engine',
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

console.log(`Validated team-doc: ${sourceFiles.length} source files, ${structuredFiles.length} structured files.`);
