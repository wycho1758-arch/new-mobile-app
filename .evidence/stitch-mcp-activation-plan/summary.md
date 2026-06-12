# Stitch MCP Activation Plan Evidence

Date: 2026-06-09
Status: pinned stdio MCP activated; Stitch generation smoke pending Google Cloud ADC/project setup

## MCP Check

- `.codex/config.toml` registers `mobile-mcp`, `serena`, and `stitch`.
- `stitch` uses `npx -y stitch-mcp@1.3.2`.
- `which -a codex` shows both `/usr/local/bin/codex` and `/opt/homebrew/bin/codex`.
- `/usr/local/bin/codex` failed in this session without output.
- `/opt/homebrew/bin/codex --version` returned `codex-cli 0.137.0`.
- `/opt/homebrew/bin/codex mcp list` exited 0 and listed `stitch` as enabled with `npx -y stitch-mcp@1.3.2`.
- `/opt/homebrew/bin/codex mcp get stitch` exited 0 and showed:
  - transport: `stdio`
  - command: `npx`
  - args: `-y stitch-mcp@1.3.2`
  - env: `-`
- The MCP list output included unrelated global MCP entries; secret-bearing URLs were not copied into this evidence.
- Actual Stitch tool smoke requires local Google Cloud Application Default Credentials and a Google Cloud project with Stitch MCP enabled.

## Credential Handling

- No Stitch API key is added to this repo.
- Do not put Stitch credentials in `.codex/config.toml`, `EXPO_PUBLIC_*`, docs, evidence, or local `.env*` files.
- The selected adapter uses local Google Cloud ADC:
  - `gcloud beta services mcp enable stitch.googleapis.com --project=<project-id>`
  - `gcloud auth application-default login`
  - `gcloud auth application-default set-quota-project <project-id>`
  - `export GOOGLE_CLOUD_PROJECT=<project-id>` or `gcloud config set project <project-id>`

## Verification

Previous verification before activation:

- `pnpm run test:runtime`: passed.
- `pnpm run test:local-harness`: passed.

Current baseline note:

- `pnpm run test:runtime` is blocked by pre-existing untracked root `CLAUDE.md` and `.claude/` artifacts that the validator forbids. This is unrelated to Stitch registration.
- Stitch validator TDD failure was confirmed before config activation: missing Stitch MCP registration, npx runner, and `stitch-mcp@1.3.2` pin.
- After config activation, `node scripts/validate-runtime-artifacts.mjs` no longer reports Stitch failures and reports only the root `CLAUDE.md` and `.claude/` blocker.
- `pnpm run test:runtime`: blocked by the same root artifact failure.
- `pnpm run test:local-harness`: preflight passed and accepted `/opt/homebrew/bin/codex (codex-cli 0.137.0)`, then blocked at `pnpm run test:runtime` for the same root artifact failure.
- `pnpm turbo run lint test`: passed.
- `pnpm run test:hooks`: passed with 40 hook fixture tests.
- `node scripts/validate-team-doc.mjs`: passed with 71 source files and 32 structured files.
- These blocked runtime checks must be rerun after the root artifact blocker is resolved or explicitly removed by the owner.

## Reviewer

Reviewer evidence is recorded in `.evidence/stitch-mcp-activation-plan/reviewer.md`.

## Decision Pending

Actual Stitch generation smoke remains pending on Google Cloud ADC/project setup.
