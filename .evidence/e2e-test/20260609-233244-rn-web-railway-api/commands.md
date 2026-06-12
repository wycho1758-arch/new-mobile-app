# Commands

```bash
railway login
```

Result: signed in as the Railway user.

```bash
railway init --name new-mobile-app --json
railway add --database postgres --json
railway add --service api --json
```

Result: Railway project `new-mobile-app`, Postgres service, and API service were created.

```bash
railway variable set RAILWAY_DOCKERFILE_PATH=apps/api/Dockerfile --service api
railway variable set DATABASE_URL='${{Postgres.DATABASE_URL}}' --service api
railway variable set PORT=3000 --service api
railway variable set API_PORT=3000 --service api
railway variable set RAILWAY_HEALTHCHECK_PATH=/readyz --service api
```

Result: API deployment variables were configured. `API_BEARER_TOKEN` was also set via stdin and rotated after an accidental variable-list output.

```bash
railway up --service api --ci
```

Initial result: deploy completed but API crashed with `ERR_UNSUPPORTED_NODE_MODULES_TYPE_STRIPPING` because `@template/contracts` exposed `src/index.ts` at runtime.

```bash
node --test packages/contracts/__tests__/package-exports.test.mjs
```

Initial result: failed, confirming `@template/contracts` runtime export was not built JavaScript.

```bash
pnpm --filter @template/contracts test
pnpm --filter @template/contracts build
pnpm --filter @template/api test
pnpm --filter @template/api build
docker build -f apps/api/Dockerfile .
```

Result: all passed after contracts build/export and Dockerfile fixes.

```bash
railway up --service api --ci
railway service list --json
```

Result: API deployment `4c701f22-3ce9-40ef-a4bd-560252b773f3` reached `SUCCESS` with 1 running replica and 0 crashed replicas.

```bash
railway domain --service api --port 3000 --json
```

Result: public domain generated: `https://api-production-3d74.up.railway.app`.

```bash
curl -fsS https://api-production-3d74.up.railway.app/livez
curl -fsS https://api-production-3d74.up.railway.app/readyz
```

Result: both returned `{"status":"ok"}`.

```bash
pnpm --filter mobile e2e:web
```

Initial result after adding the backend API E2E: failed because `EXPO_PUBLIC_API_URL` was unset.

```bash
EXPO_PUBLIC_API_URL=https://api-production-3d74.up.railway.app pnpm --filter mobile e2e:web
```

Final result: 2 Playwright tests passed.

```bash
pnpm run test:runtime
```

Final result: passed. Runtime validator checked 10 skills, 13 agents, and 4 hook events; team-doc validator checked 71 source files and 32 structured files; hook tests passed 40 fixtures.

```bash
pnpm turbo run lint test
```

Final result: passed after adding Jest mapping for `@template/contracts`. Six tasks succeeded across `@template/api`, `@template/contracts`, and `mobile`.

```bash
git check-ignore -v .env .env.local .env.example
git diff --check -- .gitignore apps/api/Dockerfile packages/contracts/package.json packages/contracts/tsconfig.json packages/contracts/__tests__/package-exports.test.mjs apps/mobile/playwright.config.ts apps/mobile/e2e-web/backend-api.spec.ts apps/mobile/package.json PROJECT_ENVIRONMENT.md .evidence/e2e-test/20260609-233244-rn-web-railway-api
```

Final result: `.env` and `.env.local` are ignored, `.env.example` remains allowed, and diff whitespace check passed.
