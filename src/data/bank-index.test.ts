import { readFileSync, writeFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { formatIndex, parseBankFile } from './bank-format';

// Kept apart from bank.test.ts, which imports bank.ts: that module checks the index at load, so a stale index
// must not stop `npm run bank:index` (UPDATE_BANK_INDEX=1 on this file) from regenerating it.
const RAW = import.meta.glob(['../../bank/*/*.md', '!../../bank/reports/*.md'], { query: '?raw', import: 'default', eager: true }) as Record<string, string>;

describe('bank index', () => {
  it('bank/index.md is up to date (run `npm run bank:index` after editing a category)', () => {
    const want = formatIndex(
      Object.entries(RAW).map(([p, text]) => parseBankFile(p.replace(/^.*?bank\//, 'bank/'), text)).map((c) => ({ id: c.id, prompt: c.prompt, domain: c.domain, status: c.status, answers: c.entries.length, inbox: c.inbox.length })),
    );
    const path = new URL('../../bank/index.md', import.meta.url);
    if (process.env.UPDATE_BANK_INDEX === '1') writeFileSync(path, want);
    expect(readFileSync(path, 'utf8')).toBe(want);
  });

});
