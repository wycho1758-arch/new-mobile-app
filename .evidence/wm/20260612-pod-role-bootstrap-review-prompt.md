# wm final review prompt: pod-role-bootstrap environment audit

Review mode: final.

Scope:
- Target skill: `mobile-app-dev-team/09-pod-native-openclaw-skills/pod-role-bootstrap/SKILL.md`.
- Supporting script/template: `mobile-app-dev-team/09-pod-native-openclaw-skills/pod-role-bootstrap/scripts/pod-bootstrap.sh`, `mobile-app-dev-team/09-pod-native-openclaw-skills/pod-role-bootstrap/references/report-template.md`.
- SoT inputs reviewed: `AGENTS.md`, `REPO_OPERATIONS.md`, `PROJECT_ENVIRONMENT.md`, `docs/CODEX_MCP_ENVIRONMENT.md`, `mobile-app-dev-team/16-pod-environment-bootstrap.md`, `scripts/codex-preflight.mjs`, `scripts/validate-team-doc.mjs`, `scripts/validate-project-environment.mjs`.

Question to review:
1. Is `pod-role-bootstrap` SoT-aligned as a pod checkout/bootstrap readiness skill?
2. If an OpenClaw Pod(agent) uses this skill, does the current project become fully working?
3. Does `PROJECT_ENVIRONMENT.md` need reinforcement or correction?

Key source facts:
- `AGENTS.md:5` says pod-native OpenClaw skills use `/workspace/skills/<slug>/SKILL.md` at runtime and are authored under `mobile-app-dev-team/09-pod-native-openclaw-skills/<slug>/`.
- `AGENTS.md:42-46` defines Expo SDK 56, required sync to `PROJECT_ENVIRONMENT.md`, and mobile-mcp as required local visual QA/device automation.
- `AGENTS.md:104-110` requires `pnpm turbo run lint test`, `pnpm run test:runtime`, `pnpm run test:local-harness` for Codex runtime changes, and for mobile environment/runtime changes also `expo install --check`, mobile lint/test/doctor, and `codex mcp list`.
- `REPO_OPERATIONS.md:78-90` defines pod-native skill runtime and current repo checkout path as `/workspace/new-mobile-app/`.
- `REPO_OPERATIONS.md:138-140` says local validation and harness do not prove actual OrbStack/OpenClaw pod execution or external platform state.
- `PROJECT_ENVIRONMENT.md:27-34` records current Expo-related package versions: `expo ~56.0.9`, `expo-router ~56.2.9`, `expo-dev-client ~56.0.19`.
- `PROJECT_ENVIRONMENT.md:84-97` states native completion remains separate and requires Maestro/mobile-mcp or human-device evidence; offline EAS fixture ingest does not prove native readiness.
- `PROJECT_ENVIRONMENT.md:329-333` documents `scripts/codex-preflight.mjs --pod` scope: role identity, Node 22, pnpm pin, Codex CLI candidate, git identity, GitHub auth status, RN Web capability, `.codex/config.toml`, `codex mcp list`, native local E2E false, and no proof of actual OpenClaw/native/external service behavior.
- `pod-role-bootstrap/SKILL.md:30-32` explicitly says the skill is not proof that OrbStack, OpenClaw, GitHub branch protection, EAS, Confluence, webhook, or native device behavior works.
- `pod-role-bootstrap/SKILL.md:101-111` Done When is role resolution, checkout, managed path, pnpm install, pod preflight exit 0, report written, status/capability summaries only.
- `pod-bootstrap.sh:4-7` defaults `REPO_PATH=/workspace/new-mobile-app`, report under `/workspace/state`, pnpm 9.15.9, and managed paths under `/workspace/CODEX_MANAGED_PATHS.md`.
- `pod-bootstrap.sh:145-150` runs corepack/pnpm install and then `node scripts/codex-preflight.mjs --pod --json`.

Commands run:
- `node --version && pnpm --version && bash -n .../pod-bootstrap.sh`: PASS, output `v23.11.0`, `9.15.9`, bash syntax OK.
- `node scripts/codex-preflight.mjs --self-test --json`: PASS, all 14 preflight fixtures OK.
- `WM_ROLE=mobile-app-dev WM_EXPECTED_ROLE=mobile-app-dev node scripts/codex-preflight.mjs --pod --json --no-write`: FAIL/BLOCKED in this local non-pod shell; accepted Codex `/opt/homebrew/bin/codex`, pnpm matches, but Node major is 23 not 22, `codex mcp list` unavailable, RN Web Chromium unavailable, EAS missing, native E2E false.
- `pnpm run validate:project-environment`: PASS.
- `pnpm run validate:team-doc`: PASS.
- `pnpm run test:runtime`: PASS.
- `pnpm turbo run lint test`: PASS, all 7 tasks successful.
- `pnpm run test:local-harness`: PASS, `local harness all passed`.
- `pnpm --filter mobile lint`: PASS.
- `pnpm --filter mobile test`: PASS, 2 suites and 5 tests passed.
- `pnpm --filter mobile exec expo install --check`: FAIL. Expected package versions include `@expo/metro-runtime ~56.0.15`, `expo ~56.0.11`, `expo-dev-client ~56.0.20`, `expo-linking ~56.0.14`, `expo-router ~56.2.10`, `jest-expo ~56.0.5`; found older patch versions.
- `pnpm --filter mobile run doctor`: FAIL for same Expo package patch mismatches.
- `codex mcp list`: did not produce output in this local shell invocation and exited non-zero/timed out; pod preflight also reported `codex_mcp` missing.
- `git status --short`: clean after audit evidence prompt creation was not part of the initial source review; check current status separately.

Expected verdict:
- Report findings first.
- Do not modify source files.
- Determine if the project is fully working after `pod-role-bootstrap`.
- Include whether `PROJECT_ENVIRONMENT.md` needs reinforcement/correction.
- For reviewer JSON findings, use supported owner values only. Use `Mobile App Dev` for bootstrap/mobile-runtime findings.
