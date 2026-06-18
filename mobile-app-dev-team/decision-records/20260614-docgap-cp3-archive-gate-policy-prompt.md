# CP-3 Review Request — archive validator gate policy

Mode: final.

Scope: Phase 1 (CP-3) of the doc-gap remediation goal plan. Single documentation change.

Change under review (worktree branch `chore/doc-gap-remediation`, based on HEAD with CP-1/CP-2 already merged):
- `REPO_OPERATIONS.md`: added a paragraph after the existing "Run `validate:team-doc-archive` when changing, moving, archiving..." paragraph, in the "Package Script Composition" area. The new paragraph states that `validate:team-doc-archive` is intentionally a manual, dedicated-trigger gate, deliberately excluded from `test:runtime` and the default CI runtime composition; that `scripts/validate-repo-operations.mjs` fails the build if `test:runtime` includes it; and that archive integrity is enforced by the explicit manual run plus the change-detection filter in `.github/workflows/quality-gate.yml`. It must not become part of `test:runtime`.

Goal of CP-3: resolve the "execution-orphan validator" gap (validate:team-doc-archive was never run by any automated gate and its intentional CI exclusion was undocumented) by documenting the design intent — without violating the test:runtime exclusion trap.

Verify (read-only):
1. The new paragraph is accurate vs the repo: `scripts/validate-repo-operations.mjs` does fail if `test:runtime` includes `validate:team-doc-archive` (check ~lines 78-80), and `package.json` `test:runtime` does NOT include it.
2. The change does not remove any validator-required terminology strings from REPO_OPERATIONS.md (validate-repo-operations.mjs requireTerms must still pass — confirm `pnpm run validate:repo-operations` semantics).
3. The `.github/workflows/quality-gate.yml` change-detection filter actually references `validate-team-doc-archive` (so the integrity-enforcement claim is true).
4. No SoT contradiction: the change is consistent with REPO_OPERATIONS "Package Script Composition" and the Codex-is-SoT model.

Quality gates already run on this change (all PASS / exit 0): `node scripts/validate-repo-operations.mjs`, `node scripts/validate-runtime-artifacts.mjs && node scripts/codex-headless-review.mjs --self-test`, `node scripts/validate-team-doc.mjs`.

Decide GO / NO_GO with a machine-readable verdict envelope.
