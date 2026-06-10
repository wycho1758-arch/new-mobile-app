# PR7 Evidence Hygiene And Preflight Hardening: xhigh Preimplementation Review Prompt

Date: 2026-06-11
Reviewer: wm-implementation-reviewer
Mode: plan

## Request

Review the PR7 preimplementation plan before implementation starts. Do not edit files.

Plan:

- `docs/plans/active/20260611-pr7-evidence-hygiene-preimplementation-plan.md`

Baseline:

- `7648885 feat: validate project environment drift`

Parent/current plan:

- `docs/plans/active/20260610-wm-mobile-template-runtime-goal-plan.md`

Relevant SoT:

- `AGENTS.md`
- `PROJECT_ENVIRONMENT.md`
- `REPO_OPERATIONS.md`
- `team-doc/mobile-app-dev-team/06-gates-and-evidence.md`
- `team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md`
- `scripts/validate-team-doc.mjs`
- `scripts/validate-team-doc-archive.mjs`
- `scripts/lib/work-unit-machine.mjs`
- `scripts/validate-project-environment.mjs`
- `scripts/codex-preflight.mjs`
- `.codex/config.toml`

## Review Questions

1. Does this PR7 plan align with the repo purpose as a reusable WonderMove/ClawPod mobile app template runtime rather than a customer-specific app?
2. Is the plan correctly limited to repo-internal/offline evidence hygiene and Design-role Stitch preflight hardening?
3. Does the plan avoid unnecessary duplication of PR6's `mobile-mcp`/MCP pin drift coverage in `scripts/validate-project-environment.mjs`?
4. Are forbidden live/external actions correctly blocked: live Stitch MCP, Google Cloud API calls, `gcloud auth` mutation, ADC login, mobile-mcp/device/simulator/emulator execution, Confluence/Atlassian, Railway, EAS, GitHub issue creation, branch protection, webhook, pod rollout, Secret/token provisioning, and release readiness?
5. Is the TDD plan sufficient for invalid evidence paths, invalid E2E evidence directory naming, planted secret with file+line reporting, current-tree valid state, Design role missing Stitch prerequisites, non-Design Stitch skip, and output redaction?
6. Is implementation allowed to start after this review, or does the plan need correction first?

## Expected Review Output

Return findings first, then exactly one fenced JSON envelope with:

- `verdict`: `GO`, `NO_GO`, `NEEDS_HUMAN`, or `BLOCKED`
- `reviewer`: `wm-implementation-reviewer`
- `mode`: `plan`
- `scope`
- `findings`
- `checks_reviewed`
- `residual_risks`
- `next_action`

Use `GO` only if there are no Critical/High/Medium findings and implementation may proceed inside the plan's offline scope.
