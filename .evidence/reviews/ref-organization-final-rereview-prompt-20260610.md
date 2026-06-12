# Ref Organization Final Rereview Prompt

Reviewer: `wm-implementation-reviewer`
Mode: xhigh / read-only final rereview
Date: 2026-06-10

## Objective

Rereview the `$wm` goal after fixing the two Medium findings from `.evidence/reviews/ref-organization-final-xhigh-20260610.md`.

Goal:

`team-doc/mobile-app-dev-team/12-ref-organization-goal-plan.md 을 진행하세요.`

## Prior Findings To Verify Closed

1. `team-doc/10-structured` was still treated as a current validation/source input.
2. Many `ref-organization` page status blocks still said Reviewer evidence was pending.

## Fixes Claimed

- Removed `team-doc/10-structured/03-skills/mvp-skill-matrix.md` as the active/current skill matrix validation input in `scripts/validate-team-doc.mjs`.
- Kept active skill validation against `.agents/skills/` and `team-doc/mobile-app-dev-team/04-skills-and-agents-matrix.md`.
- Moved `team-doc/10-structured` references in `team-doc/mobile-app-dev-team/99-source-map.md` out of the current source table and into `Historical Structured Inputs`.
- Updated all `team-doc/mobile-app-dev-team/ref-organization/**/*.md` status blocks so `Reviewer evidence:` links `.evidence/reviews/...` and no longer says pending.
- Updated `scripts/validate-team-doc.mjs` so any ref-organization `Reviewer evidence:` containing `pending` fails validation and evidence paths must start with `.evidence/reviews/`.

## Commands Re-run After Fixes

- `pnpm run validate:team-doc` passed:
  - `Validated team-doc: 71 source files, 32 structured files.`
- `pnpm run test:runtime` passed:
  - `Validated 11 skills, 13 agents, and 4 hook events.`
  - `Codex headless review helper self-test passed.`
  - `Passed 44 hook fixture tests.`
- `pnpm turbo run lint test` passed:
  - `Tasks: 6 successful, 6 total`
- `pnpm run test:local-harness` passed:
  - `clean-tree-guard self-test passed`
  - `codex-preflight self-test passed`
  - `self-test all passed`
  - `local harness all passed`

## Required Checks

Review these files read-only:

- `scripts/validate-team-doc.mjs`
- `team-doc/mobile-app-dev-team/99-source-map.md`
- `team-doc/mobile-app-dev-team/ref-organization/**/*.md`
- `team-doc/mobile-app-dev-team/12-ref-organization-goal-plan.md`
- `.evidence/reviews/ref-organization-final-xhigh-20260610.md`

Verify:

- The two prior Medium findings are closed.
- No new Critical/High/Medium findings were introduced.
- The final structure remains under `team-doc/mobile-app-dev-team/ref-organization/`.
- `team-doc/10-structured` is historical/reference input, not active current SoT.
- The supplied post-fix command results are sufficient for this documentation/validator change.

Return findings first. End with exactly one fenced JSON envelope and no text after it.

The envelope must satisfy:

- `verdict`: `GO`, `NO_GO`, `NEEDS_HUMAN`, or `BLOCKED`
- `reviewer`: `wm-implementation-reviewer`
- `mode`: `final`
- `scope`: object with `baseline`, `target`, and `paths_reviewed`
- `findings`: array; use uppercase severity values `CRITICAL`, `HIGH`, `MEDIUM`, `LOW`; every finding needs `source_refs` as `path:line` strings and `owner`
- `checks_reviewed`: array with `command`, `status`, and `evidence`; status must be `PASS`, `FAIL`, `NOT_RUN`, or `NOT_APPLICABLE`
- `residual_risks`: array of strings
- `next_action`: `proceed`, `fix_findings`, `ask_human`, or `rerun_review`
