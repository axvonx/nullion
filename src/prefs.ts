import { persisted } from './store';

/** Player-facing preferences (present in production, unlike the debug-only settings). */
export interface Prefs {
  /** 'confirm': typos show the correction inline and wait for Enter. 'auto': accept the correction immediately. */
  autocorrect: 'confirm' | 'auto';
}

export const DEFAULT_PREFS: Prefs = { autocorrect: 'confirm' };

export const prefs = persisted<Prefs>('nullion.prefs', DEFAULT_PREFS);
