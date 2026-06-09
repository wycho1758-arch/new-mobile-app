---
pageId: "1373765661"
sourceTitle: "mobile-design-handoff"
sourceVersion: "unknown"
sourceUrl: "https://wondermove-official.atlassian.net/wiki/spaces/mobileappd/pages/1373765661"
fetchedAt: "2026-06-09T03:41:15.000Z"
syncStatus: "synced"
---

| 항목 | 내용 |
| --- | --- |
| 목적 | PRD/Story를 화면 흐름, screen spec, UX acceptance로 바꿉니다. |
| Upstream | 01-4 |
| Downstream | 01-3 Case B(분해 검토 전제)·C·D |
| 관련 DEC-ID | DEC-021 |
| 출처 | 운영계획 §3.1 #2 + Stitch 공식 문서(ZIP export·MCP) + 01-4 Case coverage registry |

## mobile-design-handoff

### 목적

* PRD/Story를 화면 흐름, screen spec, UX acceptance로 바꿉니다.
* Stitch 산출물([DESIGN.md](http://DESIGN.md)·HTML export 포함)을 agent들이 구현 가능한 계약으로 정리합니다. 디자인 저작 도구는 Stitch로 한정합니다 (DEC-021).
* Case C UI-only feature에서는 별도 신규 skill을 만들지 않고, 이 skill의 Case C mode/checklist로 screen spec, route/state 영향 확인, QA evidence handoff를 정리합니다.

### 위치

```plaintext
organization-runtime skill pack
```

### 대상 [SOUL.md](http://SOUL.md)(role)

| Role | 사용 방식 |
| --- | --- |
| Design | 주 사용 role. screen flow, state matrix, Stitch link, HTML extract, UX acceptance를 작성한다. |
| Mobile Architect | route/state impact reviewer. app-wide navigation/state 변경 여부를 확인한다. |
| Mobile App Dev | downstream implementer. handoff를 구현 가능한 입력으로 사용한다. |
| QA/Release | UX acceptance를 Maestro flow와 `.evidence/<task-id>.json`로 연결한다. |
| Product/Planning | 비소유자(escalation-only). PRD scope 또는 acceptance 변경이 필요한 경우에만 escalation 대상이다. |

### 입력

* PRD
* Jira Story
* repo root `DESIGN.md`(디자인 시스템 SoT) — 기존 design system 또는 brand guide가 있으면 함께
* Stitch project 링크
* target device class
* Case C 여부(UI-only, backend/API 변경 없음)
* Mobile Architect route/state constraint가 있으면 함께

### 출력

* screen flow
* route/screen inventory
* state별 UI spec
* default/loading/empty/error/permission denied state matrix
* accessibility notes
* HTML 퍼블리싱 — Stitch 디자인의 HTML 추출본(공식 ZIP export `code.html` 또는 Stitch MCP fetch)
* `DESIGN.md` 갱신분 — 디자인 결정이 token·component·layout 규칙을 바꾼 경우
* UX acceptance checklist
* 구현 handoff link
* QA/Release evidence handoff note

### 동작

1. user journey를 screen 단위로 분해합니다.
2. 화면별 data dependency와 action을 표시합니다.
3. Mobile Architect와 API contract 충돌 여부를 확인합니다.
4. Stitch 디자인을 HTML로 추출(공식 ZIP export `code.html` 또는 Stitch MCP fetch)하여 HTML 버전 퍼블리싱을 handoff에 포함합니다.
5. Mobile Dev가 구현할 수 있도록 acceptance를 정리합니다.
6. Case C UI-only인 경우 아래 Case C mode checklist를 실행합니다.

### Case C UI-only mode checklist

| Check | Owner role | Done condition |
| --- | --- | --- |
| UI-only scope 확인 | Design + Mobile Architect | backend/API contract 변경이 필요 없다는 판단이 기록됨 |
| 5-state completeness | Design | 모든 screen에 default/loading/empty/error/permission denied state가 있음 |
| route/state impact | Mobile Architect | app-wide navigation/state 변경이 없거나 ADR/risk note가 작성됨 |
| UX acceptance | Design + QA/Release | QA/Release가 Maestro smoke/targeted flow로 옮길 수 있는 observable acceptance가 있음 |
| implementation handoff | Design → Mobile App Dev | screen inventory, state matrix, Stitch link, HTML extract가 feature room 또는 Task에 연결됨 |
| evidence handoff | QA/Release | `mobile-qa-release`가 EAS/Maestro evidence를 기록할 수 있는 task id와 acceptance가 있음 |

### Case coverage

| Case | Coverage |
| --- | --- |
| Case B PRD 분해 검토 전제 | Design이 PRD/Story에서 screen flow와 UX acceptance를 검토한다. |
| Case C UI-only feature | primary mode. 신규 `mobile-ui-only-feature-workflow`를 만들지 않고 이 checklist로 처리한다. |
| Case D API-backed feature | screen/state handoff를 제공하되 API contract 고정은 `mobile-api-contract`가 소유한다. |

### 금지

* 구현 세부 API를 임의로 확정하지 않습니다.
* app store production asset까지 한 번에 요구하지 않습니다.
* Case C mode가 backend/API contract 또는 QA release evidence 책임을 흡수하지 않습니다.
* Stitch 외의 design authoring tool을 기본 채택하지 않습니다.
* PRD scope 밖 장식 작업을 Product/Planning 승인 없이 추가하지 않습니다.

### Required tests/evals

| Eval | 기대 결과 |
| --- | --- |
| Positive eval | UI-only Story가 주어지면 screen inventory, 5-state matrix, UX acceptance, evidence handoff가 생성된다. |
| Negative eval | API 변경이 필요한 Story를 Case C로 처리하지 않고 `mobile-api-contract`로 handoff한다. |
| Boundary eval | Stitch link 또는 HTML extract가 없으면 Done을 주장하지 않는다. |
| Scope eval | PRD에 없는 장식/확장 요청은 Product/Planning으로 escalation한다. |
| SoT eval | Case C reviewer role과 Design/Mobile Architect/QA handoff가 01-3 완료 조건과 일치한다. |
