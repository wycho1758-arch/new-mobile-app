---
name: codex-cli-auth-setup
description: Install, verify, and run the OpenAI Codex CLI in an OpenClaw/clawpod-agent Linux workspace, including checking npm/node prerequisites, installing @openai/codex globally, verifying ~/.codex/auth.json without exposing secrets, running codex doctor, and testing codex exec with --dangerously-bypass-approvals-and-sandbox. Use when asked to set up Codex CLI, configure Codex auth, validate no-approval Codex execution, or produce a SoT-style report of Codex CLI readiness.
---

# Codex CLI Auth Setup

Use this pod-native OpenClaw skill to install and validate Codex CLI on an OpenClaw agent host.
For fresh role pods, follow the full sequence in
`mobile-app-dev-team/16-pod-environment-bootstrap.md`: Codex auth readiness
comes before repo checkout/bootstrap readiness.

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

## Repo Operations Policy Reference

When this skill is used to configure a pod that will operate on a GitHub
repository through Codex CLI, keep repo-wide operating policy in the repository
root policy files. For this repo, the policy owner is `REPO_OPERATIONS.md`;
`AGENTS.md` should only carry the runtime instruction surface needed by Codex.

Keep AGENTS.md policy agent-neutral. Use `this agent`, `assistant`, or
`the agent` as the subject, not a named pod or persona. Named identity belongs
in SOUL.md or IDENTITY.md, not AGENTS.md.

Do not duplicate the full root policy in this pod-native skill. This skill
only records the OpenClaw pod setup facts that must be checked before repo work
is routed through Codex CLI.

Project path setup:

- GitHub repository checkout path: `/workspace/projects/Wondermove-Inc/new-mobile-app/`
- Codex-managed paths registry: `/workspace/CODEX_MANAGED_PATHS.md`
- Required managed path entry: `/workspace/projects/Wondermove-Inc/new-mobile-app/`
- Default Codex hook wrapper: `/workspace/codex-hooks/codex-run`

Use this registry shape:

```markdown
# Codex-managed Paths

Add repository or directory paths here. Any task targeting these paths must be
executed through Codex CLI according to the root repo operations policy in
`REPO_OPERATIONS.md` and the runtime instructions in `AGENTS.md`.

- /workspace/projects/Wondermove-Inc/new-mobile-app/
```

When checking an existing OpenClaw pod, inspect AGENTS.md,
`REPO_OPERATIONS.md`, and `/workspace/CODEX_MANAGED_PATHS.md` without reading
secrets. The policy setup is not complete until `/workspace/projects/Wondermove-Inc/new-mobile-app/`
is present in the managed-paths registry and repository work is routed through
the configured Codex hook wrapper.

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
