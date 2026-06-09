# API Run Evidence

- Date: 2026-06-09
- Scope: local `apps/api` run and smoke checks
- Result: pass

## Environment

- Requested default port: `3000`
- Actual API port used: `3001`
- Reason: port `3000` was already occupied by a local `kubectl` process.
- Database URL: local Postgres only, `postgres://app:app@localhost:5432/app`
- Bearer token: local development placeholder only, `local-dev-token`

## Commands

| Step | Command | Result | Evidence |
| --- | --- | --- | --- |
| Port check | `lsof -iTCP:3000 -sTCP:LISTEN -n -P` | Informational | Port `3000` occupied by `kubectl`; API smoke switched to port `3001`. |
| Docker version | `docker --version` and `docker compose version` | Pass, exit 0 | Docker 28.5.2 and Docker Compose v2.40.3 available. |
| Start Postgres | `docker compose -f apps/api/compose.yaml up -d postgres` | Pass, exit 0 | `api-postgres-1` started. |
| Postgres readiness | `docker compose -f apps/api/compose.yaml exec -T postgres pg_isready -U app -d app` | Pass, exit 0 | `/var/run/postgresql:5432 - accepting connections`. |
| Start API | `DATABASE_URL=... API_BEARER_TOKEN=local-dev-token API_PORT=3001 pnpm --filter @template/api dev` | Pass | `tsx watch src/index.ts` started and served smoke requests. |
| Liveness | `curl -fsS http://127.0.0.1:3001/livez` | Pass, exit 0 | `{"status":"ok"}` |
| Readiness | `curl -fsS http://127.0.0.1:3001/readyz` | Pass, exit 0 | `{"status":"ok"}` |
| Authenticated counter event | `POST /api/counter-events` with bearer token | Pass, exit 0 | Response returned an id, count `1`, and `createdAt`. |
| Missing auth | `POST /api/counter-events` without bearer token | Pass, exit 0 | HTTP status `401`. |
| Wrong auth | `POST /api/counter-events` with wrong bearer token | Pass, exit 0 | HTTP status `401`. |
| Stop API | Ctrl-C API dev session | Pass | Dev server stopped; expected process exit status `130`. |
| Stop Postgres | `docker compose -f apps/api/compose.yaml down` | Pass, exit 0 | Container and compose network removed. |

## Notes

- One negative-auth command first used zsh variable name `status`, which is read-only in zsh. The command was rerun with `http_status` and passed for both missing and wrong bearer token cases.
- API smoke evidence is local runtime readiness, not production readiness.
