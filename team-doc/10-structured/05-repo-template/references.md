---
docType: "reference"
sourcePageId: "1371963427"
sourceTitle: "01-8. ClawPod Agent용 기본 모바일 앱 프로젝트 템플릿 repo 구성 설계안"
sourceVersion: "20"
sourceHeading: "Reference basis"
---

# Reference basis

Official and project source references that ground the template design decisions.

## Tooling and platform references

- **Expo Workflows**: `.eas/workflows` must sit at the same level as `eas.json`.
- **Expo E2E on EAS Workflows with Maestro**: use the `e2e-test` build profile and a `build_id`-driven maestro job.
- **Expo monorepo guide**: SDK 52+ provides automatic Metro configuration; watch for pnpm isolated-dependency issues.
- **NativeWind v5 + Tailwind v4 installation**: requires `global.css` (CSS-first `@theme`), `postcss.config.mjs` (`@tailwindcss/postcss`), `babel.config.js`, the `withNativewind` Metro wrapper, and a type declaration. A JS `tailwind.config.js` is not needed.
- **React Native Testing Library matchers**: v13+ built-in matchers auto-register on importing the main package (no setup file). A subpath `extend-expect` setup is only needed when downgrading to v12.x.
- **Expo Sentry guide**: EAS Build uses `SENTRY_AUTH_TOKEN`; EAS Update requires an explicit sourcemap upload afterward.
- **Expo Programmatic Access**: a Robot user token is consumed via the `EXPO_TOKEN` env var.

## Design and backend references

- **`DESIGN.md` spec**: Google's open-sourced `DESIGN.md` format is the authoring standard for the root `DESIGN.md` (Stitch export/import compatible).
- **awesome-design-md** (VoltAgent, MIT): per-brand `DESIGN.md` curation and the source of the `docs/design-references/` vendored copy.
- **Hono**: zero-runtime-dependency web framework; `@hono/zod-validator` (first-party) and `app.request()` in-memory testing (test-runner agnostic).
- **Drizzle ORM**: `drizzle-kit generate` produces SQL from schema diffs without a DB connection; programmatic `migrate()` is idempotent via a history table. Prisma `migrate dev` was excluded because it errors in non-interactive environments.
- **Turborepo/pnpm containerization**: per-workspace `test` scripts auto-join `turbo run test`; `turbo prune --docker` trims build inputs and `pnpm deploy --prod` isolates runtime `node_modules`.
- **Kubernetes health conventions**: `/livez` and `/readyz` (the `/healthz` name is deprecated); probes treat 200–399 as success, while probe wiring itself remains a hosting decision.

## Source

- Page ID: 1371963427
- Source heading: Reference basis
- Source version: 20
