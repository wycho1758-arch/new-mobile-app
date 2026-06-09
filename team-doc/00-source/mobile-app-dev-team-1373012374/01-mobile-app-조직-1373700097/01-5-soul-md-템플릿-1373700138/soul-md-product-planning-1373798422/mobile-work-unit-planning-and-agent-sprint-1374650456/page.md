---
pageId: "1374650456"
sourceTitle: "mobile-work-unit-planning-and-agent-sprint"
sourceVersion: "unknown"
sourceUrl: "https://wondermove-official.atlassian.net/wiki/spaces/mobileappd/pages/1374650456"
fetchedAt: "2026-06-09T03:41:15.000Z"
syncStatus: "synced"
---

# mobile-work-unit-planning-and-agent-sprint

**Scope:** Product/Planning operational skill for mobile app development. This skill defines how Product/Planning chooses bounded work units for agents, runs MVP-first approval, and receives proactive improvement reports from practitioner agents without allowing autonomous scope expansion.

## 업데이트 배경

기존 Product/Planning 하위 skill은 요구사항이 불명확할 때 구체화하는 절차와, PRD 분해 이후 담당자 검토를 수행하는 절차를 제공한다. 그러나 실제 모바일 앱 개발 프로젝트에서는 Product/Planning이 전체 작업 볼륨을 그대로 실무 agent에게 전달하면 agent가 과도한 범위, 불명확한 완료 기준, 누락된 의존성 때문에 실패할 가능성이 높다. 따라서 Product/Planning은 “무엇을 만들 것인가”뿐 아니라 “어떤 크기와 형태의 작업 단위로 넘길 것인가”를 판단해야 한다. 이 skill은 그 판단 기준을 별도 운영 절차로 고정하기 위해 추가한다.

이 skill의 기본 방향은 MVP-first다. 먼저 검증 가능한 최소 제품 증분을 만들고 사용자 또는 human owner의 승인을 받은 뒤, 다음 제품 수준의 서비스 범위로 확장한다. 이 방향은 큰 계획을 한 번에 실행시키는 대신, Sprint 안에서 완료 가능한 단위, MVP를 통한 validated learning, shaped work와 vertical slice를 활용해 리스크를 줄이는 개발 방법론을 현재 SOUL.md/Confluence/Jira 운영 구조에 맞게 적용한 것이다.

또한 각 실무자 SOUL.md agent가 자신이 수행한 작업을 기준으로 개선점을 능동적으로 보고하는 경로가 필요하다. 다만 cron 또는 scheduled self-inspection은 실행 지시가 아니라 보고와 제안의 트리거일 뿐이다. 개선 제안은 Product/Planning이 triage하고, scope 변경·Jira 실행·human gate 대상 작업은 승인 절차를 거쳐야 한다. 이 제한은 agent가 스스로 범위를 확장하거나 SOUL.md를 수정하거나 Jira 작업을 자동 생성하는 것을 막기 위한 핵심 경계다.

## Skill Specification - English

### Metadata

| Field | Value |
| --- | --- |
| Skill name | mobile-work-unit-planning-and-agent-sprint |
| Owner SOUL.md | Product/Planning main agent |
| Runtime location | organization-runtime skill pack for generated Product/Planning agents |
| Primary use case | Case B support: bounded work-unit planning after requirement clarification and before or around PRD-to-execution decomposition |
| Participating roles | Product/Planning owner; Design, Mobile Architect, Mobile App Dev, Backend/API Integrator, QA/Release, Security/Privacy, Gatekeeper, and Human Owner only when relevant to the selected work unit |
| Upstream | User request, clarified requirement brief, PRD, office-hours result, existing backlog, practitioner improvement report |
| Downstream | mobile-prd-to-execution, bounded Jira Epic/Story/Task set, feature room, or human decision queue |
| References | Scrum Guide 2020; Scrum.org Product Backlog Refinement; Atlassian Sprint Planning; Lean Startup MVP; Shape Up shaping, appetite, vertical slices, circuit breaker, and cooldown |

### Purpose

This skill gives Product/Planning a repeatable process for deciding what size and shape of work should be handed to agents. It prevents oversized assignments by converting broad product intent into bounded MVP increments, agent sprint goals, vertical slices, stories, execution tasks, and one-day-or-less work steps when appropriate. It also defines a safe intake path for practitioner agents to report improvement opportunities from scheduled or event-triggered self-inspection.

### Case Coverage

| Case | Coverage |
| --- | --- |
| Case B support | Shapes clarified requirements into bounded MVP increments, agent sprints, vertical slices, and work items before or around PRD-to-execution decomposition. |
| Cross-role coordination | Defines when relevant practitioner agents join a sprint planning, review, or retro loop for the selected work unit. |
| Proactive improvement intake | Accepts practitioner self-inspection reports as proposals for Product/Planning triage, not as automatic execution instructions. |

### When To Use

* Use this skill when a clarified requirement or PRD is too large to hand directly to one agent or one role.
* Use this skill before creating a large Jira decomposition, when Product/Planning must decide the first MVP increment or agent sprint boundary.
* Use this skill when practitioner agents submit proactive improvement reports from scheduled cron, task completion, repeated failure, blocker discovery, release evidence gaps, or retrospective findings.
* Use this skill when a work item has no predefined workflow branch but still needs Product/Planning to shape a safe next step.

### Inputs

* Clarified requirement brief or PRD link.
* mobile-requirement-office-hours result when available.
* Current product goal, acceptance lines, non-goals, constraints, and human-gate flags.
* Known Design, Architecture, Backend/API, QA/Release, Security/Privacy, and Gatekeeper dependencies.
* Existing Jira backlog, feature room notes, or practitioner improvement report.
* Relevant methodology reference for the planning decision: Sprint-sized readiness, MVP learning goal, or shaped vertical slice.

### Outputs

* Work-unit decision: PRODUCT_GOAL, MVP_INCREMENT, AGENT_SPRINT, VERTICAL_SLICE, STORY_WORK_ITEM, EXECUTION_TASK, or ONE_DAY_STEP.
* Bounded handoff package with owner role, input artifacts, output artifacts, acceptance line, evidence requirement, dependencies, open decisions, non-goals, and next responsible role.
* MVP-first approval plan when the product scope is not yet validated.
* Agent sprint/review/retro agenda when multiple roles must coordinate within a bounded timebox.
* Proactive improvement triage result: REJECT, NON_GOAL, BACKLOG_CANDIDATE, SPRINT_IMPROVEMENT, HUMAN_DECISION_REQUIRED, or RUNTIME_CAPABILITY_BLOCKED.
* Optional handoff to mobile-prd-to-execution only after the selected work unit is clear enough for decomposition.

### Work-Unit Levels

| Level | Meaning | Allowed handoff |
| --- | --- | --- |
| Product Goal / Product Bet | Broad product outcome or strategic bet. Too large for direct execution. | Shape into MVP increments before agent execution. |
| MVP Increment | Smallest usable increment that can produce approval or validated learning. | Can become one or more agent sprints after acceptance lines are clear. |
| Agent Sprint | Bounded coordination window with one sprint goal and a small set of related work items. | Can be assigned to relevant agents with review and retro checkpoints. |
| Vertical Slice | User-visible slice that crosses only the necessary layers to prove the behavior. | Can be decomposed into role-specific stories or tasks. |
| Story / Work Item | User or system outcome with measurable acceptance criteria. | Can be converted into execution tasks. |
| Execution Task | Role-owned task with concrete output and evidence. | Can be assigned to one owner role. |
| One-day-or-less Work Step | Small implementation step used by practitioner agents to inspect daily progress. | May be planned by the executing role, but cannot expand product scope. |

### Decision Process

1. **Load SoT.** Read the clarified requirement, PRD, acceptance lines, non-goals, existing backlog, and human-gate flags.
2. **Classify the planning problem.** Decide whether the input is a broad product goal, MVP candidate, sprint candidate, vertical slice, story, execution task, or improvement report.
3. **Reject oversized handoff.** If the work cannot be explained with a bounded owner, acceptance line, evidence, and non-goal, do not hand it to an execution agent.
4. **Shape the MVP first.** For unvalidated product work, define the smallest usable increment that can support approval or learning with the least unnecessary work.
5. **Define the agent sprint boundary.** Select only the work items needed for one coherent sprint goal. Keep dependencies explicit and avoid unrelated parallel initiatives.
6. **Slice vertically when possible.** Prefer a user-visible vertical slice over layer-only work unless the task is purely enabling infrastructure required by the accepted scope.
7. **Prepare handoff.** Every handoff must include owner role, input artifacts, output artifacts, evidence path or URL, open decisions, next responsible role, acceptance line, non-goals, and human gates.
8. **Run agent sprint meeting when needed.** For multi-role work, Product/Planning opens a short planning/review/retro loop: sprint goal, selected work units, role handoffs, evidence, blockers, and improvement actions.
9. **Process proactive reports.** Practitioner reports from cron or event triggers are triaged as proposals. Product/Planning may reject, mark non-goal, create a backlog candidate, schedule a sprint improvement, or escalate to human decision.
10. **Publish decision.** Record the selected work-unit level, rationale, approved scope, deferred scope, and next action in the accepted SoT location.

### MVP-First Approval Flow

```
User / PRD / Broad product intent
        |
        v
Clarify requirement and constraints
        |
        v
Shape MVP increment
        |
        v
Create bounded agent sprint / vertical slice
        |
        v
Deliver evidence-backed usable MVP
        |
        v
Request user or human-owner approval
        |
        +-- rejected or unclear --> rework / non-goal / new intake
        |
        +-- approved -----------> expand backlog toward product-level service
```

### Proactive Agent Improvement Flow

```
Practitioner agent work / blocker / failure / release evidence gap / scheduled cron
        |
        v
Role-owned self-inspection report
        |
        v
Product/Planning intake
        |
        v
Triage: reject | non-goal | backlog candidate | sprint improvement | human decision
        |
        v
Approved backlog or process update only after Product/Planning and required gates
```

### Proactive Report Contract

| Field | Required content |
| --- | --- |
| Reporter role | The SOUL.md role that observed the issue or opportunity. |
| Trigger | scheduled-cron, task-complete, blocker, repeated-failure, release-evidence-gap, retrospective, or other supported event. |
| Observed work | Task, PR, evidence, feature room, or Confluence/Jira link. |
| Finding | Concrete mistake, friction, risk, missing evidence, repeated issue, or improvement opportunity. |
| Suggested action | Smallest proposed next experiment or process change. |
| Scope impact | none, within-approved-scope, scope-change, human-gate, or unknown. |
| Evidence | Link or artifact supporting the report. |

### Decision States

| State | Meaning | Next action |
| --- | --- | --- |
| READY_FOR_MOBILE_PRD_TO_EXECUTION | The work unit is clear enough for Jira Epic/Story/Task decomposition. | Run mobile-prd-to-execution. |
| READY_FOR_AGENT_SPRINT | The work unit is bounded and ready for a short coordinated agent sprint. | Create sprint goal, role handoffs, and evidence expectations. |
| NEEDS_SMALLER_SLICE | The work is still too large or too vague for safe handoff. | Reduce to MVP increment, vertical slice, or story/work item. |
| BACKLOG_CANDIDATE | A proactive report is useful but not approved for execution yet. | Register as candidate with Product/Planning priority decision. |
| HUMAN_DECISION_REQUIRED | The work touches human gate or irreversible scope tradeoff. | Stop automatic progression and request human decision. |
| REJECTED_OR_NON_GOAL | The proposal conflicts with current scope or is not worth pursuing now. | Record rationale and do not create execution work. |

### Required Checks / Evals

- [ ] The selected work unit is smaller than the full product scope and has a single clear next outcome.
- [ ] Acceptance line, non-goal, owner role, evidence, dependencies, and human gates are recorded.
- [ ] MVP work is approved or explicitly marked as awaiting approval before product-level expansion.
- [ ] Multi-role agent sprint includes only relevant roles and one coherent sprint goal.
- [ ] Proactive reports are treated as proposals until Product/Planning triage is complete.
- [ ] No automatic Jira execution, source change, scope change, or SOUL.md modification is triggered by cron alone.

### Forbidden

* Do not hand the full product plan to one execution agent.
* Do not create a generic workflow framework or a new orchestration layer.
* Do not require every role to submit a daily report when no relevant work, blocker, failure, or scheduled intake applies.
* Do not let cron create Jira issues, modify code, change SOUL.md, or approve scope automatically.
* Do not bypass human gates for production submit, payment, PII, external messaging, legal/terms, or accepting risk after gate failure.
* Do not treat practitioner improvement suggestions as approved product scope.
* Do not replace mobile-requirement-office-hours, mobile-prd-to-execution, or mobile-planning-completeness-review.

### Relation To Existing Skills

| Skill | Relationship |
| --- | --- |
| mobile-requirement-office-hours | Runs before this skill when the request is unclear. |
| mobile-work-unit-planning-and-agent-sprint | Selects bounded work units, MVP increments, agent sprint boundaries, and proactive report triage. |
| mobile-prd-to-execution | Runs after this skill when the selected work unit is ready for Jira Epic/Story/Task decomposition. |
| mobile-planning-completeness-review | Runs after decomposition to verify execution readiness with relevant roles. |

### References

| Ref | Source |
| --- | --- |
| \[1\] | [Scrum Guide 2020](https://scrumguides.org/docs/scrumguide/v2020/2020-Scrum-Guide-US.pdf) |
| \[2\] | [Scrum.org Product Backlog Refinement](https://www.scrum.org/resources/product-backlog-refinement) |
| \[3\] | [Atlassian Sprint Planning](https://www.atlassian.com/agile/scrum/sprint-planning) |
| \[4\] | [Lean Startup Co - Eric Ries on MVP](https://leanstartup.co/resources/articles/what-is-an-mvp/) |
| \[5\] | [Shape Up introduction](https://basecamp.com/shapeup/0.3-chapter-01) |
| \[6\] | [Shape Up betting table, circuit breaker, cooldown](https://basecamp.com/shapeup/2.2-chapter-08) |
| \[7\] | [Shape Up work slicing](https://shapeup.cc/) |
