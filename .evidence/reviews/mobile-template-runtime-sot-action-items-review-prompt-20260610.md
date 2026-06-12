# xhigh Review Prompt: SoT-Based Action Items and boram Pod Delivery Assessment

Review target:

- `.evidence/reviews/mobile-template-runtime-sot-action-items-20260610.md`

Review question:

Is this SoT-based inspection report — its repo-state claims, boram pod measurement, categorized action items (A: repo PR train, B: boram pod delivery, C: platform/ops, D: hygiene), and execution order — consistent with the SoT and the approved doc 13 execution path, and acceptable as the planning basis for the next steps it names?

Required checks:

1. Verify the report's repo-state claims match the SoT: Phase 0 rebaseline GO, PR1–PR7 approved but unimplemented, next permitted step = PR1 pre-implementation checkpoint planning.
2. Verify Category A ordering (PR1 → PR2 → PR3 → PR4, then PR5–PR7 as P1) matches doc 13 Part E and does not skip or reorder the approved train.
3. Verify Category B actions do not violate repo constraints: no hardcoded customer values, Codex-only repo work policy (CODEX_MANAGED_PATHS registration before Codex-managed work), no secrets committed to the repo, pod changes deferred to action items (none executed in this checkpoint).
4. Verify the boram pod measurements cited (pnpm 10.33.3 vs SoT 9.15.9, missing WM_ROLE, missing repo clone, codex CLI + hooks + codex-cli-auth-setup skill present, CODEX_MANAGED_PATHS.md empty) are internally consistent with gap G9 and the doc 09/11 delivery patterns referenced.
5. Verify the report keeps B5/B6 (pod-role-bootstrap delivery, in-pod gate smoke) sequenced after PR4 (A4), not before.
6. Verify the report does not claim any implementation, pod mutation, secret provisioning, or platform work was performed in this checkpoint, and that it classifies pre-existing dirty-worktree entries as concurrent inputs.
7. Verify the Serena deviation (file-based inspection instead of serena MCP) is explicitly recorded and does not misrepresent the method.
8. Verify the execution order summary is dependency-correct (D0/D first; B1–B4 parallel to A; B5–B6 gated on A4; C and PR5–PR7 as P1).
9. Verify the report's record of the currently failing `pnpm run test:runtime` gate is accurate against the worktree (uncommitted extension of `scripts/validate-repo-operations.mjs` enforcing 6 requirements not yet satisfied by `package.json`, `scripts/validate-runtime-artifacts.mjs`, `evals/local-harness/README.md`), that the failure is attributed to the in-flight Confluence-decoupling slice rather than this inspection, and that D0 correctly blocks the PR train until the gate is green.

SoT and evidence to consult:

- `AGENTS.md`
- `PROJECT_ENVIRONMENT.md`
- `REPO_OPERATIONS.md`
- `team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md`
- `team-doc/mobile-app-dev-team/00-sot-and-principles.md`
- `team-doc/mobile-app-dev-team/09-pod-native-openclaw-skill-plan.md`
- `team-doc/mobile-app-dev-team/11-openclaw-codex-completion-hooks-plan.md`
- `docs/plans/active/20260610-wm-mobile-template-runtime-goal-plan.md`
- `docs/plans/active/20260610-pr1-work-unit-status-machine-preimplementation-plan.md`
- `infra/clawpod/secret.example.yaml`
- `.evidence/reviews/mobile-template-runtime-rebaseline-cleanup-checkpoint-xhigh-final-rereview2-20260610.md`

Note: the boram pod live measurements (kubectl/exec outputs) are session observations recorded in the review target; they cannot be re-queried by the reviewer and should be assessed for internal consistency and SoT alignment, not re-measured.

Expected output:

- Findings first, ordered by severity.
- State GO, NO_GO, BLOCKED, or NEEDS_HUMAN for this report as a planning basis.
- If GO, state the exact next permitted step.
- End with the wm-implementation-reviewer JSON envelope (verdict, reviewer, mode, scope, findings, checks_reviewed, residual_risks, next_action).
