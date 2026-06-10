# Repo-Local Codex Runtime

Status: reusable template guidance
Source class: reference
Upstream SoT:

- `AGENTS.md`
- `PROJECT_ENVIRONMENT.md`
- `team-doc/mobile-app-dev-team/04-skills-and-agents-matrix.md`

Downstream consumers:

- `team-doc/mobile-app-dev-team/ref-organization/05-skills-agents-and-tools/`
- Future repo-local Codex runtime docs.

Last reviewed date: 2026-06-10
Reviewer evidence: .evidence/reviews/ref-organization-checkpoint-3-xhigh-20260610.md

## Boundary

Repo-local Codex runtime artifacts are committed in the repository and validated by repo-local gates.

Primary paths:

- `.agents/skills/<skill-name>/SKILL.md`
- `.codex/agents/<agent-name>.toml`
- `.codex/hooks.json`
- `.codex/hooks/`
- `.codex/config.toml`
- `evals/{skills,agents,hooks,local-harness}/`
- `.evidence/`

This surface is repo-local Codex. It is not `/workspace/skills/<slug>/SKILL.md`, and it is not `/workspace/codex-hooks`.

## Use

Use this surface for:

- repo-local skills such as `$wm`
- read-only reviewer/researcher custom agents
- repo-local hooks and MCP registration
- runtime validators and eval fixtures

## Evidence Boundary

`pnpm run validate:team-doc`, `pnpm run test:runtime`, and `pnpm run test:local-harness` validate local repository structure and runtime contracts. They do not prove actual OpenClaw pod execution.
