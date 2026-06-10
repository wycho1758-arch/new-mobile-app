# Skill Placement Policy

Status: reusable template guidance
Source class: reference
Upstream SoT:

- `AGENTS.md`
- `team-doc/mobile-app-dev-team/ref-organization/02-runtime-surfaces/`

Downstream consumers:

- Future skill authoring work.

Last reviewed date: 2026-06-10
Reviewer evidence: .evidence/reviews/ref-organization-final-rereview-xhigh-20260610.md

## Placement Rules

- Repo-local Codex skills live at `.agents/skills/<skill-name>/SKILL.md`.
- Pod-native OpenClaw skills use `/workspace/skills/<slug>/SKILL.md`.
- Pod Codex completion hook source uses `/workspace/codex-hooks`.
- computer-use/tool surfaces are capability surfaces, not a repo-local Codex artifact unless a SoT says so.

## Rule

Choose placement by runtime owner and validation path. Do not place a pod-native OpenClaw skill in `.agents/skills`, and do not treat `/workspace/codex-hooks` as `.codex/hooks`.
