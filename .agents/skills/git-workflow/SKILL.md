---
name: git-workflow
description: Use when a Codex agent must run repo-scoped Git workflow operations such as branch preflight, commit, PR creation, reviewer status, approval checks, issue handling, handoff, or completion without bypassing WonderMove gates.
---

# git-workflow

Use this repo-local Codex skill when explicitly invoked as `$git-workflow` or `/git-workflow`, or when a task explicitly asks a Codex agent to perform repo Git workflow operations.

This skill coordinates local Git and PR workflow only. It does not replace `$wm`, role skills, reviewers, gatekeeper predicates, human approval, or external platform proof.

## Ground Rules

- Keep work inside the current repository. Do not modify external platform/runtime repositories from this repo.
- Preserve branch and PR workflow. Do not direct push to `main`.
- Do not force-push without explicit human approval that names the branch and reason.
- Do not perform self-approval, merge after self-review, or marking failed gates as passed.
- Do not do issue mutation without explicit authorization. Issue mutation includes creating, closing, assigning, labeling, or changing milestone/status.
- Do not merge, delete branch, squash/rebase published history, or clean up worktrees in `complete` mode.
- Treat GitHub/Jira/Confluence/EAS/OpenClaw actions as external-platform proof: local validators can record readiness but cannot prove live platform state.
- Do not print or commit tokens, credentials, customer app names, bundle IDs, API URLs, or secrets.

## Preflight

Before any mutating Git operation, inspect and report:

- current branch and whether it is `main`;
- dirty worktree and untracked files;
- upstream/remotes and default base branch;
- recent base sync status when available;
- Git identity and GitHub CLI auth status when needed;
- required local evidence paths and applicable gate commands.

If preflight finds unrelated user changes, work with them and do not revert them. If the requested operation would touch unrelated changes, stop and ask for a human decision.

## Modes

### `preflight`

Run only the inspection steps above. Record blockers, unknowns, and required evidence. Do not mutate files, branches, commits, PRs, or issues.

### `start`

Create or switch to a task branch only after confirming the target base and current dirty worktree. Use descriptive branch names that include the work-unit or task identifier when one exists.

### `sync`

Fetch and compare with the base branch. Rebase, merge, or force-push only when the user explicitly requested that operation and the risk is understood. Force-push still requires explicit human approval.

### `commit`

Commit only scoped changes that have matching tests/evidence. Use Conventional Commits. Include only files intended for the task; never stage unrelated user changes just because they are present.

### `pr`

Open or update a PR only after required local checks have run or the result is explicitly BLOCKED. PR text must include summary, tests, evidence paths, reviewer/human-gate status, external-platform proof gaps, and residual risks.

### `review-status`

Read and summarize PR review status, requested changes, unresolved threads, required checks, and approval state. Do not self-approve or mark failed gates as passed.

### `issue`

Read issue context freely when authorized by the task. For issue mutation, require explicit authorization for the specific action and target issue. If authorization is missing, stop with the exact mutation that needs approval.

### `handoff`

Prepare the next actor handoff with branch, PR, evidence paths, blocked gates, reviewer state, issue links, and required human decisions. Do not claim completion.

### `complete`

Confirm final evidence and reviewer state. Report whether the work is ready for human merge, blocked, or needs rework. Do not merge, delete branch, force-push, or close issues in this mode.

## Required Evidence

- For runtime changes: `pnpm run test:runtime`, `pnpm turbo run lint test`, and `pnpm run test:local-harness`.
- For narrow structure checks: `node scripts/test-local-harness.mjs --self-test --stage structure` and `node scripts/test-local-harness.mjs --stage structure --json`.
- For review gates: persist pre-implementation and final reviewer evidence under `.evidence/` or `evals/*/results/`.

If a required command cannot run or fails, report BLOCKED with command output. Do not downgrade required PR gates to best effort.

## Review Routing

- Review-only tasks must route to read-only reviewer behavior and must not trigger write-side Git operations.
- Failed gates route to the relevant gate-fix advisor or owner; accepting failed-gate risk requires the configured human gate.
- Ambiguous approval, issue mutation, force-push, production, privacy, legal, payment, external messaging, or failed-gate risk decisions require human approval before action.
