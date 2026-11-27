import type { StackMode } from '../core/layers';

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
  const title = i.mode !== 'daily' ? 'nullion endless' : `nullion #${i.puzzle}`;
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
