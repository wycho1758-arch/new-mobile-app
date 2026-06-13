# Verification Command Output

Date: 2026-06-13
Scope: `.evidence/reviews/20260613-codex-cli-role-skill-analysis/**`

This file records the verification commands run after the English update, English reviewer GO, Korean mirror update, Korean reviewer GO, and before final reviewer reporting.

## Commands

### Content scan

Command:

```text
rg -n "DESIGN\.md Baseline|same Stitch project|design_system_baseline|drift|Codex Implementation Plan Packet|Codex API Contract Plan Packet|final reviewer|git diff|git status|validate:team-doc|mobile-app-dev-team/\*\*|동일 Stitch|완료 보고|최종 reviewer" .evidence/reviews/20260613-codex-cli-role-skill-analysis
```

Exit status: 0

Key result:

```text
Expected Design baseline, same Stitch project, drift, manifest metadata, Mobile App Dev packet, Backend/API packet, final reviewer, diff/status, validate:team-doc, and mobile-app-dev-team/** trigger terms were present in the analysis package.
```

### `pnpm run validate:evidence-hygiene`

Exit status: 0

Key output:

```text
Validated evidence hygiene fixtures.
Validated evidence hygiene artifacts.
```

### `pnpm run test:runtime`

Exit status: 0

Key output:

```text
Validated 13 skills, 13 agents, and 4 hook events.
Codex headless review helper self-test passed.
Validated repo operations policy ownership.
Validated current mobile-app-dev-team managed docs.
Validated work-unit status fixtures.
Validated work-unit status artifacts.
Validated work-unit next-action resolver fixtures.
Validated EAS evidence ingest fixtures.
Validated project environment fixtures.
Validated project environment drift checks.
Validated evidence hygiene fixtures.
Validated evidence hygiene artifacts.
Passed 44 hook fixture tests.
```

### `pnpm turbo run lint test`

Exit status: 0

Key output:

```text
Packages in scope: @template/api, @template/contracts, mobile
Tasks: 7 successful, 7 total
Cached: 7 cached, 7 total
Time: 36ms >>> FULL TURBO
```

Relevant test details:

```text
@template/contracts:test: tests 1, pass 1, fail 0
mobile:test: Test Suites: 2 passed, 2 total
mobile:test: Tests: 5 passed, 5 total
@template/api:test: Test Files 1 passed (1)
@template/api:test: Tests 2 passed (2)
```

## Diff/Status Check

`git diff -- .evidence/reviews/20260613-codex-cli-role-skill-analysis` is empty because the whole analysis package is currently untracked.

Scoped status:

```text
?? .evidence/reviews/20260613-codex-cli-role-skill-analysis/
```

Broader worktree has unrelated untracked evidence files outside this package; they are intentionally out of scope for this documentation/evidence update. No tracked diff is currently observed.
