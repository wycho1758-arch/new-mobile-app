---
name: qa-railway-workflow
description: "Use when QA/Release must operate Railway CLI for this repo: install or verify the Railway CLI, authenticate, create or link projects, add services or Postgres, set deployment variables without leaking secrets, deploy apps/api, create domains, inspect logs/status, verify health endpoints, run RN Web E2E with a deployed API URL, and record evidence. This repo-local workflow is for Railway operations and release evidence, not generic Railway advice or app implementation."
---

# QA Railway Workflow

Use this repo-local QA/Release skill when Railway CLI work is part of release evidence for the new mobile app repository.

Official sources to check before running live Railway commands:

- Railway CLI guide: https://docs.railway.com/guides/cli
- `railway login`: https://docs.railway.com/cli/login
- `railway up`: https://docs.railway.com/cli/up
- `railway domain`: https://docs.railway.com/cli/domain
- Variables reference: https://docs.railway.com/reference/variables
- Global options: https://docs.railway.com/cli/global-options
- Railway for Agents / setup: https://docs.railway.com/agents and https://docs.railway.com/cli/setup

## Required Inputs

- Target task or release candidate.
- Railway target: new project or existing project ID/name.
- Service names, usually `api` and `Postgres` for this repo.
- Deployment source, usually repo root with `RAILWAY_DOCKERFILE_PATH=apps/api/Dockerfile`.
- Health endpoints, usually `/livez` and `/readyz`.
- Evidence directory, usually `.evidence/e2e-test/<YYYYMMDD-HHMMSS>-<slug>/` or `.evidence/<task-id>/`.

## Workflow

1. Read `AGENTS.md`, `PROJECT_ENVIRONMENT.md`, `docs/SETUP.md`, and existing evidence for the task.
2. Verify local hygiene before touching Railway:
   - Confirm `.gitignore` ignores `.env`, `.env.*`, and `.railway/`.
   - Keep `.env.example` and `.env.*.example` allowed.
   - Do not read, print, commit, or summarize secret values.
3. Verify CLI availability:
   - `railway --version`
   - If missing on macOS, install with Homebrew: `brew install railway`.
   - Alternative official methods include npm, shell script, Scoop, prebuilt binaries, and source builds.
4. Authenticate only through approved paths:
   - Interactive local machine: `railway login`, then `railway whoami`.
   - Browserless shell: `railway login --browserless`.
   - CI/non-interactive: use exactly one of `RAILWAY_TOKEN` or `RAILWAY_API_TOKEN`.
   - Never record tokens or account secrets in evidence.
5. Discover or create the project:
   - Existing project: `railway list --json`, then `railway link`.
   - New project: `railway init --name <project-name> --json`.
   - Record project name/id and environment, not secrets.
6. Add or verify services:
   - Postgres: `railway add --database postgres --json`.
   - API service: `railway add --service api --json`.
   - Confirm with `railway service list --json`.
7. Configure variables without leaking values:
   - Safe examples:
     - `railway variable set RAILWAY_DOCKERFILE_PATH=apps/api/Dockerfile --service api`
     - `railway variable set DATABASE_URL='${{Postgres.DATABASE_URL}}' --service api`
     - `railway variable set PORT=3000 --service api`
     - `railway variable set API_PORT=3000 --service api`
     - `railway variable set RAILWAY_HEALTHCHECK_PATH=/readyz --service api`
   - For secret values, use stdin or the Railway dashboard. Do not echo values into logs.
   - Evidence may list variable names and reference syntax such as `${{Postgres.DATABASE_URL}}`, but must not include `DATABASE_URL`, `API_BEARER_TOKEN`, `RAILWAY_TOKEN`, or `RAILWAY_API_TOKEN` values.
   - `EXPO_PUBLIC_*` values are public client config compiled into the app, not secrets; still do not put bearer tokens, signing keys, passwords, or private endpoints in them.
8. Deploy:
   - From repo root: `railway up --service api --ci`.
   - Official behavior: `railway up` uploads local code, respects `.gitignore` and `.railwayignore`, and exits non-zero on failed/crashed deploys.
   - Do not use `--no-gitignore` unless a human explicitly approves the file exposure risk.
9. Inspect status and logs:
   - `railway status --json`
   - `railway service list --json`
   - `railway logs --service api --deployment --tail <N>`
   - Capture bounded, relevant output only. Redact any accidental secrets.
10. Create or verify public domain:
    - `railway domain --service api --port 3000 --json`
    - Railway-provided domains are limited to one per service.
11. Verify deployed API:
    - `curl -fsS <api-url>/livez`
    - `curl -fsS <api-url>/readyz`
    - Expected response for this repo: `{"status":"ok"}`.
12. Run RN Web E2E when release scope requires it:
    - `EXPO_PUBLIC_API_URL=<api-url> pnpm --filter mobile e2e:web`
    - This validates browser-reproducible RN Web behavior and deployed API health only.
13. Update `PROJECT_ENVIRONMENT.md` after successful setup or deployment:
    - Railway project/service names.
    - Public API URL.
    - Latest verified deployment id.
    - Health check results.
    - Runtime variables by name only.
    - Evidence path.
14. Record evidence:
    - Commands and exit status.
    - Project/service/deployment IDs.
    - Domain.
    - Health responses.
    - RN Web E2E result.
    - Residual scope: native Maestro/mobile-mcp and store submit are outside RN Web-only evidence.
15. Request read-only reviewer verification before Done.

## Boundaries

- Do not implement API code, mobile UI, migrations, or contract changes inside this skill. Route code changes through `$wm` and the owning implementation workflow.
- Do not run `railway setup agent` as part of this repo-local workflow. It installs Railway-owned skills/MCP config and may modify broader tool configuration. Mention it only as an official option when the user explicitly asks for Railway-owned agent integration.
- Do not accept billing, production, privacy, legal, payment, or post-failure release risk without recorded human approval.
- Do not print or persist secrets. If a secret is accidentally exposed in command output, rotate it and record only that rotation occurred.
- Do not treat a passing Railway deploy as mobile release readiness unless required mobile/RN Web evidence also exists.

## Required Evals

- Positive: explicit `$qa-railway-workflow` request triggers Railway CLI planning, deployment evidence, health checks, RN Web E2E linkage, and `PROJECT_ENVIRONMENT.md` update.
- Negative: generic Railway advice for another repository does not trigger this repo skill.
- Negative: review-only Railway evidence inspection does not trigger this skill.
