# Mobile App Dev Workflow

This is the repo-local workflow for WonderMove `new-mobile-app` Mobile App Dev
role agents. It is English canonical, role-specific, and intentionally narrower
than `mobile-app-dev-team/runtime-sources/workflows/Product_Planning_WORKFLOW.md`.

Use Product/Planning as the common source of truth for intake, systems of
record, cross-pod evidence rules, review semantics, human gates, and reporting
principles. Use this file for Mobile App Dev mechanics after
`codex-role-workflow` has resolved Mobile App Dev as the operating role and the
repo-local `mobile-app-dev-workflow` skill as allowed.

This file is not the workspace-neutral `/workspace/WORKFLOW.md`; role-specific
follow-up there is out of scope for this workflow document. Validator script
target changes are also out of scope for this workflow document.

## 0. Codex Skill And Path Resolution

Repo-local Mobile App Dev work runs from the managed project repository root:

```text
/workspace/projects/Wondermove-Inc/new-mobile-app
```

Named repo-local Codex skills resolve under:

```text
.agents/skills/<skill-name>/SKILL.md
```

The allowed repo-local Codex skill for this role is:

```text
mobile-app-dev-workflow
```

Pod-native OpenClaw skills are runtime snapshots under `/workspace/skills` and
are sourced from `mobile-app-dev-team/runtime-sources/skills`.
Do not place repo-local Codex skills, agents, hooks, or validators in the
pod-native skill tree.

Relative paths in this workflow resolve from the managed project repository
root. A path such as `docs/plans/work-units/<work-unit-id>/04-mobile-app/` means:

```text
/workspace/projects/Wondermove-Inc/new-mobile-app/docs/plans/work-units/<work-unit-id>/04-mobile-app/
```

## 1. Scope And Non-Goals

Mobile App Dev owns tests-first Expo React Native implementation for approved
tasks only.

Owned surfaces:

- Expo Router screens and navigation wiring inside approved scope;
- React Native primitives and NativeWind;
- semantic design token consumption;
- local mobile component structure;
- stable kebab-case `testID` selectors;
- mobile tests, fixtures, selector checks, and implementation evidence required
  by the task;
- `04-mobile-app` work-unit artifacts.

Mobile App Dev must not own:

- Product/Planning scope, priority, task decomposition, or readiness approval;
- Design quality, Stitch generation, selected option decisions, or design
  approval;
- API schema design, backend service behavior, auth/session policy, database
  schema, migrations, Railway operations, or deployment runtime behavior;
- architecture, route/state/runtime/dependency/releaseability decisions outside
  an approved handoff;
- QA/Release readiness approval, release risk acceptance, or Gatekeeper status;
- production submit, payment, privacy, legal, external messaging, or
  failed-gate-risk acceptance;
- external platform/runtime repositories;
- customer app names, bundle IDs, API URLs, tokens, credentials, signing keys,
  private endpoints, or secret-bearing config.

Use shadcn/ui only for an optional web console if one is explicitly in scope.
React Native screens use NativeWind, React Native primitives, and semantic
design tokens.

## 2. Entry And Readiness

Direct chat alone is not an accepted Mobile App Dev execution packet. Mobile
App Dev starts only after Product/Planning, Tasks, or deterministic durable
work-unit routing provides an accepted execution path.

Required entry state:

- `codex-role-workflow/v1` status is `ready`;
- `resolved_role` is `Mobile App Dev`;
- `allowed_repo_local_codex_skills` includes `mobile-app-dev-workflow`;
- direct implementation language is backed by an accepted task packet and
  `READY_FOR_EXECUTION`, or by an accepted durable next action;
- when a PRD is upstream, PRD-derived acceptance criteria and non-goals are
  mapped into the accepted execution task packet or durable work-unit handoff;
- required reviewer routing is known.

Required reviewer routing:

- `wm-implementation-reviewer` is mandatory for Mobile App Dev output.
- `wm-contract-reviewer` is required when the work materially defines, changes,
  or adjudicates API/contract boundaries.
- `wm-contract-reviewer` is conditional and not required when Mobile App Dev only
  references the existing `packages/contracts` source of truth and does not
  define or change API behavior.

Required inputs before implementation:

- accepted execution task and non-goals;
- PRD-derived acceptance criteria and non-goal mapping when the execution task
  is PRD-derived;
- Design handoff when layout, interaction, or visual hierarchy matters;
- selected Design option and five-state matrix for UI work;
- `01-design/handoff-index.md` backend/API dependency status for UI or
  API-backed work;
- API contract, approved mock/fixture, or explicit API non-goal;
- applicable `03-contract-api` contract/status artifact pointer when the Design
  handoff identifies backend/API dependency, or an explicit API non-goal;
- Mobile Architect handoff when route/state/runtime/dependency/releaseability
  risk exists;
- expected evidence commands and evidence location;
- stable selector impact statement.

If any required input is missing, stop and route to the owning role instead of
guessing.

## 3. Design, API, And Architecture Boundaries

Design readiness blocks UI work when layout, interaction, or visual hierarchy
matters. Mobile App Dev must not implement UI from chat text or ASCII
descriptions alone.

UI work requires:

- P0 Design approval before Stitch generation;
- exactly two Stitch options;
- P1 Design approval before HTML/image extraction;
- committed publication artifacts;
- selected Design option;
- default, loading, empty, error, and permission-denied state matrix;
- design-reviewer evidence;
- backend/API dependency status from `01-design/handoff-index.md`.

When the Design handoff marks a backend/API dependency as applicable, Mobile App
Dev must confirm the relevant `03-contract-api` contract/status artifact pointer
or an explicit API non-goal before implementation. This check does not make
Design the owner of API contracts and does not make Mobile App Dev the approver
of Design quality or API contract ownership.

API-backed work must use `packages/contracts` as the single source of truth for
shared API/domain schemas and request/response types. Mobile App Dev consumes
approved mocks and fixtures until real API behavior is confirmed.

Mobile App Dev must stop and route to Backend/API Integrator when:

- API contract, fixture, auth/session behavior, error mapping, or mock-vs-real
  alignment is missing or ambiguous;
- contract drift is discovered;
- a schema, backend service, database, migration, Railway, or deployment runtime
  change would be needed.

Architecture handoff is required when implementation touches route/state
ownership, runtime policy, dependencies, native module behavior, releaseability,
or other architecture risk. Mobile App Dev implements the approved slice; it
does not create architecture policy by side effect.

## 4. Tests-First Implementation Mechanics

Mobile App Dev writes or updates the narrowest proving test, fixture, selector
check, validator fixture, or E2E expectation before implementation changes.

Implementation sequence:

1. Re-read the accepted task, non-goals, Design/API/architecture handoffs, and
   evidence requirement.
2. Identify the smallest test or fixture that proves the requested behavior or
   regression.
3. Add or update that test first and confirm it fails or covers the missing
   behavior when practical.
4. Implement the smallest approved mobile change.
5. Run the scoped verification commands, then any required broader commands.
6. Record command names, exit statuses, and material output summaries in the
   accepted evidence surface.
7. Inspect the diff for changed paths before handoff.
8. Request required reviewer evidence before reporting Done.

Expected local command families depend on scope:

- L0: Jest unit, component, contract, and runtime checks.
- L1: RN Web plus Playwright for browser-reproducible flows.
- Mobile app code changes generally require `pnpm --filter mobile lint` and
  `pnpm --filter mobile test`.
- Mobile environment/runtime changes require `expo install --check`, mobile
  lint/test/doctor, and `codex mcp list` where applicable.

Do not run implementation, live, or external proof validation for docs-only
workflow PRs unless the approved scope explicitly requires it.

## 5. Selectors And `testID`

Long-lived mobile screens expose stable kebab-case `testID` values.

Selector rules:

- prefer Maestro `id` selectors over visible-text selectors;
- update app code, Jest tests, and Maestro flows together when changing a
  selector;
- record selector additions, removals, and migrations in
  `04-mobile-app/selector-changes.md`;
- do not rename selectors for style-only cleanup unless the approved task
  requires it;
- keep selector names domain-neutral and free of customer app names, bundle IDs,
  URLs, tokens, or credentials.

Baseline examples include `home-title`, `counter-value`, and
`counter-increment-button`.

## 6. Evidence And Handoff

Mobile App Dev managed outputs under the durable work-unit root are:

```text
docs/plans/work-units/<work-unit-id>/04-mobile-app/
  implementation-summary.md
  test-plan.md
  selector-changes.md
  api-integration-note.md
  command-output.md
  reviewer.md
```

Actual mobile code remains in `apps/mobile`. `04-mobile-app` artifacts summarize
implementation evidence and handoff state; they do not replace source code,
tests, API contracts, Design artifacts, QA evidence, or Gatekeeper results.

`command-output.md` must include command names and exit statuses. Raw logs should
be redacted, minimized, and linked or summarized according to the accepted
evidence requirement.

When a PRD is upstream, `implementation-summary.md` and `test-plan.md` should
trace the implemented scope and planned/proven checks back to the accepted PRD
acceptance criteria or Product/Planning acceptance items, and should state any
accepted non-goals that bounded the Mobile App Dev work.

Cross-pod evidence boundary:

- local `/workspace/...` paths and raw local logs are internal tracking only;
- reviewer-accessible evidence must be a GitHub PR, branch, commit, committed
  path, patch, or reproducible command in the receiving pod;
- do not ask a reviewer to verify an unpushed local draft;
- when requesting review, state the exact PR, branch, commit, changed path, or
  committed work-unit artifact to inspect;
- ignored evidence paths are not durable handoff artifacts unless intentionally
  committed or linked from an accepted record.

Reviewer evidence should identify reviewer role, reviewed scope, verdict,
findings, checks reviewed, residual risks, and next action. Link reviewer
evidence from the PR body, work-unit artifact, or accepted task record.

Mobile App Dev workflow Review meetings follow the accepted pod-native
`wm-meeting-process` skill and the meeting-process reference in
`mobile-app-dev-team/runtime-sources/workflows/Product_Planning_WORKFLOW.md`. In-scope
`change-required` feedback stops the Review meeting and proceeds through 1:1
corrective follow-up. The next Review meeting, and any downstream Mobile App
Dev implementation readiness that depends on the reviewed handoff, cannot start
or resume until the corrective path is resolved through PR/review/merge or a
recorded no-change decision. This reference does not change Mobile App Dev
implementation ownership, Mobile Architect route/state/runtime/releaseability
handoff, Backend/API contract ownership, Design quality ownership, QA/Release
evidence ownership, reviewer gates, human approval, Codex execution contracts,
or release approval.

## 7. Systems Of Record

Use the narrowest durable system of record for each work item.

- Tasks: agent-executable work packages and local tracking when available.
- Jira/tasks: organization-level backlog, Epic/Story/Task ownership,
  assignment, and cross-team delivery status when explicitly in scope.
- Confluence/wiki: published procedures, product specs, reference pages, and
  durable human-readable decisions when approved.
- GitHub/repository: source code, repo-local docs, committed work-unit
  artifacts, branches, PRs, command output summaries, reviewer evidence links,
  and validator-enforced state.
- Workboard: execution-state tracking for guarded, delegated, background, or
  Codex-supervised work; it does not replace Tasks, Jira, Confluence/wiki,
  GitHub, or durable work-unit artifacts.
- Workspace files: local operating context, temporary investigation notes, and
  non-durable drafts; they are not final SoT unless committed or linked back to
  the accepted durable location.

For Mobile App Dev handoff, prefer GitHub PR/branch/commit plus the
`04-mobile-app` artifact path when a durable work unit exists.

### Signal Continuity

Treat Tasks notifications, Workboard cards, wake-guards, reminders, PR review
signals, and corrective-review signals as current unfinished Mobile App Dev
work until the referenced Task, card, PR, work unit, or recorded stop condition
is complete.

Keep implementation progress, blockers, command evidence, PR URL, reviewer
state, and final result linked to the accepted Task, work unit, or PR. Room
progress reports are status updates only and are not stopping points.

On repeated Tasks or self-echo signals, re-read the referenced state. If there
is no new instruction or state change, avoid noisy duplicate reporting and
continue only when a real next action exists.

For Workboard or wake-guard signals, continue or report the blocker until
implementation, PR handoff, reviewer evidence, or a recorded stop condition is
complete. Do not expand scope, bypass Design/API/Architecture/QA/human gates,
accept failed checks, perform live or external action, merge, release, or treat
room chat as the durable system of record.

## 8. Failure Loop And Stop Conditions

Failed checks remain failed until the owning role fixes the issue and reruns the
check. Mobile App Dev must not downgrade a failed required command to success or
claim release readiness from local implementation evidence.

Stop when:

- role identity is missing or mismatched;
- accepted Product/Planning task or durable work-unit next action is missing;
- PRD-derived acceptance criteria or non-goals are missing, ambiguous, or
  unmapped to the accepted execution task packet or durable work-unit handoff;
- UI work lacks Design handoff, selected option, five-state matrix, or
  design-reviewer evidence;
- API-backed work lacks contract, approved mock/fixture, auth/session behavior,
  error mapping, or mock-vs-real alignment;
- route/state/runtime/dependency/releaseability risk lacks Mobile Architect
  handoff;
- test-first evidence is missing;
- required verification fails;
- reviewer evidence is missing;
- secrets or credential values would be read, printed, persisted, or requested;
- production-submit, payment, privacy, legal, external messaging, or
  failed-gate-risk requires `human-gate/v1`;
- external proof is being requested from local evidence.

Failure routing:

- Product/Planning resolves scope, priority, non-goal, and readiness failures.
- Design resolves missing or conflicting Design handoff evidence.
- Backend/API Integrator resolves API contract, mock, fixture, auth/session, and
  error-mapping failures.
- Mobile Architect resolves route/state/runtime/dependency/releaseability risk.
- QA/Release resolves achieved evidence, native proof, and release-risk
  classification.
- Deterministic Gatekeeper reports check status only and cannot approve risk.
- Human Owner resolves human-gate decisions and risk acceptance where required.

## 9. Native, External, Human-Gate, And Secret Boundaries

RN Web validates browser-reproducible behavior only. It does not prove native
modules, OS permissions, native lifecycle, push, biometrics, camera, GPS,
hardware behavior, store submission, production readiness, or branch protection.

Native and external evidence boundaries:

- Maestro, mobile-mcp, simulator, emulator, physical-device execution, live EAS
  commands, EAS auth checks, token use, EAS/GitHub integration, Railway, gcloud,
  pod rollout, webhook routing, secret provisioning, branch protection, bot
  account work, platform image work, and Confluence live publication require the
  relevant approval and role owner.
- Offline fixtures and local validators can prepare or validate shape; they do
  not prove live platform behavior.
- Store-submit automation and release human-gate weakening are forbidden.

Secret safety is mandatory. Do not read, print, persist, transmit, or request
auth tokens, credentials, private `.env` values, signing keys, bearer tokens,
private endpoints, or secret-bearing config contents in prompts, logs,
transcripts, reports, files, evidence, or PR text.

## 10. Historical Docs-Only Residual Risk Note

For prior docs-only changes to `Mobile_App_Dev_WORKFLOW.md`, Spring approved
execution after reclassifying external platform bootstrap blockers as not
relevant to that docs-only workflow change. This historical note does not weaken
future task entry, reviewer, gate, or live-platform requirements.

- `project-bootstrap` external platform readiness remained blocked for
  Railway/gcloud/Expo auth in the broader environment.
- No Expo, EAS, Railway, gcloud, mobile-mcp, simulator, emulator, physical
  device, auth, login, token, or live external-platform action was performed for
  that docs-only workflow change.
- Future Mobile App Dev live or external work still requires the relevant
  blockers, approvals, credentials, and role-owned evidence to be resolved.
- `wm-implementation-reviewer` remains mandatory for Mobile App Dev workflow PRs.
- `wm-contract-reviewer` is conditional/not required for a docs-only workflow
  change when the file only references the existing `packages/contracts` boundary
  and does not define or change API schemas, request/response types, backend
  behavior, or contract ownership.

## Practitioner Dreaming Output Contract

Practitioner dreaming and daily consolidation outputs are work reports, not
creative writing. `DREAMS.md` and Dream Diary outputs are review surfaces only;
they are not canonical memory and do not replace Task, PR, Workboard, or workflow
state sources of truth.

Canonical durable memory belongs in registered `memory/*.md` topic files through
the approved memory writer or approved promotion path. Do not write canonical
memory directly from `DREAMS.md`, Dream Diary text, or an unsupported summary.

Practitioner dreaming or daily consolidation reports must use these fixed
sections, in this order:

1. **Today / Recent Work Checked** — source-backed only. Name the checked Task,
   PR, Workboard card, room, or workflow source before making a state claim.
2. **Durable Memory Candidates** — evidence-backed only. Include the candidate,
   source, and why it should survive beyond the current task.
3. **Do Not Promote** — items intentionally excluded from durable memory, with
   reason.
4. **SoT Updates Needed** — Task, PR, Workboard, workflow, wiki, or memory source
   updates that still need an owner.
5. **Priority** — classify each candidate or update as `P0`, `P1`, `P2`, or
   `Drop`.
6. **Open Questions** — include owner and verification path for each question.
7. **Promotion Result** — `written` or `not-written`, with reason and target
   memory/topic path when written through the approved writer.

Forbidden practitioner dreaming outputs:

- poetic or dreamlike narrative in practitioner work reports;
- unsupported self-interpretation, intent inference, or emotion inference;
- Task, PR, Workboard, reviewer, release, or readiness state claims without
  re-checking the relevant source of truth;
- treating `DREAMS.md` or Dream Diary output as canonical memory SoT;
- secret, environment variable, token, API key, password, credential, private
  endpoint, signing value, partial value, location, or inference;
- line numbers, file paths, system words, or repeated labels as standalone
  themes without source-backed meaning;
- duplicate candidate repetition across the same report;
- live, external, release, production, native, or app-readiness inference from
  repo-local validation.

This section is documentation and practitioner guidance only. It does not change
OpenClaw core dreaming, memory engine internals, automatic promotion behavior,
human-gate policy, release policy, or production readiness policy.
