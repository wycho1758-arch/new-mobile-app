# Pod-side doc/skill realignment plan review prompt

Review mode: plan.

Question: Review `/Users/tw.kim/.claude/plans/graceful-orbiting-coral.md` against current repo SoT and observed Boram pod state. Decide whether proceeding with the planned repo-scoped updates would improve the pod-side readiness docs/skills/validators, and identify blockers or scope corrections before implementation.

Use read-only review. Do not edit files. Cite sources. Do not recursively delegate.

## Verified SoT

- `AGENTS.md:5` says pod-native OpenClaw skill runtime shape is `/workspace/skills/<slug>/SKILL.md` and source location is `mobile-app-dev-team/09-pod-native-openclaw-skills/<slug>/`.
- `AGENTS.md:13` requires tests or validators before implementation changes.
- `AGENTS.md:55` through `AGENTS.md:60` define local harness limits; it does not prove actual OpenClaw packaging or pod behavior.
- `REPO_OPERATIONS.md:76` through `REPO_OPERATIONS.md:91` define pod-native skill source boundaries, Codex-only repo work policy, `/workspace/CODEX_MANAGED_PATHS.md`, `/workspace/projects/Wondermove-Inc/new-mobile-app/`, and `/workspace/codex-hooks/codex-run`.
- `REPO_OPERATIONS.md:135` through `REPO_OPERATIONS.md:140` says runtime path or harness changes require `test:local-harness`, but local validation does not prove actual OrbStack/OpenClaw pod execution.
- `PROJECT_ENVIRONMENT.md:9` says package manager pin is `pnpm@9.15.9`.
- `PROJECT_ENVIRONMENT.md:88` through `PROJECT_ENVIRONMENT.md:97` define the mobile evidence ladder and `eas-evidence/v1`.
- `PROJECT_ENVIRONMENT.md:218` through `PROJECT_ENVIRONMENT.md:225` define `$wm` SoT-grounded planning, read-only review routing, no write-capable delegation, and required plan/final review evidence.
- `PROJECT_ENVIRONMENT.md:246` through `PROJECT_ENVIRONMENT.md:260` define allowed read-only reviewers and Codex MCP config paths.
- `.codex/config.toml:1` through `.codex/config.toml:12` pin mobile-mcp, Serena, and Stitch MCP.

## Current repo observations

- `mobile-app-dev-team/04-skills-and-agents-matrix.md:49` through `mobile-app-dev-team/04-skills-and-agents-matrix.md:51` still says OpenClaw skills are intentionally deferred, contradicting current repo SoT and existing `09-pod-native-openclaw-skills`.
- `mobile-app-dev-team/09-pod-native-openclaw-skills/README.md:11` through `mobile-app-dev-team/09-pod-native-openclaw-skills/README.md:16` list only `codex-cli-auth-setup` and `pod-role-bootstrap`; no per-role required skill matrix exists.
- `mobile-app-dev-team/09-pod-native-openclaw-skills/pod-role-bootstrap/scripts/pod-bootstrap.sh:37` through `mobile-app-dev-team/09-pod-native-openclaw-skills/pod-role-bootstrap/scripts/pod-bootstrap.sh:40` hard-fail when `/workspace/projects/Wondermove-Inc/new-mobile-app` is missing.
- Focused search found no `pod-role-bootstrap`, `status.json`, `evidence_ladder`, `human-gate/v1`, `wm-orchestrate`, `eas-evidence/v1`, `eas-robot-auth-setup`, `stitch-adc-setup`, `preflight --pod`, or `docs/plans/work-units` terms in the six files under `mobile-app-dev-team/02-role-souls/`.
- `rg -n "team-doc/mobile-app-dev-team|/workspace/repo\b" mobile-app-dev-team docs/CODEX_MCP_ENVIRONMENT.md` found `/workspace/repo` in `mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md:322`.
- `pnpm run validate:team-doc` currently exits 0, so existing validation does not catch the above drift.

## Observed Boram pod state

Observed via read-only `kubectl` commands against `clawpod/boram-vf7sbm-agent-0`, `agent` container:

- Pod exists and is running; containers are `agent` and `ontology-bridge`.
- `/workspace/skills` contains `codex-cli-auth-setup` plus generic `cli-anything`, `desktop`, and `tasks`; it does not contain `pod-role-bootstrap`, `eas-robot-auth-setup`, or `stitch-adc-setup`.
- `/workspace/AGENTS.md`, `/workspace/CODEX_MANAGED_PATHS.md`, `/workspace/IDENTITY.md`, `/workspace/SOUL.md`, and `/workspace/TOOLS.md` exist.
- `/workspace/codex-hooks/codex-run` and related hook files exist.
- `/workspace/projects/Wondermove-Inc/new-mobile-app` is missing.
- `/workspace/CODEX_MANAGED_PATHS.md` contains only the template comments and no `/workspace/projects/Wondermove-Inc/new-mobile-app/` entry.
- `/workspace/skills/codex-cli-auth-setup/SKILL.md` is older than repo source: it installs `@openai/codex@latest` and does not include the current repo-specific Codex-managed path policy.

## External plan summary

The plan at `/Users/tw.kim/.claude/plans/graceful-orbiting-coral.md` proposes:

- Add validator RED coverage for new pod-native skills, per-role skill matrix, role SOUL runtime terms, pod clone-on-demand, doc 16, `/workspace/repo` removal, and no hardcoded secrets.
- Add pod-native skills `eas-robot-auth-setup` and `stitch-adc-setup`.
- Update `pod-role-bootstrap` to support repo clone-on-demand with secret-safe GitHub status checks.
- Update six role souls with pod bootstrap and durable work-unit routing.
- Add `mobile-app-dev-team/16-pod-environment-bootstrap.md`.
- Align `docs/CODEX_MCP_ENVIRONMENT.md`, `04-skills-and-agents-matrix.md`, `13-pod-organization-e2e-improvement-plan.md`, `README.md`, and `99-source-map.md`.
- Keep `.codex/**`, `.agents/**`, pod runtime, and external platform settings unchanged.

## Review focus

1. Does proceeding with this plan have a clear positive effect compared with current repo and pod state?
2. Are the planned changes properly repo-scoped and consistent with `$wm` and AGENTS rules?
3. Is the TDD/validator-first strategy sufficient?
4. What must be corrected before implementation?
