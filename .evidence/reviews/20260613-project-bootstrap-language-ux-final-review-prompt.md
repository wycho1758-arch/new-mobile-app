Review this completed `$wm` implementation in read-only xhigh mode.

Approved plan evidence:
- `.evidence/reviews/20260613-project-bootstrap-language-ux-plan-prompt.md`
- `.evidence/reviews/20260613-project-bootstrap-language-ux-plan-review.json`

User requirement:
- `PROJECT_BOOTSTRAP_CURRENT_USER_LANGUAGE` must be set directly by the agent from the current user message language.
- Korean output should no longer fall back to English for Korean conversations when the agent passes the current message language hint.
- GitHub-login guidance should strongly lead with: "제가 GitHub 로그인 화면을 열어드리면, 사용자는 그 화면에서 로그인하고 승인만 해주세요. 이후 연결 확인과 재검사는 제가 처리합니다."
- Git identity guidance should be less burdensome: "원하는 commit 이름/이메일이 있으면 알려주세요. 없으면 승인된 GitHub 계정 기준으로 설정 가능한지 확인하겠습니다."

Changed paths:
- `scripts/validate-team-doc.mjs`
- `evals/skills/project-bootstrap-agent-setup-smoke.sh`
- `mobile-app-dev-team/09-pod-native-openclaw-skills/project-bootstrap/SKILL.md`
- `mobile-app-dev-team/09-pod-native-openclaw-skills/project-bootstrap/references/report-template.md`
- `mobile-app-dev-team/09-pod-native-openclaw-skills/project-bootstrap/references/blocker-resolution-guide.md`
- `mobile-app-dev-team/09-pod-native-openclaw-skills/project-bootstrap/scripts/project-bootstrap-preflight.sh`
- `.evidence/reviews/20260613-project-bootstrap-language-ux-plan-prompt.md`
- `.evidence/reviews/20260613-project-bootstrap-language-ux-plan-review.json`
- `.evidence/reviews/20260613-project-bootstrap-language-ux-command-evidence.md`

Implementation summary:
- Added validator-enforced language ownership terms so maintained docs/script/eval must state that the agent running `project-bootstrap-preflight.sh` sets `PROJECT_BOOTSTRAP_CURRENT_USER_LANGUAGE` from the current user message.
- Added smoke assertions for the stronger Korean GitHub-login sentence and lower-burden Git identity request.
- Documented that `PROJECT_BOOTSTRAP_USER_LANGUAGE=auto` plus `PROJECT_BOOTSTRAP_CURRENT_USER_LANGUAGE=ko-KR` or `PROJECT_BOOTSTRAP_CURRENT_USER_LANGUAGE=한국어` should be set by the agent for Korean current messages; omitting the hint in auto mode records English with `missing_current_user_language_hint`.
- After the first final review found the workflow example too copyable with a hard-coded `ko-KR`, changed that example to require `AGENT_CURRENT_USER_LANGUAGE` derived from the current user message instead of forcing Korean for every conversation.
- Updated generated Korean blocker Markdown copy for GitHub auth and Git identity.

TDD evidence:
- Before implementation, `bash evals/skills/project-bootstrap-agent-setup-smoke.sh` failed on the new Korean GitHub-login sentence.
- Before implementation, `pnpm run validate:team-doc` failed on the new agent language ownership terms.

Passing verification:
- Durable command/exit-status evidence is recorded in `.evidence/reviews/20260613-project-bootstrap-language-ux-command-evidence.md`.
- After the reviewer finding fix, `bash evals/skills/project-bootstrap-agent-setup-smoke.sh` passed with exit 0.
- After the reviewer finding fix, `pnpm run validate:team-doc` passed with exit 0.
- After the reviewer finding fix, `pnpm run test:runtime` passed with exit 0.
- After the reviewer finding fix, `pnpm turbo run lint test` passed with exit 0.
- After the reviewer finding fix, `pnpm run test:local-harness` passed with exit 0.
- After the reviewer finding fix, `git diff --check` passed with exit 0.

Please verify against the approved plan, current `git diff`, command evidence, SoT boundaries, and user purpose. Return findings-first prose plus exactly one valid reviewer JSON envelope. Use supported owner values only: `Product/Planning`, `Design`, `Mobile Architect`, `Mobile App Dev`, `Backend/API Integrator`, `QA/Release`, or `human`.
