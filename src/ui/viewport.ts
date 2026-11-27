/**
 * Tracks the visual viewport (soft keyboard inset & visible height) and exposes CSS custom properties on `:root`:
 *   --vvh: visible viewport height in px (equals visualViewport.height, or innerHeight when unavailable)
 *   --vvt: visual viewport top offset in px
 *   --kb:  distance from the layout viewport bottom to the visual viewport bottom (soft keyboard height on
 *          resizes-visual browsers like Android Chrome and iOS Safari; 0 on resizes-content browsers)
 *
 * Also toggles `html.kb-open` whenever a text input is focused and the visual viewport has shrunk (covering both
 * resizes-visual and resizes-content mobile browsers), so fixed bottom UI stays visible above the keyboard.
 */

const KB_THRESHOLD_PX = 80;

function isTextEntry(el: Element | null): el is HTMLElement {
  if (!el) return false;
  if (el instanceof HTMLTextAreaElement) return true;
  if (el instanceof HTMLInputElement) {
    const t = (el.type || 'text').toLowerCase();
    return t === 'text' || t === 'search' || t === 'email' || t === 'url' || t === 'tel' || t === 'password' || t === 'number';
  }
  return el instanceof HTMLElement && el.isContentEditable;
}

export function mountVisualViewport(win: Window = window, doc: Document = document): () => void {
  const root = doc.documentElement;
  const vv = win.visualViewport;
  let lastWidth = win.innerWidth || 0;
  let restingHeight = Math.max(win.innerHeight || 0, vv ? Math.round(vv.height) : 0);
  let timers: number[] = [];

  const sync = () => {
    const innerW = win.innerWidth || 0;
    const innerH = win.innerHeight || 0;
    const vvH = vv ? Math.round(vv.height) : innerH;
    const vvTop = vv ? Math.round(vv.offsetTop) : 0;
    const kb = vv ? Math.max(0, Math.round(innerH - (vv.offsetTop + vv.height))) : 0;
    const focused = isTextEntry(doc.activeElement);

    // Track the full unobstructed height when no text input is active (or after an orientation/width change).
    if (Math.abs(innerW - lastWidth) > 40) {
      lastWidth = innerW;
      restingHeight = Math.max(innerH, vvH);
    } else if (!focused && kb < KB_THRESHOLD_PX) {
      restingHeight = Math.max(innerH, vvH);
    } else if (vvH > restingHeight) {
      restingHeight = vvH;
    }

    const shrunk = restingHeight - vvH > KB_THRESHOLD_PX;
    const kbOpen = focused && (kb > KB_THRESHOLD_PX || shrunk);

    if (vvH > 0) root.style.setProperty('--vvh', `${vvH}px`);
    root.style.setProperty('--vvt', `${vvTop}px`);
    root.style.setProperty('--kb', `${kb}px`);
    root.classList.toggle('kb-open', kbOpen);

    // If the console itself had to scroll to fit above the keyboard, keep the prompt line at the bottom in view.
    if (kbOpen && focused) {
      const consoleEl = doc.activeElement?.closest<HTMLElement>('.console');
      if (consoleEl && consoleEl.scrollHeight > consoleEl.clientHeight) {
        consoleEl.scrollTop = consoleEl.scrollHeight;
      }
    }
  };

  const schedule = () => {
    sync();
    for (const id of timers) win.clearTimeout(id);
    // Mobile keyboards animate open/closed asynchronously; re-measure after the transition settles.
    timers = [win.setTimeout(sync, 160), win.setTimeout(sync, 380)];
  };

  sync();
  vv?.addEventListener('resize', sync);
  vv?.addEventListener('scroll', sync);
  win.addEventListener('resize', sync);
  doc.addEventListener('focusin', schedule);
  doc.addEventListener('focusout', schedule);

  return () => {
    for (const id of timers) win.clearTimeout(id);
    timers = [];
    vv?.removeEventListener('resize', sync);
    vv?.removeEventListener('scroll', sync);
    win.removeEventListener('resize', sync);
    doc.removeEventListener('focusin', schedule);
    doc.removeEventListener('focusout', schedule);
    root.classList.remove('kb-open');
    root.style.removeProperty('--vvh');
    root.style.removeProperty('--vvt');
    root.style.removeProperty('--kb');
  };
}
