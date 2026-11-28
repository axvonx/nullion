import type { StackMode } from '../core/layers';
import { rulesFor } from '../core/modes';
import { TIER_IDS, TIERS, type TierId } from '../core/tiers';

/** The glyph for a round that ended without an answer. */
export const MISS_GLYPH = '⬛';

/**
 * The share's glyph line for a game's rounds (oldest first; null = no answer). 'row': one glyph per round. 'tally':
 * a count per tier, deepest first, then misses ("⚡1 👻2 🏁4 💧6 🕳️9 ⬜12 ⬛3"): a long run stays one short line,
 * and no emoji is ever cut in half.
 */
export function glyphLine(rounds: readonly (TierId | null)[], style: 'row' | 'tally'): string {
  if (style === 'row') return rounds.map((t) => (t ? TIERS[t].glyph : MISS_GLYPH)).join('');
  const parts: string[] = [];
  for (const id of [...TIER_IDS].reverse()) {
    const n = rounds.filter((t) => t === id).length;
    if (n) parts.push(`${TIERS[id].glyph}${n}`);
  }
  const misses = rounds.filter((t) => t === null).length;
  if (misses) parts.push(`${MISS_GLYPH}${misses}`);
  return parts.join(' ');
}

export interface ShareInput {
  mode: StackMode;
  puzzle: number;
  /** "N frames · Layer" (Endless prefixes its own banner). */
  headline: string;
  /** One tier glyph (or a miss) per round, no digits, no frame scores. */
  glyphs: string;
  /** location.origin + location.pathname: no query string, no hash. */
  url: string;
}

/** The share text: `nullion #N`, the depth and layer line, the glyph row, then the site URL. */
export function buildShareText(i: ShareInput): string {
  const title = rulesFor(i.mode).shareTitle(i.puzzle);
  return `${title}\n${i.headline}\n${i.glyphs}\n${i.url}`;
}

export function siteUrl(loc: Pick<Location, 'origin' | 'pathname'>): string {
  return loc.origin + loc.pathname;
}

export type ShareResult = 'shared' | 'copied' | 'cancelled' | 'failed';

/** Native share where it exists, the clipboard as the fallback. Failures are reported, never swallowed. */
export async function deliverShare(
  text: string,
  nav: { share?: (d: { text: string }) => Promise<void>; clipboard?: { writeText(t: string): Promise<void> } },
): Promise<ShareResult> {
  if (nav.share) {
    try {
      await nav.share({ text });
      return 'shared';
    } catch (e) {
      if (e instanceof DOMException && e.name === 'AbortError') return 'cancelled';
      // Any other share failure falls through to the clipboard.
    }
  }
  if (!nav.clipboard) return 'failed';
  try {
    await nav.clipboard.writeText(text);
    return 'copied';
  } catch {
    return 'failed';
  }
}
