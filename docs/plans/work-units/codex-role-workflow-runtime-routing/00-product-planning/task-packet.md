# Codex Role Workflow Runtime Routing Integration Plan

## 001. Document Control

001. Plan id: `20260614-codex-role-workflow-runtime-routing`.
002. Date: 2026-06-14.
003. Repository: `new-mobile-app`.
004. Local path: `/Users/tw.kim/Documents/AGA/test/new-mobile-app`.
005. Planning owner role: Product/Planning.
006. Primary implementation owner for future edits: Product/Planning for planning/process docs and pod-native skill text.
007. Supporting implementation owner for future validator changes: Mobile App Dev or repo runtime maintainer under `$wm`.
008. Supporting review owners: `po-planning-reviewer`, `po-scope-gate-reviewer`, and `wm-implementation-reviewer` when validator/runtime behavior changes.
009. This document is a plan, not an implementation diff for `codex-role-workflow`.
010. This document intentionally uses the broader phrase "project requirement, project specification, work request, and planning artifact" rather than treating PRD as the only valid input form.
011. PRD is one input class under the broader project planning surface.
012. The target change must support PRDs, project requirement documents, project specification documents, feature briefs, issue reports, modification requests, direct implementation language, proactive reports, and handoff/resume requests.
013. This plan is source-grounded and names the repo SoT used for material decisions.
014. The plan exists because `codex-role-workflow` currently behaves mostly like a role-to-skill matrix.
015. The target behavior is a runtime bridge that resolves role, entry case, allowed repo-local Codex skill, reviewer, durable stage, gate state, and next action.
016. The plan preserves the status-only nature of `codex-role-workflow`.
017. The plan does not authorize implementation work, production submit, live pod mutation, live external service calls, or direct edits under `/workspace`.
018. The plan does not authorize bypassing Product/Planning intake.
019. The plan does not make Product/Planning a Design quality approver.
020. The plan does not make Codex a mere coding executor.
021. Correct concept: Codex is the repo-local role workflow substrate made of skills, custom agents, hooks, MCP config, validators, evidence, and policy.
022. This definition is grounded in repo-local paths: `.agents/skills`, `.codex/agents`, `.codex/hooks.json`, `.codex/hooks`, `.codex/config.toml`, `scripts`, `evals`, and `.evidence`.
023. The pod-native OpenClaw surface is a runtime shape under `/workspace/skills/<slug>/SKILL.md`.
024. The source-managed pod-native skill lives under `mobile-app-dev-team/runtime-sources/pod-native-openclaw-skills/<slug>/`.
025. The plan treats `/workspace/skills/codex-role-workflow` as runtime publication output, not as the primary source to edit from this repo.
026. The plan treats the root `AGENTS.md` as the source text for `/workspace/AGENTS.md`, based on the existing repo statement.
027. Directly editing `/workspace/AGENTS.md` is not the default repo-scoped implementation path.
028. A future implementation may update source-managed repo docs so bootstrap/runtime publication can produce the required `/workspace` behavior.
029. Any live pod publication remains outside repo-local proof unless approved and evidenced separately.
030. The required reviewer gate for this plan is `po-planning-reviewer` in xhigh/headless mode.

## 002. User Request Restatement

031. The user invoked `$wm`, so the WonderMove repo workflow applies.
032. The user requested a detailed plan before implementation.
033. The user required the plan to be created as a document first.
034. The user required the document to be at least 500 lines.
035. The user required the plan to be checked against SoT.
036. The user required reviewer(xhigh) inspection after writing the plan.
037. The user provided prior analysis that `Codex = 단순 구현자` is inaccurate.
038. The user provided the corrected framing that Codex is a repo-local skills, agents, hooks, MCP, evidence, and policy substrate.
039. The user specifically referenced `codex-role-workflow`.
040. The user specifically referenced Product/Planning use of `po-*` repo-local Codex skills.
041. The user specifically referenced Codex custom agents such as `po-planning-reviewer`.
042. The user specifically referenced Codex hooks.
043. The user specifically referenced `/workspace/AGENTS.md`.
044. The user specifically referenced `/workspace/skills/codex-role-workflow`.
045. The user asked that "PRD" be treated as part of broader project requirement and project specification workflows.
046. This means the target rule must not only say "when a PRD arrives".
047. It must say "when a project requirement, project specification, PRD, feature brief, issue, modification request, or role workflow request arrives".
048. The target rule must start with Product/Planning intake unless already in an accepted downstream work-unit state.
049. The target rule must make `codex-role-workflow` operational, not merely documentary.
050. The target rule must preserve the difference between source-managed repo artifacts and pod runtime artifacts.

## 003. Source Of Truth Read For This Plan

051. Root execution rules: `AGENTS.md`.
052. Repo policy ownership: `REPO_OPERATIONS.md`.
053. Runtime facts and Codex substrate inventory: `PROJECT_ENVIRONMENT.md`.
054. Current pod-native bridge: `mobile-app-dev-team/runtime-sources/pod-native-openclaw-skills/codex-role-workflow/SKILL.md`.
055. Entry taxonomy and routing: `mobile-app-dev-team/workflows/entry-case-routing.md`.
056. Work process lifecycle: `mobile-app-dev-team/workflows/work-processes.md`.
057. Gates and evidence: `mobile-app-dev-team/governance/gates-and-evidence.md`.
058. Durable pod handoff: `mobile-app-dev-team/workflows/github-artifact-workflow.md`.
059. App/EAS/OTA rollback: `mobile-app-dev-team/governance/app-eas-ota-rollback-runbook.md`.
060. Pod environment bootstrap: `mobile-app-dev-team/runtime-sources/pod-environment-bootstrap.md`.
061. Product/Planning office-hours skill: `.agents/skills/po-requirement-office-hours/SKILL.md`.
062. Product/Planning work-unit planning skill: `.agents/skills/po-work-unit-planning-and-agent-sprint/SKILL.md`.
063. Product/Planning PRD/project-spec decomposition skill: `.agents/skills/po-prd-to-execution/SKILL.md`.
064. Product/Planning completeness review skill: `.agents/skills/po-planning-completeness-review/SKILL.md`.
065. Design handoff skill: `.agents/skills/design-mobile-design-handoff/SKILL.md`.
066. Design Stitch operating rules skill: `.agents/skills/design-stitch-mcp-operating-rules/SKILL.md`.
067. Mobile Architect workflow skill: `.agents/skills/mobile-architect-workflow/SKILL.md`.
068. Backend/API Integrator workflow skill: `.agents/skills/mobile-backend-api-integrator-workflow/SKILL.md`.
069. Mobile App Dev workflow skill: `.agents/skills/mobile-app-dev-workflow/SKILL.md`.
070. QA E2E skill: `.agents/skills/e2e-test/SKILL.md`.
071. QA Railway workflow skill: `.agents/skills/qa-railway-workflow/SKILL.md`.
072. Work-unit status validator and machine: `scripts/lib/work-unit-machine.mjs`.
073. Headless reviewer helper: `scripts/codex-headless-review.mjs`.
074. Custom reviewer agents under `.codex/agents`.
075. Hooks under `.codex/hooks.json` and `.codex/hooks/*.mjs`.
076. The plan is not grounded in hidden memory.
077. The plan is not grounded in live Confluence freshness.
078. The plan is not grounded in live OpenClaw pod state.
079. The plan is not grounded in external `/workspace` inspection.
080. The plan is grounded in checked repo-local files.

## 004. Key SoT Findings

081. `AGENTS.md` says pod-native OpenClaw skill-only requests use `/workspace/skills/<slug>/SKILL.md` as runtime shape.
082. `AGENTS.md` says pod-native OpenClaw skill sources are authored under `mobile-app-dev-team/runtime-sources/pod-native-openclaw-skills/<slug>/`.
083. `AGENTS.md` says Codex skill or agent requests use `.agents/skills/<skill-name>/SKILL.md` and `.codex/agents/<agent-name>.toml`.
084. `AGENTS.md` says `/workspace/AGENTS.md` source text is represented in the repo-local `AGENTS.md`.
085. `AGENTS.md` says the default OpenClaw checkout path is `/workspace/projects/Wondermove-Inc/new-mobile-app`.
086. `AGENTS.md` forbids using `/workspace` root as the project repo directory.
087. `AGENTS.md` says TDD is required for implementation changes.
088. `AGENTS.md` forbids hardcoded customer app names, bundle IDs, API URLs, tokens, or credentials.
089. `AGENTS.md` forbids modifying external platform/runtime repositories from this repository.
090. `AGENTS.md` identifies `.agents`, `.codex`, `evals`, and `scripts` as Codex runtime layer paths.
091. `AGENTS.md` says Codex runtime changes must pass `pnpm run test:runtime`.
092. `AGENTS.md` says runtime path/local harness changes must pass `pnpm run test:local-harness`.
093. `AGENTS.md` says local harness does not prove live OpenClaw, GitHub branch protection, EAS, production submit, or external platform behavior.
094. `REPO_OPERATIONS.md` says `AGENTS.md` owns mandatory agent execution rules.
095. `REPO_OPERATIONS.md` says `PROJECT_ENVIRONMENT.md` owns current runtime facts.
096. `REPO_OPERATIONS.md` says `mobile-app-dev-team/` owns team, role, process, reference, and migration documentation.
097. `REPO_OPERATIONS.md` says pod-native OpenClaw skills use `/workspace/skills/<slug>/SKILL.md` at runtime.
098. `REPO_OPERATIONS.md` says those skills are authored under `mobile-app-dev-team/runtime-sources/pod-native-openclaw-skills/`.
099. `REPO_OPERATIONS.md` says repo-local Codex skills and agents use `.agents/skills` and `.codex/agents`.
100. `REPO_OPERATIONS.md` says OpenClaw pods operating on Codex-managed repositories should route repo work through Codex CLI.
101. `REPO_OPERATIONS.md` says reports must not print or commit tokens or full secret-bearing config.
102. `REPO_OPERATIONS.md` defines skill, custom agent, and AGENTS.md as distinct concepts.
103. `PROJECT_ENVIRONMENT.md` records `$wm` planning, reviewer, checkpoint, and evidence rules.
104. `PROJECT_ENVIRONMENT.md` records Product/Planning `po-*` adapter slugs.
105. `PROJECT_ENVIRONMENT.md` records Design `design-*` adapter slugs.
106. `PROJECT_ENVIRONMENT.md` records custom reviewer routing through dedicated `wm-*`, `po-*`, and `design-*` agents.
107. `PROJECT_ENVIRONMENT.md` records Codex hooks as `.codex/hooks.json` and `.codex/hooks/*.mjs`.
108. `PROJECT_ENVIRONMENT.md` records MCP config as `.codex/config.toml`.
109. `PROJECT_ENVIRONMENT.md` records `codex-headless-review.mjs` as the high-reasoning Codex-only review helper.
110. `codex-role-workflow` currently declares itself a status-only role bridge.
111. `codex-role-workflow` currently says it tells the role pod which repo-local Codex skills and reviewers are allowed next.
112. `codex-role-workflow` currently resolves role identity from `WM_ROLE`, `/workspace/IDENTITY`, and pod SOUL.
113. `codex-role-workflow` currently blocks if those role identity sources disagree.
114. `codex-role-workflow` currently lists runtime paths for pod-native skill source, pod runtime shape, repo-local skills, and repo-local agents.
115. `codex-role-workflow` currently has a Role Matrix.
116. The Product/Planning row allows `po-requirement-office-hours`, `po-work-unit-planning-and-agent-sprint`, `po-prd-to-execution`, and `po-planning-completeness-review`.
117. The Product/Planning row names `po-planning-reviewer` and `po-scope-gate-reviewer`.
118. The Product/Planning row names durable artifact stage `00-product-planning`.
119. The Design row allows `design-mobile-design-handoff` and `design-stitch-mcp-operating-rules`.
120. The Design row names `design-reviewer` and `po-planning-reviewer`.
121. The Design row names durable artifact stage `01-design`.
122. The Mobile Architect row allows `mobile-architect-workflow`.
123. The Mobile App Dev row allows `mobile-app-dev-workflow`.
124. The Backend/API Integrator row allows `mobile-backend-api-integrator-workflow`.
125. The QA/Release row allows `e2e-test` and `qa-railway-workflow`.
126. `codex-role-workflow` currently says to confirm role identity and accepted SoT before recommending a repo-local skill.
127. `codex-role-workflow` currently says to confirm the request belongs to the resolved role.
128. `codex-role-workflow` currently says to return allowed skill, reviewer, and durable artifact stage.
129. `codex-role-workflow` currently blocks out-of-role work.
130. `codex-role-workflow` currently blocks human gates, failed-gate risk acceptance, production submit, billing, privacy, legal, or external proof decisions until required human approval.
131. `codex-role-workflow` currently blocks secret exposure.
132. `codex-role-workflow` currently reminds the role pod about reviewer evidence, `git diff`, and `git status --short`.
133. `codex-role-workflow` currently returns `codex-role-workflow/v1`.
134. `codex-role-workflow` currently uses statuses `ready`, `blocked`, and `not_applicable`.
135. `codex-role-workflow` currently lacks explicit `entry_case` output.
136. `codex-role-workflow` currently lacks explicit routing reason output.
137. `codex-role-workflow` currently lacks a compact `mobile-app-dev-team/workflows/entry-case-routing.md` operational overlay.
138. `codex-role-workflow` currently lacks explicit project requirement/project specification input language.
139. `codex-role-workflow` currently lacks explicit Codex substrate definition.
140. `codex-role-workflow` currently lacks explicit hook/evidence substrate awareness.
141. `mobile-app-dev-team/workflows/entry-case-routing.md` says every user input enters Product/Planning intake first.
142. `mobile-app-dev-team/workflows/entry-case-routing.md` says no input routes directly to an execution role.
143. `mobile-app-dev-team/workflows/entry-case-routing.md` maps unclear input to `po-requirement-office-hours`.
144. `mobile-app-dev-team/workflows/entry-case-routing.md` maps broad input to `po-work-unit-planning-and-agent-sprint`.
145. `mobile-app-dev-team/workflows/entry-case-routing.md` maps ready input to `po-prd-to-execution`.
146. `mobile-app-dev-team/workflows/entry-case-routing.md` maps pre-execution input to `po-planning-completeness-review`.
147. `mobile-app-dev-team/workflows/entry-case-routing.md` names modification requests.
148. `mobile-app-dev-team/workflows/entry-case-routing.md` names issue, bug, or failure requests.
149. `mobile-app-dev-team/workflows/entry-case-routing.md` names direct implementation language.
150. `mobile-app-dev-team/workflows/entry-case-routing.md` names proactive reports.
151. `mobile-app-dev-team/workflows/entry-case-routing.md` treats C1-C5 as a report-derived grouping, not the authoritative SoT-named categories.
152. `mobile-app-dev-team/workflows/entry-case-routing.md` says the authoritative classification is the SoT-named categories.
153. `mobile-app-dev-team/workflows/entry-case-routing.md` maps C4 to Design only when layout, interaction, or visual hierarchy matters.
154. `mobile-app-dev-team/workflows/entry-case-routing.md` warns that screen presence alone is not the trigger.
155. `mobile-app-dev-team/workflows/entry-case-routing.md` maps C5 by relevance, not by a fixed "no screen" shortcut.
156. `mobile-app-dev-team/workflows/entry-case-routing.md` lists E1-E16 expanded routing cases.
157. `mobile-app-dev-team/workflows/entry-case-routing.md` defines work-unit decision enum values.
158. `mobile-app-dev-team/workflows/entry-case-routing.md` defines P-1 Design relevance and `not-applicable` criteria.
159. `mobile-app-dev-team/workflows/entry-case-routing.md` says `01-design` may be `not-applicable` only when no layout, interaction, or visual hierarchy is introduced or changed.
160. `mobile-app-dev-team/workflows/entry-case-routing.md` says Product/Planning classifies Design relevance during planning completeness review.
161. `mobile-app-dev-team/workflows/entry-case-routing.md` says Product/Planning does not own Design quality.
162. `mobile-app-dev-team/workflows/entry-case-routing.md` says uncertain Design relevance defaults to relevant.
163. `mobile-app-dev-team/workflows/entry-case-routing.md` says a text-only or ASCII description never authorizes implementation when layout, interaction, or visual hierarchy is in scope.
164. `mobile-app-dev-team/workflows/entry-case-routing.md` says the durable `non-goal` evidence requirement for `01-design not-applicable` is deterministically enforced.
165. `mobile-app-dev-team/workflows/entry-case-routing.md` defines P-2 cross-work-unit prioritization and conflict.
166. `mobile-app-dev-team/workflows/entry-case-routing.md` says Product/Planning owns prioritization and conflict resolution as scope owner.
167. `mobile-app-dev-team/workflows/entry-case-routing.md` says API contract conflicts route to Backend/API Integrator with Mobile Architect co-review.
168. `mobile-app-dev-team/workflows/entry-case-routing.md` says irreversible scope tradeoffs escalate to human gate.
169. `mobile-app-dev-team/workflows/entry-case-routing.md` defines P-3 emergency hotfix as expedited but still gated.
170. `mobile-app-dev-team/workflows/entry-case-routing.md` says emergency hotfix still enters Product/Planning intake.
171. `mobile-app-dev-team/workflows/entry-case-routing.md` says tests-first still applies to emergency hotfixes.
172. `mobile-app-dev-team/workflows/entry-case-routing.md` says production submit still requires recorded human approval.
173. `mobile-app-dev-team/workflows/entry-case-routing.md` says expedited means prioritization and compression of non-gating steps, not skipping required gates.
174. `mobile-app-dev-team/workflows/entry-case-routing.md` says failed-gate shipping requires `failed-gate-risk` human gate.
175. `mobile-app-dev-team/governance/app-eas-ota-rollback-runbook.md` defines P-4 rollback governance.
176. `mobile-app-dev-team/governance/app-eas-ota-rollback-runbook.md` says live EAS, OTA rollback, store rollback, or production execution cannot be authorized by repo-local evidence.
177. `mobile-app-dev-team/governance/app-eas-ota-rollback-runbook.md` says repo agents document rollback plan/evidence and classify failures.
178. `mobile-app-dev-team/governance/app-eas-ota-rollback-runbook.md` says external rollback is human/ops owned.
179. `mobile-app-dev-team/governance/app-eas-ota-rollback-runbook.md` says production-submit `human-gate/v1` requires rollback owner and rollback plan.
180. `mobile-app-dev-team/governance/app-eas-ota-rollback-runbook.md` says failed-gate risk uses the `failed-gate-risk` human gate.
181. `mobile-app-dev-team/workflows/work-processes.md` says CPO/Product Delivery Lead receives the user request through Product/Planning.
182. `mobile-app-dev-team/workflows/work-processes.md` says if unclear, run `po-requirement-office-hours`.
183. `mobile-app-dev-team/workflows/work-processes.md` says if broad, run `po-work-unit-planning-and-agent-sprint`.
184. `mobile-app-dev-team/workflows/work-processes.md` says if ready, run `po-prd-to-execution`.
185. `mobile-app-dev-team/workflows/work-processes.md` says before execution, run `po-planning-completeness-review`.
186. `mobile-app-dev-team/workflows/work-processes.md` says route technical decisions to Mobile Architect when architecture, runtime, API, route/state, dependency, or releaseability risk exists.
187. `mobile-app-dev-team/workflows/work-processes.md` says route human gates before execution work.
188. `mobile-app-dev-team/workflows/work-processes.md` says pod-isolated role work uses durable GitHub handoff root under `docs/plans/work-units/<work-unit-id>/`.
189. `mobile-app-dev-team/workflows/work-processes.md` says Design readiness requires DESIGN.md decision, P0, P1, extraction/publication, and `design-reviewer`.
190. `mobile-app-dev-team/workflows/work-processes.md` says API readiness updates or confirms `packages/contracts`.
191. `mobile-app-dev-team/workflows/work-processes.md` says implementation adds or updates the narrowest failing test/eval/validator/fixture first.
192. `mobile-app-dev-team/workflows/work-processes.md` says implementation is by the owning role and not delegated to write-capable executor.
193. `mobile-app-dev-team/workflows/work-processes.md` says QA/Release creates an E2E/evidence plan, runs evidence, records outputs, and classifies failures.
194. `mobile-app-dev-team/workflows/work-processes.md` says production submit requires recorded human approval.
195. `mobile-app-dev-team/governance/gates-and-evidence.md` says Codex runtime artifact changes require `pnpm run test:runtime`.
196. `mobile-app-dev-team/governance/gates-and-evidence.md` says runtime path/local harness changes require `pnpm run test:local-harness`.
197. `mobile-app-dev-team/governance/gates-and-evidence.md` defines the mobile evidence ladder L0-L3.
198. `mobile-app-dev-team/governance/gates-and-evidence.md` says RN Web must not be used as L2 or L3 native proof.
199. `mobile-app-dev-team/governance/gates-and-evidence.md` says Done requires linked artifacts, not status-only claims.
200. `mobile-app-dev-team/governance/gates-and-evidence.md` says `$wm` planning evidence must summarize planning sub-agent routing.
201. `mobile-app-dev-team/governance/gates-and-evidence.md` says durable GitHub handoff uses `docs/plans/work-units/<work-unit-id>/`.
202. `mobile-app-dev-team/governance/gates-and-evidence.md` says downstream pods consume branch/commit/PR or merged repo artifacts, not another pod local workspace.
203. `mobile-app-dev-team/governance/gates-and-evidence.md` lists eight human gate categories.
204. `mobile-app-dev-team/governance/gates-and-evidence.md` says human gate decisions use `human-gate/v1` under the durable work-unit root.
205. `mobile-app-dev-team/governance/gates-and-evidence.md` says emergency hotfixes are expedited but still gated.
206. `mobile-app-dev-team/workflows/github-artifact-workflow.md` says pod-isolated role agents have no shared storage assumption.
207. `mobile-app-dev-team/workflows/github-artifact-workflow.md` says durable handoff must happen through GitHub branch/commit/PR or merged repo artifact.
208. `mobile-app-dev-team/workflows/github-artifact-workflow.md` defines the durable work-unit root.
209. `mobile-app-dev-team/workflows/github-artifact-workflow.md` defines work-unit stage directories.
210. `mobile-app-dev-team/workflows/github-artifact-workflow.md` says each role artifact must include status, PRD acceptance line or non-goal reference, owner, input artifact, output artifact, acceptance criteria, evidence requirement, dependencies/blockers, open decisions, next responsible role, and GitHub branch/PR handoff link when leaving the pod.
211. `mobile-app-dev-team/workflows/github-artifact-workflow.md` says optional backend, Railway, EAS, native, and mobile-mcp files are not mandatory unless touched.
212. `mobile-app-dev-team/workflows/github-artifact-workflow.md` says Product/Planning owns top-level work-unit packet and routing.
213. `mobile-app-dev-team/workflows/github-artifact-workflow.md` says Product/Planning must not implement app, backend, design, QA, or release work.
214. `mobile-app-dev-team/workflows/github-artifact-workflow.md` says Design owns Design quality and Stitch-backed implementation handoff.
215. `mobile-app-dev-team/workflows/github-artifact-workflow.md` says for UI work, Mobile App Dev must not start until P0, exactly two Stitch options, P1, no pre-P1 HTML extraction, and `design-reviewer` evidence exist.
216. `mobile-app-dev-team/workflows/github-artifact-workflow.md` says actual API schemas remain in `packages/contracts`.
217. `mobile-app-dev-team/workflows/github-artifact-workflow.md` says actual mobile code remains in `apps/mobile`.
218. `mobile-app-dev-team/workflows/github-artifact-workflow.md` says QA/Release files summarize and link canonical evidence.
219. `mobile-app-dev-team/workflows/github-artifact-workflow.md` says PR workflow merges require applicable CI, reviewer evidence, QA evidence, and human-gate decisions.
220. `runtime-sources/pod-environment-bootstrap.md` is source guidance and does not modify live pods.
221. `runtime-sources/pod-environment-bootstrap.md` says project-bootstrap is the standard user-facing entry point after read-only preflight.
222. `runtime-sources/pod-environment-bootstrap.md` says human-owned credentials, live approvals, missing source artifacts, and missing pod skill artifacts remain blockers.
223. `scripts/lib/work-unit-machine.mjs` contains the `not-applicable` state.
224. `scripts/lib/work-unit-machine.mjs` validates `01-design not-applicable` must carry `non-goal` evidence.
225. `scripts/lib/work-unit-machine.mjs` validates production-submit human-gate decisions must include rollback owner and rollback plan.
226. `scripts/codex-headless-review.mjs` supports high reasoning read-only reviews with JSON-envelope validation for verdict reviewers.
227. The reviewer helper validates line references as `path:line`, not line ranges.
228. The reviewer helper accepts owner values from a finite set.
229. Prior reviewer attempt failed machine validation because it emitted line ranges and a compound owner value.
230. This plan must avoid repeating that reviewer prompt ambiguity.

## 005. Problem Statement

231. The current `codex-role-workflow` is semantically underpowered for the role it now needs to play.
232. It successfully maps operating roles to allowed repo-local skills.
233. It successfully maps operating roles to primary reviewers.
234. It successfully maps operating roles to durable artifact stages.
235. It successfully blocks out-of-role ownership absorption.
236. It successfully blocks human-gate and secret-exposure classes.
237. It does not yet operationalize `mobile-app-dev-team/workflows/entry-case-routing.md`.
238. It does not yet make every project requirement or project specification enter Product/Planning intake.
239. It does not yet distinguish PRD as one project input type among broader requirement artifacts.
240. It does not yet return an entry-case classification.
241. It does not yet explain why a particular skill is allowed next.
242. It does not yet explain why a role is blocked or not applicable in entry-case terms.
243. It does not yet encode that direct implementation language is not enough to execute without an accepted task packet and `READY_FOR_EXECUTION`.
244. It does not yet encode that proactive reports cannot auto-create issues, code changes, scope changes, or SOUL changes.
245. It does not yet encode Design relevance as layout/interaction/visual hierarchy based.
246. It does not yet encode that screen presence alone is not a Design trigger.
247. It does not yet encode `01-design not_applicable` durable non-goal evidence expectations in its own output contract.
248. It does not yet encode P0/P1 Stitch and HTML extraction constraints.
249. It does not yet encode P-3 emergency hotfix as expedited but still gated.
250. It does not yet encode P-4 rollback plan/owner requirements for production-submit routing.
251. It does not yet describe Codex as the project role-workflow substrate.
252. It can therefore be misread as "Codex is a coding executor chosen later".
253. It can also be misread as "OpenClaw role pod calls a repo skill directly based on role only".
254. The desired behavior is "OpenClaw role pod resolves role plus entry case plus gate state, then returns the allowed repo-local Codex substrate path".
255. This is a governance and routing correctness problem before it is a code editing problem.
256. The first implementation increment must therefore be process-contract work.
257. The second implementation increment may be validator or eval work if the repo has an existing validator path for this contract.
258. The third implementation increment may be runtime publication/bootstrap alignment.
259. Live pod mutation must remain explicitly gated.
260. This plan is the required detailed Product/Planning artifact before those increments.

## 006. Target Principle

261. Codex in this repository must be described as a role-workflow substrate.
262. Codex is not a synonym for "implementation only".
263. Codex includes repo-local skills.
264. Codex includes repo-local custom agents.
265. Codex includes hooks.
266. Codex includes MCP configuration.
267. Codex includes validators.
268. Codex includes evidence paths.
269. Codex includes review gates.
270. Codex includes source-grounded planning constraints.
271. Product/Planning uses Codex from intake, not only after development begins.
272. Design uses Codex for Stitch-backed design handoff rules and reviewer evidence.
273. Mobile Architect uses Codex for architecture notes and releaseability handoff.
274. Backend/API Integrator uses Codex for contract and backend service evidence.
275. Mobile App Dev uses Codex for tests-first mobile implementation.
276. QA/Release uses Codex for evidence planning and release-risk reporting.
277. Release Gatekeeper remains non-LLM deterministic system behavior, not a Codex custom agent.
278. Human gates remain human-owned.
279. `codex-role-workflow` should bridge OpenClaw pod role identity into this Codex substrate.
280. It should not implement role work itself.
281. It should not invoke write-capable executors.
282. It should not replace `wm-orchestrate`.
283. It should not replace `work-unit-next.mjs`.
284. It should not replace Product/Planning intake.
285. It should not replace role-specific skills.
286. It should not replace reviewer agents.
287. It should produce enough structured routing output for the role pod to pick the correct next Codex skill.
288. It should explicitly state when no repo-local skill may be invoked yet.
289. It should explicitly state when a human gate blocks progress.
290. It should explicitly state when runtime capability blocks progress.

## 007. Scope

291. In scope: update the source-managed `codex-role-workflow` skill text in a future implementation.
292. In scope: make `mobile-app-dev-team/workflows/entry-case-routing.md` operationally consumed by `codex-role-workflow`.
293. In scope: broaden project input language from PRD-only to project requirements and project specifications.
294. In scope: encode Codex substrate framing in `codex-role-workflow`.
295. In scope: encode Product/Planning common intake.
296. In scope: encode compact SoT-named entry categories.
297. In scope: encode C1-C5 only as report-derived convenience overlay.
298. In scope: encode E1-E16 as expanded route guidance.
299. In scope: encode P-1 Design relevance and `not_applicable` constraints.
300. In scope: encode P-2 cross-work-unit priority/conflict as Product/Planning scope ownership guidance.
301. In scope: encode P-3 emergency hotfix as expedited but still gated.
302. In scope: encode P-4 rollback owner/plan for production-submit.
303. In scope: update output contract fields.
304. In scope: define validation/eval requirements before implementation.
305. In scope: define reviewer evidence requirements.
306. In scope: define source-managed runtime publication expectations.
307. Out of scope: direct edit to `/workspace/AGENTS.md`.
308. Out of scope: direct copy into `/workspace/skills/codex-role-workflow`.
309. Out of scope: live OpenClaw pod mutation.
310. Out of scope: live Confluence publication.
311. Out of scope: live EAS or Maestro execution.
312. Out of scope: store submit or production release.
313. Out of scope: changing role SOUL.md content in this increment unless reviewer requires it.
314. Out of scope: implementing mobile app code.
315. Out of scope: changing API schemas.
316. Out of scope: changing Design artifacts or running Stitch.
317. Out of scope: changing hooks unless a validator or reviewer finds the skill contract cannot be enforced otherwise.
318. Out of scope: adding write-capable executors.
319. Out of scope: using legacy `mobile-*` agents for `$wm` reviewer routing.
320. Out of scope: treating reviewer output as human approval.

## 008. Future Work-Unit Task Packet

321. Task A title: Source-grounded routing contract update for `codex-role-workflow`.
322. Task A owner role: Product/Planning.
323. Task A input artifact: this plan.
324. Task A input artifact: `mobile-app-dev-team/workflows/entry-case-routing.md`.
325. Task A input artifact: current `mobile-app-dev-team/runtime-sources/pod-native-openclaw-skills/codex-role-workflow/SKILL.md`.
326. Task A output artifact: updated `mobile-app-dev-team/runtime-sources/pod-native-openclaw-skills/codex-role-workflow/SKILL.md`.
327. Task A Done-when: skill includes Product/Planning common intake rule.
328. Task A Done-when: skill includes Codex substrate definition.
329. Task A Done-when: skill includes compact SoT-named routing categories.
330. Task A Done-when: skill includes report-derived C1-C5 as convenience overlay only.
331. Task A Done-when: skill includes E1-E16 expanded route map or a compact equivalent.
332. Task A Done-when: skill includes P-1/P-2/P-3/P-4 operational rules.
333. Task A Done-when: skill preserves status-only behavior.
334. Task A evidence requirement: future implementation diff recorded with `git diff -- mobile-app-dev-team/runtime-sources/pod-native-openclaw-skills/codex-role-workflow/SKILL.md` and reviewer evidence linked from `.evidence/reviews/<YYYYMMDD>-codex-role-workflow-runtime-routing-final-review.md`.
335. Task A next responsible role: Product/Planning reviewer.
336. Task A open decision: whether to quote all E1-E16 in table form or summarize them with source link and critical classes.
337. Task B title: Output contract expansion.
338. Task B owner role: Product/Planning.
339. Task B input artifact: current output contract.
340. Task B input artifact: `mobile-app-dev-team/workflows/entry-case-routing.md`.
341. Task B output artifact: updated output contract in `codex-role-workflow`.
342. Task B Done-when: output includes `entry_case`.
343. Task B Done-when: output includes `routing_reason`.
344. Task B Done-when: output includes `process_sot`.
345. Task B Done-when: output includes `readiness_state_or_required_gate`.
346. Task B Done-when: output includes `blocked_reason` when status is blocked.
347. Task B Done-when: output includes `not_applicable_reason` when status is not applicable.
348. Task B Done-when: output includes `durable_artifact_stage`.
349. Task B Done-when: output includes `required_reviewer`.
350. Task B Done-when: output includes `secret_safety_statement`.
351. Task B Done-when: output includes external proof boundary statement.
352. Task B evidence requirement: output-contract checklist recorded in `docs/plans/work-units/codex-role-workflow-runtime-routing/00-product-planning/evidence-matrix.md` and reviewer confirmation linked from `.evidence/reviews/<YYYYMMDD>-codex-role-workflow-output-contract-review.md`.
353. Task B next responsible role: `po-planning-reviewer`.
354. Task B open decision: whether output remains markdown list or gains a sample JSON block.
355. Task C title: Design relevance and P0/P1 guardrail coverage.
356. Task C owner role: Design for design-quality semantics and Product/Planning for scope/evidence gate routing.
357. Task C input artifact: `design-mobile-design-handoff`.
358. Task C input artifact: `mobile-app-dev-team/workflows/github-artifact-workflow.md`.
359. Task C input artifact: `mobile-app-dev-team/workflows/entry-case-routing.md` P-1.
360. Task C output artifact: codex-role-workflow routing rules for Design relevance.
361. Task C Done-when: screen presence is explicitly not the trigger.
362. Task C Done-when: layout, interaction, or visual hierarchy is the trigger.
363. Task C Done-when: uncertain relevance defaults to Design engaged.
364. Task C Done-when: text-only design cannot authorize implementation when visual hierarchy matters.
365. Task C Done-when: P0 before Stitch generation is named.
366. Task C Done-when: P1 before HTML extraction is named.
367. Task C Done-when: pre-P1 `fetch_screen_code`, `code.html`, SDK `getHtml`, and `htmlCode.downloadUrl` remain forbidden.
368. Task C evidence requirement: Design relevance/P0/P1 checklist recorded in `docs/plans/work-units/codex-role-workflow-runtime-routing/01-design/reviewer.md` when Design reviewer is used, or in `.evidence/reviews/<YYYYMMDD>-codex-role-workflow-design-boundary-review.md` when Product/Planning reviewer confirms only routing semantics.
369. Task C next responsible role: Design reviewer if implementation touches Design rules beyond routing summary.
370. Task C open decision: whether Design reviewer is required for the plan or only for final skill diff.
371. Task D title: Validator or eval coverage.
372. Task D owner role: Mobile App Dev or repo runtime maintainer under `$wm`, because tests/evals/validators are executable repo artifacts.
373. Task D input artifact: updated `codex-role-workflow` diff.
374. Task D input artifact: existing `scripts/validate-team-doc.mjs` or runtime validators.
375. Task D output artifact: narrow test, eval, fixture, or validator assertion.
376. Task D Done-when: check fails if `codex-role-workflow` does not reference `mobile-app-dev-team/workflows/entry-case-routing.md`.
377. Task D Done-when: check fails if Product/Planning common intake disappears.
378. Task D Done-when: check fails if Codex substrate language disappears.
379. Task D Done-when: check fails if direct implementation language can bypass accepted task packet and `READY_FOR_EXECUTION`.
380. Task D Done-when: check fails if proactive reports lose no-auto-execution.
381. Task D Done-when: check fails if Design trigger is described as screen presence only.
382. Task D Done-when: check fails if P0/P1 sequencing is absent.
383. Task D Done-when: check fails if pre-P1 HTML extraction prohibition is absent.
384. Task D Done-when: check fails if human-gate blocking is absent.
385. Task D Done-when: check fails if production-submit rollback owner/plan rule is absent.
386. Task D evidence requirement: command output with exit status recorded in `docs/plans/work-units/codex-role-workflow-runtime-routing/04-mobile-app/command-output.md` when executable validators change, plus final reviewer evidence linked from `.evidence/reviews/<YYYYMMDD>-codex-role-workflow-validator-final-review.md`.
387. Task D next responsible role: `wm-implementation-reviewer` for runtime validator review.
388. Task D open decision: whether to place assertions in `validate-team-doc`, `validate-runtime-artifacts`, or a new focused fixture.
389. Task E title: Source-managed `/workspace/AGENTS.md` alignment.
390. Task E owner role: Product/Planning with repo policy awareness.
391. Task E input artifact: root `AGENTS.md`.
392. Task E input artifact: `REPO_OPERATIONS.md`.
393. Task E output artifact: possible future root `AGENTS.md` wording.
394. Task E Done-when: any change states WonderMove project requirements/specifications/PRDs/role-workflow work must resolve through `codex-role-workflow`.
395. Task E Done-when: any change states Codex is role-workflow substrate, not merely coding tool.
396. Task E Done-when: any change preserves path distinction between `/workspace/AGENTS.md` runtime source text and project-local `AGENTS.md`.
397. Task E Done-when: any change does not direct agents to edit `/workspace` root as the project repo.
398. Task E evidence requirement: root policy command output recorded in `docs/plans/work-units/codex-role-workflow-runtime-routing/00-product-planning/policy-command-output.md` and reviewer evidence linked from `.evidence/reviews/<YYYYMMDD>-codex-role-workflow-root-policy-review.md`.
399. Task E next responsible role: `po-scope-gate-reviewer` if policy wording changes gate expectations.
400. Task E open decision: whether this increment modifies root `AGENTS.md` or leaves it to a separate policy PR.
401. Task F title: Pod runtime publication path alignment.
402. Task F owner role: Product/Planning for procedure; human/ops owner for live pod mutation.
403. Task F input artifact: `project-bootstrap` and pod bootstrap docs.
404. Task F output artifact: source-managed bootstrap/routing documentation or project-bootstrap check.
405. Task F Done-when: plan states `/workspace/skills/codex-role-workflow` missing at runtime is a runtime readiness blocker, not a repo-local proof failure.
406. Task F Done-when: source-managed repo path remains the edit target.
407. Task F Done-when: live copy to `/workspace/skills` is classified as runtime/pod operation.
408. Task F Done-when: live copy requires appropriate approval/evidence if performed outside repo-local source update.
409. Task F evidence requirement: redacted status-only runtime publication proof recorded under `docs/plans/work-units/codex-role-workflow-runtime-routing/00-product-planning/runtime-publication-status.md` or blocked reason recorded in the same file; no secret contents or live claim without approved evidence.
410. Task F next responsible role: project-bootstrap/pod-role-bootstrap owner.
411. Task F open decision: whether current project-bootstrap already registers `codex-role-workflow` sufficiently or needs explicit validation.
412. Task G title: Reviewer routing.
413. Task G owner role: Product/Planning.
414. Task G input artifact: this plan and future diff.
415. Task G output artifact: `po-planning-reviewer` plan review.
416. Task G Done-when: reviewer returns GO or findings are addressed.
417. Task G Done-when: machine-readable JSON envelope validates when helper is used.
418. Task G evidence requirement: planning review prompt at `.evidence/reviews/20260614-codex-role-workflow-runtime-routing-plan-prompt.md`, planning review report at `.evidence/reviews/20260614-codex-role-workflow-runtime-routing-plan-xhigh-review.md`, and parsed reviewer JSON at `.evidence/reviews/20260614-codex-role-workflow-runtime-routing-plan-xhigh-review.json` when helper validation succeeds.
419. Task G next responsible role: implementation owner after GO.
420. Task G open decision: whether final implementation also requires `wm-implementation-reviewer`.

## 009. Required `codex-role-workflow` Content Model

421. Add a section named `Codex Substrate`.
422. The section must say Codex is the repo-local role-workflow substrate.
423. The section must name repo-local skills under `.agents/skills`.
424. The section must name repo-local custom agents under `.codex/agents`.
425. The section must name hooks under `.codex/hooks.json` and `.codex/hooks`.
426. The section must name MCP config under `.codex/config.toml`.
427. The section must name validators and evidence as part of completion flow.
428. The section must say implementation is only one possible downstream role action.
429. The section must say Product/Planning uses Codex from intake.
430. The section must not say Codex is only a coding executor.
431. Add a section named `Process Routing Sources`.
432. This section must name `mobile-app-dev-team/workflows/entry-case-routing.md`.
433. This section must name `mobile-app-dev-team/workflows/work-processes.md`.
434. This section must name `mobile-app-dev-team/governance/gates-and-evidence.md`.
435. This section must name `mobile-app-dev-team/workflows/github-artifact-workflow.md`.
436. This section must name `mobile-app-dev-team/governance/app-eas-ota-rollback-runbook.md`.
437. This section must name relevant repo-local `po-*`, `design-*`, `mobile-*`, and QA skills.
438. This section must say `mobile-app-dev-team/workflows/entry-case-routing.md` supplies taxonomy.
439. This section must say `codex-role-workflow` operationalizes taxonomy in pod runtime output.
440. This section must avoid duplicating every policy statement as independent SoT.
441. Add a section named `Common Intake Rule`.
442. This section must state every project requirement, project specification, PRD, brief, modification request, bug report, direct implementation request, proactive report, or handoff request enters Product/Planning intake first.
443. This section must state no input routes directly to execution role unless accepted task/readiness or deterministic work-unit state already assigns that role.
444. This section must state a role pod that receives out-of-role work returns `blocked` or `not_applicable`.
445. This section must state Product/Planning chooses the first planning skill by clarity and size.
446. This section must state project requirement and project specification are first-class wording.
447. This section must state PRD is one example of a ready or broad planning artifact.
448. This section must state chat is coordination evidence unless linked to accepted SoT.
449. This section must state direct implementation language is insufficient without accepted task packet plus readiness.
450. This section must state proactive reports do not auto-execute.
451. Add a section named `Entry Case Routing`.
452. This section must map unclear to `po-requirement-office-hours`.
453. This section must map broad to `po-work-unit-planning-and-agent-sprint`.
454. This section must map ready bounded to `po-prd-to-execution`.
455. This section must map pre-execution to `po-planning-completeness-review`.
456. This section must map modification request to Product/Planning classification.
457. This section must map issue/bug/failure to Product/Planning classification, then tests-first owner handoff.
458. This section must map direct implementation language to accepted task readiness check.
459. This section must map proactive report to no-auto-execution triage.
460. This section must map UI/interaction/visual hierarchy to Design readiness.
461. This section must map API contract or backend service to Backend/API Integrator.
462. This section must map architecture/runtime/releaseability to Mobile Architect.
463. This section must map QA/release/evidence to QA/Release.
464. This section must map human gate and live external work to blocked pending human decision.
465. This section must map cross-pod handoff to durable GitHub work-unit root.
466. Add a section named `Design Relevance`.
467. This section must say screen presence is not the decisive trigger.
468. This section must say layout, interaction, or visual hierarchy is the decisive trigger.
469. This section must say if uncertain, Design is relevant.
470. This section must say `01-design not_applicable` requires durable non-goal evidence.
471. This section must say Product/Planning classifies relevance but does not own Design quality.
472. This section must say Design owns Design quality.
473. This section must say P0 is required before Stitch generation.
474. This section must say exactly two Stitch options are required when Stitch generation proceeds.
475. This section must say P1 is required before HTML extraction.
476. This section must say pre-P1 HTML extraction metadata is forbidden.
477. Add a section named `Hotfix And Rollback`.
478. This section must say emergency hotfix still enters Product/Planning.
479. This section must say emergency hotfix is expedited, not gate-bypassing.
480. This section must say tests-first still applies.
481. This section must say production-submit requires human gate.
482. This section must say failed-gate risk acceptance requires `failed-gate-risk`.
483. This section must say production-submit requires rollback owner and rollback plan.
484. This section must say repo-local evidence does not prove store submission, live EAS, or production readiness.
485. Add a section named `Output Contract`.
486. This section must keep schema name `codex-role-workflow/v1` unless a versioned change is intentionally approved.
487. This section must keep statuses `ready`, `blocked`, and `not_applicable`.
488. This section must add `entry_case`.
489. This section must add `routing_reason`.
490. This section must add `process_sot`.
491. This section must add `resolved_role`.
492. This section must add `role_identity_source`.
493. This section must add `allowed_repo_local_codex_skills`.
494. This section must add `required_reviewers`.
495. This section must add `durable_artifact_stage`.
496. This section must add `readiness_state_or_required_gate`.
497. This section must add `blocked_reason`.
498. This section must add `not_applicable_reason`.
499. This section must add `human_gate_or_external_proof_blocker`.
500. This section must add `next_action`.
501. This section must add `secret_safety_statement`.
502. This section must add `external_proof_boundary`.
503. This section must not require tokens, private endpoints, or credential values.
504. This section must not require live pod state as a local validation input.
505. Add sample outputs only if they cannot be mistaken as exhaustive.
506. Sample Product/Planning unclear route should return `entry_case: unclear`.
507. Sample Direct implementation blocked route should return `blocked` if no accepted packet exists.
508. Sample Design not applicable route should include non-goal evidence requirement.
509. Sample production-submit route should include human gate and rollback owner/plan requirement.
510. Sample proactive report route should include no-auto-execution.

## 010. Validation Plan

511. Validation must be tests-first for future implementation.
512. If only the plan document is created, no implementation validator is required yet.
513. When `codex-role-workflow` is edited, add or update the narrowest validator/eval first.
514. Preferred check location must be discovered from existing validators before editing.
515. Candidate validator: `scripts/validate-team-doc.mjs`.
516. Candidate validator: `scripts/validate-runtime-artifacts.mjs`.
517. Candidate fixtures may be under `evals/skills` or `evals/local-harness` if existing patterns support it.
518. The validator must check `codex-role-workflow` references `mobile-app-dev-team/workflows/entry-case-routing.md`.
519. The validator must check `codex-role-workflow` references broader project requirement/project specification input, not only PRD.
520. The validator must check Product/Planning common intake.
521. The validator must check Codex substrate wording.
522. The validator must check direct implementation language cannot bypass accepted task packet plus `READY_FOR_EXECUTION`.
523. The validator must check proactive report no-auto-execution.
524. The validator must check Design relevance is layout/interaction/visual hierarchy based.
525. The validator must check screen presence is not the only trigger.
526. The validator must check P0 before Stitch generation.
527. The validator must check P1 before HTML extraction.
528. The validator must check pre-P1 HTML extraction terms are forbidden or named as blocked before P1.
529. The validator must check `fetch_screen_code`.
530. The validator must check `code.html`.
531. The validator must check `getHtml`.
532. The validator must check `htmlCode.downloadUrl`.
533. The validator must check human gate blocking.
534. The validator must check production-submit rollback owner and plan.
535. The validator must check output contract includes `entry_case`.
536. The validator must check output contract includes `routing_reason`.
537. The validator must check output contract includes `process_sot`.
538. The validator must check output contract includes `blocked_reason`.
539. The validator must check output contract includes `not_applicable_reason`.
540. The validator must check external proof boundary.
541. The validator must check secret safety statement.
542. Run the narrow validator before editing the skill, expecting failure if feasible.
543. Update the skill.
544. Re-run the narrow validator, expecting pass.
545. Run `pnpm run test:runtime`.
546. Run `pnpm run test:local-harness` if the changed paths trigger runtime/local harness scope.
547. Run `pnpm turbo run lint test` only if workspace code changes or reviewer requests broad workspace proof.
548. Record command output with exit status.
549. Persist reviewer evidence under `.evidence/reviews`.
550. Report any skipped check with source-backed reason.

## 011. Review Plan

551. This planning document must be reviewed by `po-planning-reviewer`.
552. The review mode is `plan`.
553. The review must be read-only.
554. The review must cite source references.
555. The review must not recursively delegate.
556. The review must not edit files.
557. The review must not approve human gates.
558. The review prompt must instruct the reviewer to avoid line ranges in JSON findings.
559. The review prompt must instruct the reviewer to use single-line `path:line` references.
560. The review prompt must instruct the reviewer to use one supported owner per finding.
561. The review prompt must include `AGENTS.md`, `REPO_OPERATIONS.md`, `PROJECT_ENVIRONMENT.md`, `codex-role-workflow`, `mobile-app-dev-team/workflows/entry-case-routing.md`, `mobile-app-dev-team/workflows/work-processes.md`, `mobile-app-dev-team/governance/gates-and-evidence.md`, `mobile-app-dev-team/workflows/github-artifact-workflow.md`, and `mobile-app-dev-team/governance/app-eas-ota-rollback-runbook.md`.
562. If the plan is `GO`, future implementation planning may proceed.
563. If the plan is `NO_GO`, findings must be addressed before implementation.
564. If the plan is `BLOCKED`, missing SoT or missing evidence must be supplied.
565. If the plan is `NEEDS_HUMAN`, human gate decision is required before the affected action.
566. Final implementation, when later authorized, should be reviewed by `wm-implementation-reviewer` if validator/runtime code changes.
567. Final implementation should be reviewed by `po-planning-reviewer` if only planning/process docs change.
568. Final implementation should involve `design-reviewer` if Design handoff semantics are changed beyond referencing existing SoT.
569. Final implementation should involve `po-scope-gate-reviewer` if human-gate categories or runtime publication rules are changed.
570. Reviewer evidence must be linked in final report.

## 012. Risk Register

571. Risk R1: duplicating `mobile-app-dev-team/workflows/entry-case-routing.md` too fully creates divergent SoT.
572. Mitigation R1: include compact operational rules and cite `mobile-app-dev-team/workflows/entry-case-routing.md` as process source.
573. Risk R2: only linking `mobile-app-dev-team/workflows/entry-case-routing.md` leaves `codex-role-workflow` non-operational.
574. Mitigation R2: add required entry-case output fields and routing table.
575. Risk R3: PRD-only wording excludes project requirement and project specification inputs.
576. Mitigation R3: use broader input language throughout.
577. Risk R4: Codex is described as implementation-only.
578. Mitigation R4: add Codex substrate section.
579. Risk R5: Product/Planning absorbs Design quality.
580. Mitigation R5: state Product/Planning classifies relevance and approves scope/evidence only.
581. Risk R6: Design is skipped because a feature is described as no-screen while visual hierarchy still matters.
582. Mitigation R6: use layout/interaction/visual hierarchy trigger.
583. Risk R7: Design is invoked for irrelevant backend-only work.
584. Mitigation R7: allow `01-design not_applicable` only with durable non-goal evidence.
585. Risk R8: Direct build language bypasses planning.
586. Mitigation R8: require accepted task packet and `READY_FOR_EXECUTION`.
587. Risk R9: Proactive reports auto-execute.
588. Mitigation R9: preserve no-auto-execution triage states.
589. Risk R10: Emergency hotfix bypasses production-submit or failed-gate-risk human gates.
590. Mitigation R10: encode expedited but still gated.
591. Risk R11: Runtime publication to `/workspace/skills` is confused with repo-local proof.
592. Mitigation R11: classify runtime publication as external/pod operation unless executed in approved pod context.
593. Risk R12: `/workspace/AGENTS.md` is directly edited instead of source-managed repo text.
594. Mitigation R12: update root `AGENTS.md` source text only through repo workflow if needed.
595. Risk R13: validator checks become brittle prose matching.
596. Mitigation R13: prefer explicit required phrases and narrow assertions.
597. Risk R14: reviewer JSON envelope fails again.
598. Mitigation R14: prompt reviewer to use single-line source refs and supported owner values.
599. Risk R15: local harness is overclaimed as live pod proof.
600. Mitigation R15: preserve external proof boundary language.

## 013. Non-Goals

601. Do not implement the `codex-role-workflow` changes in this planning step.
602. Do not edit `/workspace/AGENTS.md` in this planning step.
603. Do not copy files into `/workspace/skills` in this planning step.
604. Do not change mobile app source code.
605. Do not change backend API contracts.
606. Do not change Design artifacts.
607. Do not run Stitch.
608. Do not run EAS.
609. Do not perform production submit.
610. Do not publish Confluence.
611. Do not create Jira issues.
612. Do not mutate GitHub branch protection.
613. Do not expose secrets.
614. Do not treat `po-planning-reviewer` as a human gate approver.
615. Do not treat a clean local validation as live OpenClaw proof.
616. Do not introduce new write-capable executor delegation.
617. Do not route `$wm` reviewer work through legacy `mobile-*` agents.
618. Do not collapse Product/Planning, Design, Architecture, Backend/API, Mobile App Dev, and QA/Release ownership.
619. Do not allow text-only design to authorize visual implementation.
620. Do not demote existing gates without reviewer evidence.

## 014. Proposed Future Edit Order

621. Step 1: Create a focused implementation branch.
622. Step 2: Re-read `AGENTS.md`, `REPO_OPERATIONS.md`, `PROJECT_ENVIRONMENT.md`, `codex-role-workflow`, and `mobile-app-dev-team/workflows/entry-case-routing.md`.
623. Step 3: Decide exact validator/eval location.
624. Step 4: Add failing validator/eval assertion.
625. Step 5: Run the narrow check and record expected failure.
626. Step 6: Update `codex-role-workflow` with Codex substrate section.
627. Step 7: Add process routing sources section.
628. Step 8: Add common intake rule.
629. Step 9: Add compact entry-case routing overlay.
630. Step 10: Add Design relevance section.
631. Step 11: Add hotfix and rollback section.
632. Step 12: Expand output contract.
633. Step 13: Add sample outputs only if they improve clarity.
634. Step 14: Re-run narrow validator/eval.
635. Step 15: Run `pnpm run test:runtime`.
636. Step 16: Run `pnpm run test:local-harness` when required by touched paths.
637. Step 17: Collect `git diff` for changed paths.
638. Step 18: Request `po-planning-reviewer` or `wm-implementation-reviewer` final review based on touched files.
639. Step 19: Address findings before reporting Done.
640. Step 20: Report changes, commands, evidence, reviewer verdict, residual risks, and `git status --short`.

## 015. Acceptance Criteria

641. AC1: The plan document has at least 500 lines.
642. AC2: The plan document cites or names all material SoT files.
643. AC3: The plan document treats project requirements and project specifications as first-class inputs.
644. AC4: The plan document treats PRD as one input form, not the whole planning surface.
645. AC5: The plan document defines Codex as repo-local role-workflow substrate.
646. AC6: The plan document states that `codex-role-workflow` must operationalize `mobile-app-dev-team/workflows/entry-case-routing.md`.
647. AC7: The plan document states that linking alone is insufficient.
648. AC8: The plan document preserves source-managed repo artifact boundaries.
649. AC9: The plan document avoids direct `/workspace` mutation as the default implementation path.
650. AC10: The plan document includes role-scoped task packet details.
651. AC11: The plan document includes validator/eval requirements.
652. AC12: The plan document includes P0/P1 and pre-P1 HTML extraction coverage.
653. AC13: The plan document includes hotfix and rollback coverage.
654. AC14: The plan document includes human-gate coverage.
655. AC15: The plan document includes evidence and reviewer coverage.
656. AC16: The plan document identifies non-goals.
657. AC17: The plan document identifies risks and mitigations.
658. AC18: The plan document is reviewed by `po-planning-reviewer`.
659. AC19: The reviewer report is persisted under `.evidence/reviews`.
660. AC20: The final user report names the reviewer verdict and any blockers.

## 016. Reviewer Prompt Requirements

661. The reviewer prompt must ask whether the plan is SoT-grounded.
662. The reviewer prompt must ask whether the plan correctly treats Codex as role-workflow substrate.
663. The reviewer prompt must ask whether the plan correctly operationalizes `mobile-app-dev-team/workflows/entry-case-routing.md`.
664. The reviewer prompt must ask whether project requirement/project specification input coverage is broad enough.
665. The reviewer prompt must ask whether Product/Planning ownership is preserved.
666. The reviewer prompt must ask whether Design ownership is preserved.
667. The reviewer prompt must ask whether human gates are preserved.
668. The reviewer prompt must ask whether runtime publication boundaries are correctly classified.
669. The reviewer prompt must ask whether validator/eval coverage is sufficient.
670. The reviewer prompt must ask whether implementation may proceed after addressing findings.
671. The reviewer prompt must require single-line `path:line` source refs in JSON findings.
672. The reviewer prompt must require owner values from the helper-supported set.
673. The reviewer prompt must state no file edits.
674. The reviewer prompt must state no recursive delegation.
675. The reviewer prompt must state no human-gate approval.
676. The reviewer prompt must include this plan file path.
677. The reviewer prompt must include the current `codex-role-workflow` path.
678. The reviewer prompt must include `mobile-app-dev-team/workflows/entry-case-routing.md`.
679. The reviewer prompt must include root policy files.
680. The reviewer prompt must include Design P0/P1 sources.

## 017. Evidence Plan

681. Planning document path: `docs/plans/work-units/codex-role-workflow-runtime-routing/00-product-planning/task-packet.md`.
682. Reviewer prompt path: `.evidence/reviews/20260614-codex-role-workflow-runtime-routing-plan-prompt.md`.
683. Reviewer report path: `.evidence/reviews/20260614-codex-role-workflow-runtime-routing-plan-xhigh-review.md`.
684. Reviewer parsed JSON path: `.evidence/reviews/20260614-codex-role-workflow-runtime-routing-plan-xhigh-review.json`.
685. Line count command: `wc -l docs/plans/work-units/codex-role-workflow-runtime-routing/00-product-planning/task-packet.md`.
686. Status command: `git status --short`.
687. Diff command: `git diff -- docs/plans/work-units/codex-role-workflow-runtime-routing/00-product-planning/task-packet.md docs/plans/work-units/codex-role-workflow-runtime-routing/README.md docs/plans/work-units/codex-role-workflow-runtime-routing/status.json`.
688. Review command: `node scripts/codex-headless-review.mjs --json-envelope --agent po-planning-reviewer --prompt .evidence/reviews/20260614-codex-role-workflow-runtime-routing-plan-prompt.md --out .evidence/reviews/20260614-codex-role-workflow-runtime-routing-plan-xhigh-review.md`.
689. Runtime checks are not required for this planning-only document unless reviewer asks.
690. Future implementation checks are defined above.

## 018. Final Decision For This Planning Step

691. This planning step should proceed to reviewer because the document is complete enough for planning review.
692. This planning step should not proceed to implementation until reviewer findings are known.
693. The most appropriate reviewer is `po-planning-reviewer`.
694. A second reviewer may be needed later if implementation changes validators or Design semantics.
695. No human gate is required to write this local planning document.
696. Human gate may be required for live pod runtime publication, production submit, external proof, or failed-gate risk acceptance.
697. Direct `/workspace` mutation is not approved by this plan.
698. Source-managed repo changes are the future default.
699. The final user report must be concise but name the created plan, reviewer result, and next action.
700. End of plan.
