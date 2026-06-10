**최종 Verdict**

`codex-cli-auth-setup`은 role `SOUL.md`에 넣지 말고, `/workspace/skills/codex-cli-auth-setup/`의 pod-native OpenClaw skill로 유지해야 합니다. SOUL은 역할 책임/경계 문서이고, 이 내용은 특정 OpenClaw/clawpod Linux workspace의 Codex CLI 설치·인증·precheck·report 절차입니다.

**Findings**

- **High — runtime path 혼동 금지.**  
  Repo-local skill은 `.agents/skills/<skill-name>/SKILL.md`이고 OpenClaw pod skill은 `/workspace/skills/<slug>/SKILL.md`로 분리됩니다. `AGENTS.md`도 `/workspace/skills`를 active local harness 밖으로 둡니다. 근거: [AGENTS.md](/Users/tw.kim/Documents/AGA/test/new-mobile-app/AGENTS.md:15), [AGENTS.md](/Users/tw.kim/Documents/AGA/test/new-mobile-app/AGENTS.md:53), [runtime-path-decision](/Users/tw.kim/Documents/AGA/test/new-mobile-app/team-doc/00-source/mobile-app-dev-team-1373012374/01-mobile-app-조직-1373700097/01-4-skills-1373667362/role-specific-codex-runtime-1374289964/runtime-path-decision-1374289985.md:18).

- **High — 현재 managed docs는 새 boram 사실과 불일치.**  
  `team-doc/mobile-app-dev-team/README.md`는 “OpenClaw skill은 아직 정의하지 않는다”고 하고, skills matrix도 deferred로만 둡니다. 이제 boram pod에서 실제 `/workspace/skills/codex-cli-auth-setup/`이 관찰됐으므로 문서 업데이트 필요. 근거: [README.md](/Users/tw.kim/Documents/AGA/test/new-mobile-app/team-doc/mobile-app-dev-team/README.md:25), [04-skills-and-agents-matrix.md](/Users/tw.kim/Documents/AGA/test/new-mobile-app/team-doc/mobile-app-dev-team/04-skills-and-agents-matrix.md:48).

- **High — floating latest 설치는 재현성 리스크.**  
  repo MCP들은 pin을 강제하고 `@latest`를 금지합니다. pod skill의 global Codex CLI install/update가 latest 기반이면 CLI flag/auth behavior drift가 납니다. 허용하더라도 report에 resolved package metadata, path, version을 남기고, 안정 evidence에는 explicit version/pin을 요구하세요. 현재 관찰값은 `/workspace/.npm-global/bin/codex`, `codex-cli 0.139.0`으로만 기록.

- **High — auth/no-approval guardrail은 문서에 명시 필요.**  
  SOUL과 gates 문서는 secret 출력 금지를 이미 요구합니다. `codex-cli-auth-setup` 문서에는 auth presence/mode/key names only, no token/full config 출력 금지, redacted doctor/precheck만 허용한다고 적어야 합니다. no-approval bypass는 기본 disabled로 보고하고, 명시 요청 또는 controlled harmless smoke에서만 사용해야 합니다. 근거: [06-gates-and-evidence.md](/Users/tw.kim/Documents/AGA/test/new-mobile-app/team-doc/mobile-app-dev-team/06-gates-and-evidence.md:30), [mobile-app-dev-soul.md](/Users/tw.kim/Documents/AGA/test/new-mobile-app/team-doc/mobile-app-dev-team/02-role-souls/mobile-app-dev-soul.md:155).

- **Medium — Codex vs Claude Code 분리 유지.**  
  Claude Code 관찰값(`/usr/bin/claude`, `2.1.128`)은 co-installed tool fact로만 보고하고 Codex runtime 근거로 쓰면 안 됩니다. repo는 root Claude runtime artifacts를 active Codex runtime에서 배제하고, headless helper도 Claude fallback을 금지합니다. 근거: [PROJECT_ENVIRONMENT.md](/Users/tw.kim/Documents/AGA/test/new-mobile-app/PROJECT_ENVIRONMENT.md:236), [scripts/validate-runtime-artifacts.mjs](/Users/tw.kim/Documents/AGA/test/new-mobile-app/scripts/validate-runtime-artifacts.mjs:393).

**Exact Doc Update Direction**

- `team-doc/mobile-app-dev-team/04-skills-and-agents-matrix.md`: “Deferred OpenClaw Skills”를 “Observed pod-native OpenClaw skills, not repo-local skills”로 바꾸고 `codex-cli-auth-setup` 행 추가. Path는 `/workspace/skills/codex-cli-auth-setup/SKILL.md`, evidence는 `orbstack / clawpod/boram-vf7sbm-agent-0 / agent container`만 사용.

- `README.md`, `00-sot-and-principles.md`: OpenClaw skill은 active `.agents/skills`가 아니며, 관찰된 pod-native skill은 별도 섹션에서만 추적한다고 정정.

- `06-gates-and-evidence.md`: Codex CLI setup evidence 항목 추가: version/path, package metadata, SKILL/script/template presence, redacted doctor/precheck, auth presence/mode/key names only, no-approval status, harmless smoke command/exit status.

- `99-source-map.md`: boram agent-container observation을 current external runtime evidence로 추가. canary-pp, ontology-bridge는 넣지 않음.

- `scripts/validate-team-doc.mjs`: `04-skills-and-agents-matrix.md`에 `codex-cli-auth-setup`, `/workspace/skills/codex-cli-auth-setup/SKILL.md`, “not active repo-local skill” 계열 문구가 없으면 실패하도록 추가. 단 `evals/local-harness/sot/snapshot.json`의 `allowedNativeDevSkills`에는 추가하지 마세요.