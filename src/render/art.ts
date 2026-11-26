import type { LayerId } from '../core/layers';

/** Deterministic hash → [0,1). Layer art is seeded by world row so it never shimmers between frames. */
export function hash(n: number): number {
  let x = Math.imul(n ^ 0x9e3779b9, 0x85ebca6b);
  x ^= x >>> 13;
  x = Math.imul(x, 0xc2b2ae35);
  x ^= x >>> 16;
  return (x >>> 0) / 4294967296;
}

export const FONT = '8px Silkscreen';

export interface Band {
  /** Screen-space top and bottom of this layer's band (may extend off screen). */
  top: number;
  bottom: number;
  /** World-space top, for seeding. */
  worldTop: number;
  /** Camera world y, for parallax. */
  camY: number;
  w: number;
  h: number;
  /** Seconds; frozen in Ring −2 when that look is on. */
  t: number;
  /** Reduced motion: no flicker, flashes or fast movement. */
  reduced: boolean;
  /** Rows above this screen y will not be shown (a seam redraw), so art may skip them. */
  from?: number;
  /** Optional far-plane vertical offset (used during WOMM's rigid forced scroll to bind z-layers together). */
  farShift?: number;
}

export type Art = (ctx: CanvasRenderingContext2D, b: Band) => void;

/** Visible rows of a band, in world-aligned steps of `step`, so content scrolls with the world. */
function rows(b: Band, step: number, fn: (screenY: number, rowIndex: number) => void) {
  const y0 = Math.max(b.top, 0);
  const y1 = Math.min(b.bottom, b.h);
  const first = Math.floor((y0 - b.top) / step);
  for (let i = first; b.top + i * step < y1; i++) fn(b.top + i * step, i);
}

function text(ctx: CanvasRenderingContext2D, s: string, x: number, y: number, color: string) {
  ctx.fillStyle = color;
  ctx.fillText(s, x, y);
}

export const BYTECODE = ['aload_0', 'invokevirtual #12', 'getfield #4', 'iconst_1', 'iadd', 'putfield #4', 'areturn', 'new #7', 'dup', 'invokespecial #1', 'checkcast #9', 'ifnull L42'];
export const LIBS = ['libc.so.6', 'libm.so.6', 'libpthread.so.0', 'libstdc++.so.6', 'ld-linux-x86-64.so.2', 'libssl.so.3', 'libz.so.1', 'libdl.so.2'];
export const PROCS = ['systemd', 'sshd', 'cron', 'dbus-daemon', 'journald', 'udevd', 'Xorg', 'pipewire', 'bash', 'top'];
export const DMESG = [
  'Linux version 6.12.0 (gcc 14.2)',
  'Command line: BOOT_IMAGE=/vmlinuz ro quiet',
  'x86/fpu: Supporting XSAVE feature 0x001',
  'Memory: 16318204K available',
  'rcu: Hierarchical RCU implementation.',
  'smp: Bringing up secondary CPUs ...',
  'futex hash table entries: 4096',
  'NET: Registered PF_INET protocol family',
  'EXT4-fs (nvme0n1p2): mounted filesystem',
  'maple_tree: node cache initialized',
];
const BIOS = ['Main', 'Advanced', 'Boot', 'Security', 'Exit'];

export const LAYER_ART: Record<LayerId, Art> = {
  application(ctx, b) {
    ctx.fillStyle = '#4f7fb3';
    ctx.fillRect(0, b.top, b.w, b.bottom - b.top);
    rows(b, 46, (y, i) => {
      const seed = i * 7 + 1;
      const x = 12 + hash(seed) * (b.w - 130);
      const ww = 80 + hash(seed + 1) * 60;
      ctx.fillStyle = '#1b2433';
      ctx.fillRect(x + 3, y + 3, ww, 34);
      ctx.fillStyle = '#e9e6dc';
      ctx.fillRect(x, y, ww, 34);
      ctx.fillStyle = hash(seed + 2) > 0.5 ? '#2c5aa0' : '#7b3fa0';
      ctx.fillRect(x, y, ww, 7);
      ctx.fillStyle = '#e0504a';
      ctx.fillRect(x + ww - 6, y + 2, 3, 3);
      ctx.fillStyle = '#9aa0ab';
      for (let l = 0; l < 3; l++) ctx.fillRect(x + 5, y + 12 + l * 6, (ww - 14) * (0.4 + hash(seed + 3 + l) * 0.6), 2);
    });
  },

  runtime(ctx, b) {
    ctx.fillStyle = '#1e1a33';
    ctx.fillRect(0, b.top, b.w, b.bottom - b.top);
    ctx.font = FONT;
    rows(b, 11, (y, i) => {
      for (let c = 0; c < 3; c++) {
        const op = BYTECODE[Math.floor(hash(i * 3 + c) * BYTECODE.length)]!;
        text(ctx, op, 10 + c * 105, y + 8, c === 1 ? '#a58cff' : '#5d5490');
      }
    });
    // GC sweep: a bright line crossing the heap, clearing the objects behind it.
    const sx = ((b.t * 60) % (b.w + 60)) - 30;
    rows(b, 22, (y, i) => {
      for (let k = 0; k < 6; k++) {
        const ox = hash(i * 11 + k) * b.w;
        if (ox < sx && sx - ox < 120) continue;
        ctx.fillStyle = '#ffd166';
        ctx.fillRect(ox, y + 14, 4, 4);
      }
    });
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.fillRect(sx, Math.max(b.top, 0), 2, Math.min(b.bottom, b.h) - Math.max(b.top, 0));
  },

  libraries(ctx, b) {
    ctx.fillStyle = '#2a2140';
    ctx.fillRect(0, b.top, b.w, b.bottom - b.top);
    ctx.font = FONT;
    rows(b, 20, (y, i) => {
      let x = 6 - hash(i) * 40;
      let k = 0;
      while (x < b.w) {
        const name = LIBS[Math.floor(hash(i * 13 + k) * LIBS.length)]!;
        const w = ctx.measureText(name).width + 10;
        ctx.fillStyle = ['#c86b3c', '#3c8fc8', '#5fae5a', '#b0a038'][k % 4]!;
        ctx.fillRect(x, y + 2, w, 15);
        ctx.fillStyle = 'rgba(0,0,0,0.35)';
        ctx.fillRect(x, y + 15, w, 2);
        text(ctx, name, x + 5, y + 12, '#14101f');
        x += w + 3;
        k++;
      }
    });
  },

  userspace(ctx, b) {
    ctx.fillStyle = '#0c1116';
    ctx.fillRect(0, b.top, b.w, b.bottom - b.top);
    ctx.font = FONT;
    rows(b, 12, (y, i) => {
      const name = PROCS[i % PROCS.length]!;
      text(ctx, String(100 + Math.floor(hash(i) * 9000)), 8, y + 8, '#55c0e0');
      text(ctx, name, 48, y + 8, '#d8d8d8');
      const load = 0.15 + 0.85 * Math.abs(Math.sin(b.t * (0.6 + hash(i + 50)) + i));
      const bars = Math.floor(load * 20);
      for (let k = 0; k < 20; k++) {
        ctx.fillStyle = k < bars ? (k > 15 ? '#e05050' : k > 10 ? '#e0c050' : '#50c060') : '#26303a';
        ctx.fillRect(140 + k * 8, y + 2, 6, 7);
      }
    });
  },

  kernel(ctx, b) {
    ctx.fillStyle = '#000';
    ctx.fillRect(0, b.top, b.w, b.bottom - b.top);
    ctx.font = FONT;
    rows(b, 10, (y, i) => {
      const ts = (i * 0.0137 + hash(i) * 0.01).toFixed(6).padStart(12, ' ');
      text(ctx, `[${ts}]`, 4, y + 8, '#55ff55');
      text(ctx, DMESG[i % DMESG.length]!, 88, y + 8, '#aaaaaa');
    });
  },

  drivers(ctx, b) {
    ctx.fillStyle = '#060b14';
    ctx.fillRect(0, b.top, b.w, b.bottom - b.top);
    rows(b, 30, (y, i) => {
      ctx.strokeStyle = i % 2 ? '#55ffff' : '#ff55ff';
      ctx.beginPath();
      for (let x = 0; x <= b.w; x += 2) {
        const v = Math.sin(x * 0.08 + b.t * 3 + i) * 6 + (hash(i * 1000 + x) - 0.5) * 3;
        if (x === 0) ctx.moveTo(x, y + 15 + v);
        else ctx.lineTo(x, y + 15 + v);
      }
      ctx.stroke();
      // Interrupt sparks.
      if (hash(i * 31 + Math.floor(b.t * 4)) > 0.7) {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(hash(i * 77 + Math.floor(b.t * 4)) * b.w, y + 12, 2, 6);
      }
    });
  },

  firmware(ctx, b) {
    ctx.fillStyle = '#0000aa';
    ctx.fillRect(0, b.top, b.w, b.bottom - b.top);
    ctx.font = FONT;
    rows(b, 70, (y, i) => {
      ctx.fillStyle = '#aaaaaa';
      ctx.fillRect(0, y, b.w, 10);
      BIOS.forEach((m, k) => text(ctx, m, 8 + k * 56, y + 8, k === i % BIOS.length ? '#ffffff' : '#0000aa'));
      text(ctx, `Boot Option #${(i % 3) + 1}     [UEFI: NVMe ${i % 2 ? 'SSD' : 'Disk'}]`, 14, y + 26, '#ffffff');
      text(ctx, 'Secure Boot          [Enabled]', 14, y + 38, '#ffffff');
      text(ctx, 'Press DEL to enter setup', 14, y + 56, '#ffff55');
    });
  },

  'ring-1'(ctx, b) {
    ctx.fillStyle = '#0a1a10';
    ctx.fillRect(0, b.top, b.w, b.bottom - b.top);
    ctx.font = FONT;
    rows(b, 60, (y, i) => {
      for (let v = 0; v < 2; v++) {
        const x = 24 + v * 150 + (v ? 8 : 0);
        ctx.strokeStyle = '#3fe07a';
        ctx.strokeRect(x + 0.5, y + 6.5 + v * 6, 120, 44);
        text(ctx, `VM ${v} vcpu${i % 4}`, x + 4, y + 16 + v * 6, '#3fe07a');
        text(ctx, v ? 'VMEXIT: EPT_VIOLATION' : 'VMRESUME', x + 4, y + 30 + v * 6, '#1f8040');
      }
    });
  },

  'ring-2'(ctx, b) {
    ctx.fillStyle = '#1b1b1b';
    ctx.fillRect(0, b.top, b.w, b.bottom - b.top);
    ctx.font = FONT;
    ctx.strokeStyle = '#3a3a3a';
    rows(b, 16, (y) => {
      ctx.beginPath();
      ctx.moveTo(0, y + 0.5);
      ctx.lineTo(b.w, y + 0.5);
      ctx.stroke();
    });
    rows(b, 48, (y, i) => text(ctx, `SMRAM 0x${(0xa0000 + i * 0x400).toString(16)}  SMI#${i}  all interrupts masked`, 10, y + 30, '#bdbdbd'));
  },

  'ring-3'(ctx, b) {
    ctx.fillStyle = '#020203';
    ctx.fillRect(0, b.top, b.w, b.bottom - b.top);
    const cx = b.w / 2;
    const dieTop = b.top + 30;
    const pulse = 0.5 + 0.5 * Math.sin(b.t * 2);
    ctx.strokeStyle = `rgba(200,220,255,${0.25 + pulse * 0.4})`;
    for (let k = 0; k < 14; k++) {
      const x = cx - 70 + k * 10 + 0.5;
      ctx.beginPath();
      ctx.moveTo(x, dieTop - 20);
      ctx.lineTo(x, dieTop);
      ctx.moveTo(x, dieTop + 120);
      ctx.lineTo(x, dieTop + 140);
      ctx.stroke();
    }
    ctx.fillStyle = '#1a1c24';
    ctx.fillRect(cx - 75, dieTop, 150, 120);
    ctx.strokeStyle = '#6a7088';
    ctx.strokeRect(cx - 74.5, dieTop + 0.5, 149, 119);
    for (let k = 0; k < 40; k++) {
      ctx.fillStyle = hash(k) > 0.6 ? '#8890b0' : '#30344a';
      ctx.fillRect(cx - 68 + hash(k + 100) * 130, dieTop + 6 + hash(k + 200) * 104, 2 + hash(k + 300) * 18, 2);
    }
  },
};
