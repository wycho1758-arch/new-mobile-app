---
pageId: "1373765723"
sourceTitle: "mobile-api-contract"
sourceVersion: "unknown"
sourceUrl: "https://wondermove-official.atlassian.net/wiki/spaces/mobileappd/pages/1373765723"
fetchedAt: "2026-06-09T03:41:15.000Z"
syncStatus: "synced"
---

| 항목 | 내용 |
| --- | --- |
| 목적 | Mobile App Dev와 Backend/API Integrator 사이의 계약을 고정합니다. |
| Upstream | 01-4 |
| Downstream | 01-3 Case D·E |
| 관련 DEC-ID | DEC-003 |
| 출처 | 운영계획 §3.1 #3 + 01-4 Case coverage registry |

## mobile-api-contract

### 목적

* Mobile App Dev와 Backend/API Integrator 사이의 계약을 고정합니다.
* Backend/API Integrator를 분리 운영하기 위한 핵심 skill입니다.
* Case D API-backed feature에서는 별도 신규 skill을 만들지 않고, 이 skill의 Case D reference-only checklist로 contract 전후의 owner/gate/reference를 정렬합니다.

### 위치

```plaintext
new-mobile-app repo skill pack
```

### 대상 [SOUL.md](http://SOUL.md)(role)

| Role | 사용 방식 |
| --- | --- |
| Mobile Architect | contract co-owner. route/state/API boundary와 app-wide impact를 검토한다. |
| Backend/API Integrator | backend/API contract, auth/token/tenant/payment 영향, backend task split을 검토한다. |
| Mobile App Dev | contract consumer. mock/real API 기준으로 구현한다. |
| Design | screen/state handoff를 제공하고, implementation이 screen spec과 맞는지 검토한다. |
| QA/Release | contract 기반 Maestro flow와 evidence를 준비한다. |
| Product/Planning | 비소유자(escalation-only). Case B에서 task/API 필요 여부를 표시하며, Case D 실행 절차의 직접 owner는 아니다. scope/acceptance 변경이 필요하면 escalation 대상이다. |

### 입력

* Story/Task
* screen flow
* auth/session 요구
* existing backend docs
* mock 필요 여부
* Design handoff link
* backend 변경 필요 여부

### 출력

* API contract markdown 또는 OpenAPI fragment
* request/response schema
* error code mapping
* auth/token handling rule
* mock fixture
* integration test expectation
* Case D owner/gate/reference checklist
* mock-vs-real delta note

### 동작

1. mobile screen이 필요한 data/action을 수집합니다.
2. backend가 이미 있으면 contract를 검증합니다.
3. backend 변경이 필요하면 Backend/API task를 따로 만듭니다.
4. Mobile Dev가 mock으로 진행 가능한 범위를 표시합니다.
5. contract 변경은 room에 공지하고 task evidence에 남깁니다.
6. Case D API-backed feature인 경우 아래 Case D reference-only checklist를 실행합니다.

### Case D reference-only orchestration checklist

이 checklist는 순서와 owner/gate를 정렬하기 위한 reference-only checklist입니다. 다른 skill의 실행 책임을 흡수하지 않습니다.

| Check | Owner role / owner skill | Done condition |
| --- | --- | --- |
| Design handoff 존재 | Design / `mobile-design-handoff` | screen flow, state matrix, UX acceptance가 연결됨 |
| API contract 고정 | Mobile Architect + Backend/API Integrator / `mobile-api-contract` | contract markdown 또는 OpenAPI fragment가 존재함 |
| backend 변경 split | Backend/API Integrator / `mobile-backend-api-integrator-workflow` | backend 변경 필요 여부와 별도 task/PR 여부가 기록됨 |
| mock-vs-real delta | Backend/API Integrator + Mobile App Dev | mock과 real API 차이가 evidence 또는 contract note에 기록됨 |
| mobile/backend PR link | Mobile App Dev + Backend/API Integrator | 관련 PR 또는 task가 서로 링크됨 |
| auth/token/tenant/payment 영향 | Backend/API Integrator + Mobile Architect | 영향 검토 결과가 기록됨. human gate 대상이면 Product/Planning/human으로 escalation됨 |
| implementation handoff | Mobile App Dev / `mobile-app-dev-workflow` | contract 기반 구현과 테스트 계획이 연결됨 |
| QA evidence handoff | QA/Release / `mobile-qa-release` | Maestro flow와 `.evidence/<task-id>.json` 기록 계획이 있음 |
| Gatekeeper readiness | Gatekeeper / `mobile-gatekeeper` | PR/SHA/EAS/Maestro/evidence required check 준비가 확인됨 |

### Case coverage

| Case | Coverage |
| --- | --- |
| Case D API-backed feature | primary mode. contract와 reference-only orchestration checklist를 제공한다. |
| Case E Backend/API 변경 중심 작업 | backend/API contract 변경과 mobile integration evidence의 기준이 된다. |

### 금지

* Mobile Dev가 backend auth/payment/tenant 정책을 임의로 바꾸지 않습니다.
* Backend/API Integrator가 모바일 UX 결정을 임의로 바꾸지 않습니다.
* Case D checklist가 `mobile-design-handoff`, `mobile-app-dev-workflow`, `mobile-backend-api-integrator-workflow`, `mobile-qa-release`의 실행 책임을 흡수하지 않습니다.
* API contract가 모호한 상태에서 구현을 진행하라고 승인하지 않습니다.
* 결제/PII/외부 발송/법무/위험 수용에 해당하는 변경을 human gate 없이 진행하지 않습니다.

### Required tests/evals

| Eval | 기대 결과 |
| --- | --- |
| Positive eval | API-backed Story가 주어지면 contract, owner/gate checklist, mock-vs-real delta, QA handoff가 생성된다. |
| Negative eval | Design handoff 또는 backend impact가 없으면 누락 입력으로 멈추고 추정하지 않는다. |
| Boundary eval | 다른 skill의 실행 책임을 이 skill이 직접 수행한다고 주장하지 않는다. |
| Security eval | auth/token/tenant/payment 영향이 있으면 Backend/API Integrator와 Mobile Architect 검토를 요구한다. |
| SoT eval | Case D 완료 조건(API contract, linked PRs, mock/real delta, Maestro, author≠approver, screen spec 검토)과 매핑된다. |
