#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const errors = [];
const wmAgentNames = [
  'wm-implementation-reviewer',
  'wm-contract-reviewer',
  'wm-docs-researcher',
  'wm-gate-fix-advisor',
];
const poSkillNames = [
  'po-requirement-office-hours',
  'po-work-unit-planning-and-agent-sprint',
  'po-prd-to-execution',
  'po-planning-completeness-review',
];
const designSkillNames = [
  'design-mobile-design-handoff',
  'design-stitch-mcp-operating-rules',
];
const poAgentNames = [
  'po-planning-reviewer',
  'po-scope-gate-reviewer',
  'po-docs-researcher',
];
const designAgentNames = [
  'design-reviewer',
  'design-researcher',
];
const poAgentEvalNames = poAgentNames;
const designAgentEvalNames = designAgentNames;
const legacyMobileReviewerNames = [
  'mobile-implementation-reviewer',
  'mobile-contract-reviewer',
  'mobile-docs-researcher',
  'mobile-gate-fix-advisor',
];
const forbiddenRootRuntimeArtifacts = ['CLAUDE.md', '.claude', '.claude-state'];
const expandedHumanGateCategories = [
  'production submit',
  'payment or money movement',
  'PII or privacy-sensitive behavior',
  'external messaging or email/SMS push',
  'legal/terms/contracts',
  'business approval',
  'compliance/policy decision',
  'Human Owner budget/business decision',
  'irreversible scope tradeoff',
  'accepting risk after a gate failure',
];
const poRoutingFixtureFiles = [
  'evals/skills/po-work-unit-planning-and-agent-sprint/broad-prd-positive.prompt.md',
  'evals/skills/po-work-unit-planning-and-agent-sprint/modification-request-positive.prompt.md',
  'evals/skills/po-work-unit-planning-and-agent-sprint/issue-triage-positive.prompt.md',
  'evals/skills/po-work-unit-planning-and-agent-sprint/direct-implementation-routing-positive.prompt.md',
  'evals/skills/po-work-unit-planning-and-agent-sprint/proactive-report-no-auto-execution-positive.prompt.md',
  'evals/skills/po-work-unit-planning-and-agent-sprint/human-gate-stop-positive.prompt.md',
  'evals/skills/po-work-unit-planning-and-agent-sprint/qa-release-evidence-gap-positive.prompt.md',
  'evals/skills/po-work-unit-planning-and-agent-sprint/review-only-routing-negative.prompt.md',
  'evals/skills/po-requirement-office-hours/sized-unknown-positive.prompt.md',
  'evals/skills/po-prd-to-execution/oversized-unclear-negative.prompt.md',
];

function read(file) {
  return fs.readFileSync(path.join(root, file), 'utf8');
}

function exists(file) {
  return fs.existsSync(path.join(root, file));
}

function assert(condition, message) {
  if (!condition) errors.push(message);
}

function collectValidationErrors(callback) {
  const start = errors.length;
  callback();
  return errors.splice(start);
}

function extractYamlFrontmatter(body, file) {
  const match = body.match(/^---\n([\s\S]*?)\n---(?:\n|$)/);
  assert(Boolean(match), `${file} missing YAML frontmatter`);
  return match?.[1] || '';
}

function parseSkillFrontmatter(frontmatter, file) {
  const parsed = {};
  for (const [index, line] of frontmatter.split('\n').entries()) {
    if (!line.trim() || line.trimStart().startsWith('#')) continue;
    const match = line.match(/^([A-Za-z_][A-Za-z0-9_-]*):\s*(.*)$/);
    assert(Boolean(match), `${file} invalid frontmatter line ${index + 1}: ${line}`);
    if (!match) continue;

    const [, key, value] = match;
    const trimmed = value.trim();
    const quote = trimmed[0];
    const isQuoted = (quote === '"' || quote === "'") && trimmed.endsWith(quote);
    if (!isQuoted) {
      assert(!/:\s/.test(value), `${file} frontmatter ${key} contains unquoted ": " sequence`);
    }
    parsed[key] = isQuoted ? trimmed.slice(1, -1) : trimmed;
  }
  return parsed;
}

const invalidFrontmatterErrors = collectValidationErrors(() => {
  parseSkillFrontmatter('name: invalid-frontmatter\ndescription: Use for this repo: install tools\n', 'frontmatter-self-test');
});
assert(
  invalidFrontmatterErrors.some((message) => message.includes('unquoted ": " sequence')),
  'skill frontmatter parser self-test must reject unquoted colon-space values',
);

const validQuotedFrontmatterErrors = collectValidationErrors(() => {
  parseSkillFrontmatter('name: quoted-frontmatter\ndescription: "Use for this repo: install tools"\n', 'frontmatter-self-test');
});
assert(validQuotedFrontmatterErrors.length === 0, 'skill frontmatter parser self-test must accept quoted colon-space values');

function tomlTable(body, tableName) {
  const match = body.match(new RegExp(`\\[${tableName.replace(/\./g, '\\.')}\\]\\n([\\s\\S]*?)(?=\\n\\[|$)`));
  return match?.[1] || '';
}

const skillDir = path.join(root, '.agents/skills');
const skills = fs.existsSync(skillDir)
  ? fs.readdirSync(skillDir).filter((name) => fs.statSync(path.join(skillDir, name)).isDirectory())
  : [];

assert(skills.length >= 2, 'expected at least two native Codex skills under .agents/skills');

for (const skill of skills) {
  assert(/^[a-z0-9-]+$/.test(skill), `skill folder must be lowercase hyphenated: ${skill}`);
  const file = `.agents/skills/${skill}/SKILL.md`;
  assert(exists(file), `missing ${file}`);
  if (!exists(file)) continue;
  const body = read(file);
  assert(body.startsWith('---\n'), `${file} missing YAML frontmatter`);
  const frontmatter = parseSkillFrontmatter(extractYamlFrontmatter(body, file), file);
  assert(frontmatter.name === skill, `${file} frontmatter name must equal folder`);
  assert(Boolean(frontmatter.description), `${file} missing description`);
  assert(body.split('\n').length <= 500, `${file} exceeds 500 lines`);
}

const agentDir = path.join(root, '.codex/agents');
const agents = fs.existsSync(agentDir)
  ? fs.readdirSync(agentDir).filter((name) => name.endsWith('.toml'))
  : [];
assert(agents.length >= 4, 'expected four mobile custom agent TOML files');
for (const agentName of wmAgentNames) {
  assert(exists(`.codex/agents/${agentName}.toml`), `missing wm custom agent: ${agentName}`);
}
for (const agentName of poAgentNames) {
  assert(exists(`.codex/agents/${agentName}.toml`), `missing po custom agent: ${agentName}`);
}
for (const agentName of designAgentNames) {
  assert(exists(`.codex/agents/${agentName}.toml`), `missing design custom agent: ${agentName}`);
}
for (const agent of agents) {
  const body = read(`.codex/agents/${agent}`);
  for (const key of ['name', 'description', 'developer_instructions']) {
    assert(new RegExp(`^${key}\\s*=`, 'm').test(body), `${agent} missing ${key}`);
  }
  assert(/read-only|Do not|Workspace-write mode requires/.test(body), `${agent} missing boundary instruction`);
  if (/reviewer|researcher/.test(agent)) {
    assert(/source references|cite sources|links/i.test(body), `${agent} must require source references`);
    assert(/recursiv(e|ely) delegat/i.test(body), `${agent} must prohibit recursive delegation`);
  }
}

const hooks = JSON.parse(read('.codex/hooks.json'));
for (const eventName of ['SessionStart', 'PreToolUse', 'PostToolUse', 'Stop']) {
  assert(Array.isArray(hooks.hooks?.[eventName]), `hooks.json missing ${eventName}`);
}

for (const eventGroups of Object.values(hooks.hooks || {})) {
  for (const group of eventGroups) {
    assert(typeof group.matcher === 'string', 'hook matcher must be a string');
    assert(Array.isArray(group.hooks), 'hook group must contain hooks array');
    for (const hook of group.hooks) {
      assert(hook.type === 'command', 'hook type must be command');
      const commandPath = hook.command
        .replace(/^node\s+/, '')
        .replace(/^["']?\$\(git rev-parse --show-toplevel\)\//, '')
        .replace(/^["']|["']$/g, '');
      assert(exists(commandPath), `hook command path missing: ${commandPath}`);
    }
  }
}

for (const required of [
  'evals/skills/mobile-app-dev-workflow/positive.prompt.md',
  'evals/skills/mobile-app-dev-workflow/negative.prompt.md',
  'evals/skills/mobile-app-dev-workflow/review-only-negative.prompt.md',
  'evals/skills/mobile-app-dev-workflow/generic-expo-negative.prompt.md',
  'evals/skills/mobile-backend-api-integrator-workflow/positive.prompt.md',
  'evals/skills/mobile-backend-api-integrator-workflow/negative.prompt.md',
  'evals/skills/mobile-backend-api-integrator-workflow/review-only-negative.prompt.md',
  'evals/skills/wm/positive.prompt.md',
  'evals/skills/wm/negative.prompt.md',
  'evals/skills/wm/review-only-negative.prompt.md',
  ...poSkillNames.flatMap((skill) => [
    `evals/skills/${skill}/positive.prompt.md`,
    `evals/skills/${skill}/negative.prompt.md`,
    `evals/skills/${skill}/review-only-negative.prompt.md`,
  ]),
  ...designSkillNames.flatMap((skill) => [
    `evals/skills/${skill}/positive.prompt.md`,
    `evals/skills/${skill}/negative.prompt.md`,
    `evals/skills/${skill}/review-only-negative.prompt.md`,
    `evals/skills/${skill}/p0-product-planning-approval-positive.prompt.md`,
    `evals/skills/${skill}/p1-product-planning-approval-positive.prompt.md`,
    `evals/skills/${skill}/p1-html-extraction-gate-negative.prompt.md`,
  ]),
  ...poAgentEvalNames.flatMap((agent) => [
    `evals/agents/${agent}/positive.prompt.md`,
    `evals/agents/${agent}/negative.prompt.md`,
  ]),
  ...designAgentEvalNames.flatMap((agent) => [
    `evals/agents/${agent}/positive.prompt.md`,
    `evals/agents/${agent}/negative.prompt.md`,
  ]),
  ...poRoutingFixtureFiles,
  'evals/hooks/fixtures/pretool-deny.json',
]) {
  assert(exists(required), `missing eval fixture: ${required}`);
}

for (const skill of skills) {
  const positive = `evals/skills/${skill}/positive.prompt.md`;
  const negative = `evals/skills/${skill}/negative.prompt.md`;
  const reviewOnlyNegative = `evals/skills/${skill}/review-only-negative.prompt.md`;
  const genericExpoNegative = `evals/skills/${skill}/generic-expo-negative.prompt.md`;
  const tag = `$${skill}`;

  if (exists(positive)) assert(read(positive).includes(tag), `${positive} must explicitly trigger ${tag}`);
  if (exists(negative)) assert(!read(negative).includes(tag), `${negative} must not explicitly trigger ${tag}`);
  if (exists(reviewOnlyNegative)) {
    const body = read(reviewOnlyNegative);
    assert(!body.includes(tag), `${reviewOnlyNegative} must not explicitly trigger ${tag}`);
    assert(/review/i.test(body) && /do not edit/i.test(body), `${reviewOnlyNegative} must describe review-only no-edit behavior`);
  }
  if (exists(genericExpoNegative)) {
    const body = read(genericExpoNegative);
    assert(!body.includes(tag), `${genericExpoNegative} must not explicitly trigger ${tag}`);
    assert(/generic Expo|generic Expo\/RN/i.test(body), `${genericExpoNegative} must describe generic Expo/RN behavior`);
  }
}

for (const skill of designSkillNames) {
  const p0Path = `evals/skills/${skill}/p0-product-planning-approval-positive.prompt.md`;
  const p1PositivePath = `evals/skills/${skill}/p1-product-planning-approval-positive.prompt.md`;
  const p1Path = `evals/skills/${skill}/p1-html-extraction-gate-negative.prompt.md`;
  if (exists(p0Path)) {
    const p0 = read(p0Path);
    assert(p0.includes(`$${skill}`), `${p0Path} must explicitly trigger $${skill}`);
    assert(/DESIGN\.md/i.test(p0), `${p0Path} must require DESIGN.md decision context`);
    assert(/purpose.*reason|reason.*purpose|why .*artifacts/i.test(p0), `${p0Path} must require artifact purpose and reason`);
    assert(/exactly two/i.test(p0), `${p0Path} must require exactly two proposed directions`);
    assert(/non-goals/i.test(p0), `${p0Path} must require non-goals`);
    assert(/human-gate|human gate/i.test(p0), `${p0Path} must require human-gate matrix`);
    assert(/expected evidence|expected artifact paths/i.test(p0), `${p0Path} must require expected evidence paths`);
    assert(/requested date/i.test(p0), `${p0Path} must require requested date`);
    assert(/READY_FOR_EXECUTION/i.test(p0), `${p0Path} must include READY_FOR_EXECUTION`);
    assert(/NEEDS_REWORK/i.test(p0), `${p0Path} must include NEEDS_REWORK`);
    assert(/HUMAN_DECISION_REQUIRED/i.test(p0), `${p0Path} must include HUMAN_DECISION_REQUIRED`);
    assert(/BLOCKED_BY_RUNTIME_CAPABILITY/i.test(p0), `${p0Path} must include BLOCKED_BY_RUNTIME_CAPABILITY`);
  }
  if (exists(p1PositivePath)) {
    const p1Positive = read(p1PositivePath);
    assert(p1Positive.includes(`$${skill}`), `${p1PositivePath} must explicitly trigger $${skill}`);
    assert(/actual .*image|generated .*image|image\/design artifact summary/i.test(p1Positive), `${p1PositivePath} must require actual image/design artifact summary`);
    assert(/purpose.*reason|reason.*purpose/i.test(p1Positive), `${p1PositivePath} must require artifact purpose and reason`);
    assert(/PRD/i.test(p1Positive), `${p1PositivePath} must require PRD mapping`);
    assert(/option comparison/i.test(p1Positive), `${p1PositivePath} must require option comparison`);
    assert(/selected.*rationale|rationale.*selected/i.test(p1Positive), `${p1PositivePath} must require Design-selected candidate rationale`);
    assert(/alternate.*rejection|rejection.*alternate|defer reason/i.test(p1Positive), `${p1PositivePath} must require alternate rejection/defer reason`);
    assert(/risks?/i.test(p1Positive), `${p1PositivePath} must require risks`);
    assert(/open decisions?/i.test(p1Positive), `${p1PositivePath} must require open decisions`);
    assert(/human-gate|human gate/i.test(p1Positive), `${p1PositivePath} must require human-gate matrix`);
    assert(/scope\/evidence/i.test(p1Positive), `${p1PositivePath} must frame Product/Planning P1 as scope/evidence approval`);
    assert(/READY_FOR_EXECUTION/i.test(p1Positive), `${p1PositivePath} must include READY_FOR_EXECUTION`);
  }
  if (exists(p1Path)) {
    const p1 = read(p1Path);
    assert(p1.includes(`$${skill}`), `${p1Path} must explicitly trigger $${skill}`);
    assert(/not approved|without .*P1|has not approved/i.test(p1), `${p1Path} must model missing P1 approval`);
    assert(/must refuse|refuse|do not|must not/i.test(p1), `${p1Path} must require refusal instead of extraction`);
    assert(/fetch_screen_code/i.test(p1), `${p1Path} must include fetch_screen_code`);
    assert(/code\.html/i.test(p1), `${p1Path} must include code.html`);
    assert(/getHtml/i.test(p1), `${p1Path} must include SDK getHtml`);
    assert(/htmlCode\.downloadUrl/i.test(p1), `${p1Path} must include htmlCode.downloadUrl`);
    assert(/option-a\.html/i.test(p1), `${p1Path} must include option-a.html publication risk`);
    assert(/option-b\.html/i.test(p1), `${p1Path} must include option-b.html publication risk`);
    assert(/READY_FOR_EXECUTION/i.test(p1), `${p1Path} must identify READY_FOR_EXECUTION as the only extraction-unblocking state`);
  }
}

const configPath = '.codex/config.toml';
assert(exists(configPath), 'missing .codex/config.toml');
if (exists(configPath)) {
  const config = read(configPath);
  const stitchConfig = tomlTable(config, 'mcp_servers.stitch');
  assert(/\[mcp_servers\.mobile-mcp\]/.test(config), 'missing mobile-mcp MCP server registration');
  assert(/command\s*=\s*"npx"/.test(config), 'mobile-mcp MCP must use npx runner');
  assert(/@mobilenext\/mobile-mcp@0\.0\.58/.test(config), 'mobile-mcp MCP must pin @mobilenext/mobile-mcp@0.0.58');
  assert(!/@mobilenext\/mobile-mcp@latest/.test(config), 'mobile-mcp MCP must not use @latest');
  assert(/\[mcp_servers\.serena\]/.test(config), 'missing Serena MCP server registration');
  assert(/command\s*=\s*"uvx"/.test(config), 'Serena MCP must use pinned uvx runner');
  assert(/git\+https:\/\/github\.com\/oraios\/serena@v1\.5\.3/.test(config), 'Serena MCP must pin oraios/serena v1.5.3');
  assert(/"--project-from-cwd"/.test(config), 'Serena MCP must derive project from cwd');
  assert(/"--context=codex"/.test(config), 'Serena MCP must use Codex context');
  assert(stitchConfig, 'missing Stitch MCP server registration');
  assert(/command\s*=\s*"npx"/.test(stitchConfig), 'Stitch MCP must use npx runner');
  assert(/args\s*=\s*\[\s*"-y"\s*,\s*"stitch-mcp@1\.3\.2"\s*\]/.test(stitchConfig), 'Stitch MCP must pin stitch-mcp@1.3.2');
  assert(!/stitch-mcp@latest/.test(stitchConfig), 'Stitch MCP must not use @latest');
  assert(!/X-Goog-Api-Key|STITCH_API_KEY|EXPO_PUBLIC_STITCH/i.test(config), 'Stitch MCP config must not contain API keys or EXPO_PUBLIC_STITCH variables');
  assert(!/AIza[0-9A-Za-z_-]{20,}/.test(config), 'MCP config must not contain literal Google API keys');
}

const wmSkillPath = '.agents/skills/wm/SKILL.md';
assert(exists(wmSkillPath), 'missing .agents/skills/wm/SKILL.md');
if (exists(wmSkillPath)) {
  const wm = read(wmSkillPath);
  assert(/\$wm/.test(wm) && /\/wm/.test(wm), 'wm skill must document explicit $wm and /wm triggers');
  assert(/Review-only requests MUST route to the read-only custom agents/i.test(wm), 'wm skill must require read-only routing for review-only requests');
  assert(/MUST plan before non-trivial work/i.test(wm), 'wm skill must require planning before non-trivial work');
  assert(/SoT-grounded planning/i.test(wm), 'wm skill must require SoT-grounded planning');
  assert(/MUST NOT proceed past planning until the applicable local SoT has been read and cited or named/i.test(wm), 'wm skill must block implementation until applicable SoT is read and cited or named');
  assert(/predictions, assumptions, or expected behavior/i.test(wm), 'wm skill must forbid prediction-based planning');
  assert(/completed implementation plan must be reviewed/i.test(wm), 'wm skill must require reviewer check for completed plans');
  assert(/pre-implementation plan review evidence and final actual-work review evidence are mandatory/i.test(wm), 'wm skill must require mandatory plan and final review evidence');
  assert(/actual completed work must be reviewed/i.test(wm), 'wm skill must require reviewer check for actual completed work');
  assert(/headless helper is an allowed review evidence path.*review evidence requirement itself is mandatory/is.test(wm), 'wm skill must clarify helper choice is optional but review evidence is mandatory');
  assert(/git diff/i.test(wm) && /completion report/i.test(wm), 'wm skill must require git diff details in completion reports');
  assert(/TDD/i.test(wm), 'wm skill must require TDD');
  assert(/branch/i.test(wm) && /PR/.test(wm), 'wm skill must preserve branch and PR workflow');
  for (const agentName of wmAgentNames) {
    assert(wm.includes(agentName), `wm skill missing dedicated reviewer agent ${agentName}`);
  }
  for (const agentName of poAgentNames) {
    assert(wm.includes(agentName), `wm skill missing po reviewer/researcher agent ${agentName}`);
  }
  for (const agentName of designAgentNames) {
    assert(wm.includes(agentName), `wm skill missing design reviewer/researcher agent ${agentName}`);
  }
  for (const agentName of legacyMobileReviewerNames) {
    assert(!wm.includes(agentName), `wm skill must not route reviewers through legacy agent ${agentName}`);
  }
  assert(!/graphify|OPENCLAW_ROOT_DIR|\.codex\/skills\/wm|Claude Code|claude-headless-review|--engine auto|review_engine_preference|admin-portal|admin-api/i.test(wm), 'wm skill contains forbidden legacy runtime terms');
}

const projectEnvironmentPath = 'PROJECT_ENVIRONMENT.md';
assert(exists(projectEnvironmentPath), 'missing PROJECT_ENVIRONMENT.md');
if (exists(projectEnvironmentPath)) {
  const environment = read(projectEnvironmentPath);
  assert(/\$wm`? plans must be SoT-grounded/i.test(environment), 'PROJECT_ENVIRONMENT.md must require $wm SoT-grounded plans');
  assert(/must not proceed past planning until applicable local SoT has been read and cited or named/i.test(environment), 'PROJECT_ENVIRONMENT.md must block $wm implementation until applicable SoT is read and cited or named');
  assert(/pre-implementation plan review evidence and final actual-work review evidence are mandatory/i.test(environment), 'PROJECT_ENVIRONMENT.md must require mandatory $wm plan and final review evidence');
  assert(/headless helper is an allowed review evidence path.*review evidence requirement itself is mandatory/is.test(environment), 'PROJECT_ENVIRONMENT.md must clarify helper choice is optional but $wm review evidence is mandatory');
}

for (const artifactPath of forbiddenRootRuntimeArtifacts) {
  assert(!exists(artifactPath), `root Claude runtime artifact must not be present: ${artifactPath}`);
}

const headlessPath = 'scripts/codex-headless-review.mjs';
assert(exists(headlessPath), 'missing Codex headless review helper');
if (exists(headlessPath)) {
  const helper = read(headlessPath);
  for (const agentName of wmAgentNames) {
    assert(helper.includes(agentName), `Codex headless helper missing allowed agent ${agentName}`);
  }
  for (const agentName of poAgentNames) {
    assert(helper.includes(agentName), `Codex headless helper missing allowed po agent ${agentName}`);
  }
  for (const agentName of designAgentNames) {
    assert(helper.includes(agentName), `Codex headless helper missing allowed design agent ${agentName}`);
  }
  for (const agentName of legacyMobileReviewerNames) {
    assert(!helper.includes(agentName), `Codex headless helper must not allow legacy agent ${agentName}`);
  }
  assert(/codex/.test(helper), 'Codex headless helper must invoke codex');
  assert(/gpt-5\.5/.test(helper), 'Codex headless helper must use gpt-5.5');
  assert(/model_reasoning_effort="high"/.test(helper), 'Codex headless helper must request high reasoning effort');
  assert(/read-only/.test(helper), 'Codex headless helper must force read-only sandbox');
  assert(/--output-last-message/.test(helper), 'Codex headless helper must capture last message output');
  assert(/source references/i.test(helper), 'Codex headless helper must require source references');
  assert(/recursive delegation/i.test(helper), 'Codex headless helper must prohibit recursive delegation');
  assert(!/claude|--engine auto|review_engine_preference/i.test(helper), 'Codex headless helper contains forbidden Claude/auto fallback path');
}

const poSkillSources = new Map([
  ['po-requirement-office-hours', { sourceSkill: 'mobile-requirement-office-hours', pageId: '1374519364' }],
  ['po-work-unit-planning-and-agent-sprint', { sourceSkill: 'mobile-work-unit-planning-and-agent-sprint', pageId: '1374650456' }],
  ['po-prd-to-execution', { sourceSkill: 'mobile-prd-to-execution', pageId: '1373634562' }],
  ['po-planning-completeness-review', { sourceSkill: 'mobile-planning-completeness-review', pageId: '1374519387' }],
]);
for (const [skill, source] of poSkillSources) {
  const file = `.agents/skills/${skill}/SKILL.md`;
  assert(exists(file), `missing Product/Planning skill adapter: ${skill}`);
  if (!exists(file)) continue;
  const body = read(file);
  assert(/Source Crosswalk/i.test(body), `${file} must include source crosswalk`);
  assert(body.includes(source.sourceSkill), `${file} must map source skill ${source.sourceSkill}`);
  assert(body.includes(source.pageId), `${file} must map source page ${source.pageId}`);
  assert(body.includes('1373798422'), `${file} must map parent Product/Planning SOUL page 1373798422`);
  assert(/Product\/Planning/i.test(body), `${file} must identify Product/Planning ownership`);
  assert(/human gates?|human-gate/i.test(body), `${file} must preserve human-gate boundary`);
  assert(/Do not .*implement|must not .*implement/i.test(body), `${file} must forbid implementation ownership`);
  assert(/external platform\/runtime/i.test(body), `${file} must preserve external runtime boundary`);
  assert(!/mobile-product-planning-workflow/i.test(body), `${file} must not create forbidden role-wrapper slug`);
}

const poWorkUnit = exists('.agents/skills/po-work-unit-planning-and-agent-sprint/SKILL.md')
  ? read('.agents/skills/po-work-unit-planning-and-agent-sprint/SKILL.md')
  : '';
assert(/Product\/Planning intake/i.test(poWorkUnit), 'po-work-unit adapter must require Product/Planning intake');
assert(/broad (?:but )?(?:apparently usable|detailed) PRD/i.test(poWorkUnit), 'po-work-unit adapter must cover broad detailed PRD routing');
assert(/selected[- ]slice unknowns/i.test(poWorkUnit), 'po-work-unit adapter must route selected-slice unknowns');
assert(/no-auto-execution|no automatic execution/i.test(poWorkUnit), 'po-work-unit adapter must preserve proactive no-auto-execution');
assert(/accepted task packet/i.test(poWorkUnit), 'po-work-unit adapter must preserve direct implementation task-packet readiness routing');

const poRequirement = exists('.agents/skills/po-requirement-office-hours/SKILL.md')
  ? read('.agents/skills/po-requirement-office-hours/SKILL.md')
  : '';
assert(/selected[- ]slice unknowns/i.test(poRequirement), 'po-requirement adapter must support selected-slice unknown clarification after work-unit sizing');
for (const category of expandedHumanGateCategories) {
  assert(poRequirement.includes(category), `po-requirement adapter must list human gate category: ${category}`);
}

const poPrd = exists('.agents/skills/po-prd-to-execution/SKILL.md')
  ? read('.agents/skills/po-prd-to-execution/SKILL.md')
  : '';
assert(/READY_FOR_MOBILE_PRD_TO_EXECUTION|bounded readiness/i.test(poPrd), 'po-prd adapter must require bounded readiness');
assert(/oversized/i.test(poPrd) && /po-work-unit-planning-and-agent-sprint/i.test(poPrd), 'po-prd adapter must route oversized PRDs back to work-unit planning');

const poCompleteness = exists('.agents/skills/po-planning-completeness-review/SKILL.md')
  ? read('.agents/skills/po-planning-completeness-review/SKILL.md')
  : '';
assert(/scope-changing/i.test(poCompleteness) && /po-requirement-office-hours/i.test(poCompleteness), 'po-completeness adapter must route scope-changing uncertainty back to requirement office-hours');

const designSkillSources = new Map([
  ['design-mobile-design-handoff', { sourceSkill: 'mobile-design-handoff', sourcePageId: '1373765661', soulPageId: '1373765702' }],
  ['design-stitch-mcp-operating-rules', { sourceSkill: 'mobile-design-handoff', sourcePageId: '1373765661', soulPageId: '1373765702' }],
]);
for (const [skill, source] of designSkillSources) {
  const file = `.agents/skills/${skill}/SKILL.md`;
  assert(exists(file), `missing Design skill adapter: ${skill}`);
  if (!exists(file)) continue;
  const body = read(file);
  assert(/Source Crosswalk/i.test(body), `${file} must include source crosswalk`);
  assert(body.includes(source.sourceSkill), `${file} must map source skill ${source.sourceSkill}`);
  assert(body.includes(source.sourcePageId), `${file} must map Design source skill page ${source.sourcePageId}`);
  assert(body.includes(source.soulPageId), `${file} must map Design SOUL page ${source.soulPageId}`);
  assert(body.includes('1374290207'), `${file} must map Design Codex practice page 1374290207`);
  assert(/Design/i.test(body), `${file} must identify Design ownership`);
  assert(/Stitch/i.test(body), `${file} must require Stitch design authoring`);
  assert(/DESIGN\.md/.test(body), `${file} must preserve DESIGN.md design-system SoT`);
  assert(/HTML/i.test(body) && /code\.html|MCP fetch/i.test(body), `${file} must require HTML extraction from Stitch`);
  assert(/P0/i.test(body) && /P1/i.test(body), `${file} must require P0/P1 Product/Planning approval gates`);
  assert(/Product\/Planning/i.test(body), `${file} must require Product/Planning approval packets`);
  assert(/scope\/evidence approval/i.test(body), `${file} must frame Product/Planning approval as scope/evidence approval`);
  assert(/purpose.*reason|reason.*purpose/i.test(body), `${file} must require artifact purpose and reason in approval packets`);
  assert(/selected.*rationale|rationale.*selected/i.test(body), `${file} must require selected candidate rationale in P1`);
  assert(/alternate.*rejection|rejection.*alternate|defer reason/i.test(body), `${file} must require alternate rejection/defer reason in P1`);
  assert(/READY_FOR_EXECUTION/i.test(body), `${file} must use existing Product/Planning readiness state READY_FOR_EXECUTION`);
  assert(/NEEDS_REWORK/i.test(body), `${file} must preserve Product/Planning NEEDS_REWORK outcome`);
  assert(/HUMAN_DECISION_REQUIRED/i.test(body), `${file} must preserve Product/Planning HUMAN_DECISION_REQUIRED outcome`);
  assert(/BLOCKED_BY_RUNTIME_CAPABILITY/i.test(body), `${file} must preserve Product/Planning runtime blocker outcome`);
  assert(/KEEP_EXISTING_DESIGN_MD/i.test(body), `${file} must require DESIGN.md keep decision before generation`);
  assert(/UPDATE_DESIGN_MD_REQUIRED/i.test(body), `${file} must require DESIGN.md update decision before generation`);
  assert(/BLOCKED_BY_DESIGN_SYSTEM_DECISION/i.test(body), `${file} must require DESIGN.md blocker decision before generation`);
  assert(/before .*Stitch generation|Stitch generation.*before/i.test(body), `${file} must place DESIGN.md and P0 decisions before Stitch generation`);
  assert(/before .*P1|P1 .*before/i.test(body), `${file} must describe the pre-P1 boundary`);
  assert(/fetch_screen_code/i.test(body), `${file} must explicitly gate fetch_screen_code`);
  assert(/code\.html/i.test(body), `${file} must explicitly gate code.html extraction`);
  assert(/getHtml/i.test(body), `${file} must explicitly gate SDK getHtml before P1`);
  assert(/htmlCode\.downloadUrl/i.test(body), `${file} must explicitly gate htmlCode.downloadUrl persistence before P1`);
  assert(/Gemini 3\.1 Pro/i.test(body), `${file} must mention the Gemini 3.1 Pro preference`);
  assert(/best-effort/i.test(body), `${file} must make Gemini 3.1 Pro selection best-effort`);
  assert(/manifest/i.test(body) && /model.*mode|mode.*model/i.test(body), `${file} must record model/mode availability in manifest`);
  assert(/prompt enhancement|enhance.*prompt/i.test(body), `${file} must require Stitch prompt enhancement`);
  assert(/exactly two|정확히 2개/i.test(body), `${file} must require exactly two design options`);
  assert(/design-pub-html\/<YYYY-MM-DD>|design-pub-html\/<date>/i.test(body), `${file} must require dated design-pub-html publication`);
  assert(/fetch_screen_image|image/i.test(body), `${file} must require Stitch image extraction`);
  assert(/option-a\.html/i.test(body), `${file} must require option-a.html publication`);
  assert(/option-b\.html/i.test(body), `${file} must require option-b.html publication`);
  assert(/option-a\.png/i.test(body), `${file} must require option-a.png publication`);
  assert(/option-b\.png/i.test(body), `${file} must require option-b.png publication`);
  assert(/manifest\.json/i.test(body), `${file} must require manifest.json publication`);
  assert(/handoff\.md/i.test(body), `${file} must require handoff.md publication`);
  assert(/UI\/UX|UX/i.test(body), `${file} must require objective UI/UX requirement framing`);
  assert(/Do not .*implement|must not .*implement/i.test(body), `${file} must forbid implementation ownership`);
  assert(/external platform\/runtime/i.test(body), `${file} must preserve external runtime boundary`);
  assert(!/mobile-design-workflow/i.test(body), `${file} must not create forbidden role-wrapper slug`);
}

if (errors.length) {
  console.error(errors.map((error) => `- ${error}`).join('\n'));
  process.exit(1);
}

console.log(`Validated ${skills.length} skills, ${agents.length} agents, and ${Object.keys(hooks.hooks).length} hook events.`);
