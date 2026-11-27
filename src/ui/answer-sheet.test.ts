import { describe, expect, it } from 'vitest';
import type { CategoryEntry } from '../core/match';
import type { TierId } from '../core/tiers';
import { SHEET_SHOWN, SHEET_TIER_ORDER, answerSheet } from './answer-sheet';

const mk = (tier: TierId, n: number): CategoryEntry[] => Array.from({ length: n }, (_, i) => ({ name: `${tier}-${i}`, tier, keys: [`${tier}-${i}`] }));
const ENTRIES = [...mk('off-by-one', 30), ...mk('womm', 3), ...mk('npe', 12), ...mk('bitflip', 1), ...mk('race', 9)];

describe('answer sheet', () => {
  it('groups by the entries own tier, deepest first, skipping empty tiers', () => {
    expect(answerSheet(ENTRIES, 5, 'q').map((g) => g.tier)).toEqual(['bitflip', 'race', 'npe', 'off-by-one', 'womm']);
    expect(SHEET_TIER_ORDER.at(-1)).toBe('womm');
  });

  it('shows at most 8 per tier and keeps the whole tier for "+N more"', () => {
    for (const g of answerSheet(ENTRIES, 5, 'q')) {
      expect(g.shown.length).toBe(Math.min(SHEET_SHOWN, g.total));
      expect(g.all.length).toBe(g.total);
    }
  });

  it('is deterministic per puzzle and question, and varies between them', () => {
    const names = (p: number, q: string) => answerSheet(ENTRIES, p, q).flatMap((g) => g.shown.map((e) => e.name));
    expect(names(5, 'q')).toEqual(names(5, 'q'));
    expect(names(5, 'q')).not.toEqual(names(6, 'q'));
    expect(names(5, 'q')).not.toEqual(names(5, 'r'));
    // Independent of the order the set lists its entries in.
    expect(answerSheet([...ENTRIES].reverse(), 5, 'q').flatMap((g) => g.shown.map((e) => e.name))).toEqual(names(5, 'q'));
  });

  it('always includes the players own answer in its group', () => {
    const own = 'off-by-one-29';
    for (let p = 1; p < 20; p++) {
      const g = answerSheet(ENTRIES, p, 'q', own).find((x) => x.tier === 'off-by-one')!;
      expect(g.shown.map((e) => e.name)).toContain(own);
      expect(g.shown.length).toBe(SHEET_SHOWN);
    }
  });
});
