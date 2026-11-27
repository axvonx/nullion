import { describe, expect, it } from 'vitest';
import { buildAnswerSet } from '../core/answers';
import { SAMPLE_QUESTIONS, SAMPLE_TERMS } from '../data/sample';
import { ANSWER_MS, ENDLESS_MAX_STRIKES, Game, InvalidSaveError, READ_MS, endlessAnswerMs } from './game';
import { browserStorage, canPersistDaily, dailyKey, loadDaily, saveDaily, type SaveStorage } from './daily-save';

const set = buildAnswerSet('sample', 'Sample', SAMPLE_TERMS, SAMPLE_QUESTIONS);

function bitflipFor(g: Game, round: number) {
  return set.entries(g.rounds[round]!.question.id).find((e) => e.tier === 'bitflip')!.name;
}

describe('game loop', () => {
  it('a perfect day reaches depth 91', () => {
    const g = new Game(set, 1, { timer: true, unlimited: false, autocorrect: 'confirm' });
    let now = 0;
    g.start(now);
    for (let i = 0; i < 7; i++) {
      now += READ_MS;
      g.tick(now);
      expect(g.submit(bitflipFor(g, i), now).kind).toBe('accepted');
      g.advance(now); // "Unwind further"
    }
    expect(g.phase.kind).toBe('done');
    expect(g.depth).toBe(91);
  });

  it('the watchdog times a round out with no frames', () => {
    const g = new Game(set, 1, { timer: true, unlimited: false, autocorrect: 'confirm' });
    g.start(0);
    g.tick(READ_MS);
    g.tick(READ_MS + ANSWER_MS);
    expect(g.rounds[0]!.timedOut).toBe(true);
    expect(g.depth).toBe(0);
  });

  describe('the watchdog submits what is in the box', () => {
    /** A timed game parked in the answering phase of the "lock" round (Bit Flip: "fissile lock"). */
    function atLock(draft: string) {
      const g = new Game(set, 1, { timer: true, unlimited: false, autocorrect: 'confirm' });
      const target = g.rounds.findIndex((r) => r.question.id === 'lock');
      expect(target).toBeGreaterThanOrEqual(0);
      let now = 0;
      g.start(now);
      for (let i = 0; i < target; i++) {
        now += READ_MS;
        g.tick(now);
        g.advance(now);
        g.advance(now);
      }
      now += READ_MS;
      g.tick(now);
      g.draft = () => draft;
      g.tick(now + ANSWER_MS);
      return { g, r: g.rounds[target]! };
    }

    it('an accepted draft locks the round instead of timing out', () => {
      const { g, r } = atLock('  fissile lock ');
      expect(r.locked).toMatchObject({ corrected: false, guess: 'fissile lock' });
      expect(r.locked!.entry.name).toBe('fissile lock');
      expect(r.timedOut).toBe(false);
      expect(r.buzzer).toEqual({ guess: 'fissile lock', accepted: true });
      expect(g.depth).toBe(13);
    });

    it('a typo is corrected even in confirm mode (there is no time left to confirm)', () => {
      const { r } = atLock('fisile lock');
      expect(r.locked).toMatchObject({ corrected: true, guess: 'fisile lock' });
      expect(r.timedOut).toBe(false);
    });

    it('a miss is logged as a rejected guess and the round times out', () => {
      const { g, r } = atLock('not a lock at all');
      expect(r.locked).toBeUndefined();
      expect(r.timedOut).toBe(true);
      expect(r.rejected).toEqual(['not a lock at all']);
      expect(r.buzzer).toEqual({ guess: 'not a lock at all', accepted: false });
      expect(g.depth).toBe(0);
    });

    it('an empty box just times out', () => {
      const { r } = atLock('   ');
      expect(r.timedOut).toBe(true);
      expect(r.rejected).toEqual([]);
      expect(r.buzzer).toBeUndefined();
    });
  });

  it('rejected guesses are recorded and retries are unlimited', () => {
    const g = new Game(set, 1, { timer: true, unlimited: false, autocorrect: 'confirm' });
    g.start(0);
    g.tick(READ_MS);
    expect(g.submit('definitely not an answer', READ_MS).kind).toBe('rejected');
    expect(g.submit('also not', READ_MS).kind).toBe('rejected');
    expect(g.rounds[0]!.rejected).toEqual(['definitely not an answer', 'also not']);
    expect(g.phase.kind).toBe('answering');
  });

  it('unlimited mode keeps the round open but only the first answer pushes frames', () => {
    const g = new Game(set, 1, { timer: false, unlimited: true, autocorrect: 'confirm' });
    g.start(0);
    g.tick(READ_MS);
    const entries = set.entries(g.rounds[0]!.question.id);
    const a = g.submit(entries[0]!.name, READ_MS);
    const b = g.submit(entries[1]!.name, READ_MS);
    expect(a).toMatchObject({ kind: 'accepted' });
    expect(b).toMatchObject({ kind: 'accepted', pushed: 0 });
    expect(g.phase.kind).toBe('answering');
  });

  it('the reveal waits for the player: no timer advances the between phase', () => {
    const g = new Game(set, 1, { timer: true, unlimited: false, autocorrect: 'confirm' });
    g.start(0);
    g.tick(READ_MS);
    g.submit(bitflipFor(g, 0), READ_MS);
    expect(g.phase.kind).toBe('between');
    g.tick(READ_MS + 10 * 60_000);
    expect(g.phase.kind).toBe('between');
    g.advance(READ_MS + 10 * 60_000);
    expect(g.phase).toMatchObject({ kind: 'reading', round: 1 });
  });

  describe('autocorrect', () => {
    // "Fissile lock" is the lock Bit Flip; a one-letter typo is within the typo budget.
    const lockRound = (g: Game) => g.rounds.findIndex((r) => r.question.id === 'lock');

    function atLockRound(mode: 'confirm' | 'auto') {
      const g = new Game(set, 1, { timer: false, unlimited: false, autocorrect: mode });
      const target = lockRound(g);
      expect(target).toBeGreaterThanOrEqual(0);
      let now = 0;
      g.start(now);
      for (let i = 0; i < target; i++) {
        now += READ_MS;
        g.tick(now);
        g.advance(now); // skip the round
        g.advance(now); // past its reveal
      }
      now += READ_MS;
      g.tick(now);
      expect(g.current()!.question.id).toBe('lock');
      return { g, now };
    }

    it('confirm mode suggests the correction without locking or logging a rejection', () => {
      const { g, now } = atLockRound('confirm');
      const res = g.submit('fisile lock', now);
      expect(res).toMatchObject({ kind: 'suggestion', guess: 'fisile lock' });
      expect(res.kind === 'suggestion' && res.entry.name).toBe('fissile lock');
      expect(g.phase.kind).toBe('answering');
      expect(g.current()!.locked).toBeUndefined();
      expect(g.current()!.rejected).toEqual([]);
      // Submitting the suggested name is an exact match.
      expect(g.submit('fissile lock', now)).toMatchObject({ kind: 'accepted', corrected: false });
    });

    it('auto mode accepts the corrected answer straight away', () => {
      const { g, now } = atLockRound('auto');
      expect(g.submit('fisile lock', now)).toMatchObject({ kind: 'accepted', corrected: true });
      expect(g.phase.kind).toBe('between');
    });

    it('a preference change applies mid-game', () => {
      const { g, now } = atLockRound('confirm');
      g.opts.autocorrect = 'auto';
      expect(g.submit('fisile lock', now)).toMatchObject({ kind: 'accepted', corrected: true });
    });
  });

  describe('endless mode (3-strike watchdog)', () => {
    it('continues past 7 rounds with anti-repeat prompts and ends on the 3rd watchdog strike', () => {
      const g = new Game(set, 42, { timer: true, unlimited: false, autocorrect: 'confirm', mode: 'endless' });
      expect(g.mode).toBe('endless');
      expect(g.strikes).toBe(0);
      expect(g.strikesLeft).toBe(ENDLESS_MAX_STRIKES);
      let now = 0;
      g.start(now);

      // Play 10 successful rounds (more than a daily's 7!) without repeating back-to-back
      let prevId = '';
      for (let i = 0; i < 10; i++) {
        now += READ_MS;
        g.tick(now);
        const qid = g.current()!.question.id;
        expect(qid).not.toBe(prevId);
        prevId = qid;
        expect(g.submit(bitflipFor(g, i), now).kind).toBe('accepted');
        g.advance(now);
        expect(g.phase).toMatchObject({ kind: 'reading', round: i + 1 });
      }
      expect(g.depth).toBe(130);
      expect(g.strikes).toBe(0);

      // Now burn 3 watchdog strikes
      for (let s = 1; s <= ENDLESS_MAX_STRIKES; s++) {
        now += READ_MS;
        g.tick(now);
        now += g.answerMs;
        g.tick(now);
        expect(g.strikes).toBe(s);
        expect(g.strikesLeft).toBe(ENDLESS_MAX_STRIKES - s);
        g.advance(now);
      }
      expect(g.phase.kind).toBe('done');
    });

    it('tightens the per-prompt watchdog timer at deeper layers', () => {
      expect(endlessAnswerMs(0)).toBe(30000);
      expect(endlessAnswerMs(700)).toBe(25000);
      expect(endlessAnswerMs(1500)).toBe(20000);
      expect(endlessAnswerMs(2200)).toBe(16000);
    });
  });
});


class MemStorage implements SaveStorage {
  private m = new Map<string, string>();
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

const OPTS = { timer: true, unlimited: false, autocorrect: 'confirm' } as const;
const fresh = (puzzle = 1) => new Game(set, puzzle, { ...OPTS });

/** Simulate closing the page: only what is in storage survives into a brand new Game. */
function reload(store: SaveStorage, puzzle = 1) {
  const g = fresh(puzzle);
  const res = loadDaily(store, g);
  return { g, res };
}

describe('daily save and resume', () => {
  it('save then reload gives identical state', () => {
    const store = new MemStorage();
    const g = fresh();
    g.start(1000);
    g.tick(1000 + READ_MS);
    g.submit('definitely not an answer', 1000 + READ_MS + 50);
    g.submit(bitflipFor(g, 0), 1000 + READ_MS + 100);
    g.advance(1000 + READ_MS + 200);
    g.tick(1000 + 2 * READ_MS + 200);
    g.advance(1000 + 2 * READ_MS + 300); // round 1 skipped
    saveDaily(store, g);
    const { g: g2, res } = reload(store);
    expect(res.kind).toBe('resumed');
    expect(g2.snapshot()).toEqual(g.snapshot());
    expect(g2.depth).toBe(g.depth);
    expect(g2.phase).toEqual(g.phase);
    expect(g2.rounds.map((r) => [r.locked?.entry.name, r.rejected, r.timedOut, r.missed])).toEqual(
      g.rounds.map((r) => [r.locked?.entry.name, r.rejected, r.timedOut, r.missed]),
    );
  });

  it('a deadline that passed while away becomes a timeout, even across the reading phase', () => {
    const store = new MemStorage();
    const g = fresh();
    g.start(0);
    g.tick(READ_MS);
    saveDaily(store, g);
    const { g: g2 } = reload(store);
    expect(g2.phase).toMatchObject({ kind: 'answering', until: READ_MS + ANSWER_MS });
    expect(g2.tick(READ_MS + ANSWER_MS + 60_000)).toBe(true);
    expect(g2.rounds[0]!.timedOut).toBe(true);
    expect(g2.phase).toEqual({ kind: 'between', round: 0 });
    // Closed during reading and reopened long after both the reading and the answer window.
    const store2 = new MemStorage();
    const h = fresh();
    h.start(0);
    saveDaily(store2, h);
    const { g: h2 } = reload(store2);
    h2.tick(READ_MS + ANSWER_MS + 1);
    expect(h2.rounds[0]!.timedOut).toBe(true);
    expect(h2.depth).toBe(0);
  });

  it('reload during reading keeps the original deadline and the countdown does not reset', () => {
    const store = new MemStorage();
    const g = fresh();
    g.start(5000);
    saveDaily(store, g);
    const { g: g2 } = reload(store);
    expect(g2.phase).toEqual({ kind: 'reading', round: 0, until: 5000 + READ_MS });
    g2.tick(5000 + 2000); // reopened 2s later: still reading, same deadline
    expect(g2.phase).toEqual({ kind: 'reading', round: 0, until: 5000 + READ_MS });
    g2.tick(5000 + READ_MS + 1);
    // The answer window runs from the end of reading, not from whenever the page woke up.
    expect(g2.phase).toMatchObject({ kind: 'answering', until: 5000 + READ_MS + ANSWER_MS });
  });

  it('a hidden tab gets no extra time: a late tick lands where an on-time one would', () => {
    const a = fresh();
    const b = fresh();
    a.start(0);
    b.start(0);
    a.tick(READ_MS);
    a.tick(READ_MS + ANSWER_MS);
    b.tick(READ_MS + ANSWER_MS + 30_000);
    expect(b.snapshot()).toEqual(a.snapshot());
  });

  it('a finished day restores to the done phase', () => {
    const store = new MemStorage();
    const g = fresh();
    let now = 0;
    g.start(now);
    for (let i = 0; i < 7; i++) {
      now += READ_MS;
      g.tick(now);
      g.submit(bitflipFor(g, i), now);
      g.advance(now);
    }
    saveDaily(store, g);
    const { g: g2, res } = reload(store);
    expect(res.kind).toBe('resumed');
    expect(g2.phase.kind).toBe('done');
    expect(g2.depth).toBe(91);
  });

  it('day rollover starts fresh and drops the old save', () => {
    const store = new MemStorage();
    const g = fresh(1);
    g.start(0);
    saveDaily(store, g);
    const { g: next, res } = reload(store, 2);
    expect(res.kind).toBe('none');
    expect(next.phase.kind).toBe('ready');
    saveDaily(store, (() => { const n = fresh(2); n.start(0); return n; })());
    expect(store.getItem(dailyKey(1))).toBeNull();
    expect(store.getItem(dailyKey(2))).not.toBeNull();
  });

  it('nothing is saved before Start', () => {
    const store = new MemStorage();
    saveDaily(store, fresh());
    expect(store.length).toBe(0);
  });

  describe('invalid saves are reported, never silently reset', () => {
    const good = () => {
      const g = fresh();
      g.start(0);
      g.tick(READ_MS);
      return JSON.parse(JSON.stringify(g.snapshot())) as Record<string, any>;
    };
    const cases: [string, (s: Record<string, any>) => unknown][] = [
      ['wrong version', (s) => ({ ...s, v: 2 })],
      ['other puzzle', (s) => ({ ...s, puzzle: 99 })],
      ['missing rounds', (s) => ({ ...s, rounds: s.rounds.slice(1) })],
      ['swapped question', (s) => ({ ...s, rounds: [{ ...s.rounds[1], q: 'nope' }, ...s.rounds.slice(1)] })],
      ['unknown answer', (s) => { s.rounds[0].locked = { name: 'zzz', corrected: false, guess: 'zzz' }; return s; }],
      ['bad deadline', (s) => ({ ...s, phase: { kind: 'answering', round: 0, until: 'soon' } })],
      ['round out of range', (s) => ({ ...s, phase: { kind: 'between', round: 40 } })],
      ['unknown phase', (s) => ({ ...s, phase: { kind: 'ready' } })],
      ['earlier round has no outcome', (s) => ({ ...s, phase: { kind: 'reading', round: 3, until: 1 } })],
      ['array', () => []],
      ['null', () => null],
    ];
    for (const [name, mut] of cases) {
      it(name, () => {
        const store = new MemStorage();
        store.setItem(dailyKey(1), JSON.stringify(mut(good())));
        const g = fresh();
        const res = loadDaily(store, g);
        expect(res.kind).toBe('invalid');
        expect(g.phase.kind).toBe('ready'); // untouched, fresh
        expect(store.getItem(dailyKey(1))).toBeNull(); // the bad save is removed so it reports once
      });
    }
    it('unparseable JSON', () => {
      const store = new MemStorage();
      store.setItem(dailyKey(1), '{not json');
      const res = loadDaily(store, fresh());
      expect(res).toMatchObject({ kind: 'invalid' });
    });
    it('restore throws InvalidSaveError directly', () => {
      expect(() => fresh().restore({ v: 1 })).toThrow(InvalidSaveError);
    });
  });

  it('unavailable storage means no persistence, not a crash', () => {
    const g = fresh();
    g.start(0);
    expect(loadDaily(null, fresh())).toEqual({ kind: 'none' });
    expect(() => saveDaily(null, g)).not.toThrow();
    const throwing: SaveStorage = {
      length: 0,
      key: () => null,
      getItem: () => { throw new Error('blocked'); },
      setItem: () => { throw new Error('quota'); },
      removeItem: () => { throw new Error('blocked'); },
    };
    expect(loadDaily(throwing, fresh())).toEqual({ kind: 'none' });
    expect(() => saveDaily(throwing, g)).not.toThrow();
    expect(browserStorage() === null || typeof browserStorage() === 'object').toBe(true);
  });

  it('Endless and debug modes do not touch the save', () => {
    const base = { mode: 'daily', unlimited: false, timer: true, date: '', scroll: false } as const;
    expect(canPersistDaily(base)).toBe(true);
    expect(canPersistDaily({ ...base, mode: 'endless' })).toBe(false);
    expect(canPersistDaily({ ...base, unlimited: true })).toBe(false);
    expect(canPersistDaily({ ...base, timer: false })).toBe(false);
    expect(canPersistDaily({ ...base, date: '2026-12-01' })).toBe(false);
    expect(canPersistDaily({ ...base, scroll: true })).toBe(false);
    // And the save layer itself refuses to snapshot or write an Endless game.
    const e = new Game(set, 1, { ...OPTS, mode: 'endless' });
    e.start(0);
    expect(() => e.snapshot()).toThrow();
    const store = new MemStorage();
    expect(() => saveDaily(store, e)).toThrow();
    expect(store.length).toBe(0);
  });

  it('rev changes on every state change, including rejected guesses', () => {
    const g = fresh();
    const r0 = g.rev;
    g.start(0);
    expect(g.rev).toBeGreaterThan(r0);
    g.tick(READ_MS);
    const r1 = g.rev;
    g.submit('definitely not an answer', READ_MS);
    expect(g.rev).toBeGreaterThan(r1);
    const r2 = g.rev;
    g.tick(READ_MS + 1);
    expect(g.rev).toBe(r2);
  });
});
