# Mobile Template Runtime Rebaseline Cleanup Checkpoint

Date: 2026-06-10

## Scope

This checkpoint resumes after the user approved deleting untracked root Claude runtime artifacts.

It covers:

- Removing approved untracked root `CLAUDE.md` and `.claude/`.
- Rerunning runtime gate rebaseline.
- Fixing the `$wm` runtime policy drift surfaced by the current `scripts/validate-runtime-artifacts.mjs`.
- Running the required local harness because `.agents/skills/wm/SKILL.md` and `PROJECT_ENVIRONMENT.md` changed.

It does not start PR1~PR7 implementation or PR5 offline implementation.

## Approved Cleanup

User approved deleting untracked root Claude artifacts.

Command:

```text
rm -rf CLAUDE.md .claude && git status --short -- CLAUDE.md .claude .claude-state && find . -maxdepth 2 \( -name 'CLAUDE.md' -o -name '.claude' -o -name '.claude-state' \) -print
```

Result:

```text
exit 0, no output
```

Meaning:

- Root `CLAUDE.md` absent.
- Root `.claude/` absent.
- Root `.claude-state/` absent.

## First Runtime Rebaseline After Cleanup

Command:

```text
pnpm run test:runtime
```

Result:

```text
exit 1
```

Failure:

```text
- wm skill must define material planning decision routing
- wm skill must require structured planning sub-agent result fields
- wm skill must require a skip reason when planning sub-agent routing is not practical
- wm skill must forbid write-capable executor delegation
- PROJECT_ENVIRONMENT.md must forbid write-capable executor delegation
```

Interpretation:

- The root Claude artifact blocker was resolved.
- The next runtime gate failure was `$wm` runtime policy drift against the current validator.

## Runtime Policy Fix

Files intentionally updated in this checkpoint:

- `.agents/skills/wm/SKILL.md`
- `PROJECT_ENVIRONMENT.md`

Changes:

- Added `$wm` material planning decision routing to read-only planning/reviewer/researcher/gate-advisor agents when practical.
- Required structured planning sub-agent result fields: agent, question, conclusion, source refs or evidence path, and reflection/impact.
- Required a skip reason when planning sub-agent routing is not practical.
- Forbid implementation/fix delegation to a write-capable executor.
- Synchronized the same policy into `PROJECT_ENVIRONMENT.md`.

Related current-worktree validator/eval/doc changes observed but not authored in this checkpoint:

- `scripts/validate-runtime-artifacts.mjs`
- `evals/skills/wm/positive.prompt.md`
- `evals/skills/wm/write-executor-negative.prompt.md`
- `docs/confluence/20260608-codex-expo-rn-runtime-sot-update.md`
- `team-doc/mobile-app-dev-team/05-work-processes.md`
- `team-doc/mobile-app-dev-team/06-gates-and-evidence.md`

These current-worktree changes define or mirror the stricter `$wm` routing/evidence expectations that the runtime policy fix satisfies. They are treated as current-state inputs for this checkpoint, not as implementation work completed by this checkpoint.

Same-file authorship note:

- `.agents/skills/wm/SKILL.md` is intentionally touched in this checkpoint to satisfy the runtime policy drift.
- Its current total diff is larger than the two policy bullets added during this checkpoint because the worktree also contains current routing-policy edits from another active session. This checkpoint does not revert or re-author those lines; it validates that the resulting current file satisfies the active runtime gate.

## Passing Runtime Gate

Command:

```text
pnpm run test:runtime
```

Result:

```text
exit 0
```

Observed summary:

```text
Validated 11 skills, 13 agents, and 4 hook events.
Codex headless review helper self-test passed.
Validated repo operations policy ownership.
Validated current team-doc managed docs.
Passed 44 hook fixture tests.
```

## Required Local Harness Gate

Because `.agents/skills/wm/SKILL.md` and `PROJECT_ENVIRONMENT.md` changed, local harness was required.

Command:

```text
pnpm run test:local-harness
```

Result:

```text
exit 0
```

Observed summary:

```text
clean-tree-guard self-test passed
codex-preflight self-test passed
codex-preflight accepted /opt/homebrew/bin/codex (codex-cli 0.137.0)
Validated 11 skills, 13 agents, and 4 hook events.
Codex headless review helper self-test passed.
Validated repo operations policy ownership.
Validated current team-doc managed docs.
Passed 44 hook fixture tests.
Tasks: 6 successful, 6 total
self-test all passed
local harness all passed
```

## Latest Recheck After Concurrent HEAD Move

During xhigh rereview, a concurrent session advanced HEAD to:

```text
fbc72c4ecd651971ad351ee6e5ca1af4789fbdc9
fbc72c4 chore: route wm planning through read-only agents
```

The checkpoint was rechecked against that current HEAD.

Command:

```text
pnpm run test:runtime
```

Result:

```text
exit 0
```

Observed summary:

```text
Validated 11 skills, 13 agents, and 4 hook events.
Codex headless review helper self-test passed.
Validated repo operations policy ownership.
Validated current team-doc managed docs.
Passed 44 hook fixture tests.
```

Command:

```text
pnpm run test:local-harness
```

Result:

```text
exit 0
```

Observed summary:

```text
clean-tree-guard self-test passed
codex-preflight self-test passed
codex-preflight accepted /opt/homebrew/bin/codex (codex-cli 0.137.0)
Validated 11 skills, 13 agents, and 4 hook events.
Codex headless review helper self-test passed.
Validated repo operations policy ownership.
Validated current team-doc managed docs.
Passed 44 hook fixture tests.
Tasks: 6 successful, 6 total
self-test all passed
local harness all passed
```

## Current Status And Bounds

Allowed to consider next after xhigh checkpoint GO:

- PR1 pre-implementation checkpoint planning for work-unit status machine.

Still not started in this checkpoint:

- PR1~PR7 implementation.
- PR5 offline implementation.
- live EAS/native work.
- pod rollout.
- webhook routing.
- Secret/token provisioning.
- branch protection.
- bot account work.
- platform image work.
- multi-pod drills.

## Material Diff Summary

Tracked intentional direct edits in this checkpoint:

```text
.agents/skills/wm/SKILL.md                                              policy bullets added for material planning routing and write-capable executor prohibition
PROJECT_ENVIRONMENT.md                                                  matching policy bullets added for $wm runtime SoT
team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md earlier Phase 0 stale citation fix
```

The `13-pod-organization-e2e-improvement-plan.md` change is the earlier Phase 0 stale citation fix.

No app, API, contract, native, external platform, or live EAS implementation was changed by this checkpoint.

## Current Worktree Classification

Current `git status --short` is intentionally classified here so later review does not confuse concurrent or earlier work with this checkpoint.

Checkpoint-authored or checkpoint-generated:

- `.agents/skills/wm/SKILL.md` — checkpoint policy fix in a file that also has concurrent/current routing-policy edits.
- `PROJECT_ENVIRONMENT.md` — checkpoint policy sync.
- `.evidence/reviews/mobile-template-runtime-rebaseline-cleanup-checkpoint-20260610.md` — this checkpoint record.
- `.evidence/reviews/mobile-template-runtime-rebaseline-cleanup-checkpoint-review-prompt-20260610.md` — checkpoint review prompt.
- `.evidence/reviews/mobile-template-runtime-rebaseline-cleanup-checkpoint-xhigh-20260610.md` — first checkpoint review attempt; reviewer returned NO_GO and the helper rejected the JSON envelope because a `source_refs` entry was command-based instead of `path:line`.
- `.evidence/reviews/mobile-template-runtime-rebaseline-cleanup-checkpoint-rereview-prompt-20260610.md` — checkpoint rereview prompt.
- `.evidence/reviews/mobile-template-runtime-rebaseline-cleanup-checkpoint-xhigh-rereview-20260610.md` — checkpoint rereview output.
- `.evidence/reviews/mobile-template-runtime-rebaseline-cleanup-checkpoint-xhigh-rereview-20260610.json` — checkpoint rereview JSON envelope.
- Any later `.evidence/reviews/mobile-template-runtime-rebaseline-cleanup-checkpoint-*-20260610.{md,json}` prompt or reviewer output created while closing this same checkpoint is checkpoint-generated evidence, not PR1+ implementation.

Earlier in this goal, not new PR1+ implementation:

- `docs/plans/active/20260610-wm-mobile-template-runtime-goal-plan.md` — accepted goal plan.
- `.evidence/reviews/mobile-template-runtime-goal-plan-review-prompt-20260610.md`
- `.evidence/reviews/mobile-template-runtime-goal-plan-xhigh-20260610.md`
- `.evidence/reviews/mobile-template-runtime-goal-plan-xhigh-20260610.json`
- `.evidence/reviews/mobile-template-runtime-phase0-checkpoint-20260610.md`
- `.evidence/reviews/mobile-template-runtime-phase0-checkpoint-review-prompt-20260610.md`
- `.evidence/reviews/mobile-template-runtime-phase0-checkpoint-xhigh-20260610.md`
- `.evidence/reviews/mobile-template-runtime-phase0-checkpoint-xhigh-20260610.json`
- `.evidence/reviews/mobile-template-runtime-rebaseline-checkpoint-20260610.md`
- `.evidence/reviews/mobile-template-runtime-rebaseline-checkpoint-review-prompt-20260610.md`
- `.evidence/reviews/mobile-template-runtime-rebaseline-checkpoint-xhigh-20260610.md`
- `.evidence/reviews/mobile-template-runtime-rebaseline-checkpoint-rereview-prompt-20260610.md`
- `.evidence/reviews/mobile-template-runtime-rebaseline-checkpoint-xhigh-rereview-20260610.md`
- `.evidence/reviews/mobile-template-runtime-rebaseline-checkpoint-xhigh-rereview-20260610.json`

Observed current-worktree inputs not authored in this checkpoint:

- `scripts/validate-runtime-artifacts.mjs`
- `evals/skills/wm/positive.prompt.md`
- `evals/skills/wm/write-executor-negative.prompt.md`
- `docs/confluence/20260608-codex-expo-rn-runtime-sot-update.md`
- `team-doc/mobile-app-dev-team/05-work-processes.md`
- `team-doc/mobile-app-dev-team/06-gates-and-evidence.md`
- `docs/plans/active/20260610-mobile-app-dev-team-root-migration-plan.md`
- `.evidence/reviews/mobile-app-dev-team-root-migration-phase0-baseline-20260610.md`
- `.evidence/reviews/mobile-app-dev-team-root-migration-phase1-archive-readiness-20260610.md`
- `.evidence/reviews/mobile-app-dev-team-root-migration-plan-high-review-20260610.md`
- `.evidence/reviews/mobile-app-dev-team-root-migration-confluence-scope-xhigh-20260610.md`
- Any later `.evidence/reviews/mobile-app-dev-team-root-migration-*-20260610.{md,json}` file produced by the concurrent root-migration session is an observed current-worktree input, not this checkpoint's implementation.
- `.evidence/reviews/wm-subagent-routing-final-review-20260610.md`
- `.evidence/reviews/wm-subagent-routing-final-review-20260610.json`

Concurrent commit observed during checkpoint review:

- HEAD moved to `fbc72c4ecd651971ad351ee6e5ca1af4789fbdc9` (`chore: route wm planning through read-only agents`) while xhigh was reviewing this checkpoint.
- After that commit, `.agents/skills/wm/SKILL.md` and `PROJECT_ENVIRONMENT.md` policy sync no longer appear as uncommitted worktree diff, but their required policy text is present in current HEAD.
- Before PR packaging or PR1 implementation, rerun final status/gate checks against the then-current HEAD; do not assume the earlier dirty-worktree shape still applies.

Deleted after explicit user approval:

- root `CLAUDE.md`
- root `.claude/`

Still absent / no untracked root runtime artifact after cleanup:

- root `CLAUDE.md`
- root `.claude/`
- root `.claude-state/`
