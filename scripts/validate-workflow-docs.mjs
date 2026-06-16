#!/usr/bin/env node
import { exists, finish, requireTerms, teamRoot } from './lib/team-doc-validation-helpers.mjs';

const errors = [];

requireTerms(errors, `${teamRoot}/workflows/work-processes.md`, [
  '# Work Processes',
  '$wm',
  'docs/plans/work-units/<work-unit-id>/',
  'human gates',
  'Design Readiness',
  'API Readiness',
], 'workflow doc');

requireTerms(errors, `${teamRoot}/workflows/github-artifact-workflow.md`, [
  '# GitHub Artifact Workflow',
  'pod-isolated',
  'No shared storage',
  'GitHub branch/commit/PR',
  'docs/plans/work-units/<work-unit-id>/',
  'status: required | not-applicable | deferred/non-goal',
], 'workflow doc');

requireTerms(errors, `${teamRoot}/workflows/native-e2e-strategy.md`, [
  '# Native E2E Strategy',
  'Evidence Ladder',
  'L0',
  'L1',
  'L2',
  'L3',
  'RN Web',
  'mobile-mcp',
], 'workflow doc');

requireTerms(errors, `${teamRoot}/workflows/entry-case-routing.md`, [
  '# Entry Case Routing',
  'Common Entry Point',
  'SoT-Named Input Categories',
  'human-gate/v1',
  'not-applicable',
], 'workflow doc');

requireTerms(errors, 'docs/plans/work-units/README.md', [
  'docs/plans/work-units/<work-unit-id>/',
  'durable handoff',
  'GitHub branch/commit/PR',
  'status: required | not-applicable | deferred/non-goal',
  'owner',
  'evidence requirement',
], 'workflow handoff doc');

for (const dir of [
  '.',
  '00-product-planning',
  '01-design',
  '02-architecture',
  '03-contract-api',
  '04-mobile-app',
  '05-qa-release',
  '06-gatekeeper',
  '07-pr',
]) {
  const sampleReadme = dir === '.'
    ? 'docs/plans/work-units/sample-role-handoff/README.md'
    : `docs/plans/work-units/sample-role-handoff/${dir}/README.md`;
  if (!exists(sampleReadme)) errors.push(`missing sample work-unit workflow readme: ${sampleReadme}`);
}

finish(errors, 'Validated workflow docs.');
