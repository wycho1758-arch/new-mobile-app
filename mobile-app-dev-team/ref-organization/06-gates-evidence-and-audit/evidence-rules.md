# Evidence Rules

Status: reusable template guidance
Source class: reference
Upstream SoT:

- `mobile-app-dev-team/06-gates-and-evidence.md`
- `mobile-app-dev-team/10-github-artifact-workflow.md`

Downstream consumers:

- QA/Release evidence planning.
- Audit index.

Last reviewed date: 2026-06-10
Reviewer evidence: .evidence/reviews/ref-organization-checkpoint-5-xhigh-20260610.md

## Rules

- Done requires linked artifacts, not status-only claims.
- Use canonical evidence paths and link them from summaries.
- E2E evidence uses `.evidence/e2e-test/<YYYYMMDD-HHMMSS>-<slug>/`.
- Command output must include exit status.
- command output is required evidence for command-based validation.
- Visual/runtime failures need screenshots or logs when available.
- Evidence must not print or persist secrets, tokens, private `.env` values, bearer credentials, signing keys, or private endpoints.

## Non-Durable Paths

Do not use ignored local evidence paths as durable handoff:

- `.evidence/local/`
- `.evidence/tmp/`
- `.evidence/**/*.log`
- `.evidence/**/raw/`

## Summary Rule

Work-unit summaries point to canonical evidence. They do not replace canonical evidence.
