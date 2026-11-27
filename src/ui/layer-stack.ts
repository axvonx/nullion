import {
  expandLayerMap,
  layerIndexAt,
  layersFor,
  type DailyLayerId,
  type EndlessOnlyLayerId,
  type Layer,
  type LayerId,
  type StackMode,
} from '../core/layers';
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

const DAILY_THEMES: Record<DailyLayerId, LayerTheme> = {
  application: {
    accent: '#7ab8f5',
    hi: '#e8f4ff',
    tint: 'rgba(122, 184, 245, 0.14)',
    border: 'rgba(122, 184, 245, 0.36)',
    anim: 'blink',
    icon: [
      '#########',
      '#+.+....#',
      '#########',
      '#       #',
      '#  +++  #',
      '#  + +  #',
      '#  +++  #',
      '#       #',
      '#########',
    ],
  },
  runtime: {
    accent: '#8a8aff',
    hi: '#d0d0ff',
    tint: 'rgba(138, 138, 255, 0.14)',
    border: 'rgba(138, 138, 255, 0.36)',
    anim: 'pulse',
    icon: [
      '  #####  ',
      ' #     # ',
      '#  +#+  #',
      '# +   + #',
      '#  +#+  #',
      '#       #',
      ' # +++ # ',
      '  #####  ',
      '   # #   ',
    ],
  },
  libraries: {
    accent: '#e08b3e',
    hi: '#ffe082',
    tint: 'rgba(224, 139, 62, 0.14)',
    border: 'rgba(224, 139, 62, 0.38)',
    anim: 'none',
    icon: [
      ' ##  ##  ',
      ' #+##+# #',
      ' ##  ##+#',
      ' ##  ## #',
      ' #+##+# #',
      ' ##  ##+#',
      ' ##  ## #',
      '#########',
      '.........',
    ],
  },
  userspace: {
    accent: '#5c85ff',
    hi: '#99d6ff',
    tint: 'rgba(92, 133, 255, 0.14)',
    border: 'rgba(92, 133, 255, 0.38)',
    anim: 'blink',
    icon: [
      '#########',
      '#       #',
      '# +     #',
      '#  +    #',
      '#   +   #',
      '#  +    #',
      '# + +++ #',
      '#       #',
      '#########',
    ],
  },
  kernel: {
    accent: '#ff5f56',
    hi: '#ffcf5c',
    tint: 'rgba(255, 95, 86, 0.15)',
    border: 'rgba(255, 95, 86, 0.42)',
    anim: 'tick',
    icon: [
      '   # #   ',
      ' # ### # ',
      ' ####### ',
      '###+++###',
      ' ##+ +## ',
      '###+++###',
      ' ####### ',
      ' # ### # ',
      '   # #   ',
    ],
  },
  drivers: {
    accent: '#55ffff',
    hi: '#ff66ff',
    tint: 'rgba(85, 255, 255, 0.13)',
    border: 'rgba(85, 255, 255, 0.38)',
    anim: 'scan',
    icon: [
      '  # # #  ',
      ' ####### ',
      '##     ##',
      ' # +++ # ',
      '## + + ##',
      ' # +++ # ',
      '##     ##',
      ' ####### ',
      '  # # #  ',
    ],
  },
  firmware: {
    accent: '#4cd97b',
    hi: '#b8ffcf',
    tint: 'rgba(76, 217, 123, 0.13)',
    border: 'rgba(76, 217, 123, 0.38)',
    anim: 'blink',
    icon: [
      '#########',
      '#.......#',
      '#.#####.#',
      '#.# + #.#',
      '#.#+++#.#',
      '#.# + #.#',
      '#.#####.#',
      '#.......#',
      '#########',
    ],
  },
  'ring-1': {
    accent: '#28c76f',
    hi: '#98ffbe',
    tint: 'rgba(40, 199, 111, 0.13)',
    border: 'rgba(40, 199, 111, 0.36)',
    anim: 'pulse',
    icon: [
      '#### ####',
      '#  # #  #',
      '# +# #+ #',
      '#  # #  #',
      '#### ####',
      '  .   .  ',
      '#########',
      '# +   + #',
      '#########',
    ],
  },
  'ring-2': {
    accent: '#b8b8c0',
    hi: '#f0f0f5',
    tint: 'rgba(184, 184, 192, 0.12)',
    border: 'rgba(184, 184, 192, 0.36)',
    // Ring −2 freezes time: intentionally static.
    anim: 'none',
    icon: [
      '  #####  ',
      ' #     # ',
      '#   +   #',
      '#   +   #',
      '#   +++ #',
      '#       #',
      '#       #',
      ' #     # ',
      '  #####  ',
    ],
  },
  'ring-3': {
    accent: '#e8eeff',
    hi: '#ffffff',
    tint: 'rgba(232, 238, 255, 0.12)',
    border: 'rgba(232, 238, 255, 0.42)',
    anim: 'beat',
    icon: [
      '    #    ',
      '  #####  ',
      ' #     # ',
      ' # +++ # ',
      '## + + ##',
      ' # +++ # ',
      ' #     # ',
      '  #####  ',
      '    #    ',
    ],
  },
};

const ENDLESS_OVERRIDES: Partial<Record<EndlessOnlyLayerId, LayerTheme>> = {
  internet: {
    accent: '#7cd4ff',
    hi: '#ffffff',
    tint: 'rgba(124, 212, 255, 0.14)',
    border: 'rgba(124, 212, 255, 0.36)',
    anim: 'pulse',
    icon: [
      '  #####  ',
      ' # + # # ',
      '#  # #  #',
      '#########',
      '#  # #  #',
      '#########',
      '#  # #  #',
      ' # # + # ',
      '  #####  ',
    ],
  },
  browser: {
    accent: '#68a8f0',
    hi: '#d8ecff',
    tint: 'rgba(104, 168, 240, 0.14)',
    border: 'rgba(104, 168, 240, 0.36)',
    anim: 'scan',
    icon: [
      '#########',
      '#+++....#',
      '#########',
      '#   #   #',
      '# + # . #',
      '#   #   #',
      '# + # . #',
      '#   #   #',
      '#########',
    ],
  },
  bytecode: {
    accent: '#a98cff',
    hi: '#ffd56b',
    tint: 'rgba(169, 140, 255, 0.14)',
    border: 'rgba(169, 140, 255, 0.36)',
    anim: 'pulse',
    icon: [
      '   +++   ',
      '    #    ',
      '  #####  ',
      '  #   #  ',
      ' ##   ## ',
      '  #   #  ',
      ' + # # + ',
      '   # #   ',
      '  +   +  ',
    ],
  },
  jit: {
    accent: '#ff8a4c',
    hi: '#fff078',
    tint: 'rgba(255, 138, 76, 0.15)',
    border: 'rgba(255, 138, 76, 0.4)',
    anim: 'beat',
    icon: [
      '    ###  ',
      '   ###   ',
      '  ###    ',
      ' +++++++ ',
      '    ###  ',
      '   ###   ',
      '  ##     ',
      ' #       ',
      '         ',
    ],
  },
  linker: {
    accent: '#d4a656',
    hi: '#fff0a6',
    tint: 'rgba(212, 166, 86, 0.14)',
    border: 'rgba(212, 166, 86, 0.36)',
    anim: 'blink',
    icon: [
      '###   ###',
      '# #   # #',
      '###+++###',
      '    +    ',
      '   +++   ',
      '    +    ',
      '###+++###',
      '# #   # #',
      '###   ###',
    ],
  },
  'me-minix-user': {
    accent: '#f0a830',
    hi: '#ffe090',
    tint: 'rgba(240, 168, 48, 0.14)',
    border: 'rgba(240, 168, 48, 0.38)',
    anim: 'blink',
    icon: DAILY_THEMES.userspace.icon,
  },
  'me-minix-kern': {
    accent: '#e08820',
    hi: '#ffd878',
    tint: 'rgba(224, 136, 32, 0.14)',
    border: 'rgba(224, 136, 32, 0.38)',
    anim: 'tick',
    icon: DAILY_THEMES.kernel.icon,
  },
  uarch: {
    accent: '#58c4f0',
    hi: '#dff6ff',
    tint: 'rgba(88, 196, 240, 0.14)',
    border: 'rgba(88, 196, 240, 0.38)',
    anim: 'scan',
    icon: DAILY_THEMES.drivers.icon,
  },
  rtl: {
    accent: '#48b4e6',
    hi: '#d8f4ff',
    tint: 'rgba(72, 180, 230, 0.14)',
    border: 'rgba(72, 180, 230, 0.38)',
    anim: 'tick',
    icon: [
      '##       ',
      '  #####  ',
      '  #    # ',
      '  # ++  #',
      '  # + + #',
      '  # ++  #',
      '  #    # ',
      '  #####  ',
      '##       ',
    ],
  },
  cmos: {
    accent: '#b478f0',
    hi: '#52d6da',
    tint: 'rgba(180, 120, 240, 0.14)',
    border: 'rgba(180, 120, 240, 0.38)',
    anim: 'pulse',
    icon: DAILY_THEMES.firmware.icon,
  },
  litho: {
    accent: '#9a68f0',
    hi: '#f4ecff',
    tint: 'rgba(154, 104, 240, 0.14)',
    border: 'rgba(154, 104, 240, 0.38)',
    anim: 'scan',
    icon: DAILY_THEMES['ring-3'].icon,
  },
  bandgap: {
    accent: '#64bce6',
    hi: '#e6f8ff',
    tint: 'rgba(100, 188, 230, 0.14)',
    border: 'rgba(100, 188, 230, 0.38)',
    anim: 'pulse',
    icon: DAILY_THEMES['ring-3'].icon,
  },
  landauer: {
    accent: '#9ce0ff',
    hi: '#ffffff',
    tint: 'rgba(156, 224, 255, 0.14)',
    border: 'rgba(156, 224, 255, 0.42)',
    anim: 'beat',
    icon: DAILY_THEMES['ring-3'].icon,
  },
};

export const LAYER_THEMES: Record<LayerId, LayerTheme> = expandLayerMap(DAILY_THEMES, ENDLESS_OVERRIDES);

/** Maximum number of full-height blocks before older top layers compress into thin strata bars (Endless; all 10 Daily layers stay full). */
const MAX_EXPANDED = 10;
/** Stagger between blocks when a single big dive crosses multiple layers at once. */
const STAGGER_MS = 110;
/** Time from block launch until it slams into the underside of the existing stack (matches CSS keyframe impact). */
const IMPACT_MS = 230;

function makeIcon(theme: LayerTheme): SVGSVGElement {
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

function makeBlock(layer: Layer): HTMLLIElement {
  const theme = LAYER_THEMES[layer.id];
  const li = document.createElement('li');
  li.className = 'ls-block';
  li.dataset.layer = layer.id;
  if (layer.boundary) li.dataset.boundary = layer.boundary;
  li.title = layer.name;
  li.setAttribute('aria-label', layer.name);
  li.style.setProperty('--ls-accent', theme.accent);
  li.style.setProperty('--ls-tint', theme.tint);
  li.style.setProperty('--ls-border', theme.border);

  const inner = document.createElement('div');
  inner.className = 'ls-inner';
  inner.append(makeIcon(theme));
  inner.append(makeBitmapLabel(layer.name));

  li.append(inner);
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
  private onCrunch: ((id: LayerId) => void) | undefined;

  constructor(onCrunch?: (id: LayerId) => void) {
    this.onCrunch = onCrunch;
    const nav = document.createElement('aside');
    nav.className = 'layer-stack float';
    nav.setAttribute('aria-label', 'Application stack');
    const ol = document.createElement('ol');
    ol.className = 'ls-list';
    nav.append(ol);
    this.el = nav;
    this.list = ol;
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

    for (let i = start; i <= idx; i++) {
      const layer = stack[i]!;
      const block = makeBlock(layer);
      const step = i - start;
      if (doAnim) {
        const delay = step * STAGGER_MS;
        block.classList.add('ls-enter');
        block.style.setProperty('--ls-delay', `${delay}ms`);
        const impactAt = delay + IMPACT_MS;
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

  private clearTimers() {
    for (const id of this.timers) clearTimeout(id);
    this.timers.length = 0;
  }
}
