# node_repl Removal Login Proof Implementation Second Fix Checkpoint

Date: 2026-06-14
Branch: `fix/project-bootstrap-node-repl-login-proof`

## Reviewer Findings Addressed

1. Credential file explorer handling now actually attempts to open existing
   credential directories when `xdg-open`, `gio`, or `nautilus` is available.
   The report records `open_attempted`, `open_status`, and
   `terminal_metadata` fallback status without reading credential contents.
2. `references/report-template.md` now documents the implemented schema:
   Railway `npm_global_install_attempted`, browserless login flow states,
   gcloud `project_set_flow`, credential metadata entries, file explorer
   status fields, and ADC metadata.

## Focused Verification

Command:

```bash
bash evals/skills/project-bootstrap-agent-setup-smoke.sh
```

Result:

```text
project-bootstrap-agent-setup smoke passed
```

Observed non-secret local CLI status output during smoke:

- local `gcloud` update notices
- local `railway` unauthorized status
- local gcloud project `(unset)` status

These are status-only messages from local installed CLIs and the smoke
assertions passed.

## Secret Handling

The focused smoke includes `assert_json_no_secret_like` checks. The updated
report continues to store metadata only: path/status, file or directory names,
mode, owner/group ids, size, modified time, and CLI status labels. It does not
read or persist token values, ADC JSON contents, OAuth codes, service account
JSON, bearer tokens, or private key material.
