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
