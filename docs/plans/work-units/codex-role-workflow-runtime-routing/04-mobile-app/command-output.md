# Command Output: codex-role-workflow Runtime Routing

status: required
owner: Mobile App Dev or repo runtime maintainer under `$wm`
input artifact: updated `codex-role-workflow` skill and validator diff
output artifact: this command-output summary
acceptance criteria: validator/runtime/local-harness commands exit 0 after tests-first failure is reproduced
evidence requirement: command output with exit status
dependencies/blockers: none for repo-local implementation; live pod publication remains external
open decisions: none for repo-local validation
next responsible role: pod/bootstrap or human/ops owner for live runtime publication, if required

## Tests-First Failure

Command:

```text
node scripts/validate-team-doc.mjs
```

Exit status: 1

Expected failure after adding validator requirements and before updating `codex-role-workflow/SKILL.md`.

Representative missing terms included:

- `Codex Substrate`
- `mobile-app-dev-team/workflows/entry-case-routing.md`
- `Common Intake Rule`
- `project requirement`
- `project specification`
- `PRD is one input class`
- `accepted task packet`
- `READY_FOR_EXECUTION`
- `Design Relevance`
- `P0 approval before Stitch generation`
- `P1 approval before HTML extraction`
- `production-submit`
- `rollback_owner`
- `rollback_plan`
- `entry_case`
- `routing_reason`
- `process_sot`
- `external_proof_boundary`

## Narrow Validator

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

Command:

```text
pnpm run test:local-harness
```

Exit status: 0

Key output:

```text
clean-tree-guard self-test passed
codex-preflight self-test passed
codex-preflight accepted /opt/homebrew/bin/codex (codex-cli 0.137.0)
Validated 14 skills, 13 agents, and 4 hook events.
Codex headless review helper self-test passed.
Validated current mobile-app-dev-team managed docs.
Passed 44 hook fixture tests.
Tasks:    7 successful, 7 total
self-test all passed
local harness all passed
```

## Work-Unit Validator

Command:

```text
node scripts/validate-work-units.mjs
```

Exit status: 0

Output:

```text
Validated work-unit status artifacts.
```

## Evidence Hygiene Validator

Command:

```text
node scripts/validate-evidence-hygiene.mjs
```

Exit status: 0

Output:

```text
Validated evidence hygiene artifacts.
```

## Implementation Reviewer

Command:

```text
node scripts/codex-headless-review.mjs --json-envelope --agent wm-implementation-reviewer --prompt .evidence/reviews/20260614-codex-role-workflow-runtime-routing-final-wm-prompt.md --out .evidence/reviews/20260614-codex-role-workflow-runtime-routing-final-wm-review.md
```

Exit status: 0

Verdict:

```text
GO; no Critical, High, Medium, or Low findings.
```

## Product/Planning Final Re-Review

Reviewer evidence:

```text
.evidence/reviews/20260614-codex-role-workflow-runtime-routing-final-po-rereview.md
.evidence/reviews/20260614-codex-role-workflow-runtime-routing-final-po-rereview.json
```

Exit status: 0

Verdict:

```text
GO; no Critical, High, Medium, or Low findings.
```
