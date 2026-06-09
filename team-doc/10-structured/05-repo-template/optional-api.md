---
docType: "reference"
sourcePageId: "1371963427"
sourceTitle: "01-8. ClawPod Agent용 기본 모바일 앱 프로젝트 템플릿 repo 구성 설계안"
sourceVersion: "20"
sourceHeading: "Optional API workspace"
---

# Optional API workspace

The `apps/api` workspace is an opt-in backend, included only for projects that
need a brand-new backend to pair with the mobile app (same optional pattern as
`apps/console`; inclusion is a decision item). It lives in the same monorepo so
`packages/contracts` is shared between mobile and api, blocking contract drift at
compile time and keeping changes atomically traceable. Backend work still runs in
separate tasks/PRs from mobile work (per 01-3 Case D/E).

## Template defaults (Mobile Architect-governed)

- Framework: Hono + `@hono/zod-validator` — zero runtime deps, first-party zod
  validation, in-memory testing via `app.request()`.
- DB: PostgreSQL (postgres.js driver) — Drizzle dialect is compile-time fixed, so
  the operational target is unified from the start (no SQLite-first detour).
- ORM/migrations: Drizzle ORM + `drizzle-kit generate` + programmatic `migrate()`
  — non-interactive generation (no DB connection needed), CLI-free apply (Node
  only), history-based idempotency. Prisma `migrate dev` is excluded (no
  non-interactive support).
- Test runner: vitest (api-only), coexisting with mobile's jest-expo via the
  workspace boundary and isolated `types: ["vitest/globals","node"]`.
- Validation: single zod v4 across the monorepo (contracts is the zod SoT).
- Auth boundary: placeholder `bearerAuth` on `/api/*` plus unauthenticated
  `/livez`/`/readyz`. Real token/session issuance is deferred; payments/PII/push
  are 00-1 human-gates.
- Container: multi-stage Dockerfile (`turbo prune --docker` → `tsc` → `pnpm deploy
  --prod`), `node:22-slim` base, non-root `node` user, SIGTERM graceful shutdown.

OpenAPI generation, tRPC/Hono RPC clients, full-stack auth, repository
abstraction, structured logging, and rate limiting are intentionally deferred
until their trigger conditions appear. Mobile type sharing stays on the contracts
zod pattern (Hono RPC `hc` has Expo Metro subpath-resolution constraints).

## Layering and import direction

- Route (`src/routes/`): request validation (`zValidator`) and response assembly;
  may import services and contracts.
- Service (`src/services/`): business logic; may import db and contracts.
- DB (`src/db/`): Drizzle schema, client, migrate; may import contracts only
  (bottom layer — no upward imports).

Schema-derived zod (drizzle-zod) is not used — `packages/contracts` is the single
contract SoT. `turbo prune --docker` automatically pulls api's workspace deps
(including contracts) into the partial monorepo, so the Dockerfile needs no extra
handling.

## Minimal sample (mirrors the home counter)

Just as the mobile home counter imports `counterEventSchema` from contracts, the
api proves a round-trip against the same schema. The sample is capped at:
`env.ts` (symmetric to mobile), Drizzle `schema.ts` (`counter_events`),
`routes/counter-events.ts` (POST with `zValidator`), `app.ts` (route mount +
bearer boundary), unauthenticated `routes/health.ts` (`/livez` static 200,
`/readyz` DB-ping 200/503), `services/counter-events.service.ts`, `db/client.ts`,
programmatic `db/migrate.ts`, boot `index.ts` (env validate → migrate → serve →
SIGTERM), `vitest.config.ts` (injects test env defaults), `drizzle.config.ts`,
`package.json` (`@template/api`), `Dockerfile`, and `compose.yaml` (single local
PostgreSQL). TDD is red-first: write `counter-events.test.ts` to fail, then
implement route/service to green, asserting the 201 body via
`counterEventRecordSchema.parse()`. Note: `apps/api` uses `NodeNext` resolution,
so real relative imports require explicit `.js` suffixes.

## Migration operations

- Generate: `drizzle-kit generate` produces SQL from a schema diff with no DB
  connection. Agents add columns + migrate data instead of renaming (rename
  prompts are interactive).
- Apply: programmatic `migrate()` runs automatically on app boot — history-table
  idempotent, safe to rerun, no extra infra.
- Operator bootstrap (not Agent work): bring up local PostgreSQL via
  `compose.yaml`, inject `DATABASE_URL`, boot once to apply migrations, then boot
  again to confirm `migrate()` idempotency (zero changes).

## Done criteria (added to §2 DoD when included)

- `counter-events.test.ts` passes red→green (vitest, joins `pnpm turbo run test`).
- `migrate()` run twice consecutively yields the same result (idempotent).
- `GET /livez` and `GET /readyz` return unauthenticated 200 (readyz includes a DB
  ping).
- `docker build -f apps/api/Dockerfile .` succeeds (container image produced).

## Source

- Page ID: 1371963427
- Source heading: Optional API workspace
- Source version: 20
