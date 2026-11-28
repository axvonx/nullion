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

/** Strip `{gl:base|glitch}` markers down to their clean `base` text. */
export function stripGlitch(template: string): string {
  return template.replace(GLITCH_RE, '$1');
}

/**
 * Render `template` into `el`, animating `{gl:base|glitch}` spans with stepped chroma/shear flickers.
 * Returns a cleanup function that cancels pending timers. Under `reduced` motion (or without `force`),
 * `base` stays static.
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
  const fire = (on: boolean) => {
    for (const s of spans) {
      s.span.textContent = on ? s.glitch : s.base;
      s.span.classList.toggle('is-on', on);
    }
  };
  // Brief initial settle, then a two-beat glitch flicker before returning to base.
  later(360, () => fire(true));
  later(740, () => fire(false));
  later(900, () => fire(true));
  later(1120, () => fire(false));
  return () => {
    for (const t of timers) clearTimeout(t);
  };
}
