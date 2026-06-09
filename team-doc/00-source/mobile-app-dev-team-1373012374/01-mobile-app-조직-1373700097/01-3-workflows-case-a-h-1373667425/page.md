---
pageId: "1373667425"
sourceTitle: "01-3. Workflows — Case A~H"
sourceVersion: "2"
sourceUrl: "https://wondermove-official.atlassian.net/wiki/spaces/mobileappd/pages/1373667425"
fetchedAt: "2026-06-09T03:41:15.000Z"
syncStatus: "synced"
---

| 목적 | 조직이 처리하는 8가지 케이스별 agent workflow(참여·절차·완료 조건)를 정의한다. |
| --- | --- |
| Upstream | 01-2, 01-4 (각 케이스가 skill을 사용) |
|  |  |
| Downstream | 01-7 |
|  |  |
| 관련 DEC-ID | DEC-005, DEC-009 |
|  |  |
| 출처 | 운영계획 §4 (2026-06-06 [SOUL.md](http://SOUL.md) 표준화 후 정합성 조사 반영 — 검증 근거는 01-9 하위 페이지) |
|  |  |

## 4. Case별 Agent Workflow

### Case A. 신규 프로젝트 bootstrap

목표:

* Confluence 설계안 기준 모노레포 템플릿으로 신규 mobile repo를 생성하고, 그 위에 조직 운영 레이어(gatekeeper, evidence, repo-scoped skills, PR template)를 추가해 실행 가능한 repo로 만듭니다.

참여:

* Product/Planning
* Mobile Architect
* QA/Release
* Mobile App Dev
* 운영자(human) — repo 생성·required check 등록 등 agent 운영 표면 밖 작업

절차:

1. Product/Planning이 repo 목적과 initial scope·non-goal을 확정하고 scope decision log에 기록합니다. 운영자(human)가 신규 mobile repo를 생성하고 Confluence 설계안 §3의 템플릿 변수(APP_DISPLAY_NAME, APP_SLUG, IOS_BUNDLE_IDENTIFIER, ANDROID_PACKAGE, API_URL 등)를 입력합니다. GitHub org/계정·EAS owner는 01-8 §11 결정 항목이며, agent는 repo admin 권한을 갖지 않습니다.
2. Mobile Architect가 템플릿 기본값(pnpm + Turborepo + Expo Router + NativeWind + Jest + zod)을 승인하고, 예외가 필요한 경우에만 변경을 결정합니다.
3. 신규 mobile repo 운영 레이어가 `apps/mobile/eas.json`, `apps/mobile/.eas/workflows`, `apps/mobile/.maestro`(이상 템플릿 제공)와 gatekeeper 레이어(repo root GitHub workflow + script), `.evidence/` 규약([README.md](http://README.md) 포함)을 제공합니다(01-7 Phase 3 산출물). QA/Release는 EAS/Maestro workflow 동작과 smoke flow 존재를 확인합니다.
4. Mobile App Dev가 initial app shell(템플릿의 홈 카운터 샘플 + `packages/contracts` import)을 동작 확인합니다.
5. `mobile-gatekeeper`가 initial PR을 검사합니다.

완료 조건:

* pnpm workspace + Turborepo 동작, `packages/contracts`가 `apps/mobile`에서 해석됨
* Expo app이 로컬/CI에서 build 가능
* EAS preview workflow 존재
* Maestro smoke flow 존재
* GitHub required check 존재 (등록 주체는 운영자 — repo admin)
* `.evidence/README.md` 존재
* 템플릿 예외 결정의 architecture decision note(ADR-style, deviation 사유 기록) 존재
* EAS profile 전략(preview/internal/production)의 Mobile Architect·QA/Release 합의 기록 존재

### Case B. PRD 접수와 Epic/Task 분해

목표:

* 사용자의 PRD를 agent 실행 가능한 backlog로 바꿉니다.

참여:

* Product/Planning 주도
* Design, Mobile Architect, Backend/API Integrator, QA/Release 검토

절차:

1. `mobile-prd-to-execution` 실행
2. Confluence PRD 또는 문서 SoT 생성
3. Jira Epic/Story 생성
4. Tasks 생성
5. feature room 생성
6. 각 task에 owner role, output, evidence requirement 부여

완료 조건:

* Epic과 Story가 PRD acceptance와 연결됨
* Tasks가 role별로 나뉨
* API 필요 여부가 표시됨
* QA/Release task가 빠지지 않음
* scope decision log(수용/연기/non-goal 기록) 존재
* production submit/결제/PII/외부 발송/법무에 닿는 work item에 human gate 표시됨

### Case C. UI-only feature

목표:

* backend 변경 없이 화면/UX만 구현합니다.

참여:

* Design
* Mobile Architect
* Mobile App Dev
* QA/Release

절차:

1. Design이 screen state를 정리하고, QA/Release가 Maestro flow로 번역할 수 있는 UX acceptance criteria를 작성합니다.
2. Mobile Architect가 route/state 영향이 작은지 확인합니다.
3. Mobile App Dev가 구현하고, 적절한 component/unit test를 추가합니다.
4. QA/Release가 Maestro smoke 또는 targeted flow를 추가하고, EAS Workflows 실행 결과(workflow run id, build id, Maestro 결과)를 `.evidence/<task-id>.json`에 기록합니다.
5. `mobile-gatekeeper` self-check 후 PR을 엽니다.
6. GitHub required check가 merge를 차단/허용합니다.

완료 조건:

* screen spec과 구현이 일치 (Design이 design intent 대비 구현 검토)
* Maestro smoke 통과
* evidence JSON 생성
* PR review 완료 (non-author reviewer: Mobile Architect 또는 Design — author≠approver 충족)

### Case D. API-backed feature

목표:

* 모바일 화면과 backend/API contract가 함께 필요한 기능을 구현합니다.

참여:

* Design (화면·상태 정의)
* Mobile Architect, Backend/API Integrator (contract 공동 검토)
* Mobile App Dev (구현)
* QA/Release (Maestro + evidence)
* Product/Planning은 분해 단계(Case B)에서 task를 정의하며, Case D 실행 절차에는 직접 행위가 없습니다.

절차:

1. Design이 화면과 상태를 정의합니다.
2. `mobile-api-contract`로 contract를 고정합니다.
3. Backend/API Integrator가 backend 변경 필요 여부를 판정합니다.
4. backend 변경이 필요하면 별도 backend task/PR로 분리합니다.
5. Mobile App Dev는 mock 또는 확정 API 기준으로 구현합니다.
6. QA/Release는 contract 기반 Maestro flow를 추가하고, EAS Workflows 실행 결과를 `.evidence/<task-id>.json`에 기록합니다.
7. Gatekeeper는 PR, SHA, EAS, Maestro, evidence를 검사합니다.

완료 조건:

* API contract 문서 존재
* mobile/backend PR이 서로 링크됨
* mock과 real API 차이가 기록됨
* Maestro flow 통과
* author와 approver가 다름
* auth/token/tenant/payment 영향 검토 완료 (Backend/API Integrator — Case E와 대칭)
* screen spec과 구현이 일치 (Design이 design intent 대비 검토)

### Case E. Backend/API 변경 중심 작업

목표:

* 모바일앱이 필요로 하는 backend/API 변경을 안전하게 처리합니다.

참여:

* Backend/API Integrator 주도
* Mobile Architect, Mobile App Dev, QA/Release 검토

절차:

1. Backend/API Integrator가 contract 변경안을 작성합니다.
2. Mobile Architect가 app 영향 범위를 검토합니다.
3. 결제/PII/외부 발송/법무에 닿는 변경은 human gate로 escalation합니다 (영향 검토와 구분되는 별도 승인).
4. backend repo 또는 backend task에서 구현합니다.
5. API test와 contract fixture를 갱신합니다.
6. Mobile Dev가 integration branch에서 검증합니다.
7. QA/Release가 E2E smoke를 실행합니다.

완료 조건:

* backward compatibility 또는 migration note 존재
* auth/token/tenant/payment 영향 검토 완료
* mobile integration evidence 존재
* mobile-gatekeeper required check 통과 + author≠approver + rework_count가 cap 미만

### Case F. QA 실패 또는 Gate 실패

목표:

* 무한 rework를 막고 원인을 분류합니다.

참여:

* QA/Release
* 실패 task owner
* Mobile Architect
* Product/Planning, cap 도달 시

절차:

1. Gatekeeper 또는 Maestro failure를 room/PR에 보고합니다. flaky/실패 run을 pass로 위장하거나 실패한 required check를 초록으로 재라벨하지 않습니다.
2. `rework_count`를 증가시킵니다.
3. 실패 원인을 `implementation`, `contract`, `test`, `environment`, `scope`로 분류합니다.
4. owner agent가 수정합니다.
5. cap 도달 시 자동 재시도를 중지합니다. 중지 전 feature room에 owner와 사유를 보고합니다.
6. Product/Planning 또는 human owner가 cut/retry/reassign/accept risk를 결정합니다.

완료 조건:

* failure reason이 evidence에 남음
* 같은 실패가 반복되면 escalation
* cap 도달 후 같은 agent에게 자동 재할당하지 않음

### Case G. Preview/Internal release

목표:

* production 전 사용자 확인 가능한 preview/internal build를 만듭니다.

참여:

* QA/Release 주도
* Product/Planning 승인
* Mobile Architect 확인

절차:

1. QA/Release가 EAS preview/internal workflow를 실행합니다.
2. Maestro critical path를 실행합니다.
3. evidence JSON과 release note를 생성합니다.
4. Product/Planning이 scope와 acceptance를 확인합니다.
5. room에 install/test 안내를 남깁니다.

완료 조건:

* EAS build id 존재
* Maestro 통과
* release note 존재
* install/test 방법 공유
* mobile-gatekeeper required check 통과 + PR/SHA/EAS/Maestro/evidence 일관성 확인 + author≠approver + rework_count가 cap 미만

### Case H. Production submit

목표:

* App Store/Play Store 제출을 통제된 human gate 아래 진행합니다.

참여:

* QA/Release 주도
* Product/Planning human approval
* Mobile Architect

Human gate:

* Security/Privacy checklist, 별도 LLM agent 아님

절차:

1. release candidate evidence를 수집합니다.
2. 결제/PII/외부 발송/법무/스토어 정책 체크를 수행합니다.
3. human approval을 받습니다.
4. EAS Submit을 실행합니다. Confluence 템플릿의 `build-and-submit.yml` workflow는 자동 트리거하지 않고, human approval 기록 후 수동으로만 실행합니다.
5. 결과를 Confluence/Jira/room에 기록합니다.

완료 조건:

* 전진 전제: mobile-gatekeeper required check 통과 + evidence 존재 + author≠approver + rework_count가 cap 미만 (production은 추가로 recorded human approval)
* human approval 기록 존재 (Product/Planning)
* EAS submit id 존재 (QA/Release)
* store status 기록 (QA/Release — 제출 후 store 심사 status를 수동 추적·기록)
* rollback/update 계획 존재 (Product/Planning + Mobile Architect — release risk와 rollback 소유)
