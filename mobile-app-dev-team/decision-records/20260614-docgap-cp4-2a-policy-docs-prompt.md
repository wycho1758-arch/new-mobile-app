# CP-4 Phase 2A Review Request — policy docs (G4 / G7 / G8)

Mode: final.

Scope: Phase 2A of the doc-gap remediation goal plan (worktree branch `chore/doc-gap-remediation`, based on HEAD with CP-1/CP-2/CP-3 already applied). Three documentation-only changes:

1. **G4 — Plan Lifecycle (`REPO_OPERATIONS.md`)**: new "## Plan Lifecycle" section inserted before "## Source And Archive Rules". States that `docs/plans/active/` is an intentionally gitignored local scratch workspace (not tracked, not PR-shared, not a cleanup/archival target), `docs/plans/work-units/` is the tracked durable structure enforced by `scripts/validate-work-units.mjs`, and `mobile-app-dev-team/_archive/` holds completed team plans (archive-eligible after PR merge + terminal status, preserving source-map crosswalks validated by `scripts/validate-team-doc.mjs`).

2. **G8 — references/sot.md convention note (`REPO_OPERATIONS.md`)**: in "OpenClaw And Codex Operational Boundaries", clarifies that a skill's only required entrypoint is `SKILL.md`; `references/sot.md` is an OPTIONAL aid used by some role skills (currently `mobile-app-dev-workflow`, `mobile-backend-api-integrator-workflow`), not required, not uniform, and its absence on `mobile-architect-workflow` is an accepted exception (validators do not require it).

3. **G7 — forward-reference (`AGENTS.md`)**: after the policy-ownership line, adds a forward-reference to `REPO_OPERATIONS.md` → "Skill, Agent, And AGENTS.md Terminology" for canonical term definitions instead of relying on repeated path lists.

Goal: resolve documented gaps G4 (no plan-lifecycle policy), G7 (one-directional entrypoint framing), G8 (references/sot.md convention ambiguity) — without breaking validators.

Verify (read-only):
1. Factual accuracy vs repo: `docs/plans/active/` IS gitignored (`.gitignore`); `docs/plans/work-units/` IS validated by `scripts/validate-work-units.mjs`; only `mobile-app-dev-workflow` and `mobile-backend-api-integrator-workflow` have `references/sot.md` (so the G8 statement is true and `mobile-architect-workflow` indeed lacks it); validators do NOT require `references/sot.md`.
2. No validator-required terminology strings were removed from `REPO_OPERATIONS.md` or `AGENTS.md` (requireTerms must still pass).
3. No SoT contradiction: Plan Lifecycle is consistent with the existing Tracking-note convention; the references/sot.md note is consistent with AGENTS.md "skill's primary artifact is SKILL.md".

Quality gates already run (all PASS / exit 0): `validate:repo-operations`, `validate:team-doc`, runtime-artifacts + codex self-test, `validate:project-environment`.

Decide GO / NO_GO with a machine-readable verdict envelope.
