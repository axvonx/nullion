import { enforce } from '../core/enforce';

/**
 * The "nullion" pixel face: uniform 7×9 monospace glyphs, a 1 px dark outline and a 2 px drop shadow. The title screen
 * animates it (title-logo.ts); this module is the one place that knows the glyphs, so every other place the word (or
 * a short string in the same style) shows up reuses it: a crisp pixelated canvas for DOM (`wordmarkCanvas`) and a
 * layout plus `drawGlyph` for painting straight into a canvas, as the scene's "ONE IN A / NULLION" banner does.
 * Covers lowercase n u l i o x, capitals A-Z, digits 0-9 and '#', plus . : - ! ? /; any other character throws.
 */

export const CELL_W = 7;
export const CELL_H = 9;
/** Blank font pixels between two letters. */
export const GAP = 2;
/** Width of a space, in font pixels. */
export const SPACE = 4;
/** The title's look. */
export const WORDMARK_FILL = '#ebe6d6';
export const WORDMARK_OUTLINE = '#0d0b12';
export const WORDMARK_SHADOW = 'rgba(0,0,0,0.68)';
export const WORDMARK_HIGHLIGHT = '#ffffff';
/** Font pixels the outline (1) and drop shadow (2) need past the glyph box. */
const BLEED_LEFT = 1;
const BLEED_RIGHT = 2;
const BLEED_TOP = 1;
const BLEED_BOTTOM = 2;

/** Uniform 7×9 monospace pixel glyphs ('#' = ink). */
const BASE_GLYPHS: Record<string, readonly string[]> = {
  n: [
    '       ',
    '       ',
    '## ### ',
    '###  ##',
    '##   ##',
    '##   ##',
    '##   ##',
    '##   ##',
    '##   ##',
  ],
  u: [
    '       ',
    '       ',
    '##   ##',
    '##   ##',
    '##   ##',
    '##   ##',
    '##   ##',
    '##  ###',
    ' ### ##',
  ],
  l: [
    '  ###  ',
    '   ##  ',
    '   ##  ',
    '   ##  ',
    '   ##  ',
    '   ##  ',
    '   ##  ',
    '   ##  ',
    '  #### ',
  ],
  i: [
    '   ##  ',
    '       ',
    '  ###  ',
    '   ##  ',
    '   ##  ',
    '   ##  ',
    '   ##  ',
    '   ##  ',
    '  #### ',
  ],
  o: [
    '       ',
    '       ',
    ' ##### ',
    '##   ##',
    '##   ##',
    '##   ##',
    '##   ##',
    '##   ##',
    ' ##### ',
  ],
  /** Bit-flip & hex-corrupt alternates. */
  '0': [
    ' ##### ',
    '##   ##',
    '##  ###',
    '## # ##',
    '###  ##',
    '##   ##',
    '##   ##',
    '##   ##',
    ' ##### ',
  ],
  '1': [
    '   ##  ',
    '  ###  ',
    ' ####  ',
    '   ##  ',
    '   ##  ',
    '   ##  ',
    '   ##  ',
    '   ##  ',
    ' ######',
  ],
  x: [
    '       ',
    '       ',
    '##   ##',
    ' ## ## ',
    '  ###  ',
    '  ###  ',
    ' ## ## ',
    '##   ##',
    '##   ##',
  ],
  F: [
    '#######',
    '##     ',
    '##     ',
    '#####  ',
    '##     ',
    '##     ',
    '##     ',
    '##     ',
    '##     ',
  ],
  E: [
    '#######',
    '##     ',
    '##     ',
    '#####  ',
    '##     ',
    '##     ',
    '##     ',
    '##     ',
    '#######',
  ],
  '3': [
    ' ##### ',
    '##   ##',
    '     ##',
    '  #### ',
    '     ##',
    '     ##',
    '     ##',
    '##   ##',
    ' ##### ',
  ],
  '2': [
    ' ##### ',
    '##   ##',
    '     ##',
    '    ## ',
    '   ##  ',
    '  ##   ',
    ' ##    ',
    '##     ',
    '#######',
  ],
  '4': [
    '    ## ',
    '   ### ',
    '  #### ',
    ' ## ## ',
    '##  ## ',
    '#######',
    '    ## ',
    '    ## ',
    '    ## ',
  ],
  '5': [
    '#######',
    '##     ',
    '##     ',
    '###### ',
    '     ##',
    '     ##',
    '     ##',
    '##   ##',
    ' ##### ',
  ],
  '6': [
    '  #### ',
    ' ##    ',
    '##     ',
    '###### ',
    '##   ##',
    '##   ##',
    '##   ##',
    '##   ##',
    ' ##### ',
  ],
  '7': [
    '#######',
    '##   ##',
    '    ## ',
    '   ##  ',
    '  ##   ',
    '  ##   ',
    '  ##   ',
    '  ##   ',
    '  ##   ',
  ],
  '8': [
    ' ##### ',
    '##   ##',
    '##   ##',
    ' ##### ',
    '##   ##',
    '##   ##',
    '##   ##',
    '##   ##',
    ' ##### ',
  ],
  '9': [
    ' ##### ',
    '##   ##',
    '##   ##',
    '##   ##',
    ' ######',
    '     ##',
    '     ##',
    '    ## ',
    ' ####  ',
  ],
  '#': [
    '       ',
    ' ## ## ',
    ' ## ## ',
    '#######',
    ' ## ## ',
    ' ## ## ',
    '#######',
    ' ## ## ',
    ' ## ## ',
  ],
  'N': [
    '##   ##',
    '###  ##',
    '#### ##',
    '## ####',
    '##  ###',
    '##   ##',
    '##   ##',
    '##   ##',
    '##   ##',
  ],
  'I': [
    '#######',
    '  ###  ',
    '  ###  ',
    '  ###  ',
    '  ###  ',
    '  ###  ',
    '  ###  ',
    '  ###  ',
    '#######',
  ],
  'A': [
    ' ##### ',
    '##   ##',
    '##   ##',
    '##   ##',
    '#######',
    '##   ##',
    '##   ##',
    '##   ##',
    '##   ##',
  ],
  'B': [
    '###### ',
    '##   ##',
    '##   ##',
    '###### ',
    '##   ##',
    '##   ##',
    '##   ##',
    '##   ##',
    '###### ',
  ],
  'C': [
    ' ##### ',
    '##   ##',
    '##     ',
    '##     ',
    '##     ',
    '##     ',
    '##     ',
    '##   ##',
    ' ##### ',
  ],
  'D': [
    '#####  ',
    '##  ## ',
    '##   ##',
    '##   ##',
    '##   ##',
    '##   ##',
    '##   ##',
    '##  ## ',
    '#####  ',
  ],
  'G': [
    ' ##### ',
    '##   ##',
    '##     ',
    '##     ',
    '##  ###',
    '##   ##',
    '##   ##',
    '##   ##',
    ' ##### ',
  ],
  'H': [
    '##   ##',
    '##   ##',
    '##   ##',
    '##   ##',
    '#######',
    '##   ##',
    '##   ##',
    '##   ##',
    '##   ##',
  ],
  'J': [
    '  #####',
    '    ## ',
    '    ## ',
    '    ## ',
    '    ## ',
    '    ## ',
    '##  ## ',
    '##  ## ',
    ' ####  ',
  ],
  'K': [
    '##   ##',
    '##  ## ',
    '## ##  ',
    '####   ',
    '###    ',
    '####   ',
    '## ##  ',
    '##  ## ',
    '##   ##',
  ],
  'L': [
    '##     ',
    '##     ',
    '##     ',
    '##     ',
    '##     ',
    '##     ',
    '##     ',
    '##     ',
    '#######',
  ],
  'M': [
    '##   ##',
    '### ###',
    '#######',
    '#######',
    '## # ##',
    '##   ##',
    '##   ##',
    '##   ##',
    '##   ##',
  ],
  'O': [
    ' ##### ',
    '##   ##',
    '##   ##',
    '##   ##',
    '##   ##',
    '##   ##',
    '##   ##',
    '##   ##',
    ' ##### ',
  ],
  'P': [
    '###### ',
    '##   ##',
    '##   ##',
    '##   ##',
    '###### ',
    '##     ',
    '##     ',
    '##     ',
    '##     ',
  ],
  'Q': [
    ' ##### ',
    '##   ##',
    '##   ##',
    '##   ##',
    '##   ##',
    '## # ##',
    '##  ###',
    '##  ## ',
    ' ### ##',
  ],
  'R': [
    '###### ',
    '##   ##',
    '##   ##',
    '##   ##',
    '###### ',
    '## ##  ',
    '##  ## ',
    '##   ##',
    '##   ##',
  ],
  'S': [
    ' ##### ',
    '##   ##',
    '##     ',
    ' ####  ',
    '  #### ',
    '     ##',
    '     ##',
    '##   ##',
    ' ##### ',
  ],
  'T': [
    '#######',
    '  ###  ',
    '  ###  ',
    '  ###  ',
    '  ###  ',
    '  ###  ',
    '  ###  ',
    '  ###  ',
    '  ###  ',
  ],
  'U': [
    '##   ##',
    '##   ##',
    '##   ##',
    '##   ##',
    '##   ##',
    '##   ##',
    '##   ##',
    '##   ##',
    ' ##### ',
  ],
  'V': [
    '##   ##',
    '##   ##',
    '##   ##',
    '##   ##',
    '##   ##',
    '##   ##',
    ' ## ## ',
    ' ## ## ',
    '  ###  ',
  ],
  'W': [
    '##   ##',
    '##   ##',
    '##   ##',
    '##   ##',
    '##   ##',
    '## # ##',
    '#######',
    '#######',
    ' ## ## ',
  ],
  'X': [
    '##   ##',
    '##   ##',
    ' ## ## ',
    ' ## ## ',
    '  ###  ',
    ' ## ## ',
    ' ## ## ',
    '##   ##',
    '##   ##',
  ],
  'Y': [
    '##   ##',
    '##   ##',
    ' ## ## ',
    ' ## ## ',
    '  ###  ',
    '  ###  ',
    '  ###  ',
    '  ###  ',
    '  ###  ',
  ],
  'Z': [
    '#######',
    '     ##',
    '    ## ',
    '   ##  ',
    '  ##   ',
    '  ##   ',
    ' ##    ',
    '##     ',
    '#######',
  ],
  '.': [
    '       ',
    '       ',
    '       ',
    '       ',
    '       ',
    '       ',
    '       ',
    '  ###  ',
    '  ###  ',
  ],
  ':': [
    '       ',
    '       ',
    '  ###  ',
    '  ###  ',
    '       ',
    '       ',
    '  ###  ',
    '  ###  ',
    '       ',
  ],
  '-': [
    '       ',
    '       ',
    '       ',
    '       ',
    '#######',
    '       ',
    '       ',
    '       ',
    '       ',
  ],
  '!': [
    '  ###  ',
    '  ###  ',
    '  ###  ',
    '  ###  ',
    '  ###  ',
    '  ###  ',
    '       ',
    '  ###  ',
    '  ###  ',
  ],
  '?': [
    ' ##### ',
    '##   ##',
    '     ##',
    '    ## ',
    '   ##  ',
    '   ##  ',
    '       ',
    '   ##  ',
    '   ##  ',
  ],
  '/': [
    '     ##',
    '     ##',
    '    ## ',
    '    ## ',
    '   ##  ',
    '  ##   ',
    '  ##   ',
    '##     ',
    '##     ',
  ],
};

export const GLYPHS: Record<string, readonly string[]> = BASE_GLYPHS;
for (const [k, rows] of Object.entries(GLYPHS)) enforce(rows.length === CELL_H && rows.every((r) => r.length === CELL_W), `wordmark glyph ${k} is malformed`);

/** Draw one 7×9 glyph at pixel position (ox, oy) with a 1px black outline and optional shadow. */
export function drawGlyph(
  ctx: CanvasRenderingContext2D,
  glyph: readonly string[],
  ox: number,
  oy: number,
  fill: string,
  outline: string,
  shadow?: string,
  highlight?: string,
) {
  const px = Math.round(ox);
  const py = Math.round(oy);
  const ink = (r: number, c: number) => r >= 0 && r < CELL_H && c >= 0 && c < CELL_W && glyph[r]![c] === '#';

  if (shadow) {
    ctx.fillStyle = shadow;
    for (let r = 0; r < CELL_H; r++) {
      for (let c = 0; c < CELL_W; c++) {
        if (ink(r, c)) ctx.fillRect(px + c + 2, py + r + 2, 1, 1);
      }
    }
  }

  if (outline !== 'none') {
    ctx.fillStyle = outline;
    for (let r = -1; r <= CELL_H; r++) {
      for (let c = -1; c <= CELL_W; c++) {
        if (ink(r, c)) continue;
        let near = false;
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            if (ink(r + dr, c + dc)) {
              near = true;
              break;
            }
          }
          if (near) break;
        }
        if (near) ctx.fillRect(px + c, py + r, 1, 1);
      }
    }
  }

  for (let r = 0; r < CELL_H; r++) {
    for (let c = 0; c < CELL_W; c++) {
      if (!ink(r, c)) continue;
      const topEdge = !ink(r - 1, c);
      ctx.fillStyle = topEdge && highlight ? highlight : fill;
      ctx.fillRect(px + c, py + r, 1, 1);
    }
  }
}


export interface PlacedGlyph {
  ch: string;
  /** Left edge, in font pixels from the start of the string. */
  x: number;
  rows: readonly string[];
}

/** Where each glyph of `text` sits (spaces take room and place nothing). Throws on a character with no glyph. */
export function layoutWord(text: string): { glyphs: PlacedGlyph[]; width: number } {
  const glyphs: PlacedGlyph[] = [];
  let x = 0;
  for (const ch of text) {
    if (ch === ' ') {
      x += SPACE;
      continue;
    }
    const rows = GLYPHS[ch];
    enforce(rows, `wordmark: no glyph for ${JSON.stringify(ch)} in ${JSON.stringify(text)}`);
    glyphs.push({ ch, x, rows });
    x += CELL_W + GAP;
  }
  return { glyphs, width: Math.max(0, x - GAP) };
}

/** Width of `text` in font pixels (the glyph boxes; the outline and shadow bleed a few more). */
export function wordWidth(text: string): number {
  return layoutWord(text).width;
}

export interface WordLook {
  fill?: string;
  outline?: string;
  shadow?: string;
  highlight?: string;
}

/** Paint `text` on `ctx` at font-pixel scale 1 with its top-left glyph corner at (x, y), in the title's style. */
export function drawWord(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, look: WordLook = {}) {
  const { fill = WORDMARK_FILL, outline = WORDMARK_OUTLINE, shadow = WORDMARK_SHADOW, highlight = WORDMARK_HIGHLIGHT } = look;
  for (const g of layoutWord(text).glyphs) drawGlyph(ctx, g.rows, x + g.x, y, fill, outline, shadow, highlight);
}

/** A canvas with `text` in the title's style, `scale` CSS pixels per font pixel, crisp (pixelated). Its accessible name is the text. */
export function wordmarkCanvas(text: string, scale: number, look: WordLook = {}): HTMLCanvasElement {
  enforce(Number.isInteger(scale) && scale >= 1, `wordmark scale must be a whole number, got ${scale}`);
  const w = wordWidth(text) + BLEED_LEFT + BLEED_RIGHT;
  const h = CELL_H + BLEED_TOP + BLEED_BOTTOM;
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  c.className = 'wordmark-cv';
  // Width only: with `height: auto` (style.css) a narrow screen can shrink it and keep the proportions.
  c.style.width = `${w * scale}px`;
  c.setAttribute('role', 'img');
  c.setAttribute('aria-label', text);
  const ctx = c.getContext('2d');
  enforce(ctx, 'wordmark: no 2d canvas context');
  drawWord(ctx, text, BLEED_LEFT, BLEED_TOP, look);
  return c;
}
