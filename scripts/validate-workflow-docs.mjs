#!/usr/bin/env node
import { exists, finish, requireTerms, teamRoot } from './lib/team-doc-validation-helpers.mjs';

const errors = [];

requireTerms(errors, `${teamRoot}/workflows/Product_Planning_WORKFLOW.md`, [
  '# Product Planning Workflow',
  'agent-consumed Product/Planning workflow',
  'not the workspace-neutral `/workspace/WORKFLOW.md`',
  'CPO Planning And Feedback Loop',
  'Practitioner plan request',
  'CPO completion feedback loop',
  'CPO 계획 및 피드백 루프',
  '실무자 계획 요청',
  'CPO 완료 피드백 루프',
  'goal, owner, scope, deadline, expected output, and approval boundary',
  'facts, assumptions, decisions, blockers, and next actions',
  'Intake -> Plan -> Gather evidence -> Produce -> Review -> Deliver -> Follow through',
  'Jira/tasks',
  'Confluence/wiki',
  'GitHub/repository',
  'workspace files',
  'Status reports must state:',
  'wake-guard',
  'user-visible status update',
  'Secret safety',
  'destructive, production, financial, legal, security-sensitive, or externally visible actions',
  'Workboard',
  'Tasks for agent-executable work packages',
  'Before reporting status, re-check the current source of truth',
  'Reviewer evidence should include reviewer identity',
  'READY_FOR_EXECUTION must be recorded in durable SoT',
  'repo-local skills and workflow documents must be followed when in scope',
  'Failed check remains failed',
  'Role-Centered Operation Check',
  'exact runtime role',
  'reports-to role',
  'escalation owner',
  'owns / must not own',
  'handoff targets',
  'human-gate boundary',
  'deterministic Gatekeeper is a system role',
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
