# Risk-2 P-1 runtime-binding gate review

You are `wm-implementation-reviewer`, operating read-only. Review this bounded runtime binding against the repo SoT. Emit exactly one fenced ```json verdict envelope; mode=final.

## Change under review (collision-safe surface only)
1. `scripts/lib/work-unit-machine.mjs`: added `validateDesignNotApplicableNonGoal()` and called it in `validateWorkUnitStatus`. Rule: a `01-design` stage in `not-applicable` state must carry at least one evidence entry with `kind === 'non-goal'`. The semantic relevance judgment is intentionally NOT hardcoded.
2. New fixtures: `evals/work-units/fixtures/invalid/design-not-applicable-missing-non-goal/status.json` (01-design not-applicable, evidence kind `design-artifact`, must FAIL) and `evals/work-units/fixtures/valid/design-not-applicable-with-non-goal/status.json` (same but `non-goal` kind, must PASS).
3. `mobile-app-dev-team/19-entry-case-routing.md` §P-1: updated to record this partial runtime enforcement (durable `non-goal` evidence enforced; semantic judgment process-owned).

Scope was pre-approved by a `wm-implementation-reviewer` (xhigh) decision at `.evidence/reviews/20260614-entry-case-risk2-runtime-binding-decision.md` (GO): proceed only with this one collision-safe P-1 binding; do NOT touch `scripts/validate-team-doc.mjs` or `mobile-app-dev-team/09-pod-native-openclaw-skills/**` (under active concurrent edit).

## Verify
1. SoT-grounding: the `non-goal` evidence kind is the existing convention — `evals/work-units/fixtures/valid/resolver-not-applicable/status.json` already uses `kind: "non-goal"` for a not-applicable stage. The rule generalizes that for `01-design`, operationalizing 19 §P-1. No invented schema.
2. Tests-first: the two fixtures were added; self-test was RED before the rule (invalid fixture "unexpectedly passed") and GREEN after. Confirm the invalid fixture fails for exactly the new reason and the valid fixture passes.
3. Collision-safety: only `scripts/lib/work-unit-machine.mjs`, the two fixtures, and `19-entry-case-routing.md` were changed; `scripts/validate-team-doc.mjs` and `09-pod-*` (concurrent work) were NOT touched.
4. No over-reach: the rule does not hardcode the semantic visual-relevance judgment (process-owned); it only requires a durable non-goal evidence reference.
5. Doc accuracy: 19 §P-1 does not overstate enforcement (only the deterministic slice is claimed enforced).

## Exact scope of THIS change set (shared tree has concurrent external work — assess ONLY these)
Files changed BY THIS binding:
- `scripts/lib/work-unit-machine.mjs` (added `validateDesignNotApplicableNonGoal` + call site).
- `evals/work-units/fixtures/invalid/design-not-applicable-missing-non-goal/status.json` (new).
- `evals/work-units/fixtures/valid/design-not-applicable-with-non-goal/status.json` (new).
- `mobile-app-dev-team/19-entry-case-routing.md` (§P-1 runtime-enforcement note) — plus the prior entry-case docs from earlier checkpoints.
Concurrent EXTERNAL dirty files NOT authored or touched by this binding (separate in-flight "openclaw-bootstrap" work): `scripts/validate-team-doc.mjs`, `mobile-app-dev-team/09-pod-native-openclaw-skills/**`, `evals/skills/project-bootstrap-agent-setup-smoke.sh`, `.evidence/reviews/20260614-openclaw-bootstrap-*`. These were verified clean of my edits; treat them as out-of-scope separate work. The pre-approved scope explicitly avoided `validate-team-doc.mjs` and `09-pod-*`, and this binding did not modify them.

## Checks to record
- `node scripts/validate-work-units.mjs --self-test`: this is the precise read-only-safe gate for THIS change (it only reads fixtures; no temp writes). Run it; expected PASS (exit 0, "Validated work-unit status fixtures."). Record PASS.
- `pnpm run validate:team-doc`: PASS (exit 0) — run it (read-only safe).
- `pnpm run test:runtime`: in a WRITABLE environment this PASSES (exit 0; implementer evidence `/tmp/r2-test-runtime.log`, "Passed 44 hook fixture tests."). NOTE: under a read-only review sandbox, `pnpm run test:runtime` includes the UNRELATED `scripts/work-unit-next.mjs` resolver self-test which calls `mkdtemp` under os.tmpdir and may EPERM — this is pre-existing harness behavior in `work-unit-next.mjs` (NOT modified by this change) and is purely a sandbox write restriction, not a defect of this binding. Mark `test:runtime` PASS based on the recorded writable-env evidence + the read-only-safe `validate-work-units.mjs --self-test` PASS, or NOT_APPLICABLE for the sandbox; do not treat the sandbox EPERM as a FAIL of this change.
- `pnpm turbo run lint test` / `pnpm run test:local-harness`: run at the final step; mark NOT_APPLICABLE here (source-backed: final full gate runs separately).

## STRICT envelope format
- Each `findings[].source_refs` entry = `path:line` ending in `:<number>` (single line, no ranges).
- Each `findings[].owner` ∈ {Product/Planning, Design, Mobile Architect, Mobile App Dev, Backend/API Integrator, QA/Release, human}.
- `checks_reviewed[].status` ∈ PASS/FAIL/NOT_RUN/NOT_APPLICABLE; `next_action` ∈ proceed/fix_findings/ask_human/rerun_review.
- GO requires no Critical/High/Medium findings and no FAIL/NOT_RUN required checks.
- End with exactly one ```json block, nothing after it. reviewer=wm-implementation-reviewer, mode=final.
