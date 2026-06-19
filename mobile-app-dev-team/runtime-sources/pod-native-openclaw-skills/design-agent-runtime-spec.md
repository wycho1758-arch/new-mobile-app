# Design Agent Runtime Specification

Date: 2026-06-15

This document specifies how an OpenClaw/Codex agent that has
`mobile-app-dev-team/runtime-sources/role-souls/design-soul.md` must set itself up and
operate after reading `mobile-app-dev-team/runtime-sources/pod-native-openclaw-skills/README.md`.

The scope is Design only.

## Purpose

The goal is to let a Design role agent move from its SOUL identity to the
correct pod-native setup path, repo-local Design workflow skills, reviewers,
durable artifacts, Stitch gates, and stop conditions without guessing.

This document is not a new skill. It is an operating specification and
SoT-grounded risk report for the current configuration.

## Runtime Surface Model

```text
repo source of pod-native skills
  mobile-app-dev-team/runtime-sources/pod-native-openclaw-skills/<slug>/SKILL.md
        |
        | openclaw-pod-skills-sync
        v
pod runtime snapshot
  /workspace/skills/<slug>/SKILL.md

repo-local Codex runtime
  .agents/skills/<skill-name>/SKILL.md
  .codex/agents/<agent-name>.toml
```

Rules:

- Pod-native OpenClaw skills use `/workspace/skills/<slug>/SKILL.md` at runtime.
- Their source of truth is under
  `mobile-app-dev-team/runtime-sources/pod-native-openclaw-skills/<slug>/`.
- Repo-local Codex skills must remain under `.agents/skills/`.
- Repo-local Codex custom agents must remain under `.codex/agents/`.
- Do not put repo-local Codex skill or custom-agent artifacts in the pod-native
  skill tree.

## Design Identity

The Design role has names that must not be confused:

| Layer | Value |
| --- | --- |
| Display Title | Product Designer |
| Operating Role | Design |
| Canonical pod/runtime slug | design |

The canonical slug used for workflow routing is:

```text
design
```

The agent must not write display titles or operating-role labels such as
`Product Designer` or `Design` to pod runtime role identity surfaces when a
canonical slug is required.

## Role Identity Surfaces

The current pod setup contract recognizes these role identity surfaces:

```text
WM_ROLE
WM_EXPECTED_ROLE
/workspace/IDENTITY
```

Required Design setup command:

```bash
role_slug="design"
PROJECT_BOOTSTRAP_ROLE_SLUG="${role_slug}" \
PROJECT_BOOTSTRAP_ROLE_SOUL_PATH="/workspace/SOUL.md" \
bash /workspace/skills/project-bootstrap/scripts/project-bootstrap-agent-setup.sh
source /workspace/state/project-bootstrap-role.env
```

The agent must pass the exact canonical slug as `PROJECT_BOOTSTRAP_ROLE_SLUG`.
`project-bootstrap-agent-setup.sh` validates the selected slug and writes
`WM_ROLE`, `WM_EXPECTED_ROLE`, and `/workspace/IDENTITY`. The agent must not
write those identity surfaces directly as a substitute for the setup script.

Operational meaning:

- `WM_ROLE` is the primary environment role identity after the generated
  `/workspace/state/project-bootstrap-role.env` file is sourced.
- `/workspace/IDENTITY` is a file fallback and cross-process persisted identity
  written by the setup script.
- `WM_EXPECTED_ROLE` is a guardrail written by the setup script and must match
  the resolved role when set.

This is intentionally redundant. The redundancy prevents a pod, wrapper,
bootstrap script, or resumed process from silently running with the wrong role.
If multiple surfaces are configured, they must resolve to the same canonical
slug.

If `WM_ROLE`, `/workspace/IDENTITY`, the pod SOUL, or `WM_EXPECTED_ROLE` point to
different canonical roles, the agent must report `blocked` with a role mismatch
reason and must not invoke repo-local Design skills.

## Normal Setup Flow

The normal user-facing setup path is:

```text
git clone or git pull
        |
        v
openclaw-pod-skills-sync
        |
        v
project-bootstrap
        |
        +-- verifies required pod skills
        +-- runs/uses status-only readiness checks
        +-- performs agent-owned non-secret setup
        +-- reports remaining human/platform blockers
        |
        v
codex-role-workflow
        |
        v
repo-local Design workflow skill
```

Important distinction:

- `openclaw-pod-skills-sync` is the normal sync step after clone or pull.
- `project-bootstrap` is the normal project readiness entry point.
- `codex-cli-auth-setup`, `pod-role-bootstrap`, `stitch-adc-setup`, and
  `codex-role-workflow` are required Design pod-native skills.
- `stitch-adc-setup` verifies Google ADC and Stitch MCP readiness as status only
  before approved Stitch work. It does not authorize Design to skip P0/P1 gates.

## Managed Repo SoT Path Resolution

When a pod-native skill runs from `/workspace/skills/<slug>/SKILL.md`, it is
outside the managed project repository. The agent must not resolve repo SoT paths
relative to `/workspace/skills`.

Resolve SoT from the managed project repository root. In the standard pod
runtime, that root is:

```text
/workspace/projects/Wondermove-Inc/new-mobile-app
```

If `mobile-app-dev-team/workflows/entry-case-routing.md`, root `DESIGN.md`, or the
approved work-unit artifacts cannot be read from the managed project repository
root, return `blocked` with a source-backed reason instead of inferring from a
stale runtime snapshot.

## Required Design Pod-Native Skills

Design requires these pod-native skills after the common sync prerequisite:

| Pod-native skill | Runtime shape | Purpose |
| --- | --- | --- |
| `codex-cli-auth-setup` | `/workspace/skills/codex-cli-auth-setup/SKILL.md` | Verify Codex CLI readiness without exposing secrets. |
| `pod-role-bootstrap` | `/workspace/skills/pod-role-bootstrap/SKILL.md` | Resolve role identity, align repo tooling, run pod preflight, and write a redacted readiness report. |
| `stitch-adc-setup` | `/workspace/skills/stitch-adc-setup/SKILL.md` | Verify Google ADC and Stitch MCP readiness as status only. |
| `codex-role-workflow` | `/workspace/skills/codex-role-workflow/SKILL.md` | Resolve the bootstrapped role to allowed repo-local skills, reviewers, durable stage, stop conditions, and next action. |

## Design Repo-Local Workflow Skills

Once setup and role routing are ready, Design uses these repo-local Codex skills:

| Entry condition | Repo-local skill | Result |
| --- | --- | --- |
| Approved requirement needs layout, interaction, or visual hierarchy | `design-mobile-design-handoff` | Stitch-backed mobile implementation handoff. |
| Stitch MCP will be used or Stitch handoff rules must be applied | `design-stitch-mcp-operating-rules` | Stitch execution, P0/P1, publication, and handoff constraints. |

Supporting review and research:

| Need | Agent |
| --- | --- |
| Handoff quality, P0/P1, five-state coverage, accessibility, publication readiness | `design-reviewer` |
| Design, Stitch, or `DESIGN.md` uncertainty | `design-researcher` |

Reviewer and researcher constraints:

- They are read-only.
- They must cite sources.
- They must not recursively delegate.
- They do not approve Product/Planning P0/P1 gates.
- They do not author Stitch output or implement app code.

## Design System SoT

Root `DESIGN.md` is the design system Source of Truth for the mobile app
template.

Current SoT facts:

- Google Stitch is the sole canonical design authoring tool.
- All design work originates from Stitch export, ZIP `code.html`, or Stitch MCP
  fetch.
- `DESIGN.md` and `apps/mobile/global.css` token values are a single source of
  truth and must be updated together in the same PR when design tokens change.
- The template uses neutral default semantic tokens; customer brand values must
  not be hardcoded.
- Publication artifacts use `design-pub-html/<YYYY-MM-DD>/`, and durable work
  units refine this to `design-pub-html/<YYYY-MM-DD>/<work-unit-id>/`.

Design must confirm one `DESIGN.md` decision before Stitch generation:

- `KEEP_EXISTING_DESIGN_MD`;
- `UPDATE_DESIGN_MD_REQUIRED`;
- `BLOCKED_BY_DESIGN_SYSTEM_DECISION`.

If `UPDATE_DESIGN_MD_REQUIRED` or `BLOCKED_BY_DESIGN_SYSTEM_DECISION` applies,
Stitch generation is blocked until the design-system decision is resolved and
reviewed.

## Design Role Capability

Design can:

- reframe approved requirements into user goal, task flow, information
  architecture, hierarchy, interaction model, accessibility, and measurable UX
  acceptance;
- prepare P0 and P1 Product/Planning scope/evidence packets;
- produce exactly two Stitch options;
- cover default, loading, empty, error, and permission-denied states;
- select a Design-quality candidate;
- publish approved Option A/B HTML, images, `manifest.json`, and `handoff.md`;
- hand off NativeWind, React Native primitives, semantic tokens, stable `testID`,
  and implementation constraints to Mobile App Dev.

Design must not:

- implement app code, backend APIs, migrations, QA flows, or release operations;
- run Stitch generation before Product/Planning P0 approval;
- fetch or publish HTML before Product/Planning P1 approval;
- ask Product/Planning to own Design quality;
- use non-Stitch design authoring as canonical output;
- add scope or decorative work outside approved acceptance criteria;
- expose tokens, API keys, Google credentials, `.env` values, or credential file
  contents.

## P0 And P1 Gate Contract

P0 is required before Stitch generation.

The P0 packet must include:

- approved requirement or work-unit reference;
- artifact purpose and reason;
- exactly two proposed design directions;
- non-goals;
- expected evidence paths;
- requested publication date;
- `DESIGN.md` decision;
- human-gate matrix.

P0 Product/Planning approval is scope/evidence approval only. It is not Design
quality approval.

P1 is required before HTML extraction or publication.

The P1 packet must include:

- actual generated visual artifact summary;
- PRD acceptance mapping;
- option comparison;
- Design-selected candidate and rationale;
- alternate rejection or defer reason;
- risk and open decision list;
- human-gate matrix.

Before P1 approval, do not call or persist HTML extraction through
`fetch_screen_code`, official ZIP `code.html`, SDK `getHtml`,
`htmlCode.downloadUrl`, or equivalent metadata that stores HTML download paths.

After P1 approval only, Design may extract both options as HTML and images, then
publish the handoff package.

## Durable Work-Unit Artifact Contract

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

Publication artifacts remain under:

```text
design-pub-html/<YYYY-MM-DD>/<work-unit-id>/
  option-a.html
  option-a.png
  option-b.html
  option-b.png
  manifest.json
  handoff.md
```

`01-design/handoff-index.md` must link the exact committed publication package.
For UI work, Mobile App Dev must not start implementation until P0, exactly two
Stitch options, P1, publication artifacts, and `design-reviewer` evidence exist.

## Runtime Status And Output Contract

Design routing status uses the `codex-role-workflow/v1` contract.

Use exactly one of:

```text
status: ready | blocked | not_applicable
```

Required fields:

- `resolved_role`;
- `role_identity_source`;
- `entry_case`;
- `routing_reason`;
- `process_sot`;
- `allowed_repo_local_codex_skills`;
- `required_reviewers`;
- `durable_artifact_stage`;
- `readiness_state_or_required_gate`;
- `blocked_reason` when status is `blocked`;
- `not_applicable_reason` when status is `not_applicable`;
- `human_gate_or_external_proof_blocker`;
- `next_action`;
- `secret_safety_statement`;
- `external_proof_boundary`.

## Current-Configuration Risk Report

If this Design configuration is applied as-is, these are the expected blockers
and failure modes:

| Condition | Required behavior |
| --- | --- |
| Missing accepted requirement or work-unit handoff | missing accepted requirement blocks Design work. |
| Missing or unresolved `DESIGN.md` decision | Block Stitch generation. |
| Unapproved design-system drift between `DESIGN.md` and `apps/mobile/global.css` | Block handoff until reviewed. |
| Missing P0 approval | missing P0 blocks Stitch generation. |
| Missing Stitch ADC or Stitch MCP readiness | missing Stitch ADC or Stitch MCP readiness blocks tool execution. |
| Fewer or more than exactly two Stitch options | Block handoff; Design must provide exactly two Stitch options. |
| Missing default, loading, empty, error, and permission-denied states | Block handoff until five-state coverage exists. |
| Missing P1 approval | missing P1 blocks HTML extraction and publication. |
| HTML extraction metadata exists before P1 | Treat as a gate violation requiring review. |
| Missing Design reviewer evidence | missing Design reviewer evidence blocks Mobile App Dev implementation handoff. |
| Request for external proof from local validation | Block or report boundary; Local validation does not prove live Stitch, Google ADC, OpenClaw pod execution, GitHub branch protection, or external platform behavior. |

## Stop Conditions

The Design agent must stop when:

- role identity is missing or mismatched;
- required pod-native skills are missing;
- accepted Product/Planning requirement or work-unit handoff is missing;
- `DESIGN.md` decision is missing or blocks generation;
- P0 approval is missing before Stitch generation;
- Stitch ADC or Stitch MCP status is not ready for approved Stitch work;
- exactly two design options cannot be produced inside approved scope;
- five-state coverage is incomplete;
- P1 approval is missing before HTML extraction;
- secrets or credential values would be printed;
- Product/Planning is being asked to own Design quality;
- Mobile App Dev is being asked to implement without Design reviewer evidence;
- external proof is being requested from local evidence.

## Minimal Design Runtime Output

When routing Design work, the agent should produce a compact status record with:

```text
schema: codex-role-workflow/v1
resolved_role: Design
role_identity_source: WM_ROLE | /workspace/IDENTITY | pod SOUL
canonical_slug: design
entry_case: design_relevance
routing_reason: <source-backed reason>
process_sot:
  - DESIGN.md
  - mobile-app-dev-team/workflows/entry-case-routing.md
  - mobile-app-dev-team/workflows/Product_Planning_WORKFLOW.md
  - mobile-app-dev-team/governance/gates-and-evidence.md
  - mobile-app-dev-team/workflows/github-artifact-workflow.md
allowed_repo_local_codex_skills:
  - design-mobile-design-handoff
  - design-stitch-mcp-operating-rules
required_reviewers:
  - design-reviewer
durable_artifact_stage: 01-design
readiness_state_or_required_gate: <P0, P1, DESIGN.md decision, or Stitch readiness state>
blocked_reason: <required when status is blocked>
not_applicable_reason: <required when status is not_applicable>
human_gate_or_external_proof_blocker: <gate or external proof blocker, or none>
next_action: <bounded next step>
secret_safety_statement: secrets were not printed or persisted
external_proof_boundary: local evidence does not prove live Stitch or external platforms
```

## Other Role Runtime Reports

This Design report is the second one-document checkpoint after Product/Planning
received reviewer GO. It is one document in the role-by-role report sequence.
Do not create Mobile Architect, Mobile App Dev,
Backend/API Integrator, or QA/Release runtime reports until this Design report
has passed validation and received reviewer GO.

Each later report must cite the relevant role SOUL, pod-native skill matrix,
`codex-role-workflow`, work-process and gate SoT, role-specific repo-local
skills, required reviewers, durable artifact stage, evidence requirements, stop
conditions, external proof boundary, and any problem found under the current
configuration.

Do not treat the future role reports as pod-native skills unless a later SoT
explicitly creates a `/workspace/skills/<slug>/SKILL.md` runtime shape for them.
They are analysis/report documents unless separately promoted through an
approved skill-creation workflow.

## Reviewer Status

The plan for this Design runtime specification was reviewed by `design-reviewer`
and returned GO after adding the Product/Planning final GO evidence path, root
`DESIGN.md` as SoT, checkpoint evidence paths, explicit `pnpm turbo run lint
test`, and the durable publication refinement
`design-pub-html/<YYYY-MM-DD>/<work-unit-id>/`.
