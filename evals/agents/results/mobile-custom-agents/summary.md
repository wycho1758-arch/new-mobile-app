# Agent Evaluation Evidence

Command:

```sh
npm run validate
```

Result:

- PASS: 4 custom agent TOML files validated under `.codex/agents`.
- PASS: each custom agent defines `name`, `description`, and `developer_instructions`.
- PASS: each custom agent includes read-only or explicit boundary instructions.

Validated artifacts:

- `.codex/agents/mobile-contract-reviewer.toml`
- `.codex/agents/mobile-implementation-reviewer.toml`
- `.codex/agents/mobile-docs-researcher.toml`
- `.codex/agents/mobile-gate-fix-advisor.toml`
