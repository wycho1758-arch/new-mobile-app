# File Explorer Opt-in Review

Date: 2026-06-14
Reviewer: Aquinas
Decision: GO

## Reviewer Result

The reviewer confirmed:

- Routine checks do not open Finder or a file explorer.
- `xdg-open`, `gio`, or `nautilus` runs only when
  `PROJECT_BOOTSTRAP_OPEN_CREDENTIAL_FILE_EXPLORER=true` and the target is an
  existing directory.
- Tests cover both default no-opener behavior and explicit opt-in fake opener
  behavior.
- Docs, report template, and plan document metadata-only by default and visual
  credential-location proof only by explicit opt-in.

## Next Step

Proceed to full gates, final reviewer, commit, push, and PR.
