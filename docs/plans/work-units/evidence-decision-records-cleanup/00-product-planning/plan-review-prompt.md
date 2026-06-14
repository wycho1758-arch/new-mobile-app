# Plan Review Prompt

Review `docs/plans/work-units/evidence-decision-records-cleanup/00-product-planning/task-packet.md`.

User request:

- Move the four currently tracked `.evidence` decision records to `mobile-app-dev-team/decision-records/`.
- Update active SoT references.
- Add cleanup validator coverage.
- Avoid reset or force-push.
- Avoid touching the other dirty worktree.
- Proceed only if the plan is sound.

Review focus:

- Product/Planning scope and readiness.
- SoT grounding.
- Human-gate impact.
- Reviewer routing.
- Tests/evidence plan.
- Whether implementation is safe from the isolated `origin/main` worktree.

Return findings-first prose and exactly one JSON reviewer envelope.
