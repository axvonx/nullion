// npm run writing:report: per writing/ file, how many strings are draft (agent-written) and how many are owner (hand-written).
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { parseWritingFile } from '../src/data/writing-format.ts';

const dir = join(import.meta.dirname, '..', 'writing');
const files = readdirSync(dir).filter((f) => f.endsWith('.md') && f !== 'README.md' && f !== 'VOICE.md').sort();
let draft = 0;
let owner = 0;
console.log('file'.padEnd(16), 'draft'.padStart(6), 'owner'.padStart(6));
for (const f of files) {
  const strings = parseWritingFile(`writing/${f}`, readFileSync(join(dir, f), 'utf8'));
  const d = strings.filter((s) => s.status === 'draft').length;
  const o = strings.length - d;
  draft += d;
  owner += o;
  console.log(f.padEnd(16), String(d).padStart(6), String(o).padStart(6));
}
console.log('total'.padEnd(16), String(draft).padStart(6), String(owner).padStart(6));
