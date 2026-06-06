#!/usr/bin/env node
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const root = process.cwd();
const packageResult = spawnSync('node', ['scripts/package-openclaw-skills.mjs'], {
  cwd: root,
  encoding: 'utf8',
});

if (packageResult.status !== 0) {
  process.stderr.write(packageResult.stderr || packageResult.stdout);
  process.exit(packageResult.status ?? 1);
}

const generatedRoot = path.join(root, '.generated/openclaw-skill-packages');
const installRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'workspace-skills-'));
const workspaceSkills = path.join(installRoot, 'workspace/skills');
fs.mkdirSync(workspaceSkills, { recursive: true });

const slugs = fs.readdirSync(generatedRoot).filter((name) => fs.statSync(path.join(generatedRoot, name)).isDirectory());
const failures = [];

for (const slug of slugs) {
  const src = path.join(generatedRoot, slug);
  const dest = path.join(workspaceSkills, slug);
  fs.cpSync(src, dest, { recursive: true });
  if (!fs.existsSync(path.join(dest, 'SKILL.md'))) failures.push(`${slug}: missing SKILL.md after install simulation`);
  if (!dest.startsWith(workspaceSkills)) failures.push(`${slug}: escaped /workspace/skills simulation`);
}

if (failures.length) {
  console.error(failures.map((failure) => `- ${failure}`).join('\n'));
  process.exit(1);
}

console.log(`Simulated OpenClaw install for ${slugs.length} skills under /workspace/skills/<slug>.`);
