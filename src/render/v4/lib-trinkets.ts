import type { DailyLayerId } from '../../core/layers';
import { ent, type EntityDef } from './kit';

/**
 * Extra Daily-layer props (the art pass kept the survivors here; new props live in the layer libraries).
 */

const R = Math.round;

export const EXTRA_DAILY_TRINKETS: Record<DailyLayerId, readonly EntityDef[]> = {
  application: [
    ent('app-bell', [[11, 12]], (p) => {
      p.r(4, 0, 3, 2, '#e6a23c');
      p.r(2, 2, 7, 6, '#e6a23c');
      p.r(1, 8, 9, 2, '#c27c1c');
      p.r(4, 10, 3, 2, '#c27c1c');
      p.r(8, 1, 2, 2, '#ff3b30');
    }),
  ],

  runtime: [
    ent('rt-nursery', [[18, 13]], (p) => {
      // Low wooden seedling flat on short feet: a brass tag on the rim, four sprouts in dark soil.
      p.r(0, 5, 18, 6, '#996633');
      p.r(0, 5, 18, 1, '#cc9966');
      p.r(17, 6, 1, 5, '#663300');
      p.r(1, 5, 16, 2, '#333300');
      for (let k = 0; k < 4; k++) {
        const x = 3 + k * 4;
        p.r(x, 2, 1, 4, '#66cc66');
        p.r(x - 1, 1, 1, 2, k % 2 ? '#ffff66' : '#99ff99');
        p.r(x + 1, 1, 1, 2, '#99ff99');
      }
      p.r(7, 8, 4, 2, '#cccc66');
      p.r(7, 8, 4, 1, '#ffff99');
      p.r(2, 11, 3, 1, '#663300');
      p.r(13, 11, 3, 1, '#663300');
    }),
  ],

  libraries: [
    ent('lib-inkwell', [[12, 13]], (p) => {
      // Square dark-grey ink bottle with a silver collar; the quill rests in its neck.
      p.r(2, 6, 8, 7, '#555555');
      p.r(2, 6, 1, 7, '#aaaaaa');
      p.r(9, 6, 1, 7, '#000000');
      p.r(4, 4, 4, 2, '#aaaaaa');
      p.r(5, 4, 2, 1, '#000000');
      p.l(6, 4, 10, 0, '#ffffaa');
      p.l(7, 4, 11, 1, '#ffffff');
      p.l(7, 3, 10, 1, '#ffffaa');
    }),
    ent('lib-codex', [[15, 13]], (p) => {
      p.r(0, 1, 15, 11, '#550000');
      p.r(1, 2, 13, 9, '#aa5500');
      p.r(2, 2, 11, 9, '#ffffaa');
      p.r(0, 4, 2, 2, '#ffff55');
      p.r(13, 4, 2, 2, '#ffff55');
      p.r(4, 5, 7, 1, '#555555');
      p.r(4, 8, 5, 1, '#555555');
    }),
    ent('lib-scales', [[17, 14]], (p) => {
      p.r(8, 1, 1, 12, '#ffff55');
      p.r(5, 13, 7, 1, '#aa5500');
      p.r(2, 3, 13, 1, '#ffff55');
      p.l(2, 4, 1, 8, '#aaaaaa');
      p.l(14, 4, 15, 8, '#aaaaaa');
      p.r(0, 8, 4, 2, '#aa5500');
      p.r(13, 8, 4, 2, '#aa5500');
    }),
    ent('lib-hourglass', [[11, 14]], (p) => {
      p.r(1, 0, 9, 2, '#aa5500');
      p.r(1, 12, 9, 2, '#aa5500');
      p.l(2, 2, 8, 11, '#aaaaaa');
      p.l(8, 2, 2, 11, '#aaaaaa');
      p.r(4, 3, 3, 2, '#ffffaa');
      p.r(3, 10, 5, 2, '#ffff55');
    }),
  ],

  userspace: [
    ent('us-hydrant', [[9, 13]], (p) => {
      p.r(2, 2, 5, 11, '#aa0000');
      p.r(3, 0, 3, 2, '#ff5555');
      p.r(0, 5, 9, 2, '#ff5555');
      p.r(1, 12, 7, 1, '#555555');
    }),
    ent('us-meter', [[10, 14]], (p) => {
      p.r(4, 6, 2, 8, '#555555');
      p.box(1, 0, 8, 7, '#000000', '#aaaaaa');
      p.r(3, 2, 4, 2, '#55ff55');
    }),
  ],

  kernel: [],

  drivers: [],

  firmware: [
    ent('fw-tpm', [[12, 12]], (p) => {
      p.box(1, 1, 10, 10, '#000000', '#aaaaaa');
      p.r(4, 3, 4, 2, '#ffffff');
      p.r(3, 5, 6, 4, '#555555');
      p.p(6, 7, '#000000');
    }),
    ent('fw-jtag', [[16, 8]], (p) => {
      p.box(0, 0, 16, 8, '#000000', '#555555');
      for (let k = 0; k < 5; k++) {
        p.p(3 + k * 2, 2, '#ffffff');
        p.p(3 + k * 2, 5, '#aaaaaa');
      }
    }),
    ent('fw-secureboot', [[14, 14]], (p) => {
      p.r(2, 0, 10, 9, '#aaaaaa');
      p.r(3, 1, 8, 7, '#000000');
      p.r(4, 9, 6, 3, '#aaaaaa');
      p.r(6, 12, 2, 2, '#ffffff');
      p.r(5, 4, 4, 2, '#ffffff');
    }),
  ],

  'ring-1': [],

  'ring-2': [
    ent('r2-feather', [[14, 13]], (p) => {
      // A feather resting on a small stone plinth, its last drift stilled.
      p.r(2, 9, 10, 3, '#404040');
      p.r(2, 9, 10, 1, '#808080');
      p.r(1, 11, 12, 1, '#404040');
      p.l(2, 8, 11, 2, '#ffffff');
      p.r(5, 6, 6, 2, '#c0c0c0');
      p.r(6, 4, 5, 2, '#c0c0c0');
      p.r(8, 3, 3, 1, '#808080');
    }),
    ent('r2-spark', [[12, 13]], (p) => {
      // A spark-gap on a ceramic baseplate, the arc caught between two ball-tipped posts.
      p.r(0, 10, 12, 3, '#808080');
      p.r(0, 10, 12, 1, '#c0c0c0');
      for (const x of [2, 8]) {
        p.r(x, 3, 2, 7, '#c0c0c0');
        p.r(x - 1, 2, 4, 2, '#ffffff');
        p.r(x - 1, 8, 4, 1, '#404040');
      }
      p.p(4, 4, '#ffffff');
      p.p(5, 5, '#ffffff');
      p.p(6, 4, '#ffffff');
      p.p(7, 5, '#ffffff');
    }),
    ent('r2-prism', [[13, 11]], (p) => {
      p.l(6, 0, 1, 10, '#c0c0c0');
      p.l(6, 0, 11, 10, '#c0c0c0');
      p.r(1, 10, 11, 1, '#808080');
      p.r(5, 4, 3, 4, '#ffffff');
    }),
  ],

  'ring-3': [
    ent('r3-bondwire', [[16, 10]], (p) => {
      p.r(0, 7, 3, 3, '#ffffff');
      p.r(13, 7, 3, 3, '#ffffff');
      for (let k = 0; k <= 12; k++) {
        const q = k / 12;
        p.p(1 + q * 13, 7 - R(Math.sin(q * Math.PI) * 6), '#ffffff');
      }
    }),
    ent('r3-capbank', [[14, 9]], (p) => {
      for (let k = 0; k < 3; k++) {
        p.r(1 + k * 4, 1, 1, 7, '#ffffff');
        p.r(3 + k * 4, 1, 1, 7, '#ffffff');
      }
      p.r(0, 4, 14, 1, '#ffffff');
    }),
    ent('r3-fusebank', [[14, 8]], (p) => {
      p.frame(0, 0, 14, 8, '#ffffff');
      for (let x = 3; x < 12; x += 3) p.r(x, 2, 1, 4, '#ffffff');
    }),
  ],
};
