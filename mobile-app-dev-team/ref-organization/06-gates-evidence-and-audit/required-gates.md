# Required Gates

Status: reusable template guidance
Source class: reference
Upstream SoT:

- `AGENTS.md`
- `mobile-app-dev-team/06-gates-and-evidence.md`

Downstream consumers:

- Evidence and audit pages.
- Future PR readiness checks.

Last reviewed date: 2026-06-10
Reviewer evidence: .evidence/reviews/ref-organization-checkpoint-5-xhigh-20260610.md

## Core Gates

- `pnpm run validate:team-doc`
- `pnpm run test:runtime`
- `pnpm turbo run lint test`
- `pnpm run test:local-harness` when runtime/local harness scope is touched

## Mobile Gates

- `pnpm --filter mobile exec expo install --check` when mobile environment/runtime changes.
- mobile lint/test/doctor when mobile runtime changes.
- `codex mcp list` when mobile environment/runtime or MCP configuration changes.
- `mobile-mcp` visual QA/device automation when a simulator or device is available.
- Maestro for native E2E where applicable.

## Release Gatekeeper

Release Gatekeeper (System) consumes evidence and records deterministic pass/fail. It does not make LLM judgment, replace human approval, or accept failed-gate risk.
