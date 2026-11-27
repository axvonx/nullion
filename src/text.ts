import WRITING from 'virtual:writing';
import { enforce } from './core/enforce';
import { fillVars, parseWriting, type WritingString } from './data/writing-format';

/**
 * The game's words. Everything the player reads that carries voice lives in writing/<surface>.md (grammar:
 * src/data/writing-format.ts); the plugin in vite.config.ts compiles those files into `virtual:writing`.
 *
 *   text('reveal.timeout.rejected', { guess })   one paragraph, with its {vars} filled
 *   variants('reveal.quip.leak')                 a `- ` list, each with its {vars} filled
 *
 * Pass the key as a string literal (writing.test.ts finds uses by grepping for them) and put variables in `{vars}`,
 * never by gluing sentences together in code. An unknown key, a paragraph read as a list (or the reverse) or a
 * var mismatch throws: it is a bug in the code or the catalog, never a quiet fallback.
 */
const CATALOG: ReadonlyMap<string, WritingString> = parseWriting(WRITING);

export type TextVars = Record<string, string | number>;

function entry(key: string, list: boolean): WritingString {
  const s = CATALOG.get(key);
  enforce(s, `no text '${key}' in writing/`);
  enforce(s.list === list, `text '${key}' is ${s.list ? 'a "- " list: use variants()' : 'a paragraph: use text()'}`);
  return s;
}

/** A paragraph string, its `{vars}` filled in. */
export function text(key: string, vars?: TextVars): string {
  const s = entry(key, false);
  return fillVars(key, s.texts[0]!, s.vars, vars);
}

/** A list string: every variant, its `{vars}` filled in. */
export function variants(key: string, vars?: TextVars): readonly string[] {
  const s = entry(key, true);
  return s.texts.map((t) => fillVars(key, t, s.vars, vars));
}

/** The whole catalog, for the checks and the report. */
export function writingCatalog(): ReadonlyMap<string, WritingString> {
  return CATALOG;
}
