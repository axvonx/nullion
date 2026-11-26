import { reducedMotion } from '../looks';

/**
 * Stylized monospace pixel-art "nullion" wordmark for the title screen.
 *
 * Each letter lives on a uniform 7×9 monospace pixel cell, outlined in black with a pixel drop-shadow
 * so it reads cleanly over the bright Application sky. Plays frequent, varied, non-strobing digital
 * artifacts (13 effects) and emits each burst via `onBurst` so the live Scene canvas reflects the glitch
 * in the world behind it (mini "nullion" ghosts, localized palette drops, tears, hex dumps, voids, etc.).
 *
 * Under reduced motion: completely static, crisp pixel art.
 */

const CELL_W = 7;
const CELL_H = 9;
const GAP = 2;
const PAD_X = 7;
const PAD_Y = 8;

/** Uniform 7×9 monospace pixel glyphs ('#' = ink). */
const GLYPHS: Record<string, readonly string[]> = {
  n: [
    '       ',
    '       ',
    '## ### ',
    '###  ##',
    '##   ##',
    '##   ##',
    '##   ##',
    '##   ##',
    '##   ##',
  ],
  u: [
    '       ',
    '       ',
    '##   ##',
    '##   ##',
    '##   ##',
    '##   ##',
    '##   ##',
    '##  ###',
    ' ### ##',
  ],
  l: [
    '  ###  ',
    '   ##  ',
    '   ##  ',
    '   ##  ',
    '   ##  ',
    '   ##  ',
    '   ##  ',
    '   ##  ',
    '  #### ',
  ],
  i: [
    '   ##  ',
    '       ',
    '  ###  ',
    '   ##  ',
    '   ##  ',
    '   ##  ',
    '   ##  ',
    '   ##  ',
    '  #### ',
  ],
  o: [
    '       ',
    '       ',
    ' ##### ',
    '##   ##',
    '##   ##',
    '##   ##',
    '##   ##',
    '##   ##',
    ' ##### ',
  ],
  /** Bit-flip & hex-corrupt alternates. */
  '0': [
    ' ##### ',
    '##   ##',
    '##  ###',
    '## # ##',
    '###  ##',
    '##   ##',
    '##   ##',
    '##   ##',
    ' ##### ',
  ],
  '1': [
    '   ##  ',
    '  ###  ',
    ' ####  ',
    '   ##  ',
    '   ##  ',
    '   ##  ',
    '   ##  ',
    '   ##  ',
    ' ######',
  ],
  x: [
    '       ',
    '       ',
    '##   ##',
    ' ## ## ',
    '  ###  ',
    '  ###  ',
    ' ## ## ',
    '##   ##',
    '##   ##',
  ],
  F: [
    '#######',
    '##     ',
    '##     ',
    '#####  ',
    '##     ',
    '##     ',
    '##     ',
    '##     ',
    '##     ',
  ],
  A: [
    '  ###  ',
    ' ## ## ',
    '##   ##',
    '##   ##',
    '#######',
    '##   ##',
    '##   ##',
    '##   ##',
    '##   ##',
  ],
  E: [
    '#######',
    '##     ',
    '##     ',
    '#####  ',
    '##     ',
    '##     ',
    '##     ',
    '##     ',
    '#######',
  ],
  '3': [
    ' ##### ',
    '##   ##',
    '     ##',
    '  #### ',
    '     ##',
    '     ##',
    '     ##',
    '##   ##',
    ' ##### ',
  ],
};

/** Compact 3×5 pixel glyphs for tiny background "nullion" ghost stamps in the Scene world. */
const MINI_GLYPHS: Record<string, readonly string[]> = {
  n: ['###', '# #', '# #', '# #', '# #'],
  u: ['# #', '# #', '# #', '# #', '###'],
  l: [' # ', ' # ', ' # ', ' # ', ' ##'],
  i: [' # ', '   ', ' # ', ' # ', ' # '],
  o: ['###', '# #', '# #', '# #', '###'],
  '0': ['###', '# #', '###', '# #', '###'],
  '1': [' # ', '## ', ' # ', ' # ', '###'],
};

const WORD = ['n', 'u', 'l', 'l', 'i', 'o', 'n'] as const;
const HEX_POOL = ['0', '1', 'x', 'F', 'A', 'E', '3'] as const;

export const LOGO_W = PAD_X * 2 + WORD.length * CELL_W + (WORD.length - 1) * GAP;
export const LOGO_H = PAD_Y * 2 + CELL_H + 5; // extra room below for stack-echo and pixel-rain drips

export type TitleGlitchKind =
  | 'off-by-one'
  | 'race'
  | 'leak'
  | 'npe'
  | 'heisenbug'
  | 'bitflip'
  | 'mini-ghosts'
  | 'hex-corrupt'
  | 'pixel-rain'
  | 'crt-warp'
  | 'palette-drop'
  | 'stack-echo'
  | 'cursor-overwrite';

export interface TitleGlitchEvent {
  kind: TitleGlitchKind;
  dur: number;
  seed: number;
  /** Optional palette mode for palette-drop effects. */
  palette?: 'cga4' | 'green' | 'gray' | 'onebit';
}

interface GlitchBurst extends TitleGlitchEvent {
  start: number;
  letters: number[];
}

const BURST_DUR: Record<TitleGlitchKind, number> = {
  'off-by-one': 320,
  race: 460,
  leak: 680,
  npe: 380,
  heisenbug: 440,
  bitflip: 500,
  'mini-ghosts': 760,
  'hex-corrupt': 520,
  'pixel-rain': 640,
  'crt-warp': 460,
  'palette-drop': 580,
  'stack-echo': 620,
  'cursor-overwrite': 540,
};

const ALL_KINDS: readonly TitleGlitchKind[] = [
  'bitflip',
  'mini-ghosts',
  'heisenbug',
  'race',
  'hex-corrupt',
  'stack-echo',
  'palette-drop',
  'pixel-rain',
  'npe',
  'crt-warp',
  'cursor-overwrite',
  'leak',
  'off-by-one',
];

const DROP_PALETTES = ['cga4', 'green', 'gray', 'onebit'] as const;

function hash(n: number): number {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}

/**
 * Stamp a tiny pixel-art "nullion" directly onto a Scene canvas (in scene pixels).
 * `pxSize`: 1 = 27×5 tiny whisper, 2 = 54×10 medium ghost.
 */
export function drawMiniNullion(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  fill: string,
  outline: string | undefined,
  alpha: number,
  pxSize = 1,
  flipped = false,
) {
  ctx.save();
  ctx.globalAlpha = alpha;
  const ox = Math.round(x);
  const oy = Math.round(y);
  const step = 4 * pxSize;
  for (let i = 0; i < WORD.length; i++) {
    let ch: string = WORD[i]!;
    if (flipped && ch === 'o') ch = '0';
    else if (flipped && (ch === 'l' || ch === 'i')) ch = '1';
    const g = MINI_GLYPHS[ch]!;
    const gx = ox + i * step;
    if (outline) {
      ctx.fillStyle = outline;
      for (let r = 0; r < 5; r++) {
        for (let c = 0; c < 3; c++) {
          if (g[r]![c] === '#') ctx.fillRect(gx + c * pxSize + 1, oy + r * pxSize + 1, pxSize, pxSize);
        }
      }
    }
    ctx.fillStyle = fill;
    for (let r = 0; r < 5; r++) {
      for (let c = 0; c < 3; c++) {
        if (g[r]![c] === '#') ctx.fillRect(gx + c * pxSize, oy + r * pxSize, pxSize, pxSize);
      }
    }
  }
  ctx.restore();
}

/** Draw one 7×9 glyph at pixel position (ox, oy) with a 1px black outline and optional shadow. */
function drawGlyph(
  ctx: CanvasRenderingContext2D,
  glyph: readonly string[],
  ox: number,
  oy: number,
  fill: string,
  outline: string,
  shadow?: string,
  highlight?: string,
) {
  const px = Math.round(ox);
  const py = Math.round(oy);
  const ink = (r: number, c: number) => r >= 0 && r < CELL_H && c >= 0 && c < CELL_W && glyph[r]![c] === '#';

  if (shadow) {
    ctx.fillStyle = shadow;
    for (let r = 0; r < CELL_H; r++) {
      for (let c = 0; c < CELL_W; c++) {
        if (ink(r, c)) ctx.fillRect(px + c + 2, py + r + 2, 1, 1);
      }
    }
  }

  if (outline !== 'none') {
    ctx.fillStyle = outline;
    for (let r = -1; r <= CELL_H; r++) {
      for (let c = -1; c <= CELL_W; c++) {
        if (ink(r, c)) continue;
        let near = false;
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            if (ink(r + dr, c + dc)) {
              near = true;
              break;
            }
          }
          if (near) break;
        }
        if (near) ctx.fillRect(px + c, py + r, 1, 1);
      }
    }
  }

  for (let r = 0; r < CELL_H; r++) {
    for (let c = 0; c < CELL_W; c++) {
      if (!ink(r, c)) continue;
      const topEdge = !ink(r - 1, c);
      ctx.fillStyle = topEdge && highlight ? highlight : fill;
      ctx.fillRect(px + c, py + r, 1, 1);
    }
  }
}

export class TitleLogo {
  readonly canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private scratch: HTMLCanvasElement;
  private scratchCtx: CanvasRenderingContext2D;
  private burst: GlitchBurst | undefined;
  private nextBurstAt = 0;
  private seq = 0;
  private lastKind: TitleGlitchKind | undefined;
  private running = false;
  private raf = 0;

  /** Fires whenever a glitch burst starts, so the live Scene background can mirror it. */
  onBurst: ((ev: TitleGlitchEvent) => void) | undefined;

  constructor() {
    this.canvas = document.createElement('canvas');
    this.canvas.className = 'title-logo';
    this.canvas.width = LOGO_W;
    this.canvas.height = LOGO_H;
    this.canvas.setAttribute('role', 'img');
    this.canvas.setAttribute('aria-label', 'nullion');
    this.ctx = this.canvas.getContext('2d')!;
    this.scratch = document.createElement('canvas');
    this.scratch.width = LOGO_W;
    this.scratch.height = LOGO_H;
    this.scratchCtx = this.scratch.getContext('2d')!;
    this.render(0);
  }

  /** Start the ambient glitch loop (safe to call repeatedly). */
  start() {
    if (this.running) return;
    this.running = true;
    const now = performance.now();
    this.nextBurstAt = now + 220;
    const tick = (t: number) => {
      if (!this.running) return;
      this.render(t);
      this.raf = requestAnimationFrame(tick);
    };
    this.raf = requestAnimationFrame(tick);
  }

  /** Stop the loop when the title screen is dismissed. */
  stop() {
    this.running = false;
    cancelAnimationFrame(this.raf);
    this.burst = undefined;
  }

  /** Trigger a specific flourish on demand (e.g. hovering the CTA or clicking the wordmark). */
  pulse(kind?: TitleGlitchKind) {
    if (reducedMotion()) return;
    const now = performance.now();
    const chosen = kind ?? this.pickKind(now);
    this.startBurst(chosen, now);
    this.nextBurstAt = now + this.burst!.dur + 550;
  }

  private pickKind(now: number): TitleGlitchKind {
    // Pseudo-random pick that never repeats the exact same glitch twice in a row.
    const idx = Math.floor(hash(Math.floor(now * 0.37) + this.seq * 53) * ALL_KINDS.length);
    let kind = ALL_KINDS[idx % ALL_KINDS.length]!;
    if (kind === this.lastKind) kind = ALL_KINDS[(idx + 3) % ALL_KINDS.length]!;
    this.lastKind = kind;
    return kind;
  }

  private startBurst(kind: TitleGlitchKind, now: number) {
    this.seq++;
    const seed = Math.floor(now * 0.17) + this.seq * 41;
    const count =
      kind === 'off-by-one'
        ? 1
        : kind === 'race' || kind === 'hex-corrupt'
          ? 3
          : kind === 'pixel-rain'
            ? 4
            : 2;
    const letters: number[] = [];
    for (let k = 0; k < count + 2 && letters.length < count; k++) {
      const idx = Math.floor(hash(seed + k * 19) * WORD.length);
      if (!letters.includes(idx)) letters.push(idx);
    }
    const palette = kind === 'palette-drop' ? DROP_PALETTES[this.seq % DROP_PALETTES.length] : undefined;
    const b: GlitchBurst = { kind, start: now, dur: BURST_DUR[kind], letters, seed, palette };
    this.burst = b;
    this.onBurst?.({ kind: b.kind, dur: b.dur, seed: b.seed, palette: b.palette });
  }

  private render(now: number) {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, LOGO_W, LOGO_H);
    const reduced = reducedMotion();

    if (!reduced && now > 0) {
      if (this.burst && now - this.burst.start >= this.burst.dur) {
        const combo = hash(this.burst.seed + 99) < 0.45;
        this.burst = undefined;
        // Lively pacing: quick combo follow-up 45% of the time, otherwise 140–380ms calm beat.
        this.nextBurstAt = now + (combo ? 40 + hash(Math.floor(now)) * 55 : 140 + hash(Math.floor(now)) * 240);
      }
      if (!this.burst && now >= this.nextBurstAt) {
        this.startBurst(this.pickKind(now), now);
      }
    } else if (reduced) {
      this.burst = undefined;
    }

    const b = this.burst;
    const rel = b ? now - b.start : 0;
    const p = b ? Math.min(1, rel / b.dur) : 0;

    // 1. Pre-pass: Memory leak ghost copies
    if (b && b.kind === 'leak') {
      const drift = Math.round(1 + p * 4);
      ctx.save();
      ctx.globalAlpha = 0.65 * (1 - p * 0.55);
      for (const i of b.letters) {
        const ch = WORD[i]!;
        const x = PAD_X + i * (CELL_W + GAP) + drift;
        const y = PAD_Y + drift;
        drawGlyph(ctx, GLYPHS[ch]!, x, y, '#5fd3e0', '#0b2228');
      }
      ctx.restore();
    }

    // 2. Pre-pass: Stack-echo (2–3 stacked copies cascading vertically downward like stack frames)
    if (b && b.kind === 'stack-echo') {
      const reach = Math.sin(p * Math.PI);
      for (let layer = 2; layer >= 1; layer--) {
        const dy = Math.round(layer * 3 * reach);
        if (dy <= 0) continue;
        ctx.save();
        ctx.globalAlpha = (layer === 1 ? 0.52 : 0.28) * reach;
        const echoFill = layer === 1 ? '#ffb000' : '#8fb7ff';
        for (let i = 0; i < WORD.length; i++) {
          const x = PAD_X + i * (CELL_W + GAP);
          drawGlyph(ctx, GLYPHS[WORD[i]!]!, x, PAD_Y + dy, echoFill, '#0d0b12');
        }
        ctx.restore();
      }
    }

    // 3. Pre-pass: Mini-ghosts (tiny shadow copies popping right off the wordmark edges)
    if (b && b.kind === 'mini-ghosts') {
      const a = Math.sin(p * Math.PI) * 0.75;
      const dx = Math.round((hash(b.seed + 1) - 0.5) * 16);
      drawMiniNullion(ctx, PAD_X + 6 + dx, 1, '#5fd3e0', '#000', a, 1, hash(b.seed + 2) > 0.5);
      drawMiniNullion(ctx, PAD_X + 20 - dx, PAD_Y + CELL_H + 1, '#ffb000', '#000', a * 0.85, 1, true);
    }

    // Palette-drop colours (foreshadowing deeper layers)
    let palFill = '#ebe6d6';
    let palOutline = '#0d0b12';
    let palHi: string | undefined = '#ffffff';
    if (b && b.kind === 'palette-drop') {
      if (b.palette === 'cga4') {
        palFill = '#55ffff';
        palOutline = '#ff55ff';
        palHi = '#ffffff';
      } else if (b.palette === 'green') {
        palFill = '#8cff9c';
        palOutline = '#0a461e';
        palHi = '#d8ffe0';
      } else if (b.palette === 'gray') {
        palFill = '#bebebe';
        palOutline = '#242424';
        palHi = '#f0f0f0';
      } else if (b.palette === 'onebit') {
        palFill = '#e8eeff';
        palOutline = '#040406';
        palHi = undefined;
      }
    }

    // Cursor-overwrite sweep index (0..WORD.length)
    const sweepIdx = b && b.kind === 'cursor-overwrite' ? Math.floor(p * (WORD.length + 1)) : -1;

    // 4. Main pass: draw each monospace letter cell
    for (let i = 0; i < WORD.length; i++) {
      let ch: string = WORD[i]!;
      let x = PAD_X + i * (CELL_W + GAP);
      let y = PAD_Y;
      let fill = palFill;
      let outline = palOutline;
      let shadow: string | undefined = 'rgba(0,0,0,0.68)';
      let highlight: string | undefined = palHi;

      const hit = b && b.letters.includes(i);
      if (b && b.kind === 'cursor-overwrite' && i === sweepIdx) {
        // Block cursor sweeps over this letter, inverting its cell cleanly
        ctx.fillStyle = '#ffb000';
        ctx.fillRect(x - 1, y - 1, CELL_W + 2, CELL_H + 2);
        fill = '#131118';
        outline = '#ffb000';
        highlight = undefined;
        shadow = undefined;
      } else if (hit && b) {
        switch (b.kind) {
          case 'off-by-one': {
            const dir = hash(b.seed) > 0.5 ? 1 : -1;
            y += dir * 2;
            fill = '#ffb000';
            highlight = '#ffe25a';
            break;
          }
          case 'race': {
            x += Math.round(Math.sin(now / 28 + i * 2.1) * 2);
            y += Math.round(Math.cos(now / 35 + i * 1.4) * 1.4);
            fill = '#e2ccff';
            highlight = '#ffffff';
            break;
          }
          case 'bitflip': {
            if (ch === 'o') ch = '0';
            else if (ch === 'l' || ch === 'i') ch = '1';
            ctx.fillStyle = '#ffe25a';
            ctx.fillRect(x - 1, y - 1, CELL_W + 2, CELL_H + 2);
            fill = '#131118';
            outline = '#ffe25a';
            highlight = undefined;
            shadow = undefined;
            break;
          }
          case 'hex-corrupt': {
            const hexIdx = Math.floor(hash(b.seed + i * 13 + Math.floor(p * 3)) * HEX_POOL.length);
            ch = HEX_POOL[hexIdx % HEX_POOL.length]!;
            fill = '#7ee0a1';
            highlight = '#d6ffe6';
            break;
          }
          case 'heisenbug': {
            ctx.save();
            ctx.globalAlpha = 0.78;
            drawGlyph(ctx, GLYPHS[ch]!, x - 2, y, '#ff6ad5', 'none');
            drawGlyph(ctx, GLYPHS[ch]!, x + 2, y, '#5fd3e0', 'none');
            ctx.restore();
            break;
          }
          default:
            break;
        }
      }

      drawGlyph(ctx, GLYPHS[ch]!, x, y, fill, outline, shadow, highlight);

      // Pixel-rain: individual pixels detach from the bottom of affected letters and drip down
      if (hit && b && b.kind === 'pixel-rain') {
        const drop = Math.round(p * 7);
        for (let k = 0; k < 3; k++) {
          const px = x + 1 + Math.floor(hash(b.seed + i * 11 + k * 7) * (CELL_W - 2));
          const py = y + CELL_H - 1 + Math.max(0, drop - k * 2);
          if (py < LOGO_H) {
            ctx.fillStyle = '#000';
            ctx.fillRect(px + 1, py + 1, 1, 1);
            ctx.fillStyle = k === 0 ? '#5fd3e0' : '#ebe6d6';
            ctx.fillRect(px, py, 1, 1);
          }
        }
      }
    }

    // 5. Post-pass: Heisenbug horizontal scanline slice tear
    if (b && b.kind === 'heisenbug') {
      this.scratchCtx.clearRect(0, 0, LOGO_W, LOGO_H);
      this.scratchCtx.drawImage(this.canvas, 0, 0);
      const sy1 = PAD_Y + 1 + Math.floor(hash(b.seed + 1) * 4);
      const sy2 = PAD_Y + 5 + Math.floor(hash(b.seed + 2) * 4);
      const dx1 = hash(b.seed + 3) > 0.5 ? 3 : -3;
      ctx.clearRect(0, sy1, LOGO_W, 2);
      ctx.drawImage(this.scratch, 0, sy1, LOGO_W, 2, dx1, sy1, LOGO_W, 2);
      ctx.clearRect(0, sy2, LOGO_W, 2);
      ctx.drawImage(this.scratch, 0, sy2, LOGO_W, 2, -dx1, sy2, LOGO_W, 2);
    }

    // 6. Post-pass: CRT horizontal sync wave
    if (b && b.kind === 'crt-warp') {
      this.scratchCtx.clearRect(0, 0, LOGO_W, LOGO_H);
      this.scratchCtx.drawImage(this.canvas, 0, 0);
      ctx.clearRect(0, 0, LOGO_W, LOGO_H);
      const amp = Math.sin(p * Math.PI) * 2.6;
      for (let row = 0; row < LOGO_H; row++) {
        const dx = Math.round(Math.sin(row * 0.65 + now / 45) * amp);
        ctx.drawImage(this.scratch, 0, row, LOGO_W, 1, dx, row, LOGO_W, 1);
      }
    }

    // 7. Post-pass: Null pointer black void slice
    if (b && b.kind === 'npe') {
      const i = b.letters[0] ?? 2;
      const bx = PAD_X + i * (CELL_W + GAP) - 1;
      const by = PAD_Y + Math.floor(hash(b.seed + 5) * 4);
      const bw = CELL_W + 6 + Math.floor(hash(b.seed + 6) * 8);
      const bh = 4 + Math.floor(hash(b.seed + 7) * 4);
      ctx.fillStyle = '#000000';
      ctx.fillRect(bx, by, bw, bh);
      ctx.fillStyle = '#8fb7ff';
      ctx.fillRect(bx, by, 3, 1);
    }

    // 8. Post-pass: Bit-flip corner bracket ticks
    if (b && b.kind === 'bitflip' && p > 0.1 && p < 0.9) {
      const i = b.letters[0] ?? 0;
      const bx = PAD_X + i * (CELL_W + GAP) - 2;
      const by = PAD_Y - 2;
      ctx.fillStyle = '#ffb000';
      ctx.fillRect(bx, by, 2, 1);
      ctx.fillRect(bx, by, 1, 2);
      ctx.fillRect(bx + CELL_W + 2, by + CELL_H + 3, 2, 1);
      ctx.fillRect(bx + CELL_W + 3, by + CELL_H + 2, 1, 2);
    }
  }
}
