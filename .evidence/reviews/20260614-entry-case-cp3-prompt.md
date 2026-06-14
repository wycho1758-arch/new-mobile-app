# CP-3 review — P-2 + P-3 governance

Review the CP-3 change against the repo SoT. Operate read-only. Emit exactly one fenced ```json verdict envelope at the end; reviewer=po-scope-gate-reviewer; mode=scope.

## Change under review
1. New sections `## P-2 — Cross-Work-Unit Prioritization and Conflict` and `## P-3 — Emergency Hotfix: Expedited but Still Gated` appended to `mobile-app-dev-team/19-entry-case-routing.md`.
2. One-line pointer added to `mobile-app-dev-team/06-gates-and-evidence.md` §Human Gates referencing 19 §P-3 (additive; existing required terms preserved).

These were pre-approved by a po-scope-gate-reviewer (xhigh) decision at `.evidence/reviews/20260614-entry-case-cp3-decision.md` (GO, 0 findings).

## Verify
1. P-2/P-3 clauses are SoT-grounded (`mobile-app-dev-team/05-work-processes.md` §1 step 8, §3 steps 2/5, §4 step 4, §5 step 6, §6; `mobile-app-dev-team/06-gates-and-evidence.md` §Human Gates and §Durable GitHub Handoff; `mobile-app-dev-team/03-role-capability-matrix.md`). No prediction/invention.
2. No human-gate weakening: P-3 must keep `production-submit` and `failed-gate-risk` human gates (no bypass/fast-path). P-2 escalations use `irreversible-scope-tradeoff` / `business-budget-owner` gates.
3. No role-boundary collapse: Product/Planning owns prioritization/routing (not implementation); QA/Release owns post-hotfix evidence/release-risk/failure classification; Backend/API owns contract conflict resolution with Mobile Architect co-review.
4. Managed-doc disclaimer present in both sections (SoT priority 5; runtime enforcement deferred; does not supersede higher-priority SoT).
5. 06 edit is additive and preserves Railway Boundary and other required terms; no `CTO` token.

## Checks to record
- `pnpm run validate:team-doc`: PASS (run by implementer; exit 0). Mark PASS.
- `pnpm turbo run lint test`, `pnpm run test:runtime`, `pnpm run test:local-harness`: NOT_APPLICABLE for this intermediate checkpoint (source-backed: full CI gate runs once at CP-5). Do NOT mark NOT_RUN.

## STRICT envelope format
- Each `findings[].source_refs` entry = `path:line` ending in `:<number>` (single line, no ranges).
- Each `findings[].owner` ∈ {Product/Planning, Design, Mobile Architect, Mobile App Dev, Backend/API Integrator, QA/Release, human}.
- `checks_reviewed[].status` ∈ PASS/FAIL/NOT_RUN/NOT_APPLICABLE; `next_action` ∈ proceed/fix_findings/ask_human/rerun_review.
- GO requires no Critical/High/Medium findings and no FAIL/NOT_RUN required checks.
- End with exactly one ```json block, nothing after it. reviewer=po-scope-gate-reviewer, mode=scope.
