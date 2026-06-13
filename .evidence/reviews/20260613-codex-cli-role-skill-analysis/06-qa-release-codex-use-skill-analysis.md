# QA/Release Codex Use Skill Analysis

Date: 2026-06-13
Role: QA/Release
SOUL: `mobile-app-dev-team/02-role-souls/qa-release-soul.md`

## Role Identity And SoT Basis

QA/Release is the QA/Release Engineer role. It plans, resets, executes, and records quality/release evidence; classifies surfaces; routes failed gates; and reports residual risk. It must not implement fixes or accept production/failed-gate risk for human owners.

SoT basis:

- `qa-release-soul.md`: QA/Release owns evidence, surface classification, failed gate reporting, and release boundary.
- `PROJECT_ENVIRONMENT.md`: defines RN Web, native evidence ladder, EAS/Maestro, mobile-mcp, and external proof limits.
- `05-work-processes.md`: QA/Release creates E2E plan, resets, runs evidence, records artifacts, classifies failures, routes owners.
- `06-gates-and-evidence.md`: evidence ladder, human gates, canonical evidence paths.
- `10-github-artifact-workflow.md`: QA/Release owns `05-qa-release/*`; canonical evidence remains in workflow-owned paths.
- `.agents/skills/e2e-test/SKILL.md` and `.agents/skills/qa-railway-workflow/SKILL.md`: active QA evidence workflows.

## Current State

Usable repo-local Codex skills:

- `e2e-test` when explicitly invoked as `$e2e-test`
- `qa-railway-workflow`
- `wm-orchestrate`
- `git-workflow`

Usable custom agents:

- `wm-gate-fix-advisor`
- `wm-docs-researcher`
- legacy `mobile-gate-fix-advisor` and `mobile-docs-researcher` only where current SoT allows non-`$wm`/legacy surfaces

Pod-native setup dependencies:

- `project-bootstrap`
- `codex-cli-auth-setup`
- `pod-role-bootstrap`
- `eas-robot-auth-setup` before approved EAS/Maestro work

Durable artifacts:

- `docs/plans/work-units/<work-unit-id>/05-qa-release/e2e-plan.md`
- `docs/plans/work-units/<work-unit-id>/05-qa-release/reset-record.md`
- `docs/plans/work-units/<work-unit-id>/05-qa-release/rn-web-evidence.md`
- `docs/plans/work-units/<work-unit-id>/05-qa-release/native-evidence.md`
- `docs/plans/work-units/<work-unit-id>/05-qa-release/mobile-mcp-evidence.md`
- `docs/plans/work-units/<work-unit-id>/05-qa-release/railway-evidence.md`
- `docs/plans/work-units/<work-unit-id>/05-qa-release/eas-evidence.md`
- `docs/plans/work-units/<work-unit-id>/05-qa-release/failure-classification.md`
- `docs/plans/work-units/<work-unit-id>/05-qa-release/release-risk-summary.md`
- `docs/plans/work-units/<work-unit-id>/05-qa-release/human-approval.md`
- `docs/plans/work-units/<work-unit-id>/05-qa-release/human-approval.json`

Canonical evidence:

- `.evidence/e2e-test/<YYYYMMDD-HHMMSS>-<slug>/`
- mobile-mcp evidence paths when available
- EAS evidence ingest paths
- Railway evidence paths
- human-gate decision files

Coverage verdict: **Partial**.

QA/Release has E2E and Railway skills, but release-readiness synthesis is spread across skill outputs, evidence ladder, status.json, and human gates. A pod-native bridge is required. A dedicated release-readiness repo-local skill or reviewer may be justified if final release synthesis remains ambiguous.

## Role-Specific Codex Operating Reinforcement

QA/Release should use Codex to plan and record objective evidence, not to fix failures or accept release risk.

Required default process for this role:

1. Stay read-only while reading work-unit status, required evidence ladder, implementation/API/design evidence, QA/Release SOUL, and environment SoT.
2. Produce an evidence plan before running Playwright, Maestro, mobile-mcp, EAS, Railway, store/release, or manual human-gate workflows.
3. Send the plan to the appropriate reviewer/advisor: `wm-gate-fix-advisor` for failing-gate triage, `wm-docs-researcher` for tool/runtime uncertainty, and a future `qa-release-readiness-reviewer` if release synthesis becomes a dedicated workflow.
4. Report the reviewed evidence plan before tool execution.
5. Execute only approved evidence steps, recording reset state, command, exit status, artifact path, logs/screenshots when applicable, redaction rule, and pass/fail classifier.
6. After evidence is collected, request final reviewer verification that `05-qa-release/*` links canonical evidence, achieved evidence level satisfies required level, and failed-gate/human-gate routing is correct.
7. Run `git diff` for QA/evidence paths and `git status --short`, then report whether evidence matches the approved plan.

External-tool runbook reinforcement needed:

- QA skills should include command/prompt runbook templates for EAS, Maestro, Railway, Playwright, mobile-mcp, and manual human-gate evidence:
  - target environment;
  - reset step;
  - official-doc or repo-SoT source checked;
  - command or prompt;
  - expected artifact path;
  - pass/fail classifier;
  - failed-check owner routing;
  - redaction rule;
  - human gate if needed.
- Production submit, privacy/legal/payment, external messaging, and failed-gate-risk must remain human-gated and cannot be approved by QA/Release, reviewers, or deterministic Gatekeeper.

## Required Role-Specific Codex CLI Process

1. Confirm pod readiness.
   - Use `project-bootstrap` and `pod-role-bootstrap`.
   - Use `eas-robot-auth-setup` only when approved EAS/Maestro work is in scope.
2. Confirm role identity.
   - Resolve QA/Release from `WM_ROLE` or `/workspace/IDENTITY`.
   - Stop on role mismatch.
3. Confirm approved flow or release candidate.
   - Require work-unit status and expected evidence level.
   - Confirm Product/Planning required evidence ladder.
4. Intake SoT.
   - Read `PROJECT_ENVIRONMENT.md`, QA/Release SOUL, `05-work-processes.md`, `06-gates-and-evidence.md`, work-unit artifacts, and implementation/API/design evidence.
5. Classify target surface.
   - L0 Jest/unit/component/contract.
   - L1 RN Web/Playwright.
   - L2 EAS/Maestro native.
   - L3 human-device/mobile-mcp.
   - Railway/deployed API.
   - Manual human gate.
6. Select Codex skill.
   - E2E plan/reset/execution: `e2e-test` when explicitly invoked.
   - Railway deploy/health/RN Web with deployed API: `qa-railway-workflow`.
   - Existing `status.json` next action: `wm-orchestrate`.
   - Branch/PR: `git-workflow`.
7. Run evidence process.
   - Plan before execution.
   - Reset tested instance.
   - Run commands serially for simulator/device.
   - Record output, exit status, screenshots/logs when applicable.
8. Write QA/Release artifacts.
   - Use `05-qa-release/*` as summaries and indexes.
   - Link canonical `.evidence/e2e-test/*`, mobile-mcp, EAS, Railway, or human-gate artifacts.
   - Do not use ignored/raw evidence paths as durable handoff.
9. Classify failures.
   - Implementation issue -> Mobile App Dev.
   - Contract/API issue -> Backend/API Integrator.
   - Design issue -> Design.
   - Architecture/runtime issue -> Mobile Architect.
   - Scope/human gate -> Product/Planning or human owner.
10. Call advisor/researcher.
   - `wm-gate-fix-advisor` for failed checks.
   - `wm-docs-researcher` for tooling/runtime uncertainty.
11. Handoff.
   - Update `05-qa-release/*` and `status.json`.
   - Route failed checks with `failed_check_reference`.
   - Record release risk summary.
12. Stop conditions.
   - Required simulator/device/service unavailable.
   - EAS/Maestro/live external action lacks human approval.
   - Production submit requested without human approval.
   - Failed-gate risk acceptance requested without `human-gate/v1`.
   - Fix implementation is requested inside QA workflow.
   - Evidence may expose secrets or private endpoints.

## Current Problems

Missing process:

- Fresh QA/Release pods need a role-aware bridge from identity to evidence surface classification, skill selection, evidence ladder, and failure routing.

Missing pod-native bridge skill:

- Required. `codex-role-workflow` must map QA/Release identity to evidence surface classification, `e2e-test`, `qa-railway-workflow`, `eas-robot-auth-setup`, `05-qa-release/*`, and canonical evidence links.

Missing repo-local Codex skill:

- Possibly missing `qa-release-readiness-workflow`.
- Existing `e2e-test` and `qa-railway-workflow` are strong for execution surfaces, but they do not fully own release-readiness synthesis across RN Web, native, EAS, Railway, human gates, and failed-gate risk.

Missing custom reviewer/researcher/advisor:

- Possibly missing `qa-release-readiness-reviewer`.
- Existing `wm-gate-fix-advisor` is triage-oriented, not final readiness-review oriented.

Ambiguous handoff path:

- Medium risk. `05-qa-release/*` summaries must link canonical evidence, but there is no single role workflow that synthesizes all surfaces into release readiness.

Overlap or role-boundary risk:

- QA/Release must not implement app/backend/design/API fixes and must not mark failed gates as passed.

External proof or human-gate risk:

- RN Web, Railway, EAS, Maestro, mobile-mcp, and manual evidence prove different surfaces. Production submit and failed-gate-risk require human-gate decisions.

Validator/eval gap:

- Add eval proving QA/Release bridge classifies RN Web vs native vs EAS vs Railway.
- Add eval proving QA/Release cannot implement fixes.
- Add eval proving failed-gate risk requires human gate.

## Skill/Agent Additions Or Reinforcement

Recommendation 1:

- Add/Update: Add pod-native `codex-role-workflow`.
- Artifact path: `mobile-app-dev-team/09-pod-native-openclaw-skills/codex-role-workflow/SKILL.md`.
- Reason: QA/Release pods need role-aware surface classification and skill selection after bootstrap.
- SoT basis: QA/Release SOUL, `PROJECT_ENVIRONMENT.md`, `06-gates-and-evidence.md`, `10-github-artifact-workflow.md`.
- Used in process: evidence planning, surface classification, EAS readiness check, failure routing, release summary.
- Required inputs: bootstrap report, role identity, work-unit status, required evidence level, target surface.
- Required outputs: selected QA skill, evidence path checklist, failure routing checklist, stop reason if blocked.
- Stop conditions: external/human gate, unavailable target surface, implementation request, secret exposure.
- Validation: eval for RN Web, native, Railway, failed gate, production submit.
- Non-goals: do not run QA evidence inside the bridge skill.

Recommendation 2:

- Add/Update: Evaluate adding `qa-release-readiness-workflow`.
- Artifact path: `.agents/skills/qa-release-readiness-workflow/SKILL.md`.
- Reason: release-readiness synthesis across evidence surfaces is broader than `e2e-test` or `qa-railway-workflow` alone.
- SoT basis: QA/Release SOUL, evidence ladder, human gates, durable handoff.
- Used in process: final readiness summary before Gatekeeper/merge.
- Required inputs: implementation evidence, contract evidence, Design evidence, E2E evidence, EAS/Railway/human-gate evidence.
- Required outputs: `05-qa-release/release-risk-summary.md`, achieved evidence level, failure classification, residual risk.
- Stop conditions: missing required evidence, failed gate, human approval needed.
- Validation: skill eval for ready release, missing native evidence, failed gate risk.
- Non-goals: do not replace `e2e-test`; do not approve production submit.
- Codex process reinforcement: include read-only evidence planning, reviewer/advisor routing before tool execution, official-doc/repo-SoT check for external tools, final reviewer against evidence, `git diff`, and `git status --short`.

Recommendation 3:

- Add/Update: Consider `qa-release-readiness-reviewer`.
- Artifact path: `.codex/agents/qa-release-readiness-reviewer.toml`.
- Reason: `wm-gate-fix-advisor` advises failures, but final readiness review needs a pass/fail readiness rubric.
- SoT basis: `06-gates-and-evidence.md`, QA/Release SOUL.
- Used in process: read-only review of release summary and evidence completeness.
- Required inputs: `05-qa-release/*`, canonical evidence links, status.json.
- Required outputs: read-only findings/verdict.
- Stop conditions: no human risk acceptance; no implementation.
- Validation: agent eval.
- Non-goals: do not replace deterministic Gatekeeper.

## Role-Specific Acceptance Criteria

- QA/Release pod classifies target evidence surface before running anything.
- QA/Release pod uses `eas-robot-auth-setup` only for approved EAS/Maestro readiness.
- Evidence records command output and exit status.
- `05-qa-release/*` links canonical evidence and does not replace it.
- Failed checks route to the correct owner.
- Production submit and failed-gate risk require human-gate approval.
- Evidence plan is reviewed before tool execution and final reviewer evidence exists before Done.
- Completion report includes `git diff`/`git status --short` results for QA/evidence paths.
- QA/Release does not implement fixes or self-approve failed gates.
