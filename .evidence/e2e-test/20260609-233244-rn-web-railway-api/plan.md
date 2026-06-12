# RN Web E2E With Railway API Plan

- Timestamp: 2026-06-09T23:32:44+09:00
- Scope: RN Web Playwright E2E only, with deployed backend API health verification.
- Backend surface: Railway `api` service backed by Railway Postgres.
- Public API URL: `https://api-production-3d74.up.railway.app`
- Test layer: Playwright Chromium via `pnpm --filter mobile e2e:web`.
- Required precondition: `EXPO_PUBLIC_API_URL` points to the deployed backend API. This is public client config, not a secret.
- Selectors covered: `home-title`, `counter-value`, `counter-increment-button`.
- Backend checks covered: `GET /livez`, `GET /readyz`.
- Exit criteria: Railway API service is running, `/livez` and `/readyz` return `{"status":"ok"}`, and RN Web E2E passes.

