# Reviewer Prompt: project-bootstrap all-agents readiness

You are `wm-implementation-reviewer` in read-only reviewer mode.

Review whether the proposed `project-bootstrap` pod-native skill scope is sufficient to make all repo-local Codex agents under `.codex/agents/` and all skills under `.agents/skills/` operational inside OrbStack `boram-*` pods.

Use xhigh scrutiny. Findings first. Do not edit files.

## User Goal

The integrated pod-native skill is intended to configure OrbStack `boram-*`, not the local macOS repo. It should:

- clone `https://github.com/Wondermove-Inc/new-mobile-app.git` into `/workspace/projects/Wondermove-Inc/new-mobile-app`;
- register `mobile-app-dev-team/09-pod-native-openclaw-skills/codex-cli-auth-setup` as `/workspace/skills/codex-cli-auth-setup`;
- rename/author the bootstrap skill as `project-bootstrap`, not `orbstack-project-bootstrap`;
- update `/workspace/AGENTS.md` with project workspace defaults;
- install/verify Codex CLI and project setup;
- record progress and create a reusable integrated skill;
- include a QC checklist.

The user now states the current plan appears incomplete because it omits MCP installation and project information such as Stitch GCP project information, Expo, Railway, and other setup required to run all agents and skills.

## Source Of Truth To Check

- `AGENTS.md`
- `PROJECT_ENVIRONMENT.md:270`
- `PROJECT_ENVIRONMENT.md:329`
- `docs/CODEX_MCP_ENVIRONMENT.md:10`
- `docs/CODEX_MCP_ENVIRONMENT.md:40`
- `docs/CODEX_MCP_ENVIRONMENT.md:110`
- `docs/CODEX_MCP_ENVIRONMENT.md:260`
- `docs/CODEX_MCP_ENVIRONMENT.md:290`
- `docs/CODEX_MCP_ENVIRONMENT.md:348`
- `docs/CODEX_MCP_ENVIRONMENT.md:432`
- `docs/CODEX_MCP_ENVIRONMENT.md:483`
- `docs/CODEX_MCP_ENVIRONMENT.md:569`
- `.codex/config.toml:1`
- `.agents/skills/design-stitch-mcp-operating-rules/SKILL.md:18`
- `.agents/skills/qa-railway-workflow/SKILL.md:20`
- `docs/SETUP.md:12`
- `docs/SETUP.md:110`
- `docs/CREDENTIALS.md:10`
- `mobile-app-dev-team/17-orbstack-pod-config-values.md:12`
- `mobile-app-dev-team/17-orbstack-pod-config-values.md:54`
- `.codex/agents/`
- `.agents/skills/`

## Questions

1. Is clone + Codex CLI + `/workspace/AGENTS.md` defaults sufficient to run all `.codex/agents` and `.agents/skills`?
2. What MCP servers, CLIs, accounts, secret references, project IDs, and human-gated statuses must be added to the `project-bootstrap` plan?
3. Does the requested new path `/workspace/projects/Wondermove-Inc/new-mobile-app` conflict with the current SoT that still names `/workspace/new-mobile-app`?
4. What QC checklist is required before declaring the pod environment operational?

## Reviewer Output Contract

Return findings first, then a concise readiness decision.

End with exactly one fenced JSON envelope. Use only these owners in findings: `Mobile App Dev`, `QA/Release`, `Design`, `Product/Planning`, `human`.

The JSON envelope must include:

- `verdict`: `GO`, `NO_GO`, `NEEDS_HUMAN`, or `BLOCKED`
- `reviewer`
- `mode`
- `scope`
- `findings`
- `checks_reviewed`
- `residual_risks`
- `next_action`

If required checks are missing, use `BLOCKED`. If current scope is insufficient but fixable in planning, use `NO_GO`. If a human-owned credential or platform decision is the blocker, use `NEEDS_HUMAN`.
