# Work Processes

## 1. Intake And Planning

1. Chief Product Officer (CPO) / Product Delivery Lead receives the user request through Product/Planning.
2. If unclear, run `po-requirement-office-hours`.
3. If broad, run `po-work-unit-planning-and-agent-sprint`.
4. If ready, run `po-prd-to-execution`.
5. Before execution, run `po-planning-completeness-review`.
6. Route technical decisions to Mobile Architect / Technical Lead before execution when architecture, runtime, API, route/state, dependency, or releaseability risk exists.
7. Route human gates before any execution work.
8. For pod-isolated role-agent work, create or update the durable GitHub handoff root under `docs/plans/work-units/<work-unit-id>/` as defined in `workflows/github-artifact-workflow.md`.

## 2. Design Readiness

1. Product Designer receives an approved requirement or task through Design.
2. Confirm `DESIGN.md` decision.
3. Prepare P0 scope/evidence approval packet.
4. Stop until Product/Planning records P0 approval.
5. Generate exactly two Stitch options.
6. Prepare P1 scope/evidence approval packet.
7. Stop until Product/Planning records P1 approval.
8. Extract/publish HTML and image artifacts.
9. Request `design-reviewer` before Mobile App Dev implementation begins.

> Design relevance / `not-applicable` criteria for the `01-design` stage are documented in `workflows/entry-case-routing.md` §P-1 (managed-doc guidance).

## 3. API Readiness

1. Backend/API Engineer receives API-backed task or contract uncertainty through Backend/API Integrator.
2. Update or confirm `packages/contracts`.
3. Align mocks, fixtures, auth/session, and error mapping.
4. If the approved scope includes backend service delivery, implement the bounded `apps/api` change with DB schema/migration note, deployment config note, runtime smoke result, rollback note, and service evidence.
5. Ask Mobile Architect / Technical Lead to co-review contract impact when integration starts.
6. Hand off stable contract and service evidence to Mobile App Dev and QA/Release.

## 4. Implementation

1. `$wm` establishes scope, owner, affected paths, tests, evidence path, gate impact, and SoT sources.
2. `$wm` routes material planning decisions to the relevant existing read-only custom agent when practical, or records the skip reason.
3. `$wm` records planning sub-agent results with agent, question, conclusion, source refs or evidence path, and reflection/impact.
4. Add or update the narrowest failing test/eval/validator/fixture first.
5. Mobile App Developer or Backend/API Engineer implements the smallest scoped change through the relevant operating role; do not delegate implementation to a write-capable executor.
6. Run applicable local checks.
7. Request read-only reviewer evidence.
8. Prepare PR-ready diff and evidence summary.
9. When another pod must consume the result, commit the role artifact and GitHub branch/PR link under `docs/plans/work-units/<work-unit-id>/`; do not rely on local workspace state as handoff.

## 5. QA And Release Evidence

1. QA/Release Engineer creates an E2E/evidence plan through QA/Release.
2. Reset the tested instance.
3. Run planned RN Web, Maestro, mobile-mcp, Railway, or manual HUMAN-GATE evidence.
4. Record commands, logs, screenshots, issues, and summary.
5. Classify failures and route to owner.
6. Production submit requires recorded human approval.
7. Work-unit QA files summarize and link canonical evidence paths; they do not replace `.evidence/e2e-test/...`, mobile-mcp, EAS, Railway, or human-gate evidence records.

## 6. Failure Loop

1. Failed check remains failed.
2. `wm-gate-fix-advisor` may classify failure read-only.
3. Owning implementation workflow fixes the issue.
4. QA/Release reruns or records the relevant evidence.
5. Rework cap or risk acceptance goes to Product/Planning/human owner.
