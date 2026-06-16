# Team Doc Validator/SOUL Runtime Explainer Command Evidence

Date: 2026-06-15

Scope:

- `mobile-app-dev-team/21-team-doc-validator-and-soul-runtime-explainer.md`
- `mobile-app-dev-team/README.md`
- `mobile-app-dev-team/99-source-map.md`
- SoT/process alignment for `mobile-app-dev-team/**`, repo runtime validators, and review gates.

Final rerun note:

- The command results below were rerun after adding the new explainer to `mobile-app-dev-team/README.md` and `mobile-app-dev-team/99-source-map.md`.

## `pnpm run validate:team-doc`

Exit status: 0

Command output:

```text
> mobile-app-template@ validate:team-doc /Users/tw.kim/Documents/AGA/test/new-mobile-app
> node scripts/validate-team-doc.mjs

Validated current mobile-app-dev-team managed docs.
```

## `pnpm run test:runtime`

Exit status: 0

Command output summary:

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

## `pnpm turbo run lint test`

Exit status: 0

Command output summary:

```text
Packages in scope: @template/api, @template/contracts, mobile
Tasks: 7 successful, 7 total
Cached: 7 cached, 7 total
```

Package results:

- `@template/contracts:build`: PASS
- `@template/contracts:lint`: PASS
- `@template/contracts:test`: PASS, 1 test passed
- `@template/api:lint`: PASS
- `@template/api:test`: PASS, 1 file passed, 2 tests passed
- `mobile:lint`: PASS
- `mobile:test`: PASS, 2 suites passed, 5 tests passed

## `pnpm run test:local-harness`

Exit status: 0

Command output summary:

```text
clean-tree-guard self-test passed
codex-preflight self-test passed
codex-preflight accepted /opt/homebrew/bin/codex (codex-cli 0.137.0)
test:runtime PASS
pnpm turbo run lint test PASS
self-test all passed
local harness all passed
```

## Applicability Notes

- `mobile-mcp` visual QA: not applicable. This is a documentation/runtime-process explainer update, with no React Native UI/runtime code change.
- API contract drift checks beyond existing gates: not applicable. No `apps/api` or `packages/contracts` changes were made.
- Live OpenClaw pod seed injection/platform behavior: not proven by local gates. The target document now states that live seed injection requires separate platform evidence.
