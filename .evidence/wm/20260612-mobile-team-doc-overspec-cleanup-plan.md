# Mobile Team Doc Overspec Cleanup Plan

Date: 2026-06-12

## Request

User invoked `$wm` and asked to verify the supplied audit and plan with Serena
MCP before work starts, then report only after final reviewer review.

## Serena / Lookup Status

- Serena MCP was available for bounded pattern lookup.
- `initial_instructions` was referenced by the tool discovery metadata, but no
  callable `mcp__serena.initial_instructions` tool was exposed in this session.
  This run used `mcp__serena.search_for_pattern` plus focused `rg`/file reads.
- `mcp__serena.get_current_config` later reported `initial_instructions` as an
  active Serena tool, but it still was not exposed as a callable function in
  this Codex tool surface.
- Serena pattern search confirmed remaining references to:
  - `08-role-title-update-plan.md`
  - `09-pod-native-openclaw-skill-plan.md`
  - `11-openclaw-codex-completion-hooks-plan.md`
  - `08-new-organization-template`
  - `18-orbstack-pod-config-setup-runbook-plan.md`

## SoT Sources Read

- `AGENTS.md`
- `PROJECT_ENVIRONMENT.md`
- `REPO_OPERATIONS.md`
- `.agents/skills/wm/SKILL.md`
- `mobile-app-dev-team/README.md`
- `mobile-app-dev-team/00-sot-and-principles.md`
- `mobile-app-dev-team/99-source-map.md`
- `mobile-app-dev-team/12-ref-organization-goal-plan.md`
- `scripts/validate-team-doc.mjs`
- External plan: `/Users/tw.kim/.claude/plans/vivid-honking-kay.md`

## Plan Review Finding Before Implementation

The supplied plan is directionally correct but too broad for one `$wm` execution:

- Safe: archive the three stale completed plan files and update current references.
- Unsafe in this turn: consolidate/archive `ref-organization/08-new-organization-template`
  or broad `ref-organization` structure now. `scripts/validate-team-doc.mjs`
  currently requires the existing ref-organization section set, and
  `mobile-app-dev-team/12-ref-organization-goal-plan.md` still documents that
  structure as the active checkpoint target.
- Deferred: merge/trim `18-orbstack-pod-config-setup-runbook-plan.md` into
  `16-pod-environment-bootstrap.md`. That is a distinct owner/operator runbook
  rewrite and should get its own scoped review.

## Approved Implementation Scope For This Run

Owner role: Product/Planning documentation maintenance under `$wm`.

Affected paths:

- `scripts/validate-team-doc.mjs`
- `mobile-app-dev-team/08-role-title-update-plan.md`
- `mobile-app-dev-team/09-pod-native-openclaw-skill-plan.md`
- `mobile-app-dev-team/11-openclaw-codex-completion-hooks-plan.md`
- `mobile-app-dev-team/_archive/`
- `mobile-app-dev-team/12-ref-organization-goal-plan.md`
- `mobile-app-dev-team/ref-organization/02-runtime-surfaces/README.md`
- `mobile-app-dev-team/ref-organization/02-runtime-surfaces/pod-native-openclaw-skills.md`
- `mobile-app-dev-team/ref-organization/02-runtime-surfaces/pod-codex-completion-hooks.md`
- `mobile-app-dev-team/99-source-map.md`

Work:

1. Add the narrowest validator assertion first:
   - top-level stale plan files must not remain in `mobile-app-dev-team/`.
   - archived stale plan files must exist under `mobile-app-dev-team/_archive/`.
   - `99-source-map.md` must include a completed/superseded plan crosswalk.
2. Confirm `node scripts/validate-team-doc.mjs` fails before implementation.
3. Move the three stale plan files into `_archive/`.
4. Update references so active docs point to current implementations or archived
   evidence instead of root-level stale plan paths.
5. Run:
   - `node scripts/validate-team-doc.mjs`
   - `pnpm run test:runtime`
   - `pnpm run test:local-harness`
6. Record final diff/status and route final work review to
   `wm-implementation-reviewer`.

Gate impact:

- This is a managed docs + validator change.
- `pnpm run test:runtime` is required.
- `pnpm run test:local-harness` is required because
  `scripts/validate-team-doc.mjs` is a runtime validator script.

Evidence paths:

- Plan evidence:
  `.evidence/wm/20260612-mobile-team-doc-overspec-cleanup-plan.md`
- Initial blocked plan review:
  `.evidence/reviews/20260612-mobile-team-doc-overspec-cleanup-plan-review.md`
- Revised plan review:
  `.evidence/reviews/20260612-mobile-team-doc-overspec-cleanup-plan-review-2.md`
- Command evidence:
  `.evidence/wm/20260612-mobile-team-doc-overspec-cleanup-commands.md`
- Final work review:
  `.evidence/reviews/20260612-mobile-team-doc-overspec-cleanup-final-review.md`

Human gates:

- No live external platform action.
- No Confluence/Jira/GitHub mutation.
- No secret-bearing paths expected.
