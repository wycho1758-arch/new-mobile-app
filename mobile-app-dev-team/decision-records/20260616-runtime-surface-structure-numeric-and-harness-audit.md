**Findings**
No PR-blocking issue found for the two requested points.

1. `04`, `16`, and `17` are an intentional documented compatibility window, not a current unguarded miss.
Current top-level numeric files are only:
`mobile-app-dev-team/04-skills-and-agents-matrix.md`, `16-pod-environment-bootstrap.md`, and `17-orbstack-pod-config-values.md`.

Source-map documents all three as compatibility-window paths: [source-map.md](/Users/tw.kim/Documents/AGA/test/new-mobile-app/mobile-app-dev-team/source-map.md:74), [source-map.md](/Users/tw.kim/Documents/AGA/test/new-mobile-app/mobile-app-dev-team/source-map.md:82). The structure validator registers those legacy-to-target paths: [validate-team-doc-structure.mjs](/Users/tw.kim/Documents/AGA/test/new-mobile-app/scripts/validate-team-doc-structure.mjs:17), [validate-team-doc-structure.mjs](/Users/tw.kim/Documents/AGA/test/new-mobile-app/scripts/validate-team-doc-structure.mjs:25), and allows registry legacy paths through `legacyCompatibility`: [validate-team-doc-structure.mjs](/Users/tw.kim/Documents/AGA/test/new-mobile-app/scripts/validate-team-doc-structure.mjs:247). It still rejects unregistered numeric top-level paths and old `99-source-map.md`: [validate-team-doc-structure.mjs](/Users/tw.kim/Documents/AGA/test/new-mobile-app/scripts/validate-team-doc-structure.mjs:227), [validate-reference-docs.mjs](/Users/tw.kim/Documents/AGA/test/new-mobile-app/scripts/validate-reference-docs.mjs:62). The checkpoint review records the same conclusion: [.evidence review](/Users/tw.kim/Documents/AGA/test/new-mobile-app/.evidence/reviews/20260616-runtime-surface-structure-checkpoint5-source-map-xhigh-review.md:7).

2. Harness/validator scope was narrowed deliberately.
`validate-team-doc.mjs` is now a split wrapper over structure, runtime-source, workflow, governance, reference, and managed parity validators: [validate-team-doc.mjs](/Users/tw.kim/Documents/AGA/test/new-mobile-app/scripts/validate-team-doc.mjs:7). CI always runs `test:runtime` and workspace lint/test, then conditionally runs local harness only for Codex runtime/harness paths: [quality-gate.yml](/Users/tw.kim/Documents/AGA/test/new-mobile-app/.github/workflows/quality-gate.yml:16), [quality-gate.yml](/Users/tw.kim/Documents/AGA/test/new-mobile-app/.github/workflows/quality-gate.yml:18). The classifier fixtures explicitly require runtime paths and reject broad `mobile-app-dev-team/.*` triggering: [validate-project-environment.mjs](/Users/tw.kim/Documents/AGA/test/new-mobile-app/scripts/validate-project-environment.mjs:107), [validate-project-environment.mjs](/Users/tw.kim/Documents/AGA/test/new-mobile-app/scripts/validate-project-environment.mjs:123). Applicability is documented in [PROJECT_ENVIRONMENT.md](/Users/tw.kim/Documents/AGA/test/new-mobile-app/PROJECT_ENVIRONMENT.md:439) and [REPO_OPERATIONS.md](/Users/tw.kim/Documents/AGA/test/new-mobile-app/REPO_OPERATIONS.md:204).

**Verification Run**
Read-only commands run, all exit `0`:

```sh
node scripts/validate-team-doc.mjs
node scripts/validate-project-environment.mjs --self-test && node scripts/validate-project-environment.mjs
node scripts/validate-team-doc-structure.mjs --self-test && node scripts/validate-team-doc-structure.mjs && node scripts/validate-reference-docs.mjs && node scripts/validate-runtime-sources.mjs
```

Relevant output excerpts: “Validated current mobile-app-dev-team surface validators.” and “Validated project environment drift checks.”

**Classification**
Runtime validator / local harness scope audit. Owner: runtime maintainer.

For this staged change set, local harness remains PR-blocking because `.agents/**`, workflow, root policy, package metadata, and runtime scripts are touched. Rerun before PR/merge:

```sh
pnpm run test:runtime
pnpm turbo run lint test
pnpm run test:local-harness
```

Residual risk: current validation proves repo-local consistency only; it does not prove live OpenClaw pod execution, `/workspace/skills`, GitHub branch protection, EAS, Maestro/mobile-mcp, Jira, or Confluence state.