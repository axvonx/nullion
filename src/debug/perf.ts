import type { Scene } from '../render/scene';

/**
 * Debug build only (?perf=1): times the scene's whole per-frame work (art, quantize, effects) by running it
 * `frames` times back to back, 16 ms of scene time apart, after a short warm-up. The result goes in
 * document.title and a white box on the page, so a headless Chrome screenshot can read it.
 * Headless Chrome doesn't schedule animation frames for --dump-dom, hence the synchronous loop.
 */
export function measureFrames(scene: Scene, frames = 120) {
  const s = scene as unknown as { frame(now: number): void };
  setTimeout(() => {
    const ms: number[] = [];
    let now = performance.now();
    for (let k = 0; k < frames; k++) {
      now += 16;
      const t0 = performance.now();
      s.frame(now);
      ms.push(performance.now() - t0);
    }
    const sorted = [...ms].sort((a, b) => a - b);
    const avg = ms.reduce((a, b) => a + b, 0) / ms.length;
    const p95 = sorted[Math.floor(sorted.length * 0.95)]!;
    const out = `PERF avg=${avg.toFixed(2)}ms p95=${p95.toFixed(2)}ms max=${sorted[sorted.length - 1]!.toFixed(2)}ms n=${ms.length}`;
    document.title = out;
    const pre = document.createElement('pre');
    pre.id = 'perf';
    pre.style.cssText = 'position:fixed;left:0;top:40%;z-index:99;margin:0;padding:12px;background:#fff;color:#000;font:32px monospace';
    pre.textContent = out;
    document.body.append(pre);
  }, 1500);
}
