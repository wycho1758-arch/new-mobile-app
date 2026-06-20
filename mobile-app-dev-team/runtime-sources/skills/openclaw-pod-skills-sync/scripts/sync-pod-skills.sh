#!/usr/bin/env bash
set -euo pipefail

REPO_PATH="${OPENCLAW_POD_SKILLS_REPO_PATH:-/workspace/projects/Wondermove-Inc/new-mobile-app}"
SOURCE_ROOT="${OPENCLAW_POD_SKILLS_SOURCE_ROOT:-${REPO_PATH%/}/mobile-app-dev-team/runtime-sources/skills}"
SKILLS_ROOT="${OPENCLAW_POD_SKILLS_ROOT:-/workspace/skills}"
CANDIDATE_ROOT="${OPENCLAW_POD_SKILLS_CANDIDATE_ROOT:-${REPO_PATH%/}/mobile-app-dev-team/runtime-sources/skills-candidate}"
LEGACY_SOURCE_ROOT="${OPENCLAW_POD_SKILLS_LEGACY_SOURCE_ROOT:-${REPO_PATH%/}/mobile-app-dev-team/runtime-sources/pod-native-openclaw-skills}"
WORKSPACE_AGENTS_PATH="${OPENCLAW_WORKSPACE_AGENTS_PATH:-/workspace/AGENTS.md}"
WORKSPACE_WORKFLOW_PATH="${OPENCLAW_WORKSPACE_WORKFLOW_PATH:-/workspace/WORKFLOW.md}"
WORKSPACE_HEARTBEAT_PATH="${OPENCLAW_WORKSPACE_HEARTBEAT_PATH:-/workspace/HEARTBEAT.md}"
WORKSPACE_TOOLS_PATH="${OPENCLAW_WORKSPACE_TOOLS_PATH:-/workspace/TOOLS.md}"
CODEX_HOOK_SOURCE_PATH="${OPENCLAW_CODEX_RUN_SOURCE_PATH:-${SOURCE_ROOT%/}/codex-interactive-repo-work/scripts/codex-run}"
CODEX_HOOKS_ROOT="${OPENCLAW_CODEX_HOOKS_ROOT:-/workspace/codex-hooks}"
CODEX_RUN_TARGET_PATH="${OPENCLAW_CODEX_RUN_TARGET_PATH:-${CODEX_HOOKS_ROOT%/}/codex-run}"
ORGANIZATIONS_SOURCE_PATH="${OPENCLAW_ORGANIZATIONS_SOURCE_PATH:-${REPO_PATH%/}/mobile-app-dev-team/runtime-sources/organizations/ORGANIZATIONS.md}"
WORKSPACE_ORGANIZATIONS_PATH="${OPENCLAW_WORKSPACE_ORGANIZATIONS_PATH:-/workspace/ORGANIZATIONS.md}"
ROLE_SLUG="${OPENCLAW_ROLE_SLUG:-${PROJECT_BOOTSTRAP_ROLE_SLUG:-${WM_ROLE:-}}}"
EXPECTED_ROLE_SLUG="${OPENCLAW_EXPECTED_ROLE_SLUG:-${EXPECTED_WM_ROLE:-${WM_EXPECTED_ROLE:-}}}"
REPORT_PATH="${OPENCLAW_POD_SKILLS_SYNC_REPORT_PATH:-${REPORT_PATH:-/workspace/state/openclaw-pod-skills-sync-report.json}}"
MODE="copy"
SOURCE_AUTHORITY="repo_sot"
RUNTIME_TARGET="runtime_snapshot"

redact() {
  sed -E 's/(token|key|secret|password|credential)([=: ][^ ]+)/\1=***REDACTED***/Ig'
}

node - \
  "${REPO_PATH}" \
  "${SOURCE_ROOT}" \
  "${SKILLS_ROOT}" \
  "${CANDIDATE_ROOT}" \
  "${LEGACY_SOURCE_ROOT}" \
  "${WORKSPACE_AGENTS_PATH}" \
  "${WORKSPACE_WORKFLOW_PATH}" \
  "${WORKSPACE_HEARTBEAT_PATH}" \
  "${WORKSPACE_TOOLS_PATH}" \
  "${CODEX_HOOK_SOURCE_PATH}" \
  "${CODEX_RUN_TARGET_PATH}" \
  "${ORGANIZATIONS_SOURCE_PATH}" \
  "${WORKSPACE_ORGANIZATIONS_PATH}" \
  "${ROLE_SLUG}" \
  "${EXPECTED_ROLE_SLUG}" \
  "${REPORT_PATH}" \
  "${MODE}" \
  "${SOURCE_AUTHORITY}" \
  "${RUNTIME_TARGET}" <<'NODE' 2> >(redact >&2)
const crypto = require('node:crypto');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const [
  repoPath,
  sourceRoot,
  skillsRoot,
  candidateRoot,
  legacySourceRoot,
  workspaceAgentsPath,
  workspaceWorkflowPath,
  workspaceHeartbeatPath,
  workspaceToolsPath,
  codexHookSourcePath,
  codexRunTargetPath,
  organizationsSourcePath,
  workspaceOrganizationsPath,
  roleSlugRaw,
  expectedRoleSlugRaw,
  reportPath,
  mode,
  sourceAuthority,
  runtimeTarget,
] = process.argv.slice(2);

const schema = 'openclaw-pod-skills-sync/v2';
const roleMap = {
  'product-planning': {
    prefix: 'Product_Planning',
    display: 'Product/Planning',
    identifiers: ['Product Planning', 'Product/Planning'],
  },
  design: {
    prefix: 'Design',
    display: 'Design',
    identifiers: ['Design'],
  },
  'mobile-architect': {
    prefix: 'Mobile_Architect',
    display: 'Mobile Architect',
    identifiers: ['Mobile Architect'],
  },
  'mobile-app-dev': {
    prefix: 'Mobile_App_Dev',
    display: 'Mobile App Dev',
    identifiers: ['Mobile App Dev'],
  },
  'backend-api-integrator': {
    prefix: 'Backend_API_Integrator',
    display: 'Backend/API Integrator',
    identifiers: ['Backend/API Integrator', 'Backend API Integrator'],
  },
  'qa-release': {
    prefix: 'QA_Release',
    display: 'QA/Release',
    identifiers: ['QA/Release', 'QA Release'],
  },
};

const roleTargets = [
  {
    kind: 'workspace_agents',
    sourcePath(prefix) {
      return path.join(repoPath, 'mobile-app-dev-team/runtime-sources/agents', `${prefix}_AGENTS.md`);
    },
    targetPath: workspaceAgentsPath,
  },
  {
    kind: 'workspace_workflow',
    sourcePath(prefix) {
      return path.join(repoPath, 'mobile-app-dev-team/runtime-sources/workflows', `${prefix}_WORKFLOW.md`);
    },
    targetPath: workspaceWorkflowPath,
  },
  {
    kind: 'workspace_heartbeat',
    sourcePath(prefix) {
      return path.join(repoPath, 'mobile-app-dev-team/runtime-sources/heartbeat', `${prefix}_HEARTBEAT.md`);
    },
    targetPath: workspaceHeartbeatPath,
  },
  {
    kind: 'workspace_tools',
    sourcePath(prefix) {
      return path.join(repoPath, 'mobile-app-dev-team/runtime-sources/tools', `${prefix}_TOOLS.md`);
    },
    targetPath: workspaceToolsPath,
  },
];

const report = {
  schema,
  status: 'completed',
  mode,
  source_authority: sourceAuthority,
  runtime_target: runtimeTarget,
  role: {
    slug: roleSlugRaw || null,
    expected_slug: expectedRoleSlugRaw || null,
    display: null,
    file_prefix: null,
    status: 'not_checked',
  },
  blockers: [],
  paths: {
    source_root: sourceRoot,
    candidate_root: candidateRoot,
    legacy_source_root: legacySourceRoot,
    runtime_root: skillsRoot,
    workspace_agents: workspaceAgentsPath,
    workspace_workflow: workspaceWorkflowPath,
    workspace_heartbeat: workspaceHeartbeatPath,
    workspace_tools: workspaceToolsPath,
    codex_run_source: codexHookSourcePath,
    codex_run_target: codexRunTargetPath,
    organizations_source: organizationsSourcePath,
    workspace_organizations: workspaceOrganizationsPath,
  },
  categories: {
    applied: [],
    skipped: [],
    missing: [],
    blocked: [],
    role_mismatch: [],
  },
  skills: {},
  workspace_operating_files: {},
  workspace_organizations: {
    status: 'not_checked',
    guidance_only: true,
  },
  codex_hooks: {
    codex_run: {
      status: 'not_checked',
      source_path: codexHookSourcePath,
      target_path: codexRunTargetPath,
    },
  },
};

function add(category, item) {
  report.categories[category].push(item);
}

function block(reason, extra = {}) {
  report.status = 'blocked';
  report.blockers.push(reason);
  add('blocked', { reason, ...extra });
}

function exists(value) {
  return fs.existsSync(value);
}

function isReadableFile(value) {
  try {
    const stat = fs.statSync(value);
    if (!stat.isFile()) return false;
    fs.accessSync(value, fs.constants.R_OK);
    return true;
  } catch {
    return false;
  }
}

function isReadableDir(value) {
  try {
    const stat = fs.statSync(value);
    if (!stat.isDirectory()) return false;
    fs.accessSync(value, fs.constants.R_OK | fs.constants.X_OK);
    return true;
  } catch {
    return false;
  }
}

function sha256(value) {
  const hash = crypto.createHash('sha256');
  hash.update(fs.readFileSync(value));
  return hash.digest('hex');
}

function firstLine(value) {
  try {
    return fs.readFileSync(value, 'utf8').split(/\r?\n/, 1)[0] ?? '';
  } catch {
    return '';
  }
}

function cmpFiles(left, right) {
  if (!isReadableFile(left) || !isReadableFile(right)) return false;
  return fs.readFileSync(left).equals(fs.readFileSync(right));
}

function scanRoleFile(value, resolvedRole) {
  const heading = firstLine(value);
  const positive = resolvedRole.identifiers.some((identifier) => heading.includes(identifier));
  const otherResidue = Object.values(roleMap)
    .filter((role) => role.prefix !== resolvedRole.prefix)
    .some((role) => role.identifiers.some((identifier) => heading.includes(identifier)));
  return {
    positive_role_identifier_scan: positive,
    negative_known_other_role_residue_scan: !otherResidue,
    scanned_heading: heading,
  };
}

function writeReport() {
  fs.mkdirSync(path.dirname(reportPath), { recursive: true });
  fs.writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`);
}

function fail() {
  writeReport();
  process.exitCode = 1;
}

function normalizeRole(slug) {
  return String(slug || '').trim().toLowerCase().replace(/_/g, '-');
}

const roleSlug = normalizeRole(roleSlugRaw);
const expectedRoleSlug = normalizeRole(expectedRoleSlugRaw);

if (exists(legacySourceRoot)) {
  block('legacy_path_seen', { path: legacySourceRoot });
}

if (normalizeRole(sourceRoot).includes('skills-candidate')) {
  block('candidate_path_ambiguity', { source_root: sourceRoot });
}

if (!exists(sourceRoot)) {
  block('missing source root', { path: sourceRoot });
} else if (!isReadableDir(sourceRoot)) {
  block('unreadable source root', { path: sourceRoot });
}

if (!roleSlug) {
  block('missing role slug');
} else if (!Object.hasOwn(roleMap, roleSlug)) {
  block('unknown role slug', { role_slug: roleSlugRaw });
}

if (roleSlug && expectedRoleSlug && roleSlug !== expectedRoleSlug) {
  report.role.status = 'role_mismatch';
  add('role_mismatch', {
    role_slug: roleSlug,
    expected_role_slug: expectedRoleSlug,
  });
  block('role mismatch', {
    role_slug: roleSlug,
    expected_role_slug: expectedRoleSlug,
  });
}

let resolvedRole = null;
if (Object.hasOwn(roleMap, roleSlug)) {
  resolvedRole = roleMap[roleSlug];
  report.role = {
    slug: roleSlug,
    expected_slug: expectedRoleSlug || null,
    display: resolvedRole.display,
    file_prefix: resolvedRole.prefix,
    status: report.role.status === 'role_mismatch' ? 'role_mismatch' : 'resolved',
  };
}

let sourceDirs = [];
if (isReadableDir(sourceRoot)) {
  sourceDirs = fs.readdirSync(sourceRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();
  if (sourceDirs.length === 0) {
    block('empty source root', { path: sourceRoot });
  }
  for (const slug of sourceDirs) {
    const skillPath = path.join(sourceRoot, slug, 'SKILL.md');
    if (!isReadableFile(skillPath)) {
      add('missing', {
        kind: 'skill_entrypoint',
        slug,
        source_path: skillPath,
      });
      block(`missing SKILL.md: ${slug}`, { slug, source_path: skillPath });
    }
  }
}

if (resolvedRole) {
  for (const target of roleTargets) {
    const sourcePath = target.sourcePath(resolvedRole.prefix);
    if (!exists(sourcePath)) {
      add('missing', {
        kind: target.kind,
        source_path: sourcePath,
        target_path: target.targetPath,
      });
      block(`missing role file: ${path.basename(sourcePath)}`, {
        kind: target.kind,
        source_path: sourcePath,
      });
    } else if (!isReadableFile(sourcePath)) {
      add('missing', {
        kind: target.kind,
        status: 'unreadable',
        source_path: sourcePath,
        target_path: target.targetPath,
      });
      block(`unreadable role file: ${path.basename(sourcePath)}`, {
        kind: target.kind,
        source_path: sourcePath,
      });
    } else {
      const scans = scanRoleFile(sourcePath, resolvedRole);
      if (!scans.positive_role_identifier_scan || !scans.negative_known_other_role_residue_scan) {
        const entry = {
          status: 'blocked',
          role_slug: roleSlug,
          role_display: resolvedRole.display,
          file_prefix: resolvedRole.prefix,
          source_path: sourcePath,
          target_path: target.targetPath,
          ...scans,
        };
        report.workspace_operating_files[target.kind] = entry;
        block(`role identifier scan failed: ${path.basename(sourcePath)}`, {
          kind: target.kind,
          ...entry,
        });
      }
    }
  }
}

if (!exists(codexHookSourcePath)) {
  add('missing', {
    kind: 'codex_hook_wrapper',
    name: 'codex_run',
    source_path: codexHookSourcePath,
    target_path: codexRunTargetPath,
  });
  block('missing codex hook wrapper: codex-run', {
    kind: 'codex_hook_wrapper',
    source_path: codexHookSourcePath,
  });
} else if (!isReadableFile(codexHookSourcePath)) {
  add('missing', {
    kind: 'codex_hook_wrapper',
    name: 'codex_run',
    status: 'unreadable',
    source_path: codexHookSourcePath,
    target_path: codexRunTargetPath,
  });
  block('unreadable codex hook wrapper: codex-run', {
    kind: 'codex_hook_wrapper',
    source_path: codexHookSourcePath,
  });
}

if (report.status === 'blocked') {
  fail();
  process.exit(1);
}

const tmpRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'openclaw-pod-skills-sync.'));
try {
  const stagedSkills = path.join(tmpRoot, 'skills');
  const stagedWorkspace = path.join(tmpRoot, 'workspace');
  const stagedHooks = path.join(tmpRoot, 'codex-hooks');
  fs.mkdirSync(stagedSkills, { recursive: true });
  fs.mkdirSync(stagedWorkspace, { recursive: true });
  fs.mkdirSync(stagedHooks, { recursive: true });

  for (const slug of sourceDirs) {
    const sourceDir = path.join(sourceRoot, slug);
    const stagedDir = path.join(stagedSkills, slug);
    const targetDir = path.join(skillsRoot, slug);
    fs.cpSync(sourceDir, stagedDir, { recursive: true, dereference: false });
    fs.rmSync(targetDir, { recursive: true, force: true });
    fs.mkdirSync(path.dirname(targetDir), { recursive: true });
    fs.cpSync(stagedDir, targetDir, { recursive: true, dereference: false });
    const sourceSkill = path.join(sourceDir, 'SKILL.md');
    const targetSkill = path.join(targetDir, 'SKILL.md');
    const entry = {
      status: 'applied',
      source_path: sourceDir,
      target_path: targetDir,
      sha256: sha256(sourceSkill),
      cmp: cmpFiles(sourceSkill, targetSkill),
    };
    report.skills[slug] = entry;
    add('applied', { kind: 'skill', slug, ...entry });
  }

  const stagedCodexRun = path.join(stagedHooks, 'codex-run');
  fs.cpSync(codexHookSourcePath, stagedCodexRun);
  fs.mkdirSync(path.dirname(codexRunTargetPath), { recursive: true });
  fs.cpSync(stagedCodexRun, codexRunTargetPath);
  fs.chmodSync(codexRunTargetPath, 0o755);
  report.codex_hooks.codex_run = {
    status: 'applied',
    source_path: codexHookSourcePath,
    target_path: codexRunTargetPath,
    sha256: sha256(codexHookSourcePath),
    cmp: cmpFiles(codexHookSourcePath, codexRunTargetPath),
  };
  add('applied', { kind: 'codex_hook_wrapper', name: 'codex_run', ...report.codex_hooks.codex_run });

  if (isReadableFile(organizationsSourcePath)) {
    const stagedPath = path.join(stagedWorkspace, 'ORGANIZATIONS.md');
    fs.cpSync(organizationsSourcePath, stagedPath);
    fs.mkdirSync(path.dirname(workspaceOrganizationsPath), { recursive: true });
    fs.cpSync(stagedPath, workspaceOrganizationsPath);
    report.workspace_organizations = {
      status: 'applied',
      guidance_only: true,
      source_path: organizationsSourcePath,
      target_path: workspaceOrganizationsPath,
      sha256: sha256(organizationsSourcePath),
      cmp: cmpFiles(organizationsSourcePath, workspaceOrganizationsPath),
    };
    add('applied', { kind: 'workspace_organizations', ...report.workspace_organizations });
  } else if (!exists(organizationsSourcePath)) {
    report.workspace_organizations = {
      status: 'missing',
      guidance_only: true,
      source_path: organizationsSourcePath,
      target_path: workspaceOrganizationsPath,
    };
    add('skipped', { kind: 'workspace_organizations', status: 'missing', source_path: organizationsSourcePath });
  } else {
    report.workspace_organizations = {
      status: 'unreadable',
      guidance_only: true,
      source_path: organizationsSourcePath,
      target_path: workspaceOrganizationsPath,
    };
    add('skipped', { kind: 'workspace_organizations', status: 'unreadable', source_path: organizationsSourcePath });
  }

  for (const target of roleTargets) {
    const sourcePath = target.sourcePath(resolvedRole.prefix);
    const stagedPath = path.join(stagedWorkspace, path.basename(target.targetPath));
    fs.cpSync(sourcePath, stagedPath);
    fs.mkdirSync(path.dirname(target.targetPath), { recursive: true });
    fs.cpSync(stagedPath, target.targetPath);
    const scans = scanRoleFile(sourcePath, resolvedRole);
    const entry = {
      status: 'applied',
      role_slug: roleSlug,
      role_display: resolvedRole.display,
      file_prefix: resolvedRole.prefix,
      source_path: sourcePath,
      target_path: target.targetPath,
      sha256: sha256(sourcePath),
      cmp: cmpFiles(sourcePath, target.targetPath),
      ...scans,
    };
    report.workspace_operating_files[target.kind] = entry;
    add('applied', { kind: target.kind, ...entry });
  }

  writeReport();
} finally {
  fs.rmSync(tmpRoot, { recursive: true, force: true });
}
NODE
