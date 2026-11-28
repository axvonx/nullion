import { describe, expect, it } from 'vitest';
import type { SaveStorage } from './daily-save';
import { MAX_MISSES, clearMisses, loadMisses, missesMarkdown, recordMiss } from './misses';

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

describe('missed-guesses log', () => {
  it('keeps each guess once per prompt, counting repeats (normalized), and copies as Markdown', () => {
    const s = new MemStorage();
    recordMiss(s, { q: 'database', prompt: 'Name a database', guess: 'ScyllaDB', at: 1 });
    recordMiss(s, { q: 'database', prompt: 'Name a database', guess: ' scylladb ', at: 2 });
    recordMiss(s, { q: 'database', prompt: 'Name a database', guess: 'Riak', at: 3 });
    recordMiss(s, { q: 'lock', prompt: 'Name a type of lock', guess: 'ScyllaDB', at: 4 });
    recordMiss(s, { q: 'lock', prompt: 'Name a type of lock', guess: '   ', at: 5 });
    const l = loadMisses(s);
    expect(l.kind === 'ok' && l.misses.map((m) => [m.q, m.guess, m.n])).toEqual([
      ['database', 'ScyllaDB', 2],
      ['database', 'Riak', 1],
      ['lock', 'ScyllaDB', 1],
    ]);
    const md = missesMarkdown(l.kind === 'ok' ? l.misses : [], new Date('2026-11-27T12:00:00Z'));
    expect(md.split('\n')).toEqual([
      '# nullion missed guesses (copied 2026-11-27)',
      '',
      '## database · Name a database',
      '- ScyllaDB · ×2',
      '- Riak · ×1',
      '',
      '## lock · Name a type of lock',
      '- ScyllaDB · ×1',
      '',
    ]);
    clearMisses(s);
    expect(loadMisses(s)).toEqual({ kind: 'ok', misses: [] });
  });

  it('drops the oldest past the cap, and reports (and clears) a log it cannot read', () => {
    const s = new MemStorage();
    for (let i = 0; i < MAX_MISSES + 3; i++) recordMiss(s, { q: 'q', prompt: 'p', guess: `g${i}`, at: i });
    const l = loadMisses(s);
    expect(l.kind === 'ok' && [l.misses.length, l.misses[0]!.guess]).toEqual([MAX_MISSES, 'g3']);
    for (const k of s.m.keys()) s.m.set(k, '{nope');
    expect(loadMisses(s).kind).toBe('invalid');
    expect(loadMisses(s)).toEqual({ kind: 'ok', misses: [] });
  });
});
