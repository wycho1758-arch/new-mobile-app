Agent: po-scope-gate-reviewer (FINAL completion check, Follow-up 1, xhigh)

You are `po-scope-gate-reviewer`, operating read-only. FINAL post-completion xhigh check of the human-authorized production-submit rollback-field binding. Read the actual files and verify correctness, tests-first discipline, SoT-grounding, breakage-safety, scope isolation, and gate evidence. Do not modify files or recursively delegate. Cite source references (path:line). End with exactly one fenced ```json verdict envelope (reviewer=po-scope-gate-reviewer, mode=final).

## Completed change set (THIS binding)
- `scripts/lib/work-unit-machine.mjs`: `validateHumanGateDecision` now requires `rollback_owner` and `rollback_plan` (non-empty strings) when `decision.category === 'production-submit'`. Scoped to production-submit only.
- `evals/work-units/fixtures/valid/human-gate-production-submit-rollback/` (status.json + human-gates/hg-production-submit.json WITH rollback fields → PASS).
- `evals/work-units/fixtures/invalid/human-gate-production-submit-missing-rollback/` (same WITHOUT rollback fields → FAIL).
- `mobile-app-dev-team/20-app-eas-ota-rollback-runbook.md` §Gates and Evidence: partial-runtime-enforcement note.

Authorization: human owner selected "extend human-gate/v1"; xhigh decisions at `.evidence/reviews/20260614-followup1-rollback-field-decision.md` (NEEDS_HUMAN) and `.evidence/reviews/20260614-followup1-precise-rule-decision.md` (production-submit only, no fixture updates).

Concurrent EXTERNAL work NOT part of this binding: `scripts/validate-team-doc.mjs`, `mobile-app-dev-team/09-pod-native-openclaw-skills/**`, `evals/skills/project-bootstrap-agent-setup-smoke.sh`. (work-unit-machine.mjs also carries the earlier same-effort P-1 design-not-applicable edit — intended, not external.)

## Verify (final, rigorous)
1. SoT-grounding: rollback_owner/rollback_plan come from `mobile-app-dev-team/15-human-ops-live-readiness-annex.md` §Approval Envelope; production-submit is the live-mutation human-gate category (`mobile-app-dev-team/06-gates-and-evidence.md` §Human Gates). No invented fields.
2. Breakage-safety: confirm no existing valid fixture/real decision file regresses (production-submit unused previously); failed-gate-risk and others intentionally excluded.
3. Tests-first: invalid fixture fails for exactly the missing rollback fields; valid fixture passes. Run `node scripts/validate-work-units.mjs --self-test` (read-only safe) and confirm PASS.
4. No weakening: existing human-gate requirements (decided_by human approver, decision_reference URL, failed_check_reference for failed-gate-risk) remain intact; production-submit gate is not bypassable.
5. Doc accuracy + boundary: 20 note states only production-submit enforcement; managed-doc disclaimer + live-execution boundary intact (no claim of live EAS/OTA/store execution).
6. Scope isolation: only the files listed for THIS binding changed; concurrent external surfaces untouched.

## Gate evidence
- `node scripts/validate-work-units.mjs --self-test`: PASS (exit 0) — read-only safe, run it.
- `pnpm run validate:team-doc`: PASS (exit 0) — run it.
- `pnpm run test:runtime`: PASS in writable env (exit 0; `/tmp/f1-test-runtime.log`). Read-only sandbox may EPERM on the UNRELATED `work-unit-next.mjs` mkdtemp self-test — not this change; mark PASS via recorded evidence + validate-work-units self-test, or NOT_APPLICABLE for sandbox; not a FAIL.
- `pnpm turbo run lint test`: PASS (exit 0). `pnpm run test:local-harness`: PASS (exit 0, "local harness all passed"; `/tmp/f1-local-harness.log`).

## STRICT envelope format
- Each `findings[].source_refs` entry = `path:line` ending in `:<number>` (single line, no ranges).
- Each `findings[].owner` ∈ {Product/Planning, Design, Mobile Architect, Mobile App Dev, Backend/API Integrator, QA/Release, human}.
- `checks_reviewed[].status` ∈ PASS/FAIL/NOT_RUN/NOT_APPLICABLE; `next_action` ∈ proceed/fix_findings/ask_human/rerun_review.
- GO requires no Critical/High/Medium findings and required checks PASS or source-backed NOT_APPLICABLE.
- End with exactly one ```json block, nothing after it. reviewer=po-scope-gate-reviewer, mode=final.
