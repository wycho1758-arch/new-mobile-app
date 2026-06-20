# QA/Release Workflow

This is the agent-consumed QA/Release workflow for WonderMove
`new-mobile-app` role agents. It defines how QA/Release plans evidence, records
reset and execution proof, classifies failures, summarizes release risk, and
hands reviewer-accessible artifacts back to Product/Planning and Gatekeeper.

This file is not the workspace-neutral `/workspace/WORKFLOW.md` and must not be
copied there as-is. Common intake, reporting, approval, and cross-pod mechanics
remain in `mobile-app-dev-team/runtime-sources/workflows/Product_Planning_WORKFLOW.md`; this
document is the QA/Release specialization.

Use this file when a WonderMove QA/Release pod, repo-local Codex skill, or
reviewer needs the QA/Release mechanics for evidence planning, E2E execution,
Railway/API verification, native/EAS/Maestro/mobile-mcp boundary handling,
failure routing, release-risk summary, human gates, and Done criteria.

## 0. Codex Skill And Path Resolution

Named workflow skills in this document are repo-local Codex skills under
`.agents/skills/<skill-name>/SKILL.md` unless explicitly marked as pod-native.
Pod-native OpenClaw runtime snapshots live under `/workspace/skills/<slug>/` and
are sourced from `mobile-app-dev-team/runtime-sources/skills/`.

The QA/Release canonical pod/runtime slug is `qa-release`. The allowed
repo-local Codex skills for QA/Release work are:

- `e2e-test` for E2E planning, reset, execution, and evidence records.
- `qa-railway-workflow` for Railway/API deployment, status, health, logs, and RN
  Web evidence when Railway is explicitly in scope.

The mandatory reviewer for QA/Release work is `wm-implementation-reviewer`. The
durable work-unit stage is `05-qa-release`.

Relative repository paths resolve from the managed project repository root:

```text
/workspace/projects/Wondermove-Inc/new-mobile-app
```

Therefore `docs/plans/work-units/<work-unit-id>/05-qa-release/` means that path
inside the managed project repository, not `/workspace/docs/...` or a pod-local
scratch directory.

### 0.1 Cross-Pod Evidence And Local Path Boundaries

WonderMove practitioners run in independent pods. Local `/workspace/...` paths,
`.evidence/...` paths, simulator state, logs, screenshots, and command output
are internal tracking until they are committed, attached to an accepted record,
or linked from a durable artifact that the reviewer can access.

QA/Release must not ask another pod to inspect an unpushed local draft or a
local-only evidence path. Cross-pod handoff must use GitHub branch/PR state,
committed repository artifacts, accepted task/Jira/Confluence links, or attached
evidence reachable from the receiving pod. Work-unit QA files under
`05-qa-release` summarize and link canonical evidence; they do not replace the
underlying `.evidence/e2e-test/...`, EAS, Railway, mobile-mcp, device, or
human-gate records.

Ignored evidence paths are not durable handoff artifacts:

- `.evidence/local/`
- `.evidence/tmp/`
- `.evidence/**/*.log`
- `.evidence/**/raw/`

### 0.2 Codex Interactive Execution Guardrails

QA/Release managed-repository edits run through the approved
`codex-role-workflow` and `codex-interactive-repo-work` path. The routing
artifact must resolve the QA/Release role, allowed repo-local skills, required
reviewer, durable artifact stage, human-gate state, and external-proof boundary
before execution.

Codex prompts for QA/Release repository work must literally invoke `$wm` or
`/wm`, name the routing artifact, preserve the approved scope, keep changes
inside the managed repository, avoid unrelated edits, and leave `git diff`,
validation output, reviewer evidence, and `git status --short` ready for
supervisor review.

## 0A. Standard QA/Release Work Lifecycle

QA/Release follows the shared lifecycle from Product/Planning:

```text
Intake -> Plan -> Gather evidence -> Produce -> Review -> Deliver -> Follow through
```

For QA/Release, the lifecycle means:

- Intake: confirm the target task, route, screen, user flow, target
  surface/build, required evidence level, owner, deadline, and approval boundary.
- Plan: define reset steps, selectors, commands, evidence directory, expected
  artifacts, native availability, Railway/API scope when relevant, non-goals,
  and human gates before execution.
- Gather evidence: run only approved status, local, RN Web, Railway, EAS,
  Maestro, mobile-mcp, device, or manual checks and record command output with
  exit status.
- Produce: update only QA-owned evidence artifacts and summaries.
- Review: classify pass/fail/blocked states, release proof limits, residual
  risks, and reviewer requirements.
- Deliver: report outcome, evidence links, blockers, owner routing, human-gate
  state, and next responsible role.
- Follow through: keep the durable work-unit record current until Product/Planning
  or Gatekeeper can consume it.

QA/Release owns evidence planning, execution records, failure classification,
and release-risk reporting. QA/Release does not implement app, backend,
contract, migration, architecture, design, or mobile UI fixes.

## 0B. Systems Of Record

Use the narrowest durable system of record:

- Tasks for agent-executable work packages and local project tracking when
  available.
- Jira/tasks for organization-level backlog, Epic/Story/Task ownership,
  assignment, and delivery status when explicitly in scope.
- Confluence/wiki for published procedures, product specs, release procedures,
  and durable human-readable decisions.
- GitHub/repository for docs, branch/PR handoff, committed work-unit artifacts,
  command-output summaries, reviewer evidence links, and validator-enforced
  state.
- Local workspace files and `.evidence/...` directories for temporary evidence
  capture until committed, attached, or linked from durable artifacts.
- Workboard for execution guard, wake/follow-through tracking, owner, scope,
  evidence path, blockers, and completion proof.

Workboard is not a replacement for Tasks, Jira, Confluence/wiki, GitHub, or
durable work-unit source of truth. It tracks guard and wake state for the work.

### 0B.1 QA Task Signal Follow-Through

Tasks notifications with Action Guides, Workboard cards, wake-guards,
reminders, or continuity messages are current QA/Release work signals when they
reference a task, work-unit, PR, evidence path, blocker, rerun,
release-risk summary, or stop condition.

Before reporting status or closing the signal, QA/Release must check the
relevant source of truth: Task, Workboard card, work-unit, PR, evidence record,
or approved handoff. Handle repeated notifications when they include material
updates, but avoid duplicate comments or room spam for self-echo or no-change
signals.

If QA evidence, a rerun, release-risk summary, blocker routing, or
external-proof wait remains incomplete, update the source of truth and keep or
register a wake-guard only when QA/Release is still waiting. The signal is
complete only when the Task, Workboard card, work-unit, PR, or evidence record
is done, blocked with owner and reason, explicitly cancelled, or handed off with
active follow-up.

Dependency installs, auth or live external actions, secret or environment value
output, production or release approval, and failed-gate risk acceptance still
require explicit approval or the required human gate.

## 0C. Reporting, Review, And Approval

QA/Release status reports must state done, in progress, blocked, risks, and next
action. When evidence is involved, also state the target surface, achieved
evidence level, untested scope, command output location, and whether external
platform behavior was actually exercised.

Reviews and approvals are separate. The mandatory reviewer is
`wm-implementation-reviewer`. Mobile Architect peer review is required when the
workflow changes or defines native, EAS, releaseability, route/state, runtime,
or dependency proof boundaries; otherwise it is strongly recommended for
release-sensitive QA packages. Product/Planning review is required for scope,
evidence requirements, non-goals, human-gate boundary, and failed-gate-risk
routing.

Reviewer evidence must cover the approved plan, changed paths or evidence
artifacts, validation output, residual risks, release proof limits, and next
action. A reviewer cannot grant production submit, accept failed-gate risk, or
replace a required human owner.

QA/Release workflow Review meetings follow the accepted pod-native
`wm-meeting-process` baseline and the meeting-process reference in
`mobile-app-dev-team/runtime-sources/workflows/Product_Planning_WORKFLOW.md`. Each Review
meeting has one target and an allowed-role feedback scope. In-scope
`change-required` feedback stops the meeting and moves correction to 1:1
corrective follow-up. The next step, final sync, or next Review meeting cannot
start until the corrective PR/review/merge or recorded no-change decision is
complete.

## 0D. Safety And Approval Boundaries

Secret safety is mandatory. QA/Release must never print, persist, commit,
summarize, or transmit token values, passwords, PATs, OAuth tokens, refresh
tokens, device codes, bearer tokens, signing keys, Google ADC JSON, service
account JSON, database URLs, private hosts, `hosts.yml`, auth files, private
`.env` values, or full secret-bearing config contents.

Default external-platform behavior is readiness/status-only. Live Railway,
gcloud, Expo, EAS, Maestro, mobile-mcp, simulator, emulator, native device,
physical device, production submit, store, or externally visible actions require
explicit approval and are blocked otherwise. Readiness/status-only checks do not
prove live external behavior.

QA/Release must stop for the required human owner when work involves production
submit, failed-gate risk, privacy/PII, legal/compliance, payment or money
movement, external messaging, privileged access, business/budget ownership, or
irreversible scope tradeoff. QA/Release cannot accept failed-gate risk.

## 0E. Role-Centered Operation Check

Before reporting, handing off, or marking QA/Release work ready, check:

- Operating role: QA/Release owns evidence and release-risk reporting.
- Reports to: Product/Planning for scope, evidence requirement, and human-gate
  boundary; Gatekeeper consumes deterministic check status later.
- Escalation owner: route blockers to Product/Planning, Mobile App Dev,
  Backend/API Integrator, Mobile Architect, Design, Human Owner, or external
  platform owner as appropriate.
- Owns / must not own: QA/Release owns QA evidence artifacts and must not own
  implementation fixes or risk acceptance.
- Handoff targets: Product/Planning, the owning rework role, required reviewer,
  deterministic Gatekeeper, or Human Owner.
- Human-gate boundary: stop rather than accepting production, privacy, legal,
  payment, external messaging, privileged access, or failed-gate risk.

## 1. Intake And Routing

QA/Release starts only from accepted scope: a task, Jira item, work-unit
`status.json` next action, GitHub/PR handoff, or `codex-role-workflow/v1`
routing artifact that assigns QA/Release work.

The intake record must identify:

- target task, work-unit id, Workboard card, and wake guard when present;
- target route, screen, user flow, API, deployment, or release candidate;
- required evidence level from Product/Planning or `status.json`;
- target surface/build: L0 local, L1 RN Web, L2 EAS/Maestro, L3 human-device, or
  Railway/API evidence;
- selectors, reset requirements, expected commands, and canonical evidence path;
- external approvals needed before live platform, native, device, or production
  action;
- non-goals and known untested scope;
- required reviewer and Product/Planning or Mobile Architect review needs.

If accepted QA/release scope, target, reset method, evidence path, required
level, or approval state is missing, QA/Release reports blocked instead of
running checks from assumptions.

## 2. Evidence Ladder

QA/Release records required and achieved evidence levels without overstating
proof:

| Level | Slug | Evidence scope |
| --- | --- | --- |
| L0 | `jest` | Unit, component, contract, and runtime checks that do not exercise a user flow. |
| L1 | `rn-web` | Browser-reproducible UI, navigation, state, and business-flow checks with Playwright evidence. |
| L2 | `eas-maestro` | Native package plus approved EAS/Maestro evidence for native modules, permissions, navigation container behavior, or release-candidate touching work. |
| L3 | `human-device` | Linked device or mobile-mcp evidence plus a `human-gate/v1` residual-risk decision. |

Product/Planning sets `status.json.evidence_ladder.required_level`.
QA/Release records `evidence_ladder.achieved_level` before marking
`05-qa-release` complete.

`05-qa-release` cannot be marked done unless achieved evidence meets the
required level or an approved `failed-gate-risk` human-gate decision exists with
a failed check reference. RN Web, Railway, local harness, source review, offline
fixtures, manual QR, and local native checks do not satisfy L2 or L3 native
proof by themselves.

## 3. Evidence Plan

Use `$e2e-test` when E2E evidence is in scope. The plan must be written before
execution and include:

- SoT inputs and task/work-unit references;
- target route, screen, user flow, API, deployment, or release candidate;
- target layer and surface/build;
- required evidence level and expected achieved level;
- selectors, preferably stable kebab-case `testID` values;
- reset steps and reset verification;
- commands to run and expected exit criteria;
- screenshots, console logs, device logs, Railway logs, EAS result files, or
  mobile-mcp artifacts expected;
- native availability and external approval state;
- canonical evidence directory;
- non-goals, release proof limits, and follow-up owner for failures.

Command output must include exit status. If the plan changes during execution,
record the reason before continuing.

## 4. Reset Record

Every QA/Release execution record must state how the tested instance was reset
or why reset was not applicable:

- RN Web: fresh Playwright browser context, cleared storage/cookies, and stale
  `test-results` avoidance when applicable.
- Maestro, simulator, emulator, device, or mobile-mcp: device inventory first,
  serial execution, and terminate/reinstall/relaunch/reset steps when supported.
- Railway/API: target project, service, environment, deployment, health endpoint,
  bounded log scope, and variable names only.
- Manual HUMAN-GATE: user-performed fresh app/session reset and exact recorded
  limitation.

Missing reset evidence blocks release-readiness claims for the affected surface.

## 5. RN Web Boundary

RN Web Playwright evidence validates browser-reproducible UI, navigation, state,
and business logic flows only. It does not prove native modules, OS permissions,
native lifecycle, push delivery, biometrics, camera, GPS, hardware behavior,
store submission readiness, or production mobile release readiness.

RN Web evidence may satisfy L1 when the required evidence level is L1 or lower.
It must be recorded as lower than L2/L3 when native or device proof is required,
unless a valid `failed-gate-risk` human-gate decision explicitly accepts the
shortfall.

## 6. Native, EAS, Maestro, Mobile-MCP, And Device Boundary

Native, EAS, Maestro, mobile-mcp, simulator, emulator, and physical-device work
is blocked unless explicit approval exists for the live action and required
auth/readiness blockers are resolved.

When approved, QA/Release must:

- run simulator/device operations serially;
- use approved app configuration and never hardcode customer app names, bundle
  IDs, API URLs, tokens, or credentials;
- distinguish the EAS profile or workflow label `e2e-test` from the repo-local
  `$e2e-test` skill;
- ingest approved EAS/Maestro output as redacted `eas-evidence/v1` when used;
- link mobile-mcp or device evidence for L3 and include the required
  `human-gate/v1` residual-risk decision;
- record untested native, hardware, permission, lifecycle, or release-sensitive
  scope.

Offline EAS/Maestro fixtures prove ingestion and redaction behavior only. They
do not prove live EAS, native, Maestro, mobile-mcp, device, store, or release
behavior.

## 7. Railway And API Evidence Boundary

Use `qa-railway-workflow` only when Railway/API release evidence is explicitly
in scope. Railway evidence may include CLI availability, authenticated account
status, project/service/database/domain status, deployment status, bounded logs,
`/livez`, `/readyz`, and RN Web E2E against a deployed API URL.

Railway/API evidence does not prove native module behavior, OS permissions,
mobile-mcp visual QA, Maestro native automation, store submission readiness, or
full mobile release approval. A passing Railway deploy is not mobile release
readiness unless the required mobile evidence also exists.

QA/Release may record project, service, deployment, environment, domain, and
variable names. It must not record secret values, private endpoints, database
URLs, bearer tokens, Railway tokens, API tokens, or auth files.

## 8. Managed Outputs

QA/Release managed outputs live under:

```text
docs/plans/work-units/<work-unit-id>/05-qa-release/
```

Expected files are:

- `e2e-plan.md`
- `reset-record.md`
- `rn-web-evidence.md`
- `native-evidence.md`
- `mobile-mcp-evidence.md`
- `railway-evidence.md`
- `eas-evidence.md`
- `failure-classification.md`
- `release-risk-summary.md`
- `human-approval.md`
- `human-approval.json` when a machine-readable human gate decision is needed

Optional files must be marked `not-applicable` or `deferred/non-goal` when the
approved work does not touch that surface. Each artifact should include status,
owner, input artifact, output artifact, acceptance criteria, evidence
requirement, dependencies/blockers, open decisions, next responsible role, and
GitHub branch/PR handoff link when work leaves the current pod.

## 9. Failure Classification

Failed, missing, stale, flaky, local-only, readiness-only, or blocked evidence
must remain failed, missing, stale, flaky, local-only, readiness-only, or
blocked. QA/Release must not reinterpret it as pass.

Classify failures by owner:

- Mobile App Dev for app implementation, selectors, UI behavior, navigation, or
  client integration defects.
- Backend/API Integrator for API contract, backend service, schema, migration,
  fixture, auth/session, or deployed API defects.
- Mobile Architect for route/state, runtime, dependency, EAS strategy, native
  boundary, or releaseability issues.
- Design for visual, state, accessibility, or handoff issues.
- Product/Planning for scope gaps, evidence requirement changes, human gates,
  non-goals, failed-gate risk, or risk acceptance.
- Human Owner for production submit and other human-gated decisions.
- External platform or ops owner for unavailable Railway, gcloud, Expo, EAS,
  Maestro, mobile-mcp, simulator, emulator, device, credential, or platform
  readiness.

`wm-gate-fix-advisor` may provide read-only failed-gate triage, but it does not
approve risk or replace the mandatory reviewer.

## 10. Release-Risk Summary

The release-risk summary must state:

- required evidence level and achieved evidence level;
- checks run, not run, blocked, failed, and deferred/non-goal;
- command output and exit status locations;
- reset record location;
- external platform actions actually performed versus readiness/status-only
  checks;
- RN Web, Railway, native, EAS, Maestro, mobile-mcp, device, store, and
  production proof limits;
- open blockers, owning role, and next action;
- human gates required, approved, rejected, deferred, or missing;
- reviewer evidence and residual risks.

Do not call a work unit release-ready when required evidence is missing, blocked,
or failed unless the appropriate human-gate decision explicitly records accepted
failed-gate risk. QA/Release cannot create that acceptance.

## 11. Human Gates

QA/Release must stop for recorded human decision when work involves:

- production submit;
- failed-gate risk;
- privacy/PII;
- legal/compliance;
- payment or money movement;
- external messaging;
- privileged access;
- business/budget ownership;
- irreversible scope tradeoff.

Machine-readable decisions use `human-gate/v1` and must include the required
decision fields and evidence links. A `failed-gate-risk` decision must include
`failed_check_reference`. A role, reviewer, pod, LLM, QA/Release agent, or
Gatekeeper cannot become the human approver.

## 12. Validation And Review Plan

Before validating a QA/Release workflow-doc change, inspect `package.json`
scripts and run only existing validators. Separate docs validation from live
QA, EAS, Railway, Maestro, mobile-mcp, native, or device execution checks.

Minimum docs-only validation after writing this workflow is:

```bash
git diff --check -- mobile-app-dev-team/runtime-sources/workflows/QA_Release_WORKFLOW.md
node scripts/validate-workflow-docs.mjs
node scripts/validate-runtime-sources.mjs
```

For runtime, validator, harness, or app changes, run the broader gates required
by `AGENTS.md` and the touched files. Do not run live external platform actions
as part of docs-only validation.

Final review for QA/Release workflow changes requires
`wm-implementation-reviewer`. Mobile Architect peer review is required when the
change defines or alters native, EAS, releaseability, route/state, runtime, or
dependency proof boundaries; otherwise it is strongly recommended.
Product/Planning review is required for scope, evidence, non-goal, and
human-gate boundary changes.

## 13. Done Criteria

QA/Release work is Done only when:

- accepted QA/Release scope is linked;
- required and achieved evidence levels are recorded;
- reset record exists or is explicitly not applicable;
- commands and exit statuses are recorded;
- evidence artifacts link canonical reachable evidence paths;
- failures are classified and routed to owners;
- release-risk summary states proof limits and residual risks;
- human-gate decisions exist where required;
- external-platform actions are accurately described as live or
  readiness/status-only;
- mandatory reviewer evidence exists;
- `git diff` and `git status --short` are ready for supervisor review.

Docs-only workflow PRs do not prove live Railway, gcloud, Expo, EAS, Maestro,
mobile-mcp, native/device, store, production, or OpenClaw pod behavior.

For docs-only workflow changes, project-bootstrap external platform readiness
blockers for Railway, gcloud, Expo auth, EAS auth, Maestro, mobile-mcp,
simulator, emulator, or device access are not relevant to docs-only validation
when no live action is performed. Future live QA or external-platform work still
requires those blockers and approvals to be resolved before execution.

## 14. Failure Loop

1. Failed check remains failed.
2. QA/Release records objective evidence, reset state, command output, exit
   status, release proof limit, and failure classification.
3. Read-only `wm-gate-fix-advisor` may help classify gate failures.
4. Product/Planning assigns the owning role for rework or human-gate routing.
5. The owning role fixes or decides within its boundary.
6. QA/Release reruns approved checks or records why rerun is blocked, deferred,
   or not applicable.
7. Rework cap, retry exhaustion, or failed-gate risk goes to Product/Planning
   and the required human owner.

QA/Release must not fix the defect, self-approve the risk, merge the PR,
publish externally, or mark a failed gate as passed.

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
