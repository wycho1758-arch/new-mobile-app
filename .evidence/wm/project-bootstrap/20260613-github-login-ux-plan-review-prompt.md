# Reviewer Prompt: Project Bootstrap GitHub Login UX Plan

Please review with xhigh scrutiny.

## Request

Approve or block the plan in
`.evidence/wm/project-bootstrap/20260613-github-login-ux-goal-plan.md`.

## User Feedback To Satisfy

The current generated message is still too technical for non-IT users. In the
`github-auth-unavailable` case, the primary message must not start with generic
blocker language. It should clearly say that GitHub connection/login is needed,
that the user should sign in and approve in the GitHub screen, and that the user
must not send passwords, 2FA codes, or tokens in chat.

The primary message should avoid hard-to-understand terms:

- `pod agent`
- `approved artifact`
- `platform owner action`
- `nested pod role readiness result`
- `codex-preflight --pod`
- `authenticated gh state`
- `mounted/managed GitHub auth source`

If `git-identity-missing` appears with `github-auth-unavailable`, GitHub login
should still be first. Git identity can be requested as one public non-secret
commit author name/email pair or an approved local handoff path. The agent must
not invent an email address.

## SoT To Check

- `AGENTS.md`
- `REPO_OPERATIONS.md`
- `PROJECT_ENVIRONMENT.md`
- `mobile-app-dev-team/09-pod-native-openclaw-skills/project-bootstrap/SKILL.md`
- `mobile-app-dev-team/09-pod-native-openclaw-skills/project-bootstrap/references/blocker-resolution-guide.md`
- `mobile-app-dev-team/09-pod-native-openclaw-skills/project-bootstrap/references/report-template.md`
- `mobile-app-dev-team/09-pod-native-openclaw-skills/project-bootstrap/scripts/project-bootstrap-preflight.sh`
- `evals/skills/project-bootstrap-agent-setup-smoke.sh`
- `scripts/validate-team-doc.mjs`

## Decision Needed

Return GO only if the plan:

- is scoped to the requested UX problem,
- uses tests before behavior changes,
- keeps secrets out of chat, generated reports, logs, and evidence,
- keeps technical blocker names only as support details, not primary guidance,
- includes final verification and PR/merge status reporting.

Return BLOCK with findings if any part of the plan risks preserving the overly
technical UX or bypassing the repo gates.
