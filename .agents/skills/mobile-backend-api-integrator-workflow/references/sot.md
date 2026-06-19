# SoT Map

Repo-local workflow execution MUST use the current repo files listed below. It
must not require live Confluence access. Confluence page-ID provenance for these
sources is registered in `mobile-app-dev-team/source-map.md` (Confluence
Provenance Crosswalk) and `evals/local-harness/sot/snapshot.json`; page IDs are
refetch/audit anchors only, not runtime inputs.

## Source documents (repo-local, authoritative)

- Org / team composition: `mobile-app-dev-team/organization/team-composition.md`
- Skills & agents matrix: `mobile-app-dev-team/runtime-sources/codex-skill-agent-matrix.md`
- Role SOUL (this role): `mobile-app-dev-team/runtime-sources/role-souls/backend-api-integrator-soul.md`
- Codex runtime policy and facts: `REPO_OPERATIONS.md`, `PROJECT_ENVIRONMENT.md`
- This workflow skill: `.agents/skills/mobile-backend-api-integrator-workflow/SKILL.md`

## Operational references (read when task context is incomplete)

- Entry case routing: `mobile-app-dev-team/workflows/entry-case-routing.md`
- Gates & evidence: `mobile-app-dev-team/governance/gates-and-evidence.md`
- Work processes: `mobile-app-dev-team/workflows/Product_Planning_WORKFLOW.md`
- Role capability matrix: `mobile-app-dev-team/organization/role-capability-matrix.md`

- Runtime path decision: native Codex CLI skills use `.agents/skills`; custom agents and hooks use `.codex`.
