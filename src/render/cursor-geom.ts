import { SPRITES, type Sprite } from './sprites';

/**
 * Where the player's cursor and its bracket mark sit on screen. Pure (no DOM), shared by the scene's drawing and
 * the HUD's reveal layout, and unit-tested so the reveal's text never lands on the cursor.
 */

/** The cursor rests in clear air this far down the screen, above the floating console. */
export const CURSOR_FRAC = 0.37;
/** Half-size of the cursor's bracket box, the same for every cursor form (it breathes by +1). */
export const MARK_RX = 9;
export const MARK_RY = 11;
/** The brackets' black edge and breathing reach this far beyond MARK_RY (see Scene.drawMark). */
const MARK_EDGE = 3;

export type CursorForm = 'arrow' | 'ibeam' | 'block' | 'underscore' | 'bioscell' | 'bit';

/** Integer screen pixels per scene pixel: small, so the full-bleed scene can carry fine detail. */
export function pixelScale(viewportW: number): number {
  return viewportW < 700 ? 2 : viewportW > 1900 ? 4 : 3;
}

/** The scene's resting cursor row, in scene pixels, for a viewport. */
export function cursorRow(viewportW: number, viewportH: number): number {
  const scale = pixelScale(viewportW);
  return Math.round(Math.ceil(viewportH / scale) * CURSOR_FRAC);
}

/**
 * Centre of the bracket mark for a sprite drawn with its hotspot at (x, y): centred on the glyph, except a short
 * glyph (the underscore) sits at the bottom of the box, the way it sits at the bottom of a text cell.
 */
export function markCenter(spr: Sprite, x: number, y: number): { cx: number; cy: number } {
  const ox = x - spr.hx;
  const oy = y - spr.hy;
  return { cx: Math.round(ox + spr.w / 2), cy: Math.round(spr.h < 8 ? oy + spr.h - 7 : oy + spr.h / 2) };
}

/** Every sprite a cursor form can show at rest or in a reaction (the bit flips; Works on my machine is an hourglass). */
export function formSprites(form: CursorForm): Sprite[] {
  const own = form === 'bit' ? [SPRITES.bit0, SPRITES.bit1, SPRITES.bit] : [SPRITES[form]];
  return [...own, SPRITES.hourglass];
}

/** Vertical extent of the bracket mark, in scene pixels, over every sprite the form may show at the resting row. */
export function markExtentY(form: CursorForm, row: number): { top: number; bottom: number } {
  let top = Infinity;
  let bottom = -Infinity;
  for (const s of formSprites(form)) {
    const { cy } = markCenter(s, 0, row);
    top = Math.min(top, cy - MARK_RY - MARK_EDGE);
    bottom = Math.max(bottom, cy + MARK_RY + MARK_EDGE);
  }
  return { top, bottom };
}

/** How far (scene px) the cursor leans toward the player's real mouse at most: a tactile hint, not a follow. */
export const NUDGE_MAX_X = 3;
export const NUDGE_MAX_Y = 2;

/**
 * Where the cursor leans toward the real mouse pointer: (dx, dy) is the pointer minus the cursor, in scene px, and
 * `reach` the distance (scene px) at which the lean is full. The lean grows smoothly with distance and never passes
 * NUDGE_MAX_X / NUDGE_MAX_Y, so the cursor stays in its lane.
 */
export function cursorNudge(dx: number, dy: number, reach: number): { x: number; y: number } {
  const d = Math.hypot(dx, dy);
  if (d === 0 || reach <= 0) return { x: 0, y: 0 };
  const k = Math.min(1, d / reach);
  const ease = k * (2 - k); // eases out: near the cursor it barely moves
  return { x: (dx / d) * ease * NUDGE_MAX_X, y: (dy / d) * ease * NUDGE_MAX_Y };
}
