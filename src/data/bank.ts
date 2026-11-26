import { enforce } from '../core/enforce';
import { TIER_IDS, type TierId } from '../core/tiers';
import type { Term } from './sample';

/**
 * Generated categories: one JSON file per category tag, written by scripts/score-candidates.py into
 * src/data/generated/categories/<tag>.json. Each file is its own lazy chunk, so a day fetches only the
 * categories it plays rather than the whole bank.
 */
interface CategoryFile {
  tag: string;
  terms: { name: string; aliases?: string[]; tier: string }[];
}

const FILES = import.meta.glob('./generated/categories/*.json', { import: 'default' }) as Record<string, () => Promise<unknown>>;

const LOADERS = new Map<string, () => Promise<unknown>>();
for (const [path, load] of Object.entries(FILES)) {
  const m = /\/([^/]+)\.json$/.exec(path);
  enforce(m, `bank: unexpected category path ${path}`);
  LOADERS.set(m[1]!, load);
}

/** Tags that have a generated category file. */
export const GENERATED_TAGS: ReadonlySet<string> = new Set(LOADERS.keys());

function asTier(t: unknown, where: string): TierId {
  enforce(typeof t === 'string' && (TIER_IDS as readonly string[]).includes(t), `${where}: unknown tier ${String(t)}`);
  return t as TierId;
}

/** Validate a category file's shape: JSON is typed structurally, so check it instead of trusting a cast. */
export function parseCategory(tag: string, raw: unknown): Term[] {
  const f = raw as CategoryFile;
  enforce(f && typeof f === 'object' && Array.isArray(f.terms), `${tag}.json: expected { tag, terms: [] }`);
  enforce(f.tag === tag, `${tag}.json: file declares tag ${String(f.tag)}`);
  return f.terms.map((t) => {
    enforce(typeof t.name === 'string' && t.name.length > 0, `${tag}.json: term without a name`);
    enforce(t.aliases === undefined || (Array.isArray(t.aliases) && t.aliases.every((a) => typeof a === 'string')), `${tag}.json: ${t.name} has bad aliases`);
    return { name: t.name, ...(t.aliases ? { aliases: t.aliases } : {}), tags: { [tag]: asTier(t.tier, `${tag}.json: ${t.name}`) } };
  });
}

export async function loadCategory(tag: string): Promise<Term[]> {
  const load = LOADERS.get(tag);
  enforce(load, `bank: no generated category ${tag}`);
  return parseCategory(tag, await load());
}
