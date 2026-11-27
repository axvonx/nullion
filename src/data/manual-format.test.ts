import { describe, expect, it } from 'vitest';
import { ManualFormatError, formatManualEntry, manualPath, parseManualFile, type ManualEntry } from './manual-format';

const FULL: ManualEntry = {
  id: 'lock-ness',
  name: 'Lock Ness',
  manTag: 'LOCK-NESS(−2)',
  kind: 'prop',
  rarity: 'uncommon',
  status: 'approved',
  page: 3,
  blurb: 'Keeps resurfacing deeper and deeper in the machine.',
  note: 'From file locks to hardware-sealed SMRAM, computing is locks all the way down.',
  sightings: [
    { layer: 'kernel', entityId: 'kr-mutex', detailNote: 'Iron mutex · guarding a shared structure.' },
    { layer: 'ring-3', entityId: 'r3-ringosc' },
  ],
  bugs: 'Opens for anyone who asks politely.',
  rumour: 'heard it lives below the kernel.',
  seeAlso: ['small-ben'],
};

const PATH = 'manual/kernel/lock-ness.md';
const TEXT = formatManualEntry(FULL);

function expectError(text: string, pattern: RegExp, path = PATH) {
  let err: unknown;
  try {
    parseManualFile(path, text);
  } catch (e) {
    err = e;
  }
  expect(err, `expected a parse error for:\n${text}`).toBeInstanceOf(ManualFormatError);
  expect((err as Error).message).toMatch(pattern);
}

describe('parseManualFile', () => {
  it('round-trips a full entry through its file text', () => {
    expect(parseManualFile(PATH, TEXT)).toEqual(FULL);
  });

  it('reads critter and topic sightings, optional detail notes and comment lines', () => {
    const e: ManualEntry = {
      ...FULL,
      id: 'crit-x',
      kind: 'critter',
      page: undefined,
      sightings: [{ layer: 'application', critterLayer: 'application', detailNote: 'Blue.' }, { layer: 'runtime', topicId: 'tp-sort-bars' }],
      bugs: undefined,
      rumour: undefined,
      seeAlso: undefined,
    };
    delete e.page;
    delete e.bugs;
    delete e.rumour;
    delete e.seeAlso;
    const text = formatManualEntry(e, ['kept for the editor']);
    expect(text).toContain('<!-- kept for the editor -->');
    expect(parseManualFile('manual/application/crit-x.md', text)).toEqual(e);
  });

  it('names the file and the line of each kind of mistake', () => {
    expectError(TEXT.replace('# Lock Ness', 'Lock Ness'), /^manual\/kernel\/lock-ness\.md:1: expected "# <name>"/);
    expectError(TEXT.replace(' · tag: ', ' · label: '), /:3: header field 2 must be "tag: <value>"/);
    expectError(TEXT.replace('kind: prop', 'kind: thing'), /:3: kind "thing"/);
    expectError(TEXT.replace('rarity: uncommon', 'rarity: epic'), /:3: rarity "epic"/);
    expectError(TEXT.replace('status: approved', 'status: maybe'), /:3: status "maybe"/);
    expectError(TEXT.replace('page: 3', 'page: 0'), /:3: page "0"/);
    expectError(TEXT.replace('- kernel · kr-mutex', '- basement · kr-mutex'), /unknown layer "basement"/);
    expectError(TEXT.replace('- ring-3 · r3-ringosc', '- ring-3 · R3 Ring'), /"R3 Ring" is not an entity id/);
    expectError(TEXT.replace('## Sightings\n- kernel · kr-mutex · Iron mutex · guarding a shared structure.\n- ring-3 · r3-ringosc\n', '## Sightings\n'), /needs at least one/);
    expectError(TEXT.replace('## Bugs', '## Rumour'), /out of order|repeated/);
    expectError(TEXT.replace('## See also\n- small-ben', '## See also'), /needs at least one/);
    expectError(TEXT + '\n## Extras\nx\n', /expected one of ## Bugs/);
    expectError(TEXT.replace('in the machine.', 'in the machine. '), /trailing spaces/);
    expectError(TEXT.replace('> From file', 'From file'), /expected the note/);
    expectError(TEXT.replace('\n\n> From', '\n> From'), /expected a blank line/);
  });

  it('checks the path against the content', () => {
    expectError(TEXT, /in manual\/application\/ but its first sighting is on kernel|file is in manual\/application\//, 'manual/application/lock-ness.md');
    expectError(TEXT, /named other\.md but its id is lock-ness/, 'manual/kernel/other.md');
  });

  it('puts an entry at manual/<layer of its first sighting>/<id>.md', () => {
    expect(manualPath(FULL)).toBe(PATH);
  });
});
