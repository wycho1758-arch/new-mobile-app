#!/usr/bin/env node
import { randomUUID } from 'node:crypto';

function usage() {
  console.error(`Usage: send-room-text.mjs --room-id <number> --content <text> [--expected-room-id <number>|--visible-report-destination <number>] [--result-kind report-delivery|transport-smoke] [--url <admin-api-url>] [--token-env <name>] [--dry-run]

Sends visible Room text through /internal/messages and prints a normalized
room-text-delivery-result/v1 JSON object. The wrapper is a convenience transport;
raw curl and other transports remain allowed when they produce the same normalized result.`);
}

function parseArgs(argv) {
  const out = { url: process.env.ADMIN_API_URL || 'http://admin-api:3000', tokenEnv: 'GATEWAY_TOKEN', dryRun: false };
  for (let i = 2; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--room-id') out.roomId = argv[++i];
    else if (arg === '--expected-room-id') out.expectedRoomId = argv[++i];
    else if (arg === '--visible-report-destination') out.expectedRoomId = argv[++i];
    else if (arg === '--content') out.content = argv[++i];
    else if (arg === '--result-kind') out.resultKind = argv[++i];
    else if (arg === '--url') out.url = argv[++i];
    else if (arg === '--token-env') out.tokenEnv = argv[++i];
    else if (arg === '--dry-run') out.dryRun = true;
    else if (arg === '--help' || arg === '-h') { usage(); process.exit(0); }
    else throw new Error(`Unknown argument: ${arg}`);
  }
  return out;
}

function normalizeRoomId(value) {
  if (!/^[0-9]+$/.test(String(value || ''))) throw new Error('--room-id must be numeric, not room-N');
  return Number(value);
}

function resultBase(roomId, content, resultKind) {
  return {
    schema: 'room-text-delivery-result/v1',
    request_id: randomUUID(),
    result_kind: resultKind,
    intended_room_id: roomId,
    actual_room_id: null,
    message_id: null,
    content_nonempty: Boolean(String(content || '').trim()),
    transport: 'send-room-text',
    timestamp: new Date().toISOString(),
    http_status: null,
    transport_ok: false,
    raw_response_parse_ok: false,
    visible_report_destination_bound: true,
  };
}

async function main() {
  const args = parseArgs(process.argv);
  const roomId = normalizeRoomId(args.roomId);
  const resultKind = args.resultKind || (args.dryRun ? 'transport-smoke' : 'report-delivery');
  if (!['report-delivery', 'transport-smoke'].includes(resultKind)) throw new Error('--result-kind must be report-delivery or transport-smoke');
  if (resultKind === 'report-delivery' && !args.dryRun && args.expectedRoomId == null) {
    throw new Error('report-delivery requires --expected-room-id or --visible-report-destination');
  }
  const expectedRoomId = args.expectedRoomId == null ? roomId : normalizeRoomId(args.expectedRoomId);
  if (!String(args.content || '').trim()) throw new Error('--content must be non-empty');
  const result = resultBase(expectedRoomId, args.content, resultKind);

  if (args.dryRun) {
    result.actual_room_id = roomId;
    result.message_id = 'dry-run-message-id';
    result.http_status = 200;
    result.transport_ok = true;
    result.raw_response_parse_ok = true;
    result.dry_run = true;
    console.log(JSON.stringify(result, null, 2));
    return;
  }

  const token = process.env[args.tokenEnv];
  if (!token) throw new Error(`Missing token env ${args.tokenEnv}`);
  const payload = {
    from_agent_id: process.env.AGENT_ID || 'unknown',
    room_id: roomId,
    content: args.content,
  };
  const response = await fetch(`${args.url.replace(/\/$/, '')}/internal/messages`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Gateway-Token': token,
    },
    body: JSON.stringify(payload),
  });
  result.http_status = response.status;
  const text = await response.text();
  let body = null;
  try {
    body = JSON.parse(text);
    result.raw_response_parse_ok = true;
  } catch {
    result.raw_response_parse_ok = false;
  }
  result.transport_ok = response.ok;
  result.actual_room_id = typeof body?.room_id === 'number' ? body.room_id : null;
  result.message_id = typeof body?.message_id === 'string' ? body.message_id : null;
  console.log(JSON.stringify(result, null, 2));
  if (!response.ok) process.exitCode = 1;
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
