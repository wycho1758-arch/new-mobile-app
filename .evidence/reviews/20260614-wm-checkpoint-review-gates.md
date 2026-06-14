# wm Checkpoint Review Gate Evidence

Date: 2026-06-14

Scope:
- `.agents/skills/wm/SKILL.md`
- `PROJECT_ENVIRONMENT.md`
- `scripts/validate-runtime-artifacts.mjs`
- `evals/skills/wm/positive.prompt.md`
- `evals/skills/wm/checkpoint-review-positive.prompt.md`

## TDD Red Reproduction

Purpose: prove the new validator/eval checkpoint-review assertions fail against the pre-change `HEAD` versions of `$wm` skill and `PROJECT_ENVIRONMENT.md`.

Command:

```sh
tmpdir=$(mktemp -d)
git archive HEAD | tar -x -C "$tmpdir"
cp scripts/validate-runtime-artifacts.mjs "$tmpdir/scripts/validate-runtime-artifacts.mjs"
cp evals/skills/wm/positive.prompt.md "$tmpdir/evals/skills/wm/positive.prompt.md"
cp evals/skills/wm/checkpoint-review-positive.prompt.md "$tmpdir/evals/skills/wm/checkpoint-review-positive.prompt.md"
( cd "$tmpdir" && node scripts/validate-runtime-artifacts.mjs )
cmd_exit=$?
rm -rf "$tmpdir"
exit $cmd_exit
```

Exit: `1`

Output:

```text
- wm skill must require checkpoint review
- wm skill must require checkpoint boundaries in the approved plan
- wm skill must define checkpoint review inputs
- wm skill must block next checkpoint after failed or blocked checkpoint review
- PROJECT_ENVIRONMENT.md must require $wm checkpoint review evidence
- PROJECT_ENVIRONMENT.md must document $wm checkpoint boundaries
```

## Green Narrow Validator

Command:

```sh
node scripts/validate-runtime-artifacts.mjs
```

Exit: `0`

Output:

```text
Validated 14 skills, 13 agents, and 4 hook events.
```

## Runtime Gate

Command:

```sh
pnpm run test:runtime
```

Exit: `0`

Key output:

```text
Validated 14 skills, 13 agents, and 4 hook events.
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

## Local Harness Gate

Command:

```sh
pnpm run test:local-harness
```

Exit: `0`

Key output:

```text
clean-tree-guard self-test passed
codex-preflight self-test passed
codex-preflight accepted /opt/homebrew/bin/codex (codex-cli 0.137.0)
Validated 14 skills, 13 agents, and 4 hook events.
Codex headless review helper self-test passed.
Passed 44 hook fixture tests.
Tasks: 7 successful, 7 total
self-test all passed
local harness all passed
```

## Checkpoint Reviewer Finding Addressed

The first checkpoint review found that TDD Red evidence was not persisted. This file records the red reproduction and green validator output so checkpoint and final reviewers can inspect concrete evidence instead of relying on chat history.
