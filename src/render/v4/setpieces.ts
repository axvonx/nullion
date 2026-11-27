import type { LayerId } from '../../core/layers';
import { LAYER_ART } from '../../layers';
import { R, mod, rect } from '../../layers/shared/draw-kit';
import type { DetailEnv, SetpieceEnv } from '../../layers/types';
import { hash, type Band } from '../art-common';

/**
 * Full-bleed monumental deep-background architectural setpieces for all 31 layers. Each layer draws its own, in its
 * module (`LAYER_ART[id].setpiece`): a base pass, then a second pass of small ambient animated details so no region
 * of a band reads as static or empty. This file only computes the band's safe span and runs the two passes.
 *
 * Every layer's setpiece spans the full width (0..W) and height (top..bottom) of its band. All colours pass through
 * `c()` to snap cleanly onto each layer's palette, and `t === 0` freezes every animation cleanly for reduced motion
 * and Ring −2.
 */

type Ctx = CanvasRenderingContext2D;

/** Safe visible vertical bounds inside a band (clamped for open-ended top/bottom bands). */
function bandSpan(b: Band, open: 'top' | 'bottom' | undefined): { top: number; bot: number; mid: number; h: number } {
  const top = open === 'top' ? Math.max(b.top, b.bottom - 260) : b.top + 14;
  const bot = open === 'bottom' ? Math.min(b.bottom, b.top + 340) : b.bottom - 6;
  const h = Math.max(120, bot - top);
  return { top: R(top), bot: R(bot), mid: R(top + h * 0.5), h: R(h) };
}

export function drawSetpiece(ctx: Ctx, b: Band, id: LayerId, t: number) {
  const art = LAYER_ART[id];
  const { top, bot, mid: cy, h: H } = bandSpan(b, art.open);
  const W = b.w;
  const env: SetpieceEnv = { ctx, b, t, W, cx: R(W / 2), top, bot, cy, H };
  art.setpiece.base(env);
  if (!art.setpiece.detail) return;
  const detail: DetailEnv = {
    ...env,
    lamps(y, n, on, off, speed = 2) {
      for (let k = 0; k < n; k++) {
        const x = R(((k + 0.5) / n) * W);
        rect(ctx, x - 1, y, 2, 2, Math.floor(t * speed + k * 1.7) % 3 === 0 ? on : off);
      }
    },
    rise(n, speed, seed, col, drift = 3) {
      for (let k = 0; k < n; k++) {
        const x = hash(seed + k * 7) * W + Math.sin(t * 0.8 + k) * drift;
        const y = bot - mod(t * speed + hash(seed + k * 13) * H, H);
        rect(ctx, x, y, 1, 2, col);
      }
    },
    fall(n, speed, seed, col) {
      for (let k = 0; k < n; k++) {
        const x = hash(seed + k * 7) * W;
        const y = top + mod(t * speed + hash(seed + k * 13) * H, H);
        rect(ctx, x, y, 2, 3, col);
      }
    },
  };
  art.setpiece.detail(detail);
}
