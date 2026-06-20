---
name: openclaw-pod-skills-sync
description: Copy-sync repo-authored pod-native OpenClaw skills into the runtime /workspace/skills snapshot, apply common and role-specific workspace operating files, and verify the setup rule before project-bootstrap runs.
---

# OpenClaw Pod Skills Sync

Use this pod-native OpenClaw skill after `git clone` or `git pull` for
WonderMove `new-mobile-app`, before running `project-bootstrap`.

Runtime shape:

```text
/workspace/skills/openclaw-pod-skills-sync/SKILL.md
```

Primary sync script:

```text
/workspace/skills/openclaw-pod-skills-sync/scripts/sync-pod-skills.sh
```

## Codex run materialization

This skill also materializes the `codex-interactive-repo-work` runtime launch
wrapper from repo SoT to `/workspace/codex-hooks/codex-run`. See:

```text
mobile-app-dev-team/runtime-sources/skills/openclaw-pod-skills-sync/references/codex-run-materialization.md
```

The live hook is runtime proof only. Repo source remains authoritative.

## Responsibility

This skill has one responsibility: copy sync the repo SoT
`mobile-app-dev-team/runtime-sources/skills` into the runtime snapshot
`/workspace/skills`, then apply the required workspace operating files:
common `/workspace/ORGANIZATIONS.md` plus role-specific `/workspace/AGENTS.md`,
`/workspace/WORKFLOW.md`, `/workspace/HEARTBEAT.md`, and `/workspace/TOOLS.md`.

The repo SoT remains authoritative. `/workspace/skills` is a runtime snapshot,
not the source of truth. The default mode is copy sync, not symlink.

`/workspace/ORGANIZATIONS.md` is guidance only. It describes organization,
reporting, routing, approval boundaries, and escalation expectations. It is not
a SOUL.md role contract, an approval-enforcement mechanism, or a deterministic
gate.

Role-specific workspace operating files are selected only through explicit role
slug mapping:

- `product-planning` -> `Product_Planning`
- `design` -> `Design`
- `mobile-architect` -> `Mobile_Architect`
- `mobile-app-dev` -> `Mobile_App_Dev`
- `backend-api-integrator` -> `Backend_API_Integrator`
- `qa-release` -> `QA_Release`

Unknown roles, missing role files, unreadable role files, candidate source-root
ambiguity, legacy source-root detection, and role mismatches fail closed. The
script must not silently apply files for a different role.

## Default Paths

- Repo path: `/workspace/projects/Wondermove-Inc/new-mobile-app`
- Source root:
  `/workspace/projects/Wondermove-Inc/new-mobile-app/mobile-app-dev-team/runtime-sources/skills`
- Runtime root: `/workspace/skills`
- Workspace instructions: `/workspace/AGENTS.md`
- Workspace workflow: `/workspace/WORKFLOW.md`
- Workspace heartbeat: `/workspace/HEARTBEAT.md`
- Workspace tools: `/workspace/TOOLS.md`
- Organizations source:
  `/workspace/projects/Wondermove-Inc/new-mobile-app/mobile-app-dev-team/runtime-sources/organizations/ORGANIZATIONS.md`
- Workspace organizations guidance: `/workspace/ORGANIZATIONS.md`
- Report: `/workspace/state/openclaw-pod-skills-sync-report.json`

## Usage

```bash
bash /workspace/skills/openclaw-pod-skills-sync/scripts/sync-pod-skills.sh
```

The script accepts non-secret path overrides for local smoke tests and pod
variants:

- `OPENCLAW_POD_SKILLS_REPO_PATH`
- `OPENCLAW_POD_SKILLS_SOURCE_ROOT`
- `OPENCLAW_POD_SKILLS_CANDIDATE_ROOT`
- `OPENCLAW_POD_SKILLS_LEGACY_SOURCE_ROOT`
- `OPENCLAW_POD_SKILLS_ROOT`
- `OPENCLAW_WORKSPACE_AGENTS_PATH`
- `OPENCLAW_WORKSPACE_WORKFLOW_PATH`
- `OPENCLAW_WORKSPACE_HEARTBEAT_PATH`
- `OPENCLAW_WORKSPACE_TOOLS_PATH`
- `OPENCLAW_ORGANIZATIONS_SOURCE_PATH`
- `OPENCLAW_WORKSPACE_ORGANIZATIONS_PATH`
- `OPENCLAW_ROLE_SLUG`
- `OPENCLAW_EXPECTED_ROLE_SLUG`
- `OPENCLAW_POD_SKILLS_SYNC_REPORT_PATH`

## Status-Only Output

The script writes a status only JSON report with schema
`openclaw-pod-skills-sync/v2`. It never reads credential files and never prints
auth token values. Do not print auth token values. Missing skill runtime inputs
are reported as blockers such as `missing source root` or
`missing SKILL.md: <slug>`.

The report distinguishes `applied`, `skipped`, `missing`, `blocked`, and
`role_mismatch`, records resolved source and target paths, sha256 hashes,
byte-for-byte cmp results, positive role identifier scan results, and negative
known-other-role residue scan results. `/workspace/ORGANIZATIONS.md` remains
common guidance and is report-only with `guidance_only: true`; values such as
`missing` or `unreadable` must not block skill sync by themselves.

After this skill completes, run `project-bootstrap`.
