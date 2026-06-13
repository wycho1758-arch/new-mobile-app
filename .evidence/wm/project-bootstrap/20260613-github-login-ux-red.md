## RED verification before behavior edits

### bash evals/skills/project-bootstrap-agent-setup-smoke.sh
assertion failed: expected first body line after ## Action needed in /var/folders/q9/m8qpcc0n2zd5w9t5tg9r9f8w0000gn/T/tmp.WtVbmpghkV/state/project-bootstrap-blockers.md to start with GitHub connection is needed; got The pod agent cannot continue because one or more setup items still need a user-owned input, approved artifact, or platform owner action.

smoke exit status: 1

### node scripts/validate-team-doc.mjs
- mobile-app-dev-team/09-pod-native-openclaw-skills/project-bootstrap/references/blocker-resolution-guide.md missing required role-boundary term: GitHub connection is needed
- mobile-app-dev-team/09-pod-native-openclaw-skills/project-bootstrap/references/blocker-resolution-guide.md missing required role-boundary term: sign in with your GitHub account and approve
- mobile-app-dev-team/09-pod-native-openclaw-skills/project-bootstrap/references/blocker-resolution-guide.md missing required role-boundary term: Technical details for support
- mobile-app-dev-team/09-pod-native-openclaw-skills/project-bootstrap/references/report-template.md missing required role-boundary term: GitHub connection is needed
- mobile-app-dev-team/09-pod-native-openclaw-skills/project-bootstrap/references/report-template.md missing required role-boundary term: Technical details for support
- mobile-app-dev-team/09-pod-native-openclaw-skills/project-bootstrap/scripts/project-bootstrap-preflight.sh missing required role-boundary term: GitHub connection is needed
- mobile-app-dev-team/09-pod-native-openclaw-skills/project-bootstrap/scripts/project-bootstrap-preflight.sh missing required role-boundary term: sign in with your GitHub account and approve
- mobile-app-dev-team/09-pod-native-openclaw-skills/project-bootstrap/scripts/project-bootstrap-preflight.sh missing required role-boundary term: Git commit author name and email
- mobile-app-dev-team/09-pod-native-openclaw-skills/project-bootstrap/scripts/project-bootstrap-preflight.sh missing required role-boundary term: Technical details for support

validator exit status: 1
