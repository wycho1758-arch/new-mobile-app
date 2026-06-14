Agent: wm-implementation-reviewer (runtime-binding SCOPE DECISION, xhigh)

You are `wm-implementation-reviewer`, operating read-only. DECIDE the bounded, SoT-consistent scope and approach for the deferred "runtime binding" follow-up, and whether to proceed now or defer, given an active concurrent-work collision risk. Do not modify files or recursively delegate. Cite source references (path:line). End with exactly one fenced ```json verdict envelope (reviewer=wm-implementation-reviewer, mode=plan).

## Context (completed prior work)
The doc-SoT layer is complete and fully reviewer-GO + full-gate-green:
- `mobile-app-dev-team/19-entry-case-routing.md` (entry-case taxonomy + §P-1 Design relevance/`not-applicable` criteria + §P-2 cross-work-unit prioritization + §P-3 expedited-but-gated emergency hotfix).
- `mobile-app-dev-team/20-app-eas-ota-rollback-runbook.md` (P-4 app/EAS/OTA/store rollback governance).
- Cross-refs in 05/06/15/README/99-source-map.
These are managed-doc governance at SoT priority 5 (`mobile-app-dev-team/00-sot-and-principles.md` §Source Of Truth 우선순위); runtime enforcement was explicitly deferred. The remaining residual risk is: "P-1~P-4 are managed-doc only; runtime enforcement in skills/validators remains deferred."

## Candidate runtime-enforcement surfaces (priority 3 = `.agents/skills/*/SKILL.md`; validators)
- `scripts/validate-team-doc.mjs` (managed-doc term checks).
- `scripts/lib/work-unit-machine.mjs` (work-unit state machine; `not-applicable` state exists).
- `scripts/work-unit-next.mjs` / `scripts/validate-work-units.mjs` (resolver/validator).
- `.agents/skills/po-planning-completeness-review/SKILL.md`, `po-work-unit-planning-and-agent-sprint/SKILL.md`, `design-mobile-design-handoff/SKILL.md`, `mobile-architect-workflow/SKILL.md` (skill contracts).

## ACTIVE COLLISION RISK (verified)
A concurrent "openclaw-bootstrap" effort is actively editing the shared worktree RIGHT NOW: `scripts/validate-team-doc.mjs` is uncommitted-modified (+78 lines), and `mobile-app-dev-team/09-pod-native-openclaw-skills/**` scripts/SKILL.md are modified. HEAD recently moved to `b9c84e1`. Editing `scripts/validate-team-doc.mjs` (or 09-pod files) now would collide with that in-flight work.

## Decide (be concrete)
1. For EACH of P-1, P-2, P-3, P-4 and the entry-case taxonomy: classify as (i) appropriately deterministically runtime-enforceable (and on which surface), or (ii) inherently process/coordination governance NOT amenable to deterministic validator/state enforcement (should remain managed-doc). Ground each judgment in SoT.
   - Consider: P-3 gates (`production-submit`, `failed-gate-risk`) are ALREADY enforced by the human-gate validation in `scripts/lib/work-unit-machine.mjs` and `mobile-app-dev-team/06-gates-and-evidence.md`; does P-3 add any NEW deterministically-enforceable rule? P-4 rollback_owner/rollback_plan already required by `mobile-app-dev-team/15-human-ops-live-readiness-annex.md` §Approval Envelope. P-1 relates to the existing `not-applicable` state. P-2 is cross-work-unit coordination.
2. Identify the COLLISION-SAFE surface (files the concurrent effort is NOT touching) vs collision-prone surface (`scripts/validate-team-doc.mjs`, `09-pod-*`). Recommend whether validator-touching binding must be deferred/sequenced until the concurrent work commits.
3. Recommend a single concrete bounded next action: either (a) a specific, minimal, tests-first runtime binding on a collision-safe surface that adds real enforcement value, or (b) defer runtime binding (NEEDS_HUMAN / sequence-after-concurrent-work) if no safe, valuable, deterministic binding exists right now.

Avoid recommending enforcement of inherently non-deterministic process rules. Avoid recommending edits to files under active concurrent modification.

## STRICT envelope format
- Each `findings[].source_refs` entry = `path:line` ending in `:<number>` (single line).
- Each `findings[].owner` ∈ {Product/Planning, Design, Mobile Architect, Mobile App Dev, Backend/API Integrator, QA/Release, human}.
- `checks_reviewed[].status` ∈ PASS/FAIL/NOT_RUN/NOT_APPLICABLE (mark CI checks NOT_APPLICABLE — scoping decision, no file change).
- `next_action` ∈ proceed/fix_findings/ask_human/rerun_review. Use `verdict` GO only if a concrete safe bounded binding is recommended; use NEEDS_HUMAN if the recommendation is to defer to the user / sequence after concurrent work.
- Include a `recommendation` field summarizing the bounded next action and the enforceable-vs-governance classification.
- End with exactly one ```json block, nothing after it. reviewer=wm-implementation-reviewer, mode=plan.
