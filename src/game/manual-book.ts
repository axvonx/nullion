import { LAYERS, type LayerId } from '../core/layers';
import { MANUAL_ENTRIES, type ManualEntry } from './manual';

/**
 * The Field Manual as a book (FIELD-MANUAL-PLAN.md): front matter, one chapter per Daily layer (1 = Application …
 * 10 = Ring −3), and the permuted index. Pure: the binder UI (src/ui/binder/) renders what this lays out.
 * - An entry lives in the chapter of its shallowest Daily appearance; each deeper appearance gets a stub there.
 * - A chapter the player hasn't reached is sealed: its divider stays, its pages don't.
 * - Folios are section-style, as in the old manuals: chapter 4, page 6 is "4-6".
 */

export interface Chapter {
  no: string;
  layer: LayerId;
  name: string;
  /** Entries whose home is this chapter. */
  entries: ManualEntry[];
  /** Deeper appearances of entries that live in an earlier chapter. */
  stubs: { entry: ManualEntry; layer: LayerId }[];
}

export type Leaf =
  | { kind: 'title' }
  | { kind: 'intro' }
  | { kind: 'contents' }
  | { kind: 'notes' }
  | { kind: 'divider'; chapter: Chapter }
  | { kind: 'chapter-list'; chapter: Chapter }
  | { kind: 'sealed'; chapter: Chapter }
  | { kind: 'plate'; entry: ManualEntry; chapter: Chapter }
  | { kind: 'text'; entry: ManualEntry; chapter: Chapter }
  | { kind: 'index'; half: 0 | 1 };

export interface Spread {
  left: Leaf;
  right: Leaf;
  /** Page numbers of the left and right leaves. */
  folios: [string, string];
  /** The chapter number this spread belongs to, if any. */
  chapter?: string;
}

const DAILY = new Set<LayerId>(LAYERS.map((l) => l.id));

export function bookChapters(entries: readonly ManualEntry[] = MANUAL_ENTRIES): Chapter[] {
  const chapters: Chapter[] = LAYERS.map((l, i) => ({ no: String(i + 1), layer: l.id, name: l.name, entries: [], stubs: [] }));
  const byLayer = new Map(chapters.map((c) => [c.layer, c]));
  for (const e of entries) {
    const daily = e.sightings.filter((s) => DAILY.has(s.layer));
    if (!daily.length) continue; // Endless-only: the Endless edition's business
    byLayer.get(daily[0]!.layer)!.entries.push(e);
    for (const s of daily.slice(1)) byLayer.get(s.layer)!.stubs.push({ entry: e, layer: s.layer });
  }
  return chapters;
}

/** The entry's man tag: its name and its home chapter number, e.g. LOCK-NESS(4). */
export function manTag(e: ManualEntry, chapters: readonly Chapter[] = CHAPTERS): string {
  const home = chapters.find((c) => c.entries.includes(e));
  const base = e.manTag.replace(/\(.*\)$/, '') || e.id.toUpperCase();
  return `${base}(${home ? home.no : '?'})`;
}

const CHAPTERS = bookChapters();

export function buildBook(isSealed: (layer: LayerId) => boolean, chapters: readonly Chapter[] = CHAPTERS): Spread[] {
  const book: Spread[] = [
    { left: { kind: 'title' }, right: { kind: 'intro' }, folios: ['i', 'ii'] },
    { left: { kind: 'contents' }, right: { kind: 'notes' }, folios: ['iii', 'iv'] },
  ];
  for (const c of chapters) {
    const f = (n: number) => `${c.no}-${n}`;
    if (isSealed(c.layer)) {
      book.push({ left: { kind: 'divider', chapter: c }, right: { kind: 'sealed', chapter: c }, folios: [f(1), f(2)], chapter: c.no });
      continue;
    }
    book.push({ left: { kind: 'divider', chapter: c }, right: { kind: 'chapter-list', chapter: c }, folios: [f(1), f(2)], chapter: c.no });
    c.entries.forEach((entry, k) => {
      book.push({ left: { kind: 'plate', entry, chapter: c }, right: { kind: 'text', entry, chapter: c }, folios: [f(3 + 2 * k), f(4 + 2 * k)], chapter: c.no });
    });
  }
  book.push({ left: { kind: 'index', half: 0 }, right: { kind: 'index', half: 1 }, folios: ['I-1', 'I-2'] });
  return book;
}

/** The spread index where `entryId`'s pages are, if its chapter isn't sealed. */
export function spreadOf(book: readonly Spread[], entryId: string): number {
  return book.findIndex((s) => s.left.kind === 'plate' && s.left.entry.id === entryId);
}

export interface KwicRow {
  before: string;
  key: string;
  tag: string;
  target: string;
}

const STOP = new Set(['a', 'an', 'the', 'that', 'of', 'in', 'on', 'to', 'and', 'or', 'for', 'with', 'its', 'it', 'is', 'by', 'from', 'at', 'as', 'into', 'than', 'then']);

/**
 * A permuted (KWIC) index, as old Unix manuals printed one: every significant word of every NAME line rotated
 * into the keyword column, alphabetised. `target` is what a row opens.
 */
export function kwicRows(lines: readonly { tag: string; line: string; target: string }[]): KwicRow[] {
  const rows: KwicRow[] = [];
  for (const { tag, line, target } of lines) {
    const words = line.split(/\s+/).filter(Boolean);
    words.forEach((w, i) => {
      const bare = w.toLowerCase().replace(/[^\p{L}\p{N}-]/gu, '');
      if (bare.length < 3 || STOP.has(bare)) return;
      rows.push({ before: words.slice(0, i).join(' '), key: words.slice(i).join(' '), tag, target });
    });
  }
  return rows.sort((a, b) => a.key.toLowerCase().localeCompare(b.key.toLowerCase()) || a.tag.localeCompare(b.tag));
}
