**Findings**

1. **High: Prisma migration workflow is a SoT deviation, not just an implementation detail.**  
   Affected paths: [AGENTS.md](/Users/tw.kim/Documents/AGA/test/new-mobile-app/AGENTS.md:94), [optional-api.md](/Users/tw.kim/Documents/AGA/test/new-mobile-app/team-doc/10-structured/05-repo-template/optional-api.md:24), [apps/api/src/db/migrate.ts](/Users/tw.kim/Documents/AGA/test/new-mobile-app/apps/api/src/db/migrate.ts:6).  
   Current repo policy requires `drizzle-kit generate` plus programmatic Drizzle `migrate()` and explicitly forbids CLI-applied migrations. A Prisma reset would likely require `prisma migrate deploy` in CI/CD for production/testing, which Prisma documents as the intended apply command. That must be called out as an approved policy change, not hidden under “define non-interactive Prisma migration workflow.” Next owner: **backend/API integrator + human gate**.

2. **High: Prisma Postgres requires explicit pooled-vs-direct URL handling.**  
   Affected paths: [PROJECT_ENVIRONMENT.md](/Users/tw.kim/Documents/AGA/test/new-mobile-app/PROJECT_ENVIRONMENT.md:154), [apps/api/src/env.ts](/Users/tw.kim/Documents/AGA/test/new-mobile-app/apps/api/src/env.ts:3), future Prisma config.  
   Draft mentions Prisma Postgres generally, but should add that application traffic should use pooled Prisma Postgres while migrations/admin tooling should use direct connections. Prisma documents pooled host use for app/serverless traffic and direct host use for migrations/admin tooling. Next owner: **backend/API integrator**. Source: https://www.prisma.io/docs/postgres/database/connection-pooling

3. **Medium: NestJS on Vercel should be framed as Vercel Functions, not Edge by default.**  
   Affected paths: future `apps/api` entrypoint/config, [PROJECT_ENVIRONMENT.md](/Users/tw.kim/Documents/AGA/test/new-mobile-app/PROJECT_ENVIRONMENT.md:147).  
   The draft’s caution is correct. Vercel documents NestJS deployment through Vercel Functions with recognized entrypoints and `vercel dev`; Edge Prisma support exists but is preview/constrained. Keep Edge out of the minimal NestJS path unless separately approved. Next owner: **backend/API integrator + QA/release**. Sources: https://vercel.com/docs/frameworks/backend/nestjs, https://www.prisma.io/docs/orm/prisma-client/deployment/edge/overview

4. **Medium: Current auth/session behavior is placeholder-only and must fail closed in the reset.**  
   Affected paths: [apps/api/src/app.ts](/Users/tw.kim/Documents/AGA/test/new-mobile-app/apps/api/src/app.ts:7), [apps/api/src/env.ts](/Users/tw.kim/Documents/AGA/test/new-mobile-app/apps/api/src/env.ts:3), [optional-api.md](/Users/tw.kim/Documents/AGA/test/new-mobile-app/team-doc/10-structured/05-repo-template/optional-api.md:31).  
   Existing API protects `/api/*` with required `API_BEARER_TOKEN` and leaves `/livez`/`/readyz` unauthenticated. NestJS migration must preserve or explicitly replace that boundary; real token/session issuance remains deferred and should not be invented in the stack reset. Next owner: **backend/API integrator**.

**Contract Drift**

No current API contract drift found in checked affected paths. `packages/contracts` defines `counterEventRequestSchema` and `counterEventRecordSchema` in [packages/contracts/src/index.ts](/Users/tw.kim/Documents/AGA/test/new-mobile-app/packages/contracts/src/index.ts:5); the Hono route imports the request schema in [counter-events.ts](/Users/tw.kim/Documents/AGA/test/new-mobile-app/apps/api/src/routes/counter-events.ts:3); tests validate the response with the shared record schema in [counter-events.test.ts](/Users/tw.kim/Documents/AGA/test/new-mobile-app/apps/api/src/routes/__tests__/counter-events.test.ts:2). DB `created_at` maps to TypeScript/API `createdAt` at the boundary in [schema.ts](/Users/tw.kim/Documents/AGA/test/new-mobile-app/apps/api/src/db/schema.ts:6) and [counter-events.service.ts](/Users/tw.kim/Documents/AGA/test/new-mobile-app/apps/api/src/services/counter-events.service.ts:9).

**Verdict**

The draft conclusion is directionally correct and safe to deliver **after adding the two missing material points**: Prisma migration policy approval and Prisma Postgres pooled/direct URL separation. I verified `pnpm --filter @template/api lint` passes. I could not independently rerun API tests in this read-only sandbox because Vitest attempted to write a temporary config file and failed with `EPERM`; that should be noted as a review-environment limitation, not an app failure.