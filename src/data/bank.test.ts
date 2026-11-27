import { describe, expect, it } from 'vitest';
import { buildAnswerSet } from '../core/answers';
import { BANK_INDEX, BANK_QUESTIONS, loadBankCategory, loadBankTerms } from './bank';
import { AUTO_TIER_CAP, formatBankFile, parseBankFile, playTier, type BankCategory } from './bank-format';

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

  it('header id and domain match the file path', async () => {
    for (const r of BANK_INDEX) await expect(loadBankCategory(r.id)).resolves.toMatchObject({ id: r.id, domain: r.domain });
  });

  it('formatting is a fixed point: parse → format → parse gives the same category', () => {
    for (const c of ALL) expect(parseBankFile(c.id, formatBankFile(c))).toEqual(c);
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

  it('(auto) marks an unconfirmed answer, which plays at most at the cap', () => {
    const c = parse('## Off-by-one\n- mutex (auto)\n## Heisenbug\n- ERESOURCE | executive resource (auto)\n- fissile lock\n');
    expect(c.entries.map((e) => [e.name, e.aliases, e.tier, e.auto])).toEqual([
      ['mutex', [], 'off-by-one', true],
      ['ERESOURCE', ['executive resource'], 'heisenbug', true],
      ['fissile lock', [], 'heisenbug', undefined],
    ]);
    expect(c.entries.map(playTier)).toEqual(['off-by-one', AUTO_TIER_CAP, 'heisenbug']);
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
