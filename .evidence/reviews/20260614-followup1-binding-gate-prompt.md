# Follow-up 1 gate review — production-submit rollback field enforcement (human-gate/v1)

You are `po-scope-gate-reviewer`, operating read-only. Review this human-authorized, xhigh-scoped binding against the repo SoT. Emit exactly one fenced ```json verdict envelope; mode=final.

## Change under review (THIS binding only)
- `scripts/lib/work-unit-machine.mjs`: in `validateHumanGateDecision`, when `decision.category === 'production-submit'`, require `rollback_owner` and `rollback_plan` as non-empty strings (via existing `validateString`). Scoped to production-submit only; other categories unchanged.
- New fixtures: `evals/work-units/fixtures/valid/human-gate-production-submit-rollback/` (status.json + `00-product-planning/human-gates/hg-production-submit.json` WITH rollback fields → PASS) and `evals/work-units/fixtures/invalid/human-gate-production-submit-missing-rollback/` (same WITHOUT rollback fields → FAIL).
- `mobile-app-dev-team/20-app-eas-ota-rollback-runbook.md` §Gates and Evidence: added a partial-runtime-enforcement note.

## Authorization chain
- Human owner authorized "extend human-gate/v1" (selected option). Earlier xhigh `wm-implementation-reviewer` decision (`.evidence/reviews/20260614-followup1-rollback-field-decision.md`) ruled NEEDS_HUMAN (no SoT artifact carried the fields; required a human schema decision). Precise rule scoped by xhigh `po-scope-gate-reviewer` decision (`.evidence/reviews/20260614-followup1-precise-rule-decision.md`): production-submit ONLY; do not update existing fixtures; non-empty string fields.

## Verify
1. SoT-grounding: `mobile-app-dev-team/15-human-ops-live-readiness-annex.md` §Approval Envelope requires rollback_owner/rollback_plan for live mutations; production-submit is the live production mutation human-gate category (`mobile-app-dev-team/06-gates-and-evidence.md` §Human Gates). No invented fields beyond the authorized rollback_owner/rollback_plan.
2. Breakage-safety: production-submit is used by ZERO existing decision files, so the rule breaks no existing valid fixtures/real data; failed-gate-risk and other categories are intentionally NOT included (their existing valid fixtures keep passing). Confirm no existing valid fixture regresses.
3. Tests-first: invalid fixture fails for exactly the missing rollback fields; valid fixture passes. The rule does not weaken any existing human-gate requirement (decided_by human approver, decision_reference URL, failed_check_reference for failed-gate-risk all intact).
4. Doc accuracy: 20 §Gates and Evidence note states only the production-submit enforcement; does not overstate; managed-doc disclaimer/boundary intact; no claim of live EAS/OTA/store execution.
5. Collision-safety: only `scripts/lib/work-unit-machine.mjs`, the two new fixtures, and `20-...md` changed for THIS binding. NOT touched: `scripts/validate-team-doc.mjs`, `mobile-app-dev-team/09-pod-native-openclaw-skills/**` (active concurrent edit). (work-unit-machine.mjs also carries an earlier same-effort P-1 edit; that is intended, not external.)

## Checks to record
- `node scripts/validate-work-units.mjs --self-test`: read-only safe (reads fixtures only); run it; expected PASS (exit 0, "Validated work-unit status fixtures."). Record PASS.
- `pnpm run validate:team-doc`: PASS (exit 0) — run it.
- `pnpm run test:runtime`: PASS in a writable env (exit 0; implementer log `/tmp/f1-test-runtime.log`). Under a read-only sandbox the UNRELATED `scripts/work-unit-next.mjs` resolver self-test uses `mkdtemp` (write) and may EPERM — pre-existing harness behavior, not this change. Mark PASS via recorded evidence + read-only-safe `validate-work-units.mjs --self-test`, or NOT_APPLICABLE for the sandbox; do not treat sandbox EPERM as FAIL.
- `pnpm turbo run lint test` / `pnpm run test:local-harness`: run at final step; NOT_APPLICABLE here (source-backed).

## STRICT envelope format
- Each `findings[].source_refs` entry = `path:line` ending in `:<number>` (single line, no ranges).
- Each `findings[].owner` ∈ {Product/Planning, Design, Mobile Architect, Mobile App Dev, Backend/API Integrator, QA/Release, human}.
- `checks_reviewed[].status` ∈ PASS/FAIL/NOT_RUN/NOT_APPLICABLE; `next_action` ∈ proceed/fix_findings/ask_human/rerun_review.
- GO requires no Critical/High/Medium findings and no FAIL/NOT_RUN required checks.
- End with exactly one ```json block, nothing after it. reviewer=po-scope-gate-reviewer, mode=final.
