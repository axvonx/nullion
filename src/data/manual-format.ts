import { ALL_LAYER_IDS, type LayerId } from '../core/layers';

/**
 * The Field Manual's file format: manual/<layer of the first sighting>/<entry id>.md, one file per entry. Like
 * bank-format.ts, the grammar is strict and every error names the file and line.
 *
 *   # Sky Sprite
 *
 *   id: crit-songbird · tag: SONGBIRD(1) · kind: critter · rarity: common · status: approved · page: 1
 *
 *   <!-- optional comment lines (kept for the editor, ignored by the game) -->
 *   Glides lazily over sunlit app windows and perches on anything with a flat titlebar.
 *
 *   > Represents lightweight UI animations and foreground events fluttering above the stack.
 *
 *   ## Sightings
 *   - application · critter · Sunlit blue & gold feathers gliding across the desktop sky.
 *   - application · app-spinner
 *   - application · topic:tp-dsa-tree · Appears on screens during Data Structures & Algorithms prompts.
 *
 *   ## Bugs      (optional, one line)
 *   ## Rumour    (optional, one line)
 *   ## See also  (optional, `- <entry id>` lines)
 *
 * - The title line is the name; the header fields come in the order shown. `status` is `draft` (shown in debug
 *   builds only) or `approved`. `page` is optional: entries with one come first in their chapter, lowest first;
 *   the rest follow, by id.
 * - A sighting is `<layer> · <what> · <detail note>`; the detail note is optional and may itself contain " · ".
 *   `<what>` is `critter` (the layer's biosphere species), `topic:<topic prop id>` (a question-reactive display), or
 *   an entity id in that layer's library. Sightings run shallowest layer first, one per layer.
 * - The file lives in the folder of its first sighting's layer and is named for its id.
 */

export const MANUAL_RARITY_IDS = ['common', 'uncommon', 'rare', 'mythic'] as const;
export type ManualRarity = (typeof MANUAL_RARITY_IDS)[number];
export const MANUAL_KINDS = ['critter', 'prop', 'anomaly'] as const;
export type ManualKind = (typeof MANUAL_KINDS)[number];
export const MANUAL_STATUSES = ['draft', 'approved'] as const;
export type ManualStatus = (typeof MANUAL_STATUSES)[number];

export interface ManualSighting {
  layer: LayerId;
  /** Entity ID in V4_LIBRARIES[layer] (for props & anchors). */
  entityId?: string;
  /** Critter species layer (for biosphere critters): always the sighting's own layer. */
  critterLayer?: LayerId;
  /** Topic prop ID in topics.ts (for question-reactive anomalies). */
  topicId?: string;
  /** Optional note describing how this character looks or behaves at this layer. */
  detailNote?: string;
}

export interface ManualEntry {
  id: string;
  name: string;
  /** Playful Unix man-page tag, e.g. SMALL-BEN(2). */
  manTag: string;
  kind: ManualKind;
  rarity: ManualRarity;
  /** `draft` entries come from the naming desk generator and are shown in debug builds only. */
  status: ManualStatus;
  /** Optional page order inside its chapter (lowest first, before entries without one). */
  page?: number;
  /** Playful 1-sentence character bio. */
  blurb: string;
  /** Plain-English "in real computers…" whisper for curious players. */
  note: string;
  /** Ordered highest (shallowest) layer first. */
  sightings: readonly ManualSighting[];
  /** The BUGS section: one dry line. Optional. */
  bugs?: string;
  /** The pencilled rumour on the locked page: one hand-written line hinting where to look. */
  rumour?: string;
  /** SEE ALSO: other entry ids. */
  seeAlso?: readonly string[];
}

export class ManualFormatError extends Error {
  constructor(path: string, line: number, message: string) {
    super(`${path}:${line}: ${message}`);
    this.name = 'ManualFormatError';
  }
}

const ID_RE = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const LAYERS = new Set<string>(ALL_LAYER_IDS);
const SEP = ' · ';

/** The layer folder and id a path names: `manual/<layer>/<id>.md`, with any leading directories. */
export function manualPathParts(path: string): { layer: string; id: string } | undefined {
  const m = /(?:^|\/)manual\/([^/]+)\/([^/]+)\.md$/.exec(path);
  return m ? { layer: m[1]!, id: m[2]! } : undefined;
}

/** Parse one Field Manual file. Throws ManualFormatError naming `path` and the line. */
export function parseManualFile(path: string, text: string): ManualEntry {
  const lines = text.split('\n');
  if (lines[lines.length - 1] === '') lines.pop();
  let i = 0;
  const fail = (msg: string, at = i): never => {
    throw new ManualFormatError(path, at + 1, msg);
  };
  const line = (): string => lines[i] ?? fail('unexpected end of file');
  const blank = () => {
    if (line() !== '') fail('expected a blank line');
    i++;
  };
  for (let k = 0; k < lines.length; k++) {
    const l = lines[k]!;
    if (l !== l.trimEnd()) fail('trailing spaces', k);
    if (/^\s/.test(l)) fail('lines may not start with whitespace', k);
  }

  // Title.
  const title = line();
  if (!title.startsWith('# ')) fail('expected "# <name>" on the first line');
  const name = title.slice(2);
  if (name.trim() === '') fail('the name is empty');
  i++;
  blank();

  // Header.
  const headerAt = i;
  const parts = line().split(SEP);
  const keys = ['id', 'tag', 'kind', 'rarity', 'status', 'page'] as const;
  const required = keys.length - 1;
  if (parts.length < required || parts.length > keys.length) fail(`the header needs ${keys.slice(0, required).map((k) => `${k}:`).join(' · ')} and may end with · page:`);
  const header: Record<string, string> = {};
  parts.forEach((p, n) => {
    const k = keys[n]!;
    if (!p.startsWith(`${k}: `) || p.length === k.length + 2) fail(`header field ${n + 1} must be "${k}: <value>"`);
    header[k] = p.slice(k.length + 2);
  });
  i++;
  const id = header.id!;
  if (!ID_RE.test(id)) fail(`id "${id}" must be lowercase words joined by hyphens`, headerAt);
  const kind = header.kind as ManualKind;
  if (!(MANUAL_KINDS as readonly string[]).includes(kind)) fail(`kind "${kind}" must be one of ${MANUAL_KINDS.join(', ')}`, headerAt);
  const rarity = header.rarity as ManualRarity;
  if (!(MANUAL_RARITY_IDS as readonly string[]).includes(rarity)) fail(`rarity "${rarity}" must be one of ${MANUAL_RARITY_IDS.join(', ')}`, headerAt);
  const status = header.status as ManualStatus;
  if (!(MANUAL_STATUSES as readonly string[]).includes(status)) fail(`status "${status}" must be one of ${MANUAL_STATUSES.join(', ')}`, headerAt);
  const page = header.page === undefined ? undefined : Number(header.page);
  if (page !== undefined && !(Number.isInteger(page) && page > 0 && String(page) === header.page)) fail(`page "${header.page}" must be a positive whole number`, headerAt);
  blank();

  // Optional comment lines, then the blurb.
  while (line().startsWith('<!--')) {
    if (!line().endsWith('-->')) fail('a comment must open and close on one line');
    i++;
  }
  const blurb = line();
  if (blurb === '' || /^(#|>|- )/.test(blurb)) fail('expected the blurb: one paragraph on one line');
  i++;
  blank();

  // Note.
  if (!line().startsWith('> ')) fail('expected the note: a single "> " line');
  const note = line().slice(2);
  if (note.trim() === '') fail('the note is empty');
  i++;
  blank();

  // Sightings.
  if (line() !== '## Sightings') fail('expected "## Sightings"');
  i++;
  const first = path ? manualPathParts(path) : undefined;
  const sightings: ManualSighting[] = [];
  while (i < lines.length && lines[i]!.startsWith('- ')) {
    const bits = lines[i]!.slice(2).split(SEP);
    if (bits.length < 2) fail('a sighting is "- <layer> · <entity id | critter | topic:id> · <detail note>"');
    const layer = bits[0]!;
    if (!LAYERS.has(layer)) fail(`unknown layer "${layer}"`);
    const what = bits[1]!;
    const detail = bits.length > 2 ? bits.slice(2).join(SEP) : undefined;
    if (detail !== undefined && detail.trim() === '') fail('the detail note after the second " · " is empty');
    const s: ManualSighting = { layer: layer as LayerId };
    if (what === 'critter') s.critterLayer = layer as LayerId;
    else if (what.startsWith('topic:')) {
      s.topicId = what.slice('topic:'.length);
      if (!ID_RE.test(s.topicId)) fail(`topic id "${s.topicId}" must be lowercase words joined by hyphens`);
    } else {
      if (!ID_RE.test(what)) fail(`"${what}" is not an entity id, "critter" or "topic:<id>"`);
      s.entityId = what;
    }
    if (detail !== undefined) s.detailNote = detail;
    sightings.push(s);
    i++;
  }
  if (sightings.length === 0) fail('## Sightings needs at least one "- " line');
  if (first && first.layer !== sightings[0]!.layer) fail(`the file is in manual/${first.layer}/ but its first sighting is on ${sightings[0]!.layer}`, i - sightings.length);
  if (first && first.id !== id) fail(`the file is named ${first.id}.md but its id is ${id}`, headerAt);

  // Optional sections, in a fixed order.
  let bugs: string | undefined;
  let rumour: string | undefined;
  let seeAlso: string[] | undefined;
  const order = ['## Bugs', '## Rumour', '## See also'];
  let last = -1;
  while (i < lines.length) {
    blank();
    const h = line();
    const k = order.indexOf(h);
    if (k < 0) fail(`expected one of ${order.join(', ')}, found "${h}"`);
    if (k <= last) fail(`${h} is out of order or repeated (order: ${order.join(', ')})`);
    last = k;
    i++;
    if (k < 2) {
      const text = line();
      if (text === '' || text.startsWith('#') || text.startsWith('- ')) fail(`${h} needs one line of text`);
      if (k === 0) bugs = text;
      else rumour = text;
      i++;
    } else {
      seeAlso = [];
      while (i < lines.length && lines[i]!.startsWith('- ')) {
        const ref = lines[i]!.slice(2);
        if (!ID_RE.test(ref)) fail(`"${ref}" is not an entry id`);
        seeAlso.push(ref);
        i++;
      }
      if (seeAlso.length === 0) fail('## See also needs at least one "- " line');
    }
  }

  return {
    id,
    name,
    manTag: header.tag!,
    kind,
    rarity,
    status,
    ...(page !== undefined ? { page } : {}),
    blurb,
    note,
    sightings,
    ...(bugs !== undefined ? { bugs } : {}),
    ...(rumour !== undefined ? { rumour } : {}),
    ...(seeAlso !== undefined ? { seeAlso } : {}),
  };
}

/** The file text for `e` (the inverse of parseManualFile), `comments` going under the header. */
export function formatManualEntry(e: ManualEntry, comments: readonly string[] = []): string {
  const out = [`# ${e.name}`, '', ['id: ' + e.id, 'tag: ' + e.manTag, 'kind: ' + e.kind, 'rarity: ' + e.rarity, 'status: ' + e.status, ...(e.page !== undefined ? ['page: ' + e.page] : [])].join(SEP), ''];
  for (const c of comments) out.push(`<!-- ${c} -->`);
  out.push(e.blurb, '', `> ${e.note}`, '', '## Sightings');
  for (const s of e.sightings) {
    const what = s.critterLayer ? 'critter' : s.topicId ? `topic:${s.topicId}` : s.entityId;
    out.push(['- ' + s.layer, what, ...(s.detailNote !== undefined ? [s.detailNote] : [])].join(SEP));
  }
  if (e.bugs !== undefined) out.push('', '## Bugs', e.bugs);
  if (e.rumour !== undefined) out.push('', '## Rumour', e.rumour);
  if (e.seeAlso?.length) out.push('', '## See also', ...e.seeAlso.map((r) => `- ${r}`));
  return out.join('\n') + '\n';
}

/** Where `e`'s file lives: manual/<layer of its first sighting>/<id>.md. */
export function manualPath(e: ManualEntry): string {
  return `manual/${e.sightings[0]!.layer}/${e.id}.md`;
}
