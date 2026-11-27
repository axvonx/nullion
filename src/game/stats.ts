import { enforce } from '../core/enforce';
import { MAX_DEPTH, PROMPTS_PER_DAY } from '../core/layers';
import { TIERS, TIER_IDS, type TierId } from '../core/tiers';
import { storageKey } from '../keys';
import type { Game } from './game';
import type { SaveStorage } from './daily-save';

/**
 * Lifetime stats. One compact record per finished daily game, kept apart from the daily save (which prunes old days).
 * Aggregates are recomputed from the records, never stored, so a replay can never double-count.
 */
export interface DayResult {
  /** Final depth in frames. */
  d: number;
  /** The tier of each round's answer, or null for a missed round. */
  t: (TierId | null)[];
}

interface StatsFile {
  v: 1;
  days: Record<string, DayResult>;
}

export interface Stats {
  played: number;
  /** Consecutive puzzle numbers ending at today or yesterday; 0 once a day has been skipped. */
  streak: number;
  bestStreak: number;
  avgDepth: number;
  bestDepth: number;
  /** Every accepted answer, by tier. */
  tiers: Record<TierId, number>;
}

export type StatsOutcome =
  /** Storage is unavailable (an expected condition): show no stats section. */
  | { kind: 'none' }
  /** `reset` is set when an unreadable record was discarded; the caller must tell the player. */
  | { kind: 'ok'; stats: Stats; reset?: string };

export const statsKey = (debug?: boolean) => storageKey('stats', debug);

export class InvalidStatsError extends Error {
  constructor(reason: string) {
    super(reason);
    this.name = 'InvalidStatsError';
  }
}

function parse(raw: string): StatsFile {
  let j: unknown;
  try {
    j = JSON.parse(raw);
  } catch (e) {
    throw new InvalidStatsError(`not valid JSON (${(e as Error).message})`);
  }
  const bad = (why: string): never => {
    throw new InvalidStatsError(why);
  };
  if (typeof j !== 'object' || j === null) return bad('not an object');
  const f = j as { v?: unknown; days?: unknown };
  if (f.v !== 1) return bad(`unknown version ${String(f.v)}`);
  if (typeof f.days !== 'object' || f.days === null || Array.isArray(f.days)) return bad('days missing');
  for (const [k, v] of Object.entries(f.days)) {
    if (!/^\d+$/.test(k)) return bad(`bad puzzle number ${k}`);
    const r = v as Partial<DayResult> | null;
    if (!r || typeof r.d !== 'number' || !Number.isInteger(r.d) || r.d < 0 || r.d > MAX_DEPTH) return bad(`#${k}: bad depth`);
    if (!Array.isArray(r.t) || r.t.length !== PROMPTS_PER_DAY) return bad(`#${k}: wrong number of rounds`);
    let sum = 0;
    for (const t of r.t) {
      if (t === null) continue;
      if (typeof t !== 'string' || !(TIER_IDS as readonly string[]).includes(t)) return bad(`#${k}: unknown tier`);
      sum += TIERS[t as TierId].frames;
    }
    if (sum !== r.d) return bad(`#${k}: depth does not match tiers`);
  }
  return j as StatsFile;
}

/** Pure: aggregates from the per-day records. `today` is the puzzle number the streak is measured against. */
export function computeStats(days: Record<string, DayResult>, today: number): Stats {
  const nums = Object.keys(days)
    .map(Number)
    .sort((a, b) => a - b);
  const tiers = Object.fromEntries(TIER_IDS.map((t) => [t, 0])) as Record<TierId, number>;
  let sum = 0;
  let best = 0;
  for (const n of nums) {
    const r = days[n]!;
    sum += r.d;
    best = Math.max(best, r.d);
    for (const t of r.t) if (t) tiers[t]++;
  }
  let bestStreak = 0;
  let run = 0;
  let prev = -Infinity;
  for (const n of nums) {
    run = n === prev + 1 ? run + 1 : 1;
    bestStreak = Math.max(bestStreak, run);
    prev = n;
  }
  // `run` is now the run ending at the latest day; it is the current streak only if that day is today or yesterday.
  const streak = nums.length > 0 && prev >= today - 1 ? run : 0;
  return {
    played: nums.length,
    streak,
    bestStreak,
    avgDepth: nums.length ? Math.round(sum / nums.length) : 0,
    bestDepth: best,
    tiers,
  };
}

/**
 * Called when a real daily game is done: write its record once (keyed by puzzle number, so a reload or replay is a
 * no-op), then return the lifetime stats. A corrupt record is removed and reported via `reset`, like the daily save.
 */
export function finishDaily(storage: SaveStorage | null, game: Game, key: string = statsKey()): StatsOutcome {
  if (!storage) return { kind: 'none' };
  enforce(game.mode === 'daily', 'finishDaily on a non-daily game');
  enforce(game.phase.kind === 'done', `finishDaily while ${game.phase.kind}`);
  let file: StatsFile = { v: 1, days: {} };
  let reset: string | undefined;
  try {
    const raw = storage.getItem(key);
    if (raw !== null) file = parse(raw);
  } catch (e) {
    if (e instanceof InvalidStatsError) {
      reset = e.message;
      try {
        storage.removeItem(key);
      } catch {
        /* unavailable storage: nothing more to clean */
      }
    } else {
      return { kind: 'none' }; // a throwing getItem: storage trouble, an expected condition
    }
  }
  const id = String(game.puzzle);
  if (!file.days[id]) {
    file.days[id] = { d: game.depth, t: game.rounds.map((r) => r.locked?.entry.tier ?? null) };
    try {
      storage.setItem(key, JSON.stringify(file));
    } catch {
      /* quota or blocked storage is an expected condition; this session still shows what it has */
    }
  }
  return { kind: 'ok', stats: computeStats(file.days, game.puzzle), ...(reset !== undefined ? { reset } : {}) };
}
