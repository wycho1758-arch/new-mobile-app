---
name: po-requirement-office-hours
description: Use when Product/Planning must clarify an ambiguous mobile request before PRD decomposition. This repo-local Codex adapter maps the Product/Planning source skill mobile-requirement-office-hours to po-* naming and produces facts, assumptions, unknowns, non-goals, human gates, and a readiness decision; it must not create execution tasks, implement code, or bypass human gates.
---

# PO Requirement Office-Hours

Use this Product/Planning adapter before PRD decomposition when a request is too unclear to become execution work. It may also run after work-unit sizing when selected-slice unknowns block a bounded work unit.

## Source Crosswalk

- Local Codex skill: `po-requirement-office-hours`
- Product/Planning source skill: `mobile-requirement-office-hours`
- Source page: `1374519364`
- Parent SOUL: Product/Planning `1373798422`

The `po-*` slug is the repo-local Codex adapter name required for Product/Planning runtime use. It is not a standalone role wrapper and does not replace `mobile-prd-to-execution`.

## Required Inputs

- User request, rough idea, partial PRD, Jira request, Confluence brief, feature room note, or selected-slice unknowns returned by `po-work-unit-planning-and-agent-sprint`.
- Known target user, platform, release, backend/API, policy, and business constraints when available.
- Existing SoT links and open decisions when available.

## Workflow

1. Load the relevant SoT and separate facts, assumptions, and unknowns.
2. Classify the request type and mobile risk.
3. Identify target user, primary scenario, useful scope, acceptance signal, constraints, and non-goals.
4. Bundle only decision-blocking clarification questions.
5. Flag human gates for production submit, payment or money movement, PII or privacy-sensitive behavior, external messaging or email/SMS push, legal/terms/contracts, business approval, compliance/policy decision, Human Owner budget/business decision, irreversible scope tradeoff, or accepting risk after a gate failure.
6. Return exactly one readiness state: `READY_FOR_PRD_DECOMPOSITION`, `NEEDS_USER_CLARIFICATION`, `OUT_OF_SCOPE`, or `HUMAN_GATE_REQUIRED`.
7. When ready, hand off a clarified brief to `po-prd-to-execution`.

## Output

- Facts, assumptions, unknowns, and non-goals.
- Request type and mobile risk.
- Clarification questions and owner for open decisions.
- Human gates and evidence requirements, including production submit, payment or money movement, PII or privacy-sensitive behavior, external messaging or email/SMS push, legal/terms/contracts, business approval, compliance/policy decision, Human Owner budget/business decision, irreversible scope tradeoff, and accepting risk after a gate failure.
- Readiness decision and downstream handoff only when ready.

## Forbidden

- Do not guess scope to make the request executable.
- Do not create Jira implementation tasks from unclear requirements.
- Do not implement code, modify app/backend files, or change external platform/runtime repositories.
- Do not bypass human gates or treat them as minor assumptions.
- Do not claim unsupported A2A/NATS collaboration without runtime evidence.

## Required Evals

- Positive: unclear mobile request triggers this skill.
- Negative: execution-ready implementation request does not trigger this skill.
- Negative: review-only request does not trigger this skill.
