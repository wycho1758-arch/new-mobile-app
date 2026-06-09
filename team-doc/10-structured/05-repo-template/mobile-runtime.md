---
docType: "reference"
sourcePageId: "1371963427"
sourceTitle: "01-8. ClawPod Agent용 기본 모바일 앱 프로젝트 템플릿 repo 구성 설계안"
sourceVersion: "20"
sourceHeading: "Mobile runtime sample set"
---

# Mobile runtime sample set

Defines the minimal working sample set the template ships so an Agent can prove monorepo module resolution, unit tests, styling, and cloud E2E from a single home screen. The sample is deliberately scoped to one counter screen, but it must import a shared package, pass unit tests, run a Maestro E2E, and build on EAS cloud.

## Sample boundaries

- **Shared contracts (`packages/contracts`)**: a source-export package (`@template/contracts`) exposing `COUNTER_INCREMENT` and a Zod `counterEventSchema`. `exports` points directly at `./src/index.ts`, so the monorepo resolves it with no build step; jest-expo (babel) and tsx/vitest transform the TS source directly. `zod` is declared as a peer range so consumers (mobile, api) provide a single hoisted version.
- **Env (`apps/mobile/env.ts`)**: a Zod schema parsed at import time, reading `EXPO_PUBLIC_*` keys. Required fields without defaults (`API_URL`, `IOS_BUNDLE_IDENTIFIER`, `ANDROID_PACKAGE`) must have matching values in `jest.setup.ts` or all unit tests collapse at import.
- **App config (`apps/mobile/app.config.ts`)**: reads `process.env` directly (not `./env`) because `@expo/config`'s evalConfig cannot resolve a TS `require('./env')` in a `"type":"module"` monorepo root; runtime `src/` code still uses the validated `Env`. Name, slug, scheme, and bundle/package ids bind to the same `EXPO_PUBLIC_*` keys; `extra.eas.projectId` holds `EAS_PROJECT_ID`. Sentry plugin/sourcemap wiring is opt-in (only when `SENTRY_DSN` is injected).
- **Styling (NativeWind + Tailwind v4)**: `global.css` defines theme tokens CSS-first (no JS `tailwind.config.js`), `postcss.config.mjs` uses `@tailwindcss/postcss`, `metro.config.js` wraps the default Expo config with `withNativewind({ input: './global.css' })`, and `nativewind-env.d.ts` provides the type reference. Manual `watchFolders`/`resolver.nodeModulesPaths` are added only if SDK 52+ resolution actually fails.
- **Sample screen (`src/app/index.tsx`)**: a home counter that imports `COUNTER_INCREMENT` from `@template/contracts` and `Env.APP_DISPLAY_NAME`, using semantic-token classNames and `testID`s (`title`, `counter`, `increment`).
- **Root layout (`src/app/_layout.tsx`)**: imports `global.css`, calls `Sentry.init` (enabled only when DSN present), and exports a `Sentry.wrap`'d Expo Router `Stack`.
- **Unit test (`src/app/__tests__/home.test.tsx`)**: RNTL v13+ (built-in matchers auto-register on import, no setup wiring), asserting the configured title, initial `Count: 0`, and increment to `Count: 1`.
- **Jest setup (`jest.setup.ts`)**: seeds `EXPO_PUBLIC_*` defaults so the env schema parses during tests; preset is `jest-expo`.
- **Babel (`babel.config.js`)**: `babel-preset-expo`, adding `react-native-css/babel` only under the test env.
- **Maestro E2E (`.maestro/home.yml`)**: launches the app (`appId: {{ANDROID_PACKAGE}}`, rendered at generation time), asserts the title and `Count: 0`, taps increment, asserts `Count: 1`. An iOS flow uses a parallel `home-ios.yml` keyed by `{{IOS_BUNDLE_IDENTIFIER}}`.

## TDD order

Write `home.test.tsx` first to confirm red, then implement `jest.setup.ts`, `env.ts`, and `index.tsx` to turn it green. The same red→green cycle applies to `apps/api` when included.

## Source

- Page ID: 1371963427
- Source heading: Mobile runtime sample set
- Source version: 20
