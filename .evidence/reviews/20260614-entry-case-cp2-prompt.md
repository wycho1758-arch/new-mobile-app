# CP-2 review — P-1 Design relevance / not-applicable criteria

Review the CP-2 change against the repo SoT. Operate read-only. Emit exactly one fenced ```json verdict envelope at the end; mode=design.

## Change under review
1. New section `## P-1 — Design Relevance and \`not-applicable\` Criteria` appended to `mobile-app-dev-team/19-entry-case-routing.md`.
2. C5 NOTE in 19 updated to reference §P-1.
3. One-line pointer added under `mobile-app-dev-team/05-work-processes.md` §2 Design Readiness (step 9) to 19 §P-1.

This P-1 criteria was pre-approved by a design-reviewer (xhigh) decision at `.evidence/reviews/20260614-entry-case-cp2-p1-decision.md` (GO, 0 findings).

## Verify
1. Each P-1 clause is SoT-grounded (`.agents/skills/design-mobile-design-handoff/SKILL.md` §Workflow step 4; `.agents/skills/po-planning-completeness-review/SKILL.md` §Workflow step 2; `mobile-app-dev-team/05-work-processes.md` §1 step 5 and §2; `scripts/lib/work-unit-machine.mjs` states). No prediction.
2. CRITICAL wording check: P-1 must say Product/Planning owns the Design **relevance classification** only — it must NOT be worded as Product/Planning owning design quality or the `01-design` stage owner role; Design remains owner of the stage and design quality.
3. Guardrail present: marking `not-applicable` requires none of layout/interaction/visual-hierarchy in scope; default to RELEVANT when uncertain; text-only never authorizes implementation when those are in scope.
4. Managed-doc disclaimer present (SoT priority 5; runtime enforcement deferred; does not supersede higher-priority SoT).
5. 05 §2 pointer does not remove any existing content and contains no `CTO` token.

## Checks to record
- `pnpm run validate:team-doc`: PASS (run by implementer; exit 0, "Validated current mobile-app-dev-team managed docs."). Mark PASS.
- `pnpm turbo run lint test`, `pnpm run test:runtime`, `pnpm run test:local-harness`: NOT_APPLICABLE for this intermediate checkpoint (source-backed: full CI gate runs once at CP-5). Do NOT mark NOT_RUN.

## STRICT envelope format
- Each `findings[].source_refs` entry = `path:line` ending in `:<number>` (single line, no ranges).
- Each `findings[].owner` ∈ {Product/Planning, Design, Mobile Architect, Mobile App Dev, Backend/API Integrator, QA/Release, human}.
- `checks_reviewed[].status` ∈ PASS/FAIL/NOT_RUN/NOT_APPLICABLE; `next_action` ∈ proceed/fix_findings/ask_human/rerun_review.
- GO requires no Critical/High/Medium findings and no FAIL/NOT_RUN required checks.
- End with exactly one ```json block, nothing after it. mode=design.
