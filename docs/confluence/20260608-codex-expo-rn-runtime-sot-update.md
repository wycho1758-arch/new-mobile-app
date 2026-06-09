# Codex CLI Expo/RN Runtime Environment SoT Update

Date: 2026-06-08
Status: Environment runtime SoT synchronized; Expo Codex plugin activated 2026-06-09; hook Source Basis publication tracked separately

## Decision Summary

The mobile template runtime now standardizes on Codex CLI plus Expo SDK 56, `expo-dev-client`, NativeWind v5 preview, the official Expo Codex plugin, and pinned `mobile-mcp` local QA tooling. These are environment settings, not optional roadmap items.

Root source in repo:

- `PROJECT_ENVIRONMENT.md`

Boundary:

- This document covers the current environment/runtime setup only.
- Hook Source Basis publication evidence is tracked separately in `docs/plans/active/20260608-codex-hook-source-basis-confluence-update-plan.md` and `.evidence/codex-runtime-stability/source-basis-published-*.md`.

Published hook Source Basis inventory:

| Page | Page ID | Version |
| --- | ---: | ---: |
| `Hooks` | `1374060648` | 2 |
| `hook-evaluation-and-ci-gate` | `1374355561` | 2 |
| `mobile-pretool-policy-hook` | `1374290046` | 2 |
| `mobile-posttool-evidence-reminder-hook` | `1374388296` | 2 |
| `mobile-stop-gatekeeper-advisory-hook` | `1374355521` | 2 |
| `Role-specific Codex Runtime` | `1374289964` | 2 |
| `codex-cli-native-runtime-paths` | `1374355481` | 2 |
| `Mobile Codex CLI 실무 지침서` | `1374519410` | 2 |
| `mobile-session-start-context-hook` | `1376845825` | 1 |
| `mobile-user-prompt-policy-hook` | `1376878593` | 1 |
| `mobile-permission-policy-hook` | `1376911361` | 1 |

## Applied Mobile Runtime

App path:

- `apps/mobile`

Applied package baseline:

- `expo`: `~56.0.9`
- `react`: `19.2.3`
- `react-dom`: `19.2.3`
- `react-native`: `0.85.3`
- `expo-router`: `~56.2.9`
- `expo-dev-client`: `~56.0.19`
- `expo-doctor`: `^1.19.9`

Applied Expo config:

- `apps/mobile/app.config.ts`
- `newArchEnabled: true`
- plugins:
  - `expo-router`
- dynamic app name, slug, scheme, bundle ID, package ID, API URL, and EAS project ID remain environment-driven.
- neutral template fallback values exist only for local config evaluation.
- preview, production, and EAS build config fail if app display name, slug, scheme, API URL, iOS bundle identifier, or Android package are missing.
- customer and production builds must override app display name, slug, scheme, API URL, iOS bundle identifier, and Android package through environment variables.

Applied mobile scripts:

- `pnpm --filter mobile start`
- `pnpm --filter mobile ios`
- `pnpm --filter mobile android`
- `pnpm --filter mobile run doctor`
- `pnpm --filter mobile lint`
- `pnpm --filter mobile test`
- `pnpm --filter mobile e2e`

Node baseline:

- CI uses Node 22.
- Mobile TypeScript uses `@types/node` 22.x so code does not type-check against newer Node-only APIs by accident.

Applied EAS environment routing:

- `apps/mobile/eas.json`
  - `development`: `development` EAS environment
  - `preview`: `preview` EAS environment
  - `production`: `production` EAS environment
  - `e2e-test`: `preview` EAS environment
- `apps/mobile/.eas/workflows/build-and-submit.yml`
  - production build jobs use `environment: production`
  - production build jobs set `EXPO_PUBLIC_APP_ENV=production`
- `apps/mobile/.eas/workflows/e2e-test-android.yml`
  - E2E build job uses `environment: preview`
  - E2E build job sets `EXPO_PUBLIC_APP_ENV=preview`
- `apps/mobile/.eas/workflows/ota-update.yml`
  - preview update job uses `environment: preview`
  - preview update job sets `EXPO_PUBLIC_APP_ENV=preview`

## Applied NativeWind / Tailwind Runtime

NativeWind is the React Native styling layer for `className` utilities and semantic design-token-backed UI.

Applied package baseline:

- `nativewind`: `5.0.0-preview.4`
- `react-native-css`: `^3.0.7`
- `react-native-reanimated`: `4.3.1`
- `react-native-worklets`: `0.8.3`
- `react-native-safe-area-context`: `~5.7.0`
- `tailwindcss`: `^4.3.0`
- `@tailwindcss/postcss`: `^4.3.0`
- `postcss`: `^8.5.15`
- `lightningcss`: `1.30.1`

Important status:

- NativeWind v5 is currently a pre-release package (`nativewind@preview`), so this repo pins the exact preview version.
- Roll back to the last passing NativeWind v4 / Tailwind CSS v3 baseline if SDK 56 compatibility checks, Metro bundling, Jest, native run smoke, or Maestro/mobile visual QA fail because of NativeWind v5 and cannot be fixed in the same PR.
- Do not promote a production release with unresolved NativeWind v5 rendering, bundling, or native runtime defects.
- Tailwind config is CSS-first. The stale v4 `apps/mobile/tailwind.config.js` is removed.
- `apps/mobile/global.css` imports Tailwind theme/preflight/utilities and `nativewind/theme`.
- `apps/mobile/postcss.config.mjs` uses `@tailwindcss/postcss`.
- `apps/mobile/babel.config.js` uses `babel-preset-expo` for runtime builds and adds `react-native-css/babel` only when `api.env('test')` is true so Jest can exercise className translation outside Metro.
- `apps/mobile/nativewind-env.d.ts` references `react-native-css/types`.
- `apps/mobile/jest.after-env.js` imports `react-native-css/jest` through Jest `setupFilesAfterEnv`.

## Applied mobile-mcp Runtime

Codex MCP config:

- `.codex/config.toml`

Pinned server:

```toml
[mcp_servers.mobile-mcp]
command = "npx"
args = ["-y", "@mobilenext/mobile-mcp@0.0.58"]
```

Policy:

- `mobile-mcp` is required for local visual QA/device automation.
- It is not a required CI gate.
- Device and simulator operations must not be parallelized.

Verification:

```bash
codex mcp list
```

Expected result includes `mobile-mcp` with `Status enabled`.

## Applied Serena Runtime

Codex MCP config:

- `.codex/config.toml`

Pinned server:

```toml
[mcp_servers.serena]
startup_timeout_sec = 15
command = "uvx"
args = ["-p", "3.13", "--from", "git+https://github.com/oraios/serena@v1.5.3", "serena", "start-mcp-server", "--project-from-cwd", "--context=codex"]
```

Policy:

- Serena is the symbolic navigation MCP for symbol overview, symbol lookup, reference search, and bounded code navigation.
- If Serena is unavailable locally, use focused `rg` and file reads and record the degraded lookup path where it affects evidence confidence.

Verification:

```bash
codex mcp list
```

Expected result includes `serena` with `Status enabled`.

## Applied Expo Codex Plugin Runtime

Codex plugin marketplace:

- marketplace: `expo-plugins`
- source: `expo/skills`
- ref: `main`
- marketplace root: `/Users/tw.kim/.codex/.tmp/marketplaces/expo-plugins`

Installed Codex plugin:

- plugin: `expo@expo-plugins`
- version: `1.1.0`
- status: installed and enabled
- plugin root: `/Users/tw.kim/.codex/plugins/cache/expo-plugins/expo/1.1.0`

Policy:

- Use Expo Skills for generic Expo, React Native, EAS, dev client, SDK upgrade, deployment, native UI, API route, and data fetching guidance.
- Keep repo skills as the authority for contracts, role boundaries, evidence, and QA gates.
- Do not install Expo Skills into `.agents/skills`; they are managed as the official Expo Codex plugin.
- This plugin does not replace `mobile-mcp` for local visual QA/device automation.

Plugin-provided MCP:

- `expo`
- URL: `https://mcp.expo.dev/mcp`
- status: enabled
- authentication status: not logged in

Verification:

```bash
codex plugin marketplace list
codex plugin list
codex mcp list
```

Expected results include marketplace `expo-plugins`, plugin `expo@expo-plugins` with `installed, enabled`, plugin version `1.1.0`, and `mobile-mcp` still enabled with `@mobilenext/mobile-mcp@0.0.58`.

## Codex Runtime / Local Harness

Runtime paths:

- repo skills: `.agents/skills/<skill-name>/SKILL.md`
- custom agents: `.codex/agents/<agent-name>.toml`
  - wm dedicated read-only agents:
    - `wm-implementation-reviewer`
    - `wm-contract-reviewer`
    - `wm-docs-researcher`
    - `wm-gate-fix-advisor`
- hooks: `.codex/hooks.json` and `.codex/hooks/*.mjs`
- MCP config: `.codex/config.toml`
- local harness: `evals/local-harness`
- evidence: `.evidence/`

Root scripts:

- `pnpm run test:runtime`
- `pnpm run test:local-harness`
- `node scripts/codex-headless-review.mjs --agent <wm-agent> --prompt <text-or-file> --out <path>`

Codex headless review:

- allows only `wm-*` reviewer/researcher/advisor agents for wm routing.
- invokes Codex with `codex -a never exec -m gpt-5.5 -c 'model_reasoning_effort="high"' -s read-only`.
- does not use Claude, `--engine auto`, or `review_engine_preference` fallback routing.
- rejects root Claude runtime artifacts (`CLAUDE.md`, `.claude/`, `.claude-state/`) from the active Codex runtime. Dependency-local files with matching names under ignored package directories are out of scope.

Local harness scope:

- validates Codex CLI runtime shape, skill/agent/hook structure, role boundaries, deterministic gatekeeper/evidence fixtures, and best-effort Codex headless smoke.
- does not validate app feature behavior, production EAS side effects, external platform/runtime repositories, or OpenClaw packaging.

OpenClaw packaging status:

- legacy OpenClaw packaging scripts/results are removed from the active runtime.
- `/workspace/skills`, `OPENCLAW_ROOT`, generated agent packages, and OpenClaw package result files are out of scope.

## CI Gate

Workflow:

- `.github/workflows/quality-gate.yml`

Always runs:

```bash
pnpm run test:runtime
pnpm turbo run lint test
```

Runs conditionally for runtime changes:

```bash
pnpm run test:local-harness
```

Runtime-change detector covers:

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

## Mobile QA

Maestro path:

- `apps/mobile/.maestro`

Current selector standard:

- use stable kebab-case `testID` values.
- prefer Maestro `id` selectors over visible text.

Current baseline selectors:

- `home-title`
- `counter-value`
- `counter-increment-button`

App code, Jest tests, and Maestro flow were updated together.

## Environment Variables

Mobile runtime variables are defined in `apps/mobile/env.ts`; app identity variables are consumed by `apps/mobile/app.config.ts`.

`EXPO_PUBLIC_*` values are public client configuration. They are compiled into the app bundle and must not be used for tokens, passwords, bearer credentials, signing keys, or private service endpoints. Customer-specific and production values are still injected through environment management rather than committed to the repo.

Public JS runtime variables:

- `EXPO_PUBLIC_APP_ENV`
- `EXPO_PUBLIC_APP_DISPLAY_NAME`
- `EXPO_PUBLIC_API_URL`

Public app config variables:

- `EXPO_PUBLIC_APP_SLUG`
- `EXPO_PUBLIC_APP_SCHEME`
- `EXPO_PUBLIC_IOS_BUNDLE_IDENTIFIER`
- `EXPO_PUBLIC_ANDROID_PACKAGE`

Non-public variables:

- `EAS_PROJECT_ID`

API variables are defined in `apps/api/src/env.ts`.

- `DATABASE_URL`
- `API_PORT`
- `API_BEARER_TOKEN`

Secrets, customer bundle IDs, customer package IDs, customer API URLs, and tokens must not be hardcoded.

## Verification Commands

Required local verification before PR:

```bash
codex plugin marketplace list
codex plugin list
pnpm --filter mobile exec expo install --check
codex mcp list
pnpm --filter mobile lint
pnpm --filter mobile test
pnpm --filter mobile run doctor
pnpm run test:runtime
pnpm turbo run lint test
pnpm run test:local-harness
```

`codex mcp list` verifies MCP registration only. For mobile UI/runtime changes, run local `mobile-mcp` visual QA/device automation when a simulator or device is available, and record the result in PR evidence. Run simulator and device operations serially.

Device/runtime verification:

```bash
pnpm --filter mobile ios
pnpm --filter mobile android
pnpm --filter mobile e2e
```

The device/runtime commands require local simulator/emulator and app credentials where applicable.
