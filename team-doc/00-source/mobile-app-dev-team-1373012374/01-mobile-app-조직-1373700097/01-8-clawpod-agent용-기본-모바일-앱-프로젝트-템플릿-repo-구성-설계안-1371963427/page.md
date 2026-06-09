---
pageId: "1371963427"
sourceTitle: "01-8. ClawPod Agent용 기본 모바일 앱 프로젝트 템플릿 repo 구성 설계안"
sourceVersion: "20"
sourceUrl: "https://wondermove-official.atlassian.net/wiki/spaces/mobileappd/pages/1371963427"
fetchedAt: "2026-06-09T03:41:15.000Z"
syncStatus: "synced"
---

**이 문서의 목적**

이 문서는 ClawPod 자체 모바일 앱을 만들기 위한 설계안이 아닙니다. ClawPod으로 생성된 Agent가 고객/프로젝트별 모바일 앱을 신규 개발하거나 이어받아 작업할 때 사용할 **기본 모바일 앱 프로젝트 템플릿 repo**의 Source of Truth입니다.

템플릿은 Agent가 Mac이나 물리 디바이스 없이도 모바일 앱의 기본 골격을 만들고, 테스트하고, EAS 클라우드에서 빌드/제출/OTA까지 수행할 수 있게 하는 실행 가능한 출발점이어야 합니다. ClawPod 브랜드, ClawPod API, ClawPod 앱 식별자는 샘플 기본값으로도 고정하지 않습니다. 앱 이름, bundle identifier, Android package, API URL, Expo project, Sentry project, Store 계정은 모두 프로젝트 생성 시 주입되는 템플릿 변수입니다.

**확정 원칙**

* 저장소 형태는 **모노레포**를 기본값으로 둡니다. Agent가 앱, 공유 타입/스키마, 테스트, EAS 설정을 한 저장소에서 보고 한 PR로 원자적으로 변경하기 위함입니다.
* 샘플은 오버스펙을 피하기 위해 **홈 화면 카운터 1개**로 제한합니다. 다만 공유 패키지 import → 유닛 테스트 → Maestro E2E → EAS 클라우드 빌드까지 통과해야 합니다.
* React Native 앱에는 web 전용 shadcn/ui를 강제하지 않습니다. RN 화면은 NativeWind + React Native primitive + semantic design token을 사용합니다. 선택적으로 포함되는 web console이 있다면 해당 web app에는 shadcn/ui 규칙을 적용합니다.
* 공식 Expo 문서 기준으로 SDK 52+에서는 monorepo Metro 수동 설정이 기본적으로 필요하지 않습니다. 단, NativeWind를 사용하므로 `metro.config.js`는 `expo/metro-config`의 기본 config를 NativeWind `withNativeWind`로 감싸야 합니다. `watchFolders` / `resolver.nodeModulesPaths` 수동 설정은 실제 해석 실패가 재현될 때만 추가합니다.
* 모바일 앱과 연동할 **신규 backend가 필요한 프로젝트는 선택적** `apps/api` 워크스페이스를 같은 모노레포에 포함합니다 (§15). 기존 고객 backend에 연동만 하는 프로젝트는 `apps/api`를 제외하고 contract 공유(`packages/contracts`)와 mobile-api-contract 절차만 사용합니다. backend 작업은 같은 repo 안에서도 mobile 작업과 분리된 task/PR로 수행하며 상호 cross-link합니다 (01-3 Case D/E의 분리 원칙 유지).

## 1. 배경 (Background)

* ClawPod는 AI Agent가 실제 개발팀처럼 협업하며 고객 프로젝트를 수행하는 관리형 AI 가상 전문 조직 SaaS입니다.
* 모바일 앱 작업의 핵심 요구는 **Agent가 로컬 Mac, Xcode, Android Studio, 물리 디바이스 없이도 앱을 빌드·테스트·배포**할 수 있어야 한다는 점입니다.
* 모든 빌드/제출/OTA는 Expo 호스팅 클라우드인 EAS(Build, Submit, Workflows, Update, Credentials)를 기본 실행면으로 사용합니다.
* Agent는 Expo Organization의 Robot user token을 `EXPO_TOKEN` 환경변수로 주입받아 EAS CLI를 비대화식으로 실행합니다.
* GitHub PR gate는 정적 검사와 유닛 테스트를 담당하고, 모바일 cloud build/E2E/submit/update는 EAS Workflows가 담당합니다.

**중요 전제**: EAS Build/Submit/Update/Workflows/Credentials는 Expo 호스팅 클라우드 서비스이며 자가호스팅이 불가합니다. 템플릿 repo는 설정 파일과 실행 절차를 제공하지만, 실제 운영에는 프로젝트 소유자의 Expo 구독, GitHub 연동, Store 계정, Sentry 프로젝트가 필요합니다.

## 2. 목적 (Goal / Definition of Done)

클론 또는 생성 후 **프로젝트 변수 입력 + 외부 서비스 연결**만으로 Agent가 모바일 앱 작업을 시작할 수 있는 완성형 기본 템플릿. 완료 기준:

아래 항목 중 Maestro E2E·EAS Workflows·Sentry sourcemap·store submit 관련 항목은 외부 서비스 연결(Expo 계정·`eas init`·Robot token — 사전 등록 가이드 §5 Day 1)이 선행된 후에만 검증 가능합니다.

**구현 현황 (2026-06-07)**: 본 설계안의 템플릿 repo가 `Wondermove-Inc/new-mobile-app` (branch `feat/mobile-app-template`, 커밋 6건 — push/PR은 운영자 지시 대기)으로 구현·검증 완료되었다. DoD 판정 **PASS 16 / HUMAN-GATE 1 / FAIL 0** — 아래 체크 상태는 이 검증 결과를 반영한다. 검증 명령·게이트 기록·SoT 편차 판정 전문은 [01-8 템플릿 repo 구현 검증 근거 (2026-06-07)](https://wondermove-official.atlassian.net/wiki/spaces/mobileappd/pages/1374355642) 참조.

- [x] pnpm workspace + Turborepo가 동작하고 `packages/contracts` 공유 모듈이 `apps/mobile`에서 해석됨
- [x] 홈 화면 카운터 샘플이 공유 상수를 import하여 렌더링·동작
- [x] Jest 유닛 테스트(`home.test.tsx`)가 로컬/CI에서 통과하고 `jest.setup.ts`가 테스트용 env를 주입함
- [x] RNTL v13 이상 고정 — built-in matcher가 import만으로 등록되어 `toHaveTextContent`가 동작함(jest-expo 호환 scaffolding 시 검증)
- [x] NativeWind v5(preview) + Tailwind v4가 `global.css`(CSS-first: `@import "tailwindcss/*"` + `@import "nativewind/theme"` + `@theme` 토큰), `postcss.config.mjs`(`@tailwindcss/postcss`), `withNativewind` Metro wrapper(`input: ./global.css`), `nativewind-env.d.ts`로 동작함 (Tailwind v4는 JS `tailwind.config.js` 불요 — 테마를 CSS에서 정의)
- [ ] Maestro E2E(`home.yml`)가 EAS Workflows의 maestro job으로 통과 — **HUMAN-GATE**: EAS 클라우드 선행(Expo 계정·`eas init`·Robot token). 산출물(`home.yml` + maestro job 배선)은 완비, 실통과만 잔여 (검증 근거 페이지 참조)
- [x] `apps/mobile/eas.json`에 development/preview/production + e2e-test profile 정의
- [x] `apps/mobile/.eas/workflows`에 build→maestro / build→submit / update job 배선
- [x] `@sentry/react-native` init 및 EAS Build/Update sourcemap 업로드 절차 문서화
- [x] Agent 실행용 `EXPO_TOKEN`을 k8s Secret으로 주입하는 예시 manifest 제공
- [x] repo root의 `AGENTS.md`와 `docs/SETUP.md` / `docs/CREDENTIALS.md` 문서 완비 — `docs/SETUP.md`는 사전 준비(외부 서비스 — 사전 등록 가이드 §2 필수 서비스 참조) / `pnpm install` / `eas init` / 로컬 검증 명령을, `docs/CREDENTIALS.md`는 `EXPO_TOKEN`·`SENTRY_AUTH_TOKEN`·(`apps/api` 포함 시) `DATABASE_URL`·Store credential의 Secret 주입 위치(사전 등록 가이드 §6 Secret / Credential 원칙 참조)를 최소 목차로 갖춰야 완비로 판정합니다
- [x] repo root의 `DESIGN.md`(디자인 시스템 SoT)가 존재하고, `docs/design-references/`에 awesome-design-md vendored 사본이 MIT LICENSE·출처 고지와 함께 포함됨 (DEC-021)
- [x] (선택) `apps/api` 포함 시: §15의 backend 완료 기준 4항목(인메모리 unit test 통과 / `migrate()` 멱등 재실행 / 무인증 health 응답 / 컨테이너 이미지 빌드) 충족
- [x] 하드코딩된 고객/앱 식별자 없이 템플릿 변수로 치환 가능

## 3. 템플릿 변수 (Project Generation Inputs)

| 변수 | 설명 | 예시 |
| --- | --- | --- |
| `APP_DISPLAY_NAME` | 앱 표시 이름 | `Customer Mobile` |
| `APP_SLUG` | Expo slug | `customer-mobile` |
| `APP_SCHEME` | deep link scheme | `customermobile` |
| `IOS_BUNDLE_IDENTIFIER` | iOS bundle identifier | `com.customer.mobile` |
| `ANDROID_PACKAGE` | Android package/appId | `com.customer.mobile` |
| `API_URL` | 앱이 호출할 API base URL | `https://api.customer.com` |
| `EAS_PROJECT_ID` | EAS project UUID | EAS init 후 확정 |
| `EXPO_OWNER` | Expo account/org | 고객 또는 ClawPod-managed org |
| `SENTRY_DSN` | client DSN | 프로젝트별 값 |
| `SENTRY_ORG` / `SENTRY_PROJECT` | sourcemap 업로드 대상 | 프로젝트별 값 |
| `SENTRY_AUTH_TOKEN` | EAS Build/Update sourcemap upload token | Secret 주입 |
| `EXPO_TOKEN_SECRET_NAME` | Agent runner가 참조할 k8s Secret 이름 | `clawpod-eas-{{agent}}-{{project}}` |
| `DATABASE_URL` | PostgreSQL 연결 문자열 (`apps/api` 포함 시) | Secret 주입 |
| `API_PORT` | api 리슨 포트 (`apps/api` 포함 시) | `3000` |
| `API_BEARER_TOKEN` | bearer 자리표시자 검증 토큰 (`apps/api` 포함 시) | Secret 주입 |

`cloud.clawpod.app`, `ClawPod Mobile`, `@clawpod/api` 같은 값은 템플릿 코드에 고정하지 않습니다. 문서나 샘플에서 필요하면 placeholder로만 표현합니다. 반면 `@template` 패키지 스코프(`@template/contracts`, `@template/api`)는 고정 내부 워크스페이스 alias로 고객/앱 식별자가 아니므로 치환 대상이 아닙니다.

**템플릿 변수 렌더링**

위 변수는 두 문법으로 표기되며 용처가 다릅니다. `{{...}}`는 주로 소스·Maestro flow의 placeholder로, 프로젝트 생성 시 전 파일을 대상으로 1회 검색·치환하면 소멸합니다(예: `.maestro/home.yml`의 `{{ANDROID_PACKAGE}}`, §3 표의 `{{agent}}`/`{{project}}`). `${...}`는 infra manifest의 placeholder로, 적용 직전 `envsubst`로 렌더링합니다(§8 `infra/clawpod/*.yaml`). §7 EAS workflow의 `${{ ... }}`는 EAS 네이티브 표현식이므로 본 렌더링 대상이 아닙니다.

렌더링 도구는 소스의 경우 단순 1회 검색·치환(전 파일 대상 치환 스크립트 또는 에디터 일괄 치환)이며, 신규 generator 프레임워크는 도입하지 않습니다. infra는 `envsubst`만 사용합니다. 주체와 시점은 운영자 bootstrap 단계로, 프로젝트 생성 시 1회 수행하며 01-7 Phase 3 변수 주입과 연계합니다. 렌더링 후에는 §3 변수 토큰(예: `{{ANDROID_PACKAGE}}`, `${API_URL}`)이 잔존하지 않는지 변수명 기준으로 grep해 확인합니다 — RN/JSX의 객체 리터럴 `{{ }}`(예: `screenOptions={{ ... }}`)나 EAS 네이티브 `${{ ... }}`는 placeholder가 아니므로 원시 brace 패턴이 아닌 변수 토큰으로만 검사합니다.

## 4. 소스 선별 매트릭스 (어느 GitHub 소스에서 무엇을)

| 소스 | 역할 | 선별해 가져올 내용 | 비고 |
| --- | --- | --- | --- |
| **t3-oss/create-t3-turbo** | 모노레포 BASE | Turborepo 골격, pnpm workspace, packages/apps 구조, 공유 타입 레이어 패턴 | 모바일 CI/E2E는 약함 → obytes/Expo 패턴 이식 필요 |
| **obytes/react-native-template-obytes** | `apps/mobile` 골격 | Expo Router, NativeWind, env(Zod), Jest(jest-expo preset 기반), EAS profile, Maestro 구조 | RN 앱 skeleton 기준 |
| **Expo 공식 EAS Workflows + Maestro 문서** | cloud E2E 패턴 | `.eas/workflows/*.yml`, build→maestro, e2e-test profile | EAS Workflows는 `.eas`가 `eas.json`과 같은 레벨에 있어야 함 |
| **Expo 공식 monorepo 문서** | monorepo 해석 기준 | SDK 52+ 자동 Metro 설정, pnpm workspace, pnpm isolated dependency 주의 | 수동 Metro resolver는 fallback |
| **NativeWind 공식 설치 문서** | RN semantic token styling | `global.css`, Tailwind preset, Babel preset, `withNativeWind`, type declaration | NativeWind 사용 시 필수 |
| **React Native Testing Library 문서** | Jest matcher | `toHaveTextContent` 등 built-in matcher | v13+ 고정 — import만으로 자동 등록(별도 setup 불필요) |
| **Expo/Sentry 공식 문서** | crash/sourcemap | `@sentry/react-native`, `SENTRY_AUTH_TOKEN`, EAS Build/Update sourcemap upload | EAS Update 후 별도 sourcemap upload 필요 |
| **Expo Programmatic Access 문서** | Agent 인증 | Robot user, access token, `EXPO_TOKEN` env 인증 | 토큰은 Secret으로만 주입 |
| **VoltAgent/awesome-design-md** | `DESIGN.md` 참조 큐레이션 (vendored) | 브랜드별 `DESIGN.md` 예시 — `docs/design-references/`에 사본 포함, root `DESIGN.md` 작성 참조 | MIT — 원 repo LICENSE·출처 고지 유지 필수 (DEC-021) |
| **infinitered/ignite** | 참조 | generator, Reactotron, i18n 개념 | 직접 머지 X |

**구성 방식**: 단일 repo로 “Agent 작업용 모노레포 + 모바일 CI/E2E + Robot token 실행”을 모두 만족하는 upstream은 없습니다. 따라서 t3-turbo식 모노레포 골격 위에 obytes/Expo 모바일 도구를 `apps/mobile`로 이식하는 composition이 기준입니다.

## 5. 타깃 디렉터리 구조 (모노레포 · 샘플 포함 완성안)

```
mobile-app-template/
├── AGENTS.md                         # Agent 자동 로딩용 root 지침 (필수)
├── DESIGN.md                         # 디자인 시스템 SoT — Design agent 소유, Stitch export/MCP 기반 (DEC-021)
├── apps/
│   ├── mobile/                       # Expo 앱 (템플릿 핵심)
│   │   ├── .eas/workflows/
│   │   │   ├── e2e-test-android.yml  # build(e2e-test) -> maestro(home.yml)
│   │   │   ├── build-and-submit.yml  # build -> submit (production)
│   │   │   └── ota-update.yml        # eas update (preview channel)
│   │   ├── .maestro/home.yml         # 홈 화면 카운터 E2E
│   │   ├── src/app/
│   │   │   ├── _layout.tsx           # root layout + global.css + Sentry init
│   │   │   ├── index.tsx             # 홈 화면 (공유 상수 import)
│   │   │   └── __tests__/home.test.tsx
│   │   ├── app.config.ts             # 템플릿 변수 기반 동적 설정
│   │   ├── babel.config.js           # NativeWind preset
│   │   ├── eas.json                  # dev/preview/production + e2e-test
│   │   ├── env.ts                    # Zod 환경변수 검증
│   │   ├── global.css                # NativeWind input + token defaults
│   │   ├── jest.setup.ts             # 테스트 env 기본값
│   │   ├── metro.config.js           # withNativewind(getDefaultConfig, { input: ./global.css })
│   │   ├── nativewind-env.d.ts       # NativeWind type declaration
│   │   ├── postcss.config.mjs        # @tailwindcss/postcss (Tailwind v4 — JS tailwind.config.js 불요)
│   │   └── package.json
│   ├── console/                      # 선택: 고객 프로젝트가 web console을 원할 때만 포함
│   └── api/                          # 선택: 신규 backend가 필요한 프로젝트만 포함 (§15)
│       ├── src/
│       │   ├── index.ts              # 부팅: env 검증 → migrate() → serve, SIGTERM 핸들러
│       │   ├── app.ts                # Hono 앱 조립 — 테스트가 import하는 단위
│       │   ├── env.ts                # zod 환경변수 검증 (apps/mobile/env.ts와 대칭)
│       │   ├── routes/               # health.ts(무인증 /livez·/readyz), counter-events.ts
│       │   │   └── __tests__/counter-events.test.ts   # vitest + app.request() 인메모리
│       │   ├── services/             # counter-events.service.ts
│       │   └── db/                   # client.ts, schema.ts(counter_events), migrate.ts
│       ├── drizzle/                  # drizzle-kit generate 산출 (SQL + snapshot)
│       ├── drizzle.config.ts
│       ├── vitest.config.ts
│       ├── tsconfig.json             # types: ["vitest/globals","node"] — mobile jest 전역과 격리
│       ├── Dockerfile                # multi-stage: turbo prune --docker → tsc → pnpm deploy --prod
│       ├── compose.yaml              # 선택: 로컬 PostgreSQL 1서비스 (운영자/개발 환경용)
│       └── package.json              # test: vitest run → turbo run test 자동 합류
├── packages/
│   └── contracts/                    # 공유: 타입·zod schema·API contract
│       ├── src/index.ts
│       └── package.json
├── infra/clawpod/
│   ├── secret.example.yaml           # Agent runner용 EXPO_TOKEN 등
│   └── agent-runner.yaml             # apps/mobile에서 EAS CLI 실행 Job 예시
├── docs/
│   ├── SETUP.md
│   ├── CREDENTIALS.md
│   └── design-references/            # awesome-design-md vendored 사본 (MIT — LICENSE·출처 고지 포함, DEC-021)
│       ├── LICENSE                   # 원 repo MIT 라이선스 전문 (DEC-021)
│       └── NOTICE                    # 출처·저작권 고지 (DEC-021)
├── .github/workflows/
│   └── quality-gate.yml              # PR gate: test:runtime → turbo lint test → (조건부) test:local-harness
├── .codex/                           # Codex CLI 런타임: config.toml(mobile-mcp)·agents/(×4)·hooks/(×4)·hooks.json — §16
├── .agents/skills/                   # Codex CLI native repo skills (SKILL.md ×2) — §16
├── evals/                            # Codex 런타임 eval fixtures: skills/agents/hooks/local-harness — §16
├── scripts/                          # 런타임 검증: validate-runtime-artifacts·test-hooks·codex-preflight·test-local-harness(.mjs) — §16
├── PROJECT_ENVIRONMENT.md            # 환경 SoT (AGENTS.md가 동기 유지 요구)
├── README.md                         # repo 개요
├── pnpm-workspace.yaml
├── turbo.json
└── package.json
```

## 6. 샘플 소스코드 기준 (최소 동작 세트)

샘플 화면은 카운터 하나로 한정하되, `packages/contracts`의 공유 상수와 schema를 import해 모노레포 모듈 해석이 동작함을 증명합니다.

**pnpm-workspace.yaml**

```
packages:
  - 'apps/*'
  - 'packages/*'
```

SDK/의존성 조합에 따라 pnpm isolated dependency 문제가 재현되면 다음을 추가하는 fallback을 허용합니다.

```
nodeLinker: hoisted
```

**turbo.json**

```
{
  "$schema": "https://turborepo.dev/schema.json",
  "tasks": {
    "lint": {},
    "test": {}
  }
}
```

Turborepo 2.x는 최상위 키로 `tasks`를 사용합니다(1.x의 `pipeline`이 아님).

**package.json** (root)

```
{
  "name": "mobile-app-template",
  "private": true,
  "packageManager": "pnpm@9.15.9",
  "devDependencies": {
    "turbo": "^2.9.16"
  },
  "scripts": {
    "lint": "turbo run lint",
    "test": "turbo run test"
  }
}
```

§7 quality-gate의 `pnpm turbo run lint test`와 §15.3 `apps/api` package.json의 `lint`(`tsc --noEmit`)·`test`(`vitest run`) 스크립트가 위 `tasks.lint`/`tasks.test`에 워크스페이스별로 자동 합류합니다.

**packages/contracts/package.json**

```json
{
  "name": "@template/contracts",
  "private": true,
  "type": "module",
  "exports": {
    ".": "./src/index.ts"
  },
  "peerDependencies": {
    "zod": "^3.25.0 || ^4.0.0"
  }
}
```

`exports`가 빌드 산출물이 아닌 `./src/index.ts`를 직접 가리키는 source-export라 별도 빌드 스텝 없이 모노레포 내부에서 직접 해석되며, jest-expo(babel)와 tsx/vitest가 TS 소스를 그대로 변환합니다. `zod`는 §15.1대로 소비자(mobile·api)가 제공하는 단일 호이스팅 버전을 쓰도록 peer range(`^3.25.0 || ^4.0.0`, 실제 설치는 v4 단일 고정)로 선언해 중복 설치를 피합니다.

**packages/contracts/src/index.ts**

```
import { z } from 'zod';

export const COUNTER_INCREMENT = 1;

export const counterEventSchema = z.object({
  count: z.number().int().nonnegative(),
});
export type CounterEvent = z.infer<typeof counterEventSchema>;
```

**apps/mobile/env.ts**

```
import { z } from 'zod';

const schema = z.object({
  APP_ENV: z.enum(['development', 'preview', 'production']).default('development'),
  APP_DISPLAY_NAME: z.string().min(1).default('Mobile App Template'),
  APP_SLUG: z.string().min(1).default('mobile-app-template'),
  APP_SCHEME: z.string().min(1).default('mobileapptemplate'),
  API_URL: z.url(),
  IOS_BUNDLE_IDENTIFIER: z.string().min(1),
  ANDROID_PACKAGE: z.string().min(1),
  EAS_PROJECT_ID: z.uuid().optional(),
  SENTRY_DSN: z.string().optional(),
  SENTRY_ORG: z.string().optional(),
  SENTRY_PROJECT: z.string().optional(),
});

export const Env = schema.parse({
  APP_ENV: process.env.EXPO_PUBLIC_APP_ENV,
  APP_DISPLAY_NAME: process.env.EXPO_PUBLIC_APP_DISPLAY_NAME,
  APP_SLUG: process.env.EXPO_PUBLIC_APP_SLUG,
  APP_SCHEME: process.env.EXPO_PUBLIC_APP_SCHEME,
  API_URL: process.env.EXPO_PUBLIC_API_URL,
  IOS_BUNDLE_IDENTIFIER: process.env.EXPO_PUBLIC_IOS_BUNDLE_IDENTIFIER,
  ANDROID_PACKAGE: process.env.EXPO_PUBLIC_ANDROID_PACKAGE,
  EAS_PROJECT_ID: process.env.EAS_PROJECT_ID,
  SENTRY_DSN: process.env.EXPO_PUBLIC_SENTRY_DSN,
  SENTRY_ORG: process.env.SENTRY_ORG,
  SENTRY_PROJECT: process.env.SENTRY_PROJECT,
});
```

**apps/mobile/app.config.ts**

```ts
import { ExpoConfig, ConfigContext } from 'expo/config';

// Read process.env directly here — @expo/config's evalConfig uses sucrase + require-from-string
// which cannot resolve TypeScript files via require('./env') in a monorepo with "type":"module"
// at the workspace root. Runtime code (src/) should continue to import from ./env.ts.
export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: process.env.EXPO_PUBLIC_APP_DISPLAY_NAME ?? 'Mobile App Template',
  slug: process.env.EXPO_PUBLIC_APP_SLUG ?? 'mobile-app-template',
  scheme: process.env.EXPO_PUBLIC_APP_SCHEME ?? 'mobileapptemplate',
  ios: { bundleIdentifier: process.env.EXPO_PUBLIC_IOS_BUNDLE_IDENTIFIER ?? 'com.template.mobile' },
  android: { package: process.env.EXPO_PUBLIC_ANDROID_PACKAGE ?? 'com.template.mobile' },
  plugins: ['expo-router'],
  extra: {
    eas: { projectId: process.env.EAS_PROJECT_ID },
  },
});
```

`name`/`slug`/`scheme`/`ios.bundleIdentifier`/`android.package`는 동일한 `EXPO_PUBLIC_*` env 키를 `process.env`로 직접 읽어 템플릿 변수와 단일 키 체계로 연결합니다. `app.config.ts`에서 `./env`를 import하지 않는 이유: `@expo/config`의 evalConfig(sucrase + require-from-string)가 root `"type":"module"` 모노레포에서 TypeScript 파일 require를 해석하지 못해 `expo start`가 실패합니다 — 구현 repo `expo start` 실행으로 실증 (2026-06-07, 검증 근거 페이지 §5 편차 1 참조). 런타임 코드(`src/`)는 계속 `env.ts`의 검증된 `Env`를 사용합니다. `extra.eas.projectId`는 `EAS_PROJECT_ID`(EAS init 후 확정)를 주입하는 자리이며, `runtimeVersion`/`updates.url`은 `eas update:configure`가 자동으로 추가하므로 템플릿 기본값에 고정하지 않습니다. Sentry를 활성화하는 프로젝트의 plugin·sourcemap 절차는 아래 \*\*Sentry 통합 절차 (DSN 주입 시)\*\*를 따릅니다.

**Sentry 통합 절차 (DSN 주입 시)**

기본은 비활성입니다 — `SENTRY_DSN`이 주입되지 않으면 `_layout.tsx`의 `Sentry.init`이 `enabled: false`로 no-op이 되며, 아래 plugin·metro·sourcemap 변경은 어느 것도 필요하지 않습니다. crash/sourcemap 추적이 필요한 프로젝트(`SENTRY_DSN`/`SENTRY_ORG`/`SENTRY_PROJECT` 주입)에서만 다음 4단계를 적용합니다.

1. `app.config.ts`의 `plugins`에 Sentry expo plugin을 추가합니다. `organization`/`project`는 `process.env.SENTRY_ORG`/`process.env.SENTRY_PROJECT`를 직접 읽어 연결합니다 (`app.config.ts` 내부 코드이므로 위 evalConfig 제약이 동일하게 적용).

```ts
  plugins: [
    'expo-router',
    ['@sentry/react-native/expo', { organization: process.env.SENTRY_ORG, project: process.env.SENTRY_PROJECT }],
  ],
```

2. `metro.config.js`를 `getSentryExpoConfig` 기반으로 교체합니다. `withNativeWind` 래핑은 그대로 유지해야 하므로(§12 필수 설정), `getDefaultConfig` 대신 `getSentryExpoConfig`가 반환한 config를 `withNativeWind`로 감쌉니다.

```
const { getSentryExpoConfig } = require('@sentry/react-native/metro');
const { withNativeWind } = require('nativewind/metro');

const config = getSentryExpoConfig(__dirname);

module.exports = withNativeWind(config, { input: './global.css' });
```

3. EAS Build: `SENTRY_AUTH_TOKEN`을 EAS secret으로 주입하면(§3 변수 · §8 secret manifest) Sentry plugin이 빌드 중 sourcemap을 자동 업로드합니다. 별도 명령이 필요 없습니다.
4. EAS Update: OTA 업데이트는 sourcemap을 자동 업로드하지 않으므로, `eas update`(또는 `npx expo export`) 후 명시적으로 업로드합니다. CI 파이프라인에 다음 단계를 배선합니다.

```
SENTRY_AUTH_TOKEN=$SENTRY_AUTH_TOKEN npx @sentry/expo-upload-sourcemaps dist
```

`@sentry/expo-upload-sourcemaps`는 현행 공식 명령이며 `dist`는 export 산출 디렉터리입니다. `SENTRY_AUTH_TOKEN`은 EAS Build와 동일하게 Secret으로만 주입하고 repo에 커밋하지 않습니다(§12).

**apps/mobile/jest.setup.ts**

```
process.env.EXPO_PUBLIC_APP_ENV ??= 'development';
process.env.EXPO_PUBLIC_APP_DISPLAY_NAME ??= 'Mobile App Template';
process.env.EXPO_PUBLIC_APP_SLUG ??= 'mobile-app-template';
process.env.EXPO_PUBLIC_APP_SCHEME ??= 'mobileapptemplate';
process.env.EXPO_PUBLIC_API_URL ??= 'https://example.invalid';
process.env.EXPO_PUBLIC_IOS_BUNDLE_IDENTIFIER ??= 'com.example.mobiletemplate';
process.env.EXPO_PUBLIC_ANDROID_PACKAGE ??= 'com.example.mobiletemplate';
```

`@testing-library/react-native`는 v13 이상으로 고정합니다. v12.4부터 내장된 Jest matcher가 v13부터는 별도 setup 없이 라이브러리 import만으로 자동 등록되므로 `jest.matchers.ts`와 `setupFilesAfterEnv` 배선이 필요 없습니다(v12.x로 내릴 경우에만 `extend-expect` 서브패스 setup이 필요). jest-expo preset과의 호환은 scaffolding 시 1회 검증합니다.

`apps/mobile/package.json`의 Jest 설정에는 다음을 포함합니다.

```
{
  "jest": {
    "preset": "jest-expo",
    "setupFiles": ["<rootDir>/jest.setup.ts"]
  }
}
```

**apps/mobile/global.css**

```
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222 47% 11%;
    --primary: 221 83% 53%;
    --primary-foreground: 210 40% 98%;
  }
}
```

**apps/mobile/global.css** (Tailwind v4 CSS-first — JS `tailwind.config.js` 미사용, 테마를 CSS에서 정의)

```
@import "tailwindcss/theme.css" layer(theme);
@import "tailwindcss/preflight.css" layer(base);
@import "tailwindcss/utilities.css";
@import "nativewind/theme";

:root {
  --background: 0 0% 100%;
  --foreground: 222 47% 11%;
  --primary: 221 83% 53%;
  --primary-foreground: 210 40% 98%;
}

@theme {
  --color-background: hsl(var(--background));
  --color-foreground: hsl(var(--foreground));
  --color-primary: hsl(var(--primary));
  --color-primary-foreground: hsl(var(--primary-foreground));
}
```

**apps/mobile/postcss.config.mjs** (Tailwind v4)

```
export default {
  plugins: {
    '@tailwindcss/postcss': {},
  },
};
```

**apps/mobile/metro.config.js**

```
const { getDefaultConfig } = require('expo/metro-config');
const { withNativewind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname);

module.exports = withNativewind(config, { input: './global.css' });
```

수동 `watchFolders` / `resolver.nodeModulesPaths`는 SDK 52+ 기본 경로가 실패하는 경우에만 추가합니다.

**apps/mobile/babel.config.js**

```
module.exports = function (api) {
  const isTest = api.env('test');
  return {
    presets: [
      'babel-preset-expo',
      ...(isTest ? ['react-native-css/babel'] : []),
    ],
  };
};
```

**apps/mobile/nativewind-env.d.ts**

```
/// <reference types="nativewind/types" />
```

**apps/mobile/src/app/\_layout.tsx**

```
import '../../global.css';
import * as Sentry from '@sentry/react-native';
import { Stack } from 'expo-router';
import { Env } from '../../env';

Sentry.init({
  dsn: Env.SENTRY_DSN,
  enabled: Boolean(Env.SENTRY_DSN),
});

function RootLayout() {
  return <Stack screenOptions={{ headerShown: false }} />;
}

export default Sentry.wrap(RootLayout);
```

**apps/mobile/src/app/index.tsx**

```
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { COUNTER_INCREMENT } from '@template/contracts';
import { Env } from '../../env';

export default function Home() {
  const [count, setCount] = useState(0);
  return (
    <View className="flex-1 items-center justify-center gap-4 bg-background px-6">
      <Text testID="title" className="text-xl font-bold text-foreground">{Env.APP_DISPLAY_NAME}</Text>
      <Text testID="counter" className="text-lg text-foreground">Count: {count}</Text>
      <Pressable
        testID="increment"
        accessibilityRole="button"
        onPress={() => setCount((c) => c + COUNTER_INCREMENT)}
        className="rounded-xl bg-primary px-6 py-3"
      >
        <Text className="font-medium text-primary-foreground">Increment</Text>
      </Pressable>
    </View>
  );
}
```

**test file:** `apps/mobile/src/app/__tests__/home.test.tsx`

```
import { render, screen, fireEvent } from '@testing-library/react-native';
import Home from '../index';

describe('Home screen', () => {
  it('renders configured title and increments the counter', () => {
    render(<Home />);
    expect(screen.getByTestId('title')).toHaveTextContent('Mobile App Template');
    expect(screen.getByTestId('counter')).toHaveTextContent('Count: 0');
    fireEvent.press(screen.getByTestId('increment'));
    expect(screen.getByTestId('counter')).toHaveTextContent('Count: 1');
  });
});
```

**apps/mobile/.maestro/home.yml**

```
appId: {{ANDROID_PACKAGE}}
---
- launchApp
- assertVisible:
    id: title
- assertVisible: "Count: 0"
- tapOn:
    id: increment
- assertVisible: "Count: 1"
```

`{{ANDROID_PACKAGE}}`는 프로젝트 생성 시 실제 `ANDROID_PACKAGE` 값으로 렌더링합니다. iOS E2E workflow를 추가할 때는 별도 `home-ios.yml`을 생성하며, 그 `appId`는 `{{IOS_BUNDLE_IDENTIFIER}}`를 렌더링한 값을 사용합니다(Android `home.yml`의 `{{ANDROID_PACKAGE}}`와 대칭).

## 7. EAS / CI 설정 기준

**apps/mobile/eas.json**

```
{
  "cli": { "version": ">= 20.0.0", "appVersionSource": "remote" },
  "build": {
    "development": { "developmentClient": true, "distribution": "internal", "channel": "development" },
    "preview": { "distribution": "internal", "channel": "preview" },
    "production": { "channel": "production", "autoIncrement": true },
    "e2e-test": { "withoutCredentials": true, "android": { "buildType": "apk" }, "ios": { "simulator": true } }
  },
  "submit": { "production": {} }
}
```

`cli.version` floor는 scaffolding 시점 현행 메이저(2026-06 기준 20.x)로 고정합니다 — eas-cli 20.x는 Node 20 이상을 요구하므로 §11 Node 22 통일 결정과 정합합니다.

**apps/mobile/.eas/workflows/e2e-test-android.yml**

```
name: E2E (Android)
on:
  pull_request:
    branches: ['*']
jobs:
  build_android_for_e2e:
    type: build
    params:
      platform: android
      profile: e2e-test
  maestro_test:
    needs: [build_android_for_e2e]
    type: maestro
    params:
      build_id: ${{ needs.build_android_for_e2e.outputs.build_id }}
      flow_path: ['.maestro/home.yml']
```

**apps/mobile/.eas/workflows/build-and-submit.yml**

```
name: Build and submit (production)
on:
  workflow_dispatch:
jobs:
  build_android:
    type: build
    params:
      platform: android
      profile: production
  build_ios:
    type: build
    params:
      platform: ios
      profile: production
  submit_android:
    needs: [build_android]
    type: submit
    params:
      build_id: ${{ needs.build_android.outputs.build_id }}
  submit_ios:
    needs: [build_ios]
    type: submit
    params:
      build_id: ${{ needs.build_ios.outputs.build_id }}
```

자동 트리거 없이 `workflow_dispatch`만 두어 운영자/Agent가 `eas workflow:run build-and-submit.yml`로 수동 실행합니다(`on` 키를 생략해도 수동 실행만 가능하나, 의도를 명시하기 위해 `workflow_dispatch`를 둡니다). production build 후 `needs`/`outputs.build_id`로 같은 산출물을 submit에 연결하며, submit profile은 `eas.json`의 `submit.production`을 기본으로 사용합니다.

**apps/mobile/.eas/workflows/ota-update.yml**

```
name: OTA update (preview)
on:
  push:
    branches: ['preview']
jobs:
  publish_update:
    type: update
    params:
      channel: preview
      platform: all
      message: ${{ github.sha }}
```

`type: update` job이 `eas update`를 수행해 preview channel로 OTA를 배포합니다. `channel`은 `eas.json` build profile의 `channel: preview`와 매칭되며, `branch`와 동시 지정은 불가합니다. Sentry sourcemap을 함께 올리려면 `params.upload_sentry_sourcemaps: true`를 추가합니다(Sentry 통합 절차 참조).

**.github/workflows/quality-gate.yml**

```
name: Quality gate
on:
  pull_request:
    branches: ['main']
jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with: { fetch-depth: 0 }                 # 런타임 변경 감지용 full history
      - uses: pnpm/action-setup@v4
        with: { version: 9 }
      - uses: actions/setup-node@v4
        with: { node-version: 22, cache: 'pnpm' }
      - run: pnpm install --frozen-lockfile
      - run: pnpm run test:runtime               # Codex 런타임 구조·역할경계·hook fixture 검증 (§16)
      - run: pnpm turbo run lint test
      - id: runtime-changes                      # .codex/.agents/evals/scripts/AGENTS.md 등 변경 감지
        name: Detect Codex runtime changes
        shell: bash
        run: |
          changed_files="$(git diff --name-only "${{ github.event.pull_request.base.sha }}" HEAD)"
          # 매칭 시 changed=true (→ 아래 조건부 step 실행)
      - if: steps.runtime-changes.outputs.changed == 'true'
        run: pnpm run test:local-harness          # Codex CLI 런타임 + 헤드리스 smoke (§16)
```

`apps/api` 포함 시 별도 CI 변경은 없습니다 — `pnpm turbo run lint test`가 api 워크스페이스의 `lint`·`test`(vitest) 스크립트를 자동 포함합니다 (Turborepo 워크스페이스별 독립 스크립트 모델). api의 타입 체크는 `tsc --noEmit`을 api `lint` 스크립트에 포함해 동일 게이트에서 수행합니다.

## 8. Agent 실행 통합 — Robot user · k8s Secret 주입

이 섹션은 앱 런타임 배포 인프라가 아니라 **ClawPod Agent가 EAS CLI를 실행하기 위한 운영 예시**입니다.

* Expo Organization에는 프로젝트 또는 고객 범위에 맞는 Robot user를 생성합니다. Expo 공식 CI 문서는 personal access token 사용 예시를 제시하지만, 본 운영 모델은 개인 계정 분리와 역할 기반 최소 권한 부여를 위해 Robot user를 채택합니다 (Expo programmatic access 문서 기준 Robot은 역할 제한이 가능하고 개인 계정 권한을 상속하지 않음).
* Robot user token은 이미지에 굽지 않고 k8s Secret으로만 주입합니다.
* EAS CLI는 `EXPO_TOKEN`이 있으면 `eas login` 없이 비대화식으로 인증됩니다.
* EAS 명령은 `apps/mobile`에서 실행합니다. `.eas` directory와 `eas.json`은 같은 레벨이어야 합니다.
* 아래 manifest는 템플릿입니다. 적용 전 `${...}` placeholder를 실제 값으로 렌더링해야 합니다.
* 소스 주입은 read-only deploy token을 Secret으로 주입하고 initContainer가 `/workspace`로 clone하는 패턴을 기본으로 합니다 (01-1의 secret-only 제약 준수). PVC 마운트 등 대안은 §11 결정 항목입니다.

**infra/clawpod/secret.example.yaml**

```
apiVersion: v1
kind: Secret
metadata:
  name: ${EXPO_TOKEN_SECRET_NAME}
  namespace: clawpod
type: Opaque
stringData:
  EXPO_TOKEN: "REPLACE_WITH_ROBOT_USER_TOKEN"
  SENTRY_AUTH_TOKEN: "REPLACE_WITH_SENTRY_TOKEN"
  EXPO_PUBLIC_APP_DISPLAY_NAME: "${APP_DISPLAY_NAME}"
  EXPO_PUBLIC_APP_SLUG: "${APP_SLUG}"
  EXPO_PUBLIC_APP_SCHEME: "${APP_SCHEME}"
  EXPO_PUBLIC_API_URL: "${API_URL}"
  EXPO_PUBLIC_IOS_BUNDLE_IDENTIFIER: "${IOS_BUNDLE_IDENTIFIER}"
  EXPO_PUBLIC_ANDROID_PACKAGE: "${ANDROID_PACKAGE}"
  EAS_PROJECT_ID: "${EAS_PROJECT_ID}"
```

**infra/clawpod/agent-runner.yaml**

```yaml
apiVersion: batch/v1
kind: Job
metadata:
  name: eas-build-${AGENT_NAME}-${PROJECT_SLUG}
  namespace: clawpod
spec:
  template:
    spec:
      restartPolicy: Never
      volumes:
        - name: workspace
          emptyDir: {}
      initContainers:
        - name: clone
          image: alpine/git
          command:
            - sh
            - -c
            - 'git clone --depth 1 --branch ${REPO_BRANCH} https://${REPO_DEPLOY_TOKEN}@${REPO_HOST}/${REPO_PATH}.git /workspace'
          env:
            - name: REPO_DEPLOY_TOKEN
              valueFrom:
                secretKeyRef:
                  name: ${REPO_DEPLOY_SECRET_NAME}
                  key: REPO_DEPLOY_TOKEN
          volumeMounts:
            - name: workspace
              mountPath: /workspace
      containers:
        - name: eas
          image: node:22-bookworm
          workingDir: /workspace/apps/mobile
          command: ['sh', '-c', 'npx eas-cli@latest build --profile preview --platform android --non-interactive --no-wait']
          envFrom:
            - secretRef:
                name: ${EXPO_TOKEN_SECRET_NAME}
          volumeMounts:
            - name: workspace
              mountPath: /workspace
```

## 9. 동작 검증 절차

| 계층 | 도구/명령 | 증명하는 것 | 실행 위치 |
| --- | --- | --- | --- |
| 워크스페이스 | `pnpm install` | workspace dependency 해석 | 로컬 / CI |
| 유닛 | `pnpm turbo run test` | 테스트 env 주입 + built-in matcher 동작 + 공유 상수 렌더 + 카운터 로직 | 로컬 / PR |
| 정적 | `pnpm turbo run lint` | 타입·린트 무결성 | 로컬 / PR |
| NativeWind | `pnpm --filter mobile start -- --clear` smoke | semantic token className 적용 | 로컬 smoke |
| E2E | EAS Workflow `e2e-test-android` → maestro | 클라우드 emulator에서 앱 실행·탭·검증 | EAS PR workflow |
| 빌드/제출 | EAS Workflow `build-and-submit` | store submit 대상 산출물 생성 | EAS production workflow |
| OTA | `ota-update` / `eas update` | preview channel OTA 배포 | EAS |
| Sentry | EAS Build/Update sourcemap upload | crash stacktrace symbolication | EAS / Sentry |
| (선택) api 유닛 | `pnpm --filter api test` (vitest) | `app.request()` 인메모리 라우트 검증 + contracts schema round-trip | 로컬 / PR |
| (선택) api 마이그레이션 | `migrate()` 2회 연속 실행 | 마이그레이션 멱등성 (이력 테이블 기반 재실행 안전) | 로컬 / CI |
| (선택) api 컨테이너 | `docker build -f apps/api/Dockerfile .` | 호스팅 비종속 배포 산출물 생성 | 로컬 / CI |

**TDD 순서**: 홈 화면 구현 전 `home.test.tsx`를 먼저 작성해 red를 확인하고, 그 뒤 `jest.setup.ts`, `env.ts`, `index.tsx`를 구현해 green으로 전환합니다. `apps/api` 포함 시 동일 사이클을 적용합니다 — `counter-events.test.ts`를 먼저 작성해 red를 확인하고 route/service를 구현해 green으로 전환합니다 (§15).

**env.ts ↔ jest.setup.ts 결합 규약**: `env.ts`의 `schema.parse`는 모듈 import 시점에 실행되므로(테스트가 `index.tsx`를 통해 `env.ts`를 import), default 없는 필수 입력(`API_URL`/`IOS_BUNDLE_IDENTIFIER`/`ANDROID_PACKAGE`)에 해당하는 `EXPO_PUBLIC_*` 키가 주입되지 않으면 전 유닛 테스트가 import 단계에서 붕괴합니다. 따라서 env schema에 default 없는 필수 필드를 추가할 때는 `jest.setup.ts`에 같은 PR에서 기본값을 함께 추가해야 합니다. `.default()`가 있는 필드는 누락돼도 parse가 실패하지 않지만, 테스트 fixture를 실제 값과 일치시키기 위해 동일 키를 jest.setup.ts에 함께 유지하는 것을 권장합니다.

## 10. 구축 단계 로드맵 (Phase)

| Phase | 내용 | 산출물 |
| --- | --- | --- |
| 템플릿 입력값 확정 | §3 변수, Expo owner, Store 법인, CI/EAS 전략 확정 | 결정 기록 |
| 테스트 red 작성 | `home.test.tsx` 작성, 기대 title/counter 동작 정의 | 실패하는 테스트 |
| 모노레포 스캐폴딩 | pnpm workspace, turbo, root `AGENTS.md`, `packages/contracts` | workspace 동작 |
| `apps/mobile` 골격 | Expo Router, NativeWind token defaults, env schema, Jest setup, withNativeWind Metro | mobile skeleton |
| 샘플 구현 | 홈 카운터 + 공유 상수 import | green unit test |
| EAS 설정 | `eas init`, eas.json profile, app.config.ts 변수 연결 | EAS project 연결 |
| Workflows + Maestro | build→maestro, build→submit, update workflow | cloud E2E |
| Sentry 통합 | init, Build/Update sourcemap upload 절차 | crash tracking |
| Agent runner 통합 | Robot user token, k8s Secret, Job 예시 | ClawPod Agent 실행 가능 |
| Credentials / Store | iOS/Android credentials, store submit 연동 | submit 가능 |
| (선택) `apps/api` 골격 + 샘플 | env schema, Drizzle 스키마/마이그레이션, 카운터 이벤트 API(red→green), Dockerfile | backend skeleton + green unit test + 컨테이너 빌드 |
| 문서 + 최종 검증 | root `AGENTS.md`, `docs/SETUP.md`, `docs/CREDENTIALS.md`, 전체 pipeline 1회 통과 | 완료 기준 충족 |

## 11. 결정 항목 (Decision Points)

잔여 결정은 프로젝트 생성 시 입력 또는 고객/운영자 승인으로 처리합니다.

(결정 기록) 라벨이 붙은 항목은 이미 확정된 결정의 기록이며, 라벨 없는 항목만 잔여 결정입니다.

- [ ] **CI 오케스트레이터** — PR gate는 GitHub Actions, 모바일 build/E2E/submit/update는 EAS Workflows를 기본값으로 둠
- [ ] **Expo 플랜** — 프로젝트 규모에 맞는 유료 플랜 필요
- [ ] **Expo owner/org** — 고객 소유 org vs ClawPod-managed org
- [ ] **Robot user 네이밍** — `${project}-${agent}` 또는 `${customer}-${project}-${agent}`
- [ ] **bundle/package identifier** — `IOS_BUNDLE_IDENTIFIER`, `ANDROID_PACKAGE`로 입력
- [ ] **OTA 채널 전략** — development / preview / production 3채널 기본
- [ ] **Store 계정 명의** — 고객 법인 또는 운영 대행 법인
- [ ] **공유 패키지 범위** — 기본은 `packages/contracts`; auth/db/ui는 프로젝트 요구가 생길 때 추가
- [ ] **web console 포함 여부** — 포함 시 shadcn/ui 적용, 미포함 시 `apps/console` 제외
- [ ] **Turborepo 유지 (결정 기록)** — Expo 공식 monorepo 가이드는 workspace 관리자(pnpm 등)만 요구하며 Turborepo는 필수가 아님. 본 템플릿은 t3-turbo composition base와 quality-gate(`pnpm turbo run lint test`) 배선 유지를 위해 채택함 (2026-06-06 표준성 감사 반영)
- [ ] **Node 런타임 통일 (결정 기록)** — 전 실행면(quality-gate `node-version`·agent-runner 이미지·`apps/api` Dockerfile base)을 Node 22 단일 major로 고정함. agent-runner는 `node:22-bookworm`, Dockerfile base는 `node:22-slim`을 사용하며 둘 다 현행 Debian stable(Bookworm) 계열로 통일되고, 두 태그 모두 eas-cli 현행 버전의 Node 요구(>=20)와 호환됨. 감사 CON-01 반영 (2026-06-06)
- [ ] **디자인 도구·**[**DESIGN.md**](http://DESIGN.md) **(결정 기록)** — 디자인 저작 도구는 Google Stitch로 한정하고, root `DESIGN.md`를 디자인 시스템 SoT로 도입(Design agent 소유, Google 오픈소스 `DESIGN.md` 스펙 기준), `docs/design-references/`에 VoltAgent/awesome-design-md를 vendored 포함(MIT 확인 — LICENSE·출처 고지 필수). handoff 전 Stitch 디자인의 HTML 추출(공식 ZIP export `code.html` 또는 Stitch MCP fetch)·HTML 퍼블리싱 전달 의무 (DEC-021, 2026-06-06)
- [ ] **vendored 사본 동기화 owner/주기** — `docs/design-references/`(awesome-design-md) 사본의 upstream 동기화 담당자와 주기는 템플릿 repo scaffolding 시점에 지정 (§12 리스크 참조, DEC-021)
- [ ] `apps/api` 포함 여부 — 신규 backend가 필요한 프로젝트만 포함. 기존 고객 backend 연동만이면 제외하고 contract 공유 + mobile-api-contract 절차 사용 (01-3 Case D/E)
- [ ] **backend 배포 대상** — 템플릿 코어는 컨테이너 이미지(Dockerfile) + health + SIGTERM graceful shutdown까지. 실제 배포면(k8s/Fly/Railway 등)과 probe wiring은 프로젝트 결정 — Dockerfile HEALTHCHECK는 k8s에서 무시되므로 wiring을 코어에 고정하지 않음. k8s manifest는 `infra/` 참조 예시 위치만 허용
- [ ] **마이그레이션 적용 분리 시점** — 기본값은 앱 부팅 시 프로그래매틱 `migrate()` 자동 실행(이력 기반 멱등). 다중 레플리카 등으로 부적합해지면 별도 job/init container로 분리
- [ ] **backend 스택 이탈 (거버넌스 기록)** — §15 스택(Hono + PostgreSQL/Drizzle + vitest)은 Mobile Architect-governed template default. 프로젝트별 이탈은 Mobile Architect 명시 승인 + 사유 기록 (2026-06-06 backend 표준 조사 반영)
- [ ] **auth 솔루션 도입 시점** — 템플릿은 bearer 토큰 검증 자리표시자만 포함. 실제 인증 요구사항이 정의될 때 결정하며, 결제·PII·푸시 발송은 00-1 human-gate 경유
- [ ] **Agent runner 소스 주입 방식** — 기본값은 read-only deploy token Secret 주입 + initContainer git clone(`/workspace` emptyDir 공유). PVC 마운트 등 대안은 프로젝트 인프라 요구가 생길 때 결정 (01-1 secret-only 제약 준수, §8)

## 12. 리스크 / 주의사항

* Expo/RN monorepo는 SDK·pnpm·native dependency 조합에 따라 dependency resolution 이슈가 생길 수 있습니다. SDK 52+ 기본 Metro 설정으로 시작하고 실패 재현 시에만 fallback을 적용합니다.
* NativeWind를 사용하는 한 Metro는 `withNativeWind` wrapper와 `global.css` 입력을 유지해야 합니다. 이 설정은 monorepo 수동 resolver와 별개의 필수 설정입니다.
* Semantic token className은 `global.css`의 CSS variable default가 있어야 동작합니다. 프로젝트별 디자인 시스템이 확정되기 전까지 기본 token 값을 유지합니다. 프로젝트 디자인 시스템이 확정되면 root `DESIGN.md`의 token 정의와 `global.css` 값을 함께 갱신합니다.
* RNTL은 v13 이상으로 고정합니다 — built-in matcher가 import만으로 자동 등록되므로 `setupFilesAfterEnv` 배선이 불필요합니다. 버전 핀을 유지하는 것이 리스크 관리 포인트이며, v12.x로 다운그레이드할 경우에만 `extend-expect` 서브패스 setup이 다시 필요합니다.
* pnpm isolated dependency 문제가 발생하면 `nodeLinker: hoisted`를 fallback으로 검토합니다.
* Sentry, Expo token, Store credential은 모두 Secret으로 관리합니다. 템플릿 repo에는 실제 값을 커밋하지 않습니다.
* EAS는 유료 호스팅 의존입니다. 월 빌드량과 concurrency에 따라 플랜/크레딧 비용이 달라집니다.
* Apple/Google Store 계정과 iOS credentials 준비는 일정 리스크가 큽니다. 앱 제출이 목표라면 초기 Phase에서 병행 착수해야 합니다.
* `docs/design-references/`의 awesome-design-md vendored 사본은 upstream 갱신이 자동 반영되지 않으므로 주기적 동기화가 필요하며, 재배포 조건상 MIT LICENSE 파일과 저작권·출처 고지를 사본과 항상 함께 유지해야 합니다 (DEC-021).
* `apps/api`는 DB 프로비저닝(`DATABASE_URL` Secret, 로컬 PostgreSQL 기동)이 선행돼야 동작합니다. 이는 Agent 작업이 아니라 운영자 bootstrap 단계입니다 — Agent 런타임 이미지는 generic Node 컨테이너로 DB CLI가 없으며, Agent의 마이그레이션 생성·적용은 Node 프로세스만 필요한 `drizzle-kit generate` + 프로그래매틱 `migrate()`로 수행합니다 (01-7 v3 Phase 3 운영자 수동 bootstrap 표에 반영됨, 2026-06-06).
* 부팅 시 `migrate()` 자동 실행은 멱등이지만 다중 레플리카 동시 기동 시 경합이 발생할 수 있습니다. 운영 규모 확대 시 §11 결정 항목에 따라 별도 job으로 분리합니다.
* ClawPod Agent가 작업하는 repo이므로 root `AGENTS.md`에는 TDD, no hardcoding, no direct push to main, RN UI 예외(shadcn/ui N/A)를 명시해야 합니다. 이 4개 항목은 제약(do-not) 축의 최소 집합이며, 전체 root `AGENTS.md` 확장안(6축: repo 구조 / 실행 방법 / build·test·lint 명령 / 컨벤션·PR 기대치 / 제약·do-not / Done 정의·검증)은 [01-6. 개발 지침 (root AGENTS.md 확장안)](https://wondermove-official.atlassian.net/wiki/spaces/mobileappd/pages/1373634583) §5.6을 따릅니다. 실제 repo의 root `AGENTS.md`는 이 6축에 더해 Codex 런타임 운영 섹션(Codex Runtime Paths · Expo/RN Runtime Policy · Mobile QA Selectors · Local Harness Scope)을 포함한다 — §16 참조. `apps/api` 포함 시 제약 축에 3항목을 추가합니다 — 역방향 import 금지(routes→services→db 단방향), API request/response 타입의 `packages/contracts` 밖 ad-hoc 선언 금지, 마이그레이션은 비대화식 절차(`drizzle-kit generate` + 프로그래매틱 `migrate()`)만 사용 (§15).

## 13. 참조 기준

* Expo Workflows: `.eas/workflows`는 `eas.json`과 같은 레벨에 위치
* Expo E2E on EAS Workflows with Maestro: `e2e-test` profile + `build_id` 기반 maestro job
* Expo monorepo guide: SDK 52+ automatic Metro configuration, pnpm isolated dependency 주의
* NativeWind v5 + Tailwind v4 installation: `global.css`(CSS-first `@theme`), `postcss.config.mjs`(`@tailwindcss/postcss`), `babel.config.js`, `withNativewind` Metro wrapper, type declaration 필요 (JS `tailwind.config.js` 불요)
* React Native Testing Library matcher docs: v13+ built-in matcher는 main 패키지 import만으로 자동 등록(별도 setup file 불필요) — v12.x로 내릴 경우에만 `extend-expect` 서브패스 setup 필요
* Expo Sentry guide: EAS Build는 `SENTRY_AUTH_TOKEN`, EAS Update 후 sourcemap upload 필요
* Expo Programmatic Access: Robot user token은 `EXPO_TOKEN` env로 사용
* `DESIGN.md` 스펙: Google이 오픈소스화한 `DESIGN.md` 형식 — root `DESIGN.md` 작성 형식의 기준 (Stitch export/import 호환)
* awesome-design-md: [github.com/VoltAgent/awesome-design-md](https://github.com/VoltAgent/awesome-design-md) (MIT) — 브랜드별 `DESIGN.md` 큐레이션, `docs/design-references/` vendored 사본의 출처
* Hono: 런타임 의존성 0 웹 프레임워크 — `@hono/zod-validator`(1st-party validator), `app.request()` 인메모리 테스트 (테스트 러너 비종속)
* Drizzle ORM: `drizzle-kit generate`는 DB 연결 없이 스키마 diff로 비대화식 SQL 생성, 프로그래매틱 `migrate()`는 이력 테이블 기반 멱등 — Prisma `migrate dev`는 비대화식 환경 미지원(에러 중단)으로 채택 제외
* Turborepo/pnpm 컨테이너화: 워크스페이스별 독립 `test` 스크립트(`turbo run test` 자동 합류), `turbo prune --docker`(빌드 입력 축소) + `pnpm deploy --prod`(런타임 node_modules 격리)
* Kubernetes health 컨벤션: `/livez`·`/readyz` (`/healthz`는 deprecated 명칭), probe는 200\~399 성공 — probe wiring 자체는 호스팅 결정 항목

## 14. 개발 방법론 (이 repo에 적용되는 TDD · 클린 아키텍처)

이 repo에서 Agent가 코드를 작성할 때 따르는 방법론의 요약입니다. 규칙의 상세 본문과 근거는 [01-6. 개발 지침](https://wondermove-official.atlassian.net/wiki/spaces/mobileappd/pages/1373634583)이 소유하며, 이 섹션은 템플릿 구조와 방법론의 대응만 고정합니다 — 두 문서에 같은 규칙을 중복 서술하지 않습니다.

| 방법론 | 이 repo에서의 적용 | 상세 (SoT) |
| --- | --- | --- |
| TDD (red-first) | 모든 feature는 실패 테스트 먼저: mobile `home.test.tsx`(§6·§9), api `counter-events.test.ts`(§15) | 01-6 §5.5 Testing Rules |
| 라우팅·디렉터리 | `src/app/`은 라우트 전용, 비라우트 코드는 `src/components`·`src/hooks`·`src/lib`, feature 디렉터리는 첫 실제 feature task부터 | 01-6 §5.1 |
| 레이어 분리·import 단방향 | mobile: Route ← Feature ← Shared/Contracts. api: routes → services → db (전 레이어가 contracts import 가능, 역방향 금지) | 01-6 §5.2 (mobile) / 본 문서 §15 (api) |
| contracts 단일 SoT | API request/response·공유 도메인 타입·이벤트 schema는 `packages/contracts`에만 정의 — 앱·api 코드에 ad-hoc 중복 선언 금지 | 01-6 §5.2 |
| 상태·검증 경계 | 네트워크 경계를 넘는 데이터는 contracts의 zod schema로 검증 (mobile fetch 레이어 / api `zValidator`) | 01-6 §5.3 State Rules |
| 결정적 강제 | 레이어 규칙은 quality-gate(`pnpm turbo run lint test`)가 PR에서 차단 — ESLint boundaries는 첫 feature 구조와 동시 도입 | 01-6 §5.4 |
| root `AGENTS.md` | 6축 구성(§12 제약 축 + backend 추가분 포함)으로 위 규칙을 Agent에 자동 로딩 | 01-6 §5.6 |

backend(`apps/api`) 레이어 규칙은 이 문서(§15)가 소유합니다 — 01-6은 mobile 코드 지침 중심("템플릿 설계안 자체의 수정은 범위 밖" 명시)이므로 backend 규칙을 01-6으로 이관하지 않기로 결정했습니다 (2026-06-06 결정 기록: 01-8 §15 소유 유지, 01-6 v1 무수정).

## 15. Backend service 워크스페이스 (`apps/api` · 선택)

모바일 앱과 연동할 **신규 backend가 필요한 프로젝트만** 포함하는 선택 워크스페이스입니다 (`apps/console`과 동일한 선택 패턴 — 포함 여부는 §11 결정 항목). 같은 모노레포에 두는 이유는 확정 원칙과 동일합니다: `packages/contracts`를 mobile↔api가 공유하여 contract drift를 컴파일 타임에 차단하고, 한 PR로 원자적으로 추적합니다. 단 backend 작업은 mobile 작업과 분리된 task/PR로 수행합니다 (01-3 Case D/E).

### 15.1 기본 적용 기술 (Mobile Architect-governed template defaults)

| 항목 | 기본값 | 채택 근거 (2026-06-06 표준 조사) |
| --- | --- | --- |
| 프레임워크 | Hono + `@hono/zod-validator` | 런타임 의존성 0·12kB 미만, zod validator 1st-party, `app.request()` 인메모리 테스트 — 미니멀 샘플에서 오버스펙이 구조적으로 불가능 |
| DB | PostgreSQL (postgres.js 드라이버) | Drizzle 다이얼렉트가 컴파일 타임 고정이라 SQLite 출발 후 전환 불가 — 운영 표적과 처음부터 통일 |
| ORM/마이그레이션 | Drizzle ORM + `drizzle-kit generate` + 프로그래매틱 `migrate()` | 비대화식 생성(DB 연결 불필요)·CLI 없는 적용(Node만 필요)·이력 기반 멱등 — Agent 비대화식 제약 충족. Prisma `migrate dev`는 비대화식 미지원으로 제외 |
| 테스트 러너 | vitest (`apps/api` 전용) | TS/ESM 무설정, jest-expo(mobile)와 워크스페이스 경계로 공존 — api `tsconfig`의 `types`를 `["vitest/globals","node"]`로 분리해 전역 충돌 제거 |
| 검증 | zod v4 (모노레포 단일 버전 통일) | contracts가 이미 zod SoT — peer range `^3.25.0 || ^4.0.0`, 실제 설치는 v4 하나로 고정 |
| 인증 경계 | `bearerAuth` 자리표시자 (`/api/*`) + 무인증 `/livez`·`/readyz` | 토큰 발급·세션은 인증 요구사항 정의 시(§11). 결제·PII·푸시는 00-1 human-gate |
| 컨테이너 | multi-stage Dockerfile: `turbo prune --docker` → `tsc` 빌드 → `pnpm deploy --prod`, base `node:22-slim`, 비root `node` 사용자, SIGTERM graceful shutdown | 호스팅 비종속 코어. `tsx`/type-stripping 런타임 실행은 dev 한정 — 타입 체크는 `tsc --noEmit` |

OpenAPI 생성·tRPC/Hono RPC 클라이언트·풀스택 auth(Better Auth 등)·repository 추상화·구조화 로깅 라이브러리·rate limiting은 이 단계에서 채택하지 않습니다 — 각각 트리거 조건(외부/비-TS 소비자, 실제 인증 요구, 운영 관측성 요구)이 충족될 때 추가합니다. 특히 Hono RPC `hc` 클라이언트는 Expo Metro의 subpath 해석 제약이 있어 mobile 타입 공유는 contracts zod 패턴을 유지합니다.

### 15.2 레이어 구조와 import 방향

| 레이어 | 위치 | 책임 | import 가능 대상 |
| --- | --- | --- | --- |
| Route | `src/routes/` | 요청 검증(`zValidator`)·응답 조립 | services, contracts |
| Service | `src/services/` | 비즈니스 로직 | db, contracts |
| DB | `src/db/` | Drizzle 스키마·클라이언트·migrate | contracts (최하층 — 상위 import 금지) |

DB 스키마(`db/schema.ts`)에서 zod를 파생(drizzle-zod)하지 않습니다 — API contract의 SoT는 `packages/contracts` 하나입니다 (SoT 이원화 방지). `turbo prune --docker`는 api의 workspace 의존(contracts 포함)을 자동으로 부분 모노레포에 포함하므로 Dockerfile에 별도 처리가 필요 없습니다.

### 15.3 최소 샘플 (홈 카운터와 대칭)

mobile 홈 카운터가 contracts의 `counterEventSchema`를 import하듯, api는 같은 schema로 round-trip을 증명합니다. 샘플은 아래 집합으로 한정합니다 — 그 이상 추상화 금지.

**NodeNext import 규약**: `apps/api`는 `tsconfig`의 `moduleResolution: NodeNext`(ESM)를 사용하므로, 실제 구현에서 내부 상대 import는 컴파일 산출물 기준 `.js` 확장자를 명시해야 합니다 (예: `import { db } from './db/client.js'`). 아래 코드블록의 상대 import는 가독성을 위한 생략 표기이며, `.js` suffix 없이는 `tsc`가 실패합니다 — 구현 repo로 검증됨 (2026-06-07, 검증 근거 페이지 §5 편차 2 참조).

**packages/contracts/src/index.ts** (추가분)

```
export const counterEventRequestSchema = counterEventSchema;

export const counterEventRecordSchema = counterEventSchema.extend({
  id: z.number().int().positive(),
  createdAt: z.string(),
});
export type CounterEventRecord = z.infer<typeof counterEventRecordSchema>;
```

**apps/api/src/env.ts** (mobile env.ts와 대칭)

```
import { z } from 'zod';

const schema = z.object({
  DATABASE_URL: z.url(),
  API_PORT: z.coerce.number().int().default(3000),
  API_BEARER_TOKEN: z.string().min(1),
});

export const Env = schema.parse({
  DATABASE_URL: process.env.DATABASE_URL,
  API_PORT: process.env.API_PORT,
  API_BEARER_TOKEN: process.env.API_BEARER_TOKEN,
});
```

**apps/api/src/db/schema.ts**

```
import { pgTable, bigserial, integer, timestamp } from 'drizzle-orm/pg-core';

export const counterEvents = pgTable('counter_events', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  count: integer('count').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});
```

**apps/api/src/routes/counter-events.ts**

```
import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { counterEventRequestSchema } from '@template/contracts';
import { createCounterEvent } from '../services/counter-events.service';

export const counterEventsRoute = new Hono().post(
  '/',
  zValidator('json', counterEventRequestSchema),
  async (c) => {
    const record = await createCounterEvent(c.req.valid('json'));
    return c.json(record, 201);
  },
);
```

**apps/api/src/app.ts** (라우트 마운트 + bearer 경계)

```
import { Hono } from 'hono';
import { bearerAuth } from 'hono/bearer-auth';
import { healthRoute } from './routes/health';
import { counterEventsRoute } from './routes/counter-events';
import { Env } from './env';

export const app = new Hono()
  .route('/', healthRoute)                          // /livez, /readyz — 무인증
  .use('/api/*', bearerAuth({ token: Env.API_BEARER_TOKEN }))  // 자리표시자 경계
  .route('/api/counter-events', counterEventsRoute);
```

**test file (red 먼저):** `apps/api/src/routes/__tests__/counter-events.test.ts`

```
import { describe, expect, it } from 'vitest';
import { app } from '../../app';

describe('POST /api/counter-events', () => {
  it('rejects an invalid payload with 400', async () => {
    const res = await app.request('/api/counter-events', {
      method: 'POST',
      headers: { 'content-type': 'application/json', authorization: 'Bearer test' },
      body: JSON.stringify({ count: -1 }),
    });
    expect(res.status).toBe(400);
  });
});
```

**apps/api/src/routes/health.ts** (무인증 /livez·/readyz)

```ts
import { Hono } from 'hono';
import { sql } from 'drizzle-orm';
import { db } from '../db/client';

export const healthRoute = new Hono()
  .get('/livez', (c) => c.json({ status: 'ok' }))
  .get('/readyz', async (c) => {
    try {
      await db.execute(sql`SELECT 1`);
      return c.json({ status: 'ok' });
    } catch {
      return c.json({ status: 'unavailable' }, 503);
    }
  });
```

`/livez`는 프로세스 생존만 알리는 정적 200이고, `/readyz`는 DB ping(`SELECT 1`) 성공 시 200, 실패 시 503을 반환합니다. readyz의 try-catch는 DB 도달 실패를 503 probe 응답으로 분기하기 위한 최소 분기로, §15.1이 채택을 미루는 관측성/추상화 라이브러리와 무관하게 probe 의미론 자체에 필요한 코드입니다.

**apps/api/src/services/counter-events.service.ts** (§15.3 라우트가 import하는 함수)

```ts
import type { CounterEvent, CounterEventRecord } from '@template/contracts';
import { db } from '../db/client';
import { counterEvents } from '../db/schema';

export async function createCounterEvent(
  input: CounterEvent,
): Promise<CounterEventRecord> {
  const [row] = await db.insert(counterEvents).values(input).returning();
  return {
    id: row.id,
    count: row.count,
    createdAt: row.createdAt.toISOString(),
  };
}
```

`createdAt`는 contracts `counterEventRecordSchema`가 ISO 8601 문자열을 요구하므로 `toISOString()`으로 변환합니다.

**apps/api/src/db/client.ts** (postgres.js + drizzle 초기화)

```ts
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { Env } from '../env';
import * as schema from './schema';

const client = postgres(Env.DATABASE_URL);
export const db = drizzle(client, { schema });
```

**apps/api/src/db/migrate.ts** (프로그래매틱 migrate — `drizzle/` 폴더)

```ts
import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';
import { Env } from '../env';

export async function runMigrations() {
  const migrationClient = postgres(Env.DATABASE_URL, { max: 1 });
  await migrate(drizzle(migrationClient), { migrationsFolder: './drizzle' });
  await migrationClient.end();
}
```

마이그레이션 전용 connection은 공식 권고대로 `max: 1`로 분리하고, 적용 후 `end()`로 닫습니다. `migrationsFolder`는 `drizzle-kit generate` 산출물이 위치하는 `drizzle/`(§5 트리)를 가리킵니다.

**apps/api/src/index.ts** (부팅: env 검증 → migrate → serve → SIGTERM)

```ts
import { serve } from '@hono/node-server';
import { app } from './app';
import { Env } from './env';
import { runMigrations } from './db/migrate';

await runMigrations();

const server = serve({ fetch: app.fetch, port: Env.API_PORT });

process.on('SIGTERM', () => {
  server.close((err) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    process.exit(0);
  });
});
```

`import { Env } from './env'`이 import-time에 `schema.parse`로 env를 검증하므로 누락 시 부팅이 즉시 중단됩니다. 이어서 `runMigrations()`를 1회 실행(이력 기반 멱등)한 뒤 `serve`로 `Env.API_PORT`에 리슨하고, SIGTERM 수신 시 `server.close`로 graceful shutdown합니다.

**apps/api/vitest.config.ts** (테스트 env 기본값 주입 — mobile `jest.setup.ts`와 대칭)

```ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    env: {
      DATABASE_URL: 'postgres://test:test@localhost:5432/test',
      API_BEARER_TOKEN: 'test',
    },
  },
});
```

`test.env`로 주입한 기본값 덕분에 route 테스트가 `app.request()`로 인메모리 실행될 때 `env.ts`의 `schema.parse`가 통과합니다.

**apps/api/drizzle.config.ts** (schema/out/dialect)

```ts
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: { url: process.env.DATABASE_URL! },
});
```

**apps/api/package.json** (`@template/contracts`와 동일 스코프 컨벤션)

```json
{
  "name": "@template/api",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "tsx watch src/index.ts",
    "build": "tsc",
    "lint": "tsc --noEmit",
    "test": "vitest run"
  },
  "dependencies": {
    "@hono/node-server": "^1.13.0",
    "@hono/zod-validator": "^0.4.0",
    "@template/contracts": "workspace:*",
    "drizzle-orm": "^0.36.0",
    "hono": "^4.6.0",
    "postgres": "^3.4.5",
    "zod": "^4.0.0"
  },
  "devDependencies": {
    "drizzle-kit": "^0.28.0",
    "tsx": "^4.19.0",
    "typescript": "^5.6.0",
    "vitest": "^2.1.0"
  }
}
```

`lint`은 §7/§15.1대로 `tsc --noEmit` 타입 체크이고, `test`는 vitest로 `pnpm turbo run test`에 자동 합류합니다. `@template/contracts`는 `workspace:*`로 모노레포 내부 참조하며 zod는 §15.1대로 v4 단일 버전으로 고정합니다.

**apps/api/Dockerfile** (multi-stage — §15.1 표 서술과 일치)

```dockerfile
FROM node:22-slim AS prune
RUN npm i -g turbo@^2 pnpm@9
WORKDIR /app
COPY . .
RUN turbo prune --scope=@template/api --docker

FROM node:22-slim AS build
RUN npm i -g pnpm@9
WORKDIR /app
COPY --from=prune /app/out/json/ ./
RUN pnpm install --frozen-lockfile
COPY --from=prune /app/out/full/ ./
RUN pnpm --filter @template/api build
RUN pnpm --filter @template/api deploy --prod /app/deploy

FROM node:22-slim AS runtime
WORKDIR /app
COPY --from=build /app/deploy ./
COPY --from=build /app/apps/api/drizzle ./drizzle
USER node
CMD ["node", "dist/index.js"]
```

`turbo prune --docker`로 api와 그 workspace 의존(`contracts` 포함)만 추린 부분 모노레포를 만들고, `tsc` 빌드 후 `pnpm deploy --prod`로 런타임 `node_modules`를 격리합니다. base는 `node:22-slim`, 비root `node` 사용자로 실행하며 `migrate()`가 참조하는 `drizzle/` 산출물을 함께 복사합니다.

**apps/api/compose.yaml** (로컬 PostgreSQL 1서비스)

```yaml
services:
  postgres:
    image: postgres:16
    environment:
      POSTGRES_USER: app
      POSTGRES_PASSWORD: app
      POSTGRES_DB: app
    ports:
      - '5432:5432'
```

샘플은 운영자/개발 환경에서 `DATABASE_URL` 표적을 띄우기 위한 최소 1서비스로 한정합니다 — healthcheck·볼륨 튜닝은 프로젝트 결정 항목입니다.

route 레이어 테스트는 service를 mock하여 DB 없이 실행합니다 (인메모리 `app.request()`). 테스트용 env 기본값(`DATABASE_URL`·`API_BEARER_TOKEN` 등)은 `vitest.config.ts`의 `test.env`로 주입합니다 — mobile `jest.setup.ts`와 대칭. green 단계에서는 201 응답 본문을 contracts의 `counterEventRecordSchema.parse()`로 단언하여 round-trip(contract 준수)을 증명합니다. service↔실제 PostgreSQL 통합 테스트는 로컬 DB가 가용한 환경에서만 수행합니다.

### 15.4 마이그레이션 운영

* **생성**: `drizzle-kit generate` — DB 연결 없이 스키마 diff로 SQL 생성 (비대화식). 컬럼 rename은 모호성 프롬프트를 유발할 수 있으므로 Agent는 rename 대신 add + 데이터 이전 패턴을 사용합니다.
* **적용**: 앱 부팅 시 프로그래매틱 `migrate()` 자동 실행이 기본값 — 이력 테이블 기반 멱등이라 재실행 안전하며 별도 인프라가 불필요합니다. 분리 시점은 §11 결정 항목.
* **전제**: DB 프로비저닝(`DATABASE_URL` Secret, 로컬 PostgreSQL)은 운영자 bootstrap 단계 (§12 리스크).

**운영자 bootstrap 절차** (`apps/api` 포함 시, 운영자 단계 — Agent 작업 아님):

1. `docker compose -f apps/api/compose.yaml up -d` — 로컬 PostgreSQL 16 기동
2. `DATABASE_URL`을 위 PostgreSQL을 가리키도록 주입 (예: `postgres://app:app@localhost:5432/app`)
3. `pnpm --filter @template/api dev`(또는 컨테이너 `node dist/index.js`)로 부팅 — `index.ts`가 `migrate()`를 1회 실행해 스키마 적용
4. 같은 부팅을 한 번 더 실행 — 이력 테이블 기준 변경 0건으로 `migrate()` 멱등을 확인

### 15.5 완료 기준 (포함 시 §2 DoD에 합산)

- [ ] `counter-events.test.ts`가 red→green으로 통과 (vitest, `pnpm turbo run test` 합류)
- [ ] `migrate()` 2회 연속 실행이 동일 결과 (멱등)
- [ ] `GET /livez`·`GET /readyz`가 무인증 200 응답 (readyz는 DB ping 포함)
- [ ] `docker build -f apps/api/Dockerfile .` 성공 (컨테이너 이미지 산출)

## 16. Codex 런타임 레이어 (Codex CLI runtime)

이 템플릿은 Agent가 OpenAI **Codex CLI**로 작업하기 위한 런타임 레이어를 포함한다. 아래 자산은 repo에 포함되며(대부분 git tracked; `.codex/config.toml` 및 일부 `scripts/*.mjs`는 작업 브랜치에서 커밋 진행 중), OpenAI Codex CLI 공식 사양([developers.openai.com/codex](http://developers.openai.com/codex))에 정합함이 검증되었다(codex-cli 0.137.0 기준 — `.codex/hooks.json`의 SessionStart 훅이 `codex exec` 실행 로그에서 실제 발화 관측됨).

### 16.1 자산 구성

| 경로 | 역할 | 공식 사양(경로) |
| --- | --- | --- |
| `.codex/config.toml` | MCP 서버 등록 — `mobile-mcp`(`npx @mobilenext/mobile-mcp@0.0.58`, 로컬 visual QA/device automation). `@latest` 금지·버전 핀 | project `<repo>/.codex/config.toml` |
| `.codex/agents/*.toml` (×4) | read-only custom agents: `mobile-contract-reviewer` / `mobile-docs-researcher` / `mobile-gate-fix-advisor` / `mobile-implementation-reviewer`. 각 `name`·`description`·`developer_instructions` 필수 3필드 충족 | `<repo>/.codex/agents/` |
| `.codex/hooks.json` + `.codex/hooks/*.mjs` (×4) | lifecycle hooks: SessionStart(컨텍스트 주입)·PreToolUse(정책 차단)·PostToolUse(evidence 리마인더)·Stop(gatekeeper advisory) | `<repo>/.codex/hooks.json` |
| `.agents/skills/<name>/SKILL.md` (×2) | native repo skills: `mobile-app-dev-workflow` / `mobile-backend-api-integrator-workflow` (write-side; review-only 작업은 custom agent로 라우팅). frontmatter `name`+`description` | `.agents/skills/` (cwd→repo root 스캔) |
| `evals/` | 런타임 eval fixtures (skills / agents / hooks / local-harness) | — |
| `scripts/*.mjs` | `validate-runtime-artifacts` · `test-hooks` · `codex-preflight` · `test-local-harness` · `clean-tree-guard` · `codex-headless-review` 등 | — |
| `AGENTS.md` (root) | Codex 자동 로딩 작업 계약 (§12 6축 + Codex Runtime Paths · Expo 정책 · QA selectors · Local Harness Scope) | git root→cwd 병합 |
| `PROJECT_ENVIRONMENT.md` | 환경 SoT (AGENTS.md가 동기 유지 요구) | — |

### 16.2 검증 · 게이트

* 로컬 검증: `pnpm run validate`(skills/agents/hook events 구조) · `pnpm run test:hooks`(hook fixture) · `node scripts/codex-preflight.mjs`(codex 바이너리 arch/version + 헤드리스 smoke — **fail-open skip**, usage-limit 초과 시 차단하지 않음).
* CI: `.github/workflows/quality-gate.yml`이 `pnpm run test:runtime`을 상시 실행하고, Codex 런타임 변경(`.codex/`·`.agents/`·`evals/`·`scripts/`·`AGENTS.md`·`PROJECT_ENVIRONMENT.md` 등) 감지 시 조건부로 `pnpm run test:local-harness`를 실행한다(§7).
* 인증: Codex CLI는 ChatGPT-plan 인증으로 `codex exec`를 비대화식(`approval: never`) 실행한다. usage-limit 초과 시 preflight는 fail-open skip이며 통합 정합성과 무관하다.

---
