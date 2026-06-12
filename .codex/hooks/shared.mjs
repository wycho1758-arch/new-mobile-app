export async function readStdinJson() {
  const chunks = [];
  for await (const chunk of process.stdin) chunks.push(chunk);
  const raw = Buffer.concat(chunks).toString('utf8').trim();
  if (!raw) return {};
  try {
    return JSON.parse(raw);
  } catch {
    return { malformedInput: raw };
  }
}

export function writeJson(value) {
  process.stdout.write(`${JSON.stringify(value)}\n`);
}

export function changedPathHints(input) {
  const hints = new Set();
  const toolName = String(input.tool_name ?? input.toolName ?? '').toLowerCase();
  const toolInput = input.tool_input ?? input.toolInput ?? {};

  function add(value) {
    if (typeof value === 'string' && value.includes('/')) hints.add(value);
  }

  function collectPathFields(value, key = '') {
    if (typeof value === 'string') {
      if (/^(path|file|filename|target|uri)$/i.test(key) || /path$/i.test(key)) add(value);
      return;
    }
    if (Array.isArray(value)) {
      for (const item of value) collectPathFields(item, key);
      return;
    }
    if (value && typeof value === 'object') {
      for (const [childKey, childValue] of Object.entries(value)) collectPathFields(childValue, childKey);
    }
  }

  collectPathFields(toolInput);

  const patchText = typeof toolInput === 'string' ? toolInput : String(toolInput.patch ?? input.patch ?? '');
  if (toolName.includes('apply_patch') || patchText.includes('*** Begin Patch')) {
    for (const match of patchText.matchAll(/^\*\*\* (?:Add|Update|Delete) File: (.+)$/gm)) add(match[1]);
    for (const match of patchText.matchAll(/^\*\*\* Move to: (.+)$/gm)) add(match[1]);
  }

  const command = String(toolInput.command ?? toolInput.cmd ?? input.command ?? '');
  const mutates = /\b(rm|mv|cp|mkdir|touch|tee)\b|(?:sed|perl)\s+-i|\bpnpm\s+(?:install|add|remove)|\b(?:npm|yarn)\s+(?:install|add|remove|update)\b/.test(command);
  if (mutates) {
    for (const match of command.matchAll(/(?:^|\s)([\w./-]+\/[\w./-]+)/g)) add(match[1]);
  }

  return [...hints];
}
