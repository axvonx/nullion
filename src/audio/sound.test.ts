import { describe, expect, it } from 'vitest';
import { LAYERS } from '../core/layers';
import { TIER_IDS } from '../core/tiers';
import { SoundEngine, timbreFor } from './sound';

function makeMockAudioContext() {
  let oscCount = 0;
  let noiseCount = 0;
  let stopped = 0;
  const param = () => ({
    setValueAtTime() {},
    linearRampToValueAtTime() {},
    exponentialRampToValueAtTime() {},
    cancelScheduledValues() {},
  });
  class MockAudioContext {
    currentTime = 0;
    sampleRate = 44100;
    state = 'running';
    destination = {};
    resume() {
      return Promise.resolve();
    }
    createGain() {
      return { gain: param(), connect() {} };
    }
    createDynamicsCompressor() {
      return {
        threshold: param(),
        knee: param(),
        ratio: param(),
        attack: param(),
        release: param(),
        connect() {},
      };
    }
    createPeriodicWave() {
      return {};
    }
    createBiquadFilter() {
      return { type: 'lowpass', frequency: param(), Q: param(), connect() {} };
    }
    createOscillator() {
      oscCount++;
      return {
        type: 'square',
        frequency: param(),
        detune: param(),
        setPeriodicWave() {},
        connect() {},
        start() {},
        stop() {
          stopped++;
        },
      };
    }
    createBuffer(_ch: number, len: number) {
      const data = new Float32Array(len);
      return { getChannelData: () => data };
    }
    createBufferSource() {
      noiseCount++;
      return {
        buffer: null,
        connect() {},
        start() {},
        stop() {
          stopped++;
        },
      };
    }
  }
  return { MockAudioContext, counts: () => ({ oscCount, noiseCount, stopped }) };
}

describe('sound engine', () => {
  it('maps every layer to a valid timbre, degrading from triangle down to short square in Ring −3', () => {
    for (const l of LAYERS) {
      const tm = timbreFor(l.id);
      expect(tm.gainScale).toBeGreaterThan(0);
    }
    expect(timbreFor('application').wave).toBe('triangle');
    expect(timbreFor('kernel').wave).toBe('pulse12');
    expect(timbreFor('ring-3').short).toBe(true);
  });

  it('safely no-ops when AudioContext is unavailable', () => {
    const engine = new SoundEngine();
    expect(() => {
      engine.unlock();
      engine.diveStart();
      engine.countdownTick(3, 'application');
      engine.roundOpen('application');
      engine.reject('application');
      engine.playTier('bitflip', 'kernel');
      engine.playLayerCross('firmware');
      engine.stopReactions();
    }).not.toThrow();
  });

  it('schedules tones for every tier and layer crossing when enabled, and silences when muted', () => {
    const { MockAudioContext, counts } = makeMockAudioContext();
    const prevWin = globalThis.window;
    (globalThis as unknown as { window: { AudioContext: unknown } }).window = { AudioContext: MockAudioContext };
    try {
      const engine = new SoundEngine();
      engine.diveStart();
      engine.countdownTick(3, 'application');
      engine.roundOpen('application');
      engine.lowTimeTick('kernel');
      engine.reject('kernel');
      engine.suggest('kernel');
      engine.bark();
      engine.unwind('firmware');
      engine.endOfDay();
      for (const tier of TIER_IDS) {
        engine.playTier(tier, 'kernel');
        engine.playDive(tier === 'bitflip' ? 13 : 1, tier, 'kernel', 1000);
        engine.playLand(tier === 'bitflip' ? 13 : 1, tier, 'kernel');
      }
      engine.playMorph('kernel');
      for (const l of LAYERS) engine.playLayerCross(l.id);

      const afterPlay = counts();
      expect(afterPlay.oscCount).toBeGreaterThan(40);
      expect(afterPlay.noiseCount).toBeGreaterThan(0);

      // Muting stops active reaction nodes and prevents further scheduling.
      engine.setEnabled(false);
      const beforeMuted = counts().oscCount;
      engine.playTier('bitflip', 'kernel');
      engine.playLayerCross('firmware');
      expect(counts().oscCount).toBe(beforeMuted);
    } finally {
      (globalThis as unknown as { window: unknown }).window = prevWin;
    }
  });
});
