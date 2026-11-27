import { enforce } from './enforce';

/**
 * Answer tiers, shallow → deep. Ordered by "how hard is this bug to reproduce".
 * Frames are the fixed amount of depth an accepted answer pushes onto the backtrace.
 * `womm` mirrors krillion's "Too Clever": the go-to "obscure" pick that everyone reaches for.
 */
export const TIER_IDS = ['off-by-one', 'womm', 'npe', 'leak', 'race', 'heisenbug', 'bitflip'] as const;
export type TierId = (typeof TIER_IDS)[number];

export interface Tier {
  id: TierId;
  name: string;
  /** The Wikipedia article for the bug this tier is named after, or null where none exists (Works on my machine). */
  wiki: string | null;
  frames: number;
  /** One glyph per tier for the share text. */
  glyph: string;
  /** Short line shown when you land it. */
  blurb: string;
}

const TIER_LIST: readonly Tier[] = [
  { id: 'off-by-one', wiki: 'https://en.wikipedia.org/wiki/Off-by-one_error', name: 'Off-by-one', frames: 1, glyph: '⬜', blurb: 'Everyone hits this one.' },
  { id: 'womm', wiki: null, name: 'Works on my machine', frames: 1, glyph: '⌛', blurb: 'The "obscure" pick everyone reaches for.' },
  { id: 'npe', wiki: 'https://en.wikipedia.org/wiki/Null_pointer', name: 'Null pointer exception', frames: 2, glyph: '🕳️', blurb: 'Common, but it still bites.' },
  { id: 'leak', wiki: 'https://en.wikipedia.org/wiki/Memory_leak', name: 'Memory leak', frames: 3, glyph: '💧', blurb: 'Slips past most people.' },
  { id: 'race', wiki: 'https://en.wikipedia.org/wiki/Race_condition', name: 'Race condition', frames: 5, glyph: '🏁', blurb: 'Only shows up sometimes.' },
  { id: 'heisenbug', wiki: 'https://en.wikipedia.org/wiki/Heisenbug', name: 'Heisenbug', frames: 8, glyph: '👻', blurb: 'Vanishes when most people look.' },
  { id: 'bitflip', wiki: 'https://en.wikipedia.org/wiki/Soft_error', name: 'Bit Flip', frames: 13, glyph: '⚡', blurb: 'The one-in-a-billion answer.' },
];

export const TIERS: Readonly<Record<TierId, Tier>> = Object.fromEntries(TIER_LIST.map((t) => [t.id, t])) as Record<
  TierId,
  Tier
>;

export const MAX_TIER_FRAMES = Math.max(...TIER_LIST.map((t) => t.frames));

export function tier(id: TierId): Tier {
  const t = TIERS[id];
  enforce(t, `unknown tier ${id}`);
  return t;
}
