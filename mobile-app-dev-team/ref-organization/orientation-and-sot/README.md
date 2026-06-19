# Orientation And SoT

Status: reusable template guidance
Source class: index
Upstream SoT:

- `mobile-app-dev-team/governance/sot-and-principles.md`

Downstream consumers:

- Reference organization readers.
- Future `orientation-and-sot/*` content pages.

Last reviewed date: 2026-06-10
Reviewer evidence: .evidence/reviews/ref-organization-checkpoint-2-xhigh-20260610.md

## Purpose


## Consolidated Former Files

- `current-project-vs-template.md` -> consolidated below
- `purpose.md` -> consolidated below
- `sot-priority.md` -> consolidated below

## Current Project Vs Template

Former file: `current-project-vs-template.md`

### Required Page Status Block

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

### Meaning

- `reusable template guidance`: generalized guidance for future organizations.
- `current-project example`: example from this WonderMove mobile project; not universal policy.
- `historical source migration`: material derived from `team-doc/10-structured/**` or `team-doc/00-source/**`.
- `active current SoT mirror`: an intentional mirror of current repo SoT, kept in sync with the source named in `Upstream SoT`.

### Rule

When a page conflicts with `AGENTS.md`, `PROJECT_ENVIRONMENT.md`, `.agents/skills`, `.codex/agents`, or current managed docs, the current SoT wins.

## Purpose

Former file: `purpose.md`

### Purpose

This tree is the reusable reference-organization documentation layer for future organizations.

It uses the current WonderMove mobile project as a concrete example while keeping current SoT, current-project examples, historical source migration, and reusable guidance separate.

### Scope

This layer explains how future organizations can define:

- source priority,
- team shape,
- runtime surfaces,
- role contracts,
- handoff workflows,
- gates and evidence,
- template variables,
- validation and Reviewer(xhigh) checkpoints.

`team-doc/10-structured` remains a historical path identifier unless a later
checkpoint rewrites material into this tree. Historical source content and
metadata are validated through root `TEAM_DOC_ARCHIVE_MANIFEST.json` and
`TEAM_DOC_ARCHIVE_BUNDLE.jsonl`.

### Rule

When reusable guidance conflicts with active current SoT, current SoT wins.

## SoT Priority

Former file: `sot-priority.md`

### Priority

Use this source order:

1. `AGENTS.md`
2. `PROJECT_ENVIRONMENT.md`
3. `.agents/skills`
4. `.codex/agents`
5. `mobile-app-dev-team`
6. `TEAM_DOC_ARCHIVE_MANIFEST.json`
7. `TEAM_DOC_ARCHIVE_BUNDLE.jsonl`

### Rule

Historical `team-doc/10-structured` and `team-doc/00-source` paths can explain
origin and intent, but active repo files and current managed docs define the
operating contract. Historical content validation routes through the root
archive files.
