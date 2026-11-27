#!/usr/bin/env node
// The naming desk: a local page for deciding every Field Manual entity's name, fate and design notes.
//   node scripts/naming-desk.mjs  → http://127.0.0.1:4870
// Serves design/naming/ (the page, inventory.json, sprites/) plus every proposals/ and priority/<layer>.json merged, and
// reads/writes design/naming/decisions.json (atomic rename on each save). No dependencies; binds to localhost only.
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'design', 'naming');
const DECISIONS = path.join(ROOT, 'decisions.json');
const PORT = Number(process.env.PORT ?? 4870);
const TYPES = { '.html': 'text/html; charset=utf-8', '.json': 'application/json', '.png': 'image/png', '.js': 'text/javascript', '.css': 'text/css' };

/** Every <dir>/<layer>.json's items, merged by key (proposals/ and priority/ are written per layer by Gemini). */
function merged(name) {
  const dir = path.join(ROOT, name);
  const out = {};
  const failed = [];
  for (const f of fs.existsSync(dir) ? fs.readdirSync(dir) : []) {
    if (!f.endsWith('.json')) continue;
    try {
      for (const it of JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8')).items) out[it.key] = it;
    } catch (e) {
      failed.push(`${f}: ${e.message}`); // still being written by the generator, or broken: reported to the page
    }
  }
  return { items: out, failed };
}

const send = (res, code, body, type = 'application/json') => {
  res.writeHead(code, { 'content-type': type, 'cache-control': 'no-store' });
  res.end(body);
};

http
  .createServer((req, res) => {
    const url = new URL(req.url, 'http://x');
    if (url.pathname === '/api/proposals') return send(res, 200, JSON.stringify(merged('proposals')));
    if (url.pathname === '/api/priorities') return send(res, 200, JSON.stringify(merged('priority')));
    if (url.pathname === '/api/decisions' && req.method === 'GET')
      return send(res, 200, fs.existsSync(DECISIONS) ? fs.readFileSync(DECISIONS) : 'null');
    if (url.pathname === '/api/decisions' && req.method === 'PUT') {
      let body = '';
      req.on('data', (c) => (body += c));
      req.on('end', () => {
        let parsed;
        try {
          parsed = JSON.parse(body);
        } catch (e) {
          return send(res, 400, JSON.stringify({ error: `not JSON: ${e.message}` }));
        }
        if (!parsed || typeof parsed !== 'object' || !parsed.items) return send(res, 400, JSON.stringify({ error: 'expected { items: {...} }' }));
        const tmp = `${DECISIONS}.tmp`;
        fs.writeFileSync(tmp, JSON.stringify(parsed, null, 2) + '\n');
        fs.renameSync(tmp, DECISIONS);
        send(res, 200, JSON.stringify({ ok: true, savedAt: new Date().toISOString() }));
      });
      return;
    }
    const rel = url.pathname === '/' ? 'index.html' : decodeURIComponent(url.pathname.slice(1));
    const file = path.resolve(ROOT, rel);
    if (!file.startsWith(ROOT + path.sep) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) return send(res, 404, 'not found', 'text/plain');
    send(res, 200, fs.readFileSync(file), TYPES[path.extname(file)] ?? 'application/octet-stream');
  })
  .listen(PORT, '127.0.0.1', () => console.log(`naming desk: http://127.0.0.1:${PORT}  (decisions → ${path.relative(process.cwd(), DECISIONS)})`));
