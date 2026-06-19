# Skills Agents And Tools

Status: reusable template guidance
Source class: index
Upstream SoT:

- `mobile-app-dev-team/runtime-sources/codex-skill-agent-matrix.md`
- `.agents/skills/`
- `.codex/agents/`

Downstream consumers:

- Future skill, agent, and tool policy pages.
- Runtime surface pages.

Last reviewed date: 2026-06-10
Reviewer evidence: .evidence/reviews/ref-organization-checkpoint-2-xhigh-20260610.md

## Purpose


## Consolidated Former Files

- `active-skill-agent-policy.md` -> consolidated below
- `optional-tool-adoption.md` -> consolidated below
- `reviewer-researcher-boundaries.md` -> consolidated below
- `skill-placement-policy.md` -> consolidated below

## Active Skill Agent Policy

Former file: `active-skill-agent-policy.md`

### Policy

An active repo-local skill is active only when it exists in the actual `.agents/skills` directory.

Do not promote historical source names to active status unless the current repo has a matching skill or adapter.

### Current Project Example

Current `$wm` routing prefers dedicated `wm-*`, Product/Planning `po-*`, and Design `design-*` read-only reviewers/researchers. legacy mobile-* agents may remain available for other runtime/eval surfaces but are not the primary `$wm` route unless a newer SoT says so.

### Rule

repo skills remain authoritative for contracts, role boundaries, evidence, and QA gates. External or optional tools do not override repo-local skills.

## Optional Tool Adoption

Former file: `optional-tool-adoption.md`

### Adoption Criteria

Treat a tool as optional until a recurring process gap proves it is needed.

Before adopting an optional tool:

- identify the SoT that authorizes it,
- identify owner role and runtime surface,
- add or update validator coverage,
- define evidence requirements,
- route any human gate before use,
- document what the tool does not prove.

### Rule

Optional tools must not bypass deterministic gates, Reviewer(xhigh), or human-gate decisions.

## Reviewer Researcher Boundaries

Former file: `reviewer-researcher-boundaries.md`

### Rules

Reviewer and researcher agents must be read-only.

They must include source references, must not recursively delegate, must not edit files, must not approve failed gates, and must not accept human-gate risk.

### Output

Reviewer output should lead with findings ordered by severity and include residual risk, missing tests/evidence, and next owner when relevant.

## Skill Placement Policy

Former file: `skill-placement-policy.md`

### Placement Rules

- Repo-local Codex skills live at `.agents/skills/<skill-name>/SKILL.md`.
- Pod-native OpenClaw skills use `/workspace/skills/<slug>/SKILL.md`.
- Pod Codex completion hook source uses `/workspace/codex-hooks`.
- computer-use/tool surfaces are capability surfaces, not a repo-local Codex artifact unless a SoT says so.

### Rule

Choose placement by runtime owner and validation path. Do not place a pod-native OpenClaw skill in `.agents/skills`, and do not treat `/workspace/codex-hooks` as `.codex/hooks`.
