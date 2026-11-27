import { describe, expect, it } from 'vitest';
import { NUDGE_MAX_X, NUDGE_MAX_Y, cursorNudge } from './cursor-geom';

describe('cursor nudge toward the real mouse', () => {
  it('leans toward the pointer, never past the cap', () => {
    const far = cursorNudge(1000, 0, 200);
    expect(far.x).toBeCloseTo(NUDGE_MAX_X);
    expect(far.y).toBeCloseTo(0);
    const up = cursorNudge(0, -1000, 200);
    expect(up.y).toBeCloseTo(-NUDGE_MAX_Y);
    for (const [dx, dy] of [[300, 300], [-50, 20], [5, -400], [-1e6, 1e6]] as const) {
      const n = cursorNudge(dx, dy, 200);
      expect(Math.abs(n.x)).toBeLessThanOrEqual(NUDGE_MAX_X + 1e-9);
      expect(Math.abs(n.y)).toBeLessThanOrEqual(NUDGE_MAX_Y + 1e-9);
      expect(Math.sign(n.x)).toBe(Math.sign(dx));
      expect(Math.sign(n.y)).toBe(Math.sign(dy));
    }
  });

  it('barely moves when the pointer is near the cursor, and not at all on top of it', () => {
    expect(cursorNudge(0, 0, 200)).toEqual({ x: 0, y: 0 });
    expect(Math.abs(cursorNudge(4, 0, 200).x)).toBeLessThan(0.2);
    expect(Math.abs(cursorNudge(100, 0, 200).x)).toBeLessThan(NUDGE_MAX_X);
  });
});
