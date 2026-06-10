# Reviewer Researcher Boundaries

Status: reusable template guidance
Source class: reference
Upstream SoT:

- `.codex/agents/`
- `mobile-app-dev-team/04-skills-and-agents-matrix.md`
- `.agents/skills/wm/SKILL.md`

Downstream consumers:

- Future reviewer and researcher routing docs.

Last reviewed date: 2026-06-10
Reviewer evidence: .evidence/reviews/ref-organization-final-rereview-xhigh-20260610.md

## Rules

Reviewer and researcher agents must be read-only.

They must include source references, must not recursively delegate, must not edit files, must not approve failed gates, and must not accept human-gate risk.

## Output

Reviewer output should lead with findings ordered by severity and include residual risk, missing tests/evidence, and next owner when relevant.
