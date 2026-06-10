## Summary

This branch builds the reusable WonderMove/ClawPod mobile app template runtime.
It should be reviewed as runtime, gate, evidence, role, and handoff
infrastructure, not as a single customer-app feature branch.

Key changes:

- Adds machine-readable work-unit state and deterministic next-action resolution.
- Adds human-gate decision envelopes so `NEEDS_HUMAN` states can resume through
  durable repo artifacts without weakening human approval.
- Hardens repo-local Codex/OpenClaw role boundaries, reviewer envelopes,
  bootstrap/preflight checks, and evidence hygiene.
- Separates RN Web, EAS/Maestro, and human-device/mobile-mcp evidence levels.
- Adds offline SoT drift checks for package/runtime/MCP/CI facts.
- Adds a human/ops live-readiness annex that keeps external platform work behind
  explicit approval.
- Stabilizes base RN Web E2E so browser UI/business-flow proof can run without
  pretending to prove deployed backend or native behavior.

## Why

The repo SoT defines this project as the mobile app template runtime for
WonderMove mobile agents. The intent is to make customer/project-specific Expo
React Native apps reproducible through a shared runtime and operating standard:
roles, validators, gates, evidence, and GitHub handoff artifacts.

This branch does not try to grow one customer-facing screen. It makes the system
that agents use to safely intake, hand off, implement, verify, review, and stop
at human gates.

## Local validation recorded

The PR packaging checkpoint records these local passing checks:

```text
pnpm run test:runtime
pnpm turbo run lint test
pnpm run test:local-harness
pnpm --filter mobile exec expo install --check
pnpm --filter mobile lint
pnpm --filter mobile test
pnpm --filter mobile run doctor
pnpm --filter mobile e2e:web
node scripts/validate-evidence-hygiene.mjs
node scripts/validate-project-environment.mjs
git diff --check
```

RN Web E2E result:

- 1 passed: base RN Web home counter flow.
- 1 skipped: deployed backend API reachability because no explicit
  `EXPO_PUBLIC_API_URL` was supplied.

`EXPO_PUBLIC_API_URL` is public client config compiled into the app. It is not a
secret, but bearer tokens, signing keys, passwords, and private endpoints must
not be put in public client config.

## Important non-claims

This PR does not claim:

- deployed backend API reachability from the latest RN Web run;
- Railway/live API health;
- live EAS or Maestro cloud execution;
- native simulator, emulator, physical-device, or mobile-mcp proof;
- actual OrbStack/OpenClaw pod execution;
- GitHub branch protection or webhook behavior;
- Confluence live publication;
- release readiness, production submit approval, or store submission.

Those remain separate human/ops-gated or live-evidence scopes.

## Residual risk

`git diff --check origin/main...HEAD` fails on historical committed whitespace
findings across branch-wide evidence/fixture/docs/eval/contract files. This is
not a configured required PR gate in the current SoT or GitHub workflow, and
xhigh classified it as residual branch hygiene rather than PR-blocking. It must
not be reported as passing.

## Evidence

- `.evidence/reviews/mobile-template-runtime-pr-packaging-checkpoint-20260611.md`
- `.evidence/reviews/mobile-template-runtime-pr-packaging-xhigh-20260611.md`
- `.evidence/reviews/mobile-template-runtime-direction-midcheck-pr-packaging-20260611.md`
- `.evidence/reviews/mobile-template-runtime-direction-midcheck-pr-packaging-xhigh-20260611.md`
- `.evidence/reviews/phase10-rn-web-e2e-fix-implementation-final-xhigh-20260611.md`
- `.evidence/reviews/phase9-human-ops-annex-implementation-final-xhigh-20260611.md`
