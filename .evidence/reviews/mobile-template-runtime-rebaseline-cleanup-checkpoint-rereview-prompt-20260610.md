# xhigh Rereview Prompt: Rebaseline Cleanup Checkpoint

Review target:

- `.evidence/reviews/mobile-template-runtime-rebaseline-cleanup-checkpoint-20260610.md`
- Current worktree status
- Current diff for:
  - `.agents/skills/wm/SKILL.md`
  - `PROJECT_ENVIRONMENT.md`
  - `team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md`

Prior review result:

- First xhigh review returned `NO_GO` because the checkpoint evidence did not classify every current-worktree change as checkpoint-authored, earlier-goal work, or concurrent/current-state input.
- The checkpoint evidence has now been updated with `Current Worktree Classification`.

Review question:

After user-approved cleanup of untracked root Claude artifacts, `$wm` runtime policy sync, passing `pnpm run test:runtime`, passing `pnpm run test:local-harness`, and updated worktree classification, is this runtime rebaseline cleanup checkpoint acceptable, and may the workflow proceed only to PR1 pre-implementation checkpoint planning?

Required checks:

1. Verify root `CLAUDE.md`, `.claude/`, and `.claude-state/` are absent after user-approved cleanup.
2. Verify the first post-cleanup `pnpm run test:runtime` failure is accurately recorded as `$wm` runtime policy drift, not as an app/API implementation failure.
3. Verify `.agents/skills/wm/SKILL.md` and `PROJECT_ENVIRONMENT.md` include the required material planning routing, structured result fields, skip reason, and write-capable executor prohibition.
4. Verify the checkpoint records passing `pnpm run test:runtime` and `pnpm run test:local-harness`.
5. Verify no PR1~PR7 implementation, PR5 offline implementation, app/API/contract implementation, live EAS/native work, pod rollout, webhook routing, Secret/token provisioning, branch protection, bot account work, platform image work, or multi-pod drill was started in this checkpoint.
6. Verify all current-worktree changes visible in `git status --short` are classified as checkpoint-authored/generated, earlier-goal work, observed current-worktree inputs, or approved deletion.
7. If remaining out-of-scope changes are present, distinguish PR packaging risk from checkpoint acceptability.

SoT and evidence to consult:

- `AGENTS.md`
- `PROJECT_ENVIRONMENT.md`
- `REPO_OPERATIONS.md`
- `docs/plans/active/20260610-wm-mobile-template-runtime-goal-plan.md`
- `scripts/validate-runtime-artifacts.mjs`
- `.evidence/reviews/mobile-template-runtime-rebaseline-cleanup-checkpoint-20260610.md`
- `.evidence/reviews/mobile-template-runtime-rebaseline-cleanup-checkpoint-xhigh-20260610.md`

Expected output:

- Findings first, ordered by severity.
- State GO, NO_GO, BLOCKED, or NEEDS_HUMAN for this checkpoint.
- If GO, state the exact next permitted step.
- End with the required JSON envelope.
- In JSON `findings[*].source_refs`, use only `path:line` strings. Put command-only evidence under `checks_reviewed[*].evidence` instead.
