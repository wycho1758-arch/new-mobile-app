# Reviewer Prompt: Project Bootstrap GitHub Login UX Final

Please review with xhigh scrutiny.

## Request

Return GO only if the implemented `project-bootstrap` skill update fully
satisfies the user's non-technical GitHub login UX feedback and the repo gates.

## Changed Source/Test/Doc Files

- `mobile-app-dev-team/09-pod-native-openclaw-skills/project-bootstrap/scripts/project-bootstrap-preflight.sh`
- `mobile-app-dev-team/09-pod-native-openclaw-skills/project-bootstrap/references/blocker-resolution-guide.md`
- `mobile-app-dev-team/09-pod-native-openclaw-skills/project-bootstrap/references/report-template.md`
- `evals/skills/project-bootstrap-agent-setup-smoke.sh`
- `scripts/validate-team-doc.mjs`
- `.evidence/wm/project-bootstrap/20260613-github-login-ux-goal-plan.md`

## Evidence To Review

- Plan reviewer initial NO_GO:
  `.evidence/wm/project-bootstrap/20260613-github-login-ux-plan-xhigh.md`
- Plan reviewer GO:
  `.evidence/wm/project-bootstrap/20260613-github-login-ux-plan-xhigh-rerun.md`
- RED command evidence:
  `.evidence/wm/project-bootstrap/20260613-github-login-ux-red.md`
- RED reviewer GO:
  `.evidence/wm/project-bootstrap/20260613-github-login-ux-red-xhigh.md`
- Targeted GREEN evidence:
  `.evidence/wm/project-bootstrap/20260613-github-login-ux-targeted-green.md`
- Generated blocker Markdown sample:
  `.evidence/wm/project-bootstrap/20260613-github-login-ux-generated-sample.md`
- Full verification evidence:
  `.evidence/wm/project-bootstrap/20260613-github-login-ux-full-verification.md`

## UX Contract

For nested `pod-role-bootstrap` blockers containing `github-auth-unavailable`
and `git-identity-missing`, the generated blocker Markdown must:

- Start the first body line after `## Action needed` with
  `GitHub connection is needed`.
- Tell the user to use the GitHub login screen, sign in with their GitHub
  account, and approve the request.
- Tell the user not to send passwords, tokens, 2FA codes, recovery codes, or
  secrets in chat.
- Put GitHub login guidance before Git commit identity guidance.
- Ask for the Git commit author name and email only as a public/non-secret value
  or approved local handoff path, and not invent an email address.
- Keep raw blocker names and support details out of primary guidance and place
  them under `### Technical details for support`.
- Avoid the hard-to-understand phrases called out by the user:
  `pod agent`, `approved artifact`, `platform owner action`,
  `nested pod role readiness result`, `codex-preflight --pod`,
  `authenticated gh state`, and `mounted/managed GitHub auth source`.

## Required Gate Evidence

The final verification evidence must show exit status 0 for:

- `bash evals/skills/project-bootstrap-agent-setup-smoke.sh`
- `node scripts/validate-team-doc.mjs`
- `pnpm run test:runtime`
- `pnpm run test:local-harness`
- `pnpm turbo run lint test`
- `pnpm run validate:evidence-hygiene`
- `git diff --check`

## Decision

Return GO only if implementation, tests, docs, generated sample, and verification
evidence are complete and no Critical/High/Medium findings remain.
