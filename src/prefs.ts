import { persisted } from './store';

/** Player-facing preferences (present in production, unlike the debug-only settings). */
export interface Prefs {
  /** 'confirm': typos show the correction inline and wait for Enter. 'auto': accept the correction immediately. */
  autocorrect: 'confirm' | 'auto';
  /** Procedural chiptune SFX: on by default, one-click mute in header or here. */
  sound: 'on' | 'off';
}

export const DEFAULT_PREFS: Prefs = { autocorrect: 'confirm', sound: 'on' };

export const prefs = persisted<Prefs>('nullion.prefs', DEFAULT_PREFS);
