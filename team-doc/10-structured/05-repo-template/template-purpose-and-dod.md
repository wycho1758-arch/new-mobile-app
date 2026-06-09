---
docType: "reference"
sourcePageId: "1371963427"
sourceTitle: "01-8. ClawPod Agent용 기본 모바일 앱 프로젝트 템플릿 repo 구성 설계안"
sourceVersion: "20"
sourceHeading: "Purpose and Definition of Done"
---

# Purpose and Definition of Done

## Purpose

This template repo is the Source of Truth for the **baseline mobile app project template** that a ClawPod-generated Agent uses when starting a new per-customer/per-project mobile app or taking one over — it is not a design for ClawPod's own mobile app. The template must be an executable starting point that lets an Agent build, test, and run a mobile app's skeleton through EAS cloud (build / submit / OTA) **without a Mac or a physical device**.

No ClawPod brand, API, or app identifier is hardcoded, not even as a sample default. App name, bundle identifier, Android package, API URL, Expo project, Sentry project, and Store account are all template variables injected at project-generation time.

## Confirmed principles

- **Monorepo by default**, so the Agent can view app, shared types/schema, tests, and EAS config in one repo and change them atomically in one PR.
- The sample is limited to a **single home-screen counter** to avoid over-spec, but it must pass the full chain: shared-package import → unit test → Maestro E2E → EAS cloud build.
- Web-only shadcn/ui is not forced on the React Native app; RN screens use NativeWind + RN primitives + semantic design tokens. An optional web console, if present, follows shadcn/ui rules.
- Per official Expo docs, SDK 52+ generally needs no manual monorepo Metro setup, but because NativeWind is used, `metro.config.js` must wrap `expo/metro-config`'s default config with `withNativeWind`. Manual `watchFolders` / `resolver.nodeModulesPaths` are added only when a real resolution failure reproduces.
- An optional `apps/api` workspace lives in the same monorepo for projects that need a **new backend** (§15). Projects that only integrate with an existing customer backend omit `apps/api` and use only contract sharing (`packages/contracts`) plus the mobile-api-contract procedure. Backend work stays in a separate task/PR from mobile work, cross-linked (preserving the Case D/E separation principle from 01-3).

## Goal / Definition of Done

A complete baseline template where, after clone or generation, an Agent can start mobile work with only **project-variable input + external-service connection**. Items related to Maestro E2E, EAS Workflows, Sentry sourcemap, and store submit are verifiable only after external services are connected (Expo account · `eas init` · Robot token — pre-registration guide §5 Day 1).

**Implementation status (2026-06-07):** The template repo is implemented and verified in `Wondermove-Inc/new-mobile-app` (branch `feat/mobile-app-template`, 6 commits; push/PR awaiting operator instruction). DoD verdict: **PASS 16 / HUMAN-GATE 1 / FAIL 0.**

Completion criteria:

- pnpm workspace + Turborepo work, and the shared `packages/contracts` module resolves in `apps/mobile`.
- The home-screen counter sample imports a shared constant and renders/operates.
- Jest unit test (`home.test.tsx`) passes locally and in CI; `jest.setup.ts` injects test env.
- RNTL pinned to v13+ — built-in matchers register on import so `toHaveTextContent` works.
- NativeWind v5 (preview) + Tailwind v4 work via `global.css` (CSS-first), `postcss.config.mjs`, the `withNativeWind` Metro wrapper, and `nativewind-env.d.ts` (no JS `tailwind.config.js`; theme defined in CSS).
- **HUMAN-GATE:** Maestro E2E (`home.yml`) passes as the EAS Workflows maestro job — artifacts complete, only the live pass remains (requires EAS cloud prerequisites).
- `eas.json` defines development/preview/production + e2e-test profiles.
- `.eas/workflows` wires build→maestro / build→submit / update jobs.
- `@sentry/react-native` init and EAS Build/Update sourcemap upload procedure documented.
- Example k8s Secret manifest injects the Agent's `EXPO_TOKEN`.
- Root `AGENTS.md`, `docs/SETUP.md`, and `docs/CREDENTIALS.md` complete.
- Root `DESIGN.md` exists and `docs/design-references/` holds the vendored awesome-design-md copy with MIT LICENSE and attribution (DEC-021).
- (Optional) If `apps/api` is included, the four §15 backend criteria are met (in-memory unit test passes / idempotent `migrate()` re-run / unauthenticated health response / container image build).
- No hardcoded customer/app identifiers — everything substitutable via template variables.

## Source

- Page ID: 1371963427
- Source heading: Purpose and Definition of Done
- Source version: 20
