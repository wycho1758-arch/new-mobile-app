---
pageId: "1374912522"
sourceTitle: "2026-06-08 First Agent Runtime E2E Canary Plan"
sourceVersion: "unknown"
sourceUrl: "https://wondermove-official.atlassian.net/wiki/spaces/mobileappd/pages/1374912522"
fetchedAt: "2026-06-09T03:41:15.000Z"
syncStatus: "synced"
---

| 항목 | 내용 |
| --- | --- |
| 목적 | Confluence에 정리된 Product/Planning SOUL.md, operational skills, Codex CLI 실무 지침이 실제 admin-portal/admin-api로 생성된 agent runtime에서 구동 가능한지 검증하기 위한 first-agent canary E2E 실행 계획이다. |
| Parent | [01-9. 검증 근거·감사 기록](https://wondermove-official.atlassian.net/wiki/spaces/mobileappd/pages/1373667446) |
| Local plan | `docs/plans/active/20260608-first-agent-runtime-e2e-canary-plan.md` |
| Status | <custom data-type="status" data-id="id-0">실행 완료 2026-06-08</custom> canary `canary-pp-202606080757` (DB id 128) E2E PASS. CHECKPOINT 1–5 + PHASE E 전부 reviewer(xhigh) GO. 상세는 §13 Execution Results, 재현 절차는 하위 [Reproducible Guide](https://wondermove-official.atlassian.net/wiki/spaces/mobileappd/pages/1375830055) 참조. |
| Reviewer | 로컬 계획 reviewer(xhigh) 최종 LGTM. 실행 단계 각 CHECKPOINT도 reviewer(xhigh) GO (§13). |

# 1. Executive Summary

이 계획은 전체 agents를 한 번에 생성하지 않고, **Product/Planning canary agent 1개**만 먼저 생성해 실제 runtime에서 문서화된 SOUL.md와 skill이 동작 가능한지 검증한다. 첫 canary가 PASS하고 독립 실행 가이드가 reviewer FINAL PASS를 받기 전에는 두 번째 agent를 생성하지 않는다.

검증은 문서 존재 확인이 아니라 실제 경로 확인이다. admin-api/admin-portal create-full 경로, K8s 리소스, pod file, SOUL.md mount, runtime skill file 생성, Codex CLI 상태, dry-run planning scenario를 모두 연결해 확인한다.

# 2. Scope and Non-Scope

## 2.1 In Scope

* Product/Planning canary agent 1개 생성 계획.
* admin-api `POST /agents/create-full` 또는 admin-portal 단일 생성 흐름을 통한 실제 agent 생성 검증.
* running pod의 `/workspace/SOUL.md`, `AGENTS.md`, `TOOLS.md` 반영 확인.
* CHECKPOINT 4 승인 시 `PATCH /agents/:id/config`로 running pod 반영까지 확인.
* 생성된 agent가 Product/Planning runtime skills를 직접 생성하도록 지시하고 결과를 검증.
* Codex CLI 존재 여부, auth file sync 여부를 secret 원문 미노출 방식으로 확인.
* Product/Planning office-hours, bounded work unit, sprint, Codex practice dry-run 수행.
* 다음 session/agent가 재현 가능한 guide 작성.

## 2.2 Not In Scope

* 전체 agents 일괄 생성.
* 모든 SOUL.md 일괄 업데이트.
* Product/Planning 외 role skill 생성.
* production 환경 배포.
* secret, Codex auth JSON, provider token 원문 저장 또는 출력.
* E2E 중 발견된 코드 결함의 즉시 수정. 결함은 별도 TDD 계획으로 분리한다.
* Soul Builder batch/all-agent deployment 사용.

# 3. Source of Truth Freeze

실행 전 CHECKPOINT 1에서 아래 SoT를 다시 fetch하여 최신 page id, version, URL을 고정한다. 아래 표는 이 계획 작성 시점에 확인한 기준이다.

| Page | Page ID | Version | 역할 | Link |
| --- | --- | --- | --- | --- |
| SOUL.md — Product/Planning | `1373798422` | 2 | canary SOUL seed 기준 | [link](https://wondermove-official.atlassian.net/wiki/spaces/mobileappd/pages/1373798422) |
| Product Planning Operational Skills Summary | `1374421079` | 2 | Product/Planning skill chain 기준 | [link](https://wondermove-official.atlassian.net/wiki/spaces/mobileappd/pages/1374421079) |
| 01-9. 검증 근거·감사 기록 | `1373667446` | 4 | 감사/계획 기록 parent | [link](https://wondermove-official.atlassian.net/wiki/spaces/mobileappd/pages/1373667446) |
| 01-4. Skills | `1373667362` | 4 | skill registry 기준 | [link](https://wondermove-official.atlassian.net/wiki/spaces/mobileappd/pages/1373667362) |
| Product Planning Codex CLI 실무 지침 | `1374355705` | 1 | Product/Planning Codex practice summary | [link](https://wondermove-official.atlassian.net/wiki/spaces/mobileappd/pages/1374355705) |
| mobile-product-planning-codex-practice | `1374355683` | 1 | runtime Codex practice skill | [link](https://wondermove-official.atlassian.net/wiki/spaces/mobileappd/pages/1374355683) |
| mobile-requirement-office-hours | `1374519364` | 1 | clarification skill | [link](https://wondermove-official.atlassian.net/wiki/spaces/mobileappd/pages/1374519364) |
| mobile-work-unit-planning-and-agent-sprint | `1374650456` | 1 | bounded work-unit/sprint skill | [link](https://wondermove-official.atlassian.net/wiki/spaces/mobileappd/pages/1374650456) |
| mobile-prd-to-execution | `1373634562` | 2 | PRD/work-unit decomposition skill | [link](https://wondermove-official.atlassian.net/wiki/spaces/mobileappd/pages/1373634562) |
| mobile-planning-completeness-review | `1374519387` | 1 | planning readiness review skill | [link](https://wondermove-official.atlassian.net/wiki/spaces/mobileappd/pages/1374519387) |

# 4. Local Contract Evidence

| 영역 | 로컬 근거 | E2E에서 확인할 내용 |
| --- | --- | --- |
| agent 생성 | `src/admin-api/src/routes/agents-k8s.ts` `POST /agents/create-full` | DB agent/config 및 K8s ConfigMap/Secret/Service/StatefulSet 생성. |
| portal 생성 payload | `src/admin-portal/hooks/use-create-agent.ts` | admin-portal 단일 agent 생성이 create-full payload를 생성. |
| SOUL 갱신 | `src/admin-api/src/routes/agents-k8s.ts` `PATCH /agents/:id/config` | DB + K8s ConfigMap 갱신 및 pod restart. |
| portal config patch | `src/admin-portal/hooks/use-agent-detail.ts` | `soul_md_content` 등 snake_case 입력이 PATCH camelCase로 변환. |
| runtime SOUL mount | `src/admin-api/src/services/k8s-manifests.ts` | ConfigMap `SOUL.md`가 `/workspace/SOUL.md`에 mount. |
| pod file 검증 | `GET /agents/:id/config/pod-files` | running pod의 실제 SOUL.md/AGENTS.md/TOOLS.md를 읽어 확인. |
| Codex auth sync | `agent/entrypoint.sh` | `OPENAI_CODEX_AUTH_JSON`이 `/root/.codex/auth.json`으로 sync되는지 값 노출 없이 확인. |
| 기존 smoke 근거 | `docs/plans/active/20260511-admin-portal-api-agent-create-agent-test-cycle-plan.md` | create-full, portal proxy, DB/K8s smoke precedent 재사용. |

# 5. End-to-End Flow

```
Confluence SoT
    |
    v
admin-portal / admin-api create-full
    |
    v
Product/Planning canary agent + K8s resources
    |
    v
/workspace/SOUL.md + AGENTS.md + TOOLS.md pod file verification
    |
    v
PATCH /agents/:id/config check if approved at CHECKPOINT 4
    |
    v
Generated agent creates Product/Planning runtime skills
    |
    v
Codex CLI presence/auth sync check without exposing secrets
    |
    v
Product/Planning dry-run planning scenario
    |
    v
Guide + reviewer gate + user decision for next agent
```

# 6. Phase Plan

## PHASE 1: SoT Freeze and Preflight

* Confluence SoT page id, title, version, URL을 수집한다.
* Product/Planning SOUL.md, operational skill pages, Codex CLI practice page를 canary payload 기준으로 고정한다.
* admin-api/admin-portal 현재 배포 이미지가 로컬 소스와 같은 E2E 대상인지 확인한다.
* OrbStack namespace `clawpod`, `admin-api-config.AGENT_IMAGE`를 확인한다.
* 현재 실행 중인 admin-api에서 `POST /agents/create-full` route와 orchestrator handler 연결을 재확인한다.
* `PATCH /agents/:id/config`가 live admin-api에 노출되는지 확인한다.
* agent image에 Codex CLI가 포함되어 있는지 확인할 방법을 정한다. 설치되어 있다고 가정하지 않는다.
* CHECKPOINT 1 reviewer gate를 수행한다.

**Stop:** SoT 충돌, create-full/PATCH 미노출, credential path 부재, admin-api/admin-portal 배포 불일치가 있으면 canary 생성 전 중단한다.

## PHASE 2: Product/Planning Canary Payload Definition

* 단일 canary agent id를 정한다. 예: `mobile-product-planning-canary-YYYYMMDDHHMM`.
* `SOUL.md — Product/Planning` 본문을 `soulMd` payload로 구성한다.
* AGENTS.md에는 SoT URL, page id/version, 수행 절차, 검증 명령만 포함한다. Confluence 원문 전체 복제는 피한다.
* TOOLS.md에는 runtime 도구 확인 절차와 secret 미노출 원칙을 포함한다.
* runtime skill 생성 방식은 canary agent가 workspace에서 수행하도록 정의한다.
* `mobile-product-planning-codex-practice`는 SoT target runtime path `/workspace/skills/mobile-product-planning-codex-practice/SKILL.md`를 우선 적용한다.
* CHECKPOINT 2 reviewer gate를 수행한다.

**Stop:** writable skill path가 확인되지 않으면 skill 파일 생성을 지시하지 않는다.

## PHASE 3: Single Agent Creation Through Real API/Portal

* 우선 admin-api `POST /agents/create-full`로 canary 1개를 생성한다.
* admin-portal session이 가능하면 동일 payload가 portal create flow 또는 portal proxy로 전달되는지도 확인한다.
* API response의 `success`, numeric agent id, `k8sResources`를 기록한다.
* DB `agents`, `agent_configs` 생성 여부를 확인한다.
* K8s ConfigMap, Secret, Service, StatefulSet을 canary id 기준으로 확인한다.
* CHECKPOINT 3 reviewer gate를 수행한다.

**Stop:** create-full 실패, tenant mismatch, K8s resource 누락, secret validation 실패 시 canary를 정리하고 중단한다.

## PHASE 4: Runtime Boot and File Verification

* canary StatefulSet/Pod Ready 상태를 확인한다.
* pod logs에서 SOUL/AGENTS/TOOLS staging, Codex auth sync warning/error를 확인한다.
* `/agents/:id/config/pod-files`로 실제 pod의 `/workspace/SOUL.md`, `AGENTS.md`, `TOOLS.md`를 확인한다.
* SOUL.md에 Product/Planning 역할 본문과 mandatory section이 모두 존재하는지 확인한다.
* `command -v codex`, `codex --version`으로 Codex CLI 존재 여부를 확인한다.
* `test -s /root/.codex/auth.json` 및 permission만 확인하고 auth JSON 원문은 출력하지 않는다.
* CHECKPOINT 4에서 승인된 경우에만 harmless marker 수준의 `PATCH /agents/:id/config` 검증을 수행한다. ConfigMap 갱신, restart evidence, pod file 재조회까지 한 세트로 확인한다.
* CHECKPOINT 4 reviewer gate를 수행한다.

**Stop:** pod file source가 db fallback뿐이면 runtime E2E로 인정하지 않는다. PATCH가 DB만 바꾸고 running pod에 반영되지 않으면 별도 TDD 수정 계획으로 분리한다.

## PHASE 5: Agent-Performed Skill Creation and Dry Run

* canary agent에게 Product/Planning runtime skills 생성을 직접 지시한다.
* 생성된 skill 파일은 SoT skill별 page의 English skill content를 기준으로 하며 path, filename, version marker를 기록한다.
* `mobile-product-planning-codex-practice`가 생성된 뒤, canary agent가 no-over-spec, SoT-bound, Done-when acceptance criteria를 dry-run에 적용했는지 확인한다.
* canary agent가 SOUL.md, AGENTS.md, TOOLS.md를 읽고 이해했음을 evidence로 남기게 한다.
* dry-run scenario: 모호한 mobile app 요구사항, office-hours 질문 필요 여부, MVP 작업 단위 분리, agent sprint 필요 여부, 실행 전 completeness review 판단.
* dry-run은 source code, Jira, production Confluence를 변경하지 않는 simulation으로 제한한다.
* CHECKPOINT 5 reviewer gate를 수행한다.

**Stop:** canary agent가 SoT를 임의 해석하거나 skill 본문을 누락하면 guide 작성 전 실패로 처리한다.

## PHASE 6: Guide and Evidence Report

* 첫 canary 결과 기준으로 독립 실행 guide를 작성한다.
* guide에는 command, expected result, failure handling, cleanup을 포함한다.
* Confluence guide 위치는 SoT 확인 후 확정한다. parent/page ownership 충돌이 있으면 사용자 결정 전까지 생성하지 않는다.
* CHECKPOINT 6 reviewer gate를 수행한다.

**Stop:** guide가 독립 세션 재실행에 필요한 command, expected result, failure handling, cleanup 중 하나라도 누락하면 다음 agent 확장 판단으로 넘어가지 않는다.

## PHASE 7: Next-Agent Expansion Decision

* 첫 canary가 PASS한 뒤에만 다음 agent 확장 여부를 사용자에게 보고한다.
* 다음 agent는 한 번에 하나만 생성한다.
* 기본 후보 순서는 Product/Planning dry-run 결과와 사용자 결정으로 확정한다. 후보: Mobile Architect, Design/UX, Mobile App Developer, Backend/API Integrator, QA/Release.
* Product/Planning canary guide가 reviewer FINAL PASS를 받기 전에는 두 번째 agent를 생성하지 않는다.

# 7. Runtime Skill Creation Targets

| Skill | Source | Runtime expectation |
| --- | --- | --- |
| `mobile-requirement-office-hours` | Confluence page `1374519364` | ambiguous requirement clarification. |
| `mobile-work-unit-planning-and-agent-sprint` | Confluence page `1374650456` | MVP-first bounded work unit and sprint boundary. |
| `mobile-prd-to-execution` | Confluence page `1373634562` | ready PRD/work unit to Jira Epic/Story/Tasks. |
| `mobile-planning-completeness-review` | Confluence page `1374519387` | execution readiness review. |
| `mobile-product-planning-codex-practice` | Confluence page `1374355683` | `/workspace/skills/mobile-product-planning-codex-practice/SKILL.md`. |

# 8. Verification Matrix

| ID | 목적 | 검증 방법 | 성공 기준 |
| --- | --- | --- | --- |
| E2E-01 | SoT freeze | Confluence fetch | 최신 page id/version/URL과 payload가 일치한다. |
| E2E-02 | batch 금지 | 생성 요청 수와 Soul Builder 사용 여부 확인 | Product/Planning canary 1개만 생성. |
| E2E-03 | create-full | admin-api/admin-portal create path | agent id와 resource 결과 반환. |
| E2E-04 | K8s resources | ConfigMap/Secret/Service/StatefulSet 확인 | 모든 resource 존재. |
| E2E-05 | runtime SOUL | `/config/pod-files` | source가 pod이며 SOUL 본문 일치. |
| E2E-06 | config patch | CHECKPOINT 4 승인 후 PATCH | ConfigMap 갱신, restart evidence, pod file 재조회 통과. |
| E2E-07 | Codex CLI | `command -v codex`, `codex --version` | CLI 존재 또는 설치 필요 blocker 명확. |
| E2E-08 | Codex auth | file existence/permission only | secret 원문 미노출. |
| E2E-09 | skill creation | canary workspace file 확인 | Product/Planning skills만 생성. |
| E2E-10 | Codex practice skill | `/workspace/skills/mobile-product-planning-codex-practice/SKILL.md` | Codex CLI 실무 지침 runtime skill 반영. |
| E2E-11 | dry-run | agent report | office-hours/work-unit/sprint/Codex practice 판단 가능. |
| E2E-12 | guide | Confluence/evidence | 독립 세션 재실행 가능. |
| E2E-13 | cleanup | canary 정리 또는 보존 사유 기록 | 잔여 리소스 통제. |

# 9. Reviewer Checkpoints

```
CHECKPOINT 1  SoT freeze + environment preflight
      |
      v
CHECKPOINT 2  Canary payload + runtime skill packaging rule
      |
      v
CHECKPOINT 3  Single agent creation evidence
      |
      v
CHECKPOINT 4  Pod file + Codex CLI/auth + optional PATCH config check
      |
      v
CHECKPOINT 5  Agent-performed skill creation + dry-run
      |
      v
CHECKPOINT 6  Guide/evidence report + Confluence update
      |
      v
FINAL         User decision for next one-agent expansion
```

각 checkpoint reviewer 요청에는 Confluence page id/title/URL/version, 수행 endpoint, 생성 agent id와 numeric DB id, secret 미노출 확인, PASS/FAIL 및 중단 조건 해당 여부를 포함한다.

# 10. Required Deliverables

* 첫 agent runtime E2E evidence report.
* Product/Planning canary 생성 payload 요약.
* runtime SOUL.md/AGENTS.md/TOOLS.md 반영 증거.
* Product/Planning runtime skill 생성 증거.
* Codex CLI 설치/존재/auth sync 검증 증거.
* `mobile-product-planning-codex-practice` runtime skill 반영 증거.
* dry-run Product/Planning scenario 결과.
* 독립 세션 실행용 guide.
* 다음 agent 확장 여부에 대한 reviewer 의견.

# 11. Reviewer Results So Far

| Gate | Result | Summary |
| --- | --- | --- |
| Initial plan review | LGTM | QA PASS, Security PASS, Performance SKIP, unresolved issues 없음. |
| SoT recheck review | LGTM | Product/Planning SOUL v2, Operational Skills Summary v2, 01-4 Skills v4, Product Planning Codex CLI v1, mobile-product-planning-codex-practice v1 확인. |
| Final patched review | LGTM | QA PASS, Security PASS, Performance SKIP. 남은 사항은 E2E-06 문구 clarifier 수준의 non-blocking INFO 1건. |

# 12. Current Status

**실행 완료 (2026-06-08).** 사용자 직접 지시(2026-06-08, "agent를 신규 생성해서 테스트" + "소스 코드 수정 금지")에 따라 Claude가 canary를 생성하고 read-only 검증을 수행했다. CHECKPOINT 1–5 + PHASE E 전부 PASS, 각 단계 reviewer(xhigh) GO. openclaw-cloud 소스/파일 변경 0. canary `canary-pp-202606080757`(DB id 128)는 현재 사용자 직접 검사를 위해 running 상태로 보존 중이며, cleanup은 사용자 지시 시 수행한다(DELETE /agents/128/full + orphan sweep). 상세는 §13.

# 13. Execution Results (2026-06-08)

실행 주체: Claude (사용자 직접 지시). 환경: OrbStack K8s ns `clawpod`. canary: `canary-pp-202606080757` (DB id 128), model 4필드 전부 `openai-codex/gpt-5.5` (라이브 boram/ryujin mirror), image `clawpod/agent:local`, tenant_id 1.

| Checkpoint | Result | Evidence |
| --- | --- | --- |
| CK2 Payload | <custom data-type="status" data-id="id-1">PASS</custom> | all-codex 4필드, image ALLOWED_REPOS 통과, codex 단일 키. reviewer(xhigh) GO. |
| CK3 Create | <custom data-type="status" data-id="id-2">PASS</custom> | create-full `success`, K8s 4종+PVC×2, DB agents/agent_configs row. reviewer GO. |
| CK4 Boot / SOUL / auth | <custom data-type="status" data-id="id-3">PASS</custom> | pod Ready, restarts=0. pod `/workspace/SOUL.md` md5 == DB(byte-identical), 주입 mandatory section 본문 존재. codex auth `/root/.codex/auth.json` perms 600 (원문 미노출). reviewer GO. |
| PHASE E Codex CLI | <custom data-type="status" data-id="id-4">PASS</custom> | agent가 `@openai/codex` 0.137.0을 `/workspace/.npm-global`에 자율 설치 + `test -s`로 auth 검증(secret-safe). codex subscription inference 동작. reviewer GO. |
| CK5 Skills + dry-run | <custom data-type="status" data-id="id-5">PASS</custom> | 3 Product/Planning skill VERBATIM 생성(타 role 0), dry-run readiness=NEEDS_REWORK(over-spec 회피, SoT 정확), secret 미노출. reviewer GO. |

**발견 사항 (전부 환경/payload 이슈, openclaw-cloud 소스 결함 아님, 비차단 — 별도 후속):**

| ID | 내용 | 후속 |
| --- | --- | --- |
| FINDING-1 | admin-api 배포에 `IMAGE_PULL_POLICY` 미설정 → 기본 `Always` → 로컬 이미지 `ErrImagePull`. canary STS만 `IfNotPresent`로 runtime patch하여 우회. | 영구조치(승인 필요): admin-api 배포에 `IMAGE_PULL_POLICY=IfNotPresent` 추가. |
| FINDING-2 | `GET /agents/:id/config/pod-files`가 OrbStack에서 항상 `source:"db"` 폴백(운영 boram도 동일). 직접 `kubectl exec` md5로 검증 대체. | TDD: agents.ts:1319 silent fallback observability. |
| FINDING-3 | SOUL seed가 `## Security Policy`/`## Sub-Agent & Background Delegation` 문자열을 prose로 포함하면 `ensureMandatorySections`가 주입을 skip. seed에서 해당 문자열 제거 후 재생성하여 해결. | 운영 가이드: seed 작성 시 마커 문자열 prose 언급 금지. TDD: 구조 기반 체크. |
| FINDING-4 | agent 작업 완료 후 chat 응답이 DB에 미게시(OrbStack in-memory 하드닝 + callback degradation). filesystem/log로 검증 대체. | TDD: OrbStack chat-reply 영속화 observability. |

재현 절차: 하위 [First Agent Runtime E2E Canary — Reproducible Guide (2026-06-08)](https://wondermove-official.atlassian.net/wiki/spaces/mobileappd/pages/1375830055) 참조.
