import { describe, expect, it } from 'vitest';
import { LAYERS } from '../../core/layers';
import { V4_LIBRARIES } from './libraries';
import { VIEW_WINDOW, type Placed } from './place';
import { placeForSpec, specKey, type WorldSpecV4 } from './world';

/** Bands shaped like the scene's (about 180–420 world px per layer). */
function spec(seed: number, W: number, scale: number): WorldSpecV4 {
  const cx = Math.round(W / 2);
  const consoleHalf = Math.ceil(Math.min(520, W * scale - 32) / 2 / scale) + 3;
  const heights = [184, 184, 192, 200, 216, 232, 248, 288, 424, 372];
  let y = 28;
  const bands = heights.map((h, i) => {
    const b = { top: i === 0 ? -140 : y, bottom: y + h, keepOut: [{ x: cx - 60, y: y - 70, w: 120, h: 30 }] };
    y += h;
    return b;
  });
  return {
    seed,
    W,
    bands,
    cursorLane: [cx - 16, cx + 16],
    panelLanes: [
      [cx - consoleHalf, cx + consoleHalf],
      [0, Math.ceil(80 / scale)],
      [W - Math.ceil(150 / scale), W],
    ],
  };
}

const overlap = (a: Placed, b: Placed) => a.x < b.x + b.w && b.x < a.x + a.w && a.y < b.y + b.h && b.y < a.y + a.h;

describe('v4 world', () => {
  it('every layer has a library of at least 20 entity types and an anchor', () => {
    for (const l of LAYERS) {
      expect(V4_LIBRARIES[l.id].near.length).toBeGreaterThanOrEqual(20);
      expect(V4_LIBRARIES[l.id].anchors.length).toBeGreaterThanOrEqual(1);
    }
  });

  // Desktop 1280 (scale 3), 1920 (scale 4) and phone 390 (scale 2).
  for (const [W, scale] of [
    [427, 3],
    [480, 4],
    [195, 2],
  ] as const) {
    it(`places a valid world at width ${W} for many seeds`, () => {
      for (let seed = 1; seed <= 40; seed++) {
        const s = spec(seed, W, scale);
        const world = placeForSpec(s);
        world.forEach((layer, i) => {
          const band = s.bands[i]!;
          expect(layer.near.filter((e) => e.anchor).length).toBeGreaterThanOrEqual(1);
          for (let a = 0; a < layer.near.length; a++) {
            const e = layer.near[a]!;
            // In its band, out of the cursor lane and the keep-outs.
            expect(e.y).toBeGreaterThanOrEqual(band.top);
            expect(e.y + e.h).toBeLessThanOrEqual(band.bottom);
            expect(e.x + e.w <= s.cursorLane[0] || e.x >= s.cursorLane[1]).toBe(true);
            for (const k of band.keepOut) expect(e.x < k.x + k.w && k.x < e.x + e.w && e.y < k.y + k.h && k.y < e.y + e.h).toBe(false);
            // Nothing overlaps.
            for (let b = a + 1; b < layer.near.length; b++) expect(overlap(e, layer.near[b]!)).toBe(false);
            // Per-type cap within one view.
            const cap = e.def.cap ?? 2;
            const ey = e.y + e.h / 2;
            const near = layer.near.filter((o) => o.def === e.def && o.y + o.h / 2 >= ey && o.y + o.h / 2 < ey + VIEW_WINDOW);
            expect(near.length).toBeLessThanOrEqual(cap);
          }
          // Varied: most of what is shown is distinct.
          const types = new Set(layer.near.map((e) => e.def.id)).size;
          expect(types).toBeGreaterThanOrEqual(Math.min(14, Math.ceil(layer.near.length * 0.5)));
        });
      }
    });
  }

  it('is deterministic in the seed and changes with it', () => {
    const sig = (seed: number) =>
      JSON.stringify(placeForSpec(spec(seed, 427, 3)).map((l) => l.near.map((e) => [e.def.id, e.x, e.y, e.v, e.look, e.flip])));
    expect(sig(7)).toBe(sig(7));
    expect(sig(7)).not.toBe(sig(8));
    expect(specKey(spec(7, 427, 3))).toBe(specKey(spec(7, 427, 3)));
  });

  it('hiding the debug rail lane only removes entities, the rest stays put', () => {
    const base = placeForSpec(spec(3, 427, 3));
    const hidden = placeForSpec({ ...spec(3, 427, 3), hideLane: [407, 427] });
    base.forEach((l, i) => {
      const kept = l.near.filter((e) => e.x + e.w <= 407);
      expect(hidden[i]!.near.map((e) => [e.def.id, e.x, e.y])).toEqual(kept.map((e) => [e.def.id, e.x, e.y]));
    });
  });
});
