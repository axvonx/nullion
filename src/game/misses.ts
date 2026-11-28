import { normalize } from '../core/match';
import { storageKey } from '../keys';
import type { SaveStorage } from './daily-save';

/**
 * The missed-guesses log: every guess the bank rejected (typed, or submitted by the watchdog), kept on this device
 * only, so the owner can copy them out (Settings → Missed guesses) and feed them to `scripts/bank/misses.py`, which
 * checks each and adds the real ones to that category's Inbox. Repeats of a guess to the same prompt are counted,
 * not stored twice. Nothing leaves the device unless the player copies it.
 */
const KEY = storageKey('misses');
/** Most distinct misses kept; past it the oldest go (a log, not a record). */
export const MAX_MISSES = 5000;

export interface Miss {
  /** The prompt's question id (the bank category). */
  q: string;
  prompt: string;
  guess: string;
  /** How many times it was guessed. */
  n: number;
  /** Last time (wall-clock ms). */
  at: number;
}

export type MissesLoad = { kind: 'ok'; misses: Miss[] } | { kind: 'invalid'; reason: string };

function isMiss(x: unknown): x is Miss {
  const m = x as Partial<Miss>;
  return typeof m === 'object' && m !== null && typeof m.q === 'string' && typeof m.prompt === 'string' &&
    typeof m.guess === 'string' && typeof m.n === 'number' && typeof m.at === 'number';
}

/** The log. Unavailable storage is an empty log; a log that is there but unreadable is removed and reported. */
export function loadMisses(storage: SaveStorage | null): MissesLoad {
  if (!storage) return { kind: 'ok', misses: [] };
  let raw: string | null;
  try {
    raw = storage.getItem(KEY);
  } catch {
    return { kind: 'ok', misses: [] };
  }
  if (raw === null) return { kind: 'ok', misses: [] };
  try {
    const v = JSON.parse(raw) as unknown;
    if (Array.isArray(v) && v.every(isMiss)) return { kind: 'ok', misses: v };
  } catch {
    /* reported below */
  }
  clearMisses(storage);
  return { kind: 'invalid', reason: 'the missed-guesses log was not readable and has been cleared' };
}

/** Add a rejected guess (counted if this prompt already has it). Storage trouble just means it isn't kept. */
export function recordMiss(storage: SaveStorage | null, miss: { q: string; prompt: string; guess: string; at: number }): void {
  if (!storage || !normalize(miss.guess)) return;
  const loaded = loadMisses(storage);
  const misses = loaded.kind === 'ok' ? loaded.misses : [];
  const key = normalize(miss.guess);
  const same = misses.find((m) => m.q === miss.q && normalize(m.guess) === key);
  if (same) {
    same.n += 1;
    same.at = miss.at;
  } else {
    misses.push({ ...miss, guess: miss.guess.trim(), n: 1 });
    if (misses.length > MAX_MISSES) misses.splice(0, misses.length - MAX_MISSES);
  }
  try {
    storage.setItem(KEY, JSON.stringify(misses));
  } catch {
    /* quota or blocked storage is an expected condition */
  }
}

export function clearMisses(storage: SaveStorage | null): void {
  if (!storage) return;
  try {
    storage.removeItem(KEY);
  } catch {
    /* unavailable storage */
  }
}

/**
 * The log as Markdown for `scripts/bank/misses.py`: one `## <question id> · <prompt>` section per prompt, then
 * `- <guess> · ×<n>` lines, most-guessed first.
 */
export function missesMarkdown(misses: readonly Miss[], copiedAt: Date): string {
  const byQ = new Map<string, Miss[]>();
  for (const m of misses) byQ.set(m.q, [...(byQ.get(m.q) ?? []), m]);
  const out = [`# nullion missed guesses (copied ${copiedAt.toISOString().slice(0, 10)})`, ''];
  for (const [q, ms] of [...byQ].sort((a, b) => a[0].localeCompare(b[0]))) {
    out.push(`## ${q} · ${ms[0]!.prompt}`);
    for (const m of [...ms].sort((a, b) => b.n - a.n || a.guess.localeCompare(b.guess))) out.push(`- ${m.guess} · ×${m.n}`);
    out.push('');
  }
  return out.join('\n');
}
