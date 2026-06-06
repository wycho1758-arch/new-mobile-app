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
  const raw = JSON.stringify(input);
  const matches = raw.match(/[\w./-]+/g) || [];
  return matches.filter((value) => value.includes('/'));
}
