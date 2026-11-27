import type { LayerId } from '../core/layers';
import { LAYER_ART } from '../layers';
import type { TierId } from '../core/tiers';
import { CASCADE, TEASE_AT, WOMM } from '../render/reaction-fx';
import type { TitleGlitchKind } from '../ui/title-logo';

/**
 * Rich, layered procedural Web Audio API sound engine for Nullion.
 *
 * Features:
 * - Procedural stereo ConvolverNode reverb whose wet mix adapts to the current layer
 * - 2-operator FM synthesis (glassy, metallic, bell-like textures) + WaveShaperNode bitcrushing
 * - Custom NES/C64 pulse-width periodic waves (25%, 12.5%), detuned unison, sub-bass thuds, LFSR noise
 * - Subtle crossfading layer hardware ambience bed (dead silence in Ring −2 and during WOMM freeze)
 * - StereoPannerNode + synchronized volume swells for Race condition, Memory leak, and Heisenbug
 * - Quiet title-screen glitch micro-foley
 * - Optional custom audio override slots (`sounds/<id>.wav`) + OfflineAudioContext WAV export helper
 */

export type VolumeLevel = 'low' | 'medium' | 'high';
export type SoundMode = 'full' | 'sfx' | 'off';
const VOLUME_GAIN: Record<VolumeLevel, number> = { low: 0.3, medium: 0.62, high: 0.95 };

export type Timbre = {
  wave: OscillatorType | 'pulse25' | 'pulse12';
  filterHz: number;
  q: number;
  gainScale: number;
  reverbWet: number;
  short?: boolean;
};

/** The layer's synth timbre and space depth (`LAYER_ART[layer].sound`). */
const timbreFor = (layer: LayerId): Timbre => LAYER_ART[layer].sound.timbre;

/** Time stops in some layers (SMM): no ambience, no critter or event sounds. */
const isSilent = (layer: LayerId): boolean => LAYER_ART[layer].frozenTime === true;

export interface VoiceOpts {
  freq: number;
  toFreq?: number;
  at: number;
  dur: number;
  wave?: Timbre['wave'];
  gain?: number;
  attack?: number;
  swell?: boolean;
  filterHz?: number;
  toFilterHz?: number;
  q?: number;
  detune?: number;
  pan?: number;
  toPan?: number;
  crush?: boolean;
  reverb?: number;
  track?: boolean;
}

export interface FmVoiceOpts {
  carrierHz: number;
  toCarrierHz?: number;
  modRatio: number;
  modIndex: number;
  at: number;
  dur: number;
  gain?: number;
  swell?: boolean;
  pan?: number;
  toPan?: number;
  crush?: boolean;
  reverb?: number;
  track?: boolean;
}

export interface NoiseBurstOpts {
  at: number;
  dur: number;
  filterHz: number;
  toFilterHz?: number;
  type?: BiquadFilterType;
  q?: number;
  gain?: number;
  attack?: number;
  pan?: number;
  toPan?: number;
  crush?: boolean;
  reverb?: number;
  track?: boolean;
}

/**
 * What a layer's sound recipes (src/layers/<layer>.ts) may play: the engine's voices, bound to the live audio
 * context. A recipe schedules at `t` (the context's current time) and never touches the context itself.
 */
export interface SoundKit {
  voice(opts: VoiceOpts): void;
  fmVoice(opts: FmVoiceOpts): void;
  noiseBurst(opts: NoiseBurstOpts): void;
  /** Punchy retro sub-thud at `at`. */
  thud(at: number, fromHz?: number, toHz?: number, dur?: number, gain?: number): void;
}

/** One layer sound recipe: `t` is the audio clock now, `pan` the call's stereo position. */
export type SoundRecipe = (k: SoundKit, t: number, pan: number) => void;

/** One steady oscillator of a layer's room-tone bed. */
export interface Drone {
  freq: number;
  wave: OscillatorType;
  filterHz: number;
  gain: number;
}

/** Everything the sound engine knows about a layer; the engine holds no per-layer tables of its own. */
export interface SoundProfile {
  timbre: Timbre;
  /** Level of the looping room-tone bed. */
  ambienceLevel: number;
  /** Oscillators of the bed (none: no bed). */
  drones: readonly Drone[];
  /** The short blip when a critter despawns. */
  critterExit: { freq: number; crush: boolean };
  /** A critter's call; none: this layer's critters are silent. */
  critterCall?: SoundRecipe;
  /** Event-driven micro-foley; none: this layer has none. */
  artifact?: SoundRecipe;
  /** The boundary-crossing sound; none: the engine's default layered blip. */
  cross?: (k: SoundKit, t: number) => void;
}

interface ActiveNode {
  stop: () => void;
}

/** Build a band-limited pulse wave of duty cycle `duty` (e.g. 0.25 or 0.125). */
function makePulseWave(ctx: BaseAudioContext, duty: number): PeriodicWave | null {
  if (typeof ctx.createPeriodicWave !== 'function') return null;
  const harmonics = 24;
  const real = new Float32Array(harmonics);
  const imag = new Float32Array(harmonics);
  for (let n = 1; n < harmonics; n++) {
    imag[n] = (2 / (n * Math.PI)) * Math.sin(n * Math.PI * duty);
  }
  return ctx.createPeriodicWave(real, imag);
}

/** Build a stepped WaveShaper quantization curve for authentic retro bitcrushing. */
function makeBitcrushCurve(bits: number): Float32Array<ArrayBuffer> {
  const n = 256;
  const curve = new Float32Array(new ArrayBuffer(n * 4));
  const steps = Math.pow(2, bits);
  for (let i = 0; i < n; i++) {
    const x = (i * 2) / n - 1;
    curve[i] = Math.round(x * steps) / steps;
  }
  return curve;
}

/** Build a tiny stereo procedural impulse response for subtle room/chamber reverb. */
function makeImpulse(ctx: BaseAudioContext, seconds = 0.42): AudioBuffer {
  const len = Math.floor(ctx.sampleRate * seconds);
  const buf = ctx.createBuffer(2, len, ctx.sampleRate);
  for (let ch = 0; ch < 2; ch++) {
    const d = buf.getChannelData(ch);
    let lp = 0;
    for (let i = 0; i < len; i++) {
      const decay = Math.pow(1 - i / len, 2.6);
      const raw = (Math.random() * 2 - 1) * decay;
      lp = lp * 0.65 + raw * 0.35;
      d[i] = lp;
    }
  }
  return buf;
}

/** Encode a mono/stereo AudioBuffer to a 16-bit PCM WAV Blob (for exporting to `sounds/`). */
export function encodeWav(buf: AudioBuffer): Blob {
  const ch = buf.numberOfChannels;
  const len = buf.length;
  const rate = buf.sampleRate;
  const dataBytes = len * ch * 2;
  const ab = new ArrayBuffer(44 + dataBytes);
  const v = new DataView(ab);
  const str = (off: number, s: string) => {
    for (let i = 0; i < s.length; i++) v.setUint8(off + i, s.charCodeAt(i));
  };
  str(0, 'RIFF');
  v.setUint32(4, 36 + dataBytes, true);
  str(8, 'WAVE');
  str(12, 'fmt ');
  v.setUint32(16, 16, true);
  v.setUint16(20, 1, true);
  v.setUint16(22, ch, true);
  v.setUint32(24, rate, true);
  v.setUint32(28, rate * ch * 2, true);
  v.setUint16(32, ch * 2, true);
  v.setUint16(34, 16, true);
  str(36, 'data');
  v.setUint32(40, dataBytes, true);
  let off = 44;
  for (let i = 0; i < len; i++) {
    for (let c = 0; c < ch; c++) {
      const s = Math.max(-1, Math.min(1, buf.getChannelData(c)[i] ?? 0));
      v.setInt16(off, s < 0 ? s * 0x8000 : s * 0x7fff, true);
      off += 2;
    }
  }
  return new Blob([ab], { type: 'audio/wav' });
}

interface AmbienceBed {
  layer: LayerId;
  gain: GainNode;
  stop: () => void;
}

export class SoundEngine {
  private ctx: BaseAudioContext | null = null;
  private master: GainNode | null = null;
  private reverbSend: GainNode | null = null;
  private noiseBuf: AudioBuffer | null = null;
  private pulse25: PeriodicWave | null = null;
  private pulse12: PeriodicWave | null = null;
  private crushCurve: Float32Array<ArrayBuffer> | null = null;
  private reactionNodes: ActiveNode[] = [];
  private customBuffers = new Map<string, AudioBuffer>();
  private ambience: AmbienceBed | null = null;
  private currentLayer: LayerId = 'application';
  private ambienceFrozen = false;
  private ambienceEnabled = true;
  private duckUntil = 0;
  private duckTimer = 0;
  private lastEventAt = 0;
  private unlocked = false;
  private volume: VolumeLevel = 'medium';
  mode: SoundMode = 'full';
  enabled = true;

  /** Lazily create and unlock the AudioContext on a user gesture. */
  unlock() {
    this.unlocked = true;
    if (!this.enabled) return;
    const ctx = this.ensureCtx();
    if (ctx && 'state' in ctx && (ctx as AudioContext).state === 'suspended') {
      void (ctx as AudioContext).resume();
    }
    this.syncAmbience();
  }

  /** Set sound mode: 'full' (SFX + ambience), 'sfx' (SFX only, quiet between prompts), or 'off' (muted). */
  setMode(mode: SoundMode) {
    this.mode = mode;
    this.enabled = mode !== 'off';
    this.ambienceEnabled = mode === 'full';
    if (!this.enabled) {
      this.stopReactions();
      this.stopAmbience();
    } else if (!this.ambienceEnabled) {
      this.stopAmbience();
    } else {
      this.syncAmbience();
    }
    this.applyMasterGain();
  }

  setEnabled(on: boolean) {
    this.setMode(on ? (this.mode === 'off' ? 'full' : this.mode) : 'off');
  }

  /** Seed retained for future daily audio variation. */
  setPuzzleSeed(_seed: number) {}

  /** Automatically duck the ambience bed by ~10 dB while an active SFX/reaction/crossing plays. */
  private duckAmbience(durSec: number) {
    if (!this.ambience || !this.ctx || this.ambienceFrozen || isSilent(this.currentLayer)) return;
    const now = this.ctx.currentTime;
    const end = now + durSec;
    if (end > this.duckUntil) this.duckUntil = end;
    const base = this.ambienceLevel(this.currentLayer);
    this.ambience.gain.gain.cancelScheduledValues(now);
    this.ambience.gain.gain.setTargetAtTime(base * 0.45, now, 0.025);
    clearTimeout(this.duckTimer);
    if (typeof window !== 'undefined' && typeof window.setTimeout === 'function') {
      const ms = Math.max(80, Math.round((this.duckUntil - now) * 1000));
      this.duckTimer = window.setTimeout(() => {
        if (!this.ambience || !this.ctx || this.ambienceFrozen || isSilent(this.currentLayer)) return;
        this.ambience.gain.gain.setTargetAtTime(this.ambienceLevel(this.currentLayer), this.ctx.currentTime, 0.22);
      }, ms);
    }
  }

  /** Event-driven micro-foley triggered by visible on-screen activity (rate-limited so it stays sparse & musical). */
  playAmbientEvent(layer: LayerId) {
    if (!this.ambienceEnabled || !this.enabled || this.ambienceFrozen || isSilent(layer)) return;
    if (!this.ctx || !('state' in this.ctx) || (this.ctx as AudioContext).state !== 'running') return;
    const nowMs = performance.now();
    if (nowMs - this.lastEventAt < 1800) return;
    this.lastEventAt = nowMs;
    this.playAmbienceArtifact(this.ctx, layer);
  }

  /** Subtle exit micro-sound when a critter reaches the end of its lifespan (e.g. "GC'd!", "paged out!"). */
  playCritterExit(layer: LayerId, pan: number) {
    if (!this.ambienceEnabled || !this.enabled || this.ambienceFrozen || isSilent(layer)) return;
    if (!this.ctx || !('state' in this.ctx) || (this.ctx as AudioContext).state !== 'running') return;
    const ctx = this.ctx;
    const t = ctx.currentTime;
    const p = Math.max(-0.85, Math.min(0.85, pan));
    const tm = timbreFor(layer);
    const exit = LAYER_ART[layer].sound.critterExit;
    // Short descending dissolve blip
    this.voice(ctx, {
      freq: exit.freq,
      toFreq: 160,
      at: t,
      dur: 0.12,
      wave: tm.wave,
      filterHz: tm.filterHz * 0.6,
      gain: 0.16 * tm.gainScale,
      pan: p,
      crush: exit.crush,
    });
  }

  /**
   * Living System Biosphere critter call, stereo-panned to the critter's exact x position on screen:
   *   Application  → 2–3 note songbird chirp
   *   Runtime      → bouncy upward helper-blob bloop
   *   Libraries    → calmer, lower-pitched bookworm-blob bloop
   *   OS userspace → mischievous low crunchy daemon mutter
   *   Kernel       → robotic thread-bot servo blip + IRQ pip
   *   Drivers      → fast click-clack bus-beetle skitter
   *   Firmware     → distant miniature 1000 Hz POST ping + relay tick
   *   Ring −1      → stereo-crossing twin mirror-wisp FM shimmer
   *   Ring −3      → stark 1-bit piezo bit-mote snap
   */
  playCritter(layer: LayerId, pan: number) {
    if (!this.ambienceEnabled || !this.enabled || this.ambienceFrozen || isSilent(layer)) return;
    if (!this.ctx || !('state' in this.ctx) || (this.ctx as AudioContext).state !== 'running') return;
    const ctx = this.ctx;
    const t = ctx.currentTime;
    const p = Math.max(-0.85, Math.min(0.85, pan));
    LAYER_ART[layer].sound.critterCall?.(this.kit(ctx), t, p);
  }

  /** The engine's voices bound to `ctx`, for a layer's sound recipes. */
  private kit(ctx: BaseAudioContext): SoundKit {
    return {
      voice: (opts) => this.voice(ctx, opts),
      fmVoice: (opts) => this.fmVoice(ctx, opts),
      noiseBurst: (opts) => this.noiseBurst(ctx, opts),
      thud: (at, fromHz, toHz, dur, gain) => this.thud(ctx, at, fromHz, toHz, dur, gain),
    };
  }

  setVolume(level: VolumeLevel) {
    this.volume = level;
    this.applyMasterGain();
  }

  private applyMasterGain() {
    if (this.master && this.ctx) {
      this.master.gain.setValueAtTime(this.enabled ? VOLUME_GAIN[this.volume] : 0, this.ctx.currentTime);
    }
  }

  /** Optional: load a custom audio file from `/sounds/<id>.wav` to override a procedural SFX. */
  async registerCustomSound(id: string, url = `/sounds/${id}.wav`): Promise<boolean> {
    const ctx = this.ensureCtx();
    if (!ctx || typeof fetch !== 'function') return false;
    try {
      const res = await fetch(url);
      if (!res.ok) return false;
      const ab = await res.arrayBuffer();
      const buf = await ctx.decodeAudioData(ab);
      this.customBuffers.set(id, buf);
      return true;
    } catch {
      return false;
    }
  }

  /** Play a registered custom override buffer if present; returns true if handled. */
  private tryPlayCustom(id: string): boolean {
    const buf = this.customBuffers.get(id);
    if (!buf) return false;
    const ctx = this.ensureCtx();
    if (!ctx) return false;
    const src = ctx.createBufferSource();
    src.buffer = buf;
    src.connect(this.master!);
    src.start(ctx.currentTime);
    return true;
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

  /** Update the subtle hardware ambience bed & reverb depth for the current layer. */
  setLayer(layer: LayerId) {
    if (layer === this.currentLayer && this.ambience) return;
    this.currentLayer = layer;
    this.updateReverbForLayer(layer);
    this.syncAmbience();
  }

  /** Silence the ambience bed during frozen states (WOMM freeze / Ring −2). */
  setAmbienceFrozen(frozen: boolean) {
    if (frozen === this.ambienceFrozen) return;
    this.ambienceFrozen = frozen;
    if (this.ambience && this.ctx) {
      const now = this.ctx.currentTime;
      const target = frozen || isSilent(this.currentLayer) ? 0.0001 : this.ambienceLevel(this.currentLayer);
      this.ambience.gain.gain.cancelScheduledValues(now);
      this.ambience.gain.gain.setTargetAtTime(target, now, 0.04);
    }
  }

  private ambienceLevel(layer: LayerId): number {
    return LAYER_ART[layer].sound.ambienceLevel;
  }

  private stopAmbience() {
    if (!this.ambience) return;
    try {
      this.ambience.stop();
    } catch {
      // Ignore already-stopped nodes
    }
    this.ambience = null;
  }

  private syncAmbience() {
    if (!this.enabled || !this.ambienceEnabled || !this.ctx || !this.master) return;
    // Don't start looping ambience on an OfflineAudioContext (used for WAV export).
    if (!('state' in this.ctx) || (this.ctx as AudioContext).state !== 'running') return;
    const layer = this.currentLayer;
    if (this.ambience?.layer === layer) return;

    const ctx = this.ctx;
    const now = ctx.currentTime;
    const prev = this.ambience;
    if (prev) {
      prev.gain.gain.cancelScheduledValues(now);
      prev.gain.gain.setTargetAtTime(0.0001, now, 0.12);
      const toStop = prev;
      setTimeout(() => {
        try {
          toStop.stop();
        } catch {
          // ignore
        }
      }, 450);
      this.ambience = null;
    }

    if (isSilent(layer)) return; // Ring −2 is dead silent.

    const bedGain = ctx.createGain();
    const target = this.ambienceFrozen ? 0.0001 : this.ambienceLevel(layer);
    bedGain.gain.setValueAtTime(0.0001, now);
    bedGain.gain.setTargetAtTime(target, now, 0.25);
    bedGain.connect(this.master);

    const stops: (() => void)[] = [];
    const addDrone = (freq: number, wave: OscillatorType, filterHz: number, gain: number) => {
      const osc = ctx.createOscillator();
      osc.type = wave;
      osc.frequency.setValueAtTime(freq, now);
      const f = ctx.createBiquadFilter();
      f.type = 'lowpass';
      f.frequency.setValueAtTime(filterHz, now);
      const g = ctx.createGain();
      g.gain.setValueAtTime(gain, now);
      osc.connect(f);
      f.connect(g);
      g.connect(bedGain);
      osc.start(now);
      stops.push(() => osc.stop());
    };

    // Pure seamless ultra-quiet oscillator room-tone (no looping noise buffer seam ticks, no untied timer blips;
    // all audible ambient activity is driven directly by visible critters on screen).
    for (const d of LAYER_ART[layer].sound.drones) addDrone(d.freq, d.wave, d.filterHz, d.gain);

    this.ambience = {
      layer,
      gain: bedGain,
      stop: () => {
        for (const s of stops) s();
      },
    };
  }

  /** Subtle, unmistakably in-game chiptune micro-artifacts triggered by visible on-screen events. */
  private playAmbienceArtifact(ctx: BaseAudioContext, layer: LayerId) {
    const t = ctx.currentTime;
    const pan = (Math.random() - 0.5) * 1.1;
    LAYER_ART[layer].sound.artifact?.(this.kit(ctx), t, pan);
  }

  private updateReverbForLayer(layer: LayerId) {
    if (!this.reverbSend || !this.ctx) return;
    this.reverbSend.gain.setValueAtTime(timbreFor(layer).reverbWet, this.ctx.currentTime);
  }

  /** Attach an existing BaseAudioContext (used by offline WAV export). */
  private attachContext(ctx: BaseAudioContext) {
    const master = ctx.createGain();
    master.gain.setValueAtTime(this.enabled ? VOLUME_GAIN[this.volume] : 0, ctx.currentTime);

    let out: AudioNode = master;
    if (typeof ctx.createDynamicsCompressor === 'function') {
      const comp = ctx.createDynamicsCompressor();
      comp.threshold.setValueAtTime(-14, ctx.currentTime);
      comp.knee.setValueAtTime(12, ctx.currentTime);
      comp.ratio.setValueAtTime(4, ctx.currentTime);
      comp.attack.setValueAtTime(0.004, ctx.currentTime);
      comp.release.setValueAtTime(0.12, ctx.currentTime);
      master.connect(comp);
      out = comp;
    }
    out.connect(ctx.destination);

    // Parallel procedural stereo reverb send
    let reverbSend: GainNode | null = null;
    if (typeof ctx.createConvolver === 'function') {
      reverbSend = ctx.createGain();
      reverbSend.gain.setValueAtTime(timbreFor(this.currentLayer).reverbWet, ctx.currentTime);
      const conv = ctx.createConvolver();
      conv.buffer = makeImpulse(ctx, 0.42);
      reverbSend.connect(conv);
      conv.connect(out);
    }

    this.ctx = ctx;
    this.master = master;
    this.reverbSend = reverbSend;
    this.noiseBuf = null;
    this.pulse25 = makePulseWave(ctx, 0.25);
    this.pulse12 = makePulseWave(ctx, 0.125);
    this.crushCurve = makeBitcrushCurve(4);
  }

  private ensureCtx(): BaseAudioContext | null {
    if (!this.enabled) return null;
    if (this.ctx) {
      if (this.unlocked && 'state' in this.ctx && (this.ctx as AudioContext).state === 'suspended') {
        void (this.ctx as AudioContext).resume();
      }
      return this.ctx;
    }
    // In browsers with User Activation API, skip creating an AudioContext before any gesture to avoid autoplay warnings.
    const ua =
      typeof navigator !== 'undefined'
        ? (navigator as Navigator & { userActivation?: { hasBeenActive: boolean } }).userActivation
        : undefined;
    if (!this.unlocked && ua && !ua.hasBeenActive) return null;
    const Ctor =
      typeof window !== 'undefined'
        ? (window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext)
        : undefined;
    if (!Ctor) return null;
    this.attachContext(new Ctor());
    return this.ctx;
  }

  private noise(ctx: BaseAudioContext): AudioBuffer {
    if (this.noiseBuf) return this.noiseBuf;
    const len = Math.floor(ctx.sampleRate * 1.0);
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const data = buf.getChannelData(0);
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

  /** Route a voice's output gain through optional bitcrush, stereo panner (with pan sweep), and reverb send. */
  private routeOut(
    ctx: BaseAudioContext,
    src: AudioNode,
    opts: { at: number; dur: number; pan?: number; toPan?: number; crush?: boolean; reverb?: number },
  ) {
    let node = src;
    if (opts.crush && this.crushCurve && typeof ctx.createWaveShaper === 'function') {
      const ws = ctx.createWaveShaper();
      ws.curve = this.crushCurve;
      ws.oversample = 'none';
      node.connect(ws);
      node = ws;
    }
    if ((opts.pan !== undefined || opts.toPan !== undefined) && typeof ctx.createStereoPanner === 'function') {
      const p = ctx.createStereoPanner();
      p.pan.setValueAtTime(opts.pan ?? 0, opts.at);
      if (opts.toPan !== undefined) {
        p.pan.linearRampToValueAtTime(opts.toPan, opts.at + opts.dur);
      }
      node.connect(p);
      node = p;
    }
    node.connect(this.master!);
    if (this.reverbSend && (opts.reverb ?? 1) > 0) {
      if (opts.reverb !== undefined && opts.reverb !== 1) {
        const send = ctx.createGain();
        send.gain.setValueAtTime(opts.reverb, opts.at);
        node.connect(send);
        send.connect(this.reverbSend);
      } else {
        node.connect(this.reverbSend);
      }
    }
  }

  private voice(
    ctx: BaseAudioContext,
    opts: VoiceOpts,
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

    const peak = opts.gain ?? 0.34;
    if (opts.swell) {
      // Volume swell peaking in the middle (pairs with spatial pan sweeps).
      g.gain.setValueAtTime(0.0001, opts.at);
      g.gain.linearRampToValueAtTime(peak, opts.at + opts.dur * 0.45);
      g.gain.exponentialRampToValueAtTime(0.0001, opts.at + opts.dur);
    } else {
      const atk = opts.attack ?? Math.min(0.012, opts.dur * 0.18);
      g.gain.setValueAtTime(0.0001, opts.at);
      g.gain.linearRampToValueAtTime(peak, opts.at + atk);
      g.gain.exponentialRampToValueAtTime(0.0001, opts.at + opts.dur);
    }

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
    this.routeOut(ctx, g, opts);
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

  /** 2-operator FM synth voice for metallic, glassy, bell-like, and sci-fi non-beepy textures. */
  private fmVoice(
    ctx: BaseAudioContext,
    opts: FmVoiceOpts,
  ) {
    const car = ctx.createOscillator();
    const mod = ctx.createOscillator();
    const modGain = ctx.createGain();
    const outGain = ctx.createGain();

    car.type = 'sine';
    mod.type = 'sine';
    car.frequency.setValueAtTime(opts.carrierHz, opts.at);
    if (opts.toCarrierHz !== undefined) {
      car.frequency.exponentialRampToValueAtTime(Math.max(30, opts.toCarrierHz), opts.at + opts.dur);
    }
    mod.frequency.setValueAtTime(opts.carrierHz * opts.modRatio, opts.at);
    modGain.gain.setValueAtTime(opts.modIndex, opts.at);
    modGain.gain.exponentialRampToValueAtTime(Math.max(4, opts.modIndex * 0.15), opts.at + opts.dur);

    const peak = opts.gain ?? 0.3;
    if (opts.swell) {
      outGain.gain.setValueAtTime(0.0001, opts.at);
      outGain.gain.linearRampToValueAtTime(peak, opts.at + opts.dur * 0.45);
      outGain.gain.exponentialRampToValueAtTime(0.0001, opts.at + opts.dur);
    } else {
      outGain.gain.setValueAtTime(0.0001, opts.at);
      outGain.gain.linearRampToValueAtTime(peak, opts.at + Math.min(0.015, opts.dur * 0.2));
      outGain.gain.exponentialRampToValueAtTime(0.0001, opts.at + opts.dur);
    }

    mod.connect(modGain);
    modGain.connect(car.frequency);
    car.connect(outGain);
    this.routeOut(ctx, outGain, opts);

    mod.start(opts.at);
    car.start(opts.at);
    mod.stop(opts.at + opts.dur + 0.02);
    car.stop(opts.at + opts.dur + 0.02);
    if (opts.track) {
      this.reactionNodes.push({
        stop: () => {
          outGain.gain.cancelScheduledValues(ctx.currentTime);
          outGain.gain.setValueAtTime(0.0001, ctx.currentTime);
          mod.stop(ctx.currentTime + 0.005);
          car.stop(ctx.currentTime + 0.005);
        },
      });
    }
  }

  /** Layered synth note: detuned unison pair + optional sub-octave body + filter sweep + pan. */
  private layered(
    ctx: BaseAudioContext,
    opts: {
      freq: number;
      toFreq?: number;
      at: number;
      dur: number;
      tm: Timbre;
      gain?: number;
      sub?: boolean;
      click?: boolean;
      pan?: number;
      toPan?: number;
      swell?: boolean;
      crush?: boolean;
      track?: boolean;
    },
  ) {
    const g = (opts.gain ?? 0.36) * opts.tm.gainScale;
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
      pan: opts.pan,
      toPan: opts.toPan,
      swell: opts.swell,
      crush: opts.crush,
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
      pan: opts.pan,
      toPan: opts.toPan,
      swell: opts.swell,
      crush: opts.crush,
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
        pan: opts.pan,
        toPan: opts.toPan,
        track: opts.track,
      });
    }
    if (opts.click) {
      this.noiseBurst(ctx, { at: opts.at, dur: 0.018, filterHz: 3400, gain: g * 0.35, pan: opts.pan, track: opts.track });
    }
  }

  private noiseBurst(
    ctx: BaseAudioContext,
    opts: NoiseBurstOpts,
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
    this.routeOut(ctx, g, opts);
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

  /** Punchy retro sub-thud (sine pitch drop + filtered body click). */
  private thud(ctx: BaseAudioContext, at: number, fromHz = 150, toHz = 44, dur = 0.22, gain = 0.48, track = false) {
    this.voice(ctx, { freq: fromHz, toFreq: toHz, at, dur, wave: 'sine', gain, attack: 0.004, reverb: 0.3, track });
    this.noiseBurst(ctx, { at, dur: 0.035, type: 'lowpass', filterHz: 480, gain: gain * 0.45, track });
  }

  // -------------------------------------------------------------------------------------------
  // Title-screen glitch micro-foley (quiet, only when audio is already unlocked)

  playTitleGlitch(kind: TitleGlitchKind) {
    if (!this.enabled || !this.ctx || !('state' in this.ctx) || (this.ctx as AudioContext).state !== 'running') return;
    const ctx = this.ctx;
    const t = ctx.currentTime;
    const pan = (Math.random() - 0.5) * 0.9;
    switch (kind) {
      case 'mirror-flip':
        this.fmVoice(ctx, { carrierHz: 520, toCarrierHz: 680, modRatio: 2, modIndex: 130, at: t, dur: 0.14, gain: 0.09, pan: -0.65, toPan: 0.65, swell: true });
        this.fmVoice(ctx, { carrierHz: 680, toCarrierHz: 520, modRatio: 2, modIndex: 130, at: t + 0.04, dur: 0.14, gain: 0.08, pan: 0.65, toPan: -0.65, swell: true });
        break;
      case 'bitflip':
        this.voice(ctx, { freq: 980, toFreq: 1320, at: t, dur: 0.035, wave: 'square', gain: 0.08, pan, crush: true });
        break;
      case 'mini-ghosts':
      case 'stack-echo':
        this.fmVoice(ctx, { carrierHz: 720, modRatio: 2.5, modIndex: 140, at: t, dur: 0.09, gain: 0.09, pan, toPan: -pan });
        break;
      case 'heisenbug':
        this.noiseBurst(ctx, { at: t, dur: 0.05, type: 'bandpass', filterHz: 2600, toFilterHz: 900, gain: 0.09, pan, crush: true });
        break;
      case 'npe':
        this.thud(ctx, t, 120, 48, 0.08, 0.14);
        break;
      case 'hex-corrupt':
      case 'palette-drop':
      case 'null-zero':
      case 'binary-flash':
        this.voice(ctx, { freq: 520, toFreq: 390, at: t, dur: 0.045, wave: 'pulse12', gain: 0.07, pan, crush: true });
        break;
      case 'cursor-blink':
      case 'bit-shift':
      case 'underline-link':
        this.voice(ctx, { freq: 760, toFreq: 880, at: t, dur: 0.025, wave: 'triangle', gain: 0.06, pan });
        break;
      default:
        this.noiseBurst(ctx, { at: t, dur: 0.02, type: 'highpass', filterHz: 3200, gain: 0.06, pan });
        break;
    }
  }

  // -------------------------------------------------------------------------------------------
  // UI & Gameplay micro-SFX

  /** Title "Unwind the stack" dive: layered descending plunge + FM shimmer + air rush. */
  diveStart() {
    if (this.tryPlayCustom('diveStart')) return;
    const ctx = this.ensureCtx();
    if (!ctx) return;
    const t = ctx.currentTime;
    const tm = timbreFor('application');
    this.noiseBurst(ctx, { at: t, dur: 0.3, type: 'bandpass', filterHz: 2000, toFilterHz: 280, q: 1.6, gain: 0.26 });
    [587.33, 440, 293.66].forEach((f, i) => {
      this.layered(ctx, { freq: f, at: t + i * 0.055, dur: 0.18, tm, gain: 0.34, sub: i === 2, click: true });
    });
    this.fmVoice(ctx, { carrierHz: 587.33, toCarrierHz: 293.66, modRatio: 2, modIndex: 180, at: t, dur: 0.24, gain: 0.18 });
  }

  /** Pre-answer 3s → 2s → 1s countdown tick: tactile mechanical key-tick + soft pitched body. */
  countdownTick(secs: number, layer: LayerId) {
    if (this.tryPlayCustom('countdownTick')) return;
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

  /** Input unlocked for answering: bright layered two-note open chime with FM bell sparkle. */
  roundOpen(layer: LayerId) {
    if (this.tryPlayCustom('roundOpen')) return;
    const ctx = this.ensureCtx();
    if (!ctx) return;
    const tm = timbreFor(layer);
    const t = ctx.currentTime;
    const d = tm.short ? 0.04 : 0.12;
    this.layered(ctx, { freq: 523.25, at: t, dur: d, tm, gain: 0.28, click: true });
    this.layered(ctx, { freq: 783.99, at: t + 0.055, dur: d * 1.6, tm, gain: 0.32, sub: true });
    this.fmVoice(ctx, { carrierHz: 783.99, modRatio: 3, modIndex: 160, at: t + 0.055, dur: 0.16, gain: 0.16 });
  }

  /** Watchdog low-time warning tick (5s..1s). */
  lowTimeTick(layer: LayerId) {
    if (this.tryPlayCustom('lowTimeTick')) return;
    const ctx = this.ensureCtx();
    if (!ctx) return;
    const tm = timbreFor(layer);
    const t = ctx.currentTime;
    this.noiseBurst(ctx, { at: t, dur: 0.018, type: 'bandpass', filterHz: 2200, gain: 0.22 });
    this.voice(ctx, { freq: 330, toFreq: 280, at: t, dur: 0.055, wave: 'pulse25', filterHz: tm.filterHz * 0.7, gain: 0.24 });
  }

  /** Rejected guess: bit-crushed fault buzz + mechanical bonk. */
  reject(layer: LayerId) {
    if (this.tryPlayCustom('reject')) return;
    const ctx = this.ensureCtx();
    if (!ctx) return;
    const tm = timbreFor(layer);
    const t = ctx.currentTime;
    this.thud(ctx, t, 140, 68, 0.12, 0.34);
    this.voice(ctx, { freq: 175, toFreq: 112, at: t, dur: 0.14, wave: 'sawtooth', filterHz: 1100, toFilterHz: 320, q: 2.5, gain: 0.32 * tm.gainScale, crush: true });
  }

  /** Typo suggestion ("Corrected to ..."): crisp polite upward double-chirp. */
  suggest(layer: LayerId) {
    if (this.tryPlayCustom('suggest')) return;
    const ctx = this.ensureCtx();
    if (!ctx) return;
    const tm = timbreFor(layer);
    const t = ctx.currentTime;
    this.layered(ctx, { freq: 493.88, at: t, dur: 0.07, tm, gain: 0.24, click: true });
    this.layered(ctx, { freq: 659.25, at: t + 0.055, dur: 0.1, tm, gain: 0.28 });
  }

  /** Watchdog timeout bark: heavy bit-crushed two-tone fault alarm + sub-drop. */
  bark() {
    if (this.tryPlayCustom('bark')) return;
    const ctx = this.ensureCtx();
    if (!ctx) return;
    const t = ctx.currentTime;
    this.thud(ctx, t, 180, 60, 0.24, 0.46);
    this.voice(ctx, { freq: 245, at: t, dur: 0.14, wave: 'sawtooth', filterHz: 1400, toFilterHz: 500, q: 2, gain: 0.36, crush: true });
    this.voice(ctx, { freq: 155, toFreq: 86, at: t + 0.14, dur: 0.34, wave: 'sawtooth', filterHz: 1100, toFilterHz: 260, q: 2.5, gain: 0.4, crush: true });
    this.noiseBurst(ctx, { at: t + 0.14, dur: 0.12, type: 'bandpass', filterHz: 600, gain: 0.26 });
  }

  /** "Unwind further" button press: tactile mechanical relay switch + downward blip. */
  unwind(layer: LayerId) {
    if (this.tryPlayCustom('unwind')) return;
    const ctx = this.ensureCtx();
    if (!ctx) return;
    const tm = timbreFor(layer);
    const t = ctx.currentTime;
    this.noiseBurst(ctx, { at: t, dur: 0.02, type: 'highpass', filterHz: 3000, gain: 0.26 });
    this.layered(ctx, { freq: 640, toFreq: 420, at: t, dur: 0.08, tm, gain: 0.28 });
  }

  /** End-of-day backtrace reveal: warm resolved FM + chiptune chord. */
  endOfDay() {
    if (this.tryPlayCustom('endOfDay')) return;
    const ctx = this.ensureCtx();
    if (!ctx) return;
    const t = ctx.currentTime;
    const tm = timbreFor('application');
    this.thud(ctx, t, 130, 65, 0.38, 0.36);
    [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => {
      const pan = -0.45 + i * 0.3;
      this.layered(ctx, { freq: f, at: t + i * 0.08, dur: 0.45, tm, gain: 0.28, sub: i === 0, pan });
      this.fmVoice(ctx, { carrierHz: f, modRatio: 2, modIndex: 110, at: t + i * 0.08, dur: 0.42, gain: 0.14, pan });
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
      this.voice(ctx, { freq: 310, toFreq: 190, at: t, dur: Math.min(0.28, dur), wave: 'triangle', filterHz: 1100, gain: 0.24 });
      return;
    }
    const big = frames >= 5;
    this.noiseBurst(ctx, {
      at: t,
      dur: dur * 0.85,
      type: 'bandpass',
      filterHz: big ? 2400 : 1400,
      toFilterHz: big ? 240 : 320,
      q: big ? 2.2 : 1.4,
      gain: big ? 0.36 : 0.22,
      attack: 0.04,
      crush: big,
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
      gain: big ? 0.32 : 0.2,
    });
  }

  /** Crisp FM crystalline shimmer when the cursor mutates into a new layer's form. */
  playMorph(layer: LayerId) {
    if (this.tryPlayCustom('morph')) return;
    const ctx = this.ensureCtx();
    if (!ctx) return;
    const tm = timbreFor(layer);
    const t = ctx.currentTime;
    this.noiseBurst(ctx, { at: t, dur: 0.03, type: 'highpass', filterHz: 3200, gain: 0.2 });
    this.fmVoice(ctx, { carrierHz: 660, toCarrierHz: 1040, modRatio: 3.5, modIndex: 220, at: t, dur: 0.14, gain: 0.22 * tm.gainScale });
  }

  // -------------------------------------------------------------------------------------------
  // Tier Reactions (locked to reaction-fx.ts timelines)

  playTier(tier: TierId, layer: LayerId) {
    this.stopReactions();
    if (this.tryPlayCustom(`tier-${tier}`)) return;
    const ctx = this.ensureCtx();
    if (!ctx) return;
    this.duckAmbience(tier === 'womm' ? 3.8 : tier === 'bitflip' ? 2.4 : 1.0);
    const tm = timbreFor(layer);
    const t = ctx.currentTime;

    switch (tier) {
      case 'off-by-one': {
        this.layered(ctx, { freq: 440, at: t, dur: 0.11, tm, gain: 0.34, click: true, pan: -0.25, track: true });
        this.layered(ctx, { freq: 415.3, at: t + 0.11, dur: 0.18, tm, gain: 0.3, sub: true, pan: 0.25, track: true });
        break;
      }
      case 'npe': {
        // Bit-crushed glitch crunch + downward void sweep + heavy sub-thud
        this.noiseBurst(ctx, { at: t, dur: 0.045, type: 'highpass', filterHz: 2800, gain: 0.34, crush: true, track: true });
        this.voice(ctx, { freq: 680, toFreq: 55, at: t, dur: 0.28, wave: 'pulse25', filterHz: 2600, toFilterHz: 180, q: 3, gain: 0.38, crush: true, track: true });
        this.thud(ctx, t + 0.22, 130, 38, 0.24, 0.54, true);
        this.noiseBurst(ctx, { at: t + 0.22, dur: 0.12, type: 'bandpass', filterHz: 320, gain: 0.28, track: true });
        break;
      }
      case 'leak': {
        // 4 cascading echoes drifting across the stereo field (-0.7 → +0.7) with volume swells!
        const pans = [-0.7, -0.22, 0.26, 0.72];
        [0, 0.16, 0.34, 0.54].forEach((dt, i) => {
          const f = 587.33 * Math.pow(0.91, i);
          const pan = pans[i]!;
          this.layered(ctx, {
            freq: f,
            toFreq: f * 0.95,
            at: t + dt,
            dur: 0.22,
            tm,
            gain: 0.38 - i * 0.065,
            sub: i === 0,
            click: i === 0,
            pan,
            toPan: Math.min(0.9, pan + 0.18),
            swell: i > 0,
            track: true,
          });
          this.fmVoice(ctx, {
            carrierHz: f * 2,
            modRatio: 1.5,
            modIndex: 140 - i * 25,
            at: t + dt,
            dur: 0.18,
            gain: 0.14 - i * 0.025,
            pan,
            swell: i > 0,
            track: true,
          });
        });
        break;
      }
      case 'race': {
        // Two competing FM + pulse voices hard-panned left (-0.75) and right (+0.75), surging in volume as they pass each other!
        const motif = [392, 523.25, 659.25, 587.33];
        motif.forEach((f, i) => {
          const atA = t + i * 0.095;
          const atB = atA + 0.042;
          const surgeA = i % 2 === 0 ? 0.36 : 0.22;
          const surgeB = i % 2 === 0 ? 0.22 : 0.36;
          this.fmVoice(ctx, { carrierHz: f, modRatio: 2.75, modIndex: 280, at: atA, dur: 0.12, gain: surgeA, pan: -0.75, toPan: 0.25, swell: true, track: true });
          this.fmVoice(ctx, { carrierHz: f * 1.03, modRatio: 3.1, modIndex: 310, at: atB, dur: 0.12, gain: surgeB, pan: 0.75, toPan: -0.25, swell: true, track: true });
          this.voice(ctx, { freq: f, at: atA, dur: 0.1, wave: 'pulse25', filterHz: 3000, gain: surgeA * 0.75, pan: -0.65, track: true });
          this.voice(ctx, { freq: f * 1.03, at: atB, dur: 0.1, wave: 'pulse12', filterHz: 2600, gain: surgeB * 0.75, pan: 0.65, track: true });
        });
        this.thud(ctx, t, 150, 70, 0.18, 0.36, true);
        break;
      }
      case 'heisenbug': {
        // Glassy FM shimmer cloud sweeping across the stereo field (-0.75 → +0.75) with matching volume swell peaking at TEASE_AT!
        const swellAt = t + TEASE_AT / 1000;
        this.fmVoice(ctx, { carrierHz: 440, toCarrierHz: 659.25, modRatio: 2.41, modIndex: 260, at: t, dur: 0.62, gain: 0.3, swell: true, pan: -0.75, toPan: 0.75, track: true });
        this.fmVoice(ctx, { carrierHz: 659.25, toCarrierHz: 987.77, modRatio: 1.41, modIndex: 220, at: t + 0.08, dur: 0.64, gain: 0.24, swell: true, pan: 0.75, toPan: -0.75, track: true });
        this.noiseBurst(ctx, { at: swellAt, dur: 0.5, type: 'bandpass', filterHz: 2800, toFilterHz: 700, q: 3.5, gain: 0.26, attack: 0.12, pan: -0.6, toPan: 0.6, track: true });
        [783.99, 987.77, 1174.66].forEach((f, i) => {
          this.fmVoice(ctx, {
            carrierHz: f,
            toCarrierHz: f * 0.94,
            modRatio: 2.0,
            modIndex: 180,
            at: swellAt + i * 0.04,
            dur: 0.58,
            gain: 0.2,
            swell: true,
            pan: (i - 1) * 0.65,
            toPan: -(i - 1) * 0.65,
            track: true,
          });
        });
        break;
      }
      case 'bitflip': {
        // Finale sting: identical crescendo buildup up to 2200ms, then massive 5-voice FM + pulse inversion chord!
        this.playBitflipBuildup(ctx, t);
        const inv = t + CASCADE.invert[0] / 1000;
        this.thud(ctx, inv, 165, 40, 0.44, 0.6, true);
        this.noiseBurst(ctx, { at: inv, dur: 0.24, type: 'highpass', filterHz: 2400, gain: 0.3, crush: true, track: true });
        const chord = [261.63, 523.25, 659.25, 783.99, 1046.5];
        chord.forEach((f, i) => {
          const pan = -0.6 + i * 0.3;
          this.voice(ctx, {
            freq: f,
            at: inv + i * 0.015,
            dur: 0.9,
            wave: i === 0 ? 'triangle' : i % 2 === 0 ? 'pulse25' : 'pulse12',
            filterHz: 4800,
            toFilterHz: 1400,
            q: 1.5,
            detune: (i - 2) * 5,
            gain: i === 0 ? 0.34 : 0.22,
            pan,
            track: true,
          });
        });
        // Crystalline FM bell overtone crowning the Bit Flip inversion!
        this.fmVoice(ctx, { carrierHz: 1046.5, modRatio: 3, modIndex: 320, at: inv + 0.02, dur: 0.85, gain: 0.24, track: true });
        break;
      }
      case 'womm': {
        // Identical Bit Flip crescendo buildup → hard-cut to dead silence right before the high note at WOMM.freeze (2200ms) →
        // heavy dry "Not Responding" thump on WOMM.gray (2850ms) → dry hourglass double-click on WOMM.hourglass (3450ms).
        this.playBitflipBuildup(ctx, t);
        const grayAt = t + WOMM.gray / 1000;
        const hgAt = t + WOMM.hourglass / 1000;
        this.thud(ctx, grayAt, 115, 48, 0.26, 0.5, true);
        this.voice(ctx, { freq: 148, toFreq: 112, at: grayAt, dur: 0.24, wave: 'triangle', filterHz: 420, gain: 0.34, reverb: 0, track: true });
        this.noiseBurst(ctx, { at: hgAt, dur: 0.022, type: 'bandpass', filterHz: 2000, gain: 0.26, reverb: 0, track: true });
        this.voice(ctx, { freq: 360, at: hgAt, dur: 0.045, wave: 'square', filterHz: 1200, gain: 0.22, reverb: 0, track: true });
        this.voice(ctx, { freq: 290, at: hgAt + 0.06, dur: 0.05, wave: 'square', filterHz: 1000, gain: 0.18, reverb: 0, track: true });
        break;
      }
    }
  }

  private playBitflipBuildup(ctx: BaseAudioContext, t: number) {
    this.noiseBurst(ctx, { at: t, dur: 0.025, type: 'highpass', filterHz: 2800, gain: 0.24, track: true });
    this.voice(ctx, { freq: 110, toFreq: 102, at: t, dur: 0.4, wave: 'pulse25', filterHz: 750, q: 2, gain: 0.32, crush: true, track: true });
    this.voice(ctx, { freq: 55, at: t, dur: 0.42, wave: 'triangle', gain: 0.34, track: true });

    this.thud(ctx, t + 0.3, 150, 52, 0.22, 0.44, true);
    this.noiseBurst(ctx, { at: t + 0.3, dur: 0.18, type: 'bandpass', filterHz: 680, toFilterHz: 180, q: 2, gain: 0.34, crush: true, track: true });

    this.fmVoice(ctx, { carrierHz: 523.25, toCarrierHz: 698.46, modRatio: 2.5, modIndex: 200, at: t + 0.55, dur: 0.18, gain: 0.26, track: true });

    // Shared 18-step crescendo climbing right up to 2170ms (30ms shy of the high note / freeze fork).
    const endMs = WOMM.freeze - 30;
    const span = (endMs - 700) / 1000;
    this.noiseBurst(ctx, {
      at: t + 0.7,
      dur: span,
      type: 'bandpass',
      filterHz: 500,
      toFilterHz: 4600,
      q: 2.4,
      gain: 0.38,
      attack: span * 0.75,
      crush: true,
      track: true,
    });
    const steps = 18;
    for (let i = 0; i < steps; i++) {
      const p = i / Math.max(1, steps - 1);
      const at = t + 0.7 + p * span;
      const freq = 261.63 * Math.pow(2.8, p);
      const dur = Math.min(0.11, endMs / 1000 - (at - t));
      if (dur <= 0.015) break;
      const pan = (i % 2 === 0 ? -1 : 1) * (0.2 + p * 0.5);
      this.voice(ctx, {
        freq,
        at,
        dur,
        wave: 'pulse25',
        filterHz: 1800 + p * 3200,
        q: 1.8,
        gain: 0.22 + p * 0.16,
        pan,
        crush: p > 0.5,
        track: true,
      });
      if (p > 0.45) {
        this.voice(ctx, {
          freq: freq * 0.5,
          at,
          dur,
          wave: 'sawtooth',
          filterHz: 900 + p * 1200,
          detune: (i % 2 === 0 ? 1 : -1) * 18,
          gain: 0.2 + p * 0.14,
          pan: -pan,
          crush: true,
          track: true,
        });
      }
    }
  }

  /** Landing sound after a dive: tiny anticlimactic plink for +1 / WOMM, heavy sub-boom + FM chime for big dives. */
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
      this.fmVoice(ctx, { carrierHz: frames >= 10 ? 783.99 : 587.33, modRatio: 2, modIndex: 180, at: t + 0.015, dur: 0.26, gain: 0.2 });
    } else {
      this.thud(ctx, t, 130, 58, 0.16, 0.34);
      this.layered(ctx, { freq: 349.23, toFreq: 261.63, at: t, dur: 0.14, tm, gain: 0.28 });
    }
  }

  /** Subtle tactile crunch/thud when a new layer block slams into the RHS application stack. */
  stackCrunch(layer: LayerId) {
    const ctx = this.ensureCtx();
    if (!ctx) return;
    const t = ctx.currentTime;
    const tm = timbreFor(layer);
    this.thud(ctx, t, 145, 54, 0.09, 0.24);
    this.noiseBurst(ctx, { at: t, dur: 0.032, type: 'bandpass', filterHz: 1800, toFilterHz: 480, q: 1.8, gain: 0.14, crush: true, reverb: tm.reverbWet * 0.4 });
  }

  // -------------------------------------------------------------------------------------------
  // Layer Boundary Crossings

  playLayerCross(layer: LayerId) {
    this.setLayer(layer);
    if (this.tryPlayCustom(`layer-${layer}`)) return;
    const ctx = this.ensureCtx();
    if (!ctx) return;
    this.duckAmbience(0.45);
    const t = ctx.currentTime;
    const cross = LAYER_ART[layer].sound.cross;
    if (cross) cross(this.kit(ctx), t);
    else this.layered(ctx, { freq: 392, toFreq: 493.88, at: t, dur: 0.12, tm: timbreFor(layer), gain: 0.24, click: true });
  }

  /**
   * Render any procedural sound offline to a 16-bit WAV Blob (for dumping into `sounds/` to inspect/edit in a DAW).
   */
  async exportWav(play: (engine: SoundEngine) => void, durationSec = 2.5, sampleRate = 44100): Promise<Blob | null> {
    const Offline =
      typeof window !== 'undefined'
        ? (window.OfflineAudioContext ?? (window as unknown as { webkitOfflineAudioContext?: typeof OfflineAudioContext }).webkitOfflineAudioContext)
        : undefined;
    if (!Offline) return null;
    const off = new Offline(2, Math.ceil(durationSec * sampleRate), sampleRate);
    const temp = new SoundEngine();
    temp.setVolume(this.volume);
    temp.attachContext(off);
    play(temp);
    const rendered = await off.startRendering();
    return encodeWav(rendered);
  }
}

export const sound = new SoundEngine();
