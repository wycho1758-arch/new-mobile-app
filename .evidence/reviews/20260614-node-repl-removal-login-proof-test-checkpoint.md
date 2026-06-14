# node_repl Removal Login Proof Test Checkpoint

Date: 2026-06-14
Checkpoint: 1 - tests first

## Scope

Updated `evals/skills/project-bootstrap-agent-setup-smoke.sh` before
implementation so the smoke suite now expects:

- `node_repl` is optional Codex app/plugin inventory and does not block
  `project-bootstrap`;
- Railway missing CLI path installs through `npm i -g @railway/cli`;
- Railway login flow starts with `railway login` when a human is present;
- gcloud readiness references `gcloud auth login`,
  `gcloud auth application-default login`,
  `gcloud config set project <project-id>`, and
  `gcloud config get-value project`;
- credential storage evidence is metadata-only and never reads credential file
  contents.

## Command

```bash
bash evals/skills/project-bootstrap-agent-setup-smoke.sh
```

## Result

Exit code: 1

Relevant failure:

```text
assertion failed: r.tool_readiness.node_repl.required === false
```

## Interpretation

This is the expected TDD failure. Current implementation still reports
`node_repl.required === true`, so the test now captures the requested behavior
before implementation changes.

## Reviewer Status

Pending xhigh reviewer check before implementation.
