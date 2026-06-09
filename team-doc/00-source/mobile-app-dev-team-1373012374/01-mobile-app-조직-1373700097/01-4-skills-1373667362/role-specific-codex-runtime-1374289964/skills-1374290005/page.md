---
pageId: "1374290005"
sourceTitle: "Skills"
sourceVersion: "unknown"
sourceUrl: "https://wondermove-official.atlassian.net/wiki/spaces/mobileappd/pages/1374290005"
fetchedAt: "2026-06-09T03:41:15.000Z"
syncStatus: "synced"
---

| 항목 | 내용 |
| --- | --- |
| 목적 | 역할별 thin wrapper skills와 Case A\~H process coverage skills의 target runtime, 작성 규칙, 하위 페이지 구조를 정의한다. |
| Upstream | Role-specific Codex Runtime, 01-4. Skills, 01-3 Workflows, [SOUL.md](http://SOUL.md) role pages |
| Downstream | 하위 skill pages |

## 원칙

* 이 페이지의 skills는 MVP 5개 SoT skill을 대체하지 않는다.
* 반복 프로세스의 기준은 [SOUL.md](http://SOUL.md) role이 아니라 01-3 Case A\~H다.
* 기존 SoT skill이 Case를 이미 소유하면 신규 skill을 만들지 않고 해당 skill의 mode/checklist로 확장한다.
* 신규 skill은 기존 MVP skill로 닫히지 않는 반복 process gap이 있을 때만 만든다.
* Codex CLI native skill 경로는 `.agents/skills`이다.
* OpenClaw generated-agent skill package 경로는 pod 내부 `/workspace/skills`이다.
* 양쪽 runtime을 모두 지원하면 packaging/sync contract와 양쪽 eval이 필요하다.
* `mobile-gatekeeper`는 deterministic hard gate이며, 어떤 wrapper skill도 gatekeeper pass/fail을 대체하거나 재해석하지 않는다. Workflow skill은 gate result를 소비할 뿐 pass/fail 판정을 다시 정의하지 않는다.

## 작성 규칙

하위 skill page는 아래 구조를 유지한다.

| 섹션 | 필수 여부 | 내용 |
| --- | --- | --- |
| 목적 | 필수 | 어떤 반복 프로세스 gap을 닫는지 한 문단으로 설명 |
| 위치 | 필수 | organization-runtime, repo-scoped, dual package 중 하나 |
| 대상 [SOUL.md](http://SOUL.md)(role) | 필수 | 이 skill을 사용하는 role과 reviewer/downstream role을 명시 |
| Trigger phrases | 필수 | skill activation phrase 또는 Case 진입 조건 |
| 입력 | 필수 | 문서/Task/repo/evidence 입력 |
| 출력 | 필수 | skill이 남기는 산출물과 evidence |
| 동작 | 필수 | 순서화된 workflow |
| 금지 | 필수 | 권한 밖 작업, 자동화 금지, SoT 대체 금지 |
| Case coverage | 필수 | 연결되는 01-3 Case와 기존 MVP skill 관계 |
| Required tests/evals | 필수 | positive/negative/boundary/SoT eval |

## Case coverage policy

| Case | Coverage 방식 | 상세 page | 대상 [SOUL.md](http://SOUL.md)(role) |
| --- | --- | --- | --- |
| Case A bootstrap | 신규 process skill | `mobile-project-bootstrap-workflow` | Product/Planning, Mobile Architect, QA/Release, Mobile App Dev, 운영자(human) |
| Case B PRD decomposition | existing MVP skill | `mobile-prd-to-execution` | Product/Planning |
| Case C UI-only | existing MVP skill mode | `mobile-design-handoff` Case C mode | Design, Mobile Architect, Mobile App Dev, QA/Release |
| Case D API-backed | existing MVP skill mode | `mobile-api-contract` Case D mode | Design, Mobile Architect, Backend/API Integrator, Mobile App Dev, QA/Release |
| Case E Backend/API centered | existing wrapper + MVP skill | `mobile-backend-api-integrator-workflow`, `mobile-api-contract`, `mobile-qa-release` | Backend/API Integrator, Mobile Architect, Mobile App Dev, QA/Release |
| Case F QA/gate failure | existing MVP skill mode | `mobile-qa-release` Case F mode | QA/Release, 실패 task owner, Mobile Architect, Product/Planning/human owner |
| Case G preview/internal release | existing MVP skill mode | `mobile-qa-release` Case G mode | QA/Release, Product/Planning, Mobile Architect |
| Case H production submit | existing MVP skill mode | `mobile-qa-release` Case H mode | QA/Release, Product/Planning(human approval), Mobile Architect |
| Cross-cutting Done gate | deterministic gate. pass/fail 재해석 금지 | `mobile-gatekeeper` | Gatekeeper(non-LLM), 전 LLM role |

## 하위 skill

신규/Case coverage skill:

| Skill | 대상 [SOUL.md](http://SOUL.md)(role) | Case coverage | 위치 |
| --- | --- | --- | --- |
| `mobile-project-bootstrap-workflow` | Product/Planning, Mobile Architect, QA/Release, Mobile App Dev, 운영자(human) | Case A | organization-runtime skill pack |

기존 role runtime wrappers:

| Skill | 대상 [SOUL.md](http://SOUL.md)(role) | Case coverage | 상세 page |
| --- | --- | --- | --- |
| `mobile-app-dev-workflow` | Mobile App Dev; Mobile Architect reviewer; QA/Release downstream | Case C, D 구현 단계 | Role-specific Codex Runtime / Skills / mobile-app-dev-workflow |
| `mobile-backend-api-integrator-workflow` | Backend/API Integrator; Mobile Architect co-reviewer; Mobile App Dev downstream | Case D, E backend/API 단계 | Role-specific Codex Runtime / Skills / mobile-backend-api-integrator-workflow |

기존 MVP skill 확장 대상(01-4 하위 원본 page가 SoT):

| Skill | 확장 mode | 대상 [SOUL.md](http://SOUL.md)(role) |
| --- | --- | --- |
| `mobile-design-handoff` | Case C mode | Design, Mobile Architect, Mobile App Dev, QA/Release |
| `mobile-api-contract` | Case D reference-only checklist | Mobile Architect, Backend/API Integrator, Mobile App Dev |
| `mobile-qa-release` | Case F/G/H modes | QA/Release, Product/Planning, Mobile Architect, 실패 task owner |

## 금지되는 구조

* `mobile-product-planning-workflow`, `mobile-design-workflow`, `mobile-architect-workflow`를 standalone role wrapper로 만들지 않는다.
* `mobile-ui-only-feature-workflow`, `mobile-api-backed-feature-workflow`, `mobile-failure-rework-workflow`, `mobile-production-submit-governance`를 신규 skill로 만들지 않는다.
* production submit을 자동 승인하거나 `build-and-submit.yml`을 자동 트리거하는 skill을 만들지 않는다.
