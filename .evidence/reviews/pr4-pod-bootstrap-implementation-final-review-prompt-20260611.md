# PR4 Pod Bootstrap Implementation Final Review Prompt

Review mode: final implementation review.

Baseline before implementation:

- `e50117f docs: record PR4 pod bootstrap plan review`

Scope to review:

- `scripts/codex-preflight.mjs`
- `evals/local-harness/preflight/fixtures/pod.*.json`
- `team-doc/mobile-app-dev-team/09-pod-native-openclaw-skills/README.md`
- `team-doc/mobile-app-dev-team/09-pod-native-openclaw-skills/pod-role-bootstrap/`
- `scripts/validate-team-doc.mjs`
- `PROJECT_ENVIRONMENT.md`
- ignored active/session plan updates
- evidence:
  - `.evidence/reviews/mobile-template-runtime-direction-midcheck-xhigh-20260611.md`
  - `.evidence/reviews/pr4-pod-bootstrap-implementation-checkpoint-20260611.md`

Required PR4 contract:

- Continue the repo purpose as a reusable mobile app template runtime, not one customer app.
- Start with RED fixtures/tests before implementation behavior.
- Add explicit `scripts/codex-preflight.mjs --pod`.
- Fail fast on repo pnpm pin mismatch, especially boram-style `10.33.3` vs repo `pnpm@9.15.9`.
- Resolve role identity from `WM_ROLE` or `/workspace/IDENTITY`; hard fail missing/mismatch.
- Report GitHub auth, EAS cloud auth material, `.codex/config.toml`, and `codex mcp list` as status only.
- Report Chromium as RN Web capability only.
- Keep `native_e2e_local: false` for boram-like pods; do not claim native readiness.
- Add source-only pod-native `pod-role-bootstrap` docs/scripts under `team-doc/mobile-app-dev-team/09-pod-native-openclaw-skills/`.
- Validate pod-native skill source and shell syntax.
- Do not touch mobile UI/runtime, backend API, contracts, live EAS, live pod rollout, webhook routing, platform provisioning, branch protection, image build/push, mobile-mcp/device, or live Confluence.

Verification already run and passed:

- `node scripts/codex-preflight.mjs --self-test --json`
- `node scripts/validate-team-doc.mjs`
- `bash -n team-doc/mobile-app-dev-team/09-pod-native-openclaw-skills/pod-role-bootstrap/scripts/pod-bootstrap.sh`
- `node scripts/codex-preflight.mjs --pod --json --no-write`
- `pnpm run test:runtime`
- `pnpm run test:local-harness`
- `pnpm turbo run lint test`
- `git diff --check`
- root `CLAUDE.md`, `.claude/`, `.claude-state` absence check
- secret-pattern scan over changed implementation/docs/fixtures, excluding validator pattern literals

Please review:

1. Whether implementation satisfies the approved PR4 plan and midcheck direction.
2. Whether TDD evidence is credible.
3. Whether redaction/status-only handling is adequate.
4. Whether local `--pod` behavior avoids overclaiming live pod/native readiness.
5. Whether any Critical/High/Medium issue blocks PR4 completion or commit.

Return findings first, then exactly one reviewer JSON envelope.
