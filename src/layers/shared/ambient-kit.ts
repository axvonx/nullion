import type { AmbientEnv } from '../types';

/** Horizontal IRQ pulses that stream across the band (Userspace, Kernel, Drivers); `color` is the layer's own. */
export function irqPulse(color: string) {
  return ({ ctx, W, H, t, col, i, s1, s2, s3, pulse }: AmbientEnv) => {
    const dir = i % 2 === 0 ? 1 : -1;
    const speed = 28 + s3 * 42;
    const x = Math.round((((s1 * W + dir * t * speed) % (W + 12)) + (W + 12)) % (W + 12) - 6);
    const y = Math.round(s2 * H);
    if (i === 0 && Math.abs(x - W / 2) < 2) pulse();
    ctx.globalAlpha = 0.5;
    ctx.fillStyle = col(color);
    ctx.fillRect(x, y, 3, 1);
  };
}
