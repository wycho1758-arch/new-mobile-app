# Evidence Decision Records Cleanup Plan

001. Work unit id: `evidence-decision-records-cleanup`.
002. Date: 2026-06-14.
003. Planning owner: Product/Planning.
004. Implementation owner: repository runtime maintainer under `$wm`.
005. Reviewer owner before implementation: `po-planning-reviewer`.
006. Reviewer owner after implementation: `wm-implementation-reviewer`.
007. User request: move the four currently tracked `.evidence` decision records to `mobile-app-dev-team/decision-records/`.
008. User request: apply the remaining recommended cleanup pattern.
009. User request: produce a detailed plan of at least 300 lines.
010. User request: review the plan before proceeding.
011. User request: proceed after review when not blocked.
012. Source worktree: `/Users/tw.kim/Documents/AGA/test/new-mobile-app-evidence-cleanup`.
013. Isolation reason: the primary worktree has unrelated dirty changes from another session.
014. Isolation branch: `chore/evidence-decision-records-cleanup`.
015. Base branch: `origin/main`.
016. Current base commit observed for the isolated worktree: `bd632ada07a080fa3bece2dff873b09e554d9b77`.
017. This plan must not touch the other session's dirty worktree.
018. This plan must not reset or force-push `origin/main`.
019. This plan must not delete local ignored `.evidence` scratch output in another active worktree.
020. This plan must not claim that historical ignored scratch evidence was reviewed.

## 001. SoT Inputs Read

021. `AGENTS.md` was checked for repository policy and runtime path conventions.
022. `.agents/skills/wm/SKILL.md` is the active `$wm` workflow for this request.
023. `.agents/skills/git-workflow/SKILL.md` defines branch, commit, PR, and self-workflow approval constraints.
024. `.gitignore` was checked and contains `.evidence/**`.
025. `mobile-app-dev-team/19-entry-case-routing.md` contains references to three tracked `.evidence` decision files.
026. `mobile-app-dev-team/20-app-eas-ota-rollback-runbook.md` contains a reference to one tracked `.evidence` decision file.
027. `scripts/validate-evidence-hygiene.mjs` currently scans tracked `.evidence` files and work-unit docs for evidence hygiene.
028. `scripts/validate-team-doc.mjs` currently has managed-doc validation around reviewer evidence and required team docs.
029. `package.json` defines `test:runtime`.
030. `package.json` defines `test:local-harness`.
031. `mobile-app-dev-team/02-role-souls/product-planning-soul.md` defines Product/Planning as scope and readiness owner.
032. `mobile-app-dev-team/02-role-souls/mobile-architect-soul.md` defines Mobile Architect as runtime and releaseability owner.
033. `mobile-app-dev-team/06-gates-and-evidence.md` defines evidence and gate expectations.
034. `mobile-app-dev-team/05-work-processes.md` defines Product/Planning intake and role routing.
035. `REPO_OPERATIONS.md` defines repo-wide policy ownership.
036. `PROJECT_ENVIRONMENT.md` is not directly changed by this cleanup.
037. `packages/contracts` is not affected.
038. Mobile UI code is not affected.
039. Backend/API code is not affected.
040. No live platform evidence is involved.

## 002. Current Observed State

041. The primary worktree is `chore/openclaw-pod-skills-sync`.
042. The primary worktree has unrelated modified files.
043. The primary worktree has unrelated untracked files.
044. The cleanup work uses a separate worktree to avoid touching those changes.
045. The isolated cleanup worktree is clean at creation.
046. The isolated cleanup worktree tracks `origin/main`.
047. `git ls-files .evidence` reports exactly four tracked files.
048. Tracked file 1: `.evidence/reviews/20260614-entry-case-cp2-p1-decision.md`.
049. Tracked file 2: `.evidence/reviews/20260614-entry-case-cp3-decision.md`.
050. Tracked file 3: `.evidence/reviews/20260614-entry-case-risk2-runtime-binding-decision.md`.
051. Tracked file 4: `.evidence/reviews/20260614-followup1-precise-rule-decision.md`.
052. `git check-ignore` confirms `.evidence/**` ignores new untracked evidence output.
053. Existing tracked `.evidence` files remain tracked despite `.gitignore`.
054. That is normal Git behavior.
055. The cleanup must remove those tracked files from `.evidence` through a normal commit.
056. The cleanup must not use reset against remote history.
057. The cleanup must preserve the reviewer decision content.
058. The cleanup must preserve managed-doc references to the decision content.
059. The cleanup must update references from `.evidence/reviews/...` to the new durable path.
060. The cleanup must add validator coverage so tracked `.evidence` does not reappear unnoticed.

## 003. Decision Record Destination

061. Destination root chosen by user: `mobile-app-dev-team/decision-records/`.
062. This path is inside managed team docs.
063. This path is tracked by ordinary Git rules.
064. This path is not ignored by `.gitignore`.
065. This path is a durable repo-local source location.
066. This path keeps decision evidence near the managed docs that cite it.
067. This path avoids mixing durable decision records with ignored scratch evidence.
068. This path supports future refactoring of `.evidence` as local-only output.
069. This path should have a README.
070. The README should define the purpose of decision records.
071. The README should state that `.evidence` is ignored scratch/local evidence unless explicitly tracked by older history.
072. The README should state that durable managed-doc decisions belong under `mobile-app-dev-team/decision-records/`.
073. The README should state that files in this directory are source-cited decision records.
074. The README should state that live platform proof is not stored here.
075. The README should state that secrets must never be stored here.
076. The README should explain the four migrated files.
077. The README should explain that each migrated file preserves original reviewer content.
078. The README should not introduce new decisions beyond relocation.
079. The README should not authorize bypassing human gates.
080. The README should not claim runtime proof.

## 004. File Move Mapping

081. Source: `.evidence/reviews/20260614-entry-case-cp2-p1-decision.md`.
082. Destination: `mobile-app-dev-team/decision-records/20260614-entry-case-cp2-p1-decision.md`.
083. Reason: `19-entry-case-routing.md` cites this as the Design relevance / P-1 decision.
084. Source: `.evidence/reviews/20260614-entry-case-cp3-decision.md`.
085. Destination: `mobile-app-dev-team/decision-records/20260614-entry-case-cp3-decision.md`.
086. Reason: `19-entry-case-routing.md` cites this for P-2 and P-3 governance.
087. Source: `.evidence/reviews/20260614-entry-case-risk2-runtime-binding-decision.md`.
088. Destination: `mobile-app-dev-team/decision-records/20260614-entry-case-risk2-runtime-binding-decision.md`.
089. Reason: `19-entry-case-routing.md` cites this for partial runtime enforcement.
090. Source: `.evidence/reviews/20260614-followup1-precise-rule-decision.md`.
091. Destination: `mobile-app-dev-team/decision-records/20260614-followup1-precise-rule-decision.md`.
092. Reason: `20-app-eas-ota-rollback-runbook.md` cites this for rollback field validation.
093. The content should remain byte-identical if possible.
094. If byte identity cannot be preserved by tooling, semantic content must remain unchanged.
095. The migration should use `git mv` for tracked files.
096. `git mv` is appropriate because these files are tracked.
097. `git mv` preserves Git rename detection.
098. `git mv` does not mutate remote history.
099. `git mv` does not touch ignored local scratch files.
100. `git mv` does not require deleting the `.evidence` directory from disk.

## 005. Managed Doc Reference Updates

101. Update `mobile-app-dev-team/19-entry-case-routing.md`.
102. Replace `.evidence/reviews/20260614-entry-case-cp2-p1-decision.md`.
103. New reference: `mobile-app-dev-team/decision-records/20260614-entry-case-cp2-p1-decision.md`.
104. Replace `.evidence/reviews/20260614-entry-case-risk2-runtime-binding-decision.md`.
105. New reference: `mobile-app-dev-team/decision-records/20260614-entry-case-risk2-runtime-binding-decision.md`.
106. Replace `.evidence/reviews/20260614-entry-case-cp3-decision.md`.
107. New reference: `mobile-app-dev-team/decision-records/20260614-entry-case-cp3-decision.md`.
108. Update both P-2 and P-3 references to the CP3 decision.
109. Update `mobile-app-dev-team/20-app-eas-ota-rollback-runbook.md`.
110. Replace `.evidence/reviews/20260614-followup1-precise-rule-decision.md`.
111. New reference: `mobile-app-dev-team/decision-records/20260614-followup1-precise-rule-decision.md`.
112. Do not alter the policy wording around gates.
113. Do not alter the P-1 criteria.
114. Do not alter P-2 prioritization rules.
115. Do not alter P-3 hotfix rules.
116. Do not alter rollback validation semantics.
117. Do not change reviewer verdict language.
118. Do not change SoT priority statements.
119. Do not change runtime enforcement statements.
120. Only change the durable decision record paths.

## 006. Validator Strategy

121. Add a deterministic validator check that fails when Git still tracks `.evidence` files.
122. Preferred location: `scripts/validate-evidence-hygiene.mjs`.
123. Reason: this script already owns evidence hygiene.
124. Reason: `test:runtime` already runs `validate:evidence-hygiene`.
125. The new check should use `git ls-files -- .evidence`.
126. The new check should report an error when any tracked `.evidence` file remains.
127. The error should name the tracked files.
128. The error should explain that durable decision records belong outside `.evidence`.
129. The check should not scan ignored local scratch `.evidence` files.
130. The check should not delete files.
131. The check should not mutate Git state.
132. The check should not require live platform access.
133. The check should be self-testable.
134. Add or adjust a self-test fixture in `evals/local-harness/evidence-hygiene/fixtures/`.
135. The fixture should demonstrate that tracked `.evidence` paths are invalid.
136. The fixture should be narrow and not require secrets.
137. The fixture should not depend on the current file system.
138. The fixture should use the existing fixture format if possible.
139. If fixture format cannot model tracked files separately, add an explicit internal unit for tracked-evidence prohibition.
140. Keep implementation minimal.

## 007. `validate-team-doc` Strategy

141. Add terms in `scripts/validate-team-doc.mjs` only if needed.
142. The desired behavior is managed-doc references move to `mobile-app-dev-team/decision-records/`.
143. A narrow term check can require `mobile-app-dev-team/decision-records/` in `19-entry-case-routing.md`.
144. A narrow term check can require `mobile-app-dev-team/decision-records/` in `20-app-eas-ota-rollback-runbook.md`.
145. Avoid broad banning of `.evidence/reviews/` across all docs.
146. Reason: archived docs and active ignored plans still mention historical `.evidence/reviews/`.
147. Reason: existing reusable reference docs may use `.evidence/reviews/<review-file>.md` as a placeholder.
148. A broad ban would create unrelated churn.
149. A broad ban would affect historical docs beyond this cleanup.
150. The validator should focus on the four migrated decision records.
151. The validator may require the four new destination paths.
152. The validator may forbid the four old exact paths in the two active managed docs.
153. The validator should not force rewriting archived material.
154. The validator should not force rewriting local active plans.
155. The validator should not conflict with `$wm` evidence guidance for ignored scratch review output.
156. The validator should keep this cleanup scoped.
157. The validator should pass on `origin/main` only after the migration.
158. The validator should fail if a future edit restores those exact old references.
159. The validator should be part of `test:runtime`.
160. The validator should not require network.

## 008. TDD Plan

161. First add or update a validator assertion.
162. Run the narrow validator and confirm failure before moving files.
163. Expected failing command: `node scripts/validate-evidence-hygiene.mjs`.
164. Expected failure reason: tracked `.evidence` files remain.
165. Optionally run `node scripts/validate-team-doc.mjs` after adding active-doc path requirements.
166. Expected failure reason: old `.evidence/reviews/...` paths remain in active docs.
167. Then perform `git mv` for the four files.
168. Then update active doc references.
169. Then add `mobile-app-dev-team/decision-records/README.md`.
170. Then rerun `node scripts/validate-evidence-hygiene.mjs`.
171. Then rerun `node scripts/validate-team-doc.mjs`.
172. Then rerun `pnpm run test:runtime`.
173. Then rerun `pnpm run test:local-harness`.
174. If local harness is too slow but applicable, still run it because this touches runtime validators.
175. Record command output in final response.
176. If a command fails due to unrelated environment state, stop and report.
177. If a command fails due to the cleanup, fix and rerun.
178. If the plan reviewer blocks, do not implement until addressed.
179. If the final reviewer blocks, do not report done.
180. Do not skip tests silently.

## 009. Implementation Steps

181. Check isolated worktree status is clean.
182. Add validator failing condition for tracked `.evidence`.
183. Add exact active-doc reference validation if needed.
184. Run the expected failing validation.
185. Create `mobile-app-dev-team/decision-records/` if not present.
186. Add `mobile-app-dev-team/decision-records/README.md`.
187. Use `git mv` for file 1.
188. Use `git mv` for file 2.
189. Use `git mv` for file 3.
190. Use `git mv` for file 4.
191. Update `19-entry-case-routing.md` old path 1.
192. Update `19-entry-case-routing.md` old path 2.
193. Update `19-entry-case-routing.md` old path 3.
194. Update `19-entry-case-routing.md` old path 4 if duplicated.
195. Update `20-app-eas-ota-rollback-runbook.md` old path 1.
196. Run `git ls-files .evidence`.
197. Expected output after implementation: empty.
198. Run `rg` for the four old exact path strings in active docs.
199. Expected output after implementation: none in `19-entry-case-routing.md` and `20-app-eas-ota-rollback-runbook.md`.
200. Run `rg` for new decision-record paths.
201. Expected output: active docs cite new paths.
202. Run `node scripts/validate-evidence-hygiene.mjs`.
203. Run `node scripts/validate-team-doc.mjs`.
204. Run `pnpm run test:runtime`.
205. Run `pnpm run test:local-harness`.
206. Run final read-only `wm-implementation-reviewer`.
207. Inspect `git diff --stat`.
208. Inspect `git diff --name-status`.
209. Inspect `git status --short --branch`.
210. Prepare final report.

## 010. Scope Boundaries

211. In scope: moving four tracked `.evidence` decision records.
212. In scope: updating references that point to those four files.
213. In scope: adding `mobile-app-dev-team/decision-records/README.md`.
214. In scope: adding validator coverage so tracked `.evidence` files fail hygiene validation.
215. In scope: adding active-doc validator terms for new decision-record references.
216. In scope: running repo-local validators.
217. In scope: final reviewer evidence.
218. Out of scope: deleting ignored local `.evidence` scratch files from any active worktree.
219. Out of scope: deleting `.evidence` directories globally.
220. Out of scope: rewriting historical archive references.
221. Out of scope: rewriting ignored active plans.
222. Out of scope: changing evidence policy semantics.
223. Out of scope: changing human gate categories.
224. Out of scope: changing rollback rule content.
225. Out of scope: changing entry-case routing policy content.
226. Out of scope: changing app code.
227. Out of scope: changing backend/API code.
228. Out of scope: changing package dependencies.
229. Out of scope: running live EAS, store, GitHub mutation beyond ordinary branch/PR workflow.
230. Out of scope: force-pushing or resetting remote history.

## 011. Risk Register

231. Risk R1: deleting local ignored evidence could harm another session.
232. Mitigation R1: do not delete ignored local `.evidence` content.
233. Risk R2: removing tracked decision records without moving them would break active SoT references.
234. Mitigation R2: use `git mv` into `mobile-app-dev-team/decision-records/`.
235. Risk R3: active docs could still point at old `.evidence` paths.
236. Mitigation R3: update exact references and add validator terms.
237. Risk R4: broad `.evidence` path bans could create unrelated archive churn.
238. Mitigation R4: only enforce tracked `.evidence` hygiene and exact active migrated references.
239. Risk R5: validation could scan ignored scratch files and report irrelevant failures.
240. Mitigation R5: keep evidence hygiene based on `git ls-files`.
241. Risk R6: `mobile-app-dev-team/decision-records/` could become a dumping ground for scratch evidence.
242. Mitigation R6: README states it is for durable source-cited decisions only.
243. Risk R7: user might expect remote `origin/main` reset.
244. Mitigation R7: do not reset remote; use cleanup commit/PR.
245. Risk R8: other worktree changes might be accidentally staged.
246. Mitigation R8: use isolated worktree and inspect status.
247. Risk R9: final reviewer may disagree with validator scope.
248. Mitigation R9: route plan and final review to read-only reviewers.
249. Risk R10: local harness could fail due to unrelated base state.
250. Mitigation R10: stop and report exact failure if it occurs.

## 012. Checkpoint Plan

251. Checkpoint 1: plan document created.
252. Checkpoint 1 reviewer: `po-planning-reviewer`.
253. Checkpoint 1 expected output: GO before implementation.
254. Checkpoint 2: tests-first validator failure captured.
255. Checkpoint 2 reviewer: skip if only expected red validation is captured and no policy ambiguity changes.
256. Checkpoint 3: file moves and reference updates completed.
257. Checkpoint 3 reviewer: skip if narrow move only and final reviewer still required.
258. Checkpoint 4: validators and local harness pass.
259. Checkpoint 4 reviewer: `wm-implementation-reviewer`.
260. Checkpoint 5: final report or PR handoff.
261. Checkpoint 5 reviewer: not needed if final implementation reviewer is GO.
262. Any NO_GO stops the workflow.
263. Any missing required check stops the workflow.
264. Any untracked unrelated change in isolated worktree stops the workflow.
265. Any dirty state in primary worktree remains ignored and untouched.
266. Any live-platform action remains blocked.
267. Any remote reset remains blocked.
268. Any force-push remains blocked.
269. Any human gate discovered later must be reported.
270. No human gate is expected for this repo-local cleanup.

## 013. Expected Changed Paths

271. `.evidence/reviews/20260614-entry-case-cp2-p1-decision.md` will be deleted by rename.
272. `.evidence/reviews/20260614-entry-case-cp3-decision.md` will be deleted by rename.
273. `.evidence/reviews/20260614-entry-case-risk2-runtime-binding-decision.md` will be deleted by rename.
274. `.evidence/reviews/20260614-followup1-precise-rule-decision.md` will be deleted by rename.
275. `mobile-app-dev-team/decision-records/20260614-entry-case-cp2-p1-decision.md` will be added by rename.
276. `mobile-app-dev-team/decision-records/20260614-entry-case-cp3-decision.md` will be added by rename.
277. `mobile-app-dev-team/decision-records/20260614-entry-case-risk2-runtime-binding-decision.md` will be added by rename.
278. `mobile-app-dev-team/decision-records/20260614-followup1-precise-rule-decision.md` will be added by rename.
279. `mobile-app-dev-team/decision-records/README.md` will be added.
280. `mobile-app-dev-team/19-entry-case-routing.md` will be updated.
281. `mobile-app-dev-team/20-app-eas-ota-rollback-runbook.md` will be updated.
282. `scripts/validate-evidence-hygiene.mjs` will be updated.
283. `scripts/validate-team-doc.mjs` may be updated.
284. Evidence hygiene fixtures may be updated if needed.
285. No mobile app source files should change.
286. No API source files should change.
287. No package lock files should change.
288. No dependency manifests should change.
289. No ignored `.evidence` scratch outputs should be staged.
290. No primary worktree files should be changed.

## 014. Acceptance Criteria

291. AC1: Plan file is at least 300 lines.
292. AC2: Plan file names verified SoT sources.
293. AC3: Plan review returns GO.
294. AC4: `git ls-files .evidence` returns no tracked files after implementation.
295. AC5: The four decision records exist under `mobile-app-dev-team/decision-records/`.
296. AC6: Active docs cite the new decision-record paths.
297. AC7: Active docs no longer cite the four old `.evidence/reviews/...` paths.
298. AC8: Evidence hygiene validation fails before the move when the new tracked-evidence rule is introduced.
299. AC9: Evidence hygiene validation passes after the move.
300. AC10: Team-doc validation passes after reference updates.
301. AC11: `pnpm run test:runtime` passes.
302. AC12: `pnpm run test:local-harness` passes.
303. AC13: Final `wm-implementation-reviewer` returns GO or all findings are resolved.
304. AC14: Final status shows only intended cleanup paths changed.
305. AC15: No reset or force-push is used.
306. AC16: Primary dirty worktree remains untouched.
307. AC17: No secrets are introduced.
308. AC18: No live platform proof is claimed.
309. AC19: Final report lists commands and key results.
310. AC20: Final report identifies any unrun command and why.

## 015. Reviewer Questions

311. Question 1: Is `mobile-app-dev-team/decision-records/` an acceptable durable location for the four decision records?
312. Question 2: Is it correct to avoid reset/force-push and instead use a cleanup commit?
313. Question 3: Is validator coverage for `git ls-files .evidence` appropriate?
314. Question 4: Is it correct to avoid deleting ignored local `.evidence` scratch files?
315. Question 5: Is it correct to update only active docs that cite the four migrated files?
316. Question 6: Is broad archive rewriting out of scope?
317. Question 7: Are Product/Planning and Mobile Architect boundaries preserved?
318. Question 8: Are human gates unaffected?
319. Question 9: Are runtime and local harness gates sufficient?
320. Question 10: Is implementation allowed after GO?

## 016. Final Planning Decision

321. This plan recommends proceeding only after `po-planning-reviewer` GO.
322. The cleanup should be implemented in the isolated worktree.
323. The cleanup should move exactly four tracked decision records.
324. The cleanup should add a durable README.
325. The cleanup should update active references.
326. The cleanup should add deterministic evidence hygiene validation.
327. The cleanup should run full runtime and local harness checks.
328. The cleanup should receive final implementation review.
329. The cleanup should be committed on `chore/evidence-decision-records-cleanup` after passing checks.
330. The cleanup should be packaged as a normal PR rather than remote reset.
331. The cleanup should not delete ignored scratch evidence from other sessions.
332. The cleanup should not modify external platform state.
333. The cleanup should not modify mobile UI, API, contracts, or dependencies.
334. The cleanup should report any residual risks instead of hiding them.
335. End of plan.
