# Mobile Web App Detailed Plan Summary

Date: 2026-06-09

## Outcome

Detailed plan completed for creating `/Users/tw.kim/Documents/AGA/test/mobile-web-app` as a separate ReactJS mobile web monorepo derived from the current Expo/RN project behavior.

The plan keeps `/Users/tw.kim/Documents/AGA/test/new-mobile-app` as the Expo/RN WonderMove runtime repo and treats new-repo implementation as a handoff, not as `$wm` source-repo implementation.

## Planned Target

- `apps/web`: React DOM + Vite + Tailwind CSS v4 + Vitest/Testing Library + Playwright.
- `packages/contracts`: copied migration snapshot first, then treated as the new repo's local contract authority until API-backed features require moved API or published/versioned contracts.
- Optional `apps/api`: only move when backend persistence is needed.
- Browser QA replaces emulator QA for MVP using Playwright mobile viewport smoke.

## Reviewer

Reviewer: `wm-implementation-reviewer`

Evidence:

- Plan: `.evidence/mobile-web-app-detailed-plan/plan.md`
- Review: `.evidence/mobile-web-app-detailed-plan/reviewer.md`

Reviewer findings and disposition:

- Critical: none.
- High: source repo PR readiness is blocked while `pnpm run test:runtime` fails on root `CLAUDE.md` / `.claude`. Disposition: reflected in the plan as a hard blocker, not a caveat.
- Medium: contract Phase 1 needed an executable test script. Disposition: plan now requires `packages/contracts` `test` script plus test dev dependencies.
- Medium: `pnpm --filter web` was ambiguous. Disposition: plan now requires `apps/web/package.json` package name `web`, with path-filter fallback if renamed.
- Low: implementation ownership remains a handoff decision. Disposition: retained as a human decision before implementation.

## Verification

This planning task changed evidence files only:

- `.evidence/mobile-web-app-detailed-plan/plan.md`
- `.evidence/mobile-web-app-detailed-plan/reviewer.md`
- `.evidence/mobile-web-app-detailed-plan/summary.md`

Source app/runtime code was not changed.

Expected command status:

- `pnpm turbo run lint test`: should be run and must pass for source workspace sanity.
- `pnpm run test:runtime`: currently blocked by existing root runtime artifacts `CLAUDE.md` and `.claude/`; this must be resolved before a source-repo PR containing this evidence is PR-ready.
