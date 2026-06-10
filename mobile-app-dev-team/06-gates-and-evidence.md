# Gates And Evidence

## Required Gates

| Scope | Required Evidence |
| --- | --- |
| Workspace code | `pnpm turbo run lint test` |
| Codex runtime artifact | `pnpm run test:runtime` |
| Runtime path/local harness | `pnpm run test:local-harness` |
| Mobile environment/runtime | `expo install --check`, mobile lint/test/doctor, `codex mcp list` |
| Mobile UI/runtime with available device | Serial `mobile-mcp` visual QA/device automation |
| RN Web E2E | Playwright command output and `.evidence/e2e-test/...` artifacts |
| Native E2E | Maestro/mobile-mcp evidence when simulator/device is available |
| Production submit | Human approval record plus release evidence |

## Mobile Evidence Ladder

Mobile work units use the evidence ladder in
`mobile-app-dev-team/14-native-e2e-strategy.md`:

- L0 `jest`: unit, component, contract, and runtime checks.
- L1 `rn-web`: RN Web + Playwright for browser-reproducible flows only.
- L2 `eas-maestro`: native package plus EAS/Maestro evidence.
- L3 `human-device`: linked device/mobile-mcp evidence plus human-gate residual risk.

Product/Planning sets `status.json.evidence_ladder.required_level`. QA/Release
sets `achieved_level`. `05-qa-release` cannot be marked `done` unless the
achieved level meets the required level or an approved `failed-gate-risk`
human-gate waiver exists. RN Web evidence must not be used as L2 or L3 native
proof.

## Release Gatekeeper (System)

- Release Gatekeeper (System) is the display title for the non-LLM deterministic Gatekeeper.
- It is not a person, custom agent, LLM role, or SOUL.md owner.
- It cannot replace human approval or accept failed-gate risk.
- It only consumes required evidence and returns deterministic pass/fail.

## Evidence Rules

- Done requires linked artifacts, not status-only claims.
- Evidence should live under `.evidence/` or `evals/*/results/` when the workflow requires persisted proof.
- `$wm` planning evidence should summarize planning sub-agent routing with agent, question, conclusion, source refs or evidence path, reflection/impact, and any skip reason for material planning decisions that were not routed.
- E2E evidence uses `.evidence/e2e-test/<YYYYMMDD-HHMMSS>-<slug>/`.
- Command output must include exit status.
- Screenshots/logs are required for visual or runtime failures when available.
- Secrets, tokens, private `.env` values, bearer credentials, signing keys, and private endpoints must not be printed or persisted.

## Durable GitHub Handoff

- Pod-isolated role agents must use `docs/plans/work-units/<work-unit-id>/` as the committed durable GitHub handoff root.
- Durable GitHub handoff means a downstream pod consumes a branch/commit/PR or merged repo artifact, not another pod local workspace.
- Work-unit QA files are summaries and indexes. They must link canonical evidence instead of replacing it.
- Canonical evidence remains in workflow-owned paths such as `.evidence/e2e-test/<YYYYMMDD-HHMMSS>-<slug>/`, mobile-mcp records, Railway evidence, EAS evidence, or human approval records.
- `.evidence/local/`, `.evidence/tmp/`, `.evidence/**/*.log`, and `.evidence/**/raw/` are not durable handoff channels.

## Railway Boundary

`qa-railway-workflow` can prove Railway CLI setup, service/database/domain/deploy status, health endpoints, and RN Web E2E against a deployed API URL.

It does not prove:

- Native module behavior.
- OS permissions.
- mobile-mcp visual QA.
- Maestro native automation.
- Store submission readiness.
- Full production release approval.

## Human Gates

Stop for recorded human decision when work involves:

- Production submit.
- Payment or money movement.
- PII/privacy-sensitive behavior.
- External messaging, email, SMS, push notification.
- Legal, terms, contract, or compliance decision.
- Business/budget owner decision.
- Irreversible scope tradeoff.
- Accepting risk after a failed gate.

Machine-readable human gate decisions use `human-gate/v1` under the durable
work-unit root:

- Planning gates: `docs/plans/work-units/<work-unit-id>/00-product-planning/human-gates/<gate-id>.json`
- Release approval: `docs/plans/work-units/<work-unit-id>/05-qa-release/human-approval.json`

The deterministic category slugs are:

- `production-submit`
- `payment-money-movement`
- `pii-privacy`
- `external-messaging`
- `legal-compliance`
- `business-budget-owner`
- `irreversible-scope-tradeoff`
- `failed-gate-risk`

Each decision envelope must include `schema`, `gate_id`, `category`,
`decision`, `scope`, `decided_by`, `decision_reference`, `decided_at`,
`residual_risk`, and `evidence_links`. Decisions are `approved`, `rejected`, or
`deferred`. `decision_reference` must be a GitHub issue comment or pull request
review URL for the offline validator path. `failed-gate-risk` additionally
requires `failed_check_reference`.

Human gate envelopes make a decision auditable and machine-readable; they do not
turn a role, reviewer, pod, LLM, or Release Gatekeeper into a human approver.
`blocked-human` work may resume to `in-progress` only when the matching
decision envelope is `approved`.
