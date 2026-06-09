# Codex CLI Expo/RN Runtime Stability Plan

Date: 2026-06-08
Status: Applied

## Objective

Stabilize the repository as a complete Codex CLI based Expo/React Native development runtime. This file tracks applied runtime setup, not a future roadmap.

## Applied Runtime

- Expo SDK 56 in `apps/mobile`.
- `expo-dev-client` installed and mobile scripts added.
- NativeWind v5 preview with Tailwind CSS v4.
- Required `mobile-mcp` in `.codex/config.toml`.
- Root runtime SoT added at `PROJECT_ENVIRONMENT.md`.
- Confluence-ready update added at `docs/confluence/20260608-codex-expo-rn-runtime-sot-update.md`.

## Mobile Package Baseline

- `expo ~56.0.9`
- `react 19.2.3`
- `react-dom 19.2.3`
- `react-native 0.85.3`
- `expo-router ~56.2.9`
- `expo-dev-client ~56.0.19`
- `expo-doctor ^1.19.9`

## Expo Config

- File: `apps/mobile/app.config.ts`
- `newArchEnabled: true`
- plugins: `expo-router`
- neutral template fallback values are local-only.
- preview, production, and EAS build config fail when app identity values or API URL are missing.
- `eas.json` maps development, preview, production, and e2e-test profiles to explicit EAS environments.
- EAS build/update workflows set `EXPO_PUBLIC_APP_ENV` explicitly so release guards run for preview and production jobs.

## NativeWind v5 Preview

- `nativewind 5.0.0-preview.4`
- `react-native-css ^3.0.7`
- `react-native-reanimated 4.3.1`
- `react-native-worklets 0.8.3`
- `react-native-safe-area-context ~5.7.0`
- `tailwindcss ^4.3.0`
- `@tailwindcss/postcss ^4.3.0`
- `postcss ^8.5.15`
- `lightningcss 1.30.1`

Config files:

- `apps/mobile/babel.config.js`
- `apps/mobile/metro.config.js`
- `apps/mobile/postcss.config.mjs`
- `apps/mobile/global.css`
- `apps/mobile/nativewind-env.d.ts`
- `apps/mobile/jest.after-env.js`

Removed stale file:

- `apps/mobile/tailwind.config.js`

## mobile-mcp

Config file:

- `.codex/config.toml`

Pinned server:

```toml
[mcp_servers.mobile-mcp]
command = "npx"
args = ["-y", "@mobilenext/mobile-mcp@0.0.58"]
```

Rules:

- Required for local visual QA/device automation.
- Not a CI-required gate.
- Do not parallelize simulator/device operations.

## CI And Local Harness

Workflow:

- `.github/workflows/quality-gate.yml`

Always runs:

- `pnpm run test:runtime`
- `pnpm turbo run lint test`

Conditionally runs:

- `pnpm run test:local-harness`

Conditional paths include:

- `.agents/**`
- `.codex/**`
- `evals/{skills,agents,hooks,local-harness}/**`
- runtime scripts under `scripts/`
- `.github/workflows/quality-gate.yml`
- `AGENTS.md`
- `PROJECT_ENVIRONMENT.md`
- `docs/{confluence,plans}/**`
- `package.json`
- `pnpm-lock.yaml`

## Mobile QA Selectors

- `home-title`
- `counter-value`
- `counter-increment-button`

Updated together:

- app code
- Jest test
- Maestro flow

## Required Verification

```bash
pnpm --filter mobile exec expo install --check
codex mcp list
pnpm --filter mobile lint
pnpm --filter mobile test -- --runInBand
pnpm --filter mobile run doctor
pnpm run test:runtime
pnpm turbo run lint test
pnpm run test:local-harness
```

Device/runtime commands require a simulator/emulator and account access:

```bash
pnpm --filter mobile ios
pnpm --filter mobile android
pnpm --filter mobile e2e
```

## Documentation Sync

Keep these files synchronized with actual repo settings:

- `PROJECT_ENVIRONMENT.md`
- `AGENTS.md`
- `docs/confluence/20260608-codex-expo-rn-runtime-sot-update.md`
- `docs/CREDENTIALS.md`
- `docs/SETUP.md`
- `docs/TEMPLATE_VARIABLES.md`
- `apps/mobile/README.md`
