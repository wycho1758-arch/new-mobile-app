---
docType: "operational-guide"
sourcePageId: "1374519410"
sourceTitle: "Mobile Codex CLI 실무 지침서 / Practitioner Guide"
sourceVersion: "3"
sourceHeading: "Workflow Pillars / 작업 기둥"
---

# Mobile Codex CLI Practitioner Guide

The team's Codex CLI usage rests on five workflow pillars that govern when planning, skills, subagents, hooks, reviewers, and verified-completion checks apply.

- **Planning**: Start complex or cross-role work in Plan mode. Plans must be SoT-bound, scoped, explicit about non-goals, and grounded in evidence-based acceptance.
- **Execution**: Do not improvise. Reach for the relevant skill first, and limit subagents to bounded exploration, review, or ownership separation.
- **Review**: Follow phase reviewer gates. Escalate decisions that affect SoT or risk posture to reviewer(xhigh).
- **Verified completion**: Before reporting Done, check `git diff` against the approved plan, confirm tests/build/evidence, and map the checklist to the diff.
- **Hook and gate respect**: Hooks and `mobile-gatekeeper` run deterministically across PR/CI and local guardrails; never override GitHub required checks or gate results with LLM judgment.

## Source

- Page ID: 1374519410
- Source heading: Workflow Pillars / 작업 기둥
- Source version: 3
