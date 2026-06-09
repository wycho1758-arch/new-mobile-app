---
pageId: "1373700222"
sourceTitle: "01-7. 진행 계획과 상태"
sourceVersion: "unknown"
sourceUrl: "https://wondermove-official.atlassian.net/wiki/spaces/mobileappd/pages/1373700222"
fetchedAt: "2026-06-09T03:41:15.000Z"
syncStatus: "synced"
---

| 목적 | 조직 구축 Phase 0\~5 로드맵과 진행 상태, 템플릿 설계안 추가 제안 항목을 관리한다. |
| --- | --- |
| Upstream | 01-1 \~ 01-6 |
|  |  |
| Downstream | 없음 (상태 추적 페이지) |
|  |  |
| 관련 DEC-ID | DEC-006, DEC-007, DEC-008, DEC-009, DEC-020 |
|  |  |
| 출처 | 운영계획 §6·§6.1, env-gap 보고서 §7 권고 |
|  |  |

## 6. 진행 계획

### Phase 0. 조직 설계 확정

출력:

* agent role 확정
* skill 목록 확정
* service stack 확정
* human gate 기준 확정

완료 기준:

* Backend/API Integrator 분리 유지
* Gatekeeper non-LLM 확정
* Sentry optional 확정

### Phase 1. 생성 조직용 skill pack 초안 작성

출력:

* admin-portal/admin-api로 생성된 agents에 설치할 organization-runtime skills

    * `mobile-prd-to-execution`
    * `mobile-design-handoff`
    
* 신규 mobile repo에 체크인할 repo-scoped skills

    * `mobile-api-contract`
    * `mobile-qa-release`
    * `mobile-gatekeeper`
    

완료 기준:

* 각 skill에 trigger, input, output, forbidden behavior가 명시됨
* `mobile-gatekeeper`만 deterministic script와 연결됨
* optional skill은 MVP scope에서 제외됨
* skill 산출물은 생성된 agent workspace 또는 신규 mobile repo에 배포될 대상으로 정의되며, openclaw-cloud 소스 수정 지시로 쓰이지 않음

### Phase 2. Soul Builder 입력용 [SOUL.md](http://SOUL.md) 템플릿 작성

출력:

* 공통 [SOUL.md](http://SOUL.md) base
* Product/Planning [SOUL.md](http://SOUL.md)
* Design [SOUL.md](http://SOUL.md)
* Mobile Architect [SOUL.md](http://SOUL.md)
* Mobile App Dev [SOUL.md](http://SOUL.md)
* Backend/API Integrator [SOUL.md](http://SOUL.md)
* QA/Release [SOUL.md](http://SOUL.md)

완료 기준:

* 각 agent가 자기 책임과 금지사항을 구분함
* handoff와 evidence 규칙이 공통으로 들어감
* secret 노출 금지와 human gate가 들어감
* [SOUL.md](http://SOUL.md) 템플릿은 admin-portal/admin-api 생성 flow의 입력/검토 산출물이며, 생성된 agent가 openclaw-cloud/admin-portal/admin-api 내부 파일을 다루라는 지시를 포함하지 않음

### Phase 3. 신규 mobile repo 구성 (Confluence 템플릿 base + 조직 레이어)

base는 Confluence 설계안(pageId 1371963427)을 그대로 따르고, 그 위에 본 문서가 정의한 조직 운영 레이어 4종을 추가합니다.

출력 (base — Confluence 설계안 제공):

* 모노레포 골격: pnpm workspace + Turborepo + `packages/contracts`
* `apps/mobile` Expo app skeleton (Expo Router, NativeWind, env zod schema, Jest setup, 홈 카운터 샘플)
* `apps/mobile/eas.json` + `apps/mobile/.eas/workflows` (build→maestro, build→submit, ota-update)
* `apps/mobile/.maestro` smoke skeleton
* `infra/clawpod/` Secret/Job 예시, `docs/SETUP.md`, `docs/CREDENTIALS.md`, root `AGENTS.md`

출력 (조직 운영 레이어 — 본 문서 추가분):

* Gatekeeper: `scripts/mobile-gatekeeper-check.ts` + `.github/workflows/mobile-gatekeeper.yml` (required check + sentinel job)
* evidence 규약: `.evidence/README.md` + `.evidence/<task-id>.json`
* repo-scoped skills: `.agents/skills/` 3종 (`mobile-api-contract`, `mobile-qa-release`, `mobile-gatekeeper`)
* `.github/PULL_REQUEST_TEMPLATE.md` (evidence link 항목 포함)

완료 기준:

* Confluence 설계안 §2 Definition of Done 항목과 충돌 없음
* GitHub required check가 항상 실행됨
* skipped/neutral 우회가 없음
* EAS/마에스트로 결과가 evidence로 연결됨

**상태 (2026-06-07)**: 출력 (base — Confluence 설계안 제공) 전체가 `Wondermove-Inc/new-mobile-app` branch `feat/mobile-app-template`(커밋 6건, push/PR은 운영자 지시 대기)으로 구현·검증 완료 — DoD **PASS 16 / HUMAN-GATE 1 / FAIL 0** (HUMAN-GATE는 Maestro E2E 실통과, EAS 클라우드 선행). 검증 명령·게이트 기록 전문: [01-8 템플릿 repo 구현 검증 근거 (2026-06-07)](https://wondermove-official.atlassian.net/wiki/spaces/mobileappd/pages/1374355642). 출력 (조직 운영 레이어 — 본 문서 추가분) 4종(Gatekeeper required check, `.evidence/` 규약, repo-scoped skills 3종 체크인, PR template)은 이번 구현 범위 외 잔여 — 기설치된 codex runtime 레이어(`.codex/`, `.agents/`, `evals/`, `scripts/` — PR #1)는 무손상 보존 확인됨(잔여 4종과 별개).

#### Phase 3 운영자 수동 bootstrap 단계 (01-3 정합성 조사 GAP-01\~05·16 배선)

admin-portal/admin-api의 agent 생성 flow는 아래 단계를 수행하지 않는다(코드 실측: `createAgentFull`에 skill 설치·repo 생성·required check 등록 단계 없음). 조직 생성 직후 Case A 진입 전까지 다음을 운영자(human)가 수행하며, 자동화는 Phase 5 후순위 제품 기능이다.

| 단계 | 주체 | 시점 | 비고 |
| --- | --- | --- | --- |
| organization-runtime skill pack(mobile-prd-to-execution, mobile-design-handoff) install | 운영자 (super_admin/tenant_admin) | agent 생성 직후 | `POST /api/skills/:id/install` — SA/TA 전용 API. 자동 install 트리거 없음 |
| 신규 mobile repo 생성 + 템플릿 변수 주입 | 운영자 | 01-8 §11 결정(GitHub org/계정·EAS owner) 후 | agent는 repo admin 권한 미보유 |
| GitHub required check(mobile-gatekeeper) branch protection 등록 | 운영자 (repo admin) | repo 생성 직후 | agent 운영 표면 밖 작업 |
| EXPO_TOKEN 등 외부 자격증명 k8s Secret 작성 | 운영자 | Expo Robot user token 발급 후 | 01-8 §8 `secret.example.yaml` 렌더링. generic env 경로 사용 금지 |
| (`apps/api` 채택 시) `DATABASE_URL`·`API_BEARER_TOKEN` Secret 작성 + DB 프로비저닝 | 운영자 | 01-8 §11 결정(`apps/api` 포함 여부·backend 배포 대상) 후 | 운영 DB 프로비저닝 + k8s Secret 주입 + 로컬 개발용 PostgreSQL 기동(compose) — 01-8 §12·§15.4 참조. Agent의 마이그레이션은 Node 프로세스(`drizzle-kit generate` + 프로그래매틱 `migrate()`)만 사용하므로 DB CLI 불필요 |
| `.evidence/` 규약([README.md](http://README.md)) + gatekeeper 레이어 | Phase 3 운영 레이어 산출물 | repo 구성 시 템플릿으로 제공 | Case A에서 QA/Release는 동작 확인만 수행 |
| repo-scoped skills 3종 `.agents/skills/` 체크인 | Phase 3 운영 레이어 산출물 | repo 구성 시 커밋 | mobile-api-contract, mobile-qa-release, mobile-gatekeeper |

부기 (2026-06-07): 위 수동 단계 중 외부 서비스 연결 절차는 템플릿 repo `docs/SETUP.md`의 human-gate 섹션(Day 0 / Day 1 / Preview·Internal / Production submit 체크리스트 — Android 최초 1회 수동 업로드 포함)으로 인스턴스화되어 있다.

### Phase 4. 첫 PRD dry run

출력:

* PRD → Jira/Tasks
* feature room
* design handoff
* API contract
* mobile PR
* EAS preview build
* Maestro smoke
* evidence JSON

완료 기준:

* 조직이 실제로 한 작은 feature를 끝까지 처리함
* 실패/rework/escalation 흐름이 검증됨

비고: feature room 생성과 Tasks 보드 준비는 dry run 시작 시 운영자와 Product/Planning이 수행한다 — 조직/agent 생성 flow는 room이나 Tasks 보드를 자동 생성하지 않는다(코드 실측: `organization.service.ts` createOrganization은 slug/quota/audit만 수행).

### Phase 5. 필요한 경우에만 제품 기능으로 admin-portal/admin-api 확장 요청

후순위 확장:

* Tasks evidence field
* status transition hard gate
* EAS/Maestro webhook ingestion
* secret-only custom env 경로
* release dashboard

이 확장은 MVP 이후입니다. 처음부터 넣으면 오버스펙입니다.

이 단계도 생성된 agents가 openclaw-cloud 소스를 직접 수정한다는 뜻이 아닙니다. dry run 결과 반복적으로 필요한 기능이 확인될 때, 운영자가 별도 제품 개발 요청으로 admin-portal/admin-api 기능 확장을 진행한다는 뜻입니다.

## 6.1 Confluence 설계안에 추가 제안할 항목

아래 항목은 Confluence 템플릿 설계안 owner의 결정 대기 상태다.

아래 항목은 본 문서가 요구하지만 Confluence 템플릿 설계안(v7)에는 없는 것입니다. 본 문서는 이를 Phase 3의 조직 운영 레이어로 추가하는 것으로 처리하며, 템플릿 자체에 포함할지는 Confluence 문서 owner의 결정 사항으로 남깁니다. 본 작업에서 Confluence 페이지를 수정하지 않습니다.

| 제안 항목 | 내용 | 근거 |
| --- | --- | --- |
| Gatekeeper required check | `scripts/mobile-gatekeeper-check.ts` + `.github/workflows/mobile-gatekeeper.yml` + sentinel job | §3.1 #5 — deterministic hard gate는 MVP 필수 |
| evidence 규약 | `.evidence/README.md` + `.evidence/<task-id>.json` | §3.1 #4/#5 — EAS 클라우드 결과와 GitHub check를 잇는 브리지 |
| `.agents/skills/` | repo-scoped Codex skill 디렉터리 | §3 — 구현/검증/릴리즈 skill 체크인 위치 |
| PR template | `.github/PULL_REQUEST_TEMPLATE.md` (evidence link 필드) | gatekeeper의 `pr_body_has_evidence_link` 검사 전제 |
| submit human gate 트리거 | `build-and-submit.yml`은 자동 트리거 금지, human approval 후 수동 실행 명시 | §4 Case H — production submit human gate |

## env-gap 권고 적용 시점

| 권고 | 적용 시점 | 본문 소유 |
| --- | --- | --- |
| 권고1 ([AGENTS.md](http://AGENTS.md) 6축 확장) | Phase 3 | 01-6 소유 |
| 권고2 (Done-when 문구) | Phase 1 | mobile-prd-to-execution 페이지 소유 |
| 권고3 (eslint-boundaries) | 첫 feature task | 01-6 소유 |
| 권고4 (rework cap dry run 확정) | Phase 4 | 이 페이지 (운영계획 §6 Phase 4와 연결) |
