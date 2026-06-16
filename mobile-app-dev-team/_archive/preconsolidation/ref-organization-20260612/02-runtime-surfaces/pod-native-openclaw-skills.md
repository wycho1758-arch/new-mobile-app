# Pod-Native OpenClaw Skills

Status: reusable template guidance
Source class: reference
Upstream SoT:

- `AGENTS.md`
- `mobile-app-dev-team/09-pod-native-openclaw-skills/README.md`

Downstream consumers:

- Future pod-native OpenClaw skill docs.
- Runtime surface readers.

Last reviewed date: 2026-06-10
Reviewer evidence: .evidence/reviews/ref-organization-checkpoint-3-xhigh-20260610.md

## Boundary

Pod-native OpenClaw skills use this runtime shape:

```text
/workspace/skills/<slug>/SKILL.md
```

Their source-only management location in this repository is:

```text
mobile-app-dev-team/09-pod-native-openclaw-skills/<slug>/
```

This surface is pod-native OpenClaw. It is not `.agents/skills/<skill-name>/SKILL.md`.

## Use

Use this surface for repeatable skill-only workflows that an OpenClaw agent pod reads from `/workspace/skills`.

Current managed example:

- `codex-cli-auth-setup`

## Evidence Boundary

The repository stores source-only documentation and optional scripts for these skills. Local harness evidence does not prove actual OpenClaw packaging or pod execution.
