import { enforce } from './enforce';

/** Day #1. Puzzle numbers count local calendar days from here (Wordle-style local rollover). */
export const EPOCH = { y: 2026, m: 11, d: 26 } as const;

/** Days between two local calendar dates, ignoring DST by working in UTC on the calendar fields. */
function dayOrdinal(y: number, m: number, d: number): number {
  return Math.floor(Date.UTC(y, m - 1, d) / 86_400_000);
}

export function puzzleNumber(date: Date): number {
  const n = dayOrdinal(date.getFullYear(), date.getMonth() + 1, date.getDate()) - dayOrdinal(EPOCH.y, EPOCH.m, EPOCH.d) + 1;
  return n;
}

/** Parse "YYYY-MM-DD" as a local date. */
export function parseLocalDate(s: string): Date {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s);
  enforce(m, `bad date string ${s}`);
  return new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
}

export function formatLocalDate(d: Date): string {
  const p = (x: number) => String(x).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

/** mulberry32: tiny deterministic PRNG so every player gets the same order for a given day. */
export function rng(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Pick `count` distinct items for a puzzle number, deterministically. */
export function pickForDay<T>(pool: readonly T[], puzzle: number, count: number): T[] {
  enforce(pool.length >= count, `question pool has ${pool.length}, need ${count}`);
  const r = rng(puzzle * 2654435761);
  const a = pool.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(r() * (i + 1));
    [a[i], a[j]] = [a[j]!, a[i]!];
  }
  return a.slice(0, count);
}
