# Reviewer Prompt: Project Bootstrap GitHub Login UX RED Tests

Please review with xhigh scrutiny.

## Request

Confirm whether the RED test update correctly encodes the approved plan before
behavior edits.

## Changed Test/Validator Files

- `evals/skills/project-bootstrap-agent-setup-smoke.sh`
- `scripts/validate-team-doc.mjs`

## RED Evidence

- `.evidence/wm/project-bootstrap/20260613-github-login-ux-red.md`

## Expected RED Result

The targeted smoke test should fail because the current generated blocker guide
still starts with the old technical phrase:

`The pod agent cannot continue because one or more setup items still need a user-owned input, approved artifact, or platform owner action.`

The validator should fail because the docs/source have not yet been updated to
include:

- `GitHub connection is needed`
- `sign in with your GitHub account and approve`
- `Git commit author name and email`
- `Technical details for support`

## Review Criteria

Return GO only if the RED tests now enforce:

- GitHub connection/login as the first body line after `## Action needed` when
  `github-auth-unavailable` is present.
- GitHub login guidance appears before Git identity guidance when both blockers
  are present.
- Raw blocker names and technical details are excluded from primary guidance and
  limited to a support section.
- The hard-to-understand feedback phrases are rejected.
- The failure is due to old behavior, not a broken test harness.
