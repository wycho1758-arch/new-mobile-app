import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

export const DEFAULT_CODEX_CANDIDATES = {
  darwin: ['/opt/homebrew/bin/codex', '/usr/local/bin/codex'],
  linux: ['/usr/local/bin/codex', '/usr/bin/codex', '/home/linuxbrew/.linuxbrew/bin/codex'],
  win32: [],
};

export function unique(items) {
  return [...new Set(items.filter(Boolean))];
}

export function runCommand(command, args, options = {}) {
  const result = spawnSync(command, args, {
    cwd: options.cwd,
    encoding: 'utf8',
    timeout: options.timeoutMs || 30000,
    shell: options.shell || false,
  });

  return {
    status: result.status ?? 1,
    stdout: result.stdout || '',
    stderr: result.stderr || '',
    error: result.error?.message || '',
  };
}

export function normalizeArch(value) {
  const normalized = String(value || '').trim().toLowerCase();
  if (['arm64', 'aarch64'].includes(normalized)) return 'arm64';
  if (['x64', 'x86_64', 'amd64'].includes(normalized)) return 'x64';
  return normalized || 'unknown';
}

export function hostArch(platform = process.platform) {
  if (platform === 'darwin') {
    const arm64Capable = runCommand('sysctl', ['-n', 'hw.optional.arm64']);
    if (arm64Capable.status === 0 && arm64Capable.stdout.trim() === '1') return 'arm64';
  }
  if (typeof os.machine === 'function') {
    const machine = os.machine();
    if (machine) return normalizeArch(machine);
  }
  return normalizeArch(process.arch);
}

export function fileArchSet(fileOutput) {
  const output = String(fileOutput || '').toLowerCase();
  const arches = new Set();
  if (/\barm64\b|\baarch64\b/.test(output)) arches.add('arm64');
  if (/\bx86_64\b|\bamd64\b|\bx64\b/.test(output)) arches.add('x64');
  return arches;
}

export function fileMatchesHostArch(fileOutput, machine) {
  const candidateArches = fileArchSet(fileOutput);
  if (!candidateArches.size) return true;
  const normalizedHost = normalizeArch(machine);
  if (normalizedHost === 'unknown') return true;
  return candidateArches.has(normalizedHost);
}

export function pathEntries(env = process.env, platform = process.platform) {
  const pathKey = Object.keys(env).find((key) => key.toLowerCase() === 'path') || 'PATH';
  const raw = env[pathKey] || '';
  return raw.split(path.delimiter).filter(Boolean);
}

export function pathextEntries(env = process.env) {
  return (env.PATHEXT || '.EXE;.CMD;.BAT;.COM')
    .split(';')
    .map((entry) => entry.trim().toLowerCase())
    .filter(Boolean);
}

export function platformDefaultCandidates(platform = process.platform) {
  return DEFAULT_CODEX_CANDIDATES[platform] || [];
}

export function pathCandidates(options = {}) {
  const env = options.env || process.env;
  const platform = options.platform || process.platform;
  const entries = options.pathEntries || pathEntries(env, platform);

  if (platform === 'win32') {
    const extensions = ['', ...pathextEntries(env)];
    const names = ['codex.exe', 'codex.cmd', 'codex.bat', 'codex'];
    const candidates = [];
    for (const dir of entries) {
      for (const name of names) {
        const parsed = path.win32.parse(name);
        if (parsed.ext) candidates.push(path.win32.join(dir, name));
        else for (const ext of extensions) candidates.push(path.win32.join(dir, `${name}${ext}`));
      }
    }
    return unique(candidates);
  }

  return unique(entries.map((dir) => path.join(dir, 'codex')));
}

export function candidatePaths(options = {}) {
  const env = options.env || process.env;
  const platform = options.platform || process.platform;
  return unique([
    env.CODEX_BIN,
    ...platformDefaultCandidates(platform),
    ...pathCandidates({ env, platform, pathEntries: options.pathEntries }),
  ]);
}

export function executableDescriptor(candidatePath, platform = process.platform) {
  if (platform === 'win32' && /\.(cmd|bat)$/i.test(candidatePath)) {
    return {
      command: candidatePath,
      argsPrefix: [],
      path: candidatePath,
      shell: true,
    };
  }

  return {
    command: candidatePath,
    argsPrefix: [],
    path: candidatePath,
  };
}

export function createActualCodexResolver(options = {}) {
  const platform = options.platform || process.platform;
  return {
    platform: () => platform,
    hostArch: () => options.hostArch || hostArch(platform),
    candidatePaths: (env = process.env) => candidatePaths({ env, platform }),
    probeCandidate: (candidatePath, machine) => {
      let exists = false;
      let executable = false;
      try {
        const stat = fs.statSync(candidatePath);
        exists = true;
        executable = platform === 'win32' || Boolean(stat.mode & 0o111);
      } catch {
        exists = false;
        executable = false;
      }

      const fileOutput = exists && platform !== 'win32'
        ? runCommand('file', [candidatePath]).stdout.trim()
        : '';

      const baseProbe = {
        path: candidatePath,
        exists,
        executable,
        fileOutput,
      };

      if (!exists || !executable || !fileMatchesHostArch(fileOutput, machine)) {
        return {
          ...baseProbe,
          version: { status: null, stdout: '', stderr: 'not executed before path or arch validation' },
          execHelp: { status: null, stdout: '', stderr: 'not executed before path or arch validation' },
        };
      }

      const descriptor = executableDescriptor(candidatePath, platform);
      return {
        ...baseProbe,
        descriptor,
        version: runCommand(descriptor.command, [...descriptor.argsPrefix, '--version'], { shell: descriptor.shell }),
        execHelp: runCommand(descriptor.command, [...descriptor.argsPrefix, 'exec', '--help'], { shell: descriptor.shell }),
      };
    },
  };
}

export function createFixtureCodexResolver(fixture) {
  const platform = fixture.platform || 'darwin';
  const byPath = new Map((fixture.candidates || []).map((candidate) => [candidate.path, candidate]));
  return {
    platform: () => platform,
    hostArch: () => normalizeArch(fixture.unameMachine),
    candidatePaths: (env = fixture.env || {}) => fixture.candidatePaths || candidatePaths({
      env,
      platform,
      pathEntries: fixture.pathEntries,
    }),
    probeCandidate: (candidatePath) => {
      const candidate = byPath.get(candidatePath);
      if (!candidate) {
        return {
          path: candidatePath,
          exists: false,
          executable: false,
          fileOutput: '',
          version: { status: 1, stdout: '', stderr: 'missing fixture candidate' },
          execHelp: { status: 1, stdout: '', stderr: 'missing fixture candidate' },
        };
      }
      return {
        descriptor: executableDescriptor(candidate.path, platform),
        ...candidate,
      };
    },
  };
}

export function rejection(reason, candidate, detail = {}) {
  return {
    path: candidate.path,
    accepted: false,
    reason,
    fileArches: [...fileArchSet(candidate.fileOutput || '')],
    ...detail,
  };
}

export function evaluateCodexCandidate(candidate, machine) {
  if (!candidate.exists) return rejection('missing', candidate);
  if (!candidate.executable) return rejection('not-executable', candidate);
  if (!fileMatchesHostArch(candidate.fileOutput, machine)) {
    return rejection('arch-mismatch', candidate, {
      hostArch: normalizeArch(machine),
      fileOutput: candidate.fileOutput,
    });
  }
  if (candidate.version.status !== 0) return rejection('version-failed', candidate, { stderr: candidate.version.stderr || candidate.version.error || '' });
  if (candidate.execHelp.status !== 0) return rejection('exec-help-failed', candidate, { stderr: candidate.execHelp.stderr || candidate.execHelp.error || '' });

  return {
    path: candidate.path,
    descriptor: candidate.descriptor || executableDescriptor(candidate.path),
    accepted: true,
    reason: 'accepted',
    fileArches: [...fileArchSet(candidate.fileOutput || '')],
    version: normalizeVersion(candidate.version.stdout),
  };
}

export function normalizeVersion(stdout) {
  return String(stdout || '').trim().split('\n')[0] || '';
}

export function selectCodexBinary(options = {}) {
  const env = options.env || process.env;
  const resolver = options.resolver || createActualCodexResolver(options);
  const machine = normalizeArch(options.hostArch || resolver.hostArch());
  const candidates = options.candidates || resolver.candidatePaths(env);
  const probes = [];
  let selected = null;

  for (const candidatePath of candidates) {
    const candidate = resolver.probeCandidate(candidatePath, machine);
    const evaluated = evaluateCodexCandidate(candidate, machine);
    if (evaluated.accepted && !selected) {
      selected = evaluated;
      probes.push(evaluated);
    } else if (evaluated.accepted) {
      probes.push({
        ...evaluated,
        accepted: false,
        reason: 'not-selected-first-valid',
      });
    } else {
      probes.push(evaluated);
    }
  }

  return {
    status: selected ? 'available' : 'skipped',
    reason: selected ? 'accepted' : 'no-valid-codex-binary',
    selected,
    acceptedPath: selected?.path || null,
    version: selected?.version || null,
    hostArch: machine,
    platform: resolver.platform(),
    probes,
  };
}

export function formatCodexSelectionFailure(selection) {
  const lines = [
    'No valid Codex binary found for headless review.',
    `platform: ${selection.platform}`,
    `hostArch: ${selection.hostArch}`,
    'candidates:',
  ];
  for (const probe of selection.probes) {
    lines.push(`- ${probe.path}: ${probe.reason}${probe.fileArches?.length ? ` (${probe.fileArches.join(',')})` : ''}`);
  }
  lines.push('Remediation: set CODEX_BIN to a native Codex binary, fix PATH order, or install the native Codex binary for this host.');
  return lines.join('\n');
}
