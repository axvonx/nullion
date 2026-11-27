import { ent, TAU, type EntityDef, type Pen } from './kit';

/**
 * v4 entity libraries, lower layers: Drivers (CGA 4), Firmware and Ring −1 (green phosphor, drawn in greys
 * 00/55/AA/FF which map onto its four levels), Ring −2 (five greys 00/40/80/C0/FF) and Ring −3 (1-bit).
 */

const R = Math.round;
const mod = (n: number, m: number) => ((n % m) + m) % m;

// ---------------------------------------------------------------------------------------------
// Drivers (CGA 4: black, cyan, magenta, white): the board, its parts and its plugs.

const K = '#000000';
const CY = '#55ffff';
const MG = '#ff55ff';
const W = '#ffffff';

function legs(p: Pen, x: number, y: number, w: number, h: number) {
  for (let k = 2; k < w - 1; k += 2) {
    p.r(x + k, y - 2, 1, 2, CY);
    p.r(x + k, y + h, 1, 2, CY);
  }
}

export const DRIVERS: EntityDef[] = [
  ent('dr-chip', [[12, 10], [17, 10]], (p, w) => {
    legs(p, 0, 2, w, 6);
    p.r(0, 2, w, 6, MG);
    p.r(1, 3, w - 2, 4, K);
    p.p(2, 4, W);
  }),
  ent(
    'dr-ribbon',
    [[26, 10]],
    (p) => {
      const jog = p.h(0) > 0.5 ? 3 : -3;
      const col = p.h(1) > 0.7 ? MG : CY;
      const y0 = jog > 0 ? 1 : 4;
      for (let k = 0; k < 3; k++) {
        p.r(0, y0 + k * 2, 12, 1, col);
        for (let j = 0; j < 3; j++) p.p(12 + j, y0 + k * 2 + Math.sign(jog) * j, col);
        p.r(15, y0 + k * 2 + jog, 11, 1, col);
      }
    },
    {
      anim: (p, w, _h, _v, t) => {
        const jog = p.h(0) > 0.5 ? 3 : -3;
        const y0 = jog > 0 ? 1 : 4;
        const x = R(mod(t * 18, w));
        p.r(x, y0 + 2 + (x > 12 ? jog : 0), 2, 1, W);
      },
    },
  ),
  ent(
    'dr-irq',
    [[12, 18]],
    (p) => {
      legs(p, 0, 10, 12, 6);
      p.r(0, 10, 12, 6, MG);
      p.r(1, 11, 10, 4, K);
      p.r(2, 12, 3, 1, CY);
    },
    {
      anim: (p, _w, _h, _v, t) => {
        const slot = Math.floor(t * 3);
        if ((slot * 7 + Math.floor(p.h(2) * 5)) % 6 !== 0) return;
        let x = 6;
        let y = 8;
        while (y > 0) {
          const nx = x + (((slot * 13 + y * 7) % 5) - 2);
          p.l(x, y, nx, y - 3, W);
          x = nx;
          y -= 3;
        }
      },
    },
  ),
  ent('dr-connector', [[14, 8]], (p) => {
    p.r(0, 0, 14, 8, K);
    p.r(1, 1, 12, 6, W);
    p.r(2, 2, 10, 4, K);
    for (let k = 0; k < 4; k++) p.p(3 + k * 2, 3, CY);
    for (let k = 0; k < 3; k++) p.p(4 + k * 2, 4, CY);
  }),
  ent('dr-caps', [[13, 10]], (p) => {
    const n = 2 + Math.floor(p.h(0) * 2);
    for (let k = 0; k < n; k++) {
      const x = k * 4 + 1;
      const h = 5 + R(p.h(k + 1) * 2);
      p.r(x, 8 - h, 3, h, CY);
      p.r(x, 8 - h, 3, 1, W);
      p.p(x, 8, W);
      p.p(x + 2, 8, W);
      p.p(x, 9, W);
      p.p(x + 2, 9, W);
    }
  }),
  ent('dr-usb', [[18, 8]], (p) => {
    p.r(0, 3, 6, 2, MG);
    p.r(6, 1, 6, 6, W);
    p.r(12, 2, 6, 4, W);
    p.r(13, 3, 4, 2, K);
    p.p(14, 3, CY);
    p.p(16, 3, CY);
    p.r(8, 3, 2, 2, CY);
  }),
  ent('dr-pcie', [[28, 8]], (p, w) => {
    p.r(0, 0, w, 6, K);
    p.frame(0, 0, w, 6, CY);
    p.r(1, 2, w - 2, 2, MG);
    p.r(9, 1, 1, 4, CY);
    for (let x = 2; x < w - 2; x += 2) p.p(x, 3, W);
    p.r(w - 3, 6, 2, 2, CY);
    p.r(1, 6, 2, 2, CY);
  }),
  ent(
    'dr-dma',
    [[24, 9]],
    (p, w) => {
      p.r(0, 6, w, 2, W);
      p.r(0, 8, 2, 1, CY);
      p.r(w - 2, 8, 2, 1, CY);
    },
    {
      anim: (p, w, _h, _v, t) => {
        const s = mod(t * 8, 6);
        for (let k = 0; k < 4; k++) {
          const x = R(k * 6 + s);
          if (x < w - 3) p.r(x, 3, 3, 3, k % 2 ? CY : MG);
        }
        for (let x = R(s) % 3; x < w; x += 3) p.p(x, 7, K);
      },
    },
  ),
  ent(
    'dr-nic',
    [[19, 11]],
    (p) => {
      p.r(0, 0, 15, 8, CY);
      p.r(1, 1, 13, 6, K);
      p.r(15, 1, 4, 6, W);
      p.r(16, 2, 2, 4, K);
      p.r(3, 3, 5, 3, MG);
      for (let x = 1; x < 15; x += 2) p.p(x, 9, CY);
      p.r(0, 8, 15, 1, MG);
    },
    {
      anim: (p, _w, _h, _v, t) => {
        p.p(10, 3, Math.floor(t * 9) % 3 ? W : K);
        p.p(12, 3, Math.floor(t * 1.7) % 2 ? CY : K);
      },
    },
  ),
  ent(
    'dr-gpu',
    [[24, 12]],
    (p) => {
      p.r(0, 0, 24, 10, MG);
      p.r(1, 1, 22, 8, K);
      p.r(0, 10, 16, 2, CY);
      p.disc(8, 5, 3, W);
      p.disc(16, 5, 3, W);
    },
    {
      anim: (p, _w, _h, _v, t) => {
        for (const cx of [8, 16]) {
          p.disc(cx, 5, 2, K);
          for (let k = 0; k < 3; k++) {
            const a = t * 9 + (k * TAU) / 3;
            p.p(cx + R(Math.cos(a) * 2), 5 + R(Math.sin(a) * 2), CY);
          }
          p.p(cx, 5, W);
        }
      },
    },
  ),
  ent(
    'dr-disk',
    [[15, 15]],
    (p) => {
      p.r(0, 0, 15, 15, CY);
      p.r(1, 1, 13, 13, K);
      p.disc(7, 7, 5, W);
      p.disc(7, 7, 1, K);
    },
    {
      anim: (p, _w, _h, _v, t) => {
        const a = t * 6;
        p.p(7 + R(Math.cos(a) * 3), 7 + R(Math.sin(a) * 3), MG);
        const arm = 0.5 + Math.sin(t * 1.3) * 0.25;
        p.l(13, 13, 13 - Math.cos(arm) * 7, 13 - Math.sin(arm) * 7, MG);
      },
    },
  ),
  ent('dr-keys', [[18, 11]], (p) => {
    for (let r = 0; r < 3; r++)
      for (let k = 0; k < 4 - (r === 2 ? 1 : 0); k++) {
        const x = k * 4 + r;
        const wide = r === 2 && k === 1;
        p.r(x, r * 4, wide ? 7 : 3, 3, W);
        p.r(x, r * 4 + 2, wide ? 7 : 3, 1, CY);
        if (wide) k++;
      }
  }),
  ent('dr-db9', [[15, 8]], (p) => {
    p.r(0, 0, 15, 8, W);
    p.r(2, 1, 11, 6, MG);
    p.r(3, 2, 9, 4, K);
    for (let k = 0; k < 5; k++) p.p(3 + k * 2, 3, CY);
    for (let k = 0; k < 4; k++) p.p(4 + k * 2, 4, CY);
    p.p(1, 3, K);
    p.p(13, 3, K);
  }),
  ent('dr-jumpers', [[13, 8]], (p) => {
    // White-framed 2x5 pin-header shroud with magenta bridging caps.
    p.r(0, 0, 13, 8, W);
    p.r(1, 1, 11, 6, K);
    for (let k = 0; k < 5; k++) {
      p.p(2 + k * 2, 2, CY);
      p.p(2 + k * 2, 5, CY);
    }
    const j = Math.floor(p.h(0) * 4);
    p.r(2 + j * 2, 2, 1, 4, MG);
    p.r(2 + ((j + 2) % 5) * 2, 2, 1, 4, MG);
  }),
  ent('dr-heatsink', [[15, 11]], (p) => {
    p.r(0, 8, 15, 3, CY);
    for (let x = 0; x < 15; x += 2) p.r(x, 0, 1, 8, W);
  }),
  ent('dr-rj45', [[11, 11]], (p) => {
    p.r(0, 0, 11, 11, W);
    p.r(1, 2, 9, 7, K);
    p.r(3, 8, 5, 3, K);
    for (let x = 2; x < 9; x++) p.p(x, 3, CY);
    p.p(1, 0, MG);
    p.p(9, 0, CY);
  }),
  ent(
    'dr-scope',
    [[19, 15]],
    (p) => {
      p.r(0, 0, 19, 13, W);
      p.r(1, 1, 13, 11, K);
      for (let k = 0; k < 3; k++) p.disc(16, 3 + k * 4, 1, MG);
      p.r(2, 13, 2, 2, W);
      p.r(15, 13, 2, 2, W);
      for (let x = 2; x < 14; x += 3) p.p(x, 6, MG);
    },
    {
      anim: (p, _w, _h, _v, t) => {
        let py = 6;
        for (let x = 2; x < 13; x++) {
          const y = 6 + R(Math.sin(x * 0.9 - t * 5) * 3);
          p.l(x - 1, py, x, y, CY);
          py = y;
        }
      },
      noFlip: true,
    },
  ),
  ent('dr-dip', [[15, 8]], (p) => {
    p.r(0, 0, 15, 8, MG);
    for (let k = 0; k < 6; k++) {
      p.r(1 + k * 2 + (k > 2 ? 1 : 0), 1, 1, 6, K);
      p.p(1 + k * 2 + (k > 2 ? 1 : 0), p.h(k) > 0.5 ? 1 : 5, W);
    }
  }),
  ent(
    'dr-fwload',
    [[19, 13]],
    (p) => {
      // Programmer pod connected by a ribbon cable to a ZIF-socketed flash chip.
      p.r(0, 2, 5, 7, W);
      p.r(1, 3, 3, 5, K);
      p.r(2, 4, 1, 1, MG);
      // Connected programming cable
      p.r(5, 4, 3, 1, CY);
      p.r(5, 6, 3, 1, CY);
      // Target chip with legs
      legs(p, 8, 3, 11, 6);
      p.r(8, 3, 11, 6, MG);
      p.r(9, 4, 9, 4, K);
    },
    {
      anim: (p, _w, _h, _v, t) => {
        const q = mod(t * 0.9, 1);
        const pulseX = 5 + (Math.floor(t * 9) % 3);
        p.p(pulseX, 4, W);
        p.r(10, 5, Math.max(1, R(q * 7)), 2, CY);
      },
    },
  ),
  ent(
    'dr-speaker',
    [[14, 12]],
    (p) => {
      p.r(0, 3, 3, 6, W);
      p.l(3, 3, 6, 0, W);
      p.l(3, 8, 6, 11, W);
      p.r(6, 0, 1, 12, W);
      p.r(3, 4, 3, 4, CY);
    },
    {
      anim: (p, _w, _h, _v, t) => {
        const k = Math.floor(t * 4) % 3;
        for (let j = 0; j <= k; j++) {
          const x = 8 + j * 2;
          p.r(x, 4 - j, 1, 4 + j * 2, j === k ? W : CY);
        }
      },
    },
  ),
  ent('dr-mouse', [[9, 14]], (p) => {
    p.r(4, 0, 1, 3, CY);
    p.r(1, 3, 7, 10, W);
    p.r(2, 2, 5, 12, W);
    p.r(4, 3, 1, 4, K);
    p.r(1, 7, 7, 1, K);
    p.r(4, 4, 1, 2, MG);
  }),
];

export const DRIVERS_ANCHORS: EntityDef[] = [
  ent(
    'dr-backplane',
    [[66, 48]],
    (p) => {
      // A backplane with three cards seated in it, edge connectors glinting.
      p.r(0, 40, 66, 8, CY);
      p.r(0, 40, 66, 1, W);
      for (let k = 0; k < 4; k++) {
        const x = 3 + k * 16;
        p.r(x, 36, 12, 5, K);
        p.frame(x, 36, 12, 5, MG);
        if (k === 3) continue;
        const h = 22 + R(p.h(k) * 10);
        p.r(x + 1, 37 - h, 10, h, k === 1 ? MG : CY);
        p.r(x + 2, 38 - h, 8, h - 3, K);
        for (let y = 40 - h; y < 34; y += 4) p.r(x + 3, y, 6, 2, k === 1 ? CY : MG);
        p.r(x + 1, 37 - h, 10, 1, W);
      }
    },
    {
      anim: (p, _w, _h, _v, t) => {
        for (let k = 0; k < 3; k++) p.p(4 + k * 16, 34, Math.floor(t * (2 + k)) % 2 ? W : K);
      },
      noFlip: true,
    },
  ),
  ent(
    'dr-hdd',
    [[46, 38]],
    (p) => {
      p.r(0, 0, 46, 38, W);
      p.r(1, 1, 44, 36, K);
      p.disc(17, 18, 14, CY);
      p.disc(17, 18, 13, '#55aaaa');
      p.ring(17, 18, 9, CY);
      p.ring(17, 18, 5, CY);
      p.disc(17, 18, 3, W);
      p.disc(38, 31, 3, MG);
      for (const [x, y] of [[3, 3], [42, 3], [3, 34], [42, 34]] as const) p.p(x, y, W);
    },
    {
      anim: (p, _w, _h, _v, t) => {
        const a = t * 5;
        p.p(17 + R(Math.cos(a) * 11), 18 + R(Math.sin(a) * 11), W);
        p.p(17 + R(Math.cos(a + 2) * 7), 18 + R(Math.sin(a + 2) * 7), W);
        const arm = 2.4 + Math.sin(t * 1.1) * 0.3;
        p.l(38, 31, 38 + Math.cos(arm) * 20, 31 - Math.sin(arm) * 15, MG);
        p.l(39, 31, 39 + Math.cos(arm) * 20, 31 - Math.sin(arm) * 15, W);
      },
      noFlip: true,
    },
  ),
];

// ---------------------------------------------------------------------------------------------
// Firmware (green phosphor): drawn in greys 00/55/AA/FF, which land on its four levels.

const G0 = '#000000';
const G1 = '#555555';
const G2 = '#aaaaaa';
const G3 = '#ffffff';

/** A seven-segment digit, 3×5. */
function seg(p: Pen, x: number, y: number, d: number, col: string) {
  const SEGS = [0x3f, 0x06, 0x5b, 0x4f, 0x66, 0x6d, 0x7d, 0x07, 0x7f, 0x6f, 0x77, 0x7c, 0x39, 0x5e, 0x79, 0x71];
  const m = SEGS[d & 15]!;
  if (m & 1) p.r(x, y, 3, 1, col);
  if (m & 2) p.r(x + 2, y, 1, 3, col);
  if (m & 4) p.r(x + 2, y + 2, 1, 3, col);
  if (m & 8) p.r(x, y + 4, 3, 1, col);
  if (m & 16) p.r(x, y + 2, 1, 3, col);
  if (m & 32) p.r(x, y, 1, 3, col);
  if (m & 64) p.r(x, y + 2, 3, 1, col);
}

export const FIRMWARE: EntityDef[] = [
  ent('fw-drawers', [[22, 12]], (p) => {
    p.r(0, 0, 22, 12, G1);
    for (let r = 0; r < 2; r++)
      for (let k = 0; k < 3; k++) {
        p.r(1 + k * 7, 1 + r * 5, 6, 4, G0);
        p.r(3 + k * 7, 3 + r * 5, 2, 1, p.h(r * 3 + k) > 0.8 ? G3 : G2);
      }
  }),
  ent(
    'fw-vault',
    [[17, 17]],
    (p) => {
      p.disc(8, 8, 7, G2);
      p.disc(8, 8, 5, G1);
      const a = p.h(1) * TAU;
      for (let k = 0; k < 3; k++) p.l(8, 8, 8 + Math.cos(a + (k * TAU) / 3) * 3, 8 + Math.sin(a + (k * TAU) / 3) * 3, G3);
      p.r(7, 7, 3, 3, G3);
      p.r(15, 6, 2, 5, G2);
    },
    {
      anim: (p, _w, _h, _v, t) => {
        if (t === 0) return;
        const q = mod(t * 0.45, 1);
        p.ring(8, 8, 8 + R(q * 8), q < 0.5 ? G2 : G1);
      },
      noFlip: true,
    },
  ),
  ent(
    'fw-post',
    [[18, 10]],
    (p) => {
      p.r(0, 0, 18, 10, G1);
      p.r(1, 1, 16, 8, G0);
    },
    {
      text: true,
      cap: 1,
      weight: 0.6,
      anim: (p, _w, _h, _v, t) => {
        const code = 0x10 + ((Math.floor(t * 0.5) * 37 + Math.floor(p.h(0) * 200)) % 0xe0);
        p.t(code.toString(16).toUpperCase(), 3, 8, G3);
      },
    },
  ),
  ent('fw-flash', [[11, 8]], (p) => {
    for (let k = 1; k < 10; k += 2) {
      p.p(k, 0, G2);
      p.p(k, 7, G2);
    }
    p.r(0, 1, 11, 6, G1);
    p.r(0, 1, 11, 1, G2);
    p.p(1, 2, G3);
  }),
  ent('fw-plate', [[14, 15]], (p) => {
    // Unmistakable BIOS hardware padlock silhouette (thick U-shackle + solid body + bold keyhole).
    p.r(4, 0, 6, 2, G2);
    p.r(3, 1, 2, 5, G2);
    p.r(9, 1, 2, 5, G2);
    p.r(1, 6, 12, 9, G2);
    p.r(2, 7, 10, 7, G1);
    p.r(1, 6, 12, 1, G3);
    p.disc(7, 9, 1, G0);
    p.r(6, 10, 2, 3, G0);
  }),
  ent('fw-cmos', [[11, 11]], (p) => {
    p.disc(5, 5, 5, G2);
    p.disc(5, 5, 4, G1);
    p.r(3, 5, 5, 1, G3);
    p.r(5, 3, 1, 5, G3);
    p.r(0, 0, 2, 2, G2);
  }),
  ent(
    'fw-setup',
    [[36, 15]],
    (p) => {
      p.r(0, 0, 36, 15, G1);
      p.r(1, 1, 34, 13, G0);
      p.r(1, 1, 34, 5, G2);
      p.t('Main', 3, 6, G0);
      p.t('Boot', 3, 13, G2);
    },
    { text: true, cap: 1, weight: 0.5 },
  ),
  ent('fw-bootorder', [[16, 14]], (p) => {
    // Chunky boot-drive bay with disk slot, eject button, and platter hub.
    p.r(0, 2, 16, 10, G2);
    p.r(1, 3, 14, 8, G1);
    p.r(0, 2, 16, 1, G3);
    p.r(2, 5, 10, 2, G0);
    p.r(13, 5, 2, 2, G3);
    p.r(3, 8, 5, 2, G0);
    p.r(10, 8, 3, 2, G2);
    p.r(2, 12, 3, 2, G2);
    p.r(11, 12, 3, 2, G2);
  }),
  ent('fw-dipsw', [[12, 8]], (p) => {
    p.r(1, 1, 10, 6, G2);
    for (let k = 0; k < 4; k++) {
      p.r(2 + k * 2, 2, 1, 4, G0);
      p.r(2 + k * 2, p.h(k) > 0.5 ? 2 : 4, 1, 2, G3);
    }
  }),
  ent(
    'fw-fan',
    [[13, 13]],
    (p) => {
      p.r(0, 0, 13, 13, G1);
      p.disc(6, 6, 5, G0);
      for (const [x, y] of [[1, 1], [11, 1], [1, 11], [11, 11]] as const) p.p(x, y, G2);
    },
    {
      anim: (p, _w, _h, _v, t) => {
        for (let k = 0; k < 4; k++) {
          const a = t * 7 + (k * TAU) / 4;
          p.l(6, 6, 6 + Math.cos(a) * 4, 6 + Math.sin(a) * 4, G2);
        }
        p.p(6, 6, G3);
      },
    },
  ),
  ent('fw-capsule', [[15, 11]], (p) => {
    // Sealed firmware ROM cartridge with signature lock emblem and edge-connector teeth.
    p.r(0, 0, 15, 9, G2);
    p.r(1, 1, 13, 7, G1);
    p.r(2, 2, 11, 5, G0);
    // Lock/signature badge inside cartridge
    p.r(6, 2, 3, 2, G2);
    p.r(5, 4, 5, 3, G3);
    p.p(7, 5, G0);
    // Bottom edge-connector teeth
    for (let x = 2; x < 13; x += 2) p.r(x, 9, 1, 2, G2);
  }),
  ent('fw-spiclip', [[15, 13]], (p) => {
    for (let k = 1; k < 9; k += 2) {
      p.p(3 + k, 5, G2);
      p.p(3 + k, 12, G2);
    }
    p.r(3, 6, 10, 6, G1);
    p.r(2, 2, 12, 5, G2);
    p.r(2, 2, 12, 1, G3);
    p.r(6, 0, 1, 2, G3);
    p.r(9, 0, 1, 2, G2);
  }),
  ent('fw-optrom', [[19, 11]], (p) => {
    p.r(0, 0, 19, 8, G1);
    p.r(1, 1, 17, 6, G0);
    p.r(2, 2, 6, 4, G2);
    p.r(10, 2, 3, 2, G1);
    p.r(14, 2, 3, 3, G1);
    for (let x = 1; x < 18; x += 2) p.p(x, 9, G2);
    p.r(0, 8, 19, 1, G2);
  }),
  ent(
    'fw-beeper',
    [[13, 10]],
    (p) => {
      p.disc(3, 5, 3, G1);
      p.disc(3, 5, 1, G2);
    },
    {
      anim: (p, _w, _h, _v, t) => {
        const on = mod(t * 0.8, 1) < 0.35;
        if (!on) return;
        for (let j = 0; j < 3; j++) p.r(7 + j * 2, 4 - j, 1, 3 + j * 2, j === 0 ? G3 : G2);
      },
    },
  ),
  ent('fw-reset', [[11, 11]], (p) => {
    p.r(0, 0, 11, 11, G1);
    p.disc(5, 5, 3, G2);
    p.disc(5, 4, 3, G3);
    p.r(4, 3, 3, 2, G2);
  }),
  ent(
    'fw-postcard',
    [[17, 12]],
    (p) => {
      p.r(0, 0, 17, 9, G1);
      p.r(1, 1, 11, 7, G0);
      for (let x = 1; x < 16; x += 2) p.p(x, 10, G2);
      p.r(0, 9, 17, 1, G2);
      p.r(13, 2, 2, 2, G2);
    },
    {
      anim: (p, _w, _h, _v, t) => {
        const code = (Math.floor(t * 1.5) * 29 + Math.floor(p.h(1) * 200)) & 0xff;
        seg(p, 2, 2, code >> 4, G3);
        seg(p, 7, 2, code & 15, G3);
      },
      noFlip: true,
    },
  ),
  ent('fw-acpi', [[15, 15]], (p) => {
    // Iconic circular ACPI power/standby medallion with IEC power glyph.
    p.disc(7, 7, 7, G2);
    p.disc(7, 7, 6, G0);
    p.ring(7, 7, 4, G3);
    p.r(5, 2, 5, 3, G0);
    p.r(7, 2, 1, 5, G3);
  }),
  ent(
    'fw-ucode',
    [[17, 13]],
    (p) => {
      // Ceramic DIP EPROM chip with protruding legs and circular quartz UV-erase window.
      for (let x = 2; x <= 14; x += 3) {
        p.r(x, 0, 2, 2, G2);
        p.r(x, 11, 2, 2, G2);
      }
      p.r(0, 2, 17, 9, G1);
      p.r(0, 2, 17, 1, G2);
      p.r(0, 5, 2, 3, G0); // pin-1 notch
      p.disc(9, 6, 3, G2);
      p.disc(9, 6, 2, G0);
    },
    {
      anim: (p, _w, _h, _v, t) => {
        const on = Math.floor(t * 2.5) % 2 === 0;
        p.r(8, 5, 2, 2, on ? G3 : G1);
      },
      noFlip: true,
    },
  ),
  ent('fw-nvram', [[19, 12]], (p) => {
    p.r(0, 11, 19, 1, G2);
    for (let k = 0; k < 4; k++) {
      const x = k * 5;
      const fill = 2 + Math.floor(p.h(k) * 5);
      p.r(x, 3, 4, 8, G1);
      p.r(x + 1, 10 - fill, 2, fill, G2);
      p.r(x, 2, 4, 1, G3);
    }
  }),
  ent('fw-floppy', [[11, 11]], (p) => {
    p.r(0, 0, 11, 11, G1);
    p.r(3, 0, 5, 4, G2);
    p.r(6, 1, 1, 2, G0);
    p.r(2, 6, 7, 5, G3);
    p.r(3, 7, 5, 1, G1);
    p.p(0, 10, G0);
  }),
  ent('fw-key', [[15, 8]], (p) => {
    p.disc(3, 3, 2, G2);
    p.p(3, 3, G0);
    p.r(5, 3, 9, 1, G2);
    p.r(10, 4, 1, 2, G2);
    p.r(12, 4, 1, 3, G2);
    p.p(2, 2, G3);
  }),
];

export const FIRMWARE_ANCHORS: EntityDef[] = [
  ent(
    'fw-bigvault',
    [[52, 52]],
    (p) => {
      p.r(0, 0, 52, 52, G1);
      p.frame(0, 0, 52, 52, G2);
      for (const [x, y] of [[3, 3], [48, 3], [3, 48], [48, 48]] as const) p.r(x, y, 1, 1, G3);
      p.disc(26, 26, 21, G2);
      p.disc(26, 26, 19, G1);
      p.disc(26, 26, 9, G2);
      p.disc(26, 26, 7, G0);
      for (let k = 0; k < 12; k++) {
        const a = (k * TAU) / 12;
        p.r(26 + R(Math.cos(a) * 15) - 1, 26 + R(Math.sin(a) * 15) - 1, 2, 2, G2);
      }
      p.r(44, 18, 6, 4, G2);
      p.r(44, 30, 6, 4, G2);
    },
    {
      anim: (p, _w, _h, _v, t) => {
        const a = t * 0.4;
        for (let k = 0; k < 3; k++) {
          const b = a + (k * TAU) / 3;
          p.l(26, 26, 26 + Math.cos(b) * 7, 26 + Math.sin(b) * 7, G3);
        }
        p.r(25, 25, 3, 3, G3);
        if (t > 0) {
          const q = mod(t * 0.35, 1);
          p.ring(26, 26, 22 + R(q * 6), q < 0.5 ? G3 : G2);
        }
      },
      noFlip: true,
    },
  ),
  ent(
    'fw-romcab',
    [[40, 56]],
    (p) => {
      p.r(0, 0, 40, 56, G1);
      p.r(0, 0, 40, 1, G2);
      p.r(2, 3, 36, 10, G0);
      for (let r = 0; r < 4; r++) {
        const y = 16 + r * 9;
        p.r(2, y, 36, 8, G0);
        for (let k = 1; k < 34; k += 3) {
          p.p(3 + k, y, G2);
          p.p(3 + k, y + 7, G2);
        }
        p.r(4, y + 1, 32, 6, G1);
        p.r(4, y + 1, 32, 1, G2);
      }
    },
    {
      anim: (p, _w, _h, _v, t) => {
        const slot = Math.floor(t * 3);
        for (let k = 0; k < 8; k++) p.r(4 + k * 4, 6, 2, 3, (k * 5 + slot) % 4 === 0 ? G3 : (k + slot) % 3 ? G1 : G2);
      },
      noFlip: true,
    },
  ),
];

// ---------------------------------------------------------------------------------------------
// Ring −1 (green phosphor): the hypervisor's house of mirrors. Twins, nests, clones and gates.

function miniWorld(p: Pen, x: number, y: number, w: number, h: number, flip: boolean) {
  p.r(x, y, w, h, G0);
  for (let k = 0; k + 1 < w; k += 2) {
    const kk = flip ? w - 2 - k : k;
    const th = 1 + R((h - 3) * p.h(kk));
    p.r(x + k, y + h - th, 1, th, G1);
  }
  p.r(flip ? x + w - 5 : x + 1, y + 1, 4, 2, G2);
}

export const RING1: EntityDef[] = [
  ent(
    'r1-mirror',
    [[24, 10]],
    (p) => {
      for (let side = 0; side < 2; side++) {
        const mx = side * 13;
        p.r(mx, 0, 11, 10, G1);
        p.r(mx, 0, 11, 1, G3);
        miniWorld(p, mx + 1, 1, 9, 8, side === 1);
      }
    },
    {
      anim: (p, _w, _h, _v, t) => {
        if (Math.floor(t * 1.6) % 2) return;
        p.r(5, 5, 1, 2, G3);
        p.r(18, 5, 1, 2, G3);
      },
    },
  ),
  ent(
    'r1-tunnel',
    [[20, 14]],
    (p) => {
      const shades = [G3, G2, G1];
      for (let k = 0; k < 3; k++) {
        const w = 18 - k * 5;
        const h = 12 - k * 3;
        const fx = 1 + R((18 - w) / 2);
        const fy = 1 + R((12 - h) / 2);
        p.r(fx - 1, fy - 1, w + 2, h + 2, shades[k]!);
        p.r(fx, fy, w, h, G0);
      }
    },
    {
      anim: (p, _w, _h, _v, t) => {
        const g = mod(t * 4, 30);
        if (g < 18) p.p(1 + g, 0, G3);
      },
    },
  ),
  ent(
    'r1-tag',
    [[22, 10]],
    (p) => {
      p.box(0, 0, 22, 10, G0, G1);
      p.t(`vm${Math.floor(p.h(0) * 4)}`, 2, 8, G2);
    },
    { text: true, cap: 1, weight: 0.5 },
  ),
  ent(
    'r1-glass',
    [[14, 16]],
    (p) => {
      // Jagged floating mirror shard silhouette (breaks rectangular monotony in green phosphor).
      p.l(6, 0, 13, 5, G3);
      p.l(13, 5, 9, 15, G2);
      p.l(9, 15, 1, 10, G2);
      p.l(1, 10, 6, 0, G3);
      for (let y = 2; y <= 13; y++) {
        const x0 = y < 10 ? 6 - R(((y - 1) * 5) / 9) : 1 + R(((y - 10) * 8) / 5);
        const x1 = y < 5 ? 6 + R((y * 7) / 5) : 13 - R(((y - 5) * 4) / 10);
        if (x1 > x0 + 1) p.r(x0 + 1, y, x1 - x0 - 1, 1, G1);
      }
      p.l(5, 3, 9, 6, G3);
      p.l(4, 7, 8, 10, G2);
    },
    {
      anim: (p, _w, _h, _v, t) => {
        const k = Math.floor(mod(t * 2.4, 8));
        if (k < 4) p.r(5 + k, 4 + k * 2, 2, 1, G3);
      },
    },
  ),
  ent('r1-bubble', [[15, 15]], (p) => {
    p.ring(7, 7, 7, G2);
    p.disc(7, 7, 6, G0);
    for (let x = 2; x < 13; x += 2) {
      const th = 1 + R(p.h(x) * 4);
      p.r(x, 11 - th, 1, th, G1);
    }
    p.r(2, 11, 11, 1, G1);
    p.r(4, 3, 2, 1, G3);
  }),
  ent('r1-ept', [[17, 13]], (p) => {
    for (let r = 0; r < 3; r++)
      for (let k = 0; k < 2; k++) {
        p.r(k * 10, r * 4 + 1, 7, 3, G1);
        p.r(k * 10 + 1, r * 4 + 2, 3, 1, G2);
      }
    for (let r = 0; r < 3; r++) {
      const to = Math.floor(p.h(r) * 3);
      p.l(7, r * 4 + 2, 9, to * 4 + 2, G3);
    }
  }),
  ent('r1-vcpu', [[11, 11]], (p) => {
    for (let k = 2; k < 10; k += 2) {
      p.p(k, 0, G2);
      p.p(k, 10, G2);
      p.p(0, k, G2);
      p.p(10, k, G2);
    }
    p.r(1, 1, 9, 9, G1);
    p.r(2, 2, 7, 7, G0);
    p.l(3, 3, 5, 7, G3);
    p.l(7, 3, 5, 7, G3);
  }),
  ent('r1-vmcs', [[18, 13]], (p) => {
    // Twin hypervisor masks (Host bright left, Guest mirrored right) — unmistakable silhouette.
    p.disc(5, 6, 5, G2);
    p.r(3, 4, 2, 2, G0);
    p.r(6, 4, 2, 2, G0);
    p.r(3, 8, 5, 1, G0);
    p.disc(12, 6, 5, G1);
    p.ring(12, 6, 5, G3);
    p.r(10, 4, 2, 2, G3);
    p.r(13, 4, 2, 2, G3);
    p.r(10, 8, 5, 1, G3);
  }),
  ent(
    'r1-trapdoor',
    [[15, 10]],
    (p) => {
      p.r(0, 6, 15, 4, G1);
      p.r(0, 6, 15, 1, G2);
      p.r(3, 7, 9, 3, G0);
    },
    {
      anim: (p, _w, _h, _v, t) => {
        const q = mod(t * 0.5, 1);
        const open = q < 0.2 ? q / 0.2 : q < 0.6 ? 1 : Math.max(0, 1 - (q - 0.6) / 0.2);
        const y = 7 - R(open * 6);
        p.l(3, 7, 11, y, G3);
        p.l(3, 8, 11, y + 1, G2);
      },
      noFlip: true,
    },
  ),
  ent(
    'r1-shadowpage',
    [[17, 11]],
    (p) => {
      // Unmistakable Hypervisor Eye / Surveillance Lens silhouette.
      p.l(0, 5, 5, 1, G3);
      p.l(5, 1, 11, 1, G3);
      p.l(11, 1, 16, 5, G3);
      p.l(0, 5, 5, 9, G2);
      p.l(5, 9, 11, 9, G2);
      p.l(11, 9, 16, 5, G2);
      p.disc(8, 5, 3, G1);
      p.ring(8, 5, 3, G2);
    },
    {
      anim: (p, _w, _h, _v, t) => {
        const dx = R(Math.sin(t * 1.1) * 2);
        p.r(7 + dx, 4, 2, 2, G3);
      },
      noFlip: true,
    },
  ),
  ent('r1-dolls', [[19, 14]], (p) => {
    // Three nested arched Matryoshka / hypervisor portal domes.
    p.r(0, 13, 19, 1, G3);
    for (const [rad, col] of [[9, G2], [6, G1], [3, G3]] as const) {
      for (let dy = -rad; dy <= 0; dy++) {
        const half = Math.floor(Math.sqrt(rad * rad - dy * dy));
        p.p(9 - half, 12 + dy, col);
        p.p(9 + half, 12 + dy, col);
      }
    }
    p.r(8, 10, 3, 3, G3);
  }),
  ent(
    'r1-mempress',
    [[13, 14]],
    (p) => {
      // Expanding Host/Guest memory bellows (replaces literal party balloon).
      p.r(1, 0, 11, 2, G2);
      p.r(1, 12, 11, 2, G2);
      p.r(5, 11, 3, 1, G1);
    },
    {
      anim: (p, _w, _h, _v, t) => {
        const squeeze = R((Math.sin(t * 1.4) * 0.5 + 0.5) * 3);
        const top = 2 + squeeze;
        const bot = 11 - squeeze;
        p.r(2, top, 9, Math.max(2, bot - top), G1);
        p.r(3, top + 1, 7, Math.max(1, bot - top - 2), G0);
        p.r(4, Math.floor((top + bot - 1) / 2), 5, 1, G3);
        p.r(1, top, 11, 1, G3);
      },
      noFlip: true,
    },
  ),
  ent(
    'r1-migrate',
    [[19, 10]],
    (p) => {
      p.r(8, 0, 10, 10, G2);
      p.r(9, 1, 8, 8, G0);
      miniWorld(p, 9, 1, 8, 8, false);
    },
    {
      anim: (p, _w, _h, _v, t) => {
        const off = Math.floor(t * 6) % 3;
        for (let k = 0; k < 3; k++) p.r(off + k, 2 + k * 3, 5 - k, 1, k === 1 ? G2 : G1);
      },
    },
  ),
  ent(
    'r1-snapshot',
    [[13, 11]],
    (p) => {
      p.r(0, 2, 13, 9, G1);
      p.r(1, 2, 11, 1, G2);
      p.r(2, 0, 4, 2, G1);
      p.disc(6, 6, 3, G2);
      p.disc(6, 6, 2, G0);
      p.p(5, 5, G3);
    },
    {
      anim: (p, _w, _h, _v, t) => {
        if (mod(t * 0.4, 1) > 0.06) return;
        p.r(9, 3, 3, 2, G3);
        p.glow(10, 4, 8, 'rgba(255,255,255,0.5)');
      },
    },
  ),
  ent(
    'r1-hypercall',
    [[15, 13]],
    (p) => {
      // Ring-crossing interrupt gate: pulse punches from Guest (top) across the barrier into Host (bottom).
      p.r(0, 6, 15, 2, G2);
      p.r(5, 6, 5, 2, G0);
      p.frame(2, 0, 11, 5, G1);
      p.frame(2, 9, 11, 4, G1);
    },
    {
      anim: (p, _w, _h, _v, t) => {
        const q = mod(t * 1.1, 1);
        const y = 2 + R(q * 8);
        p.r(6, y, 3, 2, G3);
        if (y >= 5 && y <= 7) {
          p.p(4, 6, G3);
          p.p(10, 6, G3);
        }
      },
      noFlip: true,
    },
  ),
  ent(
    'r1-vswitch',
    [[19, 9]],
    (p) => {
      p.r(0, 3, 19, 6, G1);
      p.r(0, 3, 19, 1, G2);
      for (let k = 0; k < 5; k++) p.r(1 + k * 4, 5, 2, 2, G0);
      for (let k = 0; k < 5; k++) p.r(1 + k * 4, 0, 1, 3, G1);
    },
    {
      anim: (p, _w, _h, _v, t) => {
        for (let k = 0; k < 5; k++) if ((Math.floor(t * 5) + k * 3) % 4 === 0) p.p(2 + k * 4, 5, G3);
      },
    },
  ),
  ent('r1-cage', [[17, 12]], (p) => {
    // Barred hypervisor quarantine cage holding a mini guest world.
    p.r(0, 0, 17, 12, G2);
    p.r(1, 1, 15, 10, G0);
    miniWorld(p, 2, 2, 13, 8, false);
    for (let x = 3; x < 15; x += 3) p.r(x, 1, 1, 10, G2);
    p.r(0, 0, 17, 1, G3);
  }),
  ent('r1-split', [[15, 13]], (p) => {
    p.r(0, 0, 15, 11, G2);
    p.r(1, 1, 6, 9, G0);
    p.r(8, 1, 6, 9, G0);
    miniWorld(p, 1, 1, 6, 9, false);
    miniWorld(p, 8, 1, 6, 9, true);
    p.r(6, 11, 3, 2, G1);
  }),
  ent('r1-iommu', [[13, 15]], (p) => {
    p.r(0, 2, 3, 13, G1);
    p.r(10, 2, 3, 13, G1);
    p.r(0, 0, 13, 3, G2);
    p.r(3, 3, 7, 12, G0);
    for (let y = 4; y < 15; y += 3) p.r(4, y, 5, 1, G1);
    p.p(6, 1, G3);
  }),
  ent('r1-clone', [[19, 9]], (p) => {
    for (const x of [0, 11]) {
      p.r(x, 0, 8, 9, G2);
      p.r(x + 1, 1, 6, 7, G0);
      p.r(x + 2, 2, 3, 2, G3);
      p.r(x + 2, 5, 4, 1, G1);
    }
    p.r(9, 3, 1, 1, G2);
    p.r(9, 5, 1, 1, G2);
  }),
  ent(
    'r1-timeslice',
    [[9, 13]],
    (p) => {
      p.r(0, 0, 9, 1, G2);
      p.r(0, 12, 9, 1, G2);
      p.l(1, 1, 7, 11, G1);
      p.l(7, 1, 1, 11, G1);
    },
    {
      anim: (p, _w, _h, _v, t) => {
        const q = mod(t * 0.3, 1);
        const top = R((1 - q) * 4);
        p.r(4 - R(top / 2), 2 + (4 - top), Math.max(1, top), Math.max(1, top), G2);
        p.r(3, 11 - R(q * 4), 3, R(q * 4), G2);
        if (q < 0.95) p.p(4, 7 + (Math.floor(t * 8) % 3), G3);
      },
      noFlip: true,
    },
  ),
];

export const RING1_ANCHORS: EntityDef[] = [
  ent(
    'r1-mirrorgate',
    [[62, 42]],
    (p) => {
      // Two big guest screens facing each other across a seam, each the other's reflection.
      for (let side = 0; side < 2; side++) {
        const x = side * 33;
        p.r(x, 0, 29, 36, G1);
        p.r(x, 0, 29, 1, G3);
        miniWorld(p, x + 2, 2, 25, 30, side === 1);
        p.r(x + 12, 36, 5, 4, G1);
        p.r(x + 8, 40, 13, 2, G2);
      }
      for (let y = 0; y < 42; y += 2) p.p(31, y, G2);
    },
    {
      anim: (p, _w, _h, _v, t) => {
        const blink = Math.floor(t * 1.6) % 2 === 0;
        if (blink) {
          p.r(10, 18, 2, 4, G3);
          p.r(50, 18, 2, 4, G3);
        }
        const g = mod(t * 6, 36);
        p.r(2, 2 + g, 25, 1, G1);
        p.r(35, 2 + g, 25, 1, G1);
      },
      noFlip: true,
    },
  ),
  ent(
    'r1-portal',
    [[46, 38]],
    (p) => {
      const shades = [G3, G2, G1, G2, G1];
      for (let k = 0; k < 5; k++) {
        const w = 46 - k * 9;
        const h = 38 - k * 7;
        const x = R((46 - w) / 2);
        const y = R((38 - h) / 2);
        p.r(x, y, w, h, shades[k]!);
        p.r(x + 1, y + 1, w - 2, h - 2, G0);
      }
    },
    {
      anim: (p, _w, _h, _v, t) => {
        // A guest falling inward through the nest.
        const q = mod(t * 0.35, 1);
        const k = q * 5;
        const w = 46 - k * 9;
        const h = 38 - k * 7;
        p.frame(R((46 - w) / 2), R((38 - h) / 2), R(w), R(h), G3);
      },
      noFlip: true,
    },
  ),
];

// ---------------------------------------------------------------------------------------------
// Ring −2 (five greys): System Management Mode, where time stops. Everything hangs mid-motion.

const K0 = '#000000';
const K1 = '#404040';
const K2 = '#808080';
const K3 = '#c0c0c0';
const K4 = '#ffffff';

const DEBRIS: string[][] = [
  ['kkkkkkk', 'kdddddk', 'kwwwwwk', 'kwsswwk', 'kwwwwwk', 'kkkkkkk'],
  ['kkkk', 'kdgk', 'kdwk', 'kdgk', 'kkkk'],
  [' k k ', 'kgggk', 'kgkgk', 'kgggk', ' k k '],
  [' kk ', 'kwwk', 'kwwk', 'kwwk', ' kk '],
  ['k    ', 'wk   ', 'wgk  ', 'wggk ', 'kkkkk'],
  ['k k k', 'kkkkk', 'kdwdk', 'kkkkk', 'k k k'],
];
const DEBRIS_PAL: Record<string, string> = { k: K1, w: K4, g: K3, d: K2, s: K1 };

/** Frozen-fall streak: a vertical trail above a falling thing. */
function streak(p: Pen, x: number, y0: number, len: number) {
  for (let j = 0; j < len; j++) p.p(x, y0 + j, j > len / 2 ? K2 : K1);
}

export const RING2: EntityDef[] = [
  ent(
    'r2-debris',
    [[8, 16]],
    (p) => {
      const rows = p.pick(DEBRIS, 0);
      streak(p, 3, 0, 8);
      rows.forEach((row, y) => {
        for (let x = 0; x < row.length; x++) if (row[x] !== ' ') p.p(x + 1, 9 + y, DEBRIS_PAL[row[x]!]!);
      });
    },
    { cap: 3 },
  ),
  ent('r2-clock', [[13, 13]], (p) => {
    p.disc(6, 6, 6, K2);
    p.disc(6, 6, 5, K1);
    for (let k = 0; k < 4; k++) p.p(6 + R(Math.cos((k * TAU) / 4) * 4), 6 + R(Math.sin((k * TAU) / 4) * 4), K3);
    const a = p.h(0) * TAU;
    p.l(6, 6, 6 + Math.cos(a) * 3, 6 + Math.sin(a) * 3, K3);
    p.l(6, 6, 6 + Math.cos(a * 7) * 4, 6 + Math.sin(a * 7) * 4, K4);
  }),
  ent('r2-shards', [[18, 14]], (p) => {
    for (let k = 0; k < 5; k++) {
      const sx = R(p.h(k) * 15) + 1;
      const sy = R(p.h(k + 9) * 8) + 4;
      streak(p, sx, sy - 4, 3);
      p.r(sx, sy, 2, 2, k % 2 ? K3 : K2);
      if (k === 2) p.p(sx + 2, sy, K4);
    }
  }),
  ent(
    'r2-tag',
    [[28, 10]],
    (p) => {
      p.box(0, 0, 28, 10, K0, K2);
      p.t(`SMI${Math.floor(p.h(0) * 9)}`, 2, 8, K3);
    },
    { text: true, cap: 1, weight: 0.4 },
  ),
  ent('r2-rain', [[11, 17]], (p) => {
    for (let k = 0; k < 6; k++) {
      const x = 1 + R(p.h(k) * 9);
      const y = R(p.h(k + 7) * 12);
      p.p(x, y, K2);
      p.r(x, y + 1, 1, 2, K3);
      p.p(x, y + 3, K4);
    }
  }),
  ent('r2-pendulum', [[13, 17]], (p) => {
    p.r(0, 0, 13, 1, K2);
    const a = 0.5 + p.h(0) * 0.4;
    const ex = 6 + R(Math.sin(a) * 10 * (p.h(1) > 0.5 ? 1 : -1));
    const ey = R(Math.cos(a) * 12) + 1;
    p.l(6, 1, Math.max(2, Math.min(10, ex)), ey, K2);
    p.disc(Math.max(2, Math.min(10, ex)), Math.min(14, ey + 1), 2, K3);
    for (let k = 1; k < 3; k++) p.p(Math.max(2, Math.min(10, ex)) - k * 2 * (ex > 6 ? 1 : -1), ey + 1 - k, K1);
  }),
  ent('r2-hourglass', [[9, 13]], (p) => {
    p.r(0, 0, 9, 1, K3);
    p.r(0, 12, 9, 1, K3);
    p.l(1, 1, 7, 11, K2);
    p.l(7, 1, 1, 11, K2);
    p.r(2, 2, 5, 2, K3);
    p.p(4, 6, K4);
    p.p(4, 8, K3);
    p.r(3, 10, 3, 2, K3);
  }),
  ent('r2-ghostgear', [[17, 13]], (p) => {
    for (let g = 0; g < 3; g++) {
      const cx = 4 + g * 4;
      const col = g === 2 ? K3 : g === 1 ? K1 : K1;
      p.ring(cx, 6, 4, col);
    }
    p.disc(12, 6, 3, K2);
    p.p(12, 6, K0);
    for (let k = 0; k < 6; k++) p.p(12 + R(Math.cos((k * TAU) / 6) * 5), 6 + R(Math.sin((k * TAU) / 6) * 5), K3);
  }),
  ent('r2-safe', [[13, 13]], (p) => {
    p.r(0, 0, 13, 12, K2);
    p.r(1, 1, 11, 10, K1);
    p.disc(6, 6, 3, K3);
    p.p(6, 6, K0);
    p.r(10, 4, 1, 4, K3);
    p.r(1, 12, 2, 1, K2);
    p.r(10, 12, 2, 1, K2);
  }),
  ent('r2-smoke', [[13, 13]], (p) => {
    p.disc(4, 9, 3, K1);
    p.disc(7, 6, 3, K2);
    p.disc(9, 3, 2, K2);
    p.p(8, 5, K3);
    p.p(10, 2, K3);
  }),
  ent('r2-metronome', [[11, 14]], (p) => {
    // Frozen metronome stopped mid-tick.
    p.r(4, 2, 3, 3, K1);
    p.r(3, 5, 5, 7, K1);
    p.r(1, 12, 9, 2, K2);
    p.l(2, 12, 4, 1, K2);
    p.l(8, 12, 6, 1, K2);
    p.r(4, 1, 3, 1, K3);
    p.l(5, 11, 9, 3, K4);
    p.r(7, 4, 2, 2, K3);
  }),
  ent('r2-cracks', [[15, 17]], (p) => {
    // Cracked frozen pocket-watch silhouette with crown ring, fracture wedge, and stopped hands.
    p.ring(7, 2, 2, K3);
    p.r(6, 4, 3, 1, K2);
    p.disc(7, 10, 6, K3);
    p.disc(7, 10, 5, K0);
    // Cracked glass wedge missing on upper right
    p.l(7, 10, 12, 6, K2);
    p.l(7, 10, 11, 14, K1);
    p.r(7, 6, 1, 4, K4);
    p.r(7, 10, 4, 1, K3);
  }),
  ent('r2-ripple', [[15, 11]], (p) => {
    // Frozen concentric ripple rings suspended in stillness.
    p.ring(7, 5, 5, K1);
    p.ring(7, 5, 3, K2);
    p.ring(7, 5, 1, K3);
    p.p(7, 5, K4);
  }),
  ent('r2-book', [[11, 11]], (p) => {
    streak(p, 5, 0, 4);
    p.l(0, 8, 5, 6, K3);
    p.l(10, 8, 5, 6, K3);
    p.l(0, 9, 5, 7, K2);
    p.l(10, 9, 5, 7, K2);
    p.r(5, 6, 1, 4, K4);
  }),
  ent('r2-bubbles', [[9, 15]], (p) => {
    p.ring(4, 3, 2, K3);
    p.ring(6, 9, 1, K2);
    p.ring(3, 12, 2, K2);
    p.p(3, 2, K4);
  }),
  ent('r2-hook', [[8, 17]], (p) => {
    for (let y = 1; y < 10; y += 2) p.r(4, y, 1, 1, K2);
    for (let y = 2; y < 10; y += 2) p.r(3, y, 3, 1, K1);
    p.r(4, 10, 1, 4, K3);
    p.r(2, 14, 5, 1, K3);
    p.r(2, 12, 1, 2, K3);
    p.p(1, 12, K3);
  }),
  ent('r2-stopwatch', [[11, 13]], (p) => {
    p.r(4, 0, 3, 1, K3);
    p.r(5, 1, 1, 1, K2);
    p.disc(5, 7, 5, K3);
    p.disc(5, 7, 4, K0);
    p.r(5, 3, 1, 4, K4);
    p.p(4, 7, K2);
  }),
  ent('r2-flame', [[9, 13]], (p) => {
    p.r(2, 11, 5, 2, K1);
    p.r(3, 7, 3, 4, K3);
    p.r(2, 8, 5, 3, K3);
    p.r(4, 3, 2, 4, K3);
    p.p(5, 1, K2);
    p.r(4, 8, 1, 3, K4);
  }),
  ent('r2-domino', [[15, 13]], (p) => {
    p.r(0, 12, 15, 1, K1);
    p.r(0, 4, 3, 8, K3);
    p.l(5, 11, 9, 3, K3);
    p.l(6, 11, 10, 3, K3);
    p.l(7, 11, 11, 3, K2);
    p.r(12, 9, 3, 3, K2);
    p.p(1, 6, K0);
    p.p(1, 9, K0);
  }),
  ent('r2-coin', [[9, 14]], (p) => {
    streak(p, 4, 0, 6);
    p.r(2, 7, 5, 6, K3);
    p.r(3, 6, 3, 8, K3);
    p.r(4, 7, 1, 6, K4);
  }),
  ent('r2-pause', [[15, 15]], (p) => {
    // Suspended teardrop hanging mid-air above a frozen crown splash.
    p.p(7, 1, K4);
    p.r(6, 2, 3, 2, K3);
    p.r(5, 4, 5, 3, K3);
    p.r(6, 7, 3, 1, K2);
    p.p(6, 4, K4);
    // Frozen splash crown below
    p.r(2, 13, 11, 2, K2);
    p.l(4, 13, 2, 9, K3);
    p.l(10, 13, 12, 9, K3);
    p.p(2, 8, K4);
    p.p(12, 8, K4);
    p.p(7, 10, K3);
  }),
];

export const RING2_ANCHORS: EntityDef[] = [
  ent('r2-clocktower', [[36, 66]], (p) => {
    // A tower clock stopped at the instant of the SMI.
    p.r(6, 18, 24, 48, K1);
    p.r(6, 18, 1, 48, K2);
    p.r(4, 14, 28, 4, K2);
    p.l(4, 14, 18, 0, K2);
    p.l(31, 14, 18, 0, K2);
    p.disc(18, 30, 10, K3);
    p.disc(18, 30, 9, K0);
    for (let k = 0; k < 12; k++) p.p(18 + R(Math.cos((k * TAU) / 12) * 8), 30 + R(Math.sin((k * TAU) / 12) * 8), k % 3 ? K2 : K4);
    p.l(18, 30, 18 + 5, 30 - 3, K3);
    p.l(18, 30, 18 - 2, 30 - 7, K4);
    for (let y = 44; y < 62; y += 6) p.r(12, y, 12, 3, K0);
    // A pigeon frozen mid-takeoff.
    p.r(26, 6, 3, 2, K3);
    p.p(29, 5, K3);
    p.p(25, 5, K3);
  }),
  ent('r2-cascade', [[48, 58]], (p) => {
    // A cascade of the world above, every piece hanging where it was when time stopped.
    for (let k = 0; k < 14; k++) {
      const x = 2 + R(p.h(k) * 40);
      const y = 4 + R((k / 14) * 44 + p.h(k + 30) * 6);
      const rows = DEBRIS[k % DEBRIS.length]!;
      streak(p, x + 2, y - 6, 5);
      rows.forEach((row, ry) => {
        for (let rx = 0; rx < row.length; rx++) if (row[rx] !== ' ') p.p(x + rx, y + ry, DEBRIS_PAL[row[rx]!]!);
      });
    }
    p.r(0, 56, 48, 2, K1);
  }),
];

// ---------------------------------------------------------------------------------------------
// Ring −3 (1-bit): the die. White line-work on black, few and readable.

const ON = '#ffffff';
const OFF = '#000000';

export const RING3: EntityDef[] = [
  ent('r3-vias', [[10, 10]], (p) => {
    for (let r = 0; r < 3; r++) for (let k = 0; k < 3; k++) p.r(k * 4, r * 4, 2, 2, ON);
  }),
  ent('r3-pad', [[16, 10]], (p) => {
    // Crisp 1-bit hardware key silhouette (round bow + shaft + 2 bold bit teeth).
    p.disc(4, 4, 4, ON);
    p.disc(4, 4, 2, OFF);
    p.r(8, 3, 8, 2, ON);
    p.r(11, 5, 2, 3, ON);
    p.r(14, 5, 2, 4, ON);
  }),
  ent('r3-trace', [[24, 12]], (p) => {
    const w = 12 + R(p.h(0) * 9);
    p.r(1, 2, w, 1, ON);
    p.r(w + 1, 2, 1, 8, ON);
    p.r(w, 9, 3, 3, ON);
    p.p(w + 1, 10, OFF);
    p.r(0, 1, 3, 3, ON);
  }),
  ent('r3-decap', [[13, 8]], (p) => {
    for (const x of [1, 7]) {
      p.r(x, 1, 5, 6, ON);
      p.r(x + 1, 2, 3, 4, OFF);
      p.r(x + 1, 2, 1, 4, ON);
      p.r(x + 3, 2, 1, 4, ON);
    }
    p.r(2, 1, 9, 1, ON);
    p.r(2, 6, 9, 1, ON);
  }),
  ent(
    'r3-xtal',
    [[15, 9]],
    (p) => {
      p.r(2, 0, 11, 9, ON);
      p.r(0, 2, 15, 5, ON);
      p.r(3, 2, 9, 5, OFF);
      p.r(1, 3, 1, 3, OFF);
      p.r(13, 3, 1, 3, OFF);
    },
    {
      anim: (p, _w, _h, _v, t) => {
        // The oscillator's tick: a square wave crawling across its can.
        const ph = Math.floor(t * 8);
        for (let x = 0; x < 7; x++) {
          const hi = (x + ph) % 4 < 2;
          p.p(4 + x, hi ? 3 : 5, ON);
          if ((x + ph) % 2 === 0) p.p(4 + x, 4, ON);
        }
      },
      noFlip: true,
    },
  ),
  ent('r3-testpads', [[17, 8]], (p) => {
    for (let k = 0; k < 4; k++) {
      p.disc(2 + k * 4, 4, 2, ON);
      if (p.h(k) > 0.6) p.p(2 + k * 4, 4, OFF);
    }
  }),
  ent('r3-fuses', [[19, 9]], (p) => {
    p.r(0, 0, 19, 1, ON);
    p.r(0, 8, 19, 1, ON);
    for (let k = 0; k < 6; k++) {
      const x = 1 + k * 3;
      const blown = p.h(k) > 0.6;
      p.r(x, 1, 1, 2, ON);
      p.r(x, 6, 1, 2, ON);
      if (!blown) p.r(x, 3, 1, 3, ON);
      else p.p(x + 1, 4, ON);
    }
  }),
  ent('r3-resistor', [[15, 8]], (p) => {
    // Physical axial resistor component with leads and ceramic body.
    p.r(1, 3, 3, 2, ON);
    p.r(11, 3, 3, 2, ON);
    p.r(4, 1, 7, 6, ON);
    p.r(5, 2, 1, 4, OFF);
    p.r(7, 2, 1, 4, OFF);
    p.r(9, 2, 1, 4, OFF);
  }),
  ent('r3-diode', [[11, 8]], (p) => {
    p.r(1, 3, 2, 2, ON);
    p.r(8, 3, 2, 2, ON);
    p.r(3, 1, 5, 6, ON);
    p.r(6, 2, 1, 4, OFF);
  }),
  ent('r3-inductor', [[15, 8]], (p) => {
    // Four coil humps on a core.
    p.r(1, 5, 2, 1, ON);
    p.r(12, 5, 2, 1, ON);
    for (let k = 0; k < 4; k++) {
      const x = 2 + k * 3;
      p.r(x, 2, 2, 4, ON);
    }
  }),
  ent('r3-sram', [[17, 15]], (p) => {
    // Unmistakable 1-bit Transistor schematic symbol (circle + vertical base bar + collector/emitter legs + arrow).
    p.ring(9, 7, 6, ON);
    p.r(0, 7, 6, 1, ON); // base lead
    p.r(6, 3, 2, 9, ON); // vertical base bar
    p.l(8, 5, 12, 2, ON);
    p.r(12, 0, 1, 3, ON); // collector lead
    p.l(8, 9, 12, 12, ON);
    p.r(12, 12, 1, 3, ON); // emitter lead
    p.r(10, 10, 3, 2, ON); // emitter arrow head
  }),
  ent(
    'r3-ringosc',
    [[15, 16]],
    (p) => {
      // Bold 1-bit Hardware Padlock / Fuse-Lock silhouette (thick U-shackle + solid white lock body + bold black keyhole).
      p.r(4, 0, 7, 2, ON);
      p.r(3, 1, 2, 6, ON);
      p.r(10, 1, 2, 6, ON);
      p.r(1, 7, 13, 9, ON);
      p.disc(7, 10, 2, OFF);
      p.r(6, 11, 3, 3, OFF);
    },
    {
      anim: (p, _w, _h, _v, t) => {
        if (Math.floor(t * 2) % 2 === 0) p.p(7, 10, ON);
      },
      noFlip: true,
    },
  ),
  ent('r3-thermal', [[8, 13]], (p) => {
    p.r(2, 1, 3, 8, ON);
    p.r(3, 2, 1, 6, OFF);
    p.disc(3, 10, 2, ON);
    p.r(3, 4, 1, 4, ON);
    p.r(5, 2, 2, 1, ON);
    p.r(5, 5, 2, 1, ON);
  }),
  ent('r3-pll', [[15, 13]], (p) => {
    // Crisp 1-bit Capacitor + Earth Ground schematic symbol.
    p.r(7, 0, 1, 4, ON);
    p.r(2, 4, 11, 2, ON);
    p.r(2, 8, 11, 2, ON);
    p.r(7, 10, 1, 3, ON);
    p.r(3, 12, 9, 1, ON);
  }),
  ent('r3-jtag', [[18, 12]], (p) => {
    // Unmistakable 1-bit DIP-8 IC Chip silhouette with chunky protruding legs and pin-1 notch.
    for (let x = 2; x <= 14; x += 4) {
      p.r(x, 0, 2, 3, ON);
      p.r(x, 9, 2, 3, ON);
    }
    p.r(0, 3, 18, 6, ON);
    p.r(0, 5, 2, 2, OFF); // pin-1 notch
    p.r(4, 4, 10, 4, OFF); // die window
    p.r(6, 5, 6, 2, ON);
  }),
  ent(
    'r3-rom',
    [[22, 11]],
    (p) => {
      p.frame(0, 0, 22, 11, ON);
      p.t('ROM', 3, 9, ON);
    },
    { text: true, cap: 1, weight: 0.5 },
  ),
  ent('r3-htree', [[15, 15]], (p) => {
    p.r(7, 2, 1, 11, ON);
    p.r(3, 2, 9, 1, ON);
    p.r(3, 12, 9, 1, ON);
    for (const [x, y] of [[3, 0], [11, 0], [3, 10], [11, 10]] as const) {
      p.r(x, y, 1, 5, ON);
      p.r(x - 2, y, 5, 1, ON);
      p.r(x - 2, y + 4, 5, 1, ON);
    }
    p.r(6, 6, 3, 3, ON);
  }),
  ent('r3-guard', [[15, 17]], (p) => {
    // Crisp 1-bit Radio / RF Management-Engine Antenna Tower silhouette with broadcast arcs.
    p.disc(7, 4, 1, ON);
    p.l(7, 5, 3, 16, ON);
    p.l(7, 5, 11, 16, ON);
    p.r(5, 10, 5, 1, ON);
    p.r(4, 13, 7, 1, ON);
    p.r(2, 16, 11, 1, ON);
    // Broadcast arcs left & right of beacon
    p.r(3, 2, 1, 5, ON);
    p.r(11, 2, 1, 5, ON);
    p.r(1, 1, 1, 7, ON);
    p.r(13, 1, 1, 7, ON);
  }),
  ent('r3-gate', [[14, 9]], (p) => {
    p.r(0, 2, 3, 1, ON);
    p.r(0, 6, 3, 1, ON);
    p.r(3, 0, 1, 9, ON);
    p.r(3, 0, 4, 1, ON);
    p.r(3, 8, 4, 1, ON);
    p.p(7, 0, ON);
    p.p(8, 1, ON);
    p.r(9, 2, 1, 5, ON);
    p.p(8, 7, ON);
    p.p(7, 8, ON);
    p.r(10, 4, 4, 1, ON);
  }),
  ent('r3-probe', [[8, 15]], (p) => {
    p.r(1, 1, 6, 5, ON);
    p.r(2, 2, 4, 3, OFF);
    p.r(3, 6, 2, 6, ON);
    p.p(3, 12, ON);
    p.r(1, 13, 6, 1, ON);
  }),
  ent('r3-align', [[9, 9]], (p) => {
    p.r(4, 0, 1, 9, ON);
    p.r(0, 4, 9, 1, ON);
    p.frame(2, 2, 5, 5, ON);
    p.p(4, 4, OFF);
  }),
];

export const RING3_ANCHORS: EntityDef[] = [
  ent(
    'r3-me',
    [[44, 34]],
    (p) => {
      // Unmistakable 1-bit QFP Management Engine chip with protruding perimeter leads, corner pin-1 bevel, silicon die core, and heartbeat.
      for (let x = 7; x <= 35; x += 4) {
        p.r(x, 0, 2, 4, ON);
        p.r(x, 30, 2, 4, ON);
      }
      for (let y = 7; y <= 25; y += 4) {
        p.r(0, y, 4, 2, ON);
        p.r(40, y, 4, 2, ON);
      }
      p.r(4, 4, 36, 26, ON);
      p.r(6, 6, 32, 22, OFF);
      // Pin-1 corner orientation dot
      p.disc(9, 9, 1, ON);
      // Central die-cavity square + diagonal bond wires
      p.frame(14, 10, 16, 14, ON);
      p.l(8, 12, 14, 13, ON);
      p.l(8, 22, 14, 21, ON);
      p.l(35, 12, 30, 13, ON);
      p.l(35, 22, 30, 21, ON);
    },
    {
      anim: (p, _w, _h, _v, t) => {
        const beat = Math.max(0, Math.sin(t * 3.2)) ** 6;
        p.r(19, 14, 6, 6, beat > 0.3 ? ON : OFF);
        p.frame(18, 13, 8, 8, ON);
      },
      noFlip: true,
    },
  ),
];
