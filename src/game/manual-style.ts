import { ALL_LAYER_IDS, LAYERS, type LayerId } from '../core/layers';
import type { ManualEntry, ManualSighting } from './manual';

/**
 * The mechanical half of the Field Manual style guide (research/field-manual-style-guide.md).
 *
 * `styleProblems` checks one entry against the rules a computer can check: lengths, character classes, tag shape,
 * sentence counts, forbidden words, and references. It returns human-readable problems; an empty array is clean.
 * Judgement rules (voice, whether a fact is true, whether a NAME is a pun) stay in the guide for a reviewer.
 *
 * Pure and DOM-free. The numeric limits are exported so the guide and the code name the same numbers.
 */

export const ID_MAX = 40;
export const NAME_MAX = 40;
export const NAME_MAX_WORDS = 4;
export const TAG_BASE_MAX = 14;
export const BLURB_MAX = 140;
export const NOTE_MAX = 160;
export const BUGS_MAX = 110;
export const BUGS_REQUIRED = false; // decided 2026-11-27: BUGS is optional
/** The locked page's pencilled rumour: hand-written (decided 2026-11-27), one line. */
export const RUMOUR_MAX = 80;
export const RUMOUR_REQUIRED = true;
export const SEE_ALSO_MAX = 3;
export const DETAIL_NOTE_MAX = 90;

const ID_RE = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const TAG_BASE_RE = /^[A-Z][A-Z0-9]*(-[A-Z0-9]+)*$/;
const TAG_SUFFIX_RE = /^\((\d+)\)$/;
const SECOND_PERSON = /\b(you|your|yours|yourself)\b/i;
const EMOJI = /\p{Extended_Pictographic}/u;
const CONTROL = /[\u0000-\u001f\u007f]/;
const TIER_WORD = /\b(common|uncommon|rare|mythic)\b/i;
const ABBREVIATION = /\b(e\.g|i\.e|etc|vs|approx)\./i;
const ARTICLES = new Set(['a', 'an', 'the']);
/** Words that add nothing to a NAME but still cost a permuted-index row. */
export const NAME_FILLER = new Set(['thing', 'things', 'stuff', 'some', 'very', 'really', 'just', 'always', 'never', 'kind', 'sort', 'ones', 'one']);
/** Hype words the register rules out. */
export const MARKETING_WORDS = new Set([
  'amazing',
  'awesome',
  'epic',
  'ultimate',
  'legendary',
  'incredible',
  'insane',
  'crazy',
  'super',
  'mega',
  'cool',
  'fun',
  'wow',
  'magical',
]);

const KINDS = new Set(['critter', 'prop', 'anomaly']);
const DAILY = new Set<LayerId>(LAYERS.map((l) => l.id));

function words(text: string): string[] {
  return text.toLowerCase().match(/[\p{L}\p{N}-]+/gu) ?? [];
}

function sentenceCount(text: string): number {
  return text.trim().split(/(?<=[.?])\s+/).filter(Boolean).length;
}

/** Hygiene every authored string must pass: spacing, control characters, and a few banned characters and words. */
function textProblems(label: string, text: string): string[] {
  const out: string[] = [];
  if (text !== text.trim()) out.push(`${label} has leading or trailing spaces`);
  if (text.includes('  ')) out.push(`${label} has a double space`);
  if (CONTROL.test(text)) out.push(`${label} contains a control character or a line break`);
  if (text.includes('!')) out.push(`${label} uses an exclamation mark`);
  if (EMOJI.test(text)) out.push(`${label} contains an emoji`);
  if (SECOND_PERSON.test(text)) out.push(`${label} addresses the reader as "you"`);
  const hype = words(text).find((w) => MARKETING_WORDS.has(w));
  if (hype) out.push(`${label} uses marketing language ("${hype}")`);
  return out;
}

/** Prose (DESCRIPTION, BUGS, detail notes) must also keep rarity out of the text: the binder shows it separately. */
function proseProblems(label: string, text: string): string[] {
  const out = textProblems(label, text);
  if (text.includes('%')) out.push(`${label} states a percentage; rarity is shown separately`);
  const tier = text.match(TIER_WORD);
  if (tier) out.push(`${label} names a rarity tier ("${tier[0]}"); rarity is shown separately`);
  return out;
}

/** One sentence, ending in a full stop, with no abbreviations whose stops would confuse the count. */
function singleSentenceProblems(label: string, text: string, max: number): string[] {
  const out: string[] = [];
  if (text.trim() === '') return [`${label} is empty`];
  if (text.length > max) out.push(`${label} is ${text.length} characters; the limit is ${max}`);
  if (sentenceCount(text) !== 1) out.push(`${label} must be exactly one sentence (found ${sentenceCount(text)})`);
  if (!text.trim().endsWith('.')) out.push(`${label} must end with a full stop`);
  if (ABBREVIATION.test(text)) out.push(`${label} uses an abbreviation with stops (e.g., i.e., etc.); write it out`);
  return out;
}

/** The chapter number of an entry's home: its shallowest Daily sighting, in descent order (Application = 1). */
function dailyHome(e: ManualEntry): { sighting: ManualSighting; chapter: number } | undefined {
  const s = e.sightings.find((x) => DAILY.has(x.layer));
  if (!s) return undefined;
  return { sighting: s, chapter: LAYERS.findIndex((l) => l.id === s.layer) + 1 };
}

function sightingProblems(e: ManualEntry): string[] {
  const out: string[] = [];
  if (e.sightings.length === 0) out.push('needs at least one sighting');
  let lastRank = -1;
  const layers = new Set<string>();
  for (const s of e.sightings) {
    const rank = ALL_LAYER_IDS.indexOf(s.layer);
    if (rank < 0) out.push(`sighting names unknown layer "${s.layer}"`);
    else {
      if (rank < lastRank) out.push(`sightings must run shallowest first; "${s.layer}" comes after a deeper layer`);
      lastRank = Math.max(lastRank, rank);
    }
    if (layers.has(s.layer)) out.push(`two sightings on layer "${s.layer}"`);
    layers.add(s.layer);

    if (e.kind === 'critter' && s.critterLayer !== s.layer)
      out.push(`critter sighting on "${s.layer}" must set critterLayer to the same layer`);
    if (e.kind === 'anomaly' && !s.topicId) out.push(`anomaly sighting on "${s.layer}" needs a topicId`);
    if (e.kind !== 'critter' && s.critterLayer) out.push(`only critters set critterLayer (sighting on "${s.layer}")`);
    if (e.kind !== 'anomaly' && s.topicId) out.push(`only anomalies set topicId (sighting on "${s.layer}")`);
    if (e.kind === 'anomaly' && s.entityId) out.push(`anomaly sighting on "${s.layer}" must not set entityId`);

    if (s.detailNote !== undefined) {
      const label = `detailNote on "${s.layer}"`;
      if (s.detailNote.length > DETAIL_NOTE_MAX)
        out.push(`${label} is ${s.detailNote.length} characters; the limit is ${DETAIL_NOTE_MAX}`);
      if (/[\r\n]/.test(s.detailNote)) out.push(`${label} must be one line`);
      out.push(...proseProblems(label, s.detailNote));
    }
  }
  return out;
}

function tagProblems(e: ManualEntry, all: readonly ManualEntry[]): string[] {
  const out: string[] = [];
  const paren = e.manTag.indexOf('(');
  const base = paren < 0 ? e.manTag : e.manTag.slice(0, paren);
  const suffix = paren < 0 ? undefined : e.manTag.slice(paren);
  if (!TAG_BASE_RE.test(base)) out.push(`manTag base "${base}" must be UPPERCASE words joined by hyphens, like LOCK-NESS`);
  if (base.length > TAG_BASE_MAX) out.push(`manTag base is ${base.length} characters; the limit is ${TAG_BASE_MAX}`);
  if (all.filter((x) => x.manTag.split('(')[0] === base).length > 1) out.push(`manTag base "${base}" is shared with another entry`);

  if (suffix !== undefined) {
    const home = dailyHome(e);
    const m = TAG_SUFFIX_RE.exec(suffix);
    if (!home) out.push(`manTag suffix "${suffix}" on an Endless-only entry; write the base alone`);
    else if (!m) out.push(`manTag suffix "${suffix}" must be the chapter number like (4); the binder adds it, so write the base alone`);
    else if (Number(m[1]) !== home.chapter)
      out.push(`manTag says chapter ${m[1]} but the home chapter (first Daily sighting, "${home.sighting.layer}") is ${home.chapter}`);
  }
  return out;
}

/**
 * Every mechanical style problem with `e`, given the whole registry `all` (needed for uniqueness and references).
 * Each message starts with the entry id so a failing check names its entry.
 */
export function styleProblems(e: ManualEntry, all: readonly ManualEntry[]): string[] {
  const out: string[] = [];
  const idCount = all.filter((x) => x.id === e.id).length;

  // Identity and index-facing name.
  if (!ID_RE.test(e.id)) out.push('id must be lowercase words joined by hyphens, like crit-songbird');
  if (e.id.length > ID_MAX) out.push(`id is ${e.id.length} characters; the limit is ${ID_MAX}`);
  if (idCount > 1) out.push(`id is shared with ${idCount - 1} other entry`);
  if (!KINDS.has(e.kind)) out.push(`kind "${e.kind}" is not critter, prop or anomaly`);

  const name = e.name;
  out.push(...textProblems('name', name));
  if (name.trim() === '') out.push('name is empty');
  if (name.length > NAME_MAX) out.push(`name is ${name.length} characters; the limit is ${NAME_MAX}`);
  const nameWords = name.split(/\s+/).filter(Boolean);
  if (nameWords.length > NAME_MAX_WORDS) out.push(`name has ${nameWords.length} words; the limit is ${NAME_MAX_WORDS}`);
  nameWords.forEach((w, i) => {
    const bare = w.toLowerCase().replace(/[^\p{L}\p{N}-]/gu, '');
    if (NAME_FILLER.has(bare)) out.push(`name uses filler word "${bare}"`);
    if (i > 0 && ARTICLES.has(bare)) out.push(`name uses an article after the first word ("${w}")`);
  });
  if (name.includes('—') || name.includes(' - ')) out.push('name must not carry a dash clause; the binder prints the tag before the dash');
  const sameName = all.filter((x) => x.name.toLowerCase() === name.toLowerCase()).length;
  if (sameName > 1) out.push(`name "${name}" is shared with another entry`);

  out.push(...tagProblems(e, all));

  // DESCRIPTION: blurb then note, each one sentence, each prose-clean. The blurb may not just re-say the name;
  // the note may name the concept it stands for ("a watchdog timer").
  out.push(...singleSentenceProblems('blurb', e.blurb, BLURB_MAX));
  out.push(...singleSentenceProblems('note', e.note, NOTE_MAX));
  out.push(...proseProblems('blurb', e.blurb));
  out.push(...proseProblems('note', e.note));
  const bare = name.replace(/^(the|a|an)\s+/i, '').trim().toLowerCase();
  if (bare.length >= 4 && e.blurb.toLowerCase().includes(bare)) out.push(`blurb restates the name "${name}"`);

  // Rumour: the hand-written pencil line on the locked page. Lowercase is fine (it's a note); still no "!" or emoji.
  if (e.rumour === undefined) {
    if (RUMOUR_REQUIRED) out.push('rumour is missing; every entry needs a hand-written locked-page rumour');
  } else {
    const r = e.rumour.trim();
    if (!r) out.push('rumour is empty');
    if (/\n/.test(e.rumour)) out.push('rumour must be one line');
    if (r.length > RUMOUR_MAX) out.push(`rumour is ${r.length} characters; the limit is ${RUMOUR_MAX}`);
    if (/[!\p{Extended_Pictographic}]/u.test(r)) out.push('rumour has "!" or emoji');
  }

  // BUGS: one dry line.
  if (e.bugs === undefined) {
    if (BUGS_REQUIRED) out.push('bugs is missing; every entry needs one BUGS line');
  } else {
    out.push(...singleSentenceProblems('bugs', e.bugs, BUGS_MAX));
    out.push(...proseProblems('bugs', e.bugs));
  }

  // SEE ALSO: 0 to SEE_ALSO_MAX existing ids, never itself, no repeats.
  const seeAlso = e.seeAlso ?? [];
  if (seeAlso.length > SEE_ALSO_MAX) out.push(`SEE ALSO lists ${seeAlso.length} entries; the limit is ${SEE_ALSO_MAX}`);
  const known = new Set(all.map((x) => x.id));
  const seenRef = new Set<string>();
  for (const id of seeAlso) {
    if (id === e.id) out.push(`SEE ALSO points at itself ("${id}")`);
    else if (!known.has(id)) out.push(`SEE ALSO names unknown entry "${id}"`);
    if (seenRef.has(id)) out.push(`SEE ALSO lists "${id}" twice`);
    seenRef.add(id);
  }

  out.push(...sightingProblems(e));
  return out;
}
