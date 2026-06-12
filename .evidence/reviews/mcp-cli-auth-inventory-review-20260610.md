**Findings**

Medium: The Expo MCP auth state is overclaimed. The draft says `codex mcp list` now shows `expo` as `Auth: OAuth` after `codex mcp login expo`, but current `codex mcp list` shows `expo` enabled with `Auth: Unsupported`, and `codex mcp get expo` shows no bearer token env var or headers. This also conflicts with the repo SoT, which records the plugin-provided Expo MCP as enabled but “authentication status: not logged in.”
Sources: `PROJECT_ENVIRONMENT.md:260`, `PROJECT_ENVIRONMENT.md:261`, `PROJECT_ENVIRONMENT.md:262`, `PROJECT_ENVIRONMENT.md:263`, `PROJECT_ENVIRONMENT.md:264`, `PROJECT_ENVIRONMENT.md:265`; `docs/confluence/20260608-codex-expo-rn-runtime-sot-update.md:202`, `docs/confluence/20260608-codex-expo-rn-runtime-sot-update.md:204`, `docs/confluence/20260608-codex-expo-rn-runtime-sot-update.md:205`, `docs/confluence/20260608-codex-expo-rn-runtime-sot-update.md:206`, `docs/confluence/20260608-codex-expo-rn-runtime-sot-update.md:207`; command evidence: `codex mcp list`, `codex mcp get expo`.

Medium: Railway login/account state is not currently revalidated by command output. `railway --version` and `/usr/local/bin/railway` are confirmed, but `railway whoami` failed due DNS/network failure, so the draft’s “logged in as superman” claim is not grounded in this review run. The SoT supports Railway as a QA CLI workflow with strict secret handling, not as a required MCP.
Sources: `.agents/skills/qa-railway-workflow/SKILL.md:36`, `.agents/skills/qa-railway-workflow/SKILL.md:37`, `.agents/skills/qa-railway-workflow/SKILL.md:40`, `.agents/skills/qa-railway-workflow/SKILL.md:41`, `.agents/skills/qa-railway-workflow/SKILL.md:44`, `.agents/skills/qa-railway-workflow/SKILL.md:98`, `.agents/skills/qa-railway-workflow/SKILL.md:103`; command evidence: `which railway` PASS, `railway --version` PASS, `railway whoami` FAIL.

Medium: gcloud account/auth state is only partially verified. `gcloud config get-value project` returned `clawpod-nano-banana-260223`, which supports the configured-project portion of the Stitch prerequisite, but `gcloud auth list` failed because the read-only sandbox prevented gcloud from creating/updating files under the user config directory. The draft should not claim an active account was confirmed by this review run, and it should still state that Stitch service enablement remains unproven.
Sources: `PROJECT_ENVIRONMENT.md:252`, `PROJECT_ENVIRONMENT.md:255`, `PROJECT_ENVIRONMENT.md:256`, `PROJECT_ENVIRONMENT.md:257`; command evidence: `gcloud config get-value project` PASS, `gcloud auth list` FAIL.

Low: The required project MCP classification is otherwise source-backed. `PROJECT_ENVIRONMENT.md` lists only `mobile-mcp`, `serena`, and `stitch` as required project MCP servers, with matching pinned commands in `.codex/config.toml`; current `codex mcp list/get` confirms all three are enabled and auth is unsupported for the stdio servers.
Sources: `PROJECT_ENVIRONMENT.md:241`, `PROJECT_ENVIRONMENT.md:242`, `PROJECT_ENVIRONMENT.md:243`, `PROJECT_ENVIRONMENT.md:244`, `PROJECT_ENVIRONMENT.md:245`, `PROJECT_ENVIRONMENT.md:246`, `PROJECT_ENVIRONMENT.md:247`, `PROJECT_ENVIRONMENT.md:248`, `PROJECT_ENVIRONMENT.md:249`, `PROJECT_ENVIRONMENT.md:250`, `PROJECT_ENVIRONMENT.md:251`, `PROJECT_ENVIRONMENT.md:252`, `PROJECT_ENVIRONMENT.md:253`, `PROJECT_ENVIRONMENT.md:254`, `PROJECT_ENVIRONMENT.md:255`; `.codex/config.toml:1`, `.codex/config.toml:2`, `.codex/config.toml:3`, `.codex/config.toml:5`, `.codex/config.toml:7`, `.codex/config.toml:8`, `.codex/config.toml:10`, `.codex/config.toml:11`, `.codex/config.toml:12`.

Low: The optional/local MCP classification for `atlassian`, `node_repl`, `pencil`, `playwright`, and `tavily` is broadly grounded, with one security caveat: Tavily’s configured URL contains a secret-like query value and must be redacted from docs/evidence. The draft’s warning not to copy secret-bearing URLs is correct.
Sources: `AGENTS.md:13`, `AGENTS.md:94`, `PROJECT_ENVIRONMENT.md:258`, `PROJECT_ENVIRONMENT.md:307`, `.agents/skills/qa-railway-workflow/SKILL.md:35`, `.agents/skills/qa-railway-workflow/SKILL.md:60`, `.agents/skills/qa-railway-workflow/SKILL.md:61`, `.agents/skills/qa-railway-workflow/SKILL.md:103`; command evidence: `codex mcp list`, `codex mcp get tavily`.

Low: The RN Web E2E versus Playwright MCP distinction is grounded. The repo SoT and mobile package define RN Web E2E through `pnpm --filter mobile e2e:web` / Playwright package configuration, while native completion remains separate through Maestro and `mobile-mcp` when device/simulator access exists.
Sources: `PROJECT_ENVIRONMENT.md:54`, `PROJECT_ENVIRONMENT.md:56`, `PROJECT_ENVIRONMENT.md:57`, `PROJECT_ENVIRONMENT.md:58`, `PROJECT_ENVIRONMENT.md:59`, `PROJECT_ENVIRONMENT.md:78`, `PROJECT_ENVIRONMENT.md:79`, `PROJECT_ENVIRONMENT.md:80`; `apps/mobile/package.json:8`, `apps/mobile/package.json:9`, `apps/mobile/package.json:35`; `docs/confluence/20260608-codex-expo-rn-runtime-sot-update.md:319`, `docs/confluence/20260608-codex-expo-rn-runtime-sot-update.md:324`, `docs/confluence/20260608-codex-expo-rn-runtime-sot-update.md:327`, `docs/confluence/20260608-codex-expo-rn-runtime-sot-update.md:328`, `docs/confluence/20260608-codex-expo-rn-runtime-sot-update.md:336`, `docs/confluence/20260608-codex-expo-rn-runtime-sot-update.md:338`.

Low: The EAS CLI gap is correctly identified. `pnpm --filter mobile exec eas --version` failed with `Command "eas" not found`, while workspace Expo CLI resolution returned `56.1.14` and global `/usr/local/bin/expo` returned legacy `4.4.6`. Future setup guidance should decide explicitly whether EAS CLI install/login is needed for build/submit/update workflows.
Sources: `PROJECT_ENVIRONMENT.md:130`, `PROJECT_ENVIRONMENT.md:132`, `PROJECT_ENVIRONMENT.md:138`, `PROJECT_ENVIRONMENT.md:139`, `PROJECT_ENVIRONMENT.md:140`, `PROJECT_ENVIRONMENT.md:141`; command evidence: `pnpm --filter mobile exec eas --version` FAIL, `pnpm --filter mobile exec expo --version` PASS, `which expo` PASS, `expo --version` PASS.

No implementation changes were required or performed. Tests-first evidence is not applicable because this was a read-only report review, not a repo implementation. Current worktree is not clean, and the draft’s warning not to imply a clean tree is correct based on `git status --short`.

```json
{
  "verdict": "NO_GO",
  "reviewer": "wm-implementation-reviewer",
  "mode": "final",
  "scope": {
    "baseline": "6039d47",
    "target": "MCP/CLI Auth Inventory Review Prompt",
    "paths_reviewed": [
      "AGENTS.md",
      "PROJECT_ENVIRONMENT.md",
      ".codex/config.toml",
      ".agents/skills/wm/SKILL.md",
      ".agents/skills/qa-railway-workflow/SKILL.md",
      "docs/confluence/20260608-codex-expo-rn-runtime-sot-update.md",
      "package.json",
      "apps/mobile/package.json",
      "apps/api/package.json"
    ]
  },
  "findings": [
    {
      "severity": "MEDIUM",
      "summary": "Expo MCP auth is overclaimed: current command output reports expo Auth as Unsupported, not OAuth, and repo SoT still records the plugin-provided Expo MCP as not logged in.",
      "source_refs": [
        "PROJECT_ENVIRONMENT.md:260",
        "PROJECT_ENVIRONMENT.md:264",
        "PROJECT_ENVIRONMENT.md:265",
        "docs/confluence/20260608-codex-expo-rn-runtime-sot-update.md:202",
        "docs/confluence/20260608-codex-expo-rn-runtime-sot-update.md:207",
        "command: codex mcp list",
        "command: codex mcp get expo"
      ],
      "owner": "Codex runtime/setup guide owner"
    },
    {
      "severity": "MEDIUM",
      "summary": "Railway login identity was not revalidated in this review run because railway whoami failed on DNS/network access; installed CLI/version is confirmed, but logged-in account state is not.",
      "source_refs": [
        ".agents/skills/qa-railway-workflow/SKILL.md:36",
        ".agents/skills/qa-railway-workflow/SKILL.md:37",
        ".agents/skills/qa-railway-workflow/SKILL.md:40",
        ".agents/skills/qa-railway-workflow/SKILL.md:41",
        ".agents/skills/qa-railway-workflow/SKILL.md:44",
        "command: which railway",
        "command: railway --version",
        "command: railway whoami"
      ],
      "owner": "QA/Release"
    },
    {
      "severity": "MEDIUM",
      "summary": "gcloud project is confirmed but active account/auth state was not revalidated because gcloud auth list failed under the read-only sandbox; Stitch service enablement also remains unproven.",
      "source_refs": [
        "PROJECT_ENVIRONMENT.md:252",
        "PROJECT_ENVIRONMENT.md:255",
        "PROJECT_ENVIRONMENT.md:256",
        "PROJECT_ENVIRONMENT.md:257",
        "command: gcloud config get-value project",
        "command: gcloud auth list"
      ],
      "owner": "Design/Stitch environment owner"
    },
    {
      "severity": "LOW",
      "summary": "Required project MCP classification is source-backed: local SoT and config identify mobile-mcp, serena, and stitch as required project MCP servers with pinned commands.",
      "source_refs": [
        "PROJECT_ENVIRONMENT.md:241",
        "PROJECT_ENVIRONMENT.md:242",
        "PROJECT_ENVIRONMENT.md:244",
        "PROJECT_ENVIRONMENT.md:248",
        "PROJECT_ENVIRONMENT.md:250",
        "PROJECT_ENVIRONMENT.md:252",
        "PROJECT_ENVIRONMENT.md:254",
        ".codex/config.toml:1",
        ".codex/config.toml:3",
        ".codex/config.toml:5",
        ".codex/config.toml:8",
        ".codex/config.toml:10",
        ".codex/config.toml:12",
        "command: codex mcp list",
        "command: codex mcp get mobile-mcp",
        "command: codex mcp get serena",
        "command: codex mcp get stitch"
      ],
      "owner": "Codex runtime/setup guide owner"
    },
    {
      "severity": "LOW",
      "summary": "Optional/local MCP classification is broadly grounded, and Tavily guidance correctly needs redaction because its local MCP URL contains a secret-like query value.",
      "source_refs": [
        "AGENTS.md:13",
        "AGENTS.md:94",
        "PROJECT_ENVIRONMENT.md:258",
        ".agents/skills/qa-railway-workflow/SKILL.md:35",
        ".agents/skills/qa-railway-workflow/SKILL.md:60",
        ".agents/skills/qa-railway-workflow/SKILL.md:61",
        ".agents/skills/qa-railway-workflow/SKILL.md:103",
        "command: codex mcp list",
        "command: codex mcp get atlassian",
        "command: codex mcp get node_repl",
        "command: codex mcp get pencil",
        "command: codex mcp get playwright",
        "command: codex mcp get tavily"
      ],
      "owner": "Codex runtime/setup guide owner"
    },
    {
      "severity": "LOW",
      "summary": "RN Web E2E versus Playwright MCP distinction is source-backed: repo E2E uses the mobile workspace Playwright script/config, while native visual/device QA remains Maestro/mobile-mcp when available.",
      "source_refs": [
        "PROJECT_ENVIRONMENT.md:54",
        "PROJECT_ENVIRONMENT.md:56",
        "PROJECT_ENVIRONMENT.md:57",
        "PROJECT_ENVIRONMENT.md:58",
        "PROJECT_ENVIRONMENT.md:59",
        "PROJECT_ENVIRONMENT.md:78",
        "PROJECT_ENVIRONMENT.md:79",
        "PROJECT_ENVIRONMENT.md:80",
        "apps/mobile/package.json:8",
        "apps/mobile/package.json:9",
        "apps/mobile/package.json:35",
        "docs/confluence/20260608-codex-expo-rn-runtime-sot-update.md:319",
        "docs/confluence/20260608-codex-expo-rn-runtime-sot-update.md:324",
        "docs/confluence/20260608-codex-expo-rn-runtime-sot-update.md:336",
        "docs/confluence/20260608-codex-expo-rn-runtime-sot-update.md:338"
      ],
      "owner": "Mobile QA"
    },
    {
      "severity": "LOW",
      "summary": "EAS CLI gap is correctly identified: mobile workspace eas is not available, while workspace Expo CLI is available and a legacy global expo binary exists.",
      "source_refs": [
        "PROJECT_ENVIRONMENT.md:130",
        "PROJECT_ENVIRONMENT.md:132",
        "PROJECT_ENVIRONMENT.md:138",
        "PROJECT_ENVIRONMENT.md:139",
        "PROJECT_ENVIRONMENT.md:140",
        "PROJECT_ENVIRONMENT.md:141",
        "command: pnpm --filter mobile exec eas --version",
        "command: pnpm --filter mobile exec expo --version",
        "command: which expo",
        "command: expo --version"
      ],
      "owner": "Mobile runtime/setup guide owner"
    }
  ],
  "checks_reviewed": [
    {
      "command": "nl -ba AGENTS.md",
      "status": "PASS",
      "evidence": "Read-only source review confirmed required rules, mobile-mcp policy, QA selector rules, and verification expectations."
    },
    {
      "command": "nl -ba PROJECT_ENVIRONMENT.md",
      "status": "PASS",
      "evidence": "Read-only source review confirmed root environment SoT, required MCPs, plugin-provided Expo MCP status, Stitch prerequisites, Railway workflow references, and CI/local QA gates."
    },
    {
      "command": "nl -ba .codex/config.toml",
      "status": "PASS",
      "evidence": "Read-only source review confirmed pinned mobile-mcp, serena, and stitch entries."
    },
    {
      "command": "nl -ba .agents/skills/wm/SKILL.md",
      "status": "PASS",
      "evidence": "Read-only source review confirmed reviewer routing and verdict contract."
    },
    {
      "command": "nl -ba .agents/skills/qa-railway-workflow/SKILL.md",
      "status": "PASS",
      "evidence": "Read-only source review confirmed Railway is a QA CLI workflow with secret redaction requirements, not app implementation ownership."
    },
    {
      "command": "nl -ba docs/confluence/20260608-codex-expo-rn-runtime-sot-update.md",
      "status": "PASS",
      "evidence": "Read-only source review confirmed mobile-mcp, Serena, Expo plugin, RN Web E2E, mobile QA, and verification command SoT."
    },
    {
      "command": "nl -ba package.json apps/mobile/package.json apps/api/package.json",
      "status": "PASS",
      "evidence": "Read-only source review confirmed workspace scripts, mobile Playwright E2E script/dependency, Expo package versions, and API contracts dependency."
    },
    {
      "command": "codex mcp list",
      "status": "PASS",
      "evidence": "Confirmed required MCPs enabled; also showed expo Auth as Unsupported, contradicting the draft OAuth claim. Tavily URL was treated as secret-like and not repeated in prose."
    },
    {
      "command": "codex mcp get atlassian mobile-mcp node_repl pencil playwright serena stitch expo tavily",
      "status": "PASS",
      "evidence": "Confirmed transports and commands for named MCPs; Tavily secret-like query was not copied into findings text."
    },
    {
      "command": "which railway",
      "status": "PASS",
      "evidence": "Confirmed Railway binary path as /usr/local/bin/railway."
    },
    {
      "command": "railway --version",
      "status": "PASS",
      "evidence": "Confirmed Railway CLI version 5.6.2."
    },
    {
      "command": "railway whoami",
      "status": "FAIL",
      "evidence": "Command failed due DNS/network request failure to Railway API, so current logged-in identity was not verified."
    },
    {
      "command": "pnpm --filter mobile exec eas --version",
      "status": "FAIL",
      "evidence": "Command failed with Command \"eas\" not found."
    },
    {
      "command": "pnpm --filter mobile exec expo --version",
      "status": "PASS",
      "evidence": "Returned Expo CLI version 56.1.14 from the mobile workspace."
    },
    {
      "command": "which expo && expo --version",
      "status": "PASS",
      "evidence": "Confirmed global expo path /usr/local/bin/expo and version 4.4.6, with Node compatibility warning from legacy expo-cli."
    },
    {
      "command": "gcloud auth list",
      "status": "FAIL",
      "evidence": "Command failed because gcloud could not create/update files in the user config directory under the read-only sandbox."
    },
    {
      "command": "gcloud config get-value project",
      "status": "PASS",
      "evidence": "Returned configured project clawpod-nano-banana-260223."
    },
    {
      "command": "git status --short",
      "status": "PASS",
      "evidence": "Confirmed dirty worktree with pre-existing modified and untracked files; report must not imply clean tree."
    },
    {
      "command": "tests-first evidence",
      "status": "NOT_APPLICABLE",
      "evidence": "Review scope is a read-only report review with no implementation or source edits."
    },
    {
      "command": "mobile-mcp visual QA",
      "status": "NOT_APPLICABLE",
      "evidence": "Review scope is MCP/CLI auth inventory classification, not mobile UI/runtime implementation."
    }
  ],
  "residual_risks": [
    "Network-restricted review could not revalidate Railway whoami even though the CLI binary and version are installed.",
    "Read-only sandbox prevented gcloud auth list from validating active account state.",
    "Configured gcloud project does not prove Stitch MCP service enablement.",
    "Expo MCP auth state may differ after an interactive login outside this sandbox, but current reviewed output and local SoT do not support the OAuth claim.",
    "Current worktree is dirty; any future setup guide or evidence should avoid implying a clean baseline."
  ],
  "next_action": "fix_findings"
}
```