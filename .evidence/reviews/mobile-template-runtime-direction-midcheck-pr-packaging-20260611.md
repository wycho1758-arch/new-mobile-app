# Mobile Template Runtime Direction Midcheck Before PR Continuation

## Scope

This midcheck verifies the current overall direction and purpose before continuing
the active goal beyond local PR packaging.

Current branch:

- `feat/mobile-app-template`

Current HEAD:

- `e22e207 docs: record pr packaging readiness`

Current relation to remote:

- `origin/main` ahead count: 51 commits.
- Tracked worktree is clean.
- Active/session plan files remain ignored and are not durable handoff artifacts.

## SoT Purpose Check

The current direction remains aligned with the repository purpose only under this
interpretation:

- This repository is the reusable mobile app template runtime for WonderMove
  mobile agents, not a single customer app.
- `apps/mobile` is treated as template core and vertical-slice proof, not as the
  destination customer product.
- Runtime work must improve repeatable customer-app generation/takeover through
  repo-owned roles, gates, validators, evidence, and GitHub handoff artifacts.
- Customer app names, bundle ids, private API URLs, tokens, and credentials must
  remain injected by environment or approved ops, never hardcoded.
- External platform mutations and live-readiness claims remain human/ops gated.

Primary SoT references:

- `AGENTS.md:8`: repo purpose is mobile app template runtime for WonderMove
  mobile agents.
- `AGENTS.md:13-17`: TDD, no hardcoded customer identifiers/secrets, branch/PR,
  no external runtime repo mutation, and RN UI constraints.
- `AGENTS.md:32-38`: mobile app is template core; runtime paths are `.agents/`,
  `.codex/`, `evals/`, and `scripts/`.
- `AGENTS.md:102-112`: PR done gates and mobile runtime verification
  requirements.
- `REPO_OPERATIONS.md:23-26`: narrowest authoritative SoT wins.
- `REPO_OPERATIONS.md:97-101`: Done requires linked evidence.
- `REPO_OPERATIONS.md:138-143`: local validation does not prove pods, live
  platforms, branch protection, EAS production submit, or external state.
- `team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md:67-75`:
  the improvement target is deterministic committed-repo state that computes the
  next role action.
- `team-doc/mobile-app-dev-team/15-human-ops-live-readiness-annex.md:9-12`: the
  annex does not authorize live EAS, Stitch, Google Cloud, mobile-mcp/device,
  Railway, Confluence, GitHub settings, pod rollout, image build/push,
  Secret/token provisioning, release readiness, or store submission.
- `team-doc/mobile-app-dev-team/15-human-ops-live-readiness-annex.md:137-151`:
  forbidden claims and correct phrasing for repo-local proof.

## Directional Finding

The completed PR1 through PR7, Phase 9, Phase 10, and PR packaging checkpoint
improve the template runtime direction rather than customer-facing app scope:

| Area | Current effect | Directional judgment |
| --- | --- | --- |
| Work-unit status | Adds machine-readable state for durable handoff. | Aligned: improves agent operation from repo state. |
| Human-gate envelope | Makes `NEEDS_HUMAN` resumable without weakening human authority. | Aligned: improves governance and handoff. |
| Next-action resolver | Computes next role action deterministically. | Aligned: avoids chat/session-dependent orchestration. |
| Pod bootstrap preflight | Enforces repo pnpm pin and reports capabilities without secrets. | Aligned: improves ClawPod readiness, but only as repo-local proof. |
| Native evidence ladder | Separates RN Web, EAS/Maestro, and human-device proof. | Aligned: prevents overstated release/native claims. |
| SoT drift detection | Checks package/runtime/MCP/CI facts offline. | Aligned: protects template runtime from decay. |
| Evidence hygiene | Validates durable evidence paths, naming, and secret patterns. | Aligned: improves long-lived handoff quality. |
| Human/ops annex | Defines live-readiness approval and evidence envelope. | Aligned: controls external platform work. |
| RN Web E2E fix | Makes base RN Web E2E deterministic while skipping deployed backend proof without explicit URL. | Aligned: improves L1 template proof without claiming L2/L3 readiness. |

## What This Does Not Authorize

This midcheck does not authorize:

- building customer-facing feature scope beyond the template vertical slice;
- hardcoding a customer name, bundle id, private API URL, token, or credential;
- live EAS, `eas whoami`, EAS build, or cloud Maestro execution;
- simulator, emulator, device, or mobile-mcp runs;
- Railway deploy/health, Confluence live publication, Stitch/GCloud probing, or
  GitHub settings/branch-protection changes;
- OrbStack/OpenClaw pod creation, image build/push, webhook routing, or
  Secret/token provisioning;
- production submit, store submission, or weakening the release human gate;
- claiming that RN Web/local harness/offline fixtures prove native behavior,
  platform state, branch protection, or release readiness.

## Current Gate And Packaging State

The latest PR packaging checkpoint records these local passing gates:

- `pnpm run test:runtime`
- `pnpm turbo run lint test`
- `pnpm run test:local-harness`
- `pnpm --filter mobile exec expo install --check`
- `pnpm --filter mobile lint`
- `pnpm --filter mobile test`
- `pnpm --filter mobile run doctor`
- `pnpm --filter mobile e2e:web`
- `node scripts/validate-evidence-hygiene.mjs`
- `node scripts/validate-project-environment.mjs`
- `git diff --check`

`pnpm --filter mobile e2e:web` is base RN Web proof only: 1 passed and 1 skipped
for deployed backend reachability because no explicit `EXPO_PUBLIC_API_URL` was
provided.

The current GitHub quality-gate mapping requires:

- `pnpm run test:runtime`
- `pnpm turbo run lint test`
- `pnpm run test:local-harness` for runtime-path changes

All three required PR gate commands are recorded as passing locally.

Residual branch hygiene risk:

- `git diff --check origin/main...HEAD` fails on historical committed whitespace
  findings in branch-wide evidence/fixture/docs/eval/contract files.
- This is not a configured required PR gate in current SoT, but it must not be
  reported as passing.

## Midcheck Conclusion

The next repo-local progression should be PR continuation, not new customer-app
feature implementation and not live ops. The safe next actions are:

1. Verify current GitHub CLI/remote state and existing PR state.
2. Prepare a draft PR body that clearly frames the branch as mobile template
   runtime infrastructure.
3. Push/open a draft PR only if treated as user-authorized PR workflow and the
   worktree remains clean.
4. Keep live/native/external readiness outside this PR unless a separate
   human/ops approval record is created.

If reviewer(xhigh) finds this branch no longer supports the template-runtime
purpose, the goal should stop before PR continuation and require a scoped
correction plan.
