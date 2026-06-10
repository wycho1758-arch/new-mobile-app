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
  - `react-native-web`: `^0.21.2`
  - `expo-router`: `~56.2.9`
  - `expo-dev-client`: `~56.0.19`
  - `expo-doctor`: `^1.19.9` as the `doctor` script dependency.
  - `@playwright/test`: `^1.60.0` as the browser E2E test runner.
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
  - `pnpm --filter mobile e2e:web`
  - `pnpm --filter mobile web`
- Node baseline:
  - CI uses Node 22.
  - Mobile TypeScript uses `@types/node` 22.x so code cannot type-check against newer Node-only APIs by accident.

## Mobile Web E2E

- Browser E2E path: `apps/mobile/e2e-web`.
- Browser E2E config: `apps/mobile/playwright.config.ts`.
- Browser install command: `pnpm --filter mobile exec playwright install chromium`.
- Browser E2E command: `pnpm --filter mobile e2e:web`.
- Repo QA skill: `$e2e-test` plans, resets, executes, and records E2E evidence. It is a Codex skill, not the EAS build profile or workflow label named `e2e-test`.
- RN Web E2E validates only RN Web/browser-reproducible UI, navigation, state, and business logic flows.
- RN Web E2E does not validate native modules, OS permissions, native lifecycle behavior, push delivery, biometrics, camera, GPS, or other device/hardware features.
- RN Web release E2E requires a deployed backend API URL through public client config:
  - `EXPO_PUBLIC_API_URL=<deployed-api-url> pnpm --filter mobile e2e:web`
  - `EXPO_PUBLIC_API_URL` is compiled into the client app and is not private; never put bearer tokens, signing keys, passwords, or private endpoints in it.
  - The current Railway QA API URL verified for this workspace is `https://api-production-3d74.up.railway.app`.
  - Evidence: `.evidence/e2e-test/20260609-233244-rn-web-railway-api/`.
- Playwright launches Expo Web with deterministic public test config plus the caller-provided backend API URL:
  - `EAS_BUILD=false`
  - `EXPO_PUBLIC_APP_ENV=development`
  - `EXPO_PUBLIC_APP_DISPLAY_NAME=Mobile App Template`
  - `EXPO_PUBLIC_APP_SLUG=mobile-app-template`
  - `EXPO_PUBLIC_APP_SCHEME=mobileapptemplate`
  - `EXPO_PUBLIC_API_URL` from the command environment
  - `EXPO_PUBLIC_IOS_BUNDLE_IDENTIFIER=com.template.mobile`
  - `EXPO_PUBLIC_ANDROID_PACKAGE=com.template.mobile`
- `EXPO_PUBLIC_*` values are public client configuration and must not contain tokens, bearer credentials, signing keys, passwords, or private service endpoints.
- Native completion remains separate:
  - Run Maestro and `mobile-mcp` visual QA when the required EAS account, simulator, emulator, or device is available.
  - If the user chooses direct local/manual native verification instead, record it as HUMAN-GATE evidence with residual risk; do not remove or mark the Maestro/mobile-mcp requirements as replaced.

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
- The EAS profile/workflow label `e2e-test` is distinct from the repo Codex skill `$e2e-test`.
- EAS workflows:
  - `apps/mobile/.eas/workflows/build-and-submit.yml`: production build jobs use the `production` EAS environment and set `EXPO_PUBLIC_APP_ENV=production`.
  - `apps/mobile/.eas/workflows/e2e-test-android.yml`: E2E build job uses the `preview` EAS environment and sets `EXPO_PUBLIC_APP_ENV=preview`.
  - `apps/mobile/.eas/workflows/ota-update.yml`: preview update job uses the `preview` EAS environment and sets `EXPO_PUBLIC_APP_ENV=preview`.
- Maestro flows: `apps/mobile/.maestro`.
- Native E2E command: `pnpm --filter mobile e2e`.
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
- Current Railway QA deployment:
  - Project: `new-mobile-app`.
  - API service: `api`.
  - Postgres service: `Postgres`.
  - API URL: `https://api-production-3d74.up.railway.app`.
  - Latest verified API deployment id: `4c701f22-3ce9-40ef-a4bd-560252b773f3`.
  - `GET /livez` returns `{"status":"ok"}`.
  - `GET /readyz` returns `{"status":"ok"}`.
  - Railway runtime variables include `DATABASE_URL`, `API_BEARER_TOKEN`, `PORT=3000`, `API_PORT=3000`, `RAILWAY_DOCKERFILE_PATH=apps/api/Dockerfile`, and `RAILWAY_HEALTHCHECK_PATH=/readyz`.
  - Do not print or commit Railway secret values. `API_BEARER_TOKEN` was rotated after setup output exposed an earlier generated value.

## Contracts Package

- Package path: `packages/contracts`.
- Source entry: `./src/index.ts`.
- Peer dependency: `zod ^3.25.0 || ^4.0.0`.
- This package is the single source of truth for API request/response types and shared domain schemas.
- Runtime export: `./dist/index.js`, with TypeScript types sourced from `./src/index.ts`.
- Build command: `pnpm --filter @template/contracts build`.
- Test command: `pnpm --filter @template/contracts test`.
- API Docker builds must build `@template/contracts` before `@template/api` so deployed Node runtimes do not import TypeScript source from `node_modules`.

## Codex Runtime

- Installed Codex plugin marketplaces:
  - `expo-plugins`
    - source: `expo/skills`
    - ref: `main`
    - marketplace root: user-local Codex marketplace cache, not a repo-pinned path; do not commit a resolved absolute path.
- Installed Codex plugins:
  - `expo@expo-plugins`
    - version: `1.1.0`
    - status: installed and enabled
    - plugin root: user-local Codex plugin cache for `expo-plugins/expo/1.1.0`, not a repo-pinned path; do not commit a resolved absolute path.
    - use only for generic Expo, React Native, EAS, dev client, SDK upgrade, deployment, native UI, API route, and data fetching guidance.
    - repo skills remain authoritative for contracts, role boundaries, evidence, and QA gates.
- Repo skills: `.agents/skills/<skill-name>/SKILL.md`.
  - `$wm` plans must be SoT-grounded: material planning decisions cite or name verified SoT inputs, and missing or ambiguous SoT must be reported as unknown/blocked instead of being filled by predictions, assumptions, or expected behavior.
  - `$wm` implementation runs must not proceed past planning until applicable local SoT has been read and cited or named in the plan.
  - `$wm` pre-implementation plan review evidence and final actual-work review evidence are mandatory for non-trivial implementation runs.
  - `$wm` implementation runs require persisted read-only reviewer evidence for both the completed plan and the actual completed work, and final user reports must include material `git diff` change details.
  - The `$wm` headless helper is an allowed review evidence path; the review evidence requirement itself is mandatory.
  - `$e2e-test` is the repo QA skill for E2E test planning, tested-instance reset, planned execution, and objective evidence capture across RN Web Playwright, Maestro, `mobile-mcp`, or manual HUMAN-GATE checks. It records evidence under `.evidence/e2e-test/<YYYYMMDD-HHMMSS>-<slug>/` and does not implement fixes.
  - `$qa-railway-workflow` is the repo QA skill for Railway CLI install/login/project/service/database/variable/domain/deploy/status/log/health workflows, redacted Railway evidence, RN Web E2E API URL handoff, and `PROJECT_ENVIRONMENT.md` synchronization. It does not implement app, backend, contract, migration, or mobile UI fixes.
  - Product/Planning repo-local Codex adapters use required `po-*` slugs:
    - `po-requirement-office-hours` maps source skill `mobile-requirement-office-hours` page `1374519364`.
    - `po-work-unit-planning-and-agent-sprint` maps source skill `mobile-work-unit-planning-and-agent-sprint` page `1374650456`.
    - `po-prd-to-execution` maps source skill `mobile-prd-to-execution` page `1373634562`.
    - `po-planning-completeness-review` maps source skill `mobile-planning-completeness-review` page `1374519387`.
    - These are Product/Planning operational adapters, not a standalone `mobile-product-planning-workflow` role wrapper.
  - Design repo-local Codex adapters use required `design-*` slugs:
    - `design-mobile-design-handoff` maps source skill `mobile-design-handoff` page `1373765661`, Design SOUL page `1373765702`, and Design Codex practice page `1374290207`.
    - `design-stitch-mcp-operating-rules` defines reusable Stitch MCP execution rules for Design handoff work and maps the same Design source/practice pages.
    - These adapters require objective UI/UX framing, DESIGN.md decision handling, Product/Planning P0 scope/evidence approval before Stitch generation, exactly two Stitch visual design directions, Product/Planning P1 scope/evidence approval before HTML extraction, Option A/B HTML extraction via `code.html` or Stitch MCP fetch only after P1, Option A/B image extraction via Stitch MCP, dated `design-pub-html/<YYYY-MM-DD>/` publication, five-state matrix, UX acceptance criteria, and evidence.
    - P0/P1 Product/Planning approvals are scope/evidence approvals for PRD fit, non-goals, evidence readiness, and human-gate routing. They are not Design quality approvals and do not move selected-option ownership out of Design.
    - Before P1 approval, Design must not call or persist `fetch_screen_code`, official ZIP `code.html`, SDK `getHtml`, `htmlCode.downloadUrl`, or equivalent HTML extraction metadata.
    - Stitch prompt generation must use prompt enhancement and current `DESIGN.md`; Gemini 3.1 Pro, Pro, or Thinking mode is requested best-effort when the Stitch surface exposes model or mode selection, with actual capability and limitations recorded in `manifest.json`.
- Custom agents: `.codex/agents/<agent-name>.toml`.
  - wm review routing uses dedicated read-only agents:
    - `wm-implementation-reviewer`
    - `wm-contract-reviewer`
    - `wm-docs-researcher`
    - `wm-gate-fix-advisor`
    - `po-planning-reviewer`
    - `po-scope-gate-reviewer`
    - `po-docs-researcher`
    - `design-reviewer`
    - `design-researcher`
  - legacy `mobile-*` agents remain available for other runtime/eval surfaces, but `$wm` reviewer routing and `scripts/codex-headless-review.mjs` allow only the dedicated `wm-*`, Product/Planning `po-*`, and Design `design-*` read-only agents listed above.
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
  - `stitch`
  - command: `npx`
  - args: `-y stitch-mcp@1.3.2`
  - design-authoring MCP for Google Stitch project/screen generation and export handoff.
  - it uses local Google Cloud Application Default Credentials through `gcloud auth application-default login`.
  - actual use requires a Google Cloud project with the Stitch MCP service enabled, plus `GOOGLE_CLOUD_PROJECT` or a `gcloud config set project` value.
  - no Stitch API key is stored in the repo, `.codex/config.toml`, `EXPO_PUBLIC_*`, docs, or evidence.
  - do not use `@latest`.
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
    - optional machine-readable reviewer verdict validation: `node scripts/codex-headless-review.mjs --json-envelope --agent <verdict-reviewer> --prompt <text-or-file> --out <path>`.
    - verdict-producing reviewers are `wm-implementation-reviewer`, `wm-contract-reviewer`, `po-planning-reviewer`, `po-scope-gate-reviewer`, and `design-reviewer`.
    - the reviewer JSON envelope contains `verdict`, `reviewer`, `mode`, `scope`, `findings`, `checks_reviewed`, `residual_risks`, and `next_action`; `GO` requires no Critical/High/Medium findings and required checks `PASS` or source-backed `NOT_APPLICABLE`, failed required checks map to `NO_GO`, missing required checks map to `BLOCKED`, and human-gate blockers map to `NEEDS_HUMAN`.
    - researcher/advisor agents are advisory and are not valid `--json-envelope` targets.
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
