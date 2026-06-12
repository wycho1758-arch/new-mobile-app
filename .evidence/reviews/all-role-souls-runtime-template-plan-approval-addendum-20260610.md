# All Role SOUL Runtime Template Plan Approval Addendum - 2026-06-10

## Purpose

This addendum records the resolved approval state for the all-role SOUL runtime-template implementation.

The initial xhigh plan review is saved at:

- `.evidence/reviews/all-role-souls-runtime-template-plan-xhigh-20260610.md`

That review was not a clean approval. It found:

- High: the Mobile App Dev runtime-template note removal needed a validator-first negative assertion.
- Medium: `pnpm run test:local-harness` needed to be included or explicitly scoped out.
- Medium: persisted plan-review evidence path needed to be named.

## Corrections Applied Before Implementation

Before file edits beyond the validator red step, the execution plan was amended to include:

- Add `forbidDocTerms()` and a negative assertion for the exact requested `Runtime template note: ... copying this file verbatim.` paragraph.
- Run `node scripts/validate-team-doc.mjs` and require it to fail before implementation because the paragraph still existed and five SOUL files were not in runtime heading order.
- Convert all six role SOUL docs to ordered runtime headings.
- Remove the forbidden paragraph from `mobile-app-dev-soul.md` without replacing it with another note.
- Run `node scripts/validate-team-doc.mjs`, `pnpm run test:runtime`, `pnpm turbo run lint test`, and `pnpm run test:local-harness`.
- Persist implementation evidence and final xhigh review evidence.

## User Approval

After the corrected plan and initial xhigh findings were reported, the user instructed:

```text
위의 내용대로 진행하고 완료 후 반드시 reviewer(xhigh)로 검토하고 결과 보고하세요.
```

This instruction approved proceeding with the corrected plan, including the xhigh-requested additions above.

## Scope Approved

- `scripts/validate-team-doc.mjs`
- `team-doc/mobile-app-dev-team/02-role-souls/product-planning-soul.md`
- `team-doc/mobile-app-dev-team/02-role-souls/design-soul.md`
- `team-doc/mobile-app-dev-team/02-role-souls/mobile-architect-soul.md`
- `team-doc/mobile-app-dev-team/02-role-souls/mobile-app-dev-soul.md`
- `team-doc/mobile-app-dev-team/02-role-souls/backend-api-integrator-soul.md`
- `team-doc/mobile-app-dev-team/02-role-souls/qa-release-soul.md`

## Non-Scope Dirty Files

The current worktree contains additional dirty files outside this implementation scope. They must not be staged as part of this SOUL runtime-template change unless separately reviewed:

- `.codex/hooks.json`
- `.codex/hooks/mobile-stop-call-check.mjs`
- `scripts/test-hooks.mjs`
- `evals/hooks/fixtures/mcp-list-devices-server.mjs`
- `team-doc/mobile-app-dev-team/03-role-capability-matrix.md`
- `team-doc/mobile-app-dev-team/05-work-processes.md`
- `team-doc/mobile-app-dev-team/08-role-title-update-plan.md`

These files are not claimed as part of the all-role SOUL runtime-template implementation.
