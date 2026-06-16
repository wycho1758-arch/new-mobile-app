# Test Infrastructure (this repo: Expo RN + TypeScript)

Curated for the `new-mobile-app` stack. Test layers follow the QA/Release evidence ladder
(`mobile-app-dev-team/runtime-sources/role-souls/qa-release-soul.md`): L0 unit/component, L1 RN Web, L2 native/EAS.

## L0 — Unit / Component (Jest + React Native Testing Library)

- **Runner**: Jest with the Expo / React Native preset.
- **Location**: `__tests__/` alongside source, or `*.test.ts(x)` next to the unit under test.
- **Component tests**: React Native Testing Library; query by stable kebab-case `testID`.
- **Run all**: `pnpm test`
- **Run single**: `pnpm test -- path/to/file.test.tsx`
- Mock network at the boundary; assert shared request/response types against `packages/contracts`.

## L1 — RN Web E2E (Playwright)

- Drives the RN Web build for flow-level evidence; not a substitute for native proof.
- Record evidence under `.evidence/e2e-test/` per the QA workflow.

## L2 — Native E2E (Maestro / mobile-mcp / EAS)

- Native device/simulator or EAS artifact flows; gated by `human-gate/v1` for live cloud runs.
- RN Web passing does NOT count as native proof.

## Coverage Requirements

- **Minimum**: meet the targets in the `code-quality` skill's Coverage Targets table.
- **Required coverage types**:
  - Happy path (core functionality)
  - Edge cases (empty input, max values, special characters)
  - Error paths (invalid input, network failures, auth failures)
  - State coverage for screens (default / loading / empty / error / permission-denied)
  - Boundary conditions (pagination limits, retry/backoff)
