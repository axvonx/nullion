import { describe, expect, it } from 'vitest';
import { ALL_LAYER_IDS, LAYERS } from '../core/layers';
import type { Band } from './art-common';
import { LAYER_ART } from '../layers';
import { Collectibles } from './collectibles';
import { CritterSystem, isAltSpecies, type CritterCall } from './critters';
import { MotionType } from './motion';

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

function makeBand(t: number, reduced = false, camY = 0, collectibles?: Collectibles): Band {
  return { top: -camY, bottom: 260 - camY, worldTop: 0, camY, w: 320, h: 240, t, reduced, ...(collectibles ? { collectibles } : {}) };
}

describe('CritterSystem (System Biosphere)', () => {
  it('assigns composable MotionType sets to every critter instance', () => {
    const sys = new CritterSystem();
    sys.ensureSeed(7);

    // Application birds can both fly and perch (the alternate butterflies are covered below)
    const birds = sys.getLayerCritters('application').filter((c) => !isAltSpecies('application', c.variant));
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

    // Every Daily & Endless layer (all 29) has a non-empty species motion set
    for (const id of ALL_LAYER_IDS) {
      expect(LAYER_ART[id].critters.motions.length).toBeGreaterThan(0);
    }
  });

  it('draws living critters across all 29 Daily & Endless layers and emits stereo-panned calls (except Ring −2)', () => {
    const sys = new CritterSystem();
    sys.ensureSeed(7);

    const mockSpots = new Collectibles();
    mockSpots.addProp({ reaction: { x: 30, y: 80, w: 24, h: 14 } });
    mockSpots.addProp({ reaction: { x: 120, y: 110, w: 26, h: 16 } });
    mockSpots.addProp({ reaction: { x: 210, y: 95, w: 22, h: 14 } });
    mockSpots.addProp({ reaction: { x: 270, y: 130, w: 20, h: 12 } });
    for (const id of ALL_LAYER_IDS) {
      const { ctx, rects, texts } = fakeCtx();
      const calls: CritterCall[] = [];
      for (let t = 0.5; t <= 26; t += 0.4) {
        sys.drawBand(ctx, id, makeBand(t, false, 0, mockSpots), true, (ev) => calls.push(ev));
      }
      expect(rects()).toBeGreaterThan(0);
      if (id === 'ring-2') {
        expect(calls).toHaveLength(0);
      } else {
        expect(calls.some((c) => c.kind === 'call')).toBe(true);
        expect(calls.some((c) => c.kind === 'exit')).toBe(true);
        expect(texts()).toBeGreaterThan(0);
        for (const c of calls) {
          expect(c.layer).toBe(id);
          expect(c.pan).toBeGreaterThanOrEqual(-0.85);
          expect(c.pan).toBeLessThanOrEqual(0.85);
          if (id === 'ring-1') expect(c.pan).toBe(0);
        }
      }
    }
    expect(LAYERS.length).toBe(10);
  });

  it('alternate species move with their own motion set, and keep to it', () => {
    const sys = new CritterSystem();
    sys.ensureSeed(5);
    const { ctx } = fakeCtx();
    const mockSpots = new Collectibles();
    mockSpots.addProp({ reaction: { x: 60, y: 100, w: 28, h: 16 } });
    mockSpots.addProp({ reaction: { x: 150, y: 120, w: 28, h: 16 } });
    mockSpots.addProp({ reaction: { x: 240, y: 105, w: 28, h: 16 } });
    const layers = ALL_LAYER_IDS.filter((id) => LAYER_ART[id].critters.alt);
    expect(layers.length).toBeGreaterThan(0);
    for (const id of layers) {
      const crit = sys.getLayerCritters(id);
      const alts = crit.filter((c) => isAltSpecies(id, c.variant));
      expect(alts.length, `${id} has no alternate critters`).toBeGreaterThan(0);
      for (const c of alts) expect(Array.from(c.motions)).toEqual(LAYER_ART[id].critters.alt!.motions);
      for (const c of crit.filter((c) => !isAltSpecies(id, c.variant))) {
        expect(Array.from(c.motions)).toEqual(LAYER_ART[id].critters.motions);
      }
      for (let t = 0.05; t <= 20; t += 0.05) {
        sys.drawBand(ctx, id, makeBand(t, false, 0, mockSpots), false, undefined);
        for (const c of alts) {
          expect(c.motions.has(c.motion), `${id} alt entered ${c.motion}`).toBe(true);
          expect(Number.isFinite(c.x) && Number.isFinite(c.worldY)).toBe(true);
        }
      }
    }
  });

  it('the butterfly never lands; the main application birds still do', () => {
    const sys = new CritterSystem();
    sys.ensureSeed(11);
    const { ctx } = fakeCtx();
    const mockSpots = new Collectibles();
    mockSpots.addProp({ reaction: { x: 60, y: 100, w: 28, h: 16 } });
    mockSpots.addProp({ reaction: { x: 150, y: 120, w: 28, h: 16 } });
    mockSpots.addProp({ reaction: { x: 240, y: 105, w: 28, h: 16 } });
    for (let t = 0.05; t <= 12; t += 0.05) {
      sys.drawBand(ctx, 'application', makeBand(t, false, 0, mockSpots), false, undefined);
      for (const c of sys.getLayerCritters('application')) {
        if (isAltSpecies('application', c.variant)) expect(c.motion).toBe(MotionType.Fly);
      }
    }
  });

  it('allows application birds to transition smoothly between Fly and Perch on prop tops', () => {
    const sys = new CritterSystem();
    sys.ensureSeed(11);
    const { ctx } = fakeCtx();
    const mockSpots = new Collectibles();
    mockSpots.addProp({ reaction: { x: 60, y: 100, w: 28, h: 16 } });
    mockSpots.addProp({ reaction: { x: 150, y: 120, w: 28, h: 16 } });
    mockSpots.addProp({ reaction: { x: 240, y: 105, w: 28, h: 16 } });
    const seen = new Set<MotionType>();
    for (let t = 0.05; t <= 12; t += 0.05) {
      sys.drawBand(ctx, 'application', makeBand(t, false, 0, mockSpots), false, undefined);
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
