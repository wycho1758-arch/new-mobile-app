# Pod Organization E2E Improvement Plan

## 목적

이 문서는 boram-\* 샘플과 같은 OpenClaw cloud pod로 6역할 LLM 모바일 개발 조직을 구성하고,
그 조직이 이 template runtime repo를 사용해 고객 요청부터 릴리스 직전 human gate까지의
모바일 앱 개발 lifecycle을 **무인으로(E2E)** 수행할 수 있게 만들기 위한 상세 개선 계획이다.

- 문서 분류: 현재 프로젝트 기준 improvement plan (09-, 11-, 12- 계획 문서와 동일한 계층)
- 소유 역할: Product/Planning (계획), Mobile Architect (기술 검토), QA/Release (검증 경로)
- 이 문서는 정책 SoT가 아니다. 충돌 시 `AGENTS.md`, `PROJECT_ENVIRONMENT.md`,
  `REPO_OPERATIONS.md`, `mobile-app-dev-team/00-sot-and-principles.md`가 우선한다.

## 조사 방법과 근거 출처

이 계획은 다음 세 가지 검증된 조사에 기반한다.

1. **이 repo 전수 조사**: root 정책 문서, `.agents/skills`(11개), `.codex/agents`(13개),
   `.codex/hooks`(5개), `scripts/` validator 9종, `.github/workflows/quality-gate.yml`,
   `apps/mobile`, `apps/api`, `packages/contracts`, `infra/clawpod/`,
   `docs/plans/work-units/sample-role-handoff/`, `.evidence/` 구조.
2. **OpenClaw cloud 플랫폼 repo 조사** (외부 플랫폼 repo `openclaw-cloud`):
   admin API의 agent 생성 플로우(agent-orchestrator: ConfigMap/Secret/Service/StatefulSet 생성),
   pod entrypoint 14단계 초기화, NATS JetStream 메시징(`CHAT_MESSAGES.{roomId}`),
   A2A MCP 서버(:18789), webhook gateway(GitHub adapter 포함 10종), agent 이미지 구성.
3. **live 샘플 pod 실측** (OrbStack k8s, namespace `clawpod`, `boram-vf7sbm-agent-0`):
   OpenClaw 런타임 + `openai-codex/gpt-5.5` 모델, ConfigMap 주입된
   SOUL.md/AGENTS.md/TOOLS.md/IDENTITY.md, `/workspace/skills`(codex-cli-auth-setup 포함),
   Node 22/git/yarn/Chromium 존재. pnpm은 **10.33.3이 존재하나 repo SoT pin
   `pnpm@9.15.9`(`package.json`의 `packageManager`)와 불일치**하고,
   eas-cli/maestro/Android SDK/adb/emulator/Java/mobile-mcp는 부재, `/dev/kvm`도 없다 —
   checked-in 증거: `.evidence/mobile-qa-env-requirements/orbstack-boram-linux-sot-check.md`.
   canary pod도 동일 구성으로 추정되나 repo에 직접 증거가 남아 있는 것은 boram이다.
   `~/.codex/auth.json` 존재(Secret `OPENAI_CODEX_AUTH_JSON` 주입).

---

## Part A. 현재 상태 진단

### A-1. 이미 동작이 검증된 것

| 영역 | 검증된 사실 | 근거 |
| --- | --- | --- |
| 역할 조직 | 6 LLM 역할 + 비-LLM Gatekeeper 모델, 역할별 SOUL.md 템플릿 | `01-team-composition.md`, `02-role-souls/` |
| Codex 런타임 | repo-local skill 11종, custom agent 13종(verdict reviewer + advisory researcher), hook 5종, MCP(mobile-mcp@0.0.58/serena@v1.5.3/stitch@1.3.2/expo) | `.agents/skills/`, `.codex/agents/`, `.codex/config.toml`, `PROJECT_ENVIRONMENT.md` Codex runtime 절 |
| 게이트 | CI `quality-gate.yml`: `test:runtime` + `turbo lint test` + 조건부 `test:local-harness`; reviewer JSON envelope 검증(`codex-headless-review.mjs`) | `.github/workflows/quality-gate.yml`, `scripts/codex-headless-review.mjs` |
| 핸드오프 | pod-isolated 역할 간 durable handoff는 GitHub branch/commit/PR + `docs/plans/work-units/<work-unit-id>/` 전용 | `10-github-artifact-workflow.md` |
| 수직 슬라이스 | home counter가 contracts import, NativeWind, Jest, RN Web Playwright, Maestro flow, EAS 프로파일 경로를 증명 | `apps/mobile/src/app/index.tsx`, `apps/mobile/.maestro/home.yml`, `apps/mobile/eas.json` |
| EAS 빌딩블록 | `e2e-test` 프로파일(credential-less Android APK + iOS simulator, `apps/mobile/eas.json:7`)과 cloud Maestro job(`apps/mobile/.eas/workflows/e2e-test-android.yml`의 `type: maestro`, `flow_path: ['.maestro/home.yml']`) 정의 존재 | 해당 파일 |
| Pod 플랫폼 | agent 1개 = ConfigMap + Secret + Service + StatefulSet(+ `/workspace` 10Gi PVC) 패턴, NATS 룸 구독, A2A, webhook gateway 라우팅 — live pod로 27시간+ 무중단 실측 | 플랫폼 repo + live pod 실측 |
| Pod 내 웹 E2E 기반 | pod 이미지에 Chromium 내장 → RN Web + Playwright 실행 가능 | live pod 실측, `.evidence/e2e-test/20260609-233244-rn-web-railway-api/` |

### A-2. 검증된 갭 (개선 대상)

| # | 갭 | 근거 | 영향 |
| --- | --- | --- | --- |
| G1 | **work-unit에 기계 판독 상태 없음**: `10-github-artifact-workflow.md`는 stage별 산출물 스키마만 정의. 어떤 stage가 진행 중인지, 다음 행동 주체가 누구인지, 게이트 실패 횟수가 몇인지 기록하는 구조가 없음 | `docs/plans/work-units/sample-role-handoff/`에 상태 파일 부재; `validate-team-doc.mjs`는 문서 텍스트만 검증 | pod가 재시작 후 GitHub만으로 상태를 복원할 수 없고, 어떤 스크립트도 "다음 액션"을 결정 불가 → 자율 파이프라인의 근본 결손 |
| G2 | **오케스트레이션 주체 없음**: skill 11종이 각 역할의 "어떻게"는 정의하지만 "지금 누가 무엇을"은 어디에도 없음 | `.agents/skills/` 전수 확인; `05-work-processes.md`는 산문 | 인간이 매 stage마다 다음 역할을 호출해야 함 |
| G3 | **네이티브 E2E 자동 경로 부재**: mobile-mcp는 local 전용·serial·CI 게이트 금지(`AGENTS.md:46`), Maestro는 device/emulator 필요, pod에는 KVM이 없어 emulator 불가(live pod 실측: Android SDK/adb/emulator 부재). EAS `e2e-test` 프로파일과 cloud Maestro workflow는 존재하지만 robot token 인증 절차와 결과 증거 수집이 미자동화 | `AGENTS.md:46`, `apps/mobile/eas.json:7`, `apps/mobile/.eas/workflows/e2e-test-android.yml`, `infra/clawpod/secret.example.yaml`(EXPO_TOKEN 예시만 존재) | QA/Release pod가 native 증거를 자율 생산 불가 |
| G4 | **pod 부트스트랩 계약 부재**: `codex-preflight.mjs`가 macOS 전제 — codex 후보 경로가 `/opt/homebrew/bin/codex`, `/usr/local/bin/codex`(`scripts/codex-preflight.mjs:8`), arch 판정이 `sysctl -n hw.optional.arm64`(`scripts/codex-preflight.mjs:67`). Linux pod에서 결정적으로 실패. 역할 배정(어느 pod가 어느 역할인지) 규약도 없음 | 해당 파일 | 새 pod가 "나는 역할 X이고 준비됐다"를 스스로 증명할 수 없음 |
| G5 | **human-gate가 기계 판독 불가**: reviewer envelope의 `NEEDS_HUMAN` verdict는 존재하지만(`scripts/codex-headless-review.mjs`), 차단을 *해제*하는 인간 승인 레코드 스키마가 없음. `human-gates.md`/`human-approval.md`는 산문 파일 | `06-gates-and-evidence.md` human gate 절, sample work-unit | `NEEDS_HUMAN` 이후 파이프라인이 자동 재개 불가 |
| G6 | **SoT drift 무방비**: `sot:provenance-refresh:manual`은 advisory placeholder이며 test gate가 아님. `PROJECT_ENVIRONMENT.md`의 버전 핀·Railway URL·CI trigger 목록과 실제 파일(lockfile, `.codex/config.toml`, `quality-gate.yml`) 간 일치를 자동 검사하는 장치 없음 | `package.json` | 에이전트가 SoT로 신뢰하는 문서가 조용히 낡음 |
| G7 | **Stitch 사전점검 부재**: stitch MCP는 Google Cloud ADC + 프로젝트 설정 필요(`PROJECT_ENVIRONMENT.md` MCP 절)인데 preflight가 검사하지 않음 → Design pod가 실행 실패 시점에야 발견 | `PROJECT_ENVIRONMENT.md` | Design stage 자율성 저하 |
| G8 | **증거 위생 자동 검증 부재**: 증거 네이밍 규칙·금지 경로·secret 금지(`06-gates-and-evidence.md`)가 문서로만 존재하고 `.evidence/`/`docs/plans/work-units/` 실파일 검사는 없음(단, `validate-team-doc.mjs`의 team-doc 한정 secret 패턴 스캔 — `secretPatterns` 구현 — 은 수행됨. 라인 번호는 해당 파일이 활발히 수정 중이므로 인용하지 않음) | 해당 파일 | 증거 무결성이 규율에만 의존 |
| G9 | **pod 인프라 갭** (플랫폼 측): ① agent 이미지의 pnpm **pin mismatch**(pod 10.33.3 vs repo SoT `packageManager: pnpm@9.15.9`) — corepack pin 활성화/검증 없이는 frozen-lockfile 설치를 신뢰할 수 없음 ② eas-cli/maestro 없음 ③ GitHub 자격증명 주입·git identity 설정 패턴 없음(boram Secret에는 모델 인증만 존재) ④ webhook gateway에 이 repo PR 이벤트 → 역할 pod 라우팅 규칙 없음 ⑤ 고객 인입(intake) 경로 미정의 | `.evidence/mobile-qa-env-requirements/orbstack-boram-linux-sot-check.md` + 플랫폼 repo 조사 | ①은 PR4(부트스트랩 pin 강제)로, 나머지는 Part D annex로 해소 |

### A-3. 진단 요약

조직 설계·역할 계약·게이트·증거 규율은 성숙해 있으나, 그것을 **구동하는 결정적
(deterministic) 상태·해석기·부트스트랩 계층이 없다**. 즉 "역할이 일하는 방법"은 완성됐고
"조직이 스스로 도는 방법"이 미완성이다. 아래 개선은 전부 이 한 문장으로 수렴한다:
**committed repo 상태만으로 다음 액션이 계산되고, 어떤 pod든 그 계산 결과 중 자기 역할
몫만 실행하게 만든다.** 이는 `10-github-artifact-workflow.md`의 "shared storage 없음,
GitHub만이 durable" 원칙과 `01-team-composition.md`의 "Gatekeeper는 비-LLM 결정적 검사"
원칙의 직접 연장이며, 새 인프라 발명이 아니라 기존 원칙의 기계화다.

---

## Part B. Repo 측 개선 (PR 슬라이스 7개, 의존성 순)

모든 PR은 repo 규칙을 따른다: TDD/validator-first(`AGENTS.md` Required rules),
신규 validator는 `package.json` script + `quality-gate.yml`의 스크립트 정규식 +
`PROJECT_ENVIRONMENT.md` CI 절에 **3중 배선**, 계획·증거는 `.evidence/`에 기록.

### PR1 (P0) — Work-unit 상태머신: `status.json`

- **WHY**: G1. pod-isolated 조직에서 유일한 durable 입력은 committed 파일이므로
  상태도 committed 파일이어야 한다. reviewer verdict가 이미 JSON envelope로 기계화되어
  있는 것(`codex-headless-review.mjs`)과 동일한 패턴을 stage 상태로 확장하는 것.
- **WHAT**:
  - `docs/plans/work-units/<work-unit-id>/status.json` (schema `wu-status/v1`)
  - `scripts/lib/work-unit-machine.mjs` — 상태 enum/전이표/병렬 그룹 공유 모듈
  - `scripts/validate-work-units.mjs` (+ `evals/local-harness/work-units/` fixture:
    valid 1, 불법 전이 1, envelope 누락 1, gatekeeper에 reviewer 지정 1)
  - `docs/plans/work-units/sample-role-handoff/status.json` 샘플 추가
  - 3중 배선 (`test:runtime`에 포함, quality-gate 정규식에 `validate-work-units` 추가)
- **HOW** — 스키마 핵심:

```json
{
  "schema_version": "wu-status/v1",
  "work_unit": "<work-unit-id>",
  "stages": [
    {
      "id": "00-product-planning",
      "role": "product-planning",
      "state": "done",
      "attempts": 1,
      "max_attempts": 3,
      "required_artifacts": ["..."],
      "reviewer": { "agent": "po-planning-reviewer", "verdict": "GO",
                    "envelope_path": "00-product-planning/reviewer-envelope.json" },
      "handoff": { "branch": "wu/<id>/00-planning", "pr": "<pr-url>" }
    }
  ],
  "human_gates": [ { "gate_id": "...", "category": "...", "blocking_stage": "...",
                     "state": "pending", "decision_path": "..." } ],
  "evidence_ladder": { "required_level": "eas-maestro", "achieved_level": "rn-web" },
  "events": [ { "at": "<iso8601>", "actor": "<role>", "type": "stage-completed", "stage": "..." } ]
}
```

  - state enum: `pending | in-progress | review | gate-failed | blocked-human | done | not-applicable`
  - 합법 전이: `pending→in-progress→review→done`; `review→gate-failed→in-progress`(attempts+1);
    `any→blocked-human`(human_gates 항목 필수); `pending→not-applicable`(사유+PRD non-goal 참조 필수)
  - `events`는 append-only — validator가 타임스탬프 단조 증가와 git base 대비 prefix 보존을 검사
  - validator 규칙: `done`은 산출물 실재 + reviewer envelope `GO` 재검증
    (`codex-headless-review.mjs`의 envelope validator 재사용) + handoff 링크 필수;
    `06-gatekeeper` stage는 role이 `gatekeeper-system`이어야 하고 reviewer agent 지정 금지
    (비-LLM 불변식); 선행 stage 미완료 시 `in-progress` 금지 — 단 `02-architecture`와
    `03-contract-api`는 `01-design`이 `review` 도달 후 병렬 허용(명시적 `parallel_groups` 상수)
- **수용 기준**: `--self-test` 통과(invalid fixture가 명명된 사유로 실패),
  `pnpm run test:runtime` green, 샘플 work-unit 검증 통과.

### PR2 (P0) — Human-gate 결정 envelope: `human-gate/v1`

- **WHY**: G5. reviewer가 `NEEDS_HUMAN`을 낼 수는 있으나 해제 레코드가 없으면 자율
  파이프라인은 영구 정지한다. 승인을 기계 판독 가능 + 감사 가능하게 만들어야
  `blocked-human → in-progress` 재개를 validator가 안전하게 허용할 수 있다.
- **WHAT**: `docs/plans/work-units/<id>/00-product-planning/human-gates/<gate-id>.json`
  및 릴리스 승인 `05-qa-release/human-approval.json`. 검증은 PR1 validator에 통합.
  `06-gates-and-evidence.md`에 규범 절 1개 추가.
- **HOW** — 스키마 핵심 필드: `gate_id`, `category`(기존 human gate 카테고리 enum),
  `decision ∈ approved|rejected|deferred`, `scope`, `decided_by{name,contact,channel}`,
  `decision_reference`(GitHub comment/review URL — 신뢰 앵커), `decided_at`,
  `residual_risk[]`, `evidence_links[]`.
  - 결정적 anti-self-approval: `decided_by.name`이 역할명/agent명 목록과 일치하면 거부
  - `failed-gate-risk` 카테고리는 실패한 check 참조 필수
  - 한계 명시: 진위 보장은 GitHub 계정 신원에 앵커된 **정책 수준**이지 암호학적 증명이
    아니다. 온라인 시 orchestrator가 `gh api`로 작성자 확인 후 work-unit event에
    `verified: true | unverifiable-offline` 기록.
- **수용 기준**: fixture 4종(정상 / agent명 승인자 / 미정의 category / failed-gate-risk
  참조 누락) 검증; `blocked-human` stage가 approved 결정 파일 존재 시에만 재개 가능.

### PR3 (P0) — 오케스트레이션: next-action resolver + `wm-orchestrate` skill

- **WHY**: G2. 상태(PR1)와 승인(PR2)이 기계화되면 "다음 액션"은 순수 함수다.
  LLM이 아니라 스크립트가 결정해야 Gatekeeper 결정성 원칙과 일관된다. LLM(skill)은
  결정된 액션의 *실행*만 담당한다.
- **WHAT**:
  - `scripts/work-unit-next.mjs`: `status.json` + 파일시스템 → 다음 액션 JSON 출력.
    `--apply-transition <stage> <state>`는 공유 모듈을 통해서만 상태를 기록(불법 전이는
    기록 시점에 거부 — validate 시점이 아니라).
  - `.agents/skills/wm-orchestrate/SKILL.md`: 어느 역할 pod든 실행하는 단일 진입 skill.
    절차 = pull → resolver 실행 → 자기 역할(`WM_ROLE`) 몫 필터 → 해당 역할 skill 호출 →
    reviewer를 `codex-headless-review.mjs`로 실행 → 전이 적용 → commit/push/PR 갱신.
  - 하드 규칙(SKILL.md 명문): 타 역할 액션 실행 금지, reviewer envelope/human-gate 파일
    수정 금지(pending 요청 생성만 허용), resolver가 `blocked`만 반환하면 정지·보고.
- **HOW** — resolver 출력 계약(요지): `next_actions[]`(stage, role, action ∈
  produce-artifacts | run-reviewer | fix-findings | request-human-gate |
  run-deterministic-checks, skills[], reviewer_required, attempts_remaining)와
  `blocked[]`(사유: human-gate-pending 등). stage→reviewer 매핑은
  `04-skills-and-agents-matrix.md`를 따른다(00→po-planning-reviewer, 01→design-reviewer,
  02/03→wm-contract-reviewer, 04→wm-implementation-reviewer, 05→QA 증거 검사,
  06→결정적 검사만). 재시도 정책: `gate-failed` 시 `wm-gate-fix-advisor` advisory 첨부,
  `max_attempts`(기본 3) 소진 시 `failed-gate-risk` human-gate pending 자동 생성.
- **수용 기준**: fixture로 8 stage 행복 경로, 02/03 병렬, 재시도, 재시도 소진 에스컬레이션,
  human-gate 차단/재개 전부 커버; `--apply-transition` 불법 전이 거부 단위 테스트;
  sample work-unit 사본으로 stage 00 dry-run이 로컬에서 headless reviewer까지 완주.

### PR4 (P0, PR1~3과 병렬 가능) — Pod 부트스트랩 계약

- **WHY**: G4. live pod 실측상 pod에는 Node 22/git/Chromium이 있고
  `/workspace/skills/codex-cli-auth-setup`이 이미 동작 패턴으로 존재한다
  (`09-pod-native-openclaw-skill-plan.md`). 같은 패턴으로 "역할 부트스트랩"을 추가하고,
  macOS 전용인 preflight를 pod에서 동작하게 확장하면 된다.
- **WHAT**:
  - `scripts/codex-preflight.mjs`에 `--pod` 모드: codex 후보 경로에 `which codex` +
    `CODEX_BIN` env 추가, arch 판정을 `uname -m` 우선으로 교체(기존 macOS 경로 유지),
    검사 항목 추가 — node major 22, pnpm `9.15.9` pin 일치(**불일치 시 fail** — boram 실측
    10.33.3 근거), git identity, `gh auth status`,
    Chromium 존재(`rn-web-capable`), `.codex/config.toml` 파싱 + `codex mcp list` 종료코드,
    역할 컨텍스트 fixture 존재. 출력에 `capabilities` 블록:
    `{ "rn_web_e2e": bool, "native_e2e_local": false, "eas_cloud": <EXPO_TOKEN 존재 여부 status-only> }`.
    auth token 값은 출력하지 않음(기존 codex-cli-auth-setup 가드 계승).
  - pod-native skill 소스 `09-pod-native-openclaw-skills/pod-role-bootstrap/`
    (`SKILL.md` + `scripts/pod-bootstrap.sh` + `references/report-template.md`):
    역할 해석(`WM_ROLE` env 우선, fallback `/workspace/IDENTITY` 1행, 불일치 시 hard fail) →
    repo clone(주입 토큰; `infra/clawpod/agent-runner.yaml`의 initContainer 패턴 재사용) →
    corepack으로 pnpm `9.15.9` 활성화(pin mismatch 해소) → `pnpm install --frozen-lockfile` →
    `codex-preflight --pod --json` → 역할 skill 디렉토리
    실재 확인 → 보고서를 `/workspace/state/`에 기록.
  - `validate-team-doc.mjs`의 pod-skill 검사에 신규 skill 소스 등록(기존
    codex-cli-auth-setup 검사 패턴 확장; shell script secret-출력 금지 regex 포함).
- **수용 기준**: preflight `--self-test`에 Linux형 fixture 추가 통과; 노트북에서
  `--pod`는 우아하게 skip; validate:team-doc이 skill 소스 누락/secret 출력 시 실패.

### PR5 (P1) — 네이티브 E2E 전략: EAS cloud 일차 경로 + 증거 사다리

- **WHY**: G3. in-pod emulator는 **명시적으로 기각**한다 — KVM/중첩 가상화가 pod 런타임에
  없고(실측), 대규모 병렬은 `AGENTS.md:46`의 직렬화 원칙과도 충돌한다. 반면 이 repo에는
  이미 자율화 가능한 cloud 경로가 잠들어 있다: `eas.json`의 `e2e-test` 프로파일
  (credential-less Android APK + iOS simulator)과 `e2e-test-android.yml`의 cloud Maestro
  job. 빠진 것은 ① robot token 인증의 pod-native 표준화 ② 결과를 `.evidence/`로 끌어오는
  ingestion ③ "어느 수준의 증거가 언제 필수인가"의 규범이다.
- **WHAT**:
  - 신규 문서 `14-native-e2e-strategy.md` — 증거 사다리(evidence ladder) 규범:
    - L0 `jest`: 항상 (CI)
    - L1 `rn-web`: RN Web + Playwright, 모든 UI 작업 필수. pod 내 Chromium으로 실행 가능
      (RN Web이 검증하지 못하는 범위는 `PROJECT_ENVIRONMENT.md` Mobile Web E2E 절을 따름)
    - L2 `eas-maestro`: EAS cloud build + cloud Maestro. native module/권한/네비게이션
      컨테이너/release candidate 접촉 시 필수
    - L3 `human-device`: mobile-mcp/실기기 QA — `human-gate/v1` 결정으로 기록, production
      submit 전 필수
    - stage 00에서 Product/Planning이 `status.json.evidence_ladder.required_level` 설정,
      `validate-work-units.mjs`가 `05-qa-release` 완료 전 `achieved_level >= required_level`
      또는 `failed-gate-risk` waiver 존재를 강제
    - `.maestro/home.yml`의 `appId: {{ANDROID_PACKAGE}}`는 generation-time placeholder다
      (boram SoT check 증거 문서에 기록) — runtime env가 아니므로 L2 실행 전에 appId
      파라미터화/주입 방안을 이 문서에서 규정해야 한다
  - pod-native skill `09-pod-native-openclaw-skills/eas-robot-auth-setup/`:
    `EXPO_TOKEN` 존재 status-only 확인, `npx eas-cli whoami` 종료코드, `EAS_PROJECT_ID`
    링크 확인. 값 출력 절대 금지. token은 `infra/clawpod/secret.example.yaml` 패턴으로 주입.
  - `scripts/ingest-eas-evidence.mjs`: eas-cli JSON 출력(`eas build:view --json` 등, 버전
    핀 고정 — `@latest` 금지 정책 준수) → `.evidence/e2e-test/<YYYYMMDD-HHMMSS>-eas-<slug>/result.json`
    (build id, commit SHA, Maestro flow 결과, artifact URL, 종료 상태) + `05-qa-release/`
    요약 블록 생성. URL query token redaction. 네트워크 없는 `--self-test`(녹화 fixture).
  - `.agents/skills/e2e-test/SKILL.md`에 native ladder 절 추가(트리거 → 폴링 → ingest →
    실패 분류).
  - iOS는 Android 경로 검증 후 후속(P2)으로 `e2e-test-ios.yml` 추가 — 본 계획 범위 외로 명시.
- **수용 기준 (오프라인 — 선행 실행 가능)**: ingest `--self-test` 통과(녹화 fixture, 네트워크 0)
  + 캐노니컬 증거 경로 패턴 일치; ladder 강제 validator 동작; `14-native-e2e-strategy.md`가
  `validate:team-doc` 통과.
- **수용 기준 (live — human/ops 승인 후에만)**: **실증 1회**(인간이 `EXPO_TOKEN`/
  `EAS_PROJECT_ID`/GitHub-EAS 연동을 승인·주입 → PR에서 `e2e-test-android.yml` 실행 →
  증거 ingest). 승인·주입 전에는 `eas whoami`를 포함한 어떤 EAS 명령도 실행하지 않으며,
  native 검증 완료를 주장하지 않는다.

### PR6 (P1) — SoT refresh / drift 자동 검출

- **WHY**: G6. 에이전트 조직은 문서를 SoT로 신뢰하므로 drift는 조용한 오작동의 최대
  원인이다. placeholder를 "수동 절차 + 자동 검출"의 명시적 정책으로 전환한다.
- **WHAT**:
  - `package.json:20`의 placeholder를 `node scripts/sot-snapshot-check.mjs`로 교체:
    `evals/local-harness/sot/snapshot.json` 스키마/page-ID 목록 일치 검증 + `refreshed_at`
    30일 초과 경고(경고만, CI 비차단). 실제 re-fetch는 Atlassian MCP 수동/에이전트 절차로
    `evals/local-harness/README.md`에 규범화(네트워크·MCP 인증이 CI-unsafe하므로).
  - `scripts/validate-project-environment.mjs`(오프라인, `test:runtime` 포함):
    `PROJECT_ENVIRONMENT.md`의 핀 vs 실파일 — `packageManager`, expo/react-native/nativewind
    /tailwind/playwright 버전(`apps/mobile/package.json`), lightningcss override,
    MCP 핀(`.codex/config.toml`), CI trigger 경로 목록(`quality-gate.yml` 정규식) 일치 검사.
    `--online` 모드(PR 게이트 제외): Railway QA API `/livez`·`/readyz` 응답 확인.
  - `.github/workflows/sot-drift.yml`: 주간 cron, `--online` + snapshot age 검사,
    drift 시 GitHub issue 생성/갱신(비차단 — PR 게이트는 오프라인·결정적 유지).
- **수용 기준**: 핀을 한 곳만 수정한 mutated fixture에서 실패; PR 게이트 네트워크 무의존.

### PR7 (P2) — 하드닝: Stitch preflight, mobile-mcp 핀 drift, 증거 위생

- **WHY**: G7, G8. 모두 실패를 실행 시점에서 사전점검 시점으로 당기는 작업.
- **WHAT**:
  - `codex-preflight --pod`에 design 역할 한정 블록: ADC 파일/`GOOGLE_APPLICATION_CREDENTIALS`
    존재, `GOOGLE_CLOUD_PROJECT` 비어있지 않음, `stitch-mcp` 핀 버전 resolve — 전부
    status-only, 값 출력 금지.
  - mobile-mcp: `.codex/config.toml` 핀 vs `PROJECT_ENVIRONMENT.md` 표기 drift 검사
    (오프라인, PR6 validator에 포함). 실행 검사를 CI에 넣지 않음(`AGENTS.md:46` 준수).
  - `scripts/validate-evidence-hygiene.mjs`(`test:runtime` 포함): `.evidence/e2e-test/`
    디렉토리명 `^\d{8}-\d{6}-[a-z0-9-]+$` 강제, 금지 경로(`local/`, `tmp/`, `raw/`, `*.log`)의
    커밋 차단(`.gitignore` 일치 확인), `.evidence/` + `docs/plans/work-units/` 전체에
    secret 패턴 스캔(`validate-team-doc.mjs`의 team-doc 한정 secret 패턴 스캔 동작을
    공유 모듈로 추출해 재사용하되, 라인 번호는 해당 파일이 활발히 수정 중이므로 인용하지 않음).
- **수용 기준**: 현재 트리 통과; planted-secret fixture가 파일+라인으로 실패;
  비-design 역할 preflight는 Stitch 블록 skip.

---

## Part C. Pod 조직 설계 (boram 패턴 재사용)

### C-1. 토폴로지 — 역할당 1 pod, 총 6 pod + CI Gatekeeper

| Pod 이름(요청명) | Operating Role | 이미지 | 자원 | 비고 |
| --- | --- | --- | --- | --- |
| `wm-po` | Product/Planning | agent-mobile **lite** | 2 CPU / 4Gi | 문서/계획 중심, GUI 불필요 |
| `wm-design` | Design | agent-mobile **full** | 2 CPU / 4Gi | Stitch MCP + 시각 확인용 Chromium/noVNC |
| `wm-arch` | Mobile Architect | agent-mobile **lite** | 2 CPU / 4Gi | 리뷰/계약 co-sign 중심 |
| `wm-mobile-dev` | Mobile App Dev | agent-mobile **full** | **4 CPU / 8Gi** | Metro bundler + pnpm install + Chromium 동시 부하가 boram 기준(2C/4Gi) 초과 |
| `wm-api` | Backend/API Integrator | agent-mobile **lite** | 2 CPU / 4Gi | Hono/Drizzle + Railway 배포 |
| `wm-qa` | QA/Release | agent-mobile **full** | **4 CPU / 8Gi** | Playwright 스크린샷 증거 + EAS/Maestro cloud 트리거 |

근거와 결정:

- **1역할 1pod**: `10-github-artifact-workflow.md`가 역할 격리 + GitHub-only handoff를
  전제하고, reviewer agent 분리(`.codex/agents/*-reviewer.toml`)가 행위자 분리를 가정한다.
  플랫폼은 agent당 ConfigMap/Secret/StatefulSet을 이미 지원하므로(검증) 추가 인프라가 없다.
- **Gatekeeper는 pod가 아니다**: `01-team-composition.md`의 비-LLM 결정성 원칙. GitHub
  Actions required check(`quality-gate.yml` + PR1/PR7 validator)가 Gatekeeper의 실체이며,
  work-unit의 `06-gatekeeper/` 파일은 CI 결과의 *전사*다 — LLM이 pass/fail을 판단하지 않는다.
- **별도 PM/오케스트레이터 pod를 만들지 않는다**: Product/Planning이 SoT상 intake·routing·
  readiness 소유자(Authority Level: Executive / Delivery Lead)다. 7번째 LLM 조정자는 SOUL
  미정의 역할을 신설하는 것이고, PR3의 resolver가 결정적이므로 조정 "판단"이 필요한 지점은
  이미 `wm-po`의 권한 범위다.
- 비용 제약 시 `wm-po`+`wm-arch`(둘 다 문서/리뷰 중심)는 1 pod 2 IDENTITY로 축약 가능하나,
  1단계에서는 6 pod를 유지한다(라우팅 규칙 단순화 + 리뷰 행위자 분리).

### C-2. 프로비저닝 내용 (ConfigMap / Secret / skills)

**ConfigMap** (`{AGENT_ID}-agent-config`, boram과 동일 메커니즘):

- `SOUL.md`: `02-role-souls/<role>-soul.md` 그대로 (runtime template note 준수)
- `IDENTITY.md`: Display Title, Operating Role, 소유 stage(예: QA/Release →
  `05-qa-release/`), 상류/하류 역할, NATS 룸 규약
- `AGENTS.md`(pod용): boram 베이스 + **GitHub handoff protocol 절** 추가 — repo URL,
  `/workspace/new-mobile-app`로 clone-on-demand, 브랜치 규약 `wu/<work-unit-id>/<stage>`,
  `docs/plans/work-units/<work-unit-id>/` 스키마 요약, 그리고 핵심 규칙
  "로컬 파일/채팅으로 핸드오프 금지 — push된 branch/PR + NATS 신호만 유효"
- `TOOLS.md`: boram 베이스(filesystem, playwright, memory, a2a, skill-store) + 역할 추가분

**Secret** (최소 권한 원칙):

| Pod | Secret 키 |
| --- | --- |
| 전체 6 pod | `OPENAI_CODEX_AUTH_JSON`(boram 검증 패턴), `GITHUB_TOKEN`(repo 한정 fine-grained; 역할별 bot 계정 분리 권장 — PR 리뷰/승인 귀속성) |
| `wm-qa`만 | `EXPO_TOKEN`(EAS robot, `infra/clawpod/secret.example.yaml` 패턴), Railway 헬스체크용 read 토큰 |
| `wm-api`만 | `RAILWAY_TOKEN`(배포) — `qa-railway-workflow`가 "배포는 API, 증거는 QA"로 분리되는 가장 깨끗한 구도 |
| `wm-design`만 | Stitch용 Google ADC |

**`/workspace/skills`** (pod-native): 전 pod에 `codex-cli-auth-setup` +
`pod-role-bootstrap`(PR4); `wm-qa`에 `eas-robot-auth-setup`(PR5);
`wm-design`에 `stitch-adc-setup`.
repo-local `.agents/skills`/`.codex/agents`는 clone 후 자동 가용이므로 ConfigMap에
중복 탑재하지 않는다.

### C-3. 이미지/툴체인 요구 (요지 — 상세는 Part D annex)

`clawpod/agent-mobile` (base 이미지 파생):

- 추가: pnpm **pin 강제** — 현재 이미지에는 pnpm 10.33.3이 이미 탑재되어 있으므로(boram
  실측 증거) 설치가 아니라 `corepack enable` + `pnpm@9.15.9` 활성화로 SoT pin과 일치시키고,
  부트스트랩/preflight는 불일치 시 fail. eas-cli(전역), maestro CLI(**cloud 업로드
  모드 전용** — 로컬 드라이버 불필요), watchman(장시간 `expo start --web` 세션의
  file-watch 안정성), repo lockfile로 pnpm store warm-up 레이어
- **명시적 제외**: Android SDK / adb / emulator 이미지 — KVM 부재로 사용 불가하며
  이미지만 ~수 GiB 비대화. 네이티브는 EAS cloud로 일원화(PR5 근거)
- `lite` 변형(po/arch/api용): base lite + pnpm + gh만

### C-4. 조정(coordination) 모델 — "GitHub가 상태, NATS는 초인종"

- **GitHub = 유일한 durable handoff**: `10-github-artifact-workflow.md` SoT 그대로.
  어떤 pod가 죽어도 clone + `status.json`(PR1)만으로 전체 상태 복원.
- **NATS 팀 룸 = wake-up 신호**: 단일 팀 룸(boram의 룸 구독 메커니즘 재사용)에 구조화
  신호만: `HANDOFF work-unit=<id> stage=<stage> pr=<url> next=<role>`. 신호 유실은
  webhook 경로가 보완하므로 신뢰성 요구 없음.
- **A2A = 동기 Q&A 전용**: 예) dev pod가 api pod에 계약 필드 질의. pod AGENTS.md에 규칙
  명문화 — "A2A로 도달한 결정은 work-unit 디렉토리에 기록되어야만 유효". 플랫폼 한도
  (동시 sub-agent 4, 메시지 depth 5) 준수.
- **Webhook gateway 규칙 3종**(GitHub adapter, ops 설정):
  1. PR opened/synchronized + label `next:<role>` → 해당 역할 pod 룸으로 라우팅
  2. check_suite failure (`wu/*` 브랜치) → `wm-qa`(실패 분류 소유) + stage 소유 pod
  3. PR merged (`wu/*`) → `wm-po` (stage 전진/종결)

### C-5. E2E 실행 트레이스와 단절점

"고객이 기능 X를 요청"의 전체 경로:

1. 인입 → `wm-po` 룸 (webhook gateway generic adapter 또는 운영 채널) →
   `po-prd-to-execution` + `po-work-unit-planning-and-agent-sprint` → work-unit 생성,
   `status.json` 초기화, `evidence_ladder.required_level` 설정, PR(label `next:design`)
2. `wm-design` wake → `design-mobile-design-handoff`(+Stitch) → `01-design/` → review
3. `wm-arch` → `02-architecture/` + 계약 co-sign (02/03 병렬 그룹)
4. `wm-api` → `packages/contracts` + `apps/api` 구현 → Railway preview 배포 + smoke
5. `wm-mobile-dev` → `apps/mobile` 구현(TDD) → RN Web Playwright 자가 검증 → 코드 PR
6. `wm-qa` (PR webhook으로 wake) → in-pod Playwright RN Web 증거 →
   `EXPO_TOKEN`으로 EAS cloud build + cloud Maestro 트리거 → `ingest-eas-evidence.mjs` →
   `05-qa-release/` 완성
7. Gatekeeper(CI) → required check 결정적 판정 → `06-gatekeeper/`에 전사
8. Human release gate → `human-approval.json`(PR2) 승인 전까지 production submit 차단

**단절점 표** (오늘 이 트레이스가 끊기는 지점과 수선 위치):

| # | 단절점 | 수선 | 위치 |
| --- | --- | --- | --- |
| B1 | pnpm pin mismatch(pod 10.33.3 vs SoT 9.15.9) → frozen-lockfile 설치 신뢰 불가 | pod-role-bootstrap의 corepack pin + preflight mismatch fail (+이미지 핀 정렬) | PR4 + annex |
| B2 | GitHub 자격증명/identity 미주입 → push/PR 불가 | 역할별 Secret + pod-role-bootstrap | ops + PR4 |
| B3 | webhook 규칙 없음 → QA가 PR에 깨어나지 못함 | 규칙 3종 등록 | annex (ops 설정) |
| B4 | EXPO_TOKEN/Railway/ADC가 예시로만 존재 | Secret 실주입 런북 | ops |
| B5 | work-unit 상태/증거 required check 부재 → Gatekeeper가 부분적으로 선언적 | PR1/PR2/PR7 validator + branch protection | 이 repo |
| B6 | EAS 트리거·ingest 실행 경로 부재 | PR5 | 이 repo |
| B7 | human gate 통지 채널 부재 | required reviewer/environment protection + 에스컬레이션 | 이 repo + ops |
| B8 | 고객 인입 경로 미정의 | generic adapter → `wm-po` 룸 + 인입 포맷 문서 | annex + 이 repo 문서 |

### C-6. 장애/에스컬레이션 모델

- **게이트 실패 루프**: check failure webhook → `wm-qa` 실패 분류(`failure-classification.md`,
  소유 역할 지명) → NATS `HANDOFF ... next=<owner>` → 동일 `wu/*` 브랜치에서 수정 → 재검.
  재시도 예산 stage당 3회(PR1 `max_attempts`) — 소진 시 `failed-gate-risk` human-gate 자동
  생성(PR3). "실패 게이트의 위험 수용"은 LLM 권한 밖(QA SOUL 금지 조항 준수).
- **정체 감지**: 이 repo의 scheduled workflow(cron)가 무활동 N시간 초과 `wu/*` PR에
  stale 코멘트 → webhook → `wm-po` wake. 결정적 계층(CI)에 두는 이유는 Gatekeeper 철학과
  동일 — 감지는 판단이 아니다.
- **인간 에스컬레이션**: webhook gateway의 메시징 adapter로 `ESCALATE` 태그 메시지를
  인간 채널로 fan-out. 트리거: production submit, 결제/PII/법무, failed-gate 위험 수용,
  재시도 소진, 해소 불가 blocker.

---

## Part D. OpenClaw cloud 플랫폼 요구사항 Annex (이 repo 외부)

이 절은 **요구사항 명세**다. 플랫폼 repo 직접 수정은 이 repo의 정책 범위 밖이며
(`12-ref-organization-goal-plan.md` Out of scope 원칙과 동일), 플랫폼 운영자가 이 절만
읽고 구현 가능해야 한다. 이 절의 모든 항목(이미지 빌드/푸시, webhook 규칙, pod 생성,
Secret/token 발급·주입, branch protection, release environment protection, bot 계정)은
**인간/ops 승인이 기록되기 전에는 실행하지 않는다** — repo 실행 항목이 아니라
ops 요구사항 annex로만 유지한다.

1. **이미지 `clawpod/agent-mobile` (+`:lite`)**: C-3 명세. arm64(OrbStack)/amd64 동시 빌드.
   수용 기준 — full 이미지에서 `pnpm install && pnpm -F mobile exec expo start --web`가
   headless로 동작하고 Playwright가 통과; `eas whoami`가 robot token으로 성공;
   base 대비 증가분 합리적 수준(<~1.5Gi).
2. **webhook gateway 규칙**: C-4의 3종. label 기반 라우팅이 rules engine에 없으면 라벨
   파싱 연산자 추가 필요(요구사항으로 전달).
3. **agent 생성 payload 6종**(admin API): 이름/모델/자원(C-1 표), ConfigMap 4파일(C-2),
   Secret 키 목록(값은 redacted) — 런북에 템플릿으로 기록.
4. **k8s Secret 실주입 런북**: `GITHUB_TOKEN`(역할별), `EXPO_TOKEN`(QA), `RAILWAY_TOKEN`(API),
   Google ADC(Design). 값 출력/커밋 금지 규칙 준수.
5. **GitHub 측 ops**: `main` branch protection + required checks(quality-gate + PR1/PR7
   validator), release environment protection(인간 reviewer), 역할별 bot 계정.

---

## Part E. 실행 순서와 최종 검증 드릴

### E-0. 실행 범위 결정 (2026-06-10 scope review 반영)

scope review(`.evidence/reviews/pod-organization-e2e-improvement-plan-scope-review-20260610.md`,
`...-rereview-20260610.md`, verdict NO_GO → 본 정정으로 해소 대상)와 운영자 피드백에 따라
실행 범위를 다음과 같이 한정한다.

이후 상세 적용성 판정이 완료되었다:
`.evidence/reviews/pod-organization-e2e-applicability-detailed-20260610.md`
(1차 xhigh NO_GO → 정정 → 재검토 `...-xhigh-rereview-20260610.md` verdict **GO**).
이 GO는 "상세 적용성 보고서가 SoT 기준으로 수용 가능하다"는 의미로 한정되며,
구현 승인·PR-ready·live pod readiness·native E2E 완료 승인이 아니다. 적용성 판정 시점에
전체 `test:runtime`은 사용자 지시로 skip되었으므로(동시 세션이 해당 영역 수정 중),
**PR1 착수 전에 동시 세션 안정화 후 전체 게이트를 재실행·기록(re-baseline)하는 것이
선행 조건이다.**

- **즉시 실행 가능 (repo 내부, 오프라인)**: 본 문서 fact 정정 → PR1 → PR2 → PR3,
  PR4(정정 후 병렬 가능), PR6/PR7, PR5의 오프라인 작업(전략 문서·증거 사다리·ingest
  스크립트의 fixture self-test·스키마 설계)까지.
- **human/ops 승인 기록 후에만**: Part D 전체(이미지 빌드/푸시, webhook 라우팅, pod 생성,
  Secret/token 발급·주입, branch protection, release environment protection, bot 계정),
  PR5 live EAS 실증(`eas whoami` 포함 모든 EAS 실행), multi-pod rollout 드릴.
- **항상 금지**: production submit 자동화, release human gate 약화(`human-approval` 부재 =
  release 차단 유지), Gatekeeper를 pod/LLM/custom agent/SOUL.md 소유자로 모델링,
  RN Web/Railway 증거의 native 증거 대체 취급, 로컬 harness/소스 리뷰의 실제
  OrbStack/OpenClaw 실행·branch protection·EAS submit·webhook 동작 증명 취급.

### E-1. 순서

| 단계 | 내용 | 차원 |
| --- | --- | --- |
| 1 | PR1 → PR2 → PR3 (오케스트레이션 코어) | repo |
| 2 | PR4 (부트스트랩; 1과 병렬 가능) | repo |
| 3 | annex 1 이미지 빌드 + `wm-po`/`wm-mobile-dev` 2 pod 선행 생성, clone/push/PR 검증 (B1·B2 해소 확인) | 플랫폼/ops |
| 4 | required check 등록 (B5) — Gatekeeper 실체화 | repo+ops |
| 5 | 나머지 4 pod + webhook 규칙 (B3·B8) | ops |
| 6 | PR5 + EXPO_TOKEN 주입 + 실증 1회 (B4·B6) | repo+ops |
| 7 | PR6, PR7, 에스컬레이션/정체 감지 (B7) | repo |
| 8 | 최종 드릴 | 전체 |

3·5·6단계와 4단계의 ops 부분(branch protection 등), 8단계 multi-pod 드릴은
**human/ops 승인 기록 후에만** 진행한다(E-0). PR5는 오프라인 repo 작업을 먼저 진행하고
live EAS 실증은 승인·토큰 주입 후로 분리한다.

### E-2. 최종 수용 기준 (드릴)

합성 기능 요청 1건을 `wm-po`에 주입했을 때, **human release gate 전까지 인간 개입 0회**로:

- 전 stage `status.json`이 합법 전이만으로 `done` 도달
- RN Web Playwright 증거(스크린샷 포함) + EAS build ID가 포함된 `eas-evidence` 산출
- 모든 required check green, `06-gatekeeper/`는 CI 전사만 포함
- `human-approval.json` 부재 상태에서 release 진행이 차단됨(차단이 곧 성공 조건)

보조 드릴: ① 임의 pod kill 후 GitHub만으로 상태 복원 ② 고의 테스트 실패 → 3회 재시도 →
`failed-gate-risk` human-gate 자동 생성 → 인간 채널 ESCALATE 도달 ③ 정체 PR stale 감지.

## 리스크와 한계 (명시)

- `status.json` 병합 충돌(02/03 병렬): append-only events + stage별 브랜치 규약으로 완화,
  최종 병합 책임은 `wm-po` — PR1 문서에 규칙 명문화.
- human-gate 진위는 GitHub 계정 신원 앵커의 **정책 수준** 보증이다(암호학적 아님).
- EAS robot token 발급·GitHub↔EAS 연동은 본질적으로 1회 인간 셋업이다 — 자동화 약속이
  아니라 기록되는 human gate로 관리한다.
- 로컬 harness가 pod 실행을 증명하지 않는다는 기존 한계(`AGENTS.md` Local harness scope)는
  유지된다 — pod 실측 검증은 E-1 3단계/8단계의 운영 드릴이 담당한다.

## Human Gates (이 계획 자체)

다음은 인간 승인 없이 진행하지 않는다:

- 플랫폼 repo 직접 수정(annex는 요구사항 전달까지만)
- production submit 자동화 또는 release human gate 약화
- 역할별 GitHub bot 계정/토큰 발급, EAS robot token 발급
- 6 pod 동시 생성에 따르는 비용 확정
