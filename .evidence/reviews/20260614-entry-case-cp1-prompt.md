# CP-1 review — mobile-app-dev-team/19-entry-case-routing.md (taxonomy core)

You are `po-planning-reviewer`. Review the NEW managed doc `mobile-app-dev-team/19-entry-case-routing.md` (taxonomy core checkpoint) against the repo SoT. Operate read-only. Read the file and verify every routing claim is backed by the cited SoT files. Emit exactly one fenced ```json verdict envelope at the end; reviewer must equal po-planning-reviewer; mode=scope.

## Scope of this checkpoint (CP-1)
This checkpoint adds ONLY the taxonomy core: Common Entry Point, SoT-Named Input Categories, Report-Derived Case Grouping (C1-C5), Expanded Routing (E1-E16), Work-Unit Decision Enum. P-1/P-2/P-3/P-4 sections are intentionally deferred to later checkpoints (a forward-reference "(see P-1, added separately)" in C5 is expected, not a defect).

## Verify
1. Every routing/classification claim is grounded in the cited SoT file (`.agents/skills/po-work-unit-planning-and-agent-sprint/SKILL.md`, `po-requirement-office-hours/SKILL.md`, `po-planning-completeness-review/SKILL.md`, `mobile-app-dev-team/05-work-processes.md`, `design-mobile-design-handoff/SKILL.md`, `mobile-app-dev-team/06-gates-and-evidence.md`, `03-role-capability-matrix.md`). Flag any unsupported/prediction claim.
2. The "5 cases" are explicitly labeled as a report-derived grouping, NOT SoT-named cases.
3. C5 is relevance-based conditional routing (Mobile Architect / Backend/API only when relevant), NOT a fixed path; C4 design trigger is layout/interaction/visual-hierarchy importance, not merely "has a screen".
4. Role boundaries are not collapsed into Product/Planning.
5. Content guardrail: the doc must NOT claim to supersede or be "already enforced by" `.agents/skills/*` or runtime validators; it must carry a managed-doc (SoT priority 5) disclaimer with runtime enforcement deferred.
6. No "CTO" token; no secrets.

## Checks to record
- `pnpm run validate:team-doc`: PASS (already run by the implementer; exit 0, "Validated current mobile-app-dev-team managed docs."). Mark this check PASS with that evidence.
- `pnpm turbo run lint test`, `pnpm run test:runtime`, `pnpm run test:local-harness`: mark NOT_APPLICABLE for this intermediate checkpoint (source-backed: the full CI gate runs once at CP-5; per-CP doc edits are gated by validate:team-doc). Do NOT mark NOT_RUN.

## STRICT envelope format (validator-enforced — follow exactly)
- Each `findings[].source_refs` entry MUST be a `path:line` string ending in `:<number>` (single line, no ranges).
- Each `findings[].owner` MUST be exactly one of: Product/Planning, Design, Mobile Architect, Mobile App Dev, Backend/API Integrator, QA/Release, human.
- `checks_reviewed[].status` ∈ PASS/FAIL/NOT_RUN/NOT_APPLICABLE; `next_action` ∈ proceed/fix_findings/ask_human/rerun_review.
- GO requires no Critical/High/Medium findings and no FAIL/NOT_RUN required checks (source-backed NOT_APPLICABLE is allowed).
- End with exactly one ```json block and no text after it. reviewer=po-planning-reviewer, mode=scope.
