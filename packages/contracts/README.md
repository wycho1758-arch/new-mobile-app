# Contracts

Single source of truth for all API request/response types and shared domain schemas across this monorepo.

## What Lives Here

- **Zod schemas** – runtime-validated shapes for every API contract
- **TypeScript types** – inferred from schemas via `z.infer<>`
- Exported from `src/index.ts` as the `@template/contracts` workspace package

## Rules

- `packages/contracts` is the **only** place API types may be declared. Ad-hoc type duplicates in `apps/api` or `apps/mobile` are forbidden.
- **Database columns** use `snake_case`; **TypeScript variables and API fields** use `camelCase`. Convert at the DB/app boundary — do not leak DB casing into contracts.
- Schemas must remain framework-agnostic (no Hono, no React imports).

## Usage

```ts
import { counterEventSchema, type CounterEvent } from '@template/contracts';
```

`zod` is a peer dependency — the consuming workspace provides the version.

## Development

```sh
pnpm --filter @template/contracts build   # tsc
pnpm --filter @template/contracts lint    # tsc --noEmit
pnpm --filter @template/contracts test    # node --test __tests__/*.test.mjs
```
