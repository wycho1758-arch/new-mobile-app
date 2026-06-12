# Mobile Web Transition Plan Review

Date: 2026-06-09
Mode: `$wm` planning/review only
Requested target: ReactJS mobile web app, optionally in `~/Documents/AGA/test/mobile-web-app`

## Scope

Assess what must change to move the current React Native / Expo mobile template toward a ReactJS mobile web app, reducing MVP dependency on emulator/simulator workflows. No implementation changes are included in this review.

## Verified SoT Inputs

- `AGENTS.md:7-11`: TDD, no hardcoded customer identifiers, no direct main push, no external runtime repo edits, RN UI policy.
- `AGENTS.md:26-32`: current monorepo structure and `packages/contracts` as shared contract source.
- `AGENTS.md:36-40`: current mobile baseline is Expo SDK 56 / React Native 0.85 / NativeWind / EAS / mobile-mcp.
- `AGENTS.md:80-84`: contracts are single SoT and PR gates apply.
- `AGENTS.md:100-104`: required verification for workspace, runtime, and mobile runtime changes.
- `PROJECT_ENVIRONMENT.md:19-45`: `apps/mobile` is Expo SDK 56 with Expo Router and native run scripts.
- `PROJECT_ENVIRONMENT.md:52-77`: styling is NativeWind v5 over RN primitives with Metro, Babel, Jest setup.
- `PROJECT_ENVIRONMENT.md:81-96`: current client env surface uses `EXPO_PUBLIC_*`.
- `PROJECT_ENVIRONMENT.md:98-114`: EAS and Maestro are current mobile QA/deployment surfaces.
- `PROJECT_ENVIRONMENT.md:132-137`: `packages/contracts` remains shared API/domain SoT.
- `PROJECT_ENVIRONMENT.md:170-180`: `mobile-mcp` and `serena` are required project MCP servers; Serena is for bounded symbolic navigation.
- `apps/mobile/package.json:4-29`: current app is Expo Router / React Native / NativeWind.
- `apps/mobile/package.json:31-53`: current tests use Jest, Jest Expo, and `@testing-library/react-native`.
- `apps/mobile/src/app/index.tsx:1-22`: current screen uses RN primitives and imports `@template/contracts`.
- `apps/mobile/src/app/_layout.tsx:1-6`: current root layout imports Expo Router `Stack`.
- `apps/mobile/src/app/__tests__/home.test.tsx:1-30`: current tests assert RN `testID`, `fireEvent.press`, and NativeWind style translation.
- `packages/contracts/src/index.ts:1-16`: counter schema and constant are already in shared contracts.

## Serena Findings

- `apps/mobile/src/app/index.tsx` has a single `Home` function symbol. Its body depends on `View`, `Text`, `Pressable`, `testID`, `onPress`, NativeWind class names, `Env`, and `COUNTER_INCREMENT`.
- `apps/mobile/src/app/_layout.tsx` has a single `RootLayout` function symbol returning an Expo Router `Stack`.
- `apps/mobile/env.ts` exposes an `Env` constant parsed from `EXPO_PUBLIC_*`.
- `packages/contracts/src/index.ts` exports `COUNTER_INCREMENT` and counter event schemas. This should be retained or copied as a workspace package in any new web repo.

## Main Decision

Recommended path: create a new repo at `~/Documents/AGA/test/mobile-web-app` and migrate incrementally.

Reasoning:

- The existing repo is explicitly documented as an Expo/RN template runtime with EAS, Maestro, mobile-mcp, NativeWind over RN primitives, and runtime Codex gates.
- Converting the same repo in place would require changing root SoT, Codex runtime expectations, CI gates, mobile QA definitions, package scripts, environment docs, and possibly reviewer/skill boundaries before the small app surface can be considered done.
- A new ReactJS mobile web repo can reuse the shared app behavior and contract model without destabilizing the current WonderMove mobile-agent runtime template.

## Option A: New Repo Migration

Owner role:

- Mobile UI/runtime owner for React web app scaffold and screen migration.
- Backend/API integrator only if API contracts or `apps/api` integration are changed.
- Read-only reviewer before implementation and after implementation if using `$wm` workflow evidence.

Affected paths in current repo:

- None for implementation if the current repo is preserved.
- Optional evidence/docs only if tracking migration decisions in the current repo.

New repo expected paths:

- `~/Documents/AGA/test/mobile-web-app/package.json`
- `~/Documents/AGA/test/mobile-web-app/src/`
- `~/Documents/AGA/test/mobile-web-app/src/App.tsx` or route-based equivalent
- `~/Documents/AGA/test/mobile-web-app/src/env.ts`
- `~/Documents/AGA/test/mobile-web-app/src/index.css`
- `~/Documents/AGA/test/mobile-web-app/packages/contracts/` or a clearly versioned import strategy
- `~/Documents/AGA/test/mobile-web-app/tests/` or colocated component tests

Implementation phases:

1. Scaffold ReactJS mobile web repo with pnpm, TypeScript, Vite or equivalent, React 19-compatible test stack, and Tailwind CSS v4.
2. Add tests first for the current MVP behavior: configured title renders, counter starts at 0, increment button updates to 1, semantic color tokens apply.
3. Port `COUNTER_INCREMENT` and counter schemas from `packages/contracts`, preserving a contract SoT instead of ad-hoc duplicates.
4. Port `Env` from `EXPO_PUBLIC_*` to web bundler public variables, for example `VITE_*`, without hardcoded customer identifiers or secrets.
5. Replace RN primitives with semantic web elements:
   - `View` to layout `main` or `div`
   - `Text` to heading/paragraph/span
   - `Pressable` to `button`
   - `testID` to `data-testid`
   - `onPress` to `onClick`
6. Replace Expo Router root layout with React DOM mount and web routing only if more than one route is needed.
7. Replace NativeWind RN runtime with Tailwind CSS v4 CSS-first setup and the same semantic tokens.
8. Replace Jest Expo / `@testing-library/react-native` with Vitest or Jest plus `@testing-library/react` and `@testing-library/user-event`.
9. Replace emulator/simulator QA with browser QA: Playwright smoke on desktop and mobile viewport, plus component tests.
10. Decide whether the backend remains in the old repo, is copied into the new repo, or is extracted separately. Keep API schemas in one shared package or an explicit generated artifact.

Expected tests:

- Unit/component: title, counter, click behavior, environment fallback/validation, contract constant usage.
- Browser smoke: mobile viewport loads, no console errors, counter interaction works.
- Typecheck/lint: `tsc --noEmit`, app lint if configured.

Gate impact:

- Current repo gates remain unchanged if no runtime files are modified.
- New repo gates should be defined from scratch around web lint/test/build/browser smoke.
- Current mobile gates such as `expo install --check`, native run smoke, Maestro, EAS, and mobile-mcp should not be required for the new web-only repo unless a future SoT explicitly keeps Expo/RN.

Human gates:

- Confirm whether `mobile-web-app` is an independent product repo or a migration staging repo.
- Confirm whether backend/API stays in `new-mobile-app`, moves to `mobile-web-app`, or is shared by package publishing/workspace linkage.
- Confirm deployment target for MVP web app, because environment variable naming and build gate differ by host.

## Option B: In-Place Conversion

Owner role:

- Runtime/environment owner plus Mobile UI/runtime owner. This is not just a screen port.

Affected paths:

- `AGENTS.md`
- `PROJECT_ENVIRONMENT.md`
- root `package.json`
- `pnpm-workspace.yaml`
- `turbo.json`
- `apps/mobile/package.json`
- `apps/mobile/src/app/**`
- `apps/mobile/app.config.ts`
- `apps/mobile/metro.config.js`
- `apps/mobile/babel.config.js`
- `apps/mobile/jest.*`
- `apps/mobile/.eas/**`
- `apps/mobile/.maestro/**`
- `.codex/config.toml`
- `.codex/agents/**`
- `.agents/skills/**`
- `evals/**`
- `.github/workflows/**`

Required changes:

- Rewrite SoT from Expo/RN baseline to ReactJS web baseline.
- Remove or de-scope EAS, Expo dev client, native run scripts, Maestro, mobile-mcp visual QA, Metro, NativeWind RN setup, Jest Expo setup, and RN testing library.
- Rename `apps/mobile` or create a new `apps/web` package to avoid policy mismatch.
- Replace environment handling and tests.
- Update local harness/evals if they assert mobile-agent runtime structure.

Gate impact:

- High. This touches runtime paths that trigger `pnpm run test:runtime`, `pnpm run test:local-harness`, and `pnpm turbo run lint test`.
- Current mobile Definition of Done would become stale unless SoT is updated in the same PR.

Risk:

- High risk of breaking the repo's purpose as "mobile app template runtime for WonderMove mobile agents".
- Requires reviewer evidence and likely human approval before proceeding.

## Recommendation

Use Option A for MVP. Preserve `new-mobile-app` as the RN/Expo runtime SoT, create `~/Documents/AGA/test/mobile-web-app` as the ReactJS mobile web app, and migrate only the minimal behavior and contract model first. Treat in-place conversion as a separate strategic repo-retargeting effort, not an MVP simplification.

## Initial Implementation Plan For Option A

1. Create `mobile-web-app` with pnpm + TypeScript + React + Vite + Tailwind CSS v4.
2. Add tests first for current MVP behavior using `@testing-library/react` and `user-event`.
3. Add or copy a contracts package strategy and assert `COUNTER_INCREMENT` is imported from that SoT.
4. Implement the web `Home` screen with semantic HTML and Tailwind semantic tokens.
5. Add browser smoke with Playwright for a mobile viewport.
6. Run `pnpm install`, typecheck/lint/test/build, and Playwright smoke in the new repo.
7. Leave current repo runtime gates untouched unless a tracking doc/evidence PR is intentionally opened here.

## Blockers / Unknowns

- Deployment target for web MVP is not specified.
- Backend ownership and whether API should move with the web app is not specified.
- Whether the new repo should copy the Codex/WonderMove runtime layer is not specified. Default recommendation is no for MVP.
