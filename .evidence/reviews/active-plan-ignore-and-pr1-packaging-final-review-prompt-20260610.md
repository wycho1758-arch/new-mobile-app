# xhigh Review Prompt: PR1 Packaging + Active Plan Ignore

Date: 2026-06-10
Branch: `feat/mobile-app-template`
Reviewed commits:

- `fdb10d8 feat: add work-unit status validation`
- `e91e8ea chore: ignore active planning artifacts`

## Requested Review

Review whether the current PR1 packaging and follow-up active-plan ignore change are acceptable under the repository SoT.

Use xhigh scrutiny. Return GO only if the work is safe to report as completed locally. Return NO_GO if any issue requires remediation before reporting.

## SoT Constraints To Check

- This repo is the WonderMove mobile agents mobile app template runtime, not a single customer app.
- Runtime work must preserve reusable repo artifacts, deterministic gates, role boundaries, and evidence hygiene.
- No hardcoded customer names, bundle IDs, API URLs, tokens, or credentials.
- No direct external platform/runtime mutation.
- Active planning artifacts should not remain tracked after the user's instruction to gitignore active plans.
- Root Claude artifacts `.claude/` and `.claude-state/` must not remain in the working tree or PR scope.
- Concurrent unrelated user/session changes must not be silently committed.

## Applied Changes

`fdb10d8` added PR1 work-unit status validation:

- Added passive `wu-status/v1` validator in `scripts/lib/work-unit-machine.mjs`.
- Added CLI validator `scripts/validate-work-units.mjs`.
- Added valid/invalid fixtures under `evals/work-units/fixtures`.
- Added sample `docs/plans/work-units/sample-role-handoff/status.json`.
- Wired `validate:work-units` into `pnpm run test:runtime`.
- Updated quality-gate runtime paths and SoT docs for passive repo-artifact handoff.
- Included prior xhigh evidence for PR1 implementation.

`e91e8ea` applied active planning artifact cleanup:

- Added `.claude/`, `.claude-state/`, and `docs/plans/active/` to `.gitignore`.
- Removed tracked `docs/plans/active/*.md` files from Git with `git rm --cached -r docs/plans/active`.
- The local active plan files remain present on disk but are ignored.

## Verification Already Run

- `pnpm run test:runtime` passed after `e91e8ea`.
- `git diff --cached --check` passed before `e91e8ea`.
- `find . -maxdepth 2 \( -name 'CLAUDE.md' -o -name '.claude' -o -name '.claude-state' \) -print` returned no output after cleanup.
- `git check-ignore -v` confirms:
  - `docs/plans/active/20260610-wm-mobile-template-runtime-goal-plan.md` ignored by `.gitignore:9`.
  - `docs/plans/active/20260610-confluence-dependency-decoupling-plan.md` ignored by `.gitignore:9`.
  - `.claude-state/foo` ignored by `.gitignore:8`.
  - `.claude/bar` ignored by `.gitignore:7`.

## Current Dirty Worktree Exclusions

These remain intentionally uncommitted because they appear to be concurrent/unrelated work:

- `.agents/skills/mobile-app-dev-workflow/references/sot.md`
- `.agents/skills/mobile-backend-api-integrator-workflow/references/sot.md`
- `docs/confluence/20260608-codex-expo-rn-runtime-sot-update.md`
- `.evidence/reviews/confluence-dependency-decoupling-planning-evidence-20260610.md`

## Questions For Reviewer

1. Is it acceptable that `docs/plans/active/` is ignored and removed from Git tracking, while durable handoff remains in repo artifacts such as `docs/plans/work-units/`, `.evidence/`, SoT docs, commits, and future PRs?
2. Is the PR1 work-unit status validator still aligned with the mobile template runtime direction rather than becoming customer-app implementation work?
3. Are there any remaining NO_GO issues before reporting completion to the user?
