/**
 * The writing catalog's file format: writing/<surface>.md, one file per place text appears. Like bank-format.ts and
 * manual-format.ts, the grammar is strict and every error names the file and line. (Erasable TypeScript only, no
 * imports: scripts/writing-report.mjs loads this file straight under Node.)
 *
 *   ## reveal.timeout.rejected
 *   where: the reveal after a time-out, under "Time's up"
 *   when: the watchdog ran out and the player had a rejected guess
 *   max: 40
 *   vars: {guess}
 *   status: draft
 *
 *   {guess}: Not accepted
 *
 * - A string is a `## <key>` heading, metadata lines, a blank line, then the text. Keys are dotted lower-case words
 *   (`reveal.quip.leak`) and start with the file's name plus a dot: reveal.md holds `reveal.*`.
 * - Metadata: `where:`, `when:` and `status:` are required; `max:` (most characters of any one text, `{vars}` counted
 *   as written) and `vars:` (the `{names}` the text may use, comma separated) are optional.
 *   `status` is `draft` (an agent wrote it) or `owner` (the owner wrote it by hand; an agent never overwrites it).
 * - The text is either one paragraph (its lines join with a space) or a list of `- ` lines, the variants the game
 *   rotates through or indexes. Never both. A `{name}` in the text must be declared in `vars:`, and each declared var
 *   must appear in the text.
 * - Lines starting with `<!--` are comments and are ignored. Prose before the first heading is free (a title, a note).
 */

export const WRITING_STATUSES = ['draft', 'owner'] as const;
export type WritingStatus = (typeof WRITING_STATUSES)[number];

export interface WritingString {
  key: string;
  where: string;
  when: string;
  max?: number;
  /** Declared variable names, without braces. */
  vars: readonly string[];
  status: WritingStatus;
  /** True for a `- ` list; the game reads it with `variants()`, a paragraph with `text()`. */
  list: boolean;
  /** One entry for a paragraph, one per `- ` line for a list. */
  texts: readonly string[];
  /** The file and the line of the heading, for messages. */
  path: string;
  line: number;
}

export class WritingFormatError extends Error {
  constructor(path: string, line: number, message: string) {
    super(`${path}:${line}: ${message}`);
    this.name = 'WritingFormatError';
  }
}

const KEY_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*(?:\.[a-z0-9]+(?:-[a-z0-9]+)*)+$/;
const META_RE = /^([a-z]+):\s?(.*)$/;
const META_KEYS = new Set(['where', 'when', 'max', 'vars', 'status']);
const VAR_RE = /^[a-z][A-Za-z0-9]*$/;
const PLACEHOLDER_RE = /\{([^{}]*)\}/g;

/** The `{names}` a text uses, in order of appearance, without repeats. */
export function placeholdersOf(s: string): string[] {
  return [...new Set([...s.matchAll(PLACEHOLDER_RE)].map((m) => m[1]!))];
}

/** The file stem a path names: `writing/end-card.md` is `end-card`. */
export function writingStem(path: string): string {
  const m = /([^/]+)\.md$/.exec(path);
  if (!m) throw new WritingFormatError(path, 1, 'not a .md file');
  return m[1]!;
}

/** Parse one writing file. Throws WritingFormatError naming `path` and the line. */
export function parseWritingFile(path: string, source: string): WritingString[] {
  const stem = writingStem(path);
  const lines = source.split('\n');
  if (lines[lines.length - 1] === '') lines.pop();
  const out: WritingString[] = [];
  const seen = new Set<string>();
  const isComment = (l: string) => l.startsWith('<!--');
  let i = 0;
  const fail = (msg: string, at = i): never => {
    throw new WritingFormatError(path, at + 1, msg);
  };

  // Anything before the first heading (a title, a note on the file) is free prose.
  while (i < lines.length && !lines[i]!.startsWith('## ')) i++;

  while (i < lines.length) {
    const head = i;
    const key = lines[i]!.slice(3).trim();
    if (!KEY_RE.test(key)) fail(`bad key "${key}": dotted lower-case words, like reveal.timeout.line`);
    if (!key.startsWith(`${stem}.`)) fail(`key "${key}" must start with "${stem}." in ${stem}.md`);
    if (seen.has(key)) fail(`duplicate key "${key}"`);
    seen.add(key);
    i++;

    const meta = new Map<string, { value: string; line: number }>();
    while (i < lines.length && lines[i]!.trim() !== '' && !isComment(lines[i]!)) {
      const l = lines[i]!;
      if (l.startsWith('- ') || l.startsWith('## ')) break;
      const m = META_RE.exec(l);
      if (!m) fail(`expected a metadata line (where:, when:, max:, vars:, status:), found "${l}"`);
      const name = m![1]!;
      if (!META_KEYS.has(name)) fail(`unknown metadata "${name}:" (known: ${[...META_KEYS].join(', ')})`);
      if (meta.has(name)) fail(`duplicate metadata "${name}:" in ${key}`);
      meta.set(name, { value: m![2]!.trim(), line: i });
      i++;
    }
    const need = (name: string): string => {
      const m = meta.get(name);
      if (!m) fail(`${key} has no "${name}:" line`, head);
      if (m!.value === '') fail(`"${name}:" is empty in ${key}`, m!.line);
      return m!.value;
    };
    const where = need('where');
    const when = need('when');
    const statusRaw = need('status');
    if (!(WRITING_STATUSES as readonly string[]).includes(statusRaw)) fail(`status must be ${WRITING_STATUSES.join(' or ')}, not "${statusRaw}"`, meta.get('status')!.line);
    let max: number | undefined;
    if (meta.has('max')) {
      const raw = need('max');
      if (!/^[1-9]\d*$/.test(raw)) fail(`max must be a positive whole number, not "${raw}"`, meta.get('max')!.line);
      max = Number(raw);
    }
    const vars: string[] = [];
    if (meta.has('vars')) {
      for (const part of need('vars').split(',')) {
        const m = /^\{([^{}]*)\}$/.exec(part.trim());
        if (!m || !VAR_RE.test(m[1]!)) fail(`vars must be comma-separated {names} (letters and digits, starting lower-case), found "${part.trim()}"`, meta.get('vars')!.line);
        if (vars.includes(m![1]!)) fail(`var {${m![1]!}} is declared twice`, meta.get('vars')!.line);
        vars.push(m![1]!);
      }
    }

    while (i < lines.length && (lines[i]!.trim() === '' || isComment(lines[i]!))) i++;
    const bodyStart = i;
    const body: { text: string; line: number }[] = [];
    while (i < lines.length && !lines[i]!.startsWith('## ')) {
      const l = lines[i]!;
      if (l.trim() === '') {
        // A blank line ends the text; only blanks and comments may follow before the next heading.
        i++;
        while (i < lines.length && !lines[i]!.startsWith('## ')) {
          if (lines[i]!.trim() !== '' && !isComment(lines[i]!)) fail('the text must be one paragraph or one "- " list, with no blank line inside it', i);
          i++;
        }
        break;
      }
      if (!isComment(l)) body.push({ text: l, line: i });
      i++;
    }
    if (body.length === 0) fail(`${key} has no text`, head);
    const bullets = body.filter((b) => b.text.startsWith('- ')).length;
    if (bullets !== 0 && bullets !== body.length) fail(`${key} mixes a paragraph with "- " variants`, bodyStart);
    const list = bullets > 0;
    const texts = list ? body.map((b) => b.text.slice(2).trim()) : [body.map((b) => b.text.trim()).join(' ')];
    texts.forEach((t, n) => {
      const at = list ? body[n]!.line : bodyStart;
      if (t === '') fail('an empty variant', at);
      for (const p of placeholdersOf(t)) if (!vars.includes(p)) fail(`{${p}} is used but not declared in vars:`, at);
      const stripped = t.replace(PLACEHOLDER_RE, '');
      if (/[{}]/.test(stripped)) fail('a stray brace: write variables as {name}', at);
      if (max !== undefined && t.length > max) fail(`${t.length} characters, over max: ${max}`, at);
    });
    for (const v of vars) if (!texts.some((t) => placeholdersOf(t).includes(v))) fail(`{${v}} is declared in vars: but no text uses it`, meta.get('vars')!.line);

    out.push({ key, where, when, ...(max !== undefined ? { max } : {}), vars, status: statusRaw as WritingStatus, list, texts, path, line: head + 1 });
  }
  if (out.length === 0) fail('no strings in this file', 0);
  return out;
}

/** Parse every file of the catalog (path -> source) into one map, rejecting a key defined twice. */
export function parseWriting(files: Record<string, string>): Map<string, WritingString> {
  const all = new Map<string, WritingString>();
  for (const path of Object.keys(files).sort()) {
    for (const s of parseWritingFile(path, files[path]!)) {
      const prev = all.get(s.key);
      if (prev) throw new WritingFormatError(path, s.line, `key "${s.key}" is also defined at ${prev.path}:${prev.line}`);
      all.set(s.key, s);
    }
  }
  return all;
}

/** Fill `{name}` placeholders. Throws if `vars` and the text's placeholders disagree. */
export function fillVars(key: string, template: string, declared: readonly string[], vars: Record<string, string | number> | undefined): string {
  const given = Object.keys(vars ?? {});
  const missing = declared.filter((v) => !given.includes(v));
  const extra = given.filter((v) => !declared.includes(v));
  if (missing.length || extra.length) {
    throw new Error(`invariant violated: text '${key}' takes {${declared.join('}, {')}} but was given ${given.length ? `{${given.join('}, {')}}` : 'none'}${missing.length ? ` (missing ${missing.join(', ')})` : ''}${extra.length ? ` (unexpected ${extra.join(', ')})` : ''}`);
  }
  return template.replace(PLACEHOLDER_RE, (_, name: string) => String(vars![name]));
}
