import { reducedMotion } from '../looks';
import type { Scene } from '../render/scene';
import { renderGlitchLine } from './dom';

export type TableCheckAnim = 'squint' | 'ledger' | 'wiretap';
export type TableCheckOutcome = 'accept' | 'reject';

export interface TableCheckOpts {
  outcome: TableCheckOutcome;
  anim: TableCheckAnim;
  checkLine: string;
  verdictLine: string;
  guess?: string;
  onDone?: () => void;
}

const NS = 'http://www.w3.org/2000/svg';

function hourglassSvg(): SVGSVGElement {
  const svg = document.createElementNS(NS, 'svg');
  svg.setAttribute('viewBox', '0 0 9 11');
  svg.setAttribute('width', '18');
  svg.setAttribute('height', '22');
  svg.setAttribute('shape-rendering', 'crispEdges');
  svg.setAttribute('aria-hidden', 'true');
  svg.classList.add('tc-hourglass');
  svg.innerHTML =
    '<path fill="#000" d="M0 0h9v2H8v2H7v1H6v1h1v1h1v2h1v2H0V9h1V7h1V6h1V5H2V4H1V2H0z"/>' +
    '<path fill="#ffcf5a" d="M1 1h7v1H1zm0 8h7v1H1z"/>' +
    '<path fill="#ebe6d6" d="M2 2h5v1H6v1H5v1H4V4H3V3H2zm2 4h1v1h1v1h1v1H2V8h1V7h1z"/>' +
    '<path fill="#ffb000" d="M3 3h3v1H5v1H4V4H3zm1 4h1v1h1v1H3V8h1z"/>';
  return svg;
}

/**
 * High-fidelity 48×48 pixel-art character (rendered at 144×144px, 3× integer scale).
 * Articulated into independent SVG groups (antennas, CRT head, eyelids, pupils, scanline,
 * torso/stack-meter, cable tail, left/right arms, left/right legs, dust puffs, and variant prop)
 * so CSS can choreograph scampering in, squinting at the viewer/screen, inspecting, reacting,
 * and scampering off.
 */
function characterSvg(anim: TableCheckAnim): SVGSVGElement {
  const svg = document.createElementNS(NS, 'svg');
  svg.setAttribute('viewBox', '0 0 48 48');
  svg.setAttribute('width', '144');
  svg.setAttribute('height', '144');
  svg.setAttribute('shape-rendering', 'crispEdges');
  svg.setAttribute('aria-hidden', 'true');
  svg.classList.add('tc-char');

  const prop =
    anim === 'ledger'
      ? `<g class="tc-prop tc-prop-ledger">
          <rect x="29" y="25" width="16" height="13" fill="#000"/>
          <rect x="30" y="26" width="14" height="11" fill="#3a2f52"/>
          <rect x="31" y="27" width="6" height="9" fill="#ebe6d6"/>
          <rect x="38" y="27" width="5" height="9" fill="#dcd6c4"/>
          <rect x="37" y="27" width="1" height="9" fill="#594d75"/>
          <rect class="tc-page-line" x="32" y="29" width="4" height="1" fill="#4f4861"/>
          <rect class="tc-page-line" x="32" y="31" width="3" height="1" fill="#8fb7ff"/>
          <rect class="tc-page-line" x="32" y="33" width="4" height="1" fill="#4f4861"/>
          <rect class="tc-page-line" x="39" y="29" width="3" height="1" fill="#4f4861"/>
          <rect class="tc-page-line" x="39" y="31" width="3" height="1" fill="#ffb000"/>
          <rect class="tc-page-line" x="39" y="33" width="2" height="1" fill="#4f4861"/>
        </g>`
      : anim === 'wiretap'
        ? `<g class="tc-prop tc-prop-wiretap">
            <rect x="32" y="30" width="3" height="2" fill="#000"/>
            <rect x="34" y="29" width="3" height="2" fill="#5fd3e0"/>
            <rect x="36" y="22" width="4" height="9" fill="#000"/>
            <rect x="37" y="23" width="2" height="7" fill="#4f4861"/>
            <rect x="37" y="24" width="2" height="2" fill="#ffb000"/>
            <rect x="37" y="17" width="2" height="5" fill="#000"/>
            <rect x="38" y="16" width="1" height="6" fill="#ebe6d6"/>
            <rect class="tc-spark-tip" x="37" y="14" width="3" height="2" fill="#5fd3e0"/>
            <rect class="tc-spark-tip" x="38" y="13" width="1" height="4" fill="#d8ffe4"/>
          </g>`
        : `<g class="tc-prop tc-prop-loupe">
            <rect x="33" y="22" width="7" height="7" fill="#000"/>
            <rect x="34" y="23" width="5" height="5" fill="#ffb000"/>
            <rect x="35" y="24" width="3" height="3" fill="#5fd3e0"/>
            <rect x="35" y="24" width="1" height="1" fill="#ffffff"/>
            <rect x="32" y="28" width="2" height="4" fill="#000"/>
            <rect x="32" y="28" width="1" height="3" fill="#8b8598"/>
          </g>`;

  svg.innerHTML = `
    <!-- Ground shadow -->
    <g class="tc-shadow">
      <rect x="14" y="45" width="20" height="2" fill="rgba(0,0,0,0.65)"/>
      <rect x="17" y="44" width="14" height="1" fill="rgba(0,0,0,0.45)"/>
    </g>

    <!-- Scamper dust puffs -->
    <g class="tc-dust">
      <rect x="4" y="42" width="3" height="2" fill="#8b8598"/>
      <rect x="2" y="40" width="2" height="2" fill="#cfcbd8"/>
      <rect x="8" y="43" width="2" height="2" fill="#544e66"/>
    </g>

    <!-- Articulated rear data-cable tail -->
    <g class="tc-tail">
      <rect x="9" y="34" width="5" height="2" fill="#000"/>
      <rect x="10" y="34" width="4" height="1" fill="#4f4861"/>
      <rect x="6" y="32" width="4" height="3" fill="#000"/>
      <rect x="7" y="33" width="2" height="1" fill="#8b8598"/>
      <rect x="4" y="30" width="3" height="3" fill="#000"/>
      <rect x="5" y="31" width="1" height="1" fill="#ffb000"/>
    </g>

    <!-- Articulated legs -->
    <g class="tc-leg tc-leg-l">
      <rect x="16" y="36" width="5" height="7" fill="#000"/>
      <rect x="17" y="36" width="3" height="6" fill="#4f4861"/>
      <rect x="18" y="38" width="1" height="1" fill="#8b8598"/>
      <rect x="15" y="42" width="7" height="4" fill="#000"/>
      <rect x="16" y="43" width="5" height="2" fill="#2a2538"/>
      <rect x="16" y="43" width="2" height="1" fill="#ffb000"/>
    </g>
    <g class="tc-leg tc-leg-r">
      <rect x="27" y="36" width="5" height="7" fill="#000"/>
      <rect x="28" y="36" width="3" height="6" fill="#4f4861"/>
      <rect x="29" y="38" width="1" height="1" fill="#8b8598"/>
      <rect x="26" y="42" width="7" height="4" fill="#000"/>
      <rect x="27" y="43" width="5" height="2" fill="#2a2538"/>
      <rect x="30" y="43" width="2" height="1" fill="#ffb000"/>
    </g>

    <!-- Upper body assembly (bobs during run, leans forward during squint) -->
    <g class="tc-upper">
      <!-- Left arm -->
      <g class="tc-arm tc-arm-l">
        <rect x="9" y="27" width="6" height="8" fill="#000"/>
        <rect x="10" y="28" width="4" height="6" fill="#39334a"/>
        <rect x="11" y="29" width="2" height="2" fill="#544e66"/>
        <rect x="10" y="33" width="3" height="2" fill="#ebe6d6"/>
      </g>

      <!-- Torso / Archivist waistcoat + live stack-layer chest gauge -->
      <g class="tc-torso">
        <rect x="14" y="26" width="20" height="12" fill="#000"/>
        <rect x="15" y="27" width="18" height="10" fill="#2a2538"/>
        <rect x="15" y="27" width="18" height="1" fill="#4f4861"/>
        <!-- Collar & brass pin -->
        <rect x="19" y="27" width="10" height="2" fill="#181522"/>
        <rect x="23" y="28" width="2" height="1" fill="#ffb000"/>
        <!-- Chest stack-meter window -->
        <rect x="18" y="30" width="12" height="6" fill="#0b0a12"/>
        <rect class="tc-bar tc-bar-1" x="19" y="31" width="10" height="1" fill="#8fb7ff"/>
        <rect class="tc-bar tc-bar-2" x="19" y="32" width="8" height="1" fill="#7ee0a1"/>
        <rect class="tc-bar tc-bar-3" x="19" y="33" width="10" height="1" fill="#ffb000"/>
        <rect class="tc-bar tc-bar-4" x="19" y="34" width="6" height="1" fill="#ff6ad5"/>
      </g>

      <!-- Right arm -->
      <g class="tc-arm tc-arm-r">
        <rect x="33" y="27" width="6" height="8" fill="#000"/>
        <rect x="34" y="28" width="4" height="6" fill="#39334a"/>
        <rect x="35" y="29" width="2" height="2" fill="#544e66"/>
        <rect x="35" y="33" width="3" height="2" fill="#ebe6d6"/>
      </g>

      <!-- High-res CRT Archivist Head -->
      <g class="tc-head">
        <!-- Dual rabbit-ear antennas -->
        <g class="tc-ant tc-ant-l">
          <rect x="14" y="2" width="2" height="4" fill="#000"/>
          <rect x="16" y="4" width="2" height="4" fill="#000"/>
          <rect x="15" y="3" width="1" height="2" fill="#8b8598"/>
          <rect x="17" y="5" width="1" height="3" fill="#8b8598"/>
          <rect class="tc-ant-tip" x="13" y="1" width="3" height="2" fill="#ffb000"/>
        </g>
        <g class="tc-ant tc-ant-r">
          <rect x="32" y="2" width="2" height="4" fill="#000"/>
          <rect x="30" y="4" width="2" height="4" fill="#000"/>
          <rect x="32" y="3" width="1" height="2" fill="#8b8598"/>
          <rect x="30" y="5" width="1" height="3" fill="#8b8598"/>
          <rect class="tc-ant-tip" x="32" y="1" width="3" height="2" fill="#5fd3e0"/>
        </g>

        <!-- Outer CRT casing & beveled highlights -->
        <rect x="10" y="7" width="28" height="20" fill="#000"/>
        <rect x="11" y="8" width="26" height="18" fill="#39334a"/>
        <rect x="11" y="8" width="26" height="2" fill="#544e66"/>
        <rect x="11" y="24" width="26" height="2" fill="#242030"/>
        <!-- Top cooling vents -->
        <rect x="15" y="8" width="2" height="1" fill="#181522"/>
        <rect x="19" y="8" width="2" height="1" fill="#181522"/>
        <rect x="23" y="8" width="2" height="1" fill="#181522"/>
        <rect x="27" y="8" width="2" height="1" fill="#181522"/>
        <rect x="31" y="8" width="2" height="1" fill="#181522"/>
        <!-- Right-side rotary dial + status LED -->
        <rect x="38" y="13" width="2" height="5" fill="#000"/>
        <rect x="38" y="14" width="1" height="3" fill="#8b8598"/>
        <rect class="tc-led" x="33" y="24" width="2" height="1" fill="#ffb000"/>
        <rect x="13" y="24" width="6" height="1" fill="#181522"/>

        <!-- Recessed CRT Glass Screen -->
        <rect x="13" y="10" width="22" height="13" fill="#000"/>
        <rect x="14" y="11" width="20" height="11" fill="#0b0a12"/>
        <!-- Subtle corner glass highlight -->
        <rect x="15" y="12" width="2" height="1" fill="#2a2840"/>
        <rect x="15" y="13" width="1" height="1" fill="#2a2840"/>

        <!-- Expressive phosphor eyes -->
        <g class="tc-eyes">
          <!-- Left eye -->
          <rect class="tc-eye-bg" x="16" y="13" width="6" height="6" fill="#5fd3e0"/>
          <rect class="tc-pupil" x="18" y="15" width="2" height="3" fill="#0b0a12"/>
          <rect class="tc-glint" x="17" y="14" width="1" height="1" fill="#ffffff"/>
          <!-- Right eye -->
          <rect class="tc-eye-bg" x="26" y="13" width="6" height="6" fill="#5fd3e0"/>
          <rect class="tc-pupil" x="28" y="15" width="2" height="3" fill="#0b0a12"/>
          <rect class="tc-glint" x="27" y="14" width="1" height="1" fill="#ffffff"/>
        </g>

        <!-- Animated upper & lower eyelids (narrow into sharp fourth-wall squint!) -->
        <g class="tc-lid-top">
          <rect x="15" y="11" width="18" height="2" fill="#0b0a12"/>
          <rect class="tc-brow" x="16" y="13" width="6" height="1" fill="#0b0a12"/>
          <rect class="tc-brow" x="26" y="13" width="6" height="1" fill="#0b0a12"/>
        </g>
        <g class="tc-lid-bot">
          <rect x="15" y="20" width="18" height="2" fill="#0b0a12"/>
          <rect x="16" y="19" width="6" height="1" fill="#0b0a12"/>
          <rect x="26" y="19" width="6" height="1" fill="#0b0a12"/>
        </g>

        <!-- Moving CRT scanline + squint glass glint -->
        <rect class="tc-scan" x="14" y="11" width="20" height="1" fill="#d8ffe4" opacity="0.35"/>
        <rect class="tc-glass-flash" x="14" y="11" width="4" height="11" fill="#ffffff" opacity="0"/>
      </g>

      ${prop}
    </g>`;
  return svg;
}

/**
 * Rare "Hold on, let me re-read the table" sequence:
 * 1. High-fidelity character scampers in from the side of the screen while dimming the scene
 *    (matching the reveal's ordered-dither vignette with lighter pixelation + bullet-time).
 * 2. Stops center-stage, leans forward, and squints directly at the user / screen.
 * 3. Pops open the mini-console underneath, typing out the checking quip with a `▌` cursor
 *    and spinning WOMM hourglass, then delivers the accept/reject verdict.
 * 4. Dismisses the console and scampers off the far side of the screen.
 */
export class TableCheck {
  private readonly root: HTMLElement;
  private readonly actor: HTMLElement;
  private readonly card: HTMLElement;
  private readonly line: HTMLElement;
  private readonly guessEl: HTMLElement;
  private readonly badge: HTMLElement;
  private timers: number[] = [];
  private cancelGlitch: (() => void) | undefined;
  private active = false;

  constructor(
    mount: HTMLElement,
    private readonly getScene: () => Scene | undefined,
  ) {
    const wrap = document.createElement('div');
    wrap.className = 'tc-backdrop';
    wrap.hidden = true;
    wrap.innerHTML = `
      <div class="tc-stage-wrap">
        <div class="tc-actor" data-tc="actor"></div>
        <div class="tc-card panel" data-tc="card" role="status" aria-live="polite" hidden>
          <div class="tc-top">
            <div class="tc-guess" data-tc="guess"></div>
            <span class="tc-badge" data-tc="badge" hidden></span>
          </div>
          <div class="tc-row">
            <span class="tc-hg" data-tc="hg"></span>
            <div class="tc-line" data-tc="line"></div>
          </div>
        </div>
      </div>`;
    mount.append(wrap);
    this.root = wrap;
    this.actor = wrap.querySelector('[data-tc="actor"]')!;
    this.card = wrap.querySelector('[data-tc="card"]')!;
    this.line = wrap.querySelector('[data-tc="line"]')!;
    this.guessEl = wrap.querySelector('[data-tc="guess"]')!;
    this.badge = wrap.querySelector('[data-tc="badge"]')!;
    wrap.querySelector('[data-tc="hg"]')!.append(hourglassSvg());
  }

  get isOpen(): boolean {
    return this.active;
  }

  run(opts: TableCheckOpts) {
    this.close();
    this.active = true;
    const still = reducedMotion();
    const scene = this.getScene();

    this.root.hidden = false;
    this.root.dataset.anim = opts.anim;
    this.root.dataset.stage = still ? 'checking' : 'enter';
    delete this.root.dataset.outcome;
    this.card.hidden = !still;
    this.badge.hidden = true;
    this.guessEl.textContent = opts.guess ? `> ${opts.guess}` : '> lookup';
    this.line.textContent = '';
    this.actor.replaceChildren(characterSvg(opts.anim));

    const later = (ms: number, fn: () => void) => this.timers.push(window.setTimeout(fn, ms));
    const typeOut = (template: string, onTyped?: () => void) => {
      this.cancelGlitch?.();
      this.cancelGlitch = undefined;
      const plain = template.replace(/\{gl:([^|{}]*)\|([^{}]*)\}/g, '$1');
      if (still) {
        this.line.textContent = plain;
        onTyped?.();
        return;
      }
      let k = 0;
      const stepMs = 24;
      const tick = () => {
        k++;
        if (k < plain.length) {
          const cur = document.createElement('span');
          cur.className = 'tc-cursor';
          cur.textContent = '▌';
          this.line.replaceChildren(plain.slice(0, k), cur);
          later(stepMs, tick);
        } else {
          this.cancelGlitch = renderGlitchLine(this.line, template, { force: true, reduced: false });
          onTyped?.();
        }
      };
      tick();
    };

    if (still) {
      scene?.setVignette(true, { maxBlock: 2 });
      typeOut(opts.checkLine);
      later(850, () => {
        this.root.dataset.stage = 'verdict';
        this.root.dataset.outcome = opts.outcome;
        this.badge.textContent = opts.outcome === 'accept' ? 'OK' : '?';
        this.badge.hidden = false;
        typeOut(opts.verdictLine);
      });
      later(1600, () => {
        this.close();
        opts.onDone?.();
      });
      return;
    }

    // 1. Scamper in from the right edge; as it runs out into view, dim the screen (like answering,
    //    with lighter pixelation) and slow background time.
    later(120, () => {
      scene?.setVignette(true, { maxBlock: 2 });
      scene?.setTimeScale(0.12);
    });

    // 2. Plant feet & squint directly at the user / screen (fourth-wall break).
    later(540, () => {
      this.root.dataset.stage = 'squint';
    });

    // 3. Pop open the mini-console and type out the checking quip with the ▌ cursor.
    later(1220, () => {
      this.root.dataset.stage = 'checking';
      this.card.hidden = false;
      typeOut(opts.checkLine);
    });

    // 4. Deliver accept / reject verdict + character reaction.
    later(2950, () => {
      this.root.dataset.stage = 'verdict';
      this.root.dataset.outcome = opts.outcome;
      this.badge.textContent = opts.outcome === 'accept' ? 'OK' : '?';
      this.badge.hidden = false;
      typeOut(opts.verdictLine);
    });

    // 5. Fold console away, restore screen dim/time, and scamper off the far side.
    later(4350, () => {
      this.root.dataset.stage = 'exit';
      this.card.hidden = true;
      scene?.setVignette(false);
      scene?.setTimeScale(1);
    });

    later(4950, () => {
      this.close();
      opts.onDone?.();
    });
  }

  close() {
    for (const t of this.timers) clearTimeout(t);
    this.timers = [];
    this.cancelGlitch?.();
    this.cancelGlitch = undefined;
    if (this.active) {
      this.active = false;
      const scene = this.getScene();
      scene?.setVignette(false);
      scene?.setTimeScale(1);
    }
    this.root.hidden = true;
  }
}
