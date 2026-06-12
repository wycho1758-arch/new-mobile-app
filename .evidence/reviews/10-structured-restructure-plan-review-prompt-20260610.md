# Review Request: 10-structured Restructure Plan

Review mode: xhigh, read-only.

Task context:
- User asked to inspect `team-doc/mobile-app-dev-team` as the current project flow and plan how `team-doc/10-structured` should be reorganized before later content migration.
- Goal is not to edit now. Goal is to report a clean, accurate structure for future similar organizations or different organizations, using this current project as the reference: OpenClaw clawpod agents collaborate inside pods and use Codex plus computer use.

Primary sources to inspect:
- `AGENTS.md`
- `PROJECT_ENVIRONMENT.md`
- `.agents/skills/wm/SKILL.md`
- `team-doc/mobile-app-dev-team/README.md`
- `team-doc/mobile-app-dev-team/00-sot-and-principles.md`
- `team-doc/mobile-app-dev-team/01-team-composition.md`
- `team-doc/mobile-app-dev-team/03-role-capability-matrix.md`
- `team-doc/mobile-app-dev-team/04-skills-and-agents-matrix.md`
- `team-doc/mobile-app-dev-team/05-work-processes.md`
- `team-doc/mobile-app-dev-team/06-gates-and-evidence.md`
- `team-doc/mobile-app-dev-team/07-new-team-template-guide.md`
- `team-doc/mobile-app-dev-team/09-pod-native-openclaw-skill-plan.md`
- `team-doc/mobile-app-dev-team/10-github-artifact-workflow.md`
- `team-doc/mobile-app-dev-team/11-openclaw-codex-completion-hooks-plan.md`
- `team-doc/mobile-app-dev-team/99-source-map.md`
- Current `team-doc/10-structured/**`

Proposed restructuring direction to review:
1. Treat `team-doc/mobile-app-dev-team` as the current SoT and `team-doc/10-structured` as the reusable organization-template layer.
2. Reorganize `10-structured` from the current broad Confluence-character sections into a lifecycle model:
   - `00-orientation-and-sot/`
   - `01-organization-model/`
   - `02-runtime-surfaces/`
   - `03-role-contracts-and-capabilities/`
   - `04-workflows-and-handoffs/`
   - `05-skills-agents-and-tools/`
   - `06-gates-evidence-and-audit/`
   - `07-repo-template-and-runtime/`
   - `08-new-organization-template/`
   - `99-source-map-and-migration/`
3. Separate runtime surfaces explicitly:
   - repo-local Codex: `.agents/skills`, `.codex/agents`, `.codex/hooks`, `.codex/config.toml`
   - pod-native OpenClaw skills: `/workspace/skills/<slug>/SKILL.md`, source managed under `team-doc/mobile-app-dev-team/09-pod-native-openclaw-skills/<slug>/`
   - pod Codex completion hooks: `/workspace/codex-hooks`, not a repo-local Codex hook and not a `/workspace/skills` skill
   - durable role handoff: GitHub branch/commit/PR plus `docs/plans/work-units/<work-unit-id>/`
4. Keep Gatekeeper as a non-LLM deterministic required-check concept with no SOUL.md.
5. Preserve A-H workflow cases only as scenario overlays under the stronger current process/handoff model, not as the primary navigation.
6. Add a migration crosswalk from existing `10-structured` files to the new target sections.

Review questions:
- Does this plan correctly follow the current repo SoT and `$wm` role-boundary rules?
- Are any proposed sections misleading, missing, or likely to confuse current SoT with historical/reference material?
- What high/medium risks must be fixed before using this plan for migration?

Return findings first, ordered by severity, with source references. Do not edit files or delegate.
