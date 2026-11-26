import { describe, expect, it } from 'vitest';
import { LAYERS } from '../core/layers';
import type { Band } from './art';
import { CritterSystem, MotionType, SPECIES_MOTIONS, type CritterCall } from './critters';

function fakeCtx() {
  let rects = 0;
  let texts = 0;
  const ctx = {
    fillStyle: '',
    font: '',
    globalAlpha: 1,
    save() {},
    restore() {},
    measureText: (s: string) => ({ width: s.length * 6 }),
    fillText() {
      texts++;
    },
    fillRect() {
      rects++;
    },
  } as unknown as CanvasRenderingContext2D;
  return { ctx, rects: () => rects, texts: () => texts };
}

function makeBand(t: number, reduced = false, camY = 0): Band {
  return { top: -camY, bottom: 260 - camY, worldTop: 0, camY, w: 320, h: 240, t, reduced };
}

describe('CritterSystem (System Biosphere)', () => {
  it('assigns composable MotionType sets to every critter instance', () => {
    const sys = new CritterSystem();
    sys.ensureSeed(7);

    // Application birds can both fly and perch
    const birds = sys.getLayerCritters('application');
    expect(birds.length).toBeGreaterThan(0);
    for (const b of birds) {
      expect(b.motions.has(MotionType.Fly)).toBe(true);
      expect(b.motions.has(MotionType.Perch)).toBe(true);
      expect(b.motions.has(MotionType.Hop)).toBe(false);
    }

    // Runtime & Libraries blobs only hop and perch (never fly)
    for (const id of ['runtime', 'libraries'] as const) {
      for (const blob of sys.getLayerCritters(id)) {
        expect(blob.motions.has(MotionType.Hop)).toBe(true);
        expect(blob.motions.has(MotionType.Perch)).toBe(true);
        expect(blob.motions.has(MotionType.Fly)).toBe(false);
      }
    }

    // Firmware sentinels only float
    for (const f of sys.getLayerCritters('firmware')) {
      expect(Array.from(f.motions)).toEqual([MotionType.Float]);
    }

    // Every layer has a non-empty species motion set
    for (const l of LAYERS) {
      expect(SPECIES_MOTIONS[l.id].length).toBeGreaterThan(0);
    }
  });

  it('draws living critters in every layer and emits stereo-panned calls (except Ring −2)', () => {
    const sys = new CritterSystem();
    sys.ensureSeed(7);

    const mockSpots = [30, 80, 24, 14, 120, 110, 26, 16, 210, 95, 22, 14, 270, 130, 20, 12];
    for (const l of LAYERS) {
      const { ctx, rects, texts } = fakeCtx();
      const calls: CritterCall[] = [];
      for (let t = 0.5; t <= 26; t += 0.4) {
        sys.drawBand(ctx, l.id, makeBand(t), true, (ev) => calls.push(ev), mockSpots);
      }
      expect(rects()).toBeGreaterThan(0);
      if (l.id === 'ring-2') {
        expect(calls).toHaveLength(0);
      } else {
        expect(calls.some((c) => c.kind === 'call')).toBe(true);
        expect(calls.some((c) => c.kind === 'exit')).toBe(true);
        expect(texts()).toBeGreaterThan(0);
        for (const c of calls) {
          expect(c.layer).toBe(l.id);
          expect(c.pan).toBeGreaterThanOrEqual(-0.85);
          expect(c.pan).toBeLessThanOrEqual(0.85);
          if (l.id === 'ring-1') expect(c.pan).toBe(0);
        }
      }
    }
  });

  it('allows application birds to transition smoothly between Fly and Perch on prop tops', () => {
    const sys = new CritterSystem();
    sys.ensureSeed(11);
    const { ctx } = fakeCtx();
    const mockSpots = [60, 100, 28, 16, 150, 120, 28, 16, 240, 105, 28, 16];
    const seen = new Set<MotionType>();
    for (let t = 0.05; t <= 12; t += 0.05) {
      sys.drawBand(ctx, 'application', makeBand(t), false, undefined, mockSpots);
      for (const b of sys.getLayerCritters('application')) seen.add(b.motion);
    }
    expect(seen.has(MotionType.Fly)).toBe(true);
    expect(seen.has(MotionType.Perch)).toBe(true);
  });

  it('does not mass-despawn critters when first arriving in a deeper layer after >30s', () => {
    const sys = new CritterSystem();
    sys.ensureSeed(3);
    const { ctx, rects } = fakeCtx();
    // Simulate arriving in kernel for the very first time at t = 45s
    sys.drawBand(ctx, 'kernel', makeBand(45), false);
    expect(rects()).toBeGreaterThan(0);
    expect(sys.getLayerCritters('kernel').every((c) => c.alive)).toBe(true);
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
