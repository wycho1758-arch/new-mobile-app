# Mobile Template Runtime PR Packaging Review Prompt

Review mode: xhigh

## Scope

Review current branch PR packaging/readiness state.

Checkpoint:

- `.evidence/reviews/mobile-template-runtime-pr-packaging-checkpoint-20260611.md`

Current branch:

- `feat/mobile-app-template`

Current HEAD:

- `c03df26 fix: stabilize rn web e2e api config`

Relevant SoT:

- `AGENTS.md`
- `.github/workflows/quality-gate.yml`
- `PROJECT_ENVIRONMENT.md`
- `REPO_OPERATIONS.md`
- `team-doc/mobile-app-dev-team/06-gates-and-evidence.md`
- `team-doc/mobile-app-dev-team/14-native-e2e-strategy.md`
- `team-doc/mobile-app-dev-team/15-human-ops-live-readiness-annex.md`

## Known Facts To Check

- Branch is ahead of `origin/main` by 50 commits.
- No push or PR creation has been performed.
- Local required GitHub quality-gate equivalents were run after the latest implementation:
  - `pnpm run test:runtime`
  - `pnpm turbo run lint test`
  - `pnpm run test:local-harness`
- Mobile environment/runtime checks were run:
  - `pnpm --filter mobile exec expo install --check`
  - `pnpm --filter mobile lint`
  - `pnpm --filter mobile test`
  - `pnpm --filter mobile run doctor`
  - `codex mcp list` exited 0, but raw output is not persisted.
- RN Web E2E passed:
  - `pnpm --filter mobile e2e:web`
  - result: 1 passed, 1 skipped.
  - skipped deployed backend API check is not deployed backend proof.
- `git diff --check origin/main...HEAD` fails on historical committed branch files with trailing whitespace / blank-line-at-EOF findings. Current working/staged Phase 10 diff passed `git diff --check`.

## Required Reviewer Decision

Return findings first and exactly one JSON reviewer envelope.

Please decide:

1. Whether the branch is locally packageable for PR review under the repo SoT.
2. Whether the branch-wide advisory whitespace failure is blocking or a residual risk.
3. Whether any additional repo-local gate is required before user-authorized push/PR.
4. Whether any live/human/ops action is allowed from this checkpoint.
5. Whether the next action is `proceed`, `fix_findings`, `ask_human`, or `rerun_review`.

Do not mutate files. Do not approve live ops, release readiness, or store submission.
