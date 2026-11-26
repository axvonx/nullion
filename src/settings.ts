import { persisted } from './store';

/** Debug-build play settings. In the production build these stay at their defaults. */
export interface Settings {
  /** 'play' = the real game. 'scroll' = no answers; scroll/arrow keys move through the stack. */
  mode: 'play' | 'scroll';
  /** YYYY-MM-DD override, or '' for today. */
  date: string;
  timer: boolean;
  /** Keep answering after the first accepted answer; only the first one pushes frames. */
  unlimited: boolean;
  answerSet: string;
}

export const DEFAULT_SETTINGS: Settings = { mode: 'play', date: '', timer: true, unlimited: false, answerSet: 'sample' };

export const settings = persisted<Settings>('nullion.settings', DEFAULT_SETTINGS);
