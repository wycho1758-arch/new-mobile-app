export const secretPatterns = [
  { name: 'openai-api-key', pattern: /\bsk-[A-Za-z0-9_-]{20,}\b/ },
  { name: 'github-token', pattern: /\bgh[pousr]_[A-Za-z0-9_]{20,}\b/ },
  { name: 'slack-token', pattern: /\bxox[baprs]-[A-Za-z0-9-]{20,}\b/ },
  { name: 'jwt', pattern: /\beyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]{20,}\b/ },
  { name: 'database-url', pattern: /DATABASE_URL\s*=\s*["']?(postgres|mysql):\/\/(?!.*(example|placeholder|localhost|test))/i },
  { name: 'api-bearer-token', pattern: /API_BEARER_TOKEN\s*=\s*["']?(?!test|placeholder|example)[A-Za-z0-9_.-]{12,}/i },
];

export function findSecretLikeValues(body) {
  const matches = [];
  const lines = String(body || '').split(/\r?\n/);
  for (const [index, line] of lines.entries()) {
    for (const { name, pattern } of secretPatterns) {
      if (pattern.test(line)) {
        matches.push({ line: index + 1, pattern: name });
      }
    }
  }
  return matches;
}
