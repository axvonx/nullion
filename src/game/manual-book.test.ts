import { describe, expect, it } from 'vitest';
import { LAYERS } from '../core/layers';
import { MANUAL_ENTRIES } from './manual';
import { buildBook, bookChapters, kwicRows, manTag } from './manual-book';

describe('Field Manual book structure', () => {
  const chapters = bookChapters();

  it('has one chapter per Daily layer, numbered 1–10 in descent order', () => {
    expect(chapters.map((c) => c.layer)).toEqual(LAYERS.map((l) => l.id));
    expect(chapters.map((c) => c.no)).toEqual(['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']);
  });

  it('files each entry in the chapter of its shallowest Daily appearance, with stubs in the deeper ones', () => {
    for (const e of MANUAL_ENTRIES) {
      const daily = e.sightings.filter((s) => LAYERS.some((l) => l.id === s.layer));
      if (!daily.length) continue;
      const homes = chapters.filter((c) => c.entries.includes(e));
      expect(homes.map((c) => c.layer), e.id).toEqual([daily[0]!.layer]);
      const stubs = chapters.filter((c) => c.stubs.some((s) => s.entry === e)).map((c) => c.layer);
      expect(stubs, e.id).toEqual(daily.slice(1).map((s) => s.layer));
    }
    // Lock Ness: home in OS userspace (chapter 4), stubs in Firmware, Ring −2 and Ring −3.
    expect(manTag(MANUAL_ENTRIES.find((e) => e.id === 'lock-ness')!)).toBe('LOCK-NESS(4)');
  });

  it('lays out front matter, chapters and the index as spreads with unique section-style folios', () => {
    const book = buildBook(() => false);
    expect(book[0]!.left.kind).toBe('title');
    expect(book.at(-1)!.left.kind).toBe('index');
    const folios = book.flatMap((s) => s.folios);
    expect(new Set(folios).size).toBe(folios.length);
    const lock = book.find((s) => s.left.kind === 'plate' && s.left.entry.id === 'lock-ness')!;
    expect(lock.folios[0]).toMatch(/^4-\d+$/);
  });

  it('a sealed chapter keeps its divider but none of its entry pages', () => {
    const sealed = buildBook((layer) => layer === 'firmware');
    const fw = sealed.filter((s) => s.chapter === '7');
    expect(fw.map((s) => s.left.kind)).toEqual(['divider']);
    expect(sealed.length).toBeLessThan(buildBook(() => false).length);
  });

  it('the permuted index rotates every word of each NAME line to the keyword column, alphabetised', () => {
    const rows = kwicRows([{ tag: 'LOCK-NESS(4)', line: 'lock-ness — a padlock that keeps resurfacing', target: 'lock-ness' }]);
    expect(rows.map((r) => r.key.split(' ')[0])).toEqual(['keeps', 'lock-ness', 'padlock', 'resurfacing']);
    const padlock = rows.find((r) => r.key.startsWith('padlock'))!;
    expect(padlock.before).toBe('lock-ness — a');
    expect(padlock.key).toBe('padlock that keeps resurfacing');
  });
});
