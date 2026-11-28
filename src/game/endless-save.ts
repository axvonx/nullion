import { enforce } from '../core/enforce';
import type { StackMode } from '../core/layers';
import { rulesFor } from '../core/modes';
import { storageKey } from '../keys';
import { InvalidSaveError, type Game } from './game';
import type { SaveStorage } from './daily-save';

/**
 * The Endless run save and personal best. One run at a time: `nullion.endless.run` holds the run in progress (its
 * mode, prompt seed, rounds and phase, as `Game.snapshot`), so a reload, a closed tab or a new day resumes it with
 * the same wall-clock deadlines as the daily game. A finished run is removed and its depth kept as the best when it
 * beats it (`nullion.endless.best`). Storage trouble means no persistence, never an error; a save that is present
 * but unusable is removed and reported, like the daily save.
 */
const RUN_KEY = storageKey('endless.run');
const BEST_KEY = storageKey('endless.best');

export interface EndlessBest {
  depth: number;
  /** Answers in that run. */
  rounds: number;
  /** When it ended (wall-clock ms). */
  at: number;
}

/** Only a real Endless run persists: the mode keeps runs, and no debug setting is changing the rules. */
export function canPersistRun(o: { mode: StackMode; unlimited: boolean; timer: boolean; scroll: boolean; outside: boolean }): boolean {
  return rulesFor(o.mode).persistsRun && !o.unlimited && o.timer && !o.scroll && !o.outside;
}

/** The seed of the saved run, so the caller can build its `Game` with it before `loadRun`; null when there is none. */
export function savedRunSeed(storage: SaveStorage | null): number | null {
  if (!storage) return null;
  try {
    const raw = storage.getItem(RUN_KEY);
    if (raw === null) return null;
    const seed = (JSON.parse(raw) as { seed?: unknown }).seed;
    return typeof seed === 'number' && Number.isInteger(seed) ? seed : null;
  } catch {
    return null; // unreadable here; loadRun reports it
  }
}

export type RunLoad = { kind: 'none' } | { kind: 'resumed' } | { kind: 'invalid'; reason: string };

/** Restore the saved run into `game` (not started, built with `savedRunSeed`). */
export function loadRun(storage: SaveStorage | null, game: Game): RunLoad {
  if (!storage) return { kind: 'none' };
  let raw: string | null;
  try {
    raw = storage.getItem(RUN_KEY);
  } catch {
    return { kind: 'none' };
  }
  if (raw === null) return { kind: 'none' };
  try {
    game.restore(JSON.parse(raw));
    return { kind: 'resumed' };
  } catch (e) {
    const reason = e instanceof InvalidSaveError ? e.message : e instanceof SyntaxError ? `not valid JSON (${e.message})` : null;
    if (reason === null) throw e; // a real bug in restore(), not a bad save
    clearRun(storage);
    return { kind: 'invalid', reason };
  }
}

/**
 * Write the run in progress. When it has ended, drop it and keep its depth if it is the best; returns the new best
 * then (so the end card can say so), otherwise null.
 */
export function saveRun(storage: SaveStorage | null, game: Game, now: number): EndlessBest | null {
  if (!storage) return null;
  enforce(game.rules.persistsRun, `saveRun on a ${game.mode} game`);
  if (game.phase.kind === 'ready') return null;
  try {
    if (game.phase.kind !== 'done') {
      storage.setItem(RUN_KEY, JSON.stringify(game.snapshot()));
      return null;
    }
    storage.removeItem(RUN_KEY);
    const prev = loadBest(storage);
    if (prev.kind === 'best' && prev.best.depth >= game.depth) return null;
    const best: EndlessBest = { depth: game.depth, rounds: game.rounds.filter((r) => r.locked).length, at: now };
    storage.setItem(BEST_KEY, JSON.stringify(best));
    return best;
  } catch {
    return null; // quota or blocked storage is an expected condition
  }
}

/** Is there a run to resume? */
export function hasRun(storage: SaveStorage | null): boolean {
  if (!storage) return false;
  try {
    return storage.getItem(RUN_KEY) !== null;
  } catch {
    return false;
  }
}

export function clearRun(storage: SaveStorage | null): void {
  if (!storage) return;
  try {
    storage.removeItem(RUN_KEY);
  } catch {
    /* unavailable storage */
  }
}

export type BestLoad = { kind: 'none' } | { kind: 'best'; best: EndlessBest } | { kind: 'invalid'; reason: string };

/** The personal best. One that is stored but malformed is removed and reported, like a bad save. */
export function loadBest(storage: SaveStorage | null): BestLoad {
  if (!storage) return { kind: 'none' };
  let raw: string | null;
  try {
    raw = storage.getItem(BEST_KEY);
  } catch {
    return { kind: 'none' };
  }
  if (raw === null) return { kind: 'none' };
  let b: Partial<EndlessBest> | null = null;
  try {
    b = JSON.parse(raw) as Partial<EndlessBest>;
  } catch {
    /* reported below */
  }
  if (b && typeof b.depth === 'number' && typeof b.rounds === 'number' && typeof b.at === 'number')
    return { kind: 'best', best: { depth: b.depth, rounds: b.rounds, at: b.at } };
  try {
    storage.removeItem(BEST_KEY);
  } catch {
    /* unavailable storage */
  }
  return { kind: 'invalid', reason: `the stored Endless best was not a record: ${raw.slice(0, 80)}` };
}

/** A fresh run's prompt seed. */
export function newRunSeed(): number {
  const a = new Uint32Array(1);
  crypto.getRandomValues(a);
  return a[0]!;
}
