#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import {
  exists,
  finish,
  forbidTerms,
  parseFrontmatter,
  read,
  requireOrderedHeadings,
  requireTerms,
  roleSoulRuntimeHeadings,
  root,
  scanSecrets,
  teamRoot,
} from './lib/team-doc-validation-helpers.mjs';

const errors = [];
const podNativeRoot = `${teamRoot}/runtime-sources/pod-native-openclaw-skills`;
const legacyPodNativeRoot = `${teamRoot}/09-pod-native-openclaw-skills`;
const roleSoulRoot = `${teamRoot}/runtime-sources/role-souls`;
const legacyRoleSoulRoot = `${teamRoot}/02-role-souls`;
const skillMatrixPath = `${teamRoot}/runtime-sources/codex-skill-agent-matrix.md`;
const podEnvironmentBootstrapPath = `${teamRoot}/runtime-sources/pod-environment-bootstrap.md`;
const orbstackPodConfigValuesPath = `${teamRoot}/runtime-sources/orbstack-pod-config-values.md`;

if (exists(legacyPodNativeRoot)) {
  errors.push(`pod-native runtime source must be reclassified out of legacy path: ${legacyPodNativeRoot}`);
}

if (exists(legacyRoleSoulRoot)) {
  errors.push(`role SOUL runtime source must be reclassified out of legacy path: ${legacyRoleSoulRoot}`);
}

const managedSkillMatrix = exists(skillMatrixPath) ? read(skillMatrixPath) : '';
const repoSkillRoot = path.join(root, '.agents/skills');
if (fs.existsSync(repoSkillRoot)) {
  const repoSkillSlugs = fs.readdirSync(repoSkillRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();
  for (const skillSlug of repoSkillSlugs) {
    if (managedSkillMatrix && !managedSkillMatrix.includes(`\`${skillSlug}\``)) {
      errors.push(`runtime source skill matrix missing active repo-local skill: ${skillSlug}`);
    }
  }
}

requireTerms(errors, skillMatrixPath, [
  'Active repo-local skills',
  '.agents/skills/<slug>/SKILL.md',
  'Current custom agents',
  '.codex/agents/<agent>.toml',
], 'runtime source');

for (const roleFile of [
  'product-planning-soul.md',
  'design-soul.md',
  'mobile-architect-soul.md',
  'mobile-app-dev-soul.md',
  'backend-api-integrator-soul.md',
  'qa-release-soul.md',
]) {
  requireOrderedHeadings(errors, `${roleSoulRoot}/${roleFile}`, roleSoulRuntimeHeadings);
  requireTerms(errors, `${roleSoulRoot}/${roleFile}`, [
    'Display Title:',
    'Operating Role:',
    'Authority Level:',
    'Sub-Agent & Background Delegation',
  ], 'runtime SOUL');
}

requireTerms(errors, `${podNativeRoot}/README.md`, [
  'source-only',
  '/workspace/skills/<slug>/SKILL.md',
  '## Start Here',
  'Normal user-facing setup after clone or pull starts from `openclaw-pod-skills-sync`, then `project-bootstrap`',
  '## Copy-Paste Safe Setup Commands',
  'export REPO_CLONE_URL="https://github.com/Wondermove-Inc/new-mobile-app.git"',
  'bash /workspace/skills/openclaw-pod-skills-sync/scripts/sync-pod-skills.sh',
  'role_slug="<canonical-role-slug>"',
  'bash /workspace/skills/project-bootstrap/scripts/project-bootstrap-agent-setup.sh',
  'bash /workspace/skills/project-bootstrap/scripts/project-bootstrap-preflight.sh',
  '<current-user-language> placeholder',
  '## Role Slug Resolution Table',
  'mobile-app-dev-team/runtime-sources/pod-native-openclaw-skills/product-planning-agent-runtime-spec.md',
  'mobile-app-dev-team/runtime-sources/pod-native-openclaw-skills/design-agent-runtime-spec.md',
  'mobile-app-dev-team/runtime-sources/pod-native-openclaw-skills/mobile-architect-agent-runtime-spec.md',
  'mobile-app-dev-team/runtime-sources/pod-native-openclaw-skills/mobile-app-dev-agent-runtime-spec.md',
  'mobile-app-dev-team/runtime-sources/pod-native-openclaw-skills/backend-api-integrator-agent-runtime-spec.md',
  'mobile-app-dev-team/runtime-sources/pod-native-openclaw-skills/qa-release-agent-runtime-spec.md',
  '## Where To Read Runtime Specs',
  '/workspace/skills/codex-role-workflow/SKILL.md',
  'matching role runtime specification',
  'product-planning-agent-runtime-spec.md',
  'design-agent-runtime-spec.md',
  'mobile-architect-agent-runtime-spec.md',
  'mobile-app-dev-agent-runtime-spec.md',
  'backend-api-integrator-agent-runtime-spec.md',
  'qa-release-agent-runtime-spec.md',
  'product-planning',
  'design',
  'mobile-architect',
  'mobile-app-dev',
  'backend-api-integrator',
  'qa-release',
  '## Stop Rules When Project Bootstrap Is Blocked',
  'project-bootstrap is blocked',
  'role work is forbidden',
  'translated blocker',
  'minimum user-owned request',
  '## Mandatory Report Checklist',
  '/workspace/state/openclaw-pod-skills-sync-report.json',
  '/workspace/state/project-bootstrap-agent-setup-report.json',
  '/workspace/state/project-bootstrap-report.json',
  '/workspace/state/project-bootstrap-blockers.md',
  'commands run',
  'local proof boundary',
  '## Human-Owned Auth And Secret Safety Examples',
  'Do not send secrets in chat',
  'Do not place repo-local Codex CLI artifacts here',
  '## Per-Role Required Pod Skills',
  'codex-role-workflow',
], 'pod-native runtime source');

function requirePodNativeSkill(relativePath, slug, scriptName) {
  const skillPath = `${relativePath}/SKILL.md`;
  requireTerms(errors, skillPath, [
    `name: ${slug}`,
    'description:',
    `/workspace/skills/${slug}/SKILL.md`,
    'status only',
    'auth token values',
  ], 'pod-native skill');
  forbidTerms(errors, skillPath, [
    'cat ~/.codex/auth.json',
    'cat /root/.codex/auth.json',
    'OPENAI_API_KEY=',
    'EXPO_TOKEN=',
    'GITHUB_TOKEN=',
    'GOOGLE_APPLICATION_CREDENTIALS=',
  ], 'pod-native skill');

  if (exists(skillPath)) {
    const frontmatter = parseFrontmatter(read(skillPath));
    if (!frontmatter) {
      errors.push(`pod-native OpenClaw skill missing YAML frontmatter: ${skillPath}`);
    } else if (frontmatter.name !== slug) {
      errors.push(`pod-native OpenClaw skill frontmatter name must be ${slug}: ${skillPath}`);
    }
  }

  requireTerms(errors, `${relativePath}/scripts/${scriptName}`, [
    'set -euo pipefail',
    'redact()',
  ], 'pod-native skill script');
  requireTerms(errors, `${relativePath}/references/report-template.md`, [], 'pod-native report template');
}

requirePodNativeSkill(`${podNativeRoot}/codex-cli-auth-setup`, 'codex-cli-auth-setup', 'codex-cli-precheck.sh');
requirePodNativeSkill(`${podNativeRoot}/pod-role-bootstrap`, 'pod-role-bootstrap', 'pod-bootstrap.sh');
requirePodNativeSkill(`${podNativeRoot}/project-bootstrap`, 'project-bootstrap', 'project-bootstrap-preflight.sh');
requirePodNativeSkill(`${podNativeRoot}/openclaw-pod-skills-sync`, 'openclaw-pod-skills-sync', 'sync-pod-skills.sh');
requirePodNativeSkill(`${podNativeRoot}/eas-robot-auth-setup`, 'eas-robot-auth-setup', 'eas-robot-auth-precheck.sh');
requirePodNativeSkill(`${podNativeRoot}/stitch-adc-setup`, 'stitch-adc-setup', 'stitch-adc-precheck.sh');

requireTerms(errors, `${podNativeRoot}/pod-role-bootstrap/SKILL.md`, [
  'POD_ROLE_BOOTSTRAP_INSTALL_APPROVED=true',
  'agent must report the exact dependency install plan',
  'for explicit approval',
], 'pod-native role bootstrap install approval');
requireTerms(errors, `${podNativeRoot}/pod-role-bootstrap/scripts/pod-bootstrap.sh`, [
  'POD_ROLE_BOOTSTRAP_INSTALL_APPROVED',
  'pnpm install requires explicit approval',
  'pod-role-bootstrap install approval required',
], 'pod-native role bootstrap install approval');
requireTerms(errors, `${podNativeRoot}/codex-cli-auth-setup/SKILL.md`, [
  'agent must report the exact package and version',
  'target and wait for explicit approval',
  '@openai/codex@<approved-version>',
], 'pod-native codex install approval');
forbidTerms(errors, `${podNativeRoot}/codex-cli-auth-setup/SKILL.md`, [
  'npm i -g @openai/codex@latest',
], 'pod-native codex install approval');
requireTerms(errors, `${podNativeRoot}/project-bootstrap/references/blocker-resolution-guide.md`, [
  'POD_ROLE_BOOTSTRAP_INSTALL_APPROVED=true',
  'pod-role-bootstrap install approval required',
], 'pod-native blocker install approval');

requireTerms(errors, `${podNativeRoot}/codex-role-workflow/SKILL.md`, [
  'name: codex-role-workflow',
  'description:',
  'human-gate/v1',
  'repo-local Codex skills',
], 'pod-native role workflow skill');

const podRuntimeSpecs = [
  ['product-planning-agent-runtime-spec.md', 'product-planning'],
  ['design-agent-runtime-spec.md', 'design'],
  ['mobile-architect-agent-runtime-spec.md', 'mobile-architect'],
  ['mobile-app-dev-agent-runtime-spec.md', 'mobile-app-dev'],
  ['backend-api-integrator-agent-runtime-spec.md', 'backend-api-integrator'],
  ['qa-release-agent-runtime-spec.md', 'qa-release'],
];

for (const [runtimeSpec, roleSlug] of podRuntimeSpecs) {
  const runtimeSpecPath = `${podNativeRoot}/${runtimeSpec}`;
  requireTerms(errors, runtimeSpecPath, [
    'Runtime',
    'SOUL',
    `role_slug="${roleSlug}"`,
    'PROJECT_BOOTSTRAP_ROLE_SLUG="${role_slug}"',
    'PROJECT_BOOTSTRAP_ROLE_SOUL_PATH="/workspace/SOUL.md"',
    'bash /workspace/skills/project-bootstrap/scripts/project-bootstrap-agent-setup.sh',
    'source /workspace/state/project-bootstrap-role.env',
    'write those identity surfaces directly as a substitute for the setup script',
  ], 'pod-native runtime spec');
  forbidTerms(errors, runtimeSpecPath, [
    'export WM_ROLE="${role_slug}"',
    'export WM_EXPECTED_ROLE="${role_slug}"',
    'printf \'%s\\n\' "${role_slug}" > /workspace/IDENTITY',
    'Recommended aligned',
  ], 'pod-native runtime spec');
}

requireTerms(errors, `${podNativeRoot}/project-bootstrap/SKILL.md`, [
  'role_slug="<canonical-role-slug>"',
  'Do not copy the placeholder literally',
], 'project bootstrap role selection');
forbidTerms(errors, `${podNativeRoot}/project-bootstrap/SKILL.md`, [
  'role_slug="product-planning"',
], 'project bootstrap role selection');

requireTerms(errors, podEnvironmentBootstrapPath, [
  '/workspace/projects/Wondermove-Inc/new-mobile-app',
  '/workspace/state',
  'PROJECT_BOOTSTRAP_REPORT_PATH',
  'Secret values are never printed',
], 'pod bootstrap source');

requireTerms(errors, orbstackPodConfigValuesPath, [
  '# OrbStack Pod Config Values',
  'non-secret values',
  'owner/operator',
  'not live pod evidence',
], 'pod config values source');

scanSecrets(errors, roleSoulRoot);
scanSecrets(errors, podNativeRoot);

finish(errors, 'Validated runtime source docs.');
