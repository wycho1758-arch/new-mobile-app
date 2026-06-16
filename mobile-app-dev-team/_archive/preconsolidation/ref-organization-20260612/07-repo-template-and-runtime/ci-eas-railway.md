# CI EAS Railway

Status: current-project example
Source class: reference
Upstream SoT:

- `AGENTS.md`
- `PROJECT_ENVIRONMENT.md`
- `mobile-app-dev-team/06-gates-and-evidence.md`

Downstream consumers:

- Required gates.
- Release and QA evidence planning.

Last reviewed date: 2026-06-10
Reviewer evidence: .evidence/reviews/ref-organization-final-rereview-xhigh-20260610.md

## Quality Gate

The current GitHub quality gate includes:

- `pnpm run test:runtime`
- `pnpm turbo run lint test`
- conditional `pnpm run test:local-harness`

## EAS

EAS workflows are current-project release surfaces. Store-facing release actions still need recorded human approval.

## Railway

Railway can provide API deploy, health, domain, logs, and RN Web API URL evidence. Railway evidence does not prove full mobile release readiness.

## Reuse Rule

Future organizations must verify their own CI, EAS, Railway, store, or deployment provider paths before copying this example.
