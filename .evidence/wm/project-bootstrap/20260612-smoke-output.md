# project-bootstrap smoke output

## role=design

```text
project-bootstrap preflight complete: report=/var/folders/q9/m8qpcc0n2zd5w9t5tg9r9f8w0000gn/T/tmp.TnPMYHF71Z/project-bootstrap-report.json
exit=0
{
  "schema": "project-bootstrap/v1",
  "role": {
    "resolved": "design",
    "normalized": "design",
    "expected": "match",
    "requires_stitch": true,
    "requires_eas": false
  },
  "status": "blocked",
  "repo_sot_files": {
    "AGENTS.md": "present",
    "REPO_OPERATIONS.md": "present",
    "PROJECT_ENVIRONMENT.md": "present",
    ".codex/config.toml": "present",
    "docs/TEMPLATE_VARIABLES.md": "present",
    "docs/CREDENTIALS.md": "present",
    "mobile-app-dev-team/09-pod-native-openclaw-skills/README.md": "present"
  },
  "selected_blockers": [
    "missing required MCP stitch",
    "missing /workspace/skills/stitch-adc-setup",
    "missing stitch-adc-setup report"
  ]
}
report_path=/var/folders/q9/m8qpcc0n2zd5w9t5tg9r9f8w0000gn/T/tmp.TnPMYHF71Z/project-bootstrap-report.json
```

## role=qa-release

```text
project-bootstrap preflight complete: report=/var/folders/q9/m8qpcc0n2zd5w9t5tg9r9f8w0000gn/T/tmp.50oUkbpdGn/project-bootstrap-report.json
exit=0
{
  "schema": "project-bootstrap/v1",
  "role": {
    "resolved": "qa-release",
    "normalized": "qa-release",
    "expected": "match",
    "requires_stitch": false,
    "requires_eas": true
  },
  "status": "blocked",
  "repo_sot_files": {
    "AGENTS.md": "present",
    "REPO_OPERATIONS.md": "present",
    "PROJECT_ENVIRONMENT.md": "present",
    ".codex/config.toml": "present",
    "docs/TEMPLATE_VARIABLES.md": "present",
    "docs/CREDENTIALS.md": "present",
    "mobile-app-dev-team/09-pod-native-openclaw-skills/README.md": "present"
  },
  "selected_blockers": [
    "missing required MCP stitch",
    "missing /workspace/skills/eas-robot-auth-setup",
    "missing eas-robot-auth-setup report"
  ]
}
report_path=/var/folders/q9/m8qpcc0n2zd5w9t5tg9r9f8w0000gn/T/tmp.50oUkbpdGn/project-bootstrap-report.json
```
