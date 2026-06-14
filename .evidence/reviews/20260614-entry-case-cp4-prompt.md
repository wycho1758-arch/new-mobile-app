# CP-4 review — 20-app-eas-ota-rollback-runbook.md (P-4)

Review the CP-4 change against the repo SoT. Operate read-only. Read `mobile-app-dev-team/20-app-eas-ota-rollback-runbook.md` and the 15-annex pointer edit. Emit exactly one fenced ```json verdict envelope at the end; mode=final.

## Change under review
1. New doc `mobile-app-dev-team/20-app-eas-ota-rollback-runbook.md` (P-4 app/EAS/OTA/store rollback runbook).
2. One-line pointer added to `mobile-app-dev-team/15-human-ops-live-readiness-annex.md` §Stop And Rollback Rules referencing the new runbook (additive).

Pre-approved by a wm-implementation-reviewer (xhigh) Mobile Architect EAS/releaseability decision at `.evidence/reviews/20260614-entry-case-cp4-ma-decision.md` (GO, 0 findings) — that decision is the Mobile Architect EAS/releaseability review evidence required for CP-4.

## Verify
1. SoT-grounded, no prediction. Every claim cites a real SoT file (15-annex, 10-github, 05, PROJECT_ENVIRONMENT.md, 03-role-capability-matrix, 06, mobile-architect-workflow).
2. QA/Release OWNERSHIP COVERAGE (required): the runbook must explicitly assign QA/Release ownership of rollback evidence (EAS Update channel/store/native), release-risk summary, and failure classification. Mobile Architect ownership of releaseability/EAS strategy/rollback architecture must be present. human/ops owns external rollback execution; Product/Planning owns routing + human gates.
3. BOUNDARY (required): the runbook must NOT authorize or claim live EAS Update channel rollback, store rollback, OTA, or production execution from repo-local evidence; it documents ownership/decision/gate/evidence flow only (15-annex §Forbidden Claims). `production-submit` and `failed-gate-risk` gates not weakened.
4. Managed-doc disclaimer present (SoT priority 5; runtime enforcement deferred; does not supersede `.agents/skills/*` or validators).
5. No `CTO` token; no secret VALUES (the bare string `EXPO_TOKEN` inside annex forbidden-claim prose, with no value, is acceptable).

## Checks to record
- `pnpm run validate:team-doc`: PASS (run by implementer; exit 0, "Validated current mobile-app-dev-team managed docs."). Mark PASS.
- `pnpm turbo run lint test`, `pnpm run test:runtime`, `pnpm run test:local-harness`: NOT_APPLICABLE for this intermediate checkpoint (source-backed: full CI gate runs once at CP-5). Do NOT mark NOT_RUN.

## STRICT envelope format
- Each `findings[].source_refs` entry = `path:line` ending in `:<number>` (single line, no ranges).
- Each `findings[].owner` ∈ {Product/Planning, Design, Mobile Architect, Mobile App Dev, Backend/API Integrator, QA/Release, human}.
- `checks_reviewed[].status` ∈ PASS/FAIL/NOT_RUN/NOT_APPLICABLE; `next_action` ∈ proceed/fix_findings/ask_human/rerun_review.
- GO requires no Critical/High/Medium findings and no FAIL/NOT_RUN required checks.
- End with exactly one ```json block, nothing after it. mode=final.
