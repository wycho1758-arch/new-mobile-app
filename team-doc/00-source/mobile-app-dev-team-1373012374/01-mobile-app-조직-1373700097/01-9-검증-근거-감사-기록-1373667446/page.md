---
pageId: "1373667446"
sourceTitle: "01-9. 검증 근거·감사 기록"
sourceVersion: "unknown"
sourceUrl: "https://wondermove-official.atlassian.net/wiki/spaces/mobileappd/pages/1373667446"
fetchedAt: "2026-06-09T03:41:15.000Z"
syncStatus: "synced"
---

| 항목 | 내용 |
| --- | --- |
| 목적 | 본 섹션의 모든 규범이 의존하는 SoT 검증 매트릭스(코드 15건·템플릿 11건), Gap 분류, 오버스펙 감사, frozen input 해시를 보존한다. 규범 페이지가 아닌 근거 저장소다. |
| Upstream | 없음 (감사 기록) |
| Downstream | \[01\] 전 페이지 (근거 참조) |
| 관련 DEC-ID | 해당 없음 (근거 원문) |
| 출처 | env-gap 보고서 전문 |

## Frozen Input

다음 2건의 로컬 원본이 본 트리의 작성 근거이며 sha256으로 동결되었다. 로컬 파일 상단의 이관 표기는 운영 편의 표식이며, 보존은 본 페이지의 해시 기록이 담당한다.

| 식별자 | 로컬 원본 경로 | sha256 | 동결일 |
| --- | --- | --- | --- |
| A | docs/reports/20260605-mobile-llm-organization-wellmade-operating-plan.md | ebc662aaa6bc6514b294e72e3f70c80f5821d18b5c90a7b73be031a60f79dc02 | 2026-06-06 |
| C | docs/reports/20260605-mobile-llm-organization-env-gap-and-dev-guidelines.md | 056126a7d08ad73faf6d9dc1c909f2aafb3a9d05dabcd898bb4fbd791cd40c98 | 2026-06-06 |

# 1. 목적과 결론

이 보고서는 `docs/reports/20260605-mobile-llm-organization-wellmade-operating-plan.md`(이하 "운영계획")가 전제하는 기본 환경 — Confluence 설계안 "ClawPod Agent용 기본 모바일 앱 프로젝트 템플릿 repo 구성 설계안"(pageId 1371963427, 이하 "템플릿 설계안") — 과의 Gap을 SoT 기준으로 검증하고, 운영계획에 빠져 있는 Agent 실수 방지 개발 방법론과 스파게티 코드 방지 클린 아키텍처/개발 지침을 채워 넣기 위해 작성되었다. 코드, Confluence 페이지, 기존 보고서는 일절 수정하지 않았다.

결론을 먼저 요약하면 다음과 같다.

| 판정 축 | 결과 | 상세 |
| --- | --- | --- |
| 운영계획의 openclaw-cloud 소스 인용 | **15/15 일치** | §3.1 매트릭스 |
| 운영계획 ↔ 템플릿 설계안 버전 drift | **없음** (양쪽 모두 v7 기준) | §3.2 |
| 운영계획이 기술한 템플릿 내용 정합성 | **일치** (불일치 0건) | §3.2 |
| 의도된 Gap (모순 아님) | 5종 — 운영계획 §6.1이 스스로 정의한 조직 운영 레이어 | §3.3 |
| 미충족 Gap | 1종 — **개발 방법론/클린 아키텍처 지침 부재** | §3.4, 본 보고서 §4·§5가 해소 |

즉 운영계획이 전제하는 기본 환경 구성은 템플릿 설계안 v7과 모순 없이 정합하며, 운영계획을 진행하는 데 차단 요인이 되는 Gap은 발견되지 않았다. 유일하게 실질적인 미충족 Gap은 "생성된 agents가 무엇을 기준으로 코드를 짜야 하는가"에 대한 개발 방법론·아키텍처 지침이 양쪽 문서 어디에도 충분히 정의되어 있지 않다는 점이고, 이 보고서의 §4(방법론)와 §5(클린 아키텍처 지침)가 그 공백을 채운다.

# 2. 검증 방법

세 개의 SoT를 상호 대조했다.

```
A. 운영계획   = docs/reports/20260605-mobile-llm-organization-wellmade-operating-plan.md
B. 템플릿 설계안 = Confluence pageId 1371963427, version 7 (2026-06-05T06:10 갱신)
C. 코드베이스  = openclaw-cloud 소스 (admin-api / admin-portal / tasks / agent image)
```

검증 절차는 (1) A가 인용한 C의 file:line 15건을 실제 코드에서 확인, (2) A가 기술한 B의 내용(모노레포 구조, EAS/Maestro 설정, Sentry 조건부 init, Robot user 패턴, [AGENTS.md](http://AGENTS.md) 등)을 B 원문 v7과 대조, (3) A가 "아직 아닌 것"으로 분류한 항목이 실제로 B와 C에 없는지 역방향 확인의 3단계로 수행했다. 외부 방법론·아키텍처 지침은 deep-research(다중 소스 web 검증 + 주장별 3-vote 적대 검증)로 수집했고, 본문에 인라인 인용 \[n\]으로 표기했다.

# 3. Gap 검증 매트릭스

## 3.1 운영계획 ↔ openclaw-cloud 소스 (C 축)

운영계획이 "SoT 검증 근거(내부 경로)"로 인용한 15건 전부가 실제 코드와 일치했다.

| # | 운영계획 인용 | 실측 확인 | 판정 |
| --- | --- | --- | --- |
| 1 | `use-soul-builder-job.ts:13` Soul Builder 시작 hook | `const SOUL_BUILDER_API = '/api/proxy/ai-chat/soul-builder-jobs'` 선언 확인 | 일치 |
| 2 | `ai-chat.ts:331` job 시작, `:380` deploy API | `aiChat.post('/soul-builder-jobs', ...)`, `aiChat.post('/soul-builder-jobs/:jobId/deploy', ...)` | 일치 |
| 3 | `soul-builder-job.service.ts:633`, `:741` | `deploySoulBuilderAgents` 진입점, `createAgentFull` 호출 | 일치 |
| 4 | `agent-orchestrator.ts:57`, `:140`, `:427` [SOUL.md](http://SOUL.md) 보강 | `MANDATORY_SOUL_SECTIONS` 정의, `ensureMandatorySections` 함수와 호출부 | 일치 |
| 5 | `default-agent-content.ts:32`, `:45` + 호출부 `:428`, `:429` | `ensureAgentsMd` / `ensureToolsMd` 및 orchestrator 호출 | 일치 |
| 6 | `k8s-manifests.ts:633` [SOUL.md](http://SOUL.md) 마운트, `:622`/`:700` PVC | `mountPath: '/workspace/SOUL.md'`, `volumeMounts:`, `volumeClaimTemplates:` | 일치 |
| 7 | `tasks/src/core/init.ts:209` MCP 등록, `types/index.ts:26` | `if (client === "claude")` 분기, `export interface Task` | 일치 |
| 8 | `task-notification.ts:625` room 전달 | `dispatchTaskEvent` 함수 | 일치 |
| 9 | `webhook.service.ts:286`, `:372` | `SIGNATURE_PRESETS`(GitHub/Sentry 포함), `createRule` | 일치 |
| 10 | `tasks/backlog/config.yml` status 3종 | `statuses: ["To Do", "In Progress", "Done"]` 정확 일치 | 일치 |
| 11 | `agent/Dockerfile:222` Claude CLI, `entrypoint.sh:1559` Codex sync | 주석+`npm install -g @anthropic-ai/claude-code`(L225), `OPENAI_CODEX_AUTH_JSON` sync | 일치 |
| 12 | generic envVars의 ConfigMap 노출, `envFrom secretRef` 부재 | `generateConfigMap`(L140)이 `...config.envVars`를 plain data로 추가. `envFrom`(Secret 통째 주입) 0건, 개별 `secretKeyRef` 10건만 존재(L412\~L555) — 임의 Secret 일괄 주입 기능 없음 | 일치 |
| 13 | agent image에 eas-cli 미설치 | `agent/Dockerfile` 전체에서 `eas-cli` 0건 | 일치 |
| 14 | 관련 선행 보고서 존재 | `docs/reports/20260605-mobile-llm-organization-control-plane-report.md`, `docs/reports/20260605-mobile-llm-organization-preparation-list.md` 실재 (ls 확인) | 일치 |
| 15 | `.codex/skills`는 운영자 측 도구 (운영계획 §3 "참고" 단락) | `.codex/skills/` 실재 — skill 디렉터리 42개 + 아카이브 1개(`ls -d */` 계수 기준, 2026-06-06 재계수). 운영계획의 성격 규정("운영자 측 도구")과 부합, 생성 조직 배포 대상 아님 | 일치 |

특히 #10·#12·#13은 운영계획의 핵심 제약(Tasks를 hard gate로 쓰면 안 됨, `EXPO_TOKEN`을 generic envVars로 넣으면 안 됨, agent가 EAS CLI를 즉시 실행할 수 없음)을 떠받치는 근거인데, 세 건 모두 실측으로 재확인되었다. 운영계획의 위험 판단은 코드 현실과 부합한다.

## 3.2 운영계획 ↔ 템플릿 설계안 v7 (B 축)

운영계획은 §6.1에서 "Confluence 템플릿 설계안(v7)"을 명시 기준으로 삼았고, 검증 시점의 페이지 버전도 v7(2026-06-05T06:10, 변경 메모 "Reviewer HIGH 반영: RNTL matcher setup 및 NativeWind token 기본값 추가")이다. 운영계획 작성 후 템플릿 설계안이 추가 갱신되어 생기는 버전 drift는 존재하지 않는다.

운영계획이 템플릿 설계안 내용이라고 기술한 항목을 v7 원문과 대조한 결과는 다음과 같다.

| 운영계획의 기술 | 템플릿 설계안 v7 원문 | 판정 |
| --- | --- | --- |
| pnpm workspace + Turborepo, `apps/mobile`(Expo), `packages/contracts` | §5 디렉터리 구조 동일 | 일치 |
| `apps/mobile/eas.json`에 dev/preview/production + `e2e-test` profile | §7 eas.json 원문 동일 | 일치 |
| `.eas/workflows` build→maestro / build→submit / ota-update 배선 | §5·§7 (`e2e-test-android.yml` 등 3종) | 일치 |
| `.maestro` smoke skeleton (`home.yml`) | §5·§6 | 일치 |
| Sentry init 조건부 내장(DSN 미주입 시 비활성) | §6 `_layout.tsx`의 `enabled: Boolean(Env.SENTRY_DSN)` | 일치 |
| EAS 명령은 `apps/mobile`에서 실행(`.eas`와 `eas.json` 같은 레벨) | §8 명시 | 일치 |
| Robot user + k8s Secret(`secret.example.yaml`) + 별도 Job(`agent-runner.yaml`) | §8 manifest 2종 원문 존재 | 일치 |
| root `AGENTS.md`(TDD, no hardcoding, no direct push to main, shadcn/ui N/A) | §12 마지막 항목 명시 | 일치 |
| 템플릿 변수(APP_DISPLAY_NAME, APP_SLUG, IOS_BUNDLE_IDENTIFIER, ANDROID_PACKAGE, API_URL 등) | §3 표 동일 | 일치 |
| 기본 스택: Expo Router + NativeWind + Jest + zod | §4·§5·§6 | 일치 |
| GitHub CI는 quality-gate(lint/test)만 존재 | §5·§7 `quality-gate.yml` 단일 workflow | 일치 |

불일치 0건. 운영계획이 템플릿 설계안을 인용·요약한 모든 대목이 v7 원문과 부합한다.

## 3.3 의도된 Gap — 조직 운영 레이어 5종 (모순 아님)

다음 5개 항목은 템플릿 설계안 v7에 없지만, 운영계획 §6.1이 그 부재를 명시적으로 인지하고 Phase 3에서 "조직 운영 레이어"로 추가하기로 정의한 것이다. 따라서 문서 간 모순이 아니라 계획된 추가분이다.

| 항목 | 템플릿 설계안 v7 (부재 근거) | 운영계획 처리 (근거) |
| --- | --- | --- |
| Gatekeeper required check (`scripts/mobile-gatekeeper-check.ts` + workflow + sentinel job) | 없음 — v7 §5 구조와 §7에 `quality-gate.yml`(lint/test)만 존재 | Phase 3 추가 (운영계획 §6.1 1행, §3.1 #5) |
| evidence 규약 (`.evidence/README.md` + `.evidence/<task-id>.json`) | 없음 — v7 §5 디렉터리 구조에 `.evidence/` 부재 | Phase 3 추가 (운영계획 §6.1 2행, §3.1 #4/#5) |
| `.agents/skills/` repo-scoped Codex skill 디렉터리 | 없음 — v7 §5 구조에 부재 (운영계획 §3 "참고"도 동일 확인) | Phase 3 추가 (운영계획 §6.1 3행, §3) |
| `.github/PULL_REQUEST_TEMPLATE.md` (evidence link 필드) | 없음 — v7 §5 `.github/workflows/`에 quality-gate.yml만 | Phase 3 추가 (운영계획 §6.1 4행) |
| `build-and-submit.yml` human gate 트리거 정책 | workflow 파일은 v7 §5에 있으나 트리거 정책 미정의 (§7은 e2e-test workflow의 `on: pull_request`만 예시) | Case H에서 수동 실행 정책으로 보완 (운영계획 §4 Case H 4항, §6.1 5행) |

## 3.4 미충족 Gap — 개발 방법론/클린 아키텍처 지침 부재

양 문서를 합쳐도 "생성된 agents가 mobile repo 안에서 어떤 기준으로 코드를 작성해야 하는가"는 다음 수준에 머문다.

* 템플릿 설계안 §12: root `AGENTS.md`에 TDD, no hardcoding, no direct push to main, shadcn/ui N/A 4개 항목 명시 요구.
* 운영계획 §5: SOUL.md에 역할 경계·handoff·gate·human gate를 정의하지만, 이는 조직 운영 계약이지 코드 아키텍처 지침이 아니다.

디렉터리 구조 확장 규칙, 레이어 분리, `packages/contracts`의 단일 SoT 활용 규칙, 상태관리 경계, import 방향, 에러 처리, 테스트 전략 같은 anti-spaghetti 지침이 없으면, 다수의 LLM agent가 병렬로 작업할 때 구조 일관성이 빠르게 무너진다. §4와 §5가 이 공백을 deep-research 검증 결과 기반으로 채우며, 적용 위치는 신규 mobile repo의 root `AGENTS.md` 확장(Phase 3 조직 운영 레이어와 동일 시점)을 제안한다. 템플릿 설계안 자체의 수정 여부는 Confluence 문서 owner의 결정 사항으로 남긴다(운영계획 §6.1과 동일한 처리).

§4 일반화는 00-3, §5 구체 규칙은 01-6이 소유한다. 본 페이지는 §4·§5 본문을 중복 수록하지 않는다.

# 6. 오버스펙 대조 (권고 전수 목록)

## 6.1 본 보고서가 권고하는 것 (전수)

| # | 권고/규칙 | 분류 | 오버스펙 판정 근거 |
| --- | --- | --- | --- |
| 1 | root [AGENTS.md](http://AGENTS.md) 6축 확장 (§4.1, §5.6) | 신규 — 기존 파일 확장 | 간결한 outline으로 제한(§5.6), 새 인프라 없음. 장문 매뉴얼화는 TRIM 반영으로 차단 |
| 2 | task의 Goal/Context/Constraints/Done-when 작성 구조 (§4.2) | 신규 — 작성 컨벤션 | 프롬프트 구조일 뿐 인프라·schema 변경 아님 \[1\] |
| 3 | Done-when을 기존 acceptance criteria/evidence requirement **문구에 통합** (§4.2) | 기존 장치 문구 정비 | 신규 필드·Tasks schema 변경 아님(운영계획 §7 제외 항목 준수). TRIM 반영 완료 |
| 4 | PR 전 로컬 검증 루프 (lint/test + gatekeeper self-check) (§4.3) | 기존 장치 재사용 | quality-gate·gatekeeper 재사용, 신규 0 |
| 5 | 라우팅/디렉터리 규칙 — src/app은 라우트 전용, features는 첫 feature부터 (§5.1) | 신규 — 문서 규칙 | Expo 공식 권고 그대로 \[7\]\[8\]. 선제 scaffolding 금지로 TRIM 반영 |
| 6 | import 단방향 원칙 + contracts 단일 SoT (§5.2) | 신규 — 문서 규칙 | 템플릿이 이미 검증하는 패턴(설계안 §6)의 확장. 구조 강제는 첫 feature부터(TRIM 반영) |
| 7 | 서버/클라이언트 상태 분리 원칙 (§5.3) | 신규 — 문서 규칙 | 라이브러리 비전제 원칙만(TRIM 반영). 도구 결정은 Case D 시점 |
| 8 | eslint-plugin-boundaries — `src/features/` 최초 생성 PR과 동시 도입 (§5.4) | 신규 — lint 플러그인 1개 | Phase 3 일괄 도입에서 첫 feature 시점으로 연기(TRIM 반영). 기존 lint 게이트 재사용 |
| 9 | 테스트 전략 — TDD + critical path만 Maestro (§5.5) | 기존 장치 재확인 | 템플릿 설계안 §9·운영계획 §3.1 #4와 동일, RN 공식 권고 부합 \[10\] |
| 10 | rework cap 수치는 Phase 4 dry run에서 경험적 확정 (§4.5) | 기존 장치(Case F) 보완 | 외부 표준 미인용(미검증 주장 배제), 신규 장치 없음 |

기존 운영계획 장치(gatekeeper required check, evidence 규약, [SOUL.md](http://SOUL.md) gate rules, human gate)는 전부 참조만 했고 재정의하지 않았다.

## 6.2 채택하지 않은 것

deep-research 또는 일반 관행이 권하더라도 채택하지 않은 항목과 사유는 다음과 같다. 각 행은 00-4 레지스트리에 등록되었다.

| 미채택 항목 | 출처/유혹 | 미채택 사유 | 레지스트리 |
| --- | --- | --- | --- |
| Detox / Appium / device cloud / 자체 runner / S3 artifact store | 일반 RN E2E 관행 | 운영계획 §7 명시 제외. RN 공식 문서도 E2E 최소화 권고 \[10\] | DEC-013 |
| per-package 중첩 [AGENTS.md](http://AGENTS.md) | Codex cascade 기능 \[2\] | 범용 보장 아님(적대 검증에서 반박됨). 실행기 간 동작 차이 리스크 > MVP 이득 | DEC-014 |
| [AGENTS.md](http://AGENTS.md) 분량 정량 기준(100\~150줄 등) | 2차 출처 통념 | 인용 출처 \[12\]가 해당 수치를 지지하지 않음을 재검증에서 확인 — 정성 원칙("짧고 정확하게" \[1\])만 유지 | DEC-015 |
| Stop hook 기반 하드 게이트 + 정량 rework cap | Claude Code 운영 세부 | 1차 출처 검증 실패(미검증). gatekeeper required check가 이미 하드 게이트 역할 수행 | DEC-016 |
| TanStack Query 등 서버 상태 라이브러리 선제 도입 | 상태관리 관행 | 첫 API-backed feature 전까지 불필요. Case D 시점에 Mobile Architect 결정 | DEC-017 |
| eslint-plugin-boundaries의 Phase 3 선제 도입 | 본 보고서 초안 | 카운터 샘플 단계엔 강제할 경계가 없음 — 첫 feature 구조와 동시 도입으로 연기 | DEC-018 |
| 에이전트 오케스트레이션 프레임워크 | 멀티에이전트 유행 | Anthropic 1차 출처가 단순·조합 패턴 선호 명시 \[4\] | DEC-019 |
| Sentry 운영 활성화 필수화 | 관측성 관행 | 운영계획 §7 제외 유지(조건부 init은 템플릿에 이미 내장) | DEC-020 |
| Tasks schema 수정 / Gatekeeper의 admin-api 내장 | 기능 욕심 | 운영계획 §7 명시 제외 — 본 보고서 권고 어디에도 포함하지 않음 | DEC-004 |

§5 구체 규칙은 01-6이 소유한다. 본 페이지는 §5 본문을 중복 수록하지 않는다.

# 7. 결론, 권고, 한계

## 결론

운영계획이 전제하는 기본 환경(템플릿 설계안 v7)과의 Gap 검증 결과, 차단성 Gap은 0건이다. 코드 SoT 인용 15/15 일치, 템플릿 내용 정합 불일치 0건, 버전 drift 없음이며, 템플릿에 없는 5개 항목은 운영계획이 스스로 정의한 Phase 3 조직 운영 레이어로서 모순이 아니다. 운영계획은 현재 상태 그대로 진행 가능하다.

## 권고 (운영계획에 추가할 것)

| # | 권고 | 적용 시점 |
| --- | --- | --- |
| 1 | root AGENTS.md를 6축(§4.1) **간결한 outline**으로 확장 — §5의 라우팅/상태/테스트 규칙 블록 포함, 장문 매뉴얼화 금지 | Phase 3 (조직 운영 레이어와 동시) |
| 2 | Tasks 분해 시 acceptance criteria/evidence requirement 문구를 Done-when 형식으로 통일 (`mobile-prd-to-execution` 출력 작성 규칙 — 신규 필드·schema 변경 아님) | Phase 1 skill 초안 |
| 3 | eslint-plugin-boundaries로 §5.2 레이어 규칙을 quality-gate에서 결정적 강제 — `src/features/` 최초 생성 PR과 동시 도입 | 첫 feature task (Phase 4 dry run 또는 이후) |
| 4 | rework cap 수치는 외부 표준 인용 없이 Phase 4 dry run에서 경험적으로 확정 | Phase 4 |

## 한계

deep-research의 적대 검증 단계에서 검증자 다수가 구조화 출력 실패로 기권(0-0)했고, 그 결과 축 2(Expo/RN 아키텍처)의 주장들이 "반박"이 아닌 "미검증"으로 남았다. 본 보고서는 미검증 주장을 인용하는 대신, deep-research가 지목한 1차 출처 6건(Expo monorepos/router 공식 문서, RN testing overview, TanStack Query overview, eslint-plugin-boundaries)을 직접 fetch하여 재검증한 후에만 §5에 수록했다. 또한 "Done은 에이전트의 성공 주장이 아니라 evidence로 판정한다"는 명제의 1차 출처 문구는 검증을 통과하지 못했으나, 운영계획 자체가 이미 evidence 기반 Done을 자체 규칙으로 정의하고 있으므로 본 보고서는 이를 외부 표준이 아닌 운영계획 내부 규칙으로만 취급했다.

최종 reviewer(codex, reasoning effort xhigh) 점검에서 두 건의 사실 오류가 추가 검출되어 정정했다. 첫째, deep-research 검증 evidence에 포함됐던 "[AGENTS.md](http://AGENTS.md) 100\~150줄 최적" 수치는 인용 출처 \[12\] 원문에 존재하지 않음을 직접 fetch로 확인하고 제거했다(정성 원칙 \[1\]만 유지). 둘째, `.codex/skills` 항목 수가 초기 탐색의 45개가 아닌 42개 디렉터리 + 아카이브 1개임을 재계수로 정정했다. 이 두 건은 다단계 검증(탐색 agent → deep-research 3-vote → 최종 reviewer xhigh → 1차 출처 직접 확인)이 실제로 서로 다른 오류를 잡아냈음을 보여주는 사례다. reviewer의 overspec audit(TRIM 7건)은 §5.1\~§5.6과 §7 권고에 모두 반영했다.

# 참조

| \[n\] | 출처 | 성격 |
| --- | --- | --- |
| \[1\] | [https://developers.openai.com/codex/learn/best-practices](https://developers.openai.com/codex/learn/best-practices) | 1차 (OpenAI 공식) |
| \[2\] | [https://developers.openai.com/codex/guides/agents-md](https://developers.openai.com/codex/guides/agents-md) | 1차 (OpenAI 공식) |
| \[3\] | [https://agents.md/](https://agents.md/) | 1차 (포맷 공식, Linux Foundation 산하 관리) |
| \[4\] | [https://www.anthropic.com/research/building-effective-agents](https://www.anthropic.com/research/building-effective-agents) | 1차 (Anthropic 공식) |
| \[5\] | [https://code.claude.com/docs/en/best-practices](https://code.claude.com/docs/en/best-practices) | 1차 (Anthropic 공식) |
| \[6\] | [https://docs.expo.dev/guides/monorepos/](https://docs.expo.dev/guides/monorepos/) | 1차 (Expo 공식) — 본 검증에서 직접 확인 |
| \[7\] | [https://docs.expo.dev/router/basics/core-concepts/](https://docs.expo.dev/router/basics/core-concepts/) | 1차 (Expo 공식) — 본 검증에서 직접 확인 |
| \[8\] | [https://docs.expo.dev/router/basics/notation/](https://docs.expo.dev/router/basics/notation/) | 1차 (Expo 공식) — 본 검증에서 직접 확인 |
| \[9\] | [https://github.com/javierbrea/eslint-plugin-boundaries](https://github.com/javierbrea/eslint-plugin-boundaries) | 1차 (도구 공식) — 본 검증에서 직접 확인 |
| \[10\] | [https://reactnative.dev/docs/testing-overview](https://reactnative.dev/docs/testing-overview) | 1차 (React Native 공식) — 본 검증에서 직접 확인 |
| \[11\] | [https://tanstack.com/query/latest/docs/framework/react/overview](https://tanstack.com/query/latest/docs/framework/react/overview) | 1차 (TanStack 공식) — 본 검증에서 직접 확인 |
| \[12\] | [https://github.blog/ai-and-ml/github-copilot/how-to-write-a-great-agents-md-lessons-from-over-2500-repositories/](https://github.blog/ai-and-ml/github-copilot/how-to-write-a-great-agents-md-lessons-from-over-2500-repositories/) | 2차 (GitHub 엔지니어링 블로그, 2,500+ repo 분석) |
| \[13\] | [https://addyosmani.com/blog/good-spec/](https://addyosmani.com/blog/good-spec/) | 2차 (실무자, 수렴 보강용) |
| \[14\] | [https://www.oreilly.com/radar/how-to-write-a-good-spec-for-ai-agents/](https://www.oreilly.com/radar/how-to-write-a-good-spec-for-ai-agents/) | 2차 (O'Reilly, 수렴 보강용) |

# 2026-06-08 Product/Planning Operational Skill Validation Addendum

## 범위

이 addendum은 `01-9. 검증 근거·감사 기록` version 1의 2026-06-06 frozen input 이후 추가되거나 업데이트된 Product/Planning operational skill과 프로세스의 후속 검증 근거다. 기존 frozen input hash와 원 감사 본문은 변경하지 않는다. 본 검증은 Confluence 문서/프로세스 audit이며 openclaw-cloud source, runtime skill pack, Jira automation, Jira issue를 변경하지 않았다.

## 검증 대상 페이지

| Page | Page ID | Version | Link | 검증 역할 |
| --- | --- | --- | --- | --- |
| `SOUL.md — Product/Planning` | `1373798422` | 2 | [link](https://wondermove-official.atlassian.net/wiki/spaces/mobileappd/pages/1373798422) | Product/Planning parent/role context |
| `Product Planning Operational Skills Summary` | `1374421079` | 2 | [link](https://wondermove-official.atlassian.net/wiki/spaces/mobileappd/pages/1374421079) | summary/process chain |
| `mobile-work-unit-planning-and-agent-sprint` | `1374650456` | 1 | [link](https://wondermove-official.atlassian.net/wiki/spaces/mobileappd/pages/1374650456) | 신규 Product/Planning operational skill |
| `mobile-requirement-office-hours` | `1374519364` | 1 | [link](https://wondermove-official.atlassian.net/wiki/spaces/mobileappd/pages/1374519364) | upstream clarification skill |
| `mobile-prd-to-execution` | `1373634562` | 2 | [link](https://wondermove-official.atlassian.net/wiki/spaces/mobileappd/pages/1373634562) | existing downstream decomposition skill |
| `mobile-planning-completeness-review` | `1374519387` | 1 | [link](https://wondermove-official.atlassian.net/wiki/spaces/mobileappd/pages/1374519387) | downstream readiness review skill |
| `01-4. Skills` | `1373667362` | 3 | [link](https://wondermove-official.atlassian.net/wiki/spaces/mobileappd/pages/1373667362) | registry/index 기준 |
| `00-3. 산출물 표준` | `1373765641` | 2 | [link](https://wondermove-official.atlassian.net/wiki/spaces/mobileappd/pages/1373765641) | skill/evidence 표준 기준 |

Duplicate 확인: CQL exact title search `title = "mobile-work-unit-planning-and-agent-sprint" AND type = page` 결과는 current page `1374650456` 1건이다.

## Coverage Matrix

| Test ID | Result | Evidence |
| --- | --- | --- |
| T01 링크와 배치 무결성 | PASS | `mobile-work-unit-planning-and-agent-sprint`는 Product/Planning parent `1373798422` 하위이며 summary와 registry에 실제 링크가 있다. duplicate exact title search는 1건이다. |
| T02 Skill schema 준수 | PASS | 신규 skill은 Metadata, Purpose, Case Coverage, Inputs, Outputs, Work-Unit Levels, Decision Process, Required Checks/Evals, Forbidden, Relation To Existing Skills를 포함해 `00-3`/`01-4`의 필수 구조와 대응된다. |
| T03 한글/영문 분리 | PASS | 신규 skill은 한국어 업데이트 배경과 영어 Skill Specification을 분리했고, summary도 한국어 update background를 포함한다. |
| T04 프로세스 chain 연속성 | PASS | summary의 ASCII process가 office-hours -> work-unit planning -> prd-to-execution -> completeness review -> execution/proactive report intake로 연결된다. |
| T05 작업 단위 sizing | PASS | 신규 skill은 full product scope보다 작은 work unit 선택과 oversized handoff 거절을 요구한다. |
| T06 MVP-first 승인 | PASS | evidence-backed usable MVP 이후 user/human-owner approval을 요청하고 승인 후 product-level backlog expansion으로 진행하도록 정의한다. |
| T07 능동형 agent report | PASS | cron/event-triggered practitioner report는 Product/Planning triage로 들어오는 proposal로 정의된다. |
| T08 자동 실행 금지 boundary | PASS | cron alone으로 Jira/source/scope/SOUL.md 변경이나 human-gate bypass가 일어나지 않도록 금지한다. |
| T09 기존 skill 비대체성 | PASS | 신규 skill은 `mobile-requirement-office-hours`, `mobile-prd-to-execution`, `mobile-planning-completeness-review`를 대체하지 않는다. |
| T10 Registry 최소성 | PASS | `01-4. Skills` v3는 MVP matrix와 Case A-H registry semantics를 보존하고 Product/Planning operational links만 추가했다. |
| T11 방법론 참조 적합성 | PASS | Scrum/Lean/Shape Up 참조는 work-unit sizing, MVP-first, sprint/review/retro, vertical slice/proactive intake 판단 기준으로 현재 [SOUL.md/Confluence/Jira](http://SOUL.md/Confluence/Jira) 운영 구조에 맞게 연결되어 있다. |
| T12 `01-9` addendum 적합성 | PASS | 기존 frozen input을 수정하지 않고 본 후속 evidence를 addendum으로 append한다. |

## Scenario Dry-Run Results

| Scenario | Result | Outcome |
| --- | --- | --- |
| S01 oversized product request | PASS | full-volume handoff를 거절하고 MVP/agent sprint/vertical slice로 축소한다. |
| S02 MVP approval | PASS | product-level 확장 전 evidence-backed MVP와 user/human-owner approval path를 요구한다. |
| S03 practitioner cron report | PASS | scheduled self-inspection report는 Product/Planning triage proposal이며 자동 Jira/source/SOUL.md 변경이 아니다. |
| S04 human gate | PASS | payment, PII, production submit, external messaging, legal/terms, risk acceptance는 HUMAN_DECISION_REQUIRED로 자동 진행을 중단한다. |
| S05 unclear request | PASS | target user, acceptance signal, constraints가 부족하면 `mobile-requirement-office-hours`로 회귀한다. |
| S06 ready bounded work | PASS | owner, acceptance, evidence, dependency, non-goal이 있는 bounded work는 `mobile-prd-to-execution`으로 라우팅 가능하다. |
| S07 post-decomposition review | PASS | Jira/Task plan 분해 완료 후 execution 전 `mobile-planning-completeness-review`로 readiness를 확인한다. |

## Reviewer Gates

| Checkpoint | Result | Summary |
| --- | --- | --- |
| CHECKPOINT 0 | PASS | `01-9` v1은 2026-06-06 frozen input 기반 원 감사 범위이며, 2026-06-08 이후 신규/업데이트 skill은 later addendum으로 별도 검증해야 한다고 승인. |
| CHECKPOINT 1 | PASS | inventory complete. `mobile-prd-to-execution`은 `01-4. Skills` 하위의 기존 downstream decomposition skill로 허용된다고 승인. |
| CHECKPOINT 2 | PASS | T01-T12/S01-S07 범위와 no-change boundary 승인. |
| CHECKPOINT 3 | PASS | T01-T12 PASS와 S01-S07 PASS 판정이 fetched SoT evidence로 지지된다고 승인. |

## Boundaries

* No openclaw-cloud source change.
* No runtime skill pack change.
* No Jira automation or Jira issue creation.
* No cron-based automatic execution.
* No automatic Jira/source/SOUL.md/scope change from proactive reports.
* No human-gate bypass for production submit, payment, PII, external messaging, legal/terms, or risk acceptance.
* No generic workflow framework or new orchestration layer.
* No rewrite of the original `01-9` frozen input hash or audit body.

## 결론

현재 SoT 기준으로 신규 `mobile-work-unit-planning-and-agent-sprint`와 관련 Product/Planning operational process 업데이트는 검증 커버리지 T01-T12 및 S01-S07 dry-run을 통과했다. 기존 `01-9` 원 감사는 그대로 보존하고, 본 addendum을 후속 검증 근거로만 기록한다.

# 2026-06-08 Product/Planning Validation Rework Addendum

## Rework Scope

CHECKPOINT 6 attempt 1 reviewer(xhigh)는 두 가지 이슈를 발견했다. 첫째, 최신 Confluence SoT에서 `01-4. Skills` page `1373667362`는 version 4인데 기존 addendum은 version 3으로 기록했다. 둘째, published `01-9` addendum의 Reviewer Gates에는 CHECKPOINT 4/5 및 CHECKPOINT 6 attempt trail이 없었다. 본 rework addendum은 이 두 이슈만 보정한다.

## Latest Registry Recheck

| Page | Page ID | Latest Version | Link | Recheck Result |
| --- | --- | --- | --- | --- |
| `01-4. Skills` | `1373667362` | 4 | [link](https://wondermove-official.atlassian.net/wiki/spaces/mobileappd/pages/1373667362) | v4는 외부 공식 skill 선별 설치 정책과 선택 skill 2행을 추가했다. Product/Planning operational skill links, MVP matrix, Case A-H registry semantics는 유지되어 T10 PASS 판정은 계속 유효하다. |

## Reviewer Gate Trail Update

| Checkpoint | Result | Summary |
| --- | --- | --- |
| CHECKPOINT 4 | PASS | Confluence 업데이트 전 addendum draft가 live SoT page/version/link와 일치하고, 기존 `01-9` frozen input hash/body를 변경하지 않는 append 구조라고 승인. |
| CHECKPOINT 5 | PASS | rendered `01-9` v2가 title/parent를 유지하고 Frozen Input A/C hash와 동결일을 보존했으며, addendum 구조와 T01-T12/S01-S07/boundary를 포함한다고 승인. |
| CHECKPOINT 6 attempt 1 | FAIL | 최신 `01-4. Skills` v4 불일치와 Reviewer Gates trail 누락을 지적. 본 rework addendum으로 보정한다. |

## Rework Boundary

이 rework는 `01-9` 감사 trail 보정만 수행한다. openclaw-cloud source, runtime skill pack, Jira automation, Jira issue는 변경하지 않는다. 신규 skill이나 workflow를 추가하지 않으며, 기존 frozen input hash와 원 감사 본문도 수정하지 않는다.

# 2026-06-08 First Agent Runtime E2E Canary Plan Summary

상세 실행 계획은 하위 페이지로 분리했다. 본 parent page에는 감사 trail용 summary만 남긴다.

| 항목 | 내용 |
| --- | --- |
| 상세 계획 페이지 | [2026-06-08 First Agent Runtime E2E Canary Plan](https://wondermove-official.atlassian.net/wiki/spaces/mobileappd/pages/1374912522) |
| 목적 | Confluence SoT의 Product/Planning SOUL.md, operational skills, Codex CLI 지침이 실제 admin-api/admin-portal로 생성된 canary agent runtime에서 구동 가능한지 검증한다. |
| 진행 방식 | 전체 agents 일괄 생성 금지. Product/Planning canary 1개만 먼저 생성하고 reviewer gate 후 다음 agent 확장을 판단한다. |
| 핵심 검증 | `POST /agents/create-full`, pod file, `PATCH /agents/:id/config` 승인 검증, runtime skills, Codex CLI/auth sync, dry-run planning scenario. |
| Reviewer | 계획 reviewer(xhigh) LGTM. Confluence 반영본은 작성 후 별도 reviewer(xhigh)로 재확인한다. |
| 현재 상태 | 계획/문서화 단계. 실제 canary agent 생성 및 E2E 실행 전. |

```
Confluence SoT
    |
    v
admin-api/admin-portal single create-full
    |
    v
Product/Planning canary runtime
    |
    v
SOUL + skills + Codex CLI verification
    |
    v
Dry-run + guide + reviewer
    |
    v
User decision for next agent
```
