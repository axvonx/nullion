import { normalize, promptSubject } from '../core/match';

/**
 * Outside answers (debug prototype): a guess the bank doesn't know is looked up on Wikipedia, and counts when the
 * article it names says it is the prompt's kind of thing. The verdict logic is pure (`judgeOutside` over the API's
 * JSON); `checkOutside` does the fetching through an injected `fetch`, so tests never touch the network.
 *
 * The evidence rule: the article exists, is not a disambiguation page or a list, its title (redirects followed, any
 * "(qualifier)" dropped) is the guess, and the prompt's whole subject ("video codec" for "Name a video codec", the
 * last word singular or plural, a one-word compound also split: "filesystem" or "file system") appears in its first
 * sentence or one of its categories. Only the last noun ("codec" anywhere in the intro) let MP3, HTML and Deadlock
 * through in a live probe (7 of 18 wrong guesses); the whole subject in the defining sentence is stricter. Wikipedia's API answers cross-origin requests with `origin=*`; the guess is sent
 * to Wikipedia, so this stays off in production until that's a decision.
 */

export interface WikiPage {
  title: string;
  missing?: boolean;
  extract?: string;
  categories?: { title: string }[];
  pageprops?: { disambiguation?: string };
}

export interface WikiResponse {
  query?: { pages?: WikiPage[]; redirects?: { from: string; to: string }[] };
}

export type OutsideVerdict =
  | { kind: 'accept'; title: string; evidence: string }
  | { kind: 'reject'; reason: string; title?: string };

/** The prompt's head noun and its plural ("codec", "codecs"); for "Name a computer bus or … standard": "standard". */
export function headNouns(prompt: string): string[] {
  const subject = promptSubject(prompt).toLowerCase();
  const words = subject.split(/\s+/).filter(Boolean);
  const head = words[words.length - 1] ?? subject;
  return [head, plural(head)];
}

function plural(w: string): string {
  return w.endsWith('s') ? `${w}es` : w.endsWith('y') ? `${w.slice(0, -1)}ies` : `${w}s`;
}

const esc = (w: string) => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/**
 * Patterns for the prompt's whole subject: its words in order (spaces or hyphens between), the last one singular or
 * plural. A one-word subject is also tried split in two ("filesystem" → "file system"), since Wikipedia spells
 * compounds either way.
 */
export function subjectPatterns(prompt: string): RegExp[] {
  const words = promptSubject(prompt).toLowerCase().split(/\s+/).filter(Boolean);
  const phrase = (ws: string[]) => {
    const last = ws[ws.length - 1]!;
    const lead = ws.slice(0, -1).map((w) => `${esc(w)}[\\s-]*`).join('');
    return new RegExp(`\\b${lead}(?:${esc(last)}|${esc(plural(last))})\\b`, 'i');
  };
  const out = [phrase(words)];
  if (words.length === 1) {
    const w = words[0]!;
    for (let i = 3; i <= w.length - 3; i++) out.push(phrase([w.slice(0, i), w.slice(i)]));
  }
  return out;
}

/** The article's defining sentence: its intro up to the first full stop that ends a sentence. */
export function firstSentence(extract: string): string {
  const m = /^[\s\S]*?[.!?](?=\s+[A-Z(]|\s*$)/.exec(extract.trim());
  return m ? m[0] : extract.trim();
}

const bare = (title: string) => title.replace(/\s*\([^)]*\)\s*$/, '');

/** Judge one page against the guess and the prompt. */
export function judgePage(guess: string, prompt: string, page: WikiPage, redirectedFrom?: string): OutsideVerdict {
  if (page.missing) return { kind: 'reject', reason: 'no article' };
  if (page.pageprops?.disambiguation !== undefined) return { kind: 'reject', reason: 'disambiguation page', title: page.title };
  if (/^lists? of\b/i.test(page.title)) return { kind: 'reject', reason: 'a list article', title: page.title };
  const g = normalize(guess);
  if (normalize(bare(page.title)) !== g && (!redirectedFrom || normalize(redirectedFrom) !== g)) {
    return { kind: 'reject', reason: `article "${page.title}" is not the guess`, title: page.title };
  }
  const subject = promptSubject(prompt).toLowerCase();
  const first = page.extract ? firstSentence(page.extract) : '';
  for (const re of subjectPatterns(prompt)) {
    if (re.test(first)) return { kind: 'accept', title: bare(page.title), evidence: `first sentence says "${subject}"` };
    const cat = page.categories?.find((c) => re.test(c.title));
    if (cat) return { kind: 'accept', title: bare(page.title), evidence: `in ${cat.title}` };
  }
  return { kind: 'reject', reason: `article never calls it a "${subject}"`, title: page.title };
}

/** Judge an API response: the first page that passes wins; otherwise the most telling rejection. */
export function judgeOutside(guess: string, prompt: string, res: WikiResponse): OutsideVerdict {
  const pages = res.query?.pages ?? [];
  if (!pages.length) return { kind: 'reject', reason: 'no article' };
  const redirects = res.query?.redirects ?? [];
  let worst: OutsideVerdict = { kind: 'reject', reason: 'no article' };
  for (const page of pages) {
    const from = redirects.find((r) => r.to === page.title)?.from;
    const v = judgePage(guess, prompt, page, from);
    if (v.kind === 'accept') return v;
    if (worst.reason === 'no article') worst = v;
  }
  return worst;
}

const API = 'https://en.wikipedia.org/w/api.php';
const PROPS = {
  action: 'query',
  format: 'json',
  formatversion: '2',
  origin: '*',
  redirects: '1',
  prop: 'extracts|categories|pageprops',
  exintro: '1',
  explaintext: '1',
  exsentences: '3',
  exlimit: 'max',
  cllimit: 'max',
  clshow: '!hidden',
  ppprop: 'disambiguation',
};

export function exactUrl(guess: string): string {
  return `${API}?${new URLSearchParams({ ...PROPS, titles: guess })}`;
}

export function searchUrl(guess: string, prompt: string): string {
  return `${API}?${new URLSearchParams({ ...PROPS, generator: 'search', gsrsearch: `${guess} ${headNouns(prompt)[0]}`, gsrlimit: '5' })}`;
}

/**
 * Look a guess up: the exact title first (redirects followed), then a search for "<guess> <head noun>" (which finds
 * "Opus (audio format)" for "opus"). A failed request is an error for the caller to show, never a quiet reject.
 */
export async function checkOutside(guess: string, prompt: string, fetchJson: (url: string) => Promise<WikiResponse>): Promise<OutsideVerdict> {
  if (normalize(guess).length < 2) return { kind: 'reject', reason: 'too short to look up' };
  const exact = judgeOutside(guess, prompt, await fetchJson(exactUrl(guess)));
  if (exact.kind === 'accept') return exact;
  const search = judgeOutside(guess, prompt, await fetchJson(searchUrl(guess, prompt)));
  return search.kind === 'accept' ? search : exact.reason === 'no article' ? search : exact;
}

/** The browser's fetch, as `checkOutside` wants it: a non-2xx answer throws. */
export async function browserFetchJson(url: string): Promise<WikiResponse> {
  const r = await fetch(url);
  if (!r.ok) throw new Error(`Wikipedia answered ${r.status}`);
  return (await r.json()) as WikiResponse;
}
