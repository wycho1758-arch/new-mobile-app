# Mobile Web E2E Implementation Review

Date: 2026-06-09

## Scope

- Add RN Web browser E2E as the first automated layer for browser-reproducible mobile app UI/state logic.
- Keep native completion separate and selectable by user request without weakening Maestro or mobile-mcp requirements.

## Plan Review

Read-only reviewer `019eabb1-de8d-76c1-a1e2-6e4e1d5dfdb6` reviewed the initial plan.

Findings addressed:

- Added deterministic Playwright env for `EXPO_PUBLIC_APP_ENV` and `EXPO_PUBLIC_API_URL`.
- Kept native completion language as HUMAN-GATE/manual evidence only when Maestro/mobile-mcp are unavailable or user-selected.
- Listed verification commands and evidence expectations.
- Installed `react-native-web` through Expo-compatible `expo install` path and kept `@playwright/test` as dev dependency.
- Avoided adding Playwright globals to the app Jest/RNTL TypeScript types.

## Final Review

Read-only reviewer `019eabbf-a28a-78e1-b335-0fde004c3b96` reviewed the completed implementation.

Findings addressed:

- `reuseExistingServer` is now `false` so local Playwright runs do not reuse stale Expo Web env.
- Setup docs now include `pnpm --filter mobile exec playwright install chromium`.
- `.gitignore` now excludes Playwright report/test result output.

Read-only reviewer `019eabc7-1b3e-7053-b5e4-32fb4687a4c1` reviewed the follow-up fixes.

Findings addressed:

- `playwright.config.ts` now sets all neutral public test identity values and `EAS_BUILD=false` in `webServer.env`.
- Verified reviewer reproduction cases:
  - `EXPO_PUBLIC_APP_DISPLAY_NAME= pnpm --filter mobile e2e:web`
  - `EAS_BUILD=true pnpm --filter mobile e2e:web`

Remaining reviewer-identified gap:

- `pnpm run test:runtime` and `pnpm run test:local-harness` are blocked by pre-existing root `CLAUDE.md` and `.claude` artifacts rejected by `scripts/validate-runtime-artifacts.mjs`.

## Verification

Passed:

- `pnpm --filter mobile exec expo install --check`
- `pnpm --filter mobile lint`
- `pnpm --filter mobile test`
- `pnpm --filter mobile exec playwright install chromium`
- `pnpm --filter mobile e2e:web`
- `EXPO_PUBLIC_APP_DISPLAY_NAME= pnpm --filter mobile e2e:web`
- `EAS_BUILD=true pnpm --filter mobile e2e:web`
- `pnpm --filter mobile run doctor`
- `/opt/homebrew/bin/codex mcp list` showed `mobile-mcp` enabled with `@mobilenext/mobile-mcp@0.0.58`.
- `mcp__mobile_mcp.mobile_list_available_devices` returned `{"devices":[]}`.
- `pnpm turbo run lint test`
- `git diff --check`

Blocked by unrelated existing artifacts:

- `pnpm run test:runtime`
- `pnpm run test:local-harness`

Notes:

- `pnpm --filter mobile e2e:web` initially failed after disabling stale server reuse because local `node_modules` had only `lightningcss-darwin-arm64` while Node was running as `darwin x64`. `pnpm install --force` restored `lightningcss-darwin-x64`, and the E2E then passed.
