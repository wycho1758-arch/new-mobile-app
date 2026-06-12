Read-only review completed. I did not modify files.

**Findings**
- **HIGH:** `team-doc/mobile-app-dev-team/04-skills-and-agents-matrix.md` still says OpenClaw skills are deferred, but the source runtime decision says OpenClaw generated-agent skills live at `/workspace/skills/<slug>/SKILL.md`. This conflicts with current OrbStack `boram-*` and canary observations. See [04-skills-and-agents-matrix.md:48](/Users/tw.kim/Documents/AGA/test/new-mobile-app/team-doc/mobile-app-dev-team/04-skills-and-agents-matrix.md:48), [runtime-path-decision:18](/Users/tw.kim/Documents/AGA/test/new-mobile-app/team-doc/00-source/mobile-app-dev-team-1373012374/01-mobile-app-조직-1373700097/01-4-skills-1373667362/role-specific-codex-runtime-1374289964/runtime-path-decision-1374289985.md:18), [role-specific runtime:25](/Users/tw.kim/Documents/AGA/test/new-mobile-app/team-doc/00-source/mobile-app-dev-team-1373012374/01-mobile-app-조직-1373700097/01-4-skills-1373667362/role-specific-codex-runtime-1374289964.md:25).
- **HIGH:** Do not base the plan on the old “package:openclaw-skills/test:openclaw” flow. That report references scripts that are absent now; current repo says OpenClaw packaging paths are outside active local harness and should not be restored without new SoT. See [package.json:14](/Users/tw.kim/Documents/AGA/test/new-mobile-app/package.json:14), [AGENTS.md:51](/Users/tw.kim/Documents/AGA/test/new-mobile-app/AGENTS.md:51), [PROJECT_ENVIRONMENT.md:299](/Users/tw.kim/Documents/AGA/test/new-mobile-app/PROJECT_ENVIRONMENT.md:299).
- **MEDIUM:** Boram is valid runtime-path evidence, not mobile role-content SoT. Its live `/workspace/SOUL.md` is CTO-oriented, while the mobile team SoT forbids CTO as a runtime role. Use Boram only to prove generated-agent mechanics: `agent` container, `/workspace/SOUL.md`, `/workspace/skills`, Codex/Claude binaries.
- **MEDIUM:** OrbStack evidence is not EKS production parity. Local harness explicitly does not validate `/workspace/skills` pod runtime; production/EKS needs its own agent-container evidence. See [evals/local-harness/README.md:20](/Users/tw.kim/Documents/AGA/test/new-mobile-app/evals/local-harness/README.md:20).

**Verdict**
Codex CLI operational instructions for generated-agent pods should live as OpenClaw runtime skills under `/workspace/skills/<slug>/SKILL.md`, not as full procedures inside role `SOUL.md`.

Precise split:
- Native Codex in this repo: `.agents/skills/<slug>/SKILL.md`, `.codex/agents/<agent>.toml`.
- OpenClaw generated-agent pod: `/workspace/skills/<slug>/SKILL.md`.
- `SOUL.md`: role identity, authority, boundaries, human gates, evidence/gate rules, and a short routing pointer to the assigned runtime skills. No long Codex install/auth/run workflow in SOUL.

Minimal SOUL content should say: use assigned CLI/tooling, follow the relevant `SKILL.md` when present, request bootstrap for missing tools, do not edit platform/image/runtime, and never expose secrets.

**Team-doc Changes**
- Update `04-skills-and-agents-matrix.md`: replace “Deferred OpenClaw Skills” with a generated-agent runtime section distinguishing observed OrbStack skills from repo-native `.agents/skills`.
- Update `99-source-map.md`: add `Role-specific Codex Runtime`, `Runtime Path Decision`, first-agent canary plan/guide, and mark the old package-script report as stale/lower-priority.
- Role SOUL docs should keep only skill slugs/routing pointers, not skill bodies.
- Canary docs should remain OrbStack evidence, not production proof.

**Validator Guardrails**
- Fail path confusion between `.agents/skills`, `.codex/agents`, and `/workspace/skills`.
- Require each runtime artifact to declare target runtime: native Codex, OpenClaw generated-agent, or dual.
- For `/workspace/skills`: require slug validation, `SKILL.md`, path traversal rejection, agent-container install/load evidence, and secret-safe auth checks.
- Reject stale references to removed package scripts unless a new SoT reintroduces them.
- Require evidence to specify `kubectl context`, pod, and `container=agent`; exclude `ontology-bridge` from instruction-loading claims.