Agent: po-scope-gate-reviewer (REMAINING ITEMS decision, xhigh)

You are `po-scope-gate-reviewer`, operating read-only. DECIDE, for each remaining candidate item, whether it is SoT-justified and actionable NOW, or must be deferred/declined. The cardinal rule: SoT-grounded only, NO invention, NO over-reach. Do not recommend a change merely to "make progress". Do not modify files or recursively delegate. Cite source references (path:line). End with exactly one fenced ```json verdict envelope (reviewer=po-scope-gate-reviewer, mode=scope) with a `recommendation` field.

## Verified current state
- HEAD `b9c84e1`. The concurrent "openclaw-bootstrap" effort is STILL uncommitted-dirty on: `scripts/validate-team-doc.mjs`, `mobile-app-dev-team/09-pod-native-openclaw-skills/**`, `evals/skills/project-bootstrap-agent-setup-smoke.sh`, `evals/skills/wm/positive.prompt.md`. Editing those now collides.
- Already done this effort: P-1 design `not-applicable` non-goal-evidence rule, and the production-submit rollback-field rule (both in `scripts/lib/work-unit-machine.mjs`, GO + xhigh GO).

## Item A — "Follow-up 2": additional runtime bindings on the validate-team-doc / 09-pod surfaces
- Earlier xhigh risk-2 decision (`.evidence/reviews/20260614-entry-case-risk2-runtime-binding-decision.md`) concluded P-2 (cross-work-unit prioritization) and P-3 (expedited hotfix) are process/coordination governance with NO new deterministic enforcement (P-3 gates already enforced), and the taxonomy must not become a validator over arbitrary text.
- The candidate surfaces are also under active concurrent edit (collision).
- DECIDE: Is there ANY SoT-grounded deterministic binding left to add for P-2/P-3/taxonomy on a collision-safe surface? Or is Item A correctly deferred/closed (process-governance + collision)?

## Item B — expand rollback-field enforcement beyond production-submit
- The previous precise-rule xhigh decision (`.evidence/reviews/20260614-followup1-precise-rule-decision.md`, SCOPE-002) recommended production-submit ONLY, arguing failed-gate-risk "is acceptance of risk after a failed gate ... not necessarily a live mutation by category alone."
- `mobile-app-dev-team/15-human-ops-live-readiness-annex.md` §Approval Envelope requires rollback_owner/rollback_plan for "Every live mutation or live-readiness claim". Human-gate categories: production-submit, payment-money-movement, pii-privacy, external-messaging, legal-compliance, business-budget-owner, irreversible-scope-tradeoff, failed-gate-risk (`mobile-app-dev-team/06-gates-and-evidence.md` §Human Gates).
- Existing decision-file category usage (real + fixtures): business-budget-owner, irreversible-scope-tradeoff, failed-gate-risk, legal-compliance, pii-privacy are USED; production-submit (now rollback-required), payment-money-movement, external-messaging are UNUSED.
- DECIDE: Is requiring rollback_owner/rollback_plan for ANY additional human-gate category SoT-justified as a "live mutation / live-readiness claim"? Specifically assess failed-gate-risk (used; would need fixture updates), payment-money-movement and external-messaging (unused; no breakage). If a category is genuinely a live mutation per SoT, recommend it; if the mapping is not SoT-grounded at the category level, decline as over-reach.

## Output
- For Item A and Item B, give a clear PASS/justified-or-declined judgment with SoT citations.
- `recommendation`: the single decisive next action — either a concrete SoT-grounded, collision-safe, breakage-aware binding to implement now, OR "no further SoT-justified runtime binding remains; Item A deferred (collision + process-governance), Item B declined/deferred (no category-level live-mutation justification beyond production-submit)" with the reason.
- Use `verdict` GO only if a concrete justified binding is recommended; NEEDS_HUMAN if it needs another human authorization; otherwise NO_GO-as-"decline" is acceptable with `next_action` proceed meaning "proceed to stop/defer per recommendation" — state clearly.

## STRICT envelope format
- Each `findings[].source_refs` entry = `path:line` ending in `:<number>` (single line).
- Each `findings[].owner` ∈ {Product/Planning, Design, Mobile Architect, Mobile App Dev, Backend/API Integrator, QA/Release, human}.
- `checks_reviewed[].status` ∈ PASS/FAIL/NOT_RUN/NOT_APPLICABLE (CI checks NOT_APPLICABLE — decision review).
- `next_action` ∈ proceed/fix_findings/ask_human/rerun_review.
- End with exactly one ```json block, nothing after it. reviewer=po-scope-gate-reviewer, mode=scope.
