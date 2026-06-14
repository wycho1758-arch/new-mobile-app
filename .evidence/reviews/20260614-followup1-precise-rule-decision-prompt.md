Agent: po-scope-gate-reviewer (Follow-up 1 PRECISE RULE decision, xhigh)

You are `po-scope-gate-reviewer`, operating read-only (scope, human-gate categories, risk). The human owner AUTHORIZED extending the executable `human-gate/v1` schema so that rollback decisions require `rollback_owner` and `rollback_plan`. DECIDE the precise, SoT-grounded, breakage-aware rule. No prediction. Do not modify files or recursively delegate. Cite source references (path:line). End with exactly one fenced ```json verdict envelope (reviewer=po-scope-gate-reviewer, mode=scope).

## Authorization
Human owner selected "extend human-gate/v1": for rollback-relevant categories, require `rollback_owner` and `rollback_plan`. The executable validator is `validateHumanGateDecision` in `scripts/lib/work-unit-machine.mjs` (validates `human-gate/v1` decision files found under `00-product-planning/human-gates/*.json` and `05-qa-release/human-approval.json`).

## SoT grounding
- `mobile-app-dev-team/15-human-ops-live-readiness-annex.md` §Approval Envelope: "Every live mutation or live-readiness claim must have a recorded approval before execution" and it "must include" `rollback_owner` ("Human or ops owner responsible for undoing the mutation") and `rollback_plan` ("Concrete rollback path or reason rollback is not available").
- Human-gate categories: `production-submit`, `payment-money-movement`, `pii-privacy`, `external-messaging`, `legal-compliance`, `business-budget-owner`, `irreversible-scope-tradeoff`, `failed-gate-risk` (`mobile-app-dev-team/06-gates-and-evidence.md` §Human Gates).

## BREAKAGE DATA (verified — every existing human-gate decision file, real + fixtures)
- NO existing decision file carries `rollback_owner`/`rollback_plan`.
- Categories in existing VALID fixtures/real files: `business-budget-owner`, `irreversible-scope-tradeoff`, `failed-gate-risk`, plus `legal-compliance`/`pii-privacy` (in invalid fixtures). The real external work-unit `docs/plans/work-units/project-bootstrap-auth-gates/.../expo-sdk-56-patch-dependency-approval.json` uses `business-budget-owner`.
- `production-submit` is used by ZERO existing decision files (real or fixture). So requiring rollback fields ONLY for `production-submit` breaks nothing. Requiring them for `failed-gate-risk` would break existing valid fixtures (`human-gate-approved`, `evidence-ladder-waived`, `human-gate-rejected`) unless those fixtures are updated.

## Decide (precise, decisive)
1. Which exact category set must require `rollback_owner` + `rollback_plan` (each a non-empty string)? Ground it in 15-annex's "live mutation / live-readiness" framing. Is `production-submit` the correct minimal SoT-aligned scope (it is the live production mutation)? Should `failed-gate-risk` be included given it is risk-acceptance (and existing valid fixtures would then need rollback fields added)?
2. If a category with existing valid fixtures is included, is updating those fixtures to carry rollback fields acceptable (they SHOULD comply with the new rule), or should scope stay minimal to avoid editing existing test data?
3. Field validation: `rollback_owner` and `rollback_plan` as required non-empty strings for the chosen categories — correct? Any conflict with `decided_by` (human approver) or other human-gate rules?
4. Collision: do NOT touch `scripts/validate-team-doc.mjs` or `09-pod-native-openclaw-skills/**` (active concurrent edit). The target `scripts/lib/work-unit-machine.mjs` is clean.
5. Give a decisive `recommendation`: the exact rule (category set + required fields + types) and whether to update any existing fixtures.

## STRICT envelope format
- Each `findings[].source_refs` entry = `path:line` ending in `:<number>` (single line).
- Each `findings[].owner` ∈ {Product/Planning, Design, Mobile Architect, Mobile App Dev, Backend/API Integrator, QA/Release, human}.
- `checks_reviewed[].status` ∈ PASS/FAIL/NOT_RUN/NOT_APPLICABLE (CI checks NOT_APPLICABLE — decision review).
- `next_action` ∈ proceed/fix_findings/ask_human/rerun_review. Use GO if a concrete bounded rule is recommended.
- Include a `recommendation` field with the exact rule.
- End with exactly one ```json block, nothing after it. reviewer=po-scope-gate-reviewer, mode=scope.
