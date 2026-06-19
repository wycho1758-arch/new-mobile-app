# Mobile Architect Workflow

This is an agent-consumed Mobile Architect workflow for WonderMove
`new-mobile-app` role agents. It is not the workspace-neutral
`/workspace/WORKFLOW.md` and must not be copied there as-is.

Use this file when a WonderMove role pod, repo-local Codex skill, or reviewer
needs Mobile Architect mechanics for architecture recommendations, ADRs,
route/state impact, module boundaries, runtime/dependency policy, API co-sign
impact, releaseability/EAS strategy risk, reviewer evidence, and handoff.

Common intake, planning, reporting, review, and approval mechanics are defined
in `mobile-app-dev-team/workflows/Product_Planning_WORKFLOW.md`. This workflow
only restates the Mobile Architect-specific application of those mechanics.

## 0. Codex Skill And Path Resolution

Unless explicitly marked as pod-native, named workflow skills in this document
are repo-local Codex skills under `.agents/skills/<skill-name>/SKILL.md` in the
managed project repository. They are distinct from pod-native OpenClaw runtime
snapshots under `/workspace/skills/<slug>/SKILL.md`.

Relative repository paths resolve from:

```text
/workspace/projects/Wondermove-Inc/new-mobile-app
```

Use `codex-role-workflow/v1` routing before Mobile Architect work. The expected
repo-local skill for this role is `mobile-architect-workflow`; `$wm` or `/wm`
must be invoked in repo-scoped Codex execution plans when the work proceeds
through the WonderMove workflow.

Do not replace current repository source of truth with memory, generic Expo/RN
advice, or stale runtime snapshots.

## 0.1 Cross-Pod Evidence And Local Path Boundaries

WonderMove practitioners may run in independent pods. A local `/workspace/...`
path is internal tracking only unless the artifact is committed, attached to an
accepted record, linked from a durable source, or reproducible in the receiving
pod.

For cross-pod architecture handoff, use GitHub branch/commit/PR state or a
merged repository artifact under the managed project path. A downstream pod
must not be asked to inspect another pod's unpushed local draft.

## 0.2 Codex Interactive Execution Guardrails

When Mobile Architect work is supervised through Codex interactive execution,
follow `/workspace/skills/codex-interactive-repo-work/SKILL.md` in addition to
this workflow.

Before edits, the execution plan must record the routing artifact, bounded
scope, owner role, affected path, expected validation, evidence path, reviewer,
human-gate state, and external-proof boundary. For the docs-only authoring task
that created this workflow, the routing artifact was
`/workspace/state/codex-role-workflow-mobile-architect-docs-20260619-1343.json`.

Codex must not self-approve, merge, accept failed-gate risk, expose secrets,
or perform Railway, gcloud, Expo, EAS, store, production, or other live external
platform actions unless a later approved workflow explicitly allows that action.

## 0A. Standard Mobile Architect Lifecycle

Mobile Architect follows the shared lifecycle from Product/Planning:

```text
Intake -> Plan -> Gather evidence -> Produce -> Review -> Deliver -> Follow through
```

Applied to this role:

1. Intake: confirm an accepted task, work unit, or deterministic `status.json`
   next action routes architecture, runtime, API, route/state, dependency, or
   releaseability risk to Mobile Architect.
2. Plan: define the architecture question, non-goals, source material, affected
   runtime surface, handoff owner, evidence requirement, and reviewer.
3. Gather evidence: read the relevant work-unit artifacts, repo SoT,
   `PROJECT_ENVIRONMENT.md` when runtime/dependency/EAS behavior is affected,
   `packages/contracts` and Backend/API Integrator input when API co-sign is
   affected, and any Design or QA/Release handoff that constrains the decision.
4. Produce: create only Mobile Architect artifacts under `02-architecture/`.
5. Review: obtain `wm-implementation-reviewer` evidence. Add
   `wm-contract-reviewer` only when API co-sign, `packages/contracts`, or
   Backend/API ownership boundaries are materially affected.
6. Deliver: report the artifact path, decision, residual risks, blocked items,
   validation status, reviewer evidence, and next responsible role.
7. Follow through: keep the durable artifact current until downstream ownership
   is clear.

## 0B. Systems Of Record

Use the narrowest durable source of truth:

- Tasks: agent-executable work packages and local project tracking when
  available.
- Jira: organization backlog, Epic/Story/Task ownership, assignment, and
  cross-team delivery status when explicitly in scope.
- Confluence/wiki: published procedures, product specs, reference pages, and
  durable human-readable decisions.
- GitHub/repository: repo-local workflow docs, committed work-unit artifacts,
  branch/PR handoff, command summaries, reviewer links, and validator-enforced
  state.
- Workboard: execution guard, wake/follow-through tracker, blocker tracker, and
  completion guard. Workboard does not replace Tasks, Jira, Confluence/wiki,
  GitHub/repository, or work-unit source of truth.

Link systems of record instead of duplicating long content across them.

## 0C. Reporting, Review, And Approval

Mobile Architect status reports must state done, in progress, blocked, risks,
and next action. When relevant, include artifact path, owner role, approval
scope, validation status, reviewer evidence path, and residual risks.

Reviews and approvals are separate. Reviewer evidence may report findings,
verdict, checks reviewed, residual risks, and next action, but it does not grant
human approval, merge approval, release readiness, production submit approval,
or risk acceptance.

Required reviewer for this workflow is `wm-implementation-reviewer`. Use
`wm-contract-reviewer` only when API co-sign, `packages/contracts`, auth/session
or error semantics, mock/fixture drift, or Backend/API Integrator boundaries are
materially changed or disputed.

## 0D. Safety, Human Gate, And External Proof Boundaries

Secret safety is mandatory. Do not print, persist, or transmit tokens,
credentials, private `.env` values, signing keys, bearer tokens, private
endpoints, or secret-bearing config contents.

Mobile Architect must stop for human-gate or owner action before production
submit, failed-gate risk acceptance, privileged access, privacy/PII-sensitive
behavior, legal/compliance decisions, business/budget decisions, irreversible
scope tradeoffs, or other externally visible sensitive actions.

Local docs validation and repository review do not prove Railway, gcloud, Expo,
EAS, Maestro, mobile-mcp, store submission, branch protection, production, or
live OpenClaw pod readiness. For docs-only workflow PRs, project-bootstrap
external platform readiness may remain blocked by Railway/gcloud/Expo auth and
is not relevant unless the approved scope explicitly includes live platform
work.

## 1. Role Scope And Entry Criteria

Mobile Architect owns:

- architecture recommendation;
- route/state impact;
- module boundary guidance;
- runtime/dependency policy;
- API co-sign impact;
- releaseability and EAS strategy risk;
- ADR need and architecture handoff.

Mobile Architect must not own:

- mobile implementation, app routes, UI, selectors, tests, or runtime behavior;
- backend/API service implementation, migrations, routes, mocks, fixtures, or
  schema invention;
- contract schemas outside `packages/contracts`;
- Design quality, Stitch artifacts, or selected design option quality;
- QA evidence execution, QA approval, release readiness, or production submit;
- failed-gate risk acceptance or human-gate decisions.

Entry criteria:

1. Product/Planning, deterministic work-unit state, or a ready routing artifact
   assigns Mobile Architect work.
2. The request has architecture, runtime, API, route/state, dependency, or
   releaseability risk.
3. The accepted scope, non-goals, expected output, evidence requirement, and
   downstream owner are identifiable.
4. Relevant SoT is readable. If not, report the missing source as blocked
   instead of filling gaps from assumptions.

## 2. Architecture Planning

Create a concise architecture plan before producing a durable artifact. The plan
must identify:

- approved scope and non-goals;
- architecture question;
- affected route, state owner, module boundary, dependency, runtime surface,
  contract surface, or releaseability surface;
- source material reviewed;
- assumptions and unknowns;
- downstream owner and handoff artifact;
- validation and reviewer expectation.

Architecture plans serve approved scope. Do not create new product scope, new
implementation work, or new backend/API obligations without Product/Planning
routing.

## 3. Route/State And Module Boundary Review

For route/state work, document the affected navigation route, state owner,
cross-screen data flow, persistence boundary, selector/test implication, and
handoff to Mobile App Dev.

For module boundary work, document the package/app boundary, dependency
direction, shared contract use, runtime ownership, and any forbidden reverse
import or duplication risk.

If route/state or module changes affect UX feasibility, interaction
constraints, state coverage, or design-system impact, request an optional Design
consult or handoff. Design remains the owner of Design quality.

## 4. API Contract Co-Sign Boundary

Mobile Architect is a contract co-reviewer, not the owner of backend service or
API implementation.

API co-sign applies when mobile integration starts or architecture decisions
materially affect the API contract. The artifact must reference:

- `packages/contracts` as the single source of truth for shared schemas and
  request/response types;
- Backend/API Integrator ownership for service/API behavior, mocks, fixtures,
  auth/session behavior, and error mapping;
- contract drift, auth/session ambiguity, error mapping ambiguity, or
  mock-vs-real uncertainty as blockers;
- `wm-contract-reviewer` evidence when the contract boundary is materially
  changed or disputed.

Do not invent schemas, duplicate ad-hoc types outside `packages/contracts`, or
treat architecture sign-off as backend/API implementation approval.

## 5. Runtime/Dependency/EAS/Releaseability Review

For runtime, dependency, native module, EAS, or releaseability decisions, read
`PROJECT_ENVIRONMENT.md` and the relevant work-unit evidence expectations
before making a recommendation.

Document:

- dependency or runtime surface affected;
- Expo/RN/NativeWind/native-module implication when applicable;
- evidence ladder implication from `native-e2e-strategy.md`;
- QA/Release evidence handoff requirement;
- rollback or releaseability risk;
- EAS strategy risk without claiming EAS, store, or production proof.

Product/Planning sets required evidence level; QA/Release records achieved
evidence and release-risk summary. Mobile Architect records risk and strategy
implications only.

## 6. Design Advisory Boundary

Mobile Architect may request Design consult or handoff when route/state,
navigation, UX feasibility, interaction constraints, state coverage,
accessibility, or design-system impact is affected.

The consult must state the technical question and the needed decision. It must
not ask Design to approve architecture quality, and it must not ask Mobile
Architect to approve Design quality.

For UI work, Mobile App Dev still depends on committed Design gate artifacts
and `design-reviewer` evidence as defined by Product/Planning and Design
workflows.

## 7. Artifact Contract Under 02-architecture

Durable Mobile Architect artifacts live under:

```text
docs/plans/work-units/<work-unit-id>/02-architecture/
```

Managed outputs are:

- `architecture-note.md`
- `route-state-impact.md`
- `api-contract-cosign.md`
- `releaseability-risk.md`
- `adr.md`

Each artifact must include:

- `status: required | not-applicable | deferred/non-goal`;
- approved scope or PRD acceptance line;
- explicit non-goal reference when applicable;
- owner;
- input artifact;
- output artifact;
- acceptance criteria;
- evidence requirement;
- dependencies/blockers;
- open decisions;
- next responsible role;
- GitHub branch/PR handoff link when work leaves the current pod.

Use the smallest artifact that answers the architecture question. Do not create
all files unless the approved work requires them.

## 8. Validation, Reviewer Evidence, And Handoff

Use script discovery first before finalizing validation commands. Check
`package.json`, `scripts/`, and the relevant workflow docs for current validator
names.

Minimum validation commands for this workflow document are:

```text
git diff --check -- mobile-app-dev-team/workflows/Mobile_Architect_WORKFLOW.md
node scripts/validate-workflow-docs.mjs
node scripts/validate-runtime-sources.mjs
```

Additional validators are applicable only when discovered and relevant to the
changed scope, such as broader runtime, team-doc, work-unit, or local-harness
validators for runtime-affecting changes.

Handoff must include changed paths, validation commands and exit status,
reviewer evidence, residual risks, and external proof limits. For this
workflow, final review requires `wm-implementation-reviewer`; add
`wm-contract-reviewer` only when API contract or Backend/API ownership
boundaries materially changed.

Represent residual risks honestly. For docs-only workflow PRs, it is acceptable
to state that no Railway/gcloud/Expo/EAS/live external action was performed,
project-bootstrap external platform readiness may remain blocked by auth, and
future live releaseability work still requires its blockers and approvals to be
resolved.

## 9. Stop Conditions And Failure Routing

Stop and route instead of proceeding when:

- role identity or routing artifact is missing, mismatched, or not ready;
- accepted task, work-unit handoff, or deterministic next action is missing;
- the request lacks architecture, runtime, API, route/state, dependency, or
  releaseability risk;
- relevant SoT cannot be read;
- implementation is requested from Mobile Architect;
- API co-sign lacks `packages/contracts`, Backend/API Integrator input, or
  required `wm-contract-reviewer` evidence;
- runtime/dependency/EAS recommendations lack `PROJECT_ENVIRONMENT.md`
  alignment;
- Design quality, QA evidence execution, release readiness, production submit,
  failed-gate risk, or human-gate decision ownership is being assigned to
  Mobile Architect;
- secrets or credential values would be exposed;
- local validation is being presented as live external proof.

Failure routing:

- Mobile implementation blockers route to Mobile App Dev.
- Backend/API service, schema, auth/session, error mapping, mocks, or fixtures
  route to Backend/API Integrator.
- Design quality, Stitch artifacts, state matrix, accessibility, or interaction
  quality route to Design.
- QA evidence execution, failure classification, achieved evidence level, and
  release-risk summary route to QA/Release.
- Scope, prioritization, non-goals, human gates, failed-gate risk acceptance,
  and irreversible tradeoffs route to Product/Planning and the required human
  owner.
