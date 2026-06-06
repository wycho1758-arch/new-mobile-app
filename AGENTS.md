# AGENTS.md

This repository is the mobile app template runtime for WonderMove mobile agents.

## Required Rules

- TDD required: write or update tests before implementation changes.
- No hardcoding customer app names, bundle IDs, API URLs, tokens, or credentials.
- No direct push to `main`; use a branch and PR.
- Do not modify `openclaw-cloud` from this repository.

## Codex Runtime Paths

- Native Codex CLI repo skills: `.agents/skills/<skill-name>/SKILL.md`
- Native Codex CLI custom agents: `.codex/agents/<agent-name>.toml`
- Native Codex CLI hooks: `.codex/hooks.json` and `.codex/hooks/`
- Runtime evals and evidence: `evals/{skills,agents,hooks}/`
- OpenClaw generated-agent package tests simulate install to `/workspace/skills/<skill-slug>/`; `.agents/skills` is not the pod install path.

## Verification

Run `npm test` before opening a PR for runtime artifacts.
