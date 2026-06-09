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

function read(file) {
  return fs.readFileSync(path.join(root, file), 'utf8');
}

function exists(file) {
  return fs.existsSync(path.join(root, file));
}

function assert(condition, message) {
  if (!condition) errors.push(message);
}

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
  assert(new RegExp(`name:\\s*${skill}`).test(body), `${file} frontmatter name must equal folder`);
  assert(/description:\s*\S/.test(body), `${file} missing description`);
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
  ]),
  ...poAgentEvalNames.flatMap((agent) => [
    `evals/agents/${agent}/positive.prompt.md`,
    `evals/agents/${agent}/negative.prompt.md`,
  ]),
  ...designAgentEvalNames.flatMap((agent) => [
    `evals/agents/${agent}/positive.prompt.md`,
    `evals/agents/${agent}/negative.prompt.md`,
  ]),
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
  assert(/MUST plan before non-trivial work/i.test(wm), 'wm skill must require planning before non-trivial work');
  assert(/SoT-grounded planning/i.test(wm), 'wm skill must require SoT-grounded planning');
  assert(/predictions, assumptions, or expected behavior/i.test(wm), 'wm skill must forbid prediction-based planning');
  assert(/completed implementation plan must be reviewed/i.test(wm), 'wm skill must require reviewer check for completed plans');
  assert(/actual completed work must be reviewed/i.test(wm), 'wm skill must require reviewer check for actual completed work');
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
