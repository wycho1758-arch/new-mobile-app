# node_repl Removal Login Proof Implementation Review

Date: 2026-06-14
Reviewer: wm-implementation-reviewer
Mode: final
Verdict: NO_GO

## Findings

1. High: `gcloud auth list` and `gcloud config get-value project` were checked
   by exit code only. They can exit 0 while reporting no credentialed accounts
   or `(unset)`, causing required login/project flows to be skipped.
2. Medium: Railway browserless fallback was missing. The implementation always
   ran `railway login`.
3. Medium: Credential storage proof was too shallow. The report stored only
   `present`/`missing`, not metadata such as filename, owner/group, mode, size,
   and modification time or file explorer fallback status.

## Required Fix

- Parse gcloud auth/project command output, not exit code alone.
- Add `railway login --browserless` fallback when no browser/file UI is
  available.
- Add metadata-level credential proof and file explorer/fallback reporting
  without reading credential contents.

## JSON Envelope

```json
{
  "verdict": "NO_GO",
  "reviewer": "wm-implementation-reviewer",
  "mode": "final",
  "scope": {
    "checkpoint": "2",
    "plan_path": ".evidence/reviews/20260614-node-repl-removal-login-proof-plan.md",
    "diff_paths_reviewed": [
      "PROJECT_ENVIRONMENT.md",
      "docs/CODEX_MCP_ENVIRONMENT.md",
      "docs/confluence/20260608-codex-expo-rn-runtime-sot-update.md",
      "evals/skills/project-bootstrap-agent-setup-smoke.sh",
      "mobile-app-dev-team/09-pod-native-openclaw-skills/project-bootstrap/SKILL.md",
      "mobile-app-dev-team/09-pod-native-openclaw-skills/project-bootstrap/references/blocker-resolution-guide.md",
      "mobile-app-dev-team/09-pod-native-openclaw-skills/project-bootstrap/references/report-template.md",
      "mobile-app-dev-team/09-pod-native-openclaw-skills/project-bootstrap/scripts/project-bootstrap-agent-setup.sh",
      "mobile-app-dev-team/09-pod-native-openclaw-skills/project-bootstrap/scripts/project-bootstrap-preflight.sh"
    ],
    "evidence_reviewed": [
      ".evidence/reviews/20260614-node-repl-removal-login-proof-implementation-checkpoint.md"
    ]
  },
  "findings": [
    {
      "severity": "High",
      "path": "mobile-app-dev-team/09-pod-native-openclaw-skills/project-bootstrap/scripts/project-bootstrap-agent-setup.sh",
      "line": 577,
      "title": "gcloud auth/project readiness can be falsely marked available"
    },
    {
      "severity": "Medium",
      "path": "mobile-app-dev-team/09-pod-native-openclaw-skills/project-bootstrap/scripts/project-bootstrap-agent-setup.sh",
      "line": 563,
      "title": "Railway browserless fallback is missing"
    },
    {
      "severity": "Medium",
      "path": "mobile-app-dev-team/09-pod-native-openclaw-skills/project-bootstrap/scripts/project-bootstrap-agent-setup.sh",
      "line": 205,
      "title": "Credential storage proof is too shallow for the plan"
    }
  ],
  "next_action": "Fix findings, extend focused smoke, rerun Checkpoint 2 review."
}
```
