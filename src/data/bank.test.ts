import { describe, expect, it } from 'vitest';
import { buildAnswerSet } from '../core/answers';
import { BANK_INDEX, BANK_QUESTIONS, loadBankCategory, loadBankTerms } from './bank';
import { formatBankFile, parseBankFile, playTier, type BankCategory } from './bank-format';

// Every category file, read eagerly so the whole bank is validated on every test run.
const RAW = import.meta.glob(['../../bank/*/*.md', '!../../bank/reports/*.md'], { query: '?raw', import: 'default', eager: true }) as Record<string, string>;
const ALL: BankCategory[] = Object.entries(RAW).map(([p, text]) => parseBankFile(p.replace(/^.*?bank\//, 'bank/'), text));

describe('answer bank files', () => {
  it('every category file parses under the strict grammar', () => {
    expect(ALL.length).toBeGreaterThan(0);
  });

  it('every approved category builds an answer set (one Bit Flip, no ambiguous keys)', async () => {
    const terms = await loadBankTerms(BANK_QUESTIONS.map((q) => q.id));
    expect(() => buildAnswerSet('bank', 'Bank', terms, BANK_QUESTIONS)).not.toThrow();
  });

  it('keeps the deep answers the user named', async () => {
    const qs = BANK_QUESTIONS.filter((q) => q.id === 'lock' || q.id === 'data-structure');
    const set = buildAnswerSet('bank', 'Bank', await loadBankTerms(qs.map((q) => q.id)), qs);
    for (const [q, g] of [['data-structure', 'maple tree'], ['data-structure', 'xarray'], ['lock', 'fissile lock'], ['lock', 'cna lock'],
      ['lock', 'ERESOURCE'], ['lock', 'push lock'], ['lock', 'rmlock'], ['lock', 'SIX lock'], ['lock', 'slim reader/writer lock'], ['lock', 'std::mutex']] as const) {
      expect(set.check(q, g).kind, g).toBe('accepted');
    }
    expect(set.check('lock', 'spinlock')).toMatchObject({ kind: 'accepted', entry: { tier: 'off-by-one' } });
  });

  it('accepts the deep programming languages the owner caught missing on day one', async () => {
    const qs = BANK_QUESTIONS.filter((q) => q.id === 'programming-language');
    const set = buildAnswerSet('bank', 'Bank', await loadBankTerms(qs.map((q) => q.id)), qs);
    for (const g of ['BLISS', 'PL/1', 'PL/I', 'INTERCAL', 'MACRO-11', 'PlusCal', 'PILLAR']) {
      expect(set.check('programming-language', g).kind, g).toBe('accepted');
    }
  });

  it('accepts the deep operating systems the owner caught missing (not in Wikidata at all)', async () => {
    const qs = BANK_QUESTIONS.filter((q) => q.id === 'operating-system');
    const set = buildAnswerSet('bank', 'Bank', await loadBankTerms(qs.map((q) => q.id)), qs);
    for (const g of ['DEC MICA', 'MICA', 'Topaz', 'DEC Topaz']) expect(set.check('operating-system', g).kind, g).toBe('accepted');
  });

  it('header id and domain match the file path', async () => {
    for (const r of BANK_INDEX) await expect(loadBankCategory(r.id)).resolves.toMatchObject({ id: r.id, domain: r.domain });
  });

  it('formatting is a fixed point: parse → format → parse gives the same category', () => {
    for (const c of ALL) expect(parseBankFile(c.id, formatBankFile(c))).toEqual(c);
  });
});

describe('reference links (bank/links, scripts/verify-links.py)', () => {
  const files = import.meta.glob('../../bank/links/*.json', { eager: true, import: 'default' }) as Record<string, { prompt: string | null; answers: Record<string, string> }>;
  it('every approved category has a checked links file whose keys are its answers and whose links are articles or docs, never searches', async () => {
    for (const q of BANK_QUESTIONS) {
      const f = files[`../../bank/links/${q.id}.json`];
      expect(f, `bank/links/${q.id}.json missing: run design/links/run.sh ${q.id} then scripts/verify-links.py`).toBeDefined();
      const names = new Set((await loadBankCategory(q.id)).entries.map((e) => e.name));
      for (const [name, url] of Object.entries(f!.answers)) {
        expect(names.has(name), `bank/links/${q.id}.json: '${name}' is not an answer`).toBe(true);
        const u = new URL(url);
        expect(u.protocol).toBe('https:');
        expect(u.pathname.includes('Special:') || u.searchParams.has('search'), `${q.id}: ${url} is a search`).toBe(false);
      }
    }
  });
});

describe('bank file grammar', () => {
  const head = '# Name a type of lock\nid: lock · domain: os-systems · status: draft\n';
  const parse = (body: string, status = 'draft') => parseBankFile('t.md', head.replace('draft', status) + body);

  it('reads tiers, aliases, notes and the inbox', () => {
    const c = parse('> Any lock.\n\n## Off-by-one\n- spinlock | spin lock\n  note: hi\n\n## Inbox\n- hemlock (suggested: heisenbug)\n- qspinlock\n');
    expect(c.accepts).toBe('Any lock.');
    expect(c.entries).toEqual([{ name: 'spinlock', aliases: ['spin lock'], tier: 'off-by-one', note: 'hi' }]);
    expect(c.inbox).toEqual([{ name: 'hemlock', aliases: [], suggested: 'heisenbug' }, { name: 'qspinlock', aliases: [] }]);
  });

  it('ignores comments and blank lines; keeps names that contain # or parentheses', () => {
    const c = parse('<!-- hi -->\n\n## Off-by-one\n\n- C# lock (old)\n');
    expect(c.entries[0]!.name).toBe('C# lock (old)');
  });

  it('rejects off-grammar files with file:line', () => {
    expect(() => parseBankFile('t.md', 'Name a lock\n')).toThrow(/t\.md:1/);
    expect(() => parse('## Off by one\n- x\n')).toThrow(/unknown section "Off by one"/);
    expect(() => parse('## Heisenbug\n- x\n## Off-by-one\n- y\n')).toThrow(/out of order/);
    expect(() => parse('## Off-by-one\n- x\n## Off-by-one\n- y\n')).toThrow(/appears twice/);
    expect(() => parse('- x\n')).toThrow(/before any section/);
    expect(() => parse('## Off-by-one\n- x\n## Inbox\n- X\n')).toThrow(/already appears at t\.md:4/);
    expect(() => parse('## Off-by-one\n- a|b\n')).toThrow(/" \| "/);
    expect(() => parse('## Off-by-one\n- a\nstray text\n')).toThrow(/t\.md:5: unexpected line/);
    expect(() => parse('## Inbox\n- a (suggested: common)\n')).toThrow(/unknown suggested tier/);
    expect(() => parse('## Off-by-one\n- a\n\n  note: x\n')).toThrow(/directly under/);
    expect(() => parseBankFile('t.md', head.replace('os-systems', 'misc'))).toThrow(/unknown domain/);
  });

  it('(auto) marks an unconfirmed answer for review; it still plays its full tier', () => {
    const c = parse('## Off-by-one\n- mutex (auto)\n## Heisenbug\n- ERESOURCE | executive resource (auto)\n- fissile lock\n');
    expect(c.entries.map((e) => [e.name, e.aliases, e.tier, e.auto])).toEqual([
      ['mutex', [], 'off-by-one', true],
      ['ERESOURCE', ['executive resource'], 'heisenbug', true],
      ['fissile lock', [], 'heisenbug', undefined],
    ]);
    expect(c.entries.map(playTier)).toEqual(['off-by-one', 'heisenbug', 'heisenbug']);
    expect(() => parse('## Bit Flip\n- b (auto)\n')).toThrow(/picked by a person/);
    expect(() => parse('## Inbox\n- b (auto)\n')).not.toThrow(); // inbox lines take names literally
  });

  it('an approved category needs exactly one Bit Flip and at least one Works on my machine', () => {
    expect(() => parse('## Off-by-one\n- a\n', 'approved')).toThrow(/Bit Flip/);
    expect(() => parse('## Off-by-one\n- a\n## Bit Flip\n- b\n', 'approved')).toThrow(/Works on my machine/);
    expect(() => parse('## Works on my machine\n- w\n- v\n## Bit Flip\n- b\n', 'approved')).not.toThrow();
    expect(() => parse('## Works on my machine\n- w\n## Bit Flip\n- b\n- c\n', 'approved')).toThrow(/exactly one Bit Flip/);
  });
});
