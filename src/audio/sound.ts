import type { LayerId } from '../core/layers';
import type { TierId } from '../core/tiers';
import { CASCADE, TEASE_AT, WOMM } from '../render/reaction-fx';

/**
 * Rich, layered procedural Web Audio API sound engine for Nullion.
 *
 * Uses custom NES/C64 pulse-width periodic waves, detuned unison voices, sub-bass body layers,
 * sweeping resonant filters, mechanical transient clicks, and a master DynamicsCompressorNode so
 * sounds are loud, textured, and punchy without clipping.
 *
 * Audio timbre sheds abstraction as you descend the software stack (mirroring the color-depth drop):
 *   Application / Runtime / Libraries → warm layered triangle + 25% pulse chimes with soft filter sweeps
 *   OS userspace / Kernel / Drivers   → punchy 25%/12.5% pulse-wave bleeps + mechanical clicks
 *   Firmware                          → raw IBM PC speaker POST beep (~1000 Hz) + relay clack
 *   Ring −1 / Ring −2                 → darker resonant low-pass pulses + hollow sub-tones
 *   Ring −3                           → stark, high-voltage 1-bit piezo bursts + static clicks
 */

export type Timbre = {
  wave: OscillatorType | 'pulse25' | 'pulse12';
  filterHz: number;
  q: number;
  gainScale: number;
  short?: boolean;
};

/** Layer → synth timbre: sheds warmth and fidelity as you descend. */
export function timbreFor(layer: LayerId): Timbre {
  switch (layer) {
    case 'application':
      return { wave: 'triangle', filterHz: 5200, q: 0.8, gainScale: 1.0 };
    case 'runtime':
    case 'libraries':
      return { wave: 'pulse25', filterHz: 3600, q: 1.4, gainScale: 0.92 };
    case 'userspace':
    case 'kernel':
    case 'drivers':
      return { wave: 'pulse12', filterHz: 2800, q: 2.0, gainScale: 0.85 };
    case 'firmware':
      return { wave: 'square', filterHz: 4200, q: 1.0, gainScale: 0.82 };
    case 'ring-1':
    case 'ring-2':
      return { wave: 'pulse25', filterHz: 1500, q: 2.4, gainScale: 0.8 };
    case 'ring-3':
      return { wave: 'square', filterHz: 6000, q: 0.7, gainScale: 0.85, short: true };
  }
}

interface ActiveNode {
  stop: () => void;
}

const MASTER_GAIN = 0.58;

/** Build a band-limited pulse wave of duty cycle `duty` (e.g. 0.25 or 0.125) for authentic chiptune grit. */
function makePulseWave(ctx: AudioContext, duty: number): PeriodicWave | null {
  if (typeof ctx.createPeriodicWave !== 'function') return null;
  const harmonics = 24;
  const real = new Float32Array(harmonics);
  const imag = new Float32Array(harmonics);
  for (let n = 1; n < harmonics; n++) {
    imag[n] = (2 / (n * Math.PI)) * Math.sin(n * Math.PI * duty);
  }
  return ctx.createPeriodicWave(real, imag);
}

export class SoundEngine {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private noiseBuf: AudioBuffer | null = null;
  private pulse25: PeriodicWave | null = null;
  private pulse12: PeriodicWave | null = null;
  private reactionNodes: ActiveNode[] = [];
  enabled = true;

  /** Lazily create and unlock the AudioContext on a user gesture. */
  unlock() {
    if (!this.enabled) return;
    const ctx = this.ensureCtx();
    if (ctx && ctx.state === 'suspended') void ctx.resume();
  }

  setEnabled(on: boolean) {
    this.enabled = on;
    if (!on) this.stopReactions();
    if (this.master && this.ctx) {
      this.master.gain.setValueAtTime(on ? MASTER_GAIN : 0, this.ctx.currentTime);
    }
  }

  /** Cancel any in-flight scheduled tier reaction tones (e.g. on early unwind or restart). */
  stopReactions() {
    for (const n of this.reactionNodes) {
      try {
        n.stop();
      } catch {
        // Already stopped
      }
    }
    this.reactionNodes.length = 0;
  }

  private ensureCtx(): AudioContext | null {
    if (!this.enabled) return null;
    if (this.ctx) {
      if (this.ctx.state === 'suspended') void this.ctx.resume();
      return this.ctx;
    }
    const Ctor =
      typeof window !== 'undefined'
        ? (window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext)
        : undefined;
    if (!Ctor) return null;
    const ctx = new Ctor();
    const master = ctx.createGain();
    master.gain.setValueAtTime(MASTER_GAIN, ctx.currentTime);
    // Gentle master glue compressor so rich multi-voice layers stay loud and punchy without clipping.
    if (typeof ctx.createDynamicsCompressor === 'function') {
      const comp = ctx.createDynamicsCompressor();
      comp.threshold.setValueAtTime(-14, ctx.currentTime);
      comp.knee.setValueAtTime(12, ctx.currentTime);
      comp.ratio.setValueAtTime(4, ctx.currentTime);
      comp.attack.setValueAtTime(0.004, ctx.currentTime);
      comp.release.setValueAtTime(0.12, ctx.currentTime);
      master.connect(comp);
      comp.connect(ctx.destination);
    } else {
      master.connect(ctx.destination);
    }
    this.ctx = ctx;
    this.master = master;
    this.pulse25 = makePulseWave(ctx, 0.25);
    this.pulse12 = makePulseWave(ctx, 0.125);
    return ctx;
  }

  private noise(ctx: AudioContext): AudioBuffer {
    if (this.noiseBuf) return this.noiseBuf;
    const len = Math.floor(ctx.sampleRate * 1.0);
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const data = buf.getChannelData(0);
    // Slightly shaped retro LFSR-ish crunchy noise
    let hold = 0;
    for (let i = 0; i < len; i++) {
      if (i % 2 === 0) hold = Math.random() * 2 - 1;
      data[i] = hold;
    }
    this.noiseBuf = buf;
    return buf;
  }

  private applyWave(osc: OscillatorNode, wave: Timbre['wave']) {
    if (wave === 'pulse25' && this.pulse25 && typeof osc.setPeriodicWave === 'function') {
      osc.setPeriodicWave(this.pulse25);
    } else if (wave === 'pulse12' && this.pulse12 && typeof osc.setPeriodicWave === 'function') {
      osc.setPeriodicWave(this.pulse12);
    } else {
      osc.type = wave === 'pulse25' || wave === 'pulse12' ? 'square' : wave;
    }
  }

  private voice(
    ctx: AudioContext,
    opts: {
      freq: number;
      toFreq?: number;
      at: number;
      dur: number;
      wave?: Timbre['wave'];
      gain?: number;
      attack?: number;
      filterHz?: number;
      toFilterHz?: number;
      q?: number;
      detune?: number;
      track?: boolean;
    },
  ) {
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    this.applyWave(osc, opts.wave ?? 'pulse25');
    osc.frequency.setValueAtTime(opts.freq, opts.at);
    if (opts.toFreq !== undefined) {
      osc.frequency.exponentialRampToValueAtTime(Math.max(24, opts.toFreq), opts.at + opts.dur);
    }
    if (opts.detune && osc.detune) {
      osc.detune.setValueAtTime(opts.detune, opts.at);
    }

    const peak = opts.gain ?? 0.32;
    const atk = opts.attack ?? Math.min(0.012, opts.dur * 0.18);
    g.gain.setValueAtTime(0.0001, opts.at);
    g.gain.linearRampToValueAtTime(peak, opts.at + atk);
    g.gain.exponentialRampToValueAtTime(0.0001, opts.at + opts.dur);

    if (opts.filterHz) {
      const f = ctx.createBiquadFilter();
      f.type = 'lowpass';
      f.frequency.setValueAtTime(opts.filterHz, opts.at);
      if (opts.toFilterHz !== undefined) {
        f.frequency.exponentialRampToValueAtTime(Math.max(60, opts.toFilterHz), opts.at + opts.dur);
      }
      if (opts.q && f.Q) f.Q.setValueAtTime(opts.q, opts.at);
      osc.connect(f);
      f.connect(g);
    } else {
      osc.connect(g);
    }
    g.connect(this.master!);
    osc.start(opts.at);
    osc.stop(opts.at + opts.dur + 0.02);
    if (opts.track) {
      this.reactionNodes.push({
        stop: () => {
          g.gain.cancelScheduledValues(ctx.currentTime);
          g.gain.setValueAtTime(0.0001, ctx.currentTime);
          osc.stop(ctx.currentTime + 0.005);
        },
      });
    }
  }

  /** Layered synth note: detuned unison pair + optional sub-octave body + filter sweep. */
  private layered(
    ctx: AudioContext,
    opts: {
      freq: number;
      toFreq?: number;
      at: number;
      dur: number;
      tm: Timbre;
      gain?: number;
      sub?: boolean;
      click?: boolean;
      track?: boolean;
    },
  ) {
    const g = (opts.gain ?? 0.34) * opts.tm.gainScale;
    this.voice(ctx, {
      freq: opts.freq,
      toFreq: opts.toFreq,
      at: opts.at,
      dur: opts.dur,
      wave: opts.tm.wave,
      gain: g * 0.62,
      filterHz: opts.tm.filterHz,
      toFilterHz: Math.max(240, opts.tm.filterHz * 0.32),
      q: opts.tm.q,
      detune: -7,
      track: opts.track,
    });
    this.voice(ctx, {
      freq: opts.freq,
      toFreq: opts.toFreq,
      at: opts.at,
      dur: opts.dur,
      wave: opts.tm.wave,
      gain: g * 0.54,
      filterHz: opts.tm.filterHz * 1.15,
      toFilterHz: Math.max(280, opts.tm.filterHz * 0.38),
      q: opts.tm.q,
      detune: 8,
      track: opts.track,
    });
    if (opts.sub) {
      this.voice(ctx, {
        freq: opts.freq * 0.5,
        toFreq: opts.toFreq ? opts.toFreq * 0.5 : undefined,
        at: opts.at,
        dur: opts.dur * 1.05,
        wave: 'triangle',
        gain: g * 0.55,
        filterHz: 900,
        track: opts.track,
      });
    }
    if (opts.click) {
      this.noiseBurst(ctx, { at: opts.at, dur: 0.018, filterHz: 3400, gain: g * 0.35, track: opts.track });
    }
  }

  private noiseBurst(
    ctx: AudioContext,
    opts: {
      at: number;
      dur: number;
      filterHz: number;
      toFilterHz?: number;
      type?: BiquadFilterType;
      q?: number;
      gain?: number;
      attack?: number;
      track?: boolean;
    },
  ) {
    const src = ctx.createBufferSource();
    src.buffer = this.noise(ctx);
    const f = ctx.createBiquadFilter();
    f.type = opts.type ?? 'bandpass';
    f.frequency.setValueAtTime(opts.filterHz, opts.at);
    if (opts.toFilterHz !== undefined) {
      f.frequency.exponentialRampToValueAtTime(Math.max(40, opts.toFilterHz), opts.at + opts.dur);
    }
    if (opts.q && f.Q) f.Q.setValueAtTime(opts.q, opts.at);
    const g = ctx.createGain();
    const peak = opts.gain ?? 0.28;
    const atk = opts.attack ?? 0.004;
    g.gain.setValueAtTime(0.0001, opts.at);
    g.gain.linearRampToValueAtTime(peak, opts.at + Math.min(atk, opts.dur * 0.4));
    g.gain.exponentialRampToValueAtTime(0.0001, opts.at + opts.dur);
    src.connect(f);
    f.connect(g);
    g.connect(this.master!);
    src.start(opts.at);
    src.stop(opts.at + opts.dur + 0.02);
    if (opts.track) {
      this.reactionNodes.push({
        stop: () => {
          g.gain.cancelScheduledValues(ctx.currentTime);
          g.gain.setValueAtTime(0.0001, ctx.currentTime);
          src.stop(ctx.currentTime + 0.005);
        },
      });
    }
  }

  /** Punchy retro sub-thud (sine/triangle pitch drop + filtered body click). */
  private thud(ctx: AudioContext, at: number, fromHz = 150, toHz = 44, dur = 0.22, gain = 0.48, track = false) {
    this.voice(ctx, { freq: fromHz, toFreq: toHz, at, dur, wave: 'sine', gain, attack: 0.004, track });
    this.noiseBurst(ctx, { at, dur: 0.035, type: 'lowpass', filterHz: 480, gain: gain * 0.45, track });
  }

  // -------------------------------------------------------------------------------------------
  // UI & Gameplay micro-SFX

  /** Title "Unwind the stack" dive: layered descending plunge + air rush. */
  diveStart() {
    const ctx = this.ensureCtx();
    if (!ctx) return;
    const t = ctx.currentTime;
    const tm = timbreFor('application');
    this.noiseBurst(ctx, { at: t, dur: 0.28, type: 'bandpass', filterHz: 1800, toFilterHz: 320, q: 1.5, gain: 0.24 });
    [587.33, 440, 293.66].forEach((f, i) => {
      this.layered(ctx, { freq: f, at: t + i * 0.055, dur: 0.16, tm, gain: 0.34, sub: i === 2, click: true });
    });
  }

  /** Pre-answer 3s → 2s → 1s countdown tick: tactile mechanical key-tick + soft pitched body. */
  countdownTick(secs: number, layer: LayerId) {
    const ctx = this.ensureCtx();
    if (!ctx) return;
    const tm = timbreFor(layer);
    const t = ctx.currentTime;
    const freq = secs === 1 ? 587.33 : secs === 2 ? 493.88 : 440;
    this.noiseBurst(ctx, { at: t, dur: 0.016, type: 'highpass', filterHz: 2600, gain: 0.16 });
    this.voice(ctx, {
      freq,
      at: t,
      dur: tm.short ? 0.03 : 0.065,
      wave: tm.wave,
      filterHz: tm.filterHz * 0.7,
      gain: 0.22 * tm.gainScale,
    });
  }

  /** Input unlocked for answering: bright layered two-note open chime. */
  roundOpen(layer: LayerId) {
    const ctx = this.ensureCtx();
    if (!ctx) return;
    const tm = timbreFor(layer);
    const t = ctx.currentTime;
    const d = tm.short ? 0.04 : 0.11;
    this.layered(ctx, { freq: 523.25, at: t, dur: d, tm, gain: 0.28, click: true });
    this.layered(ctx, { freq: 783.99, at: t + 0.055, dur: d * 1.6, tm, gain: 0.32, sub: true });
  }

  /** Watchdog low-time warning tick (5s..1s): urgent double-pulse mechanical tick. */
  lowTimeTick(layer: LayerId) {
    const ctx = this.ensureCtx();
    if (!ctx) return;
    const tm = timbreFor(layer);
    const t = ctx.currentTime;
    this.noiseBurst(ctx, { at: t, dur: 0.018, type: 'bandpass', filterHz: 2200, gain: 0.22 });
    this.voice(ctx, { freq: 330, toFreq: 280, at: t, dur: 0.055, wave: 'pulse25', filterHz: tm.filterHz * 0.7, gain: 0.24 });
  }

  /** Rejected guess: crunchy low fault buzz + mechanical bonk (matches cursor + console shake). */
  reject(layer: LayerId) {
    const ctx = this.ensureCtx();
    if (!ctx) return;
    const tm = timbreFor(layer);
    const t = ctx.currentTime;
    this.thud(ctx, t, 140, 68, 0.12, 0.32);
    this.voice(ctx, { freq: 175, toFreq: 112, at: t, dur: 0.13, wave: 'sawtooth', filterHz: 1100, toFilterHz: 320, q: 2.5, gain: 0.32 * tm.gainScale });
    this.voice(ctx, { freq: 185, toFreq: 118, at: t, dur: 0.13, wave: 'square', filterHz: 900, gain: 0.18 * tm.gainScale });
  }

  /** Typo suggestion ("Corrected to ..."): crisp polite upward double-chirp. */
  suggest(layer: LayerId) {
    const ctx = this.ensureCtx();
    if (!ctx) return;
    const tm = timbreFor(layer);
    const t = ctx.currentTime;
    this.layered(ctx, { freq: 493.88, at: t, dur: 0.07, tm, gain: 0.24, click: true });
    this.layered(ctx, { freq: 659.25, at: t + 0.055, dur: 0.1, tm, gain: 0.28 });
  }

  /** Watchdog timeout bark: heavy two-tone fault alarm + sub-drop. */
  bark() {
    const ctx = this.ensureCtx();
    if (!ctx) return;
    const t = ctx.currentTime;
    this.thud(ctx, t, 180, 60, 0.24, 0.44);
    this.voice(ctx, { freq: 245, at: t, dur: 0.14, wave: 'sawtooth', filterHz: 1400, toFilterHz: 500, q: 2, gain: 0.36 });
    this.voice(ctx, { freq: 155, toFreq: 86, at: t + 0.14, dur: 0.32, wave: 'sawtooth', filterHz: 1100, toFilterHz: 260, q: 2.5, gain: 0.4 });
    this.noiseBurst(ctx, { at: t + 0.14, dur: 0.12, type: 'bandpass', filterHz: 600, gain: 0.24 });
  }

  /** "Unwind further" button press: tactile mechanical relay switch + downward blip. */
  unwind(layer: LayerId) {
    const ctx = this.ensureCtx();
    if (!ctx) return;
    const tm = timbreFor(layer);
    const t = ctx.currentTime;
    this.noiseBurst(ctx, { at: t, dur: 0.02, type: 'highpass', filterHz: 3000, gain: 0.26 });
    this.layered(ctx, { freq: 640, toFreq: 420, at: t, dur: 0.08, tm, gain: 0.28 });
  }

  /** End-of-day backtrace reveal: warm resolved chiptune arpeggio chord with sub-bass. */
  endOfDay() {
    const ctx = this.ensureCtx();
    if (!ctx) return;
    const t = ctx.currentTime;
    const tm = timbreFor('application');
    this.thud(ctx, t, 130, 65, 0.38, 0.34);
    [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => {
      this.layered(ctx, { freq: f, at: t + i * 0.08, dur: 0.42, tm, gain: 0.28, sub: i === 0 });
    });
  }

  // -------------------------------------------------------------------------------------------
  // Motion-synced Dive & Cursor Morph SFX

  /** Plays right when a dive actually starts moving (synced with cursor plunge & speedlines). */
  playDive(frames: number, tier: TierId, layer: LayerId, durMs: number) {
    const ctx = this.ensureCtx();
    if (!ctx) return;
    const t = ctx.currentTime;
    const dur = Math.min(1.4, Math.max(0.22, durMs / 1000));
    if (tier === 'womm' || frames <= 1) {
      // Short dry downward slide for tiny +1 drops
      this.voice(ctx, { freq: 310, toFreq: 190, at: t, dur: Math.min(0.26, dur), wave: 'triangle', filterHz: 1100, gain: 0.22 });
      return;
    }
    // Air-rush bandpass sweep + falling sub-glide, heavier for deeper tiers
    const big = frames >= 5;
    this.noiseBurst(ctx, {
      at: t,
      dur: dur * 0.85,
      type: 'bandpass',
      filterHz: big ? 2400 : 1400,
      toFilterHz: big ? 240 : 320,
      q: big ? 2.2 : 1.4,
      gain: big ? 0.34 : 0.2,
      attack: 0.04,
    });
    const tm = timbreFor(layer);
    this.voice(ctx, {
      freq: big ? 320 : 260,
      toFreq: big ? 72 : 110,
      at: t,
      dur: dur * 0.9,
      wave: tm.wave,
      filterHz: big ? 1600 : 900,
      toFilterHz: 180,
      gain: big ? 0.3 : 0.18,
    });
  }

  /** Crisp pixel-shimmer when the cursor mutates into a new layer's form. */
  playMorph(layer: LayerId) {
    const ctx = this.ensureCtx();
    if (!ctx) return;
    const tm = timbreFor(layer);
    const t = ctx.currentTime;
    this.noiseBurst(ctx, { at: t, dur: 0.035, type: 'highpass', filterHz: 3200, gain: 0.2 });
    this.voice(ctx, { freq: 620, toFreq: 980, at: t, dur: 0.09, wave: tm.wave, filterHz: 3400, gain: 0.22 * tm.gainScale });
  }

  // -------------------------------------------------------------------------------------------
  // Tier Reactions (locked to reaction-fx.ts timelines)

  playTier(tier: TierId, layer: LayerId) {
    this.stopReactions();
    const ctx = this.ensureCtx();
    if (!ctx) return;
    const tm = timbreFor(layer);
    const t = ctx.currentTime;

    switch (tier) {
      case 'off-by-one': {
        // Mechanical click + two-voice blip where the second step lands a jarring half-step "off".
        this.layered(ctx, { freq: 440, at: t, dur: 0.11, tm, gain: 0.34, click: true, track: true });
        this.layered(ctx, { freq: 415.3, at: t + 0.11, dur: 0.18, tm, gain: 0.3, sub: true, track: true });
        break;
      }
      case 'npe': {
        // Sharp glitch-crunch + resonant downward void drop + hollow sub-thud as the black chunk opens.
        this.noiseBurst(ctx, { at: t, dur: 0.04, type: 'highpass', filterHz: 2800, gain: 0.34, track: true });
        this.voice(ctx, { freq: 680, toFreq: 58, at: t, dur: 0.28, wave: 'pulse25', filterHz: 2600, toFilterHz: 180, q: 3, gain: 0.38, track: true });
        this.thud(ctx, t + 0.22, 130, 38, 0.24, 0.52, true);
        this.noiseBurst(ctx, { at: t + 0.22, dur: 0.12, type: 'bandpass', filterHz: 320, gain: 0.28, track: true });
        break;
      }
      case 'leak': {
        // Resonant bubbly pluck with 4 cascading detuned echoes + watery noise tail drifting down.
        [0, 0.16, 0.34, 0.54].forEach((dt, i) => {
          const f = 587.33 * Math.pow(0.91, i);
          this.layered(ctx, {
            freq: f,
            toFreq: f * 0.96,
            at: t + dt,
            dur: 0.18,
            tm,
            gain: 0.36 - i * 0.06,
            sub: i === 0,
            click: i === 0,
            track: true,
          });
          this.noiseBurst(ctx, { at: t + dt, dur: 0.06, type: 'bandpass', filterHz: 1800 - i * 320, q: 3, gain: 0.14 - i * 0.025, track: true });
        });
        break;
      }
      case 'race': {
        // Two competing pulse voices + percussive clock-ticks colliding out of phase.
        const motif = [392, 523.25, 659.25, 587.33];
        motif.forEach((f, i) => {
          const atA = t + i * 0.095;
          const atB = atA + 0.042;
          this.noiseBurst(ctx, { at: atA, dur: 0.018, type: 'highpass', filterHz: 3400, gain: 0.2, track: true });
          this.voice(ctx, { freq: f, at: atA, dur: 0.11, wave: 'pulse25', filterHz: 3200, toFilterHz: 900, q: 2.2, gain: 0.32, track: true });
          this.voice(ctx, { freq: f * 1.03, at: atB, dur: 0.11, wave: 'pulse12', filterHz: 2800, toFilterHz: 700, q: 2.4, gain: 0.26, track: true });
        });
        this.thud(ctx, t, 150, 70, 0.18, 0.36, true);
        break;
      }
      case 'heisenbug': {
        // Eerie shimmering 3-voice harmonic cloud + sweeping bandpass mist that swells right at TEASE_AT (480ms).
        const swellAt = t + TEASE_AT / 1000;
        this.voice(ctx, { freq: 440, toFreq: 659.25, at: t, dur: 0.52, wave: 'triangle', filterHz: 2200, gain: 0.28, attack: 0.08, track: true });
        this.voice(ctx, { freq: 659.25, toFreq: 987.77, at: t + 0.04, dur: 0.56, wave: 'sine', detune: 11, gain: 0.22, attack: 0.1, track: true });
        this.noiseBurst(ctx, { at: swellAt, dur: 0.45, type: 'bandpass', filterHz: 2800, toFilterHz: 700, q: 3.5, gain: 0.26, attack: 0.06, track: true });
        [783.99, 987.77, 1174.66].forEach((f, i) => {
          this.voice(ctx, { freq: f, toFreq: f * 0.94, at: swellAt + i * 0.03, dur: 0.55, wave: 'triangle', detune: (i - 1) * 14, gain: 0.2, attack: 0.06, track: true });
        });
        break;
      }
      case 'bitflip': {
        // Finale sting: mirrors CASCADE (hang → blackout → leak → jiggle → massive 5-voice inversion chord at 1300 ms).
        this.playBitflipBuildup(ctx, t, false);
        const inv = t + CASCADE.invert[0] / 1000;
        // Impact sub-boom + crisp bright noise burst + 5-voice triumphant chiptune chord!
        this.thud(ctx, inv, 160, 42, 0.42, 0.58, true);
        this.noiseBurst(ctx, { at: inv, dur: 0.22, type: 'highpass', filterHz: 2400, gain: 0.28, track: true });
        [261.63, 523.25, 659.25, 783.99, 1046.5].forEach((f, i) => {
          this.voice(ctx, {
            freq: f,
            at: inv + i * 0.015,
            dur: 0.88,
            wave: i === 0 ? 'triangle' : i % 2 === 0 ? 'pulse25' : 'pulse12',
            filterHz: 4600,
            toFilterHz: 1400,
            q: 1.5,
            detune: (i - 2) * 5,
            gain: i === 0 ? 0.34 : 0.22,
            track: true,
          });
        });
        break;
      }
      case 'womm': {
        // Full-length Bit Flip audio fake-out: identical buildup through 1300 ms, then strains & shakes even
        // harder through 2200 ms, HARD-CUTS to dead silence on WOMM.freeze (2200 ms), plays a heavy dull
        // "Not Responding" thump at WOMM.gray (2600 ms), and a dry hourglass click at WOMM.hourglass (2900 ms).
        this.playBitflipBuildup(ctx, t, true);
        const grayAt = t + WOMM.gray / 1000;
        const hgAt = t + WOMM.hourglass / 1000;
        // Heavy, dull, low-pass "Not Responding" thump on grayscale wash
        this.thud(ctx, grayAt, 115, 48, 0.24, 0.48, true);
        this.voice(ctx, { freq: 148, toFreq: 112, at: grayAt, dur: 0.22, wave: 'triangle', filterHz: 420, gain: 0.34, track: true });
        // Crisp dry mechanical double-tick when hourglass appears
        this.noiseBurst(ctx, { at: hgAt, dur: 0.02, type: 'bandpass', filterHz: 2000, gain: 0.26, track: true });
        this.voice(ctx, { freq: 360, at: hgAt, dur: 0.045, wave: 'square', filterHz: 1200, gain: 0.22, track: true });
        this.voice(ctx, { freq: 290, at: hgAt + 0.06, dur: 0.05, wave: 'square', filterHz: 1000, gain: 0.18, track: true });
        break;
      }
    }
  }

  /** Shared Bit Flip / WOMM cascade buildup (0 → 1300ms for Bit Flip; extended straining rumble to 2200ms for WOMM). */
  private playBitflipBuildup(ctx: AudioContext, t: number, extendToFreeze: boolean) {
    // 0..450ms: deep tense sub-drone + metallic relay click
    this.noiseBurst(ctx, { at: t, dur: 0.025, type: 'highpass', filterHz: 2800, gain: 0.24, track: true });
    this.voice(ctx, { freq: 110, toFreq: 102, at: t, dur: 0.4, wave: 'pulse25', filterHz: 750, q: 2, gain: 0.32, track: true });
    this.voice(ctx, { freq: 55, at: t, dur: 0.42, wave: 'triangle', gain: 0.34, track: true });

    // 300ms: blackout crunch + sub-drop
    this.thud(ctx, t + 0.3, 150, 52, 0.22, 0.44, true);
    this.noiseBurst(ctx, { at: t + 0.3, dur: 0.18, type: 'bandpass', filterHz: 680, toFilterHz: 180, q: 2, gain: 0.34, track: true });

    // 550ms: leak crystalline ping
    this.voice(ctx, { freq: 440, toFreq: 587.33, at: t + 0.55, dur: 0.16, wave: 'pulse25', filterHz: 3200, gain: 0.3, track: true });
    this.voice(ctx, { freq: 880, toFreq: 1174.66, at: t + 0.57, dur: 0.14, wave: 'triangle', gain: 0.2, track: true });

    // 700ms+: rising 2-voice pulse arpeggio + opening noise riser
    const endMs = extendToFreeze ? WOMM.freeze - 30 : CASCADE.invert[0];
    const span = (endMs - 700) / 1000;
    this.noiseBurst(ctx, {
      at: t + 0.7,
      dur: span,
      type: 'bandpass',
      filterHz: 500,
      toFilterHz: extendToFreeze ? 4600 : 3200,
      q: 2.4,
      gain: extendToFreeze ? 0.36 : 0.28,
      attack: span * 0.75,
      track: true,
    });
    const steps = extendToFreeze ? 18 : 8;
    for (let i = 0; i < steps; i++) {
      const p = i / Math.max(1, steps - 1);
      const at = t + 0.7 + p * span;
      const freq = 261.63 * Math.pow(extendToFreeze ? 2.8 : 2.1, p);
      const dur = Math.min(0.11, endMs / 1000 - (at - t));
      if (dur <= 0.015) break;
      this.voice(ctx, {
        freq,
        at,
        dur,
        wave: 'pulse25',
        filterHz: 1800 + p * 3200,
        q: 1.8,
        gain: 0.22 + p * 0.16,
        track: true,
      });
      if (extendToFreeze && at >= t + CASCADE.invert[0] / 1000) {
        // Extra straining grit + sub-rumble during WOMM's 1300→2200ms over-intense shake!
        this.voice(ctx, {
          freq: freq * 0.5,
          at,
          dur,
          wave: 'sawtooth',
          filterHz: 900 + p * 1200,
          detune: (i % 2 === 0 ? 1 : -1) * 18,
          gain: 0.2 + p * 0.14,
          track: true,
        });
      }
    }
  }

  /** Landing sound after a dive: tiny anticlimactic plink for +1 / WOMM, heavy sub-boom + chime for big dives. */
  playLand(frames: number, tier: TierId, layer: LayerId) {
    const ctx = this.ensureCtx();
    if (!ctx) return;
    const tm = timbreFor(layer);
    const t = ctx.currentTime;
    if (tier === 'womm' || frames <= 1) {
      this.layered(ctx, { freq: 300, toFreq: 215, at: t, dur: 0.1, tm, gain: 0.26, click: true });
    } else if (frames >= 5) {
      this.thud(ctx, t, frames >= 10 ? 180 : 150, 40, frames >= 10 ? 0.34 : 0.24, frames >= 10 ? 0.6 : 0.48);
      this.layered(ctx, { freq: frames >= 10 ? 783.99 : 587.33, at: t + 0.015, dur: 0.24, tm, gain: 0.34, sub: true });
    } else {
      this.thud(ctx, t, 130, 58, 0.16, 0.34);
      this.layered(ctx, { freq: 349.23, toFreq: 261.63, at: t, dur: 0.14, tm, gain: 0.28 });
    }
  }

  // -------------------------------------------------------------------------------------------
  // Layer Boundary Crossings

  playLayerCross(layer: LayerId) {
    const ctx = this.ensureCtx();
    if (!ctx) return;
    const t = ctx.currentTime;
    switch (layer) {
      case 'kernel':
        // Syscall boundary: heavy filtered tear zip + sub-thump
        this.thud(ctx, t, 140, 50, 0.18, 0.4);
        this.noiseBurst(ctx, { at: t, dur: 0.22, type: 'bandpass', filterHz: 2400, toFilterHz: 260, q: 2.2, gain: 0.36 });
        break;
      case 'firmware':
        // Classic IBM PC speaker POST beep (~1000 Hz raw square wave) + subtle relay clack
        this.noiseBurst(ctx, { at: t, dur: 0.018, type: 'highpass', filterHz: 3000, gain: 0.22 });
        this.voice(ctx, { freq: 1000, at: t + 0.015, dur: 0.15, wave: 'square', gain: 0.34, attack: 0.002 });
        break;
      case 'ring-1':
        // VM exit: resonant dual-voice detuned mirror shimmer
        this.voice(ctx, { freq: 440, at: t, dur: 0.28, wave: 'pulse25', filterHz: 2200, toFilterHz: 700, q: 2, gain: 0.26 });
        this.voice(ctx, { freq: 448, at: t + 0.03, dur: 0.28, wave: 'pulse25', filterHz: 2200, toFilterHz: 700, q: 2, gain: 0.26 });
        this.voice(ctx, { freq: 220, at: t, dur: 0.26, wave: 'triangle', gain: 0.24 });
        break;
      case 'ring-2':
        // SMI: abrupt tape-stop / clock-halt drop + mechanical lock
        this.voice(ctx, { freq: 380, toFreq: 48, at: t, dur: 0.14, wave: 'square', filterHz: 1400, toFilterHz: 240, gain: 0.34 });
        this.noiseBurst(ctx, { at: t + 0.12, dur: 0.025, type: 'highpass', filterHz: 2600, gain: 0.28 });
        break;
      case 'ring-3':
        // ME: stark 1-bit high-voltage piezo double-ping + crisp static snap
        this.noiseBurst(ctx, { at: t, dur: 0.02, type: 'highpass', filterHz: 4000, gain: 0.3 });
        this.voice(ctx, { freq: 1760, at: t, dur: 0.045, wave: 'square', gain: 0.32, attack: 0.001 });
        this.voice(ctx, { freq: 880, at: t + 0.06, dur: 0.035, wave: 'square', gain: 0.26, attack: 0.001 });
        break;
      default: {
        // Subtle layered step chime in the new layer's timbre
        const tm = timbreFor(layer);
        this.layered(ctx, { freq: 392, toFreq: 493.88, at: t, dur: 0.11, tm, gain: 0.22, click: true });
      }
    }
  }
}

export const sound = new SoundEngine();
