/** Small DOM and text helpers shared by the HUD's parts. */

/** The one element matching `sel` under `root`; a missing element is a bug and throws. */
export const $ = <T extends HTMLElement>(root: ParentNode, sel: string): T => {
  const el = root.querySelector<T>(sel);
  if (!el) throw new Error(`missing element ${sel}`);
  return el;
};

/** The `[data-el]` elements under `root`, by name. */
export function elementsOf(root: ParentNode): Record<string, HTMLElement> {
  return Object.fromEntries([...root.querySelectorAll<HTMLElement>('[data-el]')].map((e) => [e.dataset.el!, e]));
}

/** Restart a one-shot CSS animation class on an element. */
export function replay(el: HTMLElement, cls: string) {
  el.classList.remove(cls);
  void el.offsetWidth;
  el.classList.add(cls);
}

export function setText(el: HTMLElement, s: string) {
  if (el.textContent !== s) el.textContent = s;
}

export function framesLabel(n: number): string {
  return `${n} stack frame${n === 1 ? '' : 's'}`;
}

/** The article that explains what a stack frame is (checked to exist): "stack frames" links here wherever it is a label. */
export const STACK_FRAME_WIKI = 'https://en.wikipedia.org/wiki/Call_stack';

/**
 * A name that explains itself on hover: a link to its reference page in a new tab, or plain text where there is
 * none (an expected case: "Works on my machine" has no article). Clicks never reach the row or card around it.
 */
export function refLink(text: string, href: string | null, what: string): HTMLElement {
  if (!href) {
    const s = document.createElement('span');
    s.textContent = text;
    return s;
  }
  const a = document.createElement('a');
  a.className = 'wiki-ref';
  a.href = href;
  a.target = '_blank';
  a.rel = 'noopener noreferrer';
  a.textContent = text;
  a.title = `${what}: read about it on Wikipedia`;
  a.addEventListener('click', (e) => e.stopPropagation());
  return a;
}

export function sqSep(): HTMLSpanElement {
  const s = document.createElement('span');
  s.className = 'sq-sep';
  s.setAttribute('aria-hidden', 'true');
  return s;
}

/** Put `line` into `el`, turning every `{sq}` (`▪`) separator into a CSS pixel square. */
export function setSqText(el: HTMLElement, line: string) {
  const parts = line.split(/ ?\u25AA ?/);
  if (parts.length === 1) {
    setText(el, line);
    return;
  }
  const nodes: (string | Node)[] = [];
  parts.forEach((p, i) => {
    if (i > 0) nodes.push(sqSep());
    if (p) nodes.push(p);
  });
  el.replaceChildren(...nodes);
}

/** Put `line` into `el`, linking every "stack frame(s)" and turning every `{sq}` (`▪`) into a CSS pixel square. */
export function setLineWithStackFrames(el: HTMLElement, line: string) {
  const parts = line.split(/(stack frames?| ?\u25AA ?)/);
  el.replaceChildren(
    ...parts.filter(Boolean).map((p) => {
      if (/^stack frames?$/.test(p)) return refLink(p, STACK_FRAME_WIKI, 'Stack frame');
      if (/^ ?\u25AA ?$/.test(p)) return sqSep();
      return p;
    }),
  );
}

const GLITCH_RE = /\{gl:([^|{}]*)\|([^{}]*)\}/g;
const GLITCH_FX = ['scan', 'sparkle', 'slice', 'invert', 'step'] as const;
const SPARK_COLORS = ['#5fd3e0', '#ff6ad5', '#ffe25a', '#ffffff'];
const GLITCH_MS = 550;

/** Strip `{gl:base|glitch}` markers down to their clean `base` text. */
export function stripGlitch(template: string): string {
  return template.replace(GLITCH_RE, '$1');
}

function spawnSparks(host: HTMLElement) {
  const w = Math.max(24, host.offsetWidth);
  const h = Math.max(14, host.offsetHeight);
  for (let k = 0; k < 6; k++) {
    const p = document.createElement('span');
    p.className = 'tx-spark';
    const angle = (k / 6) * Math.PI * 2 + (Math.random() - 0.5) * 0.6;
    const reach = 10 + Math.random() * 14;
    p.style.left = `${Math.round(Math.random() * w)}px`;
    p.style.top = `${Math.round(Math.random() * h)}px`;
    p.style.setProperty('--dx', `${Math.round(Math.cos(angle) * reach)}px`);
    p.style.setProperty('--dy', `${Math.round(Math.sin(angle) * reach)}px`);
    p.style.setProperty('--pop', SPARK_COLORS[k % SPARK_COLORS.length]!);
    p.addEventListener('animationend', () => p.remove());
    host.append(p);
  }
}

/**
 * Render `template` into `el`, animating `{gl:base|glitch}` spans with varied stepped scanline, sparkle,
 * slice, invert, and materialize effects (550ms burst). Returns a cleanup function that cancels pending timers.
 */
export function renderGlitchLine(
  el: HTMLElement,
  template: string,
  opts: { force?: boolean; reduced?: boolean } = {},
): () => void {
  const tokens = [...template.matchAll(GLITCH_RE)];
  if (!tokens.length || opts.reduced || !opts.force) {
    setText(el, stripGlitch(template));
    return () => {};
  }
  const nodes: (string | HTMLElement)[] = [];
  const spans: { span: HTMLSpanElement; base: string; glitch: string }[] = [];
  let last = 0;
  for (const m of tokens) {
    const idx = m.index ?? 0;
    if (idx > last) nodes.push(template.slice(last, idx));
    const base = m[1]!;
    const glitch = m[2]!;
    const span = document.createElement('span');
    span.className = 'tx-gl';
    span.textContent = base;
    nodes.push(span);
    spans.push({ span, base, glitch });
    last = idx + m[0].length;
  }
  if (last < template.length) nodes.push(template.slice(last));
  el.replaceChildren(...nodes);

  const timers: number[] = [];
  const later = (ms: number, fn: () => void) => timers.push(window.setTimeout(fn, ms));
  const fx = GLITCH_FX[Math.floor(Math.random() * GLITCH_FX.length)]!;
  const fire = (on: boolean) => {
    for (const s of spans) {
      s.span.textContent = on ? s.glitch : s.base;
      s.span.dataset.text = on ? s.glitch : s.base;
      s.span.dataset.fx = on ? fx : '';
      s.span.classList.toggle('is-on', on);
      if (on && (fx === 'sparkle' || fx === 'scan')) spawnSparks(s.span);
    }
  };
  // Brief initial settle, then a 550ms glitch burst and a quick echo before returning to base.
  later(320, () => fire(true));
  later(320 + GLITCH_MS, () => fire(false));
  later(320 + GLITCH_MS + 140, () => fire(true));
  later(320 + GLITCH_MS + 140 + 220, () => fire(false));
  return () => {
    for (const t of timers) clearTimeout(t);
  };
}
