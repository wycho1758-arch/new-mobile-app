#!/usr/bin/env node
import { exists, finish, listFiles, read, requireTerms, teamRoot } from './lib/team-doc-validation-helpers.mjs';

const errors = [];
const refRoot = `${teamRoot}/ref-organization`;
const archiveRoot = `${teamRoot}/_archive`;

for (const section of [
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
]) {
  const readme = `${refRoot}/${section}/README.md`;
  if (!exists(readme)) errors.push(`missing reference organization section README: ${readme}`);
}

for (const staleSection of [
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
]) {
  if (exists(`${refRoot}/${staleSection}`)) {
    errors.push(`reference organization section must drop numeric prefix: ${refRoot}/${staleSection}`);
  }
}

requireTerms(errors, `${refRoot}/README.md`, [
  '# Reference Organization',
  'current WonderMove mobile project as a concrete example',
  'reusable',
], 'reference index');

requireTerms(errors, `${refRoot}/source-map-and-migration/README.md`, [
  'Source Map And Migration',
  'Historical Vs Active',
  'source-priority.md',
  'old-to-new',
  'team-doc/10-structured',
], 'reference crosswalk');

requireTerms(errors, `${teamRoot}/README.md`, [
  '# Mobile App Dev Team',
  '문서 구조',
  'source-map.md',
  'ref-organization/',
], 'team doc index');

if (exists(`${teamRoot}/99-source-map.md`)) {
  errors.push(`${teamRoot}/99-source-map.md must be renamed to ${teamRoot}/source-map.md`);
}

requireTerms(errors, `${teamRoot}/source-map.md`, [
  '# Source Map',
  'Current Repo Sources',
  'Runtime Surface Classes',
  'Old-To-New Rename Crosswalk',
  'Validator Responsibility Crosswalk',
  'Harness Applicability Crosswalk',
  'Historical/Archive Crosswalk',
  'External Proof Boundary',
], 'source map');

const completedPlanArchives = [
  {
    targetPath: `${archiveRoot}/completed-plans/role-title-update-plan.md`,
    stalePath: `${archiveRoot}/08-role-title-update-plan.md`,
  },
  {
    targetPath: `${archiveRoot}/completed-plans/pod-native-openclaw-skill-plan.md`,
    stalePath: `${archiveRoot}/09-pod-native-openclaw-skill-plan.md`,
  },
  {
    targetPath: `${archiveRoot}/completed-plans/openclaw-codex-completion-hooks-plan.md`,
    stalePath: `${archiveRoot}/11-openclaw-codex-completion-hooks-plan.md`,
  },
  {
    targetPath: `${archiveRoot}/completed-plans/ref-organization-goal-plan.md`,
    stalePath: `${archiveRoot}/12-ref-organization-goal-plan.md`,
  },
  {
    targetPath: `${archiveRoot}/completed-plans/pod-organization-e2e-improvement-plan.md`,
    stalePath: `${archiveRoot}/13-pod-organization-e2e-improvement-plan.md`,
  },
  {
    targetPath: `${archiveRoot}/completed-plans/orbstack-pod-config-setup-runbook-plan.md`,
    stalePath: `${archiveRoot}/18-orbstack-pod-config-setup-runbook-plan.md`,
  },
  {
    targetPath: `${archiveRoot}/completed-plans/orbstack-pod-operator-input-request.md`,
    stalePath: `${archiveRoot}/orbstack-pod-operator-input-request.md`,
  },
];

for (const { targetPath, stalePath } of completedPlanArchives) {
  if (!exists(targetPath)) errors.push(`missing completed-plan archive: ${targetPath}`);
  if (exists(stalePath)) errors.push(`completed-plan archive must be reclassified out of archive root: ${stalePath}`);
}

const archiveReclassifications = [
  {
    targetPath: `${archiveRoot}/historical-inspections/20260609-structure-inspection-sot.md`,
    stalePath: `${archiveRoot}/20260609-structure-inspection-sot.md`,
    label: 'historical inspection archive',
  },
  {
    targetPath: `${archiveRoot}/preconsolidation/ref-organization-20260612/README.md`,
    stalePath: `${archiveRoot}/ref-organization-preconsolidation-20260612`,
    label: 'preconsolidation archive',
  },
];

for (const { targetPath, stalePath, label } of archiveReclassifications) {
  if (!exists(targetPath)) errors.push(`missing ${label}: ${targetPath}`);
  if (exists(stalePath)) errors.push(`${label} must be reclassified out of archive root: ${stalePath}`);
}

for (const staleTopLevel of [
  `${teamRoot}/08-role-title-update-plan.md`,
  `${teamRoot}/09-pod-native-openclaw-skill-plan.md`,
  `${teamRoot}/11-openclaw-codex-completion-hooks-plan.md`,
  `${teamRoot}/12-ref-organization-goal-plan.md`,
  `${teamRoot}/13-pod-organization-e2e-improvement-plan.md`,
  `${teamRoot}/18-orbstack-pod-config-setup-runbook-plan.md`,
]) {
  if (exists(staleTopLevel)) errors.push(`completed plan must be archived, not current top-level doc: ${staleTopLevel}`);
}

const sourceMap = exists(`${teamRoot}/source-map.md`) ? read(`${teamRoot}/source-map.md`) : '';
for (const requiredReference of [
  'mobile-app-dev-team/ref-organization/',
  'mobile-app-dev-team/ref-organization/source-map-and-migration/README.md',
]) {
  if (!sourceMap.includes(requiredReference)) {
    errors.push(`source map missing reference organization path family: ${requiredReference}`);
  }
}

finish(errors, 'Validated reference docs.');
