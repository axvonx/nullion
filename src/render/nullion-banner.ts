import { hash } from './art-common';
import type { NullionBannerState } from './reaction-fx';
import type { Surface } from './surface';
import { GLYPH_H, GLYPH_W, SPACE_W, WATERMARK_GLYPHS, lineWidth } from './v4/watermark';

/**
 * "ONE IN A / NULLION" dramatic pixel sequence shared by Bit Flip and Works on my machine:
 * dims the background so only the centered words command the stage, sparkles each row into existence
 * with rapid TitleLogo-style slice/chroma glitches, then either snaps crisp & inverted into Bit Flip's
 * +13 dive or freezes dead still for Works on my machine's fake-out.
 */
export function drawNullionBanner(s: Surface, now: number, b: NullionBannerState, reduced: boolean) {
  const { ctx, W, H } = s;
  if (b.dim > 0) {
    ctx.fillStyle = `rgba(6, 5, 10, ${b.dim.toFixed(3)})`;
    ctx.fillRect(0, 0, W, H);
  }

  const row1 = 'ONE IN A';
  const row2 = 'NULLION';
  const s1 = Math.max(1, Math.min(4, Math.floor((W * 0.76) / lineWidth(row1))));
  const s2 = Math.max(2, Math.min(6, Math.floor((W * 0.84) / lineWidth(row2))));
  const h1 = GLYPH_H * s1;
  const h2 = GLYPH_H * s2;
  const gap = Math.max(6, Math.round(s2 * 2.2));
  const totalH = h1 + gap + h2;
  const y1 = Math.round(H * 0.44 - totalH / 2);
  const y2 = y1 + h1 + gap;

  // Crisp ~12Hz stepped glitch clock during buildup (restrained enough to stay immediately readable); locked still on WOMM freeze or Bit Flip climax.
  const glitching = !reduced && !b.locked;
  const tick = b.frozen ? 13 : Math.floor(now / 85);

  const drawRow = (text: string, scale: number, y0: number, progress: number, seedBase: number, mainCol: string) => {
    if (progress <= 0) return;
    const wPx = lineWidth(text) * scale;
    const x0 = Math.round((W - wPx) / 2);

    // Compute gentle per-row horizontal slice tear offsets so the words stay legible on first-time fake-outs.
    const rowShift: number[] = [];
    for (let r = 0; r < GLYPH_H; r++) {
      if (!glitching) {
        rowShift.push(0);
      } else {
        const h = hash(tick * 31 + seedBase + r * 17);
        rowShift.push(h > 0.87 ? (hash(tick * 19 + r * 23) > 0.5 ? 1 : -1) * scale : 0);
      }
    }

    const chromaOff = glitching && hash(tick * 13 + seedBase) > 0.58 ? 1 : 0;

    let cx = x0;
    for (let ci = 0; ci < text.length; ci++) {
      const ch = text[ci]!;
      if (ch === ' ') {
        cx += SPACE_W * scale;
        continue;
      }
      const rows = WATERMARK_GLYPHS[ch];
      if (rows) {
        for (let r = 0; r < GLYPH_H; r++) {
          const row = rows[r]!;
          const sx = rowShift[r]!;
          for (let k = 0; k < GLYPH_W; k++) {
            if (row[k] !== '1') continue;
            const pixH = hash(seedBase + ci * 41 + r * 11 + k * 7);
            if (pixH > progress) continue;
            if (b.dissolve > 0 && pixH < b.dissolve) continue;

            let px = cx + k * scale + sx;
            let py = y0 + r * scale;
            if (b.dissolve > 0 && !reduced) {
              const drift = b.dissolve * 14;
              px += Math.round((hash(seedBase + ci * 13 + k) - 0.5) * drift);
              py -= Math.round(hash(seedBase + r * 19 + k) * drift);
            }

            const fresh = progress < 1 && progress - pixH < 0.16;
            // Crisp dark drop shadow
            ctx.fillStyle = '#000';
            ctx.fillRect(px + 1, py + 1, scale, scale);
            // Chromatic aberration ghosts during rapid glitch
            if (chromaOff > 0) {
              ctx.globalAlpha = 0.5;
              ctx.fillStyle = '#5fd3e0';
              ctx.fillRect(px - chromaOff, py, scale, scale);
              ctx.fillStyle = '#ff6ad5';
              ctx.fillRect(px + chromaOff, py, scale, scale);
              ctx.globalAlpha = 1;
            }
            // Main pixel (flashes bright white/cyan at birth sparkle)
            ctx.fillStyle = fresh ? (pixH > 0.5 ? '#ffffff' : '#5fd3e0') : mainCol;
            ctx.fillRect(px, py, scale, scale);
            if (fresh && !reduced) {
              // Tiny + sparkle glint on newly materialized pixels
              ctx.fillStyle = '#ffffff';
              ctx.fillRect(px - 1, py + Math.floor(scale / 2), 1, 1);
              ctx.fillRect(px + scale, py + Math.floor(scale / 2), 1, 1);
              ctx.fillRect(px + Math.floor(scale / 2), py - 1, 1, 1);
              ctx.fillRect(px + Math.floor(scale / 2), py + scale, 1, 1);
            }
          }
        }
      }
      cx += (GLYPH_W + 1) * scale;
    }
  };

  drawRow(row1, s1, y1, b.top, 101, b.locked ? '#ffffff' : '#ebe6d6');
  drawRow(row2, s2, y2, b.bottom, 307, b.locked ? '#ffe25a' : '#ffe25a');

  // Ambient sparkle pips around the words during buildup & climax.
  if (!reduced && (b.top > 0 || b.bottom > 0)) {
    const sparkCount = b.locked ? 18 : 12;
    for (let i = 0; i < sparkCount; i++) {
      const h1s = hash(tick * 29 + i * 53 + 7);
      const h2s = hash(tick * 43 + i * 71 + 11);
      const sx = Math.round(W * 0.1 + h1s * W * 0.8);
      const sy = Math.round(y1 - 14 + h2s * (totalH + 28));
      ctx.fillStyle = i % 3 === 0 ? '#ffffff' : i % 3 === 1 ? '#ffe25a' : '#5fd3e0';
      ctx.fillRect(sx, sy, 1, 1);
      if (i % 4 === 0) {
        ctx.fillRect(sx - 1, sy, 3, 1);
        ctx.fillRect(sx, sy - 1, 1, 3);
      }
    }
  }
  ctx.globalAlpha = 1;
}
