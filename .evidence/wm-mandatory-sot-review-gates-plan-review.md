# wm Mandatory SoT And Review Gates Plan Review

Date: 2026-06-10

Reviewer: read-only reviewer subagent `019eaf19-9fd4-7d01-a173-e63987b24f65`

## Initial Findings

- Medium: plan originally missed Confluence sync for the runtime SoT update document.
- Medium: plan originally checked `.agents/skills/wm/SKILL.md` but did not add validator drift checks for `PROJECT_ENVIRONMENT.md`.
- Low: `$wm` eval fixtures should also reflect the stronger mandatory behavior.

## Approved Revised Plan

- Update `$wm` eval fixtures first.
- Strengthen `scripts/validate-runtime-artifacts.mjs` assertions for mandatory SoT/review wording in `.agents/skills/wm/SKILL.md`.
- Add validator assertions for matching mandatory `$wm` wording in `PROJECT_ENVIRONMENT.md`.
- Update `.agents/skills/wm/SKILL.md` to remove optional wording and add mandatory SoT/review gates.
- Sync `PROJECT_ENVIRONMENT.md` and `docs/confluence/20260608-codex-expo-rn-runtime-sot-update.md`.
- Run runtime, local harness, workspace, and diff verification.
- Request final read-only reviewer approval.

## Reviewer Result

Status: Approved.

The reviewer also noted that the Confluence headless-review allowlist should be reconciled from `wm-*` only to dedicated `wm-*`, Product/Planning `po-*`, and Design `design-*` agents.
