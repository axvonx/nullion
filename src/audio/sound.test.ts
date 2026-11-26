import { describe, expect, it } from 'vitest';
import { ALL_LAYER_IDS } from '../core/layers';
import { TIER_IDS } from '../core/tiers';
import { SoundEngine, encodeWav, timbreFor } from './sound';

function makeMockAudioContext() {
  let oscCount = 0;
  let noiseCount = 0;
  let pannerCount = 0;
  let shaperCount = 0;
  let stopped = 0;
  const param = () => ({
    setValueAtTime() {},
    setTargetAtTime() {},
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
    createConvolver() {
      return { buffer: null, connect() {} };
    }
    createWaveShaper() {
      shaperCount++;
      return { curve: null, oversample: 'none', connect() {} };
    }
    createStereoPanner() {
      pannerCount++;
      return { pan: param(), connect() {} };
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
    createBuffer(ch: number, len: number) {
      const channels = Array.from({ length: ch }, () => new Float32Array(len));
      return { numberOfChannels: ch, length: len, sampleRate: 44100, getChannelData: (i: number) => channels[i]! };
    }
    createBufferSource() {
      noiseCount++;
      return {
        buffer: null,
        loop: false,
        connect() {},
        start() {},
        stop() {
          stopped++;
        },
      };
    }
  }
  return { MockAudioContext, counts: () => ({ oscCount, noiseCount, pannerCount, shaperCount, stopped }) };
}

describe('sound engine', () => {
  it('maps all 29 Daily & Endless layers to valid timbres', () => {
    for (const id of ALL_LAYER_IDS) {
      const tm = timbreFor(id);
      expect(tm.gainScale).toBeGreaterThan(0);
    }
    expect(timbreFor('application').wave).toBe('triangle');
    expect(timbreFor('kernel').wave).toBe('pulse12');
    expect(timbreFor('ring-3').short).toBe(true);
    expect(timbreFor('landauer').wave).toBe('sine');
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
      engine.setPuzzleSeed(42);
      engine.playMorph('kernel');
      engine.setVolume('high');
      engine.playTitleGlitch('mirror-flip');
      engine.playTitleGlitch('bitflip');
      engine.playTitleGlitch('mini-ghosts');
      engine.playAmbientEvent('kernel');
      engine.setAmbienceFrozen(true);
      engine.setAmbienceFrozen(false);
      for (const id of ALL_LAYER_IDS) {
        engine.playLayerCross(id);
        engine.playCritter(id, -0.4);
        engine.playCritterExit(id, 0.3);
      }

      const afterPlay = counts();
      expect(afterPlay.oscCount).toBeGreaterThan(40);
      expect(afterPlay.noiseCount).toBeGreaterThan(0);
      expect(afterPlay.pannerCount).toBeGreaterThan(0);
      expect(afterPlay.shaperCount).toBeGreaterThan(0);

      // SFX-only mode keeps SFX working while disabling ambience.
      engine.setMode('sfx');
      const beforeSfx = counts().oscCount;
      engine.unwind('application');
      expect(counts().oscCount).toBeGreaterThan(beforeSfx);

      // Muting stops active reaction nodes and prevents further scheduling.
      engine.setMode('off');
      const beforeMuted = counts().oscCount;
      engine.playTier('bitflip', 'kernel');
      engine.playLayerCross('firmware');
      expect(counts().oscCount).toBe(beforeMuted);
    } finally {
      (globalThis as unknown as { window: unknown }).window = prevWin;
    }
  });

  it('encodes an AudioBuffer into a valid 16-bit PCM WAV Blob', async () => {
    const ch0 = new Float32Array([0, 0.5, -0.5, 1]);
    const ch1 = new Float32Array([0, -0.5, 0.5, -1]);
    const fakeBuf = {
      numberOfChannels: 2,
      length: 4,
      sampleRate: 44100,
      getChannelData: (i: number) => (i === 0 ? ch0 : ch1),
    } as unknown as AudioBuffer;
    const blob = encodeWav(fakeBuf);
    expect(blob.type).toBe('audio/wav');
    // 44-byte WAV header + 4 samples * 2 channels * 2 bytes = 60 bytes
    expect(blob.size).toBe(60);
  });
});
