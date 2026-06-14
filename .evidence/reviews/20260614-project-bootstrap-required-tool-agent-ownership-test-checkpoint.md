# project-bootstrap required tool ownership test checkpoint

Date: 2026-06-14
Checkpoint: 1 - failing evals before implementation

## Scope

Added tests to `evals/skills/project-bootstrap-agent-setup-smoke.sh` before
changing implementation scripts or SoT docs.

## Added eval intent

- Require `project-bootstrap-agent-setup.sh` to emit
  `tool_readiness.node_repl` with:
  - `required: true`
  - `owner: "codex_app_plugin"`
  - `status: "app_environment_missing"` when `codex mcp list` lacks
    `node_repl`
  - `minimum_user_action` that names Codex app/plugin restoration and does not
    suggest a repo-local `codex mcp add`
- Require `tool_readiness.railway` and `tool_readiness.gcloud` with:
  - `required: true`
  - `command_status`
  - `install_decision`
  - `minimum_user_action`
- Require approved-installer fixtures to invoke local fake installers and
  recheck fake `railway --version` / `gcloud --version`.
- Require generated preflight guidance to name `node_repl`, Railway CLI, and
  gcloud CLI with concrete minimal user/platform actions while keeping raw
  blocker names support-only.
- Require generated report JSON to avoid obvious secret-like values.

## Command

```bash
bash evals/skills/project-bootstrap-agent-setup-smoke.sh
```

## Result

Expected failure before implementation:

```text
TypeError: Cannot read properties of undefined (reading 'node_repl')
```

This proves the new eval currently fails because
`project-bootstrap-agent-setup-report.json` does not yet include
`tool_readiness.node_repl`.

## Reviewer finding resolution

The first checkpoint review returned NO_GO with test-quality findings. The evals
were corrected before implementation:

- Secret hygiene now detects concrete secret-shaped values and no longer fails
  on safe disclaimer text such as "no ADC JSON".
- Fake Railway/gcloud CLIs now fail unknown commands and append invocation
  arguments to command logs.
- The approved-installer test now asserts both command logs contain
  `--version`, proving the implementation must recheck the installed CLIs.
- The primary-guidance support-only assertions now cover `node_repl`, Railway,
  and gcloud raw blocker strings.

Re-run command:

```bash
bash evals/skills/project-bootstrap-agent-setup-smoke.sh
```

Re-run result remains the intended pre-implementation failure:

```text
TypeError: Cannot read properties of undefined (reading 'node_repl')
```

## Confluence sync status

Sub agent `Dalton` confirmed local `docs/confluence` mirror should be updated
when this implementation changes mirrored environment/MCP/project-bootstrap
runtime facts. Live Confluence publish remains blocked until explicit target
page IDs, current versions, proposed body diff, reviewer evidence, and user
approval exist.
