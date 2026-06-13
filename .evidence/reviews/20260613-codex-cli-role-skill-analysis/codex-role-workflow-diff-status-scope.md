# Codex Role Workflow Diff And Status Scope

Date: 2026-06-13
Branch: `fix/project-bootstrap-agent-language-ux`
Baseline: `a8eb0b862a4e8bd3d0eca6c344d1bb9b9d3e1452`

## Purpose

This file separates the actual role-skill implementation scope from other dirty worktree paths so the final report does not misstate what was applied.

## In-Scope Applied Skill Paths

- Repo-local Codex skill:
  - `.agents/skills/mobile-architect-workflow/SKILL.md`
- Pod-native OpenClaw skill source:
  - `mobile-app-dev-team/09-pod-native-openclaw-skills/codex-role-workflow/SKILL.md`
- Pod runtime shape documented by the source skill:
  - `/workspace/skills/codex-role-workflow/SKILL.md`

The physical `/workspace/skills/codex-role-workflow/SKILL.md` file is not created by this local repo change. Per `AGENTS.md` and `REPO_OPERATIONS.md`, this repository authors the pod-native source under `mobile-app-dev-team/09-pod-native-openclaw-skills/<slug>/`; live `/workspace` packaging is an external runtime proof surface outside the active local harness scope.

## In-Scope Reinforced Existing Skills

- `.agents/skills/design-mobile-design-handoff/SKILL.md`
- `.agents/skills/design-stitch-mcp-operating-rules/SKILL.md`
- `.agents/skills/mobile-app-dev-workflow/SKILL.md`
- `.agents/skills/mobile-backend-api-integrator-workflow/SKILL.md`
- `.agents/skills/e2e-test/SKILL.md`
- `.agents/skills/qa-railway-workflow/SKILL.md`

## In-Scope Validators, Evals, And SoT Crosswalk

- `scripts/validate-runtime-artifacts.mjs`
- `scripts/validate-team-doc.mjs`
- `evals/local-harness/sot/snapshot.json`
- `evals/skills/codex-role-workflow/*`
- `evals/skills/mobile-architect-workflow/*`
- New role-specific reinforcement fixtures under:
  - `evals/skills/design-mobile-design-handoff/*`
  - `evals/skills/design-stitch-mcp-operating-rules/*`
  - `evals/skills/mobile-app-dev-workflow/*`
  - `evals/skills/mobile-backend-api-integrator-workflow/*`
  - `evals/skills/e2e-test/*`
  - `evals/skills/qa-railway-workflow/*`
- `mobile-app-dev-team/04-skills-and-agents-matrix.md`
- `mobile-app-dev-team/09-pod-native-openclaw-skills/README.md`
- `mobile-app-dev-team/02-role-souls/mobile-architect-soul.md`
- `.evidence/reviews/20260613-codex-cli-role-skill-analysis/*`

## Existing Dirty Paths Not Claimed As New Role-Skill Work

The following paths are dirty in the same worktree, but they belong to earlier project-bootstrap/MCP/environment work and must not be reported as newly created by the role-skill implementation:

- `.codex/config.toml`
- `PROJECT_ENVIRONMENT.md`
- `docs/CODEX_MCP_ENVIRONMENT.md`
- `mobile-app-dev-team/09-pod-native-openclaw-skills/project-bootstrap/SKILL.md`
- `mobile-app-dev-team/09-pod-native-openclaw-skills/project-bootstrap/references/blocker-resolution-guide.md`
- `mobile-app-dev-team/09-pod-native-openclaw-skills/project-bootstrap/references/report-template.md`
- `mobile-app-dev-team/09-pod-native-openclaw-skills/project-bootstrap/scripts/project-bootstrap-agent-setup.sh`
- `mobile-app-dev-team/09-pod-native-openclaw-skills/project-bootstrap/scripts/project-bootstrap-preflight.sh`

`evals/skills/project-bootstrap-agent-setup-smoke.sh` was already dirty from project-bootstrap work. During Phase 3, one coverage-label line was added to satisfy `validate:team-doc` for the existing required term `approved MCP/tool-auth config`; no smoke execution behavior was changed for the role-skill implementation.

## Remaining Untracked Evidence Outside This Scope

The following untracked evidence paths remain outside the role-skill implementation scope and are not claimed as final role-skill deliverables:

- `.evidence/reviews/20260613-codex-cli-role-skill-analysis-plan*.md/json`
- `.evidence/reviews/20260613-codex-cli-role-skill-analysis-report*.md/json`
- `.evidence/reviews/20260613-pr12-auto-merge-settings-review.json`
- `.evidence/reviews/20260613-project-bootstrap-required-env-*`
- `.evidence/wm/claude-port/*`
- `.evidence/wm/project-bootstrap/20260613-minimal-human-help-ux-review.md`

## Diff Visibility Fix

The new role-skill artifacts were marked with `git add -N` so `git diff --name-status` and `git diff --stat` include them as `A` without creating a commit or completing staging. This makes the final diff/status package inspectable while preserving the current no-commit state.
