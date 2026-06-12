**Findings**

1. High: `.env` read policy is bypassable for quoted `rg`/`grep` targets.  
`mobile-pretool-policy` masks all quoted strings for `rg|grep` before applying deny patterns, then checks the `.env` deny regex afterward: [mobile-pretool-policy.mjs](/Users/tw.kim/Documents/AGA/test/new-mobile-app/.codex/hooks/mobile-pretool-policy.mjs:12). Existing tests cover unquoted `rg`/`grep` env reads only: [scripts/test-hooks.mjs](/Users/tw.kim/Documents/AGA/test/new-mobile-app/scripts/test-hooks.mjs:248). I tested encoded synthetic payloads for `rg -n . "apps/mobile/.env.production"` and `grep -n . ".env.production"`; both returned allow output instead of `decision: block`.

2. High: destructive repo-path removal is not blocked.  
The `rm -rf` deny pattern only catches `/`, `$HOME`, `~`, or `.`: [mobile-pretool-policy.mjs](/Users/tw.kim/Documents/AGA/test/new-mobile-app/.codex/hooks/mobile-pretool-policy.mjs:20). A synthetic `rm -rf apps/mobile` payload returned allow output. That leaves a major mobile runtime path deletable despite this being the pretool safety hook.

3. Medium: runtime wiring edits do not trigger the posttool evidence reminder.  
Runtime changes under `.agents/`, `.codex/`, `evals/...`, and scripts must pass the local harness gate per [AGENTS.md](/Users/tw.kim/Documents/AGA/test/new-mobile-app/AGENTS.md:84), but the posttool matcher only treats mobile app/contracts/test/evals paths as evidence-worthy: [mobile-posttool-evidence-reminder.mjs](/Users/tw.kim/Documents/AGA/test/new-mobile-app/.codex/hooks/mobile-posttool-evidence-reminder.mjs:6). A synthetic patch touching `.codex/hooks/mobile-pretool-policy.mjs` returned no `additionalContext`.

4. Low: required `mobile-mcp` registration is documented and present, but not validated by `validate-runtime-artifacts`.  
The repo requires pinned `mobile-mcp`: [AGENTS.md](/Users/tw.kim/Documents/AGA/test/new-mobile-app/AGENTS.md:40), and config has it: [.codex/config.toml](/Users/tw.kim/Documents/AGA/test/new-mobile-app/.codex/config.toml:1). The validator asserts Serena only: [validate-runtime-artifacts.mjs](/Users/tw.kim/Documents/AGA/test/new-mobile-app/scripts/validate-runtime-artifacts.mjs:128). I ran `codex mcp list` and confirmed `mobile-mcp` and `serena` are enabled, but this can regress without failing `pnpm run validate`.

**Missing Tests**

Add hook cases for quoted `rg`/`grep` `.env` paths, destructive repo-path `rm -rf`, and posttool evidence reminders for `.codex/`, `.agents/`, and runtime scripts.

**Contract Drift**

No API contract drift found in this runtime-only review. `git diff -- packages/contracts apps/api` was empty.

**Verification**

Ran read-only checks: `node scripts/validate-runtime-artifacts.mjs` passed and `node scripts/test-hooks.mjs` passed. I did not run `pnpm run test:local-harness` because it writes generated result files under `evals/local-harness/results`.