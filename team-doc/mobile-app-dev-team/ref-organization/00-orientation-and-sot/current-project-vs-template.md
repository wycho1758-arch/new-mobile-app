# Current Project Vs Template

Status: reusable template guidance
Source class: page status convention
Upstream SoT:

- `team-doc/mobile-app-dev-team/12-ref-organization-goal-plan.md`
- `team-doc/mobile-app-dev-team/ref-organization/99-source-map-and-migration/validator-requirements.md`

Downstream consumers:

- All future `ref-organization/**/*.md` pages.
- `scripts/validate-team-doc.mjs` ref-organization checks.

Last reviewed date: 2026-06-10
Reviewer evidence: .evidence/reviews/ref-organization-checkpoint-2-xhigh-20260610.md

## Required Page Status Block

Every `ref-organization/**/*.md` page must include these fields near the top:

```text
Status: reusable template guidance | current-project example | historical source migration | active current SoT mirror
Source class: <index | policy | procedure | template | reference | migration crosswalk | validator planning | page status convention>
Upstream SoT:

- `<path>`

Downstream consumers:

- `<consumer>`

Last reviewed date: YYYY-MM-DD
Reviewer evidence: .evidence/reviews/<review-file>.md
```

## Meaning

- `reusable template guidance`: generalized guidance for future organizations.
- `current-project example`: example from this WonderMove mobile project; not universal policy.
- `historical source migration`: material derived from `team-doc/10-structured/**` or `team-doc/00-source/**`.
- `active current SoT mirror`: an intentional mirror of current repo SoT, kept in sync with the source named in `Upstream SoT`.

## Rule

When a page conflicts with `AGENTS.md`, `PROJECT_ENVIRONMENT.md`, `.agents/skills`, `.codex/agents`, or current managed docs, the current SoT wins.
