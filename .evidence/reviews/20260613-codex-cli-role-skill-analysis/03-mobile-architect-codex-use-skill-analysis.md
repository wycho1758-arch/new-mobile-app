# Mobile Architect Codex Use Skill Analysis

Date: 2026-06-13
Role: Mobile Architect
SOUL: `mobile-app-dev-team/02-role-souls/mobile-architect-soul.md`

## Role Identity And SoT Basis

Mobile Architect is the Mobile Architect / Technical Lead role. It owns route/state impact, module boundaries, runtime policy, template deviation decisions, ADRs, API contract co-review, releaseability risk, and architecture handoff. It must not absorb Mobile App Dev implementation or Backend/API Integrator service ownership.

SoT basis:

- `mobile-architect-soul.md`: explicitly states no dedicated repo-local skill is currently assigned.
- `03-role-capability-matrix.md`: Mobile Architect produces ADR, risk note, route/state review, and contract co-sign.
- `05-work-processes.md`: Product/Planning routes architecture/runtime/API/route/state/dependency/releaseability risk to Mobile Architect before execution.
- `10-github-artifact-workflow.md`: Mobile Architect owns `02-architecture/*`.

## Current State

Usable repo-local Codex skills:

- `wm`
- `wm-orchestrate`
- `git-workflow`

There is **no dedicated `mobile-architect-workflow` repo-local skill**.

Usable custom agents:

- `wm-implementation-reviewer`
- `wm-contract-reviewer`
- `wm-docs-researcher`
- `wm-gate-fix-advisor`

There is **no dedicated architecture reviewer**.

Pod-native setup dependencies:

- `project-bootstrap`
- `codex-cli-auth-setup`
- `pod-role-bootstrap`

Durable artifacts:

- `docs/plans/work-units/<work-unit-id>/02-architecture/architecture-note.md`
- `docs/plans/work-units/<work-unit-id>/02-architecture/route-state-impact.md`
- `docs/plans/work-units/<work-unit-id>/02-architecture/api-contract-cosign.md`
- `docs/plans/work-units/<work-unit-id>/02-architecture/releaseability-risk.md`
- `docs/plans/work-units/<work-unit-id>/02-architecture/adr.md`

Coverage verdict: **Missing/Partial**.

This is the largest role-specific gap. A pod-native bridge is necessary but not sufficient for repeated architecture work because there is no repo-local skill that defines the Mobile Architect work product, decision sequence, reviewer routing, artifact contract, and stop conditions.

## Role-Specific Codex Operating Reinforcement

Mobile Architect should use Codex to make architecture decisions explicit and reviewable before downstream roles implement anything.

Required default process for this role:

1. Stay read-only while identifying the architecture trigger and reading SoT.
2. Mark missing Product/Planning approval, missing Design/API inputs, or unclear runtime facts as `unknown` or `blocked`; do not predict architecture intent.
3. Produce an architecture plan that names the decision type, affected routes/modules/contracts/runtime surfaces, candidate options, evidence impact, downstream owners, and reviewer target.
4. Route the plan to `wm-implementation-reviewer`, `wm-contract-reviewer`, or `wm-docs-researcher` depending on whether the issue is implementation boundary, API contract, or runtime/tool uncertainty.
5. Report the reviewed plan before writing ADR or architecture artifacts.
6. After artifacts are written, request final reviewer verification that `02-architecture/*` matches the reviewed decision and does not become implementation.
7. Run `git diff` for `02-architecture/*` and `git status --short`, then report whether downstream roles can execute without guessing.

Architecture skill reinforcement needed:

- `mobile-architect-workflow` should include an Architecture Decision Record prompt/checklist:
  - decision to make;
  - verified SoT facts;
  - unknowns and blocked items;
  - options considered;
  - chosen option and rationale;
  - rejected alternatives;
  - route/state/module/API/runtime impact;
  - evidence ladder impact;
  - downstream owner handoff;
  - reviewer target and final review result.
- External tools and current behavior for Expo, EAS, React Native, NativeWind, Codex runtime, MCP, or dependency policy must be checked through official docs or `wm-docs-researcher` before architecture guidance relies on them.

## Required Role-Specific Codex CLI Process

1. Confirm pod readiness.
   - Use `project-bootstrap` and `pod-role-bootstrap` reports.
2. Confirm role identity.
   - Resolve Mobile Architect from `WM_ROLE` or `/workspace/IDENTITY`.
   - Stop on role mismatch.
3. Confirm approved work unit.
   - Architecture work must be tied to approved scope.
   - Do not create architecture work without a bounded need.
4. Intake SoT.
   - Read `AGENTS.md`, `PROJECT_ENVIRONMENT.md`, Mobile Architect SOUL, `05-work-processes.md`, `06-gates-and-evidence.md`, work-unit planning packet, Design/API artifacts when relevant.
5. Classify architecture task.
   - Route/state impact review.
   - Module boundary or dependency policy.
   - Runtime/environment deviation.
   - API contract co-sign.
   - Releaseability/EAS strategy risk.
   - ADR.
6. Use Codex skill.
   - Today: use `$wm` only when explicitly invoked and `wm-orchestrate` when `status.json` exists.
   - Future: use `mobile-architect-workflow`.
7. Call read-only agents.
   - Runtime/implementation boundary: `wm-implementation-reviewer`.
   - API contract impact: `wm-contract-reviewer`.
   - Expo/EAS/NativeWind/Codex uncertainty: `wm-docs-researcher`.
   - Failed gate/evidence risk: `wm-gate-fix-advisor`.
8. Write architecture artifacts.
   - Use `02-architecture/*`.
   - Record context, options, decision, consequence, owner, evidence requirement, and next responsible role.
9. Handoff.
   - Route implementation to Mobile App Dev.
   - Route API/service ownership to Backend/API Integrator.
   - Route design impact to Design.
   - Route evidence/release risk to QA/Release.
   - Route scope/human gate to Product/Planning or human owner.
10. Stop conditions.
   - Architecture work would become app implementation.
   - Architecture work would become backend service/API implementation.
   - Runtime/dependency change lacks approved scope.
   - Release/EAS strategy requires QA/Release or human approval.
   - Failed-gate risk acceptance is proposed without human gate.
   - Secrets or private config would be printed.

## Current Problems

Missing process:

- No role-specific Codex CLI process exists for architecture notes, route/state impact, ADRs, API co-sign, or releaseability risk.

Missing repo-local Codex skill:

- `mobile-architect-workflow` is missing and should be added.

Missing pod-native bridge skill:

- `codex-role-workflow` is needed to map Mobile Architect pods to `mobile-architect-workflow` once added, or to current interim `$wm`/`wm-orchestrate` paths.

Missing custom reviewer/researcher:

- Existing `wm-*` reviewers can cover pieces, but none directly reviews architecture decision quality across ADR, route/state, runtime policy, and releaseability.
- A dedicated `mobile-architect-reviewer` is recommended if architecture changes become common.

Ambiguous handoff path:

- Medium risk. `02-architecture/*` exists as a durable artifact contract, but no repo-local architecture workflow currently forces which architecture artifact to write for each architecture trigger.

Overlap or role-boundary risk:

- High risk without a dedicated workflow. Mobile Architect can easily drift into Mobile App Dev implementation, Backend/API service ownership, release operation, or human risk acceptance.

External proof or human-gate risk:

- Architecture notes cannot prove native, EAS, pod, or branch-protection behavior. Runtime/dependency/release-risk decisions that affect production or failed-gate-risk require the proper owner or human gate.

Validator/eval gap:

- Add eval proving Mobile Architect cannot implement app/backend code through the architecture workflow.
- Add eval proving route/state impact and ADR requests route to the Mobile Architect skill.
- Add validator coverage that the role matrix includes `mobile-architect-workflow` once implemented.

## Skill/Agent Additions Or Reinforcement

Recommendation 1:

- Add/Update: Add repo-local `mobile-architect-workflow`.
- Artifact path: `.agents/skills/mobile-architect-workflow/SKILL.md`.
- Reason: Mobile Architect lacks a professional role Codex skill for its own repeated work products.
- SoT basis: `mobile-architect-soul.md`, `03-role-capability-matrix.md`, `05-work-processes.md`, `10-github-artifact-workflow.md`.
- Used in process: architecture review, route/state impact, runtime/dependency decision, API co-sign, releaseability risk, ADR.
- Required inputs: approved work unit, affected routes/modules/contracts/runtime surfaces, current repo SoT.
- Required outputs: one or more `02-architecture/*` artifacts, reviewer/researcher routing, next-owner handoff.
- Stop conditions: app implementation, backend service ownership, unapproved runtime policy change, human gate, secrets.
- Validation: skill evals for ADR, route/state impact, API co-sign, and out-of-role implementation stop.
- Non-goals: do not implement code; do not replace Mobile App Dev or Backend/API Integrator.
- Codex process reinforcement: include read-only SoT planning, plan reviewer, user report, final reviewer against architecture artifacts, `git diff`, and `git status --short`.

Recommendation 2:

- Add/Update: Add pod-native `codex-role-workflow`.
- Artifact path: `mobile-app-dev-team/09-pod-native-openclaw-skills/codex-role-workflow/SKILL.md`.
- Reason: Mobile Architect pods still need a bridge from role identity to allowed architecture workflow and durable artifacts.
- SoT basis: same as above plus `16-pod-environment-bootstrap.md`.
- Used in process: role identity check, architecture skill selection, work-unit artifact routing.
- Required inputs: bootstrap reports, `WM_ROLE`, work-unit id, repo path.
- Required outputs: allowed skill/action, required `02-architecture/*` artifacts, reviewer requirement.
- Stop conditions: role mismatch, missing approved work unit, out-of-role work.
- Validation: pod bridge eval for Mobile Architect role.
- Non-goals: do not make the pod-native skill the architecture implementation skill.

Recommendation 3:

- Add/Update: Consider `mobile-architect-reviewer`.
- Artifact path: `.codex/agents/mobile-architect-reviewer.toml`.
- Reason: Existing reviewers split implementation and contract review but do not fully cover architecture decision quality.
- SoT basis: Mobile Architect SOUL and artifact outputs.
- Used in process: final review of ADR, route/state impact, releaseability risk.
- Required inputs: architecture artifacts and affected SoT paths.
- Required outputs: read-only findings and verdict.
- Stop conditions: do not approve human risk; do not implement.
- Validation: agent eval for architecture review.
- Non-goals: do not replace `wm-implementation-reviewer` or `wm-contract-reviewer`.

## Role-Specific Acceptance Criteria

- Mobile Architect pod has an explicit role workflow path.
- Architecture work produces `02-architecture/*` artifacts.
- API co-sign uses `packages/contracts` and Backend/API Integrator handoff.
- Releaseability risk routes to QA/Release and human gates where needed.
- The workflow stops before implementation/service ownership.
- Reviewer coverage exists for architecture decision quality.
