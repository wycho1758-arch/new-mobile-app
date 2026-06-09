# Project Environment

Last updated: 2026-06-09

This file is the root source for the current project environment and runtime settings. Keep it in sync when changing package versions, Expo config, NativeWind config, Codex runtime files, CI gates, EAS workflows, or required environment variables.

## Workspace

- Package manager: `pnpm@9.15.9` from root `package.json`.
- Workspace packages: `apps/*` and `packages/*` from `pnpm-workspace.yaml`.
- Turbo tasks: `lint` and `test` from `turbo.json`.
- Required root gates:
  - `pnpm run test:runtime`
  - `pnpm turbo run lint test`
  - `pnpm run test:local-harness` for Codex runtime changes.

## Mobile Runtime

- App path: `apps/mobile`.
- Framework: Expo SDK 56 with Expo Router.
- Runtime versions:
  - `expo`: `~56.0.9`
  - `react`: `19.2.3`
  - `react-dom`: `19.2.3`
  - `react-native`: `0.85.3`
  - `expo-router`: `~56.2.9`
  - `expo-dev-client`: `~56.0.19`
  - `expo-doctor`: `^1.19.9` as the `doctor` script dependency.
- Expo config: `apps/mobile/app.config.ts`.
  - Dynamic values come from environment variables.
  - Neutral template fallback values exist only so local config evaluation can run without customer values.
  - Preview, production, and EAS build config fail if app display name, slug, scheme, API URL, iOS bundle identifier, or Android package are missing.
  - Customer and production builds must override app display name, slug, scheme, iOS bundle identifier, Android package, and API URL through environment variables.
  - `newArchEnabled` is `true`.
  - Plugin is `expo-router`.
  - `extra.apiUrl` reads `EXPO_PUBLIC_API_URL`.
  - `extra.eas.projectId` reads `EAS_PROJECT_ID`.
- Mobile scripts:
  - `pnpm --filter mobile start`
  - `pnpm --filter mobile ios`
  - `pnpm --filter mobile android`
  - `pnpm --filter mobile run doctor`
  - `pnpm --filter mobile lint`
  - `pnpm --filter mobile test`
  - `pnpm --filter mobile e2e`
- Node baseline:
  - CI uses Node 22.
  - Mobile TypeScript uses `@types/node` 22.x so code cannot type-check against newer Node-only APIs by accident.

## Mobile Styling

- Styling layer: NativeWind with React Native primitives and semantic design tokens.
- Current NativeWind package: `nativewind@5.0.0-preview.4`.
- NativeWind v5 is a pre-release package, so this repo pins the exact preview version.
- NativeWind v5 rollback criteria:
  - Roll back to the last passing NativeWind v4 / Tailwind CSS v3 baseline if SDK 56 compatibility checks, Metro bundling, Jest, native run smoke, or Maestro/mobile visual QA fail because of NativeWind v5 and cannot be fixed in the same PR.
  - Do not promote a production release with unresolved NativeWind v5 rendering, bundling, or native runtime defects.
- Tailwind/PostCSS:
  - `tailwindcss`: `^4.3.0`
  - `@tailwindcss/postcss`: `^4.3.0`
  - `postcss`: `^8.5.15`
  - `lightningcss`: `1.30.1`
  - root pnpm override pins `lightningcss` to `1.30.1`.
  - PostCSS config: `apps/mobile/postcss.config.mjs`
- NativeWind dependencies:
  - `react-native-css`: `^3.0.7`
  - `react-native-reanimated`: `4.3.1`
  - `react-native-worklets`: `0.8.3`
  - `react-native-safe-area-context`: `~5.7.0`
- NativeWind config files:
  - `apps/mobile/babel.config.js` uses `babel-preset-expo` for runtime builds and adds `react-native-css/babel` only when `api.env('test')` is true so Jest can exercise className translation outside Metro.
  - `apps/mobile/metro.config.js` wraps Expo Metro with `withNativewind(config, { input: './global.css' })`.
  - `apps/mobile/global.css` imports Tailwind theme/preflight/utilities and `nativewind/theme`; semantic colors are defined with `@theme`.
  - `apps/mobile/nativewind-env.d.ts` references `react-native-css/types`.
  - `apps/mobile/jest.after-env.js` imports `react-native-css/jest` through Jest `setupFilesAfterEnv`.
  - `apps/mobile/src/app/_layout.tsx` imports `../../global.css`.
  - There is no active `tailwind.config.js`; Tailwind CSS v4 configuration is CSS-first.

## Mobile Environment Variables

Public JS runtime variables are parsed by `apps/mobile/env.ts`; app config variables are read directly by `apps/mobile/app.config.ts`.

`EXPO_PUBLIC_*` values are compiled into the client app and are not private. Use them only for public client configuration, never for tokens, passwords, bearer credentials, signing keys, or private service endpoints. Customer-specific and production values still must be injected through environment management instead of being hardcoded in the repo.

- Public JS runtime variables:
  - `EXPO_PUBLIC_APP_ENV`: `development`, `preview`, or `production`; default `development`.
  - `EXPO_PUBLIC_APP_DISPLAY_NAME`: optional in the runtime parser, default is `Mobile App Template`; required explicitly by preview, production, and EAS build config.
  - `EXPO_PUBLIC_API_URL`: required URL.
- Public app config variables:
  - `EXPO_PUBLIC_APP_SLUG`: required by preview, production, and EAS build config.
  - `EXPO_PUBLIC_APP_SCHEME`: required by preview, production, and EAS build config.
  - `EXPO_PUBLIC_IOS_BUNDLE_IDENTIFIER`: required.
  - `EXPO_PUBLIC_ANDROID_PACKAGE`: required.
- Non-public variables:
  - `EAS_PROJECT_ID`: optional UUID.
Do not hardcode customer app names, bundle IDs, API URLs, tokens, or credentials.

## EAS And Maestro

- EAS config: `apps/mobile/eas.json`.
  - `development`: development client, internal distribution, `development` channel, `development` EAS environment.
  - `preview`: internal distribution, `preview` channel, `preview` EAS environment.
  - `production`: `production` channel with auto increment and `production` EAS environment.
  - `e2e-test`: Android APK and iOS simulator settings without credentials, using the `preview` EAS environment.
- EAS workflows:
  - `apps/mobile/.eas/workflows/build-and-submit.yml`: production build jobs use the `production` EAS environment and set `EXPO_PUBLIC_APP_ENV=production`.
  - `apps/mobile/.eas/workflows/e2e-test-android.yml`: E2E build job uses the `preview` EAS environment and sets `EXPO_PUBLIC_APP_ENV=preview`.
  - `apps/mobile/.eas/workflows/ota-update.yml`: preview update job uses the `preview` EAS environment and sets `EXPO_PUBLIC_APP_ENV=preview`.
- Maestro flows: `apps/mobile/.maestro`.
- Current stable testIDs:
  - `home-title`
  - `counter-value`
  - `counter-increment-button`
- Prefer Maestro `id` selectors over visible text.

## API Runtime

- API path: `apps/api`.
- Stack: Hono, Drizzle ORM, postgres, zod.
- Scripts:
  - `pnpm --filter @template/api dev`
  - `pnpm --filter @template/api build`
  - `pnpm --filter @template/api lint`
  - `pnpm --filter @template/api test`
- Environment variables from `apps/api/src/env.ts`:
  - `DATABASE_URL`: required URL.
  - `API_PORT`: integer, default `3000`.
  - `API_BEARER_TOKEN`: required secret.
- Import direction remains routes to services to db only.
- Shared API/domain schemas must come from `packages/contracts`.

## Contracts Package

- Package path: `packages/contracts`.
- Export: `./src/index.ts`.
- Peer dependency: `zod ^3.25.0 || ^4.0.0`.
- This package is the single source of truth for API request/response types and shared domain schemas.

## Codex Runtime

- Installed Codex plugin marketplaces:
  - `expo-plugins`
    - source: `expo/skills`
    - ref: `main`
    - marketplace root: `/Users/tw.kim/.codex/.tmp/marketplaces/expo-plugins`
- Installed Codex plugins:
  - `expo@expo-plugins`
    - version: `1.1.0`
    - status: installed and enabled
    - plugin root: `/Users/tw.kim/.codex/plugins/cache/expo-plugins/expo/1.1.0`
    - use only for generic Expo, React Native, EAS, dev client, SDK upgrade, deployment, native UI, API route, and data fetching guidance.
    - repo skills remain authoritative for contracts, role boundaries, evidence, and QA gates.
- Repo skills: `.agents/skills/<skill-name>/SKILL.md`.
  - `$wm` plans must be SoT-grounded: material planning decisions cite or name verified SoT inputs, and missing or ambiguous SoT must be reported as unknown/blocked instead of being filled by predictions, assumptions, or expected behavior.
  - `$wm` implementation runs require persisted read-only reviewer evidence for both the completed plan and the actual completed work, and final user reports must include material `git diff` change details.
- Custom agents: `.codex/agents/<agent-name>.toml`.
  - wm review routing uses dedicated read-only agents:
    - `wm-implementation-reviewer`
    - `wm-contract-reviewer`
    - `wm-docs-researcher`
    - `wm-gate-fix-advisor`
  - legacy `mobile-*` agents remain available for other runtime/eval surfaces, but `$wm` reviewer routing and `scripts/codex-headless-review.mjs` allow only the `wm-*` agents.
- Hooks: `.codex/hooks.json` and `.codex/hooks/*.mjs`.
- MCP config: `.codex/config.toml`.
- Root Claude runtime artifacts are not part of the active Codex runtime:
  - `CLAUDE.md`
  - `.claude/`
  - `.claude-state/`
  - `scripts/validate-runtime-artifacts.mjs` rejects these root paths. Third-party files with the same names under ignored dependency directories are outside this policy.
- Required project MCP servers:
  - `mobile-mcp`
  - command: `npx`
  - args: `-y @mobilenext/mobile-mcp@0.0.58`
  - local visual QA/device automation is required for mobile UI/runtime checks when a simulator or device is available.
  - it is excluded from required CI gates.
  - simulator and device operations must be serialized, not parallelized.
  - `serena`
  - command: `uvx`
  - args: `-p 3.13 --from git+https://github.com/oraios/serena@v1.5.3 serena start-mcp-server --project-from-cwd --context=codex`
  - symbolic navigation MCP for symbol overview, symbol lookup, reference search, and bounded repo code navigation.
- Plugin-provided MCP servers:
  - `expo`
  - URL: `https://mcp.expo.dev/mcp`
  - status: enabled
  - authentication status: not logged in
  - this does not replace `mobile-mcp` for local visual QA/device automation.
- Runtime scripts:
  - `scripts/validate-runtime-artifacts.mjs`
    - The root `validate` package script removes transient `.claude-state` before running this validator, while the validator itself still rejects root Claude runtime artifacts.
  - `scripts/codex-headless-review.mjs`
    - Codex-only read-only helper: `codex -a never exec -m gpt-5.5 -c 'model_reasoning_effort="high"' -s read-only`.
    - no Claude, `--engine auto`, or `review_engine_preference` fallback path.
  - `scripts/test-hooks.mjs`
  - `scripts/clean-tree-guard.mjs`
  - `scripts/codex-preflight.mjs`
  - `scripts/test-local-harness.mjs`
- Local harness path: `evals/local-harness`.
- Local harness result path: `evals/local-harness/results`.
- Runtime stability evidence path: `.evidence/`.

## CI

- GitHub quality gate: `.github/workflows/quality-gate.yml`.
- Always runs:
  - `pnpm run test:runtime`
  - `pnpm turbo run lint test`
- Does not run `mobile-mcp`; mobile device automation remains a local QA gate.
- Runs `pnpm run test:local-harness` when these paths change:
  - `.agents/**`
  - `.codex/**`
  - `evals/{skills,agents,hooks,local-harness}/**`
  - `scripts/{validate-runtime-artifacts,codex-headless-review,test-hooks,test-local-harness,clean-tree-guard,codex-preflight}.mjs`
  - `.github/workflows/quality-gate.yml`
  - `PROJECT_ENVIRONMENT.md`
  - `docs/{confluence,plans}/**`
  - `AGENTS.md`
  - `package.json`
  - `pnpm-lock.yaml`

## Current Non-Scope

- Do not restore OpenClaw packaging scripts or generated package results unless a new source-of-truth explicitly reintroduces that runtime.
- Do not add shadcn/ui to React Native screens.
- Do not add secrets, customer-specific identifiers, or production API URLs to the repo.
