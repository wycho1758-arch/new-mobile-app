# Confluence Dependency Decoupling Planning Evidence

Date: 2026-06-10
Scope: `$wm` SoT-grounded plan for resolving hard Confluence dependencies.

## Serena MCP

- `mcp__serena.initial_instructions` was read.
- Project activated: `/Users/tw.kim/Documents/AGA/test/new-mobile-app`.
- Serena `search_for_pattern` was used for `Confluence|confluence|pageId|sourcePageId|sot/snapshot.json|docs/confluence` under `evals/local-harness`.

Key Serena finding:

- `evals/local-harness/README.md` says the harness uses Confluence pages as source of truth.
- `evals/local-harness/sot/snapshot.json` stores Confluence provenance and page IDs locally.
- Local harness fixtures prohibit Confluence side effects.

## Focused Repo Scan

Command:

```text
rg -n "Confluence|confluence|Atlassian|atlassian|pageId|sourcePageId|sourcePageIds|docs/confluence" AGENTS.md REPO_OPERATIONS.md PROJECT_ENVIRONMENT.md package.json scripts docs .agents .codex evals team-doc --hidden -g '!node_modules' -g '!TEAM_DOC_ARCHIVE_BUNDLE.jsonl' -g '!TEAM_DOC_ARCHIVE_MANIFEST.json'
```

Material findings:

- `AGENTS.md` requires environment/runtime changes to keep `PROJECT_ENVIRONMENT.md` and the Confluence update document in sync.
- `REPO_OPERATIONS.md` classifies root policy/runtime files as current operating policy and `team-doc/00-source` as immutable Confluence export evidence.
- `scripts/validate-runtime-artifacts.mjs` requires `docs/confluence/20260608-codex-expo-rn-runtime-sot-update.md` and specific content.
- `scripts/test-local-harness.mjs` reads `evals/local-harness/sot/snapshot.json` and generated summary says `validation mode: offline snapshot`.
- `package.json` exposes `test:local-harness:sot-refresh` as an active package script that mentions manual Atlassian MCP refresh.
- `docs/plans/20260609-structure-inspection-sot.md` states project/runtime gate is the SoT and Confluence is corrected when it diverges.

## Sidecar Classification

Read-only sidecar conclusion:

- No evidence that `test:runtime` or local harness directly performs live Confluence/Atlassian calls.
- Actual hard coupling is local runtime validator dependency on `docs/confluence/20260608-codex-expo-rn-runtime-sot-update.md`.
- `evals/local-harness/README.md` wording conflicts with actual offline snapshot behavior.
- Page IDs in local harness, skill crosswalks, and archive metadata should be preserved as provenance/refetch anchors.
- `docs/confluence/**` should be treated as publication mirror/evidence, not active runtime SoT.

Classification:

| Class | Evidence | Plan Impact |
| --- | --- | --- |
| Hard runtime/gate coupling | `scripts/validate-runtime-artifacts.mjs` requires `docs/confluence/**`; `package.json` exposes `test:local-harness:sot-refresh`. | Validator-first decoupling required. |
| Offline snapshot/provenance | `evals/local-harness/sot/snapshot.json`, `scripts/test-local-harness.mjs`, skill source crosswalks. | Reword as local snapshot/provenance, preserve page IDs. |
| Historical/archive evidence | `TEAM_DOC_ARCHIVE_MANIFEST.json`, `TEAM_DOC_ARCHIVE_BUNDLE.jsonl`, `team-doc/_meta/**`. | Preserve, do not rewrite or delete. |
| Publication mirror/human-gated workflow | `docs/confluence/**`, previous publish plans. | Demote from active SoT; keep live publish human-gated. |

## Commands Run During Planning

```text
node scripts/validate-runtime-artifacts.mjs
Validated 11 skills, 13 agents, and 4 hook events.
exit=0
```

Later pre-review rerun in the current dirty workspace:

```text
node scripts/validate-runtime-artifacts.mjs
- root Claude runtime artifact must not be present: .claude
- root Claude runtime artifact must not be present: .claude-state
exit=1
```

Current root artifact status:

```text
?? .claude-state/
?? .claude/
```

Interpretation: this is a current workspace blocker for runtime validation and
is not caused by the planning files. It must be cleaned or otherwise resolved
before implementation/final runtime verification.

```text
node scripts/validate-repo-operations.mjs
Validated repo operations policy ownership.
exit=0
```

```text
node scripts/validate-team-doc.mjs
Validated current team-doc managed docs.
exit=0
```

```text
node scripts/test-local-harness.mjs --stage summary
unknown stage: summary
exit=1
```

The failed `summary` command is evidence that `summary` is not a valid direct stage. The implementation plan therefore uses valid local harness checks:

- `node scripts/test-local-harness.mjs --self-test --stage all`
- `node scripts/test-local-harness.mjs --stage all`
- `pnpm run test:local-harness`

## Phase 0 Refresh

Current baseline after goal continuation:

```text
git status --short
 M .github/workflows/quality-gate.yml
 M PROJECT_ENVIRONMENT.md
 M REPO_OPERATIONS.md
 M docs/plans/work-units/README.md
 M package.json
 M scripts/validate-repo-operations.mjs
 M team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md
?? .evidence/reviews/confluence-dependency-decoupling-planning-evidence-20260610.md
?? docs/plans/active/20260610-confluence-dependency-decoupling-plan.md
...
```

The tracked work-unit related changes pre-existed this continuation and must be
preserved. Confluence decoupling edits must work with, not revert, those changes.

Root `.claude/` and `.claude-state/` status:

```text
ls -ld .claude .claude-state
exit=0 with no output
```

Current baseline validators:

```text
node scripts/validate-runtime-artifacts.mjs
Validated 11 skills, 13 agents, and 4 hook events.
exit=0
```

```text
node scripts/validate-repo-operations.mjs
Validated repo operations policy ownership.
exit=0
```

```text
node scripts/validate-team-doc.mjs
Validated current team-doc managed docs.
exit=0
```

```text
node scripts/validate-team-doc-archive.mjs
Validated team-doc archive/reference corpus from root archive files: 71 source files, 32 structured files.
exit=0
```

```text
pnpm run test:runtime
Validated 11 skills, 13 agents, and 4 hook events.
Codex headless review helper self-test passed.
Validated repo operations policy ownership.
Validated current team-doc managed docs.
Validated work-unit status fixtures.
Validated work-unit status artifacts.
Passed 44 hook fixture tests.
exit=0
```

```text
pnpm run test:local-harness
clean-tree-guard self-test passed
codex-preflight self-test passed
Validated 11 skills, 13 agents, and 4 hook events.
Validated work-unit status fixtures.
Validated work-unit status artifacts.
Passed 44 hook fixture tests.
Tasks: 6 successful, 6 total
self-test all passed
local harness all passed
exit=0
```

## Reviewer(xhigh) Script Decision

Decision: GO for option B.

`test:local-harness:sot-refresh` must be renamed to
`sot:provenance-refresh:manual`.

Implementation instructions:

- Remove the `test:` prefix because the command is not a deterministic local
  test and must not look like a runtime gate.
- Keep the command as manual/advisory provenance refresh guidance.
- The message must state it is not a test, not CI, and not required for
  `test:runtime` or `test:local-harness`.
- The message/docs must preserve provenance workflow expectations: page IDs,
  current versions, fetched time, diff summary, reviewer evidence, and user
  approval before any live publish.
- Do not wire the renamed script into `test:runtime`, `test:local-harness`, or CI.
- Add/update validation so manual/non-deterministic refresh commands cannot use
  a `test:` prefix.

## Phase 0 Reviewer(high) Rereview Trigger

Initial Phase 0 reviewer(high) returned NO_GO because `.claude-state/` was
present during a direct `node scripts/validate-runtime-artifacts.mjs` rerun and
could mask the Phase 1 expected RED source.

Current recheck:

```text
git status --short .claude-state .claude
exit=0 with no output
```

```text
node scripts/validate-runtime-artifacts.mjs
Validated 11 skills, 13 agents, and 4 hook events.
exit=0
```

Interpretation: the root Claude artifact blocker is not present at this
recheck point. Phase 1 expected RED can now be attributed to the planned
validator-first Confluence dependency assertion instead of root Claude runtime
artifacts.

## Phase 1 Validator-First RED

Changed file:

- `scripts/validate-repo-operations.mjs`

Validator contract added:

- package scripts with manual/provenance refresh behavior must not use a
  `test:` prefix.
- `scripts/validate-runtime-artifacts.mjs` must validate
  `PROJECT_ENVIRONMENT.md` as repo-local runtime SoT.
- `scripts/validate-runtime-artifacts.mjs` must not require
  `docs/confluence/**`, `confluenceRuntimeSotPath`, or `Confluence runtime SoT
  update` as active runtime SoT.
- `evals/local-harness/README.md` must describe `sot/snapshot.json` as an
  offline local snapshot, not live Confluence as source of truth.
- The local harness README must rename the exact `## Confluence Sources`
  section or make the section explicitly provenance/non-live dependency.

Expected RED:

```text
node scripts/validate-repo-operations.mjs
- package.json manual/provenance refresh script must not use test: prefix: test:local-harness:sot-refresh
- scripts/validate-runtime-artifacts.mjs must not require docs/confluence/20260608-codex-expo-rn-runtime-sot-update.md as active runtime SoT
- scripts/validate-runtime-artifacts.mjs must not require confluenceRuntimeSotPath as active runtime SoT
- scripts/validate-runtime-artifacts.mjs must not require Confluence runtime SoT update as active runtime SoT
- evals/local-harness/README.md must describe sot/snapshot.json as an offline local snapshot, not live Confluence as source of truth
- evals/local-harness/README.md must rename Confluence Sources to a provenance/source-crosswalk section or state it is not a live dependency
exit=1
```

Whitespace check:

```text
git diff --check -- scripts/validate-repo-operations.mjs docs/plans/active/20260610-confluence-dependency-decoupling-plan.md .evidence/reviews/confluence-dependency-decoupling-planning-evidence-20260610.md
exit=0
```

## Plan Path

`docs/plans/active/20260610-confluence-dependency-decoupling-plan.md`

## Status

Planning and Phase 1-6 implementation evidence recorded. Final phase reviewer
and final verification remain required before Done.

## Implementation Evidence

Changed paths for this Confluence dependency decoupling work:

- `AGENTS.md`
- `REPO_OPERATIONS.md`
- `PROJECT_ENVIRONMENT.md`
- `package.json`
- `scripts/validate-runtime-artifacts.mjs`
- `scripts/validate-repo-operations.mjs`
- `scripts/test-local-harness.mjs`
- `evals/local-harness/README.md`
- `.agents/skills/mobile-app-dev-workflow/references/sot.md`
- `.agents/skills/mobile-backend-api-integrator-workflow/references/sot.md`
- `docs/confluence/20260608-codex-expo-rn-runtime-sot-update.md`
- `docs/plans/active/20260608-codex-expo-rn-runtime-stability-plan.md`
- `docs/plans/active/20260610-mobile-app-dev-team-root-migration-plan.md`
- `docs/plans/active/20260610-confluence-dependency-decoupling-plan.md`

Phase 2 result:

- `AGENTS.md`, `REPO_OPERATIONS.md`, and `PROJECT_ENVIRONMENT.md` now state
  that root/local runtime files and offline snapshots are active local SoT.
- `docs/confluence/**` is documented as local publication mirror/evidence, not
  active runtime SoT.
- Live Confluence publish/update remains human-gated with page IDs, versions,
  proposed body changes, and reviewer evidence.

Phase 3 result:

- `scripts/validate-runtime-artifacts.mjs` no longer requires
  `docs/confluence/20260608-codex-expo-rn-runtime-sot-update.md`.
- Reviewer JSON envelope and `--json-envelope` checks remain enforced through
  `PROJECT_ENVIRONMENT.md`.
- `scripts/validate-repo-operations.mjs` now prevents reintroducing the removed
  `docs/confluence/**` hard runtime dependency.

Phase 4 result:

- `evals/local-harness/README.md` now says `sot/snapshot.json` is a repo-local
  offline snapshot.
- `## Confluence Sources` was renamed to `## Confluence Provenance`.
- `scripts/test-local-harness.mjs` summary extraction was updated to the new
  heading.
- Role skill SoT crosswalks now classify page IDs as provenance/refetch anchors
  and state ordinary repo-local workflow must not require live Confluence.

Phase 5 result:

- `test:local-harness:sot-refresh` was removed.
- `sot:provenance-refresh:manual` was added with explicit advisory wording:
  not a test, not CI, and not required for `test:runtime` or
  `test:local-harness`.
- Package-script validation rejects future manual/provenance refresh commands
  that use a `test:` prefix.

Phase 6 result:

- `docs/confluence/20260608-codex-expo-rn-runtime-sot-update.md` now identifies
  itself as local publication mirror/evidence, not active runtime SoT.
- Active plans that mention Confluence sync were updated to treat local mirror
  updates as publication evidence and live publish as human-gated.
- No live Confluence publish or external Atlassian write was performed.

## Implementation Commands

```text
node scripts/validate-repo-operations.mjs
Validated repo operations policy ownership.
exit=0
```

```text
node -e "const fs=require('node:fs'); for (const p of ['.claude', '.claude-state']) fs.rmSync(p, { recursive: true, force: true })" && node scripts/validate-runtime-artifacts.mjs
Validated 11 skills, 13 agents, and 4 hook events.
exit=0
```

```text
node scripts/test-local-harness.mjs --self-test --stage all
self-test all passed
exit=0
```

```text
node scripts/test-local-harness.mjs --stage all
local harness all passed
exit=0
```

```text
node scripts/validate-team-doc.mjs
Validated current team-doc managed docs.
exit=0
```

```text
node scripts/validate-team-doc-archive.mjs
Validated team-doc archive/reference corpus from root archive files: 71 source files, 32 structured files.
exit=0
```

```text
pnpm run test:runtime
Validated 11 skills, 13 agents, and 4 hook events.
Codex headless review helper self-test passed.
Validated repo operations policy ownership.
Validated current team-doc managed docs.
Validated work-unit status fixtures.
Validated work-unit status artifacts.
Passed 44 hook fixture tests.
exit=0
```

```text
pnpm run test:local-harness
clean-tree-guard self-test passed
codex-preflight self-test passed
Validated 11 skills, 13 agents, and 4 hook events.
Validated work-unit status fixtures.
Validated work-unit status artifacts.
Passed 44 hook fixture tests.
Tasks: 6 successful, 6 total
self-test all passed
local harness all passed
exit=0
```

Clean dependency search:

```text
rg -n 'test:local-harness:sot-refresh|Confluence pages listed in `sot/snapshot\.json` as the source of truth|^## Confluence Sources$|confluenceRuntimeSotPath|docs/confluence/20260608-codex-expo-rn-runtime-sot-update\.md|Confluence runtime SoT update' package.json scripts evals/local-harness PROJECT_ENVIRONMENT.md AGENTS.md REPO_OPERATIONS.md docs --hidden -g '!node_modules'
```

Classification:

- `scripts/validate-repo-operations.mjs` matches are allowed because they are
  forbidden-pattern assertions against future regressions.
- `docs/plans/active/20260610-confluence-dependency-decoupling-plan.md`
  matches are allowed because they record the original RED state, resolved
  findings, and the phase checklist.
- Active/historical plan references to `docs/confluence/**` are allowed only as
  local publication mirror/evidence or historical context.

## Phase Reviewer Gates

Phase 2 reviewer(xhigh): GO.

- Scope: local runtime SoT reframing.
- Critical/High/Medium findings: none.
- Low note: early evidence still records the old initial scan state, but later
  Phase 2 evidence records the corrected current state.
- Reviewer confirmed `AGENTS.md`, `REPO_OPERATIONS.md`, and
  `PROJECT_ENVIRONMENT.md` demote live Confluence from local validation gate and
  preserve page IDs as provenance/refetch anchors.

Phase 3 reviewer(xhigh): initial NO_GO, then GO after remediation.

- Initial Medium finding: `scripts/validate-repo-operations.mjs` blocked only
  the prior exact Confluence file path and did not generally block future
  `docs/confluence/**` runtime validator dependencies.
- Remediation: `scripts/validate-repo-operations.mjs` now fails if
  `scripts/validate-runtime-artifacts.mjs` contains a `docs/confluence` path
  reference or `['docs', 'confluence']` path construction.
- Rereview: GO. Runtime validator validates `PROJECT_ENVIRONMENT.md`, reviewer
  JSON envelope and `--json-envelope` checks remain enforced, and the
  regression guard blocks generic `docs/confluence/**` references in the
  runtime validator.

Phase 4 reviewer(xhigh): GO.

- Scope: local harness snapshot rewording.
- Critical/High/Medium findings: none.
- Reviewer confirmed `evals/local-harness/README.md` uses repo-local offline
  snapshot wording, `Confluence Provenance` heading, role SoT crosswalk
  provenance wording, preserved page IDs, and passing direct local harness
  checks.

Phase 5 reviewer(xhigh): GO.

- Scope: package script and refresh workflow.
- Critical/High/Medium findings: none.
- Low note resolved in this evidence file: stale text saying
  `test:local-harness:sot-refresh` still needed a decision was replaced with
  the actual Phase 5 GO decision.
- Reviewer confirmed `sot:provenance-refresh:manual` is advisory/non-test,
  non-CI, not wired into gates, includes refresh evidence requirements, and
  future `test:` manual refresh scripts are rejected.

Phase 6 reviewer(xhigh): GO.

- Scope: docs/Confluence mirror demotion.
- Critical/High/Medium findings: none.
- Low note: residual "Confluence Sync" wording in
  `docs/plans/active/20260610-mobile-app-dev-team-root-migration-plan.md`.
- Remediation: the residual wording was changed to "Confluence Publication
  Mirror" while preserving human-gated live publish requirements.
- Reviewer confirmed remaining `docs/confluence/**` references in active plans
  are publication/historical context, not active local gate dependencies.

## Phase 7 Final Verification

```text
git diff --check
exit=0
```

```text
node -e "const fs=require('node:fs'); for (const p of ['.claude', '.claude-state']) fs.rmSync(p, { recursive: true, force: true })" && node scripts/validate-runtime-artifacts.mjs
Validated 11 skills, 13 agents, and 4 hook events.
exit=0
```

```text
node scripts/validate-repo-operations.mjs
Validated repo operations policy ownership.
exit=0
```

```text
node scripts/validate-team-doc.mjs
Validated current team-doc managed docs.
exit=0
```

```text
node scripts/validate-team-doc-archive.mjs
Validated team-doc archive/reference corpus from root archive files: 71 source files, 32 structured files.
exit=0
```

```text
pnpm run test:runtime
Validated 11 skills, 13 agents, and 4 hook events.
Codex headless review helper self-test passed.
Validated repo operations policy ownership.
Validated current team-doc managed docs.
Validated work-unit status fixtures.
Validated work-unit status artifacts.
Passed 44 hook fixture tests.
exit=0
```

```text
pnpm run test:local-harness
clean-tree-guard self-test passed
codex-preflight self-test passed
Validated 11 skills, 13 agents, and 4 hook events.
Codex headless review helper self-test passed.
Validated repo operations policy ownership.
Validated current team-doc managed docs.
Validated work-unit status fixtures.
Validated work-unit status artifacts.
Passed 44 hook fixture tests.
Tasks: 6 successful, 6 total
self-test all passed
local harness all passed
exit=0
```

Final dependency search:

```text
rg -n 'test:local-harness:sot-refresh|Confluence pages listed in `sot/snapshot\.json` as the source of truth|^## Confluence Sources$|confluenceRuntimeSotPath|docs/confluence/20260608-codex-expo-rn-runtime-sot-update\.md|Confluence runtime SoT update' package.json scripts evals/local-harness PROJECT_ENVIRONMENT.md AGENTS.md REPO_OPERATIONS.md docs --hidden -g '!node_modules'
```

Final search classification:

- `scripts/validate-repo-operations.mjs` matches are intentional
  forbidden-pattern checks.
- `docs/plans/active/20260610-confluence-dependency-decoupling-plan.md`
  matches are historical RED/decision/progress records.
- `docs/plans/active/20260608-codex-hook-source-basis-confluence-update-plan.md`
  matches are historical publication evidence.
- `docs/plans/active/20260608-codex-expo-rn-runtime-stability-plan.md` and
  `docs/plans/active/20260610-mobile-app-dev-team-root-migration-plan.md`
  matches are local publication mirror or human-gated publication context.
- `scripts/validate-runtime-artifacts.mjs` has no `docs/confluence` path match.

## Final Reviewer(xhigh)

Verdict: GO.

Critical/High/Medium findings: none.

Low finding:

- `docs/plans/active/20260610-confluence-dependency-decoupling-plan.md` and
  `.evidence/reviews/confluence-dependency-decoupling-planning-evidence-20260610.md`
  are untracked and must be included in the eventual commit/PR evidence set.

Reviewer confirmed:

- active runtime validators no longer require `docs/confluence/**`;
- regression guard blocks future `docs/confluence/**` runtime-validator
  coupling;
- reviewer JSON envelope and `--json-envelope` gate strength is preserved
  through `PROJECT_ENVIRONMENT.md`;
- local harness docs and summary extraction use offline snapshot/provenance
  wording;
- Confluence page IDs remain provenance/crosswalk/archive references, not live
  runtime inputs;
- refresh workflow is advisory and not wired into test gates;
- `docs/confluence/**` is demoted to local publication mirror/evidence and live
  publish remains human-gated;
- final commands passed, including `pnpm run test:local-harness`.

## Reviewer(xhigh)

Verdict: GO

Critical/High/Medium findings: none.

Reviewer conclusion:

- The plan correctly classifies the hard coupling as a local
  `scripts/validate-runtime-artifacts.mjs` dependency on `docs/confluence/**`,
  not as live Confluence access in `test:runtime` or local harness.
- Page IDs, versions, source URLs, archive metadata, snapshots, and skill
  crosswalks are preserved as provenance/historical evidence.
- Validator-first/TDD sequencing is present.
- `docs/confluence/**` is demoted to publication mirror/evidence with human
  gate for live publish.
- Gate strength is preserved.
- The current `.claude/` and `.claude-state/` runtime-validation blocker is
  recorded as a workspace blocker not caused by the plan files.

Residual risks:

- `.claude/` and `.claude-state/` can be recreated by local runtime activity;
  final verification must remove transient artifacts before direct runtime
  validator execution, consistent with the root `validate` package script.
- Live Confluence publish remains out of scope and requires a separate human
  gate with page IDs, current versions, and proposed body.
- Phase 5 reviewer(xhigh) returned GO for replacing
  `test:local-harness:sot-refresh` with advisory
  `sot:provenance-refresh:manual`; no further implementation-time script
  decision is pending.
