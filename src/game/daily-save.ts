import { enforce } from '../core/enforce';
import type { StackMode } from '../core/layers';
import { storageKey } from '../keys';
import { Game, InvalidSaveError } from './game';

/** The slice of Storage the daily save needs. `null` means storage is unavailable (an expected condition). */
export type SaveStorage = Pick<Storage, 'getItem' | 'setItem' | 'removeItem' | 'key' | 'length'>;

const PREFIX = storageKey('daily.');
export const dailyKey = (puzzle: number) => `${PREFIX}${puzzle}`;

/**
 * Only the real daily game persists. Endless and every debug mode (unlimited, a chosen date, no timer, scroll-only)
 * neither read nor write the save, so they can never clobber or be polluted by a real day.
 */
export function canPersistDaily(o: { mode: StackMode; unlimited: boolean; timer: boolean; date: string; scroll: boolean }): boolean {
  return o.mode === 'daily' && !o.unlimited && o.timer && o.date === '' && !o.scroll;
}

export type DailyLoad =
  | { kind: 'none' }
  | { kind: 'resumed' }
  /** A save existed but was unusable. It has been removed; the caller must tell the player. */
  | { kind: 'invalid'; reason: string };

/**
 * Restore today's saved game into `game` (which must not have started). Storage trouble (unavailable, a throwing
 * getItem) is treated as "no save". A save that is present but unreadable is reported, never silently dropped.
 */
export function loadDaily(storage: SaveStorage | null, game: Game): DailyLoad {
  if (!storage) return { kind: 'none' };
  let raw: string | null;
  try {
    raw = storage.getItem(dailyKey(game.puzzle));
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
    try {
      storage.removeItem(dailyKey(game.puzzle));
    } catch {
      /* unavailable storage: nothing more to clean */
    }
    return { kind: 'invalid', reason };
  }
}

/** Write today's state and drop saves from earlier days. A full or blocked store just means no persistence. */
export function saveDaily(storage: SaveStorage | null, game: Game): void {
  if (!storage) return;
  enforce(game.mode === 'daily', 'saveDaily on a non-daily game');
  if (game.phase.kind === 'ready') return;
  try {
    const mine = dailyKey(game.puzzle);
    storage.setItem(mine, JSON.stringify(game.snapshot()));
    const stale: string[] = [];
    for (let i = 0; i < storage.length; i++) {
      const k = storage.key(i);
      if (k && k.startsWith(PREFIX) && k !== mine) stale.push(k);
    }
    for (const k of stale) storage.removeItem(k);
  } catch {
    /* quota or blocked storage is an expected condition */
  }
}

/** Browser storage, or null when it is unavailable (private mode, blocked site data). */
export function browserStorage(): SaveStorage | null {
  try {
    return typeof localStorage === 'undefined' ? null : localStorage;
  } catch {
    return null;
  }
}
