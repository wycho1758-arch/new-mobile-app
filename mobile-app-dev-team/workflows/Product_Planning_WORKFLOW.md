# Product Planning Workflow

This is an agent-consumed Product/Planning workflow for WonderMove
`new-mobile-app` role agents. It is not the workspace-neutral `/workspace/WORKFLOW.md`
and must not be copied there as-is.

Use this file when a WonderMove role pod, repo-local Codex skill, or reviewer
needs the Product/Planning workflow mechanics for intake, planning,
orchestration, role handoff, review, evidence, and failure routing. Workspace
common rules belong in `/workspace/WORKFLOW.md`; WonderMove repo-local commands,
paths, role gates, skills, and evidence contracts live here or in the
repo-local skills and workflow documents referenced by this file.

Agents that previously read `work-processes.md` must now read this file at:

```text
mobile-app-dev-team/workflows/Product_Planning_WORKFLOW.md
```

## 0. Codex Skill And Path Resolution

Unless explicitly marked as pod-native, named workflow skills in this document
are repo-local Codex skills or adapters under `.agents/skills/<skill-name>/SKILL.md`
in the managed project repository. They are distinct from pod-native OpenClaw
runtime snapshots under `/workspace/skills/<slug>/SKILL.md`.

Relative repository paths in this document resolve from the managed project
repository root. In the standard pod runtime, that root is:

```text
/workspace/projects/Wondermove-Inc/new-mobile-app
```

Therefore `docs/plans/work-units/<work-unit-id>/` means:

```text
/workspace/projects/Wondermove-Inc/new-mobile-app/docs/plans/work-units/<work-unit-id>/
```

It does not mean `/workspace/docs/...`, `/workspace/skills/...`, or another
pod's local filesystem. Cross-pod handoff must use committed GitHub branch/PR
state or a merged repository artifact from this managed project path.

When a repo-local skill or workflow document is relevant to the current role,
the repo-local skills and workflow documents must be followed when in scope.
Do not replace them with memory, generic Expo/RN advice, or a stale runtime
snapshot under `/workspace/skills`.

### 0.1 Codex Interactive Execution Guardrails

When Product/Planning routes or supervises managed repository work through a
Codex interactive PTY, follow the repo-local or pod-native
`codex-interactive-repo-work` execution contract in addition to this workflow.
Do not treat the summary below as a replacement for that contract.

Before Codex launch:

1. Resolve the current project-management source of truth when present: Tasks
   task, Jira issue, Confluence/wiki page, GitHub issue/PR, or committed
   work-unit artifact. Record the id or link in the Workboard card, Codex
   prompt, and evidence path.
2. Create or update a Workboard guard for the bounded work. The guard must
   record owner, scope, routing artifact or SoT, evidence path, blockers, and
   completion proof. Workboard tracks execution and wake/follow-through only;
   it does not replace Tasks, Jira, Confluence/wiki, GitHub, or work-unit SoT.
3. Register a wake-guard before launch and keep it active until a complete
   commit or PR handoff is ready. If work is incomplete at wake time, register
   the next wake with a 5 minute larger interval: `+5m`, `+10m`, `+15m`,
   `+20m`, and so on.
4. Confirm the `codex-role-workflow` routing artifact or equivalent approved
   routing source is ready, including resolved operating role, allowed
   repo-local Codex skill, required reviewers, human-gate state, and affected
   scope. Missing routing blocks Codex launch.
5. Give the Codex PTY a distinguishable title or task label and evidence path.

Codex prompt and execution requirements:

1. State whether the session is a specific-goal session or a
   progressive-improvement loop. Use `/goal` only for one specific bounded
   target. Use a loop objective, checkpoints, and stop condition for
   progressive improvement work. Do not collapse these concepts into each
   other.
2. Literally invoke `$wm` or `/wm` for the repo-scoped implementation workflow
   and include the resulting plan in the session plan.
3. Put the narrowest test, eval, validator, or fixture update before the
   implementation change when practical.
4. Make the minimal scoped change only. Do not add unrelated refactors,
   metadata churn, or external platform changes.
5. Inspect `/diff` or an equivalent material diff for the changed paths before
   handoff.
6. Obtain required read-only reviewer evidence from the reviewers recorded in
   the routing source. Reviewer evidence must cover approved plan, diff,
   validation output, residual risks, and next action.
7. Preserve human gates, secret safety, and external-proof boundaries. Codex
   must not self-approve, merge, accept failed-gate risk, expose secrets, or
   claim production/external proof.

Concurrent Codex PTY rules:

- If new independent bounded work appears while another Codex PTY is active, do
  not wait unnecessarily. Launch a separate titled PTY only when the scope is
  independent and separately guarded.
- Use at most 3 concurrent Codex PTYs. Each PTY needs its own routing source,
  Workboard guard, wake-guard, goal or loop objective, reviewer evidence,
  validation output, and evidence path.
- Close completed PTYs promptly to preserve Codex context and operator
  attention.

Commit or PR handoff must include routing source, Workboard card, wake-guard
state, Codex prompt/evidence path, changed paths, validation commands and
outputs, reviewer verdicts and evidence paths, residual risks, external proof
limits, and the relevant Tasks/Jira/GitHub links when such records exist.

## 0A. Standard Work Lifecycle

At work start, the owning role confirms the goal, owner, scope, deadline, expected output, and approval boundary.
If any of these are unknown and block safe work, route clarification through
Product/Planning before producing a handoff or execution packet.

Use this lifecycle for Product/Planning, Design, architecture, API,
implementation, QA/release, review, documentation, and operational work:

```text
Intake -> Plan -> Gather evidence -> Produce -> Review -> Deliver -> Follow through
```

- Intake: identify the request, owner role, expected output, deadline, approval
  boundary, and whether the work belongs to the current role.
- Plan: choose the smallest safe path, define non-goals, identify human gates,
  and choose the required evidence before execution or handoff.
- Gather evidence: verify important claims against accepted source material,
  including relevant repo files, tasks, pages, logs, prior decisions, command
  output, or reviewer records.
- Produce: create only the artifact owned by the current role.
- Review: check correctness, completeness, risks, role boundaries, required
  evidence, and approval needs before marking the work ready.
- Deliver: report outcome, evidence, blockers, approval scope, and recommended
  next action.
- Follow through: when work continues or waits on another owner, keep the
  durable artifact current and report status when the workflow requires it.

Working notes, reviews, and status reports must separate facts, assumptions,
decisions, blockers, and next actions. Facts cite source material. Assumptions
are explicitly labeled and must not be treated as accepted scope. Decisions name
the owner or approval reference. Blockers state the missing evidence, gate, or
owner. Next actions name the responsible role.

## 0B. Systems Of Record

Use the narrowest durable system of record for each kind of work:

- Tasks for agent-executable work packages and local project tracking when the
  Tasks system is available. Use task comments or fields for owner, scope,
  evidence path, blockers, GitHub links, and completion proof.
- Jira/tasks: organization-level backlog, Epic/Story/Task ownership,
  assignment, and cross-team delivery status when an external Jira/task system
  is explicitly in scope.
- Confluence/wiki: published procedures, product specs, reference pages, and
  human-readable durable decisions. Internal draft or update work may happen
  through the approved workspace mechanism or task scope. Public/external
  publication, product/legal/terms/compliance publication, or owner-sensitive
  policy publication requires the relevant explicit approval.
- GitHub/repository: code, repo-local docs, committed work-unit artifacts,
  branch/PR handoff, command output summaries, reviewer evidence links, and
  validator-enforced state.
- workspace files: local operating context, temporary investigation notes, and
  non-durable drafts. Workspace files are not final SoT unless committed or
  linked back to the accepted durable location.
- Workboard: execution-state tracking for multi-step, delegated, background, or
  Codex-supervised work. Workboard records owner, scope, evidence path,
  blockers, wake/follow-through state, and completion proof; it does not replace
  Jira/tasks, Confluence/wiki, GitHub/repository, or durable work-unit SoT.

Do not invent a new durable location when an agreed Jira, Confluence/wiki,
GitHub/repository, or workspace path already owns the work. Chat, room notes,
and wake reminders are coordination evidence only until linked to the accepted
system of record. Link Tasks, Jira, Confluence/wiki, GitHub PRs, Workboard
cards, and work-unit artifacts rather than duplicating full content across them.

## 0C. Reporting, Review, And Approval

Status reports must state:

- done;
- in progress;
- blocked;
- risks;
- next action.

When more detail is needed, include evidence path or URL, owner role, approval
scope, and whether any facts, assumptions, decisions, blockers, and next actions
changed since the prior report.

Before reporting status, re-check the current source of truth, relevant
task/card/PR/session, latest agent report, command output, or durable work-unit
artifact. Do not repeat stale memory as current status.

Report through the agreed channel or system of record. If a workspace-specific
routing policy exists, follow it before default chat replies.

Reviews and approvals are separate. A review may report findings, evidence,
blockers, and required amendments, but it does not grant human approval,
execution approval, merge/publish approval, release/production approval, or
risk acceptance unless the appropriate SoT explicitly grants that authority.

Reviewer evidence should include reviewer identity, reviewed scope/path,
verdict, findings, checks reviewed, residual risks, and next action. Link the
reviewer evidence from the task, PR, work-unit artifact, or other accepted SoT.

Any wake-guard or reminder that asks an agent to check, update, or report must
lead to a user-visible status update. The update should report the durable
status and next action while hiding internal reminder text.

When delegated or background work completes, Product/Planning reviews the result
before relaying it. Report pass, blocker, or partial state with evidence and the
next action. If blocked and supportable, provide concrete corrective
instructions instead of only forwarding the blocker.

## 0D. Safety And Approval Boundaries

Secret safety is mandatory. Do not print, persist, or transmit auth tokens,
credentials, private `.env` values, signing keys, bearer tokens, private
endpoints, or secret-bearing config contents in prompts, logs, transcripts,
reports, files, or evidence.

Do not perform destructive, production, financial, legal, security-sensitive, or externally visible actions without the required approval.
This includes
production submit, payment or money movement, PII/privacy-sensitive behavior,
external messaging, legal/terms/compliance decisions, business/budget owner
decisions, irreversible scope tradeoffs, and accepting risk after a failed gate.

## 0E. Role-Centered Operation Check

Before publishing, handing off, or reporting from this workflow, check that the
document and current action are role-centered:

- exact runtime role: name the operating role that owns the current decision or
  artifact, such as Product/Planning, Design, Mobile Architect, Mobile App Dev,
  Backend/API Integrator, QA/Release, Human Owner, or deterministic Gatekeeper.
- reports-to role: state the reporting target by role, such as
  Product/Planning or Human Owner, before using an individual name as a current
  practitioner label.
- escalation owner: identify the role that can resolve the blocker or decision.
- owns / must not own: state what the role owns and what it must not own.
- handoff targets: name the next role, input artifact, output artifact, and
  evidence path required for downstream work.
- human-gate boundary: stop for the required human owner when the work involves
  production submit, payment, privacy/PII, external messaging, legal/compliance,
  business/budget ownership, irreversible scope tradeoff, privileged access, or
  failed-gate risk acceptance.
- deterministic Gatekeeper is a system role: it reports required check status
  only and cannot approve risk, own implementation, replace review, or replace
  human approval.

Individual names may appear as current practitioner labels or routing examples,
but workflow behavior must remain keyed to runtime role, owner boundary, and
approved SoT.

## 1. Intake And Planning

1. Chief Product Officer (CPO) / Product Delivery Lead receives the user request through Product/Planning.
2. If unclear, run the repo-local Codex adapter `po-requirement-office-hours`.
3. If broad, run the repo-local Codex adapter `po-work-unit-planning-and-agent-sprint`.
4. If ready, run the repo-local Codex adapter `po-prd-to-execution`.
5. Before execution, run the repo-local Codex adapter `po-planning-completeness-review`.
6. Route technical decisions to Mobile Architect / Technical Lead before execution when architecture, runtime, API, route/state, dependency, or releaseability risk exists.
7. Route human gates before any execution work.
8. For pod-isolated role-agent work, create or update the durable GitHub handoff root under the managed project path `docs/plans/work-units/<work-unit-id>/` as defined in `workflows/github-artifact-workflow.md`.

### 1A. CPO Planning And Feedback Loop

The CPO / Product Delivery Lead owns planning and orchestration, not
practitioner execution. This loop defines the workflow mechanics behind the
organization-level reporting guidance.

1. Intake classification: Product/Planning receives the request unless a
   committed durable work-unit `status.json` already assigns the next action to
   a downstream role.
2. Routing resolution: Product/Planning uses the pod-native
   `codex-role-workflow` status-only bridge to resolve role identity,
   `entry_case`, allowed repo-local Codex skills/adapters, required reviewers,
   durable artifact stage, and blocking gates before recommending downstream
   work.
3. Entry-case routing: `unclear` routes to `po-requirement-office-hours`,
   `broad` routes to `po-work-unit-planning-and-agent-sprint`, `ready_bounded`
   routes to `po-prd-to-execution`, and `pre_execution` routes to
   `po-planning-completeness-review`. Direct implementation language requires
   an accepted task packet plus `READY_FOR_EXECUTION`, or deterministic
   `status.json` next action, before any practitioner execution starts.
   READY_FOR_EXECUTION must be recorded in durable SoT such as work-unit
   `status.json`, a Tasks/Jira field or comment, or a GitHub/work-unit handoff
   artifact. Chat-only text is coordination evidence and is not enough.
4. Practitioner plan request: Product/Planning asks the relevant practitioner
   for a role-owned plan. This request is not execution approval.
5. Plan review: Product/Planning reviews scope, acceptance mapping, non-goals,
   readiness, evidence requirements, human-gate routing, dependencies,
   blockers, open decisions, and next responsible role.
6. Task packet completeness: every execution task must include owner, input
   artifact, output artifact, Done-when acceptance criteria, evidence
   requirement, dependencies, open decisions, next responsible role, and a
   GitHub branch/PR handoff link when work leaves the current pod.
7. QA/Release inclusion: Product/Planning must include QA/Release tasks,
   evidence requirements, release-readiness tasks, and handoff paths when
   relevant; not owning QA/Release execution is not permission to omit it.
8. Design P0/P1 boundary: Product/Planning P0/P1 approval is scope/evidence
   approval for PRD fit, non-goals, evidence readiness, human-gate routing, and
   scope alignment. It is not Design quality approval, selected option approval,
   Stitch authorship approval, or HTML implementation approval. P1 approval is
   required before HTML extraction metadata or artifacts are fetched,
   persisted, or published.
9. Feedback handoff: Product/Planning sends feedback to the practitioner. The
   practitioner keeps specialist ownership and decides whether the role-owned
   plan needs an update.
10. Execution readiness: practitioner execution may start only when an accepted
   task packet plus `READY_FOR_EXECUTION` exists, or when deterministic
   `status.json` next action assigns the downstream role.
11. Completion report: after work is complete, the practitioner reports outcome,
   command/evidence summary, blockers, reviewer state, gate state, and handoff
   state back to Product/Planning.
12. CPO completion feedback loop: Product/Planning reviews the completed work
   for scope fit, readiness, evidence completeness, gate status, open decisions,
   and next responsible role. Missing scope, evidence, gate, or handoff items
   route back to the owning practitioner or required reviewer/gate owner.
13. Boundary: Product/Planning must not implement app, backend, design, QA, or
   release work; must not approve specialist quality; must not replace
   read-only reviewers, deterministic gates, or required human-gate approvals.

### 1B. CPO 계획 및 피드백 루프

CPO / Product Delivery Lead는 planning과 orchestration을 소유하며 실무 실행을
소유하지 않는다. 이 loop는 조직 수준 보고 guidance의 실제 workflow mechanics를
정의한다.

1. Intake classification: committed durable work-unit `status.json`이 이미
   downstream role에 next action을 배정한 경우를 제외하고 Product/Planning이
   요청을 받는다.
2. Routing resolution: Product/Planning은 pod-native `codex-role-workflow`
   status-only bridge로 role identity, `entry_case`, allowed repo-local Codex
   skill/adapter, required reviewer, durable artifact stage, blocking gate를
   먼저 해석한다.
3. Entry-case routing: `unclear`는 `po-requirement-office-hours`, `broad`는
   `po-work-unit-planning-and-agent-sprint`, `ready_bounded`는
   `po-prd-to-execution`, `pre_execution`은 `po-planning-completeness-review`로
   route한다. direct implementation language는 accepted task packet과
   `READY_FOR_EXECUTION` 또는 deterministic `status.json` next action 없이는
   실무 실행으로 넘어가지 않는다.
4. 실무자 계획 요청: Product/Planning은 관련 실무자에게 role-owned plan을
   요청한다. 이 요청은 execution approval이 아니다.
5. 계획 리뷰: Product/Planning은 scope, acceptance mapping, non-goal,
   readiness, evidence requirement, human-gate routing, dependency, blocker,
   open decision, next responsible role을 검토한다.
6. Task packet completeness: 모든 execution task는 owner, input artifact,
   output artifact, Done-when acceptance criteria, evidence requirement,
   dependency, open decision, next responsible role, 그리고 work가 현재 pod를
   떠날 때 GitHub branch/PR handoff link를 포함해야 한다.
7. QA/Release inclusion: Product/Planning은 관련 있는 QA/Release task,
   evidence requirement, release-readiness task, handoff path를 누락하지 않는다.
   QA/Release 실행을 소유하지 않는다는 사실은 QA/Release 계획을 생략할 수
   있다는 뜻이 아니다.
8. Design P0/P1 boundary: Product/Planning P0/P1 approval은 PRD fit, non-goal,
   evidence readiness, human-gate routing, scope alignment에 대한 scope/evidence
   approval이다. Design quality, selected option quality, Stitch authorship,
   HTML implementation approval이 아니다. P1 approval 전에는 HTML extraction
   metadata나 artifact를 fetch, persist, publish하지 않는다.
9. 피드백 handoff: Product/Planning은 실무자에게 feedback을 전달한다.
   실무자는 specialist ownership을 유지하고 role-owned plan 업데이트 필요
   여부를 판단한다.
10. 실행 readiness: accepted task packet과 `READY_FOR_EXECUTION`이 있거나
   deterministic `status.json` next action이 downstream role을 배정한 경우에만
   실무 실행을 시작할 수 있다. `READY_FOR_EXECUTION`은 work-unit `status.json`,
   Tasks/Jira field 또는 comment, GitHub/work-unit handoff artifact 같은 durable
   SoT에 기록되어야 하며 chat-only text만으로는 충분하지 않다.
11. 완료 보고: 작업 완료 후 실무자는 outcome, command/evidence summary,
   blocker, reviewer state, gate state, handoff state를 Product/Planning에
   보고한다.
12. CPO 완료 피드백 루프: Product/Planning은 완료 작업을 scope fit,
   readiness, evidence completeness, gate status, open decision, next
   responsible role 기준으로 검토한다. scope, evidence, gate, handoff 누락은
   owning practitioner 또는 필요한 reviewer/gate owner에게 되돌린다.
13. 경계: Product/Planning은 app, backend, design, QA, release work를 구현하지
   않고, specialist quality를 승인하지 않으며, read-only reviewer,
   deterministic gate, required human-gate approval을 대체하지 않는다.

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

1. The repo-local Codex skill `$wm` establishes scope, owner, affected paths, tests, evidence path, gate impact, and SoT sources.
2. `$wm` routes material planning decisions to the relevant existing read-only custom agent when practical, or records the skip reason.
3. `$wm` records planning sub-agent results with agent, question, conclusion, source refs or evidence path, and reflection/impact.
4. Add or update the narrowest failing test/eval/validator/fixture first.
5. Mobile App Developer or Backend/API Engineer implements the smallest scoped change through the relevant operating role; do not delegate implementation to a write-capable executor.
6. Run applicable local checks.
7. Request read-only reviewer evidence.
8. Prepare PR-ready diff and evidence summary.
9. When another pod must consume the result, commit the role artifact and GitHub branch/PR link under the managed project path `docs/plans/work-units/<work-unit-id>/`; do not rely on local workspace state as handoff.

## 5. QA And Release Evidence

1. QA/Release Engineer creates an E2E/evidence plan through QA/Release using the repo-local Codex skill `$e2e-test` when E2E evidence is in scope.
2. Reset the tested instance.
3. Run planned RN Web, Maestro, mobile-mcp, Railway, or manual HUMAN-GATE evidence; use the repo-local Codex skill `$qa-railway-workflow` for Railway-owned deploy/evidence operations.
4. Record commands, logs, screenshots, issues, and summary.
5. Classify failures and route to owner.
6. Production submit requires recorded human approval.
7. Work-unit QA files summarize and link canonical evidence paths; they do not replace `.evidence/e2e-test/...`, mobile-mcp, EAS, Railway, or human-gate evidence records.

## 6. Failure Loop

1. Failed check remains failed. Do not reinterpret missing, flaky, local-only,
   or failed evidence as pass.
2. `wm-gate-fix-advisor` may classify failure read-only.
3. Product/Planning assigns the owning role for rework. The implementation,
   API, Design, architecture, QA/Release, or human owner must remain explicit.
4. Owning implementation workflow fixes the issue and updates the relevant
   task, Workboard card, PR, or work-unit blocker/next-action record.
5. QA/Release reruns or records the relevant evidence.
6. Rework cap, retry budget exhaustion, or failed-gate risk acceptance goes to
   Product/Planning and the required human owner. A reviewer, LLM, pod, or
   Gatekeeper cannot accept failed-gate risk.
