# DoD Gate Evidence — terminology change

- Date: 2026-06-13
- DoD source: `AGENTS.md:104-112` (1 `pnpm turbo run lint test`, 2 `pnpm run test:runtime`,
  3 `pnpm run test:local-harness` for Codex runtime changes), `AGENTS.md:90`,
  `PROJECT_ENVIRONMENT.md:369-377` (this change touches `scripts/validate-repo-operations.mjs`,
  `scripts/validate-team-doc.mjs` class, and `mobile-app-dev-team/**` → local-harness required).
- Note: each `validate`/`test:runtime`/`test:local-harness` run deletes `.claude/` via
  `package.json:21` rmSync; untracked `.claude` ports were backed up and restored around runs.
- Codex CLI present and live-accepted: `/opt/homebrew/bin/codex` (codex-cli 0.137.0); no
  codex headless-smoke blocker occurred.

## Gate 3 — `pnpm run test:local-harness` (superset; chains DoD 1 & 2)

Command: `pnpm run test:local-harness`

Key output (exit=0):
```
clean-tree-guard self-test passed
codex-preflight self-test passed
codex-preflight accepted /opt/homebrew/bin/codex (codex-cli 0.137.0)
Codex headless review helper self-test passed.
@template/api:test:  Tests  2 passed (2)
mobile:test: Tests:       5 passed, 5 total
 Tasks:    7 successful, 7 total
  Time:    39ms >>> FULL TURBO
self-test all passed
local harness all passed
LOCAL_HARNESS_EXIT=0
```
`test:local-harness` = `test:local-harness:preflight && test:runtime && pnpm turbo run lint test
&& test-local-harness.mjs --self-test --stage all && test-local-harness.mjs --stage all`
(package.json:18-19), so this single run executes DoD items 1 and 2 as well.

## Gate 1 — `pnpm turbo run lint test`

Command: `pnpm turbo run lint test`

Output (exit=0):
```
Cached:    7 cached, 7 total
  Time:    54ms >>> FULL TURBO
TURBO_EXIT=0
```

## Gate 2 — `pnpm run test:runtime`

Command: `pnpm run test:runtime`

Output (exit=0):
```
Passed 44 hook fixture tests.
RUNTIME_EXIT=0
```
Composes: validate (validate-runtime-artifacts "Validated 13 skills, 13 agents, and 4 hook
events" — `.gitignore` `.claude/` policy satisfied), validate:repo-operations,
validate:team-doc, validate:work-units, validate:work-unit-next, validate:eas-evidence,
validate:project-environment, validate:evidence-hygiene, test:hooks — all exit 0.

## Result
All three DoD gates exit 0. No source-backed blocker (codex headless smoke ran/accepted).
