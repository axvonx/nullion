import type { CategoryEntry } from '../core/match';
import type { TierId } from '../core/tiers';

/**
 * The end-of-day answer sheet for one prompt: every answer of the loaded set grouped by its own tier, deepest
 * first (Works on my machine is its own group, last). Each group shows a few answers chosen deterministically
 * from the puzzle number and question id, so everyone sees the same ones, and keeps the rest behind "+N more".
 */

export const SHEET_TIER_ORDER: readonly TierId[] = ['bitflip', 'heisenbug', 'race', 'leak', 'npe', 'off-by-one', 'womm'];
export const SHEET_SHOWN = 8;

export interface SheetGroup {
  tier: TierId;
  total: number;
  /** The up-to-SHEET_SHOWN picks (always including the player's own answer), alphabetical. */
  shown: CategoryEntry[];
  /** The whole tier, alphabetical: what "+N more" expands to. */
  all: CategoryEntry[];
}

/** FNV-1a, 32 bit: a stable string hash for the seeded pick. */
function fnv(s: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

const byName = (a: CategoryEntry, b: CategoryEntry) => a.name.localeCompare(b.name);

/** Groups with at least one answer, in SHEET_TIER_ORDER. `own` is the player's answer, kept visible in its group. */
export function answerSheet(entries: readonly CategoryEntry[], puzzle: number, questionId: string, own?: string): SheetGroup[] {
  const groups: SheetGroup[] = [];
  for (const tier of SHEET_TIER_ORDER) {
    const all = entries.filter((e) => e.tier === tier).sort(byName);
    if (all.length === 0) continue;
    const ownEntry = all.find((e) => e.name === own);
    const pool = all.filter((e) => e !== ownEntry).sort((a, b) => fnv(`${puzzle}|${questionId}|${a.name}`) - fnv(`${puzzle}|${questionId}|${b.name}`));
    const shown = [...(ownEntry ? [ownEntry] : []), ...pool.slice(0, SHEET_SHOWN - (ownEntry ? 1 : 0))].sort(byName);
    groups.push({ tier, total: all.length, shown, all });
  }
  return groups;
}

/**
 * Reference links on the answer sheet: each answer searches Wikipedia in the sense the prompt means, so "mutex"
 * under "Name a type of lock" lands on concurrency, not on door hardware. Search (not a guessed article title) is
 * the honest choice: it never 404s, and Wikipedia jumps straight to an article when the query is an exact title.
 */
const WIKI = 'https://en.wikipedia.org/w/index.php';

/** "Name a type of lock" → "lock": what kind of thing the prompt asks for. Other phrasings are kept whole. */
export function promptSubject(prompt: string): string {
  const m = /^name (?:an?|the)\s+(?:(?:type|kind|sort|form) of\s+)?(.+?)[.?!]?$/i.exec(prompt.trim());
  return m ? m[1]! : prompt.trim();
}

const search = (q: string) => `${WIKI}?${new URLSearchParams({ search: q, title: 'Special:Search' })}`;

/** The answer plus whichever subject words it doesn't already say ("fissile lock" stays as is; "mutex" gets "lock"). */
export function answerUrl(answer: string, prompt: string): string {
  const has = new Set(answer.toLowerCase().split(/[^\p{L}\p{N}]+/u));
  const extra = promptSubject(prompt).split(/\s+/).filter((w) => !has.has(w.toLowerCase()));
  return search([answer, ...extra].join(' '));
}

/** The prompt's own subject. A one-word subject ("lock", "bug") is ambiguous, so it asks for the computing sense. */
export function questionUrl(prompt: string): string {
  const s = promptSubject(prompt);
  return search(/\s/.test(s) ? s : `${s} (computer science)`);
}
