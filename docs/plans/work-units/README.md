# Work Units

This folder is the committed durable handoff root for pod-isolated role work.

Runtime assumption:

- Role SOUL.md agents may run in separate OpenClaw pods with no shared storage.
- A downstream pod consumes GitHub branch/commit/PR state, not another pod local workspace.
- Every work-unit artifact that another pod must consume must be committed here or linked from here.

Canonical root:

```text
docs/plans/work-units/<work-unit-id>/
```

Every role artifact must include:

- `status: required | not-applicable | deferred/non-goal`
- PRD acceptance line or explicit non-goal reference
- owner
- input artifact
- output artifact
- acceptance criteria
- evidence requirement
- dependencies/blockers
- open decisions
- next responsible role
- GitHub branch/commit/PR handoff link when applicable

Required folder schema:

```text
docs/plans/work-units/<work-unit-id>/
  README.md
  status.json
  00-product-planning/
    human-gates/
      <gate-id>.json
  01-design/
  02-architecture/
  03-contract-api/
  04-mobile-app/
  05-qa-release/
    human-approval.json
  06-gatekeeper/
  07-pr/
```

`status.json` uses the passive `wu-status/v1` schema and is validated by
`pnpm run validate:work-units`. It records the current stage, state, owning
role, read-only reviewer envelope, durable evidence links, handoff target, and
append-only event sequence for repo-state handoff. It is not an orchestrator and
does not trigger role execution.

Human gate decision JSON files use `human-gate/v1` and are validated by the same
command. Planning gates live at
`00-product-planning/human-gates/<gate-id>.json`; release approval lives at
`05-qa-release/human-approval.json`. These files make human decisions auditable
and machine-readable, but do not replace human authority. A `blocked-human`
work-unit may resume to `in-progress` only when the matching decision is
`approved`.

Design handoff indexes must link the committed publication package:

```text
design-pub-html/<YYYY-MM-DD>/<work-unit-id>/
```

The package must contain `option-a.html`, `option-a.png`, `option-b.html`, `option-b.png`, `manifest.json`, and `handoff.md` when Design publication is required. P0 must be recorded before Stitch generation, P1 must be recorded before HTML/image extraction, and `design-reviewer` evidence must be linked before UI implementation starts.

QA work-unit files summarize and link canonical evidence, such as:

```text
.evidence/e2e-test/<YYYYMMDD-HHMMSS>-<slug>/
```

Do not use these ignored paths as durable handoff artifacts:

- `.evidence/local/`
- `.evidence/tmp/`
- `.evidence/**/*.log`
- `.evidence/**/raw/`

Release Gatekeeper (System) records deterministic check status only. It has no SOUL.md, no LLM judgment, and no authority to replace human approvals.
