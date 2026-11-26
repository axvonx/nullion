import { enforce } from './enforce';
import type { TierId } from './tiers';

/** Lowercase, strip diacritics, drop everything that isn't a letter or digit. */
export function normalize(s: string): string {
  return s
    .normalize('NFKD')
    .replace(/\p{M}/gu, '')
    .toLowerCase()
    // Symbols that carry meaning in names (C++, C#, F#) are spelled out before punctuation is dropped.
    .replace(/\+/g, 'plus')
    .replace(/#/g, 'sharp')
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
  | { kind: 'accepted'; entry: CategoryEntry; corrected: boolean }
  | { kind: 'rejected'; normalized: string };

/** Fast lookup over one category's entries. Duplicate keys within a category are a data bug. */
export class CategoryIndex {
  private byKey = new Map<string, CategoryEntry>();

  constructor(readonly entries: readonly CategoryEntry[]) {
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
    if (best && !tie) return { kind: 'accepted', entry: best.entry, corrected: true };
    return { kind: 'rejected', normalized: n };
  }
}
