# Command Output: evidence-decision-records-cleanup

status: required
owner: repo runtime maintainer under `$wm`
input artifact: `docs/plans/work-units/evidence-decision-records-cleanup/00-product-planning/task-packet.md`
output artifact: this command-output summary
acceptance criteria: tracked `.evidence` files are moved to `mobile-app-dev-team/decision-records/`, active references are updated, validators and local harness pass
evidence requirement: command output with exit status
dependencies/blockers: none
open decisions: none
next responsible role: merge PR workflow

## Plan Review

Reviewer: `po-planning-reviewer`

Execution path: read-only subagent reviewer. `scripts/codex-headless-review.mjs` self-test passed during `pnpm run test:runtime`, but direct headless `codex exec` review calls returned exit status 1 with no output in this isolated worktree.

Verdict:

```text
GO; findings: none.
```

Key reviewed facts:

```text
Plan length: 385 lines.
Tracked .evidence scope: exactly four files.
Active SoT references: mobile-app-dev-team/19-entry-case-routing.md and mobile-app-dev-team/20-app-eas-ota-rollback-runbook.md.
No reset or force-push planned.
Implementation allowed in isolated worktree only.
```

## Tests-First Failure

Command:

```text
node scripts/validate-evidence-hygiene.mjs
```

Exit status: 1

Expected failure after adding tracked `.evidence` prohibition and before moving files.

Key output:

```text
.evidence/reviews/20260614-entry-case-cp2-p1-decision.md: tracked .evidence files are forbidden
.evidence/reviews/20260614-entry-case-cp3-decision.md: tracked .evidence files are forbidden
.evidence/reviews/20260614-entry-case-risk2-runtime-binding-decision.md: tracked .evidence files are forbidden
.evidence/reviews/20260614-followup1-precise-rule-decision.md: tracked .evidence files are forbidden
```

## Dependency Install

Command:

```text
pnpm install --frozen-lockfile
```

Exit status: 0

Reason: user approved installation after `pnpm run test:local-harness` failed because the isolated worktree had no `node_modules`.

Key output:

```text
Lockfile is up to date, resolution step is skipped
Packages: +927
Done in 5.4s using pnpm v9.15.9
```

## Evidence Hygiene

Command:

```text
node scripts/validate-evidence-hygiene.mjs --self-test && node scripts/validate-evidence-hygiene.mjs
```

Exit status: 0

Output:

```text
Validated evidence hygiene fixtures.
Validated evidence hygiene artifacts.
```

## Team Docs Validator

Command:

```text
node scripts/validate-team-doc.mjs
```

Exit status: 0

Output:

```text
Validated current mobile-app-dev-team managed docs.
```

## Runtime Gate

Command:

```text
pnpm run test:runtime
```

Exit status: 0

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

## Local Harness

First command:

```text
pnpm run test:local-harness
```

First exit status: 254

Failure reason:

```text
ERR_PNPM_RECURSIVE_EXEC_FIRST_FAIL Command "turbo" not found
WARN Local package.json exists, but node_modules missing, did you mean to install?
```

Second command after approved install:

```text
pnpm run test:local-harness
```

Second exit status: 0

Key output:

```text
codex-preflight accepted /opt/homebrew/bin/codex (codex-cli 0.137.0)
Validated 14 skills, 13 agents, and 4 hook events.
Passed 44 hook fixture tests.
Tasks: 7 successful, 7 total
self-test all passed
local harness all passed
```

## Git State Checks

Command:

```text
git ls-files .evidence
```

Exit status: 0

Output:

```text
<empty>
```

## Final Implementation Reviewer

Reviewer: `wm-implementation-reviewer`

Execution path: read-only xhigh subagent reviewer. Direct `scripts/codex-headless-review.mjs` final review attempted first but returned exit status 1 with no output; the helper self-test itself passed under `test:runtime`.

Verdict:

```text
GO; findings: none.
```

Key reviewer checks:

```text
Four tracked .evidence records moved: PASS
Active references updated: PASS
Tracked .evidence removed: PASS
Validator coverage: PASS
Managed-doc validator coverage: PASS
Evidence hygiene: PASS
Team docs: PASS
Runtime gate: PASS
Local harness: PASS
No reset or force-push: PASS
Primary worktree isolation: PASS
Scope containment: PASS
```

Command:

```text
rg -n "\\.evidence/reviews/20260614-entry-case-cp2-p1-decision|\\.evidence/reviews/20260614-entry-case-cp3-decision|\\.evidence/reviews/20260614-entry-case-risk2-runtime-binding-decision|\\.evidence/reviews/20260614-followup1-precise-rule-decision" mobile-app-dev-team/19-entry-case-routing.md mobile-app-dev-team/20-app-eas-ota-rollback-runbook.md
```

Exit status: 0 through `|| true`

Output:

```text
<empty>
```
