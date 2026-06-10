# Phase 10 RN Web E2E Fix Preimplementation Review Prompt

Review mode: xhigh

## Scope

Review the proposed repo-local Phase 10 plan:

- `docs/plans/active/20260611-phase10-pr-readiness-rn-web-e2e-fix-plan.md`

## Current Evidence

- Current HEAD: `1215f27 docs: add human ops readiness annex`
- Branch: `feat/mobile-app-template`
- Passing gates before the RN Web E2E attempt:
  - `pnpm run test:runtime`
  - `pnpm run test:local-harness`
  - `pnpm turbo run lint test`
  - `pnpm --filter mobile exec expo install --check`
  - `pnpm --filter mobile lint`
  - `pnpm --filter mobile test`
  - `pnpm --filter mobile run doctor`
  - `codex mcp list` exited 0; raw output is not persisted because MCP config output may include token-like query parameters.
- Failing gate:
  - `pnpm --filter mobile e2e:web -- e2e-web/home.spec.ts`
  - Failure: Expo Web rendered `apps/mobile/env.ts` URL validation error for `API_URL` because Playwright injected `EXPO_PUBLIC_API_URL` as an empty string.

## Relevant SoT

- `AGENTS.md`: mobile environment/runtime changes require `expo install --check`, mobile lint/test/doctor, and `codex mcp list`; applicable commands must exit 0 before PR.
- `PROJECT_ENVIRONMENT.md`: RN Web E2E is useful but does not prove native/device/EAS behavior; deployed API E2E requires `EXPO_PUBLIC_API_URL=<deployed-api-url>`.
- `team-doc/mobile-app-dev-team/14-native-e2e-strategy.md`: RN Web evidence and native evidence must remain distinct.
- `team-doc/mobile-app-dev-team/15-human-ops-live-readiness-annex.md`: live EAS/device/Railway/Confluence/GitHub settings/pod/secret/release claims require separate approval and must not be inferred from repo-local proof.

## Proposed Implementation

1. Set a valid non-production loopback placeholder URL for the Expo Web server when no explicit `EXPO_PUBLIC_API_URL` is supplied.
2. Make the backend API Playwright spec conditional on explicit `EXPO_PUBLIC_API_URL`.
3. Update `PROJECT_ENVIRONMENT.md` to label base RN Web E2E as UI/business-flow proof only and deployed-backend proof only when the URL is supplied.
4. Persist checkpoint/final review evidence.

`EXPO_PUBLIC_*` values are public client configuration, not secrets. The concern is avoiding customer-specific or production hardcoding and avoiding overclaiming backend/live readiness.

## Questions

Return a JSON envelope and a short review:

1. Verdict: GO, NO_GO, or BLOCKED.
2. Findings by severity.
3. Whether implementation may proceed inside the narrow repo-local scope.
4. Whether any additional gate is required before implementation.
