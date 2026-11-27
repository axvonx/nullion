import type { LayerId } from '../../core/layers';
import { hash, type Band } from '../art';
import { c } from './kit';

/**
 * Full-bleed monumental deep-background architectural setpieces for all 29 Daily + Endless layers.
 *
 * Every layer's setpiece spans the full width (0..W) and height (top..bottom) of its band so there are
 * no empty voids—combining a central focal monument with flanking wings, environmental framing, fine
 * architectural details (rivets, mullions, pin rows, flanges, telemetry bars), and smooth background
 * animation (sweeping cranes, turning cogs, packet trains, drifting embers, pulsing buses, diffraction
 * waves). All colours pass through `c()` to snap cleanly onto each layer's palette, and `t === 0`
 * freezes every animation cleanly for reduced motion and Ring −2.
 */

type Ctx = CanvasRenderingContext2D;
const R = Math.round;
const TAU = Math.PI * 2;
const mod = (n: number, m: number) => ((n % m) + m) % m;

function rect(ctx: Ctx, x: number, y: number, w: number, h: number, col: string) {
  w = R(w);
  h = R(h);
  if (w <= 0 || h <= 0) return;
  ctx.fillStyle = c(col);
  ctx.fillRect(R(x), R(y), w, h);
}

function px(ctx: Ctx, x: number, y: number, col: string) {
  ctx.fillStyle = c(col);
  ctx.fillRect(R(x), R(y), 1, 1);
}

function line(ctx: Ctx, x0: number, y0: number, x1: number, y1: number, col: string) {
  x0 = R(x0);
  y0 = R(y0);
  x1 = R(x1);
  y1 = R(y1);
  const dx = Math.abs(x1 - x0);
  const dy = -Math.abs(y1 - y0);
  const sx = x0 < x1 ? 1 : -1;
  const sy = y0 < y1 ? 1 : -1;
  let err = dx + dy;
  ctx.fillStyle = c(col);
  for (let n = 0; n < 720; n++) {
    ctx.fillRect(x0, y0, 1, 1);
    if (x0 === x1 && y0 === y1) return;
    const e2 = 2 * err;
    if (e2 >= dy) {
      err += dy;
      x0 += sx;
    }
    if (e2 <= dx) {
      err += dx;
      y0 += sy;
    }
  }
}

function disc(ctx: Ctx, cx: number, cy: number, rad: number, col: string) {
  ctx.fillStyle = c(col);
  for (let dy = -rad; dy <= rad; dy++) {
    const half = Math.floor(Math.sqrt(rad * rad - dy * dy) + 0.35);
    ctx.fillRect(R(cx - half), R(cy + dy), half * 2 + 1, 1);
  }
}

function ring(ctx: Ctx, cx: number, cy: number, rad: number, col: string) {
  ctx.fillStyle = c(col);
  const n = Math.max(16, Math.ceil(rad * 6.5));
  for (let k = 0; k < n; k++) {
    const a = (k * TAU) / n;
    ctx.fillRect(R(cx + Math.cos(a) * rad), R(cy + Math.sin(a) * rad), 1, 1);
  }
}

function frame(ctx: Ctx, x: number, y: number, w: number, h: number, col: string) {
  rect(ctx, x, y, w, 1, col);
  rect(ctx, x, y + h - 1, w, 1, col);
  rect(ctx, x, y, 1, h, col);
  rect(ctx, x + w - 1, y, 1, h, col);
}

/** Monumental rotating pixel cogwheel with hub, spokes, rivets, and rim highlight. */
function giantCog(ctx: Ctx, cx: number, cy: number, rad: number, ang: number, body: string, hole: string, rim: string) {
  const teeth = Math.max(12, Math.floor(rad * 0.44));
  for (let k = 0; k < teeth; k++) {
    const a = ang + (k * TAU) / teeth;
    const tx = cx + Math.cos(a) * (rad + 4);
    const ty = cy + Math.sin(a) * (rad + 4);
    rect(ctx, tx - 3, ty - 3, 6, 6, body);
    px(ctx, tx - 2, ty - 2, rim);
  }
  disc(ctx, cx, cy, rad, body);
  ring(ctx, cx, cy, rad - 2, rim);
  ring(ctx, cx, cy, Math.max(8, R(rad * 0.66)), hole);
  disc(ctx, cx, cy, Math.max(6, R(rad * 0.54)), hole);
  for (let k = 0; k < 6; k++) {
    const a = ang + (k * TAU) / 6;
    line(ctx, cx, cy, cx + Math.cos(a) * rad * 0.72, cy + Math.sin(a) * rad * 0.72, body);
    rect(ctx, cx + Math.cos(a) * rad * 0.76 - 1, cy + Math.sin(a) * rad * 0.76 - 1, 2, 2, rim);
  }
  disc(ctx, cx, cy, 9, rim);
  disc(ctx, cx, cy, 4, hole);
}

/** Safe visible vertical bounds inside a band (clamped for open-ended top/bottom bands). */
function bandSpan(b: Band, id: LayerId): { top: number; bot: number; mid: number; h: number } {
  const isTop = id === 'application' || id === 'internet' || id === 'slab-spa';
  const isBot = id === 'ring-3' || id === 'landauer' || id === 'kthread-kabin';
  const top = isTop ? Math.max(b.top, b.bottom - 260) : b.top + 14;
  const bot = isBot ? Math.min(b.bottom, b.top + 340) : b.bottom - 6;
  const h = Math.max(120, bot - top);
  return { top: R(top), bot: R(bot), mid: R(top + h * 0.5), h: R(h) };
}

function drawSetpieceBase(ctx: Ctx, b: Band, id: LayerId, t: number) {
  const W = b.w;
  const cx = R(W / 2);
  const { top, bot, mid: cy, h: H } = bandSpan(b, id);

  switch (id) {
    // -----------------------------------------------------------------------------------------
    // Zone A — Above Application & Desktop
    case 'internet': {
      // Full-bleed stratosphere LEO constellation + twin flanking satellite dishes with radar sweeps + curved Earth horizon + ocean shimmer + 5 fiber arcs!
      for (let s = 0; s < 5; s++) {
        const sx = mod(hash(s * 19 + 3) * W + t * (4 + s * 1.5), W + 30) - 15;
        const sy = top + 14 + s * 13;
        rect(ctx, sx - 6, sy, 4, 2, '#7ab0e4');
        rect(ctx, sx + 4, sy, 4, 2, '#7ab0e4');
        rect(ctx, sx - 2, sy - 1, 5, 4, '#dfe6f6');
        if (Math.floor(t * 2 + s) % 2 === 0) px(ctx, sx, sy - 2, '#ffffff');
      }
      const base = bot;
      for (let x = 0; x < W; x += 2) {
        const dx = (x - cx) / Math.max(130, W * 0.58);
        const lh = Math.max(0, Math.round((1 - dx * dx) * 52));
        if (lh > 0) {
          rect(ctx, x, base - lh, 2, lh + 10, '#5a8cc8');
          rect(ctx, x, base - lh, 2, 2, '#c8e4fb');
          if (x % 22 === 0) rect(ctx, x, base - lh + 4, 1, Math.max(2, lh - 4), '#7aaae0');
        }
      }
      for (let k = 0; k < 5; k++) {
        const gx = mod(t * (10 + k * 3) + k * 73, W - 20) + 10;
        rect(ctx, gx, base - 8 - (k % 3) * 6, 10, 1, '#c8e4fb');
      }
      // Twin flanking ground-station satellite dishes with animated radar sweeps
      for (const [fx, dir] of [[0.09, 1], [0.91, -1]] as const) {
        const dx0 = R(W * fx);
        const dy0 = base - 20;
        rect(ctx, dx0 - 4, dy0, 8, 18, '#3d6cc4');
        line(ctx, dx0 - 10, dy0 - 6, dx0 + 10, dy0 - 12, '#dfe6f6');
        line(ctx, dx0 - 9, dy0 - 5, dx0 + 9, dy0 - 11, '#8fb8e8');
        line(ctx, dx0, dy0 - 9, dx0 + dir * 6, dy0 - 17, '#ffffff');
        const pulse = Math.floor(t * 3 + fx * 10) % 3;
        ring(ctx, dx0 + dir * 6, dy0 - 17, 4 + pulse * 4, '#b4dcf8');
      }
      const towers = [0.18, 0.38, 0.62, 0.82].map((f) => {
        const tx = R(W * f);
        const dx = (tx - cx) / Math.max(130, W * 0.58);
        const ty = base - Math.max(0, Math.round((1 - dx * dx) * 52));
        rect(ctx, tx - 2, ty - 14, 4, 14, '#3d6cc4');
        rect(ctx, tx - 5, ty - 10, 10, 1, '#7ab0e4');
        rect(ctx, tx - 1, ty - 17, 2, 3, Math.floor(t * 3 + tx) % 2 ? '#ffffff' : '#59c08a');
        return [tx, ty - 14] as const;
      });
      const links: [number, number, number][] = [
        [0, 1, 42],
        [1, 2, 58],
        [2, 3, 42],
        [0, 2, 78],
        [1, 3, 86],
      ];
      links.forEach(([a, bIdx, lift], k) => {
        const [x0, y0] = towers[a]!;
        const [x1, y1] = towers[bIdx]!;
        for (let s = 0; s <= 40; s++) {
          const q = s / 40;
          const x = x0 + (x1 - x0) * q;
          const y = y0 + (y1 - y0) * q - Math.sin(q * Math.PI) * lift;
          rect(ctx, x, y, 2, 1, k < 3 ? '#8fc4f0' : '#b4dcf8');
        }
        const pq = mod(t * (0.28 + k * 0.06) + k * 0.23, 1);
        const pxX = x0 + (x1 - x0) * pq;
        const pxY = y0 + (y1 - y0) * pq - Math.sin(pq * Math.PI) * lift;
        rect(ctx, pxX - 2, pxY - 1, 5, 2, '#ffffff');
      });
      // Thick undersea fiber-optic trunk plunging from the curved horizon down into the Browser seam
      rect(ctx, cx - 7, base - 26, 14, 34, '#2a4f96');
      rect(ctx, cx - 5, base - 26, 10, 34, '#3d6cc4');
      rect(ctx, cx - 2, base - 26, 4, 34, '#8fc4f0');
      for (let fy = base - 22; fy < base + 6; fy += 8) {
        rect(ctx, cx - 8, fy, 16, 2, '#dfe6f6');
      }
      const trunkPulse = base - 24 + Math.floor(mod(t * 28, 30));
      rect(ctx, cx - 2, trunkPulse, 4, 5, '#ffffff');
      break;
    }

    case 'browser': {
      // Full-bleed Giant Browser & DevTools Inspector Diorama + pixel scrollbar + magnifying glass!
      frame(ctx, 6, top + 6, W - 12, H - 12, '#6c9cd4');
      rect(ctx, 6, top + 6, W - 12, 14, '#8fb8e8');
      rect(ctx, 11, top + 10, 3, 3, '#d0605e');
      rect(ctx, 16, top + 10, 3, 3, '#e6a23c');
      rect(ctx, 21, top + 10, 3, 3, '#59c08a');
      rect(ctx, 30, top + 8, 34, 6, '#d8ecfc');
      rect(ctx, 66, top + 9, 28, 5, '#a6cbf2');
      rect(ctx, 100, top + 9, Math.max(40, W - 116), 5, '#c8e4fb');
      const splitX = R(W * 0.64);
      rect(ctx, splitX, top + 20, 1, H - 26, '#6c9cd4');
      const pageW = splitX - 28;
      // Chunky pixel scrollbar along the right margin of the viewport pane
      const sbX = splitX - 9;
      rect(ctx, sbX, top + 21, 8, H - 28, '#9cc2ee');
      frame(ctx, sbX, top + 21, 8, H - 28, '#6c9cd4');
      const thumbY = top + 24 + Math.floor((Math.sin(t * 0.6) * 0.5 + 0.5) * Math.max(10, H - 56));
      rect(ctx, sbX + 1, thumbY, 6, 18, '#5b8ee6');
      rect(ctx, sbX + 2, thumbY + 7, 4, 1, '#d8ecfc');
      rect(ctx, sbX + 2, thumbY + 10, 4, 1, '#d8ecfc');
      rect(ctx, 14, top + 26, pageW, 28, '#9cc2ee');
      frame(ctx, 14, top + 26, pageW, 28, '#7ea8dc');
      const shimX = 16 + Math.floor(mod(t * 42, Math.max(20, pageW - 18)));
      rect(ctx, shimX, top + 28, 14, 24, '#cfe6fc');
      const cardW = Math.max(16, Math.floor((pageW - 12) / 3));
      const focusCard = Math.floor(t * 0.5) % 3;
      for (let k = 0; k < 3; k++) {
        const kx = 14 + k * (cardW + 6);
        const ky = top + 62;
        const ch = Math.max(30, H - 82);
        frame(ctx, kx, ky, cardW, ch, k === focusCard ? '#59c08a' : '#8fb8e8');
        if (k === focusCard) frame(ctx, kx - 1, ky - 1, cardW + 2, ch + 2, '#59c08a');
        rect(ctx, kx + 3, ky + 4, Math.max(8, cardW - 6), 12, '#a8cef4');
        rect(ctx, kx + 3, ky + 20, Math.max(6, cardW - 10), 2, '#7ea8dc');
        rect(ctx, kx + 3, ky + 25, Math.max(4, cardW - 14), 2, '#9cc2ee');
      }
      // Giant pixel DevTools magnifying glass inspecting the focused card
      const mgX = 14 + focusCard * (cardW + 6) + R(cardW * 0.55);
      const mgY = top + 78;
      disc(ctx, mgX, mgY, 13, '#d8ecfc');
      ring(ctx, mgX, mgY, 14, '#3d6cc4');
      ring(ctx, mgX, mgY, 13, '#5b8ee6');
      rect(ctx, mgX - 6, mgY - 6, 4, 2, '#ffffff');
      for (let d = 0; d < 14; d++) {
        rect(ctx, mgX + 9 + d, mgY + 9 + d, 4, 3, '#3d6cc4');
        px(ctx, mgX + 10 + d, mgY + 9 + d, '#8fb8e8');
      }
      const hiRow = Math.floor(t * 1.6) % 7;
      for (let r = 0; r < 7; r++) {
        const ry = top + 28 + r * 14;
        if (ry > bot - 16) break;
        const indent = (r % 3) * 6;
        if (r === hiRow) rect(ctx, splitX + 4, ry - 2, W - splitX - 14, 9, '#7edba8');
        rect(ctx, splitX + 8 + indent, ry, Math.max(12, W - splitX - 24 - indent), 3, r === hiRow ? '#ffffff' : '#8fb8e8');
      }
      const sy = top + 22 + Math.floor(mod(t * 28, Math.max(20, H - 34)));
      rect(ctx, 10, sy, splitX - 22, 2, '#59c08a');
      break;
    }

    case 'application': {
      // Full-bleed Sunlit OS-Wallpaper Vista: layered cumulus cloud banks, translucent sky-bridges, 3-tier snow-capped mountains, & alpine lake reflection!
      for (let k = 0; k < 4; k++) {
        const cw = 48 + (k % 2) * 26;
        const cxCloud = mod(k * 96 + t * (2.5 + k * 0.6), W + cw) - cw;
        const cyCloud = top + 16 + (k % 3) * 22;
        rect(ctx, cxCloud + 8, cyCloud - 6, cw - 16, 6, '#e8f4fc');
        rect(ctx, cxCloud + 2, cyCloud, cw - 4, 8, '#dceefb');
        rect(ctx, cxCloud, cyCloud + 6, cw, 5, '#c2dcf4');
      }
      for (const bx of [10, W - 56]) {
        frame(ctx, bx, top + 46, 46, 28, '#8cb4e0');
        rect(ctx, bx + 2, top + 48, 42, 4, '#a8caf0');
      }
      const base = bot - 14;
      for (let x = 0; x < W; x += 2) {
        const h1 = Math.max(0, 68 - Math.abs(x - W * 0.22) * 0.44);
        const h2 = Math.max(0, 80 - Math.abs(x - W * 0.64) * 0.4);
        const h3 = Math.max(0, 56 - Math.abs(x - W * 0.92) * 0.48);
        const h = Math.round(Math.max(h1, h2, h3));
        if (h > 0) {
          rect(ctx, x, base - h, 2, h, '#6a8ac8');
          if (h > 46) rect(ctx, x, base - h, 2, Math.min(12, h - 44), '#e4f0fc');
        }
      }
      for (let x = 0; x < W; x += 2) {
        const h1 = Math.max(0, 44 - Math.abs(x - W * 0.1) * 0.55);
        const h2 = Math.max(0, 50 - Math.abs(x - W * 0.46) * 0.48);
        const h3 = Math.max(0, 46 - Math.abs(x - W * 0.8) * 0.5);
        const h = Math.round(Math.max(h1, h2, h3));
        if (h > 0) {
          rect(ctx, x, base - h, 2, h, '#4c66a8');
          if (h > 36) rect(ctx, x, base - h, 2, 3, '#8fb4e4');
        }
      }
      rect(ctx, 0, base, W, 14, '#3a4f8f');
      for (let k = 0; k < 6; k++) {
        const gx = mod(t * (8 + k * 2) + k * 64, W - 20) + 10;
        rect(ctx, gx, base + 3 + (k % 3) * 3, 16, 1, k % 2 ? '#8fb4e4' : '#c8daf4');
      }
      break;
    }

    // -----------------------------------------------------------------------------------------
    // Zone B — Expanded Runtime & Libraries
    case 'bytecode': {
      // Full-bleed World-Tree Abstract Syntax Canopy + sprocketed tape columns + diamond branches vs rounded leaf pills!
      for (const sx of [10, W - 26]) {
        rect(ctx, sx, top + 6, 16, H - 12, '#1a1a44');
        frame(ctx, sx, top + 6, 16, H - 12, '#333366');
        const off = Math.floor(t * 6) % 6;
        for (let y = top + 10 + off; y < bot - 10; y += 6) {
          // Film-style sprocket holes on both edges of the bytecode tape
          rect(ctx, sx + 1, y, 2, 2, '#000033');
          rect(ctx, sx + 13, y, 2, 2, '#000033');
          rect(ctx, sx + 4, y, 8, 2, y % 12 === 0 ? '#ffcc33' : '#666699');
        }
      }
      // Central colossal AST trunk & multi-tier boughs spanning the whole band
      rect(ctx, cx - 3, top + 14, 6, H - 24, '#333366');
      rect(ctx, cx - 16, top + 4, 32, 12, '#666699');
      rect(ctx, cx - 12, top + 7, 24, 6, '#ffcc33');
      const tiers = 4;
      for (let r = 0; r < tiers; r++) {
        const y0 = top + 24 + r * Math.floor((H - 44) / tiers);
        const y1 = y0 + 26;
        const spread = Math.min(W * 0.36, 46 + r * 28);
        for (const side of [-1, 1]) {
          const bx = cx + side * spread;
          line(ctx, cx, y0, bx, y1, '#333366');
          line(ctx, cx, y0 + 1, bx, y1 + 1, '#666699');
          // Diamond-shaped branch operator node
          for (let d = 0; d <= 7; d++) {
            rect(ctx, bx - d, y1 - 7 + d, d * 2 + 1, 1, '#333366');
            rect(ctx, bx - d, y1 + 7 - d, d * 2 + 1, 1, '#333366');
          }
          line(ctx, bx, y1 - 7, bx + 7, y1, '#9999cc');
          line(ctx, bx + 7, y1, bx, y1 + 7, '#9999cc');
          line(ctx, bx, y1 + 7, bx - 7, y1, '#9999cc');
          line(ctx, bx - 7, y1, bx, y1 - 7, '#9999cc');
          rect(ctx, bx - 1, y1 - 1, 3, 3, '#ffcc33');
          // Rounded pill leaf literal node
          line(ctx, bx, y1 + 7, bx + side * 14, y1 + 17, '#333366');
          const lx = bx + side * 14;
          const ly = y1 + 15;
          rect(ctx, lx - 5, ly, 10, 6, '#336666');
          rect(ctx, lx - 6, ly + 1, 12, 4, '#66cc99');
          rect(ctx, lx - 4, ly + 2, 8, 2, '#99ffcc');
          // Cascading token pulse
          const q = mod(t * 0.5 + r * 0.21 + (side > 0 ? 0.35 : 0), 1);
          rect(ctx, cx + side * spread * q - 2, y0 + (y1 - y0) * q - 1, 4, 3, '#ffcc33');
        }
      }
      break;
    }

    case 'jit': {
      // Full-bleed Molten Hot-Loop Crucible + twin side induction coils + giant forge anvil & glowing ingot molds!
      for (const sx of [14, W - 30]) {
        rect(ctx, sx, top + 10, 16, H - 20, '#330033');
        frame(ctx, sx, top + 10, 16, H - 20, '#663366');
        const hot = Math.floor(t * 4) % 5;
        for (let k = 0; k < 5; k++) {
          const ry = top + 18 + k * Math.floor((H - 36) / 5);
          rect(ctx, sx + 2, ry, 12, 4, k === hot ? '#ffcc33' : '#993333');
        }
      }
      // Horizontal molten feed pipes from pylons into central crucible
      rect(ctx, 30, cy - 4, W - 60, 8, '#663333');
      rect(ctx, 30, cy - 2, W - 60, 4, '#993333');
      const pulseX = 32 + Math.floor(mod(t * 48, Math.max(20, W - 68)));
      rect(ctx, pulseX, cy - 2, 10, 4, '#ffff66');
      // Colossal central crucible ring
      disc(ctx, cx, cy, 56, '#330033');
      ring(ctx, cx, cy, 56, '#993333');
      ring(ctx, cx, cy, 50, '#cc6633');
      ring(ctx, cx, cy, 40, '#663366');
      disc(ctx, cx, cy, 24, '#330033');
      ring(ctx, cx, cy, 24, '#ff9933');
      // 6 orbiting hot-loop sparks
      for (let k = 0; k < 6; k++) {
        const a = t * 1.2 + (k * TAU) / 6;
        rect(ctx, cx + Math.cos(a) * 46 - 2, cy + Math.sin(a) * 46 - 2, 4, 4, k % 2 ? '#ffff66' : '#ff6633');
      }
      // Vertical ingot chute top & native-code molten pour bottom
      rect(ctx, cx - 8, top, 16, Math.max(10, cy - 56 - top), '#333366');
      rect(ctx, cx - 8, cy + 56, 16, Math.max(10, bot - (cy + 56)), '#993333');
      rect(ctx, cx - 3, cy + 56, 6, Math.max(10, bot - (cy + 56)), '#ff9933');
      // Giant forge anvil on the lower-left wing + glowing ingot molds on the lower-right wing
      const ax = Math.max(38, cx - 102);
      const ay = bot - 34;
      rect(ctx, ax - 14, ay, 34, 8, '#663366');
      rect(ctx, ax - 22, ay + 1, 10, 5, '#993366');
      rect(ctx, ax - 14, ay, 34, 2, '#cc6699');
      rect(ctx, ax - 6, ay + 8, 18, 10, '#330033');
      frame(ctx, ax - 6, ay + 8, 18, 10, '#663366');
      rect(ctx, ax - 12, ay + 18, 30, 6, '#663366');
      // Glowing native-code ingot molds on lower-right
      const mx = Math.min(W - 72, cx + 68);
      for (let k = 0; k < 2; k++) {
        const ix = mx + k * 20;
        rect(ctx, ix, ay + 10, 16, 12, '#663333');
        rect(ctx, ix + 2, ay + 12, 12, 6, k === Math.floor(t * 2) % 2 ? '#ffff66' : '#ff9933');
      }
      break;
    }

    case 'runtime': {
      // Full-bleed Colossal Steel Heap Cavern: upper & lower truss bridges, sweeping GC crane carrying a glowing block, & lower compactor bin!
      for (const sx of [8, W - 22]) {
        rect(ctx, sx, top, 14, H, '#1e1a3a');
        rect(ctx, sx, top, 2, H, '#333366');
        rect(ctx, sx + 12, top, 2, H, '#333366');
        for (let y = top; y < bot; y += 16) line(ctx, sx + 2, y, sx + 12, y + 14, '#333366');
      }
      const beamY = top + 20;
      rect(ctx, 0, beamY, W, 6, '#333366');
      rect(ctx, 0, beamY, W, 1, '#666699');
      for (let x = 0; x < W; x += 22) {
        line(ctx, x, beamY + 6, x + 11, beamY + 20, '#333366');
        line(ctx, x + 11, beamY + 20, x + 22, beamY + 6, '#333366');
      }
      rect(ctx, 0, beamY + 20, W, 3, '#333366');
      // Lower deep-background heap catwalk & moving memory blocks
      const lowY = bot - 28;
      rect(ctx, 0, lowY, W, 4, '#333366');
      rect(ctx, 0, lowY, W, 1, '#666699');
      for (let k = 0; k < 7; k++) {
        const bx = mod(k * 58 + t * 8, W + 40) - 20;
        rect(ctx, bx, lowY - 8, 12, 8, k % 2 ? '#333366' : '#336666');
        rect(ctx, bx, lowY - 8, 12, 1, '#666699');
      }
      // Recognizable GC compactor / incinerator hopper on the lower-right catwalk
      const binX = W - 62;
      rect(ctx, binX, lowY - 22, 30, 22, '#333366');
      frame(ctx, binX, lowY - 22, 30, 22, '#666699');
      rect(ctx, binX - 4, lowY - 25, 38, 4, '#666699');
      // Hazard stripes + furnace glow slot inside compactor
      for (let sx = binX + 3; sx < binX + 26; sx += 6) rect(ctx, sx, lowY - 19, 3, 3, '#ffcc33');
      rect(ctx, binX + 5, lowY - 11, 20, 7, Math.floor(t * 5) % 2 ? '#ff9933' : '#cc3333');
      // Slow-sweeping overhead GC electromagnet crane visibly carrying a glowing memory block!
      const tx = R(W * 0.14 + (Math.sin(t * 0.28) * 0.5 + 0.5) * W * 0.72);
      const drop = 34 + R(Math.sin(t * 0.7) * 14);
      rect(ctx, tx - 10, beamY + 4, 20, 9, '#666699');
      rect(ctx, tx - 6, beamY + 6, 12, 3, '#9999cc');
      rect(ctx, tx - 1, beamY + 13, 2, drop, '#666699');
      rect(ctx, tx - 9, beamY + 13 + drop, 18, 6, '#9999cc');
      rect(ctx, tx - 7, beamY + 19 + drop, 14, 2, Math.floor(t * 4) % 2 ? '#ffff99' : '#ffcc33');
      // Glowing suspended heap block clamped under the electromagnet
      rect(ctx, tx - 7, beamY + 21 + drop, 14, 10, '#336699');
      frame(ctx, tx - 7, beamY + 21 + drop, 14, 10, '#66cccc');
      rect(ctx, tx - 4, beamY + 24 + drop, 8, 2, '#ffff99');
      rect(ctx, tx - 4, beamY + 27 + drop, 5, 2, '#99ffff');
      break;
    }

    case 'libraries': {
      // Full-bleed Grand Vaulted Reading-Room Cathedral: repeating timber arches, recessed stacks, central glowing brass rose window + warm light shafts!
      // Repeating background bookshelf bays spanning full width
      for (let x = 0; x < W; x += 48) {
        rect(ctx, x, top, 8, H, '#550000');
        rect(ctx, x, top, 2, H, '#aa5500');
        // Arched vault crown between pillars
        for (let a = 0; a < 24; a++) {
          const dx = a - 12;
          const ay = top + 16 - Math.round(Math.sqrt(Math.max(0, 144 - dx * dx)) * 0.9);
          rect(ctx, x + 8 + a * 1.6, top, 2, Math.max(2, ay - top), '#550000');
        }
        // Subtle recessed shelf horizontals
        for (let y = top + 34; y < bot - 12; y += 22) {
          rect(ctx, x + 8, y, 40, 2, '#550000');
        }
      }
      // Colossal central stained-glass / brass oculus rose window
      const oy = cy - 10;
      disc(ctx, cx, oy, 50, '#550000');
      ring(ctx, cx, oy, 50, '#aa5500');
      ring(ctx, cx, oy, 46, '#ffff55');
      ring(ctx, cx, oy, 32, '#aa5500');
      ring(ctx, cx, oy, 16, '#ffff55');
      for (let k = 0; k < 12; k++) {
        const a = (k * TAU) / 12;
        line(ctx, cx, oy, cx + Math.cos(a) * 48, oy + Math.sin(a) * 48, '#aa5500');
      }
      // Drifting golden dust motes in the rose-window light
      for (let k = 0; k < 6; k++) {
        const dx = cx - 36 + hash(k * 23) * 72;
        const dy = oy + 10 + mod(t * (3 + k) + hash(k * 11) * 60, 70);
        px(ctx, dx, dy, '#ffffaa');
      }
      break;
    }

    case 'linker': {
      // Full-bleed Great Patch-Bay Switchboard Wall: left & right jack racks, central symbol bus, sweeping animated catenary trunk cables!
      // Horizontal slate rack rails across full width
      for (let y = top + 16; y < bot - 12; y += 24) {
        rect(ctx, 0, y, W, 2, '#555555');
      }
      const leftX = 12;
      const rightX = W - 34;
      rect(ctx, leftX, top + 8, 22, H - 16, '#555555');
      rect(ctx, rightX, top + 8, 22, H - 16, '#555555');
      // Central vertical GOT/PLT relay pillar
      rect(ctx, cx - 10, top + 8, 20, H - 16, '#555555');
      frame(ctx, cx - 10, top + 8, 20, H - 16, '#aaaaaa');
      const activeCable = Math.floor(t * 2.2) % 6;
      for (let k = 0; k < 6; k++) {
        const y0 = top + 20 + k * Math.floor((H - 36) / 6);
        const y1 = top + 20 + ((k * 2 + 1) % 6) * Math.floor((H - 36) / 6);
        rect(ctx, leftX + 4, y0 - 2, 12, 4, '#000000');
        rect(ctx, rightX + 6, y1 - 2, 12, 4, '#000000');
        // Chunky plug barrels protruding from the switchboard jack bays
        rect(ctx, leftX + 16, y0 - 2, 7, 5, '#aaaaaa');
        rect(ctx, leftX + 21, y0 - 1, 3, 3, k === activeCable ? '#ffff55' : '#aa5500');
        rect(ctx, rightX - 1, y1 - 2, 7, 5, '#aaaaaa');
        rect(ctx, rightX - 2, y1 - 1, 3, 3, k === activeCable ? '#ffff55' : '#aa5500');
        rect(ctx, cx - 6, y0 - 1, 12, 3, k === activeCable ? '#ffff55' : '#000000');
        for (let s = 0; s <= 32; s++) {
          const q = s / 32;
          const x = leftX + 24 + (rightX - 2 - (leftX + 24)) * q;
          const y = y0 + (y1 - y0) * q + Math.sin(q * Math.PI) * (14 + (k % 3) * 6);
          px(ctx, x, y, k === activeCable ? '#ffff55' : k % 2 ? '#aa5500' : '#555555');
        }
        // Signal pulse traveling along active cable
        if (k === activeCable) {
          const pq = mod(t * 1.4, 1);
          const x = leftX + 24 + (rightX - 2 - (leftX + 24)) * pq;
          const y = y0 + (y1 - y0) * pq + Math.sin(pq * Math.PI) * (14 + (k % 3) * 6);
          rect(ctx, x - 2, y - 1, 4, 3, '#ffffff');
        }
      }
      // Two dangling unplugged switchboard patch cords hanging from the bottom rack
      for (const [ux, drop] of [[leftX + 24, 34], [rightX - 6, 28]] as const) {
        const uy = bot - 42;
        const sway = R(Math.sin(t * 1.1 + ux) * 3);
        line(ctx, ux, uy, ux + sway, uy + drop, '#aa5500');
        rect(ctx, ux + sway - 2, uy + drop, 4, 6, '#aaaaaa');
        rect(ctx, ux + sway - 1, uy + drop + 6, 2, 3, '#ffff55');
      }
      break;
    }

    // -----------------------------------------------------------------------------------------
    // Zone C — Userspace & Expanded OS Kernel
    case 'userspace': {
      // Full-bleed Midnight Metropolis: 2-tier depth skyline edge-to-edge + elevated transit monorail + colossal PID 1 spire + sweeping searchlight!
      const base = bot - 6;
      // Distant dark silhouette skyscrapers (tallest tier)
      for (let x = 0; x < W; x += 22) {
        const bh = 55 + Math.floor(hash(x * 17 + 3) * 75);
        rect(ctx, x, base - bh, 20, bh, '#0000aa');
        for (let wy = base - bh + 6; wy < base - 20; wy += 8) {
          if (hash(x * 13 + wy) < 0.25) rect(ctx, x + 4, wy, 2, 2, '#555555');
          if (hash(x * 29 + wy) < 0.2) rect(ctx, x + 12, wy, 2, 2, '#00aaaa');
        }
      }
      // Closer mid-rise skyline
      for (let x = 6; x < W; x += 18) {
        const bh = 26 + Math.floor(hash(x * 11 + 9) * 46);
        rect(ctx, x, base - bh, 15, bh, '#0000aa');
        rect(ctx, x, base - bh, 1, bh, '#5555ff');
        rect(ctx, x, base - bh, 15, 1, '#5555ff');
        for (let wy = base - bh + 4; wy < base - 6; wy += 6) {
          for (let wx = x + 3; wx < x + 12; wx += 4) {
            if (hash(wx * 31 + wy) < 0.3) rect(ctx, wx, wy, 2, 2, hash(wx + wy) > 0.7 ? '#55ffff' : '#555555');
          }
        }
      }
      // Colossal central PID 1 brutalist arcology spire
      const spireH = Math.min(150, Math.max(90, R(H * 0.72)));
      rect(ctx, cx - 18, base - spireH, 36, spireH, '#0000aa');
      rect(ctx, cx - 18, base - spireH, 2, spireH, '#5555ff');
      rect(ctx, cx - 10, base - spireH - 22, 20, 22, '#555555');
      rect(ctx, cx - 1, base - spireH - 42, 2, 20, '#aaaaaa');
      // Sweeping diagonal searchlight beam from PID 1 spire
      const sa = -Math.PI / 2 + Math.sin(t * 0.6) * 0.7;
      line(ctx, cx, base - spireH - 42, cx + Math.cos(sa) * 90, base - spireH - 42 + Math.sin(sa) * 70, '#00aaaa');
      rect(ctx, cx - 2, base - spireH - 44, 4, 3, Math.floor(t * 1.8) % 2 ? '#55ff55' : '#00aa00');
      // Elevated night-city monorail track with moving lit train!
      const railY = base - 22;
      rect(ctx, 0, railY, W, 2, '#555555');
      const trainX = mod(t * 28, W + 40) - 20;
      rect(ctx, trainX, railY - 4, 22, 4, '#aaaaaa');
      rect(ctx, trainX + 2, railY - 3, 18, 2, '#ffff55');
      break;
    }

    case 'kernel-entry': {
      // Full-bleed Syscall Containment Dam: full-width riveted bulkhead, flanking pressure towers, central sluice gate with animated clearance scanner!
      const wallY = cy - 36;
      rect(ctx, 0, wallY, W, 72, '#555555');
      rect(ctx, 0, wallY, W, 2, '#aaaaaa');
      rect(ctx, 0, wallY + 70, W, 2, '#000000');
      // Vertical containment buttresses spanning entire band height
      for (let x = 16; x < W; x += 48) {
        rect(ctx, x, top, 8, H, '#555555');
        rect(ctx, x, top, 1, H, '#aaaaaa');
        for (let ry = top + 8; ry < bot - 8; ry += 14) px(ctx, x + 4, ry, '#000000');
      }
      // Central glowing syscall sluice gate with chunky striped blast-gate portcullis teeth
      rect(ctx, cx - 34, wallY + 4, 68, 64, '#000000');
      frame(ctx, cx - 34, wallY + 4, 68, 64, '#55ffff');
      for (let y = wallY + 10; y < wallY + 64; y += 6) rect(ctx, cx - 30, y, 60, 1, '#00aaaa');
      // Partially raised heavy portcullis teeth + hazard header beam inside the sluice
      const gateLift = 18 + R(Math.sin(t * 0.7) * 4);
      rect(ctx, cx - 32, wallY + 6, 64, gateLift, '#555555');
      for (let sx = cx - 30; sx < cx + 28; sx += 8) {
        rect(ctx, sx, wallY + 6, 4, 4, '#ffff55');
        rect(ctx, sx + 1, wallY + 6 + gateLift, 3, 7, '#aaaaaa');
        rect(ctx, sx + 2, wallY + 13 + gateLift, 1, 3, '#ffffff');
      }
      // Animated cyan clearance scanner bar inside the sluice gate
      const scanY = wallY + 8 + Math.floor(mod(t * 22, 54));
      rect(ctx, cx - 30, scanY, 60, 2, '#55ffff');
      // Flanking pressure gauges
      for (const gx of [cx - 56, cx + 48]) {
        rect(ctx, gx, wallY + 8, 8, 56, '#000000');
        const fill = 14 + Math.floor((Math.sin(t * 1.6 + gx) * 0.5 + 0.5) * 38);
        rect(ctx, gx + 1, wallY + 63 - fill, 6, fill, '#55ffff');
      }
      break;
    }

    case 'kernel': {
      // Full-bleed Titan Clockwork Machine Room: 3 massive interlocking gears spanning the width + upper/lower steam manifolds + pulsing furnace glow!
      // Upper & lower industrial steam pipes across entire width with flanged collars
      for (const py of [top + 16, bot - 20]) {
        rect(ctx, 0, py, W, 8, '#aa0000');
        rect(ctx, 0, py, W, 2, '#ff5555');
        for (let x = 20; x < W; x += 40) rect(ctx, x, py - 2, 4, 12, '#555555');
      }
      // 3 huge interlocking flywheel gears covering left, center-left, and right
      giantCog(ctx, cx - 76, cy - 8, 52, t * 0.22, '#555555', '#000000', '#aaaaaa');
      giantCog(ctx, cx + 22, cy + 12, 42, -t * 0.27, '#aa5500', '#000000', '#ffff55');
      giantCog(ctx, cx + 106, cy - 14, 34, t * 0.34, '#555555', '#000000', '#aaaaaa');
      // Traveling pressure bubbles along the bottom steam pipe
      const bx = mod(t * 36, W);
      rect(ctx, bx, bot - 18, 8, 3, '#ffff55');
      break;
    }

    case 'kernel-arch': {
      // Full-bleed Colossal Interrupt / Tesla Relay Spire: stepped tapered spire + crown coil + thick copper busbars & bold IRQ pin collars!
      for (const sx of [6, W - 20]) {
        rect(ctx, sx, top + 8, 14, H - 16, '#555555');
        for (let y = top + 14; y < bot - 14; y += 10) rect(ctx, sx + 3, y, 8, 4, '#000000');
      }
      // Stepped Tesla relay spire silhouette (wide base, terraced middle, crown insulator rings)
      rect(ctx, cx - 28, bot - 44, 56, 36, '#555555');
      frame(ctx, cx - 28, bot - 44, 56, 36, '#ff5555');
      rect(ctx, cx - 18, top + 28, 36, H - 72, '#555555');
      frame(ctx, cx - 18, top + 28, 36, H - 72, '#ff5555');
      rect(ctx, cx - 9, top + 14, 18, 16, '#aaaaaa');
      rect(ctx, cx - 15, top + 18, 30, 3, '#ff5555');
      rect(ctx, cx - 15, top + 24, 30, 3, '#ff5555');
      disc(ctx, cx, top + 11, 6, Math.floor(t * 6) % 2 ? '#ffff55' : '#ff5555');
      const activeLine = Math.floor(t * 5) % 8;
      for (let k = 0; k < 8; k++) {
        const ly = top + 34 + k * Math.floor((H - 50) / 8);
        const hot = k === activeLine;
        const halfW = ly > bot - 44 ? 28 : 18;
        // Thick 2px copper busbars + bold IRQ pin collars
        rect(ctx, 20, ly, cx - halfW - 20, 2, hot ? '#ffff55' : '#aa0000');
        rect(ctx, cx + halfW, ly, W - 20 - (cx + halfW), 2, hot ? '#ffff55' : '#aa0000');
        rect(ctx, cx - halfW - 6, ly - 2, 6, 6, hot ? '#ffffff' : '#aaaaaa');
        rect(ctx, cx + halfW, ly - 2, 6, 6, hot ? '#ffffff' : '#aaaaaa');
        rect(ctx, cx - 10, ly - 1, 20, 4, hot ? '#ff5555' : '#000000');
        if (hot) {
          const d = mod(t * 90, Math.max(12, cx - halfW - 26));
          rect(ctx, cx - halfW - 8 - d, ly - 1, 7, 4, '#ffffff');
          rect(ctx, cx + halfW + 6 + d, ly - 1, 7, 4, '#ffffff');
        }
      }
      break;
    }

    // -----------------------------------------------------------------------------------------
    // Zone D — Drivers, Bus & Firmware
    case 'drivers': {
      // Full-bleed Motherboard Silkscreen: extruded heatsink-finned Northbridge + diagonal copper heatpipes + flanking PCIe & DIMM slots!
      const bw = 78;
      const bx = cx - 39;
      const by = cy - 39;
      // Top & bottom parallel bus rails across the entire board
      for (let k = 0; k < 4; k++) {
        rect(ctx, 0, top + 10 + k * 5, W, 1, k % 2 ? '#55ffff' : '#ff55ff');
        rect(ctx, 0, bot - 10 - k * 5, W, 1, k % 2 ? '#ff55ff' : '#55ffff');
      }
      // Flanking chunky vertical DIMM & PCIe connector slots on left and right wings
      for (const sx of [16, W - 30]) {
        rect(ctx, sx, cy - 42, 14, 84, '#000000');
        frame(ctx, sx, cy - 42, 14, 84, '#55ffff');
        rect(ctx, sx + 5, cy - 38, 4, 76, '#ff55ff');
        rect(ctx, sx + 4, cy + 4, 6, 4, '#000000'); // key notch
        for (let py = cy - 36; py < cy + 36; py += 6) {
          rect(ctx, sx + 2, py, 2, 2, '#ffffff');
          rect(ctx, sx + 10, py, 2, 2, '#ffffff');
        }
        // Retention latches at top & bottom of slot
        rect(ctx, sx - 2, cy - 46, 18, 4, '#ffffff');
        rect(ctx, sx - 2, cy + 42, 18, 4, '#ffffff');
      }
      // 45° trace highways fanning out to both screen edges
      for (let k = -4; k <= 4; k++) {
        const y = cy + k * 9;
        const col = k % 2 ? '#55ffff' : '#ff55ff';
        rect(ctx, 30, y, Math.max(4, bx - 48), 1, col);
        line(ctx, bx - 18, y, bx, y + k * 2, col);
        rect(ctx, bx + bw + 18, y, Math.max(4, W - 30 - (bx + bw + 18)), 1, col);
        line(ctx, bx + bw, y + k * 2, bx + bw + 18, y, col);
      }
      // Traveling data pulses along two trace lanes
      const pxL = 32 + mod(t * 50, Math.max(20, bx - 52));
      rect(ctx, pxL, cy - 9, 5, 2, '#ffffff');
      rect(ctx, W - pxL, cy + 9, 5, 2, '#ffffff');
      // Central Northbridge with bold extruded heatsink fin array & diagonal heatpipes
      rect(ctx, bx, by, bw, bw, '#000000');
      frame(ctx, bx, by, bw, bw, '#55ffff');
      frame(ctx, bx + 2, by + 2, bw - 4, bw - 4, '#ff55ff');
      // Vertical extruded heatsink cooling fins
      for (let fx = bx + 6; fx <= bx + bw - 8; fx += 6) {
        rect(ctx, fx, by + 6, 3, bw - 12, '#55ffff');
        rect(ctx, fx, by + 6, 1, bw - 12, '#ffffff');
      }
      // Diagonal copper-colored (magenta/white) heatpipes crossing the fin stack
      for (let d = -2; d <= 2; d++) {
        line(ctx, bx + 6, by + 12 + d, bx + bw - 12, by + bw - 6 + d, d === 0 ? '#ffffff' : '#ff55ff');
        line(ctx, bx + 12, by + 6 + d, bx + bw - 6, by + bw - 12 + d, d === 0 ? '#ffffff' : '#ff55ff');
      }
      // Center die badge & perimeter BGA pins
      rect(ctx, cx - 10, cy - 10, 20, 20, '#000000');
      frame(ctx, cx - 10, cy - 10, 20, 20, '#ffffff');
      rect(ctx, cx - 6, cy - 6, 12, 12, '#ff55ff');
      for (let p = 8; p < bw - 8; p += 6) {
        rect(ctx, bx + p, by - 3, 2, 3, '#ffffff');
        rect(ctx, bx + p, by + bw, 2, 3, '#ffffff');
      }
      break;
    }

    case 'bus-fabric': {
      // Full-bleed Chunky 4-Lane PCIe Ribbon Highways + 2× scaled PCIe Arbiter Crossbar with internal switch matrix!
      for (let g = 0; g < 4; g++) {
        const y0 = top + 14 + g * Math.floor((H - 36) / 4);
        const col = g % 2 ? '#ff55ff' : '#55ffff';
        // 4-lane bundled ribbon highway
        for (let lane = 0; lane < 4; lane++) {
          line(ctx, 0, y0 + lane * 3, W, y0 + 22 + lane * 3, lane === 0 ? '#ffffff' : col);
        }
        // Directional chevron & synchronized packet train
        const q = mod(t * (0.38 + (g % 3) * 0.12) + g * 0.17, 1);
        const pxX = R(q * W);
        const pxY = R(y0 + q * 22 + 4);
        rect(ctx, pxX - 4, pxY - 2, 9, 5, '#ffffff');
        px(ctx, pxX + 6, pxY, '#ffffff');
      }
      // 2× Scaled Central PCIe Arbiter Crossbar Diamond (radius 44) with internal switch matrix
      const rad = 44;
      for (let d = 0; d < rad; d++) {
        rect(ctx, cx - d, cy - rad + d, d * 2, 1, '#000000');
        rect(ctx, cx - d, cy + rad - d, d * 2, 1, '#000000');
      }
      for (let t0 = 0; t0 < 2; t0++) {
        line(ctx, cx, cy - rad + t0, cx + rad - t0, cy, '#ffffff');
        line(ctx, cx + rad - t0, cy, cx, cy + rad - t0, '#ffffff');
        line(ctx, cx, cy + rad - t0, cx - rad + t0, cy, '#ffffff');
        line(ctx, cx - rad + t0, cy, cx, cy - rad + t0, '#ffffff');
      }
      // Internal 4×4 crossbar switch matrix inside the diamond
      for (let r = -1; r <= 1; r++) {
        rect(ctx, cx - 18, cy + r * 8, 36, 1, '#55ffff');
        rect(ctx, cx + r * 8, cy - 18, 1, 36, '#ff55ff');
      }
      const hotNode = Math.floor(t * 4) % 9;
      for (let r = 0; r < 3; r++) {
        for (let k = 0; k < 3; k++) {
          const on = r * 3 + k === hotNode;
          rect(ctx, cx - 10 + k * 8, cy - 10 + r * 8, 4, 4, on ? '#ffffff' : '#55ffff');
        }
      }
      break;
    }

    case 'firmware': {
      // Full-bleed Riveted Steel BIOS Vault Wall + colossal 132px circular bank-vault door + heavy hinge block & keyway!
      for (let y = top + 20; y < bot - 10; y += 36) {
        rect(ctx, 0, y, W, 2, '#555555');
        for (let x = 10; x < W; x += 24) px(ctx, x, y + 4, '#aaaaaa');
      }
      const lockShift = R(Math.sin(t * 0.5) * 4);
      for (const dy of [-22, 22]) {
        rect(ctx, 0, cy + dy - 3, W, 6, '#555555');
        rect(ctx, 0, cy + dy - 1, W, 2, '#aaaaaa');
        rect(ctx, cx - 78 - lockShift, cy + dy - 5, 10, 10, '#aaaaaa');
        rect(ctx, cx + 68 + lockShift, cy + dy - 5, 10, 10, '#aaaaaa');
      }
      // Colossal 132px circular bank-vault blast door
      disc(ctx, cx, cy, 66, '#555555');
      ring(ctx, cx, cy, 66, '#aaaaaa');
      disc(ctx, cx, cy, 56, '#000000');
      ring(ctx, cx, cy, 56, '#555555');
      ring(ctx, cx, cy, 30, '#aaaaaa');
      for (let k = 0; k < 12; k++) {
        const a = (k * TAU) / 12;
        rect(ctx, cx + Math.cos(a) * 60 - 2, cy + Math.sin(a) * 60 - 2, 5, 5, '#aaaaaa');
      }
      // Chunky heavy vault hinge block on the right rim & armored keyway on the left rim
      rect(ctx, cx + 58, cy - 28, 16, 56, '#555555');
      frame(ctx, cx + 58, cy - 28, 16, 56, '#aaaaaa');
      rect(ctx, cx + 62, cy - 22, 8, 12, '#aaaaaa');
      rect(ctx, cx + 62, cy + 10, 8, 12, '#aaaaaa');
      rect(ctx, cx - 50, cy - 7, 12, 14, '#555555');
      frame(ctx, cx - 50, cy - 7, 12, 14, '#aaaaaa');
      disc(ctx, cx - 44, cy - 2, 2, '#000000');
      rect(ctx, cx - 45, cy, 3, 5, '#000000');
      // Slowly rotating 4-spoke combination wheel
      const wa = t * 0.25;
      for (let k = 0; k < 4; k++) {
        const a = wa + (k * TAU) / 4;
        line(ctx, cx, cy, cx + Math.cos(a) * 28, cy + Math.sin(a) * 28, '#ffffff');
      }
      disc(ctx, cx, cy, 6, '#ffffff');
      break;
    }

    // -----------------------------------------------------------------------------------------
    // Zone E — Expanded Hidden Rings & MINIX-Inside-ME
    case 'vmm': {
      // Full-bleed Giant Marionette Crossbar suspending recognizable miniature computer silhouettes (CRT + tower + floppy slot)!
      rect(ctx, 0, top + 8, W, 5, '#555555');
      rect(ctx, 0, top + 8, W, 1, '#aaaaaa');
      // Giant central marionette control-cross
      const sway = R(Math.sin(t * 0.8) * 5);
      rect(ctx, cx - 54 + sway, top + 16, 108, 4, '#aaaaaa');
      rect(ctx, cx - 2 + sway, top + 8, 4, 16, '#ffffff');
      const drawMiniPC = (ox: number, oy: number, w: number, h: number, hi: string, mid: string) => {
        // Angled marionette control strings from top crossbar
        line(ctx, cx - 44 + sway, top + 20, ox + 5, oy, '#555555');
        line(ctx, cx + 44 + sway, top + 20, ox + w - 5, oy, '#555555');
        // CRT Monitor silhouette
        const mw = R(w * 0.62);
        const mh = R(h * 0.66);
        rect(ctx, ox, oy, mw, mh, '#000000');
        frame(ctx, ox, oy, mw, mh, hi);
        frame(ctx, ox + 3, oy + 3, mw - 6, mh - 8, mid);
        rect(ctx, ox + 6, oy + 6, Math.max(4, mw - 14), 2, hi);
        rect(ctx, ox + 6, oy + 10, Math.max(4, mw - 18), 2, mid);
        // Monitor neck & keyboard deck
        rect(ctx, ox + R(mw * 0.35), oy + mh, R(mw * 0.3), 4, mid);
        rect(ctx, ox + 2, oy + mh + 4, mw - 4, 5, hi);
        rect(ctx, ox + 4, oy + mh + 6, mw - 8, 1, '#000000');
        // Adjacent mini-tower chassis with floppy slot & power LED
        const tx = ox + mw + 4;
        const tw = Math.max(12, w - mw - 4);
        rect(ctx, tx, oy + 2, tw, h - 2, '#000000');
        frame(ctx, tx, oy + 2, tw, h - 2, hi);
        rect(ctx, tx + 3, oy + 6, tw - 6, 2, hi); // floppy bay
        rect(ctx, tx + 3, oy + 11, tw - 6, 2, mid); // CD bay
        rect(ctx, tx + 3, oy + h - 8, 3, 3, Math.floor(t * 3 + ox) % 2 ? '#ffffff' : mid);
      };
      drawMiniPC(cx - 46 + sway, cy - 22, 92, 52, '#ffffff', '#aaaaaa');
      drawMiniPC(16 - sway, cy - 12, 56, 36, '#aaaaaa', '#555555');
      drawMiniPC(W - 72 - sway, cy - 12, 56, 36, '#aaaaaa', '#555555');
      break;
    }

    case 'ring-1': {
      // Full-bleed Infinite Hall of Mirrors + two large mirrored guest-OS silhouettes + bold hypervisor visor/lens at vanishing point!
      const shades = ['#aaaaaa', '#555555', '#aaaaaa', '#555555', '#aaaaaa', '#555555', '#ffffff'];
      const pulseIdx = Math.floor(t * 2.5) % 7;
      for (let k = 0; k < 7; k++) {
        const frac = 1 - k * 0.13;
        const fw = Math.max(24, R((W - 16) * frac));
        const fh = Math.max(20, R((H - 20) * frac));
        frame(ctx, cx - R(fw / 2), cy - R(fh / 2), fw, fh, k === pulseIdx ? '#ffffff' : shades[k]!);
      }
      line(ctx, 8, top + 10, cx - 14, cy - 10, '#555555');
      line(ctx, W - 8, top + 10, cx + 14, cy - 10, '#555555');
      line(ctx, 8, bot - 10, cx - 14, cy + 10, '#555555');
      line(ctx, W - 8, bot - 10, cx + 14, cy + 10, '#555555');
      // Two large mirrored Guest-OS window/city silhouettes facing each other across the central mirror axis
      const gw = Math.min(64, R(W * 0.19));
      const gh = Math.min(82, R(H * 0.44));
      for (const side of [-1, 1] as const) {
        const gx = side < 0 ? cx - 24 - gw : cx + 24;
        const gy = cy - R(gh / 2);
        rect(ctx, gx, gy, gw, gh, '#000000');
        frame(ctx, gx, gy, gw, gh, '#aaaaaa');
        rect(ctx, gx + 1, gy + 1, gw - 2, 7, '#555555');
        // Mirrored titlebar buttons & miniature guest skyline inside each pane
        for (let b0 = 0; b0 < 3; b0++) {
          const bx = side < 0 ? gx + 4 + b0 * 5 : gx + gw - 7 - b0 * 5;
          rect(ctx, bx, gy + 3, 3, 3, '#ffffff');
        }
        const cols = Math.max(4, Math.floor((gw - 8) / 8));
        for (let c0 = 0; c0 < cols; c0++) {
          const mc = side < 0 ? c0 : cols - 1 - c0;
          const bh = 14 + Math.floor(hash(mc * 17 + 9) * (gh - 28));
          const bx = gx + 4 + c0 * 8;
          rect(ctx, bx, gy + gh - 3 - bh, 6, bh, '#555555');
          rect(ctx, bx, gy + gh - 3 - bh, 6, 1, '#aaaaaa');
          if (hash(mc * 23) > 0.4) rect(ctx, bx + 2, gy + gh - bh + 2, 2, 2, '#ffffff');
        }
      }
      // Bold Hypervisor Visor / Eye Lens at the vanishing point
      disc(ctx, cx, cy, 14, '#000000');
      ring(ctx, cx, cy, 14, '#ffffff');
      ring(ctx, cx, cy, 11, '#aaaaaa');
      const irisX = cx + R(Math.sin(t * 0.9) * 3);
      disc(ctx, irisX, cy, 5, '#aaaaaa');
      disc(ctx, irisX, cy, 2, '#ffffff');
      // Center vertical mirror-axis seam
      for (let y = top + 10; y < bot - 10; y += 6) {
        if (Math.abs(y - cy) > 16) rect(ctx, cx, y, 1, 3, '#aaaaaa');
      }
      break;
    }

    case 'ept': {
      // Full-bleed Isometric Checkerboard Page-Table Slabs (Guest Physical above, Host Physical below) + padlocked IOMMU quarantine rings!
      const drawIsoSlab = (sy: number, hi: string, mid: string) => {
        const rows = 5;
        const cols = 8;
        const slabW = Math.min(W - 44, 240);
        const cellW = Math.max(12, Math.floor(slabW / cols));
        const xStart = cx - R((cols * cellW) / 2);
        for (let r = 0; r < rows; r++) {
          const skew = (r - 2) * 5;
          const ry = sy + r * 6;
          for (let col = 0; col < cols; col++) {
            const x = xStart + col * cellW + skew;
            const light = (r + col) % 2 === 0;
            rect(ctx, x, ry, cellW - 1, 5, light ? mid : '#000000');
            frame(ctx, x, ry, cellW, 6, hi);
          }
        }
      };
      const topP = top + 16;
      const botP = bot - 48;
      drawIsoSlab(topP, '#aaaaaa', '#555555');
      drawIsoSlab(botP, '#ffffff', '#555555');
      // 3 bold address-translation beams passing through padlocked IOMMU quarantine rings
      for (let k = 0; k < 3; k++) {
        const lx = R(W * (0.22 + k * 0.28) + Math.sin(t * (0.45 + k * 0.14) + k) * 20);
        rect(ctx, lx - 1, topP + 26, 3, Math.max(12, botP - (topP + 26)), k === 1 ? '#ffffff' : '#aaaaaa');
        // Quarantine ring + mini padlock clamp mid-beam
        ring(ctx, lx, cy, 11, '#ffffff');
        ring(ctx, lx, cy, 9, '#aaaaaa');
        rect(ctx, lx - 5, cy - 2, 11, 8, '#000000');
        frame(ctx, lx - 5, cy - 2, 11, 8, '#ffffff');
        rect(ctx, lx - 3, cy - 6, 7, 4, '#aaaaaa');
        rect(ctx, lx - 1, cy - 4, 3, 2, '#000000');
        rect(ctx, lx, cy + 1, 1, 3, '#ffffff');
      }
      break;
    }

    case 'ring-2': {
      // Full-bleed Shattered Colossal Pendulum Clockface with bold 2–3px frozen hands & pendulum rod + fracture webs!
      line(ctx, 0, top + 24, cx, cy - 6, '#404040');
      line(ctx, W, top + 40, cx, cy - 6, '#404040');
      line(ctx, 0, bot - 28, cx, cy - 6, '#404040');
      line(ctx, W, bot - 20, cx, cy - 6, '#404040');
      // Colossal frozen clockface (136px diameter)
      ring(ctx, cx, cy - 6, 68, '#808080');
      ring(ctx, cx, cy - 6, 67, '#c0c0c0');
      ring(ctx, cx, cy - 6, 62, '#404040');
      ring(ctx, cx, cy - 6, 44, '#404040');
      for (let k = 0; k < 12; k++) {
        const a = (k * TAU) / 12;
        const sz = k % 3 === 0 ? 5 : 3;
        rect(ctx, cx + Math.cos(a) * 56 - R(sz / 2), cy - 6 + Math.sin(a) * 56 - R(sz / 2), sz, sz, k % 3 === 0 ? '#ffffff' : '#808080');
      }
      // Thickened 2–3px frozen clock hands & bold angled frozen pendulum rod
      for (const d of [-1, 0, 1]) {
        line(ctx, cx + d, cy - 6, cx + 32 + d, cy - 30, d === 0 ? '#ffffff' : '#c0c0c0');
        line(ctx, cx + d, cy - 6, cx - 20 + d, cy - 50, '#ffffff');
        line(ctx, cx + d, cy - 6, cx + 40 + d, cy + 68, d === 0 ? '#c0c0c0' : '#808080');
      }
      disc(ctx, cx, cy - 6, 5, '#ffffff');
      disc(ctx, cx + 40, cy + 68, 10, '#c0c0c0');
      ring(ctx, cx + 40, cy + 68, 10, '#ffffff');
      for (let k = 0; k < 12; k++) {
        const sx = R(hash(k * 37 + 1) * (W - 20) + 10);
        const sy = R(top + 16 + hash(k * 53 + 2) * (H - 32));
        rect(ctx, sx, sy, 3, 2, k % 2 ? '#808080' : '#c0c0c0');
      }
      break;
    }

    case 'smram': {
      // Full-bleed Colossal Armored Padlock Vault: giant U-shackle, riveted lock body with huge keyhole, deadbolt bars, & heavy pixel chains!
      for (let x = 10; x < W - 10; x += 48) {
        if (Math.abs(x - cx) < 62) continue;
        rect(ctx, x, top, 14, H, '#404040');
        rect(ctx, x, top, 2, H, '#808080');
        rect(ctx, x + 12, top, 2, H, '#000000');
      }
      rect(ctx, 0, top + 6, W, 4, '#404040');
      rect(ctx, 0, bot - 10, W, 4, '#404040');

      // Heavy pixel chains bolting the colossal padlock to the flanking pillars
      for (const chainY of [cy - 6, cy + 22]) {
        for (let x = 8; x < cx - 44; x += 10) {
          frame(ctx, x, chainY - 3, 12, 7, '#808080');
          rect(ctx, x + 2, chainY - 1, 8, 3, '#000000');
          rect(ctx, x + 6, chainY, 4, 1, '#c0c0c0');
        }
        for (let x = cx + 44; x < W - 16; x += 10) {
          frame(ctx, x, chainY - 3, 12, 7, '#808080');
          rect(ctx, x + 2, chainY - 1, 8, 3, '#000000');
          rect(ctx, x + 2, chainY, 4, 1, '#c0c0c0');
        }
      }

      // Colossal U-shaped armored padlock shackle arching across the upper band
      const shY = cy - 22;
      const outerR = 36;
      const innerR = 22;
      for (let dy = -outerR; dy <= 10; dy++) {
        const y = shY + dy;
        const ox = dy <= 0 ? Math.floor(Math.sqrt(outerR * outerR - dy * dy)) : outerR;
        const ix = dy <= 0 ? Math.floor(Math.sqrt(Math.max(0, innerR * innerR - dy * dy))) : innerR;
        rect(ctx, cx - ox, y, ox - ix, 1, '#c0c0c0');
        rect(ctx, cx + ix, y, ox - ix, 1, '#c0c0c0');
        // Shackle rim highlight & inner bevel
        rect(ctx, cx - ox, y, 2, 1, '#ffffff');
        rect(ctx, cx + ox - 2, y, 2, 1, '#808080');
        rect(ctx, cx - ix - 2, y, 2, 1, '#404040');
        rect(ctx, cx + ix, y, 2, 1, '#404040');
      }

      // Massive riveted armored padlock body
      const bx = cx - 46;
      const by = cy - 16;
      const bw = 92;
      const bh = 74;
      rect(ctx, bx, by, bw, bh, '#404040');
      frame(ctx, bx, by, bw, bh, '#ffffff');
      frame(ctx, bx + 2, by + 2, bw - 4, bh - 4, '#c0c0c0');
      frame(ctx, bx + 6, by + 6, bw - 12, bh - 12, '#808080');
      // Corner & mid-edge armor rivets
      for (const [rx, ry] of [
        [bx + 4, by + 4],
        [bx + bw - 7, by + 4],
        [bx + 4, by + bh - 7],
        [bx + bw - 7, by + bh - 7],
        [bx + 4, cy + 18],
        [bx + bw - 7, cy + 18],
      ] as const) {
        rect(ctx, rx, ry, 3, 3, '#ffffff');
      }
      // Horizontal deadbolt bars locked across the body
      rect(ctx, bx - 6, by + 12, 8, 8, '#c0c0c0');
      rect(ctx, bx + bw - 2, by + 12, 8, 8, '#c0c0c0');
      rect(ctx, bx - 6, by + bh - 20, 8, 8, '#c0c0c0');
      rect(ctx, bx + bw - 2, by + bh - 20, 8, 8, '#c0c0c0');
      // Oversized stark keyhole in the center of the lock body
      disc(ctx, cx, by + 28, 11, '#000000');
      ring(ctx, cx, by + 28, 12, '#ffffff');
      for (let ky = 0; ky < 22; ky++) {
        const hw = 5 + Math.floor(ky * 0.25);
        rect(ctx, cx - hw, by + 35 + ky, hw * 2 + 1, 1, '#000000');
        px(ctx, cx - hw - 1, by + 35 + ky, '#c0c0c0');
        px(ctx, cx + hw + 1, by + 35 + ky, '#c0c0c0');
      }
      rect(ctx, cx - 11, by + 57, 23, 2, '#c0c0c0');
      break;
    }

    case 'ring-3': {
      // Full-bleed 1-Bit Microscope Silicon-Die Floorplan behind the always-on core: angled bond-wire fanouts, macro SRAM/ROM arrays, & bold 1-bit bus trunks!
      const coreY = R(b.top + 132);
      // Giant perimeter leadframe fingers along left & right die edges + angled bond wires fanning toward the die interior
      const leadCount = 7;
      for (let k = 0; k < leadCount; k++) {
        const ly = top + 28 + k * Math.floor((H - 52) / leadCount);
        const padY = coreY - 60 + k * 20;
        // Left leadframe finger + angled bond wire
        rect(ctx, 0, ly - 2, 16, 5, '#ffffff');
        rect(ctx, 2, ly - 1, 10, 3, '#000000');
        line(ctx, 16, ly, 42, padY, '#ffffff');
        rect(ctx, 40, padY - 2, 5, 5, '#ffffff');
        rect(ctx, 41, padY - 1, 3, 3, '#000000');
        // Right leadframe finger + angled bond wire
        rect(ctx, W - 16, ly - 2, 16, 5, '#ffffff');
        rect(ctx, W - 12, ly - 1, 10, 3, '#000000');
        line(ctx, W - 16, ly, W - 42, padY, '#ffffff');
        rect(ctx, W - 45, padY - 2, 5, 5, '#ffffff');
        rect(ctx, W - 44, padY - 1, 3, 3, '#000000');
      }
      // Massive flanking Macro SRAM & Mask-ROM array blocks left & right of the always-on core
      const mW = Math.min(68, Math.max(36, R(W * 0.17)));
      const mH = 74;
      for (const mx of [50, W - 50 - mW]) {
        const my = coreY - R(mH / 2);
        frame(ctx, mx, my, mW, mH, '#ffffff');
        frame(ctx, mx + 2, my + 2, mW - 4, mH - 4, '#ffffff');
        // Crisp 1-bit memory subarray banks inside each macro block
        for (let row = 0; row < 4; row++) {
          const ry = my + 8 + row * 16;
          rect(ctx, mx + 6, ry, mW - 12, 10, '#ffffff');
          rect(ctx, mx + 8, ry + 2, mW - 16, 6, '#000000');
          for (let sx = mx + 12; sx < mx + mW - 12; sx += 8) {
            rect(ctx, sx, ry + 2, 2, 6, '#ffffff');
          }
        }
      }
      // Bold 1-bit vertical die-bus trunks framing the central core corridor
      for (const bx of [cx - 46, cx + 44]) {
        rect(ctx, bx, top + 22, 2, H - 36, '#ffffff');
        for (let y = top + 34; y < bot - 20; y += 22) {
          rect(ctx, bx - 2, y, 6, 2, '#ffffff');
        }
      }
      break;
    }

    case 'me-minix-user': {
      // Full-bleed Miniature City-in-a-Chip + tiny amber antenna spire & miniature monorail inside the chip cavity!
      const cw = Math.min(220, W - 44);
      const ch = Math.min(120, H - 36);
      const rx = cx - R(cw / 2);
      const ry = cy - R(ch / 2);
      for (let y = ry + 10; y < ry + ch - 8; y += 10) {
        rect(ctx, 0, y, rx, 2, '#555555');
        rect(ctx, rx + cw, y, W - (rx + cw), 2, '#555555');
      }
      for (let x = rx + 8; x < rx + cw - 6; x += 8) {
        rect(ctx, x, ry - 10, 3, 10, '#555555');
        rect(ctx, x, ry + ch, 3, 10, '#555555');
      }
      rect(ctx, rx, ry, cw, ch, '#000000');
      frame(ctx, rx, ry, cw, ch, '#aaaaaa');
      frame(ctx, rx + 4, ry + 4, cw - 8, ch - 8, '#555555');
      const base = ry + ch - 8;
      for (let x = rx + 10; x < rx + cw - 14; x += 9) {
        const th = 16 + Math.floor(hash(x * 19 + 5) * (ch - 36));
        rect(ctx, x, base - th, 7, th, '#555555');
        rect(ctx, x, base - th, 7, 1, '#aaaaaa');
        if (hash(x * 7) > 0.35) rect(ctx, x + 2, base - th + 4, 2, 2, '#ffffff');
        if (hash(x * 13) > 0.5) rect(ctx, x + 2, base - th + 10, 2, 2, '#aaaaaa');
      }
      // Central miniature PID-1 amber antenna spire inside the chip cavity
      rect(ctx, cx - 6, base - (ch - 26), 12, ch - 26, '#555555');
      rect(ctx, cx - 6, base - (ch - 26), 12, 2, '#aaaaaa');
      rect(ctx, cx - 1, ry + 10, 2, 16, '#aaaaaa');
      if (Math.floor(t * 2) % 2 === 0) rect(ctx, cx - 2, ry + 8, 4, 3, '#ffffff');
      // Miniature elevated monorail zipping across the chip's tiny skyline
      const mRailY = base - 14;
      rect(ctx, rx + 8, mRailY, cw - 16, 1, '#aaaaaa');
      const mTrainX = rx + 10 + Math.floor(mod(t * 26, Math.max(20, cw - 34)));
      rect(ctx, mTrainX, mRailY - 3, 12, 3, '#ffffff');
      break;
    }

    case 'me-minix-kern': {
      // Full-bleed Radial IPC Star-Hub: chunky pneumatic ring-switch hub + 12 satellite servers with distinct tiny server icons (disk, clock, net, tty)!
      disc(ctx, cx, cy, 32, '#000000');
      ring(ctx, cx, cy, 32, '#aaaaaa');
      ring(ctx, cx, cy, 30, '#555555');
      ring(ctx, cx, cy, 24, '#ffffff');
      ring(ctx, cx, cy, 22, '#aaaaaa');
      disc(ctx, cx, cy, 10, '#555555');
      ring(ctx, cx, cy, 10, '#ffffff');
      disc(ctx, cx, cy, 4, '#ffffff');
      const rx = Math.min(W * 0.44, 145);
      const ry = Math.min(H * 0.42, 74);
      for (let k = 0; k < 12; k++) {
        const a = (k * TAU) / 12;
        const ex = R(cx + Math.cos(a) * rx);
        const ey = R(cy + Math.sin(a) * ry);
        line(ctx, cx + Math.cos(a) * 32, cy + Math.sin(a) * 32, ex, ey, '#555555');
        rect(ctx, ex - 7, ey - 7, 14, 14, '#000000');
        frame(ctx, ex - 7, ey - 7, 14, 14, '#aaaaaa');
        // Distinct tiny server glyph per satellite: disk (0), clock (1), net (2), tty (3)
        const kind = k % 4;
        if (kind === 0) {
          // Disk platter
          disc(ctx, ex, ey, 4, '#555555');
          ring(ctx, ex, ey, 4, '#ffffff');
          px(ctx, ex, ey, '#ffffff');
        } else if (kind === 1) {
          // Clock face + hands
          ring(ctx, ex, ey, 4, '#aaaaaa');
          rect(ctx, ex, ey - 3, 1, 3, '#ffffff');
          rect(ctx, ex, ey, 3, 1, '#ffffff');
        } else if (kind === 2) {
          // Net packet diamonds
          rect(ctx, ex - 4, ey, 9, 1, '#aaaaaa');
          rect(ctx, ex - 2, ey - 2, 5, 5, '#ffffff');
          rect(ctx, ex - 1, ey - 1, 3, 3, '#000000');
        } else {
          // TTY prompt `>_`
          line(ctx, ex - 4, ey - 2, ex - 1, ey, '#ffffff');
          line(ctx, ex - 4, ey + 2, ex - 1, ey, '#ffffff');
          rect(ctx, ex + 1, ey + 2, 3, 1, '#aaaaaa');
        }
        const q = mod(t * (0.45 + (k % 3) * 0.12) + k * 0.09, 1);
        rect(ctx, cx + Math.cos(a) * (32 + q * (rx - 36)) - 1, cy + Math.sin(a) * (32 + q * (ry - 36)) - 1, 3, 3, '#ffffff');
      }
      break;
    }

    // -----------------------------------------------------------------------------------------
    // Zone F — Deep Silicon, Lithography & Physics Abyss
    case 'uarch': {
      // Full-bleed Giant Iconic ALU Chevron (V-notched trapezoid) centerpiece + bold parallel pipeline lanes + flickering mispredict branch!
      const aluX = cx - 24;
      // Bold parallel operand pipeline lanes feeding into the ALU's upper and lower jaws
      for (const dy of [-22, -16, 16, 22]) {
        rect(ctx, 8, cy + dy, Math.max(12, aluX - 8), 2, Math.abs(dy) === 22 ? '#aaaaaa' : '#555555');
      }
      // Giant iconic V-notched ALU trapezoid silhouette
      const aluW = 54;
      const aluH = 44;
      for (let i = 0; i < aluW; i++) {
        const yTop = cy - aluH + Math.floor((i * 18) / aluW);
        const yBot = cy + aluH - Math.floor((i * 18) / aluW);
        rect(ctx, aluX + i, yTop, 1, yBot - yTop, '#000000');
      }
      // Cut the iconic V-notch on the left edge of the ALU
      for (let d = 0; d < 14; d++) {
        rect(ctx, aluX, cy - 14 + d, d, 1, '#000000');
        rect(ctx, aluX, cy + 14 - d, d, 1, '#000000');
      }
      // Bold 2px ALU outline
      for (let t0 = 0; t0 < 2; t0++) {
        line(ctx, aluX, cy - aluH + t0, aluX + aluW, cy - 26 + t0, '#ffffff');
        line(ctx, aluX, cy + aluH - t0, aluX + aluW, cy + 26 - t0, '#ffffff');
        rect(ctx, aluX + aluW - t0, cy - 26, 1, 52, '#ffffff');
        rect(ctx, aluX + t0, cy - aluH, 1, 30, '#ffffff');
        rect(ctx, aluX + t0, cy + 14, 1, 30, '#ffffff');
        line(ctx, aluX, cy - 14 + t0, aluX + 14, cy + t0, '#aaaaaa');
        line(ctx, aluX, cy + 14 - t0, aluX + 14, cy - t0, '#aaaaaa');
      }
      // Taken branch (upper right, bright solid with moving μop pulses)
      const outX = aluX + aluW;
      for (let d = 0; d < 2; d++) line(ctx, outX, cy - 10 + d, W - 18, cy - 48 + d, '#ffffff');
      const uq = mod(t * 0.7, 1);
      rect(ctx, outX + (W - 18 - outX) * uq - 2, cy - 10 - 38 * uq - 2, 5, 5, '#ffffff');
      frame(ctx, W - 44, cy - 58, 30, 20, '#ffffff');
      rect(ctx, W - 38, cy - 50, 18, 3, '#aaaaaa');
      // Larger, clearer flickering mispredict ghost branch (lower right)
      const alive = mod(t * 0.42, 1) < 0.72;
      if (alive) {
        for (let s = 0; s < 14; s++) {
          if (s % 2 === 0) {
            const q = s / 14;
            rect(ctx, outX + (W - 44 - outX) * q, cy + 10 + 34 * q, 5, 2, '#aaaaaa');
          }
        }
        frame(ctx, W - 44, cy + 36, 30, 20, '#aaaaaa');
        line(ctx, W - 40, cy + 40, W - 18, cy + 52, '#555555');
        line(ctx, W - 18, cy + 40, W - 40, cy + 52, '#555555');
      }
      break;
    }

    case 'rtl': {
      // Full-bleed Thickened Fractal Clock H-Tree + 4 large unmistakable logic gate silhouettes (AND, OR, XOR, NOT) at the major branch junctions!
      const phase = Math.floor(t * 4) % 3;
      const c0 = phase === 0 ? '#ffffff' : '#aaaaaa';
      const c1 = phase === 1 ? '#ffffff' : '#555555';
      const c2 = phase === 2 ? '#ffffff' : '#555555';
      const sw = W - 52;
      const sh = Math.max(82, H - 56);
      // Thickened Level 0 & 1 central H trunks
      rect(ctx, cx - R(sw / 2), cy - 1, sw, 3, c0);
      rect(ctx, cx - R(sw / 2) - 1, cy - R(sh / 2), 3, sh, c1);
      rect(ctx, cx + R(sw / 2) - 2, cy - R(sh / 2), 3, sh, c1);
      const drawGate = (gx: number, gy: number, kind: 'and' | 'or' | 'xor' | 'not', col: string) => {
        rect(ctx, gx - 12, gy - 10, 24, 20, '#000000');
        if (kind === 'and') {
          rect(ctx, gx - 10, gy - 9, 2, 18, col);
          rect(ctx, gx - 10, gy - 9, 10, 2, col);
          rect(ctx, gx - 10, gy + 7, 10, 2, col);
          for (let dy = -8; dy <= 8; dy++) {
            const dx = Math.floor(Math.sqrt(Math.max(0, 64 - dy * dy)));
            rect(ctx, gx + dx - 1, gy + dy, 2, 1, col);
          }
        } else if (kind === 'or' || kind === 'xor') {
          for (let dy = -8; dy <= 8; dy++) {
            const curve = Math.floor((dy * dy) / 16);
            rect(ctx, gx - 10 + curve, gy + dy, 2, 1, col);
            if (kind === 'xor') rect(ctx, gx - 14 + curve, gy + dy, 2, 1, '#ffffff');
          }
          line(ctx, gx - 6, gy - 8, gx + 10, gy, col);
          line(ctx, gx - 6, gy - 7, gx + 10, gy, col);
          line(ctx, gx - 6, gy + 8, gx + 10, gy, col);
          line(ctx, gx - 6, gy + 7, gx + 10, gy, col);
        } else {
          // NOT triangle + inversion bubble
          rect(ctx, gx - 10, gy - 9, 2, 18, col);
          line(ctx, gx - 8, gy - 8, gx + 6, gy, col);
          line(ctx, gx - 8, gy - 7, gx + 6, gy, col);
          line(ctx, gx - 8, gy + 8, gx + 6, gy, col);
          line(ctx, gx - 8, gy + 7, gx + 6, gy, col);
          ring(ctx, gx + 10, gy, 3, '#ffffff');
        }
      };
      const corners: [number, number, 'and' | 'or' | 'xor' | 'not'][] = [
        [cx - R(sw / 2), cy - R(sh / 2), 'and'],
        [cx + R(sw / 2), cy - R(sh / 2), 'or'],
        [cx - R(sw / 2), cy + R(sh / 2), 'xor'],
        [cx + R(sw / 2), cy + R(sh / 2), 'not'],
      ];
      for (const [lx, ly, kind] of corners) {
        rect(ctx, lx - 22, ly - 1, 44, 2, c1);
        rect(ctx, lx - 22, ly - 14, 2, 28, c2);
        rect(ctx, lx + 21, ly - 14, 2, 28, c2);
        drawGate(lx, ly, kind, c0);
      }
      rect(ctx, cx - 5, cy - 5, 10, 10, '#ffffff');
      rect(ctx, cx - 2, cy - 2, 4, 4, '#000000');
      break;
    }

    case 'cmos': {
      // Full-bleed 4-Color Semiconductor Lithography Wafer Mask Cross-Section covering the entire band!
      for (let y = top + 16; y < bot - 20; y += 44) {
        rect(ctx, 10, y, W - 20, 20, '#24989c');
      }
      for (let x = 24; x < W - 20; x += 32) {
        rect(ctx, x, top + 4, 8, H - 8, '#9448d4');
        for (let y = top + 24; y < bot - 20; y += 44) {
          rect(ctx, x + 2, y, 4, 4, '#ffffff');
        }
      }
      for (const my of [cy - 18, cy + 16]) {
        rect(ctx, 0, my, W, 10, '#e88438');
        const cxP = mod(t * 44 + my, W);
        rect(ctx, cxP, my + 3, 12, 4, '#ffffff');
      }
      break;
    }

    case 'litho': {
      // Full-bleed 13.5nm EUV Fresnel Diffraction Target + giant curved EUV condenser mirror arcs focusing beams onto the central reticle!
      for (let y = top + 12; y < bot - 12; y += 20) {
        for (let x = 12 + ((y / 20) % 2) * 10; x < W - 12; x += 20) {
          rect(ctx, x, y, 2, 2, '#555555');
        }
      }
      // Giant curved EUV condenser mirror arcs framing left & right edges + focused beam rays
      const arcR = Math.min(82, R(H * 0.42));
      for (let dy = -arcR; dy <= arcR; dy += 2) {
        const bend = Math.floor((dy * dy) / (arcR * 2.2));
        rect(ctx, 10 + bend, cy + dy, 5, 2, '#aaaaaa');
        rect(ctx, 15 + bend, cy + dy, 2, 2, '#ffffff');
        rect(ctx, W - 15 - bend, cy + dy, 5, 2, '#aaaaaa');
        rect(ctx, W - 17 - bend, cy + dy, 2, 2, '#ffffff');
      }
      for (const dy of [-arcR + 12, 0, arcR - 12]) {
        line(ctx, 20, cy + dy, cx, cy, '#555555');
        line(ctx, W - 20, cy + dy, cx, cy, '#555555');
      }
      // Expanding animated EUV wavefront + static Fresnel interference rings
      for (const rad of [92, 70, 50, 34, 18]) {
        ring(ctx, cx, cy, rad, rad <= 34 ? '#aaaaaa' : '#555555');
      }
      const waveR = 12 + Math.floor(mod(t * 28, 88));
      ring(ctx, cx, cy, waveR, '#ffffff');
      disc(ctx, cx, cy, 4, '#ffffff');
      rect(ctx, cx, top + 4, 1, H - 8, '#555555');
      rect(ctx, 8, cy, W - 16, 1, '#555555');
      break;
    }

    case 'bandgap': {
      // Full-bleed Twin Energy-Band Horizon + tall bold quantum potential barrier + evanescent exponential decay wave tunneling into bright electron orbs!
      rect(ctx, 0, top + 8, W, 24, '#555555');
      rect(ctx, 0, top + 32, W, 2, '#aaaaaa');
      rect(ctx, 0, bot - 32, W, 24, '#555555');
      rect(ctx, 0, bot - 34, W, 2, '#aaaaaa');
      // Tall, bold central quantum potential barrier wall spanning the forbidden gap
      const bw = 22;
      const bTop = top + 28;
      const bH = Math.max(30, bot - 56 - top);
      rect(ctx, cx - R(bw / 2), bTop, bw, bH, '#555555');
      frame(ctx, cx - R(bw / 2), bTop, bw, bH, '#ffffff');
      for (let hy = bTop + 6; hy < bTop + bH - 4; hy += 8) {
        rect(ctx, cx - R(bw / 2) + 3, hy, bw - 6, 1, '#aaaaaa');
      }
      // Incident wave (left, large amplitude) -> evanescent exponential decay inside barrier -> transmitted wave (right, smaller amplitude)
      for (let x = 4; x < W - 4; x += 2) {
        let amp = 18;
        if (x >= cx - R(bw / 2) && x <= cx + R(bw / 2)) {
          const frac = (x - (cx - R(bw / 2))) / bw;
          amp = 18 * Math.exp(-frac * 1.9);
        } else if (x > cx + R(bw / 2)) {
          amp = 5;
        }
        const wy = cy + R(Math.sin(x * 0.1 - t * 2.8) * amp);
        rect(ctx, x, wy, 2, 2, x > cx + R(bw / 2) ? '#ffffff' : '#aaaaaa');
      }
      // Bright tunneled electron orbs emerging on the far right side of the barrier
      for (let k = 0; k < 2; k++) {
        const q = mod(t * (0.34 + k * 0.12) + k * 0.5, 1);
        const ex = cx + R(bw / 2) + 8 + R(q * (W - (cx + R(bw / 2) + 20)));
        const ey = cy + (k === 0 ? -12 : 12);
        disc(ctx, ex, ey, 3, '#ffffff');
        ring(ctx, ex, ey, 5, '#aaaaaa');
      }
      break;
    }

    case 'landauer': {
      // Full-bleed Thermodynamic Event Horizon + lone glowing bit (0/1) dissolving into expanding kT ln 2 heat-dissipation ripples!
      const base = bot - 10;
      for (const rad of [150, 118, 86, 56]) {
        ring(ctx, cx, base + 56, rad, rad <= 86 ? '#aaaaaa' : '#555555');
      }
      const er = 48 + Math.floor(mod(t * 16, 110));
      ring(ctx, cx, base + 56, er, '#555555');
      // Lone glowing bit (0 or 1) hovering above the event horizon, periodically dissolving into expanding heat ripples
      const cycle = mod(t * 0.28, 1);
      const bitY = cy - 18;
      if (cycle < 0.65) {
        const isOne = Math.floor(t * 0.28) % 2 === 1;
        if (isOne) {
          rect(ctx, cx - 2, bitY - 9, 4, 18, '#ffffff');
          rect(ctx, cx - 5, bitY - 6, 3, 2, '#ffffff');
          rect(ctx, cx - 6, bitY + 7, 12, 2, '#ffffff');
        } else {
          frame(ctx, cx - 6, bitY - 9, 12, 18, '#ffffff');
          frame(ctx, cx - 5, bitY - 8, 10, 16, '#ffffff');
        }
      } else {
        // Erasing bit -> expanding kT ln 2 thermal dissipation ripples
        const q = (cycle - 0.65) / 0.35;
        ring(ctx, cx, bitY, 6 + R(q * 36), '#ffffff');
        ring(ctx, cx, bitY, 3 + R(q * 22), '#aaaaaa');
        for (let k = 0; k < 8; k++) {
          const a = (k * TAU) / 8 + q * 0.4;
          rect(ctx, cx + Math.cos(a) * (8 + q * 32), bitY + Math.sin(a) * (8 + q * 32), 2, 2, '#ffffff');
        }
      }
      // Rare dramatic diagonal cosmic-ray track slicing across the abyss
      const slot = Math.floor(t * 0.55);
      if (t > 0 && hash(slot * 47 + 3) > 0.58) {
        const x0 = R(hash(slot * 13) * W * 0.55);
        const y0 = top + 12;
        line(ctx, x0, y0, x0 + 130, y0 + 130, '#aaaaaa');
        rect(ctx, x0 + 128, y0 + 128, 5, 5, '#ffffff');
      }
      break;
    }
    case 'slab-spa': {
      // Looking straight in through a wide cedar-and-stone window into a 1-point perspective 3D spa room:
      // stone fireplace in the center back, recessed steaming pool in the middle, lounge chairs off to the sides,
      // and a flat foreground sill/floor so props & critters still sit/bounce straight-on.
      const vy = R(top + H * 0.44);
      const fov = Math.min(W * 0.72, 260);
      const proj = (x3: number, y3: number, z3: number): [number, number] => [
        R(cx + (x3 * fov) / z3),
        R(vy + (y3 * fov) / z3),
      ];
      // Outer misty stone wall with staggered ashlar courses around the window
      rect(ctx, 0, top, W, H, '#182b2e');
      for (let sy = top; sy < bot; sy += 10) {
        rect(ctx, 0, sy, W, 1, '#101d20');
        const off = ((sy - top) / 10) % 2 === 0 ? 0 : 12;
        for (let sx = off; sx < W; sx += 24) {
          rect(ctx, sx, sy + 1, 1, 9, '#101d20');
          rect(ctx, sx + 1, sy + 1, 22, 1, '#233b3f');
        }
      }
      const winL = Math.max(18, R(W * 0.08));
      const winR = Math.min(W - 18, R(W * 0.92));
      const winT = top + 12;
      const winB = bot - 14;
      const winW = winR - winL;
      const winH = winB - winT;

      // 3D room bounds in world units at z=1 (window plane) -> z=2.75 (back wall)
      const roomHalfW = (winW * 0.5) / fov;
      const ceilY = (winT - vy) / fov;
      const floorY = (winB - vy) / fov;
      const zBack = 2.75;
      const [bx0, by0] = proj(-roomHalfW, ceilY, zBack);
      const [bx1, by1] = proj(roomHalfW, floorY, zBack);

      // Side walls (warm cedar), ceiling (deep timber), floor (slate/terracotta)
      rect(ctx, winL, winT, winW, winH, '#5c341c');
      // Perspective ceiling rafters & floor slate courses (clamped to window opening)
      for (let y = winT; y < by0; y++) {
        const z = (ceilY * fov) / Math.min(-1, y - vy);
        const xl = Math.max(winL, R(cx - roomHalfW * (fov / z)));
        const xr = Math.min(winR, R(cx + roomHalfW * (fov / z)));
        const beam = Math.floor(z * 4) % 2 === 0;
        rect(ctx, xl, y, xr - xl, 1, beam ? '#4a2612' : '#351a0c');
      }
      for (const rx of [-0.65, -0.32, 0, 0.32, 0.65]) {
        const [x0, y0] = proj(rx * roomHalfW, ceilY, 1.0);
        const [x1, y1] = proj(rx * roomHalfW, ceilY, zBack);
        line(ctx, x0, y0, x1, y1, '#683619');
      }
      for (let y = by1; y < winB; y++) {
        const z = (floorY * fov) / Math.max(1, y - vy);
        const xl = Math.max(winL, R(cx - roomHalfW * (fov / z)));
        const xr = Math.min(winR, R(cx + roomHalfW * (fov / z)));
        const band = Math.floor(z * 5) % 2 === 0;
        rect(ctx, xl, y, xr - xl, 1, band ? '#4d5b60' : '#3e4a4f');
        if (Math.abs((z * 5) % 1) < 0.08) rect(ctx, xl, y, xr - xl, 1, '#2a3336');
      }
      // Perspective floor tile seams + subtle top-left tile highlights
      for (let gx = -3; gx <= 3; gx++) {
        const [x0, y0] = proj((gx * roomHalfW) / 3, floorY, 1.0);
        const [x1, y1] = proj((gx * roomHalfW) / 3, floorY, zBack);
        line(ctx, x0, y0, x1, y1, '#2a3336');
        line(ctx, x0 + 1, y0, x1 + 1, y1, '#5b6b70');
      }
      // Side wall tongue-and-groove cedar slats & wainscoting rail
      for (const s of [-1, 1]) {
        const [wx0, wy0] = proj(s * roomHalfW, floorY * 0.35, 1.0);
        const [wx1, wy1] = proj(s * roomHalfW, floorY * 0.35, zBack);
        line(ctx, wx0, wy0, wx1, wy1, '#8f502a');
        line(ctx, wx0, wy0 + 1, wx1, wy1 + 1, '#3b2112');
        for (const z of [1.25, 1.55, 1.9, 2.3]) {
          const [sx, syTop] = proj(s * roomHalfW, ceilY, z);
          const [, syBot] = proj(s * roomHalfW, floorY, z);
          line(ctx, sx, syTop, sx, syBot, '#432412');
        }
      }

      // Back wall (warm plaster + timber framing, sauna door on left, towel alcove on right)
      rect(ctx, bx0, by0, bx1 - bx0, by1 - by0, '#7a4a2b');
      rect(ctx, bx0, by0, bx1 - bx0, 3, '#a86234');
      rect(ctx, bx0, by0 + 3, bx1 - bx0, 1, '#58321b');
      rect(ctx, bx0, by1 - 3, bx1 - bx0, 3, '#3b2112');
      // Subtle plaster texture flecks on back wall
      for (let py = by0 + 8; py < by1 - 6; py += 6) {
        for (let pxPos = bx0 + 8; pxPos < bx1 - 8; pxPos += 14) {
          if (hash(pxPos * 7 + py * 13) > 0.5) px(ctx, pxPos, py, '#6a3e22');
        }
      }
      // Cedar sauna door on the left side of the back wall
      const doorW = Math.max(12, R((bx1 - bx0) * 0.14));
      const doorH = Math.max(18, R((by1 - by0) * 0.68));
      const doorX = bx0 + Math.max(6, R((bx1 - bx0) * 0.08));
      const doorY = by1 - doorH;
      if (doorX + doorW < cx - R((bx1 - bx0) * 0.18)) {
        rect(ctx, doorX - 1, doorY - 1, doorW + 2, doorH + 1, '#3b2112');
        rect(ctx, doorX, doorY, doorW, doorH, '#9c5a30');
        rect(ctx, doorX + 1, doorY + 1, doorW - 2, 1, '#c87e4b');
        rect(ctx, doorX + 3, doorY + 3, doorW - 6, Math.max(5, R(doorH * 0.3)), '#ffd080'); // frosted sauna window
        rect(ctx, doorX + doorW - 3, doorY + R(doorH * 0.55), 2, 2, '#f0d8a0'); // brass handle
      }
      // Recessed towel & sconce niche on the right side of the back wall
      const nicheX = bx1 - Math.max(6, R((bx1 - bx0) * 0.08)) - doorW;
      if (nicheX > cx + R((bx1 - bx0) * 0.18)) {
        rect(ctx, nicheX, doorY + 4, doorW, Math.max(10, R(doorH * 0.48)), '#3b2112');
        rect(ctx, nicheX + 1, doorY + 5, doorW - 2, Math.max(8, R(doorH * 0.48) - 2), '#58321b');
        rect(ctx, nicheX + 2, doorY + 8, doorW - 4, 2, '#e8f4f2');
        rect(ctx, nicheX + 2, doorY + 12, doorW - 4, 2, '#9ad9d4');
      }

      // Center fireplace on the back wall: detailed ashlar stone, mantle, iron grate, logs & hearth apron
      const fw = Math.max(26, R((bx1 - bx0) * 0.28));
      const fh = Math.max(26, R((by1 - by0) * 0.64));
      const fx = R(cx - fw / 2);
      const fy = by1 - fh;
      const chimW = R(fw * 0.56);
      rect(ctx, cx - R(chimW / 2), by0, chimW, fy - by0 + 2, '#585e66');
      rect(ctx, cx - R(chimW / 2), by0, 2, fy - by0 + 2, '#727a82');
      rect(ctx, fx, fy, fw, fh, '#636b73'); // stone surround
      // Ashlar stone course lines & top-left stone highlights
      for (let sy = fy; sy < by1; sy += 5) {
        rect(ctx, fx, sy, fw, 1, '#444a50');
        rect(ctx, fx + 1, sy + 1, fw - 2, 1, '#828b94');
      }
      rect(ctx, fx - 2, fy + 6, fw + 4, 3, '#a86234'); // cedar mantle
      rect(ctx, fx - 2, fy + 6, fw + 4, 1, '#d8945e'); // mantle highlight
      rect(ctx, fx + 4, fy + 10, fw - 8, fh - 10, '#2b3036'); // inner stone arch
      rect(ctx, fx + 5, fy + 11, fw - 10, fh - 11, '#140c08'); // firebox
      rect(ctx, fx + 7, by1 - 6, fw - 14, 2, '#585258'); // iron grate bar
      rect(ctx, fx + 8, by1 - 4, fw - 16, 3, '#784222'); // cedar logs
      rect(ctx, fx + 7, by1 - 3, fw - 14, 2, '#e86820'); // glowing coals
      // Raised hearthstone apron & warm reflected light on the back floor
      rect(ctx, fx - 2, by1, fw + 4, 3, '#8f98a0');
      rect(ctx, fx - 2, by1, fw + 4, 1, '#cfd6dc');
      rect(ctx, fx + 1, by1 + 3, fw - 2, 4, '#6e4c36');

      // Recessed steaming spa pool in the middle of the 3D floor (z = 1.48 -> 2.32)
      for (let z = 1.48; z <= 2.32; z += 0.03) {
        const [pl, py] = proj(-roomHalfW * 0.42, floorY, z);
        const [pr] = proj(roomHalfW * 0.42, floorY, z);
        const rim = z < 1.56 || z > 2.24;
        rect(ctx, pl, py, pr - pl, 2, rim ? '#8f98a0' : '#3baea8');
        if (rim) {
          rect(ctx, pl, py, 3, 2, '#cfd6dc');
          rect(ctx, pr - 3, py, 3, 2, '#585e66');
        } else {
          rect(ctx, pl + 4, py, Math.max(2, pr - pl - 8), 1, '#5cc8c0');
          if (R(z * 20) % 3 === 0) rect(ctx, pl + 8, py, Math.max(2, R((pr - pl) * 0.3)), 1, '#a8f0ea');
        }
      }
      // Front vertical stone coping of the pool with block joints
      const [lipL, lipY] = proj(-roomHalfW * 0.42, floorY, 1.48);
      const [lipR] = proj(roomHalfW * 0.42, floorY, 1.48);
      rect(ctx, lipL, lipY, lipR - lipL, 4, '#cfd6dc');
      rect(ctx, lipL, lipY + 4, lipR - lipL, 3, '#585e66');
      for (let bx = lipL + 10; bx < lipR - 6; bx += 14) rect(ctx, bx, lipY, 1, 7, '#444a50');

      // Lounge chairs off to the left and right sides in 3D perspective (z = 1.55 -> 2.15)
      for (const side of [-1, 1]) {
        for (let step = 0; step < 5; step++) {
          const z = 1.55 + step * 0.13;
          const xIn = side * roomHalfW * 0.54;
          const xOut = side * roomHalfW * 0.86;
          const [c0, cy0] = proj(Math.min(xIn, xOut), floorY, z);
          const [c1] = proj(Math.max(xIn, xOut), floorY, z);
          const seatY = cy0 - 5;
          rect(ctx, c0 + 1, cy0 - 1, Math.max(2, c1 - c0 - 2), 2, '#222a2e'); // floor shadow
          rect(ctx, c0, seatY, c1 - c0, 3, '#c87e4b'); // cedar slat
          rect(ctx, c0, seatY, c1 - c0, 1, '#e6a670'); // top-left slat bevel
          rect(ctx, c0 + 2, seatY - 1, Math.max(2, c1 - c0 - 4), 1, '#e8f4f2'); // spa towel
          if (step === 0 || step === 4) {
            rect(ctx, c0 + 1, seatY + 3, 2, 3, '#683619');
            rect(ctx, c1 - 3, seatY + 3, 2, 3, '#683619');
          }
          if (step >= 3) {
            // Slatted backrest + rolled towel cushion
            rect(ctx, c0, seatY - 7, c1 - c0, 6, '#a86234');
            rect(ctx, c0 + 1, seatY - 6, Math.max(2, c1 - c0 - 2), 4, '#d4f5f0');
            if (step === 4) rect(ctx, c0 + 2, seatY - 8, Math.max(2, c1 - c0 - 4), 2, '#ffffff');
          }
        }
      }

      // Cedar window frame, corner brackets, mullions & flat foreground sill (for bouncing blobs & props)
      frame(ctx, winL - 2, winT - 2, winW + 4, winH + 4, '#2d1c14');
      rect(ctx, winL - 4, winT - 5, winW + 8, 5, '#8f502a');
      rect(ctx, winL - 4, winT - 5, winW + 8, 1, '#c87e4b');
      // Corner mortise brackets & wood grain ticks
      for (const [bx, by] of [[winL - 2, winT - 2], [winR - 4, winT - 2], [winL - 2, winB - 4], [winR - 4, winB - 4]] as const) {
        rect(ctx, bx, by, 6, 6, '#683619');
        rect(ctx, bx + 1, by + 1, 2, 2, '#c87e4b');
      }
      // Subtle vertical mullions near edges so center stays open
      rect(ctx, winL + R(winW * 0.22), winT, 3, winH, '#4a2612');
      rect(ctx, winL + R(winW * 0.22), winT, 1, winH, '#8f502a');
      rect(ctx, winR - R(winW * 0.22) - 3, winT, 3, winH, '#4a2612');
      rect(ctx, winR - R(winW * 0.22) - 3, winT, 1, winH, '#8f502a');
      // Subtle misty condensation glints in upper window corners
      rect(ctx, winL + 4, winT + 4, 6, 1, '#a8f0ea');
      rect(ctx, winL + 4, winT + 6, 3, 1, '#a8f0ea');
      rect(ctx, winR - 10, winT + 4, 6, 1, '#a8f0ea');
      // Flat foreground window sill / floor ledge
      rect(ctx, 0, winB, W, bot - winB + 6, '#7a4221');
      rect(ctx, 0, winB, W, 2, '#c87e4b');
      rect(ctx, 0, winB + 2, W, 1, '#4a2612');
      break;
    }
    case 'kthread-kabin': {
      // Full-bleed timber-frame cabin interior with pitched rafters, frosted forest window & stone hearth
      rect(ctx, 0, top, W, H, '#24140c');
      for (let y = top + 10; y < bot - 18; y += 12) {
        rect(ctx, 0, y, W, 10, '#683619');
        rect(ctx, 0, y, W, 2, '#8f502a');
      }
      // Timber beams
      for (const bx of [18, cx - 84, cx + 74, W - 28]) {
        rect(ctx, bx, top + 4, 10, H - 14, '#4a2410');
        rect(ctx, bx, top + 4, 2, H - 14, '#a86234');
      }
      // Frosted pine-woods window on left
      rect(ctx, cx - 64, top + 34, 42, 34, '#24140c');
      rect(ctx, cx - 60, top + 38, 34, 26, '#2a4a68');
      rect(ctx, cx - 44, top + 38, 2, 26, '#8f502a');
      rect(ctx, cx - 60, top + 50, 34, 2, '#8f502a');
      // Stone chimney & hearth on right
      rect(ctx, cx + 22, top + 12, 40, H - 22, '#585e66');
      rect(ctx, cx + 24, top + 12, 36, H - 22, '#727a82');
      rect(ctx, cx + 30, bot - 44, 24, 34, '#140c08');
      rect(ctx, cx + 34, bot - 22, 16, 10, '#e86820');
      // Plank floor
      rect(ctx, 0, bot - 16, W, 16, '#4a2410');
      rect(ctx, 0, bot - 16, W, 2, '#a86234');
      break;
    }
  }
}

/** Second pass: small ambient animated details layered over each setpiece so no region of a band reads as static or empty. */
function drawSetpieceDetail(ctx: Ctx, b: Band, id: LayerId, t: number) {
  const W = b.w;
  const cx = R(W / 2);
  const { top, bot, mid: cy, h: H } = bandSpan(b, id);
  /** Evenly spaced blinking lamps along a horizontal line. */
  const lamps = (y: number, n: number, on: string, off: string, speed = 2) => {
    for (let k = 0; k < n; k++) {
      const x = R(((k + 0.5) / n) * W);
      rect(ctx, x - 1, y, 2, 2, Math.floor(t * speed + k * 1.7) % 3 === 0 ? on : off);
    }
  };
  /** Particles drifting up through the band, wrapped. */
  const rise = (n: number, speed: number, seed: number, col: string, drift = 3) => {
    for (let k = 0; k < n; k++) {
      const x = hash(seed + k * 7) * W + Math.sin(t * 0.8 + k) * drift;
      const y = bot - mod(t * speed + hash(seed + k * 13) * H, H);
      rect(ctx, x, y, 1, 2, col);
    }
  };
  const fall = (n: number, speed: number, seed: number, col: string) => {
    for (let k = 0; k < n; k++) {
      const x = hash(seed + k * 7) * W;
      const y = top + mod(t * speed + hash(seed + k * 13) * H, H);
      rect(ctx, x, y, 2, 3, col);
    }
  };

  switch (id) {
    case 'application': {
      // A hot-air balloon drifting across the sunlit sky.
      const bx = mod(t * 6 + W * 0.3, W + 40) - 20;
      const by = top + 30 + R(Math.sin(t * 0.5) * 4);
      disc(ctx, bx, by, 8, '#e0605e');
      rect(ctx, bx - 8, by - 2, 16, 3, '#f2c14e');
      rect(ctx, bx - 3, by + 10, 6, 4, '#8a5a2a');
      line(ctx, bx - 5, by + 7, bx - 2, by + 10, '#55607a');
      line(ctx, bx + 5, by + 7, bx + 2, by + 10, '#55607a');
      break;
    }
    case 'bytecode':
      fall(8, 14, 3, '#ffcc33');
      break;
    case 'jit':
      rise(10, 20, 5, '#ffcc33');
      break;
    case 'runtime': {
      // Dead grey blocks tumbling toward the incinerator while freed bytes drift up.
      for (let k = 0; k < 4; k++) {
        const x = R(W * (0.2 + k * 0.2));
        const y = top + 30 + mod(t * 16 + k * 40, Math.max(40, H - 50));
        rect(ctx, x, y, 7, 5, '#555588');
        rect(ctx, x, y, 7, 1, '#9999cc');
      }
      rise(6, 9, 21, '#9999cc', 2);
      break;
    }
    case 'libraries': {
      // A rolling library ladder sliding along a top rail.
      const lx = R(mod(t * 10, W - 40) + 10);
      rect(ctx, 0, top + 4, W, 2, '#aa5500');
      rect(ctx, lx, top + 6, 2, 34, '#ffaa55');
      rect(ctx, lx + 10, top + 6, 2, 34, '#ffaa55');
      for (let y = top + 12; y < top + 38; y += 7) rect(ctx, lx, y, 12, 1, '#aa5500');
      break;
    }
    case 'linker':
      lamps(top + 12, 14, '#ffff55', '#555555', 3);
      lamps(bot - 16, 14, '#55aaaa', '#555555', 2);
      break;
    case 'userspace': {
      // An advertising blimp crosses the night sky.
      const bx = mod(t * 9 + W * 0.6, W + 80) - 40;
      const by = top + 22;
      rect(ctx, bx - 16, by, 32, 9, '#555555');
      rect(ctx, bx - 14, by - 2, 28, 2, '#aaaaaa');
      for (let k = 0; k < 6; k++) if (Math.floor(t * 3 + k) % 2 === 0) rect(ctx, bx - 12 + k * 4, by + 3, 2, 3, '#ffff55');
      rect(ctx, bx + 14, by + 3, 4, 3, '#aaaaaa');
      break;
    }
    case 'kernel-entry': {
      for (const sx of [24, W - 32]) {
        const on = Math.floor(t * 2) % 2 === 0;
        rect(ctx, sx, top + 10, 8, 6, on ? '#ffff55' : '#aa5500');
        const sa = Math.sin(t * 1.2 + sx) * 14;
        line(ctx, sx + 4, top + 16, sx + 4 + sa, top + 70, on ? '#00aaaa' : '#005555');
      }
      break;
    }
    case 'kernel':
      rise(14, 26, 33, '#ffaa00', 5);
      break;
    case 'kernel-arch':
      lamps(top + 12, 10, '#ff5555', '#550000', 4);
      lamps(bot - 14, 10, '#ffff55', '#550000', 3);
      break;
    case 'drivers': {
      // Corner cooling fans spinning, plus blinking LEDs along the rails.
      for (const [fx, fy] of [[26, top + 24], [W - 26, top + 24], [26, bot - 24], [W - 26, bot - 24]] as const) {
        ring(ctx, fx, fy, 10, '#55ffff');
        for (let k = 0; k < 3; k++) {
          const a = t * 9 + (k * TAU) / 3;
          line(ctx, fx, fy, fx + Math.cos(a) * 9, fy + Math.sin(a) * 9, '#ff55ff');
        }
      }
      lamps(top + 3, 16, '#ffffff', '#55ffff', 4);
      break;
    }
    case 'bus-fabric':
      for (const sx of [0, W - 10]) {
        for (let k = 0; k < 8; k++) {
          const y = top + 14 + k * Math.floor((H - 28) / 8);
          rect(ctx, sx, y, 10, 3, Math.floor(t * 5 + k) % 4 === 0 ? '#ffffff' : '#ff55ff');
        }
      }
      break;
    case 'firmware': {
      // Dim hex-digit columns scrolling down the vault wall edges and a POST lamp strip.
      for (const sx of [14, W - 22]) {
        for (let y = top + 8; y < bot - 8; y += 8) {
          const on = hash(Math.floor(t * 2) + y * 3 + sx) > 0.5;
          rect(ctx, sx, y, 3, 5, on ? '#aaaaaa' : '#555555');
          rect(ctx, sx + 4, y + 1, 2, 3, on ? '#555555' : '#aaaaaa');
        }
      }
      lamps(top + 4, 12, '#ffffff', '#555555', 2);
      break;
    }
    case 'vmm': {
      // A flickering ghost copy of the central chassis, as if the VM were being duplicated.
      if (Math.floor(t * 3) % 4 === 0) {
        frame(ctx, cx - 53, cy - 34, 112, 74, '#555555');
      }
      rise(6, 8, 41, '#aaaaaa', 2);
      break;
    }
    case 'ring-1': {
      // A reflection glint racing around the nested mirror frames.
      const q = mod(t * 0.5, 1) * 4;
      const fw = W - 24;
      const fh = H - 28;
      const side = Math.floor(q);
      const f = q - side;
      const gx = side === 0 ? 12 + f * fw : side === 1 ? 12 + fw : side === 2 ? 12 + fw - f * fw : 12;
      const gy = side === 0 ? cy - fh / 2 : side === 1 ? cy - fh / 2 + f * fh : side === 2 ? cy + fh / 2 : cy + fh / 2 - f * fh;
      rect(ctx, gx - 2, gy - 1, 5, 3, '#ffffff');
      break;
    }
    case 'ept':
      for (let k = 0; k < 6; k++) {
        const x = 24 + k * Math.floor((W - 48) / 6);
        const v = Math.floor(t * 2 + k * 3) % 4;
        rect(ctx, x, cy - 4, 10, 2, '#555555');
        rect(ctx, x + v * 2, cy - 4, 2, 2, '#ffffff');
      }
      break;
    case 'ring-2': {
      // Static extra frozen dust (SMM never animates).
      for (let k = 0; k < 24; k++) {
        const x = hash(k * 29 + 5) * W;
        const y = top + hash(k * 31 + 9) * H;
        rect(ctx, x, y, 1, 1, k % 3 === 0 ? '#c0c0c0' : '#404040');
      }
      break;
    }
    case 'smram':
      for (let x = 17; x < W - 17; x += 44) {
        if (Math.abs(x - cx) < 42) continue;
        const s = 0.5 + 0.5 * Math.sin(t * 0.9 + x);
        rect(ctx, x + 5, cy, 3, 3, s > 0.7 ? '#ffffff' : '#808080');
      }
      break;
    case 'me-minix-user': {
      // Scrolling dot-matrix ticker across the bottom of the chip cavity.
      const off = Math.floor(t * 8) % 6;
      for (let x = 24 - off; x < W - 24; x += 6) if (hash(x + off * 0) > 0.4) rect(ctx, x, bot - 8, 3, 3, '#aaaaaa');
      break;
    }
    case 'me-minix-kern': {
      const a = t * 1.4;
      rect(ctx, cx + Math.cos(a) * 36 - 2, cy + Math.sin(a) * 36 - 2, 4, 4, '#ffffff');
      rect(ctx, cx + Math.cos(a + Math.PI) * 36 - 2, cy + Math.sin(a + Math.PI) * 36 - 2, 4, 4, '#aaaaaa');
      break;
    }
    case 'uarch': {
      for (let k = 0; k < 5; k++) {
        const x = 12 + mod(t * 30 + k * 40, Math.max(40, cx - 40));
        rect(ctx, x, cy - 1, 3, 3, '#ffffff');
      }
      for (let k = 0; k < 8; k++) rect(ctx, 14 + k * 6, bot - 18, 4, 8, k < Math.floor(mod(t * 3, 9)) ? '#aaaaaa' : '#555555');
      break;
    }
    case 'rtl': {
      // Scrolling timing-diagram waveforms in the top and bottom lanes.
      for (const [wy, ph] of [[top + 8, 0], [bot - 16, 2]] as const) {
        for (let x = 8; x < W - 8; x += 4) {
          const hi = ((x >> 2) + Math.floor(t * 6) + ph) % 3 === 0;
          rect(ctx, x, wy + (hi ? 0 : 5), 4, 1, '#aaaaaa');
        }
      }
      break;
    }
    case 'cmos': {
      for (let k = 0; k < 12; k++) {
        const x = mod(t * (12 + (k % 3) * 6) + k * 37, W);
        const y = top + 22 + (k % 3) * 44;
        rect(ctx, x, y, 2, 2, k % 2 ? '#ffffff' : '#e88438');
      }
      break;
    }
    case 'litho':
      for (let k = 0; k < 16; k++) {
        if (Math.floor(t * 2 + k * 1.3) % 3 === 0) {
          const x = hash(k * 17 + 3) * W;
          const y = top + hash(k * 23 + 7) * H;
          rect(ctx, x, y, 1, 3, '#ffffff');
          rect(ctx, x - 1, y + 1, 3, 1, '#aaaaaa');
        }
      }
      break;
    case 'bandgap': {
      for (let k = 0; k < 6; k++) {
        const x = mod(t * (14 + k * 3) + k * 61, W);
        rect(ctx, x, top + 18 + (k % 2) * 6, 2, 2, '#ffffff');
        rect(ctx, W - x, bot - 22 - (k % 2) * 6, 2, 2, '#aaaaaa');
      }
      break;
    }
    case 'landauer':
      for (let k = 0; k < 10; k++) {
        if (Math.floor(t * 0.8 + k * 2.1) % 4 === 0) {
          rect(ctx, hash(k * 41 + 1) * W, top + hash(k * 43 + 2) * H, 2, 2, '#aaaaaa');
        }
      }
      break;
    case 'slab-spa': {
      // Animated hearth fire in the center back + multi-layered curling steam puffs over the 3D pool
      const vy = R(top + H * 0.44);
      const fov = Math.min(W * 0.72, 260);
      const winT = top + 12;
      const winB = bot - 14;
      const winW = Math.min(W - 18, R(W * 0.92)) - Math.max(18, R(W * 0.08));
      const floorY = (winB - vy) / fov;
      const by1 = R(vy + (floorY * fov) / 2.75);
      const flicker = Math.floor(t * 7) % 3;
      rect(ctx, cx - 5 + flicker, by1 - 12, 8, 7, '#ffb84d');
      rect(ctx, cx - 3 + (flicker % 2), by1 - 10, 4, 4, '#fff4b8');
      if (winW > 80) {
        const poolBaseY = R(vy + (floorY * fov) / 1.85);
        for (let k = 0; k < 10; k++) {
          const life = mod(t * 0.45 + k * 0.37, 1);
          const sy = poolBaseY - 2 - R(life * 28);
          if (sy <= winT + 6) continue;
          const sway = R(Math.sin(t * 2.2 + k * 1.7 + life * 4) * 3);
          const sx = cx - 42 + ((k * 19) % 84) + sway;
          const w = life < 0.3 ? 4 : life < 0.7 ? 3 : 1;
          const col = life < 0.45 ? '#d4f5f0' : '#9ad9d4';
          rect(ctx, sx, sy, w, 1, col);
          if (life < 0.6) rect(ctx, sx + 1, sy - 1, Math.max(1, w - 1), 1, '#a8f0ea');
        }
      }
      break;
    }
    case 'kthread-kabin':
      for (let k = 0; k < 5; k++) {
        const ey = bot - 22 - Math.floor(mod(t * 9 + k * 4, 16));
        rect(ctx, cx + 36 + ((k * 5 + Math.floor(t * 3)) % 12), ey, 2, 2, k % 2 ? '#fff4b8' : '#ffb84d');
      }
      break;
    default:
      break;
  }
}

export function drawSetpiece(ctx: Ctx, b: Band, id: LayerId, t: number) {
  drawSetpieceBase(ctx, b, id, t);
  drawSetpieceDetail(ctx, b, id, t);
}
