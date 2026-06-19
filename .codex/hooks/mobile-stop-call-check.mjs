#!/usr/bin/env node
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import readline from 'node:readline';
import { readStdinJson, writeJson } from './shared.mjs';

const input = await readStdinJson();
loadLocalCompletionDmEnv();
const callCheckEnabled = process.env.WM_STOP_CALL_CHECK_ENABLE === '1';
const completionDmEnabled = process.env.WM_STOP_COMPLETION_DM_ENABLE === '1';

if (!callCheckEnabled && !completionDmEnabled) {
  writeJson({ continue: true });
  process.exit(0);
}

const timeoutSeconds = Number.parseInt(process.env.WM_STOP_CALL_CHECK_TIMEOUT_SECONDS ?? '10', 10);
const timeoutMs = Number.isFinite(timeoutSeconds) && timeoutSeconds > 0 ? timeoutSeconds * 1000 : 10_000;
const httpUrl = process.env.WM_STOP_CALL_CHECK_HTTP_URL ?? '';
const mcpTool = process.env.WM_STOP_CALL_CHECK_MCP_TOOL ?? '';

if (callCheckEnabled && !completionDmEnabled && !httpUrl && !mcpTool) {
  writeJson({
    continue: true,
    systemMessage: 'Stop call check skipped: no WM_STOP_CALL_CHECK_HTTP_URL or WM_STOP_CALL_CHECK_MCP_TOOL configured.',
  });
  process.exit(0);
}

const checks = [];

try {
  if (callCheckEnabled) {
    if (httpUrl) checks.push(await runCurlCheck(httpUrl, timeoutSeconds));
    if (mcpTool) checks.push(await runMcpToolCall(mcpTool, timeoutMs));
  }
  if (completionDmEnabled) checks.push(await sendCompletionDm(input, timeoutMs));

  writeJson({
    continue: true,
    systemMessage: `Stop call check passed: ${checks.join('; ')}.`,
  });
} catch (error) {
  writeJson({
    decision: 'block',
    reason: `Stop call check failed: ${error instanceof Error ? error.message : String(error)}`,
  });
}

async function sendCompletionDm(hookInput, timeout) {
  const role = completionDmRole();
  const allowedRoles = new Set(['spring', 'sohee', 'jihoon', 'seulgi', 'hyunwoo', 'sarah']);
  if (!allowedRoles.has(role)) {
    throw new Error(`completion DM role must be one of ${[...allowedRoles].join(', ')}`);
  }

  const taskId = firstNonEmpty(process.env.WM_STOP_COMPLETION_DM_TASK_ID, process.env.WM_TASK_ID, hookInput.task_id);
  const runId = firstNonEmpty(process.env.WM_STOP_COMPLETION_DM_RUN_ID, process.env.CODEX_RUN_ID, hookInput.run_id, hookInput.session_id);
  if (!taskId && !runId) throw new Error('completion DM requires WM_STOP_COMPLETION_DM_TASK_ID or WM_STOP_COMPLETION_DM_RUN_ID');

  const content = completionDmContent({
    role,
    taskId: taskId || 'not-set',
    runId: runId || 'not-set',
    completion: String(hookInput.last_assistant_message ?? '').trim(),
    runbook: completionRunbook(),
  });

  if (process.env.WM_STOP_COMPLETION_DM_DRY_RUN === '1') {
    return `completion DM dry-run prepared for ${role} task=${taskId || 'not-set'} run=${runId || 'not-set'}`;
  }

  const endpoint = process.env.WM_STOP_COMPLETION_DM_ENDPOINT ?? 'http://admin-api:3000/internal/messages';
  const roomId = process.env.WM_STOP_COMPLETION_DM_ROOM_ID ?? '';
  const gatewayToken = process.env.WM_STOP_COMPLETION_DM_GATEWAY_TOKEN ?? process.env.GATEWAY_TOKEN ?? '';
  const fromAgentId = process.env.WM_STOP_COMPLETION_DM_FROM_AGENT_ID ?? process.env.AGENT_ID ?? '';

  if (!roomId || !/^\d+$/.test(roomId)) throw new Error('completion DM requires numeric WM_STOP_COMPLETION_DM_ROOM_ID');
  if (!gatewayToken) throw new Error('completion DM requires gateway token in inherited hook environment');
  if (!fromAgentId) throw new Error('completion DM requires WM_STOP_COMPLETION_DM_FROM_AGENT_ID or AGENT_ID');

  await postCompletionDm(endpoint, gatewayToken, { from_agent_id: fromAgentId, room_id: Number(roomId), content }, timeout);
  return `completion DM delivered to configured ${role} direct room`;
}

function runCurlCheck(url, timeout) {
  let parsed;
  try {
    parsed = new URL(url);
  } catch {
    throw new Error(`invalid WM_STOP_CALL_CHECK_HTTP_URL: ${url}`);
  }

  if (!['http:', 'https:'].includes(parsed.protocol)) {
    throw new Error('WM_STOP_CALL_CHECK_HTTP_URL must use http or https');
  }

  return new Promise((resolve, reject) => {
    const child = spawn('curl', ['-fsS', '-o', '/dev/null', '-w', '%{http_code}', '--max-time', String(timeout), url], {
      stdio: ['ignore', 'pipe', 'pipe'],
    });
    const stdout = [];
    const stderr = [];
    child.stdout.on('data', (chunk) => stdout.push(chunk.toString('utf8')));
    child.stderr.on('data', (chunk) => stderr.push(chunk.toString('utf8')));
    child.on('error', reject);
    child.on('exit', (code) => {
      const body = stdout.join('').trim();
      if (code === 0) {
        resolve(`curl ${safeUrlForLog(url)} returned ${body}`);
      } else {
        const detail = [stderr.join(''), body].filter(Boolean).join(' ').trim();
        reject(new Error(`curl ${safeUrlForLog(url)} failed${detail ? `: ${detail}` : ''}`));
      }
    });
  });
}

async function postCompletionDm(endpoint, gatewayToken, payload, timeout) {
  let parsed;
  try {
    parsed = new URL(endpoint);
  } catch {
    throw new Error(`invalid WM_STOP_COMPLETION_DM_ENDPOINT: ${endpoint}`);
  }
  if (!['http:', 'https:'].includes(parsed.protocol)) {
    throw new Error('WM_STOP_COMPLETION_DM_ENDPOINT must use http or https');
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Gateway-Token': gatewayToken,
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
    if (!response.ok) {
      throw new Error(`completion DM POST ${safeUrlForLog(endpoint)} returned HTTP ${response.status}`);
    }
  } catch (error) {
    if (error?.name === 'AbortError') throw new Error(`completion DM POST ${safeUrlForLog(endpoint)} timed out`);
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}

function completionDmRole() {
  const explicit = firstNonEmpty(process.env.WM_STOP_COMPLETION_DM_ROLE, process.env.WM_ROLE);
  if (explicit) return explicit.toLowerCase();
  const agentId = firstNonEmpty(process.env.AGENT_ID, '');
  return String(agentId).split('-')[0].toLowerCase();
}

function displayRoleName(role) {
  return role.charAt(0).toUpperCase() + role.slice(1);
}

function completionDmContent({ role, taskId, runId, completion, runbook }) {
  const safeCompletion = completion ? completion.slice(0, 1200) : 'No final assistant message was provided by the Stop hook input.';
  return [
    `[Codex Stop Hook] ${displayRoleName(role)} pod 작업 완료 알림`,
    '',
    `Task/run identifier: task=${taskId}; run=${runId}`,
    '',
    'Completion summary:',
    safeCompletion,
    '',
    'Next-step runbook:',
    ...runbook.map((step, index) => `${index + 1}. ${step}`),
  ].join('\n');
}

function completionRunbook() {
  const configured = parseJsonArrayEnv('WM_STOP_COMPLETION_DM_RUNBOOK_JSON');
  if (configured?.length) return configured;
  return [
    'Record command evidence and changed paths in the owning Task or Workboard card.',
    'Hand off to the next responsible role only after local validation evidence is attached.',
    'Keep human-gated, live, external, production, and secret-bearing actions blocked until explicitly approved.',
  ];
}

async function runMcpToolCall(toolName, timeout) {
  const command = process.env.WM_STOP_CALL_CHECK_MCP_COMMAND ?? readMcpServerConfig().command;
  const args = parseJsonArrayEnv('WM_STOP_CALL_CHECK_MCP_ARGS_JSON') ?? readMcpServerConfig().args;
  const toolArgs = parseJsonObjectEnv('WM_STOP_CALL_CHECK_MCP_TOOL_ARGS_JSON') ?? {};

  if (!command) throw new Error('missing MCP command; set WM_STOP_CALL_CHECK_MCP_COMMAND or .codex/config.toml server config');

  const child = spawn(command, args, {
    cwd: process.cwd(),
    stdio: ['pipe', 'pipe', 'pipe'],
    env: mcpChildEnv(),
  });

  const stderr = [];
  child.stderr.on('data', (chunk) => stderr.push(chunk.toString('utf8')));
  const childError = new Promise((_, reject) => {
    child.once('error', reject);
  });

  const rl = readline.createInterface({ input: child.stdout, crlfDelay: Infinity });
  const pending = new Map();

  rl.on('line', (line) => {
    if (!line.trim()) return;
    let message;
    try {
      message = JSON.parse(line);
    } catch {
      return;
    }
    if (message.id !== undefined && pending.has(message.id)) {
      const { resolve, reject } = pending.get(message.id);
      pending.delete(message.id);
      if (message.error) reject(new Error(JSON.stringify(message.error)));
      else resolve(message.result);
    }
  });

  child.on('exit', (code) => {
    for (const { reject } of pending.values()) reject(new Error(`MCP server exited with code ${code}`));
    pending.clear();
  });

  let nextId = 1;
  const request = (method, params) => {
    const id = nextId;
    nextId += 1;
    child.stdin.write(`${JSON.stringify({ jsonrpc: '2.0', id, method, params })}\n`);
    return new Promise((resolve, reject) => pending.set(id, { resolve, reject }));
  };
  const notify = (method, params) => {
    child.stdin.write(`${JSON.stringify({ jsonrpc: '2.0', method, params })}\n`);
  };

  try {
    await withTimeout(
      Promise.race([
        request('initialize', {
          protocolVersion: '2025-06-18',
          capabilities: {},
          clientInfo: { name: 'wm-stop-call-check', version: '0.0.0' },
        }),
        childError,
      ]),
      timeout,
      'MCP initialize timed out',
    );
    notify('notifications/initialized', {});
    await withTimeout(
      Promise.race([request('tools/call', { name: toolName, arguments: toolArgs }), childError]),
      timeout,
      `MCP tool ${toolName} timed out`,
    );
    return `MCP tool ${toolName} returned result`;
  } catch (error) {
    const detail = stderr.join('').trim();
    throw new Error(`${error instanceof Error ? error.message : String(error)}${detail ? `; stderr: ${detail}` : ''}`);
  } finally {
    child.kill('SIGTERM');
  }
}

function readMcpServerConfig() {
  const serverName = process.env.WM_STOP_CALL_CHECK_MCP_SERVER ?? 'mobile-mcp';
  const configPath = path.join(process.cwd(), '.codex/config.toml');
  if (!fs.existsSync(configPath)) return {};

  const config = fs.readFileSync(configPath, 'utf8');
  const tableMatch = config.match(new RegExp(`\\[mcp_servers\\.${escapeRegExp(serverName)}\\]([\\s\\S]*?)(?:\\n\\[|$)`));
  if (!tableMatch) return {};

  const table = tableMatch[1];
  const command = table.match(/^\s*command\s*=\s*"([^"]+)"/m)?.[1];
  const argsMatch = table.match(/^\s*args\s*=\s*(\[[^\n]+\])/m)?.[1];
  return {
    command,
    args: argsMatch ? JSON.parse(argsMatch) : [],
  };
}

function parseJsonArrayEnv(name) {
  if (!process.env[name]) return null;
  const parsed = JSON.parse(process.env[name]);
  if (!Array.isArray(parsed) || !parsed.every((value) => typeof value === 'string')) {
    throw new Error(`${name} must be a JSON array of strings`);
  }
  return parsed;
}

function parseJsonObjectEnv(name) {
  if (!process.env[name]) return null;
  const parsed = JSON.parse(process.env[name]);
  if (!parsed || Array.isArray(parsed) || typeof parsed !== 'object') {
    throw new Error(`${name} must be a JSON object`);
  }
  return parsed;
}

function loadLocalCompletionDmEnv() {
  const envPath = process.env.WM_STOP_COMPLETION_DM_CONFIG_PATH ?? path.join(process.cwd(), '.codex/hooks/stop-completion-dm.env');
  if (!fs.existsSync(envPath)) return;

  const allowedName = /^WM_STOP_COMPLETION_DM_[A-Z0-9_]+$/;
  for (const rawLine of fs.readFileSync(envPath, 'utf8').split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) continue;
    const match = line.match(/^(?:export\s+)?([A-Z0-9_]+)=(.*)$/);
    if (!match) continue;
    const [, name, rawValue] = match;
    if (!allowedName.test(name) || process.env[name] !== undefined) continue;
    process.env[name] = parseLocalEnvValue(rawValue);
  }
}

function parseLocalEnvValue(rawValue) {
  const value = rawValue.trim();
  if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
    return value.slice(1, -1);
  }
  return value;
}

function firstNonEmpty(...values) {
  return values.find((value) => typeof value === 'string' && value.trim())?.trim() ?? '';
}

function mcpChildEnv() {
  if (process.env.WM_STOP_CALL_CHECK_MCP_INHERIT_ENV === '1') return process.env;

  return Object.fromEntries(
    ['PATH', 'HOME', 'USER', 'TMPDIR', 'TEMP', 'TMP', 'SystemRoot', 'ComSpec']
      .map((name) => [name, process.env[name]])
      .filter(([, value]) => typeof value === 'string'),
  );
}

function withTimeout(promise, timeout, message) {
  let timeoutId;
  const timeoutPromise = new Promise((_, reject) => {
    timeoutId = setTimeout(() => reject(new Error(message)), timeout);
  });
  return Promise.race([promise, timeoutPromise]).finally(() => clearTimeout(timeoutId));
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function safeUrlForLog(url) {
  const parsed = new URL(url);
  parsed.username = '';
  parsed.password = '';
  parsed.search = '';
  parsed.hash = '';
  return parsed.toString();
}
