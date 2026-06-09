---
docType: "reference"
sourcePageId: "1371963427"
sourceTitle: "01-8. ClawPod Agent용 기본 모바일 앱 프로젝트 템플릿 repo 구성 설계안"
sourceVersion: "20"
sourceHeading: "Target directory structure"
---

# Target directory structure

The template is a **monorepo** (pnpm workspace + Turborepo) holding the mobile app, shared types/schema, tests, and EAS config in one repo so the Agent can change everything atomically in a single PR.

## Repo root

- `AGENTS.md` — root instructions auto-loaded by the Agent (required).
- `DESIGN.md` — design-system source of truth, owned by the Design agent (DEC-021).
- `PROJECT_ENVIRONMENT.md` — environment SoT (kept in sync by `AGENTS.md`).
- `README.md`, `pnpm-workspace.yaml`, `turbo.json`, `package.json` — workspace plumbing.

## apps/

- **`apps/mobile/`** — the Expo app (template core):
  - `.eas/workflows/` — `e2e-test-android.yml` (build → maestro), `build-and-submit.yml` (build → submit), `ota-update.yml` (eas update on preview channel). The `.eas` dir must sit at the same level as `eas.json`.
  - `.maestro/home.yml` — home-screen counter E2E flow.
  - `src/app/` — `_layout.tsx` (root layout + `global.css` + Sentry init), `index.tsx` (home screen importing the shared constant), `__tests__/home.test.tsx`.
  - Config files: `app.config.ts` (template-variable-driven dynamic config), `babel.config.js`, `eas.json` (dev/preview/production + e2e-test), `env.ts` (Zod env validation), `global.css` (NativeWind input + token defaults), `jest.setup.ts`, `metro.config.js` (`withNativewind` wrapper), `nativewind-env.d.ts`, `postcss.config.mjs` (Tailwind v4 — no JS `tailwind.config.js`), `package.json`.
- **`apps/console/`** — optional, only when the customer wants a web console.
- **`apps/api/`** — optional, only when the project needs a new backend (§15): Hono app (`src/app.ts`, `index.ts`, `env.ts`, `routes/` with unauthenticated health endpoints + counter-events, `services/`, `db/` with Drizzle schema/migrate), plus `drizzle/`, `drizzle.config.ts`, `vitest.config.ts`, isolated `tsconfig.json`, multi-stage `Dockerfile`, optional `compose.yaml`, and `package.json`.

## packages/

- **`packages/contracts/`** — shared types, Zod schema, and API contract (`src/index.ts` + `package.json`), resolved directly from source in the monorepo.

## Supporting directories

- `infra/clawpod/` — `secret.example.yaml` (Agent-runner `EXPO_TOKEN` etc.) and `agent-runner.yaml` (example k8s Job running EAS CLI from `apps/mobile`).
- `docs/` — `SETUP.md`, `CREDENTIALS.md`, and `design-references/` (vendored awesome-design-md copy with MIT `LICENSE` + `NOTICE`, DEC-021).
- `.github/workflows/quality-gate.yml` — PR gate (`test:runtime` → `turbo lint test` → conditional `test:local-harness`).
- `.codex/`, `.agents/skills/`, `evals/`, `scripts/` — Codex CLI runtime artifacts: config/agents/hooks, native repo skills, eval fixtures, and runtime-validation scripts (§16).

## Source

- Page ID: 1371963427
- Source heading: Target directory structure
- Source version: 20
