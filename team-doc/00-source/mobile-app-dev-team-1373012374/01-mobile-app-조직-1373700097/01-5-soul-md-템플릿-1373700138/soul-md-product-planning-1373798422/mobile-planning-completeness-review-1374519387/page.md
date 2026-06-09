---
pageId: "1374519387"
sourceTitle: "mobile-planning-completeness-review"
sourceVersion: "unknown"
sourceUrl: "https://wondermove-official.atlassian.net/wiki/spaces/mobileappd/pages/1374519387"
fetchedAt: "2026-06-09T03:41:15.000Z"
syncStatus: "synced"
---

# mobile-planning-completeness-review

**Scope:** Product/Planning operational skill for mobile app development. This skill reviews a completed planning package with responsible agents before execution starts. It is adapted to our SOUL.md/Confluence/Jira workflow and does not copy, install, or vendor gstack.

## Metadata

| Field | Value |
| --- | --- |
| Skill name | mobile-planning-completeness-review |
| Owner SOUL.md | Product/Planning main agent |
| Runtime location | organization-runtime skill pack for generated Product/Planning agents |
| Use case | Case B: repeated post-planning review gap that cannot be fully represented as fixed workflow branches |
| Upstream | mobile-prd-to-execution output, PRD, Jira Epic/Story/Task set, acceptance criteria, evidence requirements |
| Downstream | Execution agents only after READY_FOR_EXECUTION; Product/Planning rework or human gate otherwise |
| Source of inspiration | gstack plan review pattern as comparative prior art only: [gstack repository](https://github.com/garrytan/gstack) |
| Created date | <custom data-type="date" data-id="id-0">6/7/2026</custom> |

## Purpose - English

This skill gives the Product/Planning agent a concrete process for checking whether a planning package is complete enough for execution. It coordinates targeted review with responsible roles, captures gaps and contradictions, updates planning artifacts, and returns a readiness decision. It is intentionally bounded: it does not execute development work and does not create a new generic workflow layer.

## 목적 - 한국어

이 skill은 Product/Planning 에이전트가 planning package가 실행 착수에 충분한지 확인하기 위한 기준 프로세스다. 담당 역할과 targeted review를 진행하고, 누락/충돌/리스크를 회수하고, planning 산출물을 보강한 뒤 readiness decision을 반환한다. 개발 실행을 수행하지 않으며 새로운 범용 workflow layer를 만들지 않는다.

## When To Use - English

* Product/Planning has completed PRD decomposition into Jira Epic/Story/Task or equivalent execution work items.
* The plan contains mobile app behavior, screen state, API dependency, release gate, data model, payment/auth/privacy, or QA evidence that other responsible agents must validate.
* The request is complex enough that issues are likely to appear during execution if role owners do not review the handoff first.
* The workflow has no predefined branch for the event, but Product/Planning still must collaborate with other agents before execution.

## 사용 시점 - 한국어

* Product/Planning이 PRD를 Jira Epic/Story/Task 또는 동등한 실행 work item으로 분해한 경우.
* 계획에 모바일 앱 동작, 화면 상태, API 의존성, 릴리스 gate, 데이터 모델, 결제/auth/privacy, QA evidence가 포함되어 담당 에이전트 검토가 필요한 경우.
* 실행 중 문제 발생 가능성이 높아 담당자 검토 없이 handoff하면 재작업 위험이 큰 경우.
* 특정 이벤트에 대해 선택 가능한 고정 workflow가 없지만 Product/Planning이 실행 전에 협업해야 하는 경우.

## Inputs - English

* Clarified PRD or requirement brief.
* Jira Epic/Story/Task decomposition or equivalent work item set.
* Acceptance criteria, evidence requirements, non-goals, constraints, and decision log.
* Design, architecture, backend/API, QA/release, security/privacy, and mobile platform references when relevant.
* Output from mobile-requirement-office-hours if that skill was used.

## 입력 - 한국어

* 구체화된 PRD 또는 requirement brief.
* Jira Epic/Story/Task 분해 결과 또는 동등한 work item set.
* 수용 기준, evidence requirements, non-goal, constraints, decision log.
* 관련이 있는 design, architecture, backend/API, QA/release, security/privacy, mobile platform 기준.
* mobile-requirement-office-hours가 사용된 경우 해당 산출물.

## Outputs - English

* Planning completeness review summary.
* Role review matrix with reviewer, requested check, response, gaps, and owner.
* Gap list: missing information, contradiction, unsupported assumption, SoT conflict, unassigned work, or missing evidence.
* Updated acceptance criteria and evidence requirements where needed.
* Readiness decision: READY_FOR_EXECUTION, NEEDS_REWORK, HUMAN_DECISION_REQUIRED, or BLOCKED_BY_RUNTIME_CAPABILITY.
* Execution handoff package only when READY_FOR_EXECUTION is selected.

## 산출물 - 한국어

* planning completeness review summary.
* 검토자, 요청 검토 항목, 응답, gap, owner가 포함된 role review matrix.
* 누락 정보, 충돌, 지원되지 않는 가정, SoT 충돌, 미할당 작업, evidence 누락을 포함한 gap list.
* 필요 시 보강된 acceptance criteria와 evidence requirements.
* 준비 상태 결정: READY_FOR_EXECUTION, NEEDS_REWORK, HUMAN_DECISION_REQUIRED, BLOCKED_BY_RUNTIME_CAPABILITY.
* READY_FOR_EXECUTION일 때만 execution handoff package.

## Collaboration Model - English

The preferred collaboration mode is targeted 1:1 review with each responsible agent. If the runtime supports A2A 1:1 NATS messages, use that channel and record message IDs or evidence. If the runtime does not support it, use the current supported channel such as feature room notes, Confluence comments, or Jira task comments. Do not claim A2A/NATS review occurred without runtime evidence.

## 협업 모델 - 한국어

권장 협업 방식은 각 담당 에이전트와의 targeted 1:1 review다. runtime이 A2A 1:1 NATS message를 지원하면 해당 채널을 사용하고 message ID 또는 evidence를 기록한다. 지원하지 않는 경우 현재 지원되는 feature room note, Confluence comment, Jira task comment를 사용한다. runtime evidence 없이 A2A/NATS review가 수행되었다고 주장하지 않는다.

## Process - English

1. **Gather the planning package.** Collect PRD/brief, Jira work items, acceptance criteria, evidence requirements, constraints, non-goals, and decision log.
2. **Build the role review matrix.** Include only roles relevant to the plan. Typical roles are Product/Planning, Design/UX, Mobile Architecture, Backend/API, Mobile App Development, QA/Release, Security/Privacy, and Human Owner.
3. **Define review questions by role.** Each request must ask for missing information, SoT conflict, risk, blocked assumption, required evidence, and acceptance criteria changes.
4. **Send targeted review requests.** Use A2A 1:1 NATS only when supported by runtime; otherwise use feature room, Confluence, or Jira comment evidence.
5. **Collect responses and evidence.** Record who responded, channel, timestamp, and unresolved items. Silence is not approval unless the governing SoT defines an explicit timeout rule.
6. **Consolidate gaps.** Group findings into missing requirement, conflicting requirement, technical dependency, design dependency, release dependency, human decision, or runtime capability blocker.
7. **Update planning artifacts.** Apply only changes that are within the approved scope. Route unclear or scope-changing items back to mobile-requirement-office-hours or human decision.
8. **Validate handoff completeness.** Check that every execution task has owner, acceptance criteria, evidence requirement, dependency, platform scope, and rollback/release note when relevant.
9. **Decide readiness.** Choose exactly one readiness state. Do not start execution while critical gaps remain unresolved.
10. **Publish final review result.** Attach the matrix, gap list, readiness decision, and execution handoff or rework instructions to the SoT location.

## 프로세스 - 한국어

1. **planning package 수집.** PRD/brief, Jira work item, acceptance criteria, evidence requirements, constraints, non-goal, decision log를 수집한다.
2. **role review matrix 작성.** 계획에 관련된 역할만 포함한다. 일반적으로 Product/Planning, Design/UX, Mobile Architecture, Backend/API, Mobile App Development, QA/Release, Security/Privacy, Human Owner가 대상이다.
3. **역할별 검토 질문 정의.** 각 요청은 missing information, SoT conflict, risk, blocked assumption, required evidence, acceptance criteria 변경 필요 여부를 확인해야 한다.
4. **targeted review 요청 발송.** runtime이 지원할 때만 A2A 1:1 NATS를 사용한다. 그렇지 않으면 feature room, Confluence, Jira comment evidence를 사용한다.
5. **응답과 evidence 수집.** 응답자, 채널, timestamp, unresolved item을 기록한다. governing SoT에 명시된 timeout rule이 없다면 무응답은 승인이 아니다.
6. **gap 통합.** missing requirement, conflicting requirement, technical dependency, design dependency, release dependency, human decision, runtime capability blocker로 분류한다.
7. **planning artifact 업데이트.** 승인된 scope 안의 변경만 반영한다. 불명확하거나 scope-changing item은 mobile-requirement-office-hours 또는 human decision으로 되돌린다.
8. **handoff 완전성 검증.** 모든 execution task에 owner, acceptance criteria, evidence requirement, dependency, platform scope, 관련 시 rollback/release note가 있는지 확인한다.
9. **준비 상태 결정.** 정확히 하나의 readiness state를 선택한다. 핵심 gap이 남아 있으면 execution을 시작하지 않는다.
10. **최종 review result 발행.** matrix, gap list, readiness decision, execution handoff 또는 rework instruction을 SoT 위치에 첨부한다.

## Role Review Matrix

| Role | Review focus | Required response |
| --- | --- | --- |
| Product/Planning | Scope, priority, non-goal, acceptance criteria, human gate | Confirm plan matches clarified requirement and approved scope. |
| Design/UX | Screen states, interaction states, empty/error/loading states, accessibility implications | Confirm design readiness or list missing design decisions. |
| Mobile Architecture | Platform constraints, state management, offline/permission/deep-link risks, architectural fit | Confirm technical direction or list architecture decisions required. |
| Backend/API | API contract, data model, auth, error semantics, rate/latency constraints | Confirm API readiness or list contract gaps. |
| Mobile App Development | Implementation assumptions, dependencies, sequencing, platform-specific work split | Confirm task executability or list blockers. |
| QA/Release | Test evidence, release gates, regression scope, rollback notes | Confirm evidence plan or list missing verification requirements. |
| Security/Privacy | PII, payment, auth, permissions, policy-sensitive behavior | Confirm no extra gate is needed or require human/security decision. |
| Human Owner | Business, policy, irreversible scope, budget, production release decision | Approve, reject, or request rework. |

## Decision States

| State | Meaning | Next action |
| --- | --- | --- |
| READY_FOR_EXECUTION | The plan is complete enough and reviewer gaps are resolved or explicitly non-blocking. | Hand off to execution agents. |
| NEEDS_REWORK | The plan has gaps that Product/Planning can fix within approved scope. | Update planning artifacts and rerun focused review. |
| HUMAN_DECISION_REQUIRED | A business, policy, release, or irreversible tradeoff requires human decision. | Stop automatic execution and document decision needed. |
| BLOCKED_BY_RUNTIME_CAPABILITY | The required collaboration/evidence channel is not available and no acceptable fallback exists. | Report blocker and fallback options. |

## Required Checklist - English

- [ ] Planning package includes PRD/brief, work items, acceptance criteria, evidence requirements, constraints, and non-goals.
- [ ] Only relevant roles are included in the review matrix.
- [ ] Review evidence is recorded with channel and timestamp.
- [ ] Gaps are classified and assigned to owners.
- [ ] Scope-changing findings are routed to human decision or requirement office-hours.
- [ ] READY_FOR_EXECUTION is selected only after critical gaps are resolved.

## 필수 체크리스트 - 한국어

- [ ] planning package에 PRD/brief, work item, acceptance criteria, evidence requirements, constraints, non-goal이 포함되어 있다.
- [ ] review matrix에는 관련 역할만 포함되어 있다.
- [ ] review evidence가 channel과 timestamp와 함께 기록되어 있다.
- [ ] gap이 분류되고 owner가 지정되어 있다.
- [ ] scope-changing finding은 human decision 또는 requirement office-hours로 라우팅되어 있다.
- [ ] 핵심 gap이 해결된 후에만 READY_FOR_EXECUTION이 선택되어 있다.

## Forbidden - English

* Do not treat this skill as a replacement for mobile-prd-to-execution. It reviews the output; it does not perform the decomposition.
* Do not start execution when critical gaps, missing owners, missing acceptance criteria, or unresolved human gates remain.
* Do not claim A2A/NATS review without runtime support and evidence.
* Do not require every possible role to review every plan. Include only roles relevant to the scope and risk.
* Do not add speculative requirements, extra features, or architectural work outside the approved scope.
* Do not use feature room or chat content as final SoT unless it is linked back into the accepted SoT location.

## 금지 사항 - 한국어

* 이 skill을 mobile-prd-to-execution의 대체물로 취급하지 않는다. 이 skill은 분해 결과를 검토할 뿐 분해를 수행하지 않는다.
* 핵심 gap, missing owner, missing acceptance criteria, unresolved human gate가 남아 있으면 execution을 시작하지 않는다.
* runtime support와 evidence 없이 A2A/NATS review가 수행되었다고 주장하지 않는다.
* 모든 계획에 모든 역할의 검토를 요구하지 않는다. scope와 risk에 관련된 역할만 포함한다.
* 승인된 scope 밖의 speculative requirement, extra feature, architectural work를 추가하지 않는다.
* feature room 또는 chat content를 accepted SoT 위치에 연결하지 않은 상태로 최종 SoT로 사용하지 않는다.

## Output Template

```
Planning Completeness Review Result

Readiness: READY_FOR_EXECUTION | NEEDS_REWORK | HUMAN_DECISION_REQUIRED | BLOCKED_BY_RUNTIME_CAPABILITY
Planning Package:
- PRD/brief:
- Jira Epic/Story/Task set:
- Acceptance criteria:
- Evidence requirements:

Review Matrix:
- [Role] [Reviewer/channel/timestamp] [Response] [Gaps]

Gap List:
- [Category] [Description] [Owner] [Blocking? yes/no] [Resolution]

Updates Applied:
- ...

Execution Handoff when READY_FOR_EXECUTION:
- Scope:
- Work item links:
- Dependencies:
- Evidence:
- Human gates:
```

## Relation To Existing Skills

**mobile-prd-to-execution** produces the execution plan. This skill reviews that plan before execution starts. **mobile-requirement-office-hours** is used before decomposition or when the review discovers scope-changing uncertainty that requires clarification.