# Human/Ops Live Readiness Annex

## Purpose

This annex defines the boundary between repo-local runtime proof and future
human/ops-run live readiness work for the WonderMove/ClawPod mobile app template
runtime.

It is a requirements and evidence document only. It does not authorize live EAS,
Stitch, Google Cloud, mobile-mcp/device, Railway, Confluence, GitHub settings,
pod rollout, image build/push, Secret/token provisioning, release readiness, or
store submission.

## Current Repo-Local Proof

PR1 through PR7 improve the reusable template runtime and agent operating
standard:

| Slice | Local proof | Still not proven |
| --- | --- | --- |
| PR1 work-unit status | `wu-status/v1` status artifacts and deterministic validation | Actual pod handoff or GitHub branch protection |
| PR2 human gate envelope | `human-gate/v1` decision schema and validator rules | Human identity beyond the recorded decision reference |
| PR3 next-action resolver | deterministic `wm-next-action/v1` routing and `wm-orchestrate` contract | A live role pod executing the resolved action |
| PR4 pod bootstrap preflight | repo-local `--pod` checks, pnpm pin fail-fast, role identity and redacted capability status | Actual OrbStack/OpenClaw rollout or native/device readiness |
| PR5 evidence ladder | RN Web/native/EAS evidence levels and offline EAS/Maestro ingest fixtures | Live EAS, cloud Maestro, token validity, or device behavior |
| PR6 SoT drift detection | offline drift checks for package/runtime/MCP/CI facts | Live Confluence, Railway, EAS, GitHub, device, or pod state |
| PR7 evidence hygiene | durable evidence path, naming, and secret-pattern validation | External platform state, release readiness, or store submission |

Repo-local gates and source review must be reported as repo-local proof only.
They must not be described as proving native behavior, external platform state,
actual pod execution, branch protection, webhook routing, release readiness, or
store submission.

## Approval Envelope

Every live mutation or live-readiness claim must have a recorded approval before
execution. The approval record can be a `human-gate/v1` decision under a durable
work-unit root when the work belongs to a work unit, or a linked GitHub PR/review
record for ops-only setup. In either case it must include:

| Field | Requirement |
| --- | --- |
| `scope` | Exact service, environment, repo, branch, pod, or account affected |
| `category` | Human/ops category such as `business-budget-owner`, `production-submit`, `failed-gate-risk`, or ops setup |
| `intended_mutation` | What will change, not merely the command name |
| `credential_handling` | Secret names only; values and secret-bearing config must be redacted |
| `rollback_owner` | Human or ops owner responsible for undoing the mutation |
| `rollback_plan` | Concrete rollback path or reason rollback is not available |
| `evidence_path` | Where redacted result evidence will be committed or linked |
| `decision_reference` | GitHub issue comment, PR review, or approved ops ticket URL |
| `decided_by` | Human approver identity; role, agent, pod, LLM, and Gatekeeper names are not approvers |
| `expires_or_revalidate_by` | Time or condition after which approval must be reconfirmed |

Approval records must not include tokens, private endpoints, password material,
Google ADC contents, EAS tokens, Railway tokens, GitHub tokens, signing keys, or
full secret-bearing config.

## Live Readiness Ladder

Live readiness is staged. A higher level cannot be claimed from a lower-level
artifact.

| Level | Name | Allowed only after | Required evidence | Claim allowed |
| --- | --- | --- | --- | --- |
| L0 | Repo-local runtime proof | PR1-PR7 local gates and reviewer evidence | `pnpm run test:runtime`, relevant validators, xhigh evidence | Repo-local runtime and evidence rules are internally consistent |
| L1 | Two-pod smoke | Approval for limited pod creation and GitHub credentials | `wm-po` and `wm-mobile-dev` clone, pnpm pin alignment, preflight, branch push, PR link | Two named pods can participate in GitHub handoff |
| L2 | Controlled native/EAS proof | Approval for EAS token use and PR-triggered EAS/Maestro run | EAS build id, Maestro result, redacted `eas-evidence/v1`, commit SHA | Native/EAS path worked for one approved build context |
| L3 | Full six-pod drill | Separate approval after L1 and L2 pass | Six role pods, webhook wakeups, work-unit status transitions, CI/Gatekeeper transcript | Role-pod organization can run one controlled drill to pre-release gate |
| L4 | Release human gate | Product/release owner approval and required evidence complete | `05-qa-release/human-approval.json`, release-risk summary, required checks | Release may proceed only within the approved scope |

L0 is already repo-local. L1 through L4 are not approved by this annex.

## Live Categories And Required Evidence

| Category | Approval required before | Evidence required after approval | Forbidden without approval |
| --- | --- | --- | --- |
| Image build/push | Building or pushing `clawpod/agent-mobile` images | Image tag/digest, platform arch, build source commit, size summary, rollback tag | Local Docker/image mutation claimed as platform readiness |
| Pod creation | Creating `wm-*` pods or changing pod resources | Pod names, namespace, resource profile, ConfigMap key summary, Secret key names redacted | Claiming OrbStack/OpenClaw execution from local harness |
| Secret/token injection | Adding GitHub, EAS, Railway, Google ADC, or other role credentials | Secret names, key names, target pod/service, redaction confirmation | Printing, committing, probing, or echoing secret values |
| Webhook routing | Registering GitHub or gateway rules | Rule ids, trigger labels/events, target role/pod, rollback rule id | Claiming role wakeup from static docs |
| Branch protection | Changing required checks, environments, or reviewer rules | Before/after rule summary, required check names, protected branch, rollback owner | Treating local `test:runtime` as remote branch protection |
| Release environment protection | Changing production or release environment protection | Environment name, human reviewer requirement, allowed deploy scope | Weakening release human approval |
| Live EAS/Maestro | Running `eas`, `eas whoami`, cloud build, or cloud Maestro | Build id, profile, commit SHA, Maestro flow result, redacted ingest output | Using `EXPO_TOKEN` or claiming native readiness |
| mobile-mcp/human device | Running simulator, emulator, or device visual QA | Device/simulator id redacted where needed, serial execution note, screenshots or result summary | Treating RN Web as device proof |
| Railway/live API | Deploying or checking Railway service for release evidence | Health endpoint results, service/domain id, redacted variable summary | Treating Railway health as native or release approval |
| Confluence publication | Publishing or updating live pages | Page ids, current versions, body diff summary, reviewer evidence, explicit approval | Requiring live Confluence for local CI or `test:runtime` |

## Two-Pod Smoke Definition

The first live drill after approval is deliberately small:

1. Create or select only `wm-po` and `wm-mobile-dev`.
2. Clone this repository from GitHub into each approved pod.
3. Activate the repo pnpm pin and run the approved preflight.
4. Create a bounded work-unit branch.
5. Product/Planning writes or updates the work-unit packet.
6. Mobile App Dev consumes the branch, runs only approved repo-local gates, pushes
   a branch update, and links the PR.
7. QA/Release records what was and was not proven.

The two-pod smoke does not prove six-pod orchestration, native readiness, release
readiness, branch protection, store submission, or customer production behavior.

## Full Drill Definition

A full drill is allowed only after L1 and L2 evidence exist and a separate
approval records budget, platform target, credential scope, rollback owner, and
stop conditions.

The target drill is a synthetic customer request that reaches the pre-release
human gate with:

- valid `status.json` transitions,
- GitHub branch/PR handoff between roles,
- reviewer envelopes for relevant stages,
- RN Web evidence where applicable,
- L2 or L3 native evidence when required by `status.json.evidence_ladder`,
- deterministic Gatekeeper check transcript,
- release blocked until `human-approval.json` exists.

## Stop And Rollback Rules

Stop immediately when any of these occurs:

- an approval record is missing, expired, ambiguous, or points to the wrong target;
- a command would print or persist a secret value;
- a live result cannot be redacted into durable evidence;
- a required check fails and no owner has been assigned;
- a role, reviewer, pod, LLM, or Gatekeeper is treated as a human approver;
- RN Web, Railway, source review, local harness, or offline fixtures are used as
  native, platform, branch-protection, or release proof;
- release would proceed without `human-approval.json`.

Rollback must be owned by the approving human/ops owner. Repo agents can document
rollback evidence and classify failures, but they do not own external rollback.

The app / EAS Update (OTA) / store rollback ownership, decision, gate, and
evidence flow built on these rules is documented in
`governance/app-eas-ota-rollback-runbook.md` (managed-doc guidance).

## Forbidden Claims

Do not claim any of the following from repo-local evidence:

- actual OrbStack/OpenClaw pod execution;
- GitHub branch protection or webhook routing;
- live EAS, live Maestro, or valid `EXPO_TOKEN`;
- native module, OS permission, lifecycle, or device behavior;
- live Stitch service enablement or Google Cloud project state;
- Railway production health or customer production API readiness;
- live Confluence freshness or publication;
- release readiness, production submit approval, or store-submission safety.

The correct phrasing is: "repo-local/offline proof is complete for the named
slice; live readiness remains pending human/ops approval and evidence."
