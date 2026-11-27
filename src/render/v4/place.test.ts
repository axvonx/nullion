import { describe, expect, it } from 'vitest';
import { ALL_LAYER_IDS, ENDLESS_LAYERS, LAYERS } from '../../core/layers';
import { LAYER_PALETTE, darkestInk } from '../palettes';
import { Pen, c, checkLibrary, outlineSilhouette, setPaint } from './kit';
import { V4_LIBRARIES } from './libraries';
import { VIEW_WINDOW, type Placed } from './place';
import { drawSetpiece } from './setpieces';
import { placeBandForSpec, placeForSpec, specKey, type WorldSpecV4 } from './world';

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
  it('all 29 daily & endless layer libraries have unique entity ids and valid sizes', () => {
    for (const id of ALL_LAYER_IDS) {
      const lib = V4_LIBRARIES[id];
      expect(() => checkLibrary(`v4 ${id}`, lib.near, 20)).not.toThrow();
      expect(() => checkLibrary(`v4 ${id} anchors`, lib.anchors, 1)).not.toThrow();
    }
  });

  it('places a valid 29-layer endless world across all zones', () => {
    const W = 427;
    const cx = Math.round(W / 2);
    let y = 28;
    const bands = ENDLESS_LAYERS.map((_, i) => {
      const h = 240;
      const b = { top: i === 0 ? -140 : y, bottom: y + h, keepOut: [] };
      y += h;
      return b;
    });
    const s: WorldSpecV4 = {
      mode: 'endless',
      seed: 13,
      scatterSeed: 77,
      W,
      bands,
      cursorLane: [cx - 16, cx + 16],
      panelLanes: [[cx - 88, cx + 88]],
    };
    const placed = placeForSpec(s);
    expect(placed).toHaveLength(29);
    for (let i = 0; i < placed.length; i++) {
      expect(placed[i]!.near.some((e) => e.anchor)).toBe(true);
      expect(placed[i]!.near.length).toBeGreaterThanOrEqual(4);
    }
  });

  it('places a valid true-endless world (Slab Spa + Kthread Kabin)', () => {
    const W = 427;
    const cx = Math.round(W / 2);
    const s: WorldSpecV4 = {
      mode: 'true-endless',
      seed: 13,
      scatterSeed: 77,
      W,
      bands: [
        { top: -140, bottom: 370, keepOut: [] },
        { top: 370, bottom: 740, keepOut: [] },
      ],
      cursorLane: [cx - 16, cx + 16],
      panelLanes: [[cx - 88, cx + 88]],
    };
    const placed = placeForSpec(s);
    expect(placed).toHaveLength(2);
    for (let i = 0; i < placed.length; i++) {
      expect(placed[i]!.near.some((e) => e.anchor)).toBe(true);
      expect(placed[i]!.near.length).toBeGreaterThanOrEqual(4);
    }
  });

  it('every layer has a library of at least 20 entity types and an anchor', () => {
    for (const l of LAYERS) {
      expect(V4_LIBRARIES[l.id].near.length).toBeGreaterThanOrEqual(20);
      expect(V4_LIBRARIES[l.id].anchors.length).toBeGreaterThanOrEqual(1);
    }
  });

  // Desktop 1280 (scale 3), 1920 (scale 4) and phone 390 (scale 2). The default run checks a dozen seeds per width;
  // V4_SWEEP=1 npx vitest run src/render/v4 checks 200.
  const env = (globalThis as { process?: { env: Record<string, string | undefined> } }).process?.env;
  const seeds = env?.V4_SWEEP ? 200 : 12;
  for (const [W, scale] of [
    [427, 3],
    [480, 4],
    [195, 2],
  ] as const) {
    it(`places a valid world at width ${W} for ${seeds} seeds`, () => {
      for (let seed = 1; seed <= seeds; seed++) {
        const s = spec(seed, W, scale);
        const bad: string[] = [];
        placeForSpec(s).forEach((layer, i) => {
          const band = s.bands[i]!;
          const where = `seed ${seed} ${LAYERS[i]!.id}`;
          if (!layer.near.some((e) => e.anchor)) bad.push(`${where}: no anchor`);
          const n = layer.near;
          for (let a = 0; a < n.length; a++) {
            const e = n[a]!;
            if (e.y < band.top || e.y + e.h > band.bottom) bad.push(`${where}: ${e.def.id} outside its band`);
            if (!(e.x + e.w <= s.cursorLane[0] || e.x >= s.cursorLane[1])) bad.push(`${where}: ${e.def.id} in the cursor lane`);
            if (band.keepOut.some((k) => e.x < k.x + k.w && k.x < e.x + e.w && e.y < k.y + k.h && k.y < e.y + e.h)) bad.push(`${where}: ${e.def.id} in a keep-out`);
            for (let b = a + 1; b < n.length; b++) if (overlap(e, n[b]!)) bad.push(`${where}: ${e.def.id} overlaps ${n[b]!.def.id}`);
            // Per-type cap: no window of VIEW_WINDOW holds more than cap copies.
            const ey = e.y + e.h / 2;
            const inView = n.filter((o) => o.def === e.def && o.y + o.h / 2 >= ey && o.y + o.h / 2 < ey + VIEW_WINDOW).length;
            if (inView > (e.def.cap ?? 2)) bad.push(`${where}: ${inView} × ${e.def.id} in one view`);
          }
          // Varied: most of what is shown is distinct.
          const types = new Set(n.map((e) => e.def.id)).size;
          if (types < Math.min(14, Math.ceil(n.length * 0.5))) bad.push(`${where}: only ${types} types in ${n.length}`);
        });
        expect(bad).toEqual([]);
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

  it('keeps major anchors recognizable while varying minor scatter across different scatterSeeds', () => {
    const a = placeForSpec({ ...spec(7, 427, 3), scatterSeed: 101 });
    const b = placeForSpec({ ...spec(7, 427, 3), scatterSeed: 202 });
    let minorChanged = 0;
    a.forEach((la, i) => {
      const lb = b[i]!;
      const anchorsA = la.near.filter((e) => e.anchor).map((e) => [e.def.id, e.x, e.y, e.v, e.look, e.flip]);
      const anchorsB = lb.near.filter((e) => e.anchor).map((e) => [e.def.id, e.x, e.y, e.v, e.look, e.flip]);
      expect(anchorsB).toEqual(anchorsA);
      const minorA = JSON.stringify(la.near.filter((e) => !e.anchor).map((e) => [e.def.id, e.x, e.y]));
      const minorB = JSON.stringify(lb.near.filter((e) => !e.anchor).map((e) => [e.def.id, e.x, e.y]));
      if (minorA !== minorB) minorChanged++;
    });
    expect(minorChanged).toBe(LAYERS.length);
  });

  it('lazy single-band placement matches full-world placement identically', () => {
    const s = { ...spec(5, 427, 3), scatterSeed: 99 };
    const full = placeForSpec(s);
    for (let i = 0; i < LAYERS.length; i++) {
      expect(placeBandForSpec(s, i)).toEqual(full[i]);
    }
  });

  it('draws monumental deep-background setpieces across all 29 layers and every daily layer keeps the 20-type minimum', () => {
    // The world cull (CLAUDE.md) shrank the Daily libraries to the 20-type floor that checkLibrary enforces; the old
    // 25+ aspiration is gone with the culled props.
    for (const l of LAYERS) {
      expect(V4_LIBRARIES[l.id].near.length).toBeGreaterThanOrEqual(20);
    }
    const band = { top: 0, bottom: 260, worldTop: 0, camY: 0, w: 360, h: 240, t: 3.5, reduced: false };
    for (const id of ALL_LAYER_IDS) {
      let rects = 0;
      const ctx = {
        fillStyle: '',
        fillRect() {
          rects++;
        },
      } as unknown as CanvasRenderingContext2D;
      setPaint(LAYER_PALETTE[id], undefined);
      drawSetpiece(ctx, band, id, 3.5);
      expect(rects).toBeGreaterThan(0);
    }
  });

  it('ART-STYLE.md: every entity is >= 8x8 px, text is <= 4 glyphs, and silhouette edge is darkest ink', () => {
    const texts: string[] = [];
    const makeCtx = (w: number, h: number) => {
      const data = new Uint8ClampedArray(w * h * 4);
      const parseHex = (hex: string): [number, number, number] => {
        const n = parseInt(hex.slice(1), 16);
        return [n >> 16, (n >> 8) & 255, n & 255];
      };
      const cxObj = {
        data,
        fillStyle: '#000000',
        font: '',
        fillRect(x: number, y: number, rw: number, rh: number) {
          const [r, g, b] = parseHex(cxObj.fillStyle);
          const x0 = Math.max(0, Math.round(x));
          const y0 = Math.max(0, Math.round(y));
          const x1 = Math.min(w, Math.round(x + rw));
          const y1 = Math.min(h, Math.round(y + rh));
          for (let yy = y0; yy < y1; yy++) {
            for (let xx = x0; xx < x1; xx++) {
              const p = (yy * w + xx) * 4;
              data[p] = r;
              data[p + 1] = g;
              data[p + 2] = b;
              data[p + 3] = 255;
            }
          }
        },
        fillText(s: string, x: number, y: number) {
          texts.push(s);
          cxObj.fillRect(x, y - 5, Math.max(1, s.length * 4), 5);
        },
        getImageData: () => ({ data, width: w, height: h }),
        putImageData(img: { data: Uint8ClampedArray }) {
          data.set(img.data);
        },
      };
      return cxObj as unknown as CanvasRenderingContext2D;
    };

    const pen = new Pen();
    const badSizes: string[] = [];
    const badText: string[] = [];
    const badOutline: string[] = [];

    for (const id of ALL_LAYER_IDS) {
      const mode = LAYER_PALETTE[id];
      setPaint(mode, undefined);
      const inkHex = c(darkestInk(mode));
      const inkN = parseInt(inkHex.slice(1), 16);
      const [ir, ig, ib] = [inkN >> 16, (inkN >> 8) & 255, inkN & 255];
      const lib = V4_LIBRARIES[id];
      for (const def of [...lib.anchors, ...lib.near]) {
        def.sizes.forEach(([w, h], v) => {
          if (w < 8 || h < 8) badSizes.push(`${id}/${def.id} v${v}: ${w}x${h}`);
          const cx = makeCtx(w, h);
          texts.length = 0;
          def.draw(pen.at(cx, 0, 0, w, false, 1), w, h, v);
          for (const s of texts) if (s.length > 4) badText.push(`${id}/${def.id}: "${s}"`);
          outlineSilhouette(cx, w, h, inkHex);
          const d = (cx as unknown as { data: Uint8ClampedArray }).data;
          for (let y = 0; y < h; y++) {
            for (let x = 0; x < w; x++) {
              const p = (y * w + x) * 4;
              if (d[p + 3]! < 128) continue;
              const edge =
                x === 0 ||
                x === w - 1 ||
                y === 0 ||
                y === h - 1 ||
                d[(y * w + x - 1) * 4 + 3]! < 128 ||
                d[(y * w + x + 1) * 4 + 3]! < 128 ||
                d[((y - 1) * w + x) * 4 + 3]! < 128 ||
                d[((y + 1) * w + x) * 4 + 3]! < 128;
              if (edge && (d[p] !== ir || d[p + 1] !== ig || d[p + 2] !== ib)) {
                badOutline.push(`${id}/${def.id} v${v} (${x},${y})`);
              }
            }
          }
        });
      }
    }
    expect(badSizes).toEqual([]);
    expect(badText).toEqual([]);
    expect(badOutline).toEqual([]);
  });
});
