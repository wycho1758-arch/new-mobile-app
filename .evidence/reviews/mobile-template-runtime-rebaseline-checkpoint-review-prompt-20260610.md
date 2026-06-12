# xhigh Review Prompt: Runtime Rebaseline Checkpoint

Review target:

- `.evidence/reviews/mobile-template-runtime-rebaseline-checkpoint-20260610.md`
- Current worktree state for `CLAUDE.md`, `.claude/`, `.claude-state`

Review question:

Is it correct to stop before PR1+ implementation because `pnpm run test:runtime` failed on forbidden root Claude runtime artifacts, and should removal of untracked `CLAUDE.md` and `.claude/` require explicit user decision?

Required checks:

1. Verify that the checkpoint accurately records `pnpm run test:runtime` failure.
2. Verify that the failure is caused by root `CLAUDE.md` and `.claude/` artifacts rejected by `scripts/validate-runtime-artifacts.mjs`.
3. Verify that `PROJECT_ENVIRONMENT.md` and repo policy treat root Claude runtime artifacts as outside active Codex runtime.
4. Verify that PR1~PR7 implementation and PR5 offline implementation should not start while runtime rebaseline is red.
5. Verify that deleting untracked root artifacts not created in this checkpoint is a user/worktree ownership decision, not something to do silently.
6. Verify that no app/runtime implementation scope has been started in this checkpoint.

SoT and evidence to consult:

- `.evidence/reviews/mobile-template-runtime-rebaseline-checkpoint-20260610.md`
- `PROJECT_ENVIRONMENT.md`
- `AGENTS.md`
- `REPO_OPERATIONS.md`
- `docs/plans/active/20260610-wm-mobile-template-runtime-goal-plan.md`
- `scripts/validate-runtime-artifacts.mjs`

Expected output:

- Findings first, ordered by severity.
- State GO, NO_GO, BLOCKED, or NEEDS_HUMAN for this checkpoint.
- If NEEDS_HUMAN or BLOCKED, state the exact decision needed.
- End with the required JSON envelope.
