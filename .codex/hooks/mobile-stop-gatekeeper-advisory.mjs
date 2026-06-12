#!/usr/bin/env node
import { readStdinJson, writeJson } from './shared.mjs';

const input = await readStdinJson();
const finalMessage = String(input.last_assistant_message ?? input.transcript ?? '');

const claimsCompletedMobileWork =
  /\b(implemented|added|created|updated|changed|fixed|removed|deleted|installed|upgraded|downgraded|configured|migrated|replaced|moved|renamed|refactored|documented|cleaned|complete|completed|done|reviewed|finished|shipped|ready)\b/i.test(finalMessage) ||
  /(완료|수정|변경|제거|삭제|추가|생성|설치|업그레이드|다운그레이드|적용|구성|마이그레이션|교체|이동|정리|문서화)/.test(finalMessage);

const includesVerification =
  /\b(pnpm|jest|lint|test|turbo|expo install --check|expo-doctor|doctor|maestro|codex exec|headless review|passed|failed|evidence)\b/i.test(finalMessage) ||
  /(검증|테스트|실행|통과|실패|증거|근거)/.test(finalMessage);

if (claimsCompletedMobileWork && !includesVerification && !input.stop_hook_active) {
  writeJson({
    decision: 'block',
    reason:
      'Mobile final response is missing test/build/evidence output. Continue once, then include commands run and key results, or explicitly state what was not run and why.',
  });
} else {
  writeJson({ continue: true });
}
