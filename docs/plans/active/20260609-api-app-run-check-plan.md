# API And App Run Check Plan

- Date: 2026-06-09
- Scope: local execution readiness and smoke check plan for `apps/api` and `apps/mobile`
- Status: executed with evidence
- Owner roles:
  - Backend/API Integrator: API env, database, migration, health, and authenticated endpoint smoke
  - Mobile App Dev: Expo config, mobile start, device/simulator smoke, Maestro/mobile-mcp evidence
  - Reviewer: read-only review of this plan before execution

## SoT Basis

- `AGENTS.md` requires workspace lint/test, runtime verification, mobile runtime checks, and local visual QA when a simulator or device is available.
- `PROJECT_ENVIRONMENT.md` defines:
  - API path: `apps/api`
  - API scripts: `dev`, `build`, `lint`, `test`
  - API env: `DATABASE_URL`, `API_PORT`, `API_BEARER_TOKEN`
  - Mobile path: `apps/mobile`
  - Mobile scripts: `start`, `ios`, `android`, `doctor`, `lint`, `test`, `e2e`
  - Mobile env: `EXPO_PUBLIC_APP_ENV`, `EXPO_PUBLIC_APP_DISPLAY_NAME`, `EXPO_PUBLIC_API_URL`, app identity values for preview/production/EAS
  - Mobile QA: stable `testID` values and local `mobile-mcp` visual QA when device/simulator is available

## Affected Paths

- `apps/api/package.json`
- `apps/api/src/env.ts`
- `apps/api/src/index.ts`
- `apps/api/src/app.ts`
- `apps/api/compose.yaml`
- `apps/api/drizzle/`
- `apps/mobile/package.json`
- `apps/mobile/app.config.ts`
- `apps/mobile/env.ts`
- `apps/mobile/.maestro/home.yml`
- `apps/mobile/src/app/index.tsx`
- `.evidence/api-app-run-check/`

## Preconditions

1. Do not use production, preview, customer, or private service values.
2. Use local placeholder values only:
   - `DATABASE_URL=postgres://app:app@localhost:5432/app`
   - `API_BEARER_TOKEN=local-dev-token`
   - `API_PORT=3000` unless occupied
   - `EXPO_PUBLIC_APP_ENV=development`
   - `EXPO_PUBLIC_API_URL=http://127.0.0.1:3000`
   - If `API_PORT` changes, update every API curl URL and `EXPO_PUBLIC_API_URL` to the same port.
3. Confirm Docker or an existing local Postgres is available before API dev start.
4. Confirm simulator/device availability before mobile visual QA. If unavailable, record the blocked mobile device step and still run deterministic gates.
5. Preserve current worktree changes. Do not clean, reset, or revert unrelated files.

## Execution Plan

### Phase 1: Baseline Gates

1. Run `pnpm run test:runtime`.
2. Run `pnpm turbo run lint test`.
3. Run `pnpm --filter mobile exec expo install --check`.
4. Run `pnpm --filter mobile run doctor`.
5. Run `codex mcp list` and confirm `mobile-mcp` is enabled for local mobile visual QA.
6. Record outputs under `.evidence/api-app-run-check/baseline.md`.

### Phase 2: API Local Run

1. Start local Postgres from `apps/api/compose.yaml`:
   - `pnpm --filter @template/api` is not used for Docker because compose is under `apps/api`.
   - Preferred command: `docker compose -f apps/api/compose.yaml up -d postgres`.
2. Wait for Postgres readiness before API startup:
   - Preferred command: `docker compose -f apps/api/compose.yaml exec -T postgres pg_isready -U app -d app`.
   - Retry until ready or record timeout/failure in evidence.
3. Start API with local env:
   - `DATABASE_URL=postgres://app:app@localhost:5432/app API_BEARER_TOKEN=local-dev-token API_PORT=3000 pnpm --filter @template/api dev`.
4. Verify unauthenticated health:
   - `curl -fsS http://127.0.0.1:3000/livez`
   - `curl -fsS http://127.0.0.1:3000/readyz`
5. Verify authenticated API path:
   - `curl -fsS -X POST http://127.0.0.1:3000/api/counter-events -H 'content-type: application/json' -H 'authorization: Bearer local-dev-token' -d '{"count":1}'`
6. Verify negative auth behavior:
   - Missing bearer token should return unauthorized for `POST /api/counter-events`.
   - Wrong bearer token should return unauthorized for `POST /api/counter-events`.
   - Missing bearer token status check:
     `http_status=$(curl -sS -o /tmp/counter-events-missing-auth.json -w '%{http_code}' -X POST http://127.0.0.1:3000/api/counter-events -H 'content-type: application/json' -d '{"count":1}') && test "$http_status" = "401"`
   - Wrong bearer token status check:
     `http_status=$(curl -sS -o /tmp/counter-events-wrong-auth.json -w '%{http_code}' -X POST http://127.0.0.1:3000/api/counter-events -H 'content-type: application/json' -H 'authorization: Bearer wrong-local-dev-token' -d '{"count":1}') && test "$http_status" = "401"`
7. Stop API and local Postgres unless the user requests keeping them running.
8. Record command outputs and process IDs under `.evidence/api-app-run-check/api.md`.

### Phase 3: Mobile Local Run

This phase proves Expo/config/UI runtime and available device visual QA. The current mobile screen parses `EXPO_PUBLIC_API_URL` but does not call the API, so this phase must not be reported as mobile-to-API end-to-end integration evidence unless app code is changed later with tests first.

1. Start Expo with local env:
   - `EXPO_PUBLIC_APP_ENV=development EXPO_PUBLIC_API_URL=http://127.0.0.1:3000 pnpm --filter mobile start`.
2. Confirm Metro starts without NativeWind, Expo Router, or config errors.
3. If a simulator/device is available:
   - Run the appropriate Expo target: `pnpm --filter mobile ios` or `pnpm --filter mobile android`.
   - Run local visual QA serially through `mobile-mcp`.
   - Record the installed app id source. For the default development fallback, Android app id is `com.template.mobile`; if `EXPO_PUBLIC_ANDROID_PACKAGE` was set, use that exact installed app id instead.
   - Run Maestro smoke only after the flow app id is executable: in a generated project `{{ANDROID_PACKAGE}}` must already be rendered to the installed app id, or for template-local smoke use a temporary rendered flow / future Maestro `${APP_ID}` + `-e APP_ID=<installed app id>` wiring. Do not rely on `ANDROID_PACKAGE=<installed app id> pnpm --filter mobile e2e` in the unrendered template repo.
4. If no simulator/device is available:
   - Record the unavailable device condition explicitly and do not mark visual QA complete.
5. Record outputs under `.evidence/api-app-run-check/mobile.md`.

### Phase 4: Final Evidence And Report

1. Summarize:
   - command
   - exit status
   - pass/fail
   - evidence path
   - unresolved risk
2. Because this plan is under `docs/plans/**`, run `pnpm run test:local-harness` before PR readiness is claimed.
3. Run `pnpm run test:runtime` again if runtime evidence files or plan files are changed after local-harness evidence is recorded.
4. Do not claim done unless API health, API authenticated smoke, API negative auth smoke, deterministic mobile gates, MCP listing, and available device QA are all accounted for.

## Gate Impact

- This plan creates documentation/evidence only.
- Runtime/app execution will not require code changes unless a gate or smoke check fails.
- If code changes are required later, follow TDD first and rerun:
  - `pnpm run test:runtime`
  - `pnpm turbo run lint test`
  - `pnpm run test:local-harness` for this plan/evidence path
  - mobile-specific checks from `PROJECT_ENVIRONMENT.md`

## Execution Authorization

- User authorized execution on 2026-06-09 with: "진해하세요. 반드시 완료 후 Reviewer로 점검하세요."
- Postgres, API, and Expo local processes were started only with local development values.
- Simulator/device automation was attempted through `mobile-mcp`; no available devices were returned.
- No production EAS build/submit/update is in scope.
