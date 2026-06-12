# xhigh Review Prompt: PR1 Work-Unit Status Machine Preimplementation Plan

Review target:

- `docs/plans/active/20260610-pr1-work-unit-status-machine-preimplementation-plan.md`
- `.evidence/reviews/pr1-work-unit-status-machine-preimplementation-checkpoint-20260610.md`
- Current repo SoT and current worktree status

Review question:

Is this PR1 preimplementation plan acceptable for proceeding to tests-first implementation of the work-unit status machine, and does it stay aligned with the mobile app template runtime goal rather than drifting into customer-app, PR2/PR3, native/live, or external platform work?

Required checks:

1. Verify the plan is SoT-grounded against `AGENTS.md`, `PROJECT_ENVIRONMENT.md`, `REPO_OPERATIONS.md`, `team-doc/mobile-app-dev-team/05-work-processes.md`, `team-doc/mobile-app-dev-team/06-gates-and-evidence.md`, `team-doc/mobile-app-dev-team/10-github-artifact-workflow.md`, and `docs/plans/active/20260610-wm-mobile-template-runtime-goal-plan.md`.
2. Verify the plan is only PR1 preimplementation planning and does not start implementation.
3. Verify the proposed PR1 scope is limited to a passive `wu-status/v1` validator/status machine and sample status artifact.
4. Verify the plan keeps PR2 human-gate envelope, PR3 next-action resolver/orchestration, PR5 evidence ladder, native/live/EAS/pod/external platform work, and customer-specific app identity out of PR1.
5. Verify the TDD plan is adequate: valid fixture, invalid schema, work_unit_id mismatch, illegal transition, missing reviewer envelope, Gatekeeper misuse, append-only event violation, and ignored evidence path.
6. Verify role and Gatekeeper boundaries are preserved: no Gatekeeper LLM/custom-agent/SOUL/human-approver modeling, no self-approval, no write-capable executor delegation.
7. Verify planned gates are adequate before implementation can be called done: validator self-test, invalid fixture failures, `pnpm run test:runtime`, `pnpm run test:local-harness`, `pnpm turbo run lint test` before PR packaging, and final actual-work xhigh review.
8. Verify current dirty worktree/concurrent evidence is treated as PR packaging risk, not as proof that PR1 implementation is already started.

Expected output:

- Findings first, ordered by severity.
- State GO, NO_GO, BLOCKED, or NEEDS_HUMAN.
- If GO, state the exact next permitted step.
- End with exactly one JSON envelope.
- In JSON `findings[*].source_refs`, use only `path:line` strings.
