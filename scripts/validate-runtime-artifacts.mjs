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
  assert(/\[mcp_servers\.mobile-mcp\]/.test(config), 'missing mobile-mcp MCP server registration');
  assert(/command\s*=\s*"npx"/.test(config), 'mobile-mcp MCP must use npx runner');
  assert(/@mobilenext\/mobile-mcp@0\.0\.58/.test(config), 'mobile-mcp MCP must pin @mobilenext/mobile-mcp@0.0.58');
  assert(!/@mobilenext\/mobile-mcp@latest/.test(config), 'mobile-mcp MCP must not use @latest');
  assert(/\[mcp_servers\.serena\]/.test(config), 'missing Serena MCP server registration');
  assert(/command\s*=\s*"uvx"/.test(config), 'Serena MCP must use pinned uvx runner');
  assert(/git\+https:\/\/github\.com\/oraios\/serena@v1\.5\.3/.test(config), 'Serena MCP must pin oraios/serena v1.5.3');
  assert(/"--project-from-cwd"/.test(config), 'Serena MCP must derive project from cwd');
  assert(/"--context=codex"/.test(config), 'Serena MCP must use Codex context');
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

if (errors.length) {
  console.error(errors.map((error) => `- ${error}`).join('\n'));
  process.exit(1);
}

console.log(`Validated ${skills.length} skills, ${agents.length} agents, and ${Object.keys(hooks.hooks).length} hook events.`);
