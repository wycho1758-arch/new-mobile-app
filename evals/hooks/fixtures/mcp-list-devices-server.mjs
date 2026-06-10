#!/usr/bin/env node

import readline from 'node:readline';

const rl = readline.createInterface({
  input: process.stdin,
  crlfDelay: Infinity,
});

function send(id, result) {
  process.stdout.write(`${JSON.stringify({ jsonrpc: '2.0', id, result })}\n`);
}

for await (const line of rl) {
  if (!line.trim()) continue;
  const message = JSON.parse(line);
  if (message.method === 'initialize') {
    send(message.id, {
      protocolVersion: '2025-06-18',
      capabilities: { tools: {} },
      serverInfo: { name: 'hook-fixture-mcp', version: '0.0.0' },
    });
  } else if (message.method === 'tools/call') {
    send(message.id, {
      content: [
        {
          type: 'text',
          text: JSON.stringify({ devices: [] }),
        },
      ],
    });
  }
}
