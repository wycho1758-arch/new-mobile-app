---
name: wm-orchestrate
description: Use after a durable work-unit status.json exists and the agent must determine the next allowed WonderMove role action from committed repo state. This skill runs the repo-local next-action resolver, follows only its allowed actions, stops on reviewer/human-gate/out-of-role blocks, and never replaces deterministic Gatekeeper, human approval, or external platform proof.
---

# WM Orchestrate

Use this skill only for repo-scoped WonderMove work units that have a committed or branch-local `docs/plans/work-units/<work-unit-id>/status.json`.

## Required Inputs

- Work-unit id or `status.json` path.
- Current role through `WM_ROLE` or an explicit resolver `--role` value.
- Current branch/PR context when the work will be handed off.

## Workflow

1. Read the work-unit `status.json` and relevant local artifacts.
2. Run `node scripts/work-unit-next.mjs <work-unit-id-or-status-json> --role "$WM_ROLE"`.
3. If the resolver returns `blocked_reasons`, stop and report the blocking reasons, required reviewer, required human gate, or missing evidence.
4. If the resolver returns `required_reviewer`, route to the named read-only reviewer and wait for persisted evidence before continuing.
5. If the resolver returns `required_human_gate`, stop until a matching approved `human-gate/v1` decision file is committed under the work-unit root.
6. Work only on the returned `allowed_actions`, `next_artifact`, and `evidence_required` for the current owner role.
7. Use `--apply-transition` only for a bounded `status.json` state transition that the resolver allows, and only after the resulting status validates.
8. Record command output and evidence paths before handoff.

## Gatekeeper Boundary

When the resolver reports `gatekeeper_mode: deterministic-system`, the work is owned by deterministic checks. Do not route Gatekeeper work to a custom agent, LLM reviewer, pod identity, or human approver.

## Forbidden

- Do not execute another role's task after a role mismatch.
- Do not self-approve reviewer evidence.
- Do not resume `blocked-human` work without an approved matching `human-gate/v1` decision.
- Do not mutate external platforms: no live EAS, GitHub branch protection, webhook, Secret/token, pod/image operation, Confluence live publish, Jira mutation, or store submit.
- Do not treat local harness, source review, RN Web, or resolver output as proof of native, pod, EAS, branch-protection, Confluence, or external platform state.
- Do not implement mobile UI, backend/API, contracts, or customer-specific behavior unless the resolver points to a work unit whose approved role/scope requires that separate owner workflow.

## Required Validation

- `node scripts/work-unit-next.mjs --self-test`
- `pnpm run test:runtime`
- `pnpm run test:local-harness` for changes to this skill, runtime scripts, evals, or `docs/plans/**`
