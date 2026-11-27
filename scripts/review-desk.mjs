#!/usr/bin/env node
// The review desk: a local interactive UI for REVIEW.md (drafted categories, triage, dupes, link hosts, feel checks).
//   npm run review  (or: node scripts/review-desk.mjs) → http://127.0.0.1:4871
// Reads live from bank/, bank/reports/, scripts/bank/obvious-draft/, design/triage/ranked.md, design/links/review.txt,
// and scripts/bank-dupes.py; reads/writes design/review/decisions.json (atomic rename on each save). Zero dependencies.
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const ROOT = path.join(REPO, 'design', 'review');
const DECISIONS = path.join(ROOT, 'decisions.json');
const PORT = Number(process.env.PORT ?? 4871);
const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
};

function readText(p) {
  return fs.existsSync(p) ? fs.readFileSync(p, 'utf8') : '';
}

function readJson(p, fallback = null) {
  if (!fs.existsSync(p)) return fallback;
  try {
    return JSON.parse(fs.readFileSync(p, 'utf8'));
  } catch {
    return fallback;
  }
}

/** Parse a bank/*.md file into header metadata and answers grouped by section. */
function parseBankFile(text) {
  const lines = text.split(/\r?\n/);
  const prompt = (lines.find((l) => l.startsWith('# ')) ?? '').slice(2).trim();
  const metaLine = lines.find((l) => l.startsWith('id:')) ?? '';
  const meta = {};
  for (const part of metaLine.split('·')) {
    const m = part.trim().match(/^(\w+):\s*(.+)$/);
    if (m) meta[m[1]] = m[2].trim();
  }
  const acceptsLine = lines.find((l) => l.startsWith('> Accepts:'));
  const accepts = acceptsLine ? acceptsLine.replace(/^>\s*Accepts:\s*/, '').trim() : '';

  const sections = {};
  let cur = null;
  for (const line of lines) {
    const h = line.match(/^##\s+(.+)$/);
    if (h) {
      cur = h[1].trim();
      sections[cur] = [];
      continue;
    }
    if (!cur) continue;
    const item = line.match(/^- (.+)$/);
    if (item) {
      const raw = item[1].trim();
      const auto = raw.endsWith('(auto)');
      const clean = auto ? raw.slice(0, -6).trim() : raw;
      const [name, ...aliases] = clean.split('|').map((s) => s.trim());
      sections[cur].push({ name, aliases, auto, note: '' });
      continue;
    }
    const note = line.match(/^\s+note:\s*(.+)$/);
    if (note && sections[cur].length > 0) {
      sections[cur][sections[cur].length - 1].note = note[1].trim();
    }
  }
  return { prompt, id: meta.id ?? '', domain: meta.domain ?? '', status: meta.status ?? '', accepts, sections };
}

/** Parse the latest `## Pipeline report` section from bank/reports/<id>.md. */
function parseReport(text) {
  if (!text) return null;
  const idx = text.lastIndexOf('## Pipeline report');
  const slice = idx >= 0 ? text.slice(idx) : text;
  const lines = slice.split(/\r?\n/);

  const generated = (lines.find((l) => l.startsWith('Generated ')) ?? '').trim();
  const needsLook = [];
  let inLook = false;
  for (const l of lines) {
    if (l.startsWith('Needs a human look:')) {
      inLook = true;
      continue;
    }
    if (inLook) {
      if (l.startsWith('- ')) needsLook.push(l.slice(2).trim());
      else if (l.trim() !== '') inLook = false;
    }
  }

  const parseTable = (heading) => {
    const start = lines.findIndex((l) => l.trim() === heading);
    if (start < 0) return [];
    const rows = [];
    for (let i = start + 1; i < lines.length; i++) {
      const l = lines[i].trim();
      if (l.startsWith('### ') || l.startsWith('## ')) break;
      if (!l.startsWith('|')) continue;
      if (/^\|\s*-+/.test(l)) continue;
      const cells = l
        .slice(1, -1)
        .split('|')
        .map((c) => c.trim());
      rows.push(cells);
    }
    return rows.slice(1); // drop header row
  };

  const gates = parseTable('### Gates').map(([gate, result, detail]) => ({ gate, result, detail }));
  const tiers = parseTable('### Tiers').map(([tier, answers, unconfirmed]) => ({
    tier,
    answers: Number(answers) || 0,
    unconfirmed: Number(unconfirmed) || 0,
  }));

  const inboxMatch = slice.match(/Inbox \(never accepted in play\):\s*(\d+)/);
  const inboxCount = inboxMatch ? Number(inboxMatch[1]) : 0;

  // Shortlists inside fenced block under `### Bit Flip / Works on my machine shortlists`
  const slIdx = slice.indexOf('### Bit Flip / Works on my machine shortlists');
  const shortlists = { womm: [], bitflip: [] };
  if (slIdx >= 0) {
    const fence = slice.slice(slIdx).match(/```[\s\S]*?```/);
    if (fence) {
      let bucket = null;
      for (const l of fence[0].split(/\r?\n/)) {
        if (/^Works on my machine:/i.test(l.trim())) bucket = 'womm';
        else if (/^Bit Flip:/i.test(l.trim())) bucket = 'bitflip';
        else if (bucket && l.startsWith('- [ ] ')) {
          const val = l.slice(6).trim();
          if (val && !val.startsWith('other:')) shortlists[bucket].push(val);
        }
      }
    }
  }

  return { generated, needsLook, gates, tiers, inboxCount, shortlists };
}

function loadDrafts() {
  const bankDir = path.join(REPO, 'bank');
  const reportsDir = path.join(bankDir, 'reports');
  const obviousDir = path.join(REPO, 'scripts', 'bank', 'obvious-draft');
  const plansDir = path.join(REPO, 'scripts', 'bank', 'plans');
  const drafts = [];

  for (const domain of fs.readdirSync(bankDir)) {
    const dPath = path.join(bankDir, domain);
    if (!fs.statSync(dPath).isDirectory() || domain === 'reports' || domain === 'links') continue;
    for (const file of fs.readdirSync(dPath)) {
      if (!file.endsWith('.md')) continue;
      const full = path.join(dPath, file);
      const parsed = parseBankFile(readText(full));
      if (parsed.status !== 'draft') continue;
      const reportPath = path.join(reportsDir, `${parsed.id}.md`);
      const reportText = readText(reportPath);
      const hasPipelineReport = reportText.includes('## Pipeline report');
      const hasObvious = fs.existsSync(path.join(obviousDir, `${parsed.id}.json`));
      if (!hasPipelineReport && !hasObvious) continue;

      const report = parseReport(reportText);
      const obvious = readJson(path.join(obviousDir, `${parsed.id}.json`), []);
      const plan = readJson(path.join(plansDir, `${parsed.id}.json`), null);
      const totalAnswers = Object.entries(parsed.sections)
        .filter(([k]) => k !== 'Inbox')
        .reduce((n, [, list]) => n + list.length, 0);

      drafts.push({
        id: parsed.id,
        domain: parsed.domain || domain,
        bankPath: `bank/${domain}/${file}`,
        prompt: parsed.prompt,
        accepts: parsed.accepts,
        totalAnswers,
        bitflip: parsed.sections['Bit Flip'] ?? [],
        womm: parsed.sections['Works on my machine'] ?? [],
        sections: parsed.sections,
        report,
        obvious,
        hasPlan: Boolean(plan),
      });
    }
  }

  // Sort failed-gate or flagged categories first, then alphabetically.
  drafts.sort((a, b) => {
    const aFail = a.report?.gates.some((g) => g.result !== 'PASS') ? 0 : 1;
    const bFail = b.report?.gates.some((g) => g.result !== 'PASS') ? 0 : 1;
    return aFail - bFail || a.id.localeCompare(b.id);
  });
  return drafts;
}

function loadTriage() {
  const txt = readText(path.join(REPO, 'design', 'triage', 'ranked.md'));
  const rows = [];
  for (const line of txt.split(/\r?\n/)) {
    if (!line.startsWith('|')) continue;
    const cells = line
      .slice(1, -1)
      .split('|')
      .map((c) => c.trim());
    const rank = Number(cells[0]);
    if (!Number.isFinite(rank)) continue;
    const catMatch = (cells[1] ?? '').match(/^([^\s(]+)\s*(?:\(([^)]+)\))?/);
    rows.push({
      rank,
      id: catMatch ? catMatch[1] : cells[1],
      domain: catMatch?.[2] ?? '',
      verdict: cells[2] ?? '',
      obvious: Number(cells[3]) || 0,
      depth: Number(cells[4]) || 0,
      fun: Number(cells[5]) || 0,
      approx: cells[6] ?? '',
      wildcard: cells[7] === 'yes',
      note: cells[8] ?? '',
    });
  }
  return rows;
}

function loadDupes() {
  try {
    const out = execFileSync('python3', ['-I', path.join(REPO, 'scripts', 'bank-dupes.py')], {
      cwd: REPO,
      encoding: 'utf8',
      timeout: 10000,
    });
    const pairs = [];
    for (const line of out.split(/\r?\n/)) {
      const m = line.match(/^([^:]+):\s*'([^']+)'\s+duplicates\s+'([^']+)'$/);
      if (!m) continue;
      pairs.push({ id: `${m[1]}|${m[2]}|${m[3]}`, category: m[1], a: m[2], b: m[3] });
    }
    return { pairs, error: null };
  } catch (e) {
    return { pairs: [], error: e.message };
  }
}

function loadLinkHosts() {
  const txt = readText(path.join(REPO, 'design', 'links', 'review.txt'));
  const byHost = new Map();
  for (const line of txt.split(/\r?\n/)) {
    const parts = line.split(' · ').map((s) => s.trim());
    if (parts.length < 3) continue;
    const [category, answer, url] = parts;
    let host = '';
    try {
      host = new URL(url).hostname.replace(/^www\./, '');
    } catch {
      continue;
    }
    if (!byHost.has(host)) byHost.set(host, { host, items: [] });
    byHost.get(host).items.push({ category, answer, url });
  }
  return [...byHost.values()].sort((a, b) => b.items.length - a.items.length || a.host.localeCompare(b.host));
}

const MISC_ITEMS = [
  {
    id: 'turing-award-winner',
    group: 'Pipeline',
    title: 'turing-award-winner source plan',
    desc: 'Failed at harvest (a list of people; code/paper corpora cannot supply it). Decide whether to hand-write a source plan or skip/cut.',
    options: ['Write source plan (Wikipedia/ACM list)', 'Defer', 'Cut category'],
  },
  {
    id: 'womm-link',
    group: 'Links',
    title: '"Works on my machine" reference link',
    desc: 'Currently plain text everywhere because it has no Wikipedia article. Leave unlinked or provide a URL (e.g. a classic blog post/essay).',
    options: ['Leave plain text', 'Add custom URL'],
    hasUrl: true,
  },
  {
    id: 'version-wordmark',
    group: 'Visual',
    title: 'Title & Settings version line font',
    desc: 'Title screen and Settings version lines are still plain text rather than the pixel wordmark font.',
    options: ['Keep plain text', 'Use pixel wordmark'],
  },
  {
    id: 'feel-reveal-flicker',
    group: 'Feel check',
    title: 'Reveal background flicker pace',
    desc: 'Black region is still; outside refreshes at most every 250 ms; held jiggle steps no faster. Calm enough, or calmer still?',
    options: ['Feels good', 'Calmer still', 'Needs adjustment'],
  },
  {
    id: 'feel-mobile-endcard',
    group: 'Feel check',
    title: 'End card on a phone',
    desc: 'Long prompts in the backtrace, stack flying into the summary card, hide/show stow, and touch targets.',
    options: ['Feels good', 'Needs adjustment'],
  },
  {
    id: 'feel-cursor-lean',
    group: 'Feel check',
    title: 'Cursor lean toward mouse (3 px) & reached-layer glow',
    desc: 'Check subtle mouse-lean feel and the breathing glow + symmetrical pointers on the end-card reached layer.',
    options: ['Feels good', 'Needs adjustment'],
  },
];

const send = (res, code, body, type = 'application/json; charset=utf-8') => {
  res.writeHead(code, { 'content-type': type, 'cache-control': 'no-store' });
  res.end(body);
};

http
  .createServer((req, res) => {
    const url = new URL(req.url, 'http://x');
    if (url.pathname === '/api/data' && req.method === 'GET') {
      const payload = {
        drafts: loadDrafts(),
        triage: loadTriage(),
        dupes: loadDupes(),
        linkHosts: loadLinkHosts(),
        misc: MISC_ITEMS,
      };
      return send(res, 200, JSON.stringify(payload));
    }
    if (url.pathname === '/api/decisions' && req.method === 'GET') {
      return send(res, 200, fs.existsSync(DECISIONS) ? fs.readFileSync(DECISIONS) : 'null');
    }
    if (url.pathname === '/api/decisions' && req.method === 'PUT') {
      const chunks = [];
      req.on('data', (c) => chunks.push(c));
      req.on('end', () => {
        try {
          const text = Buffer.concat(chunks).toString('utf8');
          JSON.parse(text);
          fs.mkdirSync(ROOT, { recursive: true });
          const tmp = `${DECISIONS}.tmp`;
          fs.writeFileSync(tmp, text);
          fs.renameSync(tmp, DECISIONS);
          send(res, 200, '{"ok":true}');
        } catch (e) {
          send(res, 400, JSON.stringify({ error: e.message }));
        }
      });
      return;
    }

    const rel = url.pathname === '/' ? 'index.html' : url.pathname.replace(/^\/+/, '');
    const file = path.resolve(ROOT, rel);
    if (!file.startsWith(ROOT + path.sep) && file !== ROOT) return send(res, 403, 'forbidden', 'text/plain');
    if (!fs.existsSync(file) || fs.statSync(file).isDirectory()) return send(res, 404, 'not found', 'text/plain');
    send(res, 200, fs.readFileSync(file), TYPES[path.extname(file)] ?? 'application/octet-stream');
  })
  .listen(PORT, '127.0.0.1', () => {
    console.log(`review desk: http://127.0.0.1:${PORT}`);
    console.log(`decisions:   ${DECISIONS}`);
  });
