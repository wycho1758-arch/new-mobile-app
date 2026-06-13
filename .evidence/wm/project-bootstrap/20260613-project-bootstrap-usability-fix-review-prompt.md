Review the completed fix for the project-bootstrap usability finding.

Previous reviewer finding:

- `16-pod-environment-bootstrap.md` presented `project-bootstrap`,
  `codex-cli-auth-setup`, and `pod-role-bootstrap` as peer manual setup steps,
  even though `project-bootstrap/SKILL.md` supports project-bootstrap as the
  standard user-facing orchestration workflow.
- `09-pod-native-openclaw-skills/README.md` listed the reusable skills and
  per-role matrix without explicitly saying normal setup starts from
  `project-bootstrap`.

Changed files to review:

- `scripts/validate-team-doc.mjs`
- `mobile-app-dev-team/09-pod-native-openclaw-skills/README.md`
- `mobile-app-dev-team/16-pod-environment-bootstrap.md`

Verify:

1. The runbook now presents `project-bootstrap` as the standard user-facing
   entry point.
2. `codex-cli-auth-setup` and `pod-role-bootstrap` are still available as
   dependency/internal setup contracts and advanced recovery/focused diagnostic
   paths, not removed or merged blindly.
3. The pod-native README no longer reinforces the peer-step user model.
4. The validator requires this wording so the docs do not drift back.
5. No secret, credential, live-action, or external-platform claim was added.

Verification already run after the fix:

- `pnpm run test:runtime` PASS
- `pnpm run test:local-harness` PASS
- `pnpm turbo run lint test` PASS
- `node scripts/codex-preflight.mjs --self-test --no-write` PASS

Return a valid JSON envelope. Use supported owner values only.
