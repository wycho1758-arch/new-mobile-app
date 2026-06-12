# Project Bootstrap Blocker Guide Plan

Date: 2026-06-12
Workflow: `$wm`
Owner role: Mobile App Dev / runtime-doc implementation

## Scope

Update only the repo-local `project-bootstrap` pod-native OpenClaw skill so that
pre-bootstrap blocker candidates produce actionable user-facing Markdown
guidance. The skill must prefer agent/tool/browser-resolvable actions where
safe, and reserve user action for credentials, identity choices, or human-gated
external operations.

## Current Worktree Baseline

`project-bootstrap` already has uncommitted edits from the immediately previous
user-requested `WM_ROLE` canonicalization task. That prior task was completed
and reviewed at
`.evidence/wm/20260612-project-bootstrap-wm-role-canonical-review.md`.

This blocker-guide task treats those existing edits as current local baseline
and will not revert them. New blocker-guide implementation begins only after
this corrected plan is reviewed, and the first new source change after plan
approval will be validator/assertion coverage. Final review must inspect the
entire affected `project-bootstrap` diff because both local changes are still
uncommitted.

## SoT Inputs

- `AGENTS.md`: runtime changes require repo validation and evidence; do not
  modify external runtime repositories.
- `.agents/skills/wm/SKILL.md`: plan before non-trivial work, use SoT-grounded
  planning, TDD first, and require plan/final reviewer evidence.
- `PROJECT_ENVIRONMENT.md`: `project-bootstrap` runtime shape is
  `/workspace/skills/project-bootstrap/SKILL.md`; default report is
  `/workspace/state/project-bootstrap-report.json`.
- `mobile-app-dev-team/16-pod-environment-bootstrap.md`: pod bootstrap config
  keys include `WM_ROLE`, `WM_EXPECTED_ROLE`, `/workspace/IDENTITY`,
  `/workspace/CODEX_MANAGED_PATHS.md`, `REPO_PATH`, and report paths.
- `mobile-app-dev-team/09-pod-native-openclaw-skills/project-bootstrap/SKILL.md`:
  project-bootstrap is status-only, must not run live external actions, and must
  stop before human-gated work.
- `mobile-app-dev-team/09-pod-native-openclaw-skills/project-bootstrap/scripts/project-bootstrap-preflight.sh`:
  current blocker list includes role identity, canonical role mismatch, repo
  path/SoT files, managed path, required skills, Codex CLI, MCPs, and
  role-specific setup reports.
- `scripts/codex-preflight.mjs`: downstream pod blockers include
  `missing-role-identity`, `pnpm-pin-mismatch`, `git-identity-missing`,
  `github-auth-unavailable`, `codex-mcp-unavailable`, and related runtime
  readiness blockers.

## Planned Changes

1. Add a TDD/validator assertion before implementation:
   - require a new `references/blocker-resolution-guide.md`;
   - require `PROJECT_BOOTSTRAP_BLOCKERS_MD_PATH` and
     `project-bootstrap-blockers.md` references in the skill/script/template.
2. Add `references/blocker-resolution-guide.md` with:
   - blocker categories from the user-provided precheck;
   - canonical role identity setup;
   - pnpm/corepack behavior and install-impact warning;
   - git identity setup;
   - GitHub auth safety guidance;
   - Codex MCP readiness guidance;
   - explicit agent/tool/browser-use guidance for what the LLM may resolve
     itself versus what needs user-provided secret/account decisions.
3. Update `project-bootstrap-preflight.sh` to generate a Markdown blocker guide
   when blockers exist:
   - default path:
     `/workspace/state/project-bootstrap-blockers.md`;
   - configurable with `PROJECT_BOOTSTRAP_BLOCKERS_MD_PATH`;
   - include detected blockers, report path, role status, CLI/MCP status,
     generated-at timestamp, and the reference guide;
   - record the blocker guide path in the JSON report.
4. Update `SKILL.md` and `references/report-template.md` to describe the new
   blocker guide artifact and how users should receive it.

## Tests And Evidence

- Command/smoke evidence will be recorded at
  `.evidence/wm/20260612-project-bootstrap-blocker-guide-command-evidence.md`.
- Plan review evidence path:
  `.evidence/wm/20260612-project-bootstrap-blocker-guide-plan-review.md`.
- Final review prompt/evidence paths:
  `.evidence/wm/20260612-project-bootstrap-blocker-guide-final-review-prompt.md`
  and
  `.evidence/wm/20260612-project-bootstrap-blocker-guide-final-review.md`.
- `bash -n mobile-app-dev-team/09-pod-native-openclaw-skills/project-bootstrap/scripts/project-bootstrap-preflight.sh`
- `git diff --check -- mobile-app-dev-team/09-pod-native-openclaw-skills/project-bootstrap scripts/validate-repo-operations.mjs scripts/validate-team-doc.mjs`
- smoke run with blocker candidates to verify a Markdown blocker guide is
  generated and report contains its path;
- `node scripts/validate-repo-operations.mjs`
- `node scripts/validate-team-doc.mjs`
- `pnpm run test:runtime`
- `pnpm run test:local-harness`
- `pnpm turbo run lint test`
- `pnpm run validate:evidence-hygiene`

## Gate Impact

This does not execute `pod-role-bootstrap`, `pnpm install`, EAS, GitHub auth, or
live external commands. It improves pre-bootstrap user handoff and keeps
status-only reporting.

## Review Routing

Plan review: `wm-implementation-reviewer`, xhigh, before implementation.

Final review: `wm-implementation-reviewer`, xhigh, after diff and command
evidence.
