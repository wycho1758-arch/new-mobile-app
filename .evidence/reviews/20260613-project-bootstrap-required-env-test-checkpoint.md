# project-bootstrap required environment test checkpoint

Date: 2026-06-13
Mode: `$wm` checkpoint 1, tests before implementation

## Changed test

Updated `evals/skills/project-bootstrap-agent-setup-smoke.sh` before implementation:

- fixed the no-Codex PATH test harness so it symlinks only `node` into a temporary bin and does not accidentally expose `/usr/local/bin/codex`;
- changed the Product/Planning preflight case so missing `expo`, `atlassian`, `node_repl`, `playwright`, `railway`, and `gcloud` must block project bootstrap;
- kept missing `eas` non-blocking for baseline Product/Planning;
- asserted user-facing guidance mentions the setup items plainly and keeps raw blocker IDs out of primary guidance.

## Focused command

```text
bash evals/skills/project-bootstrap-agent-setup-smoke.sh
```

Result:

```text
exit 1
assertion failed: r.status === 'blocked'
```

## Interpretation

This is the intended TDD failure. Current implementation still returns `ready_for_bootstrap` for Product/Planning when the newly required non-EAS environment items are missing.

## Next step

Run `wm-implementation-reviewer` checkpoint review. If reviewer accepts the test intent, proceed to implementation edits.
