# xhigh Review Prompt: Runtime Surface Structure Checkpoint 4 Harness Narrowing

You are `wm-implementation-reviewer` in read-only mode.

Review the staged Checkpoint 4 changes for the runtime-surface-structure goal
plan. Previous checkpoints, including Checkpoint 3-F pod-native source-root
move, already received `GO`; do not re-litigate approved prior scope unless the
Checkpoint 4 changes introduce a conflict.

Baseline HEAD:

```text
3551319c01ded8d0996e824699df3953d7b69b92
```

Required goal-plan checkpoint:

```text
Checkpoint 4. Harness narrowing

Purpose:
- local harness remains required only for what it actually verifies.

Direction:
- runtime scripts / .agents / .codex / evals/local-harness changes:
  test:local-harness required
- mobile-app-dev-team/runtime-sources/pod-native-openclaw-skills changes:
  targeted pod-native smoke + test:runtime required
  local harness only if the change also touches Codex runtime
- mobile-app-dev-team/reports changes:
  validate:team-doc + evidence hygiene + diff check
  local harness not-applicable possible
- mobile-app-dev-team/ref-organization changes:
  validate:reference-docs + validate:team-doc
  local harness not-applicable possible

Gate:
- project-environment fixtures update
- quality-gate workflow path detection fixture update
- pnpm run validate:project-environment
- pnpm run test:runtime
- Reviewer checkpoint GO
```

Checkpoint 4 incremental paths:

```text
.github/workflows/quality-gate.yml
PROJECT_ENVIRONMENT.md
REPO_OPERATIONS.md
evals/local-harness/README.md
evals/local-harness/project-environment/fixtures/invalid-quality-gate-missing-evidence-hygiene.json
evals/local-harness/project-environment/fixtures/invalid-quality-gate-missing-local-harness-path.json
evals/local-harness/project-environment/fixtures/invalid-quality-gate-missing-repo-operations.json
evals/local-harness/project-environment/fixtures/invalid-quality-gate-team-doc-broad-trigger.json
scripts/test-local-harness.mjs
scripts/validate-project-environment.mjs
.evidence/reviews/20260616-runtime-surface-structure-checkpoint4-harness-narrowing-command-output.md
```

Note: the repository has many previously staged files from prior checkpoint
reviews. `evals/local-harness/sot/snapshot.json` is already staged from earlier
work and is not part of the Checkpoint 4 incremental scope.

Evidence to review:

```text
.evidence/reviews/20260616-runtime-surface-structure-checkpoint4-harness-narrowing-command-output.md
```

Please verify:

1. The GitHub quality gate still always runs `pnpm run test:runtime` and
   `pnpm turbo run lint test`.
2. The conditional local-harness path regex still catches Codex runtime and
   harness changes: `.agents/**`, `.codex/**`, `evals/local-harness/**`,
   `scripts/lib/**`, selected Codex runtime/harness scripts, workflow YAML,
   root runtime policy files, `package.json`, and `pnpm-lock.yaml`.
3. The conditional local-harness path regex no longer catches by path alone:
   `mobile-app-dev-team/reports/**`,
   `mobile-app-dev-team/ref-organization/**`,
   `mobile-app-dev-team/runtime-sources/pod-native-openclaw-skills/**`,
   `evals/skills/**`, `evals/team-doc-structure/**`, or `docs/plans/**`.
4. `scripts/validate-project-environment.mjs` has fixture-backed positive and
   negative checks for the path classifier and no stale fixture assumptions.
5. `scripts/test-local-harness.mjs` verifies the local-harness README
   applicability contract without weakening existing harness assertions.
6. `PROJECT_ENVIRONMENT.md`, `REPO_OPERATIONS.md`, and
   `evals/local-harness/README.md` describe the same harness applicability
   model.
7. Required evidence exists for RED failures and green gates:
   `pnpm run validate:project-environment`, `pnpm run test:runtime`,
   `pnpm run test:local-harness`, evidence hygiene, and whitespace checks.
8. The checkpoint does not add app/package/API/native/infra behavior changes.

Return a concise findings-first review and a final verdict of `GO` or `NO_GO`.
Use `GO` only if Checkpoint 4 is safe to proceed to Checkpoint 5.
