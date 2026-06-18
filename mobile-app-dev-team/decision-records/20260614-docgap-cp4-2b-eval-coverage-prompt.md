# CP-4 Phase 2B Review Request — eval coverage (G3 / G9)

Mode: final.

Scope: Phase 2B of the doc-gap remediation goal plan (worktree branch `chore/doc-gap-remediation`, on top of CP-3 + CP-4 2A). Additive eval coverage only — new files, no edits to existing code/validators:

- `evals/skills/wm-orchestrate/` — positive.prompt.md (contains `$wm-orchestrate`), negative.prompt.md (no `$wm-orchestrate`), review-only-negative.prompt.md (no `$wm-orchestrate`, contains "Review" and "Do not edit").
- `evals/agents/wm-docs-researcher/` — positive.prompt.md (read-only research), negative.prompt.md (mutation task). Advisory agent pattern (no verdict envelope).
- `evals/agents/wm-gate-fix-advisor/` — positive.prompt.md, negative.prompt.md. Advisory agent pattern.
- `evals/hooks/COVERAGE.md` — informational map of the 5 hooks (event, enforcement vs informational, allow/deny coverage), noting the two informational hooks intentionally have no deny coverage.

Goal: close coverage gap G3 (wm-orchestrate + advisory wm-* agents had no eval dirs) and G9 (no hooks coverage doc) without changing validators.

Verify (read-only):
1. The wm-orchestrate fixtures satisfy the conditional checks in `scripts/validate-runtime-artifacts.mjs` (positive must contain `$wm-orchestrate`; negative and review-only-negative must not; review-only-negative must match /review/i and /do not edit/i).
2. The advisory-agent fixtures match the existing po-docs-researcher / design-researcher convention and do NOT introduce verdict-envelope language (advisory agents must not produce verdicts).
3. Adding these new eval dirs requires no registry/snapshot/manifest change (confirm nothing enumerates evals/skills or evals/agents requiring registration).
4. `evals/hooks/COVERAGE.md` is factually accurate vs `.codex/hooks/` (5 hooks + shared.mjs util), `.codex/hooks.json` event wiring, and `scripts/test-hooks.mjs`. The "informational hooks have no deny coverage by design" claim is correct.

Quality gates already run (all PASS / exit 0): validate (runtime-artifacts + codex self-test), `test-local-harness --stage all`, `test:hooks`, `validate:team-doc`, `validate:evidence-hygiene`.

Decide GO / NO_GO with a machine-readable verdict envelope.
