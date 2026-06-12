# PR2 Human-Gate Envelope Implementation Review Prompt

You are reviewer(xhigh) for the WonderMove mobile app template runtime repo.

Review target:

- Implementation checkpoint: `.evidence/reviews/pr2-human-gate-envelope-implementation-checkpoint-20260610.md`
- Preimplementation GO: `.evidence/reviews/pr2-human-gate-envelope-preimplementation-xhigh-20260610.md`
- Current git diff from `e2eb31d`

Review scope:

- PR2 implementation only.
- Validate whether the implementation stays inside the approved repo-internal PR2 scope.
- Do not approve PR3/PR4/PR5/PR6/PR7, live EAS, pod, webhook, Secret/token, branch protection, mobile-mcp, or live Confluence publish work.

SoT to check:

- `AGENTS.md`
- `PROJECT_ENVIRONMENT.md`
- `REPO_OPERATIONS.md`
- `team-doc/mobile-app-dev-team/06-gates-and-evidence.md`
- `team-doc/mobile-app-dev-team/10-github-artifact-workflow.md`
- `team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md`
- `docs/plans/work-units/README.md`
- `scripts/lib/work-unit-machine.mjs`
- `scripts/validate-work-units.mjs`
- `evals/work-units/fixtures/**`

Commands already run:

- `node scripts/validate-work-units.mjs --self-test`: pass after RED was observed before implementation.
- `node scripts/validate-work-units.mjs`: pass.
- `node scripts/validate-team-doc.mjs`: pass.
- `pnpm run test:runtime`: pass.
- `pnpm run test:local-harness`: pass, including `pnpm turbo run lint test`.
- `git diff --check`: pass.

Review questions:

1. Does the implementation satisfy PR2 `human-gate/v1` acceptance without exceeding scope?
2. Are tests/eval fixtures sufficient for approved, rejected, deferred, agent approver, unknown category, failed-gate-risk missing reference, missing decision reference, ignored/path traversal evidence, missing decision file, and blocked-human resume without approval?
3. Does the implementation preserve human authority and deterministic Gatekeeper boundaries?
4. Are Confluence/live platform boundaries correctly preserved?
5. Are there any Critical, High, or Medium findings that block committing this PR2 implementation?

Return findings first and exactly one JSON reviewer envelope at the end.

Envelope constraint: every `findings[].source_refs[]` entry must be a local `path:line` string only. Put command output or non-path context in `checks_reviewed[].evidence` or `residual_risks`.

