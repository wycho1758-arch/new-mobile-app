# Ref Organization Final Rereview 2 Prompt

Reviewer: `wm-implementation-reviewer`
Mode: xhigh / read-only final rereview
Date: 2026-06-10

## Objective

Verify closure of the remaining Medium finding from `.evidence/reviews/ref-organization-final-rereview-xhigh-20260610.md`.

## Prior Remaining Finding

- `team-doc/mobile-app-dev-team/ref-organization/00-orientation-and-sot/current-project-vs-template.md:34` still contained `Reviewer evidence: <path or pending Reviewer(xhigh)>`.
- `scripts/validate-team-doc.mjs` only checked the first `Reviewer evidence:` line in the top 40 lines.

## Fixes Claimed

- Changed the template line to `Reviewer evidence: .evidence/reviews/<review-file>.md`.
- Changed `scripts/validate-team-doc.mjs` to inspect all `Reviewer evidence:` matches in the top 40 lines with `matchAll`.
- Verified `rg -n "Reviewer evidence: .*pending|pending" team-doc/mobile-app-dev-team/ref-organization || true` returns no matches.

## Commands Re-run After This Fix

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

Review read-only:

- `scripts/validate-team-doc.mjs`
- `team-doc/mobile-app-dev-team/ref-organization/00-orientation-and-sot/current-project-vs-template.md`
- `team-doc/mobile-app-dev-team/ref-organization/**/*.md` if needed
- `.evidence/reviews/ref-organization-final-rereview-xhigh-20260610.md`

Verify:

- The remaining Medium finding is closed.
- No new Critical/High/Medium findings were introduced.
- Required post-fix commands are sufficient for this validator/doc change.

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
