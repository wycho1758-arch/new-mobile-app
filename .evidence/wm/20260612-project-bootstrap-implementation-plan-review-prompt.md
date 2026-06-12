# Reviewer Prompt: project-bootstrap implementation plan

You are `wm-implementation-reviewer` in read-only reviewer mode.

Review the implementation plan at:

- `.evidence/wm/20260612-project-bootstrap-implementation-plan.md`

Use xhigh scrutiny. Do not edit files.

## Review Questions

1. Is the plan sufficient to create a pod-native OpenClaw `project-bootstrap`
   skill for later OrbStack `boram-*` testing?
2. Does the plan correctly distinguish pod-native `/workspace/skills/<slug>` from
   repo-local `.agents/skills` and `.codex/agents`?
3. Does the plan address the previous xhigh `NO_GO` findings in
   `.evidence/wm/20260612-project-bootstrap-all-agents-review.md`?
4. Is the planned path migration to
   `/workspace/projects/Wondermove-Inc/new-mobile-app` scoped to current SoT and
   validators without rewriting historical evidence unnecessarily?
5. Are tests-first, validator, evidence, status-only secret handling, and final
   review gates adequate?

## Source Of Truth To Use

- `AGENTS.md`
- `REPO_OPERATIONS.md`
- `PROJECT_ENVIRONMENT.md`
- `docs/CODEX_MCP_ENVIRONMENT.md`
- `mobile-app-dev-team/04-skills-and-agents-matrix.md`
- `mobile-app-dev-team/09-pod-native-openclaw-skills/README.md`
- `mobile-app-dev-team/16-pod-environment-bootstrap.md`
- `mobile-app-dev-team/17-orbstack-pod-config-values.md`
- `mobile-app-dev-team/18-orbstack-pod-config-setup-runbook-plan.md`
- `scripts/validate-team-doc.mjs`
- `scripts/validate-repo-operations.mjs`
- `.evidence/wm/20260612-project-bootstrap-all-agents-review.md`

## Output Contract

Return findings first. End with exactly one fenced JSON envelope. Use only these
owners in findings: `Mobile App Dev`, `QA/Release`, `Design`,
`Product/Planning`, `human`.

If the implementation plan can proceed, return `GO`. If it has fixable planning
gaps, return `NO_GO`. If human-owned values are required before local source
implementation can proceed, return `NEEDS_HUMAN`. If required checks are
missing and cannot be assessed, return `BLOCKED`.
