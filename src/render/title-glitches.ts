import { reducedMotion } from '../looks';
import { drawMiniNullion, type TitleGlitchEvent } from '../ui/title-logo';
import { FONT, hash } from './art-common';
import type { Collectibles } from './collectibles';
import { quantizeRow, type PaletteMode } from './palettes';
import type { Surface } from './surface';

/**
 * The title wordmark's glitches, reflected into the live sky behind it: a burst effect on the whole canvas (mirror
 * shimmer, prop shudder, scanline tears, a void, an inverted patch, a palette drop) plus drifting mini "nullion"
 * ghosts, falling pixels and hex tags. The wordmark fires `trigger`; the Scene calls `draw` each frame (over the
 * world, under the cursor) and `clear` when play begins. All of it is off under reduced motion.
 */
export class TitleGlitches {
  /** The burst in progress. */
  private burst: (TitleGlitchEvent & { start: number }) | undefined;
  private ghosts: {
    x: number;
    y: number;
    vx: number;
    vy: number;
    fill: string;
    outline: string;
    pxSize: 1 | 2;
    flipped: boolean;
    start: number;
    dur: number;
  }[] = [];
  private drips: { x: number; y: number; vy: number; color: string; start: number; dur: number }[] = [];
  private hex: { x: number; y: number; text: string; start: number; dur: number }[] = [];

  /**
   * Reflect a title-screen wordmark glitch into the live background sky: mini "nullion" ghosts,
   * drifting pixels, hex tags, localized palette drops, tears, voids, and prop shudders.
   * Returns true when the cursor should sway too (a stack echo).
   */
  trigger(ev: TitleGlitchEvent, W: number, H: number, cursorY: number): boolean {
    if (reducedMotion() || W === 0) return false;
    const now = performance.now();
    this.burst = { ...ev, start: now };
    const cx = Math.round(W / 2);

    // Spawn small drifting "nullion" ghost clones in the sky for mini-ghosts, stack-echo, and occasionally bitflip.
    if (ev.kind === 'mini-ghosts' || ev.kind === 'stack-echo' || (ev.kind === 'bitflip' && hash(ev.seed) > 0.45)) {
      const count = ev.kind === 'mini-ghosts' ? 4 : 1;
      const fills = ['#ebe6d6', '#5fd3e0', '#ffb000', '#c58bff', '#8cff9c', '#ff6ad5'];
      for (let k = 0; k < count; k++) {
        const s = ev.seed + k * 29;
        const pxSize: 1 | 2 = hash(s + 1) > 0.72 ? 2 : 1;
        const w = 28 * pxSize;
        // Scatter around the sky, favouring the left/right flanks and upper-mid sky around the title.
        let gx = Math.round(8 + hash(s + 2) * Math.max(8, W - w - 16));
        let gy = Math.round(14 + hash(s + 3) * Math.max(12, H * 0.72));
        if (ev.kind === 'stack-echo') {
          gx = Math.max(6, Math.min(W - w - 6, cx - Math.round(w / 2) + Math.round((hash(s + 4) - 0.5) * 30)));
          gy = Math.max(12, cursorY - 26 + k * 14);
        }
        this.ghosts.push({
          x: gx,
          y: gy,
          vx: (hash(s + 5) - 0.5) * 14,
          vy: 5 + hash(s + 6) * 12,
          fill: fills[Math.floor(hash(s + 7) * fills.length)]!,
          outline: '#0d0b12',
          pxSize,
          flipped: ev.kind === 'bitflip' || hash(s + 8) > 0.55,
          start: now,
          dur: 1100 + hash(s + 9) * 900,
        });
      }
      if (this.ghosts.length > 12) this.ghosts.splice(0, this.ghosts.length - 12);
    }

    if (ev.kind === 'pixel-rain') {
      const colors = ['#ebe6d6', '#5fd3e0', '#ffb000', '#ffffff'];
      for (let k = 0; k < 14; k++) {
        const s = ev.seed + k * 13;
        this.drips.push({
          x: Math.round(cx + (hash(s + 1) - 0.5) * Math.min(W * 0.7, 160)),
          y: Math.max(6, cursorY - 45 + Math.round(hash(s + 2) * 28)),
          vy: 28 + hash(s + 3) * 36,
          color: colors[k % colors.length]!,
          start: now,
          dur: 700 + hash(s + 4) * 500,
        });
      }
      if (this.drips.length > 28) this.drips.splice(0, this.drips.length - 28);
    }

    if (ev.kind === 'hex-corrupt') {
      const addrs = ['0x0000', '0x7F00', '0xDEAD', '0xNULL', '0xFF01', '0x0007', '0xCAFE'];
      for (let k = 0; k < 2; k++) {
        const s = ev.seed + k * 31;
        this.hex.push({
          x: Math.round(12 + hash(s + 1) * Math.max(10, W - 56)),
          y: Math.round(18 + hash(s + 2) * Math.max(12, H * 0.7)),
          text: addrs[Math.floor(hash(s + 3) * addrs.length)]!,
          start: now,
          dur: 720,
        });
      }
      if (this.hex.length > 6) this.hex.splice(0, this.hex.length - 6);
    }

    return ev.kind === 'stack-echo';
  }

  /** Clear any active title-screen background artifacts (called when diving into round 1 or entering scroll mode). */
  clear() {
    this.burst = undefined;
    this.ghosts.length = 0;
    this.drips.length = 0;
    this.hex.length = 0;
  }

  /**
   * Title-screen background reflections: draws mini "nullion" ghost clones, pixel drips, hex tags,
   * localized palette drops, horizontal tears, NPE voids, localized bit-flip patches, and prop shudders.
   */
  draw(s: Surface, props: Collectibles, now: number, dt: number, reduced: boolean) {
    if (reduced) {
      this.clear();
      return;
    }
    const { ctx, W, H } = s;

    // 1. Active burst effects on the live sky canvas
    const b = this.burst;
    if (b && now - b.start >= b.dur) this.burst = undefined;
    if (this.burst) {
      const tb = this.burst;
      const p = (now - tb.start) / tb.dur;
      switch (tb.kind) {
        case 'mirror-flip': {
          // Half-mirror shimmer across the vertical centerline of the live sky (left→right, then right→left).
          s.scratchCtx.drawImage(s.canvas, 0, 0);
          const mid = Math.floor(W / 2);
          const firstLeft = hash(tb.seed + 4) > 0.5;
          const mirrorLeftToRight = p < 0.5 ? firstLeft : !firstLeft;
          ctx.save();
          ctx.globalAlpha = 0.34 * Math.sin(p * Math.PI);
          ctx.translate(W, 0);
          ctx.scale(-1, 1);
          if (mirrorLeftToRight) {
            ctx.drawImage(s.scratch, 0, 0, mid, H, 0, 0, mid, H);
          } else {
            ctx.drawImage(s.scratch, mid, 0, W - mid, H, mid, 0, W - mid, H);
          }
          ctx.restore();
          break;
        }
        case 'race': {
          // Jiggle a handful of background props in sympathy with the title.
          s.scratchCtx.drawImage(s.canvas, 0, 0);
          const rects = props.reactionTargets(tb.seed, 14, W, H);
          rects.forEach(([x, y, w, h], i) => {
            const dx = Math.round(Math.sin(now / 38 + i * 1.9) * 2.2);
            const dy = Math.round(Math.cos(now / 44 + i * 2.3) * 1.4);
            if (dx || dy) ctx.drawImage(s.scratch, x, y, w, h, x + dx, y + dy, w, h);
          });
          break;
        }
        case 'heisenbug': {
          // Horizontal scanline tear slices across the sky.
          s.scratchCtx.drawImage(s.canvas, 0, 0);
          for (let k = 0; k < 3; k++) {
            const sy = Math.floor(hash(tb.seed + k * 7) * (H - 12));
            const sh = 2 + Math.floor(hash(tb.seed + k * 7 + 1) * 7);
            const dx = Math.round(Math.sin(p * Math.PI * 2 + k) * 9);
            ctx.drawImage(s.scratch, 0, sy, W, sh, dx, sy, W, sh);
          }
          break;
        }
        case 'npe': {
          // A small pixel-aligned void rectangle opens in the sky.
          const rw = Math.round(W * (0.12 + hash(tb.seed + 1) * 0.14));
          const rh = Math.round(H * (0.08 + hash(tb.seed + 2) * 0.1));
          const rx = Math.round(hash(tb.seed + 3) * Math.max(1, W - rw));
          const ry = Math.round(hash(tb.seed + 4) * Math.max(1, H - rh));
          ctx.fillStyle = '#000000';
          ctx.fillRect(rx, ry, rw, rh);
          ctx.fillStyle = '#8fb7ff';
          ctx.fillRect(rx, ry, Math.min(10, rw), 1);
          break;
        }
        case 'bitflip': {
          // Localized pixel-aligned inverted patch (clean single hold, never full-screen strobing).
          const rw = Math.round(W * (0.14 + hash(tb.seed + 1) * 0.16));
          const rh = Math.round(H * (0.08 + hash(tb.seed + 2) * 0.1));
          const rx = Math.round(hash(tb.seed + 3) * Math.max(1, W - rw));
          const ry = Math.round(hash(tb.seed + 4) * Math.max(1, H - rh));
          if (rw > 0 && rh > 0) {
            const img = ctx.getImageData(rx, ry, rw, rh);
            const d = img.data;
            for (let i = 0; i < d.length; i += 4) {
              d[i] = 255 - d[i]!;
              d[i + 1] = 255 - d[i + 1]!;
              d[i + 2] = 255 - d[i + 2]!;
            }
            ctx.putImageData(img, rx, ry);
            ctx.strokeStyle = '#ffe25a';
            ctx.strokeRect(rx + 0.5, ry + 0.5, rw - 1, rh - 1);
          }
          break;
        }
        case 'palette-drop': {
          // Foreshadow deeper layers: a horizontal band of the sky drops color depth cleanly.
          const mode: PaletteMode = tb.palette ?? 'cga4';
          const bh = Math.round(H * 0.24);
          const y0 = Math.max(0, Math.min(H - bh, Math.round(hash(tb.seed + 1) * (H - bh))));
          if (bh > 0) {
            const img = ctx.getImageData(0, y0, W, bh);
            for (let y = 0; y < bh; y++) quantizeRow(img.data, y * W * 4, W, y0 + y, mode, true);
            ctx.putImageData(img, 0, y0);
          }
          break;
        }
        default:
          break;
      }
    }

    // 2. Drifting mini "nullion" ghost variants in the sky
    this.ghosts = this.ghosts.filter((g) => now - g.start < g.dur);
    for (const g of this.ghosts) {
      g.x += g.vx * dt;
      g.y += g.vy * dt;
      const p = (now - g.start) / g.dur;
      const a = p < 0.15 ? (p / 0.15) * 0.72 : 0.72 * (1 - (p - 0.15) / 0.85);
      drawMiniNullion(ctx, g.x, g.y, g.fill, g.outline, Math.max(0, a), g.pxSize, g.flipped);
    }

    // 3. Detached falling pixels (pixel-rain)
    this.drips = this.drips.filter((d) => now - d.start < d.dur);
    for (const d of this.drips) {
      d.y += d.vy * dt;
      const a = 1 - (now - d.start) / d.dur;
      ctx.globalAlpha = Math.max(0, a);
      ctx.fillStyle = '#000';
      ctx.fillRect(Math.round(d.x) + 1, Math.round(d.y) + 1, 2, 2);
      ctx.fillStyle = d.color;
      ctx.fillRect(Math.round(d.x), Math.round(d.y), 2, 2);
    }
    ctx.globalAlpha = 1;

    // 4. Floating hex addresses (hex-corrupt)
    this.hex = this.hex.filter((h) => now - h.start < h.dur);
    if (this.hex.length) {
      ctx.font = FONT;
      for (const h of this.hex) {
        const a = Math.sin(((now - h.start) / h.dur) * Math.PI) * 0.85;
        ctx.globalAlpha = Math.max(0, a);
        ctx.fillStyle = '#000';
        ctx.fillText(h.text, h.x + 1, h.y + 1);
        ctx.fillStyle = '#7ee0a1';
        ctx.fillText(h.text, h.x, h.y);
      }
      ctx.globalAlpha = 1;
    }
  }
}
