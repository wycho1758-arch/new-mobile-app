# wm Additional Runtime Fixes

Scope:

- Follow-up from `.evidence/wm-agent-smoke.md` findings.
- Fixed repo-local hook and validator gaps only.
- No external platform/runtime repository was modified.

TDD red:

- `pnpm run test:hooks` failed before implementation with four expected failures:
  - destructive repo path removal was allowed.
  - quoted `rg` env-file target was allowed.
  - quoted `grep` env-file target was allowed.
  - runtime hook patch did not emit the evidence reminder.
- Follow-up reviewer pass found destructive removal was still bypassable with equivalent `rm` flag forms; added failing tests for reordered flags, split flags, and option terminator forms before updating the hook regex.

Implementation:

- `.codex/hooks/mobile-pretool-policy.mjs`
  - blocks destructive removal of key repo paths such as `apps/mobile`, `.codex`, `.agents`, `packages/contracts`, `evals`, and `scripts`.
  - covers common equivalent `rm` flag forms for protected paths.
  - preserves policy-text search behavior while still detecting quoted env-file targets for `rg` and `grep`.
- `.codex/hooks/mobile-posttool-evidence-reminder.mjs`
  - treats `.agents`, `.codex`, and `scripts` changes as evidence-worthy runtime edits.
- `scripts/validate-runtime-artifacts.mjs`
  - validates pinned `mobile-mcp` registration in `.codex/config.toml`.

Verification:

- `pnpm run test:hooks` passed with 40 hook fixture tests.
- `pnpm run test:runtime` passed:
  - `pnpm run validate`
  - `pnpm run test:hooks`
- `pnpm run test:local-harness` passed:
  - clean-tree guard self-test
  - Codex preflight self-test and preflight
  - runtime validation
  - workspace lint/test through Turbo
  - local harness self-test
  - local harness all
