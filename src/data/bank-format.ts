import { enforce } from '../core/enforce';
import { TIERS, TIER_IDS, type TierId } from '../core/tiers';

/**
 * The answer bank's file format: one Markdown file per category, bank/<domain>/<id>.md (bank/reports/ holds
 * generated scoring reports and is not part of the bank). Humans edit these
 * directly; this parser is the single authority on the grammar and rejects anything off it, with file:line.
 *
 *   # Name a type of lock
 *   id: lock · domain: os-systems · status: approved
 *   > Accepts: any locking or mutual-exclusion primitive or protocol.     (optional, one or more lines)
 *
 *   ## Off-by-one                      one section per tier, in the canonical order, each at most once
 *   - mutex
 *   - spinlock | spin lock | spin-lock  aliases after " | "
 *   - ERESOURCE (auto)                 accepted by the pipeline, not yet confirmed by a person (a review label;
 *                                      it plays its full tier); delete the marker to confirm it
 *     note: shown on the reveal         optional, indented, directly under its answer
 *   ...
 *   ## Bit Flip
 *   - fissile lock
 *
 *   ## Inbox                           unreviewed candidates: never accepted in play until moved up
 *   - qspinlock (suggested: race)
 *
 * Blank lines and <!-- comment --> lines are ignored anywhere. An approved category must have exactly one
 * Bit Flip answer and at least one Works on my machine answer (several cliché picks can share that tier).
 */

export const DOMAINS = ['os-systems', 'languages-tools', 'hardware-security-history', 'data-graphics-algorithms'] as const;
export type Domain = (typeof DOMAINS)[number];
export const STATUSES = ['draft', 'approved', 'retired'] as const;
export type Status = (typeof STATUSES)[number];

export interface BankEntry {
  name: string;
  aliases: string[];
  tier: TierId;
  note?: string;
  /** Accepted by the pipeline and not yet confirmed by a person. */
  auto?: true;
}

export interface InboxEntry {
  name: string;
  aliases: string[];
  suggested?: TierId;
}

export interface BankCategory {
  id: string;
  prompt: string;
  domain: Domain;
  status: Status;
  accepts: string;
  entries: BankEntry[];
  inbox: InboxEntry[];
}

const TIER_BY_HEADING = new Map<string, TierId>(TIER_IDS.map((t) => [TIERS[t].name, t]));
const ID_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const HEADER_RE = /^id: (\S+) · domain: (\S+) · status: (\S+)$/;
const SUGGESTED_RE = /^(.*?)\s+\(suggested: ([a-z-]+)\)$/;
const AUTO_RE = /^(.*?)\s+\(auto\)$/;

/**
 * The tier an entry plays at. Unconfirmed (auto) answers play their full tier, and players are never told
 * an answer is unconfirmed (decided 2026-11-26: the cap made deep cuts like MACRO-11 pay 3 frames instead
 * of 8). "(auto)" is a review label for the bank's curator only.
 */
export function playTier(e: BankEntry): TierId {
  return e.tier;
}

function splitNames(text: string, where: string): { name: string; aliases: string[] } {
  const parts = text.split(' | ').map((p) => p.trim());
  enforce(parts.every((p) => p.length > 0), `${where}: empty name or alias in "${text}"`);
  enforce(!parts.some((p) => p.includes('|')), `${where}: separate aliases with " | " (spaces around the bar)`);
  return { name: parts[0]!, aliases: parts.slice(1) };
}

export function parseBankFile(path: string, text: string): BankCategory {
  const lines = text.split('\n');
  let i = 0;
  const at = () => `${path}:${i + 1}`;
  const skippable = (l: string) => l.trim() === '' || /^\s*<!--.*-->\s*$/.test(l);
  const next = () => {
    while (i < lines.length && skippable(lines[i]!)) i++;
    return i < lines.length ? lines[i]! : undefined;
  };

  const title = next();
  enforce(title !== undefined && title.startsWith('# '), `${at()}: expected "# <prompt>" as the first line`);
  const prompt = title.slice(2).trim();
  enforce(prompt.length > 0, `${at()}: empty prompt`);
  i++;

  const header = next();
  const hm = header === undefined ? null : HEADER_RE.exec(header);
  enforce(hm, `${at()}: expected "id: <id> · domain: <domain> · status: <status>"`);
  const [, id, domain, status] = hm as unknown as [string, string, string, string];
  enforce(ID_RE.test(id), `${at()}: id "${id}" must be kebab-case`);
  enforce((DOMAINS as readonly string[]).includes(domain), `${at()}: unknown domain "${domain}" (one of ${DOMAINS.join(', ')})`);
  enforce((STATUSES as readonly string[]).includes(status), `${at()}: unknown status "${status}" (one of ${STATUSES.join(', ')})`);
  i++;

  const accepts: string[] = [];
  while (next()?.startsWith('> ')) {
    accepts.push(lines[i]!.slice(2).trim());
    i++;
  }

  const entries: BankEntry[] = [];
  const inbox: InboxEntry[] = [];
  const seenSections = new Set<string>();
  let lastOrder = -1;
  let section: TierId | 'inbox' | undefined;
  const keys = new Map<string, string>();
  const claim = (n: string, where: string) => {
    const k = n.toLowerCase();
    const prev = keys.get(k);
    enforce(prev === undefined, `${where}: "${n}" already appears at ${prev}`);
    keys.set(k, where);
  };

  for (let l = next(); l !== undefined; l = next()) {
    const where = at();
    if (l.startsWith('## ')) {
      const h = l.slice(3).trim();
      const tier = TIER_BY_HEADING.get(h);
      enforce(tier || h === 'Inbox', `${where}: unknown section "${h}" (tiers: ${[...TIER_BY_HEADING.keys()].join(', ')}, or Inbox)`);
      enforce(!seenSections.has(h), `${where}: section "${h}" appears twice`);
      const order = tier ? TIER_IDS.indexOf(tier) : TIER_IDS.length;
      enforce(order > lastOrder, `${where}: section "${h}" is out of order (keep tiers in the order ${[...TIER_BY_HEADING.keys()].join(', ')}, then Inbox)`);
      seenSections.add(h);
      lastOrder = order;
      section = tier ?? 'inbox';
    } else if (l.startsWith('- ')) {
      enforce(section, `${where}: answer before any section heading`);
      const body = l.slice(2).trim();
      if (section === 'inbox') {
        const sm = SUGGESTED_RE.exec(body);
        let suggested: TierId | undefined;
        let names = body;
        if (sm) {
          const s = sm[2]!;
          enforce((TIER_IDS as readonly string[]).includes(s), `${where}: unknown suggested tier "${s}"`);
          suggested = s as TierId;
          names = sm[1]!;
        }
        const n = splitNames(names, where);
        for (const k of [n.name, ...n.aliases]) claim(k, where);
        inbox.push({ ...n, ...(suggested ? { suggested } : {}) });
      } else {
        const am = AUTO_RE.exec(body);
        const n = splitNames(am ? am[1]! : body, where);
        for (const k of [n.name, ...n.aliases]) claim(k, where);
        enforce(!am || (section !== 'bitflip' && section !== 'womm'), `${where}: Bit Flip and Works on my machine are picked by a person; remove (auto)`);
        entries.push({ ...n, tier: section, ...(am ? { auto: true as const } : {}) });
      }
    } else if (/^\s+note: /.test(l)) {
      const last = entries[entries.length - 1];
      enforce(section !== 'inbox' && last && !last.note, `${where}: a note must sit directly under a tiered answer, once`);
      enforce(lines[i - 1]?.startsWith('- '), `${where}: a note must sit directly under its answer`);
      last.note = l.replace(/^\s+note: /, '').trim();
    } else {
      enforce(false, `${where}: unexpected line "${l}" (expected "## <section>", "- <answer>" or an indented "note:")`);
    }
    i++;
  }

  if (status === 'approved') {
    const count = (t: TierId) => entries.filter((e) => e.tier === t).length;
    enforce(count('bitflip') === 1, `${path}: an approved category needs exactly one Bit Flip answer, has ${count('bitflip')}`);
    enforce(count('womm') >= 1, `${path}: an approved category needs at least one Works on my machine answer`);
  }

  return { id, prompt, domain: domain as Domain, status: status as Status, accepts: accepts.join(' '), entries, inbox };
}

/** Serialise a category back to the canonical layout (used for generated drafts and round-trip tests). */
export function formatBankFile(c: BankCategory): string {
  const out = [`# ${c.prompt}`, `id: ${c.id} · domain: ${c.domain} · status: ${c.status}`];
  if (c.accepts) out.push(`> ${c.accepts}`);
  for (const t of TIER_IDS) {
    const es = c.entries.filter((e) => e.tier === t);
    if (!es.length) continue;
    out.push('', `## ${TIERS[t].name}`);
    for (const e of es) {
      out.push(`- ${[e.name, ...e.aliases].join(' | ')}${e.auto ? ' (auto)' : ''}`);
      if (e.note) out.push(`  note: ${e.note}`);
    }
  }
  if (c.inbox.length) {
    out.push('', '## Inbox');
    for (const e of c.inbox) out.push(`- ${[e.name, ...e.aliases].join(' | ')}${e.suggested ? ` (suggested: ${e.suggested})` : ''}`);
  }
  return out.join('\n') + '\n';
}

/** The generated master index: one row per category, read at runtime for the question pool. */
export interface IndexRow {
  id: string;
  prompt: string;
  domain: Domain;
  status: Status;
  answers: number;
  /** Answers still marked (auto). */
  auto: number;
  inbox: number;
}

export function formatIndex(rows: readonly IndexRow[]): string {
  const sorted = [...rows].sort((a, b) => a.domain.localeCompare(b.domain) || a.id.localeCompare(b.id));
  const counts = STATUSES.map((s) => `${sorted.filter((r) => r.status === s).length} ${s}`).join(', ');
  return [
    '# Answer bank index',
    '',
    `<!-- Generated from the category files by \`npm run bank:index\`; CI fails if it is stale. Edit the category files, not this. -->`,
    '',
    `${sorted.length} categories: ${counts}.`,
    '',
    '| id | prompt | domain | status | answers | unconfirmed | inbox |',
    '|---|---|---|---|---|---|---|',
    ...sorted.map((r) => `| ${r.id} | ${r.prompt.replaceAll('|', '\\|')} | ${r.domain} | ${r.status} | ${r.answers} | ${r.auto} | ${r.inbox} |`),
    '',
  ].join('\n');
}

export function parseIndex(text: string): IndexRow[] {
  const rows: IndexRow[] = [];
  for (const [n, line] of text.split('\n').entries()) {
    if (!line.startsWith('| ') || line.startsWith('| id |')) continue;
    const cells = line
      .slice(2, -2)
      .split(/ (?<!\\)\| /)
      .map((c) => c.replaceAll('\\|', '|'));
    enforce(cells.length === 7, `bank/index.md:${n + 1}: expected 7 cells, got ${cells.length}`);
    const [id, prompt, domain, status, answers, auto, inbox] = cells as [string, string, string, string, string, string, string];
    enforce((DOMAINS as readonly string[]).includes(domain), `bank/index.md:${n + 1}: unknown domain ${domain}`);
    enforce((STATUSES as readonly string[]).includes(status), `bank/index.md:${n + 1}: unknown status ${status}`);
    rows.push({ id, prompt, domain: domain as Domain, status: status as Status, answers: Number(answers), auto: Number(auto), inbox: Number(inbox) });
  }
  return rows;
}
