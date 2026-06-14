# node_repl Removal Login Proof Implementation Re-review

Date: 2026-06-14
Reviewer: wm-implementation-reviewer
Mode: final
Verdict: NO_GO

## Findings

1. Medium: Credential file explorer handling detects an opener but does not
   attempt to open credential directories.
2. Medium: `references/report-template.md` does not document the implemented
   report schema for `npm_global_install_attempted`, browserless Railway login,
   and metadata/file-explorer fields.

## Required Fix

- Invoke `xdg-open`, `gio open`, or `nautilus` for credential directories when
  available, and record `open_attempted` plus result status. Use terminal
  metadata fallback when unavailable.
- Update `report-template.md` so downstream skill consumers see the exact
  produced schema.

## JSON Envelope

```json
{
  "verdict": "NO_GO",
  "reviewer": "wm-implementation-reviewer",
  "mode": "final",
  "findings": [
    {
      "severity": "Medium",
      "path": "mobile-app-dev-team/09-pod-native-openclaw-skills/project-bootstrap/scripts/project-bootstrap-agent-setup.sh",
      "title": "Credential file explorer step is only detected, not attempted"
    },
    {
      "severity": "Medium",
      "path": "mobile-app-dev-team/09-pod-native-openclaw-skills/project-bootstrap/references/report-template.md",
      "title": "Report template does not document the implemented schema"
    }
  ],
  "next_action": "Fix file explorer open/fallback implementation and report template, rerun smoke and re-review."
}
```
