# Mobile Architect Workflow

This is an agent-consumed Mobile Architect workflow for WonderMove
`new-mobile-app` role agents. It is not the workspace-neutral
`/workspace/WORKFLOW.md` and must not be copied there as-is.

Use this file when a WonderMove role pod, repo-local Codex skill, or reviewer
needs Mobile Architect mechanics for architecture recommendations, ADRs,
route/state impact, module boundaries, runtime/dependency policy, API co-sign
impact, releaseability/EAS strategy risk, reviewer evidence, and handoff.

Common intake, planning, reporting, review, and approval mechanics are defined
in `mobile-app-dev-team/runtime-sources/workflows/Product_Planning_WORKFLOW.md`. This workflow
only restates the Mobile Architect-specific application of those mechanics.


## 0. Standard Workspace Work Baseline

This concise baseline restores the role-neutral workspace operating rules that
Mobile Architect work inherits. The role-specific sections below remain the
source for architecture mechanics, artifact contracts, and ownership boundaries.

### Core Principles

- Clarify the goal, owner, scope, expected output, and approval boundary.
- Verify important claims against source material before acting or reporting.
- Separate facts, assumptions, decisions, blockers, and next actions.
- Prefer concise, evidence-backed updates over unsourced narratives.
- Escalate risk, ambiguity, blocked work, or policy conflict early.

### Standard Work Lifecycle

Use the smallest safe lifecycle that fits the task:

```text
Intake -> Plan -> Gather evidence -> Produce -> Review -> Deliver -> Follow through
```

### Work Systems

- Use the appropriate system of record: Tasks/Jira for trackable work,
  Confluence/wiki/docs for procedures and decisions, GitHub/repository for code
  and repo-owned docs, and workspace files for local operating context.
- Link related artifacts such as tickets, pages, commits, PRs, logs, reports,
  and decisions when useful.
- Keep volatile status out of durable rules; keep durable rules short and
  reusable.

### Reviews And Approvals

- Separate design approval, execution approval, merge/publish approval,
  release/production approval, and human-gate or risk acceptance.
- Do not treat a document, Room message, Task comment, or local validation as
  release approval. Tests, checks, live probes, or explicit owner approval may
  still be required.

### Reporting

- Status reports should state done, in progress, blocked, risks, and next
  action.
- Review reports should state verdict, evidence, blockers, required amendments,
  and approval scope.
- Use the agreed report destination. Do not invent a new location when a Room,
  Task, PR, or artifact destination is already assigned.
- Wake-guards that ask to check, update, or report must lead to a user-visible
  status update while hiding internal reminder text.

### Safety And Boundaries

- Never expose secrets in prompts, logs, transcripts, reports, files, or normal
  memory.
- Do not perform destructive, production, financial, legal, security-sensitive,
  or externally visible actions without the required approval.
- Prefer reversible changes and clear audit trails.
- If instructions conflict, pause, state the conflict, and escalate.

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
refers to the repo-local work-management router, not a WonderMove abbreviation.
Invoke it in repo-scoped Codex execution plans when the work proceeds through
the WonderMove workflow.

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

Before edits, the execution plan must record the current routing artifact,
bounded scope, owner role, affected path, expected validation, evidence path,
reviewer, human-gate state, and external-proof boundary. Do not rely on
historical local `/workspace/state/...` paths as cross-pod durable evidence.

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

### 0A.1 Role-Based Review Protocol Inheritance

Mobile Architect inherits the Product/Planning direct-request and practitioner
review protocol from `Product_Planning_WORKFLOW.md`. For material architecture,
runtime, route/state, dependency, API co-sign, or releaseability work, Mobile
Architect prepares a role-owned plan before execution, waits for Product/
Planning scope or execution-readiness review when required, reports blockers
and human-gate needs to Product/Planning, and submits completion evidence for
Product/Planning completion review before a user-facing final completion claim
is made.

Mobile Architect-specific execution constraints remain narrow: Mobile Architect
owns architecture artifacts, runtime and dependency recommendations, API
co-sign boundaries, releaseability-risk notes, and architecture reviewer
evidence. This inheritance does not let Mobile Architect own mobile
implementation, backend/API service delivery, Design quality, QA evidence
execution, production submit, failed-gate risk acceptance, secrets, auth,
credential changes, dependency installs, or external/live actions outside an
approved architecture workflow.

Immediate answers are allowed only for simple architecture Q&A, status checks,
source-of-truth-only lookups, or obvious routing answers that do not create or
change files, verification artifacts, handoffs, live/external state, release
state, credentials, secrets, or human-gated decisions.

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

### 0B.1 Mobile Architect Work Signals And Follow-Through

Tasks notifications, Workboard cards, wake-guards, reminders, and continuity
messages that reference Mobile Architect work are current work signals until the
linked Task, PR, Workboard card, architecture artifact, or work-unit state is
complete, explicitly cancelled, or blocked with a recorded owner and next
action. Do not dismiss them as old chat only because a similar status was
reported earlier.

For architecture reviews, ADRs, route/state impact notes, API co-signs,
runtime/dependency recommendations, and releaseability-risk handoffs, re-check
the referenced source of truth before reporting closure or no-change status. The
check should verify the durable artifact path, reviewer state, downstream owner,
open blocker, PR or work-unit state, and whether the architecture handoff still
needs follow-through.

Avoid self-echo or notification spam only after confirming that the incoming
signal contains no new instruction, state change, blocker, reviewer result,
quality-gate result, or handoff decision. When work is waiting on a reviewer,
downstream owner, PR, gate, or Product/Planning decision, record the waiting
state in the relevant Task, Workboard card, PR, or architecture artifact and
keep or register the wake-guard required by the active workflow.

These signals do not expand Mobile Architect authority. They must not be used
to bypass role ownership, reviewer gates, human approval, merge/release
approval, production or external activation approval, secret-handling rules,
failed-gate risk acceptance, or the boundary that Mobile Architect does not own
mobile implementation, backend/API service work, Design quality, or QA evidence
execution.

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

Mobile Architect workflow Review meetings, `change-required` feedback, 1:1
corrective follow-up, corrective PR/review/merge or recorded no-change
decisions, and next Review meeting resume rules follow the accepted pod-native
`wm-meeting-process` skill and the Product/Planning meeting-process reference:
`mobile-app-dev-team/runtime-sources/workflows/Product_Planning_WORKFLOW.md`.
This reference does not change role ownership, reviewer gates, human approval,
Codex execution contracts, or release approval.

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

## 0E. Room Text Delivery Harness And Role-Pod Sync

Room Text Delivery Harness proof is for visible Room text delivery only. It does
not validate architecture completion, Task/Workboard/PR state, reviewer approval,
semantic sufficiency, release readiness, external platform readiness, or
human-gate acceptance.

Canonical source lives under:

```text
mobile-app-dev-team/runtime-sources/harnesses/room-text-delivery/
```

The generated operational copy lives under:

```text
/workspace/harness/room-text-delivery/
```

Do not edit the generated runtime copy directly. When harness deployment is in
scope, materialize it through `openclaw-pod-skills-sync` from the repository
source and record sync evidence: sync report path, overall status, blockers,
`room_text_delivery.status`, `cmp=true`, `MANIFEST.json`, `DO_NOT_EDIT.md`, file
count, and checksum or manifest evidence.

For live report delivery, resolve the destination from current instruction
metadata or the latest explicit report destination. Do not copy actual operating
Room ids from reusable docs, fixtures, examples, or templates; durable examples
should use synthetic ids such as `1001` and `1002`.

For non-dry-run `report-delivery`, expected destination and request Room id must
remain separate. The send wrapper must receive `--expected-room-id` or
`--visible-report-destination`, and the normalized result should record the
expected destination as `intended_room_id` and the transport response Room as
`actual_room_id`. Success requires a normalized `room-text-delivery-result/v1`
plus validator PASS.

Failure proof should preserve expected failures instead of reclassifying them as
success. Missing expected destination, intended/actual Room mismatch, plain text
without a normalized result, non-2xx transport responses, and 403 unauthorized
Room sends should fail delivery proof. A 403 may be valid route or access-boundary
evidence, but it is not successful delivery proof and is not implementation
success by itself.

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
2. For PRD-based work, an accepted Product/Planning task packet, durable
   work-unit source, Tasks/Jira field or comment, or GitHub/work-unit handoff
   must record `READY_FOR_EXECUTION` or an equivalent durable readiness signal.
   Chat-only PRD text is coordination evidence, not execution readiness.
3. The request has architecture, runtime, API, route/state, dependency, or
   releaseability risk.
4. The accepted scope, PRD acceptance line or Done-when criteria, non-goals,
   expected Mobile Architect output, evidence requirement, blockers or open
   decisions, and downstream owner are identifiable.
5. Relevant SoT is readable. If not, report the missing source as blocked
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

For PRD-based work, also map the architecture question to:

- the PRD acceptance line, accepted requirement bullet, or Done-when criterion
  being answered;
- the architecture-owned surface involved: route/state, module boundary,
  runtime/dependency, API co-sign, releaseability/EAS, or not applicable;
- any PRD request that is out of Mobile Architect scope and must route back to
  Product/Planning as a non-goal or open question;
- the downstream implementation, Backend/API, Design, or QA/Release owner that
  consumes the architecture decision.

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
implications only. For PRD-based work, carry the Product/Planning-required QA
applicability and evidence level into the releaseability-risk handoff when
runtime, dependency, native, EAS, or release behavior is affected; if it is
missing, route the evidence decision back to Product/Planning or QA/Release
instead of assuming it.

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

For PRD-driven architecture work, choose the smallest artifact that matches the
accepted architecture surface:

- `route-state-impact.md` for navigation, state ownership, cross-screen data
  flow, persistence, selector, or test implications.
- `api-contract-cosign.md` when PRD acceptance depends on mobile/API contract
  behavior, auth/session behavior, error mapping, mocks, fixtures, or
  `packages/contracts`.
- `releaseability-risk.md` when PRD acceptance affects runtime, dependency,
  native, EAS, evidence-ladder, rollback, or releaseability risk.
- `architecture-note.md` for a general architecture recommendation not covered
  by a narrower artifact.
- `adr.md` only when the decision has durable cross-role or release-behavior
  consequences.

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
git diff --check -- mobile-app-dev-team/runtime-sources/workflows/Mobile_Architect_WORKFLOW.md
node scripts/validate-workflow-docs.mjs
node scripts/validate-runtime-sources.mjs
```

Additional validators are applicable only when discovered and relevant to the
changed scope, such as broader runtime, team-doc, work-unit, or local-harness
validators for runtime-affecting changes.

When Mobile Architect docs change Room Text Delivery Harness instructions or
proof examples, add the relevant harness validation from the repository root
when available:

```text
node mobile-app-dev-team/runtime-sources/harnesses/room-text-delivery/validators/validate-room-text-result.mjs --self-test
```

For explicit operational proof files, validate the file path directly with the
same validator. Do not mutate the generated `/workspace/harness` runtime copy to
make documentation validation pass.

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
- PRD acceptance line, Done-when criteria, non-goals, or Product/Planning
  readiness source is missing or conflicts with the requested architecture
  output;
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
