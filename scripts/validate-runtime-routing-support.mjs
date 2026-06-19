#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const readmePath = 'mobile-app-dev-team/README.md';
const codexRoleWorkflowPath = 'mobile-app-dev-team/runtime-sources/pod-native-openclaw-skills/codex-role-workflow/SKILL.md';
const managedRepoEntryCasePath = '/workspace/projects/Wondermove-Inc/new-mobile-app/mobile-app-dev-team/workflows/entry-case-routing.md';
const forbiddenRuntimeRelativePath = '/workspace/skills/codex-role-workflow/mobile-app-dev-team/workflows/entry-case-routing.md';

const readmeRequiredTerms = [
  '# Mobile App Dev Team',
  '## Pod Role Runtime Entrypoint',
  'openclaw-pod-skills-sync -> project-bootstrap -> matching role runtime specification -> codex-role-workflow',
  'If project-bootstrap is blocked, role work is forbidden',
  '/workspace/skills/<slug>/SKILL.md',
  'runtime snapshot',
  'PRD acceptance line or explicit non-goal reference',
  'human-gate/v1',
  'Gatekeeper, reviewer, pod, or LLM role cannot replace human approval',
  'production-submit',
  'failed-gate-risk',
];

const supportSotRequiredTerms = {
  'mobile-app-dev-team/workflows/entry-case-routing.md': [
    '# Entry Case Routing',
    'human-gate/v1',
    'SoT-Named Input Categories',
    'not-applicable',
  ],
  'mobile-app-dev-team/workflows/Product_Planning_WORKFLOW.md': [
    '# Product Planning Workflow',
    'Design Readiness',
    'API Readiness',
    'human gates',
  ],
  'mobile-app-dev-team/governance/gates-and-evidence.md': [
    '# Gates And Evidence',
    'human-gate/v1',
    'Durable GitHub Handoff',
    'Railway Boundary',
  ],
  'mobile-app-dev-team/workflows/github-artifact-workflow.md': [
    '# GitHub Artifact Workflow',
    'docs/plans/work-units/<work-unit-id>/',
    'role artifact',
  ],
  'mobile-app-dev-team/governance/app-eas-ota-rollback-runbook.md': [
    '# App / EAS / OTA Rollback Runbook',
    'rollback_owner',
    'production-submit',
  ],
};
const runtimeRoutingRequiredTerms = {
  [readmePath]: readmeRequiredTerms,
  ...supportSotRequiredTerms,
};

const codexRoleWorkflowRequiredTerms = [
  'Process Routing Sources',
  ...Object.keys(supportSotRequiredTerms),
  'Runtime Repo Path Resolution',
  'Do not resolve repo SoT paths relative to `/workspace/skills/codex-role-workflow`',
  managedRepoEntryCasePath,
  'missing accepted entry-case routing SoT',
];

function loadRepoFiles() {
  const relativePaths = [readmePath, codexRoleWorkflowPath, ...Object.keys(supportSotRequiredTerms)];
  const files = {};
  const errors = [];

  for (const relativePath of relativePaths) {
    const absolutePath = path.join(root, relativePath);
    if (!fs.existsSync(absolutePath)) {
      errors.push(`missing routing support file: ${relativePath}`);
      continue;
    }
    files[relativePath] = fs.readFileSync(absolutePath, 'utf8');
  }

  return { files, errors };
}

function requireTerms(files, relativePath, terms, errors) {
  const body = files[relativePath];
  if (body === undefined) {
    errors.push(`missing routing support file: ${relativePath}`);
    return;
  }

  for (const term of terms) {
    if (!body.includes(term)) {
      errors.push(`${relativePath} missing required routing-support term: ${term}`);
    }
  }
}

function validateRoutingSupport(files) {
  const errors = [];

  requireTerms(files, readmePath, readmeRequiredTerms, errors);
  requireTerms(files, codexRoleWorkflowPath, codexRoleWorkflowRequiredTerms, errors);

  const codexRoleWorkflowBody = files[codexRoleWorkflowPath] ?? '';
  if (codexRoleWorkflowBody.includes(forbiddenRuntimeRelativePath)) {
    errors.push(`${codexRoleWorkflowPath} must not resolve managed repo SoT under /workspace/skills/codex-role-workflow`);
  }

  for (const [relativePath, terms] of Object.entries(supportSotRequiredTerms)) {
    requireTerms(files, relativePath, terms, errors);
  }

  return errors;
}

function runSelfTest() {
  const validFiles = {
    [readmePath]: readmeRequiredTerms.join('\n'),
    [codexRoleWorkflowPath]: codexRoleWorkflowRequiredTerms.join('\n'),
  };
  for (const [supportPath, terms] of Object.entries(supportSotRequiredTerms)) {
    validFiles[supportPath] = `${terms.join('\n')}\n`;
  }
  const missingManagedRepoPathFiles = {
    ...validFiles,
    [codexRoleWorkflowPath]: validFiles[codexRoleWorkflowPath]
      .replace(managedRepoEntryCasePath, forbiddenRuntimeRelativePath),
  };
  const requiredSupportSotPaths = Object.keys(runtimeRoutingRequiredTerms);

  const cases = [
    ['valid routing support fixture', validFiles, true],
    ['missing managed repo path fixture', missingManagedRepoPathFiles, false],
    ...requiredSupportSotPaths.map((supportPath) => {
      const files = { ...validFiles };
      delete files[supportPath];
      return [`missing support SoT fixture: ${supportPath}`, files, false];
    }),
    ...requiredSupportSotPaths.map((supportPath) => {
      const files = { ...validFiles };
      const staleTerm = runtimeRoutingRequiredTerms[supportPath][1];
      files[supportPath] = files[supportPath].replace(staleTerm, '');
      return [`stale support SoT fixture: ${supportPath} missing ${staleTerm}`, files, false];
    }),
  ];
  const failures = [];
  for (const [label, files, shouldPass] of cases) {
    const errors = validateRoutingSupport(files);
    const passed = errors.length === 0;
    if (passed !== shouldPass) {
      failures.push(`${label}: expected ${shouldPass ? 'pass' : 'fail'}, got ${passed ? 'pass' : 'fail'}`);
    }
  }

  if (failures.length) {
    console.error(failures.map((failure) => `- ${failure}`).join('\n'));
    process.exit(1);
  }

  console.log('Validated runtime routing support fixtures.');
}

if (process.argv.includes('--self-test')) {
  runSelfTest();
  process.exit(0);
}

const { files, errors: loadErrors } = loadRepoFiles();
const errors = [...loadErrors, ...validateRoutingSupport(files)];
if (errors.length) {
  console.error(errors.map((error) => `- ${error}`).join('\n'));
  process.exit(1);
}

console.log('Validated runtime routing support docs.');
