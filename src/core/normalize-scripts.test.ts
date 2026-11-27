import { execFileSync } from 'node:child_process';
import { describe, expect, it } from 'vitest';
import { normalize } from './match';

// The content scripts key answers with their own copy of normalize() (a collision there must be a collision in play).
const SCRIPTS = [
  ['scripts/wikidata-merge.py', 'key'],
  ['scripts/bank-dupes.py', 'norm'],
] as const;
const CASES = ['C++', 'C#', 'F#', 'A*', 'MIP*', 'SQL*Plus', 'Pro*C', 'Café Noir', 'ext4', 'Mutex-Lock'];

describe('content scripts normalize like the game', () => {
  for (const [file, fn] of SCRIPTS) {
    it(`${file} ${fn}() matches normalize()`, () => {
      const py = [
        'import importlib.util, json, sys',
        `spec = importlib.util.spec_from_file_location("m", ${JSON.stringify(file)})`,
        'm = importlib.util.module_from_spec(spec); spec.loader.exec_module(m)',
        `print(json.dumps([m.${fn}(s) for s in json.loads(sys.argv[1])]))`,
      ].join('\n');
      const out = execFileSync('python3', ['-I', '-c', py, JSON.stringify(CASES)], { encoding: 'utf8' });
      expect(JSON.parse(out)).toEqual(CASES.map(normalize));
    });
  }
});
