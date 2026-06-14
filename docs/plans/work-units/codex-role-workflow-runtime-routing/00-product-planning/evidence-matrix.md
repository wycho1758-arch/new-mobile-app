# Evidence Matrix: codex-role-workflow Runtime Routing

status: required
owner: Product/Planning
input artifact: `docs/plans/work-units/codex-role-workflow-runtime-routing/00-product-planning/task-packet.md`
output artifact: this evidence matrix
acceptance criteria: implementation evidence links each planned task to command output or reviewer evidence
evidence requirement: linked durable artifacts and command outputs with exit status
dependencies/blockers: none for repo-local implementation; live pod publication remains external
open decisions: none for repo-local implementation; live pod publication remains external
next responsible role: pod/bootstrap or human/ops owner for live runtime publication, if required

## Scope Mapping

| Planned task | Evidence |
| --- | --- |
| Task A: Source-grounded routing contract update | `git diff -- mobile-app-dev-team/09-pod-native-openclaw-skills/codex-role-workflow/SKILL.md` shows `Codex Substrate`, `Process Routing Sources`, `Common Intake Rule`, `Entry Case Routing`, `Design Relevance`, and `Hotfix And Rollback`. |
| Task B: Output contract expansion | `mobile-app-dev-team/09-pod-native-openclaw-skills/codex-role-workflow/SKILL.md` now requires `entry_case`, `routing_reason`, `process_sot`, `readiness_state_or_required_gate`, `blocked_reason`, `not_applicable_reason`, and `external_proof_boundary`. |
| Task C: Design relevance and P0/P1 guardrails | `mobile-app-dev-team/09-pod-native-openclaw-skills/codex-role-workflow/SKILL.md` states screen presence is not decisive, layout/interaction/visual hierarchy is decisive, P0 is before Stitch generation, and P1 is before HTML extraction. |
| Task D: Validator coverage | `scripts/validate-team-doc.mjs` now requires the routing overlay, runtime path resolution, broader input language, Design guardrails, hotfix/rollback, and output contract fields. |
| Task E: Source-managed `/workspace/AGENTS.md` alignment | `AGENTS.md` now states WonderMove requirements/specifications/PRDs/work requests must resolve through `codex-role-workflow` and that Codex is the repo-local role-workflow substrate. |
| Task F: Pod runtime publication path alignment | `00-product-planning/runtime-publication-status.md` records that live `/workspace` mutation was not performed and that runtime publication remains a pod/bootstrap operation. |

## Commands

| Command | Status | Evidence |
| --- | --- | --- |
| `node scripts/validate-team-doc.mjs` before skill implementation | FAIL expected | Failed on missing `Codex Substrate`, `19-entry-case-routing.md`, broader input language, Design/P0/P1, rollback, and output contract terms. |
| `node scripts/validate-team-doc.mjs` after skill implementation | PASS | `04-mobile-app/command-output.md` |
| `pnpm run test:runtime` | PASS | `04-mobile-app/command-output.md` |
| `pnpm run test:local-harness` | PASS | `04-mobile-app/command-output.md` |
| `node scripts/validate-work-units.mjs` | PASS | `04-mobile-app/command-output.md` |
| `node scripts/validate-evidence-hygiene.mjs` | PASS | `04-mobile-app/command-output.md` |

## Reviewer Evidence

Completed read-only reviewer evidence:

- `wm-implementation-reviewer` for validator/runtime artifact changes: `.evidence/reviews/20260614-codex-role-workflow-runtime-routing-final-wm-review.md`
- Parsed reviewer JSON: `.evidence/reviews/20260614-codex-role-workflow-runtime-routing-final-wm-review.json`
- `po-planning-reviewer` final re-review for Product/Planning process and skill-routing semantics: `.evidence/reviews/20260614-codex-role-workflow-runtime-routing-final-po-rereview.md`
- Parsed reviewer JSON: `.evidence/reviews/20260614-codex-role-workflow-runtime-routing-final-po-rereview.json`
