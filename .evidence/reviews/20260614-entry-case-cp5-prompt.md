# CP-5 final review — entry-case routing + P-1..P-4 documentation, index/crosswalk, full CI gate

You are `po-planning-reviewer`. Final review of the completed managed-doc change set against the repo SoT. Operate read-only. Emit exactly one fenced ```json verdict envelope; mode=final.

## Full change set (this goal)
New docs:
- `mobile-app-dev-team/19-entry-case-routing.md` — taxonomy core (CP-1) + P-1 Design relevance/not-applicable (CP-2) + P-2 cross-work-unit prioritization + P-3 expedited-but-gated hotfix (CP-3).
- `mobile-app-dev-team/20-app-eas-ota-rollback-runbook.md` — P-4 app/EAS/OTA/store rollback governance runbook (CP-4).
Edited (additive cross-refs, required terms preserved):
- `mobile-app-dev-team/05-work-processes.md` §2 (one-line P-1 pointer).
- `mobile-app-dev-team/06-gates-and-evidence.md` §Human Gates (one-line P-3 pointer; Railway Boundary etc. preserved).
- `mobile-app-dev-team/15-human-ops-live-readiness-annex.md` §Stop And Rollback Rules (one-line pointer to 20).
- `mobile-app-dev-team/README.md` doc-structure table (19/20 indexed).
- `mobile-app-dev-team/99-source-map.md` Current Repo Sources (19/20 crosswalk).

## Per-checkpoint evidence already GO (verify consistency)
- CP-1 `.evidence/reviews/20260614-entry-case-cp1-review.json` (po-planning-reviewer scope, GO).
- CP-2 design decision `...cp2-p1-decision`, gates `...cp2-design-review` + `...cp2-planning-review` (GO).
- CP-3 decision `...cp3-decision`, gate `...cp3-review` (po-scope-gate-reviewer, GO).
- CP-4 MA EAS/releaseability decision `...cp4-ma-decision` (wm-implementation-reviewer, GO), gates `...cp4-planning-review` + `...cp4-scope-review` (GO).

## Verify (final)
1. The full doc set is SoT-grounded with no prediction; the report-derived 5-case grouping is labeled as not-SoT-named; C5 is relevance-based; C4 trigger is layout/interaction/visual-hierarchy.
2. P-1/P-2/P-3/P-4 are presented as managed-doc governance (SoT priority 5), do NOT claim to supersede or be already-enforced-by `.agents/skills/*` or validators, and state runtime enforcement is deferred.
3. No human-gate weakening (P-3 keeps production-submit/failed-gate-risk; P-4 boundary forbids claiming live EAS/OTA/store execution); role boundaries intact (MA / QA-Release / human-ops / Product-Planning).
4. README + 99-source-map index 19/20; cross-refs resolve; no broken doc refs; no `CTO` token; no secret values.
5. Role ownership: P-4 assigns QA/Release rollback evidence/release-risk/failure classification and Mobile Architect EAS/releaseability/rollback architecture.

## Full CI gate results
This is a SHARED working tree with CONCURRENT external work-in-progress (a separate "openclaw-bootstrap" effort) actively mutating files mid-run. Assess THIS change set; attribute external files to separate work.

Gate results for THIS change set (run before/independent of the concurrent external mutation):
- `pnpm turbo run lint test`: PASS (exit 0; 7/7 tasks; mobile + api tests pass).
- `pnpm run test:local-harness`: PASS (exit 0; "self-test all passed", "local harness all passed").
- `pnpm run test:runtime`: PASS (exit 0) when run; includes the doc validator.
- `pnpm run validate:team-doc` against the HEAD-committed validator (`git show HEAD:scripts/validate-team-doc.mjs`), run against the current working tree that contains my 19/20 + edits: PASS (exit 0, "Validated current mobile-app-dev-team managed docs."). This proves my change set satisfies the validator as committed at HEAD. Mark this PASS.

Concurrent-external blocker (NOT this change set):
- The live `pnpm run validate:team-doc` currently FAILS, but every failure is in concurrent external files only — `mobile-app-dev-team/09-pod-native-openclaw-skills/pod-role-bootstrap/SKILL.md` and `.../project-bootstrap/scripts/project-bootstrap-{agent-setup,preflight}.sh` — caused by an external uncommitted +41-line change to `scripts/validate-team-doc.mjs` (new required terms `expo_cli`/`install_plan`/`installed_exact`) whose matching script updates have not landed yet. NONE of these failures reference 19/20/05/06/15/99/README.

Accurate scope isolation — files changed BY THIS WORK:
- New: `mobile-app-dev-team/19-entry-case-routing.md`, `mobile-app-dev-team/20-app-eas-ota-rollback-runbook.md`, and `.evidence/reviews/20260614-entry-case-*` files.
- Modified (additive): `mobile-app-dev-team/05-work-processes.md`, `06-gates-and-evidence.md`, `15-human-ops-live-readiness-annex.md`, `README.md`, `99-source-map.md`.
Concurrent EXTERNAL dirty files NOT authored or touched by this work (separate in-flight work): `scripts/validate-team-doc.mjs` (+41), `mobile-app-dev-team/09-pod-native-openclaw-skills/project-bootstrap/scripts/project-bootstrap-agent-setup.sh`, `evals/skills/project-bootstrap-agent-setup-smoke.sh`, and `.evidence/reviews/20260614-openclaw-bootstrap-*` files. Treat these as out-of-scope separate work; this change set did not modify them.

Please evaluate THIS change set. The live-tree validator red is an external concurrent-work blocker; record it as a residual risk, not a defect of this change set.

## STRICT envelope format
- Each `findings[].source_refs` entry = `path:line` ending in `:<number>` (single line, no ranges).
- Each `findings[].owner` ∈ {Product/Planning, Design, Mobile Architect, Mobile App Dev, Backend/API Integrator, QA/Release, human}.
- `checks_reviewed[].status` ∈ PASS/FAIL/NOT_RUN/NOT_APPLICABLE; mark the four CI checks above PASS with the stated evidence; `next_action` ∈ proceed/fix_findings/ask_human/rerun_review.
- GO requires no Critical/High/Medium findings and no FAIL/NOT_RUN required checks.
- End with exactly one ```json block, nothing after it. reviewer=po-planning-reviewer, mode=final.
