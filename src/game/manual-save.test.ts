import { describe, expect, it } from 'vitest';
import { MANUAL_V1_KEY, MANUAL_V2_KEY } from './manual-save';
import { ManualStore } from './manual';

/** An in-memory Storage. */
function mem(init: Record<string, string> = {}) {
  const m = new Map(Object.entries(init));
  return {
    getItem: (k: string) => m.get(k) ?? null,
    setItem: (k: string, v: string) => void m.set(k, v),
    removeItem: (k: string) => void m.delete(k),
    key: (i: number) => [...m.keys()][i] ?? null,
    get length() {
      return m.size;
    },
    raw: m,
  };
}

const NOW = Date.UTC(2026, 10, 26, 18, 0);

describe('Field Manual save v2', () => {
  it('records first sightings with date, puzzle and prompt; later sightings never overwrite the stamp', () => {
    const s = mem();
    let t = NOW;
    const store = new ManualStore(s, { now: () => t, migrateV1: false });
    store.setContext(() => ({ puzzle: 12, prompt: 'Name a type of lock' }));
    store.log('lock-ness', 'userspace');
    t += 86_400_000;
    store.setContext(() => ({ puzzle: 13 }));
    store.log('lock-ness', 'userspace');
    store.log('lock-ness', 'firmware');
    expect(store.firstSeen('lock-ness', 'userspace')).toEqual({ at: NOW, puzzle: 12, prompt: 'Name a type of lock' });
    expect(store.firstSeen('lock-ness', 'firmware')).toEqual({ at: NOW + 86_400_000, puzzle: 13 });
    expect(store.firstSeen('lock-ness', 'ring-2')).toBeUndefined();
  });

  it('keeps fresh stamps wet until the page is viewed, per appearance', () => {
    const store = new ManualStore(mem(), { now: () => NOW, migrateV1: false });
    store.log('lock-ness', 'userspace');
    store.log('lock-ness', 'firmware');
    expect(store.isWet('lock-ness', 'userspace')).toBe(true);
    expect(store.isUnread('lock-ness')).toBe(true);
    store.markRead('lock-ness');
    expect(store.isWet('lock-ness', 'userspace')).toBe(false);
    expect(store.isUnread('lock-ness')).toBe(false);
    store.log('lock-ness', 'ring-2');
    expect(store.isWet('lock-ness', 'ring-2')).toBe(true);
    expect(store.isWet('lock-ness', 'firmware')).toBe(false);
  });

  it('round-trips through storage', () => {
    const s = mem();
    const a = new ManualStore(s, { now: () => NOW, migrateV1: false });
    a.setContext(() => ({ puzzle: 12, prompt: 'Name a type of lock' }));
    a.log('lock-ness', 'userspace');
    a.log('crit-songbird', 'application');
    a.markRead('crit-songbird');
    const b = new ManualStore(s, { now: () => NOW, migrateV1: false });
    expect(b.takeLoadNotice()).toBeUndefined();
    expect(b.firstSeen('lock-ness', 'userspace')).toEqual({ at: NOW, puzzle: 12, prompt: 'Name a type of lock' });
    expect(b.isWet('lock-ness', 'userspace')).toBe(true);
    expect(b.isFound('crit-songbird')).toBe(true);
    expect(b.isUnread('crit-songbird')).toBe(false);
  });

  it('migrates a v1 save once: undated sightings, unread entries wet, v1 key removed', () => {
    const s = mem({ [MANUAL_V1_KEY]: JSON.stringify({ found: { 'lock-ness': ['userspace', 'firmware'], 'crit-songbird': ['application'] }, unread: ['lock-ness'] }) });
    const store = new ManualStore(s, { now: () => NOW, migrateV1: true });
    expect(store.firstSeen('lock-ness', 'firmware')).toEqual({ at: null, puzzle: null });
    expect(store.isWet('lock-ness', 'userspace')).toBe(true);
    expect(store.isUnread('crit-songbird')).toBe(false);
    expect(s.raw.has(MANUAL_V1_KEY)).toBe(false);
    expect(s.raw.has(MANUAL_V2_KEY)).toBe(true);
    expect(store.takeLoadNotice()).toBeUndefined();
  });

  it('a corrupt save is removed and reported, never silently reset', () => {
    for (const bad of ['{not json', JSON.stringify({ v: 2, seen: 'nope', wet: [] }), JSON.stringify({ v: 7 })]) {
      const s = mem({ [MANUAL_V2_KEY]: bad });
      const store = new ManualStore(s, { now: () => NOW, migrateV1: false });
      expect(store.foundCount()).toBe(0);
      expect(s.raw.has(MANUAL_V2_KEY)).toBe(false);
      expect(store.takeLoadNotice(), bad).toMatch(/Field Manual/);
      expect(store.takeLoadNotice()).toBeUndefined(); // reported once
    }
  });

  it('drops sightings of entries or layers that no longer exist, and says so', () => {
    const s = mem({
      [MANUAL_V2_KEY]: JSON.stringify({
        v: 2,
        seen: { 'lock-ness': { userspace: { at: NOW, puzzle: 3 }, kernel: { at: NOW, puzzle: 3 } }, 'renamed-thing': { kernel: { at: NOW, puzzle: 3 } } },
        wet: ['renamed-thing|kernel'],
      }),
    });
    const store = new ManualStore(s, { now: () => NOW, migrateV1: false });
    expect(store.foundLayers('lock-ness')).toEqual(['userspace']);
    expect(store.takeLoadNotice()).toMatch(/renamed-thing/);
    // The cleaned save is written back, so the notice doesn't repeat on the next load.
    expect(new ManualStore(s, { now: () => NOW, migrateV1: false }).takeLoadNotice()).toBeUndefined();
  });

  it('without storage it still works for the session and never throws', () => {
    const store = new ManualStore(null, { now: () => NOW, migrateV1: false });
    expect(store.log('lock-ness', 'userspace').isNewEntry).toBe(true);
    expect(store.isFound('lock-ness')).toBe(true);
  });
});
