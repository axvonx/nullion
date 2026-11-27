// @vitest-environment happy-dom
import { describe, expect, it } from 'vitest';
import { CELL_H, CELL_W, GAP, GLYPHS, SPACE, layoutWord, wordWidth, wordmarkCanvas } from './wordmark';

describe('wordmark', () => {
  it('every glyph is a 7x9 grid', () => {
    for (const [k, rows] of Object.entries(GLYPHS)) {
      expect(rows, k).toHaveLength(CELL_H);
      for (const r of rows) expect(r, k).toHaveLength(CELL_W);
    }
  });

  it('has everything the end card and the banner need', () => {
    for (const ch of 'nullion0123456789#ABCDEFGHIJKLMNOPQRSTUVWXYZ.:-!?/') expect(GLYPHS[ch], ch).toBeDefined();
    expect(() => layoutWord('ONE IN A')).not.toThrow();
    expect(() => layoutWord('nullion #42')).not.toThrow();
    expect(() => layoutWord('ENDLESS')).not.toThrow();
  });

  it('lays glyphs out on the 9 px pitch with a 4 px space', () => {
    expect(wordWidth('nullion')).toBe(7 * CELL_W + 6 * GAP);
    const l = layoutWord('n n');
    expect(l.glyphs.map((g) => g.x)).toEqual([0, CELL_W + GAP + SPACE]);
  });

  it('throws loudly on a character it has no glyph for', () => {
    expect(() => layoutWord('nullion~')).toThrow(/no glyph/);
  });

  it('a canvas is whole-number scaled and named by its text', () => {
    (HTMLCanvasElement.prototype as { getContext: unknown }).getContext = () => new Proxy({}, { get: () => () => undefined, set: () => true });
    const c = wordmarkCanvas('#7', 3);
    expect(c.getAttribute('aria-label')).toBe('#7');
    expect(c.width).toBe(wordWidth('#7') + 3);
    expect(c.style.width).toBe(`${c.width * 3}px`);
    expect(() => wordmarkCanvas('x', 1.5)).toThrow();
  });
});
