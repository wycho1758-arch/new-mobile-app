# Phase 10 RN Web E2E Fix Implementation Checkpoint

## Scope

Implemented the reviewer-approved repo-local Phase 10 fix for RN Web E2E PR readiness.

Changed files:

- `apps/mobile/playwright.config.ts`
- `apps/mobile/e2e-web/backend-api.spec.ts`
- `PROJECT_ENVIRONMENT.md`

Plan and preimplementation review:

- Plan: `docs/plans/active/20260611-phase10-pr-readiness-rn-web-e2e-fix-plan.md`
- Prompt: `.evidence/reviews/phase10-rn-web-e2e-fix-preimplementation-review-prompt-20260611.md`
- Review: `.evidence/reviews/phase10-rn-web-e2e-fix-preimplementation-xhigh-20260611.md`
- Envelope: `.evidence/reviews/phase10-rn-web-e2e-fix-preimplementation-xhigh-20260611.json`
- Verdict: `GO`, findings 0

## Failure Reproduced Before Fix

Command:

```text
pnpm --filter mobile e2e:web -- e2e-web/home.spec.ts
```

Result: failed.

Observed cause: Expo Web rendered an `apps/mobile/env.ts` validation error because `EXPO_PUBLIC_API_URL` was injected as an empty string while `API_URL` requires a valid URL.

## Implementation

- `apps/mobile/playwright.config.ts` now supplies `http://127.0.0.1:65535` as a non-production loopback placeholder for the app runtime when no explicit `EXPO_PUBLIC_API_URL` exists.
- `apps/mobile/e2e-web/backend-api.spec.ts` skips the deployed backend API reachability check when `EXPO_PUBLIC_API_URL` is not supplied by the invoking environment.
- `PROJECT_ENVIRONMENT.md` now distinguishes:
  - base RN Web E2E as browser UI/business-flow proof only;
  - deployed-backend RN Web E2E as requiring explicit `EXPO_PUBLIC_API_URL=<deployed-api-url>`;
  - neither path as native/device/EAS/mobile-mcp proof.

`EXPO_PUBLIC_*` values are public client configuration, not secrets. The implemented placeholder is not a customer, production, private endpoint, token, or deployed-backend proof.

## Verification After Fix

```text
pnpm --filter mobile e2e:web
```

Result: pass. Summary: 1 passed, 1 skipped. The skipped test is the deployed backend API reachability check, because no explicit `EXPO_PUBLIC_API_URL` was supplied.

```text
pnpm --filter mobile lint
```

Result: pass.

```text
pnpm --filter mobile test
```

Result: pass. Summary: 2 test suites passed, 5 tests passed.

```text
pnpm --filter mobile exec expo install --check
```

Result: pass. Dependencies are up to date.

```text
pnpm --filter mobile run doctor
```

Result: pass. Summary: 21/21 checks passed.

```text
pnpm run test:runtime
```

Result: pass. Summary: runtime artifacts, repo operations, team-doc, work-units, next-action, EAS evidence ingest, project-environment drift, evidence hygiene, and 44 hook fixtures passed.

```text
pnpm turbo run lint test
```

Result: pass. Summary: 6 successful tasks across `@template/api`, `@template/contracts`, and `mobile`.

```text
pnpm run test:local-harness
```

Result: pass. Summary: local harness all passed.

```text
git diff --check
```

Result: pass.

Previously run PR-readiness mobile check:

```text
codex mcp list
```

Result: exit 0. Raw output is intentionally not persisted because MCP configuration output can include token-like query parameters. No MCP configuration was changed by this Phase 10 implementation.

## Not Run / Not Claimed

- No `EXPO_PUBLIC_API_URL=<deployed-api-url> pnpm --filter mobile e2e:web` run was performed in this Phase 10 fix; deployed backend API reachability is not claimed.
- No Railway/live API check, deployment, or mutation was performed.
- No live EAS, `eas whoami`, Maestro cloud, simulator, emulator, device, or mobile-mcp run was performed.
- No GitHub branch protection, webhook, Secret/token, pod, image, Confluence, release, or store-submit mutation was performed.
- Base RN Web E2E pass is L1 RN Web/browser proof only and is not native/device/release readiness.
