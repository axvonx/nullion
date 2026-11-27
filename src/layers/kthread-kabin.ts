/** Layer `kthread-kabin`: 1978 · Cozy timber cabin where off-duty kworkers chop workqueue logs by a softirq hearth. */
import { SEAM_H, vgrad, vis } from '../render/art-common';
import { MotionType } from '../render/motion';
import { ent, type EntityDef } from '../render/v4/kit';
import { kernel } from './kernel';
import { fill, mod, rect } from './shared/draw-kit';
import type { LayerArt } from './types';

// 1978 · The Kthread Kabin (cozy log cabin of off-duty kworkers, workqueue logs & softirq hearth)
const PROPS: EntityDef[] = [
  ent('kabin-woodpile', [[20, 14]], (p) => {
    // Stacked workqueue firewood logs under a tiny shingled eave
    p.r(0, 0, 20, 4, '#24140c');
    p.r(1, 1, 18, 2, '#784222');
    p.r(1, 4, 18, 10, '#24140c');
    for (let y = 5; y <= 10; y += 3) {
      for (let x = 2; x <= 14; x += 4) {
        p.r(x, y, 3, 3, '#c87e4b');
        p.r(x + 1, y + 1, 1, 1, '#f0d098');
      }
    }
  }),
  ent('kabin-stump', [[14, 14]], (p) => {
    // Chopping stump with a pixel axe embedded in the top
    p.r(2, 6, 10, 8, '#24140c');
    p.r(3, 7, 8, 6, '#8f502a');
    p.r(3, 7, 8, 2, '#e6b87c');
    // Axe blade & handle
    p.r(5, 3, 4, 4, '#24140c');
    p.r(6, 4, 2, 2, '#cfd6dc');
    p.r(8, 0, 3, 5, '#24140c');
    p.r(9, 1, 1, 3, '#c87e4b');
  }),
  ent(
    'kabin-lantern',
    [[10, 16]],
    (p) => {
      // Iron oil lantern on a wooden post
      p.r(3, 10, 4, 6, '#24140c');
      p.r(4, 11, 2, 4, '#784222');
      p.r(1, 2, 8, 9, '#24140c');
      p.r(2, 3, 6, 1, '#585258');
      p.r(3, 4, 4, 5, '#ffb84d');
      p.r(2, 9, 6, 1, '#585258');
      p.r(3, 0, 4, 2, '#585258');
    },
    {
      anim: (p, _w, _h, _v, t) => {
        if (Math.floor(t * 5) % 2 === 0) p.r(4, 5, 2, 2, '#fff4b8');
      },
    },
  ),
  ent(
    'kabin-antlers',
    [[18, 12]],
    (p) => {
      // Wall-mounted wooden plaque with RCU antler rack
      p.r(4, 4, 10, 8, '#24140c');
      p.r(5, 5, 8, 6, '#8f502a');
      p.r(6, 6, 6, 4, '#f0e8d8');
      p.t('RCU', 6, 10, '#24140c');
      // Left & right antlers
      p.r(1, 0, 3, 5, '#e6d8c0');
      p.r(0, 1, 2, 2, '#e6d8c0');
      p.r(14, 0, 3, 5, '#e6d8c0');
      p.r(16, 1, 2, 2, '#e6d8c0');
    },
    { text: true },
  ),
  ent('kabin-rocker', [[16, 18]], (p) => {
    // Front-on wooden rocking chair
    p.r(2, 0, 12, 16, '#24140c');
    p.r(3, 1, 10, 8, '#a86234');
    p.r(4, 2, 2, 6, '#683619');
    p.r(7, 2, 2, 6, '#683619');
    p.r(10, 2, 2, 6, '#683619');
    p.r(2, 9, 12, 2, '#e6a670');
    p.r(3, 11, 2, 5, '#784222');
    p.r(11, 11, 2, 5, '#784222');
    p.r(0, 16, 16, 2, '#683619');
  }),
  ent('kabin-kettle', [[12, 12]], (p) => {
    // Cast-iron pot on a tripod stand
    p.r(1, 0, 10, 12, '#24140c');
    p.r(2, 8, 2, 4, '#585258');
    p.r(8, 8, 2, 4, '#585258');
    p.r(2, 3, 8, 6, '#3c383e');
    p.r(3, 4, 6, 1, '#78727c');
    p.r(4, 1, 4, 2, '#585258');
  }),
  ent('kabin-pine', [[16, 24]], (p) => {
    // Snow-dusted pine tree outside the cabin
    p.r(6, 18, 4, 6, '#24140c');
    p.r(7, 19, 2, 4, '#784222');
    p.r(1, 13, 14, 6, '#24140c');
    p.r(2, 14, 12, 4, '#2d6838');
    p.r(2, 14, 12, 1, '#e8f4f8');
    p.r(3, 7, 10, 6, '#24140c');
    p.r(4, 8, 8, 4, '#3a8448');
    p.r(4, 8, 8, 1, '#e8f4f8');
    p.r(5, 1, 6, 6, '#24140c');
    p.r(6, 2, 4, 4, '#4ca25c');
    p.r(6, 2, 4, 1, '#ffffff');
  }),
];

const ANCHORS: EntityDef[] = [
  ent(
    'kabin-hearth-anchor',
    [[46, 30]],
    (p) => {
      // Stone & timber cabin fireplace with crackling softirq embers
      p.r(0, 0, 46, 30, '#24140c');
      p.r(2, 1, 42, 6, '#727a82');
      p.r(1, 7, 44, 3, '#a86234');
      p.r(1, 7, 44, 1, '#e6a670');
      p.r(3, 10, 40, 19, '#585e66');
      // Mantle clock
      p.r(19, 2, 8, 5, '#f0e8d8');
      p.t('IRQ', 20, 6, '#24140c');
      // Firebox
      p.r(12, 14, 22, 14, '#140c08');
      p.r(15, 23, 16, 4, '#784222');
      p.r(16, 19, 14, 5, '#e86820');
      p.r(19, 17, 8, 5, '#ffb84d');
    },
    {
      anim: (p, _w, _h, _v, t) => {
        const f = Math.floor(t * 6) % 3;
        p.r(20 + f, 16, 4, 3, '#fff4b8');
        p.glow(23, 16 - f, 6, 'rgba(255,184,77,0.35)');
      },
      text: true,
    },
  ),
];

export const kthreadKabin: LayerArt = {
  family: 'kernel',
  blurb: '1978 · Cozy timber cabin where off-duty kworkers chop workqueue logs by a softirq hearth',
  palette: 'rgb4',
  form: 'serial',
  cursor: 'underscore',
  stackTheme: {
    accent: '#e88438',
    hi: '#fff4b8',
    tint: 'rgba(232, 132, 56, 0.16)',
    border: 'rgba(232, 132, 56, 0.44)',
    anim: 'blink',
    icon: [
      '    #    ',
      '   ###   ',
      '  #####  ',
      ' ####### ',
      '#########',
      ' #     # ',
      ' # +++ # ',
      ' # +#+ # ',
      ' ####### ',
    ],
  },
  topicTags: ['os', 'concurrency', 'dsa'],
  library: { own: PROPS, anchors: ANCHORS, borrow: { from: 'userspace', prefix: 'kabin', upTo: 20 }, density: 2.8, anchorCount: 1, far: 0 },
  open: 'bottom',
  floors: (top, bottom, W) => {
    const sBot = Math.min(bottom, top + 340) - 6;
    return [{ kind: 'ledge', y: sBot - 16, xLeft: 8, xRight: W - 8 }];
  },
  fog: [26, 16, 12],
  background: (ctx, b, { entities }) => {
    const [y0, y1] = vis(b);
    fill(ctx, 0, y0, b.w, y1 - y0, '#1c100a');
    vgrad(ctx, b, b.top, b.bottom + SEAM_H, [
      [0, 'rgba(42,68,94,0.25)'],
      [0.5, 'rgba(120,66,34,0.16)'],
      [1, 'rgba(232,104,32,0.2)'],
    ]);
    entities();
  },
  setpiece: {
    base: ({ ctx, W, cx, top, bot, H }) => {
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
    },
    detail: ({ ctx, t, cx, bot }) => {
      for (let k = 0; k < 5; k++) {
        const ey = bot - 22 - Math.floor(mod(t * 9 + k * 4, 16));
        rect(ctx, cx + 36 + ((k * 5 + Math.floor(t * 3)) % 12), ey, 2, 2, k % 2 ? '#fff4b8' : '#ffb84d');
      }
    },
  },
  critters: {
    motions: [MotionType.Hop, MotionType.Perch],
    count: 3,
    exitLabels: ['kworker', 'wake!'],
    draw: ({ px, ink, t, phase, perched }) => {
      // Cozy hooded Cabin Sprite
      const hop = perched ? 0 : Math.floor(t * 6 + phase) % 2;
      px(1, 0 - hop, 4, 2, '#e86820');
      px(0, 2 - hop, 6, 4, '#c87e4b');
      px(1, 3 - hop, 1, 1, ink);
      px(4, 3 - hop, 1, 1, ink);
      px(1, 5, 1, 1, '#784222');
      px(4, 5, 1, 1, '#784222');
    },
  },
  sound: {
    timbre: { wave: 'triangle', filterHz: 2000, q: 1.4, gainScale: 0.8, reverbWet: 0.28 },
    ambienceLevel: 0.06,
    drones: [],
    critterExit: { freq: 520, crush: false },
    critterCall: kernel.sound.critterCall,
  },
};
