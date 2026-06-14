# Policy Command Output: AGENTS.md Alignment

status: required
owner: Product/Planning
input artifact: `AGENTS.md`
output artifact: this command-output summary
acceptance criteria: source-managed root policy text explains that WonderMove requirements/specifications/work requests resolve through `codex-role-workflow`
evidence requirement: command output with exit status
dependencies/blockers: no live `/workspace/AGENTS.md` mutation performed
open decisions: live pod publication requires separate runtime evidence
next responsible role: read-only reviewer

## Diff Check

Command:

```text
git diff -- AGENTS.md
```

Exit status: 0

Summary:

- Added that WonderMove new-mobile-app project requirements, project specifications, PRDs, work requests, planning artifacts, handoffs, or role workflow requests must first resolve through `codex-role-workflow`.
- Added that Codex is the default repo-local role-workflow substrate for planning, routing, review, handoff, evidence, hooks, MCP, validators, and implementation when authorized.
- Added that `human-gate/v1`, evidence requirements, hook policy/evidence expectations, and external proof boundaries must not be bypassed.

## Boundary

This is source-managed policy text for the OpenClaw runtime root file. No direct edit to `/workspace/AGENTS.md` was performed in this repo-scoped implementation.
