---
pageId: "1374519364"
sourceTitle: "mobile-requirement-office-hours"
sourceVersion: "unknown"
sourceUrl: "https://wondermove-official.atlassian.net/wiki/spaces/mobileappd/pages/1374519364"
fetchedAt: "2026-06-09T03:41:15.000Z"
syncStatus: "synced"
---

# mobile-requirement-office-hours

**Scope:** Product/Planning operational skill for mobile app development. This skill clarifies ambiguous or incomplete requirements before PRD decomposition. It is adapted to our SOUL.md/Confluence/Jira workflow and does not copy, install, or vendor gstack.

## Metadata

| Field | Value |
| --- | --- |
| Skill name | mobile-requirement-office-hours |
| Owner SOUL.md | Product/Planning main agent |
| Runtime location | organization-runtime skill pack for generated Product/Planning agents |
| Use case | Case B: repeated pre-planning clarification gap that cannot be fully represented as fixed workflow branches |
| Upstream | User request, rough idea, partial PRD, Confluence brief, Jira request, or feature room note |
| Downstream | mobile-prd-to-execution when ready; user/human gate when not ready |
| Source of inspiration | gstack office-hours pattern as comparative prior art only: [gstack repository](https://github.com/garrytan/gstack) |
| Created date | <custom data-type="date" data-id="id-0">6/7/2026</custom> |

## Purpose - English

This skill gives the Product/Planning agent a concrete process for handling user requirements that are not yet specific enough for PRD decomposition. The goal is not to expand scope. The goal is to separate facts from assumptions, classify the request, identify missing decisions, run an office-hour style clarification loop, and produce a clear readiness decision.

## 목적 - 한국어

이 skill은 Product/Planning 에이전트가 아직 PRD 분해에 충분히 구체적이지 않은 사용자 요구사항을 처리하기 위한 기준 프로세스다. 목적은 범위 확장이 아니라 사실과 가정을 분리하고, 요청 성격을 분류하고, 누락된 결정을 식별하고, office-hour 방식의 구체화 루프를 거쳐 명확한 준비 상태를 결정하는 것이다.

## When To Use - English

* The user provides an idea, request, or feature direction that lacks target user, scenario, constraints, acceptance signal, or priority.
* A PRD exists but the Product/Planning agent cannot determine the PRD type, mobile risk, platform scope, API dependency, release impact, or human approval requirement.
* The request may require human decision, business prioritization, design direction, policy/legal decision, or cross-agent discussion before task generation.
* The workflow has no predefined branch for the event, but Product/Planning still must collaborate with other agents to move the work forward.

## 사용 시점 - 한국어

* 사용자가 전달한 아이디어, 요청, 기능 방향에 대상 사용자, 시나리오, 제약, 수용 기준, 우선순위가 부족한 경우.
* PRD가 있어도 Product/Planning 에이전트가 PRD 성격, 모바일 리스크, 플랫폼 범위, API 의존성, 릴리스 영향, human approval 필요 여부를 판정할 수 없는 경우.
* 작업 생성 전에 비즈니스 우선순위, 디자인 방향, 정책/법무 판단, 담당 에이전트 간 논의가 필요한 경우.
* 특정 이벤트에 대해 선택 가능한 고정 workflow가 없지만 Product/Planning이 협업을 통해 다음 상태로 진행해야 하는 경우.

## Inputs - English

* User request or rough product idea.
* Existing PRD, Confluence page, Jira issue, feature room note, or decision log if available.
* Known mobile platforms, target users, business constraints, release constraints, and non-goals.
* Known backend/API/data dependencies and any existing architecture or design SoT.
* Current SOUL.md standards and mobile app development SoT pages.

## 입력 - 한국어

* 사용자 요청 또는 거친 제품 아이디어.
* 존재하는 PRD, Confluence 페이지, Jira 이슈, feature room note, decision log.
* 알려진 모바일 플랫폼, 대상 사용자, 비즈니스 제약, 릴리스 제약, non-goal.
* 알려진 backend/API/data 의존성과 기존 architecture/design SoT.
* 현재 SOUL.md 기준과 mobile app development SoT 페이지.

## Outputs - English

* Clarified requirement brief with facts, assumptions, unknowns, constraints, and non-goals.
* Request classification: idea, new feature, feature change, bug fix, UX/design, API-backed feature, release/compliance work, or unclear.
* Risk classification: low, medium, high, or human-gate-required.
* Bundled clarification questions and office-hour notes.
* Readiness decision: READY_FOR_PRD_DECOMPOSITION, NEEDS_USER_CLARIFICATION, OUT_OF_SCOPE, or HUMAN_GATE_REQUIRED.
* Handoff package for mobile-prd-to-execution when ready.

## 산출물 - 한국어

* 사실, 가정, 미확인 항목, 제약, non-goal이 분리된 요구사항 brief.
* 요청 분류: 아이디어, 신규 기능, 기능 변경, 버그 수정, UX/design, API 의존 기능, 릴리스/컴플라이언스 작업, 불명확.
* 리스크 분류: low, medium, high, human-gate-required.
* 묶음 질문 목록과 office-hour 기록.
* 준비 상태 결정: READY_FOR_PRD_DECOMPOSITION, NEEDS_USER_CLARIFICATION, OUT_OF_SCOPE, HUMAN_GATE_REQUIRED.
* 준비 완료 시 mobile-prd-to-execution으로 전달할 handoff package.

## Process - English

1. **Load the SoT.** Read the current request and relevant Confluence/Jira/design/API references. Separate facts, assumptions, and unknowns before making any decision.
2. **Classify the request.** Assign one primary type and any secondary type. If type cannot be assigned, mark it as unclear and continue with clarification, not decomposition.
3. **Check demand and status quo.** Identify who has the problem, what they do today, why this matters now, and what risk exists if no work is done.
4. **Find the narrow useful scope.** Define the smallest product outcome that can be evaluated. Capture target user, primary scenario, platform scope, and acceptance signal.
5. **Map mobile-specific risk.** Check iOS/Android scope, offline state, permissions, push/local notification, deep link, payment, auth, privacy, localization, accessibility, analytics, API dependency, and release gate impact only when relevant.
6. **Bundle questions.** Ask one consolidated question set instead of many fragmented interruptions. Questions must target decisions that block PRD completeness.
7. **Run office-hour clarification.** Record answers, unresolved decisions, owner, and due date. If another agent owns an answer, request that input through the supported collaboration channel.
8. **Flag human gates.** If the request requires business approval, compliance/legal approval, payment/policy decision, production release decision, or irreversible scope tradeoff, stop automatic progression and mark HUMAN_GATE_REQUIRED.
9. **Decide readiness.** Choose exactly one readiness state. Do not proceed to PRD decomposition while critical unknowns remain.
10. **Publish handoff.** When ready, hand off the clarified brief, classification, risks, non-goals, and open minor assumptions to mobile-prd-to-execution.

## 프로세스 - 한국어

1. **SoT 로드.** 현재 요청과 관련 Confluence/Jira/design/API 기준을 확인한다. 판단 전에 사실, 가정, 미확인 항목을 분리한다.
2. **요청 분류.** 주 분류와 보조 분류를 지정한다. 분류가 불가능하면 분해를 시작하지 않고 unclear로 표시한 뒤 구체화를 진행한다.
3. **수요와 현 상태 확인.** 누가 문제를 겪는지, 현재 우회 방법은 무엇인지, 왜 지금 필요한지, 하지 않을 때의 리스크가 무엇인지 확인한다.
4. **가장 작은 유효 범위 정의.** 평가 가능한 최소 제품 결과를 정의한다. 대상 사용자, 주요 시나리오, 플랫폼 범위, 수용 신호를 기록한다.
5. **모바일 특화 리스크 매핑.** 관련이 있을 때만 iOS/Android 범위, offline state, permission, push/local notification, deep link, payment, auth, privacy, localization, accessibility, analytics, API dependency, release gate 영향을 확인한다.
6. **질문 묶음 생성.** 여러 번 끊어 묻지 않고 하나의 통합 질문 세트를 만든다. 질문은 PRD 완전성을 막는 결정에 집중해야 한다.
7. **office-hour 구체화 진행.** 답변, 미해결 결정, 담당자, 기한을 기록한다. 다른 에이전트가 답을 소유하면 지원되는 협업 채널로 입력을 요청한다.
8. **human gate 표시.** 비즈니스 승인, 컴플라이언스/법무 승인, 결제/정책 결정, production release 결정, 되돌리기 어려운 scope tradeoff가 필요하면 자동 진행을 멈추고 HUMAN_GATE_REQUIRED로 표시한다.
9. **준비 상태 결정.** 정확히 하나의 readiness state를 선택한다. 핵심 미확인 항목이 남아 있으면 PRD 분해로 진행하지 않는다.
10. **handoff 발행.** 준비 완료 시 명확화된 brief, 분류, 리스크, non-goal, 사소한 open assumption을 mobile-prd-to-execution에 전달한다.

## Decision States

| State | Meaning | Next action |
| --- | --- | --- |
| READY_FOR_PRD_DECOMPOSITION | Critical facts are known and remaining assumptions are minor. | Run mobile-prd-to-execution. |
| NEEDS_USER_CLARIFICATION | One or more critical decisions are missing. | Ask bundled questions and wait for answer. |
| OUT_OF_SCOPE | The request conflicts with current SoT, project scope, or mobile app boundary. | Report reason and required decision to reopen. |
| HUMAN_GATE_REQUIRED | A human approval or business/policy decision is required. | Stop automatic progression and document the gate. |

## Required Checklist - English

- [ ] Facts, assumptions, and unknowns are separated.
- [ ] Request type and mobile risk are classified.
- [ ] Target user, primary scenario, scope, and acceptance signal are recorded or explicitly blocked.
- [ ] Clarification questions are bundled and decision-oriented.
- [ ] Human gates are flagged before downstream execution.
- [ ] Handoff to mobile-prd-to-execution is present only when READY_FOR_PRD_DECOMPOSITION is selected.

## 필수 체크리스트 - 한국어

- [ ] 사실, 가정, 미확인 항목이 분리되어 있다.
- [ ] 요청 유형과 모바일 리스크가 분류되어 있다.
- [ ] 대상 사용자, 주요 시나리오, 범위, 수용 신호가 기록되어 있거나 명시적으로 blocked 처리되어 있다.
- [ ] 구체화 질문이 decision-oriented 방식으로 묶여 있다.
- [ ] downstream 실행 전에 human gate가 표시되어 있다.
- [ ] READY_FOR_PRD_DECOMPOSITION일 때만 mobile-prd-to-execution handoff가 존재한다.

## Forbidden - English

* Do not copy gstack text, scripts, templates, or repository contents into this workflow. Use it only as comparative prior art.
* Do not expand scope by guessing what the user probably wants.
* Do not bypass human gates or mark them as minor assumptions.
* Do not create Jira implementation tasks from an unclear request.
* Do not replace mobile-prd-to-execution. This skill prepares its input; it does not perform decomposition.
* Do not claim A2A/NATS collaboration happened unless the runtime actually supports it and evidence exists.

## 금지 사항 - 한국어

* gstack의 텍스트, 스크립트, 템플릿, 저장소 내용을 복사하지 않는다. 비교 참고 기준으로만 사용한다.
* 사용자가 원할 것이라고 추정해서 범위를 확장하지 않는다.
* human gate를 우회하거나 사소한 가정으로 취급하지 않는다.
* 불명확한 요청에서 Jira 구현 task를 생성하지 않는다.
* mobile-prd-to-execution을 대체하지 않는다. 이 skill은 그 입력을 준비할 뿐 분해를 수행하지 않는다.
* runtime이 실제로 지원하고 증거가 있는 경우가 아니라면 A2A/NATS 협업이 수행되었다고 주장하지 않는다.

## Output Template

```
Requirement Office-Hours Result

Readiness: READY_FOR_PRD_DECOMPOSITION | NEEDS_USER_CLARIFICATION | OUT_OF_SCOPE | HUMAN_GATE_REQUIRED
Request Type: idea | new-feature | feature-change | bug-fix | ux-design | api-backed | release-compliance | unclear
Mobile Risk: low | medium | high | human-gate-required

Facts:
- ...

Assumptions:
- ...

Unknowns / Open Decisions:
- [Owner] [Decision needed] [Due or trigger]

Clarification Questions:
1. ...
2. ...

Non-goals:
- ...

Handoff to mobile-prd-to-execution:
- PRD/brief link:
- Scope:
- Acceptance signal:
- Human gates:
- Evidence requirements:
```

## Relation To Existing Skills

**mobile-prd-to-execution** remains the downstream decomposition skill. This skill only decides whether the requirement is ready enough to enter that decomposition path. If the requirement is not ready, this skill produces the blocker, owner, and next decision instead of creating implementation work.