import { describe, expect, it } from 'vitest';
import { TIER_IDS } from '../core/tiers';
import { CASCADE, LEAD_MS, WOMM, reactionFrame } from './reaction-fx';

const timeline = (tier: (typeof TIER_IDS)[number], sustained: boolean, reduced: boolean, until = 6000) => {
  const out = [];
  for (let t = 0; t <= until; t += 10) out.push({ t, ...reactionFrame(tier, t, sustained, reduced) });
  return out;
};

describe('reaction timelines', () => {
  it('Works on my machine mirrors Bit Flip with super-intense shake, freezes first, then grays out, reveals hourglass, then drops', () => {
    expect(WOMM.freeze).toBe(LEAD_MS.bitflip);
    for (const f of timeline('womm', true, false)) {
      if (f.t < WOMM.freeze) {
        const bf = reactionFrame('bitflip', f.t, true, false);
        expect(f.cursor).toBe(bf.cursor);
        expect(f.hang).toBe(bf.hang);
        expect(f.blackout).toBe(bf.blackout);
        expect(f.flip).toBe(bf.flip);
      } else {
        expect(f.freeze).toBe(true);
        expect(f.hang).toBe(f.t >= WOMM.gray);
        expect(f.jiggle).toBe(0);
        expect(f.blackout).toBe(false);
        expect(f.flip).toBe('none');
      }
      if (f.t >= WOMM.hourglass) expect(f.cursor).toBe('hourglass');
    }
    // Jiggle grows intensely up to the sudden freeze.
    const early = reactionFrame('womm', WOMM.jiggle[0] + 100, true, false).jiggle;
    const mid = reactionFrame('womm', Math.round((WOMM.jiggle[0] + WOMM.jiggle[1]) / 2), true, false).jiggle;
    const peak = reactionFrame('womm', WOMM.jiggle[1] - 20, true, false).jiggle;
    expect(early).toBeGreaterThan(0);
    expect(mid).toBeGreaterThan(early);
    expect(peak).toBeGreaterThan(mid);
    expect(peak).toBeGreaterThan(2);
    // Freeze precedes gray-out, which precedes hourglass, which precedes sinking.
    expect(WOMM.gray).toBeGreaterThan(WOMM.freeze);
    expect(WOMM.hourglass).toBeGreaterThan(WOMM.gray);
    expect(LEAD_MS.womm).toBeGreaterThan(WOMM.hourglass);
  });

  it('Works on my machine under reduced motion: mirrors Bit Flip tint, freezes, then grays out, then hourglass', () => {
    const tl = timeline('womm', true, true);
    expect(tl.filter((f) => f.t >= CASCADE.invert[0] && f.t < WOMM.freeze).every((f) => f.flip === 'tint' && f.jiggle === 0)).toBe(true);
    expect(tl.filter((f) => f.t >= WOMM.freeze && f.t < WOMM.gray).every((f) => f.freeze && !f.hang && f.flip === 'none')).toBe(true);
    expect(tl.filter((f) => f.t >= WOMM.gray).every((f) => f.freeze && f.hang && f.flip === 'none')).toBe(true);
    expect(tl.at(-1)!.cursor).toBe('hourglass');
  });

  for (const tier of TIER_IDS)
    for (const sustained of [true, false])
      it(`${tier}${sustained ? ' (sustained)' : ''}: never strobes; an inversion is entered at most once`, () => {
        const tl = timeline(tier, sustained, false);
        let entries = 0;
        let exitsWhileSustained = 0;
        for (let k = 1; k < tl.length; k++) {
          if (tl[k]!.flip === 'invert' && tl[k - 1]!.flip !== 'invert') entries++;
          if (sustained && tier !== 'womm' && tl[k - 1]!.flip === 'invert' && tl[k]!.flip !== 'invert') exitsWhileSustained++;
        }
        expect(entries).toBeLessThanOrEqual(tier === 'bitflip' || tier === 'womm' ? 1 : 0);
        expect(exitsWhileSustained).toBe(0);
        // Reduced motion: no inversion and no jiggle at all.
        expect(timeline(tier, sustained, true).every((f) => f.flip !== 'invert' && f.jiggle === 0)).toBe(true);
      });

  it('Bit Flip plays its cascade before it sinks, and holds the inversion while sustained', () => {
    expect(LEAD_MS.bitflip).toBeGreaterThanOrEqual(CASCADE.invert[0]);
    expect(reactionFrame('bitflip', 60_000, true, false).flip).toBe('invert');
    expect(reactionFrame('bitflip', 60_000, false, false).flip).toBe('none');
  });

  it('Race condition and Heisenbug keep a calmer jiggle while sustained; Null pointer holds its black-out', () => {
    expect(reactionFrame('race', 60_000, true, false).jiggle).toBeGreaterThan(0);
    expect(reactionFrame('race', 60_000, true, false).jiggle).toBeLessThan(1);
    expect(reactionFrame('heisenbug', 60_000, true, false).jiggle).toBeGreaterThan(0);
    expect(reactionFrame('npe', 60_000, true, false).blackout).toBe(true);
    expect(reactionFrame('npe', 60_000, false, false).blackout).toBe(false);
  });
});
