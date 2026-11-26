import type { LayerId } from '../core/layers';

/** Color depth drops as you descend: you shed color the way you shed abstraction. */
export type PaletteMode = 'full' | 'rgb6' | 'rgb4' | 'cga16' | 'cga4' | 'green' | 'gray' | 'onebit';

export const LAYER_PALETTE: Record<LayerId, PaletteMode> = {
  application: 'full',
  runtime: 'rgb6',
  libraries: 'rgb4',
  userspace: 'cga16',
  kernel: 'cga16',
  drivers: 'cga4',
  firmware: 'green',
  'ring-1': 'green',
  'ring-2': 'gray',
  'ring-3': 'onebit',
};

type RGB = readonly [number, number, number];

const CGA16: RGB[] = [
  [0, 0, 0], [0, 0, 170], [0, 170, 0], [0, 170, 170], [170, 0, 0], [170, 0, 170], [170, 85, 0], [170, 170, 170],
  [85, 85, 85], [85, 85, 255], [85, 255, 85], [85, 255, 255], [255, 85, 85], [255, 85, 255], [255, 255, 85], [255, 255, 255],
];
const CGA4: RGB[] = [[0, 0, 0], [85, 255, 255], [255, 85, 255], [255, 255, 255]];
const GREEN: RGB[] = [[2, 14, 6], [10, 70, 30], [30, 160, 70], [140, 255, 160]];
const GRAY: RGB[] = [[12, 12, 12], [70, 70, 70], [130, 130, 130], [190, 190, 190], [240, 240, 240]];
const ONEBIT: RGB[] = [[4, 4, 6], [232, 238, 255]];

const BAYER4 = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5].map((v) => (v + 0.5) / 16 - 0.5);

function nearest(pal: RGB[], r: number, g: number, b: number): RGB {
  let best = pal[0]!;
  let bd = Infinity;
  for (const c of pal) {
    const d = (c[0] - r) ** 2 * 3 + (c[1] - g) ** 2 * 4 + (c[2] - b) ** 2 * 2;
    if (d < bd) {
      bd = d;
      best = c;
    }
  }
  return best;
}

function ramp(pal: RGB[], lum: number): RGB {
  const i = Math.max(0, Math.min(pal.length - 1, Math.round(lum * (pal.length - 1))));
  return pal[i]!;
}

/**
 * Quantize one row of RGBA pixels in place.
 * `dither` adds an ordered-dither offset before snapping, which keeps gradients readable at 2–5 colors.
 */
export function quantizeRow(px: Uint8ClampedArray, rowStart: number, width: number, y: number, mode: PaletteMode, dither: boolean) {
  if (mode === 'full') return;
  for (let x = 0; x < width; x++) {
    const i = rowStart + x * 4;
    const r = px[i]!, g = px[i + 1]!, b = px[i + 2]!;
    const bias = dither ? BAYER4[(y & 3) * 4 + (x & 3)]! : 0;
    let out: RGB;
    switch (mode) {
      case 'rgb6':
      case 'rgb4': {
        const steps = mode === 'rgb6' ? 5 : 3;
        const q = (v: number) => Math.round(Math.max(0, Math.min(1, v / 255 + bias / steps)) * steps) * (255 / steps);
        out = [q(r), q(g), q(b)];
        break;
      }
      case 'cga16':
        out = nearest(CGA16, r + bias * 80, g + bias * 80, b + bias * 80);
        break;
      case 'cga4':
        out = nearest(CGA4, r + bias * 120, g + bias * 120, b + bias * 120);
        break;
      default: {
        const lum = (0.3 * r + 0.59 * g + 0.11 * b) / 255;
        const pal = mode === 'green' ? GREEN : mode === 'gray' ? GRAY : ONEBIT;
        out = ramp(pal, lum + bias / (pal.length - 1));
      }
    }
    px[i] = out[0];
    px[i + 1] = out[1];
    px[i + 2] = out[2];
  }
}

const snapCache = new Map<string, string>();

/**
 * Snap a solid colour onto a palette's levels (no dither), so art drawn with it stays clean after quantize.
 * Lets one layer borrow another layer's props near a boundary without the borrowed colours turning to dither noise.
 */
export function snapColor(hex: string, mode: PaletteMode): string {
  if (mode === 'full') return hex;
  const key = `${mode}${hex}`;
  const hit = snapCache.get(key);
  if (hit) return hit;
  if (!/^#[0-9a-f]{6}$/i.test(hex)) throw new Error(`snapColor: expected #rrggbb, got ${hex}`);
  const n = parseInt(hex.slice(1), 16);
  const px = new Uint8ClampedArray([n >> 16, (n >> 8) & 255, n & 255, 255]);
  quantizeRow(px, 0, 1, 0, mode, false);
  const out = `#${((px[0]! << 16) | (px[1]! << 8) | px[2]!).toString(16).padStart(6, '0')}`;
  snapCache.set(key, out);
  return out;
}
