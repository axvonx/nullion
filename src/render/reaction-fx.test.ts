import { describe, expect, it } from 'vitest';
import { TIER_IDS } from '../core/tiers';
import { CASCADE, LEAD_MS, WOMM, reactionFrame } from './reaction-fx';

const timeline = (tier: (typeof TIER_IDS)[number], sustained: boolean, reduced: boolean, until = 6000) => {
  const out = [];
  for (let t = 0; t <= until; t += 10) out.push({ t, ...reactionFrame(tier, t, sustained, reduced) });
  return out;
};

describe('reaction timelines', () => {
  it('Works on my machine opens like a Bit Flip, stalls into gray, then turns into the hourglass and drops hung', () => {
    expect(WOMM.stall).toBeLessThan(1000);
    for (const f of timeline('womm', true, false)) {
      if (f.t < WOMM.stall) {
        // The fake Bit Flip: flipped cursor, no gray yet, and never an inversion.
        expect(f.cursor).toBe('flipped');
        expect(f.hang).toBe(false);
        expect(reactionFrame('bitflip', f.t, true, false).cursor).toBe('flipped');
      } else {
        expect(f.hang).toBe(true);
        expect(f.jiggle).toBe(0);
        expect(f.blackout).toBe(false);
      }
      if (f.t >= WOMM.hourglass) expect(f.cursor).toBe('hourglass');
      expect(f.flip).not.toBe('invert');
    }
    // The fake has the Bit Flip's black-out and jiggle in it.
    expect(timeline('womm', true, false, WOMM.stall).some((f) => f.blackout)).toBe(true);
    expect(timeline('womm', true, false, WOMM.stall).some((f) => f.jiggle > 0)).toBe(true);
    // It only drops once it's the hourglass, and only after the gray has taken over.
    expect(LEAD_MS.womm).toBeGreaterThanOrEqual(WOMM.hourglass);
  });

  it('Works on my machine under reduced motion: a static tint, then the gray, then the hourglass', () => {
    const tl = timeline('womm', true, true);
    expect(tl.filter((f) => f.t < WOMM.stall).every((f) => f.flip === 'tint' && f.jiggle === 0 && !f.hang)).toBe(true);
    expect(tl.filter((f) => f.t >= WOMM.stall).every((f) => f.hang)).toBe(true);
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
          if (sustained && tl[k - 1]!.flip === 'invert' && tl[k]!.flip !== 'invert') exitsWhileSustained++;
        }
        expect(entries).toBeLessThanOrEqual(tier === 'bitflip' ? 1 : 0);
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
