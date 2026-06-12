# Mobile Template Runtime Runtime Rebaseline Checkpoint

Date: 2026-06-10

## Scope

Runtime gate rebaseline after Phase 0.

This checkpoint follows the Phase 0 xhigh GO and tests whether PR1+ implementation can start.

## Command

```text
pnpm run test:runtime
```

## Result

```text
exit 1
```

Observed output:

```text
> mobile-app-template@ test:runtime /Users/tw.kim/Documents/AGA/test/new-mobile-app
> pnpm run validate && pnpm run validate:repo-operations && pnpm run validate:team-doc && pnpm run test:hooks

> mobile-app-template@ validate /Users/tw.kim/Documents/AGA/test/new-mobile-app
> node -e "require('node:fs').rmSync('.claude-state', { recursive: true, force: true })" && node scripts/validate-runtime-artifacts.mjs && node scripts/codex-headless-review.mjs --self-test

- root Claude runtime artifact must not be present: CLAUDE.md
- root Claude runtime artifact must not be present: .claude
ELIFECYCLE Command failed with exit code 1.
ELIFECYCLE Command failed with exit code 1.
```

## Current Worktree Evidence

Command:

```text
git status --short -- CLAUDE.md .claude .claude-state
```

Observed output:

```text
?? .claude/
?? CLAUDE.md
```

Command:

```text
ls -ld CLAUDE.md .claude .claude-state 2>/dev/null
```

Observed output:

```text
drwxr-xr-x  3 tw.kim  staff   96 Jun 10 21:01 .claude
-rw-r--r--  1 tw.kim  staff  378 Jun 10 21:01 CLAUDE.md
```

## SoT Context

`PROJECT_ENVIRONMENT.md` states that root Claude runtime artifacts are not part of the active Codex runtime and that `scripts/validate-runtime-artifacts.mjs` rejects those root paths.

`scripts/validate-runtime-artifacts.mjs` defines the forbidden root runtime artifacts as:

```text
CLAUDE.md
.claude
.claude-state
```

The runtime gate itself removed `.claude-state` before validation, but `CLAUDE.md` and `.claude/` remain present and untracked.

## Decision Point

PR1+ implementation is not allowed to start while this gate is red.

The immediate technical fix appears to be removing the root `CLAUDE.md` and `.claude/` artifacts. However, they are untracked files/directories that were not created by this checkpoint, so deleting them is a user/worktree ownership decision.

## Current Decision

Stop before PR1 implementation and ask for an explicit decision:

- Approve removal of root `CLAUDE.md` and `.claude/`, then rerun `pnpm run test:runtime`.
- Or keep those artifacts, in which case PR1+ implementation remains blocked by the runtime gate.

No PR1~PR7 implementation, PR5 offline implementation, live EAS/native work, pod rollout, webhook routing, Secret/token provisioning, branch protection, bot account work, platform image work, or multi-pod drill was started in this checkpoint.
