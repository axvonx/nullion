import type { TierId } from '../core/tiers';

/**
 * Each tier reaction's timeline, as pure functions of the time since it started: what the screen does (hang, jiggle,
 * inversion or tint, black-out) and which pose the cursor takes. The scene draws from this; tests check its order
 * and its flash safety.
 *
 * Every tier plays its most notable part first, where the cursor is (LEAD_MS), then the cursor sinks, and the
 * reaction keeps going ("sustained") through the dive and while the reveal is up.
 */

/**
 * Bit Flip is the finale: it compounds every other tier's screen effect as an escalating cascade, in ms: hang (grey,
 * frozen), a page-fault run (the Null pointer reaction, played 1.5× faster), leaked copies, racing jiggle, and last the inversion, entered once and held.
 */
export const CASCADE = { hang: [0, 450], blackout: [300, 854], leakAt: 550, jiggle: [700, 1300], invert: [1300, 2000] } as const;

/**
 * Works on my machine is a full-length Bit Flip fake-out:
 *   0 → 2200 ms: mirrors Bit Flip's cascade with super-intense escalating shake of everything
 *   2200 ms (freeze):    snaps dead still in place — app hung, no gray yet (650 ms)
 *   2850 ms (gray):      washes out into "Not Responding" grayscale (600 ms)
 *   3450 ms (hourglass): reveals the hourglass cursor (800 ms)
 *   4250 ms (LEAD_MS):   forces a rigid, z-layer-bound +1 stack frame scroll
 * Enters inversion at most once (never strobes); under reduced motion the inversion is a static tint and jiggle is 0.
 */
export const WOMM = { jiggle: [700, 2200], freeze: 2200, gray: 2850, hourglass: 3450 } as const;

/** Heisenbug's glitch tints the screen from here on (a held tint, never a blink of inversion). */
export const TEASE_AT = 480;

/**
 * Null pointer exception dereferences an unmapped page. Page-aligned holes (a fixed grid, like 4 KiB pages) open
 * near the cursor one after another, hold as voids, then fault back in in the same order. Each page's cover only
 * rises, then only falls, in four coarse steps (a dithered dissolve, never a blink), so it cannot strobe.
 */
export const PAGE_FAULT = { pages: 5, appearGap: 70, appearDur: 60, restoreAt: 480, restoreGap: 55, restoreDur: 130, reducedHold: 600 } as const;
export const PAGE_FAULT_MS = PAGE_FAULT.restoreAt + (PAGE_FAULT.pages - 1) * PAGE_FAULT.restoreGap + PAGE_FAULT.restoreDur;
/** Bit Flip and Works on my machine play the page-fault run this much faster inside their cascade. */
export const CASCADE_PAGE_SPEED = 1.5;

/** Cover (0 = mapped, 1 = a void) of each page `t` ms into the run; empty outside it. Reduced motion: static voids that appear and go. */
export function pageCovers(t: number, reduced: boolean): number[] {
  const P = PAGE_FAULT;
  if (t < 0 || t >= (reduced ? P.reducedHold : PAGE_FAULT_MS)) return [];
  const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
  return Array.from({ length: P.pages }, (_, i) => {
    if (reduced) return 1;
    const up = clamp01((t - i * P.appearGap) / P.appearDur);
    const down = clamp01((t - (P.restoreAt + i * P.restoreGap)) / P.restoreDur);
    return Math.ceil(Math.min(up, 1 - down) * 4) / 4;
  });
}

/** The page-fault run inside Bit Flip's cascade (and Works on my machine's mirror of it). */
const cascadePages = (rel: number, reduced: boolean) => (within(rel, CASCADE.blackout) ? pageCovers((rel - CASCADE.blackout[0]) * CASCADE_PAGE_SPEED, reduced) : []);
/** Race condition and Heisenbug sustained: a calmer, continuing jiggle. */
export const HELD_JIGGLE = 0.4;

/** How long each reaction plays on its own, unsustained. */
export const REACTION_MS: Record<TierId, number> = {
  'off-by-one': 600,
  womm: 4400,
  npe: PAGE_FAULT_MS + 20,
  leak: 1600,
  race: 1000,
  heisenbug: 1400,
  bitflip: 2200,
};

/** How long each tier's notable part plays before its dive starts, in ms. */
export const LEAD_MS: Record<TierId, number> = {
  'off-by-one': 1250,
  womm: 4250,
  npe: PAGE_FAULT_MS + 20,
  leak: 1000,
  race: 1000,
  heisenbug: 1100,
  bitflip: 2200,
};

export const within = (t: number, [a, b]: readonly [number, number]) => t >= a && t < b;

export type CursorPose = 'own' | 'flipped' | 'hourglass';

export interface ReactionFrame {
  /** World clock & floating panels stop dead in place (no grayscale yet). */
  freeze: boolean;
  /** Grayscale "Not Responding" wash (also implies frozen). */
  hang: boolean;
  /** 0..~2.6 */
  jiggle: number;
  flip: 'none' | 'invert' | 'tint';
  /** Any page is a void this frame. */
  blackout: boolean;
  /** Page-fault cover per page (see pageCovers); empty when none. */
  pages: number[];
  cursor: CursorPose;
}

export const NO_REACTION: ReactionFrame = { freeze: false, hang: false, jiggle: 0, flip: 'none', blackout: false, pages: [], cursor: 'own' };

/** A reaction `rel` ms in; `sustained` while its dive or reveal holds it; `reduced` for reduced motion. */
export function reactionFrame(tier: TierId, rel: number, sustained: boolean, reduced: boolean): ReactionFrame {
  const f: ReactionFrame = { ...NO_REACTION };
  const fade = (a: number, b: number) => 1 - (rel - a) / (b - a);
  switch (tier) {
    case 'bitflip':
      f.hang = within(rel, CASCADE.hang);
      f.freeze = f.hang;
      f.pages = cascadePages(rel, reduced);
      f.blackout = f.pages.length > 0;
      f.jiggle = within(rel, CASCADE.jiggle) ? fade(...CASCADE.jiggle) : 0;
      if (sustained ? rel >= CASCADE.invert[0] : within(rel, CASCADE.invert)) f.flip = reduced ? 'tint' : 'invert';
      f.cursor = 'flipped';
      break;
    case 'womm':
      if (rel < WOMM.freeze) {
        // Mirrors Bit Flip's cascade up until the moment Bit Flip would sink, with super-intense escalating shake.
        f.hang = within(rel, CASCADE.hang);
        f.freeze = f.hang;
        f.pages = cascadePages(rel, reduced);
        f.blackout = f.pages.length > 0;
        if (within(rel, WOMM.jiggle)) {
          const p = (rel - WOMM.jiggle[0]) / (WOMM.jiggle[1] - WOMM.jiggle[0]);
          f.jiggle = 0.45 + 2.25 * p * p;
        }
        if (rel >= CASCADE.invert[0]) f.flip = reduced ? 'tint' : 'invert';
      } else {
        // Snap dead still first (freeze), then wash into grayscale at WOMM.gray.
        f.freeze = true;
        f.hang = rel >= WOMM.gray;
      }
      f.cursor = rel < WOMM.hourglass ? 'flipped' : 'hourglass';
      break;
    case 'race':
    case 'heisenbug':
      f.jiggle = Math.max(sustained ? HELD_JIGGLE : 0, 1 - rel / REACTION_MS[tier]);
      if (tier === 'heisenbug' && (reduced || rel >= TEASE_AT)) f.flip = 'tint';
      break;
    case 'npe':
      f.pages = pageCovers(rel, reduced);
      f.blackout = f.pages.length > 0;
      break;
    case 'off-by-one':
    case 'leak':
      break;
  }
  if (reduced) f.jiggle = 0;
  return f;
}

/**
 * The reveal's frame-buffer degrade: block size, in scene pixels, by how far in (0..1) the reveal is. It steps
 * 1 → 2 → 4 → 8 on the way in and 8 → 4 → 2 → 1 on the way out (the scene eases `a` both ways).
 */
const BUFFER_STEPS: readonly [number, number][] = [[0.2, 1], [0.45, 2], [0.7, 4], [1.01, 8]];
export function bufferBlock(a: number): number {
  const step = BUFFER_STEPS.find(([upTo]) => a < upTo);
  if (!step) throw new Error(`bufferBlock: progress ${a} out of range`);
  return step[1];
}
