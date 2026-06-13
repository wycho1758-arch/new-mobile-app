Review this $wm implementation plan in read-only mode before edits.

Task: fix project-bootstrap skill/runtime UX gaps. The latest user clarification is mandatory: `PROJECT_BOOTSTRAP_CURRENT_USER_LANGUAGE` must be set directly by the agent from the current user message language, not by asking the user to provide a separate value.

User-reported gaps:
- Default run currently selected English with `fallback_reason: "missing_current_user_language_hint"`.
- Korean user-facing output should happen when the agent sees a Korean current user message and passes that as the current-language hint.
- First GitHub-login guidance should say more directly: "제가 GitHub 로그인 화면을 열어드리면, 사용자는 그 화면에서 로그인하고 승인만 해주세요. 이후 연결 확인과 재검사는 제가 처리합니다."
- Git identity guidance should be less burdensome: "원하는 commit 이름/이메일이 있으면 알려주세요. 없으면 승인된 GitHub 계정 기준으로 설정 가능한지 확인하겠습니다."

Scope/owner:
- Repo runtime / pod-native project-bootstrap skill.
- No mobile UI/API changes.

SoT read:
- `AGENTS.md`: TDD, branch+PR, runtime gate requirements.
- `PROJECT_ENVIRONMENT.md`: runtime gates and pod preflight scope.
- `.agents/skills/wm/SKILL.md`: SoT-grounded plan, tests first, plan/final reviewer evidence.
- `.agents/skills/git-workflow/SKILL.md`: branch/PR workflow and no direct main.
- `mobile-app-dev-team/09-pod-native-openclaw-skills/project-bootstrap/SKILL.md` lines 64-80: current language contract supports `PROJECT_BOOTSTRAP_USER_LANGUAGE=ko|en|auto` and `PROJECT_BOOTSTRAP_CURRENT_USER_LANGUAGE`, but does not clearly state the agent derives and exports the current-language hint from the current user message before running preflight.
- `mobile-app-dev-team/09-pod-native-openclaw-skills/project-bootstrap/references/report-template.md` lines 146-156 mirrors language fields.
- `mobile-app-dev-team/09-pod-native-openclaw-skills/project-bootstrap/scripts/project-bootstrap-preflight.sh` lines 230-443 implements env inputs and fallback; lines 638-747 generate Korean guidance.
- `evals/skills/project-bootstrap-agent-setup-smoke.sh` has Korean language/guidance tests.

Plan:
1. After this plan review, create a work branch from `origin/main`, preserving unrelated untracked evidence and not staging it unless it is part of this work.
2. Tests first:
   - Update `evals/skills/project-bootstrap-agent-setup-smoke.sh` assertions for Korean output to require the stronger GitHub-login sentence and lower-burden Git identity request above.
   - Add/update assertions that Korean auto mode uses agent-derived `PROJECT_BOOTSTRAP_CURRENT_USER_LANGUAGE` from the current user message, e.g. `ko-KR` or `한국어`, and does not require the user to provide that hint manually.
   - Add validator doc-term checks in `scripts/validate-team-doc.mjs` for explicit ownership wording around `PROJECT_BOOTSTRAP_USER_LANGUAGE` and `PROJECT_BOOTSTRAP_CURRENT_USER_LANGUAGE`, including that the agent running `project-bootstrap-preflight.sh` sets `PROJECT_BOOTSTRAP_CURRENT_USER_LANGUAGE` from the current user message.
   - Run the narrow smoke/validator to observe failure before implementation when practical.
3. Implement smallest changes:
   - Update `project-bootstrap/SKILL.md` User Language Contract and workflow examples to state that the agent/orchestrator running `project-bootstrap-preflight.sh` sets `PROJECT_BOOTSTRAP_CURRENT_USER_LANGUAGE` from the current user message language before preflight. For a Korean current message, export `PROJECT_BOOTSTRAP_USER_LANGUAGE=auto` and `PROJECT_BOOTSTRAP_CURRENT_USER_LANGUAGE=ko-KR` or `한국어`; explicit `PROJECT_BOOTSTRAP_USER_LANGUAGE=ko` still forces Korean.
   - State that if the agent omits the current-language hint in `auto` mode, selected language falls back to English and records `missing_current_user_language_hint`; that is an agent setup miss for Korean conversations.
   - Update `references/report-template.md` with the same ownership contract.
   - Update `references/blocker-resolution-guide.md` with the same ownership contract so the support guide does not preserve ambiguity.
   - Update `project-bootstrap-preflight.sh` generated Korean copy with the requested GitHub-login and Git identity phrasing.
4. Verification:
   - Run `bash evals/skills/project-bootstrap-agent-setup-smoke.sh`.
   - Run `pnpm run validate:team-doc`.
   - Run `pnpm run test:runtime`.
   - Because runtime path/skill/eval files change, run `pnpm run test:local-harness` before PR.
5. Final reviewer xhigh:
   - Run `wm-implementation-reviewer` against this approved plan, git diff, command outputs, and evidence to verify the actual work satisfies the purpose.
6. Git workflow:
   - Commit only scoped changed files and relevant evidence.
   - Push branch, open PR, verify Quality gate / auto-merge status.
   - Merge PR only if required gates pass and the user request remains explicit; do not self-approve or bypass failed gates.

Human gates:
- None expected.
- No secrets, credentials, or external runtime repository changes.

Expected affected paths:
- `mobile-app-dev-team/09-pod-native-openclaw-skills/project-bootstrap/SKILL.md`
- `mobile-app-dev-team/09-pod-native-openclaw-skills/project-bootstrap/references/report-template.md`
- `mobile-app-dev-team/09-pod-native-openclaw-skills/project-bootstrap/references/blocker-resolution-guide.md`
- `mobile-app-dev-team/09-pod-native-openclaw-skills/project-bootstrap/scripts/project-bootstrap-preflight.sh`
- `evals/skills/project-bootstrap-agent-setup-smoke.sh`
- `scripts/validate-team-doc.mjs`
- `.evidence/reviews/*.json`

Review question: Is this revised plan sufficient, SoT-grounded, and aligned with the user's clarification that `PROJECT_BOOTSTRAP_CURRENT_USER_LANGUAGE` is agent-set from the current message?

If you report findings, use only supported owner values in the JSON envelope: `Product/Planning`, `Design`, `Mobile Architect`, `Mobile App Dev`, `Backend/API Integrator`, `QA/Release`, or `human`.

Return findings-first prose and exactly one reviewer JSON envelope.
