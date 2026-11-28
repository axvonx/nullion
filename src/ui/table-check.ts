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
  svg.setAttribute('width', '20');
  svg.setAttribute('height', '24');
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
 * Dottybase — high-fidelity 48×48 pixel-art character (rendered at 144×144px, 3× integer scale).
 * Extended arms and legs give bold, cartoony silhouettes across both her side-profile skipping pose
 * (`.tc-pose-side`, with multi-color CRT phosphor spill and no eyes visible) and her head-on pose
 * (`.tc-pose-front`, with spring-out eyeballs, fourth-wall squint, props, and verdict reactions).
 */
function dottybaseSvg(anim: TableCheckAnim): SVGSVGElement {
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
          <rect x="29" y="24" width="17" height="14" fill="#000"/>
          <rect x="30" y="25" width="15" height="12" fill="#3a2f52"/>
          <rect x="31" y="26" width="6" height="10" fill="#ebe6d6"/>
          <rect x="38" y="26" width="6" height="10" fill="#dcd6c4"/>
          <rect x="37" y="26" width="1" height="10" fill="#594d75"/>
          <rect x="32" y="28" width="4" height="1" fill="#4f4861"/>
          <rect x="32" y="30" width="3" height="1" fill="#8fb7ff"/>
          <rect x="32" y="32" width="4" height="1" fill="#4f4861"/>
          <rect x="39" y="28" width="4" height="1" fill="#4f4861"/>
          <rect x="39" y="30" width="3" height="1" fill="#ffb000"/>
          <rect x="39" y="32" width="4" height="1" fill="#4f4861"/>
        </g>`
      : anim === 'wiretap'
        ? `<g class="tc-prop tc-prop-wiretap">
            <rect x="32" y="30" width="3" height="2" fill="#000"/>
            <rect x="34" y="29" width="3" height="2" fill="#5fd3e0"/>
            <rect x="36" y="22" width="4" height="9" fill="#000"/>
            <rect x="37" y="23" width="2" height="7" fill="#4f4861"/>
            <rect x="37" y="24" width="2" height="2" fill="#ffb000"/>
            <rect x="37" y="16" width="2" height="6" fill="#000"/>
            <rect x="38" y="15" width="1" height="7" fill="#ebe6d6"/>
            <rect class="tc-spark-tip" x="36" y="13" width="5" height="2" fill="#5fd3e0"/>
            <rect class="tc-spark-tip" x="38" y="11" width="1" height="6" fill="#d8ffe4"/>
          </g>`
        : `<g class="tc-prop tc-prop-loupe">
            <rect x="24" y="11" width="11" height="11" fill="#000"/>
            <rect x="25" y="12" width="9" height="9" fill="#ffb000"/>
            <rect x="26" y="13" width="7" height="7" fill="#0b0a12"/>
            <rect x="27" y="14" width="5" height="5" fill="#5fd3e0"/>
            <rect x="29" y="15" width="2" height="3" fill="#0b0a12"/>
            <rect x="27" y="14" width="1" height="1" fill="#ffffff"/>
            <rect x="33" y="21" width="3" height="7" fill="#000"/>
            <rect x="34" y="21" width="1" height="6" fill="#8b8598"/>
          </g>`;

  svg.innerHTML = `
    <!-- Ground shadow -->
    <g class="tc-shadow">
      <rect x="13" y="45" width="22" height="2" fill="rgba(0,0,0,0.65)"/>
      <rect x="16" y="44" width="16" height="1" fill="rgba(0,0,0,0.45)"/>
    </g>

    <!-- SIDE-PROFILE POSE (facing left; used for clunky cartoony skipping in and out) -->
    <g class="tc-pose-side">
      <g class="tc-dust">
        <rect x="36" y="41" width="5" height="3" fill="#8b8598"/>
        <rect x="40" y="39" width="3" height="2" fill="#cfcbd8"/>
        <rect x="33" y="43" width="3" height="2" fill="#544e66"/>
      </g>

      <g class="tc-tail">
        <rect x="31" y="33" width="6" height="2" fill="#000"/>
        <rect x="32" y="33" width="5" height="1" fill="#4f4861"/>
        <rect x="36" y="31" width="5" height="3" fill="#000"/>
        <rect x="37" y="32" width="3" height="1" fill="#8b8598"/>
        <rect x="40" y="29" width="3" height="3" fill="#000"/>
        <rect x="41" y="30" width="1" height="1" fill="#ffb000"/>
      </g>

      <!-- Extended far leg (behind) -->
      <g class="tc-sleg-b">
        <rect x="24" y="34" width="5" height="10" fill="#000"/>
        <rect x="25" y="35" width="3" height="8" fill="#322d40"/>
        <rect x="26" y="38" width="1" height="1" fill="#544e66"/>
        <rect x="20" y="42" width="9" height="4" fill="#000"/>
        <rect x="21" y="43" width="7" height="2" fill="#1e1a29"/>
        <rect x="21" y="43" width="2" height="1" fill="#b87600"/>
      </g>

      <!-- Extended near leg (front) -->
      <g class="tc-sleg-f">
        <rect x="19" y="34" width="5" height="10" fill="#000"/>
        <rect x="20" y="35" width="3" height="8" fill="#4f4861"/>
        <rect x="21" y="38" width="1" height="1" fill="#8b8598"/>
        <rect x="15" y="42" width="9" height="4" fill="#000"/>
        <rect x="16" y="43" width="7" height="2" fill="#2a2538"/>
        <rect x="16" y="43" width="2" height="1" fill="#ffb000"/>
      </g>

      <g class="tc-side-upper">
        <!-- Extended far arm -->
        <g class="tc-sarm-b">
          <rect x="11" y="26" width="6" height="10" fill="#000"/>
          <rect x="12" y="27" width="4" height="7" fill="#2a2538"/>
          <rect x="11" y="33" width="4" height="3" fill="#000"/>
          <rect x="12" y="34" width="3" height="2" fill="#cfcbd8"/>
        </g>

        <!-- Side torso -->
        <g class="tc-side-torso">
          <rect x="17" y="25" width="14" height="11" fill="#000"/>
          <rect x="18" y="26" width="12" height="9" fill="#2a2538"/>
          <rect x="18" y="26" width="12" height="1" fill="#4f4861"/>
          <rect x="18" y="28" width="2" height="6" fill="#181522"/>
          <rect x="19" y="29" width="1" height="1" fill="#ffb000"/>
          <rect x="19" y="32" width="1" height="1" fill="#8fb7ff"/>
        </g>

        <!-- Side-profile CRT Head (no eyes visible; multi-color phosphor glow spill in front) -->
        <g class="tc-side-head">
          <g class="tc-ant tc-ant-l">
            <rect x="26" y="3" width="2" height="5" fill="#000"/>
            <rect x="28" y="1" width="3" height="3" fill="#000"/>
            <rect x="27" y="4" width="1" height="4" fill="#8b8598"/>
            <rect x="29" y="2" width="2" height="1" fill="#ffb000"/>
          </g>
          <g class="tc-ant tc-ant-r">
            <rect x="22" y="4" width="2" height="4" fill="#000"/>
            <rect x="24" y="2" width="3" height="3" fill="#000"/>
            <rect x="23" y="5" width="1" height="3" fill="#8b8598"/>
            <rect x="25" y="3" width="2" height="1" fill="#5fd3e0"/>
          </g>

          <rect x="11" y="7" width="17" height="19" fill="#000"/>
          <rect x="27" y="10" width="8" height="13" fill="#000"/>
          <rect x="12" y="8" width="15" height="17" fill="#39334a"/>
          <rect x="12" y="8" width="15" height="2" fill="#544e66"/>
          <rect x="27" y="11" width="7" height="11" fill="#2a2538"/>
          <rect x="29" y="13" width="3" height="1" fill="#131118"/>
          <rect x="29" y="15" width="3" height="1" fill="#131118"/>
          <rect x="29" y="17" width="3" height="1" fill="#131118"/>
          <rect x="29" y="19" width="3" height="1" fill="#131118"/>
          <rect x="20" y="14" width="4" height="4" fill="#181522"/>
          <rect x="21" y="15" width="2" height="2" fill="#8b8598"/>
          <rect class="tc-led" x="14" y="23" width="2" height="1" fill="#ffb000"/>

          <!-- Curved front CRT glass edge + multi-color phosphor glow spill -->
          <rect x="10" y="10" width="3" height="12" fill="#000"/>
          <rect x="10" y="11" width="2" height="10" fill="#182230"/>
          <rect x="10" y="12" width="1" height="8" fill="#5fd3e0"/>
          <g class="tc-side-glow">
            <rect x="8" y="11" width="2" height="3" fill="#5fd3e0" opacity="0.55"/>
            <rect x="7" y="14" width="3" height="3" fill="#ffb000" opacity="0.45"/>
            <rect x="8" y="17" width="2" height="3" fill="#ff6ad5" opacity="0.45"/>
            <rect x="5" y="13" width="2" height="2" fill="#7ee0a1" opacity="0.32"/>
            <rect x="5" y="16" width="2" height="2" fill="#5fd3e0" opacity="0.28"/>
            <rect x="3" y="14" width="2" height="3" fill="#ffe25a" opacity="0.18"/>
          </g>
        </g>

        <!-- Extended near swinging arm -->
        <g class="tc-sarm-f">
          <rect x="22" y="26" width="6" height="11" fill="#000"/>
          <rect x="23" y="27" width="4" height="8" fill="#39334a"/>
          <rect x="24" y="28" width="2" height="2" fill="#544e66"/>
          <rect x="22" y="34" width="5" height="3" fill="#000"/>
          <rect x="23" y="35" width="3" height="2" fill="#ebe6d6"/>
        </g>
      </g>
    </g>

    <!-- FRONT-FACING HEAD-ON POSE (used for squint, checking, and verdict) -->
    <g class="tc-pose-front">
      <g class="tc-tail">
        <rect x="9" y="34" width="5" height="2" fill="#000"/>
        <rect x="10" y="34" width="4" height="1" fill="#4f4861"/>
        <rect x="6" y="32" width="4" height="3" fill="#000"/>
        <rect x="7" y="33" width="2" height="1" fill="#8b8598"/>
        <rect x="4" y="30" width="3" height="3" fill="#000"/>
        <rect x="5" y="31" width="1" height="1" fill="#ffb000"/>
      </g>

      <!-- Extended front legs -->
      <g class="tc-leg tc-leg-l">
        <rect x="16" y="34" width="5" height="9" fill="#000"/>
        <rect x="17" y="35" width="3" height="7" fill="#4f4861"/>
        <rect x="18" y="38" width="1" height="1" fill="#8b8598"/>
        <rect x="14" y="42" width="8" height="4" fill="#000"/>
        <rect x="15" y="43" width="6" height="2" fill="#2a2538"/>
        <rect x="15" y="43" width="2" height="1" fill="#ffb000"/>
      </g>
      <g class="tc-leg tc-leg-r">
        <rect x="27" y="34" width="5" height="9" fill="#000"/>
        <rect x="28" y="35" width="3" height="7" fill="#4f4861"/>
        <rect x="29" y="38" width="1" height="1" fill="#8b8598"/>
        <rect x="26" y="42" width="8" height="4" fill="#000"/>
        <rect x="27" y="43" width="6" height="2" fill="#2a2538"/>
        <rect x="31" y="43" width="2" height="1" fill="#ffb000"/>
      </g>

      <g class="tc-upper">
        <g class="tc-arm tc-arm-l">
          <rect x="8" y="26" width="6" height="11" fill="#000"/>
          <rect x="9" y="27" width="4" height="8" fill="#39334a"/>
          <rect x="10" y="28" width="2" height="2" fill="#544e66"/>
          <rect x="8" y="34" width="5" height="3" fill="#000"/>
          <rect x="9" y="35" width="3" height="2" fill="#ebe6d6"/>
        </g>

        <g class="tc-torso">
          <rect x="14" y="26" width="20" height="10" fill="#000"/>
          <rect x="15" y="27" width="18" height="8" fill="#2a2538"/>
          <rect x="15" y="27" width="18" height="1" fill="#4f4861"/>
          <rect x="19" y="27" width="10" height="2" fill="#181522"/>
          <rect x="23" y="28" width="2" height="1" fill="#ffb000"/>
          <rect x="18" y="30" width="12" height="5" fill="#0b0a12"/>
          <rect class="tc-bar tc-bar-1" x="19" y="31" width="10" height="1" fill="#8fb7ff"/>
          <rect class="tc-bar tc-bar-2" x="19" y="32" width="8" height="1" fill="#7ee0a1"/>
          <rect class="tc-bar tc-bar-3" x="19" y="33" width="10" height="1" fill="#ffb000"/>
          <rect class="tc-bar tc-bar-4" x="19" y="34" width="6" height="1" fill="#ff6ad5"/>
        </g>

        <g class="tc-arm tc-arm-r">
          <rect x="34" y="26" width="6" height="11" fill="#000"/>
          <rect x="35" y="27" width="4" height="8" fill="#39334a"/>
          <rect x="36" y="28" width="2" height="2" fill="#544e66"/>
          <rect x="35" y="34" width="5" height="3" fill="#000"/>
          <rect x="36" y="35" width="3" height="2" fill="#ebe6d6"/>
        </g>

        <!-- High-res CRT Head -->
        <g class="tc-head">
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

          <rect x="10" y="7" width="28" height="20" fill="#000"/>
          <rect x="11" y="8" width="26" height="18" fill="#39334a"/>
          <rect x="11" y="8" width="26" height="2" fill="#544e66"/>
          <rect x="11" y="24" width="26" height="2" fill="#242030"/>
          <rect x="15" y="8" width="2" height="1" fill="#181522"/>
          <rect x="19" y="8" width="2" height="1" fill="#181522"/>
          <rect x="23" y="8" width="2" height="1" fill="#181522"/>
          <rect x="27" y="8" width="2" height="1" fill="#181522"/>
          <rect x="31" y="8" width="2" height="1" fill="#181522"/>
          <rect x="38" y="13" width="2" height="5" fill="#000"/>
          <rect x="38" y="14" width="1" height="3" fill="#8b8598"/>
          <rect class="tc-led" x="33" y="24" width="2" height="1" fill="#ffb000"/>
          <rect x="13" y="24" width="6" height="1" fill="#181522"/>

          <rect x="13" y="10" width="22" height="13" fill="#000"/>
          <rect x="14" y="11" width="20" height="11" fill="#0b0a12"/>
          <rect x="15" y="12" width="2" height="1" fill="#2a2840"/>

          <rect class="tc-scan" x="14" y="11" width="20" height="1" fill="#d8ffe4" opacity="0.32"/>
          <rect class="tc-glass-flash" x="14" y="11" width="5" height="11" fill="#ffffff" opacity="0"/>

          <!-- Spring-out eyeballs -->
          <g class="tc-eyes">
            <g class="tc-eye tc-eye-l">
              <rect class="tc-eye-rim" x="15" y="12" width="8" height="8" fill="#000"/>
              <rect class="tc-eye-bg" x="16" y="13" width="6" height="6" fill="#5fd3e0"/>
              <rect class="tc-pupil" x="18" y="14" width="2" height="4" fill="#0b0a12"/>
              <rect class="tc-glint" x="17" y="14" width="1" height="1" fill="#ffffff"/>
            </g>
            <g class="tc-eye tc-eye-r">
              <rect class="tc-eye-rim" x="25" y="12" width="8" height="8" fill="#000"/>
              <rect class="tc-eye-bg" x="26" y="13" width="6" height="6" fill="#5fd3e0"/>
              <rect class="tc-pupil" x="28" y="14" width="2" height="4" fill="#0b0a12"/>
              <rect class="tc-glint" x="27" y="14" width="1" height="1" fill="#ffffff"/>
            </g>
          </g>

          <g class="tc-lid-top">
            <rect x="14" y="10" width="20" height="3" fill="#0b0a12"/>
          </g>
          <g class="tc-lid-bot">
            <rect x="14" y="19" width="20" height="3" fill="#0b0a12"/>
          </g>
        </g>

        ${prop}
      </g>
    </g>`;
  return svg;
}

/**
 * Dottybase table-check easter egg:
 * - Side-profile clunky skipping entrance on 4s with a smooth, lagging personal shadow + a softer,
 *   side-padded center stage band that fades in as she arrives.
 * - Snaps head-on, springs her eyeballs out in a double-take, leans into a fourth-wall squint.
 * - Renders frameless guess/badge above and cursor-typed text + WOMM hourglass below on the dark region.
 * - Delivers verdict, snaps back to side-profile, and clunky-skips off the left edge while her
 *   lagging personal shadow smoothly trails behind her until she vanishes.
 */
export class TableCheck {
  private readonly root: HTMLElement;
  private readonly head: HTMLElement;
  private readonly actor: HTMLElement;
  private readonly caption: HTMLElement;
  private readonly line: HTMLElement;
  private readonly guessEl: HTMLElement;
  private readonly badge: HTMLElement;
  private timers: number[] = [];
  private rafId = 0;
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
      <div class="tc-stage-wrap" role="status" aria-live="polite">
        <div class="tc-head" data-tc="head" hidden>
          <div class="tc-sub">
            <span class="tc-guess" data-tc="guess"></span>
            <span class="tc-badge" data-tc="badge" hidden></span>
          </div>
        </div>
        <div class="tc-actor" data-tc="actor"></div>
        <div class="tc-caption" data-tc="caption" hidden>
          <span class="tc-hg" data-tc="hg"></span>
          <div class="tc-line" data-tc="line"></div>
        </div>
      </div>`;
    mount.append(wrap);
    this.root = wrap;
    this.head = wrap.querySelector('[data-tc="head"]')!;
    this.actor = wrap.querySelector('[data-tc="actor"]')!;
    this.caption = wrap.querySelector('[data-tc="caption"]')!;
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
    this.head.hidden = !still;
    this.caption.hidden = !still;
    this.badge.hidden = true;
    this.guessEl.textContent = opts.guess ? `> ${opts.guess}` : '> lookup';
    this.line.textContent = '';
    this.actor.replaceChildren(dottybaseSvg(opts.anim));

    scene?.setCursorHidden(true);
    scene?.setTimeScale(still ? 1 : 0.12);
    scene?.setVignette(true, {
      maxBlock: 2,
      bar: true,
      cyFrac: 0.46,
      barLeft: 0.14,
      barRight: 0.86,
      barAlpha: still ? 1 : 0,
      dotCx: still ? 0.5 : 1.12,
      dotCy: 0.46,
      dotAlpha: still ? 0 : 0.92,
    });

    // Smooth, continuous lagging shadow curve (never jumps with Dottybase's stepped skip poses),
    // paired with the softer, side-padded center bar fading in on arrival and out on exit.
    if (!still) {
      const startAt = performance.now();
      const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
      const easeOutCubic = (t: number) => 1 - (1 - t) ** 3;
      const easeInOutQuad = (t: number) => (t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2);
      const tickShadow = (now: number) => {
        if (!this.active) return;
        const el = now - startAt;

        let dotCx = 0.5;
        if (el < 1720) {
          const p = clamp01((el - 40) / 1680);
          dotCx = 1.08 - 0.58 * easeOutCubic(p);
        } else if (el >= 6200) {
          const p = clamp01((el - 6200) / 1620);
          dotCx = 0.5 - 0.68 * easeInOutQuad(p);
        }

        const barIn = clamp01((el - 180) / 380);
        const barOut = 1 - clamp01((el - 6950) / 680);
        const barAlpha = Math.min(barIn, barOut);
        const dotAlpha = el > 7720 ? Math.max(0, 1 - (el - 7720) / 280) * 0.92 : 0.92;
        scene?.setVignetteStage(barAlpha, dotCx, 0.46, dotAlpha);
        this.rafId = requestAnimationFrame(tickShadow);
      };
      this.rafId = requestAnimationFrame(tickShadow);
    }

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
      typeOut(opts.checkLine);
      later(900, () => {
        this.root.dataset.stage = 'verdict';
        this.root.dataset.outcome = opts.outcome;
        this.badge.textContent = opts.outcome === 'accept' ? 'OK' : '?';
        this.badge.hidden = false;
        typeOut(opts.verdictLine);
      });
      later(1700, () => {
        this.close();
        opts.onDone?.();
      });
      return;
    }

    // 1. Slower, higher side-profile skipping entrance -> snap head-on, eyeball-spring double-take & squint.
    later(1650, () => {
      this.root.dataset.stage = 'squint';
      this.head.hidden = false;
    });

    // 2. Checking beat: typed text + WOMM hourglass appear below on the dark backdrop.
    later(2750, () => {
      this.root.dataset.stage = 'checking';
      this.caption.hidden = false;
      typeOut(opts.checkLine);
    });

    // 3. Verdict beat: accept/reject pose + verdict quip.
    later(4650, () => {
      this.root.dataset.stage = 'verdict';
      this.root.dataset.outcome = opts.outcome;
      this.badge.textContent = opts.outcome === 'accept' ? 'OK' : '?';
      this.badge.hidden = false;
      typeOut(opts.verdictLine);
    });

    // 4. Exit: hide text, snap back to side-profile, higher slower skips off the left edge while shadow trails behind.
    later(6200, () => {
      this.root.dataset.stage = 'exit';
      this.head.hidden = true;
      this.caption.hidden = true;
    });

    // 5. Restore world only after Dottybase and her trailing shadow have exited.
    later(8020, () => {
      this.close();
      opts.onDone?.();
    });
  }

  close() {
    for (const t of this.timers) clearTimeout(t);
    this.timers = [];
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = 0;
    }
    this.cancelGlitch?.();
    this.cancelGlitch = undefined;
    if (this.active) {
      this.active = false;
      const scene = this.getScene();
      scene?.setVignette(false);
      scene?.setTimeScale(1);
      scene?.setCursorHidden(false);
    }
    this.root.hidden = true;
  }
}
