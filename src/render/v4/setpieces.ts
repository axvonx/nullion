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
  const isTop = id === 'application' || id === 'internet';
  const isBot = id === 'ring-3' || id === 'landauer';
  const top = isTop ? Math.max(b.top, b.bottom - 260) : b.top + 14;
  const bot = isBot ? Math.min(b.bottom, b.top + 340) : b.bottom - 6;
  const h = Math.max(120, bot - top);
  return { top: R(top), bot: R(bot), mid: R(top + h * 0.5), h: R(h) };
}

export function drawSetpiece(ctx: Ctx, b: Band, id: LayerId, t: number) {
  const W = b.w;
  const cx = R(W / 2);
  const { top, bot, mid: cy, h: H } = bandSpan(b, id);

  switch (id) {
    // -----------------------------------------------------------------------------------------
    // Zone A — Above Application & Desktop
    case 'internet': {
      // Full-bleed orbital satellite ring + curved planetary horizon + 5 pulsing transatlantic fiber arcs + relay towers!
      // Orbital relay satellites drifting slowly near top of band
      for (let s = 0; s < 3; s++) {
        const sx = mod(hash(s * 19 + 3) * W + t * (5 + s * 2), W + 24) - 12;
        const sy = top + 20 + s * 18;
        rect(ctx, sx - 6, sy, 4, 2, '#7ab0e4');
        rect(ctx, sx + 4, sy, 4, 2, '#7ab0e4');
        rect(ctx, sx - 2, sy - 1, 5, 4, '#dfe6f6');
        if (Math.floor(t * 2 + s) % 2 === 0) px(ctx, sx, sy - 2, '#ffffff');
      }
      // Subtle longitude/latitude grid on the planetary limb
      const base = bot;
      for (let x = 0; x < W; x += 2) {
        const dx = (x - cx) / Math.max(130, W * 0.58);
        const lh = Math.max(0, Math.round((1 - dx * dx) * 48));
        if (lh > 0) {
          rect(ctx, x, base - lh, 2, lh + 10, '#5a8cc8');
          rect(ctx, x, base - lh, 2, 2, '#c8e4fb');
          if (x % 24 === 0) rect(ctx, x, base - lh + 4, 1, Math.max(2, lh - 4), '#7aaae0');
        }
      }
      // 4 terrestrial IXP relay towers anchored along the curved horizon
      const towers = [0.12, 0.34, 0.66, 0.88].map((f) => {
        const tx = R(W * f);
        const dx = (tx - cx) / Math.max(130, W * 0.58);
        const ty = base - Math.max(0, Math.round((1 - dx * dx) * 48));
        rect(ctx, tx - 2, ty - 14, 4, 14, '#3d6cc4');
        rect(ctx, tx - 5, ty - 10, 10, 1, '#7ab0e4');
        rect(ctx, tx - 1, ty - 17, 2, 3, Math.floor(t * 3 + tx) % 2 ? '#ffffff' : '#59c08a');
        return [tx, ty - 14] as const;
      });
      // 5 sweeping fiber-optic arcs between towers with traveling light packets
      const links: [number, number, number][] = [
        [0, 1, 40],
        [1, 2, 54],
        [2, 3, 40],
        [0, 2, 74],
        [1, 3, 82],
      ];
      links.forEach(([a, bIdx, lift], k) => {
        const [x0, y0] = towers[a]!;
        const [x1, y1] = towers[bIdx]!;
        for (let s = 0; s <= 36; s++) {
          const q = s / 36;
          const x = x0 + (x1 - x0) * q;
          const y = y0 + (y1 - y0) * q - Math.sin(q * Math.PI) * lift;
          px(ctx, x, y, k < 3 ? '#8fc4f0' : '#b4dcf8');
        }
        const pq = mod(t * (0.26 + k * 0.06) + k * 0.23, 1);
        const pxX = x0 + (x1 - x0) * pq;
        const pxY = y0 + (y1 - y0) * pq - Math.sin(pq * Math.PI) * lift;
        rect(ctx, pxX - 2, pxY - 1, 5, 2, '#ffffff');
      });
      break;
    }

    case 'browser': {
      // Full-bleed wireframe DOM Cathedral + side inspector columns + animated layout repaint & paint-flash scan!
      // Outer full-width browser chrome skeleton
      frame(ctx, 8, top + 6, W - 16, H - 12, '#7ea8dc');
      rect(ctx, 8, top + 6, W - 16, 10, '#8fb8e8');
      for (let k = 0; k < 4; k++) rect(ctx, 14 + k * 28, top + 8, 22, 6, k === 0 ? '#d8ecfc' : '#a6cbf2');
      // Nested DOM cathedral frames receding toward center
      for (let k = 0; k < 5; k++) {
        const mw = Math.max(56, W - 40 - k * 42);
        const mh = Math.max(36, H - 36 - k * 22);
        const rx = cx - R(mw / 2);
        const ry = cy + 4 - R(mh / 2);
        frame(ctx, rx, ry, mw, mh, k % 2 ? '#7ea8dc' : '#a8cef4');
        // Flex-box column markers inside each frame
        rect(ctx, rx + 3, ry + 3, Math.min(28, mw - 6), 2, '#cfe6fc');
        rect(ctx, rx + mw - 18, ry + 3, 14, 2, '#8fb8e8');
      }
      // Left & right DevTools box-model margin strips
      for (let y = top + 24; y < bot - 16; y += 12) {
        rect(ctx, 12, y, 8, 4, '#9cc2ee');
        rect(ctx, W - 20, y, 8, 4, '#9cc2ee');
      }
      // Animated green paint-flash scanline + blinking reflow highlight box
      const sy = top + 18 + Math.floor(mod(t * 28, Math.max(20, H - 30)));
      rect(ctx, 10, sy, W - 20, 3, '#7edba8');
      const boxK = Math.floor(t * 1.4) % 4;
      frame(ctx, 28 + boxK * 22, cy - 26 + (boxK % 2) * 18, 46, 22, '#59c08a');
      break;
    }

    case 'application': {
      // Full-bleed layered OS-wallpaper mountain vista (3 depth ridges, sunlit snow peaks, distant pine silhouette & drifting cloud bands)!
      const base = bot - 6;
      // Distant pale sunlit mountain chain (edge-to-edge)
      for (let x = 0; x < W; x += 2) {
        const h1 = Math.max(0, 62 - Math.abs(x - W * 0.22) * 0.45);
        const h2 = Math.max(0, 74 - Math.abs(x - W * 0.64) * 0.42);
        const h3 = Math.max(0, 52 - Math.abs(x - W * 0.92) * 0.5);
        const h = Math.round(Math.max(h1, h2, h3));
        if (h > 0) {
          rect(ctx, x, base - h, 2, h, '#6a8ac8');
          if (h > 44) rect(ctx, x, base - h, 2, Math.min(10, h - 42), '#dceafc'); // bright snow cap
        }
      }
      // Mid atmospheric ridge
      for (let x = 0; x < W; x += 2) {
        const h1 = Math.max(0, 42 - Math.abs(x - W * 0.1) * 0.55);
        const h2 = Math.max(0, 48 - Math.abs(x - W * 0.46) * 0.48);
        const h3 = Math.max(0, 44 - Math.abs(x - W * 0.8) * 0.5);
        const h = Math.round(Math.max(h1, h2, h3));
        if (h > 0) {
          rect(ctx, x, base - h, 2, h, '#4c66a8');
          if (h > 34) rect(ctx, x, base - h, 2, 3, '#8fb4e4');
        }
      }
      // Foreground rolling hill silhouette with subtle pine trees
      for (let x = 0; x < W; x += 2) {
        const hill = Math.round(14 + Math.sin(x * 0.025) * 6 + Math.cos(x * 0.06) * 3);
        rect(ctx, x, base - hill, 2, hill + 6, '#344278');
      }
      // Subtle animated horizon glint waves
      const gx = mod(t * 14, W);
      rect(ctx, gx, base - 4, 18, 1, '#8fb4e4');
      rect(ctx, mod(gx + W * 0.45, W), base - 2, 12, 1, '#7a9ed4');
      break;
    }

    // -----------------------------------------------------------------------------------------
    // Zone B — Expanded Runtime & Libraries
    case 'bytecode': {
      // Full-bleed World-Tree Abstract Syntax Canopy + flanking token columns + cascading amber evaluation pulses!
      // Flanking vertical bytecode tape columns on far left & right
      for (const sx of [10, W - 22]) {
        rect(ctx, sx, top + 6, 12, H - 12, '#1a1a44');
        frame(ctx, sx, top + 6, 12, H - 12, '#333366');
        const off = Math.floor(t * 6) % 6;
        for (let y = top + 10 + off; y < bot - 10; y += 6) {
          rect(ctx, sx + 2, y, 8, 2, y % 12 === 0 ? '#ffcc33' : '#666699');
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
        const spread = Math.min(W * 0.38, 48 + r * 30);
        for (const side of [-1, 1]) {
          const bx = cx + side * spread;
          line(ctx, cx, y0, bx, y1, '#333366');
          line(ctx, cx, y0 + 1, bx, y1 + 1, '#666699');
          rect(ctx, bx - 9, y1 - 4, 18, 8, '#333366');
          frame(ctx, bx - 9, y1 - 4, 18, 8, '#9999cc');
          // Sub-leaves
          line(ctx, bx, y1 + 4, bx + side * 14, y1 + 16, '#333366');
          rect(ctx, bx + side * 14 - 3, y1 + 14, 6, 4, '#66cc99');
          // Cascading token pulse
          const q = mod(t * 0.5 + r * 0.21 + (side > 0 ? 0.35 : 0), 1);
          rect(ctx, cx + side * spread * q - 2, y0 + (y1 - y0) * q - 1, 4, 3, '#ffcc33');
        }
      }
      break;
    }

    case 'jit': {
      // Full-bleed Molten Hot-Loop Crucible + twin side induction coils + rising sparks & pulsing native bus!
      // Flanking induction-coil pylons left & right
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
      disc(ctx, cx, cy, 58, '#330033');
      ring(ctx, cx, cy, 58, '#993333');
      ring(ctx, cx, cy, 52, '#cc6633');
      ring(ctx, cx, cy, 42, '#663366');
      disc(ctx, cx, cy, 24, '#330033');
      ring(ctx, cx, cy, 24, '#ff9933');
      // 6 orbiting hot-loop sparks
      for (let k = 0; k < 6; k++) {
        const a = t * 1.2 + (k * TAU) / 6;
        rect(ctx, cx + Math.cos(a) * 48 - 2, cy + Math.sin(a) * 48 - 2, 4, 4, k % 2 ? '#ffff66' : '#ff6633');
      }
      // Vertical ingot chute top & native-code molten pour bottom
      rect(ctx, cx - 8, top, 16, Math.max(10, cy - 58 - top), '#333366');
      rect(ctx, cx - 8, cy + 58, 16, Math.max(10, bot - (cy + 58)), '#993333');
      rect(ctx, cx - 3, cy + 58, 6, Math.max(10, bot - (cy + 58)), '#ff9933');
      break;
    }

    case 'runtime': {
      // Full-bleed Colossal Steel Heap Cavern: upper & lower truss bridges, vertical support towers, sweeping GC crane + moving conveyor!
      // Vertical steel support towers on left & right edges
      for (const sx of [8, W - 22]) {
        rect(ctx, sx, top, 14, H, '#1e1a3a');
        rect(ctx, sx, top, 2, H, '#333366');
        rect(ctx, sx + 12, top, 2, H, '#333366');
        for (let y = top; y < bot; y += 16) line(ctx, sx + 2, y, sx + 12, y + 14, '#333366');
      }
      // Upper full-width steel truss bridge
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
      // Slow-sweeping overhead GC electromagnet crane with swinging cable & pulsing amber magnet!
      const tx = R(W * 0.14 + (Math.sin(t * 0.28) * 0.5 + 0.5) * W * 0.72);
      const drop = 34 + R(Math.sin(t * 0.7) * 14);
      rect(ctx, tx - 10, beamY + 4, 20, 9, '#666699');
      rect(ctx, tx - 6, beamY + 6, 12, 3, '#9999cc');
      rect(ctx, tx - 1, beamY + 13, 2, drop, '#666699');
      rect(ctx, tx - 9, beamY + 13 + drop, 18, 6, '#9999cc');
      rect(ctx, tx - 7, beamY + 19 + drop, 14, 2, Math.floor(t * 4) % 2 ? '#ffff99' : '#ffcc33');
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
        rect(ctx, cx - 6, y0 - 1, 12, 3, k === activeCable ? '#ffff55' : '#000000');
        for (let s = 0; s <= 32; s++) {
          const q = s / 32;
          const x = leftX + 22 + (rightX - (leftX + 22)) * q;
          const y = y0 + (y1 - y0) * q + Math.sin(q * Math.PI) * (14 + (k % 3) * 6);
          px(ctx, x, y, k === activeCable ? '#ffff55' : k % 2 ? '#aa5500' : '#555555');
        }
        // Signal pulse traveling along active cable
        if (k === activeCable) {
          const pq = mod(t * 1.4, 1);
          const x = leftX + 22 + (rightX - (leftX + 22)) * pq;
          const y = y0 + (y1 - y0) * pq + Math.sin(pq * Math.PI) * (14 + (k % 3) * 6);
          rect(ctx, x - 2, y - 1, 4, 3, '#ffffff');
        }
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
      // Central glowing syscall sluice gate
      rect(ctx, cx - 34, wallY + 4, 68, 64, '#000000');
      frame(ctx, cx - 34, wallY + 4, 68, 64, '#55ffff');
      for (let y = wallY + 10; y < wallY + 64; y += 6) rect(ctx, cx - 30, y, 60, 1, '#00aaaa');
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
      // Full-bleed Great APIC Interrupt Monolith: towering central controller + 12 full-width radiating copper IRQ bus lines + side relay towers!
      // Flanking side relay racks
      for (const sx of [6, W - 20]) {
        rect(ctx, sx, top + 8, 14, H - 16, '#555555');
        for (let y = top + 14; y < bot - 14; y += 10) rect(ctx, sx + 3, y, 8, 4, '#000000');
      }
      rect(ctx, cx - 22, top + 8, 44, H - 16, '#555555');
      frame(ctx, cx - 22, top + 8, 44, H - 16, '#ff5555');
      const activeLine = Math.floor(t * 5) % 10;
      for (let k = 0; k < 10; k++) {
        const ly = top + 18 + k * Math.floor((H - 32) / 10);
        const hot = k === activeLine;
        rect(ctx, 20, ly, cx - 42, 1, hot ? '#ffff55' : '#aa0000');
        rect(ctx, cx + 22, ly, W - 20 - (cx + 22), 1, hot ? '#ffff55' : '#aa0000');
        rect(ctx, cx - 14, ly - 1, 28, 3, hot ? '#ff5555' : '#000000');
        if (hot) {
          const d = mod(t * 90, cx - 44);
          rect(ctx, cx - 24 - d, ly - 1, 6, 3, '#ffffff');
          rect(ctx, cx + 22 + d, ly - 1, 6, 3, '#ffffff');
        }
      }
      break;
    }

    // -----------------------------------------------------------------------------------------
    // Zone D — Drivers, Bus & Firmware
    case 'drivers': {
      // Full-bleed Motherboard Silkscreen: edge-to-edge 45° copper trace highways, flanking RAM/PCIe slot silhouettes, & central BGA Northbridge!
      const bw = 74;
      const bx = cx - 37;
      const by = cy - 37;
      // Top & bottom parallel bus rails across the entire board
      for (let k = 0; k < 4; k++) {
        rect(ctx, 0, top + 10 + k * 5, W, 1, k % 2 ? '#55ffff' : '#ff55ff');
        rect(ctx, 0, bot - 10 - k * 5, W, 1, k % 2 ? '#ff55ff' : '#55ffff');
      }
      // 45° trace highways fanning out to both screen edges
      for (let k = -4; k <= 4; k++) {
        const y = cy + k * 9;
        const col = k % 2 ? '#55ffff' : '#ff55ff';
        rect(ctx, 0, y, bx - 18, 1, col);
        line(ctx, bx - 18, y, bx, y + k * 2, col);
        rect(ctx, bx + bw + 18, y, W - (bx + bw + 18), 1, col);
        line(ctx, bx + bw, y + k * 2, bx + bw + 18, y, col);
      }
      // Traveling data pulses along two trace lanes
      const pxL = mod(t * 50, Math.max(20, bx - 18));
      rect(ctx, pxL, cy - 9, 5, 2, '#ffffff');
      rect(ctx, W - pxL, cy + 9, 5, 2, '#ffffff');
      // Central Northbridge BGA package
      rect(ctx, bx, by, bw, bw, '#000000');
      frame(ctx, bx, by, bw, bw, '#55ffff');
      frame(ctx, bx + 6, by + 6, bw - 12, bw - 12, '#ff55ff');
      for (let p = 8; p < bw - 8; p += 8) {
        px(ctx, bx + p, by - 2, '#ffffff');
        px(ctx, bx + p, by + bw + 1, '#ffffff');
      }
      rect(ctx, bx + 10, by + 10, 6, 6, '#ffffff');
      break;
    }

    case 'bus-fabric': {
      // Full-bleed 16-Lane Diagonal PCIe Superhighway + left/right switch ports + synchronized white packet trains!
      for (let k = 0; k < 10; k++) {
        const y0 = top + 10 + k * Math.floor((H - 24) / 10);
        line(ctx, 0, y0, W, y0 + 24, k % 2 ? '#ff55ff' : '#55ffff');
        const q = mod(t * (0.4 + (k % 3) * 0.12) + k * 0.11, 1);
        rect(ctx, q * W - 3, y0 + q * 24 - 1, 7, 2, '#ffffff');
      }
      // Central PCIe arbiter crossbar diamond
      for (let d = 0; d < 24; d++) {
        rect(ctx, cx - d, cy - 24 + d, d * 2, 1, '#000000');
        rect(ctx, cx - d, cy + 24 - d, d * 2, 1, '#000000');
      }
      line(ctx, cx, cy - 24, cx + 24, cy, '#ffffff');
      line(ctx, cx + 24, cy, cx, cy + 24, '#ffffff');
      line(ctx, cx, cy + 24, cx - 24, cy, '#ffffff');
      line(ctx, cx - 24, cy, cx, cy - 24, '#ffffff');
      break;
    }

    case 'firmware': {
      // Full-bleed Riveted Steel BIOS Vault Wall + colossal 132px circular bank-vault door + flanking locking-bar pistons!
      // Heavy riveted vault bulkhead seams spanning full width & height
      for (let y = top + 20; y < bot - 10; y += 36) {
        rect(ctx, 0, y, W, 2, '#555555');
        for (let x = 10; x < W; x += 24) px(ctx, x, y + 4, '#aaaaaa');
      }
      // Horizontal hydraulic locking bars extending from the vault door to both edges
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
      // Full-bleed Wireframe Puppet-Stage Rig spanning width + twin floating translucent virtual chassis + moving control strings!
      rect(ctx, 0, top + 8, W, 4, '#555555');
      for (let x = 16; x < W; x += 28) rect(ctx, x, top + 12, 2, 6, '#aaaaaa');
      const sway = R(Math.sin(t * 0.8) * 4);
      for (const [ox, cw, ch] of [
        [cx - 56 + sway, 112, 74],
        [18 - sway, 52, 42],
        [W - 70 - sway, 52, 42],
      ] as const) {
        const ry = cy - R(ch / 2);
        line(ctx, ox + 6, top + 12, ox + 6, ry, '#555555');
        line(ctx, ox + cw - 6, top + 12, ox + cw - 6, ry, '#555555');
        frame(ctx, ox, ry, cw, ch, '#aaaaaa');
        frame(ctx, ox + 6, ry + 6, cw - 12, ch - 18, '#555555');
        rect(ctx, ox + 10, ry + ch - 8, R(cw * 0.4), 2, '#aaaaaa');
      }
      break;
    }

    case 'ring-1': {
      // Full-bleed Infinite Hall of Mirrors: 7 nested 1-point perspective frames + breathing reflection pulse + twin mirrored silhouettes!
      const shades = ['#aaaaaa', '#555555', '#aaaaaa', '#555555', '#aaaaaa', '#555555', '#ffffff'];
      const pulseIdx = Math.floor(t * 2.5) % 7;
      for (let k = 0; k < 7; k++) {
        const frac = 1 - k * 0.13;
        const fw = Math.max(22, R((W - 16) * frac));
        const fh = Math.max(18, R((H - 20) * frac));
        frame(ctx, cx - R(fw / 2), cy - R(fh / 2), fw, fh, k === pulseIdx ? '#ffffff' : shades[k]!);
      }
      // Corner perspective rays from screen corners into the vanishing mirror
      line(ctx, 8, top + 10, cx - 11, cy - 9, '#555555');
      line(ctx, W - 8, top + 10, cx + 11, cy - 9, '#555555');
      line(ctx, 8, bot - 10, cx - 11, cy + 9, '#555555');
      line(ctx, W - 8, bot - 10, cx + 11, cy + 9, '#555555');
      // Center vertical mirror-axis seam
      for (let y = top + 10; y < bot - 10; y += 6) rect(ctx, cx, y, 1, 3, '#555555');
      break;
    }

    case 'ept': {
      // Full-bleed 2D Perspective Translation Grid: Guest Physical plane top, Host Physical plane bottom, 3 sweeping laser address lookups!
      const topP = top + 18;
      const botP = bot - 42;
      for (let k = 0; k < 5; k++) {
        rect(ctx, 8, topP + k * 6, W - 16, 1, '#555555');
        rect(ctx, 8, botP + k * 6, W - 16, 1, '#555555');
      }
      for (let x = 16; x < W - 16; x += 24) {
        line(ctx, x, topP, x, topP + 24, '#555555');
        line(ctx, x, botP, x, botP + 24, '#555555');
      }
      // 3 sweeping vertical translation lasers
      for (let k = 0; k < 3; k++) {
        const lx = R(W * (0.15 + k * 0.35) + Math.sin(t * (0.4 + k * 0.15) + k) * 28);
        line(ctx, lx, topP + 12, lx, botP + 12, k === 1 ? '#ffffff' : '#aaaaaa');
        rect(ctx, lx - 3, topP + 10, 6, 4, '#aaaaaa');
        rect(ctx, lx - 3, botP + 10, 6, 4, '#ffffff');
      }
      break;
    }

    case 'ring-2': {
      // Full-bleed Shattered Colossal Pendulum Clockface + radiating glass fracture webs + frozen mid-air debris shards across entire width!
      // Radiating fracture lines stretching edge-to-edge
      line(ctx, 0, top + 24, cx, cy - 6, '#404040');
      line(ctx, W, top + 40, cx, cy - 6, '#404040');
      line(ctx, 0, bot - 28, cx, cy - 6, '#404040');
      line(ctx, W, bot - 20, cx, cy - 6, '#404040');
      // Colossal frozen clockface (136px diameter)
      ring(ctx, cx, cy - 6, 68, '#808080');
      ring(ctx, cx, cy - 6, 62, '#404040');
      ring(ctx, cx, cy - 6, 44, '#404040');
      for (let k = 0; k < 12; k++) {
        const a = (k * TAU) / 12;
        rect(ctx, cx + Math.cos(a) * 56 - 2, cy - 6 + Math.sin(a) * 56 - 2, 4, 4, k % 3 === 0 ? '#c0c0c0' : '#808080');
      }
      // Frozen clock hands & angled frozen pendulum
      line(ctx, cx, cy - 6, cx + 30, cy - 30, '#c0c0c0');
      line(ctx, cx, cy - 6, cx - 18, cy - 48, '#ffffff');
      line(ctx, cx, cy - 6, cx + 40, cy + 68, '#808080');
      disc(ctx, cx + 40, cy + 68, 9, '#c0c0c0');
      // Suspended monochrome shards across left & right margins
      for (let k = 0; k < 12; k++) {
        const sx = R(hash(k * 37 + 1) * (W - 20) + 10);
        const sy = R(top + 16 + hash(k * 53 + 2) * (H - 32));
        rect(ctx, sx, sy, 3, 2, k % 2 ? '#808080' : '#c0c0c0');
      }
      break;
    }

    case 'smram': {
      // Full-bleed Silent Monolithic Tomb Corridors: repeating brutalist pillars across the width + central sealed D_LCK monolith!
      for (let x = 10; x < W - 10; x += 44) {
        if (Math.abs(x - cx) < 42) continue;
        rect(ctx, x, top, 14, H, '#404040');
        rect(ctx, x, top, 2, H, '#808080');
        rect(ctx, x + 12, top, 2, H, '#000000');
      }
      rect(ctx, 0, top + 6, W, 4, '#404040');
      rect(ctx, 0, bot - 10, W, 4, '#404040');
      rect(ctx, cx - 32, cy - 52, 64, 104, '#404040');
      frame(ctx, cx - 32, cy - 52, 64, 104, '#c0c0c0');
      frame(ctx, cx - 24, cy - 44, 48, 88, '#808080');
      // Unblinking stark silver status slit
      rect(ctx, cx - 16, cy - 2, 32, 3, '#ffffff');
      break;
    }

    case 'ring-3':
      // Ring −3 already draws its iconic always-on core + full-width heartbeat traces & power rails in art-v4.ts!
      break;

    case 'me-minix-user': {
      // Full-bleed Miniature City-in-a-Chip: huge amber QFP silicon package with full-width PCB lead traces enclosing a glowing miniature city skyline!
      const cw = Math.min(220, W - 44);
      const ch = Math.min(120, H - 36);
      const rx = cx - R(cw / 2);
      const ry = cy - R(ch / 2);
      // Full-width PCB lead traces extending from left & right package pins to screen edges
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
      // Miniature glowing midnight city skyline living inside the chip die cavity!
      const base = ry + ch - 8;
      for (let x = rx + 10; x < rx + cw - 14; x += 9) {
        const th = 16 + Math.floor(hash(x * 19 + 5) * (ch - 36));
        rect(ctx, x, base - th, 7, th, '#555555');
        rect(ctx, x, base - th, 7, 1, '#aaaaaa');
        if (hash(x * 7) > 0.35) rect(ctx, x + 2, base - th + 4, 2, 2, '#ffffff');
        if (hash(x * 13) > 0.5) rect(ctx, x + 2, base - th + 10, 2, 2, '#aaaaaa');
      }
      // Tiny amber beacon blinking inside the miniature city
      if (Math.floor(t * 2) % 2 === 0) rect(ctx, cx - 1, ry + 14, 3, 3, '#ffffff');
      break;
    }

    case 'me-minix-kern': {
      // Full-bleed Radial IPC Star-Hub: central amber microkernel ring + 12 pneumatic message tubes reaching edge-to-edge satellite servers!
      ring(ctx, cx, cy, 28, '#aaaaaa');
      ring(ctx, cx, cy, 18, '#ffffff');
      disc(ctx, cx, cy, 6, '#aaaaaa');
      const rx = Math.min(W * 0.44, 145);
      const ry = Math.min(H * 0.42, 74);
      for (let k = 0; k < 12; k++) {
        const a = (k * TAU) / 12;
        const ex = cx + Math.cos(a) * rx;
        const ey = cy + Math.sin(a) * ry;
        line(ctx, cx + Math.cos(a) * 28, cy + Math.sin(a) * 28, ex, ey, '#555555');
        rect(ctx, ex - 5, ey - 5, 10, 10, '#555555');
        frame(ctx, ex - 5, ey - 5, 10, 10, '#aaaaaa');
        const q = mod(t * (0.45 + (k % 3) * 0.12) + k * 0.09, 1);
        rect(ctx, cx + Math.cos(a) * (28 + q * (rx - 30)) - 1, cy + Math.sin(a) * (28 + q * (ry - 30)) - 1, 3, 3, '#ffffff');
      }
      break;
    }

    // -----------------------------------------------------------------------------------------
    // Zone F — Deep Silicon, Lithography & Physics Abyss
    case 'uarch': {
      // Full-bleed Giant Speculative Execution Pipeline: Fetch/Decode/ROB boxes + huge branching Taken vs flickering Not-Taken ghost path!
      const forkX = cx - 28;
      // Pipeline stage boxes along the left half
      for (let s = 0; s < 3; s++) {
        const sx = 10 + s * R((forkX - 24) / 3);
        rect(ctx, sx, cy - 12, 22, 24, '#000000');
        frame(ctx, sx, cy - 12, 22, 24, '#aaaaaa');
        rect(ctx, sx + 4, cy - 4, 14, 2, '#555555');
        rect(ctx, sx + 4, cy + 2, 10, 2, '#555555');
      }
      rect(ctx, 10, cy - 1, forkX - 10, 2, '#aaaaaa');
      // Taken branch (upper, bright solid with moving μop pulses)
      line(ctx, forkX, cy, W - 14, cy - 48, '#aaaaaa');
      line(ctx, forkX, cy + 2, W - 14, cy - 46, '#555555');
      const uq = mod(t * 0.7, 1);
      rect(ctx, forkX + (W - 14 - forkX) * uq - 2, cy - 48 * uq - 2, 4, 4, '#ffffff');
      // Speculative ghost branch (lower, flickers and flushes on mispredict!)
      const alive = mod(t * 0.42, 1) < 0.7;
      if (alive) {
        line(ctx, forkX, cy, W - 14, cy + 48, '#555555');
        frame(ctx, W - 44, cy + 36, 30, 18, '#555555');
      }
      frame(ctx, W - 44, cy - 58, 30, 18, '#aaaaaa');
      break;
    }

    case 'rtl': {
      // Full-bleed Screen-Spanning Fractal Clock H-Tree with cascading clock-edge wave pulses!
      const phase = Math.floor(t * 4) % 3;
      const c0 = phase === 0 ? '#ffffff' : '#aaaaaa';
      const c1 = phase === 1 ? '#ffffff' : '#555555';
      const c2 = phase === 2 ? '#ffffff' : '#555555';
      const sw = W - 44;
      const sh = Math.max(80, H - 56);
      // Level 0 central H
      rect(ctx, cx - R(sw / 2), cy, sw, 2, c0);
      rect(ctx, cx - R(sw / 2), cy - R(sh / 2), 2, sh, c1);
      rect(ctx, cx + R(sw / 2) - 2, cy - R(sh / 2), 2, sh, c1);
      // Level 1 & 2 leaf H's spanning full width
      for (const [lx, ly] of [
        [cx - R(sw / 2), cy - R(sh / 2)],
        [cx + R(sw / 2) - 2, cy - R(sh / 2)],
        [cx - R(sw / 2), cy + R(sh / 2)],
        [cx + R(sw / 2) - 2, cy + R(sh / 2)],
      ] as const) {
        rect(ctx, lx - 22, ly, 44, 1, c1);
        rect(ctx, lx - 22, ly - 14, 1, 28, c2);
        rect(ctx, lx + 22, ly - 14, 1, 28, c2);
        rect(ctx, lx - 24, ly - 16, 4, 4, c2);
        rect(ctx, lx + 20, ly - 16, 4, 4, c2);
        rect(ctx, lx - 24, ly + 12, 4, 4, c2);
        rect(ctx, lx + 20, ly + 12, 4, 4, c2);
      }
      rect(ctx, cx - 4, cy - 4, 8, 8, '#ffffff');
      break;
    }

    case 'cmos': {
      // Full-bleed 4-Color Semiconductor Lithography Wafer Mask Cross-Section covering the entire band!
      // Horizontal teal diffusion wells across full width
      for (let y = top + 16; y < bot - 20; y += 44) {
        rect(ctx, 10, y, W - 20, 20, '#24989c');
      }
      // Vertical violet polysilicon gate stripes spanning full height
      for (let x = 24; x < W - 20; x += 32) {
        rect(ctx, x, top + 4, 8, H - 8, '#9448d4');
        // Crisp white contact vias at every well intersection
        for (let y = top + 24; y < bot - 20; y += 44) {
          rect(ctx, x + 2, y, 4, 4, '#ffffff');
        }
      }
      // Sweeping copper Metal-1 & Metal-2 power/signal buses with live charge pulses
      for (const my of [cy - 18, cy + 16]) {
        rect(ctx, 0, my, W, 10, '#e88438');
        const cxP = mod(t * 44 + my, W);
        rect(ctx, cxP, my + 3, 12, 4, '#ffffff');
      }
      break;
    }

    case 'litho': {
      // Full-bleed 13.5nm EUV Fresnel Diffraction Target + silicon diamond crystal lattice + pulsing wavefront ring!
      // Subtle crystal lattice covering full band
      for (let y = top + 12; y < bot - 12; y += 20) {
        for (let x = 12 + ((y / 20) % 2) * 10; x < W - 12; x += 20) {
          rect(ctx, x, y, 2, 2, '#555555');
        }
      }
      // Expanding animated EUV wavefront + static Fresnel interference rings
      for (const rad of [96, 74, 54, 36, 20]) {
        ring(ctx, cx, cy, rad, rad <= 36 ? '#aaaaaa' : '#555555');
      }
      const waveR = 12 + Math.floor(mod(t * 28, 92));
      ring(ctx, cx, cy, waveR, '#ffffff');
      disc(ctx, cx, cy, 4, '#ffffff');
      // Full-width & full-height EUV reticle alignment crosshairs
      rect(ctx, cx, top + 4, 1, H - 8, '#555555');
      rect(ctx, 8, cy, W - 16, 1, '#555555');
      break;
    }

    case 'bandgap': {
      // Full-bleed Twin Energy-Band Horizon (Conduction top, Valence bottom) + central quantum barrier wall + multiple tunneling wave packets!
      // Conduction band strata (top)
      rect(ctx, 0, top + 8, W, 24, '#555555');
      rect(ctx, 0, top + 32, W, 2, '#aaaaaa');
      // Valence band strata (bottom)
      rect(ctx, 0, bot - 32, W, 24, '#555555');
      rect(ctx, 0, bot - 34, W, 2, '#aaaaaa');
      // Faint probability wave curves spanning full width
      for (let x = 0; x < W; x += 3) {
        const wy = cy + R(Math.sin(x * 0.08 - t * 2.2) * 16);
        px(ctx, x, wy, '#555555');
      }
      // Central translucent potential barrier wall spanning the forbidden gap
      rect(ctx, cx - 5, top + 34, 10, Math.max(20, bot - 68 - top), '#555555');
      frame(ctx, cx - 5, top + 34, 10, Math.max(20, bot - 68 - top), '#aaaaaa');
      // Two wave packets tunneling straight through the barrier
      for (let k = 0; k < 2; k++) {
        const q = mod(t * (0.32 + k * 0.14) + k * 0.5, 1);
        const wx = R(q * W);
        const wy = cy + (k === 0 ? -14 : 14);
        rect(ctx, wx - 5, wy - 1, 10, 2, wx > cx ? '#ffffff' : '#aaaaaa');
      }
      break;
    }

    case 'landauer': {
      // Full-bleed Thermodynamic Event Horizon: vast void + enormous multi-ring entropy horizon + rare full-screen diagonal cosmic-ray bit flips!
      const base = bot - 10;
      for (const rad of [150, 118, 86, 56]) {
        ring(ctx, cx, base + 56, rad, rad <= 86 ? '#aaaaaa' : '#555555');
      }
      // Slow breathing entropy pulse ring expanding from horizon
      const er = 48 + Math.floor(mod(t * 16, 110));
      ring(ctx, cx, base + 56, er, '#555555');
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
  }
}
