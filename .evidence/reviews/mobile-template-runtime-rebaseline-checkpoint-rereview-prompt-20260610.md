# xhigh Re-Review Prompt: Runtime Rebaseline Checkpoint

Review target:

- `.evidence/reviews/mobile-template-runtime-rebaseline-checkpoint-20260610.md`
- Current worktree state for `CLAUDE.md`, `.claude/`, `.claude-state`

Reason for re-review:

The prior xhigh review correctly identified the runtime rebaseline as red, but its JSON envelope used an unsupported owner value. For this re-review, if the finding concerns the decision to remove or keep untracked root Claude artifacts, set the finding owner to exactly `human`.

Review question:

Is it correct to stop before PR1+ implementation because `pnpm run test:runtime` failed on forbidden root Claude runtime artifacts, and should removal of untracked `CLAUDE.md` and `.claude/` require explicit user decision?

Required checks:

1. Verify that the checkpoint accurately records `pnpm run test:runtime` failure.
2. Verify that the failure is caused by root `CLAUDE.md` and `.claude/` artifacts rejected by `scripts/validate-runtime-artifacts.mjs`.
3. Verify that `PROJECT_ENVIRONMENT.md` and repo policy treat root Claude runtime artifacts as outside active Codex runtime.
4. Verify that PR1~PR7 implementation and PR5 offline implementation should not start while runtime rebaseline is red.
5. Verify that deleting untracked root artifacts not created in this checkpoint is a user/worktree ownership decision, not something to do silently.
6. Verify that no app/runtime implementation scope has been started in this checkpoint.

Valid owner values for findings:

- Product/Planning
- Design
- Mobile Architect
- Mobile App Dev
- Backend/API Integrator
- QA/Release
- human

Expected output:

- Findings first, ordered by severity.
- State GO, NO_GO, BLOCKED, or NEEDS_HUMAN for this checkpoint.
- Because the decision is whether the user approves cleanup of untracked root artifacts, use `NEEDS_HUMAN` if that is the correct next state.
- End with the required JSON envelope.
