# Active Skill Agent Policy

Status: reusable template guidance
Source class: reference
Upstream SoT:

- `team-doc/mobile-app-dev-team/04-skills-and-agents-matrix.md`
- `.agents/skills/`
- `.codex/agents/`

Downstream consumers:

- Skill placement and reviewer boundary pages.

Last reviewed date: 2026-06-10
Reviewer evidence: .evidence/reviews/ref-organization-final-rereview-xhigh-20260610.md

## Policy

An active repo-local skill is active only when it exists in the actual `.agents/skills` directory.

Do not promote historical source names to active status unless the current repo has a matching skill or adapter.

## Current Project Example

Current `$wm` routing prefers dedicated `wm-*`, Product/Planning `po-*`, and Design `design-*` read-only reviewers/researchers. legacy mobile-* agents may remain available for other runtime/eval surfaces but are not the primary `$wm` route unless a newer SoT says so.

## Rule

repo skills remain authoritative for contracts, role boundaries, evidence, and QA gates. External or optional tools do not override repo-local skills.
