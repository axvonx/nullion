import { enforce } from '../core/enforce';
import type { TierId } from '../core/tiers';
import { SPRITES, type Sprite } from '../render/sprites';

/**
 * Tier icons drawn from the mascot itself: the player's cursor, caught in each tier's reaction pose.
 * Each is a 24×18 pixel image, built once from the cursor sprites and shown with pixelated scaling.
 * The share text keeps its emoji (it has to paste anywhere); everything on screen uses these.
 */

const W = 24;
const H = 18;

/** Tier colours, as in style.css (--t-*). */
export const TIER_INK: Record<TierId, string> = {
  'off-by-one': '#c9c4b4',
  womm: '#ff9f43',
  npe: '#8fb7ff',
  leak: '#5fd3e0',
  race: '#c58bff',
  heisenbug: '#ff6ad5',
  bitflip: '#ffe25a',
};

const WHITE = '#ffffff';
const BLACK = '#000000';

/** Draw a sprite at its top-left; `keep(r, c)` can drop pixels (dashed or half-faded poses). */
function put(cx: CanvasRenderingContext2D, s: Sprite, x: number, y: number, fill: string, outline: string, alpha = 1, keep?: (r: number, c: number, ch: string) => boolean) {
  cx.globalAlpha = alpha;
  for (let r = 0; r < s.h; r++)
    for (let c = 0; c < s.w; c++) {
      const ch = s.rows[r]![c]!;
      if (ch === ' ' || (keep && !keep(r, c, ch))) continue;
      cx.fillStyle = ch === 'X' ? outline : fill;
      cx.fillRect(x + c, y + r, 1, 1);
    }
  cx.globalAlpha = 1;
}

/** 3×5 glyphs for the null pointer's "0x0". */
const MINI: Record<string, string[]> = {
  '0': ['###', '#.#', '#.#', '#.#', '###'],
  x: ['...', '#.#', '.#.', '#.#', '...'],
};

function mini(cx: CanvasRenderingContext2D, s: string, x: number, y: number, col: string) {
  cx.fillStyle = col;
  [...s].forEach((ch, i) => {
    const g = MINI[ch];
    enforce(g, `tier icon: no mini glyph '${ch}'`);
    g.forEach((row, r) => {
      for (let c = 0; c < 3; c++) if (row[c] === '#') cx.fillRect(x + i * 4 + c, y + r, 1, 1);
    });
  });
}

const POSES: Record<TierId | 'timeout', (cx: CanvasRenderingContext2D) => void> = {
  // One cell off, with a dashed ghost where it should have landed.
  'off-by-one'(cx) {
    put(cx, SPRITES.arrow, 2, 2, WHITE, TIER_INK['off-by-one'], 1, (r, c, ch) => ch === 'X' && (r + c) % 2 === 0);
    put(cx, SPRITES.arrow, 11, 3, WHITE, BLACK);
  },
  // The comic letdown: the hourglass.
  womm(cx) {
    put(cx, SPRITES.hourglass, 7, 3, TIER_INK.womm, BLACK);
  },
  // Dereferenced null: jammed into the corner, 0x0.
  npe(cx) {
    cx.fillStyle = TIER_INK.npe;
    cx.fillRect(0, 0, 12, 1);
    cx.fillRect(0, 0, 1, 12);
    put(cx, SPRITES.arrow, 1, 1, WHITE, BLACK);
    mini(cx, '0x0', 13, 12, TIER_INK.npe);
  },
  // Trailing copies that never got freed.
  leak(cx) {
    put(cx, SPRITES.arrow, 2, 0, TIER_INK.leak, BLACK, 0.35);
    put(cx, SPRITES.arrow, 7, 2, TIER_INK.leak, BLACK, 0.65);
    put(cx, SPRITES.arrow, 12, 4, WHITE, BLACK);
  },
  // Twin cursors fighting over one spot.
  race(cx) {
    put(cx, SPRITES.arrow, 3, 2, TIER_INK.race, BLACK);
    put(cx, SPRITES.arrow, 10, 3, WHITE, BLACK);
  },
  // Half there: every other pixel missing.
  heisenbug(cx) {
    put(cx, SPRITES.arrow, 7, 2, TIER_INK.heisenbug, BLACK, 1, (r, c) => (r + c) % 2 === 0);
  },
  // The bit that flipped: an inverted 1 beside the 0 it was.
  bitflip(cx) {
    put(cx, SPRITES.bit0, 1, 4, WHITE, BLACK);
    cx.fillStyle = TIER_INK.bitflip;
    cx.fillRect(11, 2, 12, 15);
    put(cx, SPRITES.bit1, 13, 4, BLACK, TIER_INK.bitflip);
  },
  // A round that pushed nothing: an empty, dashed cell.
  timeout(cx) {
    cx.fillStyle = '#6b6878';
    for (let k = 0; k < 14; k += 2) {
      cx.fillRect(5 + k, 2, 1, 1);
      cx.fillRect(5 + k, 15, 1, 1);
      cx.fillRect(5, 2 + k, 1, 1);
      cx.fillRect(18, 3 + k, 1, 1);
    }
  },
};

const urls = new Map<string, string>();

function url(id: TierId | 'timeout'): string {
  let u = urls.get(id);
  if (u) return u;
  const c = document.createElement('canvas');
  c.width = W;
  c.height = H;
  const cx = c.getContext('2d');
  enforce(cx, 'tier icon: no 2D context');
  POSES[id](cx);
  u = c.toDataURL();
  urls.set(id, u);
  return u;
}

/** An <img> of a tier's icon at an integer pixel scale (24×18 × scale CSS px). Decorative: the tier is named beside it. */
export function tierIcon(id: TierId | 'timeout', scale = 1): HTMLImageElement {
  const img = document.createElement('img');
  img.className = 'tier-icon';
  img.src = url(id);
  img.width = W * scale;
  img.height = H * scale;
  img.alt = '';
  img.setAttribute('aria-hidden', 'true');
  return img;
}
