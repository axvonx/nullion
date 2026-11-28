import { storageKey } from './keys';
import { persisted } from './store';
import { normalizeVolume, type SoundMode, type VolumeLevel } from './audio/sound';

export type MotionPref = 'system' | 'full' | 'reduced';

/** Player-facing preferences (present in production, unlike the debug-only settings). */
export interface Prefs {
  /** 'confirm': typos show the correction inline and wait for Enter. 'auto': accept the correction immediately. */
  autocorrect: 'confirm' | 'auto';
  /** Procedural chiptune audio: full (SFX + ambience), sfx (SFX only), or off (muted). */
  sound: SoundMode;
  /** Master SFX volume step (1 = 25%, 2 = 50%, 3 = 75%, 4 = 100%). */
  volume: VolumeLevel;
  /** Reduced motion preference (production-accessible). */
  motion: MotionPref;
}

export const DEFAULT_PREFS: Prefs = { autocorrect: 'confirm', sound: 'full', volume: 3, motion: 'system' };

export const prefs = persisted<Prefs>(storageKey('prefs'), DEFAULT_PREFS);

// Migrate legacy saved `sound: 'on'` → `'full'` and `volume: 'low' | 'medium' | 'high'` → `1..4` cleanly.
{
  const cur = prefs.get();
  const patch: Partial<Prefs> = {};
  if ((cur.sound as string) === 'on') patch.sound = 'full';
  const normVol = normalizeVolume(cur.volume);
  if (cur.volume !== normVol) patch.volume = normVol;
  if (Object.keys(patch).length > 0) prefs.set(patch);
}
