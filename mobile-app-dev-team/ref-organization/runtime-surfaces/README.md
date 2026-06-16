# Runtime Surfaces

Status: reusable template guidance
Source class: index
Upstream SoT:

- `AGENTS.md`
- `PROJECT_ENVIRONMENT.md`
- `mobile-app-dev-team/runtime-sources/pod-native-openclaw-skills/README.md`
- `mobile-app-dev-team/ref-organization/runtime-surfaces/README.md`

Downstream consumers:

- Future runtime surface pages.
- Skill, agent, and tool policy pages.

Last reviewed date: 2026-06-10
Reviewer evidence: .evidence/reviews/ref-organization-checkpoint-2-xhigh-20260610.md

## Purpose

This consolidated section keeps the reusable reference-organization guidance in one navigable document. The former per-topic markdown files are listed below and preserved in `mobile-app-dev-team/_archive/preconsolidation/ref-organization-20260612/` for historical traceability.

## Consolidated Former Files

- `computer-use-and-tool-surfaces.md` -> consolidated below
- `pod-codex-completion-hooks.md` -> consolidated below
- `pod-native-openclaw-skills.md` -> consolidated below
- `repo-local-codex-runtime.md` -> consolidated below

## Computer Use And Tool Surfaces

Former file: `computer-use-and-tool-surfaces.md`

### Boundary

computer-use/tool surfaces are capability surfaces, not repository artifact paths by default.

They are not a repo-local Codex artifact unless a SoT says so.

### Required Fields For A Tool Surface

Every future computer-use/tool surface page should document:

- owner role or routing owner
- allowed use cases
- evidence boundary
- whether the surface is repo-local, pod-local, external, or human-gated
- required human gate, if the tool can affect production, privacy, legal, payment, external messaging, or failed-gate risk

### Current Examples

- Browser or computer-use interaction for local visual checks.
- `mobile-mcp` for local mobile visual QA/device automation when a simulator or device is available.
- Stitch for design handoff generation and extraction when Design workflow gates are satisfied.

### Evidence Boundary

Tool output is evidence only for the surface it actually exercised. RN Web evidence does not prove native module behavior. Railway deployment evidence does not prove full mobile release readiness. A human-gated action remains blocked until recorded human approval exists.

## Pod Codex Completion Hooks

Former file: `pod-codex-completion-hooks.md`

### Boundary

Pod Codex completion hooks use this pod-local source shape:

```text
/workspace/codex-hooks
```

This surface is not `/workspace/skills/<slug>/SKILL.md`, and it is not `.codex/hooks`.

### Use

Use this surface for pod-local nested Codex completion event delivery when a specific agent pod has installed and verified the hook source.

Known current-project source shape includes:

- `/workspace/codex-hooks/codex-run`
- `/workspace/codex-hooks/codex-completion-hook.js`
- `/workspace/codex-hooks/lib/redact.js`
- `/workspace/codex-hooks/lib/dedupe.js`
- `/workspace/codex-hooks/lib/event-adapter.js`

### Evidence Boundary

Each target agent needs per-agent E2E evidence. Boram pod evidence does not prove another target agent. local repo/source validation does not prove actual OpenClaw system event delivery.

Durable task-specific handoff still goes through GitHub branch/commit/PR and `docs/plans/work-units/<work-unit-id>/`.

## Pod-Native OpenClaw Skills

Former file: `pod-native-openclaw-skills.md`

### Boundary

Pod-native OpenClaw skills use this runtime shape:

```text
/workspace/skills/<slug>/SKILL.md
```

Their source-only management location in this repository is:

```text
mobile-app-dev-team/runtime-sources/pod-native-openclaw-skills/<slug>/
```

This surface is pod-native OpenClaw. It is not `.agents/skills/<skill-name>/SKILL.md`.

### Use

Use this surface for repeatable skill-only workflows that an OpenClaw agent pod reads from `/workspace/skills`.

Current managed example:

- `codex-cli-auth-setup`

### Evidence Boundary

The repository stores source-only documentation and optional scripts for these skills. Local harness evidence does not prove actual OpenClaw packaging or pod execution.

## Repo-Local Codex Runtime

Former file: `repo-local-codex-runtime.md`

### Boundary

Repo-local Codex runtime artifacts are committed in the repository and validated by repo-local gates.

Primary paths:

- `.agents/skills/<skill-name>/SKILL.md`
- `.codex/agents/<agent-name>.toml`
- `.codex/hooks.json`
- `.codex/hooks/`
- `.codex/config.toml`
- `evals/{skills,agents,hooks,local-harness}/`
- `.evidence/`

This surface is repo-local Codex. It is not `/workspace/skills/<slug>/SKILL.md`, and it is not `/workspace/codex-hooks`.

### Use

Use this surface for:

- repo-local skills such as `$wm`
- read-only reviewer/researcher custom agents
- repo-local hooks and MCP registration
- runtime validators and eval fixtures

### Evidence Boundary

`pnpm run validate:team-doc`, `pnpm run test:runtime`, and `pnpm run test:local-harness` validate local repository structure and runtime contracts. They do not prove actual OpenClaw pod execution.
