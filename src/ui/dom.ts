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

/** Put `line` into `el`, with every "stack frame(s)" in it linked to what a stack frame is. */
export function setLineWithStackFrames(el: HTMLElement, line: string) {
  const parts = line.split(/(stack frames?)/);
  el.replaceChildren(...parts.filter(Boolean).map((p) => (/^stack frames?$/.test(p) ? refLink(p, STACK_FRAME_WIKI, 'Stack frame') : p)));
}
