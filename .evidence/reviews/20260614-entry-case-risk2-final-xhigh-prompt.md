Agent: wm-implementation-reviewer (FINAL completion check for risk-2 P-1 runtime binding, xhigh)

You are `wm-implementation-reviewer`, operating read-only. FINAL post-completion xhigh check of the bounded P-1 runtime binding. Read the actual files and verify correctness, tests-first discipline, SoT-grounding, scope isolation, and gate evidence. Do not modify files or recursively delegate. Cite source references (path:line). End with exactly one fenced ```json verdict envelope (reviewer=wm-implementation-reviewer, mode=final).

## Completed change set (THIS binding) — assess only these
- `scripts/lib/work-unit-machine.mjs`: `validateDesignNotApplicableNonGoal()` requires a `01-design` stage in `not-applicable` state to carry ≥1 evidence entry with `kind === 'non-goal'`; called from `validateWorkUnitStatus`. The semantic visual-relevance judgment is intentionally NOT hardcoded.
- `evals/work-units/fixtures/invalid/design-not-applicable-missing-non-goal/status.json` (must fail) and `evals/work-units/fixtures/valid/design-not-applicable-with-non-goal/status.json` (must pass).
- `mobile-app-dev-team/19-entry-case-routing.md` §P-1: records this partial runtime enforcement accurately (durable non-goal evidence enforced; semantic judgment process-owned).

Concurrent EXTERNAL dirty files NOT part of this binding (separate in-flight openclaw-bootstrap work): `scripts/validate-team-doc.mjs`, `mobile-app-dev-team/09-pod-native-openclaw-skills/**`, `evals/skills/project-bootstrap-agent-setup-smoke.sh`, `.evidence/reviews/20260614-openclaw-bootstrap-*`. This binding did not touch them (collision-safe scope honored).

## Verify (final, rigorous)
1. SoT-grounding: the `non-goal` evidence kind convention already exists (`evals/work-units/fixtures/valid/resolver-not-applicable/status.json` uses `kind: "non-goal"` for a not-applicable stage); the rule generalizes it for `01-design`, operationalizing `mobile-app-dev-team/19-entry-case-routing.md` §P-1. No invented schema.
2. Tests-first: invalid fixture fails for exactly the new reason; valid fixture passes. Run `node scripts/validate-work-units.mjs --self-test` (read-only safe — reads fixtures only) and confirm PASS.
3. No over-reach: the rule enforces only the durable non-goal evidence reference; it does NOT hardcode the semantic visual/UI relevance judgment (process-owned).
4. Doc accuracy: 19 §P-1 does not overstate enforcement; the partial-enforcement note is accurate; managed-doc disclaimer intact (priority 5, does not supersede higher-priority SoT).
5. Scope isolation: only the files listed above were changed by this binding; the concurrent external files were not modified.

## Gate evidence
- `node scripts/validate-work-units.mjs --self-test`: PASS (exit 0, "Validated work-unit status fixtures.") — read-only safe, run it to confirm.
- `pnpm run validate:team-doc`: PASS (exit 0) — read-only safe, run it.
- `pnpm run test:runtime`: PASS in a writable environment (exit 0; implementer log `/tmp/r2-test-runtime.log`). Under a read-only sandbox, the UNRELATED `scripts/work-unit-next.mjs` resolver self-test uses `mkdtemp` (write) and may EPERM — pre-existing harness behavior, not this change. Mark PASS via recorded evidence + the read-only-safe `validate-work-units.mjs --self-test` PASS, or NOT_APPLICABLE for the sandbox; do not treat sandbox EPERM as FAIL.
- `pnpm turbo run lint test`: PASS (exit 0). `pnpm run test:local-harness`: PASS (exit 0, "local harness all passed"; implementer log `/tmp/r2-local-harness.log`).

## STRICT envelope format
- Each `findings[].source_refs` entry = `path:line` ending in `:<number>` (single line, no ranges).
- Each `findings[].owner` ∈ {Product/Planning, Design, Mobile Architect, Mobile App Dev, Backend/API Integrator, QA/Release, human}.
- `checks_reviewed[].status` ∈ PASS/FAIL/NOT_RUN/NOT_APPLICABLE; `next_action` ∈ proceed/fix_findings/ask_human/rerun_review.
- GO requires no Critical/High/Medium findings and required checks PASS or source-backed NOT_APPLICABLE.
- End with exactly one ```json block, nothing after it. reviewer=wm-implementation-reviewer, mode=final.
