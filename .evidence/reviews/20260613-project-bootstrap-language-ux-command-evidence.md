# project-bootstrap language UX command evidence

Date: 2026-06-13
Branch: `fix/project-bootstrap-agent-language-ux`

## Red-stage evidence

Command:

```sh
bash evals/skills/project-bootstrap-agent-setup-smoke.sh
```

Result: exit 1

Key output:

```text
assertion failed: expected ... project-bootstrap-blockers.md to contain 제가 GitHub 로그인 화면을 열어드리면, 사용자는 그 화면에서 로그인하고 승인만 해주세요. 이후 연결 확인과 재검사는 제가 처리합니다.
```

Command:

```sh
pnpm run validate:team-doc
```

Result: exit 1

Key output:

```text
missing required terms for project-bootstrap language ownership in:
- mobile-app-dev-team/09-pod-native-openclaw-skills/project-bootstrap/SKILL.md
- mobile-app-dev-team/09-pod-native-openclaw-skills/project-bootstrap/references/blocker-resolution-guide.md
- mobile-app-dev-team/09-pod-native-openclaw-skills/project-bootstrap/references/report-template.md
- mobile-app-dev-team/09-pod-native-openclaw-skills/project-bootstrap/scripts/project-bootstrap-preflight.sh
required terms:
- agent running project-bootstrap-preflight.sh sets PROJECT_BOOTSTRAP_CURRENT_USER_LANGUAGE from the current user message
- PROJECT_BOOTSTRAP_CURRENT_USER_LANGUAGE=ko-KR
- PROJECT_BOOTSTRAP_CURRENT_USER_LANGUAGE=한국어
```

## Green-stage evidence

Command:

```sh
bash evals/skills/project-bootstrap-agent-setup-smoke.sh
```

Result: exit 0

Key output:

```text
project-bootstrap-agent-setup smoke passed
```

Command:

```sh
pnpm run validate:team-doc
```

Result: exit 0

Key output:

```text
Validated current mobile-app-dev-team managed docs.
```

Command:

```sh
pnpm run test:runtime
```

Result: exit 0

Key output:

```text
Validated 13 skills, 13 agents, and 4 hook events.
Codex headless review helper self-test passed.
Validated current mobile-app-dev-team managed docs.
Passed 44 hook fixture tests.
```

Command:

```sh
pnpm turbo run lint test
```

Result: exit 0

Key output:

```text
Tasks:    7 successful, 7 total
```

Command:

```sh
pnpm run test:local-harness
```

Result: exit 0

Key output:

```text
clean-tree-guard self-test passed
codex-preflight self-test passed
self-test all passed
local harness all passed
```

Command:

```sh
git diff --check
```

Result: exit 0

Key output:

```text
<no output>
```

## Reviewer finding fix evidence

Final reviewer initially returned `NO_GO` because the general workflow example in
`project-bootstrap/SKILL.md` showed `PROJECT_BOOTSTRAP_CURRENT_USER_LANGUAGE="ko-KR"`
as a copyable default. The example was changed so it requires an
agent-derived `AGENT_CURRENT_USER_LANGUAGE` value from the current user message
instead of hard-coding Korean for every conversation.

Command:

```sh
bash evals/skills/project-bootstrap-agent-setup-smoke.sh
```

Result: exit 0

Key output:

```text
project-bootstrap-agent-setup smoke passed
```

Command:

```sh
pnpm run validate:team-doc
```

Result: exit 0

Key output:

```text
Validated current mobile-app-dev-team managed docs.
```

Command:

```sh
git diff --check
```

Result: exit 0

Key output:

```text
<no output>
```

Command:

```sh
pnpm run test:runtime
```

Result: exit 0

Key output:

```text
Validated 13 skills, 13 agents, and 4 hook events.
Codex headless review helper self-test passed.
Validated current mobile-app-dev-team managed docs.
Passed 44 hook fixture tests.
```

Command:

```sh
pnpm turbo run lint test
```

Result: exit 0

Key output:

```text
Tasks:    7 successful, 7 total
```

Command:

```sh
pnpm run test:local-harness
```

Result: exit 0

Key output:

```text
clean-tree-guard self-test passed
codex-preflight self-test passed
self-test all passed
local harness all passed
```
