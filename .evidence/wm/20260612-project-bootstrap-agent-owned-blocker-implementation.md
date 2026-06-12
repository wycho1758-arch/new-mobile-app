# Project Bootstrap Agent-Owned Blocker Implementation Evidence

Date: 2026-06-12
Branch: `docs/role-title-display-identity`

## Scope

Implemented the reviewed plan for `project-bootstrap` so local deterministic
setup runs before unresolved blockers are reported to the user.

## Changed Behavior

- Added `project-bootstrap-agent-setup.sh`.
- The setup script resolves canonical role identity from approved local inputs,
  writes `/workspace/IDENTITY`, and writes `/workspace/state/project-bootstrap-role.env`.
- The setup script creates or repairs `/workspace/CODEX_MANAGED_PATHS.md` for
  the canonical WonderMove repo path only. Wrong repo paths are reported as
  `blocked_wrong_repo_path` and are not added to the registry.
- The setup script registers missing required MCPs using pinned repo SoT:
  `mobile-mcp`, `serena`, and `stitch`.
- The setup script runs Design and QA/Release status-only report prechecks when
  the corresponding role and setup skill are present.
- `project-bootstrap/SKILL.md`, blocker guide, report template, and validators
  now require the agent-owned setup phase before final blocker reporting.
- The already-modified `pod-role-bootstrap` path remains part of the runtime
  scope because validators cover its managed-path registry behavior.

## Boundaries Preserved

- No account creation.
- No credential entry.
- No live deploy, EAS build/submit, Stitch generation/export, store submit,
  branch protection, production release, or failed-gate acceptance.
- Missing external authority remains a human-owned blocker.

## Focused Smoke

Command:

```bash
bash evals/skills/project-bootstrap-agent-setup-smoke.sh
```

Result:

```text
project-bootstrap-agent-setup smoke passed
```

This verified:

- role selector `boram-design` resolved to `design`;
- identity file was written;
- managed path registry entry was added;
- required MCP registrations were attempted and recorded;
- Design role status-only setup report was generated.
- wrong repo path did not repair the managed path registry and reported
  `blocked_wrong_repo_path`;
- missing Codex CLI ran the Codex precheck path before reporting MCPs as
  `codex_cli_missing`;
- QA/Release generated the EAS robot auth status-only setup report.

## Commands Run

```text
node scripts/validate-team-doc.mjs
```

Result: passed.

```text
bash evals/skills/project-bootstrap-agent-setup-smoke.sh
```

Result: passed.

```text
node scripts/validate-repo-operations.mjs
```

Result: passed.

```text
bash -n mobile-app-dev-team/09-pod-native-openclaw-skills/project-bootstrap/scripts/project-bootstrap-agent-setup.sh
bash -n mobile-app-dev-team/09-pod-native-openclaw-skills/project-bootstrap/scripts/project-bootstrap-preflight.sh
```

Result: passed.

```text
git diff --check
```

Result: passed.

```text
pnpm run test:runtime
```

Result: passed. Runtime artifacts, repo operations, team docs, work-unit
validators, project environment drift checks, evidence hygiene, and 44 hook
fixture tests passed.

```text
pnpm run test:local-harness
```

Result: passed. Preflight, runtime gates, workspace `turbo run lint test`, and
local harness stages passed. Turbo reported 7 successful tasks. Mobile Jest
reported 2 suites and 5 tests passed. API Vitest reported 1 file and 2 tests
passed. Contracts Node test reported 1 test passed.
