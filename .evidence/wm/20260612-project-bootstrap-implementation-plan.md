# project-bootstrap Implementation Plan

Date: 2026-06-12

## Goal

Create a pod-native OpenClaw `project-bootstrap` skill that can be installed as
`/workspace/skills/project-bootstrap/SKILL.md` and used to prepare OrbStack
`boram-*` pods for the WonderMove `new-mobile-app` project before live pod
testing.

The skill must not replace the existing role-specific pod-native skills. It must
orchestrate and verify them with status-only reporting:

- `codex-cli-auth-setup`
- `pod-role-bootstrap`
- `stitch-adc-setup` for Design pods when Stitch work is in scope
- `eas-robot-auth-setup` for QA/Release pods when EAS/Maestro work is in scope

## SoT Inputs

- `AGENTS.md`: pod-native OpenClaw skills live under
  `mobile-app-dev-team/09-pod-native-openclaw-skills/<slug>/` and run as
  `/workspace/skills/<slug>/SKILL.md`; TDD and branch/PR workflow are required.
- `REPO_OPERATIONS.md`: Codex-managed pod repo work uses
  `/workspace/CODEX_MANAGED_PATHS.md`, status-only secret handling, and local
  validation does not prove live pod/external platform behavior.
- `PROJECT_ENVIRONMENT.md`: required MCPs are `mobile-mcp`, `serena`, and
  `stitch`; Expo MCP is plugin-provided; pod preflight is status-only and does
  not prove live OrbStack/OpenClaw, native, Stitch service, or external platform
  state.
- `docs/CODEX_MCP_ENVIRONMENT.md`: required/conditional MCP and CLI checklist
  for mobile-mcp, serena, stitch, expo, atlassian, node_repl, playwright,
  railway, gcloud, EAS, and workspace Expo.
- `mobile-app-dev-team/09-pod-native-openclaw-skills/README.md`: canonical
  per-role pod-native skill matrix.
- `mobile-app-dev-team/16-pod-environment-bootstrap.md`,
  `17-orbstack-pod-config-values.md`, and
  `18-orbstack-pod-config-setup-runbook-plan.md`: current pod zero-to-ready,
  owner/operator input, rollout/readiness, and missing/block handling.
- `.evidence/wm/20260612-project-bootstrap-all-agents-review.md`: xhigh `NO_GO`
  review requiring MCP setup, pod skill matrix coverage, path conflict
  resolution, status-only credential/project handling, and expanded QC.

## Scope

1. Add a new pod-native source skill:
   - `mobile-app-dev-team/09-pod-native-openclaw-skills/project-bootstrap/SKILL.md`
   - `mobile-app-dev-team/09-pod-native-openclaw-skills/project-bootstrap/scripts/project-bootstrap-preflight.sh`
   - `mobile-app-dev-team/09-pod-native-openclaw-skills/project-bootstrap/references/report-template.md`
2. Update the pod-native skill index and source map so `project-bootstrap` is
   discoverable and clearly distinct from repo-local `.agents/skills`.
3. Resolve the requested boram test path by changing current pod defaults from
   `/workspace/new-mobile-app` to
   `/workspace/projects/Wondermove-Inc/new-mobile-app` in current pod bootstrap
   SoT and validators. Historical plans/snapshots may remain historical unless
   current validators require them.
4. Add/adjust validator assertions first so the new skill, script, report
   template, and new path are enforced.
5. Keep all reporting status-only. Do not print or persist token values, ADC
   JSON, auth JSON, database URLs, bearer tokens, private keys, or rendered
   secret manifests.

## Non-Goals

- Do not test live OrbStack `boram-*` pods from the local repo.
- Do not modify external platform/runtime repositories.
- Do not run live EAS, Railway deploy, Stitch generation/export, Jira,
  Confluence, GitHub branch protection, store submit, or pod rollout commands.
- Do not create a repo-local `.agents/skills/project-bootstrap`; this is a
  pod-native OpenClaw skill.
- Do not claim native E2E, mobile-mcp, EAS, Stitch, Railway, or Atlassian live
  readiness from local validation.

## Tests-First Plan

1. Update `scripts/validate-team-doc.mjs` and `scripts/validate-repo-operations.mjs`
   to expect:
   - `project-bootstrap` source files;
   - `/workspace/skills/project-bootstrap/SKILL.md` runtime shape;
   - new default repo path `/workspace/projects/Wondermove-Inc/new-mobile-app`;
   - required references to MCP/CLI checks, role-specific pod skills, QC
     checklist, status-only reporting, and `human-gate/v1`.
2. Run the narrow validator and expect failure before adding the new artifacts:
   - `pnpm run validate:team-doc`
   - `pnpm run validate:repo-operations`
3. Add the skill and update current SoT/docs/scripts.
4. Re-run:
   - `pnpm run validate:team-doc`
   - `pnpm run validate:repo-operations`
   - `pnpm run test:runtime`
   - `pnpm run test:local-harness` if runtime/path/harness scope remains touched

## Implementation Steps

1. Validator RED:
   - Add constants/assertions for `project-bootstrap`.
   - Update current pod path assertions to the new target path.
2. Skill creation:
   - Write concise `SKILL.md` with workflow and QC checklist.
   - Add `project-bootstrap-preflight.sh` that writes
     `/workspace/state/project-bootstrap-report.json` by default and checks only
     presence/status of repo, managed path, required pod skills, MCPs, selected
     role-specific checks, CLI/account status, and human-gate blockers.
   - Add report template.
3. Current SoT synchronization:
   - Update or explicitly review/no-op `PROJECT_ENVIRONMENT.md` whenever
     `docs/CODEX_MCP_ENVIRONMENT.md` or runtime path facts change.
   - Update `REPO_OPERATIONS.md`, `docs/CODEX_MCP_ENVIRONMENT.md`,
     `mobile-app-dev-team/16-pod-environment-bootstrap.md`,
     `17-orbstack-pod-config-values.md`,
     `18-orbstack-pod-config-setup-runbook-plan.md`,
     `09-pod-native-openclaw-skills/README.md`,
     `codex-cli-auth-setup/SKILL.md`,
     `pod-role-bootstrap/SKILL.md`,
     `pod-role-bootstrap/scripts/pod-bootstrap.sh`, and
     `pod-role-bootstrap/references/report-template.md`.
4. Review/evidence:
   - Run verification commands.
   - Request final xhigh `wm-implementation-reviewer` review against diff,
     command output, and evidence.

## QC Checklist For The New Skill

- Target pod id/selector and `WM_ROLE`/`WM_EXPECTED_ROLE` are present or blocked.
- Repo path is `/workspace/projects/Wondermove-Inc/new-mobile-app`.
- `REPO_CLONE_URL` is non-secret and token-free before clone.
- `/workspace/CODEX_MANAGED_PATHS.md` contains
  `- /workspace/projects/Wondermove-Inc/new-mobile-app/`.
- Required pod skills exist under `/workspace/skills`.
- Required MCPs are enabled/status-checked: `mobile-mcp`, `serena`, `stitch`.
- Conditional MCPs are checked when selected: `expo`, `atlassian`,
  `node_repl`, `playwright`.
- Conditional CLIs/accounts are checked status-only: Railway, gcloud/ADC/Stitch
  project, EAS/Expo, workspace Expo, GitHub auth, Codex auth.
- API secret refs, Railway token refs, Google ADC, EXPO_TOKEN, ASC, and Google
  Play credentials are recorded only as status/ref labels, never values.
- `pod-role-bootstrap` report is present or blocked with a source-backed reason.
- Design and QA/Release role-specific setup reports are present or
  source-backed N/A.
- Live external actions are blocked without `human-gate/v1`.
- Report contains redacted summaries only and does not claim live pod/platform
  success unless actual boram evidence is supplied later.

## Expected Gate Impact

- Runtime/team-doc validators will change.
- Required verification:
  - `pnpm run validate:team-doc`
  - `pnpm run validate:repo-operations`
  - `pnpm run test:runtime`
  - `pnpm run test:local-harness`
  - `pnpm turbo run lint test`
- App-specific mobile commands are not expected unless code under `apps/` or
  mobile runtime behavior changes, but the workspace lint/test gate remains
  required for PR readiness.
