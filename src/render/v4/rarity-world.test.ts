import { describe, expect, it } from 'vitest';
import { LAYERS } from '../../core/layers';
import { GATED_APPEARANCES, spawnsOn } from '../../game/rarity';
import { pixelScale } from '../cursor-geom';
import { placeForSpec, type WorldSpecV4 } from './world';

/** Daily-shaped bands and the scene's real lanes for a viewport (Scene.worldSpec: console, header chips, rail). */
function spec(seed: number, vw: number): WorldSpecV4 {
  const scale = pixelScale(vw);
  const W = Math.ceil(vw / scale);
  const cx = Math.round(W / 2);
  const consoleHalf = Math.ceil(Math.min(520, vw - 32) / 2 / scale) + 3;
  const heights = [184, 184, 192, 200, 216, 232, 248, 288, 424, 372];
  let y = 28;
  const bands = heights.map((h, i) => {
    const b = { top: i === 0 ? -140 : y, bottom: y + h, keepOut: [] };
    y += h;
    return b;
  });
  return {
    seed,
    scatterSeed: seed * 7919 + 1,
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

describe('the world honours rarity gates', () => {
  // A phone, a laptop and a wide desktop viewport (CSS px).
  for (const vw of [390, 1280, 1920]) {
    it(`viewport ${vw}px: an off-day prop is nowhere in the world; an on-day prop is placed in its layer`, () => {
      const DAYS = 200;
      const onDays = new Map<string, number>();
      const placedOnDays = new Map<string, number>();
      for (let d = 1; d <= DAYS; d++) {
        const world = placeForSpec(spec(d, vw));
        const seenAnywhere = new Set<string>();
        const seenInLayer = new Set<string>();
        world.forEach((pl, i) => {
          for (const e of [...pl.near, ...pl.far]) seenAnywhere.add(e.def.id);
          for (const e of pl.near) seenInLayer.add(`${LAYERS[i]!.id}:${e.def.id}`);
        });
        for (const g of GATED_APPEARANCES) {
          if (!LAYERS.some((l) => l.id === g.layer)) continue; // Endless-only layer: not in a Daily world
          const k = `${g.layer}:${g.entityId}`;
          if (spawnsOn(d, g.entryId, g.layer, g.rarity)) {
            onDays.set(k, (onDays.get(k) ?? 0) + 1);
            if (seenInLayer.has(k)) placedOnDays.set(k, (placedOnDays.get(k) ?? 0) + 1);
          } else {
            // Entity ids are unique across libraries, so "anywhere" also catches bleed into neighbour bands.
            expect(seenAnywhere.has(g.entityId), `day ${d}: ${k} is gated off but placed`).toBe(false);
          }
        }
      }
      for (const [k, on] of onDays) {
        expect((placedOnDays.get(k) ?? 0) / on, `${k}: placed on ${placedOnDays.get(k) ?? 0} of ${on} on-days`).toBeGreaterThanOrEqual(0.95);
      }
    });
  }
});
