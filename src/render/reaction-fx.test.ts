import { describe, expect, it } from 'vitest';
import { TIER_IDS } from '../core/tiers';
import { bufferBlock, CASCADE, LANDING_GRACE_MS, NULLION_BANNER, PAGE_FAULT, PAGE_FAULT_MS, REACTION_MS, pageCovers, LEAD_MS, WOMM, reactionAlive, reactionFrame } from './reaction-fx';

const timeline = (tier: (typeof TIER_IDS)[number], sustained: boolean, reduced: boolean, until = 6000) => {
  const out = [];
  for (let t = 0; t <= until; t += 10) out.push({ t, ...reactionFrame(tier, t, sustained, reduced) });
  return out;
};

describe('reaction timelines', () => {
  it('Works on my machine mirrors Bit Flip right up to the high-note climax, then freezes mid-glitch, grays out, reveals hourglass, and drops', () => {
    expect(WOMM.freeze).toBe(CASCADE.invert[0]);
    expect(WOMM.freeze).toBe(NULLION_BANNER.climaxAt);
    for (const f of timeline('womm', true, false)) {
      if (f.t < WOMM.freeze) {
        const bf = reactionFrame('bitflip', f.t, true, false);
        expect(f.cursor).toBe(bf.cursor);
        expect(f.hang).toBe(bf.hang);
        expect(f.blackout).toBe(bf.blackout);
        expect(f.flip).toBe(bf.flip);
        expect(f.jiggle).toBeCloseTo(bf.jiggle, 5);
        expect(f.banner).toEqual(bf.banner);
      } else {
        expect(f.freeze).toBe(true);
        expect(f.hang).toBe(f.t >= WOMM.gray);
        expect(f.jiggle).toBe(0);
        expect(f.blackout).toBe(false);
        expect(f.flip).toBe('none');
        if (f.t < WOMM.hourglass) expect(f.banner?.frozen).toBe(true);
        else expect(f.banner).toBeNull();
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

  it('Works on my machine under reduced motion: mirrors Bit Flip banner buildup, freezes, then grays out, then hourglass', () => {
    const tl = timeline('womm', true, true);
    expect(tl.filter((f) => f.t >= NULLION_BANNER.topAt && f.t < WOMM.freeze).every((f) => f.banner !== null && f.jiggle === 0 && f.flip === 'none')).toBe(true);
    expect(tl.filter((f) => f.t >= WOMM.freeze && f.t < WOMM.gray).every((f) => f.freeze && !f.hang && f.flip === 'none' && f.banner?.frozen)).toBe(true);
    expect(tl.filter((f) => f.t >= WOMM.gray && f.t < WOMM.hourglass).every((f) => f.freeze && f.hang && f.flip === 'none' && f.banner?.frozen)).toBe(true);
    expect(tl.filter((f) => f.t >= WOMM.hourglass).every((f) => f.freeze && f.hang && f.flip === 'none' && f.banner === null)).toBe(true);
    expect(tl.at(-1)!.cursor).toBe('hourglass');
  });

  it('Bit Flip sparkles ONE IN A then NULLION over a dimmed screen, then lights up inverted and clears into the dive', () => {
    const pre = reactionFrame('bitflip', NULLION_BANNER.topAt - 10, true, false);
    expect(pre.banner).toBeNull();
    const row1 = reactionFrame('bitflip', NULLION_BANNER.topAt + 120, true, false);
    expect(row1.banner!.top).toBeGreaterThan(0);
    expect(row1.banner!.bottom).toBe(0);
    expect(row1.banner!.dim).toBeGreaterThan(0);
    expect(row1.flip).toBe('none');
    const both = reactionFrame('bitflip', NULLION_BANNER.bottomAt + 200, true, false);
    expect(both.banner!.bottom).toBeGreaterThan(0);
    const climax = reactionFrame('bitflip', NULLION_BANNER.climaxAt + 10, true, false);
    expect(climax.flip).toBe('invert');
    expect(climax.banner!.locked).toBe(true);
    expect(climax.banner!.dim).toBeGreaterThan(0.8);
    const faded = reactionFrame('bitflip', NULLION_BANNER.holdEnd - 50, true, false);
    expect(faded.banner!.dim).toBe(0);
    const after = reactionFrame('bitflip', NULLION_BANNER.holdEnd + 10, true, false);
    expect(after.banner).toBeNull();
    expect(after.flip).toBe('invert');
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

  it('Race condition and Heisenbug keep a calmer jiggle while sustained; Null pointer page-faults and then leaves the screen whole', () => {
    expect(reactionFrame('race', 60_000, true, false).jiggle).toBeGreaterThan(0);
    expect(reactionFrame('race', 60_000, true, false).jiggle).toBeLessThan(1);
    expect(reactionFrame('heisenbug', 60_000, true, false).jiggle).toBeGreaterThan(0);
    // The page-fault run plays out and ends: nothing is left voided while the dive and reveal hold the reaction.
    expect(reactionFrame('npe', 60_000, true, false).blackout).toBe(false);
    expect(reactionFrame('npe', 60_000, false, false).blackout).toBe(false);
  });

  it('the reveal backdrop steps its block size 1 → 2 → 4 → 8 and never skips or reverses', () => {
    const seen: number[] = [];
    for (let a = 0; a <= 1; a += 0.01) {
      const b = bufferBlock(a);
      if (seen.at(-1) !== b) seen.push(b);
    }
    expect(seen).toEqual([1, 2, 4, 8]);
    expect(bufferBlock(1)).toBe(8);
  });

  describe('Null pointer page faults', () => {
    const run = (reduced: boolean) => {
      const out: number[][] = [];
      for (let t = 0; t < PAGE_FAULT_MS + 100; t += 5) out.push(pageCovers(t, reduced));
      return out;
    };

    it('opens pages one after another, then faults them back in, in the same order', () => {
      const at = (t: number) => pageCovers(t, false);
      expect(at(10)[0]).toBeGreaterThan(0);
      expect(at(10)[PAGE_FAULT.pages - 1]).toBe(0);
      expect(at(PAGE_FAULT.appearGap * (PAGE_FAULT.pages - 1) + PAGE_FAULT.appearDur + 5).every((c) => c === 1)).toBe(true);
      expect(at(PAGE_FAULT.restoreAt + PAGE_FAULT.restoreGap + 10)[0]).toBeLessThan(1);
      expect(at(PAGE_FAULT.restoreAt + 10)[PAGE_FAULT.pages - 1]).toBe(1);
      expect(at(PAGE_FAULT_MS)).toEqual([]);
    });

    it('never strobes: each page only rises, then only falls, in coarse dither steps', () => {
      const frames = run(false).filter((f) => f.length);
      for (let i = 0; i < PAGE_FAULT.pages; i++) {
        const seq = frames.map((f) => f[i]!);
        let falling = false;
        for (let k = 1; k < seq.length; k++) {
          if (seq[k]! < seq[k - 1]!) falling = true;
          if (falling) expect(seq[k]!).toBeLessThanOrEqual(seq[k - 1]!);
        }
        expect(new Set(seq).size).toBeLessThanOrEqual(5);
      }
    });

    it('under reduced motion the voids simply appear together and go', () => {
      const frames = run(true).filter((f) => f.length);
      expect(frames.every((f) => f.every((c) => c === 1))).toBe(true);
    });

    it('Bit Flip and Works on my machine play the same run inside their cascade', () => {
      for (const tier of ['bitflip', 'womm'] as const) {
        const seen = timeline(tier, true, false, 2000).filter((f) => f.pages.length);
        expect(seen.length).toBeGreaterThan(0);
        expect(seen.every((f) => f.t >= CASCADE.blackout[0] && f.t < CASCADE.blackout[1] && f.blackout)).toBe(true);
      }
    });
  });
});

describe('a reaction survives its landing until the reveal holds it', () => {
  it('lives through its own run, while sustained, and for the grace after landing; then ends', () => {
    for (const t of TIER_IDS) {
      const past = REACTION_MS[t] + 1;
      expect(reactionAlive(10, t, false, Infinity)).toBe(true);
      expect(reactionAlive(past, t, true, Infinity)).toBe(true);
      // The play-mode case: the dive landed this frame; the HUD only holds it on its next update.
      expect(reactionAlive(past, t, false, 0)).toBe(true);
      expect(reactionAlive(past, t, false, LANDING_GRACE_MS)).toBe(true);
      expect(reactionAlive(past, t, false, LANDING_GRACE_MS + 1)).toBe(false);
      expect(reactionAlive(past, t, false, Infinity)).toBe(false);
    }
  });
});
