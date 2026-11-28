import { reducedMotion } from '../looks';
import { sound } from '../audio/sound';

const GLITCH_CLASSES = ['ui-gl-chroma', 'ui-gl-shear', 'ui-gl-invert', 'ui-gl-scan'] as const;
const GLITCH_CHANCE = 0.1;
const GLITCH_COOLDOWN_MS = 1800;

let lastGlitchAt = -Infinity;
let glitchSeq = 0;

/**
 * Central tactile chrome delegation (docs/ui-style.md §4.2):
 * 1. Crisp chiptune micro-foley on every `.ui-key`, switch detent, volume bar, and binder page button.
 * 2. Rare (~10%, 1.8 s cooldown, strictly off under reduced motion) 90–140 ms non-strobing glitch easter egg
 *    on `.ui-key` presses.
 */
export function mountTactileChrome(root: HTMLElement = document.body): () => void {
  const onClick = (ev: MouseEvent) => {
    const target =
      ev.target instanceof Element
        ? ev.target.closest<HTMLElement>('.ui-key, .ks-stop, .vol-bar, .bd-edge, .bd-close')
        : null;
    if (!target || target.matches(':disabled')) return;

    // 1. Micro-foley
    if (target.classList.contains('ks-stop')) {
      sound.uiSwitch(Number(target.dataset.i ?? 1));
    } else if (target.classList.contains('vol-bar')) {
      sound.uiSwitch(Number(target.dataset.lvl ?? 2) - 1);
    } else {
      sound.uiClick();
    }

    // 2. Rare non-strobing per-click glitch easter egg on `.ui-key` buttons
    if (reducedMotion() || !target.classList.contains('ui-key')) return;
    const now = performance.now();
    if (now - lastGlitchAt < GLITCH_COOLDOWN_MS || Math.random() >= GLITCH_CHANCE) return;
    lastGlitchAt = now;

    const cls = GLITCH_CLASSES[glitchSeq++ % GLITCH_CLASSES.length]!;
    target.classList.remove(...GLITCH_CLASSES);
    void target.offsetWidth;
    target.classList.add(cls);
    window.setTimeout(() => target.classList.remove(cls), 140);
  };

  root.addEventListener('click', onClick);
  return () => root.removeEventListener('click', onClick);
}
