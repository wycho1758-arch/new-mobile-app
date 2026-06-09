---
pageId: "1375830055"
sourceTitle: "First Agent Runtime E2E Canary — Reproducible Guide (2026-06-08)"
sourceVersion: "unknown"
sourceUrl: "https://wondermove-official.atlassian.net/wiki/spaces/mobileappd/pages/1375830055"
fetchedAt: "2026-06-09T03:41:15.000Z"
syncStatus: "synced"
---

# First Agent Runtime E2E Canary — Reproducible Guide

> Independent-session runbook to reproduce the Product/Planning canary E2E on OrbStack K8s (namespace `clawpod`).  
> Verified live 2026-06-08 on canary `canary-pp-202606080757` (DB id 128). **Zero openclaw-cloud source changes.**  
> Secret rule: NEVER print/cat `OPENAI_CODEX_AUTH_JSON` or `/root/.codex/auth.json` — assert existence / perms / length only.

## 0. Prerequisites

* `export PATH="$HOME/.orbstack/bin:$PATH"`; kubectl context `orbstack`; namespace `clawpod` Active.
* admin-api reachable: `kubectl port-forward svc/admin-api 3000:3000 -n clawpod --context orbstack` (background).
* Super-admin login available (role=super_admin). Host has `~/.codex/auth.json` (codex subscription auth).
* Local image present: `docker images clawpod/agent:local` (digest 32e7f80).

## 1. Commands (in order)

| # | Action | Command (summary) | Expected result |
| --- | --- | --- | --- |
| 1 | Login | `POST /auth/login {email,password}` | 200, `token`, role=super_admin |
| 2 | Create canary | `POST /agents/create-full` — all 4 model fields = `openai-codex/gpt-5.5`, image `clawpod/agent:local`, soulMd (SOUL seed; must NOT contain the literal substrings `## Security Policy` / `## Sub-Agent & Background Delegation` — see FINDING-3), agentsMd/toolsMd (SoT pointers + secret-safety), envVars `{OPENAI_CODEX_AUTH_JSON:<auth>}`, tenant_id=1 | 201 `success:true`, numeric id, k8sResources = Secret/ConfigMap/Service/StatefulSet |
| 3 | Fix pull policy (FINDING-1) | `kubectl patch statefulset <id>-agent` → agent container `imagePullPolicy=IfNotPresent`; then `kubectl delete pod <id>-agent-0` | pod recreated; local image used |
| 4 | Wait Ready | poll `kubectl get pod <id>-agent-0` | Ready 1/1, restarts=0; DB status=running |
| 5 | Verify SOUL (C1) | `kubectl exec <id>-agent-0 -c agent -- md5sum /workspace/SOUL.md` vs DB `md5(soul_md_content)` | equal (byte-identical); injected mandatory-section body present |
| 6 | Verify codex auth (C2) | `kubectl exec ... -- sh -lc 'printenv OPENAI_CODEX_AUTH_JSON\|wc -c; test -s /root/.codex/auth.json && stat -c %a ...'` | env len>0; file present perms 600 (NO content) |
| 7 | PHASE E (agent installs codex) | chat `POST /api/chat-rooms/:id/messages` (senderType admin): instruct agent to install `@openai/codex`, verify, confirm auth without printing | `/workspace/.npm-global/bin/codex` = codex-cli 0.137.0; auth confirmed via `test -s` |
| 8 | Skills + dry-run (CK5) | place SoT skill sources in `/workspace/.canary-src/`; short chat instruction to create 3 skills + dry-run | 3 `/workspace/skills/<name>/SKILL.md` verbatim + `CANARY-DRYRUN.md` with a readiness decision |
| 9 | Cleanup | `DELETE /agents/<id>/full` | `deletedResources` includes STS/PVC×2/svc/cm/secret/JetStreamConsumer; DB 0 rows; orphan sweep empty |

## 2. Expected results (acceptance)

* Canary created via the real create-full path; all K8s resources + DB rows present.
* Pod Ready, status=running, restarts=0.
* SOUL byte-identical in the running pod (md5 pod == DB); mandatory Security Policy + Sub-Agent sections present.
* Codex auth materialized at `/root/.codex/auth.json` (600), never exposed.
* Agent autonomously installs the codex CLI (0.137.0) using the injected subscription auth (proves inference works).
* Agent creates ONLY Product/Planning skills (verbatim) + a dry-run that respects no-over-spec / SoT discipline.
* Cleanup leaves zero orphans.

## 3. Failure handling (known findings — all environmental/payload, not openclaw-cloud source defects)

| Finding | Symptom | Handling |
| --- | --- | --- |
| FINDING-1 (env drift) | pod `ErrImagePull` for `clawpod/agent:local` | admin-api deploy lacks `IMAGE_PULL_POLICY` → defaults `Always` (k8s-manifests.ts:386). Patch the canary STS to `IfNotPresent` (runtime-only). Permanent fix (separate, needs approval): set `IMAGE_PULL_POLICY=IfNotPresent` on the admin-api deployment. |
| FINDING-2 (endpoint) | `GET /agents/:id/config/pod-files` returns `source:"db"` even when running | OrbStack pod-read path degraded cluster-wide (boram too); try/catch silently falls back to DB (agents.ts:1319). Verify via direct `kubectl exec` md5 instead. Separate TDD item. |
| FINDING-3 (seed footgun) | mandatory sections not injected | `ensureMandatorySections` (orchestrator.ts:141) skips injection if the seed text merely MENTIONS `## Security Policy` / `## Sub-Agent & Background Delegation`. Seed authors must not include those literal substrings in prose. |
| FINDING-4 (reply gap) | agent does the work but no chat reply persists | OrbStack in-memory hardening ("System files deleted — running from memory only") + callback degradation. Verify agent work via filesystem artifacts + openclaw log, not chat reply. Separate observability TDD item. |

## 4. Cleanup

```
DELETE /agents/<numericId>/full           # via SA JWT
kubectl get cm,secret,svc,sts,pods,pvc -n clawpod -l agent-id=<agent_id> --context orbstack   # must be empty
psql -c "SELECT id FROM agents WHERE agent_id='<agent_id>'"                                    # 0 rows
```

On FAIL at any checkpoint: preserve all resources for diagnosis, record the orphan-sweep selector and the preservation reason; do NOT proceed to the next single-agent expansion.

## 5. Next-agent expansion

Only after this canary PASS **and** this guide receives reviewer FINAL PASS. One agent at a time. Candidate order decided with the user (Mobile Architect / Design / Mobile App Dev / Backend-API / QA-Release).