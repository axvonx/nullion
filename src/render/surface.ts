import { enforce } from '../core/enforce';

/** What a post-pass draws into: the scene canvas with a same-size scratch canvas for copy-and-displace effects. */
export interface Surface {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  scratch: HTMLCanvasElement;
  scratchCtx: CanvasRenderingContext2D;
  /** Scene size in scene pixels. */
  W: number;
  H: number;
}

export function get2d(c: HTMLCanvasElement): CanvasRenderingContext2D {
  const ctx = c.getContext('2d', { willReadFrequently: true });
  enforce(ctx, '2D canvas unavailable');
  return ctx;
}

/** 4x4 Bayer ordered-dither thresholds, 0..15. */
export const BAYER16 = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];
