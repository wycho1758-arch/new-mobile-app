---
name: openclaw-pod-skills-sync
description: Copy-sync repo-authored pod-native OpenClaw skills into the runtime /workspace/skills snapshot and verify the workspace AGENTS setup rule before project-bootstrap runs.
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

## Responsibility

This skill has one responsibility: copy sync the repo SoT
`mobile-app-dev-team/runtime-sources/pod-native-openclaw-skills` into the runtime snapshot
`/workspace/skills`, then verify the required `/workspace/AGENTS.md` clone/pull
setup rule.

The repo SoT remains authoritative. `/workspace/skills` is a runtime snapshot,
not the source of truth. The default mode is copy sync, not symlink.

## Default Paths

- Repo path: `/workspace/projects/Wondermove-Inc/new-mobile-app`
- Source root:
  `/workspace/projects/Wondermove-Inc/new-mobile-app/mobile-app-dev-team/runtime-sources/pod-native-openclaw-skills`
- Runtime root: `/workspace/skills`
- Workspace instructions: `/workspace/AGENTS.md`
- Report: `/workspace/state/openclaw-pod-skills-sync-report.json`

## Usage

```bash
bash /workspace/skills/openclaw-pod-skills-sync/scripts/sync-pod-skills.sh
```

The script accepts non-secret path overrides for local smoke tests and pod
variants:

- `OPENCLAW_POD_SKILLS_REPO_PATH`
- `OPENCLAW_POD_SKILLS_SOURCE_ROOT`
- `OPENCLAW_POD_SKILLS_ROOT`
- `OPENCLAW_WORKSPACE_AGENTS_PATH`
- `OPENCLAW_POD_SKILLS_SYNC_REPORT_PATH`

## Status-Only Output

The script writes a status only JSON report. It never reads credential files and
never prints auth token values. Do not print auth token values. Missing runtime inputs are reported as blockers
such as `missing source root` or `missing SKILL.md: <slug>`.

After this skill completes, run `project-bootstrap`.
