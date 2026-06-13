# Mobile App Dev Codex Use Skill Analysis

Date: 2026-06-13
Role: Mobile App Dev
SOUL: `mobile-app-dev-team/02-role-souls/mobile-app-dev-soul.md`

## Role Identity And SoT Basis

Mobile App Dev is the Mobile App Developer role. It implements approved Expo React Native features inside this repository from scoped tasks, accepted Design handoff, and approved API contracts. It must work tests-first, stay inside repo scope, use NativeWind/RN primitives, preserve stable `testID` values, and hand off evidence.

SoT basis:

- `mobile-app-dev-soul.md`: Mobile App Dev owns Expo RN implementation and must not invent API contracts, implement backend service behavior, or self-approve.
- `AGENTS.md`: TDD required; RN UI uses NativeWind and React Native primitives; `packages/contracts` is the API SoT.
- `05-work-processes.md`: implementation starts after planning/design/API readiness and must add/update the narrowest failing test/eval/validator/fixture first.
- `10-github-artifact-workflow.md`: Mobile App Dev owns `04-mobile-app/*`.
- `.agents/skills/mobile-app-dev-workflow/SKILL.md`: active repo-local implementation skill.

## Current State

Usable repo-local Codex skills:

- `mobile-app-dev-workflow`
- `wm` only when explicitly invoked as `$wm` or `/wm`
- `wm-orchestrate`
- `git-workflow`

Usable custom agents:

- `wm-implementation-reviewer`
- `wm-contract-reviewer` for API contract drift
- `wm-docs-researcher` for Expo/RN/NativeWind/Codex uncertainty
- `wm-gate-fix-advisor` for failing gate triage

Pod-native setup dependencies:

- `project-bootstrap`
- `codex-cli-auth-setup`
- `pod-role-bootstrap`

Durable artifacts:

- `docs/plans/work-units/<work-unit-id>/04-mobile-app/implementation-summary.md`
- `docs/plans/work-units/<work-unit-id>/04-mobile-app/test-plan.md`
- `docs/plans/work-units/<work-unit-id>/04-mobile-app/selector-changes.md`
- `docs/plans/work-units/<work-unit-id>/04-mobile-app/api-integration-note.md`
- `docs/plans/work-units/<work-unit-id>/04-mobile-app/command-output.md`
- `docs/plans/work-units/<work-unit-id>/04-mobile-app/reviewer.md`

Actual code surfaces:

- `apps/mobile/**`
- mobile tests and selectors
- mocks/fixtures only when approved and aligned with `packages/contracts`

Coverage verdict: **Partial but strong**.

Mobile App Dev has a primary repo-local skill. The missing part is a pod-native role bridge and likely reinforcement that makes `04-mobile-app`, `status.json`, durable PR handoff, and isolated pod boundaries explicit.

## Role-Specific Codex Operating Reinforcement

Mobile App Dev should use Codex for tests-first implementation from approved inputs, not for inferring product, design, API, or architecture decisions.

Required default process for this role:

1. Stay read-only while checking Product/Planning approval, Design handoff, API contract, Mobile Architect notes, and affected code.
2. Produce an implementation plan with affected paths, first failing test/eval/fixture/validator, selector impact, contract impact, evidence path, gates, and reviewer target.
3. Send the plan to `wm-implementation-reviewer` and, for API-backed work, `wm-contract-reviewer` before editing app code.
4. Report the reviewed plan before implementation.
5. Add or update the narrowest failing test/eval/fixture/validator before implementation changes.
6. After implementation and command runs, request final reviewer verification against the approved plan, code diff, test diff, command output, and `04-mobile-app/*` artifacts.
7. Run `git diff` for app/evidence paths and `git status --short`, then report whether the diff matches the approved plan.

### Codex Implementation Plan Packet

The implementation plan must be concrete enough for another isolated pod to execute without guessing. A plan that says only "update the screen" or "use the API" is not executable for this role.

Required packet fields:

- accepted task or work-unit id;
- exact route, screen, component, or module to change;
- Design handoff path and selected Design option for UI work;
- relevant state matrix entries, including default, loading, empty, error, and permission-denied where applicable;
- API contract, mock, or fixture path and version for API-backed work;
- Mobile Architect note path when route, runtime, dependency, state, or navigation architecture is affected;
- first test, eval, fixture, or validator to add or update before implementation;
- selector and `testID` impact, including stable kebab-case names;
- non-goals and stop conditions;
- verification commands to run and expected evidence path;
- plan reviewer output path;
- final reviewer output path.

Execution constraints:

- No app code edit before the reviewed plan report exists.
- No final completion report before final reviewer has checked actual diff, command output, evidence, and `04-mobile-app/*` artifacts against the approved plan.
- The completion report must summarize `git diff` for changed paths and full `git status --short`.
- If the packet lacks a Design handoff, contract/fixture, architecture note, or human-gate decision required by the work, the correct result is `blocked` or handoff, not inference.

Skill reinforcement needed:

- `mobile-app-dev-workflow` should require explicit pre-code checks for approved requirement, Design handoff, API contract/mocks, architecture note when needed, affected paths, first test, mobile selectors, evidence ladder, and gate impact.
- It should stop if the plan is unreviewed, if Design/API inputs are assumed, or if the request requires backend/API service ownership, architecture decision, QA evidence ownership, release operation, or human-risk acceptance.
- It should make `04-mobile-app/*`, reviewer evidence, command output with exit status, and branch/PR handoff mandatory before Done.
- The actual `.agents/skills/mobile-app-dev-workflow/SKILL.md` is thinner than this analysis. A later skill implementation should add the complete Codex Implementation Plan Packet, pre-implementation reviewer, final reviewer, `git diff`, `git status --short`, and `04-mobile-app/*` durable artifact contract.

## Required Role-Specific Codex CLI Process

1. Confirm pod readiness.
   - Use `project-bootstrap` and `pod-role-bootstrap` reports.
2. Confirm role identity.
   - Resolve Mobile App Dev from `WM_ROLE` or `/workspace/IDENTITY`.
   - Stop on role mismatch.
3. Confirm execution authorization.
   - Require accepted Product/Planning task packet.
   - Require Design handoff for UI work.
   - Require `packages/contracts` or approved mock/fixture for API-backed work.
   - Require Mobile Architect note for route/state/runtime/dependency impact.
4. Intake SoT.
   - Read `AGENTS.md`, `PROJECT_ENVIRONMENT.md`, Mobile App Dev SOUL, current task artifacts, Design artifacts, API artifacts, and affected app code.
5. Select Codex skill.
   - Implementation: `mobile-app-dev-workflow`.
   - Existing work-unit next action: `wm-orchestrate`.
   - Branch/PR: `git-workflow`.
6. Apply tests-first workflow.
   - Add/update the narrowest failing unit/component/selector/fixture/validator/eval before implementation.
   - Keep selector changes stable and kebab-case.
7. Implement the smallest repo-scoped diff.
   - Use React Native primitives, NativeWind, semantic tokens, Expo Router patterns.
   - Consume API types from `packages/contracts`.
8. Verify.
   - Use mobile lint/test and relevant runtime gates based on changed paths.
   - If Codex runtime artifacts are changed, run `pnpm run test:runtime` and `pnpm run test:local-harness`.
   - If workspace code changes, run `pnpm turbo run lint test`.
9. Write Mobile App Dev artifacts.
   - `implementation-summary.md`
   - `test-plan.md`
   - `selector-changes.md`
   - `api-integration-note.md`
   - `command-output.md` with exit status
   - `reviewer.md`
10. Call reviewer/advisor.
   - `wm-implementation-reviewer` for implementation review.
   - `wm-contract-reviewer` if contract/API behavior is affected.
   - `wm-gate-fix-advisor` only for failed gate triage.
11. Handoff.
   - Commit code and `04-mobile-app/*` evidence in a branch/PR.
   - Hand off to QA/Release for verification.
12. Stop conditions.
   - Missing Design handoff for UI.
   - Missing contract or fixture for API-backed UI.
   - Request requires backend implementation.
   - Request requires architecture/runtime policy decision.
   - Request requires production/human-gated decision.
   - Secrets, tokens, `.env`, private endpoints, or credentials would be exposed.

## Current Problems

Missing process:

- Fresh Mobile App Dev pods lack a pod-native role bridge explaining how to choose `mobile-app-dev-workflow` and what preconditions must exist before it can be used.

Missing pod-native bridge skill:

- Required. `codex-role-workflow` must map Mobile App Dev identity to `mobile-app-dev-workflow`, required preconditions, tests-first execution, reviewer routing, and `04-mobile-app/*` artifacts.

Skill reinforcement:

- `mobile-app-dev-workflow` should explicitly reference `04-mobile-app/*`, `status.json` stage ownership, and durable GitHub handoff if it does not already do so in sufficient detail.

Missing repo-local Codex skill:

- None required now. The primary implementation skill exists.

Missing custom reviewer/researcher/advisor:

- None required now. `wm-implementation-reviewer` is the correct reviewer; `wm-contract-reviewer` handles contract drift.

Ambiguous handoff path:

- Medium risk until `mobile-app-dev-workflow` and the pod bridge force `04-mobile-app/*`, command output, reviewer evidence, and PR handoff.

Overlap or role-boundary risk:

- Mobile App Dev must not invent API contracts, implement backend behavior, own release evidence, or accept human-gated risk.

External proof or human-gate risk:

- Local app tests do not prove native/device/EAS behavior. Production, privacy/legal/payment, external messaging, and failed-gate-risk decisions remain human-gated.

Validator/eval gap:

- Add eval proving the pod bridge refuses Mobile App Dev work without approved task/Design/API inputs.
- Add eval proving API type duplication routes to Backend/API Integrator or `wm-contract-reviewer`.

## Skill/Agent Additions Or Reinforcement

Recommendation 1:

- Add/Update: Add pod-native `codex-role-workflow`.
- Artifact path: `mobile-app-dev-team/09-pod-native-openclaw-skills/codex-role-workflow/SKILL.md`.
- Reason: Mobile App Dev pods need a role-aware precondition and skill-selection procedure.
- SoT basis: Mobile App Dev SOUL, `AGENTS.md`, `05-work-processes.md`, `10-github-artifact-workflow.md`.
- Used in process: implementation authorization, skill selection, reviewer routing, handoff.
- Required inputs: bootstrap report, role identity, work-unit task, Design/API/architecture inputs.
- Required outputs: allowed skill/action, required test/evidence checklist, stop reason if blocked.
- Stop conditions: missing handoff, out-of-role backend work, architecture change, human gate, secrets.
- Validation: eval for ready task, missing Design handoff, API ambiguity, backend request stop.
- Non-goals: do not implement app code in the pod-native skill.

Recommendation 2:

- Add/Update: Reinforce `mobile-app-dev-workflow`.
- Artifact path: `.agents/skills/mobile-app-dev-workflow/SKILL.md`.
- Reason: ensure role-local implementation skill explicitly writes/links `04-mobile-app/*` and `status.json` evidence in pod-isolated workflows.
- SoT basis: `10-github-artifact-workflow.md`, Mobile App Dev SOUL.
- Used in process: after pod bridge selects implementation.
- Required inputs: accepted task, Design handoff, contract.
- Required outputs: code diff, test diff, `04-mobile-app/*`, reviewer evidence.
- Stop conditions: same as above.
- Validation: skill eval/harness fixture for durable handoff wording.
- Non-goals: do not broaden into backend/API or QA ownership.
- Codex process reinforcement: include a concrete Codex Implementation Plan Packet, SoT-grounded read-only implementation planning, plan reviewer before editing, tests-first execution, final reviewer against actual diff/commands/evidence, `04-mobile-app/*`, `git diff`, and `git status --short`.

## Role-Specific Acceptance Criteria

- Mobile App Dev pod starts only from an approved execution task.
- UI work requires Design handoff.
- API-backed work requires `packages/contracts` or approved fixture/mocks.
- Implementation plan is reviewed before code edits.
- Implementation plan packet is concrete enough for another isolated pod to execute without guessing.
- A failing test/eval/validator/fixture precedes implementation.
- Evidence includes command output with exit status.
- Final reviewer evidence is captured before Done.
- Completion report includes `git diff`/`git status --short` results for changed paths.
- The handoff is through branch/PR and committed `04-mobile-app/*`.
