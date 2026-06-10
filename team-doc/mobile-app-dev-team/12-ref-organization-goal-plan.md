# Reference Organization Goal Plan

## Goal

Create a reusable reference-organization documentation layer for future teams under:

```text
team-doc/mobile-app-dev-team/ref-organization/
```

The layer must explain how to design a similar or different agent organization from verified project sources, using this current WonderMove mobile project as the concrete reference: OpenClaw clawpod role agents collaborate from isolated pods, use durable GitHub artifacts for handoff, and may use Codex plus computer-use/tool surfaces within their runtime boundaries.

This plan does not migrate content yet. It defines the goal, target structure, checkpoint sequence, reviewer gates, evidence requirements, and validation path for the later migration.

## Current Scope

Owner role: Product/Planning for documentation planning and migration readiness.

Primary affected paths:

- `team-doc/mobile-app-dev-team/12-ref-organization-goal-plan.md`
- Future target root: `team-doc/mobile-app-dev-team/ref-organization/`
- Future index updates:
  - `team-doc/mobile-app-dev-team/README.md`
  - `team-doc/mobile-app-dev-team/99-source-map.md`
  - `scripts/validate-team-doc.mjs` if validators are needed for the new structure

Out of scope for this plan:

- No app, backend, mobile runtime, or API contract changes.
- No changes under `team-doc/10-structured/` during the planning step.
- No external OpenClaw platform/runtime repository changes.
- No new `.agents/skills`, `.codex/agents`, or `.codex/hooks` artifacts unless a later approved implementation checkpoint explicitly requires them.
- No Gatekeeper SOUL.md.

## Source Of Truth Inputs

Use these verified sources for material decisions:

| Source | Use |
| --- | --- |
| `AGENTS.md` | Repo rules, OpenClaw/Codex path separation, TDD, PR gates, no external runtime edits. |
| `PROJECT_ENVIRONMENT.md` | Current runtime facts, Codex runtime paths, active plugins/MCPs, local harness limits. |
| `.agents/skills/wm/SKILL.md` | `$wm` planning, reviewer evidence, SoT-grounded execution, validation requirements. |
| `team-doc/mobile-app-dev-team/README.md` | Current managed docs vs historical/reference docs, current operating principles. |
| `team-doc/mobile-app-dev-team/00-sot-and-principles.md` | SoT priority and document management rules. |
| `team-doc/mobile-app-dev-team/01-team-composition.md` | Six LLM roles plus non-LLM deterministic Gatekeeper model. |
| `team-doc/mobile-app-dev-team/03-role-capability-matrix.md` | Role capability and handoff boundaries. |
| `team-doc/mobile-app-dev-team/04-skills-and-agents-matrix.md` | Active repo-local skills, read-only reviewer/researcher agents, legacy distinction. |
| `team-doc/mobile-app-dev-team/05-work-processes.md` | Current intake, design/API readiness, implementation, QA, and failure loop. |
| `team-doc/mobile-app-dev-team/06-gates-and-evidence.md` | Required gates, evidence rules, durable handoff, human gates. |
| `team-doc/mobile-app-dev-team/07-new-team-template-guide.md` | Existing new-team creation skeleton and validator-first expectation. |
| `team-doc/mobile-app-dev-team/09-pod-native-openclaw-skill-plan.md` | `/workspace/skills/<slug>/SKILL.md` pod-native OpenClaw skill boundary. |
| `team-doc/mobile-app-dev-team/10-github-artifact-workflow.md` | Pod-isolated GitHub branch/commit/PR work-unit handoff model. |
| `team-doc/mobile-app-dev-team/11-openclaw-codex-completion-hooks-plan.md` | `/workspace/codex-hooks` boundary and per-pod evidence limits. |
| `team-doc/mobile-app-dev-team/99-source-map.md` | Current/historical source crosswalk. |
| `team-doc/10-structured/**` | Historical structured reference material to be migrated or rewritten later. |

## Target Structure

Future target:

```text
team-doc/mobile-app-dev-team/ref-organization/
  README.md
  00-orientation-and-sot/
    purpose.md
    sot-priority.md
    current-project-vs-template.md
  01-organization-model/
    team-shape.md
    role-boundaries.md
    gatekeeper-model.md
  02-runtime-surfaces/
    repo-local-codex-runtime.md
    pod-native-openclaw-skills.md
    pod-codex-completion-hooks.md
    computer-use-and-tool-surfaces.md
  03-role-contracts-and-capabilities/
    role-soul-template.md
    role-capability-matrix.md
    handoff-responsibilities.md
  04-workflows-and-handoffs/
    lifecycle-workflow.md
    durable-github-work-unit.md
    scenario-overlays-a-h.md
    failure-loop.md
  05-skills-agents-and-tools/
    active-skill-agent-policy.md
    skill-placement-policy.md
    reviewer-researcher-boundaries.md
    optional-tool-adoption.md
  06-gates-evidence-and-audit/
    required-gates.md
    evidence-rules.md
    human-gates.md
    audit-index.md
  07-repo-template-and-runtime/
    repo-target-tree.md
    mobile-runtime.md
    optional-api.md
    ci-eas-railway.md
  08-new-organization-template/
    create-new-team-guide.md
    variable-map.md
    checklist.md
  99-source-map-and-migration/
    source-priority.md
    old-to-new-crosswalk.md
    historical-vs-active.md
```

## Non-Negotiable Design Rules

- Every page in `ref-organization/` must state whether it is:
  - reusable template guidance,
  - current-project example,
  - historical source migration, or
  - active current SoT mirror.
- `team-doc/mobile-app-dev-team/` remains the current managed docs root.
- `team-doc/10-structured/` remains historical/reference material until a migration checkpoint rewrites or archives it.
- Runtime surfaces must stay separate:
  - repo-local Codex: `.agents/skills`, `.codex/agents`, `.codex/hooks`, `.codex/config.toml`
  - pod-native OpenClaw skills: `/workspace/skills/<slug>/SKILL.md`
  - pod Codex completion hooks: `/workspace/codex-hooks`
  - durable role handoff: GitHub branch/commit/PR plus `docs/plans/work-units/<work-unit-id>/`
  - computer-use/tool surfaces: documented as capability surfaces, not as repo-local Codex artifacts unless a SoT says so
- A-H scenarios are overlays, not the primary navigation.
- Reviewer/researcher agents remain read-only, source-cited, and non-recursive.
- Gatekeeper is a non-LLM deterministic required-check concept, not a SOUL.md owner or custom agent.
- Validation and migration must be validator-first when the future implementation creates or rewrites the structure.

## Checkpoint Plan

### Checkpoint 0. Goal And Plan Approval

Purpose:

- Approve this goal plan before creating `ref-organization/`.

Work:

- Write this plan file.
- Run read-only Reviewer(xhigh) against this plan.
- Report findings and plan path to the user.

Reviewer:

- `po-planning-reviewer` or equivalent read-only Reviewer(xhigh).

Evidence:

- Plan file: `team-doc/mobile-app-dev-team/12-ref-organization-goal-plan.md`
- Reviewer result: `.evidence/reviews/ref-organization-goal-plan-xhigh-<YYYYMMDD>.md` or sub-agent completion record if the headless helper is unavailable.

Exit criteria:

- Reviewer reports no Critical findings.
- Any High findings are either fixed in the plan or explicitly carried as blocking preconditions for Checkpoint 1.

### Checkpoint 1. Migration Crosswalk And Validator Plan

Purpose:

- Freeze exactly how existing `team-doc/10-structured/**` material will be handled.
- Create only the minimum directory path needed for the crosswalk draft if `ref-organization/` does not exist yet. The full section skeleton remains Checkpoint 2 scope.

Work:

- Create `ref-organization/99-source-map-and-migration/` if needed.
- Draft `ref-organization/99-source-map-and-migration/old-to-new-crosswalk.md`.
- Mark every existing `team-doc/10-structured` file as one of:
  - `move`
  - `rewrite`
  - `archive-as-scenario`
  - `current-project-example`
  - `drop-with-reason`
- Draft validator requirements before writing the full migrated docs.

Reviewer:

- Read-only Reviewer(xhigh), focused on source-map correctness and stale-current-SoT risk.

Evidence:

- Crosswalk draft path.
- Validator requirement notes.
- Reviewer evidence under `.evidence/reviews/`.

Exit criteria:

- Every old file has a target or explicit drop reason.
- Reviewer confirms no current SoT is being downgraded to historical source by mistake.

### Checkpoint 2. Skeleton And Page Status Headers

Purpose:

- Create the folder skeleton and page header/status convention before content migration.

Work:

- Create the `ref-organization/` folder skeleton.
- Add `README.md` and section index files.
- Add a standard page status block requiring:
  - status
  - source class
  - upstream SoT
  - downstream consumers
  - last reviewed date
  - reviewer evidence path

Reviewer:

- Read-only Reviewer(xhigh), focused on navigation clarity and current-vs-template distinction.

Evidence:

- Git diff for skeleton.
- Reviewer evidence under `.evidence/reviews/`.

Exit criteria:

- A reader can tell what is reusable template guidance versus current project example before reading details.

### Checkpoint 3. Runtime Surface Pages

Purpose:

- Prevent future teams from confusing Codex repo-local artifacts, OpenClaw pod-native skills, pod hooks, and computer-use/tool surfaces.

Work:

- Write:
  - `02-runtime-surfaces/repo-local-codex-runtime.md`
  - `02-runtime-surfaces/pod-native-openclaw-skills.md`
  - `02-runtime-surfaces/pod-codex-completion-hooks.md`
  - `02-runtime-surfaces/computer-use-and-tool-surfaces.md`

Reviewer:

- Read-only Reviewer(xhigh), focused on runtime boundary accuracy.

Evidence:

- Reviewer evidence under `.evidence/reviews/`.
- Validation command output when validators are added.

Exit criteria:

- No page implies `/workspace/skills` is `.agents/skills`.
- No page implies `/workspace/codex-hooks` is a repo-local `.codex/hooks` artifact.
- Computer-use/tool surfaces are documented as runtime capabilities with explicit owner and evidence boundaries.

### Checkpoint 4. Organization Model And Role Contracts

Purpose:

- Generalize the current six-role plus Gatekeeper model without hardcoding it as the only possible organization shape.

Work:

- Write:
  - `01-organization-model/team-shape.md`
  - `01-organization-model/role-boundaries.md`
  - `01-organization-model/gatekeeper-model.md`
  - `03-role-contracts-and-capabilities/*`

Reviewer:

- Read-only Reviewer(xhigh), focused on role-boundary and Gatekeeper no-SOUL correctness.

Evidence:

- Reviewer evidence under `.evidence/reviews/`.

Exit criteria:

- Future teams can change role names or counts while preserving operating-role stability, deterministic gate separation, and handoff ownership.

### Checkpoint 5. Workflow, Handoff, Gate, And Evidence Pages

Purpose:

- Make the actual collaboration flow durable for isolated pod agents.

Work:

- Write:
  - `04-workflows-and-handoffs/lifecycle-workflow.md`
  - `04-workflows-and-handoffs/durable-github-work-unit.md`
  - `04-workflows-and-handoffs/scenario-overlays-a-h.md`
  - `04-workflows-and-handoffs/failure-loop.md`
  - `06-gates-evidence-and-audit/*`

Reviewer:

- Read-only Reviewer(xhigh), focused on durable GitHub handoff and evidence completeness.

Evidence:

- Reviewer evidence under `.evidence/reviews/`.

Exit criteria:

- A downstream pod can identify what must be committed, where it is linked, and what evidence remains canonical.

### Checkpoint 6. Repo Template, New Organization Template, And Index Integration

Purpose:

- Finish the reusable reference layer and connect it to current managed docs.

Work:

- Write:
  - `07-repo-template-and-runtime/*`
  - `08-new-organization-template/*`
- Update:
  - `team-doc/mobile-app-dev-team/README.md`
  - `team-doc/mobile-app-dev-team/99-source-map.md`
- Add or update `scripts/validate-team-doc.mjs` checks if needed.

Reviewer:

- Read-only Reviewer(xhigh), focused on complete navigation, source-map accuracy, and validator coverage.

Evidence:

- Reviewer evidence under `.evidence/reviews/`.
- `pnpm run validate:team-doc`
- `pnpm run test:runtime`
- `pnpm turbo run lint test`
- `pnpm run test:local-harness` if runtime paths, validators, scripts, `AGENTS.md`, `PROJECT_ENVIRONMENT.md`, or docs/plans trigger local harness scope.

Exit criteria:

- The reference layer is discoverable from the current docs.
- Validation commands pass or a blocked reason is recorded.

## Review Policy

Every checkpoint must stop for Reviewer(xhigh) before the next checkpoint starts.

Reviewer prompts must include:

- checkpoint goal
- affected paths
- SoT sources
- git diff or created-file list
- command output with exit status when applicable
- explicit request to report Critical/High/Medium/Low findings first

Reviewer outputs must:

- be read-only
- include source references
- not recursively delegate
- not approve failed deterministic gates or human-gate risk

## Validation Policy

Checkpoint 0 is a planning artifact and requires Reviewer(xhigh) evidence.

Future implementation checkpoints must follow validator-first order when adding enforced structure:

1. Add or update the smallest validator/eval/assertion.
2. Confirm it fails for missing or invalid reference-organization docs when practical.
3. Add or rewrite docs.
4. Run applicable validation:
   - `pnpm run validate:team-doc`
   - `pnpm run test:runtime`
   - `pnpm turbo run lint test`
   - `pnpm run test:local-harness` when local harness scope is touched

## Human Gates

Human approval is required before:

- changing the planned target root away from `team-doc/mobile-app-dev-team/ref-organization/`
- deleting or overwriting historical source material
- treating local validation as proof of actual OpenClaw pod execution
- accepting failed-gate risk
- adding external runtime/platform repository changes
- publishing production or customer-specific identifiers

## Initial Direction

Use `team-doc/mobile-app-dev-team/ref-organization/` instead of `team-doc/10-structured/` because the new layer must live under the current managed docs root while preserving `10-structured` as historical/reference input until explicitly migrated.

Do not use `team-doc/ref-oragnazation/`; keep the reference layer inside the current managed docs root and use the corrected spelling `ref-organization`.
