import { enforce } from './enforce';
import type { TierId } from './tiers';

/** Lowercase, strip diacritics, drop everything that isn't a letter or digit. */
export function normalize(s: string): string {
  return s
    .normalize('NFKD')
    .replace(/\p{M}/gu, '')
    .toLowerCase()
    // Symbols that carry meaning in names (C++, C#, F#, MIP*, A*) are spelled out before punctuation is dropped.
    .replace(/\+/g, 'plus')
    .replace(/#/g, 'sharp')
    .replace(/\*/g, 'star')
    .replace(/[^\p{L}\p{N}]/gu, '');
}

/** Edit distance where swapping two adjacent letters counts as one typo (optimal string alignment). */
export function editDistance(a: string, b: string): number {
  if (a === b) return 0;
  const w = b.length + 1;
  const d = new Array<number>((a.length + 1) * w);
  for (let i = 0; i <= a.length; i++) d[i * w] = i;
  for (let j = 0; j <= b.length; j++) d[j] = j;
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      let v = Math.min(d[(i - 1) * w + j]! + 1, d[i * w + j - 1]! + 1, d[(i - 1) * w + j - 1]! + cost);
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) v = Math.min(v, d[(i - 2) * w + j - 2]! + 1);
      d[i * w + j] = v;
    }
  }
  return d[a.length * w + b.length]!;
}

/** How many typos we forgive, by normalized length. Short words get none: "mcs" vs "cna" must not collide. */
export function typoBudget(len: number): number {
  if (len >= 9) return 2;
  if (len >= 5) return 1;
  return 0;
}

/** A four-letter guess is forgiven only a swap of two adjacent letters ("etx4"), never a changed letter ("ext3"). */
function isAdjacentSwap(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  const diff: number[] = [];
  for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) diff.push(i);
  return diff.length === 2 && diff[1] === diff[0]! + 1 && a[diff[0]!] === b[diff[1]!] && a[diff[1]!] === b[diff[0]!];
}

/** A one-typo correction of a name this long is accepted without asking, even when the player asked to confirm. */
export const SURE_CORRECTION_LEN = 7;

/** "Name a type of lock" → "lock": what kind of thing the prompt asks for. Other phrasings are kept whole. */
export function promptSubject(prompt: string): string {
  const m = /^name (?:an?|the)\s+(?:(?:type|kind|sort|form) of\s+)?(.+?)[.?!]?$/i.exec(prompt.trim());
  return m ? m[1]! : prompt.trim();
}

/** Nouns a player may tack onto an answer whatever the prompt ("quicksort algorithm", "ext4 filesystem"). */
const GENERIC_TAILS = [
  'algorithm', 'algo', 'language', 'lang', 'filesystem', 'file system', 'fs', 'format', 'file format', 'protocol',
  'scheme', 'function', 'command', 'tool', 'module', 'extension', 'license', 'licence', 'os', 'operating system',
  'attack', 'cipher', 'allocator', 'technique',
];

/** Singular forms of a plural word ("mutexes" → "mutex", "queries" → "query", "trees" → "tree"); none for others. */
function singular(word: string): string[] {
  const out: string[] = [];
  if (word.length > 4 && word.endsWith('ies')) out.push(word.slice(0, -3) + 'y');
  if (word.length > 3 && /(s|x|z|ch|sh)es$/.test(word)) out.push(word.slice(0, -2));
  // "ss" too: an acronym's plural ("HFSs" → "HFS"). Safe, since a candidate only counts when it is an answer's name.
  if (word.length > 3 && word.endsWith('s')) out.push(word.slice(0, -1));
  return out;
}

/**
 * The ways a player says the same answer that aren't typos, as normalized candidates in two rounds, smallest change
 * first: (1) a leading article dropped ("a mutex", "the Linux kernel") or a plural made singular ("mutexes",
 * "B-trees"); (2) as well, the prompt's own noun or a generic one dropped off the end ("mutex lock", "ext4
 * filesystem"). A guess that round 1 already resolves never reaches round 2, so "tree locks" is "tree lock", not
 * "tree".
 */
export function phrasings(guess: string, tails: readonly string[]): [string[], string[]] {
  const words = guess.toLowerCase().trim().split(/\s+/).filter(Boolean);
  const light = new Set<string>();
  const heavy = new Set<string>();
  const add = (into: Set<string>, ws: string[]) => {
    if (ws.length === 0) return;
    into.add(normalize(ws.join(' ')));
    for (const s of singular(ws[ws.length - 1]!)) into.add(normalize([...ws.slice(0, -1), s].join(' ')));
  };
  const bases = [words];
  if (words.length > 1 && ['a', 'an', 'the'].includes(words[0]!)) bases.push(words.slice(1));
  for (const ws of bases) {
    add(light, ws);
    for (const tail of tails) {
      const tw = tail.toLowerCase().split(/\s+/);
      if (ws.length <= tw.length) continue;
      const end = ws.slice(-tw.length);
      // The tail itself may be plural ("mutex locks").
      if (end.every((w, i) => w === tw[i] || (i === tw.length - 1 && singular(w).includes(tw[i]!)))) add(heavy, ws.slice(0, -tw.length));
    }
  }
  const keep = (set: Set<string>) => [...set].filter((f) => f.length > 0);
  return [keep(light), keep(heavy).filter((f) => !light.has(f))];
}

export interface CategoryEntry {
  /** Display name. */
  name: string;
  tier: TierId;
  /** Normalized keys this entry answers to (name + aliases). */
  keys: string[];
  /** Optional note shown after landing it. */
  note?: string;
}

export type CheckResult =
  /** `corrected`: a typo was fixed. `sure`: one typo on a long name, needing no confirmation. */
  | { kind: 'accepted'; entry: CategoryEntry; corrected: boolean; sure?: boolean }
  | { kind: 'rejected'; normalized: string };

/** Fast lookup over one category's entries. Duplicate keys within a category are a data bug. */
export class CategoryIndex {
  private byKey = new Map<string, CategoryEntry>();
  /** Nouns stripped off the end of a guess: the prompt's subject ("lock", "memory allocator") and generic ones. */
  private readonly tails: readonly string[];

  constructor(
    readonly entries: readonly CategoryEntry[],
    prompt?: string,
  ) {
    const subject = prompt ? promptSubject(prompt).toLowerCase() : undefined;
    const head = subject?.split(/\s+/).at(-1);
    // Longest first, so "memory allocator" is tried before "allocator".
    this.tails = [...new Set([...(subject ? [subject] : []), ...(head ? [head] : []), ...GENERIC_TAILS])].sort((a, b) => b.length - a.length);
    for (const e of entries) {
      enforce(e.keys.length > 0, `entry ${e.name} has no keys`);
      for (const k of e.keys) {
        enforce(k.length > 0, `entry ${e.name} has an empty key`);
        const prior = this.byKey.get(k);
        enforce(!prior || prior === e, `key "${k}" claimed by both "${prior?.name}" and "${e.name}"`);
        this.byKey.set(k, e);
      }
    }
  }

  check(guess: string): CheckResult {
    const n = normalize(guess);
    if (n.length === 0) return { kind: 'rejected', normalized: n };
    const exact = this.byKey.get(n);
    if (exact) return { kind: 'accepted', entry: exact, corrected: false };

    // Same answer, other phrasing (article, plural, then the prompt's noun on the end): exact, if a round names
    // exactly one entry. Two entries in a round is ambiguous: rejected rather than guessed.
    for (const round of phrasings(guess, this.tails)) {
      const hits = new Set<CategoryEntry>();
      for (const f of round) {
        const e = this.byKey.get(f);
        if (e) hits.add(e);
      }
      if (hits.size === 1) return { kind: 'accepted', entry: [...hits][0]!, corrected: false };
      if (hits.size > 1) return { kind: 'rejected', normalized: n };
    }

    if (n.length === 4) {
      // Four letters: only an adjacent swap, and only if it names one entry.
      const swaps = new Set<CategoryEntry>();
      for (const [k, e] of this.byKey) if (isAdjacentSwap(n, k)) swaps.add(e);
      return swaps.size === 1 ? { kind: 'accepted', entry: [...swaps][0]!, corrected: true } : { kind: 'rejected', normalized: n };
    }

    const budget = typoBudget(n.length);
    if (budget === 0) return { kind: 'rejected', normalized: n };
    let best: { entry: CategoryEntry; d: number } | undefined;
    let tie = false;
    for (const [k, e] of this.byKey) {
      if (Math.abs(k.length - n.length) > budget) continue;
      const d = editDistance(n, k);
      if (d > budget) continue;
      if (!best || d < best.d) {
        best = { entry: e, d };
        tie = false;
      } else if (d === best.d && best.entry !== e) {
        tie = true;
      }
    }
    // An ambiguous typo is rejected rather than guessed: better a retry than a wrong answer.
    if (best && !tie) return { kind: 'accepted', entry: best.entry, corrected: true, sure: best.d === 1 && n.length >= SURE_CORRECTION_LEN };
    return { kind: 'rejected', normalized: n };
  }
}
