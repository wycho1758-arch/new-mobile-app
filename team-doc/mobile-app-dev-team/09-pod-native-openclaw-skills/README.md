# Pod-Native OpenClaw Skills

This folder is source-only documentation for pod-native OpenClaw skills whose runtime shape is:

```text
/workspace/skills/<slug>/SKILL.md
```

Do not place repo-local Codex CLI artifacts here. Codex CLI native skills and agents belong under `.agents/skills/<skill-name>/SKILL.md` and `.codex/agents/<agent-name>.toml`.

## Current Skills

| Skill | Runtime Shape | Purpose |
| --- | --- | --- |
| `codex-cli-auth-setup` | `/workspace/skills/codex-cli-auth-setup/SKILL.md` | Install, verify, and run Codex CLI readiness checks in an OpenClaw agent pod without exposing secrets. |
