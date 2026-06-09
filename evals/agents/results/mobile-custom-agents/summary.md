# Agent Evaluation Evidence

Command:

```sh
pnpm run validate
```

Result:

- PASS: 8 custom agent TOML files validated under `.codex/agents`.
- PASS: each custom agent defines `name`, `description`, and `developer_instructions`.
- PASS: each custom agent includes read-only or explicit boundary instructions.
- PASS: `wm-*` reviewer routing agents are present and read-only.

Validated artifacts:

- `.codex/agents/mobile-contract-reviewer.toml`
- `.codex/agents/mobile-implementation-reviewer.toml`
- `.codex/agents/mobile-docs-researcher.toml`
- `.codex/agents/mobile-gate-fix-advisor.toml`
- `.codex/agents/wm-contract-reviewer.toml`
- `.codex/agents/wm-implementation-reviewer.toml`
- `.codex/agents/wm-docs-researcher.toml`
- `.codex/agents/wm-gate-fix-advisor.toml`
