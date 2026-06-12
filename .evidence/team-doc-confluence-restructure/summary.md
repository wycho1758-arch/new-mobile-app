# Team Doc Confluence Restructure Evidence

- Date: 2026-06-09
- Scope: local `team-doc/` corpus generation from the Confluence `mobile-app-dev-team` tree.
- Reviewer: sub-agent read-only `wm-implementation-reviewer` style review completed before execution.

## Outputs

- `team-doc/readme.md`
- `team-doc/00-source/readme.md`
- `team-doc/10-structured/readme.md`
- `team-doc/_meta/confluence-page-map.json`
- `team-doc/_meta/split-map.json`
- `team-doc/_meta/fetch-report.md`
- `scripts/validate-team-doc.mjs`
- `scripts/generate-team-doc.mjs`

## Reviewer Findings Addressed

- Source tree is mirrored under `team-doc/00-source/` instead of a flat `pages/` directory.
- Lowercase `readme.md` indexes are required at the root and every major generated directory.
- Structured files require `docType` and source metadata frontmatter.
- `_meta/split-map.json` maps every source page to structured files or `source-only`.
- Probable secret scanning is included in the validator.
- Raw source content is not case-normalized; local `readme.md` rules apply only to generated indexes.

## Fetch Limitation

Atlassian MCP descendant metadata was captured successfully earlier in the run. Subsequent full page-body fetches timed out, including both space-wide and single-page fetches. The generated corpus is therefore metadata-complete and structure-complete, but full Confluence markdown body refresh remains pending. This is recorded in `team-doc/_meta/fetch-report.md`.

## Validation

- `node scripts/validate-team-doc.mjs` -> pass (`Validated team-doc: 71 source files, 32 structured files.`)
