# UI Style Guide & Design System (`docs/ui-style.md`)

Settled 2026-11-27 from the Lavish UI audit and design session (`.lavish/ui-audit.html`). Sibling to `docs/art-style.md` (world sprites) and `docs/field-manual.md` (the archive binder). Every new UI surface, control, modal, or polish pass must follow this spec so the game scales cleanly into Settings rework, the HUD Field Manual book, Achievements, User Profile, and Account/Export without visual drift.

---

## 1. Philosophy: The Two-World Material Contract

Nullion's UI already has a strong, original identity—quiet dark debugger chrome framing a vivid descending pixel world, paired with two intentional physical artifacts. Formalize that split strictly:

1. **World A · Debugger Chrome (all system UI).**
   - Owns: Header bar, Settings modal, How-to-Play modal, End Card (Daily & Endless), Notice toasts, RHS Layer Stack, Reveal CTA (`UNWIND FURTHER ▾`, `hide ▾`, `show ▴`), and all future player-meta panels (Achievements, User Profile, Account/Export).
   - Palette: near-opaque obsidian bezel (`#131118` / `rgba(16, 14, 22, 0.96)`), hard `2px solid #000` outer edges, `1px` inner rule (`#34303f`), warm phosphor amber (`#ffb000`) for primary signal, paper ink (`#ebe6d6`), muted slate (`#8b8598`).
   - **Rule:** Debugger Chrome is *never* re-themed by layer console forms (`data-form`). The scene owns the color-depth descent; system chrome stays dark and calm so the world and tier colors always read cleanly.

2. **World B · Diegetic Physical Objects (only two intentional exceptions).**
   - **Live Prompt Console (`data-form`):** Morphs through 8 computing idioms (`gui`, `repl`, `shell`, `serial`, `bios`, `hyper`, `smm`, `raw`) strictly while answering prompts.
   - **Field Manual Archive Binder (`src/ui/binder/`):** Slate vinyl 3-ring binder, punched bond paper (`#f1f0ec`), troff serif (`TeX Gyre Termes`), blue pencil (`Caveat`), rubber date stamps (`Courier Prime`).
   - **Rule:** Nothing else breaks Debugger Chrome. Keep binder styles strictly scoped inside `.bd-backdrop`, and keep `data-form` styles strictly scoped to active prompt play (never leaking into `.result`).

---

## 2. Core Tokens

All Debugger Chrome surfaces draw from one shared token block on `:root` (`src/style.css`):

```css
:root {
  /* Surfaces & edges */
  --bezel: #1d1a24;
  --panel: #131118;
  --panel-fill: rgba(16, 14, 22, 0.96);
  --titlebar: #1d1a26;
  --titlebar-hi: #3f3950;
  --rule: #34303f;
  --rule-hi: #4f4861;
  --ink: #ebe6d6;
  --dim: #8b8598;

  /* Semantic signals */
  --signal: #ffb000;
  --signal-hi: #ffc433;
  --signal-slice-1: #c98300;
  --signal-slice-2: #6e4600;
  --fault: #ff5f7a;
  --ok: #7ee0a1;
  --sys: #8fb7ff;

  /* Stack-frame shadow slices (neutral dark chrome) */
  --stack-slice-1: #39334a;
  --stack-slice-2: #242030;
  --stack-ink: #000000;

  /* Typography */
  --display: 'Silkscreen', monospace;
  --body: 'VT323', ui-monospace, monospace;
}
```

---

## 3. The Stack-Frame Elevation System (Signature Visual Motif)

Nullion is a game about pushing stack frames. Instead of generic soft blurs or arbitrary single-offset drop shadows, **stepped downward stack slices** serve as the unifying elevation language across buttons, chips, panels, modals, and hero CTAs.

| Level | Stack Slices | Used On | Resting Shadow Recipe |
|---|---|---|---|
| **L0 · Recessed** | `0` | Inputs, switch tracks, disabled controls, pressed (`:active`) buttons | `inset 0 2px 0 rgba(0,0,0,0.75)` (flat, zero exterior stack) |
| **L1 · Single Frame** | `1` slice (`3px`) | Header chips, tooltips, quiet keys (`HIDE ▾`, `+N MORE`), notice bars, RHS stack blocks | `0 2px 0 #000, 0 4px 0 var(--stack-slice-2), 0 6px 0 #000` (or tight `0 2px 0 #000, 0 3px 0 var(--rule), 0 5px 0 #000`) |
| **L2 · Double Frame** | `2` slices (`6px`) | Secondary buttons, header icon keys, windowed modals, title CTA card, End Card container | `0 2px 0 #000, 0 4px 0 var(--stack-slice-1), 0 6px 0 #000` (panels: `+ 0 8px 0 var(--stack-slice-2), 0 10px 0 #000`) |
| **L3 · Primary CTA** | `2` rich amber slices (`11px`) | `UNWIND THE STACK ▾`, `UNWIND FURTHER ▾`, `SHARE RESULT`, `show ▴` | `0 3px 0 #000, 0 5px 0 var(--signal-slice-1), 0 7px 0 #000, 0 9px 0 var(--signal-slice-2), 0 11px 0 #000` |
| **L4 · Exaggerated Hero** | `3–4` deep glowing slices (`14–18px`) | **`ENTER ENDLESS ▾`**, future **Fast-Dive to Landauer** | Emerald slices stepping down into deep green/black glow (`#2aa85e` → `#17693a` → `#0d3d22`), compressing dramatically on press |

> **Layout guard:** Because downward stack shadows extend below an element's border box without pushing siblings, every stacked `.ui-key` reserves matching `margin-bottom` (or sits inside a flex/grid gap ≥ the resting stack depth) so resting shadows never collide with elements below.

---

## 4. Button Primitives (Family C · Stacked Memory Frames)

Replace all 13 ad-hoc button styles in `src/style.css` with **4 core primitives + 1 special hero slot**. Remove the broad global `button { font-family: var(--display); background: var(--signal); }` rule so non-key buttons (like `.bt-row`, `.fm-end-btn`, binder rows) never inherit unintended styles.

### 4.1 CSS Primitives

```css
/* Shared base for all Debugger Chrome buttons */
.ui-key {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  font-family: var(--display);
  letter-spacing: 0.06em;
  text-transform: uppercase;
  border: 2px solid #000;
  cursor: pointer;
  user-select: none;
  transition: transform 65ms steps(2), box-shadow 65ms steps(2), background-color 80ms, color 80ms;
}
.ui-key:focus-visible { outline: 2px solid var(--ink); outline-offset: 2px; }
.ui-key:disabled {
  opacity: 0.42;
  cursor: not-allowed;
  transform: none !important;
  box-shadow: inset 0 2px 0 rgba(0, 0, 0, 0.55) !important;
}

/* 1. Primary CTA — 2 rich amber stack slices; fans open on hover, crunches flat on press */
.ui-key--primary {
  font-size: 13px;
  min-height: 46px;
  padding: 9px 20px;
  color: #14111a;
  background: var(--signal);
  margin-bottom: 10px;
  box-shadow:
    0 3px 0 0 #000,
    0 5px 0 0 var(--signal-slice-1),
    0 7px 0 0 #000,
    0 9px 0 0 var(--signal-slice-2),
    0 11px 0 0 #000;
}
.ui-key--primary:hover:not(:disabled) {
  background: var(--signal-hi);
  transform: translateY(-2px);
  box-shadow:
    0 4px 0 0 #000,
    0 7px 0 0 #d99100,
    0 9px 0 0 #000,
    0 12px 0 0 #7a4f00,
    0 14px 0 0 #000;
}
.ui-key--primary:active:not(:disabled) {
  transform: translateY(8px);
  box-shadow: 0 2px 0 0 #000;
}

/* 2. Secondary — dark debugger plate with 1 slate stack slice */
.ui-key--secondary {
  font-size: 11px;
  min-height: 36px;
  padding: 6px 14px;
  color: var(--ink);
  background: #1e1a29;
  margin-bottom: 6px;
  box-shadow:
    inset 0 0 0 1px var(--rule-hi),
    0 2px 0 0 #000,
    0 4px 0 0 var(--stack-slice-1),
    0 6px 0 0 #000;
}
.ui-key--secondary:hover:not(:disabled) {
  color: var(--signal);
  transform: translateY(-1px);
  box-shadow:
    inset 0 0 0 1px var(--signal),
    0 3px 0 0 #000,
    0 6px 0 0 #8f6314,
    0 8px 0 0 #000;
}
.ui-key--secondary:active:not(:disabled) {
  transform: translateY(4px);
  box-shadow: inset 0 0 0 1px var(--signal), 0 1px 0 0 #000;
}

/* 3. Quiet Utility — low-noise hide / +N more / clear / pager step */
.ui-key--quiet {
  font-size: 10px;
  min-height: 26px;
  padding: 4px 12px;
  color: var(--dim);
  background: #14121b;
  border: 1px solid var(--rule-hi);
  margin-bottom: 4px;
  box-shadow: 0 2px 0 #000, 0 3px 0 var(--rule), 0 5px 0 #000;
}
.ui-key--quiet:hover:not(:disabled) { color: var(--ink); border-color: var(--ink); transform: translateY(-1px); }
.ui-key--quiet:active:not(:disabled) { transform: translateY(3px); box-shadow: 0 1px 0 #000; }

/* 4. Icon Key — Settings ⚙, Help ?, Modal Close ×, future Achievements & Profile */
.ui-key--icon {
  width: 34px;
  height: 32px;
  padding: 0;
  color: var(--ink);
  background: #1e1a29;
  margin-bottom: 5px;
  box-shadow:
    inset 0 0 0 1px var(--rule-hi),
    0 2px 0 0 #000,
    0 4px 0 0 var(--stack-slice-1),
    0 6px 0 0 #000;
}
.ui-key--icon:hover:not(:disabled) {
  color: var(--signal);
  transform: translateY(-1px);
  box-shadow:
    inset 0 0 0 1px var(--signal),
    0 3px 0 0 #000,
    0 6px 0 0 #8f6314,
    0 8px 0 0 #000;
}
.ui-key--icon:active:not(:disabled) {
  transform: translateY(4px);
  box-shadow: inset 0 0 0 1px var(--signal), 0 1px 0 0 #000;
}

/* 5. Special Hero Slot — Exaggerated 3-slice plunging stack for "ENTER ENDLESS ▾" */
.ui-key--endless {
  width: 100%;
  min-height: 46px;
  padding: 8px 16px;
  font-size: 13px;
  letter-spacing: 0.14em;
  color: #d8ffe4;
  background: #0e1a12;
  border: 2px solid #4ee08a;
  text-shadow: 0 0 6px rgba(78, 224, 138, 0.55);
  margin-bottom: 14px;
  box-shadow:
    inset 0 0 12px rgba(78, 224, 138, 0.18),
    0 3px 0 0 #000,
    0 5px 0 0 #2aa85e,
    0 7px 0 0 #000,
    0 9px 0 0 #17693a,
    0 11px 0 0 #000,
    0 13px 0 0 #0c3d22,
    0 15px 0 0 #000,
    0 0 16px rgba(61, 220, 132, 0.42);
}
.ui-key--endless:hover:not(:disabled) {
  background: #12261a;
  transform: translateY(-2px);
  box-shadow:
    inset 0 0 16px rgba(78, 224, 138, 0.28),
    0 4px 0 0 #000,
    0 7px 0 0 #3ad67b,
    0 9px 0 0 #000,
    0 12px 0 0 #1d8248,
    0 14px 0 0 #000,
    0 17px 0 0 #0f4c2a,
    0 19px 0 0 #000,
    0 0 22px rgba(78, 224, 138, 0.55);
}
.ui-key--endless:active:not(:disabled) {
  transform: translateY(11px);
  box-shadow: inset 0 0 16px rgba(78, 224, 138, 0.35), 0 2px 0 0 #000, 0 0 12px rgba(78, 224, 138, 0.5);
}

/* Reduced motion: zero translate travel; crisp color/border response only */
.still .ui-key,
.still .ui-key:hover,
.still .ui-key:active {
  transition: none;
  transform: none;
}
```

### 4.2 Per-Click Glitch Easter Egg & Central UI Micro-Foley (`src/ui/tactile.ts`)

Every `.ui-key` and `.ui-switch` press participates in two subtle, centrally delegated behaviors (installed once in `Hud`):

1. **Micro-foley click:** Plays a short, crisp chiptune switch click (`sound.uiClick()` for buttons; `sound.uiSwitch(stopIndex)` for pitched Left/Mid/Right switch detents). Honors `prefs.sound !== 'off'` and `prefs.volume`.
2. **Per-click glitch easter egg (rare & non-strobing):** Roughly **1 in 10 clicks** (with a minimum `1,800 ms` global cooldown, completely off when `reducedMotion()` is true) fires a single `130 ms` one-shot digital artifact on the clicked button—echoing `TitleLogo`'s glitch personality without ever strobing or hurting readability:
   - `glitch-chroma`: brief 1-frame cyan/magenta horizontal split shadow (`-2px 0 #5fd3e0, 2px 0 #ff6ad5`).
   - `glitch-shear`: 1-step `translateX(2px)` off-by-one micro-jolt that snaps straight back.
   - `glitch-invert`: single-frame `filter: invert(1)` Bit-Flip blink (55 ms, never repeated).
   - `glitch-scan`: 1-pass bright `2px` pixel scan bar across the keycap face.

```ts
// src/ui/tactile.ts — single delegated listener mounted once on #app / document.body
import { reducedMotion } from '../looks';
import { sound } from '../audio/sound';

const GLITCH_CLASSES = ['ui-gl-chroma', 'ui-gl-shear', 'ui-gl-invert', 'ui-gl-scan'] as const;
const GLITCH_CHANCE = 0.1;
const GLITCH_COOLDOWN_MS = 1800;

let lastGlitchAt = -Infinity;
let glitchSeq = 0;

export function mountTactileChrome(root: HTMLElement = document.body): () => void {
  const onClick = (ev: MouseEvent) => {
    const target = ev.target instanceof Element ? ev.target.closest<HTMLElement>('.ui-key, .ks-stop, .vol-bar, .bd-edge, .bd-close') : null;
    if (!target || target.matches(':disabled')) return;

    // 1. Micro-foley
    if (target.classList.contains('ks-stop')) {
      sound.uiSwitch(Number(target.dataset.i ?? 1));
    } else if (target.classList.contains('vol-bar')) {
      sound.uiSwitch(Number(target.dataset.lvl ?? 2));
    } else {
      sound.uiClick();
    }

    // 2. Rare non-strobing glitch easter egg on .ui-key buttons
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
```

```css
/* Per-click glitch easter eggs (130ms max, stepped, strictly off under .still) */
.ui-key.ui-gl-chroma { text-shadow: -2px 0 #5fd3e0, 2px 0 #ff6ad5; }
.ui-key.ui-gl-shear { animation: ui-gl-shear 120ms steps(2, end) 1; }
.ui-key.ui-gl-invert { animation: ui-gl-invert 90ms steps(1, end) 1; }
.ui-key.ui-gl-scan::after {
  content: ''; position: absolute; left: 0; right: 0; height: 2px; pointer-events: none;
  background: rgba(255, 255, 255, 0.75); animation: ui-gl-scan 120ms steps(4, end) 1;
}
@keyframes ui-gl-shear { 0% { transform: translateX(2px); } 50% { transform: translateX(-2px); } 100% { transform: none; } }
@keyframes ui-gl-invert { 0%, 60% { filter: invert(1); } 61%, 100% { filter: none; } }
@keyframes ui-gl-scan { 0% { top: 0; } 100% { top: calc(100% - 2px); } }
.still .ui-key:is(.ui-gl-chroma, .ui-gl-shear, .ui-gl-invert, .ui-gl-scan) { animation: none; filter: none; text-shadow: none; }
```

---

## 5. Settings Panel & Status-Displaying Stacked Switches

Replaces `src/ui/prefs-menu.ts`'s 11-radio popover with a compact **Windowed Modal** (Section 6) featuring title + 1-line description rows on the left and physical status-displaying switches / stepped meter on the right.

### 5.1 Control Mapping

| Row | Control Type | Stops (Left → Mid → Right) | Semantic Thumb Tones | Backing Pref (`src/prefs.ts`) |
|---|---|---|---|---|
| **Sound** | 3-state popped-frame switch | `MUTE` · `SFX` · `FULL` | `fault` · `ok` · `amber` | `prefs.sound: 'off' \| 'sfx' \| 'full'` |
| **Volume** | 4-bar stepped hardware meter | `25%` · `50%` · `75%` · `100%` | Lit amber stair-steps (dims to `0.4` opacity when Sound = `MUTE`) | `prefs.volume` (migrate `'low'/'medium'/'high'` → `1..4` or map cleanly to `25/50/75/100%`) |
| **Typo Correction** | 2-state popped-frame switch | `ASK` · `AUTO` | `sys` · `amber` | `prefs.autocorrect: 'confirm' \| 'auto'` |
| **Motion** | 3-state popped-frame switch | `CALM` · `SYS` · `FULL` | `dim` · `sys` · `amber` | `prefs.motion: 'reduced' \| 'system' \| 'full'` |
| **Missed Guesses** | Utility footer row | Count + `COPY` (`.ui-key--secondary`) + `CLEAR` (`.ui-key--quiet`) | Standard keys | `src/game/misses.ts` |
| **Footer Strip** | Reserved slot + Build tag | `Data Export / Sync` (future) + `NULLION vX.Y.Z` | Quiet Silkscreen `9px` | `src/version.ts` |

### 5.2 Popped-Frame Status Switch (HTML + CSS)

The sliding thumb displays the **current status label inside the thumb itself** and pops slightly **up** out of its recessed frame tray (Family C's stacked-frame motif):

```html
<div class="ui-switch" data-stops="3" data-pos="1" role="radiogroup" aria-label="Motion">
  <div class="ks-thumb" data-tone="sys" aria-hidden="true">SYS</div>
  <button type="button" class="ks-stop" role="radio" data-i="0" aria-checked="false">CALM</button>
  <button type="button" class="ks-stop" role="radio" data-i="1" aria-checked="true">SYS</button>
  <button type="button" class="ks-stop" role="radio" data-i="2" aria-checked="false">FULL</button>
</div>
```

```css
.ui-switch {
  position: relative;
  display: inline-grid;
  align-items: stretch;
  height: 32px;
  padding: 3px;
  background: #0d0b14;
  border: 2px solid #000;
  box-shadow: inset 0 0 0 1px var(--rule), 0 3px 0 #000;
  user-select: none;
}
.ui-switch[data-stops='2'] { grid-template-columns: repeat(2, 1fr); width: 132px; }
.ui-switch[data-stops='3'] { grid-template-columns: repeat(3, 1fr); width: 186px; }

.ks-thumb {
  position: absolute;
  top: -2px;
  bottom: 5px;
  left: 3px;
  border: 1px solid #000;
  pointer-events: none;
  display: grid;
  place-items: center;
  font-family: var(--display);
  font-size: 9px;
  letter-spacing: 0.05em;
  z-index: 2;
  box-shadow: 0 2px 0 #000, 0 4px 0 rgba(0, 0, 0, 0.55);
  transition: transform 95ms steps(3), background-color 90ms, color 90ms;
}
.ui-switch[data-stops='2'] .ks-thumb { width: calc((100% - 6px) / 2); }
.ui-switch[data-stops='3'] .ks-thumb { width: calc((100% - 6px) / 3); }
.ui-switch[data-pos='0'] .ks-thumb { transform: translateX(0%); }
.ui-switch[data-pos='1'] .ks-thumb { transform: translateX(100%); }
.ui-switch[data-pos='2'] .ks-thumb { transform: translateX(200%); }

/* Semantic thumb tones */
.ks-thumb[data-tone='amber'] { background: var(--signal); color: #14111a; box-shadow: inset 0 1px 0 #ffe082, 0 2px 0 #000; }
.ks-thumb[data-tone='sys']   { background: #4e699e; color: #f4f7ff; box-shadow: inset 0 1px 0 #8fb7ff, 0 2px 0 #000; }
.ks-thumb[data-tone='ok']    { background: #4bc47a; color: #0e1a12; box-shadow: inset 0 1px 0 #a3f2c0, 0 2px 0 #000; }
.ks-thumb[data-tone='dim']   { background: #3a3448; color: var(--ink); box-shadow: inset 0 1px 0 #625a75, 0 2px 0 #000; }
.ks-thumb[data-tone='fault'] { background: #b83750; color: #ffffff; box-shadow: inset 0 1px 0 #ff8ca0, 0 2px 0 #000; }

.ks-stop {
  position: relative;
  z-index: 1;
  border: 0;
  background: transparent;
  color: rgba(139, 133, 152, 0.65);
  font-family: var(--display);
  font-size: 8.5px;
  cursor: pointer;
  padding: 0;
}
.ks-stop:hover { color: var(--ink); }
.ks-stop[aria-checked='true'] { color: transparent; } /* covered cleanly by the popped thumb */
.still .ks-thumb { transition: none; }
```

### 5.3 4-Bar Stepped Hardware Volume Meter

```html
<div class="ui-vol-meter" role="radiogroup" aria-label="Volume">
  <button type="button" class="vol-bar lit" data-lvl="1" style="height:10px" aria-label="25%"></button>
  <button type="button" class="vol-bar lit" data-lvl="2" style="height:14px" aria-label="50%"></button>
  <button type="button" class="vol-bar lit" data-lvl="3" style="height:18px" aria-label="75%"></button>
  <button type="button" class="vol-bar"     data-lvl="4" style="height:22px" aria-label="100%"></button>
  <span class="vol-pct">75%</span>
</div>
```

```css
.ui-vol-meter {
  display: inline-flex;
  align-items: flex-end;
  gap: 4px;
  padding: 4px 8px;
  background: #0d0b14;
  border: 2px solid #000;
  box-shadow: inset 0 0 0 1px var(--rule), 0 3px 0 #000;
}
.ui-vol-meter.is-muted { opacity: 0.4; }
.vol-bar {
  width: 16px;
  padding: 0;
  border: 1px solid #000;
  background: #1e1a28;
  box-shadow: inset 0 0 0 1px var(--rule);
  cursor: pointer;
  transition: transform 55ms steps(2), background-color 80ms;
}
.vol-bar.lit {
  background: var(--signal);
  box-shadow: inset 0 2px 0 #ffe082, inset 0 -2px 0 #b87600;
}
.vol-bar:hover { transform: translateY(-1px); }
.vol-pct { font-family: var(--display); font-size: 9px; color: var(--ink); min-width: 34px; text-align: right; align-self: center; }
```

---

## 6. Unified Modal Shell (Style 3 · Windowed Dark Titlebar)

All system dialogs (**Settings**, **How to Play**, and future **Achievements**, **User Profile**, **Account**) share one centered, dimmed modal component (`src/ui/modal.ts`). No modal ever floats bare over `.title-foot` or clips at `800px` height.

```html
<div class="ui-modal-backdrop" hidden>
  <section class="ui-modal" role="dialog" aria-modal="true" aria-labelledby="modal-title-settings">
    <header class="ui-modal-bar">
      <h2 class="ui-modal-title" id="modal-title-settings">Settings</h2>
      <button type="button" class="ui-key ui-key--icon ui-modal-close" aria-label="Close">×</button>
    </header>
    <div class="ui-modal-body"><!-- rows / rules / tabs --></div>
  </section>
</div>
```

```css
.ui-modal-backdrop {
  position: fixed;
  inset: 0;
  z-index: 50; /* below Field Manual binder (60), above HUD (1-4) & Notices (30) */
  display: grid;
  place-items: center;
  padding: 16px 16px calc(16px + var(--kb, 0px));
  background: rgba(6, 5, 10, 0.78);
}
.ui-modal-backdrop[hidden] { display: none; }

.ui-modal {
  width: min(480px, calc(calc(100vw / var(--ui, 1)) - 32px));
  max-height: calc(var(--vvh, calc(100dvh / var(--ui, 1))) - 48px);
  display: flex;
  flex-direction: column;
  background: var(--panel-fill);
  border: 2px solid #000;
  /* L2 Double-Frame Stack Shadow */
  box-shadow:
    inset 0 0 0 1px var(--rule),
    0 3px 0 0 #000,
    0 6px 0 0 var(--stack-slice-1),
    0 8px 0 0 #000,
    0 11px 0 0 var(--stack-slice-2),
    0 13px 0 0 #000;
  animation: ui-modal-in 180ms steps(4, end);
}
.ui-modal-bar {
  flex: none;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 9px 14px;
  background: var(--titlebar);
  border-bottom: 2px solid #000;
  box-shadow: inset 0 1px 0 var(--titlebar-hi);
}
.ui-modal-title {
  margin: 0;
  font-family: var(--display);
  font-size: 12px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--signal);
}
.ui-modal-close { width: 28px; height: 26px; margin-bottom: 0; font-size: 12px; }
.ui-modal-body { flex: 1; min-height: 0; overflow-y: auto; overscroll-behavior: contain; padding: 14px 18px 16px; }

@keyframes ui-modal-in {
  from { opacity: 0; transform: translateY(10px) scale(0.96); }
  to { opacity: 1; transform: none; }
}
.still .ui-modal { animation: none; }
```

**Behavioral contract:** Every modal closes on `Escape`, backdrop click, or `×`; saves the triggering element before opening and restores focus on close; never mutates active game timers.

---

## 7. Header Layout, Top-Left Book & Prop-Snap Loop

### 7.1 Spatial Zones (Desktop & Mobile)

```text
Desktop (≥ 481px):
┌────────────────────────────────────────────────────────────────────────────┐
│ [📖²] [🏆*] [👤*]          [ · · · · · · · ]        [16 stack frames][?][⚙]│
│  ↑ Top-Left Player Dock     ↑ Center Progress         ↑ Top-Right System   │
│                                                              [RHS STACK]   │
└────────────────────────────────────────────────────────────────────────────┘
(* Trophy & Profile are reserved future slots; Book is live in Pass 2.)

Phone (≤ 480px):
┌────────────────────────────────────┐
│ [📖²]        [16 stack frames][?][⚙]│  ← Row 1 (compact, zero collision at 360px)
│         [ · · · · · · · ]          │  ← Row 2 (centered slots / hearts)
│                                [■] │  ← Slim icon-only RHS stack spine
└────────────────────────────────────┘
```

- **Retired from Header:** `.meta` (green LED + `#puzzle` chip) and standalone `.sound-btn` (Mute chip). Puzzle number continues to live on the End Card (`nullion #n`) and Share text; Mute lives inside Settings (`Sound: MUTE | SFX | FULL`).
- **Title Screen cleanup:** Because the Standalone Book is always visible top-left, remove the duplicate `Field Manual` button from `.title-foot`. Title Screen stays focused on: Tagline → `UNWIND THE STACK ▾` → `How to play` → quiet build tag. The End Card keeps its rich Field Manual summary bar (fixed VT323 subtext!) so players discover what they logged after finishing.
- **`?` Help Key:** Placed next to `⚙` on the top-right using `.ui-key--icon`, opening the unified How-to-Play modal at any point during play (players can check tier names/frame counts mid-run without losing their spot).

### 7.2 Standalone Pixel Binder/Book Icon (`src/ui/manual-icon.ts`)

Distinct from square `.ui-key--icon` buttons: reads literally as a small slate-and-bond physical binder sitting in top-left, with an amber unread counter badge and crimson bookmark ribbon.

```html
<button type="button" class="hud-book float" data-el="hudBook" aria-label="Field Manual">
  <svg viewBox="0 0 14 14" width="32" height="32" shape-rendering="crispEdges" aria-hidden="true">
    <path fill="#0d0b12" d="M2 1h10v1h1v10h-1v1H2v-1H1V2h1z"/>
    <path fill="#2e3541" d="M2 2h3v10H2z"/>
    <path fill="#5d6b80" d="M3 3h1v8H3z"/>
    <path fill="#3f4a5c" d="M5 2h7v9H5z"/>
    <path fill="#f1f0ec" d="M5 10h7v2H5z"/>
    <path fill="#ffb000" d="M6 4h5v3H6z"/>
    <path fill="#131118" d="M7 5h3v1H7z"/>
    <path fill="#b3322b" d="M9 11h2v3H9z"/>
  </svg>
  <span class="hud-book-badge" data-el="hudBookBadge" hidden></span>
</button>
```

```css
.hud-book {
  position: relative;
  display: inline-grid;
  place-items: center;
  width: 38px;
  height: 36px;
  padding: 0;
  background: transparent;
  border: 0;
  cursor: pointer;
  pointer-events: auto;
  filter: drop-shadow(0 3px 0 #000);
  transition: transform 65ms steps(2), filter 65ms steps(2);
}
.hud-book:hover { transform: translateY(-2px) rotate(-3deg); filter: drop-shadow(0 5px 0 #000); }
.hud-book:active { transform: translateY(2px); filter: drop-shadow(0 1px 0 #000); }
.hud-book.is-catching { animation: hud-book-catch 340ms steps(4); }
@keyframes hud-book-catch {
  0%   { transform: scale(1); }
  35%  { transform: scale(1.22) rotate(-6deg); }
  70%  { transform: scale(0.92) rotate(3deg); }
  100% { transform: none; }
}
.hud-book-badge {
  position: absolute;
  top: -2px;
  right: -4px;
  min-width: 15px;
  height: 15px;
  padding: 0 3px;
  display: grid;
  place-items: center;
  font-family: var(--display);
  font-size: 8px;
  color: #14111a;
  background: var(--signal);
  border: 1px solid #000;
  box-shadow: 0 0 6px rgba(255, 176, 0, 0.7);
}
.hud-book-badge[hidden] { display: none; }
```

### 7.3 Smart-Context Prop-Snap Behavior

`Scene.snapProp` replaces its hardcoded `(6, 6)` target with the live screen-pixel center of `[data-el="hudBook"]` (converted to scene coordinates). When the photo lands:

```ts
// Smart-context catch rule (in Hud / Scene wiring):
function onPropSnapshotLanded(entryId: string) {
  hudBook.classList.remove('is-catching');
  void hudBook.offsetWidth;
  hudBook.classList.add('is-catching');

  const phase = game?.phase.kind;
  const timerActive = phase === 'reading' || phase === 'answering';
  // Never interrupt an active watchdog clock; when exploring (stowed Reveal, End Card, Title, Scroll),
  // swing the book open straight to the newly logged entry and play the wet-stamp thunk!
  if (!timerActive) {
    hud.openManual(entryId);
  }
}
```

---

## 8. Typography Ownership Contract

Strictly enforce 5 font lanes across the entire codebase and remove the stray undefined `--mono` fallback:

| Font | Token / Source | Strictly Owns | Rules & Fixes |
|---|---|---|---|
| **7×9 Pixel Wordmark** | `src/ui/wordmark.ts` | `nullion`, `#n`, `ENDLESS`, `ONE IN A / nullion` | Brand & climax moments only. |
| **5×7 Bitmap SVG** | `watermark.ts` → `layer-stack.ts`, `binder.ts` | RHS stack layer names, Binder HABITAT chips | Short uppercase labels only; never prose. |
| **Silkscreen** | `--display` | Buttons (`.ui-key`), switch thumbs, modal/section titles, tier names, reveal title, `.build-tag` | **Fix:** Never apply via global `button {}`; fixes `.fm-end-sub` leaking uppercase Silkscreen. Switch `.build-tag` from broken `var(--mono, monospace)` to `Silkscreen 9px`. |
| **VT323** | `--body` | Prompts, inputs, feedback, rules, Settings descriptions, stats, tooltips, `.fm-end-sub` | **Readability floor:** `≥ 17px` for all body/tooltip copy (`VT323` has a small x-height; bump `.slot-x` from `13px` to `17px`). |
| **Termes / Courier / Caveat** | `src/ui/binder/binder.css` | Field Manual Binder interior only | Never import or reference outside `.bd-backdrop`. |

---

## 9. Surface-Specific Contracts & Bug Fixes

### 9.1 End Card (`src/ui/end-card.ts`)
- **Decouple from `data-form`:** Either render `.result` outside `.console[data-form]` or guard every form selector with `.console:not(:has(.result:not([hidden])))[data-form='...']` (cleaner: add `.has-result` class on `.console` or mount `.end-card-panel` as its own Debugger Chrome panel).
- **Delete all 17 `.console[data-form='gui']` End Card override rules** (`src/style.css:568-584`).
- **Stack shadows on the End Card:**
  - End Card outer panel: **L2 Double-Frame Stack** (`0 3px 0 #000, 0 6px 0 var(--stack-slice-1), 0 8px 0 #000`).
  - `SHARE RESULT`: full-width **L3 `.ui-key--primary`**.
  - `ENTER ENDLESS ▾`: full-width **L4 `.ui-key--endless`** (exaggerated 3-slice plunging emerald stack!).
  - `Field Manual` card button: `.ui-key--secondary`-based full-width card with crisp VT323 `18px` `.fm-end-sub` (fixing the Silkscreen cascade bug).
  - `HIDE ▾` & `+N more`: **L1 `.ui-key--quiet`**.

### 9.2 Notice Toast Bar (`src/style.css:1129`)
- Upgrade to full Debugger Chrome bezel + **L1 stack shadow** + `.ui-key--icon` close button.
- Position cleanly so it never overlaps the End Card wordmark: dock at bottom-above-console (`bottom: calc(16px + var(--kb, 0px))` during Title/End Card clearance or `top: 56px` while ensuring End Card opens at `top ≥ 64px` with `z-index: 30` and auto-clears transient info notices when opening End Card).

### 9.3 Prompt Console Low-Time Alarm (`BIOS` / `Hyper` / `Raw`)
Today `.console[data-form='bios']`'s 5-layer `box-shadow` overrides `.console.low`'s pulsing red border. Use an outer `outline` (which never collides with `box-shadow`!):

```css
.console.low {
  outline: 2px solid var(--fault);
  outline-offset: 2px;
  animation: alarm-ring 900ms ease-in-out infinite, bob 7s ease-in-out infinite;
}
@keyframes alarm-ring {
  50% { outline-color: transparent; }
}
```

### 9.4 Endless HUD: Specular Pixel Hearts & Stacked Pager (`src/ui/hud.ts`)
Replace Unicode `♥ / ♡` text with crisp **9×8 Specular Pixel Hearts** (matching `docs/art-style.md`'s 1px dark outline + top-left highlight), and replace the native `<select class="history-page">` with compact `.ui-key--quiet` prev/next pager buttons (`◀ 1–14`, `15–28 ▶`):

```ts
// 9×8 Specular Pixel Heart SVG (alive vs empty dark socket)
export function pixelHeartSvg(alive: boolean): SVGSVGElement {
  const ns = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(ns, 'svg');
  svg.setAttribute('viewBox', '0 0 9 8');
  svg.setAttribute('width', '18');
  svg.setAttribute('height', '16');
  svg.setAttribute('shape-rendering', 'crispEdges');
  svg.setAttribute('aria-hidden', 'true');
  svg.innerHTML = alive
    ? '<path fill="#000" d="M1 0h3v1h1V0h3v1h1v3H8v1H7v1H6v1H5v1H4V7H3V6H2V5H1V4H0V1h1z"/>' +
      '<path fill="#ff4d6d" d="M1 1h3v1h1V1h3v3H7v1H6v1H5v1H4V6H3V5H2V4H1z"/>' +
      '<path fill="#ffccd5" d="M2 2h1v1H2z"/>' +
      '<path fill="#c9184a" d="M7 3h1v1H7zM6 4h1v1H6zM5 5h1v1H5z"/>'
    : '<path fill="#000" d="M1 0h3v1h1V0h3v1h1v3H8v1H7v1H6v1H5v1H4V7H3V6H2V5H1V4H0V1h1z"/>' +
      '<path fill="#2c2838" d="M1 1h3v1h1V1h3v3H7v1H6v1H5v1H4V6H3V5H2V4H1z"/>' +
      '<path fill="#544e66" d="M1 1h3v1H2v2H1z"/>';
  return svg;
}
```

### 9.5 Unified Debugger Chrome Tooltips
`.slot-x`, `.ls-tip`, and `.te-nav-tip` share one recipe:
- `background: rgba(14, 12, 20, 0.97)`
- `border: 2px solid #000`
- `box-shadow: inset 0 0 0 1px var(--tip-accent, var(--rule)), 0 2px 0 #000, 0 4px 0 var(--stack-slice-2), 0 6px 0 #000`
- Body font: `VT323 17px`, optional kicker: `Silkscreen 9px`.
- Binder tooltips (`.bd-hab-pop`, `.bd-idx-pop`) remain in the Binder's own material world.

### 9.6 Field Manual Binder Chrome Polish (`src/ui/binder/binder.css`)
Keep bond, toner, slate, stamp red, and blue pencil untouched. Add stepped downward press travel (`:active { transform: translateY(2px); }`) and a crisp 1-slice slate stack shadow on `.bd-prev`, `.bd-next`, and `.bd-close` so flipping pages feels as physical as pressing HUD keys.

---

## 10. Future Extension Slots (Long-Term Scalability)

Everything pinned in `CLAUDE.md` plugs cleanly into this architecture without inventing new styles:

| Future Feature | Attachment Point | UI Pattern | Signature Animation |
|---|---|---|---|
| **Achievements & Revives** | Top-left dock slot 2 (`.ui-key--icon`, pixel trophy) | Windowed Modal (`.ui-modal`), tabbed grid + progress bars | Unread amber pip on trophy key; unlocked toast via `.notice` |
| **User Profile & Past Runs** | Top-left dock slot 3 (`.ui-key--icon`, pixel silhouette) | Windowed Modal (`.ui-modal`), lifetime stats + tape rack of past Endless end cards | Finished Endless run shrinks into a **pixel tape cartridge** and flies into the Profile icon (same trajectory pattern as Book prop-snaps!) |
| **Account / JSON Export / Sync** | Bottom section of **Settings** modal + Profile badge | `.ui-key--secondary` buttons + `.ui-switch` sync toggle | Zero new chrome styles needed |
| **True Endless Fast-Dive (Landauer)** | Start of Endless (for achievement holders) | **L4 Exaggerated Hero Key** with rainbow stacked frame slices (`--t-npe`, `--t-leak`, `--t-race`, `--t-heisenbug`, `--t-bitflip`) | Compresses flat & blasts straight to 2,500 frames |

---

## 11. 3-Pass Implementation Roadmap & Disposition Receipt

### Pass 1 — Core Primitives, Modal Shell, End Card Decouple & Bug Fixes
- Add stack-shadow tokens, `.ui-key` (Family C: `--primary`, `--secondary`, `--quiet`, `--icon`, `--endless`), and `.ui-modal` to `src/style.css` + `src/ui/modal.ts`.
- Add `src/ui/tactile.ts` (delegated micro-foley + ~10% per-click glitch easter egg) and `sound.uiClick()` / `sound.uiSwitch()` in `src/audio/sound.ts`.
- Decouple End Card from `data-form` (delete 17 GUI overrides); migrate `title-start`, `rv-next`, `share-big`, `endless-go`, `endless-back`, `rv-hide`/`eod-hide`, `rv-show`/`eod-show`, `sheet-more`, `fm-end-btn` to `.ui-key`.
- Migrate `How to play` to the windowed `.ui-modal`.
- Fix `.fm-end-sub` font cascade, `.build-tag` Silkscreen font, `.notice` stack bezel + clearance, BIOS low-time `outline` alarm, unified tooltips (`.slot-x` ≥ `17px`), and Binder `◀ ▶ ×` press travel.

### Pass 2 — Header Reorg, Top-Left Standalone Book & Smart-Context Prop Snap
- Remove `.meta` (LED + `#puzzle`) and standalone `.sound-btn` from `.bar-left`; remove duplicate `Field Manual` button from `.title-foot`.
- Mount Standalone Pixel Binder/Book (`.hud-book`) in `.bar-left` with unread badge; reserve CSS flex gap for future Trophy & Profile keys.
- Move Settings `⚙` to `.bar-right` beside `N stack frames`, and add `?` Help key beside `⚙`.
- Wire `Scene.snapProp` to fly directly to `[data-el="hudBook"]`'s live rect, trigger `.is-catching`, and implement Smart-Context auto-open (catch quietly during active timer; open & flip when idle/stowed/End Card).
- Verify `360px` / `390px` mobile header fit and `layerStack.setTopOffset`.

### Pass 3 — Tactile Settings Modal & Endless HUD Polish
- Rebuild `src/ui/prefs-menu.ts` inside `.ui-modal` with Family C popped-frame status switches (`Sound: MUTE|SFX|FULL`, `Typo: ASK|AUTO`, `Motion: CALM|SYS|FULL`), the 4-bar stepped hardware Volume meter, and compact `Missed Guesses` (`COPY` / `CLEAR`).
- Replace Endless Unicode hearts with 9×8 Specular Pixel Hearts (`pixelHeartSvg`) and replace `.history-page` native `<select>` with `.ui-key--quiet` prev/next pager controls.

### Complete 9-Item Tracked-Batch Disposition Receipt

| ID | Disposition | Spec Section | Pass |
|---|---|---|---|
| `UI-01` | Retire top-left LED & `#puzzle` chip | §7.1 | Pass 2 |
| `UI-02` | Fold standalone Mute chip into Settings | §5.1, §7.1 | Pass 2–3 |
| `UI-03` | Persistent top-left Standalone Book + Smart-Context snapshot target | §7.2, §7.3 | Pass 2 |
| `UI-05` | Move Settings `⚙` (+ `?` Help) to top-right corner | §7.1 | Pass 2 |
| `UI-06` | Rework Settings with status-displaying popped-frame switches & 4-bar volume meter | §5.1–§5.3 | Pass 3 |
| `UI-08` | Unify Settings & How-to-Play on Windowed Dark Titlebar modal shell | §6 | Pass 1 |
| `UI-12` | Decouple End Card from Console `data-form` (pure dark Debugger Chrome) | §1, §9.1 | Pass 1 |
| `UI-14` | Fix `.fm-end-sub`, `.build-tag`, `.notice` bezel/clearance, BIOS low-time alarm | §8, §9.1–§9.3 | Pass 1 |
| `UI-16` | Specular Pixel Hearts & stacked-frame history pager in Endless HUD | §9.4 | Pass 3 |

---

## 12. Verification Guardrails (for Implementation)

- `src/ui/hud.test.ts` & `src/ui/end-card.test.ts`: assert End Card renders identically regardless of landing layer (`gui` / `bios` / `raw`); assert Settings modal opens/closes via `⚙`, `Escape`, and backdrop click, and updates `prefs` via the status switches; assert Smart-Context prop snap never opens the binder while `phase.kind === 'answering'`.
- Reduced motion (`.still`): assert zero keycap translate animations, zero click-glitch animations, instant modal/switch state updates.
- Visual check across `1280×800`, `2560×1440` (`--ui` zoom), and `390×844` / `360×740` phones before marking any pass done.
