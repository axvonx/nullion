import { persisted } from './store';
import type { SoundMode, VolumeLevel } from './audio/sound';

export type MotionPref = 'system' | 'full' | 'reduced';

/** Player-facing preferences (present in production, unlike the debug-only settings). */
export interface Prefs {
  /** 'confirm': typos show the correction inline and wait for Enter. 'auto': accept the correction immediately. */
  autocorrect: 'confirm' | 'auto';
  /** Procedural chiptune audio: full (SFX + ambience), sfx (SFX only), or off (muted). */
  sound: SoundMode;
  /** Master SFX volume level. */
  volume: VolumeLevel;
  /** Reduced motion preference (production-accessible). */
  motion: MotionPref;
}

export const DEFAULT_PREFS: Prefs = { autocorrect: 'confirm', sound: 'full', volume: 'medium', motion: 'system' };

export const prefs = persisted<Prefs>('nullion.prefs', DEFAULT_PREFS);

// Migrate legacy saved `sound: 'on'` → `'full'` cleanly so old localStorage never breaks.
if ((prefs.get().sound as string) === 'on') {
  prefs.set({ sound: 'full' });
}
