/**
 * Big-screen scaling for the UI. The scene already scales its pixels by a whole number (`pixelScale`); the panels,
 * chips and text are CSS pixels, so on a 1440p or 4K screen they stayed 1080p-sized. The whole page (`body`) is
 * zoomed by `uiZoom()`: exactly 1 up to 1080p (laptops and phones are unchanged), 1.33 at 2560×1440, 2 at 4K.
 *
 * Under CSS zoom, `getBoundingClientRect`, `innerWidth`/`innerHeight` and pointer coordinates stay in screen pixels,
 * while lengths written into styles (and viewport units in the stylesheets) are multiplied by the zoom. So:
 *  - stylesheets divide viewport units by `var(--ui)` (`calc(100vh / var(--ui, 1))`);
 *  - code that writes a screen-pixel measurement into a style converts it with `toCss` first.
 */

/** The UI zoom for a viewport: 1 up to 1080p, then growing with the screen (by height, capped by width), in 0.05s. */
export function uiZoomFor(vw: number, vh: number): number {
  const z = Math.min(vh / 1080, vw / 1700);
  return Math.max(1, Math.round(z * 20) / 20);
}

let current = 1;

/** The page's current UI zoom. */
export function uiZoom(): number {
  return current;
}

/** A screen-pixel length (a bounding rect, innerWidth, a pointer position) as CSS pixels inside the zoomed page. */
export function toCss(screenPx: number): number {
  return screenPx / current;
}

/** Zoom the page for the window's size now and on every resize. */
export function mountUiScale(win: Window = window, doc: Document = document): () => void {
  const apply = () => {
    current = uiZoomFor(win.innerWidth, win.innerHeight);
    doc.body.style.setProperty('zoom', String(current));
    doc.documentElement.style.setProperty('--ui', String(current));
  };
  apply();
  win.addEventListener('resize', apply);
  return () => win.removeEventListener('resize', apply);
}
