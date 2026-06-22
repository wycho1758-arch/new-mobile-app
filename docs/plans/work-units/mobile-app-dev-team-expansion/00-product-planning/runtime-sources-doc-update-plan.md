# runtime-sources Documentation Update Plan

001. Plan id: runtime-sources-doc-update-plan.
002. Date: 2026-06-20.
003. Baseline commit: 2bc9ef5.
004. Branch observed: main.
005. Request: inspect actual folder and configuration changes under `mobile-app-dev-team/runtime-sources`, then plan existing documentation updates.
006. Requested output: a detailed markdown plan with evidence, at least 500 lines, followed by read-only reviewer inspection.
007. Scope owner: Product/Planning for planning, scope containment, role routing, and evidence expectations.
008. Reviewer owner: `po-planning-reviewer` for planning completeness and role-boundary review.
009. Secondary reviewer if execution starts later: `wm-implementation-reviewer` for implementation, tests, evidence, and runtime boundary review.
010. This file is planning evidence only; it does not authorize documentation execution by itself.
011. Execution remains blocked until a follow-up update packet or deterministic work-unit next action authorizes edits.
012. Human-gated external publication is out of scope unless a later human-gate record approves it.
013. No live Confluence update is planned in this file.
014. No live OpenClaw pod execution is claimed in this file.
015. No `/workspace/skills` runtime installation is claimed in this file.
016. No secrets, tokens, credential contents, or private endpoints are required for this planning task.
017. The repository already had an untracked work-unit directory before this plan was added.
018. Pre-existing untracked directory observed: `docs/plans/work-units/mobile-app-dev-team-expansion/`.
019. This plan adds a new file inside that work-unit and does not overwrite the existing task packet.
020. Evidence command: `git status --short`.
021. Evidence result: pre-existing untracked work-unit directory was present before this file was created.
022. Evidence command: `git rev-parse --short HEAD`.
023. Evidence result: baseline commit was `2bc9ef5`.
024. Evidence command: `git branch --show-current`.
025. Evidence result: current branch was `main`.
026. Evidence command: `date -u +%Y-%m-%dT%H:%M:%SZ`.
027. Evidence result: observation timestamp was `2026-06-20T09:05:09Z`.
028. Primary SoT input: `AGENTS.md`.
029. `AGENTS.md` states pod-native OpenClaw skills are authored under `mobile-app-dev-team/runtime-sources/skills/<slug>/`.
030. `AGENTS.md` states the runtime shape is `/workspace/skills/<slug>/SKILL.md`.
031. `AGENTS.md` states `openclaw-pod-skills-sync` copy-syncs `mobile-app-dev-team/runtime-sources/skills` into `/workspace/skills`.
032. `AGENTS.md` states `project-bootstrap` runs after sync.
033. `AGENTS.md` states work requests and planning artifacts must route through `codex-role-workflow`.
034. `AGENTS.md` states evidence requirements and `human-gate/v1` must not be bypassed.
035. `AGENTS.md` states Codex skill artifacts live under `.agents/skills/<skill-name>/SKILL.md`.
036. `AGENTS.md` states Codex custom agents live under `.codex/agents/<agent-name>.toml`.
037. `AGENTS.md` states local harness does not prove `/workspace/skills`, OpenClaw packaging, or generated package results.
038. `AGENTS.md` states Codex runtime changes require `pnpm run test:runtime`.
039. `AGENTS.md` states Codex runtime changes require `pnpm run test:local-harness` when applicable.
040. `AGENTS.md` states current repo work must not push directly to `main`.
041. Primary SoT input: `PROJECT_ENVIRONMENT.md`.
042. `PROJECT_ENVIRONMENT.md` states `mobile-app-dev-team/runtime-sources/workflows/native-e2e-strategy.md` is the native evidence strategy doc.
043. `PROJECT_ENVIRONMENT.md` states pod bootstrap sync source is `mobile-app-dev-team/runtime-sources/skills/openclaw-pod-skills-sync/`.
044. `PROJECT_ENVIRONMENT.md` states pod bootstrap runtime shape is `/workspace/skills/openclaw-pod-skills-sync/SKILL.md`.
045. `PROJECT_ENVIRONMENT.md` states sync report path is `/workspace/state/openclaw-pod-skills-sync-report.json`.
046. `PROJECT_ENVIRONMENT.md` states `openclaw-pod-skills-sync` must run before `project-bootstrap`.
047. `PROJECT_ENVIRONMENT.md` states `project-bootstrap` source is `mobile-app-dev-team/runtime-sources/skills/project-bootstrap/`.
048. `PROJECT_ENVIRONMENT.md` states `project-bootstrap` runtime shape is `/workspace/skills/project-bootstrap/SKILL.md`.
049. `PROJECT_ENVIRONMENT.md` states required routing bridge is `/workspace/skills/codex-role-workflow/SKILL.md`.
050. `PROJECT_ENVIRONMENT.md` states managed repo execution contract is `/workspace/skills/codex-interactive-repo-work/SKILL.md`.
051. `PROJECT_ENVIRONMENT.md` states `project-bootstrap` must verify `codex-interactive-repo-work` after sync.
052. `PROJECT_ENVIRONMENT.md` states default checkout path in pods is `/workspace/projects/Wondermove-Inc/new-mobile-app`.
053. `PROJECT_ENVIRONMENT.md` states `mobile-app-dev-team/runtime-sources/skills/**` changes require targeted pod-native smoke plus `test:runtime`.
054. `PROJECT_ENVIRONMENT.md` states local harness is not required for `runtime-sources/skills/**` by path alone unless Codex runtime or harness paths also change.
055. `PROJECT_ENVIRONMENT.md` states `validate-runtime-sources.mjs` validates role SOULs, Codex matrix, pod-native OpenClaw skills, runtime specs, and pod bootstrap source docs.
056. `PROJECT_ENVIRONMENT.md` states `validate-runtime-routing-support.mjs` validates files directly named by `codex-role-workflow`.
057. `PROJECT_ENVIRONMENT.md` states `validate-runtime-routing-support.mjs` rejects resolving managed repo SoT from `/workspace/skills`.
058. `PROJECT_ENVIRONMENT.md` states local validation cannot prove external platform state.
059. Primary SoT input: `REPO_OPERATIONS.md`.
060. `REPO_OPERATIONS.md` defines policy ownership: root policy files own repo-wide policy, team docs own team/process/reference details.
061. `REPO_OPERATIONS.md` states narrowest authoritative owner wins when documents conflict.
062. `REPO_OPERATIONS.md` states `mobile-app-dev-team/` contains team, role, process, reference, and migration documentation.
063. `REPO_OPERATIONS.md` states `team-doc/00-source/` is immutable source/export evidence.
064. `REPO_OPERATIONS.md` states `team-doc/10-structured/` is generated/reference material, not current policy owner.
065. `REPO_OPERATIONS.md` states pod-native OpenClaw skills are authored under `mobile-app-dev-team/runtime-sources/skills/`.
066. `REPO_OPERATIONS.md` states `/workspace/skills` is only a runtime snapshot.
067. `REPO_OPERATIONS.md` states `openclaw-pod-skills-sync` is the required bridge from repo SoT to runtime snapshot.
068. `REPO_OPERATIONS.md` states `references/sot.md` is optional and not uniform across skills.
069. `REPO_OPERATIONS.md` defines a skill as a capability folder with required `SKILL.md`.
070. `REPO_OPERATIONS.md` defines a Codex CLI repo skill path as `.agents/skills/<name>/SKILL.md`.
071. `REPO_OPERATIONS.md` defines pod-native OpenClaw skill runtime path as `/workspace/skills/<slug>/SKILL.md`.
072. `REPO_OPERATIONS.md` defines pod-native OpenClaw skill authored path as `mobile-app-dev-team/runtime-sources/skills/<slug>/`.
073. `REPO_OPERATIONS.md` defines custom agents as `.codex/agents/<name>.toml`.
074. `REPO_OPERATIONS.md` warns that `.agents/` holds skills and `.codex/agents/` holds custom agents.
075. `REPO_OPERATIONS.md` states runtime and docs changes need linked evidence, not status-only prose.
076. `REPO_OPERATIONS.md` states `validate:team-doc` runs `validate-runtime-sources` and `validate-runtime-routing-support`.
077. `REPO_OPERATIONS.md` states `validate-team-doc-structure` validates the `mobile-app-dev-team/**` structure registry.
078. `REPO_OPERATIONS.md` states `validate-runtime-sources` validates runtime-source docs.
079. `REPO_OPERATIONS.md` states `validate-runtime-routing-support` validates routing-support SoT directly named by `codex-role-workflow`.
080. `REPO_OPERATIONS.md` states live Confluence publication requires explicit human approval.
081. Primary SoT input: `mobile-app-dev-team/source-map.md`.
082. `source-map.md` lists current repo sources and their use.
083. `source-map.md` lists `mobile-app-dev-team/runtime-sources/workflows/Product_Planning_WORKFLOW.md` as the current work process source.
084. `source-map.md` lists `mobile-app-dev-team/runtime-sources/codex-skill-agent-matrix.md` as current skill/agent mapping.
085. `source-map.md` lists `mobile-app-dev-team/runtime-sources/organizations/ORGANIZATIONS.md` as canonical organizations and reporting guidance source.
086. `source-map.md` lists `mobile-app-dev-team/runtime-sources/pod-environment-bootstrap.md` as current fresh pod bootstrap sequence.
087. `source-map.md` lists `mobile-app-dev-team/runtime-sources/orbstack-pod-config-values.md` as current pod config value handoff.
088. `source-map.md` lists `mobile-app-dev-team/runtime-sources/workflows/entry-case-routing.md` as current entry-case routing taxonomy.
089. `source-map.md` lists `mobile-app-dev-team/runtime-sources/skills/project-bootstrap/SKILL.md` as current pod-native project bootstrap source.
090. `source-map.md` says validators are repo-local evidence only.
091. `source-map.md` says validators do not prove live `/workspace/skills` installation.
092. `source-map.md` says validators do not prove actual OpenClaw pod execution.
093. `source-map.md` old-to-new crosswalk says `mobile-app-dev-team/02-role-souls/` moved to `mobile-app-dev-team/runtime-sources/role-souls/`.
094. `source-map.md` old-to-new crosswalk says `mobile-app-dev-team/04-skills-and-agents-matrix.md` moved to `mobile-app-dev-team/runtime-sources/codex-skill-agent-matrix.md`.
095. `source-map.md` old-to-new crosswalk says `mobile-app-dev-team/05-work-processes.md` moved to `mobile-app-dev-team/runtime-sources/workflows/Product_Planning_WORKFLOW.md`.
096. `source-map.md` old-to-new crosswalk says `mobile-app-dev-team/09-pod-native-openclaw-skills/` moved to `mobile-app-dev-team/runtime-sources/skills/`.
097. `source-map.md` old-to-new crosswalk says `mobile-app-dev-team/10-github-artifact-workflow.md` moved to `mobile-app-dev-team/runtime-sources/workflows/github-artifact-workflow.md`.
098. `source-map.md` old-to-new crosswalk says `mobile-app-dev-team/14-native-e2e-strategy.md` moved to `mobile-app-dev-team/runtime-sources/workflows/native-e2e-strategy.md`.
099. `source-map.md` old-to-new crosswalk says `mobile-app-dev-team/16-pod-environment-bootstrap.md` moved to `mobile-app-dev-team/runtime-sources/pod-environment-bootstrap.md`.
100. `source-map.md` old-to-new crosswalk says `mobile-app-dev-team/17-orbstack-pod-config-values.md` moved to `mobile-app-dev-team/runtime-sources/orbstack-pod-config-values.md`.
101. `source-map.md` old-to-new crosswalk says `mobile-app-dev-team/19-entry-case-routing.md` moved to `mobile-app-dev-team/runtime-sources/workflows/entry-case-routing.md`.
102. `source-map.md` old-to-new crosswalk says `mobile-app-dev-team/20-app-eas-ota-rollback-runbook.md` moved to `mobile-app-dev-team/governance/app-eas-ota-rollback-runbook.md`.
103. `source-map.md` harness applicability says `runtime-sources/skills/**` uses `test:runtime` plus targeted pod-native smoke.
104. `source-map.md` says `runtime-sources/skills/**` does not require local harness by path alone.
105. `source-map.md` says stale/lower-priority sources lose to current repo files.
106. Primary SoT input: `scripts/validate-team-doc-structure.mjs`.
107. `validate-team-doc-structure.mjs` registry maps numbered legacy paths to current paths.
108. It maps `02-role-souls/` to `runtime-sources/role-souls/`.
109. It maps `04-skills-and-agents-matrix.md` to `runtime-sources/codex-skill-agent-matrix.md`.
110. It maps `05-work-processes.md` to `runtime-sources/workflows/Product_Planning_WORKFLOW.md`.
111. It maps `09-pod-native-openclaw-skills/` to `runtime-sources/skills/`.
112. It maps `10-github-artifact-workflow.md` to `runtime-sources/workflows/github-artifact-workflow.md`.
113. It maps `14-native-e2e-strategy.md` to `runtime-sources/workflows/native-e2e-strategy.md`.
114. It maps `16-pod-environment-bootstrap.md` to `runtime-sources/pod-environment-bootstrap.md`.
115. It maps `17-orbstack-pod-config-values.md` to `runtime-sources/orbstack-pod-config-values.md`.
116. It maps `19-entry-case-routing.md` to `runtime-sources/workflows/entry-case-routing.md`.
117. It maps `20-app-eas-ota-rollback-runbook.md` to `governance/app-eas-ota-rollback-runbook.md`.
118. It maps numbered ref-organization directories to unnumbered directories.
119. It records completed-plan archives separately from active runtime sources.
120. The registry treats `R1`, `R2`, and `C1` as runtime surface classes.
121. Primary SoT input: `scripts/validate-runtime-sources.mjs`.
122. `validate-runtime-sources.mjs` sets pod-native root to `mobile-app-dev-team/runtime-sources/skills`.
123. `validate-runtime-sources.mjs` sets legacy pod-native root to `mobile-app-dev-team/09-pod-native-openclaw-skills`.
124. `validate-runtime-sources.mjs` sets role SOUL root to `mobile-app-dev-team/runtime-sources/role-souls`.
125. `validate-runtime-sources.mjs` sets legacy role SOUL root to `mobile-app-dev-team/02-role-souls`.
126. `validate-runtime-sources.mjs` fails if the legacy pod-native root exists.
127. `validate-runtime-sources.mjs` fails if the legacy role SOUL root exists.
128. `validate-runtime-sources.mjs` requires `runtime-sources/skills/README.md`.
129. `validate-runtime-sources.mjs` requires role runtime spec paths under `runtime-sources/skills/`.
130. `validate-runtime-sources.mjs` requires organizations guidance under `runtime-sources/organizations/ORGANIZATIONS.md`.
131. Primary SoT input: `scripts/validate-runtime-routing-support.mjs`.
132. `validate-runtime-routing-support.mjs` requires `mobile-app-dev-team/README.md`.
133. It requires `mobile-app-dev-team/runtime-sources/skills/codex-role-workflow/SKILL.md`.
134. It requires `mobile-app-dev-team/runtime-sources/workflows/entry-case-routing.md`.
135. It requires `mobile-app-dev-team/runtime-sources/workflows/Product_Planning_WORKFLOW.md`.
136. It requires `mobile-app-dev-team/governance/gates-and-evidence.md`.
137. It requires `mobile-app-dev-team/runtime-sources/workflows/github-artifact-workflow.md`.
138. It requires `mobile-app-dev-team/governance/app-eas-ota-rollback-runbook.md`.
139. It requires `codex-role-workflow` to point to managed repo path `/workspace/projects/Wondermove-Inc/new-mobile-app/mobile-app-dev-team/runtime-sources/workflows/entry-case-routing.md`.
140. It forbids resolving managed repo SoT under `/workspace/skills/codex-role-workflow`.
141. Primary SoT input: `mobile-app-dev-team/runtime-sources/skills/README.md`.
142. `runtime-sources/skills/README.md` says this folder is source-only documentation for pod-native OpenClaw skills.
143. It states runtime shape is `/workspace/skills/<slug>/SKILL.md`.
144. It states organizations guidance lives at `mobile-app-dev-team/runtime-sources/organizations/ORGANIZATIONS.md`.
145. It states `openclaw-pod-skills-sync` copies organizations guidance to `/workspace/ORGANIZATIONS.md`.
146. It states repo-local Codex CLI artifacts do not belong in pod-native skills.
147. It states normal setup after clone or pull starts with `openclaw-pod-skills-sync`, then `project-bootstrap`.
148. It states role runtime specs live under `mobile-app-dev-team/runtime-sources/skills/*-agent-runtime-spec.md`.
149. It lists canonical role slugs.
150. It states runtime specs must be read only for the matching role after `project-bootstrap`.
151. It states `/workspace/skills/codex-role-workflow/SKILL.md` resolves allowed repo-local skills, reviewers, stage, and next action.
152. It states `codex-interactive-repo-work` is required when routed repo edits are authorized.
153. It states setup reports must include `/workspace/state/openclaw-pod-skills-sync-report.json`.
154. It states setup reports must include `/workspace/state/project-bootstrap-agent-setup-report.json`.
155. It states setup reports must include `/workspace/state/project-bootstrap-report.json`.
156. Primary SoT input: `mobile-app-dev-team/runtime-sources/codex-skill-agent-matrix.md`.
157. The matrix states active repo-local skills are only directories under `.agents/skills/<slug>/SKILL.md`.
158. The matrix lists active `wm`, `wm-orchestrate`, `git-workflow`, `po-*`, `design-*`, `mobile-*`, `e2e-test`, and `qa-railway-workflow` skills.
159. The matrix states `$wm routing` allows dedicated `wm-*`, `po-*`, and `design-*` read-only agents.
160. The matrix lists `wm-implementation-reviewer`.
161. The matrix lists `wm-contract-reviewer`.
162. The matrix lists `wm-docs-researcher`.
163. The matrix lists `wm-gate-fix-advisor`.
164. The matrix lists `po-planning-reviewer`.
165. The matrix lists `po-scope-gate-reviewer`.
166. The matrix lists `po-docs-researcher`.
167. The matrix lists `design-reviewer`.
168. The matrix lists `design-researcher`.
169. The matrix says legacy `mobile-*` agents remain for other surfaces but `$wm` should prefer dedicated reviewers.
170. The matrix states pod-native skills are source-managed under `runtime-sources/skills/`.
171. The matrix states pod-native skills run in pods as `/workspace/skills/<slug>/SKILL.md`.
172. The matrix states `codex-role-workflow` is the role-aware pod bridge.
173. The matrix states `codex-interactive-repo-work` is the managed-repo execution contract.
174. Primary SoT input: `.codex/agents/po-planning-reviewer.toml`.
175. `po-planning-reviewer` is read-only.
176. It reviews planning packages, scope, role boundaries, evidence, and execution readiness.
177. It checks every work item maps to PRD acceptance lines or deferred/non-goal status.
178. It checks task completeness fields.
179. It checks role routing is not collapsed into Product/Planning.
180. It checks evidence is linked artifacts, not status prose.
181. It checks human gates.
182. It checks Design/Stitch P0/P1 gates when relevant.
183. It returns exactly one reviewer verdict JSON envelope.
184. Primary SoT input: `.codex/agents/wm-implementation-reviewer.toml`.
185. `wm-implementation-reviewer` is read-only.
186. It reviews wm-scoped implementation, tests, evidence, contract drift, and repo workflow boundaries.
187. It checks AGENTS, PROJECT_ENVIRONMENT, affected paths, tests-first evidence, evidence, and PR readiness.
188. It returns exactly one reviewer verdict JSON envelope.
189. Actual tree evidence command: `find mobile-app-dev-team/runtime-sources -maxdepth 2 -type d | sort`.
190. Actual tree includes `mobile-app-dev-team/runtime-sources`.
191. Actual tree includes `mobile-app-dev-team/runtime-sources/agents`.
192. Actual tree includes `mobile-app-dev-team/runtime-sources/heartbeat`.
193. Actual tree includes `mobile-app-dev-team/runtime-sources/organizations`.
194. Actual tree includes `mobile-app-dev-team/runtime-sources/role-souls`.
195. Actual tree includes `mobile-app-dev-team/runtime-sources/skills`.
196. Actual tree includes `mobile-app-dev-team/runtime-sources/skills-candidate`.
197. Actual tree includes `mobile-app-dev-team/runtime-sources/tools`.
198. Actual tree includes `mobile-app-dev-team/runtime-sources/workflows`.
199. Actual tree does not include `mobile-app-dev-team/runtime-sources/pod-native-openclaw-skills`.
200. Actual tree does not include `mobile-app-dev-team/02-role-souls`.
201. Actual tree does not include `mobile-app-dev-team/09-pod-native-openclaw-skills`.
202. Actual file evidence command: `find mobile-app-dev-team/runtime-sources -maxdepth 2 -type f | sort`.
203. Actual file: `mobile-app-dev-team/runtime-sources/agents/Backend_API_Integrator_AGENTS.md`.
204. Actual file: `mobile-app-dev-team/runtime-sources/agents/Design_AGENTS.md`.
205. Actual file: `mobile-app-dev-team/runtime-sources/agents/Mobile_App_Dev_AGENTS.md`.
206. Actual file: `mobile-app-dev-team/runtime-sources/agents/Mobile_Architect_AGENTS.md`.
207. Actual file: `mobile-app-dev-team/runtime-sources/agents/Product_Planning_AGENTS.md`.
208. Actual file: `mobile-app-dev-team/runtime-sources/agents/Product_Planning_ENHANCEMENT_PROOF.md`.
209. Actual file: `mobile-app-dev-team/runtime-sources/agents/QA_Release_AGENTS.md`.
210. Actual file: `mobile-app-dev-team/runtime-sources/codex-skill-agent-matrix.md`.
211. Actual file: `mobile-app-dev-team/runtime-sources/heartbeat/Backend_API_Integrator_HEARTBEAT.md`.
212. Actual file: `mobile-app-dev-team/runtime-sources/heartbeat/Design_HEARTBEAT.md`.
213. Actual file: `mobile-app-dev-team/runtime-sources/heartbeat/Mobile_App_Dev_HEARTBEAT.md`.
214. Actual file: `mobile-app-dev-team/runtime-sources/heartbeat/Mobile_Architect_HEARTBEAT.md`.
215. Actual file: `mobile-app-dev-team/runtime-sources/heartbeat/Product_Planning_HEARTBEAT.md`.
216. Actual file: `mobile-app-dev-team/runtime-sources/heartbeat/QA_Release_HEARTBEAT.md`.
217. Actual file: `mobile-app-dev-team/runtime-sources/orbstack-pod-config-values.md`.
218. Actual file: `mobile-app-dev-team/runtime-sources/organizations/ORGANIZATIONS.md`.
219. Actual file: `mobile-app-dev-team/runtime-sources/pod-environment-bootstrap.md`.
220. Actual file: `mobile-app-dev-team/runtime-sources/role-souls/backend-api-integrator-soul.md`.
221. Actual file: `mobile-app-dev-team/runtime-sources/role-souls/design-soul.md`.
222. Actual file: `mobile-app-dev-team/runtime-sources/role-souls/mobile-app-dev-soul.md`.
223. Actual file: `mobile-app-dev-team/runtime-sources/role-souls/mobile-architect-soul.md`.
224. Actual file: `mobile-app-dev-team/runtime-sources/role-souls/product-planning-soul.md`.
225. Actual file: `mobile-app-dev-team/runtime-sources/role-souls/qa-release-soul.md`.
226. Actual file: `mobile-app-dev-team/runtime-sources/skills/README.md`.
227. Actual file: `mobile-app-dev-team/runtime-sources/skills/backend-api-integrator-agent-runtime-spec.md`.
228. Actual file: `mobile-app-dev-team/runtime-sources/skills/design-agent-runtime-spec.md`.
229. Actual file: `mobile-app-dev-team/runtime-sources/skills/mobile-app-dev-agent-runtime-spec.md`.
230. Actual file: `mobile-app-dev-team/runtime-sources/skills/mobile-architect-agent-runtime-spec.md`.
231. Actual file: `mobile-app-dev-team/runtime-sources/skills/product-planning-agent-runtime-spec.md`.
232. Actual file: `mobile-app-dev-team/runtime-sources/skills/qa-release-agent-runtime-spec.md`.
233. Actual file: `mobile-app-dev-team/runtime-sources/tools/Backend_API_Integrator_TOOLS.md`.
234. Actual file: `mobile-app-dev-team/runtime-sources/tools/Design_TOOLS.md`.
235. Actual file: `mobile-app-dev-team/runtime-sources/tools/Mobile_App_Dev_TOOLS.md`.
236. Actual file: `mobile-app-dev-team/runtime-sources/tools/Mobile_Architect_TOOLS.md`.
237. Actual file: `mobile-app-dev-team/runtime-sources/tools/Product_Planning_TOOLS.md`.
238. Actual file: `mobile-app-dev-team/runtime-sources/tools/QA_Release_TOOLS.md`.
239. Actual file: `mobile-app-dev-team/runtime-sources/workflows/Backend_API_Integrator_WORKFLOW.md`.
240. Actual file: `mobile-app-dev-team/runtime-sources/workflows/Design_WORKFLOW.md`.
241. Actual file: `mobile-app-dev-team/runtime-sources/workflows/Mobile_App_Dev_WORKFLOW.md`.
242. Actual file: `mobile-app-dev-team/runtime-sources/workflows/Mobile_Architect_WORKFLOW.md`.
243. Actual file: `mobile-app-dev-team/runtime-sources/workflows/Product_Planning_WORKFLOW.md`.
244. Actual file: `mobile-app-dev-team/runtime-sources/workflows/QA_Release_WORKFLOW.md`.
245. Actual file: `mobile-app-dev-team/runtime-sources/workflows/entry-case-routing.md`.
246. Actual file: `mobile-app-dev-team/runtime-sources/workflows/github-artifact-workflow.md`.
247. Actual file: `mobile-app-dev-team/runtime-sources/workflows/native-e2e-strategy.md`.
248. Actual skill file evidence command: `find mobile-app-dev-team/runtime-sources/skills -maxdepth 2 -type f | sort`.
249. Actual pod-native skill directory: `mobile-app-dev-team/runtime-sources/skills/codex-cli-auth-setup/`.
250. Actual pod-native skill directory: `mobile-app-dev-team/runtime-sources/skills/codex-interactive-repo-work/`.
251. Actual pod-native skill directory: `mobile-app-dev-team/runtime-sources/skills/codex-role-workflow/`.
252. Actual pod-native skill directory: `mobile-app-dev-team/runtime-sources/skills/eas-robot-auth-setup/`.
253. Actual pod-native skill directory: `mobile-app-dev-team/runtime-sources/skills/openclaw-pod-skills-sync/`.
254. Actual pod-native skill directory: `mobile-app-dev-team/runtime-sources/skills/pod-role-bootstrap/`.
255. Actual pod-native skill directory: `mobile-app-dev-team/runtime-sources/skills/project-bootstrap/`.
256. Actual pod-native skill directory: `mobile-app-dev-team/runtime-sources/skills/stitch-adc-setup/`.
257. Actual pod-native skill directory: `mobile-app-dev-team/runtime-sources/skills/wm-meeting-process/`.
258. Actual candidate skill directory: `mobile-app-dev-team/runtime-sources/skills-candidate/workspace-operating-files-pinpoint-audit/`.
259. Actual sync script source root default: `mobile-app-dev-team/runtime-sources/skills`.
260. Actual sync script candidate root default: `mobile-app-dev-team/runtime-sources/skills-candidate`.
261. Actual sync script organizations source default: `mobile-app-dev-team/runtime-sources/organizations/ORGANIZATIONS.md`.
262. Actual sync script role operating file source defaults use `runtime-sources/agents`.
263. Actual sync script role workflow source defaults use `runtime-sources/workflows`.
264. Actual sync script heartbeat source defaults use `runtime-sources/heartbeat`.
265. Actual sync script tools source defaults use `runtime-sources/tools`.
266. Actual sync script still records a legacy source root default under `runtime-sources/pod-native-openclaw-skills`.
267. The legacy source root in the sync script is not automatically a stale bug because it may preserve compatibility/reporting.
268. Any change to the legacy fallback must be planned separately with tests because it affects runtime behavior.
269. Stale reference evidence command: `rg -n "runtime-sources/pod-native-openclaw-skills|09-pod-native-openclaw-skills|team-doc/mobile-app-dev-team|mobile-app-dev-team/(02-role-souls|05-work-processes|09-pod-native|10-github|14-native|16-pod|17-orbstack|19-entry|20-app-eas)" docs/plans/work-units/mobile-app-dev-team-expansion mobile-app-dev-team --glob "!**/.DS_Store"`.
270. Stale reference evidence result: task packet line 51 references `mobile-app-dev-team/runtime-sources/pod-native-openclaw-skills/README.md`.
271. Stale reference evidence result: task packet line 229 references `runtime-sources/pod-native-openclaw-skills/**`.
272. Stale reference evidence result: `source-map.md` retains old paths only inside old-to-new crosswalk.
273. Stale reference evidence result: `openclaw-pod-skills-sync/scripts/sync-pod-skills.sh` retains legacy source root.
274. Stale reference evidence result: `openclaw-pod-skills-sync/references/report-template.md` documents legacy source root.
275. Classification: existing task packet references to `runtime-sources/pod-native-openclaw-skills` are update-now planning targets.
276. Classification: `source-map.md` old-to-new crosswalk references are keep-now because they are the SoT for completed rename history.
277. Classification: sync script legacy fallback is review-only unless a runtime behavior change is approved.
278. Classification: sync report-template legacy path is review-only with sync script compatibility.
279. Classification: active docs should not point readers to `runtime-sources/pod-native-openclaw-skills` as if it exists.
280. Classification: active docs should not point readers to `mobile-app-dev-team/09-pod-native-openclaw-skills` as current source.
281. Classification: active docs may mention `mobile-app-dev-team/09-pod-native-openclaw-skills` only in old-to-new crosswalk or legacy compatibility context.
282. Classification: active docs should prefer `mobile-app-dev-team/runtime-sources/skills/README.md` for pod-native skill matrix.
283. Classification: active docs should prefer `mobile-app-dev-team/runtime-sources/skills/<slug>/SKILL.md` for pod-native skill source.
284. Classification: active docs should prefer `mobile-app-dev-team/runtime-sources/role-souls/` for role SOUL source.
285. Classification: active docs should prefer `mobile-app-dev-team/runtime-sources/workflows/` for workflows.
286. Classification: active docs should prefer `mobile-app-dev-team/runtime-sources/agents/` for role runtime AGENTS sources.
287. Classification: active docs should prefer `mobile-app-dev-team/runtime-sources/tools/` for role runtime TOOLS sources.
288. Classification: active docs should prefer `mobile-app-dev-team/runtime-sources/heartbeat/` for role HEARTBEAT sources.
289. Classification: active docs should prefer `mobile-app-dev-team/runtime-sources/organizations/ORGANIZATIONS.md` for organizations guidance.
290. Classification: active docs should preserve `/workspace/skills/<slug>/SKILL.md` as runtime snapshot path, not repo SoT path.
291. Path family R1: pod-native skill source.
292. R1 current root: `mobile-app-dev-team/runtime-sources/skills/`.
293. R1 runtime root: `/workspace/skills/`.
294. R1 setup bridge: `openclaw-pod-skills-sync`.
295. R1 current index: `mobile-app-dev-team/runtime-sources/skills/README.md`.
296. R1 validation owner: `scripts/validate-runtime-sources.mjs`.
297. R1 evidence command after updates: `pnpm run validate:team-doc`.
298. R1 targeted smoke after source script/skill changes: `bash evals/skills/openclaw-pod-skills-sync-smoke.sh`.
299. R1 targeted smoke after project-bootstrap changes: `bash evals/skills/project-bootstrap-agent-setup-smoke.sh`.
300. R1 local harness rule: not required by path alone unless Codex runtime or harness paths also change.
301. Path family R2: role SOUL runtime sources.
302. R2 current root: `mobile-app-dev-team/runtime-sources/role-souls/`.
303. R2 validation owner: `scripts/validate-runtime-sources.mjs`.
304. R2 historical root: `mobile-app-dev-team/02-role-souls/`.
305. R2 old root should only appear in crosswalk or historical context.
306. Path family C1: Codex skill/agent matrix and runtime contracts.
307. C1 current file: `mobile-app-dev-team/runtime-sources/codex-skill-agent-matrix.md`.
308. C1 active skill source: `.agents/skills/<slug>/SKILL.md`.
309. C1 active agent source: `.codex/agents/<agent>.toml`.
310. C1 reviewer routing for `$wm`: dedicated `wm-*`, `po-*`, and `design-*` read-only agents.
311. C1 legacy `mobile-*` agents: keep only as legacy/non-wm context unless newer SoT says otherwise.
312. Path family W1: workflow and handoff docs.
313. W1 current root: `mobile-app-dev-team/runtime-sources/workflows/`.
314. W1 Product/Planning workflow: `Product_Planning_WORKFLOW.md`.
315. W1 GitHub artifact workflow: `github-artifact-workflow.md`.
316. W1 native evidence strategy: `native-e2e-strategy.md`.
317. W1 entry-case routing: `entry-case-routing.md`.
318. W1 validation owner: `scripts/validate-workflow-docs.mjs`.
319. W1 routing-support subset validation owner: `scripts/validate-runtime-routing-support.mjs`.
320. Path family G1: governance docs.
321. G1 current root: `mobile-app-dev-team/governance/`.
322. G1 gates evidence: `gates-and-evidence.md`.
323. G1 rollback runbook: `app-eas-ota-rollback-runbook.md`.
324. G1 validation owner: `scripts/validate-governance-docs.mjs`.
325. Path family O1: organization docs.
326. O1 current root: `mobile-app-dev-team/organization/`.
327. O1 role capability matrix: `role-capability-matrix.md`.
328. O1 validation owner: structure/reference validators depending on file.
329. Path family H1: reusable reference organization.
330. H1 current root: `mobile-app-dev-team/ref-organization/`.
331. H1 validation owner: `scripts/validate-reference-docs.mjs`.
332. H1 old numbered ref directories should only appear in migration crosswalks.
333. Path family P1: reports and completed planning artifacts.
334. P1 includes completed or historical plans, reports, and explainers.
335. P1 should not be silently rewritten into current runtime SoT.
336. P1 completed plan archive rules live in `REPO_OPERATIONS.md` and `source-map.md`.
337. Update target A: existing work-unit task packet stale pod-native skill path.
338. Target A file: `docs/plans/work-units/mobile-app-dev-team-expansion/00-product-planning/task-packet.md`.
339. Target A current stale line: `mobile-app-dev-team/runtime-sources/pod-native-openclaw-skills/README.md`.
340. Target A replacement: `mobile-app-dev-team/runtime-sources/skills/README.md`.
341. Target A current stale line: `runtime-sources/pod-native-openclaw-skills/**`.
342. Target A replacement: `runtime-sources/skills/**`.
343. Target A basis: actual tree contains `runtime-sources/skills/README.md`.
344. Target A basis: actual tree does not contain `runtime-sources/pod-native-openclaw-skills/`.
345. Target A basis: source-map crosswalk says old pod-native root moved to `runtime-sources/skills/`.
346. Target A basis: AGENTS and REPO_OPERATIONS name `runtime-sources/skills/<slug>/`.
347. Target A validation after update: `pnpm run validate:work-units`.
348. Target A validation after update: `pnpm run validate:team-doc` if active managed runtime references are touched by the same change.
349. Target A reviewer after update: `po-planning-reviewer`.
350. Target A expected owner: Product/Planning because this is a planning artifact.
351. Update target B: `mobile-app-dev-team/README.md` document structure table.
352. Target B observed issue: the table lists `workflows/Product_Planning_WORKFLOW.md`.
353. Target B observed issue: the actual current path is `runtime-sources/workflows/Product_Planning_WORKFLOW.md`.
354. Target B observed issue: the table lists `workflows/github-artifact-workflow.md`.
355. Target B observed issue: the actual current path is `runtime-sources/workflows/github-artifact-workflow.md`.
356. Target B observed issue: the table lists `workflows/native-e2e-strategy.md`.
357. Target B observed issue: the actual current path is `runtime-sources/workflows/native-e2e-strategy.md`.
358. Target B observed issue: the table lists `workflows/entry-case-routing.md`.
359. Target B observed issue: the actual current path is `runtime-sources/workflows/entry-case-routing.md`.
360. Target B replacement policy: make all workflow paths in the table include `runtime-sources/workflows/`.
361. Target B basis: `source-map.md` current repo sources list all four workflow docs under `runtime-sources/workflows/`.
362. Target B basis: `validate-runtime-routing-support.mjs` names workflow support paths under `runtime-sources/workflows/`.
363. Target B validation after update: `pnpm run validate:team-doc`.
364. Target B validation after update: `pnpm run validate:workflow-docs`.
365. Target B reviewer after update: `po-planning-reviewer` for current SoT navigation.
366. Target B gate impact: active routing support doc, so `validate:team-doc` matters.
367. Update target C: check active docs for old numbered current paths.
368. Target C search pattern: `mobile-app-dev-team/02-role-souls`.
369. Target C search pattern: `mobile-app-dev-team/05-work-processes.md`.
370. Target C search pattern: `mobile-app-dev-team/09-pod-native-openclaw-skills`.
371. Target C search pattern: `mobile-app-dev-team/10-github-artifact-workflow.md`.
372. Target C search pattern: `mobile-app-dev-team/14-native-e2e-strategy.md`.
373. Target C search pattern: `mobile-app-dev-team/16-pod-environment-bootstrap.md`.
374. Target C search pattern: `mobile-app-dev-team/17-orbstack-pod-config-values.md`.
375. Target C search pattern: `mobile-app-dev-team/19-entry-case-routing.md`.
376. Target C search pattern: `mobile-app-dev-team/20-app-eas-ota-rollback-runbook.md`.
377. Target C rule: update only current-navigation references.
378. Target C rule: keep old-to-new crosswalk references.
379. Target C rule: keep historical archive references.
380. Target C rule: keep explicit legacy compatibility references if linked to fallback behavior.
381. Target C validation after update: `pnpm run validate:team-doc`.
382. Target C optional validation: `pnpm run validate:reference-docs` if ref-organization crosswalks are touched.
383. Update target D: check docs/plans active scratch files.
384. Target D basis: `REPO_OPERATIONS.md` says `docs/plans/active/` is gitignored local scratch.
385. Target D rule: do not treat active scratch plans as durable SoT.
386. Target D rule: update active scratch only if the user explicitly wants local scratch cleanup.
387. Target D current plan decision: do not update `docs/plans/active/**` in the first execution slice.
388. Target D basis: durable execution handoff belongs in `docs/plans/work-units/`.
389. Target D risk: editing active scratch can create noise without improving current SoT.
390. Target D reviewer: no reviewer needed if deferred as non-goal.
391. Update target E: check runtime sync legacy fallback.
392. Target E file: `mobile-app-dev-team/runtime-sources/skills/openclaw-pod-skills-sync/scripts/sync-pod-skills.sh`.
393. Target E observed term: `LEGACY_SOURCE_ROOT` defaults to `runtime-sources/pod-native-openclaw-skills`.
394. Target E basis: script also defaults `SOURCE_ROOT` to `runtime-sources/skills`.
395. Target E basis: source-map says `runtime-sources/skills/` is current source.
396. Target E classification: review-only for this plan.
397. Target E reason: changing fallback behavior can affect pod sync behavior and requires tests first.
398. Target E test-before-change if approved later: add or update sync smoke fixture for missing legacy root.
399. Target E validation if changed later: `bash evals/skills/openclaw-pod-skills-sync-smoke.sh`.
400. Target E validation if changed later: `pnpm run test:runtime`.
401. Target E reviewer if changed later: `wm-implementation-reviewer`.
402. Target E not included in first docs-only update slice.
403. Update target F: check sync report-template legacy path.
404. Target F file: `mobile-app-dev-team/runtime-sources/skills/openclaw-pod-skills-sync/references/report-template.md`.
405. Target F observed term: `legacy_source_root` example points to `runtime-sources/pod-native-openclaw-skills`.
406. Target F classification: review-only paired with Target E.
407. Target F reason: report template mirrors script output fields.
408. Target F should not be changed independently from script semantics.
409. Target F validation if changed later: targeted sync smoke plus `test:runtime`.
410. Target F reviewer if changed later: `wm-implementation-reviewer`.
411. Update target G: current `runtime-sources` structure index.
412. Target G possible gap: no `mobile-app-dev-team/runtime-sources/README.md` currently exists.
413. Target G basis: current tree has multiple runtime-source subfolders.
414. Target G possible value: a root README could explain subfolders.
415. Target G non-goal: do not add a new root README in the first slice unless Product/Planning approves.
416. Target G reason: adding a new current source may require validator expectations and reviewer approval.
417. Target G future task owner: Product/Planning.
418. Target G future reviewer: `po-planning-reviewer`.
419. Target G future validation: `pnpm run validate:team-doc` and `pnpm run validate:team-doc-structure` if registry is updated.
420. Target G current plan action: record as optional follow-up, not update-now.
421. Update target H: current root `ORGANIZATIONS.md`.
422. Target H observed current path: root stub points to `runtime-sources/organizations/ORGANIZATIONS.md`.
423. Target H classification: keep-now.
424. Target H basis: actual tree contains the organizations source.
425. Target H basis: `runtime-sources/skills/README.md` says sync copies it to `/workspace/ORGANIZATIONS.md`.
426. Target H no update needed unless later searches find stale organizations paths.
427. Update target I: `CLAUDE.md`.
428. Target I observed current term: pod-native skill authored under `runtime-sources/skills/<slug>/`.
429. Target I classification: keep-now.
430. Target I no update needed for the observed runtime-sources rename.
431. Update target J: `.agents/skills/*/references/sot.md`.
432. Target J observed current mobile workflow SoT files point to `runtime-sources/role-souls` and `runtime-sources/workflows`.
433. Target J classification: keep-now for currently inspected files.
434. Target J future search rule: if any `references/sot.md` points to numbered legacy paths as current SoT, update it.
435. Target J validation if changed: `pnpm run test:runtime`.
436. Target J reviewer if changed: role-appropriate read-only reviewer.
437. Update target K: `PROJECT_ENVIRONMENT.md`.
438. Target K observed current pod bootstrap paths are already under `runtime-sources/skills`.
439. Target K observed current native strategy path is under `runtime-sources/workflows`.
440. Target K classification: keep-now.
441. Target K update only if actual runtime-source sync semantics change.
442. Target K validation if changed: `pnpm run validate:project-environment` through `pnpm run test:runtime`.
443. Update target L: `AGENTS.md`.
444. Target L observed current pod-native path is `runtime-sources/skills/<slug>/`.
445. Target L classification: keep-now.
446. Target L update only if future runtime source root changes again.
447. Target L validation if changed: `pnpm run test:runtime` and likely `pnpm run test:local-harness`.
448. Update target M: `REPO_OPERATIONS.md`.
449. Target M observed current pod-native path is `runtime-sources/skills/`.
450. Target M classification: keep-now.
451. Target M update only if policy ownership or runtime bridge semantics change.
452. Target M validation if changed: `pnpm run test:runtime` and likely `pnpm run test:local-harness`.
453. Update target N: `mobile-app-dev-team/source-map.md`.
454. Target N observed current crosswalk is accurate and intentionally mentions old paths.
455. Target N classification: keep-now.
456. Target N should not be scrubbed of old paths because it is the source-map crosswalk.
457. Target N update only if new folder rename creates a new old-to-new mapping.
458. Target N validation if changed: `pnpm run validate:team-doc-structure` and `pnpm run validate:reference-docs`.
459. Update target O: `docs/plans/work-units/mobile-app-dev-team-expansion/status.json`.
460. Target O observed existing reviewer status says passed with task-packet evidence.
461. Target O risk: adding this plan may make status incomplete if not linked.
462. Target O first slice option: update status evidence to include this plan after reviewer returns GO.
463. Target O first slice option requires care because status changes are tracked work-unit state changes.
464. Target O validation if changed: `pnpm run validate:work-units`.
465. Target O reviewer if changed: `po-planning-reviewer`.
466. Target O current plan decision: reviewer report can be linked in final user report without mutating status unless user approves status update.
467. Update target P: `.DS_Store` in untracked work-unit.
468. Target P observed file: `docs/plans/work-units/mobile-app-dev-team-expansion/.DS_Store`.
469. Target P classification: local cleanup-only.
470. Target P action: do not delete unless user asks, because it pre-existed this run.
471. Target P validation: not applicable.
472. Execution phase 0: preserve baseline evidence.
473. Phase 0 task: record `git status --short`.
474. Phase 0 task: record `find mobile-app-dev-team/runtime-sources -maxdepth 2 -type d | sort`.
475. Phase 0 task: record `find mobile-app-dev-team/runtime-sources -maxdepth 2 -type f | sort`.
476. Phase 0 task: record `rg` results for old path patterns.
477. Phase 0 done-when: update targets A through P are classified.
478. Phase 0 evidence path: this plan plus reviewer output.
479. Execution phase 1: update planning artifact stale paths.
480. Phase 1 scope: `docs/plans/work-units/mobile-app-dev-team-expansion/00-product-planning/task-packet.md`.
481. Phase 1 change: replace `runtime-sources/pod-native-openclaw-skills` with `runtime-sources/skills`.
482. Phase 1 change: replace the referenced README path with `runtime-sources/skills/README.md`.
483. Phase 1 change: preserve the planning-only and reviewer boundary language.
484. Phase 1 test-first guard: run `pnpm run validate:work-units` before or immediately after the tiny docs change to expose schema drift.
485. Phase 1 validation: `pnpm run validate:work-units`.
486. Phase 1 reviewer: `po-planning-reviewer`.
487. Phase 1 checkpoint: stop after task-packet fix and review diff.
488. Execution phase 2: update current navigation docs.
489. Phase 2 scope: `mobile-app-dev-team/README.md`.
490. Phase 2 change: fix workflow table entries to use `runtime-sources/workflows/...`.
491. Phase 2 change: verify no table entry points to a non-existing current path.
492. Phase 2 validation: `pnpm run validate:team-doc`.
493. Phase 2 validation: `pnpm run validate:workflow-docs`.
494. Phase 2 reviewer: `po-planning-reviewer`.
495. Phase 2 checkpoint: stop after README fix and review diff.
496. Execution phase 3: scan remaining current docs.
497. Phase 3 scope: current SoT docs, work-unit durable docs, and repo-local skill SoT references.
498. Phase 3 excluded scope: `docs/plans/active/**` scratch unless explicitly requested.
499. Phase 3 excluded scope: root archive bundle content unless archive migration is approved.
500. Phase 3 excluded scope: sync script legacy fallback unless runtime behavior change is approved.
501. Phase 3 command: `rg -n "runtime-sources/pod-native-openclaw-skills|09-pod-native-openclaw-skills|mobile-app-dev-team/02-role-souls|mobile-app-dev-team/05-work-processes|mobile-app-dev-team/10-github-artifact-workflow|mobile-app-dev-team/14-native-e2e-strategy|mobile-app-dev-team/16-pod-environment-bootstrap|mobile-app-dev-team/17-orbstack-pod-config-values|mobile-app-dev-team/19-entry-case-routing|mobile-app-dev-team/20-app-eas-ota-rollback-runbook" mobile-app-dev-team docs .agents .codex AGENTS.md PROJECT_ENVIRONMENT.md REPO_OPERATIONS.md ORGANIZATIONS.md CLAUDE.md --glob "!docs/plans/active/**" --glob "!TEAM_DOC_ARCHIVE_BUNDLE.jsonl"`.
502. Phase 3 action: classify every hit as update-now, crosswalk, historical, compatibility, or false-positive.
503. Phase 3 validation: validator depends on touched surface.
504. Phase 3 reviewer: `po-planning-reviewer` for planning/docs; `wm-implementation-reviewer` if runtime scripts change.
505. Execution phase 4: decide on sync legacy fallback.
506. Phase 4 default decision: defer.
507. Phase 4 reason: script-level fallback is runtime behavior, not just documentation.
508. Phase 4 prerequisite: Product/Planning packet must explicitly authorize removing or renaming legacy fallback.
509. Phase 4 test-first requirement: add/update eval or smoke fixture before changing script semantics.
510. Phase 4 validation: `bash evals/skills/openclaw-pod-skills-sync-smoke.sh`.
511. Phase 4 validation: `pnpm run test:runtime`.
512. Phase 4 reviewer: `wm-implementation-reviewer`.
513. Execution phase 5: optional root runtime-sources README.
514. Phase 5 default decision: defer.
515. Phase 5 reason: current SoT already distributes ownership across `source-map.md`, `runtime-sources/skills/README.md`, and validators.
516. Phase 5 prerequisite: Product/Planning acceptance criteria for a new index.
517. Phase 5 validation: `pnpm run validate:team-doc` and possibly structure validator updates.
518. Phase 5 reviewer: `po-planning-reviewer`.
519. Required evidence for a future implementation PR: source scan results.
520. Required evidence for a future implementation PR: exact files changed.
521. Required evidence for a future implementation PR: validator commands and exit codes.
522. Required evidence for a future implementation PR: read-only reviewer verdict.
523. Required evidence for a future implementation PR: `git diff -- changed-paths`.
524. Required evidence for a future implementation PR: `git status --short`.
525. Required evidence for a future implementation PR: explicit external proof boundary.
526. Gate impact for planning-only file addition: `pnpm run validate:work-units` is the narrowest direct validator.
527. Gate impact for changing `mobile-app-dev-team/README.md`: `pnpm run validate:team-doc`.
528. Gate impact for changing runtime-source docs: `pnpm run validate:team-doc`.
529. Gate impact for changing workflow docs: `pnpm run validate:workflow-docs`.
530. Gate impact for changing governance docs: `pnpm run validate:governance-docs`.
531. Gate impact for changing reference docs: `pnpm run validate:reference-docs`.
532. Gate impact for changing root runtime policy files: `pnpm run test:runtime` and `pnpm run test:local-harness`.
533. Gate impact for changing `.agents/**` or `.codex/**`: `pnpm run test:runtime` and `pnpm run test:local-harness`.
534. Gate impact for changing sync script behavior: targeted smoke plus `pnpm run test:runtime`.
535. Human gate status: not required for local planning and docs scan.
536. Human gate status: required before live Confluence publication.
537. Human gate status: required before external platform proof claims.
538. Human gate status: required before irreversible archive/delete actions when risk-bearing.
539. Non-goal: do not update live `/workspace/skills`.
540. Non-goal: do not run live OpenClaw pod setup.
541. Non-goal: do not publish to Confluence.
542. Non-goal: do not delete historical archive material.
543. Non-goal: do not rewrite `TEAM_DOC_ARCHIVE_BUNDLE.jsonl`.
544. Non-goal: do not change app, API, package, or mobile runtime behavior.
545. Non-goal: do not alter reviewer/custom-agent definitions.
546. Non-goal: do not direct push to `main`.
547. Plan review question for `po-planning-reviewer`: Does this plan correctly classify current `runtime-sources` folder changes, stale references, evidence, validators, owners, and non-goals?
548. Plan review required inputs: this plan file.
549. Plan review required inputs: `AGENTS.md`.
550. Plan review required inputs: `PROJECT_ENVIRONMENT.md`.
551. Plan review required inputs: `REPO_OPERATIONS.md`.
552. Plan review required inputs: `mobile-app-dev-team/source-map.md`.
553. Plan review required inputs: `scripts/validate-team-doc-structure.mjs`.
554. Plan review required inputs: `scripts/validate-runtime-sources.mjs`.
555. Plan review required inputs: `scripts/validate-runtime-routing-support.mjs`.
556. Plan review expected output: findings-first prose.
557. Plan review expected output: exactly one reviewer verdict JSON envelope.
558. Plan review expected GO condition: no Critical, High, or Medium findings.
559. Plan review expected GO condition: checks are PASS or source-backed NOT_APPLICABLE.
560. Residual risk: actual live pod behavior is not proven.
561. Residual risk: `/workspace/skills` runtime snapshot is not inspected.
562. Residual risk: external platform state is not proven.
563. Residual risk: untracked pre-existing work-unit contents may not be committed yet.
564. Residual risk: existing task packet already claims reviewer GO but contains at least two stale path references.
565. Residual risk: `docs/plans/active/**` may contain additional stale scratch references, but active scratch is not durable SoT.
566. Residual risk: changing sync legacy fallback could remove a compatibility path if done without tests.
567. Recommended immediate next action: run read-only reviewer on this plan.
568. Recommended later action after reviewer GO: fix Target A and Target B first.
569. Recommended later action after Target A/B: run validators and collect reviewer evidence.
570. Recommended later action after validators: decide whether Target E/F compatibility fallback needs a separate runtime behavior packet.
571. Completion condition for this user request: this plan exists, has 500 or more lines, contains evidence, and has reviewer output.
572. Line count check command: `wc -l docs/plans/work-units/mobile-app-dev-team-expansion/00-product-planning/runtime-sources-doc-update-plan.md`.
573. Reviewer evidence path to create: `.evidence/reviews/20260620-runtime-sources-doc-update-plan-review.md`.
574. Final report should include plan path, line count, reviewer verdict, and material stale references found.
575. Final report should include which existing docs were updated after reviewer GO.
576. Final report should include that the pre-existing untracked work-unit directory was preserved.
577. Final report should include any validator commands run and failures if any.
578. Final report should include `git diff -- docs/plans/work-units/mobile-app-dev-team-expansion/00-product-planning/runtime-sources-doc-update-plan.md`.
579. Final report should include `git status --short`.
580. End of detailed plan.

## Reviewer GO And Execution Checkpoints

581. Plan-review evidence path: `.evidence/reviews/20260620-runtime-sources-doc-update-plan-review.md`.
582. Plan-review reviewer: `po-planning-reviewer`.
583. Plan-review verdict: GO.
584. Plan-review findings: none.
585. Plan-review command coverage: `validate:work-units`, `validate:runtime-sources`, `validate:runtime-routing-support`, `validate:team-doc:structure`, `validate:team-doc`, and `validate:workflow-docs` passed.
586. Execution boundary after GO: proceed only with Target A and Target B from this plan.
587. Target A checkpoint: update stale `runtime-sources/pod-native-openclaw-skills` references in the existing work-unit task packet to `runtime-sources/skills`.
588. Target B checkpoint: update `mobile-app-dev-team/README.md` workflow table paths from `workflows/...` to `runtime-sources/workflows/...`.
589. Out-of-scope for this execution: sync script legacy fallback, sync report-template legacy field, new `runtime-sources/README.md`, active scratch plans, archive files, runtime behavior, live pod sync, and external publication.
590. Checkpoint reviewer requirement: after Target A/B, run the relevant validators and obtain `po-planning-reviewer` final review before Done.
591. Required post-change validators: `pnpm run validate:work-units`, `pnpm run validate:team-doc`, and `pnpm run validate:workflow-docs`.
592. Required post-change evidence capture: command output, reviewer evidence path, `git diff`, and `git status --short`.
593. First final checkpoint reviewer verdict: NO_GO.
594. First final checkpoint finding: `task-packet.md` Phase 0 example still used `mobile-app-dev-team/workflows/Product_Planning_WORKFLOW.md`.
595. Finding response: update that example to `mobile-app-dev-team/runtime-sources/workflows/Product_Planning_WORKFLOW.md`.
596. Re-review requirement: rerun focused stale-path scan, validators, and `po-planning-reviewer` final checkpoint review after the finding response.
