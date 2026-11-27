/**
 * Layout of the tier reveal and the layer entrance, as pure maths (CSS pixels, no DOM), so it can be unit-tested
 * for overlaps at any viewport. The HUD applies exactly these numbers.
 *
 * Top to bottom: the layer entrance band (under the header chips), the tier's name (just above the cursor),
 * the cursor's bracket mark, the details (answer and line, just below it), and the console card at the bottom.
 * Text that wouldn't fit between its neighbours steps its font size down rather than overlap.
 */

export interface Box {
  top: number;
  bottom: number;
}

/** Glyph advance estimates (em), on the generous side, and the line heights set in style.css. */
export const DISPLAY_ADVANCE = 0.72;
export const BODY_ADVANCE = 0.46;
export const NAME_LINE = 1.05;
export const BODY_LINE = 1.15;

/** Gaps, in CSS px. */
export const MARK_GAP = 8;
export const BAND_GAP = 6;
/** The header chips' bottom edge, and where the entrance band starts under them. */
export const CHIPS_BOTTOM = 44;
export const ENTRANCE_TOP = 50;
/** Side margins of the text columns (style.css), and the debug rail's extra right margin on narrow screens. */
export const SIDE = 16;
export const RAIL_RESERVE = 48;

/** Height the console card can take while a reveal is up (prompt line replaced by the button), by viewport width. */
export function consoleBetweenHeight(vw: number): number {
  return vw < 760 ? 190 : 175;
}

const clamp = (lo: number, v: number, hi: number) => Math.max(lo, Math.min(hi, v));

/** Lines a text wraps to at a font size and column width (word wrap rounds up, so add a little slack). */
export function lineCount(text: string, fontPx: number, advanceEm: number, width: number): number {
  if (!text) return 0;
  const perLine = Math.max(1, Math.floor(width / (fontPx * advanceEm)));
  const words = text.split(/\s+/);
  let lines = 1;
  let used = 0;
  for (const w of words) {
    const len = w.length;
    if (used === 0) used = len;
    else if (used + 1 + len <= perLine) used += 1 + len;
    else {
      lines++;
      used = len;
    }
    // A word longer than the line breaks anywhere (overflow-wrap: anywhere).
    while (used > perLine) {
      lines++;
      used -= perLine;
    }
  }
  return lines;
}

export interface EntranceText {
  name: string;
  desc: string;
}

export interface RevealText {
  name: string;
  answer: string;
  line: string;
  /** Timeouts are lower-key: a smaller name. */
  lowKey?: boolean;
}

export interface RevealLayout {
  entrance: Box;
  name: Box;
  mark: Box;
  body: Box;
  console: Box;
  namePx: number;
  answerPx: number;
  linePx: number;
  enNamePx: number;
  enDescPx: number;
}

export function columnWidth(vw: number, railed: boolean): number {
  return Math.min(640, vw - SIDE * 2 - (railed && vw <= 900 ? RAIL_RESERVE : 0));
}

/** The entrance band at the top: the layer's name and its one-line description. */
export function entranceBox(vw: number, t: EntranceText, railed = false): { box: Box; namePx: number; descPx: number } {
  const w = Math.min(620, vw - SIDE * 2) - 24 - (railed && vw <= 900 ? 0 : 0);
  const namePx = clamp(20, vw * 0.05, 30);
  const descPx = clamp(17, vw * 0.038, 21);
  const h = 6 + lineCount(t.name, namePx, DISPLAY_ADVANCE, w) * namePx * 1.1 + 2 + lineCount(t.desc, descPx, BODY_ADVANCE, w) * descPx * BODY_LINE + 8;
  return { box: { top: ENTRANCE_TOP, bottom: ENTRANCE_TOP + h }, namePx, descPx };
}

/**
 * The reveal around a cursor mark (from cursor-geom, in CSS px). The entrance card (old look only) may be up at the
 * same time, so the name stays below it; the details stay above the console card.
 */
export function revealLayout(vw: number, vh: number, mark: Box, t: RevealText, entrance: EntranceText | undefined, railed = false): RevealLayout {
  const w = columnWidth(vw, railed);
  // Without the entrance card (layer names live in the world) the name only has to clear the header chips.
  const en = entrance ? entranceBox(vw, entrance, railed) : { box: { top: CHIPS_BOTTOM, bottom: CHIPS_BOTTOM }, namePx: 0, descPx: 0 };
  const consoleBox = { top: vh - 16 - consoleBetweenHeight(vw), bottom: vh - 16 };

  // The name grows upward from just above the mark; step it down until it clears the entrance band.
  const nameMax = t.lowKey ? clamp(20, vw * 0.05, 30) : clamp(26, vw * 0.07, 52);
  const nameBottom = mark.top - MARK_GAP;
  let namePx = nameMax;
  const nameHeight = (px: number) => lineCount(t.name, px, DISPLAY_ADVANCE, w) * px * NAME_LINE;
  while (namePx > 16 && nameBottom - nameHeight(namePx) < en.box.bottom + BAND_GAP) namePx -= 2;
  const name = { top: nameBottom - nameHeight(namePx), bottom: nameBottom };

  // The details hang down from just below the mark; step them down until they clear the console card.
  const bodyTop = mark.bottom + MARK_GAP;
  let answerPx = clamp(22, vw * 0.05, 30);
  let linePx = clamp(18, vw * 0.04, 22);
  const bodyHeight = () =>
    lineCount(t.answer, answerPx, BODY_ADVANCE, w) * answerPx * BODY_LINE + (t.line ? 2 + lineCount(t.line, linePx, BODY_ADVANCE, w) * linePx * BODY_LINE : 0);
  while (answerPx > 16 && bodyTop + bodyHeight() > consoleBox.top - BAND_GAP) {
    answerPx -= 2;
    linePx = Math.max(15, linePx - 2);
  }
  const body = { top: bodyTop, bottom: bodyTop + bodyHeight() };
  return { entrance: en.box, name, mark, body, console: consoleBox, namePx, answerPx, linePx, enNamePx: en.namePx, enDescPx: en.descPx };
}

export const overlaps = (a: Box, b: Box) => a.top < b.bottom && b.top < a.bottom;
