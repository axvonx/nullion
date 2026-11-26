import { GENERATED_TAGS, loadCategory } from './bank';
import { SAMPLE_TERMS, type Term } from './sample';

/**
 * Pilot answer set: the hand-written sample, with its categories replaced by corpus-scored ones
 * (scripts/score-candidates.py) wherever a generated file exists. Lets the two be compared in play.
 * Loads only the requested tags.
 */
export async function loadPilotTerms(tags: readonly string[]): Promise<Term[]> {
  const wanted = new Set(tags);
  const generated = [...wanted].filter((t) => GENERATED_TAGS.has(t));
  const kept: Term[] = SAMPLE_TERMS.flatMap((t) => {
    const keep = Object.entries(t.tags).filter(([tag]) => wanted.has(tag) && !GENERATED_TAGS.has(tag));
    return keep.length ? [{ ...t, tags: Object.fromEntries(keep) }] : [];
  });
  const loaded = await Promise.all(generated.map(loadCategory));
  return [...kept, ...loaded.flat()];
}
