# API (Hono + Drizzle)

Optional Hono backend with a Drizzle ORM data layer. Include this app only when a new backend is required for the project; it is not part of the default mobile-only template.

## Stack

- **Hono** – lightweight HTTP framework (`@hono/node-server`)
- **Drizzle ORM** – type-safe PostgreSQL query layer (`drizzle-orm` + `postgres`)
- **Zod** – request validation via `@hono/zod-validator`
- **Vitest** – unit and integration tests

## Import Direction

Imports must flow in one direction only:

```
routes → services → db
```

Reverse imports (e.g. `db` importing from `services`, or `services` importing from `routes`) are forbidden.

## Contracts Dependency

All request/response types are consumed from `@template/contracts` (`packages/contracts`). Do not declare ad-hoc API types inside this package.

## Migrations

Use the non-interactive two-step procedure only:

1. **Generate** a SQL diff (no DB connection required):
   ```sh
   pnpm --filter @template/api exec drizzle-kit generate
   ```
2. **Apply** on startup — `runMigrations()` in `src/db/migrate.ts` runs `migrate()` programmatically and is idempotent (history-table based).

Interactive `drizzle-kit migrate dev` and CLI-applied migrations are forbidden.

## Development

```sh
pnpm --filter @template/api dev    # tsx watch
pnpm --filter @template/api test   # vitest run
pnpm --filter @template/api lint   # tsc --noEmit
```

Requires `DATABASE_URL` and `API_BEARER_TOKEN` in the environment (both validated at
startup by `src/env.ts`; `API_PORT` is optional and defaults to `3000`). See
`docs/CREDENTIALS.md`.
