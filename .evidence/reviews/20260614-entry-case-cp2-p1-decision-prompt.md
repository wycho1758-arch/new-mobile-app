Agent: design-reviewer (DECISION request, xhigh)

You are `design-reviewer`, operating read-only. Per the team's principle that SoT gaps requiring a new rule are decisions routed to a high-rigor reviewer, DECIDE whether the proposed P-1 criteria below are SoT-consistent and correct, or must be changed. Do not modify files or recursively delegate. Cite source references (path:line). End with exactly one fenced ```json reviewer verdict envelope (reviewer=design-reviewer, mode=design).

## Decision context (SoT-verified facts)
- `mobile-app-dev-team/05-work-processes.md` §2 routes Design when the work needs a UX handoff; Design owns design quality.
- `.agents/skills/design-mobile-design-handoff/SKILL.md` step 4: "Use Stitch for high-fidelity mobile design whenever layout, interaction, or visual hierarchy matters"; "ASCII is only for early flow alignment; do not approve implementation from text-only design."
- `.agents/skills/po-planning-completeness-review/SKILL.md` step 2: build a role review matrix with only relevant roles.
- `scripts/lib/work-unit-machine.mjs`: work-unit states already include `not-applicable`; stage `01-design` is owned by Design.
- GAP: SoT defines no explicit criteria for WHEN the `01-design` stage may be marked `not-applicable`.

## Proposed P-1 criteria (to decide)
1. Design (stage `01-design`) is RELEVANT when the work unit introduces or changes layout, interaction, or visual hierarchy (design SKILL step 4).
2. The `01-design` stage MAY be marked `not-applicable` ONLY when the work unit introduces no new or changed layout, interaction, or visual hierarchy — e.g., pure backend/contract/data work, config/infra, non-visual logic, or test/evidence-only work.
3. Decision owner: Product/Planning during planning-completeness-review using the relevant-roles matrix (completeness SKILL step 2), recorded as the `01-design` stage state in `status.json` (`not-applicable` is an existing state).
4. Guardrail: marking `not-applicable` requires that none of layout/interaction/visual-hierarchy is in scope; if uncertain, default to RELEVANT (Design engaged). Text-only/ASCII description never authorizes implementation when those are in scope (design SKILL).
5. Managed-doc note: this documents decision criteria at SoT priority 5; runtime enforcement (validators/skills) is a deferred follow-up and does not supersede higher-priority SoT.

## Decide
- Is each clause SoT-consistent and free of prediction? Flag any clause that overstates SoT or conflicts with Design ownership / Product/Planning boundary.
- Is "default to RELEVANT when uncertain" the safe SoT-aligned default?
- Verdict GO = criteria approved to be written into `mobile-app-dev-team/19-entry-case-routing.md` as P-1. NO_GO/NEEDS_HUMAN with required corrections otherwise.

## STRICT envelope format
- Each `findings[].source_refs` entry MUST be `path:line` ending in `:<number>` (single line).
- Each `findings[].owner` ∈ {Product/Planning, Design, Mobile Architect, Mobile App Dev, Backend/API Integrator, QA/Release, human}.
- `checks_reviewed[].status` ∈ PASS/FAIL/NOT_RUN/NOT_APPLICABLE; mark `pnpm run validate:team-doc` and CI checks NOT_APPLICABLE (decision review, no file change yet).
- `next_action` ∈ proceed/fix_findings/ask_human/rerun_review. GO requires no Critical/High/Medium findings.
- End with exactly one ```json block, nothing after it.
