# Design Workflow

This is an agent-consumed Design workflow for WonderMove `new-mobile-app` role
agents. It is not the workspace-neutral `/workspace/WORKFLOW.md` and must not
be copied there as-is.

Use this file when a WonderMove Design role pod, repo-local Codex skill, or
reviewer needs the Design workflow mechanics for approved mobile design
handoff, Stitch gating, publication, review, evidence, and implementation
handoff. Workspace-common operating principles belong in `/workspace/WORKFLOW.md`;
WonderMove repo-local commands, paths, role gates, skills, publication paths,
and evidence contracts live here or in the repo-local skills and workflow
documents referenced by this file.

Agents that need the Design workflow must read this file at:

```text
mobile-app-dev-team/workflows/Design_WORKFLOW.md
```

## 0. Codex Skill And Path Resolution

Unless explicitly marked as pod-native, named workflow skills in this document
are repo-local Codex skills or adapters under `.agents/skills/<skill-name>/SKILL.md`
in the managed project repository. They are distinct from pod-native OpenClaw
runtime snapshots under `/workspace/skills/<slug>/SKILL.md`.

Relative repository paths in this document resolve from the managed project
repository root. In the standard pod runtime, that root is:

```text
/workspace/projects/Wondermove-Inc/new-mobile-app
```

Therefore `docs/plans/work-units/<work-unit-id>/01-design/` means:

```text
/workspace/projects/Wondermove-Inc/new-mobile-app/docs/plans/work-units/<work-unit-id>/01-design/
```

It does not mean `/workspace/docs/...`, `/workspace/skills/...`, another pod's
local filesystem, or a generic workspace path. Cross-pod handoff must use
committed GitHub branch/PR state or a merged repository artifact from this
managed project path.

When a repo-local Design skill or workflow document is relevant to the current
role, the repo-local skills and workflow documents must be followed when in
scope. Do not replace them with memory, generic mobile design advice, or a stale
runtime snapshot under `/workspace/skills`.

### 0.1 Cross-Pod Evidence And Local Path Boundaries

Follow `mobile-app-dev-team/workflows/Product_Planning_WORKFLOW.md` section
`0.1 Cross-Pod Evidence And Local Path Boundaries` for the common rule: one
agent's local `/workspace/...` path is not reviewer-accessible evidence for
another agent unless the artifact is reproducible or fetchable through an
accepted durable source.

Design-specific examples:

- Treat local Stitch screenshots, local HTML exports, MCP responses, and
  unpublished `/workspace/...` evidence as internal tracking until they are
  committed, attached to an accepted record, or linked from a durable artifact
  the receiver can access.
- Use `docs/plans/work-units/<work-unit-id>/01-design/` for durable Design
  stage records and `design-pub-html/<YYYY-MM-DD>/<work-unit-id>/` for the
  committed publication package after P1 approval.
- `01-design/handoff-index.md` must link the exact committed publication
  package. A chat summary, local evidence path, or unpushed draft is not enough
  for Mobile App Dev handoff.
- If a reviewer is asked to confirm Design wording or handoff readiness, state
  the exact PR, branch, commit, or committed repository path to inspect.

### 0.2 Codex Interactive Execution Guardrails

When Design work is routed through a Codex interactive PTY, follow the
repo-local or pod-native `codex-interactive-repo-work` execution contract in
addition to this workflow.

Before Codex launch:

1. Resolve the project-management source of truth when present: Tasks task,
   Jira issue, Confluence/wiki page, GitHub issue/PR, or committed work-unit
   artifact.
2. Record the Workboard card, wake guard, routing artifact, evidence path,
   allowed repo-local Design skills, required reviewer, and durable stage.
3. Confirm `codex-role-workflow/v1` has routed the role to Design, status is
   `ready`, the durable artifact stage is `01-design`, and no human gate blocks
   the requested docs or Design work.
4. Literally invoke `$wm` or `/wm` for repo-scoped work and keep the work inside
   the approved Design scope.

Design Codex execution must not self-approve, merge, bypass failed gates, expose
secrets, or claim external proof. Completion evidence must include changed
paths, validation output, required `design-reviewer` evidence, residual risks,
external proof limits, and `git status --short`.

## 0A. Standard Work Lifecycle

At Design work start, confirm the approved requirement or work-unit reference,
Design owner, target route or screen, scope, deadline or requested publication
date, expected output, non-goals, evidence path, and approval boundary.

Use this lifecycle for Design work:

```text
Intake -> Plan -> Gather evidence -> Produce -> Review -> Deliver -> Follow through
```

- Intake: receive an approved requirement, PRD slice, Story, or bounded work
  unit through Product/Planning or a deterministic `status.json` next action.
- Plan: choose the smallest Design artifact level, identify non-goals, confirm
  `DESIGN.md` decision, identify P0/P1 gates, and define evidence before live
  Stitch work.
- Gather evidence: read the approved requirement, current `DESIGN.md`, relevant
  work-unit records, existing Stitch context, implementation constraints, and
  human-gate flags.
- Produce: create only Design-owned artifacts and handoff records.
- Review: check scope alignment, P0/P1 state, exactly two options, five-state
  coverage, accessibility, publication completeness, and reviewer evidence.
- Deliver: hand off the committed Design package and review result to
  Product/Planning and Mobile App Dev.
- Follow through: keep blockers, open decisions, and next responsible role
  current in the durable work-unit records.

Design notes, reviews, and status reports must separate facts, assumptions,
decisions, blockers, and next actions. Facts cite source material. Assumptions
are explicitly labeled and must not be treated as accepted scope.

## 0B. Systems Of Record

Use the narrowest durable system of record for each kind of Design work:

- Tasks for agent-executable work packages and local project tracking when the
  Tasks system is available.
- Jira/tasks for organization-level backlog, Epic/Story/Task ownership,
  assignment, and cross-team delivery status when explicitly in scope.
- Confluence/wiki for published design procedures, product specs, reference
  pages, and human-readable durable decisions when explicitly in scope.
- GitHub/repository for repo-local Design workflow docs, durable work-unit
  artifacts, `design-pub-html` publication packages, branch/PR handoff, command
  output summaries, and reviewer evidence links.
- Workspace files for local operating context, temporary investigation notes,
  and non-durable drafts. Workspace files are not final Design SoT unless
  committed or linked back to the accepted durable location.
- Workboard for execution-state tracking, wake/follow-through state, blockers,
  and completion proof. Workboard does not replace Tasks, Jira,
  Confluence/wiki, GitHub/repository, or durable work-unit SoT.

Do not duplicate long Design content across systems. Link Tasks, Jira,
Confluence/wiki, GitHub PRs, Workboard cards, publication packages, and
work-unit artifacts instead.

## 0C. Reporting, Review, And Approval

Design status reports must state:

- done;
- in progress;
- blocked;
- risks;
- next action.

Product/Planning P0/P1 approval is scope/evidence approval for PRD fit,
non-goals, evidence readiness, human-gate routing, and scope alignment. It is
not Design quality approval, selected option approval, Stitch authorship
approval, or HTML implementation approval.

`design-reviewer` review is required before Mobile App Dev implementation starts
from a Design handoff. Reviewer evidence must include reviewer identity,
reviewed scope/path, verdict, findings, checks reviewed, residual risks, and
next action. Reviews do not replace Product/Planning P0/P1 approvals, human
approval, deterministic gates, merge approval, or release/production approval.

## 0D. Safety And Approval Boundaries

Secret safety is mandatory. Do not print, persist, or transmit auth tokens,
credentials, private `.env` values, Google ADC JSON, service account JSON,
signing keys, bearer tokens, private endpoints, or secret-bearing config
contents in prompts, logs, transcripts, reports, files, or evidence.

Do not perform destructive, production, financial, legal, security-sensitive, or
externally visible actions without the required approval. Design must stop and
route through Product/Planning and the human owner when work involves production
submit, payment, privacy/PII, external messaging, legal/compliance,
business/budget owner decisions, irreversible scope tradeoffs, privileged
access, or failed-gate risk acceptance.

Local documentation validation does not prove live Stitch, Google ADC, Railway,
Expo, EAS, GitHub branch protection, production, or other external platform
readiness.

## 0E. Role-Centered Operation Check

Before publishing, handing off, or reporting from this workflow, check that the
document and current action are role-centered:

- exact runtime role: Design;
- reports-to role: Product/Planning for delivery coordination;
- escalation owner: Design for design quality, Product/Planning for scope or
  evidence mismatch, and Human Owner for human-gated decisions;
- owns: UX quality, interaction, visual hierarchy, design options, state
  coverage, accessibility notes, and Design handoff quality;
- must not own: Product scope, app implementation, backend/API contracts,
  migrations, QA flows, release operations, production approval, failed-gate
  risk acceptance, or external platform readiness claims;
- handoff targets: Product/Planning for gate/status coordination, Mobile
  Architect when route/state or feasibility risk exists, Mobile App Dev for
  implementation handoff after Design review, and QA/Release for evidence
  planning when needed;
- human-gate boundary: stop for the required human owner through
  Product/Planning when human-gated decisions are in scope;
- deterministic Gatekeeper is a system role: it reports required check status
  only and cannot approve risk, own Design quality, replace review, or replace
  human approval.

## 1. Design Intake And Scope

1. Design receives an approved requirement, PRD slice, Story, or bounded work
   unit through Product/Planning, or a deterministic `status.json` next action
   assigning the `01-design` stage.
2. Confirm Design relevance. Design is relevant when layout, interaction, or
   visual hierarchy is introduced or changed. If uncertain, route to Design.
3. Confirm inputs: target route, platform, user goal, known backend/API
   dependency, non-goals, human-gate flags, implementation constraints,
   requested publication date, and expected evidence path.
4. Confirm `DESIGN.md` as the design-system source of truth and record one
   decision: `KEEP_EXISTING_DESIGN_MD`, `UPDATE_DESIGN_MD_REQUIRED`, or
   `BLOCKED_BY_DESIGN_SYSTEM_DECISION`.
5. If `UPDATE_DESIGN_MD_REQUIRED` or `BLOCKED_BY_DESIGN_SYSTEM_DECISION`
   applies, stop Stitch generation until the design-system decision is resolved
   and reviewed.
6. Keep the Design body short and role-specific. Product/Planning intake,
   completeness review, and task-packet mechanics remain in
   `Product_Planning_WORKFLOW.md`.

## 2. Design Non-Goals And Must-Not-Own

Design must not:

- implement mobile UI, backend APIs, migrations, test flows, QA automation, or
  release operations;
- invent or change Product scope, PRD acceptance criteria, non-goals, API
  contracts, bundle IDs, API URLs, customer app names, tokens, or credentials;
- use non-Stitch design authoring tools as canonical output;
- approve implementation from text-only or ASCII design when layout,
  interaction, or visual hierarchy is unresolved;
- ask Product/Planning to own Design quality or selected-option quality;
- treat Workboard, chat, local workspace files, or room summaries as durable
  replacement for GitHub/repository, Tasks, Jira, Confluence/wiki, or work-unit
  artifacts;
- claim local validation proves live Stitch, Google ADC, Railway, Expo, EAS,
  GitHub branch protection, production, or external platform readiness.

## 3. P0 Gate Before Stitch Generation

P0 is required before live Stitch generation/export for approved Design work.
Before P0, Design may prepare scope, evidence, prompts, and packets, but must
not run live Stitch generation.

The P0 packet must include:

- approved requirement or work-unit reference;
- artifact purpose and reason;
- exactly two proposed design directions;
- non-goals;
- expected evidence paths;
- requested publication date;
- `DESIGN.md` decision;
- human-gate matrix;
- external proof boundary.

Valid P0 outcomes use Product/Planning readiness language:
`READY_FOR_EXECUTION`, `NEEDS_REWORK`, `HUMAN_DECISION_REQUIRED`, or
`BLOCKED_BY_RUNTIME_CAPABILITY`.

Product/Planning P0 approval authorizes scoped Stitch generation only. It does
not approve Design quality, selected option quality, HTML extraction,
publication, Mobile App Dev implementation, production, or external platform
readiness.

## 4. Stitch Readiness And Two Options

Stitch readiness before approved live work is status-only. It may report whether
the configured Stitch MCP, pinned repo config, and Google ADC readiness appear
usable, but it does not authorize bypassing P0/P1 gates and does not prove live
Stitch behavior from local documentation validation.

After P0 approval and only within approved scope:

1. Explain the Stitch execution order before running Stitch.
2. Use current `DESIGN.md` and the selected Stitch project or approved fork.
3. Enhance the prompt with platform, screen structure, information hierarchy,
   interactions, five states, non-goals, and UI/UX terminology. Keep design
   tokens in `DESIGN.md` instead of duplicating theme values in prompts.
4. Produce exactly two Stitch directions: Option A and Option B. Do not stop at
   one option and do not create a third option without a new approved
   requirement.
5. Each option must cover all approved screens and default, loading, empty,
   error, and permission-denied states.
6. Before P1, fetch or save visual/image evidence only. Do not call, fetch,
   persist, or publish HTML extraction through `fetch_screen_code`, official ZIP
   `code.html`, SDK `getHtml`, `htmlCode.downloadUrl`, or equivalent metadata
   that stores HTML download paths.

## 5. P1 Gate Before HTML Extraction And Publication

P1 is required after generated visuals and before HTML extraction or
publication.

The P1 packet must include:

- actual image/design artifact summary;
- artifact purpose and reason;
- PRD acceptance mapping;
- option comparison;
- Design-selected candidate and rationale;
- alternate rejection or defer reason;
- risks and open decisions;
- human-gate matrix;
- external proof boundary.

P1 approval must be `READY_FOR_EXECUTION` before HTML extraction starts. If P1
returns `NEEDS_REWORK`, `HUMAN_DECISION_REQUIRED`, or
`BLOCKED_BY_RUNTIME_CAPABILITY`, do not extract HTML.

After P1 approval only, extract both Stitch options as HTML using official ZIP
`code.html` or Stitch MCP `fetch_screen_code`, and extract both option images
through Stitch MCP `fetch_screen_image` when MCP is available.

## 6. Publication And Durable Handoff

Design owns the durable stage:

```text
docs/plans/work-units/<work-unit-id>/01-design/
```

Managed Design outputs:

```text
docs/plans/work-units/<work-unit-id>/01-design/
  design-decision.md
  p0-packet.md
  p1-packet.md
  option-comparison.md
  state-matrix.md
  ux-acceptance.md
  handoff-index.md
  reviewer.md
```

After P1 approval, publication artifacts live under:

```text
design-pub-html/<YYYY-MM-DD>/<work-unit-id>/
  option-a.html
  option-a.png
  option-b.html
  option-b.png
  manifest.json
  handoff.md
```

The publication package must record requested date, actual generation timestamp,
Stitch project id or share link when available, source inputs, screen ids,
selected option, artifact filenames, and P0/P1 decision artifact paths. It must
also record the best-effort request for Gemini 3.1 Pro, Pro, or Thinking mode,
the exposed Stitch model/mode selection capability, the actual returned
model/mode when available, any limitation when selection or return metadata is
unavailable, and design-system continuity fields.

Required design-system continuity fields:

- `design_system_baseline`;
- `design_md_source_path_or_url`;
- `design_md_hash_or_version`;
- `stitch_project_id_or_share_link`;
- `extends_existing_project`;
- `fork_reason`;
- `drift_check_result`;
- `design_reviewer_verdict_path`.

`01-design/handoff-index.md` must link the exact committed
`design-pub-html/<YYYY-MM-DD>/<work-unit-id>/` package.

## 7. Handoff Quality Bar

A Design handoff is not ready for Mobile App Dev until it includes:

- P0 decision before Stitch generation;
- exactly two Stitch options;
- five-state coverage for default, loading, empty, error, and
  permission-denied states;
- P1 decision before HTML extraction;
- Option A and Option B HTML and image artifacts after P1;
- option comparison and Design-selected candidate rationale;
- screen inventory and route impact;
- accessibility notes;
- implementation constraints for Expo Router, React Native primitives,
  NativeWind, semantic tokens, and stable `testID` values;
- backend/API dependency status in the Design package and
  `01-design/handoff-index.md`, including whether the design depends on
  API-backed data, auth/session behavior, error states, or permission-denied
  states; whether API contract status is known, unknown, not-applicable, or
  blocked; the Backend/API Integrator handoff target when uncertainty exists;
  and the relevant `03-contract-api` artifact pointer when applicable. Design
  records dependency and routing status only and must not define or change API
  contracts;
- UX acceptance criteria and measurable acceptance signals;
- open decisions and next responsible role;
- `design-reviewer` evidence.

Stitch HTML may use shadcn-compatible semantics when useful for the artifact.
React Native implementation handoff must remain NativeWind, React Native
primitives, semantic tokens, and stable selector oriented.

## 8. Review, Validation, And Reporting

Before reporting Design work ready:

1. Run applicable local validators for the changed documentation or artifacts.
2. Inspect `git diff` for the changed paths.
3. Request `design-reviewer` read-only review for Design workflow or handoff
   readiness.
4. Record validation output, reviewer evidence path, reviewer verdict, residual
   risks, external proof limits, and `git status --short`.
5. Report the result to Product/Planning with done, in progress, blocked, risks,
   and next action.

For Design workflow-document changes, the minimum local checks are:

```text
git diff --check -- mobile-app-dev-team/workflows/Design_WORKFLOW.md
node scripts/validate-workflow-docs.mjs
node scripts/validate-runtime-sources.mjs
```

These checks validate local documentation structure and runtime-source
consistency only. They do not prove live Stitch, Google ADC, Railway, Expo, EAS,
GitHub branch protection, production, or external platform readiness.

## 9. Failure And Stop Conditions

Design must stop and report blocked when:

- the accepted requirement or work-unit handoff is missing;
- `DESIGN.md` decision is missing or blocks generation;
- P0 approval is missing before Stitch generation;
- live Stitch readiness is missing for approved live Stitch work;
- exactly two options cannot be produced inside approved scope;
- default, loading, empty, error, or permission-denied state coverage is
  missing;
- P1 approval is missing before HTML extraction;
- HTML extraction metadata exists before P1;
- `design-reviewer` evidence is missing before Mobile App Dev handoff;
- secrets or credential values would be printed or persisted;
- Product/Planning is being asked to own Design quality;
- external proof is being requested from local evidence.

Failed checks remain failed. Do not reinterpret missing, local-only, flaky, or
failed evidence as pass. Route scope/evidence blockers to Product/Planning,
Design quality blockers to Design, implementation blockers to Mobile App Dev,
QA/release evidence blockers to QA/Release, and human-gated decisions to the
Human Owner through Product/Planning.
