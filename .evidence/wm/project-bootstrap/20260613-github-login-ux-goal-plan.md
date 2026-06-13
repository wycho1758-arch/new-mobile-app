# Goal Plan: Project Bootstrap GitHub Login UX

Date: 2026-06-13
Branch: `fix/project-bootstrap-github-login-ux`

## Goal

Update `project-bootstrap` so a non-technical user immediately understands what
to do when pod readiness is blocked by GitHub login and Git commit identity
requirements.

The specific target feedback is:

- If `github-auth-unavailable` is present, the first user-facing message must
  say that GitHub connection/login is needed.
- The message must explain that the user should sign in and approve the GitHub
  screen, not send passwords, tokens, 2FA codes, recovery codes, or secrets in
  chat.
- If `git-identity-missing` is also present, the message may ask for a public,
  non-secret Git commit author name/email pair, but it must not ask the agent to
  invent an email address.
- The primary user-facing message must avoid hard-to-understand terms such as
  `pod agent`, `approved artifact`, `platform owner action`,
  `nested pod role readiness result`, `codex-preflight --pod`,
  `authenticated gh state`, and `mounted/managed GitHub auth source`.

## Source Of Truth

- `AGENTS.md`: TDD is required; no secrets in chat or commits; branch and PR
  required; runtime changes must pass the applicable gates.
- `REPO_OPERATIONS.md`: local validation proves repo-local behavior only and
  must keep reports status-only.
- `PROJECT_ENVIRONMENT.md`: runtime gates and local validation limits.
- `mobile-app-dev-team/09-pod-native-openclaw-skills/project-bootstrap/SKILL.md`
- `mobile-app-dev-team/09-pod-native-openclaw-skills/project-bootstrap/references/blocker-resolution-guide.md`
- `mobile-app-dev-team/09-pod-native-openclaw-skills/project-bootstrap/references/report-template.md`
- `mobile-app-dev-team/09-pod-native-openclaw-skills/project-bootstrap/scripts/project-bootstrap-preflight.sh`
- `evals/skills/project-bootstrap-agent-setup-smoke.sh`
- `scripts/validate-team-doc.mjs`
- Latest user feedback supplied in this task.

## Reviewer Gates

Each stage must pass reviewer(xhigh) before the next stage proceeds.

| Stage | Status | Reviewer Requirement |
| --- | --- | --- |
| Plan | Completed | First reviewer pass returned NO_GO because the RED plan did not explicitly enforce GitHub-first opening/order or support-only technical details. The revision added those requirements and reviewer rerun returned GO in `.evidence/wm/project-bootstrap/20260613-github-login-ux-plan-xhigh-rerun.md`. |
| RED test | Completed | Reviewer confirmed the RED tests encode the requested plain-language UX before behavior edits in `.evidence/wm/project-bootstrap/20260613-github-login-ux-red-xhigh.md`. |
| Implementation | Completed | `project-bootstrap` generated Markdown, reference docs, smoke eval, and validator expectations now use the GitHub-first UX contract. The final reviewer NO_GO findings were fixed by removing generated raw blocker repeats outside `### Technical details for support` and regenerating the sample. |
| Final verification | Completed | Local gates passed in `.evidence/wm/project-bootstrap/20260613-github-login-ux-full-verification.md`; final reviewer rerun returned GO in `.evidence/wm/project-bootstrap/20260613-github-login-ux-final-xhigh-rerun.md`. |

## Implementation Plan

1. Plan review
   - Record this plan.
   - Ask `wm-implementation-reviewer` with xhigh scrutiny to approve the scope.
   - Continue only if the reviewer returns GO.

2. RED test update
   - Update `evals/skills/project-bootstrap-agent-setup-smoke.sh` so the
     `git-identity-missing` plus `github-auth-unavailable` fixture expects:
     - `GitHub connection is needed`
     - `GitHub login screen`
     - `sign in with your GitHub account and approve`
     - `Do not send passwords, tokens, 2FA codes`
     - `Git commit author name and email`
   - Add an ordering assertion that the first non-empty paragraph after
     `## Action needed` starts with GitHub connection/login guidance when
     `github-auth-unavailable` is present.
   - Add an ordering assertion that GitHub login guidance appears before Git
     identity guidance when both `github-auth-unavailable` and
     `git-identity-missing` are present.
   - Add a section assertion that raw blocker names and technical details are
     absent from the primary user guidance section and appear only in a
     support-only section such as `### Technical details for support`.
   - Add negative assertions that the generated guide does not contain the
     difficult user-facing phrases named in the feedback.
   - Update `scripts/validate-team-doc.mjs` expectations so the reference docs
     and preflight source stay aligned with the new UX terms.
   - Run the targeted smoke/validator and record the expected RED result before
     behavior edits.
   - Ask reviewer(xhigh) to confirm the RED coverage is valid.

3. Behavior and docs update
   - Update `project-bootstrap-preflight.sh` so GitHub auth blockers generate a
     GitHub-first `## Action needed` message whose first non-empty body
     sentence says GitHub connection/login is needed.
   - Keep Git identity as a clear secondary request only when no approved
     identity source exists.
   - Move technical blocker names to a small support-only section and remove
     hard-to-understand terms from the primary message.
   - Update `blocker-resolution-guide.md` and `report-template.md` to document
     the same plain-language contract.

4. Verification
   - `bash evals/skills/project-bootstrap-agent-setup-smoke.sh`
   - `node scripts/validate-team-doc.mjs`
   - `pnpm run test:runtime`
   - `pnpm run test:local-harness`
   - `pnpm turbo run lint test`
   - `pnpm run validate:evidence-hygiene`
   - `git diff --check`

5. Final review and PR
   - Run final reviewer(xhigh) with the implemented diff and gate evidence.
   - If reviewer says GO, commit with a Conventional Commit message.
   - Push the branch and open a PR.
   - Monitor CI Quality gate and the auto-merge workflow. Report whether the PR
     merged or remains blocked by GitHub/CI state.

## Execution Evidence

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
- Final reviewer initial NO_GO:
  `.evidence/wm/project-bootstrap/20260613-github-login-ux-final-xhigh.md`
- Final reviewer GO:
  `.evidence/wm/project-bootstrap/20260613-github-login-ux-final-xhigh-rerun.md`

## Completion Criteria

The goal is complete only when:

- The GitHub auth blocker message starts with a plain GitHub connection/login
  requirement.
- In the combined GitHub auth plus Git identity case, GitHub login guidance
  appears before Git identity guidance.
- The user is told to use the GitHub screen and not send secrets in chat.
- The combined GitHub auth plus Git identity blocker case is covered by tests.
- Raw blocker names and technical details are not shown in the primary user
  guidance section; they are limited to support-only detail.
- The hard-to-understand terms listed in the feedback no longer appear in the
  generated primary guidance for that case.
- Reference docs and validators match the generated behavior.
- Required gates and final reviewer(xhigh) pass.
- A PR exists and its merge/auto-merge status is reported.
