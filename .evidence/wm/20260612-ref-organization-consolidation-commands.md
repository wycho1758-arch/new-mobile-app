# Ref Organization Consolidation Commands

Date: 2026-06-12

## Scope

- Consolidated `mobile-app-dev-team/ref-organization/` from 47 markdown files to 11 markdown files.
- Archived completed/superseded plan files `12`, `13`, and `18` under `mobile-app-dev-team/_archive/`.
- Folded the unique owner/operator URL material from `18` into `16-pod-environment-bootstrap.md`.
- Updated `17-orbstack-pod-config-values.md` branch/commit facts to the current committed branch/HEAD before uncommitted doc cleanup changes.
- Updated `scripts/validate-team-doc.mjs` so the consolidated ref-organization shape is enforced.

## Checkpoints

1. Checkpoint 1 TDD failure:
   - Command: `node scripts/validate-team-doc.mjs`
   - Exit: `1`
   - Expected failure: `ref-organization must stay consolidated to 11 markdown files; found 47`
2. Checkpoint 2 reviewer:
   - Agent: reviewer(xhigh)
   - Verdict: `GO_WITH_FINDINGS`
   - Findings addressed: stale `REPO_REF`/`REPO_COMMIT`; incomplete `18` URL carry-forward into `16`.
3. Checkpoint 3 validator:
   - Command: `node scripts/validate-team-doc.mjs`
   - Exit: `0`
   - Result: `Validated current mobile-app-dev-team managed docs.`
4. Checkpoint 4 gate checks:
   - Command: `pnpm run validate:team-doc`
   - Exit: `0`
   - Command: `pnpm run test:runtime`
   - Exit: `0`
   - Command: `pnpm run test:local-harness`
   - Exit: `0`
   - Command: `pnpm run validate:evidence-hygiene`
   - Exit: `0`
5. Final reviewer rerun fix:
   - Reviewer finding: `99-source-map.md` referenced two pre-consolidation ref-organization markdown paths.
   - Fix: updated those references to consolidated section READMEs.
   - Guard: added validator coverage for backticked `ref-organization/**/*.md` paths in `99-source-map.md`.
   - TDD failure before fix: `source map references missing ref-organization markdown path`.
   - Commands after fix:
     - `node scripts/validate-team-doc.mjs`: `0`
     - `pnpm run test:runtime`: `0`
     - `pnpm run test:local-harness`: `0`

## Notes

- Serena config was checked, but only `get_current_config` was exposed in the active callable tool surface; bounded file reads and `rg` were used for the remaining lookup.
- Existing dirty worktree changes outside this scope were preserved.
