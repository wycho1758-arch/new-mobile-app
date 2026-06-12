# Project Bootstrap Agent-Owned Blocker Plan

Date: 2026-06-12
Scope: `mobile-app-dev-team/09-pod-native-openclaw-skills/project-bootstrap`
Request: identify setup items that agents can resolve directly but may currently be reported to humans or left as blockers.

## Cold Judgment

The previous role identity fix is necessary but not sufficient. The current flow still has several setup cases where the agent has enough local SoT to act, yet the skill can still stop with a blocker or ask the user. These should be changed into deterministic agent-owned resolution steps before the final blocker report.

The skill must keep a strict boundary: local config, role identity, generated non-sensitive reports, package manager activation, and repo-scoped readiness files can be handled by the agent. External accounts, credentials, billing, production release actions, approvals, and failed-gate risk acceptance remain human-owned.

## P0 Changes

1. Required Codex MCP registration

- Current risk: `mobile-mcp`, `serena`, and `stitch` can be reported as missing even though `.codex/config.toml` and `docs/CODEX_MCP_ENVIRONMENT.md` provide local registration SoT.
- Required update: add a mandatory "agent-owned MCP registration" step before final blocker classification.
- Agent action: inspect repo MCP SoT, register missing non-sensitive server commands through Codex CLI, then rerun the relevant preflight.
- Human boundary: account login, cloud project authority, and unavailable credentials stay as blockers.

2. Codex CLI setup ordering

- Current risk: project preflight can fail on missing Codex CLI before the `codex-cli-auth-setup` skill gets a chance to run.
- Required update: reorder project-bootstrap so Codex CLI availability/auth setup is checked before repo preflight is allowed to become terminal.
- Agent action: if the setup skill exists, run its local status/setup path first. Only report a blocker when the CLI is unavailable after the setup path or requires human login.

3. Managed path registry

- Current risk: missing `/workspace/CODEX_MANAGED_PATHS.md` or missing repo entry is treated as a blocker even though it is a local non-sensitive file.
- Required update: create or update the registry from the discovered repo path.
- Agent action: add the canonical repo path entry with duplicate-safe matching and rerun preflight.
- Human boundary: wrong repo path, missing checkout, or conflicting managed ownership remains a blocker.

4. Role-specific setup reports

- Current risk: Design and QA roles can block on missing setup reports even though the relevant local setup skills contain status-only checks.
- Required update: run local status-only setup report generation before final blocker classification.
- Agent action: for Design, run Stitch ADC setup status collection when the skill exists. For QA/Release, run EAS robot auth setup status collection when the skill exists.
- Human boundary: login, cloud project selection, store credentials, or live external changes remain human-owned.

## P1 Changes

5. Git identity

- Agent-owned only when an approved identity source is already available from local handoff, mounted configuration, or repo-approved defaults.
- The agent must not invent author name or email.
- If no approved source exists, report a human-owned identity blocker with a small markdown guide.

6. GitHub authentication

- Agent-owned when local authenticated CLI state or mounted auth material already exists and only verification/setup-git is needed.
- Human-owned when interactive login or new credential provisioning is required.
- The skill must never ask for secrets in chat.

7. Package manager pin

- Agent-owned through the existing pod bootstrap path: `corepack enable`, pinned pnpm activation, then install with the repository lockfile.
- The skill should state this as a normal setup action, not a user decision.

8. Repo checkout

- Agent-owned when a non-sensitive clone URL and target path are already known.
- Human-owned when access, authority, or the correct remote is unknown.

9. Conditional MCPs

- Expo, Atlassian, and Playwright MCP setup should be attempted only when SoT says they are required for the current role/work unit and registration is credential-free.
- Auth or account steps remain human-owned.

## Not In First Implementation

Missing `/workspace/skills/<slug>` runtime skill directories should not be silently copied as part of the first fix. The existing repo policy treats OpenClaw packaging as an external runtime artifact path. A later change may define a verified source-to-runtime sync, but it needs its own reviewer gate.

## Required Documentation Updates

- `project-bootstrap/SKILL.md`
  - Add an "agent-owned setup before blocker report" phase.
  - Require MCP registration attempt, Codex setup ordering, managed path repair, and role-specific status report generation.
  - Require rerunning preflight after each fix batch.

- `project-bootstrap/references/blocker-resolution-guide.md`
  - Add a blocker classification table: agent-owned, agent-owned if approved source exists, human-owned.
  - Replace wording that implies the user chooses role or setup values when the agent can derive them from SoT.
  - Add user-facing guide paths for true human blockers only.

- Validators
  - Extend runtime document validators to require the new agent-owned setup phase and the human-owned boundary terms.
  - Add focused smoke fixtures for at least:
    - missing required MCP
    - missing Codex CLI preflight ordering
    - missing managed path registry
    - missing role-specific setup report

## Acceptance Criteria

- Missing role identity remains agent-owned and derived from pod SoT.
- Missing required MCPs are attempted locally before being reported.
- Missing managed path registry is repaired locally when the repo path is known.
- Role-specific status reports are generated locally before final blocker reporting.
- The final blocker report contains only unresolved human-owned or externally gated items.
- Validation evidence includes runtime validators, focused smoke checks, and reviewer approval.

## Verification Plan

- `node scripts/validate-repo-operations.mjs`
- `node scripts/validate-team-doc.mjs`
- new focused smoke scripts or fixtures for the setup cases above
- `bash -n mobile-app-dev-team/09-pod-native-openclaw-skills/project-bootstrap/scripts/project-bootstrap-preflight.sh`
- `pnpm run test:runtime`
- `pnpm run test:local-harness`
- `git diff --check`
- `node scripts/validate-evidence-hygiene.mjs --self-test && node scripts/validate-evidence-hygiene.mjs`

## Reviewer Questions

- Does the plan correctly distinguish local agent-owned setup from human-owned external authority?
- Does the plan avoid weakening credential, approval, or production release boundaries?
- Are the first implementation boundaries narrow enough for project-bootstrap only?
