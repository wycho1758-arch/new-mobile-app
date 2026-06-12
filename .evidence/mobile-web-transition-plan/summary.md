# Mobile Web Transition Plan Summary

Date: 2026-06-09

## Outcome

Recommended MVP path: preserve `/Users/tw.kim/Documents/AGA/test/new-mobile-app` as the current Expo / React Native WonderMove runtime repo, and create `/Users/tw.kim/Documents/AGA/test/mobile-web-app` as a separate ReactJS mobile web app repo.

This recommendation is for migration strategy, not `$wm` implementation. `$wm` implementation is repo-scoped to the current repository, so creating and implementing a sibling repo should be treated as a separate non-`$wm` execution or as an explicitly approved handoff.

## Reviewer Result

Reviewer: `wm-implementation-reviewer`

Evidence:

- Plan: `.evidence/mobile-web-transition-plan/plan.md`
- Review: `.evidence/mobile-web-transition-plan/reviewer.md`

Reviewer findings:

- Critical: none.
- High: Option A is not executable under `$wm` as written because it creates a sibling repo outside this repository. Treat as a handoff or docs/evidence-only work here.
- Medium: contract migration strategy must pick one SoT before implementation: published package, workspace linkage, generated artifact, or moved backend/contracts.
- Medium: implementation evidence path must be made explicit before work proceeds.
- Low: in-place conversion path list should include `apps/mobile/global.css`, `apps/mobile/postcss.config.mjs`, `apps/mobile/nativewind-env.d.ts`, and `apps/mobile/jest.after-env.js`.

## Adjusted Execution Guidance

If proceeding with the recommended new repo:

1. Do not run it as `$wm` implementation from `new-mobile-app`.
2. Define the new repo's own development gates: typecheck, unit/component tests, build, and browser smoke with mobile viewport.
3. Choose the contract authority before code:
   - Preferred for MVP: copy only if backend is also moved or if the copied package is clearly temporary and documented.
   - Better long-term: publish/version `packages/contracts` or place both app and contracts in a new workspace so one package remains authoritative.
4. Use web public env variables such as `VITE_*`; they are client-compiled public configuration and must not contain private runtime values.
5. Replace emulator-dependent QA with Playwright browser smoke for mobile viewport.

If pursuing in-place conversion:

1. Treat it as repo retargeting, not MVP simplification.
2. Update `AGENTS.md`, `PROJECT_ENVIRONMENT.md`, CI/runtime gates, app package scripts, Expo/EAS/Maestro/mobile-mcp assumptions, NativeWind RN files, tests, and local harness expectations together.
3. Run `pnpm run test:runtime`, `pnpm run test:local-harness`, and `pnpm turbo run lint test`.

## Verification Status

No app implementation was performed. No source files under `apps/`, `packages/`, `.agents/`, `.codex/`, `evals/`, or `scripts/` were intentionally changed by this review. Verification is evidence-level only.
