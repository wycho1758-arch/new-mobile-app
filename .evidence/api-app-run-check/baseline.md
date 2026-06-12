# Baseline Gate Evidence

- Date: 2026-06-09
- Scope: deterministic workspace/runtime/mobile configuration gates before API and app run checks
- Result: pass

## Commands

| Gate | Command | Result | Evidence |
| --- | --- | --- | --- |
| Runtime artifacts | `pnpm run test:runtime` | Pass, exit 0 | Validated 3 skills, 8 agents, and 4 hook events. Passed 33 hook fixture tests. |
| Workspace lint/test | `pnpm turbo run lint test` | Pass, exit 0 | 4 tasks successful. API lint/test and mobile lint/test passed. API tests: 2. Mobile tests: 5. |
| Expo dependency check | `pnpm --filter mobile exec expo install --check` | Pass, exit 0 | Dependencies are up to date. |
| Expo doctor | `pnpm --filter mobile run doctor` | Pass, exit 0 | 21/21 checks passed. |
| MCP listing | `codex mcp list --json` | Pass, exit 0 | `mobile-mcp`, `serena`, and repo MCP entries were listed as enabled. |
| Local harness | `pnpm run test:local-harness` | Pass, exit 0 | Preflight passed; `test:runtime` passed with 37 hook fixture tests; turbo lint/test passed; local harness self-test and stage all passed. |
| Post-evidence runtime rerun | `pnpm run test:runtime` | Pass, exit 0 | Runtime artifacts validated; hook fixture tests passed. |

## Notes

- `EXPO_PUBLIC_*` values were treated as public mobile client configuration, not private secrets.
- No production, preview, customer, token, or credential values were used for these checks.
- `pnpm run test:local-harness` was run after the plan and evidence files were created because `docs/plans/**` changes trigger the local runtime harness gate.
