import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));
const { default: analyzeHandler } = await import('./api/analyze.js');
const port = Number(process.env.PORT || 3000);
const reports = [];

function loadEnv() {
  const envPath = path.join(root, '.env');
  if (!fs.existsSync(envPath)) return;
  for (const line of fs.readFileSync(envPath, 'utf8').split(/\r?\n/)) {
    const match = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (match && !process.env[match[1]]) process.env[match[1]] = match[2].trim();
  }
}

loadEnv();

function sendJson(response, status, payload) {
  response.writeHead(status, { 'content-type': 'application/json; charset=utf-8' });
  response.end(JSON.stringify(payload));
}

function readBody(request) {
  return new Promise((resolve, reject) => {
    let body = '';
    request.on('data', chunk => {
      body += chunk;
      if (body.length > 1_000_000) request.destroy(new Error('Payload too large'));
    });
    request.on('end', () => resolve(body));
    request.on('error', reject);
  });
}

const server = http.createServer(async (request, response) => {
  try {
    if (request.method === 'GET' && request.url === '/') {
      response.writeHead(200, { 'content-type': 'text/html; charset=utf-8' });
      return response.end(fs.readFileSync(path.join(root, 'index.html')));
    }
    if (request.method === 'POST' && request.url === '/api/analyze') {
      const rawBody = await readBody(request);
      const localRequest = { method: request.method, body: JSON.parse(rawBody || '{}') };
      const localResponse = {
        status(code) { response.statusCode = code; return this; },
        setHeader(name, value) { response.setHeader(name, value); return this; },
        send(body) { response.end(body); },
        json(body) { response.setHeader('content-type', 'application/json; charset=utf-8'); response.end(JSON.stringify(body)); }
      };
      return await analyzeHandler(localRequest, localResponse);
    }
    if (request.method === 'GET' && request.url === '/api/reports') return sendJson(response, 200, { reports, changes: reports.length ? [`New report from ${reports.at(-1).sourceType.toLowerCase()}`] : [] });
    sendJson(response, 404, { error: 'Not found' });
  } catch (error) {
    console.error(error);
    sendJson(response, 500, { error: 'Internal server error' });
  }
});

server.listen(port, () => console.log(`Signal listening on http://localhost:${port}`));
