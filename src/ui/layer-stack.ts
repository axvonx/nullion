import { layerIndexAt, layersFor, type Layer, type LayerId, type StackMode } from '../core/layers';
import { LAYER_ART } from '../layers';
import { GLYPH_H, GLYPH_W, SPACE_W, WATERMARK_GLYPHS, lineWidth } from '../render/v4/watermark';

/**
 * RHS top-down application stack indicator.
 *
 * Accumulates layers top-down as the player descends (starting with Application at the top).
 * Each layer has a palette-matched color, a minimal thematic 9×9 pixel icon, and a subtle
 * idle animation (frozen in Ring −2 and under reduced motion). When descending into a new
 * layer, the block flies in from below and crunches into the underside of the existing stack
 * with a squash, seam sparks, and a micro-recoil on the stack above it.
 */

export type StackAnim = 'blink' | 'pulse' | 'tick' | 'scan' | 'beat' | 'none';

export interface LayerTheme {
  /** Primary signature color matched to the layer's world palette. */
  accent: string;
  /** Secondary highlight pixel color inside the 9×9 icon. */
  hi: string;
  /** Faint thematic fill tint behind the block. */
  tint: string;
  /** Subtle border/outline color when passed (active uses `accent`). */
  border: string;
  /** 9×9 pixel bitmap: '#' = accent, '+' = hi, '.' = dim ink, ' ' = empty. */
  icon: readonly string[];
  /** Subtle idle animation style for the icon / indicator. */
  anim: StackAnim;
}

/** Maximum number of full-height blocks before older top layers compress into thin strata bars (Endless; all 10 Daily layers stay full). */
const MAX_EXPANDED = 10;
/** Stagger between blocks when a single big dive crosses multiple layers at once. */
const STAGGER_MS = 110;
/** Time from block launch until it slams into the underside of the existing stack (matches CSS keyframe impact). */
const IMPACT_MS = 230;
/** Delay after impact before auto-showing the newly entered layer's plain-English tooltip, and how long it stays up. */
const TIP_SHOW_DELAY_MS = 320;
const TIP_HOLD_MS = 3400;

export function makeLayerIcon(theme: LayerTheme): SVGSVGElement {
  const ns = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(ns, 'svg');
  svg.setAttribute('viewBox', '0 0 9 9');
  svg.setAttribute('width', '14');
  svg.setAttribute('height', '14');
  svg.setAttribute('shape-rendering', 'crispEdges');
  svg.setAttribute('aria-hidden', 'true');
  svg.classList.add('ls-icon');
  if (theme.anim !== 'none') svg.classList.add(`ls-anim-${theme.anim}`);
  theme.icon.forEach((row, y) => {
    for (let x = 0; x < row.length; x++) {
      const ch = row[x];
      if (ch !== '#' && ch !== '+' && ch !== '.') continue;
      const r = document.createElementNS(ns, 'rect');
      r.setAttribute('x', String(x));
      r.setAttribute('y', String(y));
      r.setAttribute('width', '1');
      r.setAttribute('height', '1');
      r.setAttribute('fill', ch === '+' ? theme.hi : ch === '#' ? theme.accent : 'rgba(235,230,214,0.35)');
      if (ch === '+') r.classList.add('ls-hi');
      svg.append(r);
    }
  });
  return svg;
}

/**
 * Render the layer name using the same crude 5×7 bitmap font as the background watermarks, shrunken down
 * into a crisp pixel SVG (2× scale for normal names, 1× scale for very long Endless names so nothing clips).
 */
function makeBitmapLabel(name: string): SVGSVGElement {
  const ns = 'http://www.w3.org/2000/svg';
  const text = name.toUpperCase();
  const w = Math.max(1, lineWidth(text));
  const scale = w <= 78 ? 2 : 1;
  const svg = document.createElementNS(ns, 'svg');
  svg.setAttribute('viewBox', `0 0 ${w} ${GLYPH_H}`);
  svg.setAttribute('width', String(w * scale));
  svg.setAttribute('height', String(GLYPH_H * scale));
  svg.setAttribute('shape-rendering', 'crispEdges');
  svg.setAttribute('aria-hidden', 'true');
  svg.classList.add('ls-bitmap');

  let x = 0;
  for (const ch of text) {
    if (ch === ' ') {
      x += SPACE_W;
      continue;
    }
    const rows = WATERMARK_GLYPHS[ch];
    if (rows) {
      for (let r = 0; r < GLYPH_H; r++) {
        const row = rows[r]!;
        for (let k = 0; k < GLYPH_W; k++) {
          if (row[k] !== '1') continue;
          const rect = document.createElementNS(ns, 'rect');
          rect.setAttribute('x', String(x + k));
          rect.setAttribute('y', String(r));
          rect.setAttribute('width', '1');
          rect.setAttribute('height', '1');
          rect.setAttribute('fill', 'currentColor');
          svg.append(rect);
        }
      }
    }
    x += GLYPH_W + 1;
  }
  return svg;
}

/** Build a standalone layer badge (same icon + crude 5×7 bitmap label + color theme as the RHS stack) for the reveal's "Reached" row. */
export function createLayerBadge(layer: Layer): HTMLElement {
  const theme = LAYER_ART[layer.id].stackTheme;
  const el = document.createElement('div');
  el.className = 'ls-badge';
  el.dataset.layer = layer.id;
  el.style.setProperty('--ls-accent', theme.accent);
  el.style.setProperty('--ls-tint', theme.tint);
  el.style.setProperty('--ls-border', theme.border);
  const inner = document.createElement('div');
  inner.className = 'ls-inner';
  inner.append(makeLayerIcon(theme));
  inner.append(makeBitmapLabel(layer.name));
  el.append(inner);
  return el;
}

function makeBlock(layer: Layer, blurb?: string): HTMLLIElement {
  const theme = LAYER_ART[layer.id].stackTheme;
  const li = document.createElement('li');
  li.className = 'ls-block';
  li.dataset.layer = layer.id;
  if (layer.boundary) li.dataset.boundary = layer.boundary;
  li.setAttribute('aria-label', blurb ? `${layer.name}: ${blurb}` : layer.name);
  li.tabIndex = 0;
  li.style.setProperty('--ls-accent', theme.accent);
  li.style.setProperty('--ls-tint', theme.tint);
  li.style.setProperty('--ls-border', theme.border);

  const inner = document.createElement('div');
  inner.className = 'ls-inner';
  inner.append(makeLayerIcon(theme));
  inner.append(makeBitmapLabel(layer.name));
  li.append(inner);

  if (blurb) {
    const tip = document.createElement('div');
    tip.className = 'ls-tip';
    tip.setAttribute('role', 'tooltip');
    const title = document.createElement('span');
    title.className = 'ls-tip-name';
    title.textContent = layer.name;
    const desc = document.createElement('span');
    desc.className = 'ls-tip-desc';
    desc.textContent = blurb;
    tip.append(title, desc);
    li.append(tip);
  }
  return li;
}

function spawnSparks(li: HTMLLIElement) {
  const wrap = document.createElement('span');
  wrap.className = 'ls-sparks';
  wrap.setAttribute('aria-hidden', 'true');
  for (let i = 0; i < 4; i++) {
    const s = document.createElement('i');
    s.className = `ls-spark ls-spark-${i}`;
    wrap.append(s);
  }
  li.append(wrap);
  window.setTimeout(() => wrap.remove(), 420);
}

export interface StackSyncOptions {
  /** Whether newly entered layers should play the fly-in + crunch animation. */
  animate: boolean;
  /** Honors reduced motion (no fly-in, no sparks, no recoil). */
  reduced: boolean;
}

export class LayerStack {
  readonly el: HTMLElement;
  private list: HTMLOListElement;
  private mode: StackMode | undefined;
  private currentIdx = -1;
  private timers: number[] = [];
  private flyers: HTMLElement[] = [];
  private tipTimer = 0;
  private onCrunch: ((id: LayerId) => void) | undefined;
  private blurbs: Partial<Record<LayerId, string>>;

  constructor(onCrunch?: (id: LayerId) => void, blurbs: Partial<Record<LayerId, string>> = {}) {
    this.onCrunch = onCrunch;
    this.blurbs = blurbs;
    const nav = document.createElement('aside');
    nav.className = 'layer-stack float';
    nav.setAttribute('aria-label', 'Application stack');
    const ol = document.createElement('ol');
    ol.className = 'ls-list';
    nav.append(ol);
    this.el = nav;
    this.list = ol;

    // Click / tap any layer block to pin its plain-English tooltip open; click again or outside to dismiss.
    ol.addEventListener('click', (ev) => {
      const target = (ev.target as Element | null)?.closest<HTMLElement>('.ls-block');
      if (!target) return;
      ev.stopPropagation();
      const wasPinned = target.classList.contains('is-tip-pinned');
      this.clearPinnedTips();
      if (!wasPinned) {
        this.clearAutoTips();
        target.classList.add('is-tip-pinned');
      }
    });
    if (typeof document !== 'undefined') {
      document.addEventListener('click', (ev) => {
        if (!this.el.contains(ev.target as Node | null)) this.clearPinnedTips();
      });
    }
  }

  /** Sync the visible RHS stack to the current depth and mode. */
  sync(depth: number, mode: StackMode, opts: StackSyncOptions) {
    const idx = layerIndexAt(Math.max(0, depth), mode);
    if (mode !== this.mode) {
      this.clearTimers();
      this.mode = mode;
      this.currentIdx = -1;
      this.list.replaceChildren();
    }
    if (idx === this.currentIdx) return;

    const stack = layersFor(mode);
    const prev = this.currentIdx;

    if (idx < prev) {
      // Scrolled back up or reset: trim excess blocks cleanly.
      this.clearTimers();
      while (this.list.children.length > idx + 1) {
        this.list.lastElementChild?.remove();
      }
      this.currentIdx = idx;
      this.refreshStates(idx);
      return;
    }

    const doAnim = opts.animate && !opts.reduced && prev >= 0;
    const start = prev + 1;
    const addedCount = idx - prev;

    let lastBlock: HTMLLIElement | undefined;
    let lastImpactAt = 0;
    for (let i = start; i <= idx; i++) {
      const layer = stack[i]!;
      const block = makeBlock(layer, this.blurbs[layer.id]);
      lastBlock = block;
      const step = i - start;
      if (doAnim) {
        const delay = step * STAGGER_MS;
        block.classList.add('ls-enter');
        block.style.setProperty('--ls-delay', `${delay}ms`);
        const impactAt = delay + IMPACT_MS;
        lastImpactAt = impactAt;
        const t1 = window.setTimeout(() => {
          spawnSparks(block);
          this.bumpAbove(block);
          this.onCrunch?.(layer.id);
        }, impactAt);
        const t2 = window.setTimeout(() => {
          block.classList.remove('ls-enter');
          block.style.removeProperty('--ls-delay');
        }, delay + 520);
        this.timers.push(t1, t2);
      }
      this.list.append(block);
    }

    // If a single jump added many layers (e.g. ?depth=42 deep link), don't spam crunch timers.
    if (doAnim && addedCount > 4) {
      this.clearTimers();
      for (const child of this.list.children) {
        child.classList.remove('ls-enter');
        (child as HTMLElement).style.removeProperty('--ls-delay');
      }
    } else if (opts.animate && prev >= 0 && lastBlock && this.blurbs[stack[idx]!.id]) {
      // Auto-reveal the newly entered layer's plain-English tooltip after a short post-impact beat so it stays readable.
      const showAt = doAnim ? lastImpactAt + TIP_SHOW_DELAY_MS : TIP_SHOW_DELAY_MS;
      const targetBlock = lastBlock;
      this.clearAutoTips();
      const tShow = window.setTimeout(() => {
        targetBlock.classList.add('is-tip-auto');
        this.tipTimer = window.setTimeout(() => {
          targetBlock.classList.remove('is-tip-auto');
        }, TIP_HOLD_MS);
      }, showAt);
      this.timers.push(tShow);
    }

    this.currentIdx = idx;
    this.refreshStates(idx);
  }

  /** Toggle visibility (hidden on title screen or when look('layerStack') === 'off'). */
  setVisible(on: boolean) {
    this.el.hidden = !on;
  }

  /** Keep clear of the right-hand debug rail when present. */
  setRightReserve(px: number) {
    this.el.style.setProperty('--ls-right', `${16 + px}px`);
  }

  /** Keep clear of the top header bar even when it wraps onto two rows on narrow phones. */
  setTopOffset(px: number) {
    this.el.style.setProperty('--ls-top', `${px}px`);
  }

  private bumpAbove(incoming: HTMLLIElement) {
    const prev = incoming.previousElementSibling as HTMLElement | null;
    if (!prev) return;
    prev.classList.remove('ls-bump');
    void prev.offsetWidth;
    prev.classList.add('ls-bump');
    const above = prev.previousElementSibling as HTMLElement | null;
    if (above) {
      above.classList.remove('ls-bump-soft');
      void above.offsetWidth;
      above.classList.add('ls-bump-soft');
    }
  }

  private refreshStates(activeIdx: number) {
    const children = [...this.list.children] as HTMLElement[];
    const compressBefore = Math.max(0, children.length - MAX_EXPANDED);
    children.forEach((child, i) => {
      const isCurrent = i === activeIdx;
      child.classList.toggle('is-current', isCurrent);
      child.classList.toggle('is-passed', !isCurrent);
      child.classList.toggle('is-strata', i < compressBefore);
      if (isCurrent) child.setAttribute('aria-current', 'step');
      else child.removeAttribute('aria-current');
    });
  }

  /**
   * Append a single newly reached layer by flying a visual clone from `sourceEl` (in the reveal's "Reached" section)
   * directly into its exact destination slot at the bottom of the RHS stack, then triggering the crunch impact + tooltip.
   */
  flyIntoStack(
    sourceEl: HTMLElement,
    layer: Layer,
    mode: StackMode,
    opts: { reduced: boolean; showTip: boolean; delayMs?: number },
  ) {
    const stack = layersFor(mode);
    const targetIdx = stack.findIndex((l) => l.id === layer.id);
    if (targetIdx < 0) return;
    if (mode !== this.mode) {
      this.clearTimers();
      this.mode = mode;
      this.currentIdx = -1;
      this.list.replaceChildren();
    }
    if (targetIdx <= this.currentIdx) return;

    // Ensure any intermediate layers exist (normally called strictly in order).
    for (let i = this.currentIdx + 1; i < targetIdx; i++) {
      this.list.append(makeBlock(stack[i]!, this.blurbs[stack[i]!.id]));
    }

    const block = makeBlock(layer, this.blurbs[layer.id]);
    this.list.append(block);
    this.currentIdx = targetIdx;
    this.refreshStates(targetIdx);

    const srcRect = sourceEl.getBoundingClientRect();
    const dstRect = block.getBoundingClientRect();
    const canFly = !opts.reduced && srcRect.width > 0 && dstRect.width > 0 && typeof document !== 'undefined';

    if (!canFly) {
      sourceEl.classList.add('ls-badge-gone');
      if (opts.showTip && this.blurbs[layer.id]) this.scheduleAutoTip(block, TIP_SHOW_DELAY_MS);
      return;
    }

    // Hide both the source badge and destination slot while the flying clone travels between them.
    sourceEl.classList.add('ls-badge-gone');
    block.style.opacity = '0';

    const flyer = createLayerBadge(layer);
    flyer.classList.add('ls-flyer');
    flyer.style.left = `${Math.round(srcRect.left)}px`;
    flyer.style.top = `${Math.round(srcRect.top)}px`;
    flyer.style.width = `${Math.round(srcRect.width)}px`;
    document.body.append(flyer);
    this.flyers.push(flyer);

    const dx = Math.round(dstRect.left - srcRect.left);
    const dy = Math.round(dstRect.top - srcRect.top);
    const delayMs = Math.max(0, opts.delayMs ?? 0);
    const flightMs = 760;

    const launch = () => {
      requestAnimationFrame(() => {
        flyer.style.transform = `translate(${dx}px, ${dy}px)`;
        flyer.style.width = `${Math.round(dstRect.width)}px`;
      });
    };
    if (delayMs > 0) {
      const tGo = window.setTimeout(launch, delayMs);
      this.timers.push(tGo);
    } else {
      launch();
    }

    const tLand = window.setTimeout(() => {
      flyer.remove();
      this.flyers = this.flyers.filter((f) => f !== flyer);
      block.style.opacity = '';
      block.classList.add('ls-crunch');
      spawnSparks(block);
      this.bumpAbove(block);
      this.onCrunch?.(layer.id);
      const tClean = window.setTimeout(() => block.classList.remove('ls-crunch'), 260);
      this.timers.push(tClean);
      if (opts.showTip && this.blurbs[layer.id]) this.scheduleAutoTip(block, TIP_SHOW_DELAY_MS);
    }, delayMs + flightMs);
    this.timers.push(tLand);
  }

  /** Cancel any in-flight badges and snap the stack cleanly to `depth`. */
  flushTo(depth: number, mode: StackMode) {
    this.clearTimers();
    for (const child of this.list.children) (child as HTMLElement).style.opacity = '';
    this.sync(depth, mode, { animate: false, reduced: true });
  }

  private scheduleAutoTip(targetBlock: HTMLElement, showAt: number) {
    this.clearAutoTips();
    const tShow = window.setTimeout(() => {
      targetBlock.classList.add('is-tip-auto');
      this.tipTimer = window.setTimeout(() => {
        targetBlock.classList.remove('is-tip-auto');
      }, TIP_HOLD_MS);
    }, showAt);
    this.timers.push(tShow);
  }

  private clearAutoTips() {
    clearTimeout(this.tipTimer);
    for (const child of this.list.children) child.classList.remove('is-tip-auto');
  }

  private clearPinnedTips() {
    for (const child of this.list.children) child.classList.remove('is-tip-pinned');
  }

  private clearTimers() {
    clearTimeout(this.tipTimer);
    for (const id of this.timers) clearTimeout(id);
    this.timers.length = 0;
    for (const f of this.flyers) f.remove();
    this.flyers.length = 0;
  }
}
