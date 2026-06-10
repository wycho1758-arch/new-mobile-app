#!/usr/bin/env node

import http from 'node:http';

const server = http.createServer((req, res) => {
  if (req.url === '/livez') {
    res.writeHead(200, { 'content-type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok' }));
  } else {
    res.writeHead(404, { 'content-type': 'application/json' });
    res.end(JSON.stringify({ status: 'missing' }));
  }
});

server.listen(0, '127.0.0.1', () => {
  const { port } = server.address();
  process.stdout.write(`${port}\n`);
});
