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

## OpenClaw AGENTS.md Codex-only Repo Work Policy

When this skill is used to configure a pod that will operate on a GitHub repository
through Codex CLI, keep AGENTS.md policy agent-neutral. AGENTS.md must describe the
workspace rule for `this agent`, `assistant`, or `the agent`; do not make an
agent name the policy subject.

Recommended AGENTS.md policy wording:

```markdown
## Codex-only Repo Work Policy

For any task that targets a specific repository or path listed as Codex-managed,
this agent MUST use Codex CLI as the execution engine.

Codex-managed paths are listed in:
`/workspace/CODEX_MANAGED_PATHS.md`

This includes:
- reading or summarizing files in that repo/path
- writing or editing code
- writing or editing Markdown documents
- creating handoff/process documents
- debugging
- refactoring
- test creation
- test execution
- build or verification commands
- repo-local scripts, configs, and documentation work

This agent MUST NOT directly use read/edit/write for Codex-managed repo/path content,
even for small patches or simple file inspection.

Required execution path:
1. Identify the target repo/path.
2. Check whether the target path is listed as Codex-managed.
3. If the path is Codex-managed, run Codex through the configured Codex hook wrapper,
   defaulting to `/workspace/codex-hooks/codex-run` when available.
4. Provide Codex with the task goal, target path, constraints, and expected output.
5. Wait for Codex completion via OpenClaw system event or process result.
6. Review Codex evidence/results outside the managed repo path.
7. Report the result to the user.

Allowed direct actions by this agent:
- send and receive room messages
- ask clarification questions
- start Codex jobs
- inspect Codex-generated evidence outside the managed repo path
- run non-repo OpenClaw/admin/status commands
- handle approvals and safety checks
- perform emergency stop or rollback orchestration

If Codex CLI is unavailable, auth fails, or the hook fails, this agent MUST report the blocker
instead of silently falling back to direct repo edits.
```

Project path setup:

- GitHub repository checkout path: `/workspace/new-mobile-app/`
- Codex-managed paths registry: `/workspace/CODEX_MANAGED_PATHS.md`
- Required managed path entry: `/workspace/new-mobile-app/`
- Default Codex hook wrapper: `/workspace/codex-hooks/codex-run`

Use this registry shape:

```markdown
# Codex-managed Paths

Add repository or directory paths here. Any task targeting these paths must be
executed through Codex CLI according to the Codex-only Repo Work Policy in
`AGENTS.md`.

- /workspace/new-mobile-app/
```

When checking an existing OpenClaw pod, inspect AGENTS.md and
`/workspace/CODEX_MANAGED_PATHS.md` without reading secrets. The policy is not
complete until `/workspace/new-mobile-app/` is present in the managed-paths
registry and repository work is routed through the configured Codex hook wrapper.

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
