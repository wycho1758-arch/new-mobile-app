# Backend/API Integrator Codex Use Skill Analysis

Date: 2026-06-13
Role: Backend/API Integrator
SOUL: `mobile-app-dev-team/02-role-souls/backend-api-integrator-soul.md`

## Role Identity And SoT Basis

Backend/API Integrator is the Backend/API Engineer role. It owns mobile-facing API contracts, shared zod schemas, TypeScript types, auth/session behavior, error mapping, mocks, fixtures, and bounded backend service delivery when explicitly approved.

SoT basis:

- `backend-api-integrator-soul.md`: Backend/API Integrator owns `packages/contracts`, mocks/fixtures, API behavior, and bounded backend service scope; it must not implement React Native UI or duplicate types.
- `AGENTS.md`: `packages/contracts` is the single SoT; API import direction and migrations have constraints.
- `05-work-processes.md`: API readiness updates/confirms `packages/contracts`, aligns mocks/fixtures/auth/session/errors, and provides service evidence when backend scope is approved.
- `10-github-artifact-workflow.md`: Backend/API Integrator owns `03-contract-api/*`.
- `.agents/skills/mobile-backend-api-integrator-workflow/SKILL.md`: active repo-local API workflow.

## Current State

Usable repo-local Codex skills:

- `mobile-backend-api-integrator-workflow`
- `wm` only when explicitly invoked
- `wm-orchestrate`
- `git-workflow`

Usable custom agents:

- `wm-contract-reviewer`
- `wm-docs-researcher`
- `wm-implementation-reviewer` only for cross-scope implementation review
- `wm-gate-fix-advisor` for failed gate triage

Pod-native setup dependencies:

- `project-bootstrap`
- `codex-cli-auth-setup`
- `pod-role-bootstrap`

Durable artifacts:

- `docs/plans/work-units/<work-unit-id>/03-contract-api/api-contract.md`
- `docs/plans/work-units/<work-unit-id>/03-contract-api/contract-diff.md`
- `docs/plans/work-units/<work-unit-id>/03-contract-api/mock-fixture-report.md`
- `docs/plans/work-units/<work-unit-id>/03-contract-api/backend-service-evidence.md`
- `docs/plans/work-units/<work-unit-id>/03-contract-api/migration-note.md`
- `docs/plans/work-units/<work-unit-id>/03-contract-api/runtime-smoke.md`
- `docs/plans/work-units/<work-unit-id>/03-contract-api/rollback-note.md`
- `docs/plans/work-units/<work-unit-id>/03-contract-api/reviewer.md`

Actual code surfaces:

- `packages/contracts/**`
- `apps/api/**` only when approved
- mocks/fixtures supporting mobile integration

Coverage verdict: **Partial but strong**.

The primary repo-local API skill exists. The missing part is a pod-native role bridge and possible reinforcement around contract-only vs integration-only vs bounded backend service delivery.

## Role-Specific Codex Operating Reinforcement

Backend/API Integrator should use Codex as a contract-first API workflow, not as an app-side integration shortcut.

Required default process for this role:

1. Stay read-only while classifying the request as contract-only, mock/fixture, bounded backend service, migration, deployment config, or service evidence.
2. Read `packages/contracts`, Backend/API SOUL, work-unit scope, Mobile Architect notes, and current app/API usage before planning.
3. Produce an API plan with endpoint/schema/auth/session/error/mocks/fixtures/migration/runtime-smoke/rollback/evidence impact.
4. Send the plan to `wm-contract-reviewer`; use `wm-docs-researcher` when Railway, auth, DB tooling, deployment CLI, or framework behavior is uncertain.
5. Report the reviewed plan before modifying contracts, API code, mocks, fixtures, or service configuration.
6. After work is complete, request final reviewer verification that shared schemas remain in `packages/contracts`, app/API types are not duplicated, and `03-contract-api/*` evidence matches the approved plan.
7. Run `git diff` for contract/API/evidence paths and `git status --short`, then report whether Mobile App Dev and QA/Release can consume the result without guessing.

### Codex API Contract Plan Packet

The API plan must be concrete enough for Mobile App Dev and QA/Release to consume without guessing. A plan that names a feature but omits endpoint shape, schema names, fixtures, or error mapping is not sufficient for this role.

Required packet fields:

- work-unit id and consuming mobile flow;
- work type classification: contract-only, mock/fixture, bounded backend service, migration, deployment config, or service evidence;
- endpoint, method, and path when an HTTP API is involved;
- zod schema names in `packages/contracts`;
- request and response examples;
- auth, session, and error mapping;
- mocks, fixtures, and fixture ownership;
- compatibility or breaking-change assessment;
- migration, rollback, runtime-smoke, and service-evidence paths when scoped;
- verification commands to run and expected evidence path;
- plan reviewer output path;
- final reviewer output path.

Execution constraints:

- No contract, API, mock, fixture, migration, or service-config edit before the reviewed plan report exists.
- No final completion report before final reviewer has checked actual diff, command output, evidence, `packages/contracts`, duplicate type avoidance, and `03-contract-api/*` artifacts against the approved plan.
- The completion report must summarize `git diff` for changed paths and full `git status --short`.
- If the packet lacks approved backend scope, migration approval, service evidence path, or a consuming mobile flow, the correct result is `blocked` or handoff, not inference.

Skill reinforcement needed:

- `mobile-backend-api-integrator-workflow` should include an API contract prompt/checklist:
  - work type;
  - endpoint and method;
  - request/response zod schemas;
  - auth/session behavior;
  - error mapping;
  - mocks and fixtures;
  - mobile loading/retry implications;
  - migration and rollback impact;
  - runtime smoke;
  - QA evidence handoff.
- External service/tool use such as Railway, auth providers, database tooling, deployment CLIs, or cloud dashboards must require official-doc verification or `wm-docs-researcher` routing.
- The actual `.agents/skills/mobile-backend-api-integrator-workflow/SKILL.md` is thinner than this analysis. A later skill implementation should add the complete Codex API Contract Plan Packet, pre-implementation reviewer, final reviewer, `git diff`, `git status --short`, and `03-contract-api/*` durable artifact contract.

## Required Role-Specific Codex CLI Process

1. Confirm pod readiness.
   - Use `project-bootstrap` and `pod-role-bootstrap` reports.
2. Confirm role identity.
   - Resolve Backend/API Integrator from `WM_ROLE` or `/workspace/IDENTITY`.
   - Stop on role mismatch.
3. Confirm approved API/backend scope.
   - Determine whether the work is contract-only, mock/fixture integration, bounded `apps/api` backend service, migration, deployment config, or service evidence.
4. Intake SoT.
   - Read `AGENTS.md`, `PROJECT_ENVIRONMENT.md`, Backend/API SOUL, `packages/contracts`, API/task artifacts, Mobile Architect notes where relevant.
5. Select Codex skill.
   - API contract/integration: `mobile-backend-api-integrator-workflow`.
   - Existing work-unit next action: `wm-orchestrate`.
   - Branch/PR: `git-workflow`.
6. Apply contract-first workflow.
   - Define or update shared schemas in `packages/contracts` before app/API duplication.
   - Align mocks, fixtures, auth/session, error mapping, loading/retry implications.
7. Implement backend only when approved.
   - Keep `apps/api` imports routes -> services -> db.
   - Use approved migration procedure only.
   - Record runtime smoke, deployment config note, rollback note, and service evidence.
8. Call reviewer/researcher.
   - `wm-contract-reviewer` for contract/API drift.
   - `wm-docs-researcher` for tooling/runtime uncertainty.
   - `wm-gate-fix-advisor` for failed checks.
9. Write Backend/API artifacts.
   - Use `03-contract-api/*`.
   - Link actual `packages/contracts` changes and service evidence.
10. Handoff.
   - Mobile App Dev consumes contract/mocks/fixtures.
   - QA/Release consumes service evidence and release-risk notes.
   - Mobile Architect co-reviews route/state/runtime contract impact.
11. Stop conditions.
   - Request requires React Native UI.
   - Request duplicates API types outside `packages/contracts`.
   - Backend service scope is not approved.
   - Migration has irreversible/production-risk impact without approval.
   - Secrets, private `.env`, database URLs, API bearer tokens, or Railway tokens would be printed.
   - QA/release approval is being claimed by Backend/API Integrator.

## Current Problems

Missing process:

- Fresh Backend/API pods need role-aware instruction for selecting `mobile-backend-api-integrator-workflow` and classifying contract-only vs service-delivery work.

Missing pod-native bridge skill:

- Required. `codex-role-workflow` must map Backend/API identity to contract-first workflow, work-type classification, `03-contract-api/*`, and reviewer routing.

Skill reinforcement:

- Existing API skill should be checked/reinforced for explicit `03-contract-api/*` durable artifacts, migration note, service evidence, runtime smoke, rollback note, and QA handoff.

Missing repo-local Codex skill:

- None required now. The primary API workflow exists.

Missing custom reviewer/researcher/advisor:

- None required now for contract review. `wm-contract-reviewer` is appropriate.

Ambiguous handoff path:

- Medium risk until API workflow and pod bridge force `03-contract-api/*`, contract diff, service evidence, runtime smoke, rollback note, and QA handoff.

Overlap or role-boundary risk:

- Backend/API Integrator must not implement React Native UI, duplicate types outside `packages/contracts`, or claim QA/Release readiness.

External proof or human-gate risk:

- Local contract/service evidence does not prove production readiness. Production credentials, irreversible migrations, payment/PII/legal/compliance, and failed-gate-risk require human-gated decisions.

Validator/eval gap:

- Add bridge eval proving Backend/API work updates/uses `packages/contracts`.
- Add negative eval proving React Native UI requests stop or route to Mobile App Dev.
- Add validation that API role mapping includes `03-contract-api/*`.

## Skill/Agent Additions Or Reinforcement

Recommendation 1:

- Add/Update: Add pod-native `codex-role-workflow`.
- Artifact path: `mobile-app-dev-team/09-pod-native-openclaw-skills/codex-role-workflow/SKILL.md`.
- Reason: Backend/API pods need a role-aware path from identity to contract-first Codex workflow.
- SoT basis: Backend/API SOUL, `AGENTS.md`, `05-work-processes.md`, `10-github-artifact-workflow.md`.
- Used in process: API work classification, skill selection, reviewer routing, artifact handoff.
- Required inputs: bootstrap reports, role identity, approved API/backend scope, work-unit id.
- Required outputs: selected skill, work type, artifact checklist, reviewer requirement.
- Stop conditions: UI work, unapproved backend service, type duplication, secret exposure, human gate.
- Validation: eval for contract-only, service-scope, UI request stop, secret-risk stop.
- Non-goals: do not implement backend in the pod-native skill.

Recommendation 2:

- Add/Update: Reinforce `mobile-backend-api-integrator-workflow`.
- Artifact path: `.agents/skills/mobile-backend-api-integrator-workflow/SKILL.md`.
- Reason: ensure service evidence, migration note, runtime smoke, rollback note, and `03-contract-api/*` durable handoff are explicit.
- SoT basis: Backend/API SOUL, `10-github-artifact-workflow.md`, `AGENTS.md`.
- Used in process: after pod bridge selects API workflow.
- Required inputs: approved API/backend scope.
- Required outputs: contracts, mocks/fixtures, service evidence if scoped, reviewer evidence.
- Stop conditions: UI work, unapproved migration/service, secrets.
- Validation: skill eval for contract-only and bounded backend service.
- Non-goals: do not claim QA/Release approval.
- Codex process reinforcement: include a concrete Codex API Contract Plan Packet, contract-first read-only planning, plan reviewer before editing, official-doc/researcher routing for external tooling, final reviewer against actual diff/evidence, `03-contract-api/*`, `git diff`, and `git status --short`.

## Role-Specific Acceptance Criteria

- Backend/API pod classifies work type before editing.
- API contract plan packet is concrete enough for Mobile App Dev and QA/Release to consume without guessing.
- `packages/contracts` is updated or confirmed before app-side API usage.
- Mock/fixture behavior is aligned with contract.
- Backend service changes happen only with approved scope.
- Migration/service evidence and rollback notes are present when applicable.
- `wm-contract-reviewer` evidence exists before editing and final reviewer evidence exists before handoff.
- Completion report includes `git diff`/`git status --short` results for contract/API/evidence paths.
- Handoff is committed under `03-contract-api/*` plus branch/PR.
