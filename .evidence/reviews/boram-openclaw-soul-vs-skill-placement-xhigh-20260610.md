canary-pp-* evidence was excluded. I used only your live boram `agent` container observation plus repo SoT docs. `ontology-bridge` is excluded as an agent runtime basis.

**Findings**
- **High:** Detailed Codex CLI install/auth/doctor/smoke/runbook instructions should not live in role `SOUL.md`. SOUL is the role operating contract: identity, judgment boundaries, handoffs, prohibitions, and fixed sections. Source: [soul-base-template.md](/Users/tw.kim/Documents/AGA/test/new-mobile-app/team-doc/10-structured/04-soul-contracts/soul-base-template.md:11), [soul-base-template.md](/Users/tw.kim/Documents/AGA/test/new-mobile-app/team-doc/10-structured/04-soul-contracts/soul-base-template.md:15).
- **High:** Runtime path confusion is explicitly unsafe. Native Codex repo skills are `.agents/skills`; generated-agent pod skills are `/workspace/skills`; Boram-like pods do not load `.agents/skills` directly. Source: [role-specific-codex-runtime](/Users/tw.kim/Documents/AGA/test/new-mobile-app/team-doc/00-source/mobile-app-dev-team-1373012374/01-mobile-app-조직-1373700097/01-4-skills-1373667362/role-specific-codex-runtime-1374289964.md:23), [runtime-path-decision](/Users/tw.kim/Documents/AGA/test/new-mobile-app/team-doc/00-source/mobile-app-dev-team-1373012374/01-mobile-app-조직-1373700097/01-4-skills-1373667362/role-specific-codex-runtime-1374289964/runtime-path-decision-1374289985.md:18), [runtime-evaluation](/Users/tw.kim/Documents/AGA/test/new-mobile-app/team-doc/00-source/mobile-app-dev-team-1373012374/01-mobile-app-조직-1373700097/01-4-skills-1373667362/role-specific-codex-runtime-1374289964/runtime-evaluation-and-ci-gate-1374355541.md:31).
- **Medium:** Current managed docs still say OpenClaw skills are deferred, while live boram already has `/workspace/skills/*`. That needs a new “observed generated-agent pod skills” section, not a blanket deferred statement. Source: [04-skills-and-agents-matrix.md](/Users/tw.kim/Documents/AGA/test/new-mobile-app/team-doc/mobile-app-dev-team/04-skills-and-agents-matrix.md:48).
- **Medium:** Validators cover repo-native `.agents/skills` and managed-doc skill slugs, but not the boram `/workspace/skills` placement rule or ontology/canary exclusions. Source: [validate-runtime-artifacts.mjs](/Users/tw.kim/Documents/AGA/test/new-mobile-app/scripts/validate-runtime-artifacts.mjs:128), [validate-team-doc.mjs](/Users/tw.kim/Documents/AGA/test/new-mobile-app/scripts/validate-team-doc.mjs:165).

**Verdict**
For OpenClaw generated-agent pods like `boram-*`, detailed “how to use Codex CLI” instructions belong in OpenClaw skills under `/workspace/skills/<slug>/SKILL.md`. The live boram `codex-cli-auth-setup` skill is exactly the right placement for install/verify/run, safe auth, `codex doctor`, and smoke-test workflow.

Role `SOUL.md` should reference those skills and define when/why to use them, but should not duplicate their procedural content.

**Minimal SOUL.md Content**
Keep only:
- assigned role, responsibilities, decision authority, boundaries;
- assigned CLI/tool family, e.g. “use Codex CLI as assigned”;
- skill references by slug, e.g. `codex-cli-auth-setup`, not full runbooks;
- safety rules: no secret exposure, no image/platform/runtime modification, report missing skills as blocked;
- repo-context pointer: when inside `new-mobile-app`, follow root `AGENTS.md` and repo-local `.agents/skills`.

**Doc Changes Needed**
In `04-skills-and-agents-matrix.md`:
- split “Native Codex repo-local skills” from “OpenClaw generated-agent pod skills”;
- list boram-observed pod skills separately: `cli-anything`, `codex-cli-auth-setup`, `desktop`, `tasks`;
- clarify `codex-cli-auth-setup` owns Codex CLI auth/install/doctor/smoke workflow for pods.

In `99-source-map.md`:
- add live boram observation as local OrbStack evidence: context, pod, `container=agent`, image, `/workspace/SOUL.md`, `/workspace/skills`;
- mark `ontology-bridge` as excluded-only;
- mark `canary-pp-*` as excluded evidence;
- state OrbStack observation is not EKS production proof.

**Validator Guardrails**
Add checks that:
- managed docs distinguish `.agents/skills` from `/workspace/skills`;
- role SOUL files may name skill slugs but must not contain Codex CLI runbook terms like `codex doctor`, auth JSON paths, or smoke-test procedures;
- current managed docs cannot cite `canary-pp-*` as evidence;
- `ontology-bridge` is allowed only in excluded-observation notes;
- `04-skills-and-agents-matrix.md` and `99-source-map.md` contain the generated-agent pod skill placement caveat.

**Caveats**
Boram is valid local OrbStack runtime observation for the `agent` container only. It does not prove EKS production parity. EKS needs separate evidence with context, namespace, pod, container, image digest, and file observations.