# Product/Planning Codex Use Skill Analysis

Date: 2026-06-13
Role: Product/Planning
SOUL: `mobile-app-dev-team/02-role-souls/product-planning-soul.md`

## Role Identity And SoT Basis

Product/Planning is the Chief Product Officer / Product Delivery Lead role. It receives user requests, clarifies ambiguity, sizes work, decomposes ready PRD/work-unit inputs, defines acceptance criteria and evidence, routes role owners, and identifies human gates.

SoT basis:

- `product-planning-soul.md`: Product/Planning owns scope, readiness, human-gate routing, evidence-oriented task packets, and must not implement app/backend/design/release work.
- `05-work-processes.md`: unclear requests use `po-requirement-office-hours`; broad requests use `po-work-unit-planning-and-agent-sprint`; ready PRD uses `po-prd-to-execution`; execution readiness uses `po-planning-completeness-review`.
- `06-gates-and-evidence.md`: Product/Planning sets `status.json.evidence_ladder.required_level` and routes human gates.
- `10-github-artifact-workflow.md`: Product/Planning owns `00-product-planning/*` and `07-pr/story-pr-plan.md`.

## Current State

Usable repo-local Codex skills:

- `po-requirement-office-hours`
- `po-work-unit-planning-and-agent-sprint`
- `po-prd-to-execution`
- `po-planning-completeness-review`
- `wm-orchestrate`
- `git-workflow`

Usable custom agents:

- `po-planning-reviewer`
- `po-scope-gate-reviewer`
- `po-docs-researcher`
- `wm-docs-researcher` for technical/runtime uncertainty that affects planning

Pod-native setup dependencies:

- `project-bootstrap` as normal user-facing readiness entry point
- `codex-cli-auth-setup`
- `pod-role-bootstrap`

Durable artifacts:

- `docs/plans/work-units/<work-unit-id>/00-product-planning/brief.md`
- `docs/plans/work-units/<work-unit-id>/00-product-planning/work-unit-decision.md`
- `docs/plans/work-units/<work-unit-id>/00-product-planning/task-packet.md`
- `docs/plans/work-units/<work-unit-id>/00-product-planning/evidence-matrix.md`
- `docs/plans/work-units/<work-unit-id>/00-product-planning/human-gates.md`
- `docs/plans/work-units/<work-unit-id>/00-product-planning/human-gates/<gate-id>.json`
- `docs/plans/work-units/<work-unit-id>/00-product-planning/dependencies-and-blockers.md`
- `docs/plans/work-units/<work-unit-id>/00-product-planning/planning-completeness-review.md`
- `docs/plans/work-units/<work-unit-id>/07-pr/story-pr-plan.md`
- `docs/plans/work-units/<work-unit-id>/status.json`

Coverage verdict: **Partial**.

Product/Planning has strong repo-local skills and reviewers. The missing piece is pod-native instruction that maps role identity to the correct repo-local `po-*` skill and durable work-unit artifact sequence.

## Role-Specific Codex Operating Reinforcement

Product/Planning should use Codex as a scope-control and execution-readiness instrument, not as an implementation executor.

Required default process for this role:

1. Stay read-only while interpreting the user request and local SoT.
2. Separate facts, assumptions, unknowns, non-goals, human gates, and candidate owner roles before creating tasks.
3. Build a plan that states whether the request is ambiguous, broad, ready for PRD decomposition, or ready for execution review.
4. Send the plan to `po-planning-reviewer` for planning-package completeness and to `po-scope-gate-reviewer` when scope containment, human-gate routing, or risk acceptance is involved.
5. Report the reviewed plan before any task packet, `status.json`, or PR handoff is treated as execution-ready.
6. After artifacts are written, request final reviewer verification that `00-product-planning/*`, human-gate records, `status.json`, and handoff instructions match the approved plan.
7. Run `git diff` for the planning package and `git status --short`, then report whether the diff matches the reviewed plan.

Skill reinforcement needed:

- `codex-role-workflow` must include a Product/Planning decision tree for `po-requirement-office-hours`, `po-work-unit-planning-and-agent-sprint`, `po-prd-to-execution`, and `po-planning-completeness-review`.
- Product/Planning skills should explicitly state that planning cannot become Design, app implementation, Backend/API work, QA execution, release approval, or human-risk acceptance.
- The skill output should include the reviewer used, the plan approval status, the final reviewer status, and the git diff/status reporting requirement.

This is usable in intake, PRD slicing, work-unit creation, execution-readiness review, human-gate routing, and PR-story planning because Product/Planning is the role that prevents vague or over-broad instructions from entering downstream pods.

## Required Role-Specific Codex CLI Process

1. Confirm pod readiness.
   - Read `${PROJECT_BOOTSTRAP_REPORT_PATH:-/workspace/state/project-bootstrap-report.json}` if present.
   - Confirm `pod-role-bootstrap` reached repo checkout and did not report a blocking missing SoT, managed path, Codex auth, or GitHub auth condition.
2. Confirm role identity.
   - Resolve `WM_ROLE` or `/workspace/IDENTITY`.
   - Accept only Product/Planning-compatible role values.
   - Stop if role identity resolves to Design, Mobile Architect, Mobile App Dev, Backend/API Integrator, QA/Release, or Gatekeeper.
3. Confirm checked-out repo.
   - Use the managed repo path from bootstrap.
   - Verify `AGENTS.md`, `PROJECT_ENVIRONMENT.md`, `mobile-app-dev-team/02-role-souls/product-planning-soul.md`, `.agents/skills`, and `.codex/agents`.
4. Intake SoT.
   - Read user request, existing PRD/work-unit files, `05-work-processes.md`, `06-gates-and-evidence.md`, and `10-github-artifact-workflow.md`.
5. Select Codex skill.
   - Ambiguous request: `po-requirement-office-hours`.
   - Broad goal or PRD: `po-work-unit-planning-and-agent-sprint`.
   - Ready PRD/work unit: `po-prd-to-execution`.
   - Before execution starts: `po-planning-completeness-review`.
   - Existing `status.json` next action: `wm-orchestrate`.
   - Branch/PR handoff: `git-workflow`.
6. Write Product/Planning artifacts.
   - Use `00-product-planning/*` and initialize or update `status.json`.
   - Set `evidence_ladder.required_level` when mobile evidence is in scope.
   - Write human-gate decisions as `human-gate/v1` only when approved or explicitly deferred/rejected.
7. Call reviewer/researcher.
   - Planning package: `po-planning-reviewer`.
   - Scope/human gate/risk: `po-scope-gate-reviewer`.
   - Product/Planning SoT uncertainty: `po-docs-researcher`.
   - Runtime uncertainty affecting planning: `wm-docs-researcher`.
8. Handoff.
   - Commit durable artifacts in a branch/PR.
   - Record next responsible role in `status.json` and relevant handoff docs.
   - Do not rely on pod-local state.
9. Stop conditions.
   - Missing required SoT.
   - Missing human decision for production submit, payment, PII/privacy, external messaging, legal/compliance, budget, irreversible scope tradeoff, or failed-gate-risk.
   - Request requires app/backend/design/QA/release implementation.
   - Author/approver separation is violated.
   - Secrets or credential values would be printed.

## Current Problems

Missing process:

- No pod-native skill gives Product/Planning pods an explicit "choose this `po-*` skill now" decision tree.
- No pod-native skill ties `WM_ROLE` to `00-product-planning/*`, `status.json`, reviewer routing, and GitHub durable handoff.

Missing pod-native bridge skill:

- Required. `codex-role-workflow` must map Product/Planning identity to the `po-*` skill decision tree and planning artifact contract.

Missing repo-local Codex skill:

- None required now. Existing `po-*` skills cover the main Product/Planning workflow.

Missing custom reviewer/researcher/advisor:

- None required now. Existing `po-*` reviewers/researcher are role-specific.

Ambiguous handoff path:

- Low risk in current docs because `10-github-artifact-workflow.md` defines `00-product-planning/*`, but the pod-native execution path does not yet force that handoff path.

Overlap or role-boundary risk:

- Product/Planning could accidentally continue into design, app, backend, QA, or release execution unless the pod bridge stops out-of-role work.

External proof or human-gate risk:

- Product/Planning owns human-gate routing but cannot treat local planning output as approval for production submit, privacy/legal/payment, external messaging, or failed-gate-risk decisions.

Validator/eval gap:

- Future `codex-role-workflow` should have an eval proving Product/Planning maps to `po-*` skills and stops on implementation requests.
- `validate-team-doc` should require the new pod-native bridge to list Product/Planning role mappings.

## Skill/Agent Additions Or Reinforcement

Recommendation:

- Add/Update: Add pod-native `codex-role-workflow`.
- Artifact path: `mobile-app-dev-team/09-pod-native-openclaw-skills/codex-role-workflow/SKILL.md`.
- Reason: Product/Planning has skills, but isolated pods lack a role-aware Codex CLI operating procedure.
- SoT basis: `product-planning-soul.md`, `05-work-processes.md`, `06-gates-and-evidence.md`, `10-github-artifact-workflow.md`.
- Used in process: request intake, planning skill selection, reviewer routing, durable work-unit initialization, PR handoff.
- Required inputs: role identity, bootstrap reports, user request, work-unit id or PRD, current SoT.
- Required outputs: chosen `po-*` skill, Product/Planning artifact checklist, reviewer requirement, handoff status.
- Stop conditions: human gate, out-of-role execution, missing SoT, secrets risk.
- Validation: skill eval for ambiguous request, broad PRD, ready PRD, and implementation request stop.
- Non-goals: do not implement Product work in the pod-native skill; do not replace `po-*` skills.
- Codex process reinforcement: include SoT-grounded read-only planning, plan reviewer, user report, approved execution/handoff, final reviewer, `git diff`, and `git status --short` as required Product/Planning operating steps.

## Role-Specific Acceptance Criteria

- Product/Planning pod can determine the correct `po-*` skill from request state.
- Product/Planning pod writes or requests the correct `00-product-planning/*` artifacts.
- Product/Planning pod sets or updates `status.json` owner/evidence ladder only inside planning authority.
- Product/Planning pod routes the correct reviewer/researcher.
- Product/Planning pod reports the reviewed plan before execution and obtains final reviewer verification before Done.
- Product/Planning pod stops on human gates and out-of-role implementation.
- Product/Planning pod hands off through GitHub branch/commit/PR or committed work-unit artifacts.
