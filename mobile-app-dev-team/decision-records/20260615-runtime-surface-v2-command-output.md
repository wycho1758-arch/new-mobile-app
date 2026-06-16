# Runtime Surface V2 Command Output

Date: 2026-06-15

Scope:
- `mobile-app-dev-team/22-runtime-surface-classification-improvement-report-v2.md`
- `mobile-app-dev-team/README.md`
- `mobile-app-dev-team/99-source-map.md`

## `wc -l mobile-app-dev-team/22-runtime-surface-classification-improvement-report-v2.md`

Exit status: 0

```text
1380 mobile-app-dev-team/22-runtime-surface-classification-improvement-report-v2.md
```

## `rg -n '^Line [0-9]{3}:|Executive Summary|Target Operating Model|Required change:' mobile-app-dev-team/22-runtime-surface-classification-improvement-report-v2.md || true`

Exit status: 0

```text
```

## ASCII Graphics Evidence

Command:

```text
rg -n '^```text$|\+-{2,}|\|.*\|' mobile-app-dev-team/22-runtime-surface-classification-improvement-report-v2.md | head -120
```

Exit status: 0

Evidence excerpt:

```text
35:```text
38:        +-- live pod runtime enforcement? --------------> 아니다
78:```text
79:                                      +-----------------------------+
80:                                      | user-selected persona       |
84:+------------------------------+       +-----------------------------+
85:| 02-role-souls/<role>.md      | ----> | /workspace/SOUL.md          |
90:| 09-pod-native-skills/<slug>/ | ----> | /workspace/skills/<slug>/   |
95:| .agents / .codex             | ----> | Codex CLI runtime           |
100:| other mobile-app-dev-team md | -x->  | live pod runtime            |
197:```text
198:+--------------------------------------------------------------------------------+
199:| 실제 실행 surface                                                               |
510:```text
514:+-----------------------------------------------------+
515:| runtime relevance decision                          |
550:```text
551:+--------------------------------------------------------------------------------+
552:| mobile-app-dev-team/** classification                                           |
```

## `pnpm run validate:team-doc`

Exit status: 0

```text
Validated current mobile-app-dev-team managed docs.
```

## `git diff --check && git diff --cached --check`

Exit status: 0

```text
```

## `pnpm run test:runtime`

Exit status: 0

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

## `pnpm run validate:evidence-hygiene`

Exit status: 0

```text
Validated evidence hygiene fixtures.
Validated evidence hygiene artifacts.
```

## `pnpm run test:local-harness`

Exit status: 0

```text
clean-tree-guard self-test passed
codex-preflight self-test passed
codex-preflight accepted /opt/homebrew/bin/codex (codex-cli 0.137.0)
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
Turbo lint/test: 7 successful, 7 total.
self-test all passed
local harness all passed
```

## Not Applicable Checks

- `mobile-mcp` visual QA: not applicable; documentation/runtime-policy report only, no mobile UI/runtime implementation changed.
- API contract drift review: not applicable; no `apps/api` or `packages/contracts` files changed.
- Live pod proof: not applicable; v2 explicitly limits local validation and local harness to repo/source guard evidence, not live `/workspace` state.
