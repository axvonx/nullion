import type { DailyLayerId } from '../../core/layers';
import { ent, type EntityDef } from './kit';

/**
 * +5 bespoke trinkets for every Daily layer (bringing each core layer to 25+ unique props!)
 * and shared with Endless remixes so every band feels richly detailed and never repetitive.
 */

const R = Math.round;
const mod = (n: number, m: number) => ((n % m) + m) % m;

export const EXTRA_DAILY_TRINKETS: Record<DailyLayerId, readonly EntityDef[]> = {
  application: [
    ent('app-avatar', [[12, 12]], (p) => {
      p.disc(6, 6, 5, '#5b8ee6');
      p.disc(6, 4, 2, '#ffffff');
      p.r(3, 8, 6, 2, '#ffffff');
    }),
    ent('app-music', [[16, 10]], (p) => {
      p.r(1, 1, 15, 9, '#3a4a8a');
      p.r(0, 0, 15, 9, '#ffffff');
      p.r(1, 1, 5, 7, '#a070e0');
      p.r(8, 2, 5, 1, '#55607a');
      p.r(8, 5, 4, 2, '#59c08a');
    }),
    ent('app-pin', [[11, 14]], (p) => {
      p.disc(5, 4, 4, '#d0605e');
      p.disc(5, 4, 2, '#ffffff');
      p.l(5, 8, 5, 13, '#a83f3d');
    }),
    ent('app-pill', [[18, 7]], (p) => {
      p.r(1, 0, 16, 7, '#59c08a');
      p.r(0, 1, 18, 5, '#59c08a');
      p.r(3, 3, 12, 1, '#ffffff');
    }),
    ent('app-bell', [[11, 12]], (p) => {
      p.r(4, 0, 3, 2, '#e6a23c');
      p.r(2, 2, 7, 6, '#e6a23c');
      p.r(1, 8, 9, 2, '#c27c1c');
      p.r(4, 10, 3, 2, '#c27c1c');
      p.r(8, 1, 2, 2, '#ff3b30');
    }),
  ],

  runtime: [
    ent('rt-arena', [[20, 10]], (p) => {
      p.box(0, 0, 20, 10, '#000033', '#9999cc');
      for (let x = 2; x < 17; x += 3) p.r(x, 2, 2, 6, x % 6 === 2 ? '#66cc99' : '#6699cc');
    }),
    ent('rt-stackframe', [[16, 12]], (p) => {
      p.box(0, 0, 16, 12, '#000033', '#666699');
      p.r(2, 2, 12, 2, '#ffcc33');
      p.r(2, 5, 8, 2, '#99ccff');
      p.r(2, 8, 10, 2, '#cc66cc');
    }),
    ent('rt-upvalue', [[12, 14]], (p) => {
      p.box(2, 0, 8, 5, '#000033', '#ffff99');
      p.l(6, 5, 6, 10, '#6666cc');
      p.box(2, 9, 8, 5, '#000033', '#66cc99');
    }),
    ent(
      'rt-safepoint',
      [[14, 12]],
      (p) => {
        p.r(6, 5, 2, 7, '#666699');
        p.r(2, 1, 10, 5, '#cc6666');
      },
      {
        anim: (p, _w, _h, _v, t) => {
          if (Math.floor(t * 2) % 2 === 0) p.r(4, 2, 6, 3, '#ffff99');
        },
        noFlip: true,
      },
    ),
    ent('rt-nursery', [[18, 10]], (p) => {
      p.box(0, 2, 18, 8, '#000033', '#66cc99');
      for (let k = 0; k < 4; k++) p.r(2 + k * 4, 5, 3, 3, k % 2 ? '#99ffcc' : '#ffff99');
    }),
  ],

  libraries: [
    ent('lib-inkwell', [[12, 13]], (p) => {
      p.r(2, 6, 8, 7, '#555555');
      p.r(3, 5, 6, 2, '#aaaaaa');
      p.l(6, 5, 11, 0, '#ffffaa');
      p.l(7, 5, 10, 1, '#ffffff');
    }),
    ent('lib-bookmark', [[10, 15]], (p) => {
      p.r(1, 0, 8, 13, '#aa0000');
      p.r(2, 1, 6, 10, '#ffffaa');
      p.r(4, 0, 2, 14, '#ffff55');
      p.p(4, 14, '#aa5500');
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
    ent('us-billboard', [[22, 14]], (p) => {
      p.r(4, 10, 2, 4, '#555555');
      p.r(16, 10, 2, 4, '#555555');
      p.box(0, 0, 22, 10, '#000000', '#55ffff');
      p.r(3, 3, 10, 2, '#ff55ff');
      p.r(3, 6, 14, 1, '#ffff55');
    }),
    ent('us-manhole', [[14, 8]], (p) => {
      p.disc(7, 4, 4, '#555555');
      p.ring(7, 4, 4, '#aaaaaa');
      p.r(5, 4, 5, 1, '#000000');
    }),
    ent('us-meter', [[10, 14]], (p) => {
      p.r(4, 6, 2, 8, '#555555');
      p.box(1, 0, 8, 7, '#000000', '#aaaaaa');
      p.r(3, 2, 4, 2, '#55ff55');
    }),
    ent('us-vent', [[14, 10]], (p) => {
      p.box(0, 0, 14, 10, '#000000', '#555555');
      for (let y = 2; y < 8; y += 2) p.r(2, y, 10, 1, '#aaaaaa');
    }),
  ],

  kernel: [
    ent('kr-futex', [[14, 12]], (p) => {
      p.box(0, 2, 14, 8, '#000000', '#ffff55');
      p.r(2, 4, 4, 4, '#55ff55');
      p.r(8, 4, 4, 4, '#ff5555');
    }),
    ent('kr-epoll', [[16, 12]], (p) => {
      p.box(0, 0, 16, 12, '#000000', '#55ffff');
      for (let k = 0; k < 4; k++) p.r(2 + k * 3, 3, 2, 6, k === 2 ? '#55ff55' : '#555555');
    }),
    ent('kr-cgroups', [[16, 14]], (p) => {
      p.frame(0, 0, 16, 14, '#aaaaaa');
      p.box(2, 2, 5, 5, '#0000aa', '#55ffff');
      p.box(9, 2, 5, 5, '#00aa00', '#55ff55');
      p.box(2, 8, 12, 4, '#aa0000', '#ff5555');
    }),
    ent('kr-workq', [[20, 9]], (p) => {
      p.r(0, 7, 20, 2, '#555555');
      for (let k = 0; k < 4; k++) p.r(1 + k * 5, 2, 4, 5, k % 2 ? '#ffff55' : '#55ffff');
    }),
    ent('kr-buddy', [[18, 10]], (p) => {
      p.box(0, 0, 8, 10, '#0000aa', '#aaaaaa');
      p.box(9, 0, 4, 10, '#00aa00', '#aaaaaa');
      p.box(14, 0, 4, 5, '#aa5500', '#aaaaaa');
      p.box(14, 5, 4, 5, '#aa0000', '#aaaaaa');
    }),
  ],

  drivers: [
    ent('dr-crystal', [[12, 8]], (p) => {
      p.r(2, 0, 8, 6, '#ffffff');
      p.r(3, 1, 6, 4, '#000000');
      p.r(4, 6, 1, 2, '#55ffff');
      p.r(7, 6, 1, 2, '#55ffff');
    }),
    ent('dr-sata', [[16, 8]], (p) => {
      p.box(0, 0, 16, 8, '#000000', '#ff55ff');
      p.r(2, 3, 10, 2, '#55ffff');
      p.r(10, 2, 2, 4, '#ffffff');
    }),
    ent('dr-fanheader', [[12, 8]], (p) => {
      p.box(0, 0, 12, 8, '#000000', '#ffffff');
      for (let k = 0; k < 4; k++) p.r(2 + k * 2, 3, 1, 2, '#55ffff');
    }),
    ent('dr-ledstrip', [[18, 6]], (p) => {
      p.r(0, 2, 18, 2, '#ff55ff');
      for (let k = 0; k < 4; k++) p.r(2 + k * 4, 1, 2, 4, k % 2 ? '#ffffff' : '#55ffff');
    }),
    ent('dr-nvme', [[22, 8]], (p) => {
      p.box(0, 0, 22, 8, '#000000', '#55ffff');
      p.r(2, 2, 6, 4, '#ff55ff');
      p.r(10, 2, 6, 4, '#ff55ff');
      p.r(18, 1, 3, 6, '#ffffff');
    }),
  ],

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
    ent('fw-uart', [[16, 8]], (p) => {
      p.box(0, 0, 16, 8, '#000000', '#aaaaaa');
      for (let k = 0; k < 3; k++) p.r(3 + k * 4, 3, 2, 2, k === 0 ? '#ffffff' : '#555555');
    }),
    ent('fw-watchdog', [[14, 10]], (p) => {
      p.box(0, 0, 14, 10, '#000000', '#555555');
      p.r(2, 4, 8, 2, '#ffffff');
      p.r(11, 2, 1, 6, '#aaaaaa');
    }),
  ],

  'ring-1': [
    ent('r1-nested', [[16, 12]], (p) => {
      p.frame(0, 0, 16, 12, '#aaaaaa');
      p.frame(3, 2, 10, 8, '#555555');
      p.r(6, 5, 4, 2, '#ffffff');
    }),
    ent('r1-paravirt', [[18, 10]], (p) => {
      p.r(0, 4, 18, 2, '#555555');
      p.box(2, 1, 5, 8, '#000000', '#aaaaaa');
      p.box(11, 1, 5, 8, '#000000', '#ffffff');
    }),
    ent('r1-vram', [[14, 12]], (p) => {
      p.box(0, 0, 14, 12, '#000000', '#aaaaaa');
      for (let y = 2; y < 10; y += 3) p.r(2, y, 10, 2, y === 2 ? '#ffffff' : '#555555');
    }),
    ent('r1-vmexit', [[14, 12]], (p) => {
      p.r(0, 9, 14, 3, '#555555');
      p.l(7, 9, 7, 1, '#ffffff');
      p.l(4, 4, 7, 1, '#ffffff');
      p.l(10, 4, 7, 1, '#ffffff');
    }),
    ent('r1-console', [[16, 12]], (p) => {
      p.box(0, 0, 16, 12, '#000000', '#555555');
      p.r(2, 3, 6, 1, '#aaaaaa');
      p.r(2, 6, 9, 1, '#ffffff');
    }),
  ],

  'ring-2': [
    ent('r2-drop', [[9, 13]], (p) => {
      p.p(4, 0, '#404040');
      p.r(4, 2, 1, 3, '#808080');
      p.disc(4, 9, 3, '#c0c0c0');
      p.p(3, 8, '#ffffff');
    }),
    ent('r2-leaf', [[11, 11]], (p) => {
      p.l(1, 9, 9, 1, '#c0c0c0');
      p.r(3, 4, 5, 3, '#808080');
      p.p(7, 2, '#ffffff');
    }),
    ent('r2-feather', [[13, 11]], (p) => {
      p.l(1, 9, 11, 1, '#ffffff');
      p.r(3, 5, 6, 2, '#c0c0c0');
      p.r(5, 3, 5, 2, '#808080');
    }),
    ent('r2-spark', [[11, 11]], (p) => {
      p.r(5, 1, 1, 9, '#808080');
      p.r(1, 5, 9, 1, '#808080');
      p.r(4, 4, 3, 3, '#ffffff');
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
    ent(
      'r3-pulse',
      [[16, 7]],
      (p) => {
        p.r(0, 3, 16, 1, '#ffffff');
      },
      {
        anim: (p, _w, _h, _v, t) => {
          const x = Math.floor(mod(t * 10, 14));
          p.r(x, 1, 2, 5, '#ffffff');
        },
        noFlip: true,
      },
    ),
    ent('r3-fiducial', [[11, 11]], (p) => {
      p.ring(5, 5, 4, '#ffffff');
      p.r(5, 0, 1, 11, '#ffffff');
      p.r(0, 5, 11, 1, '#ffffff');
      p.p(5, 5, '#000000');
    }),
    ent('r3-fusebank', [[14, 8]], (p) => {
      p.frame(0, 0, 14, 8, '#ffffff');
      for (let x = 3; x < 12; x += 3) p.r(x, 2, 1, 4, '#ffffff');
    }),
  ],
};
