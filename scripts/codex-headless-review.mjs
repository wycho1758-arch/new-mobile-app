#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const root = process.cwd();
const allowedAgents = new Set([
  'wm-implementation-reviewer',
  'wm-contract-reviewer',
  'wm-docs-researcher',
  'wm-gate-fix-advisor',
  'po-planning-reviewer',
  'po-scope-gate-reviewer',
  'po-docs-researcher',
  'design-reviewer',
  'design-researcher',
]);

function usage() {
  console.error('Usage: node scripts/codex-headless-review.mjs --agent <name> --prompt <text|file> --out <path>');
  process.exit(2);
}

function readArg(name) {
  const index = process.argv.indexOf(name);
  return index >= 0 ? process.argv[index + 1] : undefined;
}

function readAgentInstructions(agentName) {
  const agentPath = path.join(root, '.codex/agents', `${agentName}.toml`);
  if (!fs.existsSync(agentPath)) throw new Error(`Missing agent file: ${agentPath}`);
  const body = fs.readFileSync(agentPath, 'utf8');
  const match = body.match(/developer_instructions\s*=\s*"""([\s\S]*?)"""/);
  if (!match) throw new Error(`${agentName} missing developer_instructions`);

  if (!/read-only|Do not|Workspace-write mode requires/i.test(body)) {
    throw new Error(`${agentName} missing read-only or boundary instruction`);
  }
  if (/reviewer|researcher/.test(agentName)) {
    if (!/source references|cite sources|links/i.test(body)) {
      throw new Error(`${agentName} must require source references`);
    }
    if (!/recursiv(e|ely) delegat/i.test(body)) {
      throw new Error(`${agentName} must prohibit recursive delegation`);
    }
  }
  return match[1].trim();
}

function resolvePrompt(input) {
  if (!input) usage();
  const candidate = path.resolve(root, input);
  return fs.existsSync(candidate) ? fs.readFileSync(candidate, 'utf8') : input;
}

const agentName = readArg('--agent');
const promptInput = readArg('--prompt');
const outPath = readArg('--out');

if (!agentName || !promptInput || !outPath) usage();
if (!allowedAgents.has(agentName)) {
  console.error(`Unsupported agent: ${agentName}`);
  process.exit(2);
}

const instructions = readAgentInstructions(agentName);
const prompt = resolvePrompt(promptInput);
const outputPath = path.resolve(root, outPath);
fs.mkdirSync(path.dirname(outputPath), { recursive: true });

const reviewPrompt = [
  `Agent: ${agentName}`,
  '',
  'Agent instructions:',
  instructions,
  '',
  'Additional constraints:',
  '- Operate read-only.',
  '- Include source references for findings and claims.',
  '- Do not perform recursive delegation.',
  '- Do not modify files, run mutating commands, or approve failed gates.',
  '',
  'Review request:',
  prompt,
].join('\n');

const run = spawnSync('codex', [
  '-a',
  'never',
  'exec',
  '-m',
  'gpt-5.5',
  '-c',
  'model_reasoning_effort="high"',
  '-s',
  'read-only',
  '-C',
  root,
  '--output-last-message',
  outputPath,
  '-',
], {
  input: reviewPrompt,
  encoding: 'utf8',
  stdio: ['pipe', 'inherit', 'inherit'],
});

process.exit(run.status ?? 1);
