import { describe, expect, it } from 'vitest';
import { buildAnswerSet } from '../core/answers';
import { SAMPLE_QUESTIONS, SAMPLE_TERMS } from '../data/sample';
import { Game, READ_MS } from './game';
import { checkOutside, exactUrl, firstSentence, headNouns, judgeOutside, subjectPatterns, type WikiResponse } from './outside-check';

const CODEC = 'Name a video codec';
const page = (title: string, extract: string, cats: string[] = [], extra: object = {}): WikiResponse => ({
  query: { pages: [{ title, extract, categories: cats.map((c) => ({ title: `Category:${c}` })), ...extra }] },
});

describe('outside answers: the Wikipedia verdict', () => {
  it('takes the head noun of the prompt', () => {
    expect(headNouns(CODEC)).toEqual(['codec', 'codecs']);
    expect(headNouns('Name a type of lock')).toEqual(['lock', 'locks']);
    expect(headNouns('Name a Linux device node')).toEqual(['node', 'nodes']);
    expect(headNouns('Name a computer memory technology')).toEqual(['technology', 'technologies']);
  });

  it('matches the whole subject, either plural, and a one-word compound split', () => {
    const any = (prompt: string, s: string) => subjectPatterns(prompt).some((re) => re.test(s));
    expect(any(CODEC, 'Category:Video codecs')).toBe(true);
    expect(any(CODEC, 'Category:Audio codecs')).toBe(false);
    expect(any('Name a filesystem', 'NILFS is a log-structured file system.')).toBe(true);
    expect(any('Name a sorting algorithm', 'Binary search is a search algorithm.')).toBe(false);
    expect(firstSentence('Cinepak is a lossy video codec. It was developed in 1991 (by SuperMac).')).toBe('Cinepak is a lossy video codec.');
  });

  it('accepts an article whose first sentence or categories name the kind of thing', () => {
    expect(judgeOutside('Daala', CODEC, page('Daala', 'Daala is a video codec under development. Its later intro mentions nothing.')).kind).toBe('accept');
    expect(judgeOutside('MP3', CODEC, page('MP3', 'MP3 is an audio coding format. Players use a codec to play it.', ['Audio codecs'])).kind).toBe('reject');
    const v = judgeOutside('Sorenson Spark', CODEC, page('Sorenson Spark', 'A format from Sorenson Media.', ['Video codecs']));
    expect(v).toEqual({ kind: 'accept', title: 'Sorenson Spark', evidence: 'in Category:Video codecs' });
  });

  it('drops a qualifier and follows redirects', () => {
    expect(judgeOutside('Opus', 'Name an audio codec', page('Opus (audio format)', 'Opus is a lossy audio codec.', ['Audio codecs']))).toMatchObject({ kind: 'accept', title: 'Opus' });
    const redirected: WikiResponse = { query: { redirects: [{ from: 'H.265', to: 'High Efficiency Video Coding' }], pages: page('High Efficiency Video Coding', 'HEVC is a video compression standard.', ['Video codecs']).query!.pages } };
    expect(judgeOutside('H.265', CODEC, redirected)).toMatchObject({ kind: 'accept', title: 'High Efficiency Video Coding' });
  });

  it('rejects missing articles, disambiguations, lists, other titles and off-topic articles', () => {
    expect(judgeOutside('Zzyzx', CODEC, { query: { pages: [{ title: 'Zzyzx', missing: true }] } })).toMatchObject({ kind: 'reject', reason: 'no article' });
    expect(judgeOutside('Spark', CODEC, page('Spark', 'Spark may refer to: a codec', [], { pageprops: { disambiguation: '' } }))).toMatchObject({ reason: 'disambiguation page' });
    expect(judgeOutside('List of codecs', CODEC, page('List of codecs', 'codecs'))).toMatchObject({ reason: 'a list article' });
    expect(judgeOutside('Banana', CODEC, page('Banana codec', 'A codec.'))).toMatchObject({ kind: 'reject' });
    expect(judgeOutside('Banana', CODEC, page('Banana', 'A banana is an elongated, edible fruit.', ['Edible fruits']))).toMatchObject({ kind: 'reject', reason: 'article never calls it a "video codec"' });
  });

  it('looks up the exact title first, then searches; a failed request is an error, not a reject', async () => {
    const urls: string[] = [];
    const fake = async (url: string) => {
      urls.push(url);
      return url === exactUrl('opus') ? { query: { pages: [{ title: 'Opus', missing: true }] } } : page('Opus (audio format)', 'Opus is a lossy audio codec.');
    };
    expect(await checkOutside('opus', 'Name an audio codec', fake)).toMatchObject({ kind: 'accept', title: 'Opus' });
    expect(urls).toHaveLength(2);
    expect(urls[1]).toContain('gsrsearch=opus+codec');
    await expect(checkOutside('opus', CODEC, () => Promise.reject(new Error('offline')))).rejects.toThrow('offline');
  });
});

describe('outside answers: the game', () => {
  const set = buildAnswerSet('sample', 'Sample', SAMPLE_TERMS, SAMPLE_QUESTIONS);
  const answering = () => {
    const g = new Game(set, 1, { timer: true, unlimited: false, autocorrect: 'confirm' });
    g.start(0);
    g.tick(READ_MS);
    return g;
  };

  it('scores an unknown title at the chosen tier, marked unverified, and drops it from the rejected guesses', () => {
    const g = answering();
    expect(g.submit('quuxlock', READ_MS).kind).toBe('rejected');
    const res = g.acceptOutside(0, 'quuxlock', 'Quux lock', 'race', READ_MS + 10);
    expect(res).toMatchObject({ kind: 'accepted', pushed: 5 });
    const r = g.rounds[0]!;
    expect(r.locked?.entry.name).toBe('Quux lock');
    expect(r.locked?.entry.note).toMatch(/Wikipedia/);
    expect(r.rejected).toEqual([]);
    expect(g.phase.kind).toBe('between');
  });

  it('a title the bank knows (a missing alias) scores that answer at its own tier', () => {
    const g = answering();
    const known = set.entries(g.rounds[0]!.question.id)[0]!;
    const res = g.acceptOutside(0, 'some alias', known.name, 'race', READ_MS);
    expect(res).toMatchObject({ kind: 'accepted', entry: known });
  });

  it('is ignored once the round has moved on or is already answered', () => {
    const g = answering();
    g.submit(set.entries(g.rounds[0]!.question.id)[0]!.name, READ_MS);
    expect(g.acceptOutside(0, 'x', 'X', 'race', READ_MS).kind).toBe('ignored');
    expect(g.acceptOutside(3, 'x', 'X', 'race', READ_MS).kind).toBe('ignored');
  });
});
