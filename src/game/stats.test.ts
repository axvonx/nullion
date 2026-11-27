import { describe, expect, it } from 'vitest';
import { buildAnswerSet } from '../core/answers';
import { PROMPTS_PER_DAY } from '../core/layers';
import { TIER_IDS } from '../core/tiers';
import { SAMPLE_QUESTIONS, SAMPLE_TERMS } from '../data/sample';
import { DEBUG_KEY_PREFIX, storageKey } from '../keys';
import { canPersistDaily, dailyKey, type SaveStorage } from './daily-save';
import { READ_MS, Game } from './game';
import { buildShareText, deliverShare, siteUrl } from './share';
import { InvalidStatsError, computeStats, finishDaily, statsKey, type DayResult } from './stats';
import { TIERS } from '../core/tiers';

const set = buildAnswerSet('sample', 'Sample', SAMPLE_TERMS, SAMPLE_QUESTIONS);

class MemStorage implements SaveStorage {
  m = new Map<string, string>();
  get length() {
    return this.m.size;
  }
  key(i: number) {
    return [...this.m.keys()][i] ?? null;
  }
  getItem(k: string) {
    return this.m.get(k) ?? null;
  }
  setItem(k: string, v: string) {
    this.m.set(k, v);
  }
  removeItem(k: string) {
    this.m.delete(k);
  }
}

/** A finished daily game where every round is answered with an entry of `tier` (or missed when no such entry). */
function finished(puzzle: number, tier: 'bitflip' | 'off-by-one' | 'miss' = 'bitflip'): Game {
  const g = new Game(set, puzzle, { timer: true, unlimited: false, autocorrect: 'confirm' });
  let now = 0;
  g.start(now);
  for (let i = 0; i < PROMPTS_PER_DAY; i++) {
    now += READ_MS;
    g.tick(now);
    if (tier === 'miss') {
      g.advance(now); // skipped: a reveal, then on
      if (g.phase.kind === 'between') g.advance(now);
      continue;
    }
    const e = set.entries(g.rounds[i]!.question.id).find((x) => x.tier === tier)!;
    expect(g.submit(e.name, now).kind).toBe('accepted');
    g.advance(now);
  }
  expect(g.phase.kind).toBe('done');
  return g;
}

const day = (d: number): DayResult => ({ d, t: Array(PROMPTS_PER_DAY).fill(null) });

describe('stats', () => {
  it('records a day once: finishing, reloading and replaying never double-count', () => {
    const store = new MemStorage();
    const g = finished(10);
    const a = finishDaily(store, g);
    const b = finishDaily(store, g);
    const c = finishDaily(store, finished(10, 'off-by-one')); // a replay of the same puzzle with other answers
    for (const o of [a, b, c]) {
      expect(o.kind).toBe('ok');
      if (o.kind === 'ok') {
        expect(o.stats.played).toBe(1);
        expect(o.stats.bestDepth).toBe(91);
        expect(o.stats.tiers.bitflip).toBe(PROMPTS_PER_DAY);
      }
    }
  });

  it('computes average, best and the tier distribution across days', () => {
    const store = new MemStorage();
    finishDaily(store, finished(1, 'bitflip')); // 91
    const o = finishDaily(store, finished(2, 'off-by-one')); // 7
    expect(o.kind === 'ok' && o.stats).toMatchObject({ played: 2, avgDepth: 49, bestDepth: 91 });
    if (o.kind === 'ok') {
      expect(o.stats.tiers.bitflip).toBe(7);
      expect(o.stats.tiers['off-by-one']).toBe(7);
      expect(Object.keys(o.stats.tiers)).toEqual([...TIER_IDS]);
    }
  });

  it('a fully missed day counts as played with depth 0 and no tiers', () => {
    const o = finishDaily(new MemStorage(), finished(3, 'miss'));
    expect(o.kind === 'ok' && o.stats).toMatchObject({ played: 1, avgDepth: 0, bestDepth: 0 });
  });

  describe('streaks', () => {
    const days = (...ns: number[]) => Object.fromEntries(ns.map((n) => [n, day(1)]));
    it('counts consecutive puzzle numbers ending today', () => {
      expect(computeStats(days(5, 6, 7), 7)).toMatchObject({ streak: 3, bestStreak: 3 });
    });
    it('a gap resets the current streak but keeps the best', () => {
      expect(computeStats(days(1, 2, 3, 4, 8, 9), 9)).toMatchObject({ streak: 2, bestStreak: 4 });
    });
    it('still alive if the last day played was yesterday, dead after a skipped day', () => {
      expect(computeStats(days(5, 6), 7).streak).toBe(2);
      expect(computeStats(days(5, 6), 8)).toMatchObject({ streak: 0, bestStreak: 2 });
    });
    it('is order independent and handles no history', () => {
      expect(computeStats(days(9, 7, 8), 9).streak).toBe(3);
      expect(computeStats({}, 1)).toMatchObject({ played: 0, streak: 0, bestStreak: 0, avgDepth: 0 });
    });
  });

  it('unavailable storage means no stats, without crashing', () => {
    expect(finishDaily(null, finished(1))).toEqual({ kind: 'none' });
    const throwing = { ...new MemStorage(), getItem: () => { throw new Error('blocked'); } } as unknown as SaveStorage;
    expect(finishDaily(throwing, finished(1))).toEqual({ kind: 'none' });
  });

  it('a full store still reports this session without crashing', () => {
    const s = new MemStorage();
    s.setItem = () => { throw new Error('quota'); };
    const o = finishDaily(s, finished(1));
    expect(o.kind === 'ok' && o.stats.played).toBe(1);
  });

  describe('a corrupt record is reported, not silently dropped', () => {
    for (const [name, raw] of [
      ['bad JSON', '{nope'],
      ['wrong version', '{"v":2,"days":{}}'],
      ['depth not matching tiers', JSON.stringify({ v: 1, days: { 4: { d: 99, t: Array(7).fill('npe') } } })],
      ['unknown tier', JSON.stringify({ v: 1, days: { 4: { d: 0, t: Array(7).fill('zzz') } } })],
      ['wrong round count', JSON.stringify({ v: 1, days: { 4: { d: 0, t: [] } } })],
    ] as const) {
      it(name, () => {
        const store = new MemStorage();
        store.setItem(statsKey(), raw);
        const o = finishDaily(store, finished(5));
        expect(o.kind).toBe('ok');
        if (o.kind === 'ok') {
          expect(o.reset).toBeTruthy();
          expect(o.stats.played).toBe(1); // starts fresh with today's game
        }
        // A second call finds a healthy record and reports nothing.
        const again = finishDaily(store, finished(5));
        expect(again.kind === 'ok' && again.reset).toBeUndefined();
      });
    }
    it('InvalidStatsError is the reported kind', () => {
      expect(new InvalidStatsError('x').name).toBe('InvalidStatsError');
    });
  });

  it('refuses non-daily or unfinished games (invariants)', () => {
    const g = new Game(set, 1, { timer: true, unlimited: false, autocorrect: 'confirm' });
    expect(() => finishDaily(new MemStorage(), g)).toThrow();
    const e = new Game(set, 1, { timer: true, unlimited: false, autocorrect: 'confirm', mode: 'endless' });
    expect(() => finishDaily(new MemStorage(), e)).toThrow();
  });

  it('Endless and debug modes do not count (the same gate as the save)', () => {
    const real = { mode: 'daily' as const, unlimited: false, timer: true, date: '', scroll: false };
    expect(canPersistDaily(real)).toBe(true);
    expect(canPersistDaily({ ...real, mode: 'endless' })).toBe(false);
    expect(canPersistDaily({ ...real, unlimited: true })).toBe(false);
    expect(canPersistDaily({ ...real, timer: false })).toBe(false);
    expect(canPersistDaily({ ...real, date: '2026-01-01' })).toBe(false);
    expect(canPersistDaily({ ...real, scroll: true })).toBe(false);
  });
});

describe('storage keys', () => {
  it('debug builds are namespaced away from production', () => {
    expect(storageKey('stats', false)).toBe('nullion.stats');
    expect(storageKey('stats', true)).toBe(`${DEBUG_KEY_PREFIX}stats`);
    expect(storageKey('prefs', true)).toBe('nullion.debug.prefs');
    expect(statsKey(true)).not.toBe(statsKey(false));
  });
  it('no debug key can collide with, or be pruned as, a production daily save', () => {
    const prodDaily = storageKey('daily.', false);
    expect(storageKey('daily.', true).startsWith(prodDaily)).toBe(false);
    expect(prodDaily.startsWith(DEBUG_KEY_PREFIX)).toBe(false);
  });
  it('the test build is a debug build, so tests never touch production keys', () => {
    expect(dailyKey(1).startsWith(DEBUG_KEY_PREFIX)).toBe(true);
    expect(statsKey().startsWith(DEBUG_KEY_PREFIX)).toBe(true);
  });
});

describe('share text', () => {
  const glyphs = TIER_IDS.map((t) => TIERS[t].glyph).join('') + '⬛';
  const text = buildShareText({ mode: 'daily', puzzle: 12, headline: '40 frames · Kernel', glyphs, url: 'https://x.dev/nullion/' });
  const lines = text.split('\n');
  it('is title, depth and layer, glyph row, URL', () => {
    expect(lines).toEqual(['nullion #12', '40 frames · Kernel', glyphs, 'https://x.dev/nullion/']);
  });
  it('the glyph row has no digits (no frame scores)', () => {
    expect(lines[2]).not.toMatch(/[0-9]/);
  });
  it('the URL has no query string or hash', () => {
    expect(siteUrl({ origin: 'https://x.dev', pathname: '/nullion/' })).toBe('https://x.dev/nullion/');
  });
  it('uses native share when present, clipboard otherwise, and reports failures', async () => {
    const sent: string[] = [];
    expect(await deliverShare('t', { share: async (d) => void sent.push(d.text), clipboard: { writeText: async () => { throw new Error(); } } })).toBe('shared');
    expect(sent).toEqual(['t']);
    const clip: string[] = [];
    expect(await deliverShare('t', { clipboard: { writeText: async (x) => void clip.push(x) } })).toBe('copied');
    expect(clip).toEqual(['t']);
    expect(await deliverShare('t', { share: async () => { throw new Error('nope'); }, clipboard: { writeText: async (x) => void clip.push(x) } })).toBe('copied');
    expect(await deliverShare('t', { share: async () => { throw new DOMException('x', 'AbortError'); } })).toBe('cancelled');
    expect(await deliverShare('t', {})).toBe('failed');
    expect(await deliverShare('t', { clipboard: { writeText: async () => { throw new Error(); } } })).toBe('failed');
  });
});
