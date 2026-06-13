# Reviewer Prompt: Project Bootstrap Expanded User Help UX Final

Please review with xhigh scrutiny.

Reviewer: `wm-implementation-reviewer`
Mode: final
Scope: completed implementation for the approved plan:
`docs/plans/active/20260613-project-bootstrap-expanded-user-help-ux-plan.md`.

## Task

Determine whether the implementation is ready to commit and PR.

This is a rerun after a final reviewer `NO_GO`. The prior findings were fixed:

- Current-language hints are no longer persisted verbatim when secret-like or
  unsupported.
- `PROJECT_BOOTSTRAP_USER_LANGUAGE` accepts only `auto`, `ko`, and `en` as
  requested modes; aliases are valid only for
  `PROJECT_BOOTSTRAP_CURRENT_USER_LANGUAGE` auto hints.
- English generated guidance and report template ordering now match the common
  contract: current state, already checked, agent next action, user request,
  do-not-send, support details.
- English auth guidance now assigns the agent to open or guide the login surface
  when possible while the user signs in/approves in the provider surface.

## Required Context

- Plan:
  `docs/plans/active/20260613-project-bootstrap-expanded-user-help-ux-plan.md`
- RED evidence:
  `.evidence/wm/project-bootstrap/20260613-expanded-user-help-ux-red.md`
- GREEN/full verification evidence:
  `.evidence/wm/project-bootstrap/20260613-expanded-user-help-ux-green.md`
- Phase 1 RED reviewer GO:
  `.evidence/wm/project-bootstrap/20260613-expanded-user-help-ux-red-review-rerun-4.md`
- Korean generated samples:
  `.evidence/wm/project-bootstrap/korean-samples-20260613/`

## Changed Implementation Files

- `mobile-app-dev-team/09-pod-native-openclaw-skills/project-bootstrap/scripts/project-bootstrap-preflight.sh`
- `mobile-app-dev-team/09-pod-native-openclaw-skills/project-bootstrap/SKILL.md`
- `mobile-app-dev-team/09-pod-native-openclaw-skills/project-bootstrap/references/blocker-resolution-guide.md`
- `mobile-app-dev-team/09-pod-native-openclaw-skills/project-bootstrap/references/report-template.md`
- `evals/skills/project-bootstrap-agent-setup-smoke.sh`
- `scripts/validate-team-doc.mjs`

## Verification Already Run

```text
bash evals/skills/project-bootstrap-agent-setup-smoke.sh
Exit: 0.

node scripts/validate-team-doc.mjs
Exit: 0.

pnpm run test:runtime
Exit: 0.

pnpm run test:local-harness
Exit: 0.

pnpm turbo run lint test
Exit: 0.

pnpm run validate:evidence-hygiene
Exit: 0.

git diff --check
Exit: 0.
```

The same verification set was rerun after the NO_GO fixes and is recorded in
`.evidence/wm/project-bootstrap/20260613-expanded-user-help-ux-green.md`.

## Review Requirements

- Confirm the implementation satisfies the approved plan and SoT.
- Confirm TDD ordering: RED coverage was reviewer-approved before implementation.
- Confirm `user_summary.language.requested/current_user_hint/selected/fallback_reason`
  exists for blocked and ready reports.
- Confirm Korean generated primary guidance is Korean and uses the required
  headings.
- Confirm raw blocker IDs appear only in support details and JSON.
- Confirm package-manager/pnpm guidance uses repo SoT and does not ask the user
  to choose a pnpm version.
- Confirm browser-use/computer-use auth guidance opens or guides login surfaces
  only; the user enters credentials in the real provider surface.
- Confirm no secrets or credential values are introduced in evidence.
- Confirm no mobile UI/native visual QA is required for this runtime/docs/eval
  change.

## Expected Output

Return a final JSON envelope only, using the helper schema.

Important: `findings[*].owner`, if any, must be one of the supported helper
owners such as `Mobile App Dev`, `QA/Release`, `Product/Planning`, or `human`.

```json
{
  "verdict": "GO | NO_GO | NEEDS_HUMAN | BLOCKED",
  "reviewer": "wm-implementation-reviewer",
  "mode": "final",
  "scope": {
    "baseline": null,
    "target": "project-bootstrap expanded user-help UX implementation",
    "paths_reviewed": []
  },
  "findings": [],
  "checks_reviewed": [],
  "residual_risks": [],
  "next_action": "proceed | fix_findings | ask_human | rerun_review"
}
```
