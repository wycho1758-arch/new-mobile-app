---
pageId: "1373667404"
sourceTitle: "mobile-qa-release"
sourceVersion: "unknown"
sourceUrl: "https://wondermove-official.atlassian.net/wiki/spaces/mobileappd/pages/1373667404"
fetchedAt: "2026-06-09T03:41:15.000Z"
syncStatus: "synced"
---

| 항목 | 내용 |
| --- | --- |
| 목적 | Maestro QA와 EAS Build/Update/Submit 운영을 하나의 release workflow로 관리합니다. |
| Upstream | 01-4 |
| Downstream | 01-3 Case C·D·E·F·G·H |
| 관련 DEC-ID | 없음 |
| 출처 | 운영계획 §3.1 #4 + 01-4 Case coverage registry + 01-3 정합성 조사 GAP-16 |

## mobile-qa-release

### 목적

* Maestro QA와 EAS Build/Update/Submit 운영을 하나의 release workflow로 관리합니다.
* QA/Release agent가 사용하는 skill입니다.
* Case F/G/H에서는 이 skill의 mode/checklist로 failure/rework, preview/internal release, production submit governance를 정리합니다.

주: Case A(신규 프로젝트 bootstrap)의 release 레이어(eas.json/.eas/workflows/.maestro, gatekeeper 레이어, .evidence 규약)는 이 skill이 아니라 신규 repo 운영 레이어(01-7 Phase 3 산출물)가 템플릿으로 제공합니다. 이 skill은 그 레이어 위에서 동작하며 자기 부트스트랩하지 않습니다. Case E의 "QA/Release E2E smoke"는 이 skill의 동작 2(Maestro flow 실행)를 사용합니다 (01-3 정합성 조사 GAP-01·GAP-17).

### 위치

```plaintext
new-mobile-app repo skill pack
```

### 대상 [SOUL.md](http://SOUL.md)(role)

| Role | 사용 방식 |
| --- | --- |
| QA/Release | 주 사용 role. EAS/Maestro/evidence/release workflow를 운영한다. |
| Product/Planning | Case G scope/acceptance 확인, Case H human approval과 risk decision에 참여한다. |
| Mobile Architect | EAS profile strategy, release risk, rollback/update plan을 확인한다. |
| Mobile App Dev | 실패 task owner 또는 release fix owner로 참여할 수 있다. |
| Backend/API Integrator | API-backed failure 또는 backend/API 영향이 있는 release issue에 참여한다. |
| Gatekeeper(non-LLM) | deterministic required check를 수행한다. 이 skill이 gatekeeper pass/fail을 재해석하지 않는다. |

### 입력

* PR URL
* task id
* EAS profile
* Maestro flow path
* target platform
* release scope: preview, internal, production-submit
* evidence path
* 실패 run이 있는 경우 failure output

### 출력

* EAS workflow run id
* EAS build id
* Maestro result
* release evidence JSON
* failure report
* failure/rework classification
* release note
* production submit approval record reference(값이 아니라 링크/상태)
* store status 기록
* rollback/update plan

### 동작

1. PR 또는 branch 기준으로 EAS preview/internal build를 실행합니다. EAS 명령은 `apps/mobile`에서 실행합니다(`.eas`와 `eas.json`은 같은 레벨).
2. Maestro smoke 또는 critical path flow를 EAS Workflows의 maestro job(Confluence §7 `e2e-test` profile + build→maestro 배선)으로 실행합니다.
3. EAS workflow run id, build id, Maestro 결과를 `.evidence/<task-id>.json`에 기록합니다. 이 evidence 기록이 EAS 클라우드 실행 결과와 GitHub required check를 잇는 유일한 브리지입니다.
4. 실패 시 원인 분류를 room과 PR에 보고합니다.
5. production submit은 human approval 없이는 진행하지 않습니다.
6. Case F/G/H에 해당하면 아래 mode checklist를 실행합니다.

### Case F failure/rework mode

| Check | Owner role | Done condition |
| --- | --- | --- |
| failure report | QA/Release | Gatekeeper 또는 Maestro failure가 room/PR/evidence에 기록됨 |
| failure classification | QA/Release + 실패 task owner | 원인이 `implementation`, `contract`, `test`, `environment`, `scope` 중 하나로 분류됨 |
| rework_count | QA/Release | `rework_count`가 증가했고 cap 미만 여부가 기록됨 |
| owner routing | QA/Release + Mobile Architect | owner agent 또는 responsible role이 지정됨 |
| cap stop | Product/Planning 또는 human owner | cap 도달 시 자동 재시도를 중지하고 cut/retry/reassign/accept risk decision을 요청함 |
| failure honesty | QA/Release + Gatekeeper | 실패한 Maestro/gatekeeper 결과를 pass로 재라벨하지 않음 |

### Case G preview/internal release mode

| Check | Owner role | Done condition |
| --- | --- | --- |
| EAS build | QA/Release | EAS build id와 workflow run id가 존재함 |
| Maestro critical path | QA/Release | Maestro smoke 또는 critical path 결과가 evidence에 기록됨 |
| release note | QA/Release | install/test 방법과 release note가 room 또는 문서 SoT에 연결됨 |
| scope/acceptance confirmation | Product/Planning | release scope와 PRD acceptance가 확인됨 |
| EAS strategy confirmation | Mobile Architect | preview/internal profile 전략이 확인됨 |
| Gatekeeper consistency | Gatekeeper(non-LLM) | PR/SHA/EAS/Maestro/evidence 일관성이 required check로 확인됨 |

### Case H production-submit mode

| Check | Owner role | Done condition |
| --- | --- | --- |
| release candidate evidence | QA/Release | EAS/Maestro/evidence가 production candidate로 연결됨 |
| security/privacy/store policy checklist | QA/Release + Product/Planning + Mobile Architect | 결제/PII/외부 발송/법무/스토어 정책 점검이 기록됨 |
| recorded human approval | Product/Planning / human owner | human approval record가 존재함 |
| submit execution | QA/Release | human approval 이후에만 EAS Submit을 수동 실행함 |
| store status | QA/Release | 제출 후 store 심사 status가 기록됨 |
| rollback/update plan | Product/Planning + Mobile Architect | release risk와 rollback/update owner가 기록됨 |

### Case coverage

| Case | Coverage |
| --- | --- |
| Case C UI-only | Maestro/evidence 기록을 담당한다. screen spec은 `mobile-design-handoff`가 소유한다. |
| Case D API-backed | contract 기반 Maestro/evidence 기록을 담당한다. API contract는 `mobile-api-contract`가 소유한다. |
| Case E Backend/API centered | E2E smoke와 mobile integration evidence를 담당한다. |
| Case F QA/gate failure | failure/rework mode로 GAP-16의 failure-honest/rework 누락을 닫는다. |
| Case G Preview/Internal release | preview/internal release mode로 처리한다. |
| Case H Production submit | production-submit mode로 처리하되 human approval 전 submit을 금지한다. |

### 금지

* EAS production submit을 자동 승인하지 않습니다.
* `build-and-submit.yml`을 human approval 없이 자동 트리거하지 않습니다.
* Maestro 실패를 LLM 판단으로 pass 처리하지 않습니다.
* Gatekeeper required check 실패를 이 skill이 재해석하거나 우회하지 않습니다.
* store submit, payment, PII, external messaging, legal/terms, accept-risk-after-gate-failure를 human gate 없이 진행하지 않습니다.
* Case A release layer를 이 skill이 self-bootstrap한다고 주장하지 않습니다.

### Required tests/evals

| Eval | 기대 결과 |
| --- | --- |
| Positive eval | preview/internal release 입력이 주어지면 EAS/Maestro/evidence/release note를 생성한다. |
| Failure eval | Maestro 또는 gatekeeper 실패가 주어지면 failure classification, rework_count, owner routing, cap stop 여부를 기록한다. |
| Production boundary eval | human approval이 없으면 production submit을 중지한다. |
| Gatekeeper eval | required check 실패를 pass로 재라벨하지 않는다. |
| SoT eval | Case F/G/H 완료 조건과 `01-3`, `01-4` Case coverage registry가 일치한다. |
