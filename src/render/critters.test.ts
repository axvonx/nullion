import { describe, expect, it } from 'vitest';
import { LAYERS } from '../core/layers';
import type { Band } from './art';
import { CritterSystem, type CritterCall } from './critters';

function fakeCtx() {
  let rects = 0;
  const ctx = {
    fillStyle: '',
    fillRect() {
      rects++;
    },
  } as unknown as CanvasRenderingContext2D;
  return { ctx, rects: () => rects };
}

function makeBand(t: number, reduced = false): Band {
  return { top: 0, bottom: 260, worldTop: 0, camY: 0, w: 320, h: 240, t, reduced };
}

describe('CritterSystem (System Biosphere)', () => {
  it('draws living critters in every layer and emits stereo-panned calls (except Ring −2)', () => {
    const sys = new CritterSystem();
    sys.ensureSeed(7);

    const mockSpots = [30, 60, 24, 14, 120, 90, 26, 16, 210, 75, 22, 14, 270, 110, 20, 12];
    for (const l of LAYERS) {
      const { ctx, rects } = fakeCtx();
      const calls: CritterCall[] = [];
      for (let t = 0.5; t <= 12; t += 0.5) {
        sys.drawBand(ctx, l.id, makeBand(t), true, (ev) => calls.push(ev), mockSpots);
      }
      expect(rects()).toBeGreaterThan(0);
      if (l.id === 'ring-2') {
        expect(calls).toHaveLength(0);
      } else {
        expect(calls.length).toBeGreaterThan(0);
        for (const c of calls) {
          expect(c.layer).toBe(l.id);
          expect(c.pan).toBeGreaterThanOrEqual(-0.85);
          expect(c.pan).toBeLessThanOrEqual(0.85);
        }
      }
    }
  });

  it('never emits calls under reduced motion', () => {
    const sys = new CritterSystem();
    sys.ensureSeed(1);
    const { ctx } = fakeCtx();
    const calls: CritterCall[] = [];
    for (let t = 0.5; t <= 10; t += 0.5) {
      sys.drawBand(ctx, 'application', makeBand(t, true), true, (ev) => calls.push(ev));
    }
    expect(calls).toHaveLength(0);
  });
});
