# Codex Headless Resolver Implementation Evidence

Date: 2026-06-19

## Scope

- Shared resolver added in `scripts/lib/codex-binary-resolver.mjs`.
- `scripts/codex-preflight.mjs` and `scripts/codex-headless-review.mjs` now use
  the shared resolver.
- Cross-platform fixtures cover Darwin arm64 stale-first selection, Darwin
  universal binary selection, smoke-failure fallback, Linux Homebrew path, and
  Windows `.cmd` wrapper execution descriptor.
- `PROJECT_ENVIRONMENT.md` documents resolver behavior.

## Commands Run

- `node scripts/codex-preflight.mjs --self-test` - PASS
- `pnpm run validate` - PASS
- `pnpm run validate:project-environment` - PASS
- `node scripts/codex-preflight.mjs --json --no-write` - PASS
  - selected `/opt/homebrew/bin/codex`
  - rejected `/usr/local/bin/codex` as `arch-mismatch` on the local arm64 host
- `node scripts/codex-headless-review.mjs --json-envelope --agent po-planning-reviewer --prompt <smoke> --out /tmp/codex-headless-resolver-smoke-2.md` - PASS
- `pnpm run test:runtime` - PASS
- `pnpm run validate:work-units` - PASS
- `pnpm run test:local-harness` - PASS

## Reviewer Findings Remediated

- Medium: smoke-failing first selected candidate now falls through to later
  version/help-valid candidates before preflight returns unavailable.
- Medium: durable work-unit README, status, and evidence now record
  implementation and final-review readiness.
- Low: `PROJECT_ENVIRONMENT.md` update date now reflects the 2026-06-19 runtime
  resolver change.

## Boundaries

- No changes were made to `/usr/local/bin/codex`.
- No changes were made to `.codex/hooks/**` or `.codex/agents/**`.
- Windows behavior is fixture/source validated locally; it was not executed on a
  native Windows host.
