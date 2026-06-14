# File Explorer Opt-in Fix

Date: 2026-06-14

## Trigger

The user explicitly requested: "finder 그만 열어라!"

## Fix

- `project-bootstrap-agent-setup.sh` no longer opens Finder or a file explorer
  during routine checks.
- Credential directory opening is now opt-in and requires:
  `PROJECT_BOOTSTRAP_OPEN_CREDENTIAL_FILE_EXPLORER=true`.
- Default report behavior is metadata-only with:
  `file_explorer.open_policy: disabled_by_default`,
  `open_attempted: false`,
  `open_status: disabled`,
  and `fallback: terminal_metadata`.
- Tests now assert that the fake opener is not invoked unless the opt-in env is
  set.
- Documentation now states routine checks must not open Finder/file explorer.

## Verification

Command:

```bash
bash evals/skills/project-bootstrap-agent-setup-smoke.sh
```

Result:

```text
project-bootstrap-agent-setup smoke passed
```

## Secret Handling

No credential contents are read or printed. Credential proof remains
metadata-only by default.
