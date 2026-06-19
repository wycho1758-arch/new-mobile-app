# Gates Evidence And Audit

Status: reusable template guidance
Source class: index
Upstream SoT:

- `mobile-app-dev-team/governance/gates-and-evidence.md`
- `mobile-app-dev-team/workflows/github-artifact-workflow.md`

Downstream consumers:

- Future gate, evidence, human-gate, and audit pages.

Last reviewed date: 2026-06-10
Reviewer evidence: .evidence/reviews/ref-organization-checkpoint-2-xhigh-20260610.md

## Purpose


## Consolidated Former Files

- `audit-index.md` -> consolidated below
- `evidence-rules.md` -> consolidated below
- `human-gates.md` -> consolidated below
- `required-gates.md` -> consolidated below

## Audit Index

Former file: `audit-index.md`

### Purpose

The audit index separates historical evidence from current evidence.

### Evidence Classes

- historical evidence: frozen source exports, older structured docs, archived audits.
- current evidence: command output, reviewer evidence, validation results, current work-unit artifacts.
- source map: active-vs-historical crosswalk.

### Rule

Reviewer evidence and command output should be linked from the relevant checkpoint or work-unit record.

local validation does not prove actual OpenClaw pod execution. External platform or pod behavior requires its own evidence.

## Evidence Rules

Former file: `evidence-rules.md`

### Rules

- Done requires linked artifacts, not status-only claims.
- Use canonical evidence paths and link them from summaries.
- E2E evidence uses `.evidence/e2e-test/<YYYYMMDD-HHMMSS>-<slug>/`.
- Command output must include exit status.
- command output is required evidence for command-based validation.
- Visual/runtime failures need screenshots or logs when available.
- Evidence must not print or persist secrets, tokens, private `.env` values, bearer credentials, signing keys, or private endpoints.

### Non-Durable Paths

Do not use ignored local evidence paths as durable handoff:

- `.evidence/local/`
- `.evidence/tmp/`
- `.evidence/**/*.log`
- `.evidence/**/raw/`

### Summary Rule

Work-unit summaries point to canonical evidence. They do not replace canonical evidence.

## Human Gates

Former file: `human-gates.md`

### Stop For Human Decision

Stop for recorded human approval when work involves:

- Production submit
- Payment or money movement
- PII/privacy-sensitive behavior
- External messaging, email, SMS, or push notification
- Legal, terms, contract, or compliance decision
- Business/budget owner decision
- Irreversible scope tradeoff
- Accepting risk after a failed gate

### Rule

No LLM role, reviewer, QA role, or Gatekeeper can replace these decisions.

## Required Gates

Former file: `required-gates.md`

### Core Gates

- `pnpm run validate:team-doc`
- `pnpm run test:runtime`
- `pnpm turbo run lint test`
- `pnpm run test:local-harness` when runtime/local harness scope is touched

### Mobile Gates

- `pnpm --filter mobile exec expo install --check` when mobile environment/runtime changes.
- mobile lint/test/doctor when mobile runtime changes.
- `codex mcp list` when mobile environment/runtime or MCP configuration changes.
- `mobile-mcp` visual QA/device automation when a simulator or device is available.
- Maestro for native E2E where applicable.

### Release Gatekeeper

Release Gatekeeper (System) consumes evidence and records deterministic pass/fail. It does not make LLM judgment, replace human approval, or accept failed-gate risk.
