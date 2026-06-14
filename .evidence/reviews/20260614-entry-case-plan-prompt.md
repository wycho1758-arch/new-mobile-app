# Plan review request — entry-case taxonomy formalization + SoT gap docs (P-1~P-4)

You are `po-planning-reviewer`. Review the IMPLEMENTATION PLAN below for: SoT-grounding (no prediction), scope discipline (doc-only binding respected), role boundaries (Product/Planning does not collapse Design/Architect/Backend/QA ownership), and adequacy of per-checkpoint reviewer gating. Operate read-only. Emit exactly one fenced ```json verdict envelope at the end; reviewer must equal po-planning-reviewer; mode=plan.

## Plan summary

**Goal**: Formalize the validated entry-case routing taxonomy and four SoT gaps (P-1~P-4) into managed team docs under `mobile-app-dev-team/` ONLY (SoT priority 5). Runtime binding into `.agents/skills/*/SKILL.md` and validators is explicitly OUT OF SCOPE (deferred to a follow-up goal).

**Verified conclusions to be documented (all SoT-cited)**:
- All input enters Product/Planning intake first — `po-work-unit-planning-and-agent-sprint/SKILL.md:8`.
- The "5 cases" are a report-derived taxonomy, NOT SoT-named; SoT-named input categories are modification request / issue·bug·failure request / direct implementation language / proactive report + broad·ready·unclear PRD routing — `…SKILL.md:21,29,31-34,43`.
- C5 (no screen) is relevance-based conditional routing, not a fixed path: Mobile Architect only on architecture/runtime/route-state/API/releaseability risk (`05-work-processes.md:10`), Backend/API only on API-backed task/contract uncertainty (`:28`), Implementation always via owning role (`:35,41`).
- C4 (with screen) design trigger = layout/interaction/visual-hierarchy importance, not literally "has a screen" (`design-mobile-design-handoff/SKILL.md:35`).
- P-1: `not-applicable` state already exists in `work-unit-machine.mjs`; only the Design-relevance application criteria are missing → define criteria (doc only).
- P-2/P-3: ABSENT gaps → new rules. P-3 = expedited-but-still-gated, NOT a bypass; production-submit human gate is retained (`05-work-processes.md:54`; `06-gates-and-evidence.md` Human Gates).
- P-4: NOT absent = partially defined (rollback_owner/plan `15-human-ops-live-readiness-annex.md:47-48`; human/ops ownership `:134-135`; backend rollback-note `10-github-artifact-workflow.md:195`, `05-work-processes.md:31`; NativeWind criteria `PROJECT_ENVIRONMENT.md:104-106`). Remaining gap = complete app/EAS/OTA rollback runbook.

**Deliverables / target files** (new docs numbered 19/20 because 08/18 are archived plan numbers):
- NEW `mobile-app-dev-team/19-entry-case-routing.md` — taxonomy + input-category mapping + 5-case derived label + C1~C5 (C5 relevance routing) + E1~E16 + P-1 Design relevance/NOT_APPLICABLE criteria + P-2 cross-work-unit prioritization/conflict + P-3 expedited-but-gated hotfix path.
- NEW `mobile-app-dev-team/20-app-eas-ota-rollback-runbook.md` — P-4 complete runbook built on existing partial governance.
- EDIT (minimal cross-ref only, preserve existing required terms): `README.md` (index table adds 19/20), `99-source-map.md` (crosswalk), `05-work-processes.md` §2 (one-line P-1 pointer), `06-gates-and-evidence.md` (one-line P-3 pointer; keep Railway Boundary required terms), `15-human-ops-live-readiness-annex.md` (one-line rollback↔20 pointer).

**Validator/CI constraints (verified)**: `mobile-app-dev-team/**` changes ARE in the CI quality gate — `.github/workflows/quality-gate.yml` runs `pnpm run test:runtime` (includes `validate:team-doc`) + `pnpm turbo run lint test` on every PR, and `mobile-app-dev-team/.*` is in the runtime-changes grep so `pnpm run test:local-harness` is triggered too. So these are REQUIRED checks (NOT NOT_APPLICABLE). `validate-team-doc.mjs` is the narrowest doc test (tests-first anchor); adding new docs needs no validator edit; all `.md` are swept to forbid the `CTO` token and secret-like patterns.

**Content guardrail for new docs 19/20 (verify)**: new docs are managed-doc governance at SoT priority 5 and must NOT claim to "supersede" or be "already enforced by" the higher-priority `.agents/skills/*` or runtime validators; each new doc states runtime enforcement is a deferred follow-up.

**Gate-check labeling (verify envelope-rule alignment)**: intermediate CPs mark lint/test/runtime/local-harness as `NOT_APPLICABLE until CP-5` (source-backed: the full gate runs once at CP-5), NOT `NOT_RUN` (NOT_RUN would force BLOCKED and block per-CP GO). `validate:team-doc` runs each CP and its PASS is attached as evidence. CP-5 actually runs `test:runtime` + `lint test` + `test:local-harness` and records exit 0.

**Checkpoint plan (each gated by codex headless reviewer; advance only on GO with empty findings AND `pnpm run validate:team-doc` PASS; final CP runs the full gate for real)**:
- CP-0 (this) plan review — po-planning-reviewer mode=plan.
- CP-1 19 taxonomy core (`19-entry-case-routing.md`) — po-planning-reviewer (scope).
- CP-2 P-1 Design relevance/NOT_APPLICABLE in 19 + 05 §2 pointer — design-reviewer then po-planning-reviewer.
- CP-3 P-2 + P-3 governance in 19 + 06 cross-ref; P-3 doc explicitly names QA/Release as owner of post-hotfix evidence, release-risk summary, and failure classification (capability matrix:10, qa-release-soul) — po-scope-gate-reviewer (incl. QA/Release ownership coverage).
- CP-4 P-4 runbook (new `20-app-eas-ota-rollback-runbook.md`); role split documented: Mobile Architect owns releaseability/EAS strategy/rollback architecture and route-state impact (ADR/risk note, capability matrix:7); QA/Release owns rollback evidence (EAS Update channel/store/native), release-risk summary, and failure classification (capability matrix:10); external rollback execution stays with human/ops owner (15-annex:134-135); Product/Planning owns routing and human gates. CP-4 pass requires REAL evidence: (a) Mobile Architect EAS/releaseability review recorded under `.evidence/reviews/` or work-unit handoff, (b) QA/Release rollback evidence ownership stated in doc + evidence — both attached as evidence paths in the envelope. Reviewer: po-planning-reviewer (Mobile Architect + QA/Release ownership coverage) + po-scope-gate-reviewer for human-gate/risk parts.
- CP-5 index/crosswalk consistency (README + 99-source-map + cross-refs + ref-integrity grep) + run the full CI gate for real (`test:runtime` + `lint test` + `test:local-harness`, all exit 0) — po-planning-reviewer mode=final.
Each CP: edit docs → run `pnpm run validate:team-doc` until PASS → reviewer check; Critical/High/Medium finding ⇒ fix and re-review until GO before next CP. Evidence under `.evidence/reviews/20260614-entry-case-cp<N>-*.{md,json}`.

**Verification**: all CP envelopes GO and `validate:team-doc` PASS; CP-5 runs the full CI gate (test:runtime + lint test + test:local-harness) with exit 0 recorded as evidence; grep confirms 19/20 indexed in README and 99-source-map updated; cited paths in 19/20 exist; zero broken doc refs; no `CTO` token or secret patterns; `git status` confirms changed files within intended scope; pre-existing unrelated dirty-worktree changes untouched.

## Review focus questions
1. Is any documented conclusion stated beyond what SoT literally supports?
2. Is doc-only binding scope coherent, and is deferring runtime binding to a follow-up goal a sound, clearly-bounded decision?
3. Are the per-checkpoint reviewer assignments appropriate (po-planning vs design vs po-scope-gate)?
4. Does the plan preserve role boundaries and the no-human-gate-bypass rule (esp. P-3)?

End with exactly one fenced ```json envelope (verdict/reviewer/mode/scope/findings/checks_reviewed/residual_risks/next_action), reviewer=po-planning-reviewer, mode=plan.

STRICT envelope format (validator-enforced — follow exactly or the envelope is rejected):
- Every `findings[].source_refs` entry MUST be a `path:line` string ending in `:<number>` (e.g. `mobile-app-dev-team/05-work-processes.md:47`). Never use line ranges like `:47-55`; pick a single line.
- Every `findings[].owner` MUST be exactly ONE of: `Product/Planning`, `Design`, `Mobile Architect`, `Mobile App Dev`, `Backend/API Integrator`, `QA/Release`, `human`. Do NOT combine owners (no "X with Y").
- `checks_reviewed[].status` ∈ PASS/FAIL/NOT_RUN/NOT_APPLICABLE; `next_action` ∈ proceed/fix_findings/ask_human/rerun_review. GO requires no Critical/High/Medium findings and no FAIL/NOT_RUN required checks.
