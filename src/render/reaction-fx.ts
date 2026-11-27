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
 * frozen), a page-fault run (the Null pointer reaction, played 1.5× faster), leaked copies, racing jiggle, the dimmed
 * "ONE IN A / NULLION" sparkling glitch buildup, and at 2200 ms the climax inversion (entered once and held).
 */
export const CASCADE = { hang: [0, 450], blackout: [300, 854], leakAt: 550, jiggle: [700, 2750], invert: [2750, 4550] } as const;

/**
 * "ONE IN A / NULLION" dramatic buildup shared by Bit Flip and Works on my machine:
 *   750 ms  (topAt):    background dims dark; row 1 ("ONE IN A") sparkles into existence with subtle glitches
 *   1050 ms (bottomAt): row 2 ("NULLION") sparkles into existence right below it (persists ~2s total)
 *   2750 ms (climaxAt): Bit Flip lights up inverted & locks crisp until 4050 ms (dissolving into the +13 dive);
 *                       Works on my machine hard-cuts to silence, freezes mid-glitch until 3450 ms, then washes gray.
 */
export const NULLION_BANNER = { topAt: 750, bottomAt: 1050, sparkDur: 360, climaxAt: 2750, holdEnd: 4050 } as const;

/**
 * Works on my machine is a full-length Bit Flip fake-out:
 *   0 → 2750 ms: mirrors Bit Flip's entire cascade & "ONE IN A / NULLION" buildup (with escalating shake)
 *   2750 ms (freeze):    right before the high note & inversion, snaps dead still in place — hung, no gray yet (700 ms)
 *   3450 ms (gray):      washes out into "Not Responding" grayscale and drops the banner (600 ms)
 *   4050 ms (hourglass): reveals the hourglass cursor (800 ms)
 *   4850 ms (LEAD_MS):   forces a rigid, z-layer-bound +1 stack frame scroll
 * Never strobes; under reduced motion jiggle is 0.
 */
export const WOMM = { jiggle: [700, 2750], freeze: 2750, gray: 3450, hourglass: 4050 } as const;

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

/**
 * How fast a jiggle wobbles: 1 is the reaction's own pace; held under the reveal it flickers 30% less often (owner,
 * 2026-11-27), with the same props and reach. The reveal's black region never shows it (Scene.revealStill).
 */
export function jiggleSlow(jiggle: number): number {
  return jiggle <= HELD_JIGGLE ? 1 / 0.7 : 1;
}

/**
 * The floor under how often a held jiggle may change: at most one new position per FLICKER_FLOOR_MS (4 a second),
 * whatever its wobble speed (owner, 2026-11-27: "some absolute floor to frequency"). The live reaction is exempt.
 */
export const FLICKER_FLOOR_MS = 250;

/** The clock a jiggle samples: the real one while it plays, stepped to FLICKER_FLOOR_MS once held. */
export function jiggleClock(now: number, jiggle: number): number {
  return jiggle <= HELD_JIGGLE ? Math.floor(now / FLICKER_FLOOR_MS) * FLICKER_FLOOR_MS : now;
}

/** How many props a jiggle moves. */
export function jiggleProps(_jiggle: number): number {
  return 26;
}

/** How far a jiggle moves. */
export function jiggleReach(jiggle: number): number {
  return jiggle;
}

/** How long each reaction plays on its own, unsustained. */
export const REACTION_MS: Record<TierId, number> = {
  'off-by-one': 600,
  womm: 5000,
  npe: PAGE_FAULT_MS + 20,
  leak: 1600,
  race: 1000,
  heisenbug: 1400,
  bitflip: 4550,
};

/** How long each tier's notable part plays before its dive starts, in ms. */
export const LEAD_MS: Record<TierId, number> = {
  'off-by-one': 1250,
  womm: 4850,
  npe: PAGE_FAULT_MS + 20,
  leak: 1000,
  race: 1000,
  heisenbug: 1100,
  bitflip: 3900,
};

export const within = (t: number, [a, b]: readonly [number, number]) => t >= a && t < b;

export type CursorPose = 'own' | 'flipped' | 'hourglass';

export interface NullionBannerState {
  /** 0..1 pixel-sparkle materialization progress for row 1 ("ONE IN A"). */
  top: number;
  /** 0..1 pixel-sparkle materialization progress for row 2 ("NULLION"). */
  bottom: number;
  /** 0..1 background dim strength behind the words (0 once Bit Flip lights up inverted). */
  dim: number;
  /** True once Bit Flip hits the high note & lights up inverted (crisp triumph beat before dissolving). */
  locked: boolean;
  /** 0..1 outward dissolve progress during Bit Flip's post-climax release. */
  dissolve: number;
  /** True while Works on my machine holds the words frozen mid-glitch right before graying out. */
  frozen: boolean;
}

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
  /** Active "ONE IN A / NULLION" sequence state, if any. */
  banner: NullionBannerState | null;
  cursor: CursorPose;
}

export const NO_REACTION: ReactionFrame = { freeze: false, hang: false, jiggle: 0, flip: 'none', blackout: false, pages: [], banner: null, cursor: 'own' };

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

function bannerState(tier: 'bitflip' | 'womm', rel: number, reduced: boolean): NullionBannerState | null {
  const B = NULLION_BANNER;
  if (rel < B.topAt) return null;
  if (tier === 'bitflip') {
    if (rel >= B.holdEnd) return null;
    const locked = rel >= B.climaxAt;
    const top = reduced || locked ? 1 : clamp01((rel - B.topAt) / B.sparkDur);
    const bottom = reduced || locked ? 1 : clamp01((rel - B.bottomAt) / B.sparkDur);
    // Keep the backdrop dim for a crisp inverted readability beat (450ms), then fade it back into view before diving.
    const dimFadeStart = B.climaxAt + 450;
    const dimFadeDur = 350;
    const dim = locked
      ? reduced
        ? 0
        : (1 - clamp01((rel - dimFadeStart) / dimFadeDur)) * 0.94
      : reduced
        ? 0.92
        : clamp01((rel - B.topAt) / 220) * 0.94;
    const dissolveStart = B.holdEnd - 300;
    const dissolve = locked ? clamp01((rel - dissolveStart) / (B.holdEnd - dissolveStart)) : 0;
    return { top, bottom, dim, locked, dissolve, frozen: false };
  }
  // Works on my machine: identical dark-stage buildup up to WOMM.freeze, freezes mid-glitch in color until WOMM.gray,
  // then stays on screen while #app.hang washes it (and the world) into flat grayscale until WOMM.hourglass.
  if (rel >= WOMM.hourglass) return null;
  const frozen = rel >= WOMM.freeze;
  const tEff = frozen ? WOMM.freeze : rel;
  const top = reduced ? 1 : clamp01((tEff - B.topAt) / B.sparkDur);
  const bottom = reduced ? 1 : clamp01((tEff - B.bottomAt) / B.sparkDur);
  const baseDim = reduced ? 0.92 : clamp01((tEff - B.topAt) / 220) * 0.94;
  const dim = rel >= WOMM.gray ? 0.62 : baseDim;
  return { top, bottom, dim, locked: false, dissolve: 0, frozen };
}

/** A reaction `rel` ms in; `sustained` while its dive or reveal holds it; `reduced` for reduced motion. */
export function reactionFrame(tier: TierId, rel: number, sustained: boolean, reduced: boolean): ReactionFrame {
  const f: ReactionFrame = { ...NO_REACTION };
  switch (tier) {
    case 'bitflip':
      f.hang = within(rel, CASCADE.hang);
      f.freeze = f.hang;
      f.pages = cascadePages(rel, reduced);
      f.blackout = f.pages.length > 0;
      if (within(rel, CASCADE.jiggle)) {
        const p = (rel - CASCADE.jiggle[0]) / (CASCADE.jiggle[1] - CASCADE.jiggle[0]);
        f.jiggle = 0.45 + 2.25 * p * p;
      }
      if (sustained ? rel >= CASCADE.invert[0] : within(rel, CASCADE.invert)) f.flip = reduced ? 'tint' : 'invert';
      f.banner = bannerState('bitflip', rel, reduced);
      f.cursor = 'flipped';
      break;
    case 'womm':
      if (rel < WOMM.freeze) {
        // Mirrors Bit Flip's entire cascade & "ONE IN A / NULLION" buildup right up to the high note.
        f.hang = within(rel, CASCADE.hang);
        f.freeze = f.hang;
        f.pages = cascadePages(rel, reduced);
        f.blackout = f.pages.length > 0;
        if (within(rel, WOMM.jiggle)) {
          const p = (rel - WOMM.jiggle[0]) / (WOMM.jiggle[1] - WOMM.jiggle[0]);
          f.jiggle = 0.45 + 2.25 * p * p;
        }
      } else {
        // Snap dead still first (freeze), then wash into grayscale at WOMM.gray.
        f.freeze = true;
        f.hang = rel >= WOMM.gray;
      }
      f.banner = bannerState('womm', rel, reduced);
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

/**
 * A reaction that lands with its dive waits this long for the reveal to hold it. In play the HUD opens the reveal on
 * its next update after the landing frame; without this grace the reaction ended in between and the reveal held
 * nothing (the leak's cursor ghosts, off-by-one's stepping and the rest vanished in play, though not in demos).
 */
export const LANDING_GRACE_MS = 500;

/**
 * Whether the cursor's reaction is still playing: within its own run, sustained (held by the reveal, or carried by a
 * dive that is still moving), or just landed and waiting the grace period for the reveal to hold it.
 */
export function reactionAlive(elapsedMs: number, tier: TierId, sustained: boolean, sinceLandingMs: number): boolean {
  return elapsedMs <= REACTION_MS[tier] || sustained || sinceLandingMs <= LANDING_GRACE_MS;
}
