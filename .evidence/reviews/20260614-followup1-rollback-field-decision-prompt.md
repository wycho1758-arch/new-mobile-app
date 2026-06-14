Agent: wm-implementation-reviewer (Follow-up 1 enforcement DECISION, xhigh)

You are `wm-implementation-reviewer`, operating read-only. DECIDE the SoT-consistent action for "Follow-up 1: deterministic enforcement of the P-4 rollback approval-envelope fields (`rollback_owner`, `rollback_plan`)". The cardinal constraint: NO schema invention and NO prediction — only SoT-grounded action. Do not modify files or recursively delegate. Cite source references (path:line). End with exactly one fenced ```json verdict envelope (reviewer=wm-implementation-reviewer, mode=plan).

## Verified investigation (confirm these against the repo)
- `rollback_owner` and `rollback_plan` appear ONLY as documentary table rows in `mobile-app-dev-team/15-human-ops-live-readiness-annex.md` §Approval Envelope (lines ~47-48), and as prose references in `mobile-app-dev-team/20-app-eas-ota-rollback-runbook.md`. There is NO JSON instance, schema, or validator carrying them.
- The only machine-readable schemas are `wu-status/v1` and `human-gate/v1` (`scripts/lib/work-unit-machine.mjs:1-2`). `human-gate/v1` (validated by `validateHumanGateDecision`) does NOT include `rollback_owner`/`rollback_plan`; its fields are schema/gate_id/category/decision/scope/decided_by/decision_reference/decided_at/residual_risk/evidence_links (+failed_check_reference).
- `mobile-app-dev-team/15-human-ops-live-readiness-annex.md` states it "is a requirements and evidence document only" and does not authorize live work; it defines no machine artifact.
- There is no `live-readiness/*` schema or validator under `scripts/`.

## Decide (be decisive and SoT-honest)
1. Is there ANY existing machine-readable artifact/schema in the SoT that already carries `rollback_owner`/`rollback_plan` and that a validator could check WITHOUT inventing or extending a schema? (If yes, name it with path:line and recommend the bounded validator addition.)
2. If NO such artifact exists, then enforcing these fields deterministically would require introducing a NEW machine artifact/schema (e.g., a `live-readiness/v1` approval-envelope JSON + validator) or EXTENDING `human-gate/v1`. Is either of those "schema invention / scope expansion" that must be a separately-approved deliberate design decision (verdict NEEDS_HUMAN — defer to the user), rather than something to implement now under a no-invention rule?
3. Consider the collision constraint: `scripts/validate-team-doc.mjs` and `mobile-app-dev-team/09-pod-native-openclaw-skills/**` are under active concurrent edit and must not be touched.
4. Give a single decisive `recommendation`: either (a) a concrete SoT-grounded no-invention validator addition that is safe to do now, or (b) defer as a schema decision requiring explicit human authorization (NEEDS_HUMAN), with the precise reason.

Do not recommend inventing a schema or fields not present in the SoT. Do not recommend editing files under active concurrent edit.

## STRICT envelope format
- Each `findings[].source_refs` entry = `path:line` ending in `:<number>` (single line).
- Each `findings[].owner` ∈ {Product/Planning, Design, Mobile Architect, Mobile App Dev, Backend/API Integrator, QA/Release, human}.
- `checks_reviewed[].status` ∈ PASS/FAIL/NOT_RUN/NOT_APPLICABLE (mark CI checks NOT_APPLICABLE — decision review, no file change).
- `next_action` ∈ proceed/fix_findings/ask_human/rerun_review. Use `verdict` GO only if a concrete safe no-invention binding is recommended; use NEEDS_HUMAN if the honest recommendation is to defer pending a human-authorized schema decision.
- Include a `recommendation` field with the decisive next action.
- End with exactly one ```json block, nothing after it. reviewer=wm-implementation-reviewer, mode=plan.
