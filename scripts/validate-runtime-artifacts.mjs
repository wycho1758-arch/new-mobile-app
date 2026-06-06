#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const errors = [];

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
for (const agent of agents) {
  const body = read(`.codex/agents/${agent}`);
  for (const key of ['name', 'description', 'developer_instructions']) {
    assert(new RegExp(`^${key}\\s*=`, 'm').test(body), `${agent} missing ${key}`);
  }
  assert(/read-only|Do not|Workspace-write mode requires/.test(body), `${agent} missing boundary instruction`);
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
      const commandPath = hook.command.replace(/^node\s+/, '');
      assert(exists(commandPath), `hook command path missing: ${commandPath}`);
    }
  }
}

for (const required of [
  'evals/skills/mobile-app-dev-workflow/positive.prompt.md',
  'evals/skills/mobile-app-dev-workflow/negative.prompt.md',
  'evals/skills/mobile-backend-api-integrator-workflow/positive.prompt.md',
  'evals/skills/mobile-backend-api-integrator-workflow/negative.prompt.md',
  'evals/hooks/fixtures/pretool-deny.json',
]) {
  assert(exists(required), `missing eval fixture: ${required}`);
}

if (errors.length) {
  console.error(errors.map((error) => `- ${error}`).join('\n'));
  process.exit(1);
}

console.log(`Validated ${skills.length} skills, ${agents.length} agents, and ${Object.keys(hooks.hooks).length} hook events.`);
