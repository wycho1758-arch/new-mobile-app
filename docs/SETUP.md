# SETUP.md

이 문서는 템플릿 repo를 클론 또는 생성한 후 Agent가 모바일 앱 작업을 시작하기 위한 최소 준비 절차를 설명합니다.

---

## (a) 사전 준비 — 외부 서비스 등록

전체 절차는 사전 등록 가이드를 먼저 확인하세요:
https://wondermove-official.atlassian.net/wiki/spaces/mobileappd/pages/1372422154

### 필수 서비스 8종

| 서비스 | 용도 | 담당 |
|--------|------|------|
| Codex / OpenAI | Agent 런타임 LLM | Human owner |
| Google Stitch | 디자인 시스템 저작·export | Human owner (Design agent 소유) |
| Jira | 태스크·이슈 트래킹 | Human owner |
| Confluence | 지식 베이스·SoT 문서 | Human owner |
| GitHub | 소스 코드·PR·CI | Human owner |
| Expo account/org + EAS project | 클라우드 빌드·OTA·submit | Human owner (구독 필요) |
| Expo Robot user token | Agent의 EAS CLI 비대화식 인증 | Human owner → Secret 주입 |
| ClawPod k8s Secret 권한 | infra/clawpod Secret 적용 권한 | Human owner (ops) |

> 사전 등록 가이드 §2 "필수 서비스" 원문을 참조하세요. 위 표는 요약이며, 세부 등록 절차는 가이드 §5 Day 0/Day 1 체크리스트에 있습니다.

---

## (b) pnpm install 절차

```bash
# corepack 활성화 (Node 22 이상)
corepack enable

# pnpm 버전 고정 (packageManager 필드와 일치)
corepack prepare pnpm@9.15.9 --activate

# 의존성 설치 (repo root에서)
pnpm install
```

설치 후 `@template/contracts`가 `apps/mobile` 및 `apps/api`에서 해석되는지 확인합니다:

```bash
pnpm turbo run lint test
```

---

## (c) eas init 절차

`eas init`은 Expo 계정과 EAS project가 연결된 후 Human owner가 실행하는 단계입니다.

```bash
# apps/mobile 디렉터리에서 실행 (eas.json과 같은 레벨)
cd apps/mobile
npx eas-cli@latest init
```

`eas init` 완료 후 확정되는 `EAS_PROJECT_ID`(UUID)를 `infra/clawpod/secret.example.yaml`의 `EAS_PROJECT_ID` 값으로 반영하고, k8s Secret을 재적용합니다.

> **Human owner 단계**: `eas init`은 Expo 계정 인증이 필요한 대화식 명령입니다. Agent는 `EXPO_TOKEN`이 주입된 후에야 EAS CLI를 비대화식으로 실행할 수 있으며, `eas init` 자체는 Robot user로 실행하지 않습니다.

---

## (d) 로컬 검증 명령

### 기본 검증 (의존성 해석 + 유닛 테스트 + 타입 체크)

```bash
# 워크스페이스 전체 lint + test
pnpm turbo run lint test

# apps/mobile 유닛 테스트만
pnpm --filter mobile test

# apps/api 유닛 테스트만 (apps/api 포함 시)
pnpm --filter @template/api test
```

### apps/api 포함 시 — 운영자 bootstrap 4단계 (SoT §15.4)

apps/api를 포함하는 프로젝트에서 로컬 DB 검증을 수행하려면 아래 4단계를 순서대로 실행합니다.
이 단계는 Agent 작업이 아닌 운영자 단계입니다 (DB 프로비저닝은 Agent 런타임 이미지에 DB CLI가 없으므로 운영자가 수동 실행).

```bash
# 1. 로컬 PostgreSQL 16 기동
docker compose -f apps/api/compose.yaml up -d

# 2. DATABASE_URL 주입 (예시 — 실제 값으로 교체)
export DATABASE_URL="postgres://app:app@localhost:5432/app"

# 3. 앱 부팅 — migrate()가 1회 실행되어 스키마 적용
pnpm --filter @template/api dev
# (기동 확인 후 Ctrl+C)

# 4. 같은 부팅을 한 번 더 실행 — 마이그레이션 멱등 확인 (변경 0건)
pnpm --filter @template/api dev
```

### 컨테이너 이미지 빌드 검증 (apps/api 포함 시)

```bash
# repo root에서 실행 (Dockerfile이 모노레포 컨텍스트를 요구)
docker build -f apps/api/Dockerfile .
```

---

## (e) Human-gate (외부 서비스 연결 + 핸드오프 체크리스트)

아래 항목은 Expo 계정, EAS project, Store 계정 등 외부 서비스 연결이 완료된 후에만 검증 가능합니다.
로컬 자동화만으로는 실행할 수 없으며, Human owner의 계정/토큰 준비 후에만 가능합니다.

전체 등록 절차 원문은 사전 등록 가이드를 참조하세요:
https://wondermove-official.atlassian.net/wiki/spaces/mobileappd/pages/1372422154

---

### Day 0 — 비용 없이 시작 (담당: Human owner)

참조: 사전 등록 가이드 §5 Day 0

- [ ] GitHub repo 생성 및 팀 초대 (Human owner)
- [ ] Expo account 생성 및 org 설정, EAS project 초기화 준비 (Human owner)
  - 참조: `apps/mobile/eas.json`, `apps/mobile/app.config.ts`
- [ ] Confluence SoT 접근 권한 확인 (Human owner)
  - 참조: https://wondermove-official.atlassian.net/wiki/spaces/mobileappd/pages/1371963427
- [ ] Jira project 생성 및 팀 멤버 초대 (Human owner)
- [ ] Codex / OpenAI 계정 및 API 접근 확인 (Human owner)
- [ ] Google Stitch 접근 및 Design agent 소유권 확인 (Human owner)
  - 참조: `DESIGN.md`, `docs/design-references/`
- [ ] ClawPod k8s Secret 적용 권한 확인 (Human owner — ops)
  - 참조: `infra/clawpod/secret.example.yaml`, `infra/clawpod/agent-runner.yaml`
- [ ] 무료 우선 원칙 확인 — 결제 항목(Apple Developer, Google Play Console, Expo paid plan)은 아래 단계에서 판단

---

### Day 1 — dry-run 전 (담당: Human owner)

참조: 사전 등록 가이드 §5 Day 1

- [ ] `eas init` 실행 → EAS_PROJECT_ID(UUID) 확정 (Human owner)
  - 실행 위치: `apps/mobile/` (eas.json과 같은 레벨)
  - 명령: `npx eas-cli@latest init`
  - 완료 후: 확정된 UUID를 `infra/clawpod/secret.example.yaml`의 `EAS_PROJECT_ID` 값으로 반영하고 k8s Secret 재적용
- [ ] Expo org Robot user 생성 및 최소 권한 부여 (Human owner)
  - 참조: Expo programmatic access 문서, `infra/clawpod/secret.example.yaml`
  - 원칙: token 원문을 문서/채팅/repo에 평문 저장 금지
- [ ] EXPO_TOKEN k8s Secret 생성 및 agent-runner에 주입 (Human owner → ops)
  - 참조: `infra/clawpod/secret.example.yaml`, `infra/clawpod/agent-runner.yaml`
  - 주입 후 Agent가 EAS CLI를 비대화식으로 실행 가능
- [ ] GitHub Actions quality-gate 동작 확인 — PR push 후 `.github/workflows/quality-gate.yml` green (Human owner)
- [ ] `infra/clawpod/secret.example.yaml` 기반으로 실제 k8s Secret manifest 작성 후 적용 (Human owner — ops)
  - 주의: `${...}` placeholder를 실제 값으로 치환 후 적용, 실제 값이 담긴 파일은 커밋 금지
- [ ] 템플릿 변수 렌더링 계획 수립 — `{{ANDROID_PACKAGE}}` 등 `{{...}}` placeholder를 프로젝트 생성 시 치환할 도구/절차 확인 (Human owner)
  - 참조: SoT §3 "템플릿 변수 렌더링 규약"
- [ ] `DATABASE_URL` Secret 준비 (apps/api 포함 시, Human owner — ops)
  - 참조: `docs/CREDENTIALS.md` DATABASE_URL 섹션

---

### Preview / Internal build 전 (담당: Human owner)

참조: 사전 등록 가이드 §5 Preview/Internal build 전

- [ ] EAS build (e2e-test profile) 트리거 확인 — `EXPO_TOKEN` Secret 주입 후 EAS Workflows 실행 (Human owner)
  - 참조: `apps/mobile/.eas/workflows/e2e-test-android.yml`
- [ ] Maestro E2E live 실행 — EAS build 완료 후 emulator에서 `.maestro/home.yml` 실행 확인 (Human owner)
  - 참조: `apps/mobile/.maestro/home.yml`, `apps/mobile/.eas/workflows/e2e-test-android.yml`
- [ ] EAS build (preview profile) 트리거 및 OTA update 확인 (Human owner)
  - 참조: `apps/mobile/.eas/workflows/ota-update.yml`
- [ ] `apps/api` 포함 시 — Docker 이미지 빌드 및 프로덕션 환경 배포 검증 (Human owner — ops)
  - 참조: `apps/api/Dockerfile`, `apps/api/compose.yaml`
- [ ] Expo paid plan 필요성 판단 — 월 빌드량/concurrency 기준 (Human owner)
- [ ] Store 계정 명의 확정 — 고객 법인 vs 운영 대행 법인 (Human owner)

---

### Production submit 전 (담당: Human owner)

참조: 사전 등록 가이드 §5 Production submit 전

- [ ] iOS 제출이 필요하면 Apple Developer Program 가입/결제와 App Store Connect 설정을 진행한다.
  - ASC API key 발급 후 `EXPO_ASC_KEY_ID` / `EXPO_ASC_ISSUER_ID` / `.p8` Secret 주입 필요
  - 참조: `docs/CREDENTIALS.md` Store 섹션
- [ ] Android 제출이 필요하면 Google Play Console 가입/등록비 결제와 identity verification을 진행한다.
  - Google account 준비, developer account type 결정, 등록비 결제, identity/contact verification 필요
- [ ] Android 최초 제출은 Human owner가 Play Console에 앱(빌드 산출물)을 수동 업로드 1회 수행한다.
  - Google 요구사항: API 기반 제출(EAS Submit 자동화)은 최초 1회 수동 업로드 이후에만 동작
  - 참조: Expo Submit 공식 문서, 사전 등록 가이드 §3 Google Play Console 행
- [ ] EAS Submit 자동화를 위해 Apple/Google service credentials를 Secret으로 준비한다.
  - 참조: `apps/mobile/.eas/workflows/build-and-submit.yml`, `docs/CREDENTIALS.md`
- [ ] Store 계정 명의와 고객/운영 대행 주체를 확정한다.
- [ ] production 빌드 빈도와 OTA MAU 기준으로 Expo paid plan 필요성을 최종 판단한다.

---

### EAS 의존 DoD 항목 요약 (01-8 §2 기준)

아래 항목은 01-8 DoD 중 외부 서비스 연결이 선행되어야 검증 가능한 HUMAN-GATE 항목입니다.
템플릿 산출물(설정 파일, workflow 배선, 문서)은 모두 완비되어 있습니다.

| DoD 항목 | 담당 | 선행 조건 | 템플릿 준비 상태 |
|----------|------|-----------|----------------|
| `eas init` → EAS_PROJECT_ID 확정 | Human owner | Expo 계정 + 구독 | `eas.json`, `app.config.ts extra.eas` 설정 완료 |
| Robot user EXPO_TOKEN k8s Secret 적용 | Human owner (ops) | Expo org Robot user 생성 | `infra/clawpod/secret.example.yaml` 제공 |
| Maestro E2E live 실행 | Human owner | EAS build 완료 + emulator | `.maestro/home.yml`, `e2e-test-android.yml` 배선 완료 |
| EAS build (preview/production) | Human owner | EXPO_TOKEN Secret 주입 | `eas.json` profiles + `.eas/workflows/` 배선 완료 |
| EAS Submit (store 제출) | Human owner | Store 계정 + credentials | `build-and-submit.yml` 배선 완료 |
| Android 최초 수동 업로드 (1회) | Human owner | Google Play 개발자 계정 | 수동 업로드 후 이후 제출은 EAS Submit 자동화 가능 |
| App Store Connect 제출 | Human owner | Apple 개발자 계정 + ASC API key | `EXPO_ASC_KEY_ID` / `EXPO_ASC_ISSUER_ID` / `.p8` Secret 주입 필요 |

---

### 01-8 DoD 전체 대조표 (PHASE 3 검증 결과)

아래 표는 PHASE 3 통합 검증에서 확정된 01-8 §2 + §15.5 DoD 전체 항목의 판정 결과입니다.
로컬 검증 항목은 PASS, 외부 서비스 연결이 필요한 항목은 HUMAN-GATE로 구분합니다.

#### §2 핵심 DoD

| DoD 항목 | 출처(§) | 판정 | 근거 |
|----------|---------|------|------|
| pnpm workspace + Turborepo 동작, `packages/contracts`가 `apps/mobile`에서 해석됨 | §2 | PASS | `pnpm-workspace.yaml` + `turbo.json` 존재. `pnpm install` EXIT 0, `pnpm turbo run lint test` 4 tasks all successful |
| 홈 화면 카운터 샘플이 공유 상수 import하여 렌더링·동작 | §2 | PASS | `apps/mobile/src/app/index.tsx`가 `COUNTER_INCREMENT`(@template/contracts) import. mobile Jest 2 suites / 5 tests PASS |
| Jest 유닛 테스트(`home.test.tsx`) 통과 + `jest.setup.ts`가 테스트 env 주입 | §2 | PASS | `home.test.tsx`, `app-config.test.ts`, `jest.setup.ts` 존재. mobile Jest 2 suites / 5 tests PASS |
| RNTL v13+ 고정 — built-in matcher import만으로 등록, `toHaveTextContent` 동작 | §2 | PASS | `@testing-library/react-native: ^13.0.0` 고정. `toHaveTextContent` 사용하며 PASS |
| NativeWind 설정 (`global.css`, semantic token CSS var defaults, `withNativewind` Metro config) | §2 | PASS | NativeWind v5-preview/Tailwind CSS 4 설정 파일 존재. lint/Jest/`expo install --check` 통과. 실제 Metro/native smoke는 simulator/device 준비 시 별도 검증 |
| Maestro E2E(`home.yml`)가 EAS Workflows maestro job으로 통과 | §2 | HUMAN-GATE | `home.yml` + `e2e-test-android.yml` 배선 완료. EAS Workflows 클라우드 실행은 Expo 계정·eas init 선행 필요 |
| `eas.json`에 development/preview/production + e2e-test profile 정의 | §2 | PASS | 4개 profile + submit.production 모두 정의 확인 |
| `.eas/workflows`에 build→maestro / build→submit / update job 배선 | §2 | PASS | `e2e-test-android.yml`, `build-and-submit.yml`, `ota-update.yml` 모두 배선 확인 |
| Agent 실행용 `EXPO_TOKEN`을 k8s Secret으로 주입하는 예시 manifest 제공 | §2 | PASS | `infra/clawpod/secret.example.yaml` + `agent-runner.yaml` 예시 manifest 제공 |
| root `AGENTS.md` + `docs/SETUP.md` / `docs/CREDENTIALS.md` 문서 완비 | §2 | PASS | 3개 문서 존재. `AGENTS.md`에 TDD/hardcod/direct push/shadcn 키워드 포함 |
| root `DESIGN.md` 존재 + `docs/design-references/`에 awesome-design-md vendored 사본 (DEC-021) | §2 | PASS | `DESIGN.md` 존재. `docs/design-references/LICENSE` + `NOTICE` + vendored 사본 다수 |
| (선택) `apps/api` 포함 시 §15 backend 완료 기준 4항목 충족 | §2 | PASS | 아래 §15.5 표 4항목 전부 PASS |
| 하드코딩된 고객/앱 식별자 없이 템플릿 변수로 치환 가능 | §2 | PASS | 금지 식별자(cloud.clawpod.app 등) 0건. 전 변수 env 주입 + 중립 default |

#### §15.5 apps/api 완료 기준

| DoD 항목 | 출처(§) | 판정 | 근거 |
|----------|---------|------|------|
| `counter-events.test.ts`가 red→green 통과 (vitest, `pnpm turbo run test` 합류) | §15.5 | PASS | vitest 2 tests PASS (invalid 400 + 201 success mock). turbo test 합류 확인 |
| `migrate()` 2회 연속 실행이 동일 결과 (멱등) | §15.5 | PASS | API 1회차 부팅 시 마이그레이션 적용, 2회차 신규 0건 — 멱등 확인 |
| `GET /livez`·`GET /readyz` 무인증 200 응답 (readyz는 DB ping 포함) | §15.5 | PASS | GET /livez 200, GET /readyz 200 (DB 연결 시) / 503 (DB 중단 시) 분기 확인 |
| `docker build -f apps/api/Dockerfile .` 성공 (컨테이너 이미지 산출) | §15.5 | PASS | turbo prune → tsc → pnpm deploy 전 스테이지 성공, 이미지 sha256 확인 |

**요약: PASS 16 / HUMAN-GATE 1 / FAIL 0**

HUMAN-GATE 1건 사유: Maestro E2E 실제 통과는 EAS Workflows 클라우드 emulator 실행이 필요하며, 이는 Expo 계정·`eas init`·Robot token(사전 등록 가이드 §5 Day 1)이 선행되어야 검증 가능합니다. 동일 클래스의 EAS Build/Submit/Update·Store 제출도 클라우드 실행 시점에 검증되는 HUMAN-GATE 영역이나, DoD 항목 자체(profile 정의·workflow 배선·문서화·init 코드)는 산출물로 충족되어 PASS입니다.
