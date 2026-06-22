#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const allowedTransports = new Set(['raw-curl', 'send-room-text', 'mcp-tool', 'other']);
const substituteSurfaces = new Set(['task-comment', 'workboard-comment', 'pr-comment', 'local-note', 'final-no-reply']);
const validatorDir = path.dirname(fileURLToPath(import.meta.url));
const harnessRoot = path.resolve(validatorDir, '..');

function usage() {
  console.error('Usage: validate-room-text-result.mjs <result.json> | --self-test');
}

function readJson(file) {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch (error) {
    return { __parse_error: error.message };
  }
}

function isInteger(value) {
  return Number.isInteger(value);
}

function isNonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

function isIsoTimestamp(value) {
  if (!isNonEmptyString(value)) return false;
  const ms = Date.parse(value);
  return Number.isFinite(ms) && new Date(ms).toISOString() === value;
}

export function validateRoomTextResult(input) {
  const errors = [];
  const warnings = [];

  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    return { ok: false, errors: ['result must be a JSON object'], warnings };
  }
  if (input.__parse_error) {
    return { ok: false, errors: [`malformed/unparseable response: ${input.__parse_error}`], warnings };
  }

  if (input.schema !== 'room-text-delivery-result/v1') errors.push('schema must be room-text-delivery-result/v1');
  if (!isInteger(input.intended_room_id)) errors.push('intended_room_id must be a numeric integer');
  if (!isInteger(input.actual_room_id)) errors.push('actual_room_id must be a numeric integer');
  if (typeof input.intended_room_id === 'string' && /^room-/.test(input.intended_room_id)) errors.push('intended_room_id must not be literal room-N');
  if (typeof input.actual_room_id === 'string' && /^room-/.test(input.actual_room_id)) errors.push('actual_room_id must not be literal room-N');
  if (isInteger(input.intended_room_id) && isInteger(input.actual_room_id) && input.intended_room_id !== input.actual_room_id) {
    errors.push('actual_room_id must match intended_room_id');
  }
  if (!isNonEmptyString(input.message_id)) errors.push('message_id must be present and non-empty');
  if (input.content_nonempty !== true) errors.push('content_nonempty must be true');
  if (!isNonEmptyString(input.transport) || !allowedTransports.has(input.transport)) errors.push('transport must be one of raw-curl, send-room-text, mcp-tool, other');
  if (!isIsoTimestamp(input.timestamp)) errors.push('timestamp must be a valid ISO-8601 string');
  if (input.transport_ok !== true) errors.push('transport_ok must be true');
  if ('http_status' in input && input.http_status !== null) {
    if (!isInteger(input.http_status) || input.http_status < 200 || input.http_status > 299) errors.push('http_status must be 2xx when present');
  }
  if ('raw_response_parse_ok' in input && input.raw_response_parse_ok !== true) errors.push('raw_response_parse_ok must be true when present');
  const reportKind = input.result_kind || input.report_kind || 'report-delivery';
  const mayOmitDestinationBound = input.dry_run === true || reportKind === 'transport-smoke';
  if (!mayOmitDestinationBound && input.visible_report_destination_bound !== true) errors.push('visible_report_destination_bound must be present and true for report-delivery proof');
  if ('visible_report_destination_bound' in input && input.visible_report_destination_bound !== true) errors.push('visible_report_destination_bound must be true when present');
  if (input.duplicate_after_confirmed_success === true) errors.push('duplicate send after confirmed success is invalid');
  if (substituteSurfaces.has(input.proof_surface)) errors.push(`${input.proof_surface} is not visible Room text delivery proof`);
  if (input.final_no_reply_only === true) errors.push('final NO_REPLY only is not visible Room text delivery proof');
  if (input.validation_proof_missing === true) errors.push('validation proof is missing');

  if (input.work_completion_claim === true) warnings.push('message_id/room_id are delivery proof only, not work-completion proof');
  return { ok: errors.length === 0, errors, warnings };
}

function printResult(file, result) {
  const payload = {
    schema: 'room-text-delivery-validation/v1',
    file,
    status: result.ok ? 'PASS' : 'FAIL',
    errors: result.errors,
    warnings: result.warnings,
  };
  console.log(JSON.stringify(payload, null, 2));
}

function fixtureFiles(kind) {
  const root = path.join(harnessRoot, 'fixtures', kind);
  return fs.readdirSync(root).filter((name) => name.endsWith('.json')).sort().map((name) => path.join(root, name));
}

function selfTest() {
  let failures = 0;
  for (const file of fixtureFiles('valid')) {
    const result = validateRoomTextResult(readJson(file));
    if (!result.ok) failures += 1;
    console.log(`${result.ok ? 'PASS' : 'FAIL'} valid ${file}${result.ok ? '' : ` :: ${result.errors.join('; ')}`}`);
  }
  for (const file of fixtureFiles('invalid')) {
    const result = validateRoomTextResult(readJson(file));
    const expected = !result.ok;
    if (!expected) failures += 1;
    console.log(`${expected ? 'PASS' : 'FAIL'} invalid ${file}${expected ? '' : ' :: unexpectedly valid'}`);
  }
  if (failures) {
    console.error(`Self-test failed: ${failures}`);
    process.exit(1);
  }
}

if (process.argv.includes('--self-test')) {
  selfTest();
} else {
  const file = process.argv[2];
  if (!file) {
    usage();
    process.exit(1);
  }
  const result = validateRoomTextResult(readJson(file));
  printResult(file, result);
  if (!result.ok) process.exit(1);
}
