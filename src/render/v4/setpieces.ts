import type { LayerId } from '../../core/layers';
import { hash, type Band } from '../art';
import { c } from './kit';

/**
 * Monumental deep-background architectural setpieces for all 29 Daily + Endless layers.
 *
 * Each layer gets 1–2 large-scale landmarks (120–320+ scene px wide or full-band height) drawn
 * behind the far & near trinkets at calm contrast so every layer has an unmistakable sense of place
 * without competing with foreground props, critters, or UI text.
 *
 * All colours pass through `c()` from `kit.ts` so they snap cleanly onto the active layer's palette.
 * Animations run on `t` (`0` under reduced motion and frozen in Ring −2).
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
  for (let n = 0; n < 640; n++) {
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

/** Draw a monumental pixel cogwheel (deep background). */
function giantCog(ctx: Ctx, cx: number, cy: number, rad: number, ang: number, body: string, hole: string, rim: string) {
  const teeth = Math.max(12, Math.floor(rad * 0.42));
  for (let k = 0; k < teeth; k++) {
    const a = ang + (k * TAU) / teeth;
    const tx = cx + Math.cos(a) * (rad + 4);
    const ty = cy + Math.sin(a) * (rad + 4);
    rect(ctx, tx - 3, ty - 3, 6, 6, body);
  }
  disc(ctx, cx, cy, rad, body);
  ring(ctx, cx, cy, rad - 3, rim);
  disc(ctx, cx, cy, Math.max(6, R(rad * 0.55)), hole);
  // Spokes
  for (let k = 0; k < 4; k++) {
    const a = ang + (k * TAU) / 4;
    line(ctx, cx - Math.cos(a) * rad * 0.65, cy - Math.sin(a) * rad * 0.65, cx + Math.cos(a) * rad * 0.65, cy + Math.sin(a) * rad * 0.65, body);
  }
  disc(ctx, cx, cy, 8, rim);
  disc(ctx, cx, cy, 3, hole);
}

/** Band center Y in screen coordinates, gently anchored inside the band's visible span. */
function bandCenterY(b: Band, frac = 0.52): number {
  const bh = Math.min(480, Math.max(160, b.bottom - b.top));
  return b.bottom - bh * (1 - frac);
}

export function drawSetpiece(ctx: Ctx, b: Band, id: LayerId, t: number) {
  const W = b.w;
  const cx = R(W / 2);
  const cy = R(bandCenterY(b));

  switch (id) {
    // -----------------------------------------------------------------------------------------
    // Zone A — Above Application & Desktop
    case 'internet': {
      // Curved planetary limb along the lower horizon + sweeping transatlantic fiber-optic arcs.
      const base = R(b.bottom - 10);
      for (let x = 0; x < W; x += 2) {
        const dx = (x - cx) / Math.max(120, W * 0.6);
        const h = Math.max(0, Math.round((1 - dx * dx) * 34));
        if (h > 0) {
          rect(ctx, x, base - h, 2, h + 10, '#6c9cd4');
          rect(ctx, x, base - h, 2, 2, '#b9def8');
        }
      }
      // 3 giant fiber arcs with traveling light pulses
      const arcs: [number, number, number][] = [
        [W * 0.14, W * 0.52, 46],
        [W * 0.44, W * 0.86, 52],
        [W * 0.22, W * 0.78, 72],
      ];
      arcs.forEach(([x0, x1, lift], k) => {
        for (let s = 0; s <= 32; s++) {
          const q = s / 32;
          const x = x0 + (x1 - x0) * q;
          const y = base - 16 - Math.sin(q * Math.PI) * lift;
          px(ctx, x, y, '#8bb8e8');
        }
        const pq = mod(t * (0.28 + k * 0.08) + k * 0.37, 1);
        const pxX = x0 + (x1 - x0) * pq;
        const pxY = base - 16 - Math.sin(pq * Math.PI) * lift;
        rect(ctx, pxX - 2, pxY - 1, 4, 2, '#ffffff');
      });
      break;
    }

    case 'browser': {
      // Giant wireframe DOM cathedral receding in parallax + slow green paint-flash scan bar.
      for (let k = 0; k < 4; k++) {
        const mw = Math.max(60, W - 36 - k * 44);
        const mh = Math.max(40, 128 - k * 24);
        const rx = cx - R(mw / 2);
        const ry = cy - R(mh / 2);
        frame(ctx, rx, ry, mw, mh, k % 2 ? '#7ea8dc' : '#9cc2ee');
        rect(ctx, rx + 2, ry + 2, Math.min(36, mw - 4), 2, '#b9d8f8');
      }
      // Paint-flash sweep bar
      const sy = cy - 60 + Math.floor(mod(t * 24, 120));
      rect(ctx, cx - R((W - 44) / 2), sy, Math.max(40, W - 44), 3, '#7edba8');
      break;
    }

    case 'application': {
      // Iconic distant OS-wallpaper mountain range silhouetted along the lower horizon!
      const base = R(b.bottom - 12);
      // Far misty ridge
      for (let x = 0; x < W; x += 2) {
        const p1 = Math.max(0, 44 - Math.abs(x - W * 0.28) * 0.55);
        const p2 = Math.max(0, 56 - Math.abs(x - W * 0.68) * 0.48);
        const h = Math.round(Math.max(p1, p2));
        if (h > 0) {
          rect(ctx, x, base - h, 2, h, '#5b78b8');
          if (h > 36) rect(ctx, x, base - h, 2, 4, '#c8daf4'); // snow cap
        }
      }
      // Closer darker ridge
      for (let x = 0; x < W; x += 2) {
        const p1 = Math.max(0, 28 - Math.abs(x - W * 0.16) * 0.62);
        const p2 = Math.max(0, 34 - Math.abs(x - W * 0.52) * 0.52);
        const p3 = Math.max(0, 26 - Math.abs(x - W * 0.85) * 0.6);
        const h = Math.round(Math.max(p1, p2, p3));
        if (h > 0) rect(ctx, x, base - h, 2, h, '#3d4c8a');
      }
      break;
    }

    // -----------------------------------------------------------------------------------------
    // Zone B — Expanded Runtime & Libraries
    case 'bytecode': {
      // The World-Tree Abstract Syntax Canopy spanning the band height with cascading token pulses.
      const topY = R(b.top + 24);
      const botY = R(b.bottom - 24);
      rect(ctx, cx - 2, topY + 12, 4, Math.max(40, botY - topY - 24), '#333366');
      rect(ctx, cx - 10, topY, 20, 12, '#666699');
      const branches: [number, number, number][] = [
        [-64, 34, 62],
        [64, 34, 62],
        [-96, 76, 98],
        [96, 76, 98],
        [-52, 112, 134],
        [52, 112, 134],
      ];
      branches.forEach(([dx, y0, y1], k) => {
        const bx = cx + dx;
        line(ctx, cx, topY + y0, bx, topY + y1, '#333366');
        rect(ctx, bx - 6, topY + y1 - 3, 12, 6, '#666699');
        const q = mod(t * 0.45 + k * 0.19, 1);
        rect(ctx, cx + dx * q - 1, topY + y0 + (y1 - y0) * q - 1, 2, 2, '#ffcc33');
      });
      break;
    }

    case 'jit': {
      // Molten Hot-Loop Crucible ring in the deep background glowing orange-gold.
      ring(ctx, cx, cy, 56, '#663333');
      ring(ctx, cx, cy, 52, '#993333');
      ring(ctx, cx, cy, 46, '#cc6633');
      ring(ctx, cx, cy, 38, '#663366');
      // Four orbiting hot-loop sparks around the crucible rim
      for (let k = 0; k < 4; k++) {
        const a = t * 1.1 + (k * TAU) / 4;
        rect(ctx, cx + Math.cos(a) * 50 - 2, cy + Math.sin(a) * 50 - 2, 4, 4, k % 2 ? '#ffff66' : '#ff9933');
      }
      // Vertical crucible conduit top & bottom
      rect(ctx, cx - 6, b.top + 14, 12, Math.max(10, cy - 56 - b.top - 14), '#333366');
      rect(ctx, cx - 6, cy + 56, 12, Math.max(10, b.bottom - (cy + 56) - 10), '#663333');
      break;
    }

    case 'runtime': {
      // Colossal diagonal steel heap trusses + slow-moving overhead GC bridge crane!
      const beamY = R(b.top + 36);
      rect(ctx, 0, beamY, W, 6, '#333366');
      rect(ctx, 0, beamY, W, 1, '#666699');
      // Diagonal truss webbing across full width
      for (let x = 0; x < W; x += 24) {
        line(ctx, x, beamY + 6, x + 12, beamY + 18, '#333366');
        line(ctx, x + 12, beamY + 18, x + 24, beamY + 6, '#333366');
      }
      rect(ctx, 0, beamY + 18, W, 2, '#333366');
      // Slow-sweeping overhead GC electromagnet trolley
      const tx = R(W * 0.15 + (Math.sin(t * 0.25) * 0.5 + 0.5) * W * 0.7);
      rect(ctx, tx - 8, beamY + 4, 16, 8, '#666699');
      rect(ctx, tx - 1, beamY + 12, 2, 34, '#666699');
      rect(ctx, tx - 7, beamY + 46, 14, 5, '#9999cc');
      rect(ctx, tx - 5, beamY + 51, 10, 2, '#ffcc33');
      break;
    }

    case 'libraries': {
      // Grand vaulted timber reading-room arches + huge warm brass rose/oculus window in center-back!
      const oculusY = R(cy - 12);
      disc(ctx, cx, oculusY, 46, '#550000');
      ring(ctx, cx, oculusY, 46, '#aa5500');
      ring(ctx, cx, oculusY, 34, '#550000');
      ring(ctx, cx, oculusY, 20, '#aa5500');
      for (let k = 0; k < 8; k++) {
        const a = (k * TAU) / 8;
        line(ctx, cx, oculusY, cx + Math.cos(a) * 45, oculusY + Math.sin(a) * 45, '#aa5500');
      }
      // Tall flanking library pillars
      for (const px0 of [R(W * 0.12), R(W * 0.88 - 10)]) {
        rect(ctx, px0, b.top + 14, 10, Math.max(40, b.bottom - b.top - 18), '#550000');
        rect(ctx, px0, b.top + 14, 2, Math.max(40, b.bottom - b.top - 18), '#aa5500');
      }
      break;
    }

    case 'linker': {
      // The Great Patch-Bay Switchboard Wall with catenary brass trunk cables.
      const leftX = R(W * 0.12);
      const rightX = R(W * 0.88 - 18);
      const topY = R(b.top + 26);
      const h = Math.max(60, R(b.bottom - b.top - 48));
      rect(ctx, leftX, topY, 18, h, '#555555');
      rect(ctx, rightX, topY, 18, h, '#555555');
      for (let k = 0; k < 5; k++) {
        const y0 = topY + 12 + k * Math.floor(h / 5);
        const y1 = topY + 12 + ((k * 2 + 1) % 5) * Math.floor(h / 5);
        rect(ctx, leftX + 4, y0 - 2, 10, 4, '#000000');
        rect(ctx, rightX + 4, y1 - 2, 10, 4, '#000000');
        // Sweeping catenary cable
        for (let s = 0; s <= 24; s++) {
          const q = s / 24;
          const x = leftX + 18 + (rightX - (leftX + 18)) * q;
          const y = y0 + (y1 - y0) * q + Math.sin(q * Math.PI) * 16;
          px(ctx, x, y, k % 2 ? '#aa5500' : '#555555');
        }
      }
      break;
    }

    // -----------------------------------------------------------------------------------------
    // Zone C — Userspace & Expanded OS Kernel
    case 'userspace': {
      // Continuous midnight metropolis skyline + colossal central PID 1 arcology with sweeping beacon!
      const base = R(b.bottom - 6);
      for (let x = 0; x < W; x += 18) {
        const bh = 28 + Math.floor(hash(x * 13 + 7) * 58);
        rect(ctx, x, base - bh, 16, bh, '#0000aa');
        rect(ctx, x, base - bh, 1, bh, '#5555ff');
        for (let wy = base - bh + 5; wy < base - 8; wy += 6) {
          for (let wx = x + 3; wx < x + 13; wx += 4) {
            if (hash(wx * 31 + wy) < 0.28) rect(ctx, wx, wy, 2, 2, '#555555');
          }
        }
      }
      // Colossal central PID 1 spire rising behind everything
      const spireH = Math.min(130, Math.max(70, R((b.bottom - b.top) * 0.62)));
      rect(ctx, cx - 14, base - spireH, 28, spireH, '#0000aa');
      rect(ctx, cx - 14, base - spireH, 2, spireH, '#5555ff');
      rect(ctx, cx - 6, base - spireH - 18, 12, 18, '#555555');
      rect(ctx, cx - 1, base - spireH - 34, 2, 16, '#aaaaaa');
      // Sweeping green PID 1 beacon
      const on = Math.floor(t * 1.4) % 2 === 0;
      rect(ctx, cx - 2, base - spireH - 36, 4, 3, on ? '#55ff55' : '#00aa00');
      break;
    }

    case 'kernel-entry': {
      // The Syscall Containment Dam / Blast-Door Bulkhead spanning the full width.
      const wallY = R(cy - 28);
      rect(ctx, 0, wallY, W, 56, '#555555');
      rect(ctx, 0, wallY, W, 2, '#aaaaaa');
      rect(ctx, 0, wallY + 54, W, 2, '#000000');
      // Central glowing syscall sluice gate
      rect(ctx, cx - 28, wallY + 4, 56, 48, '#000000');
      frame(ctx, cx - 28, wallY + 4, 56, 48, '#55ffff');
      for (let y = wallY + 10; y < wallY + 48; y += 6) rect(ctx, cx - 24, y, 48, 1, '#00aaaa');
      // Flanking vertical pressure gauges
      for (const gx of [cx - 46, cx + 40]) {
        rect(ctx, gx, wallY + 8, 6, 40, '#000000');
        const fill = 10 + Math.floor((Math.sin(t * 1.6 + gx) * 0.5 + 0.5) * 26);
        rect(ctx, gx + 1, wallY + 47 - fill, 4, fill, '#55ffff');
      }
      break;
    }

    case 'kernel': {
      // Two Titan interlocking clockwork flywheel gears (110px+ diameter) grinding behind the machine room!
      giantCog(ctx, cx - 54, cy - 6, 48, t * 0.22, '#555555', '#000000', '#aaaaaa');
      giantCog(ctx, cx + 48, cy + 16, 36, -t * 0.3, '#aa5500', '#000000', '#ffff55');
      // Heavy horizontal steam manifold across full width
      rect(ctx, 0, cy + 54, W, 8, '#aa0000');
      rect(ctx, 0, cy + 54, W, 2, '#ff5555');
      break;
    }

    case 'kernel-arch': {
      // The Great APIC Interrupt Monolith with 16 radiating IRQ copper bus lines.
      rect(ctx, cx - 18, b.top + 22, 36, Math.max(80, b.bottom - b.top - 44), '#555555');
      frame(ctx, cx - 18, b.top + 22, 36, Math.max(80, b.bottom - b.top - 44), '#aa0000');
      const activeLine = Math.floor(t * 5) % 8;
      for (let k = 0; k < 8; k++) {
        const ly = R(b.top + 34 + k * 16);
        if (ly > b.bottom - 20) break;
        const hot = k === activeLine;
        rect(ctx, 0, ly, cx - 18, 1, hot ? '#ffff55' : '#aa0000');
        rect(ctx, cx + 18, ly, W - (cx + 18), 1, hot ? '#ffff55' : '#aa0000');
        rect(ctx, cx - 10, ly - 1, 20, 3, hot ? '#ff5555' : '#000000');
      }
      break;
    }

    // -----------------------------------------------------------------------------------------
    // Zone D — Drivers, Bus & Firmware
    case 'drivers': {
      // Giant Motherboard Silkscreen & Northbridge BGA Package with 45°-routed trace highways!
      const bw = 68;
      const bx = cx - 34;
      const by = cy - 34;
      // 45° trace highways radiating out from the giant BGA package
      for (let k = -3; k <= 3; k++) {
        const y = cy + k * 8;
        rect(ctx, 0, y, bx - 14, 1, k % 2 ? '#55ffff' : '#ff55ff');
        line(ctx, bx - 14, y, bx, y + k * 2, k % 2 ? '#55ffff' : '#ff55ff');
        rect(ctx, bx + bw + 14, y, W - (bx + bw + 14), 1, k % 2 ? '#ff55ff' : '#55ffff');
        line(ctx, bx + bw, y + k * 2, bx + bw + 14, y, k % 2 ? '#ff55ff' : '#55ffff');
      }
      rect(ctx, bx, by, bw, bw, '#000000');
      frame(ctx, bx, by, bw, bw, '#55ffff');
      frame(ctx, bx + 6, by + 6, bw - 12, bw - 12, '#ff55ff');
      // BGA pin-1 corner mark
      rect(ctx, bx + 10, by + 10, 5, 5, '#ffffff');
      break;
    }

    case 'bus-fabric': {
      // 16-lane diagonal PCIe differential-pair superhighway with synchronized packet trains.
      for (let k = 0; k < 8; k++) {
        const y0 = R(b.top + 24 + k * 16);
        if (y0 > b.bottom - 16) break;
        line(ctx, 0, y0, W, y0 + 28, k % 2 ? '#ff55ff' : '#55ffff');
        const q = mod(t * 0.45 + k * 0.13, 1);
        rect(ctx, q * W - 3, y0 + q * 28 - 1, 6, 2, '#ffffff');
      }
      break;
    }

    case 'firmware': {
      // Colossal Bank-Vault Blast Door (128px diameter) with locking bolts & rotating wheel!
      disc(ctx, cx, cy, 62, '#555555');
      ring(ctx, cx, cy, 62, '#aaaaaa');
      disc(ctx, cx, cy, 52, '#000000');
      ring(ctx, cx, cy, 52, '#555555');
      ring(ctx, cx, cy, 26, '#aaaaaa');
      // Locking bolts around perimeter
      for (let k = 0; k < 8; k++) {
        const a = (k * TAU) / 8;
        rect(ctx, cx + Math.cos(a) * 56 - 3, cy + Math.sin(a) * 56 - 3, 6, 6, '#aaaaaa');
      }
      // Slowly rotating 3-spoke vault wheel
      const wa = t * 0.2;
      for (let k = 0; k < 3; k++) {
        const a = wa + (k * TAU) / 3;
        line(ctx, cx, cy, cx + Math.cos(a) * 24, cy + Math.sin(a) * 24, '#ffffff');
      }
      disc(ctx, cx, cy, 5, '#ffffff');
      break;
    }

    // -----------------------------------------------------------------------------------------
    // Zone E — Expanded Hidden Rings & MINIX-Inside-ME
    case 'vmm': {
      // Giant Wireframe Puppet-Stage Rig cradling a hollow translucent PC chassis.
      const topY = R(b.top + 16);
      rect(ctx, 0, topY, W, 3, '#555555');
      const cw = 96;
      const ch = 64;
      const rx = cx - 48;
      const ry = cy - 24;
      // Marionette strings descending from the rig
      for (const sx of [rx + 8, rx + cw - 8, cx]) {
        line(ctx, sx, topY + 3, sx, ry, '#555555');
      }
      frame(ctx, rx, ry, cw, ch, '#aaaaaa');
      frame(ctx, rx + 8, ry + 8, cw - 16, ch - 24, '#555555');
      rect(ctx, rx + 14, ry + ch - 10, 24, 3, '#aaaaaa');
      break;
    }

    case 'ring-1': {
      // Infinite Hall of Mirrors: dramatic 1-point perspective corridor of receding green frames!
      const shades = ['#aaaaaa', '#555555', '#aaaaaa', '#555555', '#ffffff'];
      for (let k = 0; k < 5; k++) {
        const fw = Math.max(24, W - 30 - k * Math.floor((W - 60) / 5));
        const fh = Math.max(20, 140 - k * 26);
        frame(ctx, cx - R(fw / 2), cy - R(fh / 2), fw, fh, shades[k]!);
      }
      // Perspective corner rays into the vanishing point
      line(ctx, 15, cy - 70, cx - 12, cy - 10, '#555555');
      line(ctx, W - 15, cy - 70, cx + 12, cy - 10, '#555555');
      line(ctx, 15, cy + 70, cx - 12, cy + 10, '#555555');
      line(ctx, W - 15, cy + 70, cx + 12, cy + 10, '#555555');
      break;
    }

    case 'ept': {
      // 2D Perspective Translation Grid: Guest Physical plane above, Host Physical below, vertical laser lookup!
      const topP = cy - 42;
      const botP = cy + 32;
      for (let k = 0; k < 4; k++) {
        rect(ctx, 16, topP + k * 6, W - 32, 1, '#555555');
        rect(ctx, 16, botP + k * 6, W - 32, 1, '#555555');
      }
      const lx = R(W * 0.2 + (Math.sin(t * 0.45) * 0.5 + 0.5) * W * 0.6);
      line(ctx, lx, topP + 10, lx, botP + 10, '#ffffff');
      rect(ctx, lx - 3, topP + 8, 6, 4, '#aaaaaa');
      rect(ctx, lx - 3, botP + 8, 6, 4, '#ffffff');
      break;
    }

    case 'ring-2': {
      // Shattered Colossal Pendulum Clockface (136px wide), permanently frozen mid-shatter!
      ring(ctx, cx, cy - 8, 62, '#808080');
      ring(ctx, cx, cy - 8, 56, '#404040');
      for (let k = 0; k < 12; k++) {
        const a = (k * TAU) / 12;
        rect(ctx, cx + Math.cos(a) * 50 - 1, cy - 8 + Math.sin(a) * 50 - 1, 2, 2, k % 3 === 0 ? '#c0c0c0' : '#808080');
      }
      // Frozen clock hands & angled frozen pendulum
      line(ctx, cx, cy - 8, cx + 26, cy - 28, '#c0c0c0');
      line(ctx, cx, cy - 8, cx - 16, cy - 44, '#ffffff');
      line(ctx, cx, cy - 8, cx + 36, cy + 62, '#808080');
      disc(ctx, cx + 36, cy + 62, 8, '#c0c0c0');
      // Crack lines across the glass
      line(ctx, cx - 34, cy - 46, cx + 8, cy - 12, '#404040');
      line(ctx, cx + 8, cy - 12, cx + 44, cy + 16, '#404040');
      break;
    }

    case 'smram': {
      // Silent Monolithic Tomb Corridors framing a sealed D_LCK monolith.
      for (const px0 of [R(W * 0.14), R(W * 0.86 - 16)]) {
        rect(ctx, px0, b.top + 16, 16, Math.max(60, b.bottom - b.top - 32), '#404040');
        rect(ctx, px0, b.top + 16, 2, Math.max(60, b.bottom - b.top - 32), '#808080');
      }
      rect(ctx, cx - 26, cy - 44, 52, 88, '#404040');
      frame(ctx, cx - 26, cy - 44, 52, 88, '#c0c0c0');
      // Single unblinking silver status slit
      rect(ctx, cx - 12, cy - 2, 24, 3, '#ffffff');
      break;
    }

    case 'ring-3':
      // Ring −3 already draws its iconic always-on core + heartbeat traces in art-v4.ts!
      break;

    case 'me-minix-user': {
      // The Miniature City-in-a-Chip: huge amber QFP chip silhouette enclosing a tiny midnight city skyline!
      const cw = 132;
      const ch = 92;
      const rx = cx - 66;
      const ry = cy - 46;
      // Chip pins along top & bottom
      for (let x = rx + 8; x < rx + cw - 6; x += 8) {
        rect(ctx, x, ry - 8, 3, 8, '#555555');
        rect(ctx, x, ry + ch, 3, 8, '#555555');
      }
      rect(ctx, rx, ry, cw, ch, '#000000');
      frame(ctx, rx, ry, cw, ch, '#aaaaaa');
      frame(ctx, rx + 4, ry + 4, cw - 8, ch - 8, '#555555');
      // Tiny glowing city skyline living inside the chip cavity!
      const base = ry + ch - 8;
      for (let x = rx + 10; x < rx + cw - 14; x += 9) {
        const th = 12 + Math.floor(hash(x * 19 + 5) * 34);
        rect(ctx, x, base - th, 7, th, '#555555');
        rect(ctx, x, base - th, 7, 1, '#aaaaaa');
        if (hash(x * 7) > 0.4) rect(ctx, x + 2, base - th + 4, 2, 2, '#ffffff');
      }
      break;
    }

    case 'me-minix-kern': {
      // Radial IPC Star-Hub: central amber microkernel ring with 8 pneumatic message tubes radiating out.
      ring(ctx, cx, cy, 24, '#aaaaaa');
      ring(ctx, cx, cy, 14, '#ffffff');
      for (let k = 0; k < 8; k++) {
        const a = (k * TAU) / 8;
        const ex = cx + Math.cos(a) * 86;
        const ey = cy + Math.sin(a) * 58;
        line(ctx, cx + Math.cos(a) * 24, cy + Math.sin(a) * 24, ex, ey, '#555555');
        rect(ctx, ex - 4, ey - 4, 8, 8, '#555555');
        const q = mod(t * 0.55 + k * 0.14, 1);
        rect(ctx, cx + Math.cos(a) * (24 + q * 60) - 1, cy + Math.sin(a) * (24 + q * 34) - 1, 2, 2, '#ffffff');
      }
      break;
    }

    // -----------------------------------------------------------------------------------------
    // Zone F — Deep Silicon, Lithography & Physics Abyss
    case 'uarch': {
      // Giant Speculative Execution Fork: huge blueprint pipeline splitting into Taken vs Not-Taken!
      const forkX = cx - 24;
      rect(ctx, 14, cy - 3, forkX - 14, 6, '#555555');
      rect(ctx, 14, cy - 1, forkX - 14, 2, '#aaaaaa');
      // Taken branch (solid bright)
      line(ctx, forkX, cy, W - 18, cy - 42, '#aaaaaa');
      line(ctx, forkX, cy + 2, W - 18, cy - 40, '#555555');
      // Speculative ghost branch (periodically flickers & dissolves on mispredict!)
      const alive = mod(t * 0.4, 1) < 0.72;
      if (alive) {
        line(ctx, forkX, cy, W - 18, cy + 42, '#555555');
        rect(ctx, W - 36, cy + 36, 16, 10, '#555555');
      }
      rect(ctx, W - 36, cy - 48, 16, 10, '#aaaaaa');
      break;
    }

    case 'rtl': {
      // Screen-Spanning Fractal Clock H-Tree pulsing in lockstep!
      const pulse = Math.floor(t * 3) % 2 === 0;
      const col = pulse ? '#aaaaaa' : '#555555';
      const sw = Math.min(180, W - 48);
      const sh = 92;
      // Central H
      rect(ctx, cx - R(sw / 2), cy, sw, 2, col);
      rect(ctx, cx - R(sw / 2), cy - R(sh / 2), 2, sh, col);
      rect(ctx, cx + R(sw / 2) - 2, cy - R(sh / 2), 2, sh, col);
      // 4 leaf H's
      for (const [lx, ly] of [
        [cx - R(sw / 2), cy - R(sh / 2)],
        [cx + R(sw / 2) - 2, cy - R(sh / 2)],
        [cx - R(sw / 2), cy + R(sh / 2)],
        [cx + R(sw / 2) - 2, cy + R(sh / 2)],
      ] as const) {
        rect(ctx, lx - 18, ly, 36, 1, col);
        rect(ctx, lx - 18, ly - 10, 1, 20, pulse ? '#ffffff' : '#555555');
        rect(ctx, lx + 18, ly - 10, 1, 20, pulse ? '#ffffff' : '#555555');
      }
      rect(ctx, cx - 3, cy - 3, 6, 6, '#ffffff');
      break;
    }

    case 'cmos': {
      // Giant 4-color lithography mask cross-section (teal diffusion, violet poly, copper metal, white vias).
      rect(ctx, 20, cy - 38, W - 40, 22, '#24989c');
      rect(ctx, 20, cy + 16, W - 40, 22, '#24989c');
      for (let x = 44; x < W - 44; x += 36) {
        rect(ctx, x, cy - 52, 8, 104, '#9448d4');
        rect(ctx, x + 2, cy - 28, 4, 4, '#ffffff');
        rect(ctx, x + 2, cy + 24, 4, 4, '#ffffff');
      }
      rect(ctx, 0, cy - 6, W, 12, '#e88438');
      break;
    }

    case 'litho': {
      // 13.5nm EUV Fresnel Diffraction Target (concentric violet/white rings) + crystal lattice dots.
      for (const rad of [74, 56, 40, 26, 14]) {
        ring(ctx, cx, cy, rad, rad <= 26 ? '#aaaaaa' : '#555555');
      }
      disc(ctx, cx, cy, 4, '#ffffff');
      // Subtle wafer alignment crosshair
      rect(ctx, cx, cy - 82, 1, 164, '#555555');
      rect(ctx, cx - 82, cy, 164, 1, '#555555');
      break;
    }

    case 'bandgap': {
      // Twin Energy-Band Horizon (Conduction above, Valence below) + translucent quantum barrier wall!
      rect(ctx, 0, cy - 52, W, 14, '#555555');
      rect(ctx, 0, cy - 38, W, 1, '#aaaaaa');
      rect(ctx, 0, cy + 38, W, 14, '#555555');
      rect(ctx, 0, cy + 38, W, 1, '#aaaaaa');
      // Tall quantum potential barrier wall in the center
      rect(ctx, cx - 4, cy - 36, 8, 72, '#555555');
      frame(ctx, cx - 4, cy - 36, 8, 72, '#aaaaaa');
      // Occasional tunneling wave packet passing straight through the barrier
      const q = mod(t * 0.35, 1);
      const wx = R(cx - 80 + q * 160);
      rect(ctx, wx - 4, cy - 1, 8, 2, q > 0.5 ? '#ffffff' : '#aaaaaa');
      break;
    }

    case 'landauer': {
      // The Thermodynamic Event Horizon: vast void + faint bottom entropy arc + rare full-screen cosmic ray!
      const base = R(b.bottom - 14);
      ring(ctx, cx, base + 44, 110, '#555555');
      ring(ctx, cx, base + 44, 82, '#555555');
      // Rare diagonal cosmic-ray track slicing across the abyss
      const slot = Math.floor(t * 0.45);
      if (t > 0 && hash(slot * 47 + 3) > 0.65) {
        const x0 = R(hash(slot * 13) * W * 0.6);
        const y0 = R(b.top + 20);
        line(ctx, x0, y0, x0 + 96, y0 + 96, '#aaaaaa');
        rect(ctx, x0 + 94, y0 + 94, 4, 4, '#ffffff');
      }
      break;
    }
  }
}
