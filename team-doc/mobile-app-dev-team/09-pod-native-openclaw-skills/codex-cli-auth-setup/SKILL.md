---
name: codex-cli-auth-setup
description: Install, verify, and run the OpenAI Codex CLI in an OpenClaw/clawpod-agent Linux workspace, including checking npm/node prerequisites, installing @openai/codex globally, verifying ~/.codex/auth.json without exposing secrets, running codex doctor, and testing codex exec with --dangerously-bypass-approvals-and-sandbox. Use when asked to set up Codex CLI, configure Codex auth, validate no-approval Codex execution, or produce a SoT-style report of Codex CLI readiness.
---

# Codex CLI Auth Setup

Use this pod-native OpenClaw skill to install and validate Codex CLI on an OpenClaw agent host.

Runtime shape:

```text
/workspace/skills/codex-cli-auth-setup/SKILL.md
```

## Safety Rules

- Never print auth token values, API keys, OAuth tokens, refresh tokens, passwords, or full secret-bearing config contents.
- Report auth presence, file mode, key names, and health status only.
- Treat `--dangerously-bypass-approvals-and-sandbox` as high risk. Use it only for explicit user requests or controlled smoke tests.
- Use harmless smoke commands, for example `printf CODEX_EXEC_OK`.
- Apply redaction to command output before sharing reports.
- Prefer Markdown reports for room/user reporting.

## Workflow

1. Check prerequisites and any existing install:

```bash
node --version
npm --version
command -v codex || true
codex --version || true
npm list -g --depth=0 2>/dev/null | grep -Ei 'codex|openai' || true
```

2. Check package metadata:

```bash
npm view @openai/codex version name bin --json
```

3. Install or update Codex CLI:

```bash
npm i -g @openai/codex@latest
```

4. Verify basic execution:

```bash
codex --version
codex --help | head -40
```

5. Check auth and config without leaking secrets. Prefer the bundled script:

```bash
bash /workspace/skills/codex-cli-auth-setup/scripts/codex-cli-precheck.sh
```

6. Run doctor with redaction:

```bash
codex doctor 2>&1 | sed -E 's/(token|key|secret|password)([=: ][^ ]+)/\1=***REDACTED***/Ig' | head -120
```

7. Test no-approval execution only when explicitly requested:

```bash
codex exec --dangerously-bypass-approvals-and-sandbox \
  'Run exactly this shell command and return only its output: printf CODEX_EXEC_OK'
```

Expected indicators:

```text
approval: never
sandbox: danger-full-access
CODEX_EXEC_OK
```

## Reporting

Include:

- installed Codex CLI version
- install path
- auth file presence and mode, not contents
- `codex doctor` summary
- no-approval smoke test status when requested
- any missing MCP configuration, if relevant

Do not include secret values or full `auth.json` contents.

See `references/report-template.md` for a concise report template.
