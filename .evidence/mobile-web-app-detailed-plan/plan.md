# Mobile Web App Detailed Migration Plan

Date: 2026-06-09
Target repo: `/Users/tw.kim/Documents/AGA/test/mobile-web-app`
Source repo: `/Users/tw.kim/Documents/AGA/test/new-mobile-app`
Mode: planning/review only; no implementation in this step

## Decision

Create `mobile-web-app` as a separate ReactJS mobile web monorepo, not an in-place rewrite of `new-mobile-app`.

`new-mobile-app` remains the Expo / React Native WonderMove runtime source. `mobile-web-app` becomes the browser-first MVP repo with React DOM, Vite, Tailwind CSS, Vitest/Testing Library, and Playwright browser smoke. This avoids changing the source repo's Expo/RN SoT, EAS/Maestro/mobile-mcp assumptions, Codex runtime gates, and local harness.

## Sources Used

Local SoT:

- `AGENTS.md`: current repo is a mobile app template runtime; TDD, no hardcoded customer identifiers, contracts as SoT, PR gates, and mobile runtime verification rules.
- `PROJECT_ENVIRONMENT.md`: current Expo SDK 56 / RN 0.85 / NativeWind / EAS / Maestro / mobile-mcp baseline; `EXPO_PUBLIC_*` is public client configuration; `packages/contracts` is the shared API/domain SoT.
- `.evidence/mobile-web-transition-plan/reviewer.md`: previous reviewer required an explicit handoff boundary, contract authority, evidence path, and missing NativeWind/CSS affected files for any in-place option.
- `apps/mobile/src/app/index.tsx`: source MVP screen uses `View`, `Text`, `Pressable`, `testID`, `onPress`, NativeWind classes, `Env`, and `COUNTER_INCREMENT`.
- `apps/mobile/src/app/_layout.tsx`: source root layout is Expo Router `Stack`.
- `apps/mobile/env.ts`: source env parser reads `EXPO_PUBLIC_*`.
- `apps/mobile/src/app/__tests__/home.test.tsx`: source tests use `@testing-library/react-native`, RN `fireEvent.press`, `testID`, and NativeWind style assertions.
- `packages/contracts/src/index.ts`: source counter constant and schemas.
- `apps/api/src/**`: optional backend surface if the web repo needs API-backed counter event persistence.

External primary docs:

- React `createRoot` docs: React DOM browser apps mount a component tree into a DOM node with `createRoot(...).render(...)`.
- Vite env docs: client-exposed variables are available on `import.meta.env`, and only explicitly prefixed variables are exposed to browser code by default.
- Vitest environment docs: DOM-style component tests should run under a DOM-like environment such as jsdom or happy-dom.
- Playwright emulation docs: browser smoke can emulate mobile devices/viewports through configured device parameters.

## Non-Goals

- Do not modify `new-mobile-app` app/runtime code as part of the new repo setup.
- Do not copy `.codex`, `.agents`, runtime evals, EAS, Maestro, Expo config, Metro config, or mobile-mcp requirements into the web repo unless explicitly reintroduced by a new SoT.
- Do not use React Native primitives, Expo Router, NativeWind RN runtime, or Jest Expo in the web repo.
- Do not put private runtime values in `VITE_*` or any browser-exposed config.

## Target Repo Structure

Recommended layout:

```text
/Users/tw.kim/Documents/AGA/test/mobile-web-app/
  AGENTS.md
  PROJECT_ENVIRONMENT.md
  package.json
  pnpm-lock.yaml
  pnpm-workspace.yaml
  turbo.json
  apps/
    web/
      index.html
      package.json
      vite.config.ts
      vitest.config.ts
      playwright.config.ts
      tsconfig.json
      src/
        main.tsx
        App.tsx
        env.ts
        index.css
        app/
          Home.tsx
          __tests__/
            Home.test.tsx
        test/
          setup.ts
      e2e/
        home.spec.ts
  packages/
    contracts/
      package.json
      src/
        index.ts
  docs/
    migration/
      rn-to-react-web-map.md
      source-snapshot.md
  .evidence/
```

Optional when API is needed:

```text
  apps/
    api/
      package.json
      src/
      drizzle/
```

## Package Strategy

Root:

- Keep `pnpm@9.15.9` initially to match the source repo unless there is a separate package manager upgrade decision.
- Keep Turbo for workspace `lint`, `test`, and `build` orchestration.
- Root scripts:
  - `pnpm run lint`
  - `pnpm run test`
  - `pnpm run build`
  - `pnpm run smoke:web`
  - `pnpm run verify`

`apps/web`:

- Package name: `web`. This keeps `pnpm --filter web ...` gates unambiguous. If the package is renamed later, update all filter commands in the same change or use path filters such as `pnpm --filter ./apps/web ...`.
- Runtime dependencies: `react`, `react-dom`, `@template/contracts`, `zod`.
- Build/dev dependencies: `vite`, `@vitejs/plugin-react`, `typescript`, `tailwindcss`, `@tailwindcss/postcss`, `postcss`, `vitest`, `jsdom`, `@testing-library/react`, `@testing-library/jest-dom`, `@testing-library/user-event`, `@playwright/test`.
- Scripts:
  - `dev`: `vite`
  - `build`: `tsc --noEmit && vite build`
  - `preview`: `vite preview`
  - `lint`: `tsc --noEmit`
  - `test`: `vitest run`
  - `test:watch`: `vitest`
  - `smoke`: `playwright test`

`packages/contracts`:

- Start by copying `packages/contracts` from the source repo as a migration snapshot.
- In `mobile-web-app`, this copied package becomes the active local contract authority for the web app.
- If `apps/api` remains in `new-mobile-app`, document this as a temporary contract fork risk in `docs/migration/source-snapshot.md`.
- Before adding API-backed web features, choose one of:
  - Move `apps/api` into `mobile-web-app` so `packages/contracts` is local SoT for both web and API.
  - Publish/version `packages/contracts` from a separate package source and consume it from both repos.
  - Generate a versioned contract artifact consumed by the web repo.

Recommended MVP choice:

- Phase 1-3: copy `packages/contracts` into the new repo because the current MVP only uses `COUNTER_INCREMENT` and schemas locally.
- Phase 4 before any API write/read: either move `apps/api` into the new repo or establish a published/versioned contracts package. Do not let UI infer API shapes.

## React Web Mapping

| Current React Native / Expo | Target ReactJS web |
| --- | --- |
| `apps/mobile` | `apps/web` |
| `expo-router/entry` | `src/main.tsx` with `createRoot` |
| `src/app/_layout.tsx` with `Stack` | no router for MVP, or React Router only when multiple routes exist |
| `View` | `main`, `section`, `div` |
| `Text` | `h1`, `p`, `span` |
| `Pressable` | `button` |
| `testID` | `data-testid` |
| `onPress` | `onClick` |
| `accessibilityRole="button"` | native `<button type="button">` |
| NativeWind / `react-native-css` | Tailwind CSS v4 CSS-first |
| `EXPO_PUBLIC_*` via `process.env` | `VITE_*` via `import.meta.env` |
| Jest Expo + `@testing-library/react-native` | Vitest + `@testing-library/react` |
| Maestro emulator flow | Playwright browser smoke with mobile viewport |
| EAS / dev client | static web build/deploy target, TBD |

## Environment Model

Target public web env names:

- `VITE_APP_ENV`: `development`, `preview`, or `production`; default `development`.
- `VITE_APP_DISPLAY_NAME`: optional local fallback for dev only.
- `VITE_API_URL`: required URL before API-backed features or deploy builds.

Rules:

- Treat `VITE_*` like `EXPO_PUBLIC_*`: browser-exposed public config only.
- Validate with zod in `apps/web/src/env.ts`.
- For production build, fail if required public config is missing.
- Keep customer app names, API URLs, and identifiers outside committed source.

## Phase Plan

### Phase 0: Repo Contract And Guardrails

Goal: create a minimal web repo SoT before code migration.

RED tasks:

- Add `AGENTS.md` and `PROJECT_ENVIRONMENT.md` expectations as reviewable docs with checkboxes for web-only gates.
- Add a migration snapshot doc that records source repo commit/status, copied contract source, and explicit non-goals.

GREEN tasks:

- Create repo directory and workspace skeleton.
- Add root `package.json`, `pnpm-workspace.yaml`, `turbo.json`, `.gitignore`, and docs.
- Do not copy source repo `.codex`, `.agents`, EAS, Maestro, Expo, or mobile-mcp runtime files.

Quality gate:

- `pnpm install`
- `pnpm run verify` exists, even if it initially runs only typecheck placeholder commands.

Evidence:

- `/Users/tw.kim/Documents/AGA/test/mobile-web-app/.evidence/phase-0.md`

### Phase 1: Contracts Baseline

Goal: preserve API/domain schema discipline before UI port.

RED tasks:

- Add a contracts test asserting `COUNTER_INCREMENT === 1`.
- Add a schema test for `counterEventSchema` valid/invalid counts.

GREEN tasks:

- Copy `packages/contracts/package.json` and `packages/contracts/src/index.ts` into the new repo.
- Keep package name `@template/contracts` initially for import compatibility unless a rename decision is made.
- Add a `test` script to `packages/contracts/package.json`, for example `vitest run`.
- Add `vitest` and `typescript` as workspace-level or package-level dev dependencies so contract tests are executable.

Quality gate:

- `pnpm --filter @template/contracts test`
- `pnpm --filter @template/contracts lint` or root typecheck.

Evidence:

- `/Users/tw.kim/Documents/AGA/test/mobile-web-app/.evidence/phase-1-contracts.md`

### Phase 2: React Web Shell

Goal: replace Expo Router/RN app entry with a React DOM web entry.

RED tasks:

- Add a component test that expects the app root to render without Expo/RN imports.
- Add a static import guard test or lint assertion that `react-native`, `expo`, `expo-router`, and `nativewind` are absent from `apps/web/src`.

GREEN tasks:

- Create `apps/web/index.html`.
- Create `apps/web/src/main.tsx` using React DOM `createRoot`.
- Create `apps/web/src/App.tsx` that renders `Home`.
- Create `apps/web/src/index.css` and import it from `main.tsx`.

Quality gate:

- `pnpm --filter web lint`
- `pnpm --filter web test`
- `pnpm --filter web build`

Evidence:

- `/Users/tw.kim/Documents/AGA/test/mobile-web-app/.evidence/phase-2-web-shell.md`

### Phase 3: MVP Home Screen Port

Goal: reproduce current counter MVP in semantic mobile-first web UI.

RED tasks:

- Add `Home.test.tsx`:
  - title renders from `Env.APP_DISPLAY_NAME`.
  - counter starts at `Count: 0`.
  - user click increments to `Count: 1`.
  - button is accessible by role/name.
  - stable selectors exist as `data-testid="home-title"`, `data-testid="counter-value"`, `data-testid="counter-increment-button"`.

GREEN tasks:

- Port RN `Home` to `apps/web/src/app/Home.tsx`.
- Replace `View`/`Text`/`Pressable` with semantic HTML.
- Import `COUNTER_INCREMENT` from `@template/contracts`.
- Apply Tailwind classes with semantic tokens.

REFACTOR tasks:

- Keep display text compact and mobile-friendly.
- Keep layout responsive without viewport-scaled font sizes.

Quality gate:

- `pnpm --filter web test`
- `pnpm --filter web lint`

Evidence:

- `/Users/tw.kim/Documents/AGA/test/mobile-web-app/.evidence/phase-3-home.md`

### Phase 4: Web Env And Build Policy

Goal: replace Expo public config with Vite public config and fail correctly for deploy builds.

RED tasks:

- Add env parser tests:
  - defaults `APP_ENV` to `development`.
  - rejects invalid `VITE_API_URL`.
  - treats `VITE_APP_DISPLAY_NAME` as optional only for local dev.
  - fails production/preview validation when required values are absent.

GREEN tasks:

- Implement `apps/web/src/env.ts` with zod.
- Read from `import.meta.env.VITE_*`, not `process.env.EXPO_PUBLIC_*`.
- Add `.env.example` with placeholders only.

Quality gate:

- `pnpm --filter web test`
- `pnpm --filter web build` with local safe defaults.
- production/preview env validation test passes.

Evidence:

- `/Users/tw.kim/Documents/AGA/test/mobile-web-app/.evidence/phase-4-env.md`

### Phase 5: Styling System

Goal: replace NativeWind RN styling with Tailwind CSS v4 semantic tokens.

RED tasks:

- Add a test or browser smoke assertion that semantic classes render visible styles for title and button.
- Add a guard that `react-native-css`, `nativewind/theme`, and Metro config are absent from web styling.

GREEN tasks:

- Configure Tailwind CSS v4 CSS-first setup in `apps/web/src/index.css`.
- Define semantic tokens equivalent to source `--background`, `--foreground`, `--primary`, and `--primary-foreground`.
- Configure PostCSS only if required by the selected Vite/Tailwind path.

Quality gate:

- `pnpm --filter web build`
- `pnpm --filter web test`

Evidence:

- `/Users/tw.kim/Documents/AGA/test/mobile-web-app/.evidence/phase-5-styling.md`

### Phase 6: Browser QA Instead Of Emulator QA

Goal: validate MVP without Android/iOS emulator requirements.

RED tasks:

- Add Playwright test for mobile viewport:
  - page loads.
  - no console errors.
  - title and counter visible.
  - tap/click increments count.

GREEN tasks:

- Add `playwright.config.ts`.
- Add `apps/web/e2e/home.spec.ts`.
- Configure webServer to run Vite preview or dev server in test.

Quality gate:

- `pnpm --filter web build`
- `pnpm --filter web smoke`

Evidence:

- `/Users/tw.kim/Documents/AGA/test/mobile-web-app/.evidence/phase-6-browser-smoke.md`

### Phase 7: Optional API Migration

Goal: only if MVP needs backend persistence.

RED tasks:

- Add API contract tests before copying or changing routes.
- Add web integration tests using mocked API responses.

GREEN tasks:

- Either move `apps/api` into `mobile-web-app` and point it at local `packages/contracts`, or consume a published/versioned contracts package.
- Preserve route -> service -> db import direction.
- Keep DB columns snake_case and TS/API fields camelCase.

Quality gate:

- `pnpm turbo run lint test build`
- API tests pass.
- Web mocked integration tests pass.

Evidence:

- `/Users/tw.kim/Documents/AGA/test/mobile-web-app/.evidence/phase-7-api.md`

## Full Verification Command Set

New repo expected commands:

```bash
pnpm install
pnpm run lint
pnpm run test
pnpm run build
pnpm run smoke:web
pnpm run verify
```

Suggested root `verify`:

```bash
pnpm run lint && pnpm run test && pnpm run build && pnpm run smoke:web
```

Current source repo verification for this planning artifact:

```bash
pnpm turbo run lint test
pnpm run test:runtime
```

Known current source repo blocker: `pnpm run test:runtime` fails while root `CLAUDE.md` and `.claude/` are present, independent of this migration plan. Do not treat a source-repo PR containing this evidence as PR-ready until those root runtime artifacts are removed, ignored by a deliberate SoT change, or otherwise resolved through the current repo gate policy.

## Rollback Strategy

- Phase 0: delete the new repo skeleton.
- Phase 1: remove copied `packages/contracts` and tests.
- Phase 2: remove `apps/web` shell.
- Phase 3: revert `Home` component and tests.
- Phase 4: revert `env.ts` and env tests.
- Phase 5: revert Tailwind/PostCSS files and style assertions.
- Phase 6: remove Playwright config and e2e tests.
- Phase 7: remove API migration or revert to external API consumption.

Because the recommended path is a sibling repo, rollback does not require reverting `new-mobile-app`.

## Risks And Mitigations

| Risk | Probability | Impact | Mitigation |
| --- | --- | --- | --- |
| Contract drift between source and new repo | Medium | High | Pick a contract authority before API-backed features; prefer moved API or published contracts |
| Treating `VITE_*` as private config | Medium | High | Document public env policy and test parser behavior |
| Reintroducing emulator-only gates | Low | Medium | Use Playwright mobile viewport smoke instead of Maestro/mobile-mcp |
| Incomplete visual parity | Medium | Medium | Add browser screenshot/smoke evidence by phase 6 |
| Over-copying source runtime | Medium | Medium | Explicitly exclude Expo/EAS/Maestro/.codex/.agents unless a new web SoT requires them |
| Deployment target unknown | Medium | Medium | Keep deploy phase blocked until host is selected |

## Human Decisions Required Before Implementation

1. Is `mobile-web-app` an independent product repo or temporary migration staging repo?
2. Should `apps/api` move into `mobile-web-app` before API-backed features?
3. Should `@template/contracts` keep its package name or be renamed for the web repo?
4. Which deployment target should define build env policy?
5. Should the new repo have its own Codex runtime, or stay plain app repo for MVP?
