# API And App Run Check Summary

- Date: 2026-06-09
- Plan: `docs/plans/active/20260609-api-app-run-check-plan.md`
- Result: API local smoke passed; deterministic mobile gates passed; Expo/Metro started; device visual QA blocked by unavailable devices.

## Evidence

| Area | Result | Evidence file |
| --- | --- | --- |
| Baseline gates | Pass | `.evidence/api-app-run-check/baseline.md` |
| API local run | Pass | `.evidence/api-app-run-check/api.md` |
| Mobile local run | Partial pass | `.evidence/api-app-run-check/mobile.md` |
| Local harness | Pass | `.evidence/api-app-run-check/baseline.md` |

## Key Findings

- API runs locally against Postgres and passes `/livez`, `/readyz`, authenticated `POST /api/counter-events`, and missing/wrong bearer-token `401` checks.
- API used port `3001` because port `3000` was already occupied by a local `kubectl` process.
- Expo/Metro starts for `apps/mobile` with `EXPO_PUBLIC_API_URL=http://127.0.0.1:3001`.
- `pnpm run test:local-harness` passed after the plan/evidence files were written.
- mobile-mcp is configured and callable, but returned no available devices. Device visual QA and Maestro are therefore blocked, not passed.
- The current mobile screen does not call the API, so this run is not mobile-to-API end-to-end evidence.

## Required Follow-Up Before PR Readiness

- Run mobile visual QA on an available simulator/device through `mobile-mcp`.
- Run Maestro smoke after the app is installed on a target device or simulator.
- Fix host-side iOS simulator availability if iOS QA is required; current `xcrun simctl` probe exits with code `72`.
