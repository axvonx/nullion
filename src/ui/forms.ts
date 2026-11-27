/**
 * The console card takes the idiom of the layer the cursor is in, the way the cursor changes form:
 * a GUI dialog up top, then a REPL, a shell, a serial console, BIOS setup, and barer logs below.
 * In every form the plain-language prompt stays readable and the input is the same real <input>.
 */
export type FormId = 'gui' | 'repl' | 'shell' | 'serial' | 'bios' | 'hyper' | 'smm' | 'raw';

export const FORM_IDS: readonly FormId[] = ['gui', 'repl', 'shell', 'serial', 'bios', 'hyper', 'smm', 'raw'];

export const FORM_NAMES: Record<FormId, string> = {
  gui: 'GUI dialog',
  repl: 'REPL',
  shell: 'Shell',
  serial: 'Serial console',
  bios: 'BIOS setup',
  hyper: 'Hypervisor log',
  smm: 'SMM dump',
  raw: 'Raw entry',
};

export interface FormView {
  /** The input's caret label. */
  caret(): string;
}

export const FORMS: Record<FormId, FormView> = {
  gui: { caret: () => '' },
  repl: { caret: () => '...' },
  shell: { caret: () => '>' },
  serial: { caret: () => '>' },
  bios: { caret: () => 'Value: [' },
  hyper: { caret: () => 'guest>' },
  smm: { caret: () => 'smm>' },
  raw: { caret: () => '0x' },
};
