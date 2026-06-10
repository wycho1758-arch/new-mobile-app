# Pod Codex Completion Hooks

Status: current-project example
Source class: reference
Upstream SoT:

- `team-doc/mobile-app-dev-team/11-openclaw-codex-completion-hooks-plan.md`
- `team-doc/mobile-app-dev-team/10-github-artifact-workflow.md`

Downstream consumers:

- Future pod hook runbook work.
- Durable handoff docs.

Last reviewed date: 2026-06-10
Reviewer evidence: .evidence/reviews/ref-organization-checkpoint-3-xhigh-20260610.md

## Boundary

Pod Codex completion hooks use this pod-local source shape:

```text
/workspace/codex-hooks
```

This surface is not `/workspace/skills/<slug>/SKILL.md`, and it is not `.codex/hooks`.

## Use

Use this surface for pod-local nested Codex completion event delivery when a specific agent pod has installed and verified the hook source.

Known current-project source shape includes:

- `/workspace/codex-hooks/codex-run`
- `/workspace/codex-hooks/codex-completion-hook.js`
- `/workspace/codex-hooks/lib/redact.js`
- `/workspace/codex-hooks/lib/dedupe.js`
- `/workspace/codex-hooks/lib/event-adapter.js`

## Evidence Boundary

Each target agent needs per-agent E2E evidence. Boram pod evidence does not prove another target agent. local repo/source validation does not prove actual OpenClaw system event delivery.

Durable task-specific handoff still goes through GitHub branch/commit/PR and `docs/plans/work-units/<work-unit-id>/`.
