# GitHub Artifact Workflow

This document defines how role SOUL.md agents hand off work when they run as pod-isolated OpenClaw agents with no shared storage.

## Operating Assumption

- Role agents may run in separate OrbStack/OpenClaw pod or VPC-like runtimes.
- No shared storage is assumed between Product/Planning, Design, Mobile Architect, Backend/API Integrator, Mobile App Dev, QA/Release, and Gatekeeper execution surfaces.
- Durable handoff must happen through a GitHub branch/commit/PR or a merged repository artifact.
- Downstream pods consume GitHub branch/PR contents, not another pod's local workspace.
- Local repo validation prepares this workflow but does not prove actual OrbStack/OpenClaw pod execution.

## Durable Work-Unit Root

Every durable work unit uses this committed GitHub artifact root:

```text
docs/plans/work-units/<work-unit-id>/
```

This path is used because the current GitHub quality gate already treats `docs/plans/**` as a conditional local-harness trigger. If a different durable work-unit path is introduced later, `.github/workflows/quality-gate.yml` and `PROJECT_ENVIRONMENT.md` must be updated together.

## Work-Unit Schema

```text
docs/plans/work-units/<work-unit-id>/
  README.md
  status.json
  00-product-planning/
    brief.md
    work-unit-decision.md
    task-packet.md
    evidence-matrix.md
    human-gates.md
    human-gates/
      <gate-id>.json
    dependencies-and-blockers.md
    planning-completeness-review.md
  01-design/
    design-decision.md
    p0-packet.md
    p1-packet.md
    option-comparison.md
    state-matrix.md
    ux-acceptance.md
    handoff-index.md
    reviewer.md
  02-architecture/
    architecture-note.md
    route-state-impact.md
    api-contract-cosign.md
    releaseability-risk.md
    adr.md
  03-contract-api/
    api-contract.md
    contract-diff.md
    mock-fixture-report.md
    backend-service-evidence.md
    migration-note.md
    runtime-smoke.md
    rollback-note.md
    reviewer.md
  04-mobile-app/
    implementation-summary.md
    test-plan.md
    selector-changes.md
    api-integration-note.md
    command-output.md
    reviewer.md
  05-qa-release/
    e2e-plan.md
    reset-record.md
    rn-web-evidence.md
    native-evidence.md
    mobile-mcp-evidence.md
    railway-evidence.md
    eas-evidence.md
    failure-classification.md
    release-risk-summary.md
    human-approval.md
    human-approval.json
  06-gatekeeper/
    check-results.md
    ci-status.md
    evidence-completeness.md
  07-pr/
    story-pr-plan.md
    branch-plan.md
    pr-index.md
    review-results.md
    merge-checklist.md
    post-merge-summary.md
```

Each role artifact must include:

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
- GitHub branch/PR handoff link when work leaves the current pod

Optional backend, Railway, EAS, native, and mobile-mcp files must not be treated as mandatory unless the approved work touches those surfaces. Mark them `not-applicable` or `deferred/non-goal` with a reason.

`status.json` uses `wu-status/v1` and is validated by `pnpm run validate:work-units`.
Human gate decision JSON files use `human-gate/v1` and are validated together
with the work-unit status. A `blocked-human` work unit can resume only when the
matching decision file is `approved`. Rejected or deferred decisions remain
recorded audit artifacts and do not unblock execution.

## Role Outputs

### Product/Planning

Product/Planning owns the top-level work-unit packet and routing.

Managed outputs:

- `00-product-planning/brief.md`
- `00-product-planning/work-unit-decision.md`
- `00-product-planning/task-packet.md`
- `00-product-planning/evidence-matrix.md`
- `00-product-planning/human-gates.md`
- `00-product-planning/dependencies-and-blockers.md`
- `00-product-planning/planning-completeness-review.md`
- `07-pr/story-pr-plan.md`

Product/Planning must not implement app, backend, design, QA, or release work.

### Design

Design owns Design quality and the Stitch-backed implementation handoff.

Managed outputs:

- `01-design/design-decision.md`
- `01-design/p0-packet.md`
- `01-design/p1-packet.md`
- `01-design/option-comparison.md`
- `01-design/state-matrix.md`
- `01-design/ux-acceptance.md`
- `01-design/handoff-index.md`
- `01-design/reviewer.md`

Design publication artifacts remain under:

```text
design-pub-html/<YYYY-MM-DD>/<work-unit-id>/
  option-a.html
  option-a.png
  option-b.html
  option-b.png
  manifest.json
  handoff.md
```

`01-design/handoff-index.md` must link the exact committed `design-pub-html/<YYYY-MM-DD>/<work-unit-id>/` package. For UI work, Mobile App Dev must not start implementation until these GitHub-linked records exist:

- P0 before Stitch generation
- exactly two Stitch options
- P1 before HTML/image extraction
- no `fetch_screen_code`, `code.html`, SDK `getHtml`, `htmlCode.downloadUrl`, or equivalent HTML extraction metadata before P1
- backend/API dependency status in the Design package and
  `01-design/handoff-index.md`, including applicable Backend/API handoff target
  and `03-contract-api` pointer; Design records dependency and routing status
  only and does not define or change API contracts
- `design-reviewer` evidence

### Mobile Architect

Mobile Architect owns technical review and releaseability risk routing without absorbing implementation ownership.

Managed outputs:

- `02-architecture/architecture-note.md`
- `02-architecture/route-state-impact.md`
- `02-architecture/api-contract-cosign.md`
- `02-architecture/releaseability-risk.md`
- `02-architecture/adr.md`

### Backend/API Integrator

Backend/API Integrator owns mobile-facing API contracts and bounded backend/API delivery when approved.

Managed outputs:

- `03-contract-api/api-contract.md`
- `03-contract-api/contract-diff.md`
- `03-contract-api/mock-fixture-report.md`
- `03-contract-api/backend-service-evidence.md`
- `03-contract-api/migration-note.md`
- `03-contract-api/runtime-smoke.md`
- `03-contract-api/rollback-note.md`
- `03-contract-api/reviewer.md`

Actual API schemas remain in `packages/contracts`. Backend service changes remain in `apps/api` only when approved.

### Mobile App Dev

Mobile App Dev owns tests-first Expo React Native implementation for approved tasks.

Managed outputs:

- `04-mobile-app/implementation-summary.md`
- `04-mobile-app/test-plan.md`
- `04-mobile-app/selector-changes.md`
- `04-mobile-app/api-integration-note.md`
- `04-mobile-app/command-output.md`
- `04-mobile-app/reviewer.md`

Actual mobile code remains in `apps/mobile`. Command output must include exit status.

### QA/Release

QA/Release owns evidence planning, execution, failure classification, and release-risk reporting.

Managed outputs:

- `05-qa-release/e2e-plan.md`
- `05-qa-release/reset-record.md`
- `05-qa-release/rn-web-evidence.md`
- `05-qa-release/native-evidence.md`
- `05-qa-release/mobile-mcp-evidence.md`
- `05-qa-release/railway-evidence.md`
- `05-qa-release/eas-evidence.md`
- `05-qa-release/failure-classification.md`
- `05-qa-release/release-risk-summary.md`
- `05-qa-release/human-approval.md`

These files summarize and link canonical evidence. They do not replace workflow evidence paths such as:

```text
.evidence/e2e-test/<YYYYMMDD-HHMMSS>-<slug>/
```

Do not use ignored evidence paths as durable pod handoff artifacts:

- `.evidence/local/`
- `.evidence/tmp/`
- `.evidence/**/*.log`
- `.evidence/**/raw/`

### Release Gatekeeper

Release Gatekeeper (System) is non-LLM and deterministic.

Managed outputs:

- `06-gatekeeper/check-results.md`
- `06-gatekeeper/ci-status.md`
- `06-gatekeeper/evidence-completeness.md`

Rules:

- No Gatekeeper SOUL.md.
- No LLM judgment.
- No human approval replacement.
- No failed-gate risk acceptance.

## GitHub PR Workflow

1. Product/Planning creates or updates the durable work-unit root in a branch/PR.
2. Each role pod works from GitHub branch/PR state, not another pod's local workspace.
3. Role handoff requires a committed artifact update and PR link in `07-pr/pr-index.md`.
4. Design, Backend/API, and Architecture contracts are established before dependent implementation work.
5. Mobile App Dev may implement UI only after the Design gate records are committed and linked.
6. Integration PR composes role PRs after contract and design readiness.
7. QA/Release links canonical evidence and classifies unrun checks or failures.
8. Gatekeeper records deterministic check status.
9. Merge requires applicable CI, reviewer evidence, QA evidence, and recorded human-gate decisions.

## Validation Requirements

`scripts/validate-team-doc.mjs` must enforce the durable workflow contract:

- required SoT document and `docs/plans/work-units/<work-unit-id>/` convention
- full Product/Planning execution-task field set
- artifact status values
- GitHub branch/PR handoff link requirement
- P0/P1 and HTML extraction sequencing
- exact Design publication package link from `01-design/handoff-index.md`
- canonical QA evidence cross-link
- ignored evidence path prohibition for durable handoff
- `mobile-mcp` and exit status evidence language
- Gatekeeper no-SOUL invariant

Run these checks for workflow changes:

```text
pnpm run validate:team-doc
pnpm run test:runtime
pnpm turbo run lint test
pnpm run test:local-harness
```

Local harness evidence confirms repo-local rules only. It does not prove actual OrbStack/OpenClaw pod execution or external platform behavior.
