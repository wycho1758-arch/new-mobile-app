# Source Priority

Status: reusable template guidance
Source class: reference
Upstream SoT:

- `mobile-app-dev-team/00-sot-and-principles.md`
- `mobile-app-dev-team/99-source-map.md`

Downstream consumers:

- Migration and audit pages.

Last reviewed date: 2026-06-10
Reviewer evidence: .evidence/reviews/ref-organization-final-rereview-xhigh-20260610.md

## Priority

Use source priority in this order unless a newer SoT says otherwise:

1. `AGENTS.md`
2. `PROJECT_ENVIRONMENT.md`
3. `.agents/skills`
4. `.codex/agents`
5. `mobile-app-dev-team`
6. `TEAM_DOC_ARCHIVE_MANIFEST.json`
7. `TEAM_DOC_ARCHIVE_BUNDLE.jsonl`

## Rule

Historical `team-doc/10-structured` and `team-doc/00-source` paths remain
audit identifiers only. Their metadata and content are validated through root
archive files. When historical source conflicts with current managed docs or
active repo files, current managed docs and active repo files win.
