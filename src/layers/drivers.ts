/** Layer `drivers`: The translators between the operating system and the hardware. */
import { hash, prows, vis } from '../render/art-common';
import { MotionType } from '../render/motion';
import { ent, type EntityDef, type Pen } from '../render/v4/kit';
import { irqPulse } from './shared/ambient-kit';
import { R, TAU, fill, frame, line, mod, rect, ring } from './shared/draw-kit';
import { text, variants } from '../text';
import type { LayerArt } from './types';
import { userspace } from './userspace';

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

const PROPS: EntityDef[] = [
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
    [[26, 14]],
    (p, w) => {
      // Perforated transfer track on two pedestal legs, passing under an arched bridge housing.
      p.r(0, 8, w, 2, W);
      for (let x = 1; x < w; x += 3) p.p(x, 9, K);
      p.r(3, 10, 3, 3, CY);
      p.r(w - 6, 10, 3, 3, CY);
      p.r(2, 13, 5, 1, W);
      p.r(w - 7, 13, 5, 1, W);
      p.r(8, 1, 10, 8, MG);
      p.r(8, 1, 10, 1, W);
      p.r(10, 4, 6, 5, K);
      p.r(11, 3, 4, 1, K);
    },
    {
      anim: (p, w, _h, _v, t) => {
        const s = mod(t * 8, 6);
        for (let k = 0; k < 5; k++) {
          const x = R(k * 6 + s);
          if (x < w - 3 && (x + 3 < 8 || x > 18)) p.r(x, 5, 3, 3, k % 2 ? CY : MG);
        }
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
    [[22, 13]],
    (p) => {
      // Flash module and a ZIF-socketed controller chip on one baseplate, joined by a ribbon cable.
      p.r(0, 10, 22, 3, MG);
      p.r(0, 10, 22, 1, W);
      p.r(1, 2, 6, 8, W);
      p.r(2, 3, 4, 5, K);
      p.p(3, 4, MG);
      p.r(7, 4, 4, 1, CY);
      p.r(7, 6, 4, 1, CY);
      p.r(7, 8, 4, 1, CY);
      legs(p, 11, 4, 9, 5);
      p.r(11, 4, 9, 5, W);
      p.r(12, 5, 7, 3, K);
    },
    {
      anim: (p, _w, _h, _v, t) => {
        const q = mod(t * 0.9, 1);
        p.p(7 + (Math.floor(t * 9) % 3), 4, W);
        p.r(13, 6, Math.max(1, R(q * 5)), 1, CY);
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
  ent('dr-mmio', [[16, 22]], (p) => {
    // Rack of toggle switches and indicator bulbs on a flat baseplate with a bus-bar rail.
    p.r(1, 1, 14, 17, CY);
    p.r(1, 1, 14, 1, W);
    p.r(1, 1, 1, 17, W);
    p.r(14, 2, 1, 16, K);
    for (let k = 0; k < 4; k++) {
      const y = 3 + k * 4;
      p.r(3, y, 2, 2, k % 2 ? MG : W);
      p.r(7, y, 6, 2, K);
      p.r(7 + (k % 2) * 4, y, 2, 2, W);
    }
    p.r(2, 18, 12, 1, MG);
    p.r(0, 19, 16, 2, CY);
    p.r(0, 19, 16, 1, W);
  }),
  ent('dr-nvme', [[10, 14]], (p) => {
    // SSD cartridge in a small vertical bracket: ribbed heatsink cap, activity LED, edge connector.
    p.r(2, 1, 6, 10, MG);
    for (let k = 0; k < 3; k++) {
      p.r(2, 1 + k * 2, 6, 1, W);
      p.r(2, 2 + k * 2, 6, 1, CY);
    }
    p.p(6, 8, W);
    p.p(3, 8, K);
    p.r(3, 10, 4, 2, CY);
    p.p(5, 11, K);
    p.r(0, 7, 1, 5, W);
    p.r(9, 7, 1, 5, W);
    p.r(0, 12, 10, 1, W);
  }),
  ent(
    'dr-ringbuf',
    [[30, 28]],
    (p) => {
      // Turntable machine on stubby feet: a fixed read/write gate arm over the ring of packet trays.
      p.disc(14, 12, 11, CY);
      p.disc(14, 12, 9, K);
      p.disc(14, 12, 2, W);
      for (let k = 0; k < 8; k++) {
        const a = (k * TAU) / 8;
        p.l(14, 12, 14 + R(Math.cos(a) * 8), 12 + R(Math.sin(a) * 8), MG);
      }
      p.r(21, 11, 8, 3, W);
      p.r(21, 11, 8, 1, CY);
      p.r(20, 9, 3, 7, MG);
      p.r(20, 9, 3, 1, W);
      p.r(3, 24, 22, 2, CY);
      p.r(3, 24, 22, 1, W);
      for (const x of [4, 10, 16, 21]) p.r(x, 26, 3, 1, W);
    },
    {
      anim: (p, _w, _h, _v, t) => {
        for (let k = 0; k < 8; k++) {
          const a = t * 0.4 + (k * TAU) / 8;
          const x = 14 + R(Math.cos(a) * 8);
          const y = 12 + R(Math.sin(a) * 8);
          p.r(x - 1, y - 1, 3, 3, k % 2 ? MG : W);
          p.p(x, y, K);
        }
      },
      noFlip: true,
    },
  ),
  ent(
    'dr-watchdog',
    [[12, 16]],
    (p) => {
      // Spring-wound desk timer: dial with a sweeping hand, a hammer cocked beside the dome bell.
      p.disc(6, 3, 2, MG);
      p.p(5, 2, W);
      p.r(9, 1, 3, 1, W);
      p.p(9, 2, CY);
      p.disc(6, 9, 5, CY);
      p.disc(6, 9, 4, W);
      for (const [x, y] of [[6, 6], [9, 9], [6, 12], [3, 9]] as const) p.p(x, y, K);
      p.r(1, 14, 10, 1, W);
      p.r(1, 14, 10, 1, W);
    },
    {
      anim: (p, _w, _h, _v, t) => {
        const a = t * 1.6 - Math.PI / 2;
        p.l(6, 9, 6 + Math.cos(a) * 3, 9 + Math.sin(a) * 3, MG);
      },
      noFlip: true,
    },
  ),
  ent('dr-hotplug', [[18, 16]], (p) => {
    // Drive bay with a caddy half slid out on its latch handle: the hot-plug.
    p.r(1, 1, 14, 12, CY);
    p.r(1, 1, 14, 1, W);
    p.r(1, 1, 1, 12, W);
    p.r(3, 3, 10, 8, K);
    p.r(5, 5, 11, 5, W);
    p.r(5, 5, 11, 1, CY);
    p.r(7, 7, 6, 1, K);
    p.r(14, 6, 3, 3, MG);
    p.p(4, 4, W);
    p.r(2, 13, 3, 2, W);
    p.r(11, 13, 3, 2, W);
  }),
  ent('dr-knifeswitch', [[12, 14]], (p) => {
    // Porcelain knife switch: a hinged blade over two terminal posts.
    p.r(1, 2, 10, 11, W);
    p.r(1, 2, 10, 1, CY);
    p.r(10, 3, 1, 10, MG);
    p.r(2, 8, 3, 3, CY);
    p.r(7, 3, 3, 3, CY);
    p.l(3, 9, 8, 4, MG);
    p.l(4, 9, 9, 4, MG);
    p.r(8, 2, 2, 2, W);
  }),
];

const ANCHORS: EntityDef[] = [
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

export const drivers: LayerArt = {
  family: 'drivers',
  wiki: 'https://en.wikipedia.org/wiki/Device_driver',
  blurb: text('layers.drivers.blurb'),
  palette: 'cga4',
  form: 'serial',
  cursor: 'underscore',
  stackTheme: {
    accent: '#55ffff',
    hi: '#ff66ff',
    tint: 'rgba(85, 255, 255, 0.13)',
    border: 'rgba(85, 255, 255, 0.38)',
    anim: 'scan',
    icon: [
      '  # # #  ',
      ' ####### ',
      '##     ##',
      ' # +++ # ',
      '## + + ##',
      ' # +++ # ',
      '##     ##',
      ' ####### ',
      '  # # #  ',
    ],
  },
  topicTags: ['hardware', 'os', 'networking'],
  library: { own: PROPS, anchors: ANCHORS, density: 4.6, anchorCount: 2, far: 0.4 },
  fog: [0, 0, 0],
  nameTopOffset: 44,
  background: (ctx, b, { entities }) => {
    const [y0, y1] = vis(b);
    fill(ctx, 0, y0, b.w, y1 - y0, '#000000');
    prows(b, 0.5, 12, (y, i) => {
      for (let x = mod(i * 5, 12); x < b.w; x += 24) if (hash(i * 61 + x) > 0.6) fill(ctx, x, y, 1, 1, '#55ffff');
    });
    entities();
  },
  setpiece: {
    base: ({ ctx, t, W, cx, top, bot, cy }) => {
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
    },
    detail: ({ ctx, t, W, top, bot, lamps }) => {
      // Corner cooling fans spinning, plus blinking LEDs along the rails.
      for (const [fx, fy] of [[26, top + 24], [W - 26, top + 24], [26, bot - 24], [W - 26, bot - 24]] as const) {
        ring(ctx, fx, fy, 10, '#55ffff');
        for (let k = 0; k < 3; k++) {
          const a = t * 9 + (k * TAU) / 3;
          line(ctx, fx, fy, fx + Math.cos(a) * 9, fy + Math.sin(a) * 9, '#ff55ff');
        }
      }
      lamps(top + 3, 16, '#ffffff', '#55ffff', 4);
    },
  },
  ambient: irqPulse('#55ffff'),
  critters: {
    motions: [MotionType.Scuttle],
    count: 4,
    exitLabels: variants('layers.drivers.exit'),
    draw: ({ px, ink, t, phase, variant }) => {
      // Bus-beetle: a 7x6 shell with a white crest, two dark eyes and scuttling legs.
      const leg = Math.floor(t * 14 + phase) % 2;
      const body = variant % 2 === 0 ? '#55ffff' : '#ff55ff';
      px(1, 0, 5, 1, '#ffffff');
      px(0, 1, 7, 5, body);
      px(1, 2, 1, 1, ink);
      px(5, 2, 1, 1, ink);
      px(leg, 6, 1, 1, '#ffffff');
      px(6 - leg, 6, 1, 1, '#ffffff');
    },
  },
  sound: {
    timbre: { wave: 'pulse12', filterHz: 2800, q: 2.0, gainScale: 0.86, reverbWet: 0.16 },
    ambienceLevel: 0.06,
    drones: [{ freq: 82.41, wave: 'triangle', filterHz: 190, gain: 0.35 }],
    critterExit: { freq: 520, crush: true },
    critterCall: (snd, t, p) => {
      // Fast bus-beetle click-clack skitter
      for (let k = 0; k < 3; k++) {
        snd.noiseBurst({ at: t + k * 0.032, dur: 0.014, type: 'highpass', filterHz: 2800 + k * 400, gain: 0.17, pan: p, crush: true });
        snd.voice({ freq: 640 + k * 140, at: t + k * 0.032, dur: 0.02, wave: 'square', gain: 0.14, pan: p, crush: true });
      }
    },
    artifact: userspace.sound.artifact,
  },
};
