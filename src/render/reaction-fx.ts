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
 * frozen), a black-out, leaked copies, racing jiggle, and last the inversion, entered once and held.
 */
export const CASCADE = { hang: [0, 450], blackout: [300, 700], leakAt: 550, jiggle: [700, 1300], invert: [1300, 2000] } as const;

/**
 * Works on my machine is a fake-out: it opens like a Bit Flip (the cursor's 0/1 flips, a black-out pulse, the jiggle
 * starts), then stalls into gray and freezes, the cursor turns into the hourglass, and it makes only a small drop.
 * The fake never inverts (nothing to flash); under reduced motion it is a static tint, then the gray.
 */
export const WOMM = { blackout: [100, 450], jiggle: [300, 800], stall: 800, hourglass: 1050 } as const;

/** Heisenbug's glitch tints the screen from here on (a held tint, never a blink of inversion). */
export const TEASE_AT = 480;
export const NPE_MS = 460;
/** Race condition and Heisenbug sustained: a calmer, continuing jiggle. */
export const HELD_JIGGLE = 0.4;

/** How long each reaction plays on its own, unsustained. */
export const REACTION_MS: Record<TierId, number> = {
  'off-by-one': 600,
  womm: 1400,
  npe: 500,
  leak: 1600,
  race: 1000,
  heisenbug: 1400,
  bitflip: 2200,
};

/** How long each tier's notable part plays before its dive starts, in ms. */
export const LEAD_MS: Record<TierId, number> = {
  'off-by-one': 1250,
  womm: 1500,
  npe: 800,
  leak: 1000,
  race: 1000,
  heisenbug: 1100,
  bitflip: 2200,
};

export const within = (t: number, [a, b]: readonly [number, number]) => t >= a && t < b;

export type CursorPose = 'own' | 'flipped' | 'hourglass';

export interface ReactionFrame {
  hang: boolean;
  /** 0..1 */
  jiggle: number;
  flip: 'none' | 'invert' | 'tint';
  blackout: boolean;
  cursor: CursorPose;
}

export const NO_REACTION: ReactionFrame = { hang: false, jiggle: 0, flip: 'none', blackout: false, cursor: 'own' };

/** A reaction `rel` ms in; `sustained` while its dive or reveal holds it; `reduced` for reduced motion. */
export function reactionFrame(tier: TierId, rel: number, sustained: boolean, reduced: boolean): ReactionFrame {
  const f: ReactionFrame = { ...NO_REACTION };
  const fade = (a: number, b: number) => 1 - (rel - a) / (b - a);
  switch (tier) {
    case 'bitflip':
      f.hang = within(rel, CASCADE.hang);
      f.blackout = within(rel, CASCADE.blackout);
      f.jiggle = within(rel, CASCADE.jiggle) ? fade(...CASCADE.jiggle) : 0;
      if (sustained ? rel >= CASCADE.invert[0] : within(rel, CASCADE.invert)) f.flip = reduced ? 'tint' : 'invert';
      f.cursor = 'flipped';
      break;
    case 'womm':
      if (rel < WOMM.stall) {
        f.blackout = within(rel, WOMM.blackout);
        f.jiggle = within(rel, WOMM.jiggle) ? fade(...WOMM.jiggle) : 0;
        if (reduced) f.flip = 'tint';
      } else f.hang = true;
      f.cursor = rel < WOMM.hourglass ? 'flipped' : 'hourglass';
      break;
    case 'race':
    case 'heisenbug':
      f.jiggle = Math.max(sustained ? HELD_JIGGLE : 0, 1 - rel / REACTION_MS[tier]);
      if (tier === 'heisenbug' && (reduced || rel >= TEASE_AT)) f.flip = 'tint';
      break;
    case 'npe':
      f.blackout = rel < NPE_MS || sustained;
      break;
    case 'off-by-one':
    case 'leak':
      break;
  }
  if (reduced) f.jiggle = 0;
  return f;
}
