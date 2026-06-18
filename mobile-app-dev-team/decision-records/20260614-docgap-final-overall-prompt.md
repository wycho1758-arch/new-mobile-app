# Final Overall Review — doc-gap remediation (CP-3 + CP-4 2A/2B/2C)

Mode: final.

Scope: the entire branch `chore/doc-gap-remediation` (base `c18f032`, which already contains CP-1/CP-2). Review the full integrated diff `c18f032..HEAD` (4 commits, 22 files, +623), not a single phase. This is the requested final overall reviewer pass after all checkpoints were individually approved.

Commits under review:
- `23fe6a5` CP-3: REPO_OPERATIONS.md documents `validate:team-doc-archive` as an intentional manual-only gate (excluded from test:runtime; no automated gate runs it; integrity enforced by manual run).
- `bd18fb7` CP-4 2A: REPO_OPERATIONS.md "Plan Lifecycle" section (G4) + references/sot.md optional-convention note (G8); AGENTS.md terminology forward-reference (G7).
- `ef96d82` CP-4 2B: new evals — evals/skills/wm-orchestrate/ (positive/negative/review-only-negative), evals/agents/wm-docs-researcher/ + wm-gate-fix-advisor/ (advisory), evals/hooks/COVERAGE.md (G3/G9).
- `9b32f8b` CP-4 2C: READMEs for apps/api, packages/contracts, infra, infra/clawpod.

Context / constraints to enforce:
- Codex (.agents/skills, .codex/agents) is runtime SoT; Claude (.claude/) is a deferred port. Policy precedence AGENTS.md > PROJECT_ENVIRONMENT.md > REPO_OPERATIONS.md > role/team docs.
- Validators must stay green; `validate:team-doc-archive` must NOT be added to `test:runtime` (validate-repo-operations.mjs trap). Required terminology strings in REPO_OPERATIONS.md/AGENTS.md must be preserved.

Review for: (1) cross-checkpoint consistency and any contradiction introduced across the four commits together; (2) any remaining factual inaccuracy vs the repo (env vars, hook coverage, package names, file references, gate composition claims); (3) SoT soundness (no validator weakened, no forbidden coupling, no over-claim); (4) whether the four checkpoints collectively and correctly resolve CP-3 + gaps G3/G4/G7/G8/G9 without scope creep into the rejected items (mobile-* agent deletion, design-references deletion, docs/plans/active archival, G5 confluence header).

Gates run on the integrated final state (all PASS / exit 0): validate, validate:repo-operations, validate:team-doc, validate:project-environment, validate:evidence-hygiene, test:hooks, test-local-harness --stage all, validate:team-doc-archive. In addition, the FULL `pnpm run test:local-harness` was run end-to-end in this worktree (after a real `pnpm install`) and PASSED (exit 0) — this composes `pnpm run test:runtime` AND `pnpm turbo run lint test` (turbo: 7/7 tasks successful; apps/mobile jest 5/5 passed; packages/contracts tests passed) plus the local-harness preflight, self-test, and `--stage all`. So both the required PR gates `pnpm turbo run lint test` and `pnpm run test:local-harness` are evidenced as passing for these runtime-path (evals/) changes.

Decide GO / NO_GO for the whole branch with a machine-readable verdict envelope.
