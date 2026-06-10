# mobile-app-dev-team Root Migration And team-doc Removal Plan

Date: 2026-06-10
Last Updated: 2026-06-10
Status: Transition plan finalized through Phase 1 archive-readiness review; implementation not started
Owner: Codex runtime/docs operations
Execution mode: `$wm` SoT-grounded transition planning; implementation requires separate approval, validator-first edits, and reviewer evidence.

## Critical Instructions

After completing each phase:

1. Check off completed task checkboxes.
2. Run every quality gate command listed for the phase.
3. Record command output, exit status, and evidence path.
4. Update `Last Updated`.
5. Do not proceed to the next phase while a required gate is failing unless the blocker is source-backed and explicitly accepted by the next owner.

This plan does not authorize immediate physical deletion. It defines the required transition work before `team-doc/mobile-app-dev-team/` can become root `mobile-app-dev-team/` and before `team-doc/` can be removed.

## Goal

Move the current managed team documentation root from:

```text
team-doc/mobile-app-dev-team/
```

to:

```text
mobile-app-dev-team/
```

Then remove the remaining `team-doc/` directory only after current docs, historical archives, validators, gates, and references no longer require it.

## Desired End State

- `mobile-app-dev-team/` is the current managed docs root for team, role, process, reference, migration, and pod-native OpenClaw skill source docs.
- `team-doc/` does not exist in the working tree.
- Historical `team-doc/00-source/`, `team-doc/10-structured/`, and `team-doc/_meta/` content remains preserved through root archive files:
  - `TEAM_DOC_ARCHIVE_MANIFEST.json`
  - `TEAM_DOC_ARCHIVE_BUNDLE.jsonl`
- Active validators read current docs from `mobile-app-dev-team/`, not `team-doc/mobile-app-dev-team/`.
- Archive/reference validators read root archive files, not live `team-doc/**` directories.
- `pnpm run test:runtime` and `pnpm run test:local-harness` pass after the migration.
- A non-destructive temp-workspace simulation proves `team-doc/` can be absent.

## Current NO_GO Basis

The previous `$wm` review found that the move/delete is not currently safe:

- `AGENTS.md` names `team-doc/mobile-app-dev-team/09-pod-native-openclaw-skills/<slug>/` as the pod-native OpenClaw authoring path.
- `REPO_OPERATIONS.md` names `team-doc/mobile-app-dev-team/` as the current team/role/process/reference/migration documentation owner.
- `package.json` includes `validate:team-doc` in `test:runtime`.
- `scripts/validate-team-doc.mjs` uses `docRoot = root/team-doc` and `managedTeamDocRoot = mobile-app-dev-team`.
- A temp copy simulation of `team-doc/mobile-app-dev-team -> mobile-app-dev-team` plus `rm -rf team-doc` made `validate-repo-operations` and `validate-team-doc` fail.
- `validate-team-doc-archive` passing after that simulation proves only archive/reference bundle integrity, not current managed-doc delete safety.

## SoT Inputs

| SoT | Planning Decision Grounded |
| --- | --- |
| `AGENTS.md` | Current runtime paths, TDD, branch/PR workflow, `team-doc/mobile-app-dev-team` OpenClaw authoring policy, required gates. |
| `REPO_OPERATIONS.md` | Canonical repo-wide policy ownership, validator responsibility, archive/reference model, package script composition. |
| `PROJECT_ENVIRONMENT.md` | Runtime gate expectations and local harness requirement for Codex runtime/path changes. |
| `package.json` | `test:runtime`, `validate:team-doc`, `validate:repo-operations`, and `validate:team-doc-archive` script composition. |
| `scripts/validate-repo-operations.mjs` | Root policy and current path assertions that must change validator-first. |
| `scripts/validate-team-doc.mjs` | Current managed-doc traversal root and required document list that must move to `mobile-app-dev-team/`. |
| `scripts/validate-team-doc-archive.mjs` | Archive validator must remain root-archive based and must not regain live `team-doc/**` coupling. |
| `scripts/generate-team-doc.mjs` | Legacy Confluence-shaped generator still targets `team-doc`; it must be retired or archived before deletion. It must not be retargeted to `mobile-app-dev-team/` without a separate SoT-approved migration. |
| `.github/workflows/quality-gate.yml` | Conditional local-harness path detection must include the new `mobile-app-dev-team/**` root after migration. |
| `docs/confluence/20260608-codex-expo-rn-runtime-sot-update.md` | Local Confluence mirror for current runtime/environment setup; must stay in sync when runtime/path/gate settings change. |
| `docs/plans/active/20260608-codex-hook-source-basis-confluence-update-plan.md` | Prior Confluence publication workflow precedent for live page refetch/version comparison and evidence capture before publish. |
| `team-doc/mobile-app-dev-team/00-sot-and-principles.md` | Current docs identify `team-doc/mobile-app-dev-team/` as current managed docs and historical `team-doc/**` as archive identifiers. |
| `team-doc/mobile-app-dev-team/ref-organization/00-orientation-and-sot/sot-priority.md` | SoT priority currently includes `team-doc/mobile-app-dev-team`; this must be migrated to `mobile-app-dev-team`. |
| `docs/plans/active/20260610-team-doc-archive-delete-readiness-plan.md` | Existing plan already handles `team-doc/00-source`, `team-doc/10-structured`, and `_meta` archive readiness; this migration depends on that work staying intact. |

## Scope

In scope:

- Planning, validator-first migration, mechanical docs move, reference rewrites, temporary deletion simulation, and reviewer evidence.
- Current managed docs under `team-doc/mobile-app-dev-team/**`.
- Historical archive references for `team-doc/00-source/**`, `team-doc/10-structured/**`, and `team-doc/_meta/**`.
- Root policy, runtime gate, local harness, and validator path updates.

Out of scope:

- Changing Expo/mobile app runtime behavior.
- Changing API contracts.
- Modifying external OpenClaw, Jira, GitHub branch protection, or platform/runtime repositories.
- Publishing live Confluence changes without the Confluence Sync phase evidence and human gate.
- Claiming actual OpenClaw pod packaging behavior from local validation alone.

## Migration Strategy

Use a two-track migration:

1. Preserve historical content first.
   - Keep the root archive manifest and bundle as the historical content SoT.
   - Prove archive validation does not need live `team-doc/00-source`, `team-doc/10-structured`, or `team-doc/_meta`.
2. Promote current managed docs to root.
   - Change validators and SoT wording to expect `mobile-app-dev-team/`.
   - Move docs with `git mv`.
   - Rewrite current references from `team-doc/mobile-app-dev-team` to `mobile-app-dev-team`.
   - Leave `team-doc/**` strings only when they are explicit historical path identifiers in root archive metadata, archive bundle content, or documented historical crosswalk rows.

## Phase 0: Baseline And Worktree Isolation

Goal: prevent this migration from overwriting unrelated in-progress work.

Tasks:

- [x] Record `git status --short`.
- [x] Record `git diff --stat`.
- [x] Identify dirty files overlapping this plan's affected paths.
- [x] For overlapping dirty files, save a baseline patch under `.evidence/reviews/` before editing.
- [x] Confirm `mobile-app-dev-team/` does not already exist at root, or classify its contents if it does.
- [x] Confirm current `team-doc/` contents with `find team-doc -maxdepth 3 -type f | sort`.

Quality gate:

- [x] `node scripts/validate-repo-operations.mjs` exits 0 before migration starts, or blocker is documented.
- [x] `node scripts/validate-team-doc.mjs` exits 0 before migration starts, or blocker is documented.
- [x] `node scripts/validate-team-doc-archive.mjs` exits 0 before migration starts, or blocker is documented.

Rollback:

- No repo state changes except evidence files; delete only the evidence file created by this phase if the migration is abandoned.

## Phase 1: Archive Readiness Prerequisite

Goal: make the non-current historical corpus independent from the live `team-doc/` directory.

Tasks:

- [x] Verify `TEAM_DOC_ARCHIVE_MANIFEST.json` exists.
- [x] Verify `TEAM_DOC_ARCHIVE_BUNDLE.jsonl` exists.
- [x] Run `node scripts/validate-team-doc-archive.mjs`.
- [x] Inspect `scripts/validate-team-doc-archive.mjs` and confirm validation input is root archive files, not live legacy directories.
- [x] Decide whether `scripts/create-team-doc-archive-manifest.mjs` remains a one-time pre-deletion capture tool or is retired after `team-doc/` deletion.
- [x] Decide whether `scripts/generate-team-doc.mjs` is removed, archived, or rewritten to a non-`team-doc` output path.

Phase 1 decision:

- `scripts/create-team-doc-archive-manifest.mjs` must be retired from active tooling after final capture, or moved to archived tooling with a pre-deletion-only guard. The active `generate:team-doc-archive` package script must be removed or demoted before physical deletion.
- `scripts/generate-team-doc.mjs` must be retired from active tooling or moved to archived tooling with an explicit legacy-only guard. It must not be rewritten to emit `mobile-app-dev-team/` without a separate SoT-approved migration because it generates legacy Confluence-shaped corpus, not current managed docs.
- Evidence: `.evidence/reviews/mobile-app-dev-team-root-migration-phase1-archive-readiness-20260610.md`.

Quality gate:

- [x] `node scripts/validate-team-doc-archive.mjs` exits 0.
- [x] A temp workspace can remove `team-doc/00-source`, `team-doc/10-structured`, and `team-doc/_meta` while `validate-team-doc-archive` still exits 0.

Rollback:

- Restore only archive-validator or script policy edits from this phase.
- Do not alter root archive files unless the phase explicitly regenerates them and records new hashes.

## Phase 2: Validator Expectations First

Goal: update the narrowest failing checks before moving files.

Tasks:

- [ ] Update `scripts/validate-repo-operations.mjs` expected policy terms to require `mobile-app-dev-team/` as the current managed docs root.
- [ ] Update `scripts/validate-repo-operations.mjs` to forbid active current policy ownership of `team-doc/mobile-app-dev-team/` after migration, while still allowing historical `team-doc/00-source`, `team-doc/10-structured`, and `team-doc/_meta` archive identifiers where appropriate.
- [ ] Update `scripts/validate-team-doc.mjs` so current docs are read from `path.join(root, 'mobile-app-dev-team')`.
- [ ] Update `scripts/validate-team-doc.mjs` failure messages so missing current docs report `mobile-app-dev-team/<path>`, not `team-doc/mobile-app-dev-team/<path>`.
- [ ] Update crosswalk target validation so current ref-organization targets live under `mobile-app-dev-team/ref-organization/`.
- [ ] Add validator assertions that no active current SoT page names `team-doc/mobile-app-dev-team` as the managed docs root after migration.
- [ ] Keep assertions that historical archive references route through `TEAM_DOC_ARCHIVE_MANIFEST.json` and `TEAM_DOC_ARCHIVE_BUNDLE.jsonl`.
- [ ] Run the updated validators before moving files and record the expected RED result.

Expected RED result:

- [ ] `node scripts/validate-repo-operations.mjs` fails because SoT still names the old path.
- [ ] `node scripts/validate-team-doc.mjs` fails because files have not yet moved to root `mobile-app-dev-team/`.

Rollback:

- Revert validator changes only.

## Phase 3: Root Policy And Current SoT Rewrite

Goal: change policy ownership before or alongside the mechanical move.

Tasks:

- [ ] Update `AGENTS.md` OpenClaw authoring path from `team-doc/mobile-app-dev-team/09-pod-native-openclaw-skills/<slug>/` to `mobile-app-dev-team/09-pod-native-openclaw-skills/<slug>/`.
- [ ] Update `AGENTS.md` repository structure or runtime notes if they mention `team-doc/`.
- [ ] Update `REPO_OPERATIONS.md` policy ownership map:
  - [ ] `mobile-app-dev-team/` is current team/role/process/reference/migration documentation.
  - [ ] `team-doc/00-source`, `team-doc/10-structured`, and `team-doc/_meta` are historical path identifiers preserved by root archive files, not live directories.
  - [ ] `team-doc/` is delete-ready only after temp-workspace absence checks pass.
- [ ] Update package/gate descriptions only if script names change. Prefer keeping `validate:team-doc` script name for compatibility unless a separate rename is approved.
- [ ] Update `.github/workflows/quality-gate.yml` so conditional local-harness detection includes `mobile-app-dev-team/**` after the current managed docs root moves.
- [ ] Update `PROJECT_ENVIRONMENT.md` CI path list so it names `mobile-app-dev-team/**` as a local-harness-triggering path after migration.
- [ ] Update `docs/confluence/20260608-codex-expo-rn-runtime-sot-update.md` so its runtime-change detector and runtime path sections mirror the same `mobile-app-dev-team/**` current-docs-root change.
- [ ] Update current managed docs SoT priority pages to replace current `team-doc/mobile-app-dev-team` entries with `mobile-app-dev-team`.
- [ ] Preserve historical strings like `team-doc/00-source/**` and `team-doc/10-structured/**` only as historical identifiers.

Quality gate:

- [ ] `rg -n "team-doc/mobile-app-dev-team" AGENTS.md REPO_OPERATIONS.md PROJECT_ENVIRONMENT.md package.json scripts mobile-app-dev-team docs/plans --hidden` returns only planned historical/evidence references after Phase 4.
- [ ] `.github/workflows/quality-gate.yml` path detection includes `mobile-app-dev-team/**`.
- [ ] `PROJECT_ENVIRONMENT.md` CI section includes `mobile-app-dev-team/**` in the local-harness trigger list.
- [ ] `docs/confluence/20260608-codex-expo-rn-runtime-sot-update.md` includes the same current-docs-root and CI/local-harness trigger update.
- [ ] `node scripts/validate-repo-operations.mjs` no longer fails on root policy terms after Phase 4.

Rollback:

- Revert policy text changes and validator expectation changes together if Phase 4 cannot proceed.

## Phase 4: Mechanical Move And Current Reference Rewrite

Goal: move current managed docs with history-preserving paths and update current references.

Tasks:

- [ ] Run `git mv team-doc/mobile-app-dev-team mobile-app-dev-team`.
- [ ] Rewrite active current references:
  - [ ] `team-doc/mobile-app-dev-team/` -> `mobile-app-dev-team/`
  - [ ] `team-doc/mobile-app-dev-team` -> `mobile-app-dev-team`
- [ ] Update internal upstream/downstream references under `mobile-app-dev-team/ref-organization/**`.
- [ ] Update `mobile-app-dev-team/99-source-map.md` so current source rows point to `mobile-app-dev-team/**`.
- [ ] Update `mobile-app-dev-team/ref-organization/99-source-map-and-migration/old-to-new-crosswalk.md` so migration targets point to `mobile-app-dev-team/ref-organization/**`.
- [ ] Keep historical source rows for `team-doc/00-source/**` and `team-doc/10-structured/**` when they explicitly describe archived identifiers.
- [ ] Update docs plans that are active and current-facing. Evidence files may retain old paths as historical evidence unless a validator requires otherwise.
- [ ] Confirm `team-doc/mobile-app-dev-team/` no longer exists.

Quality gate:

- [ ] `test -d mobile-app-dev-team`.
- [ ] `test ! -e team-doc/mobile-app-dev-team`.
- [ ] `node scripts/validate-repo-operations.mjs` exits 0.
- [ ] `node scripts/validate-team-doc.mjs` exits 0.
- [ ] `node scripts/validate-team-doc-archive.mjs` exits 0.

Rollback:

- `git mv mobile-app-dev-team team-doc/mobile-app-dev-team`.
- Revert reference rewrites from this phase and validator/policy changes if needed.

## Phase 5: Retire Or Rehome Remaining team-doc Couplings

Goal: make the top-level `team-doc/` directory removable.

Tasks:

- [ ] Inspect remaining `team-doc/` directory after Phase 4.
- [ ] Remove or migrate `team-doc/readme.md`.
- [ ] Confirm `team-doc/_meta` is preserved in `TEAM_DOC_ARCHIVE_BUNDLE.jsonl` and does not need to remain live.
- [ ] If `scripts/create-team-doc-archive-manifest.mjs` still requires live `team-doc/**`, mark it as pre-deletion-only or retire it.
- [ ] If `scripts/generate-team-doc.mjs` still writes `team-doc/**`, remove it from active tooling or move it to archived tooling with an explicit legacy-only guard. Do not rewrite it to `mobile-app-dev-team/` without a separate SoT-approved migration.
- [ ] Update validators so no active gate requires live `team-doc/`.
- [ ] Confirm CI/local-harness change detection treats `mobile-app-dev-team/**` as a runtime/docs path before deleting `team-doc/`.
- [ ] Update docs that instruct users to edit live `team-doc/**`.
- [ ] Leave `team-doc/**` strings in root archive metadata and archive bundle content untouched unless regenerating archive files is explicitly approved.

Quality gate:

- [ ] `rg -n "team-doc/" AGENTS.md REPO_OPERATIONS.md PROJECT_ENVIRONMENT.md package.json scripts docs mobile-app-dev-team .agents .codex evals --hidden -g '!TEAM_DOC_ARCHIVE_BUNDLE.jsonl' -g '!TEAM_DOC_ARCHIVE_MANIFEST.json'` shows only allowed historical/evidence references.
- [ ] `node scripts/validate-repo-operations.mjs` exits 0.
- [ ] `node scripts/validate-team-doc.mjs` exits 0.
- [ ] `node scripts/validate-team-doc-archive.mjs` exits 0.

Rollback:

- Restore migrated/retired tools and `team-doc/readme.md` only if a current gate still requires them.

## Phase 6: Confluence Sync

Goal: keep local and live Confluence runtime documentation synchronized with the
path/gate migration.

Tasks:

- [ ] Confirm local mirror updates in `docs/confluence/20260608-codex-expo-rn-runtime-sot-update.md` cover:
  - [ ] `mobile-app-dev-team/` as the current managed docs root.
  - [ ] `team-doc/` as historical/archive path identifiers only.
  - [ ] `mobile-app-dev-team/**` as a local-harness-triggering runtime/docs path.
  - [ ] root archive files as preservation mechanism for `team-doc/00-source`, `team-doc/10-structured`, and `team-doc/_meta`.
- [ ] Use Atlassian/Confluence MCP to search/refetch candidate live pages before any publish:
  - [ ] `01-8. ClawPod Agent용 기본 모바일 앱 프로젝트 템플릿 repo 구성 설계안` / page ID candidate `1371963427`.
  - [ ] `mobile-app-dev-team` home page / page ID candidate `1373012374`.
  - [ ] `Role-specific Codex Runtime` / page ID candidate `1374289964`.
  - [ ] `codex-cli-native-runtime-paths` / page ID candidate `1374355481`.
  - [ ] `Mobile Codex CLI 실무 지침서` / page ID candidate `1374519410`.
- [ ] Record target page IDs, current versions, ownership, old-path references found, and update/no-update decisions under `.evidence/reviews/`.
- [ ] Human gate: publish live Confluence changes only after explicit user approval for the concrete page IDs and versioned body updates.
- [ ] After live publish, record page IDs, previous versions, new versions, update summary, and links in `.evidence/reviews/`.
- [ ] Update the local Confluence mirror with final live page/version/evidence references after publish.
- [ ] Request reviewer(high/xhigh) validation of local mirror, live Confluence evidence, and remaining residual risk.

Quality gate:

- [ ] `docs/confluence/20260608-codex-expo-rn-runtime-sot-update.md` matches `PROJECT_ENVIRONMENT.md` and `.github/workflows/quality-gate.yml` for runtime-change detector paths.
- [ ] Atlassian/Confluence search/refetch evidence exists before live publish.
- [ ] Human approval is recorded before live Confluence publish.
- [ ] Reviewer(high/xhigh) returns GO or a source-backed residual risk decision for Confluence sync.

Rollback:

- If local mirror edits are wrong, revert only the Confluence mirror lines from this phase.
- If live publish is wrong, create a corrective Confluence update using the recorded prior page version/body evidence rather than editing repo history.

## Phase 7: Non-Destructive team-doc Absence Simulation

Goal: prove `team-doc/` can be deleted without weakening active gates.

Tasks:

- [ ] Create a temp workspace under `/tmp`.
- [ ] Copy the full working tree including untracked migration artifacts, excluding `.git`, `node_modules`, and dependency caches.
- [ ] In the temp workspace, run `rm -rf team-doc`.
- [ ] Assert `test ! -e team-doc`.
- [ ] Run required checks in the temp workspace.

Required temp checks:

- [ ] `node scripts/validate-repo-operations.mjs`
- [ ] `node scripts/validate-team-doc.mjs`
- [ ] `node scripts/validate-team-doc-archive.mjs`
- [ ] `pnpm run test:runtime`
- [ ] `pnpm run test:local-harness`

Evidence:

- [ ] Record temp path.
- [ ] Record copy command.
- [ ] Record deletion command scoped to temp path.
- [ ] Record absence assertion.
- [ ] Record each command output and exit status under `.evidence/reviews/`.

Rollback:

- No rollback needed in the real workspace because deletion occurs only in `/tmp`.

## Phase 8: Physical Deletion And Final Verification

Goal: delete live `team-doc/` only after evidence proves it is no longer required.

Human gate:

- [ ] User explicitly confirms physical deletion of `team-doc/` after Phase 6 Confluence evidence and Phase 7 temp absence simulation both pass, unless the implementation request explicitly includes deletion in the same approved execution scope.

Tasks:

- [ ] Run `rm -rf team-doc` only after the human gate is satisfied.
- [ ] Run final current workspace checks.
- [ ] Run final reviewer(high) against diff, commands, and evidence.
- [ ] Report final diff summary and residual risks.

Required final checks:

- [ ] `pnpm run validate:repo-operations`
- [ ] `pnpm run validate:team-doc`
- [ ] `pnpm run validate:team-doc-archive`
- [ ] `pnpm run test:runtime`
- [ ] `pnpm run test:local-harness`
- [ ] `git status --short`
- [ ] `git diff --stat`

Rollback:

- Restore `team-doc/` from git if tracked files were deleted before merge.
- Restore historical archive content from `TEAM_DOC_ARCHIVE_BUNDLE.jsonl` only if the root archive files are proven corrupt; otherwise do not recreate live historical directories.

## Expected Affected Paths

- `AGENTS.md`
- `REPO_OPERATIONS.md`
- `package.json` only if script names or gate composition change
- `.github/workflows/quality-gate.yml`
- `PROJECT_ENVIRONMENT.md`
- `docs/confluence/20260608-codex-expo-rn-runtime-sot-update.md`
- `scripts/validate-repo-operations.mjs`
- `scripts/validate-team-doc.mjs`
- `scripts/validate-team-doc-archive.mjs`
- `scripts/create-team-doc-archive-manifest.mjs`
- `scripts/generate-team-doc.mjs`
- `team-doc/mobile-app-dev-team/**` moved to `mobile-app-dev-team/**`
- `team-doc/readme.md`
- `TEAM_DOC_ARCHIVE_MANIFEST.json`
- `TEAM_DOC_ARCHIVE_BUNDLE.jsonl`
- `docs/plans/active/**` references that are current-facing
- `.evidence/reviews/*mobile-app-dev-team-root-migration*`

## Reference Rewrite Rules

| Reference class | Rule |
| --- | --- |
| Active current managed docs root | Rewrite to `mobile-app-dev-team/`. |
| Pod-native OpenClaw skill source docs | Rewrite to `mobile-app-dev-team/09-pod-native-openclaw-skills/<slug>/`. |
| Runtime validator input | Rewrite to root `mobile-app-dev-team/`. |
| Historical `team-doc/00-source/**` | Keep only as archived path identifiers routed through root archive files. |
| Historical `team-doc/10-structured/**` | Keep only as archived path identifiers routed through root archive files. |
| Historical `team-doc/_meta/**` | Keep only as archived path identifiers routed through root archive files. |
| Old evidence files | May keep old paths as historical evidence unless validators require a current reference rewrite. |
| Root archive JSON/JSONL content | Do not rewrite path strings unless a separate archive regeneration is approved. |

## Risks And Mitigations

| Risk | Probability | Impact | Mitigation |
| --- | --- | --- | --- |
| Validators are weakened while paths are moved. | Medium | High | Update assertions first, preserve `test:runtime`, and require temp absence simulation. |
| Historical Confluence/source audit content is lost. | Low | High | Keep root manifest and JSONL bundle as archive SoT; validate hashes and byte counts. |
| Current docs retain stale old-path references. | High | Medium | Use Serena and `rg`; add validator assertions forbidding old active managed-doc root references. |
| Evidence files create noisy false positives. | Medium | Low | Classify evidence as historical; validators should target active docs and policy files, not old review logs unless needed. |
| `scripts/generate-team-doc.mjs` silently recreates `team-doc/`. | Medium | Medium | Retire, rename, or gate the legacy generator before physical deletion. |
| Concurrent dirty worktree edits are overwritten. | Medium | High | Baseline overlapping diffs and use `git mv` only after inspecting dirty status. |
| `test:local-harness` exposes runtime path assumptions not covered by narrow validators. | Medium | High | Require local harness before final deletion. |

## Reviewer Questions

- Does the plan correctly separate historical archive deletion-readiness from current managed-doc root migration?
- Are the validator-first RED expectations sufficient before the mechanical move?
- Is the treatment of `scripts/generate-team-doc.mjs` strict enough before deleting `team-doc/`?
- Are any current SoT or runtime gates missing from the expected affected paths?

## Progress Log

- 2026-06-10: Plan drafted from previous `$wm` NO_GO review and current SoT scan. No path move or deletion performed.
- 2026-06-10: Phase 0 baseline and Phase 1 archive-readiness evidence recorded. Reviewer(xhigh) decided legacy archive/generator scripts must be retired or rehomed from active tooling before `team-doc/` deletion, not retargeted to the new current docs root.
- 2026-06-10: Final reviewer(high) returned GO with no Critical/High/Medium findings. Non-blocking Phase 8 wording residual was addressed by explicitly requiring both Phase 6 Confluence evidence and Phase 7 temp absence simulation before physical deletion.
