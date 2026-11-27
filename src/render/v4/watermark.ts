import { enforce } from '../../core/enforce';

/**
 * Layer names painted into the world: large, low-contrast pixel lettering near the top of each band, scrolling with
 * the world behind the props, like a watermark in the strata. Pure layout plus a 5×7 pixel face; the band draws it
 * (art-v4.ts) and the layer's palette dithering snaps it, so it reads as atmosphere and never as a sign.
 */

export const GLYPH_H = 7;
export const GLYPH_W = 5;
export const SPACE_W = 3;
/** Biggest lettering, in scene pixels per font pixel (a scene pixel is 3+ CSS pixels on desktop). */
const MAX_SCALE = 6;

const BAR = '00000 00000 00000 11111 00000 00000 00000';
const FACE: Record<string, string> = {
  A: '01110 10001 10001 11111 10001 10001 10001',
  B: '11110 10001 10001 11110 10001 10001 11110',
  C: '01110 10001 10000 10000 10000 10001 01110',
  D: '11110 10001 10001 10001 10001 10001 11110',
  E: '11111 10000 10000 11110 10000 10000 11111',
  F: '11111 10000 10000 11110 10000 10000 10000',
  G: '01110 10001 10000 10111 10001 10001 01111',
  H: '10001 10001 10001 11111 10001 10001 10001',
  I: '01110 00100 00100 00100 00100 00100 01110',
  J: '00111 00010 00010 00010 00010 10010 01100',
  K: '10001 10010 10100 11000 10100 10010 10001',
  L: '10000 10000 10000 10000 10000 10000 11111',
  M: '10001 11011 10101 10101 10001 10001 10001',
  N: '10001 11001 10101 10011 10001 10001 10001',
  O: '01110 10001 10001 10001 10001 10001 01110',
  P: '11110 10001 10001 11110 10000 10000 10000',
  Q: '01110 10001 10001 10001 10101 10010 01101',
  R: '11110 10001 10001 11110 10100 10010 10001',
  S: '01111 10000 10000 01110 00001 00001 11110',
  T: '11111 00100 00100 00100 00100 00100 00100',
  U: '10001 10001 10001 10001 10001 10001 01110',
  V: '10001 10001 10001 10001 10001 01010 00100',
  W: '10001 10001 10001 10101 10101 11011 10001',
  X: '10001 10001 01010 00100 01010 10001 10001',
  Y: '10001 10001 01010 00100 00100 00100 00100',
  Z: '11111 00001 00010 00100 01000 10000 11111',
  '0': '01110 10001 10011 10101 11001 10001 01110',
  '1': '00100 01100 00100 00100 00100 00100 01110',
  '2': '01110 10001 00001 00010 00100 01000 11111',
  '3': '11110 00001 00001 01110 00001 00001 11110',
  '4': '00010 00110 01010 10010 11111 00010 00010',
  '5': '11111 10000 11110 00001 00001 10001 01110',
  '6': '00110 01000 10000 11110 10001 10001 01110',
  '7': '11111 00001 00010 00100 01000 01000 01000',
  '8': '01110 10001 10001 01110 10001 10001 01110',
  '9': '01110 10001 10001 01111 00001 00010 01100',
  '-': BAR,
  '−': BAR,
  '·': '00000 00000 00000 00100 00000 00000 00000',
  '&': '01100 10010 10100 01000 10101 10010 01101',
  '/': '00001 00001 00010 00100 01000 10000 10000',
  '(': '00010 00100 01000 01000 01000 00100 00010',
  ')': '01000 00100 00010 00010 00010 00100 01000',
};

export const WATERMARK_GLYPHS: Record<string, readonly string[]> = Object.fromEntries(Object.entries(FACE).map(([k, v]) => [k, v.split(' ')]));
const ROWS = WATERMARK_GLYPHS;
for (const [k, rows] of Object.entries(ROWS)) enforce(rows.length === GLYPH_H && rows.every((r) => r.length === GLYPH_W), `watermark glyph ${k} is malformed`);

const advance = (ch: string) => (ch === ' ' ? SPACE_W : GLYPH_W + 1);

/** Width in font pixels of a line of text (no trailing gap). */
export function lineWidth(text: string): number {
  let w = 0;
  for (const ch of text) w += advance(ch);
  return Math.max(0, w - 1);
}

export interface NameLayout {
  lines: string[];
  /** Pixels per font pixel. */
  scale: number;
}

/** Greedy word wrap into at most `maxLines` lines that fit `maxW` at `scale`. */
function wrap(words: string[], maxW: number, scale: number, maxLines: number): string[] | undefined {
  const lines: string[] = [];
  let cur = '';
  for (const w of words) {
    const next = cur ? `${cur} ${w}` : w;
    if (lineWidth(next) * scale <= maxW) cur = next;
    else {
      if (!cur) return undefined;
      lines.push(cur);
      cur = w;
      if (lineWidth(cur) * scale > maxW) return undefined;
    }
  }
  if (cur) lines.push(cur);
  return lines.length <= maxLines ? lines : undefined;
}

/**
 * The biggest lettering that fits in `maxW` scene pixels: one line when that is at least 3× scale, otherwise it
 * wraps to up to three lines (phones) to stay large.
 */
export function layoutName(name: string, maxW: number): NameLayout {
  const text = name.toUpperCase();
  for (const ch of text) enforce(ch === ' ' || ch in ROWS, `watermark: no glyph for "${ch}" in "${name}"`);
  const words = text.split(' ');
  let best: NameLayout | undefined;
  for (const maxLines of [1, 2, 3]) {
    for (let scale = MAX_SCALE; scale >= 1; scale--) {
      const lines = wrap(words, maxW, scale, maxLines);
      if (lines) {
        if (!best || scale > best.scale) best = { lines, scale };
        break;
      }
    }
    if (best && best.scale >= 3) break;
  }
  enforce(best, `watermark: "${name}" cannot fit in ${maxW}px`);
  return best;
}

/** Full-colour layers draw the lettering as a translucent wash at this alpha. */
export const WATERMARK_ALPHA = 0.16;

/**
 * Palette layers can't hold a translucent wash (the final palette snap would round it to the background), so the
 * lettering is drawn in one of the palette's own levels, in an ordered pattern that halves ('checker') or quarters
 * ('dots') its weight: a dithered ghost of the name rather than a solid sign.
 */
export type NamePattern = 'solid' | 'checker' | 'dots';
const lit = (pattern: NamePattern, x: number, y: number) => (pattern === 'solid' ? true : pattern === 'checker' ? ((x + y) & 1) === 0 : (x & 1) === 0 && (y & 1) === 0);

/** Draw the lettering; `x0`/`y0` is the top-left of the block, `blockW` the width the lines centre in. */
export function drawName(ctx: CanvasRenderingContext2D, layout: NameLayout, x0: number, y0: number, blockW: number, color: string, pattern: NamePattern = 'solid') {
  ctx.fillStyle = color;
  const { lines, scale } = layout;
  lines.forEach((line, li) => {
    let x = x0 + Math.round((blockW - lineWidth(line) * scale) / 2);
    const y = y0 + li * (GLYPH_H + 3) * scale;
    for (const ch of line) {
      const rows = ROWS[ch];
      if (rows) {
        for (let r = 0; r < GLYPH_H; r++) {
          const row = rows[r]!;
          for (let k = 0; k < GLYPH_W; k++) {
            if (row[k] !== '1') continue;
            const px = x + k * scale;
            const py = y + r * scale;
            if (pattern === 'solid') ctx.fillRect(px, py, scale, scale);
            else for (let dy = 0; dy < scale; dy++) for (let dx = 0; dx < scale; dx++) if (lit(pattern, px + dx, py + dy)) ctx.fillRect(px + dx, py + dy, 1, 1);
          }
        }
      }
      x += advance(ch) * scale;
    }
  });
}

export function nameHeight(layout: NameLayout): number {
  return (layout.lines.length * (GLYPH_H + 3) - 3) * layout.scale;
}
