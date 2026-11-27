import type { CategoryEntry } from '../core/match';
import type { TierId } from '../core/tiers';

/**
 * The end-of-day answer sheet for one prompt: every answer of the loaded set grouped by its own tier, deepest
 * first (Works on my machine is its own group, last). Each group shows a few answers chosen deterministically
 * from the puzzle number and question id, so everyone sees the same ones, and keeps the rest behind "+N more".
 */

export const SHEET_TIER_ORDER: readonly TierId[] = ['bitflip', 'heisenbug', 'race', 'leak', 'npe', 'off-by-one', 'womm'];
export const SHEET_SHOWN = 8;

export interface SheetGroup {
  tier: TierId;
  total: number;
  /** The up-to-SHEET_SHOWN picks (always including the player's own answer), alphabetical. */
  shown: CategoryEntry[];
  /** The whole tier, alphabetical: what "+N more" expands to. */
  all: CategoryEntry[];
}

/** FNV-1a, 32 bit: a stable string hash for the seeded pick. */
function fnv(s: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

const byName = (a: CategoryEntry, b: CategoryEntry) => a.name.localeCompare(b.name);

/** Groups with at least one answer, in SHEET_TIER_ORDER. `own` is the player's answer, kept visible in its group. */
export function answerSheet(entries: readonly CategoryEntry[], puzzle: number, questionId: string, own?: string): SheetGroup[] {
  const groups: SheetGroup[] = [];
  for (const tier of SHEET_TIER_ORDER) {
    const all = entries.filter((e) => e.tier === tier).sort(byName);
    if (all.length === 0) continue;
    const ownEntry = all.find((e) => e.name === own);
    const pool = all.filter((e) => e !== ownEntry).sort((a, b) => fnv(`${puzzle}|${questionId}|${a.name}`) - fnv(`${puzzle}|${questionId}|${b.name}`));
    const shown = [...(ownEntry ? [ownEntry] : []), ...pool.slice(0, SHEET_SHOWN - (ownEntry ? 1 : 0))].sort(byName);
    groups.push({ tier, total: all.length, shown, all });
  }
  return groups;
}
