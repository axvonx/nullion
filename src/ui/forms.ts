import type { LayerId } from '../core/layers';

/**
 * The console card takes the idiom of the layer the cursor is in, the way the cursor changes form:
 * a GUI dialog up top, then a REPL, a shell, a serial console, BIOS setup, and barer logs below.
 * In every form the plain-language prompt stays readable and the input is the same real <input>.
 */
export type FormId = 'gui' | 'repl' | 'shell' | 'serial' | 'bios' | 'hyper' | 'smm' | 'raw';

export const FORM_IDS: readonly FormId[] = ['gui', 'repl', 'shell', 'serial', 'bios', 'hyper', 'smm', 'raw'];

export const FORM_BY_LAYER: Record<LayerId, FormId> = {
  application: 'gui',
  runtime: 'repl',
  libraries: 'repl',
  userspace: 'shell',
  kernel: 'serial',
  drivers: 'serial',
  firmware: 'bios',
  'ring-1': 'hyper',
  'ring-2': 'smm',
  'ring-3': 'raw',
};

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
  /** Text before the call on the call line (the call itself types in after it). */
  prefix(ts: string): string;
  /** How the call reads in this idiom. */
  call(call: string): string;
  /** The input's caret label. */
  caret(ts: string): string;
}

const asShell = (call: string) => call.replace('(', ' ').replace(/\)$/, '');

export const FORMS: Record<FormId, FormView> = {
  gui: { prefix: () => '', call: (c) => c, caret: () => '' },
  repl: { prefix: () => '>>> ', call: (c) => c, caret: () => '...' },
  shell: { prefix: () => '$ ', call: asShell, caret: () => '>' },
  serial: { prefix: (ts) => `[${ts}] `, call: (c) => c, caret: (ts) => `[${ts}] >` },
  bios: { prefix: () => '', call: (c) => c, caret: () => 'Value: [' },
  hyper: { prefix: () => 'vmexit: ', call: (c) => c, caret: () => 'guest>' },
  smm: { prefix: () => 'SMRAM:7F00 ', call: (c) => c, caret: () => 'smm>' },
  raw: { prefix: () => '', call: (c) => c, caret: () => '0x' },
};

/** Seconds since boot, serial-console style: "[   41.002]". */
export function serialStamp(nowMs: number): string {
  return (nowMs / 1000).toFixed(3).padStart(8, ' ');
}
