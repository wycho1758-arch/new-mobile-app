# Historical Vs Active

Status: reusable template guidance
Source class: reference
Upstream SoT:

- `team-doc/mobile-app-dev-team/00-sot-and-principles.md`
- `team-doc/mobile-app-dev-team/ref-organization/99-source-map-and-migration/source-priority.md`

Downstream consumers:

- Future migration decisions.

Last reviewed date: 2026-06-10
Reviewer evidence: .evidence/reviews/ref-organization-final-rereview-xhigh-20260610.md

## Classes

- active current SoT: current repo rules, runtime paths, managed docs, active skills, and active agents.
- historical source: frozen Confluence exports, `team-doc/00-source`, and prior structured references, with content and metadata validated through `TEAM_DOC_ARCHIVE_MANIFEST.json` and `TEAM_DOC_ARCHIVE_BUNDLE.jsonl`.
- current-project example: facts from the current WonderMove mobile repo used as examples.
- reusable template guidance: generalized procedure for future organizations.

## Rule

`team-doc/10-structured` is historical/reference material for this migration.
Its live directory is not the validation source after archive capture; root
`TEAM_DOC_ARCHIVE_MANIFEST.json` and `TEAM_DOC_ARCHIVE_BUNDLE.jsonl` are the
archive validation source. If historical content conflicts with current managed
docs, current SoT wins.
