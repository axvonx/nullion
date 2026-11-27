import type { LayerId } from '../core/layers';

/** Color depth drops (or shifts into physical/hardware false-color masks) as you descend. */
export type PaletteMode =
  | 'full'
  | 'rgb6'
  | 'rgb4'
  | 'cga16'
  | 'cga4'
  | 'green'
  | 'gray'
  | 'onebit'
  | 'amber'
  | 'blueprint'
  | 'wafer'
  | 'euv'
  | 'abyss';

export const LAYER_PALETTE: Record<LayerId, PaletteMode> = {
  internet: 'full',
  browser: 'full',
  application: 'full',
  bytecode: 'rgb6',
  jit: 'rgb6',
  runtime: 'rgb6',
  libraries: 'rgb4',
  linker: 'rgb4',
  userspace: 'cga16',
  'kernel-entry': 'cga16',
  kernel: 'cga16',
  'kernel-arch': 'cga16',
  drivers: 'cga4',
  'bus-fabric': 'cga4',
  firmware: 'green',
  vmm: 'green',
  'ring-1': 'green',
  ept: 'green',
  'ring-2': 'gray',
  smram: 'gray',
  'ring-3': 'onebit',
  'me-minix-user': 'amber',
  'me-minix-kern': 'amber',
  uarch: 'blueprint',
  rtl: 'blueprint',
  cmos: 'wafer',
  litho: 'euv',
  bandgap: 'abyss',
  landauer: 'abyss',
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
/** Uncanny miniature amber-phosphor CRT for ME / MINIX 3. */
const AMBER: RGB[] = [[10, 5, 0], [88, 44, 4], [196, 114, 16], [255, 208, 96]];
/** Crisp cyan/white blueprint schematic for Microarchitecture & RTL. */
const BLUEPRINT: RGB[] = [[4, 12, 24], [18, 56, 102], [58, 178, 230], [228, 248, 255]];
/** 4-color semiconductor lithography wafer masks (substrate, teal diffusion, violet poly, copper metal, white via). */
const WAFER: RGB[] = [[8, 6, 14], [36, 152, 156], [148, 72, 212], [232, 132, 56], [248, 246, 240]];
/** 13.5nm EUV photolithography deep-violet + stark white. */
const EUV: RGB[] = [[8, 4, 18], [58, 24, 118], [142, 78, 232], [244, 236, 255]];
/** Abyssal indigo & pale cyan quantum/Landauer dark-field. */
const ABYSS: RGB[] = [[3, 4, 10], [16, 28, 64], [76, 168, 214], [230, 248, 255]];

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

const lumOf = (c: RGB) => (0.3 * c[0] + 0.59 * c[1] + 0.11 * c[2]) / 255;
const RAMP_PALS = [GREEN, GRAY, ONEBIT, AMBER, BLUEPRINT, EUV, ABYSS];
const LEVEL_LUMS = new Map<RGB[], number[]>(RAMP_PALS.map((p) => [p, p.map(lumOf)]));

function levelAt(pal: RGB[], lum: number): RGB | undefined {
  const lums = LEVEL_LUMS.get(pal)!;
  for (let i = 0; i < lums.length; i++) if (Math.abs(lums[i]! - lum) < 1.5 / 255) return pal[i];
  return undefined;
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
      case 'wafer':
        out = nearest(WAFER, r + bias * 90, g + bias * 90, b + bias * 90);
        break;
      default: {
        const lum = (0.3 * r + 0.59 * g + 0.11 * b) / 255;
        const pal =
          mode === 'green'
            ? GREEN
            : mode === 'gray'
              ? GRAY
              : mode === 'amber'
                ? AMBER
                : mode === 'blueprint'
                  ? BLUEPRINT
                  : mode === 'euv'
                    ? EUV
                    : mode === 'abyss'
                      ? ABYSS
                      : ONEBIT;
        // A pixel already on one of the ramp's levels stays put: the levels aren't evenly spaced, so without this
        // the dither bias would speckle solid fills (e.g. near-black backgrounds) into a dot grid.
        const exact = levelAt(pal, lum);
        out = exact ?? ramp(pal, lum + bias / (pal.length - 1));
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

/** Darkest ink colour for a layer palette (ART-STYLE.md rule 3: 1 px silhouette outline). */
export function darkestInk(mode: PaletteMode): string {
  return mode === 'full' ? '#2a3358' : snapColor('#000000', mode);
}
