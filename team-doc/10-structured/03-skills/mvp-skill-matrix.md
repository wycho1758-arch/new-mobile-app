---
docType: "reference"
sourcePageId: "1373667362"
sourceTitle: "01-4. Skills"
sourceVersion: "4"
sourceHeading: "MVP skill matrix"
---

# MVP skill matrix

The five MVP skills are the standing source of truth; case-coverage skills and modes never replace them. Each skill is deployed to one of two locations: the organization-runtime skill pack (installed in the generated agents' workspace or user skill location, for org operations and PRD/task decomposition) or the new-mobile-app repo skill pack (committed to `new-mobile-app/.agents/skills` for in-repo implementation, verification, and release).

## Deployment matrix

| Skill | Location | Target SOUL.md role(s) | Default case coverage |
| --- | --- | --- | --- |
| `mobile-prd-to-execution` | organization-runtime skill pack | Product/Planning | Case B |
| `mobile-design-handoff` | organization-runtime skill pack | Design; Mobile Architect and Mobile App Dev act as reviewers | Case B review premise, Case C, Case D |
| `mobile-api-contract` | new-mobile-app repo skill pack | Mobile Architect, Backend/API Integrator, Mobile App Dev | Case D, Case E |
| `mobile-qa-release` | new-mobile-app repo skill pack | QA/Release | Case C, D, E, F, G, H |
| `mobile-gatekeeper` | new-mobile-app repo skill pack | Gatekeeper (non-LLM); all LLM roles comply with gate results | Cross-cutting required check |

Note: `mobile-gatekeeper` is a deterministic hard gate — no LLM skill, hook, or reviewer may substitute or reinterpret its pass/fail outcome.

## Source

- Page ID: 1373667362
- Source heading: MVP skill matrix
- Source version: 4
