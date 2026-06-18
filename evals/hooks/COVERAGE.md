# Hook Coverage Map

Informational only. This file is not read by any validator or harness script; it
documents how `evals/hooks/fixtures/` exercises the Codex hooks so that each
hook's allow/deny behavior is easy to audit. The authoritative driver is
`scripts/test-hooks.mjs` (run via `pnpm run test:hooks`); fixture JSON lives in
`evals/hooks/fixtures/`. Event wiring is declared in `.codex/hooks.json`.

## Hooks

`.codex/hooks/` contains five hooks plus `shared.mjs` (a shared utility module,
not a hook). Hooks split into two kinds:

- **Enforcement hooks** can return `decision: block` and therefore need both
  allow and deny/block coverage.
- **Informational hooks** only emit `hookSpecificOutput.additionalContext` and
  can never block; they intentionally have no deny/block coverage.

| Hook | Event (`.codex/hooks.json`) | Kind | Coverage |
| --- | --- | --- | --- |
| `mobile-pretool-policy.mjs` | PreToolUse (`Bash\|apply_patch`) | Enforcement | Deny: destructive git (incl. quoted); `expo prebuild --clean` (incl. quoted `--clean`); production `eas build/submit/update` (incl. quoted, `npx eas-cli`, `pnpm dlx eas-cli` wrappers); package-manager mixing (incl. shell-wrapper, `eval`-wrapper, quoted-verb variants); `.env` reads via `cat`/`sed`/`rg`/`grep` (incl. quoted and `eval`-wrapper variants); `rm -rf` on protected repo paths (incl. reordered/split flags, option terminator). Allow: `npm test`, policy-text search. |
| `mobile-stop-gatekeeper-advisory.mjs` | Stop | Enforcement | Deny: completion claims without verification evidence (verbs: implemented/updated/added/completed/reviewed/finished/shipped/ready). Allow: final message containing evidence keywords (pnpm/jest/lint/test/passed). `stop_hook_active` guard prevents re-block loops. |
| `mobile-stop-call-check.mjs` | Stop | Enforcement (opt-in) | No-op pass-through unless `WM_STOP_CALL_CHECK_ENABLE=1`. When enabled: block on MCP/HTTP connectivity failure; allow when configured check succeeds. |
| `mobile-posttool-evidence-reminder.mjs` | PostToolUse (`Bash\|apply_patch`) | Informational | Allow only: emits an evidence reminder when a patch touches mobile/runtime paths; no deny/block path by design. |
| `mobile-subagent-context.mjs` | SessionStart (`startup\|resume`) | Informational | Allow only: always emits narrow-agent runtime context; no deny/block path by design. |

## Notes

- Informational hooks (`mobile-posttool-evidence-reminder`, `mobile-subagent-context`)
  have **zero** deny/block fixtures **by design** — they cannot block. Their
  absence of deny coverage is correct, not a gap.
- Enforcement hooks each have at least one allow and one deny/block scenario.
  `mobile-stop-call-check` is opt-in (env-gated) and defaults to pass-through.
- To regenerate/verify coverage, run `pnpm run test:hooks` and inspect
  `evals/hooks/fixtures/` against `scripts/test-hooks.mjs`.
