import { describe, expect, it } from 'vitest';
import { buildAnswerSet } from '../core/answers';
import { SAMPLE_QUESTIONS, SAMPLE_TERMS } from '../data/sample';
import { Game, READ_MS } from './game';
import type { SaveStorage } from './daily-save';
import { canPersistRun, hasRun, loadBest, loadRun, saveRun, savedRunSeed } from './endless-save';

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

const set = buildAnswerSet('sample', 'Sample', SAMPLE_TERMS, SAMPLE_QUESTIONS);
const OPTS = { timer: true, unlimited: false, autocorrect: 'confirm', mode: 'endless' } as const;

function play(seed: number) {
  const g = new Game(set, 3, { ...OPTS, seed });
  let now = 0;
  g.start(now);
  return {
    g,
    answer() {
      now += READ_MS;
      g.tick(now);
      expect(g.submit(set.entries(g.current()!.question.id)[0]!.name, now).kind).toBe('accepted');
      g.advance(now);
    },
    timeout() {
      now += READ_MS;
      g.tick(now);
      now += g.answerMs;
      g.tick(now);
      g.advance(now);
    },
  };
}

describe('endless run save', () => {
  it('only a real Endless run persists', () => {
    const base = { mode: 'endless', unlimited: false, timer: true, scroll: false, outside: false } as const;
    expect(canPersistRun(base)).toBe(true);
    expect(canPersistRun({ ...base, mode: 'daily' })).toBe(false);
    expect(canPersistRun({ ...base, mode: 'true-endless' })).toBe(false);
    expect(canPersistRun({ ...base, unlimited: true })).toBe(false);
    expect(canPersistRun({ ...base, outside: true })).toBe(false);
  });

  it('a run in progress resumes with its seed; a finished run is dropped and its depth becomes the best', () => {
    const store = new MemStorage();
    const p = play(1234);
    p.answer();
    p.answer();
    expect(saveRun(store, p.g, 1)).toBeNull();
    expect(hasRun(store)).toBe(true);
    expect(savedRunSeed(store)).toBe(1234);
    const back = new Game(set, 3, { ...OPTS, seed: savedRunSeed(store)! });
    expect(loadRun(store, back)).toEqual({ kind: 'resumed' });
    expect(back.depth).toBe(p.g.depth);

    p.timeout();
    p.timeout();
    p.timeout();
    expect(p.g.phase.kind).toBe('done');
    const best = saveRun(store, p.g, 99);
    expect(best).toMatchObject({ depth: p.g.depth, rounds: 2, at: 99 });
    expect(hasRun(store)).toBe(false);
    expect(loadBest(store)).toEqual({ kind: 'best', best });

    // A shallower run doesn't replace it.
    const q = play(5);
    q.timeout();
    q.timeout();
    q.timeout();
    expect(saveRun(store, q.g, 100)).toBeNull();
    expect(loadBest(store)).toEqual({ kind: 'best', best });
  });

  it('an unusable run or best is removed and reported, never silently reset', () => {
    const store = new MemStorage();
    store.setItem('nullion.debug.endless.run', '{"v":1,"puzzle":3,"mode":"endless","seed":7,"rounds":"x","phase":{"kind":"done"}}');
    store.setItem('nullion.endless.run', '{"v":1,"puzzle":3,"mode":"endless","seed":7,"rounds":"x","phase":{"kind":"done"}}');
    const g = new Game(set, 3, { ...OPTS, seed: 7 });
    expect(loadRun(store, g).kind).toBe('invalid');
    expect(hasRun(store)).toBe(false);
    store.setItem('nullion.debug.endless.best', 'nope');
    store.setItem('nullion.endless.best', 'nope');
    expect(loadBest(store).kind).toBe('invalid');
    expect(loadBest(store).kind).toBe('none');
  });
});
