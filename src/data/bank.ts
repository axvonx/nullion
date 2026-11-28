import { enforce } from '../core/enforce';
import { parseBankFile, parseIndex, playTier, type BankCategory, type IndexRow } from './bank-format';
import type { Question, Term } from '../core/answers';
import indexText from '../../bank/index.md?raw';
import scheduleText from '../../bank/schedule.md?raw';
import { parseSchedule } from './schedule';

/**
 * The answer bank: bank/<domain>/<id>.md, one human-edited Markdown file per category (grammar in
 * bank-format.ts). bank/index.md is the manifest the page reads to know which questions exist; each category
 * file is its own lazy chunk, so a day fetches only the categories it plays.
 */

const FILES = import.meta.glob(['../../bank/*/*.md', '!../../bank/reports/*.md'], { query: '?raw', import: 'default' }) as Record<string, () => Promise<string>>;

/** Checked reference links per category (scripts/verify-links.py): the end card's answer sheet links to these. */
const LINK_FILES = import.meta.glob('../../bank/links/*.json', { import: 'default' }) as Record<string, () => Promise<CategoryLinks>>;
export interface CategoryLinks {
  prompt: string | null;
  answers: Record<string, string>;
}
const LINKS_BY_ID = new Map<string, CategoryLinks>();

interface FileRef {
  path: string;
  domain: string;
  load: () => Promise<string>;
}

const BY_ID = new Map<string, FileRef>();
for (const [path, load] of Object.entries(FILES)) {
  const m = /bank\/([^/]+)\/([^/]+)\.md$/.exec(path);
  enforce(m, `bank: unexpected category path ${path}`);
  const [, domain, id] = m as unknown as [string, string, string];
  enforce(!BY_ID.has(id), `bank: category id ${id} exists in two domains`);
  BY_ID.set(id, { path: `bank/${domain}/${id}.md`, domain, load });
}

export const BANK_INDEX: readonly IndexRow[] = parseIndex(indexText);
for (const r of BANK_INDEX) enforce(BY_ID.has(r.id), `bank/index.md lists ${r.id}, which has no file (run npm run bank:index)`);
enforce(BANK_INDEX.length === BY_ID.size, `bank/index.md has ${BANK_INDEX.length} rows for ${BY_ID.size} files (run npm run bank:index)`);

function toQuestion(r: IndexRow): Question {
  return { id: r.id, tag: r.id, call: `name_a(${r.id.replaceAll('-', '_')})`, prompt: r.prompt };
}

/** Questions the game may ask: approved categories only. */
export const BANK_QUESTIONS: readonly Question[] = BANK_INDEX.filter((r) => r.status === 'approved').map(toQuestion);

const SCHEDULE = parseSchedule(scheduleText);
const QUESTION_BY_ID = new Map(BANK_INDEX.map((r) => [r.id, toQuestion(r)]));

/** The day's prompts, in order, from bank/schedule.md. A missing day is a bug (CI keeps 14 days ahead). */
export function scheduledQuestions(puzzle: number): Question[] {
  const ids = SCHEDULE.get(puzzle);
  enforce(ids, `bank/schedule.md has no row for puzzle #${puzzle} (run npm run bank:schedule)`);
  return ids.map((id) => {
    const q = QUESTION_BY_ID.get(id);
    enforce(q, `bank/schedule.md: puzzle #${puzzle} asks ${id}, which is not in the bank`);
    return q;
  });
}

export async function loadBankCategory(id: string): Promise<BankCategory> {
  const ref = BY_ID.get(id);
  enforce(ref, `bank: no category ${id}`);
  const c = parseBankFile(ref.path, await ref.load());
  enforce(c.id === id, `${ref.path}: header says id ${c.id}, file name says ${id}`);
  enforce(c.domain === ref.domain, `${ref.path}: header says domain ${c.domain}, folder says ${ref.domain}`);
  return c;
}

/** A category's playable answers as terms. Inbox candidates are not playable until moved into a tier;
 * unconfirmed (auto) answers play their full tier. */
export function categoryTerms(c: BankCategory): Term[] {
  return c.entries.map((e) => ({
    name: e.name,
    ...(e.aliases.length ? { aliases: e.aliases } : {}),
    tags: { [c.id]: playTier(e) },
    ...(e.note ? { note: e.note } : {}),
  }));
}

const ACCEPTS_BY_ID = new Map<string, string>();

/** Plain-English `> Accepts:` guidance for a loaded bank category, if the category file provides one. */
export function bankAcceptsFor(id: string): string | undefined {
  return ACCEPTS_BY_ID.get(id);
}

/**
 * A loaded category's checked reference link for an answer (or, with no answer, for the prompt's subject).
 * Undefined when none was found: the sheet then falls back to a Wikipedia search. Every approved category has a
 * links file (bank.test.ts), so a missing one at runtime only means a category approved since the last link run.
 */
export function bankLink(id: string, answer?: string): string | undefined {
  const l = LINKS_BY_ID.get(id);
  if (!l) return undefined;
  return (answer === undefined ? l.prompt : l.answers[answer]) ?? undefined;
}

export async function loadBankTerms(ids: readonly string[]): Promise<Term[]> {
  const unique = [...new Set(ids)];
  const cats = await Promise.all(unique.map(loadBankCategory));
  for (const c of cats) {
    enforce(c.status === 'approved', `bank: ${c.id} is ${c.status}, not approved`);
    if (c.accepts) ACCEPTS_BY_ID.set(c.id, c.accepts);
  }
  await Promise.all(
    unique.map(async (id) => {
      const load = LINK_FILES[`../../bank/links/${id}.json`];
      if (load) LINKS_BY_ID.set(id, await load());
    }),
  );
  return cats.flatMap(categoryTerms);
}
