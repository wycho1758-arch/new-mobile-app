# Reviewer Prompt: Project Bootstrap Blocker Guide Plan

Mode: plan
Requested reviewer: wm-implementation-reviewer
Review depth: xhigh

Review the implementation plan in:

`.evidence/wm/20260612-project-bootstrap-blocker-guide-plan.md`

User request summary:

- `$wm` workflow.
- Confirm blocker candidates for `pod-role-bootstrap` readiness.
- Expand `mobile-app-dev-team/09-pod-native-openclaw-skills/project-bootstrap/references`.
- When blockers exist, provide a Markdown file to the user so they can resolve
  the blockers.
- Maximize safe LLM browser/tool-use guidance for actions the agent can perform.
- Remember the agent pod is a Linux virtualized computer and most tools are
  already installed; only project-bootstrap-related setup should be newly
  installed/changed.
- Plan must be checked before implementation and final work must be checked
  before reporting.

Review criteria:

- SoT-grounded and scoped to project-bootstrap only.
- No live external action or secret handling is introduced.
- TDD/validator-first approach is present.
- The generated blocker Markdown approach satisfies the user handoff
  requirement.
- The plan respects `$wm` routing and evidence requirements.
