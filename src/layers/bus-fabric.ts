/** Layer `bus-fabric`: PCIe lanes, DMA rings and memory-mapped I/O crisscrossing the board. */
import { prows, vis } from '../render/art-common';
import { MotionType } from '../render/motion';
import type { EntityDef } from '../render/v4/kit';
import { drivers } from './drivers';
import { R, fill, line, mod, px, rect } from './shared/draw-kit';
import { E, K, sl } from './shared/endless-props';
import type { LayerArt } from './types';

const FK: K = { i: '#000000', d: '#ff55ff', m: '#55ffff', l: '#ffffff', h: '#ffffff', w: '#ff55ff', wl: '#ffffff', o: '#ff55ff', ol: '#55ffff', a: '#ffffff', b: '#ff55ff', g: '#55ffff', c: '#ffffff', r: '#ff55ff' };

const bus = E(FK);

const PROPS: EntityDef[] = [
  bus('bf-iommu', [28, 30], (p, k) => {
    // customs tollbooth with a raised striped barrier arm
    sl(p, 0, 27, 28, 3, k.d, k.m, k.i);
    sl(p, 2, 8, 14, 19, k.m, k.l, k.d);
    p.r(0, 5, 18, 3, k.d);
    p.r(0, 5, 18, 1, k.l);
    p.r(5, 12, 8, 7, k.i);
    p.r(5, 12, 8, 1, k.l);
    p.r(17, 18, 3, 9, k.m);
    for (let n = 0; n < 8; n++) p.p(20 + n, 17 - n * 2, n % 2 ? k.d : k.l);
    for (let n = 0; n < 8; n++) p.p(20 + n, 18 - n * 2, n % 2 ? k.d : k.l);
  }),
  bus('bf-dmaring', [22, 22], (p, k) => {
    sl(p, 5, 19, 12, 3, k.d, k.m, k.i);
    p.r(9, 14, 4, 5, k.m);
    p.ring(11, 8, 7, k.m);
    p.disc(11, 8, 2, k.d);
    for (let n = 0; n < 8; n++) {
      const a = (n * Math.PI) / 4;
      const x = 11 + Math.round(Math.cos(a) * 7);
      const y = 8 + Math.round(Math.sin(a) * 7);
      p.r(x - 1, y, 2, 3, n % 2 ? k.d : k.l);
    }
  }),
  bus('bf-crossbar', [22, 22], (p, k) => {
    sl(p, 1, 2, 20, 17, k.m, k.l, k.d);
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 4; c++) p.r(4 + c * 4, 5 + r * 4, 2, 2, k.i);
    }
    // two draped patch cords bridging sockets
    p.l(5, 6, 9, 14, k.l);
    p.l(9, 14, 13, 10, k.l);
    p.l(17, 6, 13, 12, k.d);
    p.l(13, 12, 9, 8, k.d);
    p.r(3, 19, 3, 3, k.d);
    p.r(16, 19, 3, 3, k.d);
  }),
  bus('bf-mmio', [18, 16], (p, k) => {
    sl(p, 0, 0, 18, 16, k.m, k.l, k.d);
    for (const [x, y] of [[2, 2], [10, 2], [2, 9], [10, 9]] as const) p.r(x, y, 6, 5, k.i);
    p.r(11, 5, 4, 4, k.l);
    p.r(3, 5, 4, 4, k.l);
    p.r(4, 6, 2, 1, k.d);
    p.r(12, 6, 2, 1, k.d);
  }),
  bus('bf-msix', [12, 12], (p, k) => {
    sl(p, 0, 8, 12, 4, k.m, k.l, k.d);
    p.r(5, 4, 2, 4, k.d);
    p.r(2, 3, 8, 2, k.l);
    p.r(4, 0, 4, 3, k.l);
    p.r(9, 5, 2, 2, k.d);
  }),
  bus('bf-retimer', [12, 12], (p, k) => {
    sl(p, 0, 3, 3, 9, k.m, k.l, k.d);
    p.r(3, 5, 8, 2, k.l);
    p.r(9, 5, 2, 5, k.l);
    p.r(8, 9, 2, 1, k.l);
    p.p(2, 6, k.i);
  }),
  bus('bf-lane', [10, 14], (p, k) => {
    p.r(4, 0, 3, 4, k.d);
    p.r(3, 0, 5, 1, k.l);
    sl(p, 1, 4, 8, 9, k.m, k.l, k.d);
    p.r(2, 6, 6, 3, k.i);
    p.r(3, 7, 1, 1, k.l);
    p.r(5, 7, 1, 1, k.l);
    p.r(7, 7, 1, 1, k.l);
    p.r(0, 13, 10, 1, k.d);
  }),
  bus('bf-tlp', [14, 10], (p, k) => {
    sl(p, 1, 2, 12, 5, k.m, k.l, k.d);
    p.r(1, 2, 2, 5, k.l);
    p.r(11, 2, 2, 5, k.l);
    p.r(6, 2, 2, 5, k.d);
    p.r(3, 7, 2, 3, k.d);
    p.r(9, 7, 2, 3, k.d);
    p.r(2, 9, 10, 1, k.d);
  }),
];

const ANCHORS: EntityDef[] = [
  bus('bf-pcieswitch', [56, 40], (p, k) => {
    // rackmount switch chassis: mounting ears, two rows of port cages with status LEDs, on a stand
    p.r(4, 30, 4, 10, k.d);
    p.r(48, 30, 4, 10, k.d);
    p.r(4, 35, 48, 2, k.d);
    sl(p, 0, 4, 56, 26, k.m, k.l, k.d);
    p.r(0, 8, 3, 18, k.l);
    p.r(53, 8, 3, 18, k.l);
    p.r(10, 6, 36, 1, k.d);
    for (let r = 0; r < 2; r++) {
      for (let c = 0; c < 7; c++) {
        const x = 6 + c * 7;
        const y = 10 + r * 9;
        p.r(x, y, 5, 5, k.l);
        p.r(x + 1, y + 1, 3, 3, k.i);
        p.p(x + 2, y + 6, c % 2 ? k.d : k.i);
      }
    }
  }),
];

export const busFabric: LayerArt = {
  family: 'drivers',
  blurb: 'PCIe lanes, DMA rings and memory-mapped I/O crisscrossing the board',
  palette: 'cga4',
  form: 'serial',
  cursor: 'underscore',
  stackTheme: drivers.stackTheme,
  topicTags: ['hardware', 'networking', 'graph'],
  library: { own: PROPS, anchors: ANCHORS, borrow: { from: 'drivers', prefix: 'bf', upTo: 20 }, density: 4.2, anchorCount: 2, far: 0.35 },
  fog: [16, 0, 24],
  background: (ctx, b, { entities }) => {
    const [y0, y1] = vis(b);
    fill(ctx, 0, y0, b.w, y1 - y0, '#000000');
    prows(b, 0.5, 16, (y, i) => {
      fill(ctx, 0, y, b.w, 1, i % 2 ? '#ff55ff' : '#55ffff');
    });
    entities();
  },
  setpiece: {
    base: ({ ctx, t, W, cx, top, cy, H }) => {
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
    },
    detail: ({ ctx, t, W, top, H }) => {
      for (const sx of [0, W - 10]) {
        for (let k = 0; k < 8; k++) {
          const y = top + 14 + k * Math.floor((H - 28) / 8);
          rect(ctx, sx, y, 10, 3, Math.floor(t * 5 + k) % 4 === 0 ? '#ffffff' : '#ff55ff');
        }
      }
    },
  },
  critters: {
    motions: [MotionType.Scuttle, MotionType.Zip],
    count: 4,
    exitLabels: ['ARB lost', 'posted'],
    draw: ({ px, ink, dir }) => {
      // Packet-mote: a magenta body with a white leading face, two eyes and a short trailing fin.
      const fx = dir > 0 ? 3 : 0;
      px(0, 0, 6, 6, '#ff55ff');
      px(fx, 0, 3, 6, '#ffffff');
      px(fx, 2, 1, 1, ink);
      px(fx + 2, 2, 1, 1, ink);
      px(dir > 0 ? -2 : 6, 2, 2, 2, '#ff55ff');
    },
  },
  sound: {
    timbre: { wave: 'pulse12', filterHz: 2800, q: 2.0, gainScale: 0.86, reverbWet: 0.16 },
    ambienceLevel: 0.06,
    drones: [],
    critterExit: { freq: 520, crush: false },
    critterCall: drivers.sound.critterCall,
  },
};
