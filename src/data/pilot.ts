import { enforce } from '../core/enforce';
import { TIER_IDS, type TierId } from '../core/tiers';
import generated from './generated/pilot.json';
import { SAMPLE_TERMS, type Term } from './sample';

/**
 * Pilot answer set: the hand-written sample, with its categories replaced by corpus-scored ones
 * (scripts/score-candidates.py) wherever the pilot covers them. Lets the two be compared in play.
 */
interface GeneratedFile {
  tags: string[];
  terms: { name: string; aliases?: string[]; tags: Record<string, string> }[];
}

// JSON imports are typed structurally from the file; validate the shape at load instead of trusting a cast.
const gen = generated as unknown as GeneratedFile;
enforce(Array.isArray(gen.tags) && Array.isArray(gen.terms), 'pilot.json: expected { tags: [], terms: [] }');
for (const t of gen.terms) {
  enforce(typeof t.name === 'string' && t.name.length > 0, 'pilot.json: term without a name');
  enforce(t.tags && typeof t.tags === 'object', `pilot.json: ${t.name} has no tags`);
}
const replaced = new Set(gen.tags);

function asTier(t: string, where: string): TierId {
  enforce((TIER_IDS as readonly string[]).includes(t), `${where}: unknown tier ${t}`);
  return t as TierId;
}

const kept: Term[] = SAMPLE_TERMS.flatMap((t) => {
  const tags = Object.fromEntries(Object.entries(t.tags).filter(([tag]) => !replaced.has(tag)));
  return Object.keys(tags).length ? [{ ...t, tags }] : [];
});

const pilotTerms: Term[] = gen.terms.map((t) => ({
  name: t.name,
  ...(t.aliases ? { aliases: t.aliases } : {}),
  tags: Object.fromEntries(Object.entries(t.tags).map(([tag, tier]) => [tag, asTier(tier, t.name)])),
}));

export const PILOT_TERMS: readonly Term[] = [...kept, ...pilotTerms];
