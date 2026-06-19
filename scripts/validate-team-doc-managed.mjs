#!/usr/bin/env node
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { findSecretLikeValues } from './lib/secret-patterns.mjs';

const root = process.cwd();
const docRoot = root;
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

const managedSkillMatrix = exists('mobile-app-dev-team/runtime-sources/codex-skill-agent-matrix.md')
  ? read('mobile-app-dev-team/runtime-sources/codex-skill-agent-matrix.md')
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
for (const file of generatedFiles) {
  const body = read(file);
  for (const match of findSecretLikeValues(body)) {
    fail(`probable secret or concrete credential in ${file}:${match.line}`);
  }
}

function requireDocTerms(relativePath, terms) {
  if (!exists(relativePath)) {
    fail(`missing required role document: ${relativePath}`);
    return;
  }
  const body = read(relativePath);
  for (const term of terms) {
    if (!body.includes(term)) {
      fail(`${relativePath} missing required role-boundary term: ${term}`);
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
    fail(`missing required role document: ${relativePath}`);
    return;
  }
  const body = read(relativePath);
  for (const term of terms) {
    if (body.includes(term)) {
      fail(`${relativePath} includes forbidden role-boundary term: ${term}`);
    }
  }
}

function requireNoDocTerms(relativePath, terms) {
  if (!exists(relativePath)) {
    fail(`missing required document: ${relativePath}`);
    return;
  }
  const body = read(relativePath);
  for (const term of terms) {
    if (body.includes(term)) {
      fail(`${relativePath} includes forbidden term: ${term}`);
    }
  }
}

function requireOrderedTopLevelHeadings(relativePath, headings) {
  if (!exists(relativePath)) {
    fail(`missing required role document: ${relativePath}`);
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
      fail(`${relativePath} missing ordered runtime SOUL heading: ${expected}`);
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
const governanceRoot = `${managedTeamDocRoot}/governance`;
const organizationRoot = `${managedTeamDocRoot}/organization`;
const workflowRoot = `${managedTeamDocRoot}/workflows`;
const sotAndPrinciplesDoc = `${governanceRoot}/sot-and-principles.md`;
const teamCompositionDoc = `${organizationRoot}/team-composition.md`;
const roleCapabilityMatrixDoc = `${organizationRoot}/role-capability-matrix.md`;
const newTeamTemplateGuideDoc = `${organizationRoot}/new-team-template-guide.md`;
const workProcessesDoc = `${workflowRoot}/Product_Planning_WORKFLOW.md`;
const gatesAndEvidenceDoc = `${governanceRoot}/gates-and-evidence.md`;
const humanOpsLiveReadinessAnnexDoc = `${governanceRoot}/human-ops-live-readiness-annex.md`;
const appEasOtaRollbackRunbookDoc = `${governanceRoot}/app-eas-ota-rollback-runbook.md`;
const entryCaseRoutingDoc = `${workflowRoot}/entry-case-routing.md`;
const githubArtifactWorkflowDoc = `${workflowRoot}/github-artifact-workflow.md`;
const nativeE2eStrategyDoc = `${workflowRoot}/native-e2e-strategy.md`;
const podNativeOpenClawSkillRoot = `${managedTeamDocRoot}/runtime-sources/pod-native-openclaw-skills`;
const organizationsRuntimeSource = `${managedTeamDocRoot}/runtime-sources/ORGANIZATIONS.md`;
const legacyPodNativeOpenClawSkillRoot = `${managedTeamDocRoot}/09-pod-native-openclaw-skills`;
const codexCliAuthSetupSkillRoot = `${podNativeOpenClawSkillRoot}/codex-cli-auth-setup`;
const podRoleBootstrapSkillRoot = `${podNativeOpenClawSkillRoot}/pod-role-bootstrap`;
const projectBootstrapSkillRoot = `${podNativeOpenClawSkillRoot}/project-bootstrap`;
const openclawPodSkillsSyncSkillRoot = `${podNativeOpenClawSkillRoot}/openclaw-pod-skills-sync`;
const easRobotAuthSetupSkillRoot = `${podNativeOpenClawSkillRoot}/eas-robot-auth-setup`;
const stitchAdcSetupSkillRoot = `${podNativeOpenClawSkillRoot}/stitch-adc-setup`;
const codexRoleWorkflowSkillRoot = `${podNativeOpenClawSkillRoot}/codex-role-workflow`;
const productPlanningRuntimeSpec = `${podNativeOpenClawSkillRoot}/product-planning-agent-runtime-spec.md`;
const designRuntimeSpec = `${podNativeOpenClawSkillRoot}/design-agent-runtime-spec.md`;
const mobileArchitectRuntimeSpec = `${podNativeOpenClawSkillRoot}/mobile-architect-agent-runtime-spec.md`;
const mobileAppDevRuntimeSpec = `${podNativeOpenClawSkillRoot}/mobile-app-dev-agent-runtime-spec.md`;
const backendApiIntegratorRuntimeSpec = `${podNativeOpenClawSkillRoot}/backend-api-integrator-agent-runtime-spec.md`;
const qaReleaseRuntimeSpec = `${podNativeOpenClawSkillRoot}/qa-release-agent-runtime-spec.md`;
const refOrganizationRoot = `${managedTeamDocRoot}/ref-organization`;
const roleSoulRoot = `${managedTeamDocRoot}/runtime-sources/role-souls`;
const legacyRoleSoulRoot = `${managedTeamDocRoot}/02-role-souls`;
const archiveRoot = `${managedTeamDocRoot}/_archive`;
const completedPlanArchiveRoot = `${archiveRoot}/completed-plans`;

const projectBootstrapUserLanguageContractTerms = [
  'PROJECT_BOOTSTRAP_USER_LANGUAGE',
  'PROJECT_BOOTSTRAP_CURRENT_USER_LANGUAGE',
  'PROJECT_BOOTSTRAP_USER_LANGUAGE=ko',
  'PROJECT_BOOTSTRAP_USER_LANGUAGE=en',
  'PROJECT_BOOTSTRAP_USER_LANGUAGE=auto',
  'fallback_reason: "missing_current_user_language_hint"',
  'fallback_reason: "unsupported_requested_language"',
];

const projectBootstrapAgentLanguageOwnershipTerms = [
  'agent running project-bootstrap-preflight.sh sets PROJECT_BOOTSTRAP_CURRENT_USER_LANGUAGE from the current user message',
  'PROJECT_BOOTSTRAP_CURRENT_USER_LANGUAGE=ko-KR',
  'PROJECT_BOOTSTRAP_CURRENT_USER_LANGUAGE=한국어',
];

const projectBootstrapUserSummaryLanguageTerms = [
  'user_summary.language.requested',
  'user_summary.language.current_user_hint',
  'user_summary.language.selected',
  'user_summary.language.fallback_reason',
];

const projectBootstrapKoreanGeneratedOutputTerms = [
  'PROJECT_BOOTSTRAP_USER_LANGUAGE=ko',
  '## 도움이 필요합니다',
  '### 현재 상태',
  '### 이미 확인한 내용',
  '### 제가 다음에 할 수 있는 일',
  '### 사용자에게 필요한 최소 작업',
  '### 채팅으로 보내지 마세요',
  'GitHub 연결이 필요합니다',
];

const projectBootstrapKoreanModeSmokeTerms = [
  'case_project_preflight_korean_language_contract',
  'case_project_preflight_korean_language_fallbacks',
  'case_project_preflight_korean_full_blocker_matrix',
  'assert_korean_primary_guidance_not_contains',
  'assert_report_blockers_support_only',
  '## Action needed',
  '### What you need to do',
  ...projectBootstrapKoreanGeneratedOutputTerms,
];

const projectBootstrapExpandedBlockerMatrixTerms = [
  'full blocker matrix',
  'role identity',
  'repo/managed path',
  'Git identity',
  'CLI/runtime',
  'package-manager',
  'pnpm-pin-mismatch',
  'package manager mismatch',
  'package.json',
  'pnpm-lock.yaml',
  'corepack --version',
  'pnpm --version',
  'pnpm@9.15.9',
  'MCP',
  'conditional login/auth',
  'GitHub auth',
  'secure credentials/API/Railway',
  'public non-secret app config',
  'human-gate/v1',
  'nested pod role report',
];

const projectBootstrapSupportOnlyRawBlockerTerms = [
  'raw blocker IDs are support-only',
  'support-only raw blockers',
  'Raw blockers must appear only in support details and JSON',
];

const projectBootstrapBrowserComputerUseLoginTerms = [
  'browser-use',
  'computer-use',
  'open or guide the login surface',
  'user only signs in, approves, or enters credentials in the real login surface',
];

for (const relativePath of [
  `${managedTeamDocRoot}/README.md`,
  sotAndPrinciplesDoc,
  teamCompositionDoc,
  `${roleSoulRoot}/product-planning-soul.md`,
  `${roleSoulRoot}/design-soul.md`,
  `${roleSoulRoot}/mobile-architect-soul.md`,
  `${roleSoulRoot}/mobile-app-dev-soul.md`,
  `${roleSoulRoot}/backend-api-integrator-soul.md`,
  `${roleSoulRoot}/qa-release-soul.md`,
  roleCapabilityMatrixDoc,
  `${managedTeamDocRoot}/runtime-sources/codex-skill-agent-matrix.md`,
  workProcessesDoc,
  gatesAndEvidenceDoc,
  newTeamTemplateGuideDoc,
  `${managedTeamDocRoot}/runtime-sources/pod-environment-bootstrap.md`,
  nativeE2eStrategyDoc,
  humanOpsLiveReadinessAnnexDoc,
  entryCaseRoutingDoc,
  appEasOtaRollbackRunbookDoc,
  githubArtifactWorkflowDoc,
  `${managedTeamDocRoot}/source-map.md`,
  `${podNativeOpenClawSkillRoot}/README.md`,
  `${codexCliAuthSetupSkillRoot}/SKILL.md`,
  `${codexCliAuthSetupSkillRoot}/scripts/codex-cli-precheck.sh`,
  `${codexCliAuthSetupSkillRoot}/references/report-template.md`,
  `${podRoleBootstrapSkillRoot}/SKILL.md`,
  `${podRoleBootstrapSkillRoot}/scripts/pod-bootstrap.sh`,
  `${podRoleBootstrapSkillRoot}/references/report-template.md`,
  `${projectBootstrapSkillRoot}/SKILL.md`,
  `${projectBootstrapSkillRoot}/scripts/project-bootstrap-agent-setup.sh`,
  `${projectBootstrapSkillRoot}/scripts/project-bootstrap-preflight.sh`,
  `${projectBootstrapSkillRoot}/references/report-template.md`,
  'evals/skills/project-bootstrap-agent-setup-smoke.sh',
  `${easRobotAuthSetupSkillRoot}/SKILL.md`,
  `${easRobotAuthSetupSkillRoot}/scripts/eas-robot-auth-precheck.sh`,
  `${easRobotAuthSetupSkillRoot}/references/report-template.md`,
  `${stitchAdcSetupSkillRoot}/SKILL.md`,
  `${stitchAdcSetupSkillRoot}/scripts/stitch-adc-precheck.sh`,
  `${stitchAdcSetupSkillRoot}/references/report-template.md`,
  'evals/skills/stitch-adc-setup-smoke.sh',
  `${codexRoleWorkflowSkillRoot}/SKILL.md`,
]) {
  if (!exists(relativePath)) fail(`missing managed mobile app dev team doc: ${relativePath}`);
}

if (exists(legacyRoleSoulRoot)) {
  fail(`role SOUL runtime source must be reclassified out of legacy path: ${legacyRoleSoulRoot}`);
}

if (exists(legacyPodNativeOpenClawSkillRoot)) {
  fail(`pod-native runtime source must be reclassified out of legacy path: ${legacyPodNativeOpenClawSkillRoot}`);
}

const completedPlanArchives = [
  {
    stalePath: `${managedTeamDocRoot}/08-role-title-update-plan.md`,
    staleArchivePath: `${archiveRoot}/08-role-title-update-plan.md`,
    archivePath: `${completedPlanArchiveRoot}/role-title-update-plan.md`,
    replacement: 'Display Title To Operating Role Crosswalk',
  },
  {
    stalePath: `${managedTeamDocRoot}/09-pod-native-openclaw-skill-plan.md`,
    staleArchivePath: `${archiveRoot}/09-pod-native-openclaw-skill-plan.md`,
    archivePath: `${completedPlanArchiveRoot}/pod-native-openclaw-skill-plan.md`,
    replacement: `${podNativeOpenClawSkillRoot}/`,
  },
  {
    stalePath: `${managedTeamDocRoot}/11-openclaw-codex-completion-hooks-plan.md`,
    staleArchivePath: `${archiveRoot}/11-openclaw-codex-completion-hooks-plan.md`,
    archivePath: `${completedPlanArchiveRoot}/openclaw-codex-completion-hooks-plan.md`,
    replacement: '.codex/hooks/',
  },
  {
    stalePath: `${managedTeamDocRoot}/12-ref-organization-goal-plan.md`,
    staleArchivePath: `${archiveRoot}/12-ref-organization-goal-plan.md`,
    archivePath: `${completedPlanArchiveRoot}/ref-organization-goal-plan.md`,
    replacement: `${refOrganizationRoot}/`,
  },
  {
    stalePath: `${managedTeamDocRoot}/13-pod-organization-e2e-improvement-plan.md`,
    staleArchivePath: `${archiveRoot}/13-pod-organization-e2e-improvement-plan.md`,
    archivePath: `${completedPlanArchiveRoot}/pod-organization-e2e-improvement-plan.md`,
    replacement: 'governance/human-ops-live-readiness-annex.md',
  },
  {
    stalePath: `${managedTeamDocRoot}/18-orbstack-pod-config-setup-runbook-plan.md`,
    staleArchivePath: `${archiveRoot}/18-orbstack-pod-config-setup-runbook-plan.md`,
    archivePath: `${completedPlanArchiveRoot}/orbstack-pod-config-setup-runbook-plan.md`,
    replacement: 'runtime-sources/pod-environment-bootstrap.md',
  },
  {
    stalePath: `${managedTeamDocRoot}/orbstack-pod-operator-input-request.md`,
    staleArchivePath: `${archiveRoot}/orbstack-pod-operator-input-request.md`,
    archivePath: `${completedPlanArchiveRoot}/orbstack-pod-operator-input-request.md`,
    replacement: 'runtime-sources/orbstack-pod-config-values.md',
  },
];

const sourceMapBody = exists(`${managedTeamDocRoot}/source-map.md`) ? read(`${managedTeamDocRoot}/source-map.md`) : '';
for (const { stalePath, staleArchivePath, archivePath, replacement } of completedPlanArchives) {
  if (exists(stalePath)) fail(`completed plan must be archived, not current top-level doc: ${stalePath}`);
  if (exists(staleArchivePath)) fail(`completed plan archive must be reclassified out of archive root: ${staleArchivePath}`);
  if (!exists(archivePath)) fail(`missing archived completed plan: ${archivePath}`);
  if (managedSkillMatrix && !sourceMapBody.includes(archivePath)) {
    fail(`source map missing completed plan archive entry: ${archivePath}`);
  }
  if (managedSkillMatrix && !sourceMapBody.includes(replacement)) {
    fail(`source map missing completed plan replacement crosswalk for ${archivePath}: ${replacement}`);
  }
}

const archiveReclassifications = [
  {
    staleArchivePath: `${archiveRoot}/20260609-structure-inspection-sot.md`,
    archivePath: `${archiveRoot}/historical-inspections/20260609-structure-inspection-sot.md`,
    replacement: 'PROJECT_ENVIRONMENT.md',
  },
  {
    staleArchivePath: `${archiveRoot}/ref-organization-preconsolidation-20260612`,
    archivePath: `${archiveRoot}/preconsolidation/ref-organization-20260612/README.md`,
    replacement: `${refOrganizationRoot}/`,
  },
];

for (const { staleArchivePath, archivePath, replacement } of archiveReclassifications) {
  if (exists(staleArchivePath)) fail(`archive item must be reclassified out of archive root: ${staleArchivePath}`);
  if (!exists(archivePath)) fail(`missing reclassified archive item: ${archivePath}`);
  if (managedSkillMatrix && !sourceMapBody.includes(archivePath)) {
    fail(`source map missing reclassified archive entry: ${archivePath}`);
  }
  if (managedSkillMatrix && !sourceMapBody.includes(replacement)) {
    fail(`source map missing reclassified archive replacement crosswalk for ${archivePath}: ${replacement}`);
  }
}

requireRootTerms('AGENTS.md', [
  '## OpenClaw And Codex Skill Routing',
  'Pod-native OpenClaw skill-only requests use `/workspace/skills/<slug>/SKILL.md` as the runtime shape',
  'mobile-app-dev-team/runtime-sources/pod-native-openclaw-skills/<slug>/',
  'After `git clone` or `git pull` for WonderMove new-mobile-app, use `openclaw-pod-skills-sync` to copy-sync `mobile-app-dev-team/runtime-sources/pod-native-openclaw-skills` into `/workspace/skills`, then run `project-bootstrap`.',
  'Codex skill or agent requests use `.agents/skills/<skill-name>/SKILL.md` and `.codex/agents/<agent-name>.toml` for primary artifacts',
  'required validators, evals, scripts, and evidence may still be added when the change needs them',
]);

requireRootTerms('ORGANIZATIONS.md', [
  'Canonical source:',
  'mobile-app-dev-team/runtime-sources/ORGANIZATIONS.md',
  'discoverability stub only',
  '/workspace/ORGANIZATIONS.md',
]);

requireDocTerms(organizationsRuntimeSource, [
  '# ORGANIZATIONS.md - Organizations and Reporting',
  'This file is guidance only',
  'Overspec Controls',
  'Role Archetypes',
  'Approval Boundaries',
  'Deterministic Gatekeeper / System Check',
  '## 한국어',
]);

requireDocTerms(`${podNativeOpenClawSkillRoot}/README.md`, [
  'source-only',
  '/workspace/skills/<slug>/SKILL.md',
  'mobile-app-dev-team/runtime-sources/ORGANIZATIONS.md',
  '/workspace/ORGANIZATIONS.md',
  'Normal user-facing setup after clone or pull starts from `openclaw-pod-skills-sync`, then `project-bootstrap`',
  'user-understandable result',
  'minimum request/action',
  'blocker-resolution-guide.md',
  'dependency/internal setup contracts',
  'advanced recovery paths',
  'openclaw-pod-skills-sync',
  'codex-cli-auth-setup',
  'pod-role-bootstrap',
  'project-bootstrap',
  'eas-robot-auth-setup',
  'stitch-adc-setup',
  'codex-role-workflow',
  '## Per-Role Required Pod Skills',
  'Product/Planning',
  'QA/Release',
  'Design',
  'Do not place repo-local Codex CLI artifacts here',
  '| Product/Planning | `codex-cli-auth-setup`, `pod-role-bootstrap`, `stitch-adc-setup`, `codex-role-workflow` |',
  '| Design | `codex-cli-auth-setup`, `pod-role-bootstrap`, `stitch-adc-setup`, `codex-role-workflow` |',
  '| Mobile Architect | `codex-cli-auth-setup`, `pod-role-bootstrap`, `stitch-adc-setup`, `codex-role-workflow` |',
  '| Mobile App Dev | `codex-cli-auth-setup`, `pod-role-bootstrap`, `stitch-adc-setup`, `codex-role-workflow` |',
  '| Backend/API Integrator | `codex-cli-auth-setup`, `pod-role-bootstrap`, `stitch-adc-setup`, `codex-role-workflow` |',
  '| QA/Release | `codex-cli-auth-setup`, `pod-role-bootstrap`, `stitch-adc-setup`, `eas-robot-auth-setup`, `codex-role-workflow` |',
]);

function requirePodNativeSkill(relativePath, slug, scriptName, requiredTerms = []) {
  requireDocTerms(`${relativePath}/SKILL.md`, [
    `name: ${slug}`,
    'description:',
    `/workspace/skills/${slug}/SKILL.md`,
    'status only',
    'Do not print auth token values',
    ...requiredTerms,
  ]);

  requireNoDocTerms(`${relativePath}/SKILL.md`, [
    'cat ~/.codex/auth.json',
    'cat /root/.codex/auth.json',
    'print(data)',
    'json.dumps(data',
    'OPENAI_API_KEY=',
    'EXPO_TOKEN=',
    'GITHUB_TOKEN=',
    'GOOGLE_APPLICATION_CREDENTIALS=',
  ]);

  const skillPath = `${relativePath}/SKILL.md`;
  if (exists(skillPath)) {
    const skillFrontmatter = parseFrontmatter(read(skillPath));
    if (!skillFrontmatter) {
      fail(`pod-native OpenClaw skill missing YAML frontmatter: ${skillPath}`);
    } else {
      const keys = Object.keys(skillFrontmatter).sort();
      const unexpectedKeys = keys.filter((key) => !['description', 'name'].includes(key));
      if (skillFrontmatter.name !== slug) {
        fail(`pod-native OpenClaw skill frontmatter name must be ${slug}: ${skillPath}`);
      }
      if (!skillFrontmatter.description) {
        fail(`pod-native OpenClaw skill frontmatter missing description: ${skillPath}`);
      }
      if (unexpectedKeys.length) {
        fail(`pod-native OpenClaw skill frontmatter must only include name and description: ${unexpectedKeys.join(', ')}`);
      }
    }
  }

  requireDocTerms(`${relativePath}/scripts/${scriptName}`, [
    'set -euo pipefail',
    'redact()',
    'REPORT_PATH',
    '/workspace/state/',
  ]);

  requireNoDocTerms(`${relativePath}/scripts/${scriptName}`, [
    'cat ~/.codex/auth.json',
    'cat /root/.codex/auth.json',
    'print(data)',
    'json.dumps(data',
    'OPENAI_API_KEY=',
    'EXPO_TOKEN=',
    'GITHUB_TOKEN=',
    'GOOGLE_APPLICATION_CREDENTIALS=',
  ]);

  requireDocTerms(`${relativePath}/references/report-template.md`, [
    `${slug}/v1`,
    'status only',
    'auth token values',
  ]);
}

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
  '/workspace/projects/Wondermove-Inc/new-mobile-app/',
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
    fail(`pod-native OpenClaw AGENTS.md policy must use an agent-neutral subject, not Boram: ${codexCliAuthSetupSkillRoot}/SKILL.md`);
  }

  const skillFrontmatter = parseFrontmatter(read(`${codexCliAuthSetupSkillRoot}/SKILL.md`));
  if (!skillFrontmatter) {
    fail(`pod-native OpenClaw skill missing YAML frontmatter: ${codexCliAuthSetupSkillRoot}/SKILL.md`);
  } else {
    const keys = Object.keys(skillFrontmatter).sort();
    const unexpectedKeys = keys.filter((key) => !['description', 'name'].includes(key));
    if (skillFrontmatter.name !== 'codex-cli-auth-setup') {
      fail(`pod-native OpenClaw skill frontmatter name must be codex-cli-auth-setup: ${codexCliAuthSetupSkillRoot}/SKILL.md`);
    }
    if (!skillFrontmatter.description) {
      fail(`pod-native OpenClaw skill frontmatter missing description: ${codexCliAuthSetupSkillRoot}/SKILL.md`);
    }
    if (unexpectedKeys.length) {
      fail(`pod-native OpenClaw skill frontmatter must only include name and description: ${unexpectedKeys.join(', ')}`);
    }
  }
}

requireDocTerms(`${podRoleBootstrapSkillRoot}/SKILL.md`, [
  'name: pod-role-bootstrap',
  'description:',
  '# Pod Role Bootstrap',
  '/workspace/skills/pod-role-bootstrap/SKILL.md',
  'WM_ROLE',
  '/workspace/IDENTITY',
  'WM_EXPECTED_ROLE',
  'REPO_CLONE_URL',
  'GITHUB_TOKEN',
  'gh auth status',
  '/workspace/CODEX_MANAGED_PATHS.md',
  'managed path entry',
  'repo_acquisition',
  'pnpm@9.15.9',
  'pnpm install --frozen-lockfile',
  'node scripts/codex-preflight.mjs --pod --json',
  '/workspace/state/',
  'status only',
  'Do not print auth token values',
  'native Android E2E readiness',
]);

requireNoDocTerms(`${podRoleBootstrapSkillRoot}/SKILL.md`, [
  'cat ~/.codex/auth.json',
  'cat /root/.codex/auth.json',
  'print(data)',
  'json.dumps(data',
  'OPENAI_API_KEY=',
  'EXPO_TOKEN=',
  'GITHUB_TOKEN=',
]);

if (exists(`${podRoleBootstrapSkillRoot}/SKILL.md`)) {
  const skillFrontmatter = parseFrontmatter(read(`${podRoleBootstrapSkillRoot}/SKILL.md`));
  if (!skillFrontmatter) {
    fail(`pod-role-bootstrap skill missing YAML frontmatter: ${podRoleBootstrapSkillRoot}/SKILL.md`);
  } else {
    const keys = Object.keys(skillFrontmatter).sort();
    const unexpectedKeys = keys.filter((key) => !['description', 'name'].includes(key));
    if (skillFrontmatter.name !== 'pod-role-bootstrap') {
      fail(`pod-role-bootstrap skill frontmatter name must be pod-role-bootstrap: ${podRoleBootstrapSkillRoot}/SKILL.md`);
    }
    if (!skillFrontmatter.description) {
      fail(`pod-role-bootstrap skill frontmatter missing description: ${podRoleBootstrapSkillRoot}/SKILL.md`);
    }
    if (unexpectedKeys.length) {
      fail(`pod-role-bootstrap skill frontmatter must only include name and description: ${unexpectedKeys.join(', ')}`);
    }
  }
}

requireDocTerms(`${podRoleBootstrapSkillRoot}/scripts/pod-bootstrap.sh`, [
  'set -euo pipefail',
  'redact()',
  'resolve_role()',
  'ensure_repo_checkout()',
  'check_managed_path()',
  'REPO_CLONE_URL',
  'gh auth status',
  '/workspace/CODEX_MANAGED_PATHS.md',
  'managedPathsRegistry',
  'missing ${CODEX_MANAGED_PATHS}',
  '/workspace/projects/Wondermove-Inc/new-mobile-app',
  'managed_path="${REPO_PATH%/}/"',
  'grep -Fx -- "- ${managed_path}"',
  'missing managed path entry for ${REPO_PATH}',
  'REPORT_PATH',
  '/workspace/state/pod-role-bootstrap-report.json',
  'corepack prepare "pnpm@${EXPECTED_PNPM_VERSION}" --activate',
  'pnpm install --frozen-lockfile',
  'node scripts/codex-preflight.mjs --pod --json',
]);

requireNoDocTerms(`${podRoleBootstrapSkillRoot}/scripts/pod-bootstrap.sh`, [
  'cat ~/.codex/auth.json',
  'cat /root/.codex/auth.json',
  'print(data)',
  'json.dumps(data',
  'OPENAI_API_KEY=',
  'EXPO_TOKEN=',
  'GITHUB_TOKEN=',
]);

requireDocTerms(`${podRoleBootstrapSkillRoot}/references/report-template.md`, [
  'Pod Role Bootstrap Report Template',
  'pod-role-bootstrap/v1',
  'repo_acquisition',
  'managed_path',
  '/workspace/CODEX_MANAGED_PATHS.md',
  'pnpm@9.15.9',
  'status-only blocker reason',
  'native_e2e_local',
  'auth token values',
]);

requirePodNativeSkill(projectBootstrapSkillRoot, 'project-bootstrap', 'project-bootstrap-preflight.sh', [
  'project-bootstrap-agent-setup.sh',
  'openclaw-pod-skills-sync',
  'codex-cli-auth-setup',
  'pod-role-bootstrap',
  'stitch-adc-setup',
  'eas-robot-auth-setup',
  'codex-role-workflow',
  'references/blocker-resolution-guide.md',
  'PROJECT_BOOTSTRAP_BLOCKERS_MD_PATH',
  'project-bootstrap-blockers.md',
  'qa-release',
  'repo_sot_files',
  'REPO_OPERATIONS.md',
  '.codex/config.toml',
  'mobile-mcp',
  'serena',
  'stitch',
  'expo',
  'atlassian',
  'node_repl',
  'playwright',
  'Railway',
  'gcloud',
  'EAS',
  'PROJECT_ENVIRONMENT.md',
  'human-gate/v1',
  '/workspace/projects/Wondermove-Inc/new-mobile-app',
  '/workspace/CODEX_MANAGED_PATHS.md',
  'derive the canonical role slug from the pod SOUL',
  '/workspace/SOUL.md',
  'PROJECT_BOOTSTRAP_ROLE_SLUG',
  'PROJECT_BOOTSTRAP_ROLE_SOUL_PATH="/workspace/SOUL.md"',
  'Do not ask the user to choose a role slug',
  'Do not ask the user to perform agent-owned setup',
  'missing-role-identity',
  'agent-owned setup before blocker report',
  'user-understandable result',
  'minimum user request',
  'agent can continue',
  'pod-role-bootstrap` generates `/workspace/state/pod-role-bootstrap-report.json`',
  'register missing required MCPs',
  'repair the managed-path registry',
  'run role-specific status-only setup reports',
  'agent must inspect and set up its own pod environment',
  'project-bootstrap-report.json',
  '/workspace/ORGANIZATIONS.md',
  'guidance only',
  'must not block bootstrap or preflight by itself',
  'must not parse reporting lines, approval boundaries, or role contracts',
  ...projectBootstrapUserLanguageContractTerms,
  ...projectBootstrapAgentLanguageOwnershipTerms,
  ...projectBootstrapSupportOnlyRawBlockerTerms,
  ...projectBootstrapBrowserComputerUseLoginTerms,
]);

requirePodNativeSkill(openclawPodSkillsSyncSkillRoot, 'openclaw-pod-skills-sync', 'sync-pod-skills.sh', [
  'repo SoT',
  'runtime snapshot',
  'copy sync',
  'not symlink',
  '/workspace/skills/openclaw-pod-skills-sync/SKILL.md',
  '/workspace/skills/openclaw-pod-skills-sync/scripts/sync-pod-skills.sh',
  '/workspace/projects/Wondermove-Inc/new-mobile-app',
  'mobile-app-dev-team/runtime-sources/pod-native-openclaw-skills',
  '/workspace/skills',
  '/workspace/AGENTS.md',
  '/workspace/ORGANIZATIONS.md',
  'OPENCLAW_ORGANIZATIONS_SOURCE_PATH',
  'OPENCLAW_WORKSPACE_ORGANIZATIONS_PATH',
  'workspace_organizations',
  'guidance_only',
  '/workspace/state/openclaw-pod-skills-sync-report.json',
  'git clone',
  'git pull',
  'project-bootstrap',
  'missing source root',
  'missing SKILL.md',
  'copy_failed',
  'must not block skill sync by themselves',
  'auth token values',
]);

requireDocTerms(`${codexRoleWorkflowSkillRoot}/SKILL.md`, [
  'name: codex-role-workflow',
  'description:',
  '/workspace/skills/codex-role-workflow/SKILL.md',
  'status only',
  'Codex Substrate',
  'role-workflow substrate',
  '.codex/hooks.json',
  '.codex/hooks/',
  '.codex/config.toml',
  'Implementation is only one possible downstream role action',
  'Process Routing Sources',
  'Runtime Repo Path Resolution',
  '/workspace/skills/codex-role-workflow/SKILL.md',
  '/workspace/projects/Wondermove-Inc/new-mobile-app/mobile-app-dev-team/workflows/entry-case-routing.md',
  'Do not resolve repo SoT paths relative to `/workspace/skills/codex-role-workflow`',
  'workflows/entry-case-routing.md',
  'operational routing overlay',
  'Common Intake Rule',
  'project requirement',
  'project specification',
  'PRD is one input class',
  'No user input routes directly to an execution role',
  'accepted task packet',
  'READY_FOR_EXECUTION',
  'proactive report',
  'no-auto-execution',
  'Entry Case Routing',
  'unclear',
  'broad',
  'ready_bounded',
  'pre_execution',
  'modification_request',
  'issue_bug_failure',
  'direct_implementation_language',
  'Design Relevance',
  'Screen presence is not the decisive trigger',
  'layout, interaction, or visual hierarchy',
  'P0 approval before Stitch generation',
  'P1 approval before HTML extraction',
  'fetch_screen_code',
  'code.html',
  'getHtml',
  'htmlCode.downloadUrl',
  'Hotfix And Rollback',
  'Emergency hotfix',
  'expedited, not gate-bypassing',
  'production-submit',
  'rollback_owner',
  'rollback_plan',
  'Role identity',
  'WM_ROLE',
  '/workspace/IDENTITY',
  'repo-local Codex skills',
  '.agents/skills/<skill-name>/SKILL.md',
  '.codex/agents/<agent-name>.toml',
  'Product/Planning',
  'Design',
  'Mobile Architect',
  'Mobile App Dev',
  'Backend/API Integrator',
  'QA/Release',
  'po-work-unit-planning-and-agent-sprint',
  'design-mobile-design-handoff',
  'mobile-architect-workflow',
  'mobile-app-dev-workflow',
  'mobile-backend-api-integrator-workflow',
  'e2e-test',
  'qa-railway-workflow',
  'wm-implementation-reviewer',
  'wm-contract-reviewer',
  'po-planning-reviewer',
  'design-reviewer',
  '00-product-planning',
  '01-design',
  '02-architecture',
  '03-contract-api',
  '04-mobile-app',
  '05-qa-release',
  'codex-role-workflow/v1',
  'ready | blocked | not_applicable',
  'entry_case',
  'routing_reason',
  'process_sot',
  'readiness_state_or_required_gate',
  'blocked_reason',
  'not_applicable_reason',
  'external_proof_boundary',
  'Do not print auth token values',
  'human gate',
  'external proof',
  'git diff',
  'git status --short',
]);

requireNoDocTerms(`${codexRoleWorkflowSkillRoot}/SKILL.md`, [
  'cat ~/.codex/auth.json',
  'cat /root/.codex/auth.json',
  'print(data)',
  'json.dumps(data',
  'OPENAI_API_KEY=',
  'EXPO_TOKEN=',
  'GITHUB_TOKEN=',
  'GOOGLE_APPLICATION_CREDENTIALS=',
]);

requireDocTerms('.agents/skills/git-workflow/SKILL.md', [
  'Self-Workflow Approval Requests',
  'Product Delivery Lead',
  'Mobile Architect / Technical Lead',
  'mobile-app-dev-team/runtime-sources/role-souls/product-planning-soul.md',
  'mobile-app-dev-team/runtime-sources/role-souls/mobile-architect-soul.md',
  'approval request packet',
  'scope/readiness/human-gate',
  'architecture/runtime/releaseability',
  'Do not merge your own PR',
  'human approval before merge',
]);

requireDocTerms(`${projectBootstrapSkillRoot}/references/blocker-resolution-guide.md`, [
  'Project Bootstrap Blocker Resolution Guide',
  'Blocker Classification',
  'missing role identity',
  'pnpm-pin-mismatch',
  'git-identity-missing',
  'github-auth-unavailable',
  'codex-mcp-unavailable',
  'Agent/tool-use boundary',
  'agent must set the identity itself',
  'Do not ask the user to choose the role',
  'Agent-owned setup actions',
  'PROJECT_BOOTSTRAP_ROLE_SLUG',
  'PROJECT_BOOTSTRAP_ROLE_SOUL_PATH="/workspace/SOUL.md"',
  'explicit-role-slug-conflict',
  'role-surface-noncanonical',
  'Agent-owned if approved source exists',
  'Human-readable blocker table',
  'Minimum user request',
  'agent can continue',
  'GitHub connection is needed',
  'GitHub login screen',
  'sign in with your GitHub account and approve',
  'Technical details for support',
  'PROJECT_BOOTSTRAP_GIT_USER_NAME',
  'PROJECT_BOOTSTRAP_GIT_IDENTITY_PATH',
  '`pod-role-bootstrap` report is present and blocked',
  'Human-owned blockers',
  'Do not print token values',
  'Public App Config Blockers',
  'API/Railway Secret Blockers',
  'linked `human-gate/v1` decision',
  'public non-secret app config values',
  'Secret, secure store, tool auth, mounted file, or human-present login',
  'app display name',
  'app slug',
  'app scheme',
  'iOS bundle ID',
  'Android package',
  'public API URL',
  'Railway tokens',
  'platform owner refresh',
  'approved Codex CLI artifact',
  'report directories',
  'role identity writing',
  'canonical managed-path repair',
  'pinned credential-free MCP registration',
  'pnpm pin alignment',
  'project-bootstrap-agent-setup auth readiness missing',
  'workspace-skills-sync-blocked',
  'railway-cli-unavailable',
  'gcloud-cli-unavailable',
  'railway-auth-missing',
  'gcloud-auth-missing',
  'gcloud-adc-missing',
  'expo-mcp-auth-missing',
  'expo-cli-auth-missing',
  'PROJECT_BOOTSTRAP_AGENT_SETUP_REPORT_PATH',
  'PROJECT_BOOTSTRAP_INSTALL_APPROVED=true',
  'install_blocked_needs_approval',
  'installed_exact',
  ...projectBootstrapUserLanguageContractTerms,
  ...projectBootstrapAgentLanguageOwnershipTerms,
  ...projectBootstrapExpandedBlockerMatrixTerms,
  ...projectBootstrapSupportOnlyRawBlockerTerms,
  ...projectBootstrapBrowserComputerUseLoginTerms,
]);

requireDocTerms(`${projectBootstrapSkillRoot}/references/report-template.md`, [
  'Action needed',
  'What you need to do',
  'What I will do after that',
  'Do not send in chat',
  'GitHub connection is needed',
  'Technical details for support',
  'user_summary',
  'repo_checkout',
  'clone_url_status',
  'local_path',
  'workspace_skills',
  'openclaw-pod-skills-sync',
  'workspace-skills-sync-blocked',
  'project-bootstrap',
  'codex-cli-auth-setup',
  'pod-role-bootstrap',
  'eas-robot-auth-setup',
  'stitch-adc-setup',
  'codex-role-workflow',
  'workspace_agents',
  'guidance_artifacts',
  'workspace_organizations',
  'not_enforced_by_this_report',
  'not_enforced_by_preflight',
  'install_plan',
  'installed_exact',
  'project_bootstrap_agent_setup',
  'tool_auth',
  'npm_global_install_failed',
  'install_failed',
  'expo_mcp',
  'expo_cli',
  ...projectBootstrapUserLanguageContractTerms,
  ...projectBootstrapAgentLanguageOwnershipTerms,
  ...projectBootstrapUserSummaryLanguageTerms,
  ...projectBootstrapKoreanGeneratedOutputTerms,
  ...projectBootstrapSupportOnlyRawBlockerTerms,
]);

requireDocTerms(`${projectBootstrapSkillRoot}/scripts/project-bootstrap-preflight.sh`, [
  'PROJECT_BOOTSTRAP_AGENT_SETUP_REPORT_PATH',
  'PROJECT_BOOTSTRAP_WORKSPACE_ORGANIZATIONS_PATH',
  'project_bootstrap_agent_setup',
  'missing project-bootstrap-agent-setup report',
  'unreadable project-bootstrap-agent-setup report',
  'project-bootstrap-agent-setup auth readiness missing',
  'workspace-skills-sync-blocked',
  'not_enforced_by_preflight',
  'railway-auth-missing',
  'gcloud-auth-missing',
  'gcloud-adc-missing',
  'expo-mcp-auth-missing',
  'expo-cli-auth-missing',
  'token-bearing REPO_CLONE_URL rejected',
  'Action needed',
  'What you need to do',
  'What I will do after that',
  'Do not send in chat',
  'GitHub connection is needed',
  'GitHub login screen',
  'sign in with your GitHub account and approve',
  'Git commit author name and email',
  'Technical details for support',
  'passwords, tokens, 2FA codes',
  'platform owner refresh',
  'approved Codex CLI artifact',
  ...projectBootstrapUserLanguageContractTerms,
  ...projectBootstrapAgentLanguageOwnershipTerms,
  ...projectBootstrapUserSummaryLanguageTerms,
  ...projectBootstrapKoreanGeneratedOutputTerms,
  ...projectBootstrapExpandedBlockerMatrixTerms,
  ...projectBootstrapSupportOnlyRawBlockerTerms,
  ...projectBootstrapBrowserComputerUseLoginTerms,
]);

requireDocTerms(`${podRoleBootstrapSkillRoot}/SKILL.md`, [
  'human-readable blocker translation',
  'approved non-secret Git identity pair',
  'human-present GitHub auth action',
  'token-bearing REPO_CLONE_URL rejected',
  'Do not ask the user to create `/workspace/state/pod-role-bootstrap-report.json`',
]);

requireDocTerms(`${projectBootstrapSkillRoot}/scripts/project-bootstrap-agent-setup.sh`, [
  'set -euo pipefail',
  'project-bootstrap-agent-setup/v1',
  'OPENCLAW_POD_SKILLS_SYNC',
  'openclaw-pod-skills-sync',
  'sync-pod-skills.sh',
  'PROJECT_BOOTSTRAP_INSTALL_APPROVED',
  'PROJECT_BOOTSTRAP_SKILLS_ROOT',
  'PROJECT_BOOTSTRAP_WORKSPACE_AGENTS_PATH',
  'PROJECT_BOOTSTRAP_WORKSPACE_ORGANIZATIONS_PATH',
  'PROJECT_BOOTSTRAP_ORGANIZATIONS_SOURCE_PATH',
  'OPENCLAW_WORKSPACE_ORGANIZATIONS_PATH',
  'install_blocked_needs_approval',
  'workspace_skills',
  'workspace_agents',
  'guidance_artifacts',
  'not_enforced_by_this_report',
  'eas-robot-auth-setup',
  'stitch-adc-setup',
  'codex-role-workflow',
  'repo_checkout',
  'expo_mcp',
  'expo_cli',
  'railway-cli-unavailable',
  'gcloud-cli-unavailable',
  'install_plan',
  'installed_exact',
  'npm_global_install_failed',
  'install_failed',
  'PROJECT_BOOTSTRAP_CANONICAL_REPO_PATH',
  'PROJECT_BOOTSTRAP_ROLE_SLUG',
  'blocked_explicit_role_slug_invalid',
  'blocked_explicit_role_slug_conflict',
  'blocked_role_surface_noncanonical',
  'explicit-role-slug-invalid',
  'explicit-role-slug-conflict',
  'role-surface-noncanonical',
  'resolve_agent_role',
  'repair_managed_path_registry',
  'blocked_wrong_repo_path',
  'register_mcp',
  'configure_git_identity',
  'configure_github_auth',
  'PROJECT_BOOTSTRAP_GIT_USER_NAME',
  'PROJECT_BOOTSTRAP_GIT_IDENTITY_PATH',
  '@mobilenext/mobile-mcp@0.0.58',
  'oraios/serena@v1.5.3',
  'stitch-mcp@1.3.2',
  'run_status_precheck',
  'project-bootstrap-role.env',
]);

requireDocTerms('evals/skills/project-bootstrap-agent-setup-smoke.sh', [
  'case_design_full_setup',
  'case_wrong_repo_path_blocks_repair',
  'case_missing_codex_orders_precheck',
  'case_qa_role_report_generation',
  'case_git_identity_from_approved_env',
  'case_git_identity_from_wm_env',
  'case_git_identity_from_approved_file',
  'case_missing_git_identity_does_not_invent_values',
  'case_git_identity_rejects_mixed_approved_sources',
  'case_github_auth_setup_git_when_authenticated',
  'case_github_auth_missing_skips_setup_git',
  'case_project_preflight_blocks_on_pod_role_report_blocked',
  'case_project_preflight_blocks_missing_codex_role_workflow_skill',
  'case_project_preflight_guides_missing_sot_and_mcp',
  'case_project_preflight_guides_missing_codex_cli',
  'case_project_preflight_guides_role_specific_secure_sources',
  'case_preflight_blocks_missing_agent_setup_report',
  'case_preflight_blocks_unreadable_agent_setup_report',
  'case_preflight_blocks_failed_skill_sync',
  'case_agent_setup_blocks_failed_skill_sync',
  'case_preflight_blocks_auth_absent_from_agent_setup_report',
  'case_preflight_auth_ready_passes_auth_gate',
  'case_agent_setup_detects_unauthorized_provider_state',
  'case_expo_mcp_and_expo_cli_are_separate',
  'case_explicit_role_slug_writes_all_role_surfaces',
  'case_role_soul_files_map_to_canonical_bootstrap_roles',
  'case_explicit_role_slug_blocks_invalid_or_conflicting_identity',
  'case_role_identity_requires_explicit_slug_or_existing_canonical_surface',
  'PROJECT_BOOTSTRAP_ROLE_SLUG',
  'missing-role-identity',
  'mobile-app-dev-team/runtime-sources/role-souls/product-planning-soul.md|Product/Planning|product-planning',
  'mobile-app-dev-team/runtime-sources/role-souls/backend-api-integrator-soul.md|Backend/API Integrator|backend-api-integrator',
  'mobile-app-dev-team/runtime-sources/role-souls/qa-release-soul.md|QA/Release|qa-release',
  'PROJECT_BOOTSTRAP_ROLE_SLUG="Product/Planning"',
  'WM_ROLE="Product/Planning"',
  'WM_EXPECTED_ROLE="Product/Planning"',
  "r.blockers.includes('role-surface-noncanonical')",
  'WM_EXPECTED_ROLE="design"',
  "r.blockers.includes('explicit-role-slug-conflict')",
  'case_auth_blocker_markdown_ko_en_user_friendly',
  'case_install_requires_explicit_approval',
  'case_system_installer_requires_explicit_approval',
  'case_failed_npm_install_is_not_reported_as_installed',
  'case_failed_system_installer_is_not_reported_as_installed',
  'case_default_clone_runtime_skill_registration_workspace_agents_defaults',
  'openclaw-pod-skills-sync',
  "r.workspace_skills.sync.status === 'completed'",
  "r.workspace_skills['openclaw-pod-skills-sync'] === 'present'",
  "r.guidance_artifacts.workspace_organizations.status === 'present'",
  "r.guidance_artifacts.workspace_organizations.status === 'missing'",
  'PROJECT_BOOTSTRAP_WORKSPACE_ORGANIZATIONS_PATH',
  'case_preflight_missing_workspace_organizations_is_status_only',
  'case_agent_setup_missing_workspace_organizations_is_status_only',
  'case_token_bearing_clone_url_rejected_in_both_paths',
  'case_token_bearing_clone_url_rejected_even_when_repo_exists_and_report_redacted',
  'PROJECT_BOOTSTRAP_INSTALL_APPROVED=true',
  'PROJECT_BOOTSTRAP_AGENT_SETUP_REPORT_PATH',
  'railway-cli-unavailable',
  'gcloud-cli-unavailable',
  'railway-auth-missing',
  'gcloud-auth-missing',
  'gcloud-adc-missing',
  'expo-mcp-auth-missing',
  'expo-cli-auth-missing',
  'assert_markdown_heading_body_starts_with',
  'assert_text_order',
  'assert_primary_guidance_not_contains',
  'Action needed',
  'GitHub connection is needed',
  'GitHub login screen',
  'sign in with your GitHub account and approve',
  'Git commit author name and email',
  'Technical details for support',
  'approved MCP/tool-auth config',
  'approved Codex CLI artifact',
  'linked `human-gate/v1` decision',
  'Align `pnpm-pin-mismatch` yourself',
  'blocked_wrong_repo_path',
  'project-bootstrap-agent-setup smoke passed',
  'codex-role-workflow',
  ...projectBootstrapUserLanguageContractTerms,
  ...projectBootstrapAgentLanguageOwnershipTerms,
  ...projectBootstrapUserSummaryLanguageTerms,
  ...projectBootstrapKoreanModeSmokeTerms,
  ...projectBootstrapExpandedBlockerMatrixTerms,
  ...projectBootstrapSupportOnlyRawBlockerTerms,
  ...projectBootstrapBrowserComputerUseLoginTerms,
]);

requireDocTerms('evals/skills/openclaw-pod-skills-sync-smoke.sh', [
  'case_copy_sync_all_pod_skills',
  'case_missing_source_root_blocks',
  'case_unreadable_source_root_blocks',
  'case_empty_source_root_blocks',
  'case_missing_skill_entrypoint_blocks',
  'case_missing_organizations_source_is_status_only',
  'case_unreadable_organizations_source_is_status_only',
  'case_report_is_secret_safe',
  'case_no_symlink_runtime_snapshot',
  'openclaw-pod-skills-sync smoke passed',
  'OPENCLAW_POD_SKILLS_SOURCE_ROOT',
  'OPENCLAW_POD_SKILLS_ROOT',
  'OPENCLAW_WORKSPACE_AGENTS_PATH',
  'OPENCLAW_ORGANIZATIONS_SOURCE_PATH',
  'OPENCLAW_WORKSPACE_ORGANIZATIONS_PATH',
  'workspace_organizations',
  'OPENCLAW_POD_SKILLS_SYNC_REPORT_PATH',
  'git clone',
  'git pull',
  'project-bootstrap',
]);

requirePodNativeSkill(easRobotAuthSetupSkillRoot, 'eas-robot-auth-setup', 'eas-robot-auth-precheck.sh', [
  'EAS CLI',
  'EXPO_TOKEN',
  'eas whoami',
  'human-gate/v1',
  'scripts/ingest-eas-evidence.mjs',
  'eas-evidence/v1',
]);

requirePodNativeSkill(stitchAdcSetupSkillRoot, 'stitch-adc-setup', 'stitch-adc-precheck.sh', [
  'Google ADC',
  'gcloud auth application-default',
  'STITCH_ADC_HUMAN_PRESENT',
  'STITCH_ADC_ENABLE_STITCH_API',
  'gcloud services enable stitch.googleapis.com',
  'codex mcp list',
  'stitch',
  'human-gate/v1',
]);

requireDocTerms('evals/skills/stitch-adc-setup-smoke.sh', [
  'case_missing_gcloud_reports_installer_source_needed',
  'case_installer_requires_explicit_approval',
  'case_approved_installer_runs_and_records_exact_install',
  'case_auth_and_adc_login_require_human_present',
  'case_human_present_starts_browser_auth_flows',
  'case_service_enable_requires_explicit_opt_in',
  'case_project_set_and_service_enable_recheck_ready',
  'case_service_enable_failure_does_not_overclaim_ready',
  'STITCH_ADC_ENABLE_STITCH_API',
  'stitch-adc-setup smoke passed',
]);

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

const podBootstrapPath = path.join(docRoot, `${podRoleBootstrapSkillRoot}/scripts/pod-bootstrap.sh`);
if (fs.existsSync(podBootstrapPath)) {
  const syntax = spawnSync('bash', ['-n', podBootstrapPath], { encoding: 'utf8' });
  if (syntax.status !== 0) {
    fail(`pod-bootstrap.sh must pass bash -n: ${syntax.stderr || syntax.stdout}`);
  }
}

const refOrganizationSections = [
  'orientation-and-sot',
  'organization-model',
  'runtime-surfaces',
  'role-contracts-and-capabilities',
  'workflows-and-handoffs',
  'skills-agents-and-tools',
  'gates-evidence-and-audit',
  'repo-template-and-runtime',
  'new-organization-template',
  'source-map-and-migration',
];

const staleRefOrganizationSections = [
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

const refOrganizationRequiredFiles = [
  `${refOrganizationRoot}/README.md`,
  ...refOrganizationSections.map((section) => `${refOrganizationRoot}/${section}/README.md`),
];

for (const relativePath of refOrganizationRequiredFiles) {
  if (!exists(relativePath)) fail(`missing ref-organization checkpoint document: ${relativePath}`);
}

for (const staleSection of staleRefOrganizationSections) {
  if (exists(`${refOrganizationRoot}/${staleSection}`)) {
    fail(`ref-organization section must drop numeric prefix: ${refOrganizationRoot}/${staleSection}`);
  }
}

const refOrganizationMarkdownFiles = listFiles(refOrganizationRoot, (file) => file.endsWith('.md'));
if (refOrganizationMarkdownFiles.length !== refOrganizationRequiredFiles.length) {
  fail(
    `ref-organization must stay consolidated to ${refOrganizationRequiredFiles.length} markdown files; found ${refOrganizationMarkdownFiles.length}`
  );
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

for (const relativePath of refOrganizationMarkdownFiles) {
  const body = read(relativePath);
  const topLines = body.split('\n').slice(0, 40).join('\n');
  for (const term of refOrganizationStatusTerms) {
    if (!topLines.includes(term)) {
      fail(`${relativePath} missing ref-organization page status field: ${term}`);
    }
  }

  const statusMatch = topLines.match(/^Status:\s*(.+)$/m);
  if (statusMatch && !allowedRefOrganizationStatuses.has(statusMatch[1].trim())) {
    fail(`${relativePath} has invalid ref-organization status: ${statusMatch[1].trim()}`);
  }
  const lastReviewedMatch = topLines.match(/^Last reviewed date:\s*(.+)$/m);
  if (lastReviewedMatch && !/^\d{4}-\d{2}-\d{2}$/.test(lastReviewedMatch[1].trim())) {
    fail(`${relativePath} has invalid Last reviewed date format: ${lastReviewedMatch[1].trim()}`);
  }
  const reviewerEvidenceMatches = Array.from(topLines.matchAll(/^Reviewer evidence:\s*(.+)$/gm));
  for (const reviewerEvidenceMatch of reviewerEvidenceMatches) {
    const reviewerEvidence = reviewerEvidenceMatch[1].trim();
    if (/pending/i.test(reviewerEvidence)) {
      fail(`${relativePath} has unresolved Reviewer evidence: ${reviewerEvidence}`);
    }
    if (!reviewerEvidence.startsWith('.evidence/reviews/')) {
      fail(`${relativePath} Reviewer evidence must link .evidence/reviews/: ${reviewerEvidence}`);
    }
  }
}

const refOrganizationCrosswalk = `${refOrganizationRoot}/source-map-and-migration/README.md`;
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
      if (!targetPath.startsWith(`${refOrganizationRoot}/`)) {
        fail(`ref-organization crosswalk target must live under ${refOrganizationRoot}: ${sourceCell} -> ${targetPath}`);
      }
      const targetRelativePath = targetPath;
      if (!targetRelativePath.endsWith('/')) {
        if (!exists(targetRelativePath)) {
          fail(`ref-organization crosswalk target does not exist: ${sourceCell} -> ${targetPath}`);
        }
      }
    }
  }
}

requireDocTerms(`${refOrganizationRoot}/source-map-and-migration/README.md`, [
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

requireNoDocTerms(`${refOrganizationRoot}/source-map-and-migration/README.md`, [
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

requireDocTerms(`${refOrganizationRoot}/runtime-surfaces/README.md`, [
  '.agents/skills/<skill-name>/SKILL.md',
  '.codex/agents/<agent-name>.toml',
  '.codex/hooks.json',
  '.codex/hooks/',
  '.codex/config.toml',
  'repo-local Codex',
  'not `/workspace/skills/<slug>/SKILL.md`',
  'not `/workspace/codex-hooks`',
]);

requireDocTerms(`${refOrganizationRoot}/orientation-and-sot/README.md`, [
  'reusable reference-organization',
  'current WonderMove mobile project',
  'TEAM_DOC_ARCHIVE_MANIFEST.json',
  'TEAM_DOC_ARCHIVE_BUNDLE.jsonl',
  'current SoT',
  'future organizations',
]);

requireDocTerms(`${refOrganizationRoot}/orientation-and-sot/README.md`, [
  'AGENTS.md',
  'PROJECT_ENVIRONMENT.md',
  '.agents/skills',
  '.codex/agents',
  'mobile-app-dev-team',
  'TEAM_DOC_ARCHIVE_MANIFEST.json',
  'TEAM_DOC_ARCHIVE_BUNDLE.jsonl',
]);

requireDocTerms(`${refOrganizationRoot}/runtime-surfaces/README.md`, [
  '/workspace/skills/<slug>/SKILL.md',
  'mobile-app-dev-team/runtime-sources/pod-native-openclaw-skills/<slug>/',
  'pod-native OpenClaw',
  'not `.agents/skills/<skill-name>/SKILL.md`',
  'source-only',
]);

requireDocTerms(`${refOrganizationRoot}/runtime-surfaces/README.md`, [
  '/workspace/codex-hooks',
  'not `/workspace/skills/<slug>/SKILL.md`',
  'not `.codex/hooks`',
  'per-agent E2E',
  'local repo/source validation does not prove actual OpenClaw system event delivery',
]);

requireDocTerms(`${refOrganizationRoot}/runtime-surfaces/README.md`, [
  'computer-use/tool surfaces',
  'owner role or routing owner',
  'allowed use cases',
  'evidence boundary',
  'human-gated',
  'not a repo-local Codex artifact unless a SoT says so',
]);

requireDocTerms(`${refOrganizationRoot}/organization-model/README.md`, [
  'Display Title',
  'Operating Role',
  '6 LLM roles plus 1 non-LLM deterministic Gatekeeper',
  'future organizations may change role names or counts',
  'avoid adding roles until a repeated ownership gap exists',
  'non-LLM deterministic gates separately',
]);

requireDocTerms(`${refOrganizationRoot}/organization-model/README.md`, [
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

requireDocTerms(`${refOrganizationRoot}/organization-model/README.md`, [
  'Release Gatekeeper (System)',
  'non-LLM',
  'deterministic',
  'No Gatekeeper SOUL.md',
  'cannot replace human approval',
  'cannot accept failed-gate risk',
]);

requireDocTerms(`${refOrganizationRoot}/role-contracts-and-capabilities/README.md`, [
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

requireDocTerms(`${refOrganizationRoot}/role-contracts-and-capabilities/README.md`, [
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

requireDocTerms(`${refOrganizationRoot}/role-contracts-and-capabilities/README.md`, [
  'owner',
  'input artifact',
  'output artifact',
  'acceptance criteria',
  'evidence requirement',
  'next responsible role',
  'GitHub branch/commit/PR',
  'docs/plans/work-units/<work-unit-id>/',
]);

requireDocTerms(`${refOrganizationRoot}/workflows-and-handoffs/README.md`, [
  'Intake And Planning',
  'Design Readiness',
  'API Readiness',
  'Implementation',
  'QA And Release Evidence',
  'Failure Loop',
  'Reviewer(xhigh)',
  'docs/plans/work-units/<work-unit-id>/',
]);

requireDocTerms(`${refOrganizationRoot}/workflows-and-handoffs/README.md`, [
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

requireDocTerms(`${refOrganizationRoot}/workflows-and-handoffs/README.md`, [
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

requireDocTerms(`${refOrganizationRoot}/workflows-and-handoffs/README.md`, [
  'Failed check remains failed',
  'wm-gate-fix-advisor',
  'owning implementation workflow',
  'QA/Release',
  'Product/Planning',
  'human owner',
  'failed-gate risk acceptance',
]);

requireDocTerms(`${refOrganizationRoot}/skills-agents-and-tools/README.md`, [
  'actual `.agents/skills` directory',
  'active repo-local skill',
  'legacy mobile-* agents',
  'read-only',
  'repo skills remain authoritative',
]);

requireDocTerms(`${refOrganizationRoot}/skills-agents-and-tools/README.md`, [
  '.agents/skills/<skill-name>/SKILL.md',
  '/workspace/skills/<slug>/SKILL.md',
  '/workspace/codex-hooks',
  'computer-use/tool surfaces',
  'not a repo-local Codex artifact unless a SoT says so',
]);

requireDocTerms(`${refOrganizationRoot}/skills-agents-and-tools/README.md`, [
  'read-only',
  'source references',
  'must not recursively delegate',
  'must not edit files',
  'must not approve failed gates',
]);

requireDocTerms(`${refOrganizationRoot}/skills-agents-and-tools/README.md`, [
  'optional',
  'recurring process gap',
  'SoT',
  'validator',
  'human gate',
]);

requireDocTerms(`${refOrganizationRoot}/gates-evidence-and-audit/README.md`, [
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

requireDocTerms(`${refOrganizationRoot}/gates-evidence-and-audit/README.md`, [
  'Done requires linked artifacts',
  'canonical evidence',
  '.evidence/e2e-test/<YYYYMMDD-HHMMSS>-<slug>/',
  'command output',
  'exit status',
  'must not print or persist secrets',
  '.evidence/local/',
]);

requireDocTerms(`${refOrganizationRoot}/gates-evidence-and-audit/README.md`, [
  'Production submit',
  'Payment',
  'PII',
  'External messaging',
  'Legal',
  'Business/budget',
  'Irreversible scope tradeoff',
  'Accepting risk after a failed gate',
]);

requireDocTerms(`${refOrganizationRoot}/gates-evidence-and-audit/README.md`, [
  'historical evidence',
  'current evidence',
  'source map',
  'reviewer evidence',
  'command output',
  'local validation does not prove actual OpenClaw pod execution',
]);

requireDocTerms(`${refOrganizationRoot}/repo-template-and-runtime/README.md`, [
  'apps/mobile',
  'apps/api',
  'packages/contracts',
  '.agents/skills',
  '.codex/agents',
  'current-project example',
  'future organizations may have different repo layouts',
]);

requireDocTerms(`${refOrganizationRoot}/repo-template-and-runtime/README.md`, [
  'Expo SDK 56',
  'React Native',
  'NativeWind',
  'testID',
  'mobile-mcp',
  'current-project example',
]);

requireDocTerms(`${refOrganizationRoot}/repo-template-and-runtime/README.md`, [
  'apps/api',
  'packages/contracts',
  'single source of truth',
  'routes',
  'services',
  'db',
  'optional',
]);

requireDocTerms(`${refOrganizationRoot}/repo-template-and-runtime/README.md`, [
  'quality gate',
  'pnpm run test:runtime',
  'pnpm turbo run lint test',
  'pnpm run test:local-harness',
  'EAS',
  'Railway',
  'does not prove full mobile release readiness',
]);

requireDocTerms(`${refOrganizationRoot}/new-organization-template/README.md`, [
  'Freeze Source Inputs',
  'Define Team Shape',
  'Write Role SOUL.md Files',
  'Create Capability Matrix',
  'Create Skill/Agent Matrix',
  'Define Process',
  'Add Validation',
  'Reviewer(xhigh)',
]);

requireDocTerms(`${refOrganizationRoot}/new-organization-template/README.md`, [
  'organization_name',
  'repo_root',
  'managed_docs_root',
  'runtime_surfaces',
  'role_families',
  'human_gates',
  'evidence_paths',
]);

requireDocTerms(`${refOrganizationRoot}/new-organization-template/README.md`, [
  'Source inputs frozen',
  'Runtime surfaces separated',
  'Roles and gates separated',
  'Durable handoff defined',
  'Reviewer(xhigh) completed',
  'Validation commands passed',
]);

requireDocTerms(`${refOrganizationRoot}/source-map-and-migration/README.md`, [
  'AGENTS.md',
  'PROJECT_ENVIRONMENT.md',
  '.agents/skills',
  '.codex/agents',
  'mobile-app-dev-team',
  'TEAM_DOC_ARCHIVE_MANIFEST.json',
  'TEAM_DOC_ARCHIVE_BUNDLE.jsonl',
]);

requireDocTerms(`${refOrganizationRoot}/source-map-and-migration/README.md`, [
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
  'runtime-sources/pod-environment-bootstrap.md',
]);

requireDocTerms(`${managedTeamDocRoot}/source-map.md`, [
  'ref-organization',
  'completed-plans/ref-organization-goal-plan.md',
  'source-map-and-migration/README.md',
  'runtime-sources/pod-environment-bootstrap.md',
  'Display Title To Operating Role Crosswalk',
  'Chief Product Officer (CPO) / Product Delivery Lead',
  'Mobile Architect / Technical Lead',
  'Operating Role',
]);

for (const match of read(`${managedTeamDocRoot}/source-map.md`).matchAll(/`([^`]*ref-organization\/[^`]+\.md)`/g)) {
  const sourceMapPath = match[1];
  const repoRelativePath = sourceMapPath.startsWith(`${managedTeamDocRoot}/`)
    ? sourceMapPath
    : `${managedTeamDocRoot}/${sourceMapPath}`;
  if (!exists(repoRelativePath)) {
    fail(`source map references missing ref-organization markdown path: ${sourceMapPath}`);
  }
}

requireDocTerms(teamCompositionDoc, [
  '6 LLM roles plus 1 non-LLM deterministic Gatekeeper',
  'Chief Product Officer (CPO) / Product Delivery Lead',
  'Mobile Architect / Technical Lead',
  'Operating Role',
  'No Gatekeeper SOUL.md',
]);

requireDocTerms(`${managedTeamDocRoot}/runtime-sources/codex-skill-agent-matrix.md`, [
  'Active repo-local skills',
  'Chief Product Officer (CPO) / Product Delivery Lead',
  'Operating Role',
  '$wm routing',
  'legacy mobile-* agents',
  'Pod-native OpenClaw skills',
  'runtime-sources/pod-native-openclaw-skills/README.md',
  '| `mobile-architect-workflow` | Mobile Architect / Technical Lead | Mobile Architect | Architecture planning, ADR, route/state impact, API co-sign, releaseability, and role-boundary handoff |',
  '`codex-role-workflow`',
]);

forbidDocTerms(`${managedTeamDocRoot}/runtime-sources/codex-skill-agent-matrix.md`, [
  'OpenClaw skills are intentionally deferred',
  'Do not invent OpenClaw skill names or package contracts in this document set',
]);

requireDocTerms(productPlanningRuntimeSpec, [
  'Product/Planning Agent Runtime Specification',
  'mobile-app-dev-team/runtime-sources/role-souls/product-planning-soul.md',
  'mobile-app-dev-team/runtime-sources/pod-native-openclaw-skills/README.md',
  'openclaw-pod-skills-sync',
  'project-bootstrap',
  'Repo-local Codex skills must remain under `.agents/skills/`',
  'Repo-local Codex custom agents must remain under `.codex/agents/`',
  'Canonical pod/runtime slug | product-planning',
  'WM_ROLE',
  'WM_EXPECTED_ROLE',
  '/workspace/IDENTITY',
  'role mismatch',
  'managed project repository root',
  'mobile-app-dev-team/workflows/entry-case-routing.md',
  '`codex-cli-auth-setup`, `pod-role-bootstrap`, and `codex-role-workflow`',
  'po-requirement-office-hours',
  'po-work-unit-planning-and-agent-sprint',
  'po-prd-to-execution',
  'po-planning-completeness-review',
  'po-planning-reviewer',
  'po-scope-gate-reviewer',
  'po-docs-researcher',
  'codex-role-workflow/v1',
  'status: ready | blocked | not_applicable',
  'resolved_role',
  'role_identity_source',
  'entry_case',
  'routing_reason',
  'process_sot',
  'allowed_repo_local_codex_skills',
  'required_reviewers',
  'durable_artifact_stage',
  'readiness_state_or_required_gate',
  'blocked_reason',
  'not_applicable_reason',
  'human_gate_or_external_proof_blocker',
  'secret_safety_statement',
  'external_proof_boundary',
  'docs/plans/work-units/<work-unit-id>/',
  'status.json',
  'evidence_ladder.required_level',
  'human-gate/v1',
  'Product/Planning must not approve Design quality',
  'P1 approval must exist before Design may fetch screen code',
  'QA/Release records the achieved evidence level later',
  'Reviewer and researcher constraints',
  'They are read-only.',
  'They must cite sources.',
  'They must not recursively delegate.',
  'Other Role Runtime Reports',
  'one document',
  'reviewer GO',
]);

requireDocTerms(designRuntimeSpec, [
  'Design Agent Runtime Specification',
  'mobile-app-dev-team/runtime-sources/role-souls/design-soul.md',
  'DESIGN.md',
  'Product Designer',
  'Operating Role | Design',
  'Canonical pod/runtime slug | design',
  'stitch-adc-setup',
  'codex-cli-auth-setup',
  'pod-role-bootstrap',
  'codex-role-workflow',
  'design-mobile-design-handoff',
  'design-stitch-mcp-operating-rules',
  'design-reviewer',
  'design-researcher',
  '01-design',
  'P0',
  'P1',
  'KEEP_EXISTING_DESIGN_MD',
  'UPDATE_DESIGN_MD_REQUIRED',
  'BLOCKED_BY_DESIGN_SYSTEM_DECISION',
  'exactly two Stitch options',
  'default, loading, empty, error, and permission-denied states',
  'fetch_screen_code',
  'code.html',
  'SDK `getHtml`',
  'htmlCode.downloadUrl',
  'design-pub-html/<YYYY-MM-DD>/<work-unit-id>/',
  'manifest.json',
  'handoff.md',
  'NativeWind',
  'React Native primitives',
  'semantic tokens',
  'stable `testID`',
  'apps/mobile/global.css',
  'secret_safety_statement',
  'external_proof_boundary',
  'missing accepted requirement blocks Design work',
  'missing P0 blocks Stitch generation',
  'missing P1 blocks HTML extraction and publication',
  'missing Stitch ADC or Stitch MCP readiness blocks tool execution',
  'missing Design reviewer evidence blocks Mobile App Dev implementation handoff',
  'Local validation does not prove live Stitch',
  'Other Role Runtime Reports',
  'one document',
  'reviewer GO',
]);

requireDocTerms(mobileArchitectRuntimeSpec, [
  'Mobile Architect Agent Runtime Specification',
  'mobile-app-dev-team/runtime-sources/role-souls/mobile-architect-soul.md',
  'Mobile Architect / Technical Lead',
  'Operating Role | Mobile Architect',
  'Canonical pod/runtime slug | mobile-architect',
  'codex-cli-auth-setup',
  'pod-role-bootstrap',
  'codex-role-workflow',
  'mobile-architect-workflow',
  'wm-implementation-reviewer',
  'wm-contract-reviewer',
  'wm-docs-researcher',
  '02-architecture',
  'architecture-note.md',
  'route-state-impact.md',
  'api-contract-cosign.md',
  'releaseability-risk.md',
  'adr.md',
  'architecture, runtime, API, route/state, dependency, or releaseability risk exists',
  'packages/contracts',
  'Backend/API Integrator',
  'API co-sign',
  'EAS strategy',
  'QA/Release evidence implications',
  'Product/Planning',
  'Mobile App Dev',
  'status: ready | blocked | not_applicable',
  'resolved_role',
  'role_identity_source',
  'entry_case',
  'routing_reason',
  'process_sot',
  'allowed_repo_local_codex_skills',
  'required_reviewers',
  'durable_artifact_stage',
  'readiness_state_or_required_gate',
  'blocked_reason',
  'not_applicable_reason',
  'human_gate_or_external_proof_blocker',
  'secret_safety_statement',
  'external_proof_boundary',
  'missing accepted task or work-unit blocks Mobile Architect work',
  'out-of-role implementation request blocks or routes',
  'missing contract SoT blocks API co-sign',
  'missing PROJECT_ENVIRONMENT.md alignment blocks runtime or dependency decisions',
  'missing reviewer evidence blocks architecture handoff',
  'local validation does not prove live OpenClaw pod execution',
  'production-submit',
  'failed-gate-risk',
  'human-gate/v1',
  'Other Role Runtime Reports',
  'one document',
  'reviewer GO',
]);

requireDocTerms(mobileAppDevRuntimeSpec, [
  'Mobile App Dev Agent Runtime Specification',
  'mobile-app-dev-team/runtime-sources/role-souls/mobile-app-dev-soul.md',
  'Mobile App Developer',
  'Operating Role | Mobile App Dev',
  'Canonical pod/runtime slug | mobile-app-dev',
  'codex-cli-auth-setup',
  'pod-role-bootstrap',
  'codex-role-workflow',
  'mobile-app-dev-workflow',
  'wm-implementation-reviewer',
  'wm-contract-reviewer',
  'wm-docs-researcher',
  '04-mobile-app',
  'implementation-summary.md',
  'test-plan.md',
  'selector-changes.md',
  'api-integration-note.md',
  'command-output.md',
  'reviewer.md',
  'approved execution task',
  'Design handoff',
  'selected Design option',
  'five-state matrix',
  'packages/contracts',
  'approved mocks/fixtures',
  'Expo Router',
  'React Native primitives',
  'NativeWind',
  'semantic design tokens',
  'stable kebab-case `testID`',
  'P0 before Stitch generation',
  'exactly two Stitch options',
  'P1 before HTML/image extraction',
  'design-reviewer evidence',
  'Backend/API Integrator',
  'Mobile Architect',
  'QA/Release',
  'L0 `jest`',
  'L1 `rn-web`',
  'RN Web evidence does not prove native behavior',
  'status: ready | blocked | not_applicable',
  'resolved_role',
  'role_identity_source',
  'entry_case',
  'routing_reason',
  'process_sot',
  'allowed_repo_local_codex_skills',
  'required_reviewers',
  'durable_artifact_stage',
  'readiness_state_or_required_gate',
  'blocked_reason',
  'not_applicable_reason',
  'human_gate_or_external_proof_blocker',
  'secret_safety_statement',
  'external_proof_boundary',
  'missing accepted task blocks Mobile App Dev work',
  'missing Design handoff blocks UI implementation',
  'missing selected Design option or five-state matrix blocks UI implementation',
  'missing API contract blocks API-backed implementation',
  'missing test-first evidence blocks implementation',
  'selector changes without app, Jest, and Maestro alignment block handoff',
  'route/state/runtime risk without Mobile Architect handoff blocks implementation',
  'failed gate remains failed',
  'missing reviewer evidence blocks Done',
  'local validation does not prove native behavior',
  'shadcn/ui',
  'customer app config or secrets',
  'production-submit',
  'failed-gate-risk',
  'human-gate/v1',
  'Other Role Runtime Reports',
  'one document',
  'reviewer GO',
]);

requireDocTerms(backendApiIntegratorRuntimeSpec, [
  'Backend/API Integrator Agent Runtime Specification',
  'mobile-app-dev-team/runtime-sources/role-souls/backend-api-integrator-soul.md',
  'Backend/API Engineer',
  'Operating Role | Backend/API Integrator',
  'Canonical pod/runtime slug | backend-api-integrator',
  'codex-cli-auth-setup',
  'pod-role-bootstrap',
  'codex-role-workflow',
  'mobile-backend-api-integrator-workflow',
  'wm-contract-reviewer',
  'wm-implementation-reviewer',
  'wm-docs-researcher',
  '03-contract-api',
  'api-contract.md',
  'contract-diff.md',
  'mock-fixture-report.md',
  'backend-service-evidence.md',
  'migration-note.md',
  'runtime-smoke.md',
  'rollback-note.md',
  'reviewer.md',
  'packages/contracts',
  'apps/api',
  'work-unit ID',
  'consuming mobile flow and owner',
  'endpoint method/path',
  'request schema',
  'response schema',
  'error schema',
  'zod schema names',
  'generated TypeScript type impact',
  'auth/session behavior',
  'retry behavior',
  'error mapping',
  'mock/fixture paths',
  'compatibility notes for Mobile App Dev',
  'migration and rollback assessment',
  'runtime smoke command',
  'service evidence path',
  'plan reviewer',
  'final reviewer',
  'git diff',
  'git status --short',
  'non-interactive `drizzle-kit generate`',
  'programmatic `migrate()`',
  'interactive `migrate dev`',
  'CLI-applied migrations',
  'React Native UI',
  'duplicate request/response types',
  'reverse `apps/api` import direction',
  'QA/Release approval',
  'status: ready | blocked | not_applicable',
  'resolved_role',
  'role_identity_source',
  'entry_case',
  'routing_reason',
  'process_sot',
  'allowed_repo_local_codex_skills',
  'required_reviewers',
  'durable_artifact_stage',
  'readiness_state_or_required_gate',
  'blocked_reason',
  'not_applicable_reason',
  'human_gate_or_external_proof_blocker',
  'secret_safety_statement',
  'external_proof_boundary',
  'missing accepted API/backend scope blocks Backend/API Integrator work',
  'missing consuming mobile flow and owner blocks contract planning',
  'missing `packages/contracts` ownership blocks schema handoff',
  'missing auth/session or tenant/payment/PII risk notes blocks contract readiness',
  'missing mock/fixture paths or compatibility notes for Mobile App Dev blocks mobile implementation handoff',
  'mock-vs-real drift blocks handoff',
  'irreversible migration risk without human gate blocks service work',
  'production-risk migration impact without human gate blocks service work',
  'failed gate remains failed',
  'missing reviewer evidence blocks Done',
  'local validation does not prove live API behavior',
  'Railway/deployment',
  'production credentials',
  'production-submit',
  'failed-gate-risk',
  'human-gate/v1',
  'Other Role Runtime Reports',
  'one document',
  'reviewer GO',
]);

requireDocTerms(qaReleaseRuntimeSpec, [
  'QA/Release Agent Runtime Specification',
  'mobile-app-dev-team/runtime-sources/role-souls/qa-release-soul.md',
  'QA/Release Engineer',
  'Operating Role | QA/Release',
  'Canonical pod/runtime slug | qa-release',
  'codex-cli-auth-setup',
  'pod-role-bootstrap',
  'codex-role-workflow',
  'eas-robot-auth-setup',
  'e2e-test',
  'qa-railway-workflow',
  'wm-implementation-reviewer',
  'wm-gate-fix-advisor',
  'wm-docs-researcher',
  '05-qa-release',
  'e2e-plan.md',
  'reset-record.md',
  'rn-web-evidence.md',
  'native-evidence.md',
  'mobile-mcp-evidence.md',
  'railway-evidence.md',
  'eas-evidence.md',
  'failure-classification.md',
  'release-risk-summary.md',
  'human-approval.md',
  '.evidence/e2e-test/<YYYYMMDD-HHMMSS>-<slug>/',
  'plan.md',
  'commands.md',
  'screenshots',
  'console logs',
  'device logs',
  'issues.md',
  'summary.md',
  'L0 `jest`',
  'L1 `rn-web`',
  'L2 `eas-maestro`',
  'L3 `human-device`',
  'status.json.evidence_ladder.required_level',
  'achieved_level',
  'evidence_ladder.achieved_level',
  'RN Web evidence must not be used as L2 or L3 native proof',
  'offline fixtures validate ingestion and redaction only',
  'local harness',
  'source review',
  'manual QR',
  'local native checks',
  'bare human approval is not enough',
  'Maestro or mobile-mcp automation requirements',
  'do not replace Maestro or mobile-mcp automation requirements',
  'Do not parallelize simulator/device operations',
  'Railway evidence does not prove native module behavior',
  'Railway deployment evidence as full mobile release readiness',
  '/livez',
  '/readyz',
  'EAS profile/workflow label `e2e-test` is distinct from the repo Codex skill `$e2e-test`',
  'eas-evidence/v1',
  'human-gate/v1',
  'production-submit',
  'failed-gate-risk',
  'schema',
  'gate_id',
  'category',
  'decision',
  'scope',
  'decided_by',
  'decision_reference',
  'decided_at',
  'residual_risk',
  'evidence_links',
  'approved',
  'rejected',
  'deferred',
  'failed_check_reference',
  'blocked-human',
  'a role, reviewer, pod, LLM, or Release Gatekeeper cannot become the human approver',
  'Mobile App Dev',
  'Backend/API Integrator',
  'Mobile Architect',
  'Design',
  'Product/Planning',
  'status: ready | blocked | not_applicable',
  'resolved_role',
  'role_identity_source',
  'entry_case',
  'routing_reason',
  'process_sot',
  'allowed_repo_local_codex_skills',
  'required_reviewers',
  'durable_artifact_stage',
  'readiness_state_or_required_gate',
  'blocked_reason',
  'not_applicable_reason',
  'human_gate_or_external_proof_blocker',
  'secret_safety_statement',
  'external_proof_boundary',
  'missing accepted QA/release scope blocks QA/Release work',
  'missing command output or exit status blocks evidence completion',
  'required native simulator, emulator, physical device, Maestro, mobile-mcp, EAS, Railway, or external service unavailable blocks that proof level',
  'missing human-gate/v1 envelope blocks production-submit or failed-gate-risk acceptance',
  'missing failed_check_reference blocks failed-gate-risk',
  'failed gate remains failed',
  'missing reviewer evidence blocks Done',
  'local validation does not prove live QA',
  'production credentials',
  'store submission',
  'Other Role Runtime Reports',
  'one document',
  'reviewer GO',
]);

requireDocTerms(`${completedPlanArchiveRoot}/role-title-update-plan.md`, [
  'Chief Product Officer (CPO) / Product Delivery Lead',
  'Operating Role',
  'Do not use CTO as a runtime role, agent, fixture, SOUL identity, H1, or filename',
]);

forbidDocTerms(teamCompositionDoc, [
  'CTO / Mobile Technical Lead',
  '# CTO / Mobile Technical Lead SOUL.md',
]);

const allowedManagedCtoSafetySentence =
  'Do not use CTO as a runtime role, agent, fixture, SOUL identity, H1, or filename';
for (const relativePath of listFiles(managedTeamDocRoot, (file) => file.endsWith('.md'))) {
  const fileName = path.basename(relativePath);
  if (/(^|[-_. ])cto([-_. ]|$)/i.test(fileName)) {
    fail(`managed team doc filename must not introduce CTO: ${relativePath}`);
  }

  const bodyWithoutAllowedSafetySentence = read(relativePath).replaceAll(allowedManagedCtoSafetySentence, '');
  if (/\bCTO\b/i.test(bodyWithoutAllowedSafetySentence)) {
    fail(`managed team doc must not introduce CTO outside the approved safety sentence: ${relativePath}`);
  }
}

requireDocTerms(`${managedTeamDocRoot}/runtime-sources/role-souls/product-planning-soul.md`, [
  'po-requirement-office-hours',
  'po-work-unit-planning-and-agent-sprint',
  'po-prd-to-execution',
  'po-planning-completeness-review',
  'pod-role-bootstrap',
  'docs/plans/work-units/<work-unit-id>/',
  'status.json',
  'evidence_ladder',
  'required_level',
  'human-gate/v1',
  'wm-orchestrate',
  'Do not approve Design quality during P0/P1',
  'approve only PRD fit, non-goals, evidence readiness, and human-gate routing',
]);

requireDocTerms(`${managedTeamDocRoot}/runtime-sources/role-souls/design-soul.md`, [
  'design-mobile-design-handoff',
  'design-stitch-mcp-operating-rules',
  'pod-role-bootstrap',
  'docs/plans/work-units/<work-unit-id>/',
  'stitch-adc-setup',
  'Google ADC',
  'Stitch',
  'P0 and P1 packet preparation for Product/Planning scope/evidence approval',
  'Do not ask Product/Planning to own design quality',
]);

requireDocTerms(`${managedTeamDocRoot}/runtime-sources/role-souls/mobile-architect-soul.md`, [
  'mobile-architect-workflow',
  'pod-role-bootstrap',
  'docs/plans/work-units/<work-unit-id>/',
  'evidence_ladder',
  'L2',
  'wm-orchestrate',
  'Do not absorb Mobile App Dev implementation ownership',
  'Do not absorb Backend/API Integrator service or API ownership',
]);

forbidDocTerms(`${managedTeamDocRoot}/runtime-sources/role-souls/mobile-app-dev-soul.md`, [
  'Runtime template note: This document is a runtime `/workspace/SOUL.md` template for a generated Mobile App Dev agent. It is not a raw `create-full` `soulMd` seed payload. For seed payload generation, follow the platform injection rules recorded in the 01-5 SOUL source and OrbStack canary evidence instead of copying this file verbatim.',
]);

requireDocTerms(`${managedTeamDocRoot}/runtime-sources/role-souls/mobile-app-dev-soul.md`, [
  'mobile-app-dev-workflow',
  'wm-implementation-reviewer',
  'wm-docs-researcher',
  'pod-role-bootstrap',
  'docs/plans/work-units/<work-unit-id>/',
  'status.json',
  'L0',
  'L1',
  '04-mobile-app',
  'packages/contracts',
  'NativeWind',
  'React Native primitives',
  'testID',
  'shadcn/ui',
  'customer app config or secrets',
]);

requireDocTerms(`${managedTeamDocRoot}/runtime-sources/role-souls/backend-api-integrator-soul.md`, [
  'mobile-backend-api-integrator-workflow',
  'pod-role-bootstrap',
  'docs/plans/work-units/<work-unit-id>/',
  '03-contract-api',
  'packages/contracts',
  'Backend/API Service Owner',
  'backend implementation',
  'DB schema/migration',
  'deployment config',
  'runtime smoke',
  'rollback note',
  'service evidence',
]);

requireDocTerms(`${managedTeamDocRoot}/runtime-sources/role-souls/qa-release-soul.md`, [
  'e2e-test',
  'qa-railway-workflow',
  'pod-role-bootstrap',
  'docs/plans/work-units/<work-unit-id>/',
  'achieved_level',
  'eas-evidence/v1',
  'eas-robot-auth-setup',
  'evidence hygiene',
  'failed_check_reference',
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
  requireOrderedTopLevelHeadings(`${managedTeamDocRoot}/runtime-sources/role-souls/${roleFile}`, [
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
  requireDocTerms(`${managedTeamDocRoot}/runtime-sources/role-souls/${roleFile}`, [
    `Display Title: ${displayTitle}`,
    `Operating Role: ${operatingRole}`,
    `Authority Level: ${authorityLevel}`,
  ]);
}

for (const [roleFile, displayTitle, operatingRole] of [
  ['product-planning-soul.md', 'Chief Product Officer (CPO) / Product Delivery Lead', 'Product/Planning'],
  ['design-soul.md', 'Product Designer', 'Design'],
  ['mobile-architect-soul.md', 'Mobile Architect / Technical Lead', 'Mobile Architect'],
  ['mobile-app-dev-soul.md', 'Mobile App Developer', 'Mobile App Dev'],
  ['backend-api-integrator-soul.md', 'Backend/API Engineer', 'Backend/API Integrator'],
  ['qa-release-soul.md', 'QA/Release Engineer', 'QA/Release'],
]) {
  requireDocTerms(`${managedTeamDocRoot}/runtime-sources/role-souls/${roleFile}`, [
    `You are the ${displayTitle} operating under the ${operatingRole} runtime role`,
  ]);
}

requireDocTerms(gatesAndEvidenceDoc, [
  'Release Gatekeeper (System)',
  'Railway Boundary',
  'It does not prove:',
  'Full production release approval',
  'docs/plans/work-units/<work-unit-id>/',
  'durable GitHub handoff',
  'canonical evidence',
]);

requireDocTerms(`${managedTeamDocRoot}/source-map.md`, [
  'Chief Product Officer (CPO) / Product Delivery Lead',
  'Operating Role',
  'active-vs-historical skill crosswalk',
  'mobile-api-contract',
  'mobile-qa-release',
  'qa-railway-workflow',
  'workflows/github-artifact-workflow.md',
  'docs/plans/work-units/<work-unit-id>/',
]);

requireDocTerms(`${managedTeamDocRoot}/runtime-sources/pod-environment-bootstrap.md`, [
  '# Pod Environment Bootstrap',
  '/workspace/projects/Wondermove-Inc/new-mobile-app',
  '/workspace/CODEX_MANAGED_PATHS.md',
  'REPO_CLONE_URL',
  'standard user-facing entry point',
  'dependency/internal setup contracts',
  'advanced recovery',
  'PROJECT_BOOTSTRAP_GIT_USER_NAME',
  'PROJECT_BOOTSTRAP_GIT_IDENTITY_PATH',
  'pod-role-bootstrap` report is present and blocked',
  'approved non-secret Git identity pair',
  'browser/computer-use',
  'human-present `gh auth login`',
  'minimum request',
  'codex-cli-auth-setup',
  'pod-role-bootstrap',
  'project-bootstrap',
  'eas-robot-auth-setup',
  'stitch-adc-setup',
  '.codex/config.toml',
  'status only',
  'human-gate/v1',
  'does not prove actual OrbStack/OpenClaw pod execution',
]);

if (errors.length) {
  console.error(errors.map((error) => `- ${error}`).join('\n'));
  process.exit(1);
}

console.log('Validated current mobile-app-dev-team managed docs.');
