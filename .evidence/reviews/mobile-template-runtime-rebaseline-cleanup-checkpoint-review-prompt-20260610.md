# xhigh Review Prompt: Rebaseline Cleanup Checkpoint

Review target:

- `.evidence/reviews/mobile-template-runtime-rebaseline-cleanup-checkpoint-20260610.md`
- Current diff for:
  - `.agents/skills/wm/SKILL.md`
  - `PROJECT_ENVIRONMENT.md`
  - `team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md`
- Current worktree status for root `CLAUDE.md`, `.claude/`, `.claude-state/`

Review question:

After user-approved cleanup of untracked root Claude artifacts and the `$wm` runtime policy sync, is the runtime rebaseline checkpoint acceptable, and may the workflow proceed to PR1 pre-implementation checkpoint planning?

Required checks:

1. Verify root `CLAUDE.md`, `.claude/`, and `.claude-state/` are absent after user-approved cleanup.
2. Verify the first post-cleanup `pnpm run test:runtime` failure is accurately recorded as `$wm` runtime policy drift, not as an app/API implementation failure.
3. Verify `.agents/skills/wm/SKILL.md` now includes material planning decision routing, structured planning sub-agent result fields, skip reason, and write-capable executor delegation prohibition.
4. Verify `PROJECT_ENVIRONMENT.md` now documents the same `$wm` policy and remains a runtime fact document.
5. Verify `pnpm run test:runtime` passed after the policy sync.
6. Verify `pnpm run test:local-harness` passed because `.agents/` and `PROJECT_ENVIRONMENT.md` changed.
7. Verify no PR1~PR7 implementation, PR5 offline implementation, app/API/contract implementation, live EAS/native work, pod rollout, webhook routing, Secret/token provisioning, branch protection, bot account work, platform image work, or multi-pod drill was started in this checkpoint.
8. Verify any current-worktree changes not authored in this checkpoint are identified as concurrent/current-state inputs, not silently claimed as this checkpoint's authored work.

SoT and evidence to consult:

- `AGENTS.md`
- `PROJECT_ENVIRONMENT.md`
- `REPO_OPERATIONS.md`
- `docs/plans/active/20260610-wm-mobile-template-runtime-goal-plan.md`
- `scripts/validate-runtime-artifacts.mjs`
- `.evidence/reviews/mobile-template-runtime-rebaseline-cleanup-checkpoint-20260610.md`

Expected output:

- Findings first, ordered by severity.
- State GO, NO_GO, BLOCKED, or NEEDS_HUMAN for this checkpoint.
- If GO, state the exact next permitted step.
- End with the required JSON envelope.
