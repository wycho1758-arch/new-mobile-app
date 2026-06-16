# OpenClaw Pod Skills Sync Report Template

Default path:

```text
/workspace/state/openclaw-pod-skills-sync-report.json
```

Schema:

```json
{
  "schema": "openclaw-pod-skills-sync/v1",
  "status": "completed",
  "mode": "copy",
  "source_authority": "repo_sot",
  "runtime_target": "runtime_snapshot",
  "blockers": [],
  "paths": {
    "source_root": "/workspace/projects/Wondermove-Inc/new-mobile-app/mobile-app-dev-team/runtime-sources/pod-native-openclaw-skills",
    "runtime_root": "/workspace/skills",
    "workspace_agents": "/workspace/AGENTS.md"
  },
  "skills": {
    "project-bootstrap": {
      "status": "synced"
    }
  },
  "workspace_agents": {
    "project_workspace_defaults": "present"
  }
}
```

This report is status only. It must not contain auth token values, credential
contents, API keys, OAuth tokens, database URLs, or secret-bearing clone URLs.
