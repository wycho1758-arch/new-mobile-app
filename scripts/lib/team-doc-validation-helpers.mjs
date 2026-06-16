import fs from 'node:fs';
import path from 'node:path';
import { findSecretLikeValues } from './secret-patterns.mjs';

export const root = process.cwd();
export const teamRoot = 'mobile-app-dev-team';

export function exists(relativePath) {
  return fs.existsSync(path.join(root, relativePath));
}

export function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), 'utf8');
}

export function listFiles(baseDir, predicate = () => true) {
  const absoluteBase = path.join(root, baseDir);
  if (!fs.existsSync(absoluteBase)) return [];
  const out = [];
  const stack = [absoluteBase];
  while (stack.length) {
    const current = stack.pop();
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      const absolute = path.join(current, entry.name);
      if (entry.isDirectory()) {
        stack.push(absolute);
      } else {
        const relative = path.relative(root, absolute).replace(/\\/g, '/');
        if (predicate(relative)) out.push(relative);
      }
    }
  }
  return out.sort();
}

export function parseFrontmatter(body) {
  if (!body.startsWith('---\n')) return null;
  const end = body.indexOf('\n---\n', 4);
  if (end < 0) return null;
  const block = body.slice(4, end).trim();
  const data = {};
  for (const line of block.split('\n')) {
    const match = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (!match) continue;
    data[match[1]] = match[2].replace(/^"|"$/g, '');
  }
  return data;
}

export function requireTerms(errors, relativePath, terms, label = 'document') {
  if (!exists(relativePath)) {
    errors.push(`missing required ${label}: ${relativePath}`);
    return;
  }
  const body = read(relativePath);
  for (const term of terms) {
    if (!body.includes(term)) {
      errors.push(`${relativePath} missing required ${label} term: ${term}`);
    }
  }
}

export function forbidTerms(errors, relativePath, terms, label = 'document') {
  if (!exists(relativePath)) {
    errors.push(`missing required ${label}: ${relativePath}`);
    return;
  }
  const body = read(relativePath);
  for (const term of terms) {
    if (body.includes(term)) {
      errors.push(`${relativePath} includes forbidden ${label} term: ${term}`);
    }
  }
}

export function requireOrderedHeadings(errors, relativePath, headings) {
  if (!exists(relativePath)) {
    errors.push(`missing required runtime SOUL document: ${relativePath}`);
    return;
  }

  const actualHeadings = read(relativePath)
    .split('\n')
    .filter((line) => /^#{1,2} /.test(line))
    .map((line) => line.trim());

  let start = 0;
  for (const expected of headings) {
    const index = actualHeadings.indexOf(expected, start);
    if (index < 0) {
      errors.push(`${relativePath} missing ordered runtime SOUL heading: ${expected}`);
      return;
    }
    start = index + 1;
  }
}

export function scanSecrets(errors, baseDir, predicate = (file) => /\.(md|json|sh)$/.test(file)) {
  for (const file of listFiles(baseDir, predicate)) {
    const body = read(file);
    for (const match of findSecretLikeValues(body)) {
      errors.push(`probable secret or concrete credential in ${file}:${match.line}`);
    }
  }
}

export function finish(errors, message) {
  if (errors.length) {
    console.error(errors.map((error) => `- ${error}`).join('\n'));
    process.exit(1);
  }
  console.log(message);
}

export const roleSoulRuntimeHeadings = [
  '## Identity',
  '## Responsibilities',
  '## Skills',
  '## Communication Style',
  '## Decision Making',
  '## Boundaries',
  '## Goals',
  '## Working Principles',
  '## Security Policy',
  '## Sub-Agent & Background Delegation (Mandatory)',
];
