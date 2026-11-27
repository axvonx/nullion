import { enforce } from '../core/enforce';
import type { TierId } from '../core/tiers';
import { FONT, hash } from './art-common';
import type { Collectibles } from './collectibles';
import { CASCADE, PAGE_FAULT, WOMM } from './reaction-fx';
import { BAYER16, get2d, type Surface } from './surface';

/** The page-fault reaction's page size in scene pixels (a fixed grid). */
const PAGE_W = 64;
const PAGE_H = 36;

const LEAK_MS = 2600;
const LEAK_BATCHES = 5;
const LEAK_EVERY_MS = 1200;

/** What `ReactionPaint.draw` needs of this frame. */
export interface ReactionPaintFrame {
  now: number;
  /** The tier whose reaction is acting this frame, if any. */
  act: TierId | undefined;
  reduced: boolean;
  /** The reveal is holding the reaction (it loops or holds instead of ending). */
  held: boolean;
  /** 0..~2.6: props jiggle out of sync. */
  jiggle: number;
  /** When the reaction started: seeds which props jiggle. */
  reactionStart: number | undefined;
  /** The page-fault voids' cover, 0..1 each (reaction-fx's timeline). */
  pages: number[];
}

/**
 * The canvas half of the tier reactions that act on the world's props and the screen: the page-fault voids (Null
 * pointer exception, and the Bit Flip / Works on my machine cascade), jiggling props (Race condition, Heisenbug,
 * the Works on my machine build-up) and leaked copies that linger and fade (Memory leak, and the cascade's leaks).
 * It owns the fault pages, the pending-leak flag and the leaked copies with their screenshot; the Scene starts a
 * reaction (`start`), hands it each frame's timeline (`advance`, `draw`) and releases it when the hold lifts.
 */
export class ReactionPaint {
  /** Page-aligned cells (grid col, row) the page-fault reaction opens near the cursor, in order. */
  private faultPages: [number, number][] = [];
  private leakPending = false;
  private cascadeLeaked = false;
  /** Leaked prop copies, in batches: one per leak, and more, slowly, while a Memory leak is held by the reveal. */
  private leaks: { start: number; rects: [number, number, number, number][] }[] = [];
  private readonly leakShot = document.createElement('canvas');

  /** The scene was resized: the screenshot the leaked copies are cut from follows it. */
  resize(W: number, H: number) {
    this.leakShot.width = W;
    this.leakShot.height = H;
  }

  /** A tier reaction begins. `leakNow: false` defers a leak's screen copies to the landing (mid-dive they'd smear). */
  start(tier: TierId, leakNow: boolean, seed: number, W: number, cursorY: number) {
    if (tier === 'leak' && leakNow) this.leakPending = true;
    this.cascadeLeaked = false;
    if (tier === 'npe' || tier === 'bitflip' || tier === 'womm') this.faultPages = this.pickFaultPages(seed, W, cursorY);
  }

  /** A dive that carries a Memory leak has landed: copy the screen now. */
  leakAtLanding() {
    this.leakPending = true;
  }

  /** Per frame: the cascade's own leak (Bit Flip, Works on my machine), and Works on my machine's freeze ending the leaks. */
  advance(act: TierId | undefined, rel: number) {
    if ((act === 'bitflip' || act === 'womm') && rel >= CASCADE.leakAt && !this.cascadeLeaked) {
      this.cascadeLeaked = true;
      this.leakPending = true;
    }
    if (act === 'womm' && rel >= WOMM.freeze && this.leaks.length) {
      this.leaks.length = 0;
    }
  }

  /** The reveal's hold lifted: leaked copies start fading out. */
  release(now: number) {
    for (const b of this.leaks) b.start = Math.min(b.start, now - 0.6 * LEAK_MS);
  }

  /** Paint this frame's reaction over the world, under the vignette and the cursor. */
  draw(s: Surface, props: Collectibles, f: ReactionPaintFrame) {
    const { ctx, W, H } = s;
    const { now, act, reduced } = f;
    // Null pointer: dereferencing an unmapped page. Page-aligned voids open near the cursor, then fault back in.
    if (f.pages.length) this.drawPageFaults(s, f.pages);
    // Race condition, Heisenbug: props jiggle out of sync, each on its own phase.
    if (f.jiggle > 0) {
      enforce(f.reactionStart !== undefined, 'jiggle without a reaction');
      s.scratchCtx.drawImage(s.canvas, 0, 0);
      const rects = props.reactionTargets(Math.floor(f.reactionStart), 26, W, H);
      rects.forEach(([x, y, w, h], i) => {
        const dx = Math.round(Math.sin(now / 45 + i * 1.7) * 2.4 * f.jiggle);
        const dy = Math.round(Math.cos(now / 53 + i * 2.3) * 1.6 * f.jiggle);
        if (dx || dy) ctx.drawImage(s.scratch, x, y, w, h, x + dx, y + dy, w, h);
      });
    }
    // Memory leak: a few props are copied and the copies linger, drifting off like the cursor's smear, then fade.
    if (this.leakPending) {
      this.leakPending = false;
      get2d(this.leakShot).drawImage(s.canvas, 0, 0);
      this.leaks = [{ start: now, rects: props.reactionTargets(Math.floor(now), 10, W, H) }];
    }
    // Held, the leak keeps leaking: a few more copies every so often, up to a cap (none added under reduced motion).
    const holdLeak = f.held && (act === 'leak' || act === 'bitflip');
    const last = this.leaks[this.leaks.length - 1];
    if (holdLeak && act === 'leak' && !reduced && last && this.leaks.length < LEAK_BATCHES && now - last.start > LEAK_EVERY_MS) {
      this.leaks.push({ start: now, rects: props.reactionTargets(Math.floor(now), 5, W, H) });
    }
    this.leaks = this.leaks.filter((b) => holdLeak || now - b.start < LEAK_MS);
    for (const b of this.leaks) {
      // Held copies stop drifting and stay; released ones drift on and fade.
      const age = holdLeak ? Math.min(0.6, (now - b.start) / LEAK_MS) : (now - b.start) / LEAK_MS;
      ctx.globalAlpha = age < 0.6 ? 0.9 : 0.9 * (1 - (age - 0.6) / 0.4);
      b.rects.forEach(([x, y, w, h], k) => {
        const drift = (k % 3) * 2 + 5 + (reduced ? 0 : age * 18);
        ctx.drawImage(this.leakShot, x, y, w, h, Math.round(x - drift), Math.round(y + drift * 0.6), w, h);
      });
    }
    ctx.globalAlpha = 1;
  }

  /**
   * The page grid: cells of PAGE_W × PAGE_H scene pixels anchored at the screen's corner (a fixed grid, like 4 KiB
   * pages). The run's pages are the cursor's neighbours, in a seeded order; the cursor itself is drawn over them.
   */
  private pickFaultPages(seed: number, W: number, cursorY: number): [number, number][] {
    const col = Math.floor(W / 2 / PAGE_W);
    const row = Math.floor(cursorY / PAGE_H);
    const ring: [number, number][] = [];
    for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) if (dx || dy) ring.push([col + dx, row + dy]);
    ring.sort((a, b) => hash(seed + a[0] * 31 + a[1] * 17) - hash(seed + b[0] * 31 + b[1] * 17));
    return ring.slice(0, PAGE_FAULT.pages);
  }

  /**
   * Each page is a void with a crisp 1px outline of what was there (the pixels under the border are left alone),
   * a faint hex dump inside, and, on the first page, a SIGSEGV tag. Partial cover is an ordered-dither dissolve.
   */
  private drawPageFaults(s: Surface, covers: number[]) {
    const { ctx, W, H } = s;
    ctx.font = FONT;
    this.faultPages.forEach(([col, row], i) => {
      const c = covers[i] ?? 0;
      if (c <= 0) return;
      const x0 = col * PAGE_W;
      const y0 = row * PAGE_H;
      if (x0 + PAGE_W <= 0 || y0 + PAGE_H <= 0 || x0 >= W || y0 >= H) return;
      ctx.fillStyle = '#000';
      if (c >= 1) ctx.fillRect(x0 + 1, y0 + 1, PAGE_W - 2, PAGE_H - 2);
      else
        for (let y = y0 + 1; y < y0 + PAGE_H - 1; y++)
          for (let x = x0 + 1; x < x0 + PAGE_W - 1; x++) if (BAYER16[(y & 3) * 4 + (x & 3)]! < c * 16) ctx.fillRect(x, y, 1, 1);
      if (c < 1) return;
      ctx.fillStyle = '#3c3c3c';
      for (let r = 0; r < 3; r++) ctx.fillText('00 00 00 00', x0 + 4, y0 + 17 + r * 9, PAGE_W - 8);
      if (i === 0) {
        ctx.fillStyle = '#b01818';
        ctx.fillRect(x0 + 1, y0 + 1, 46, 9);
        ctx.fillStyle = '#ffd0d0';
        ctx.fillText('SIGSEGV', x0 + 3, y0 + 8);
      }
    });
  }
}
