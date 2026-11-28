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

function critterSvg(anim: TableCheckAnim): SVGSVGElement {
  const svg = document.createElementNS(NS, 'svg');
  svg.setAttribute('viewBox', '0 0 16 16');
  svg.setAttribute('width', '48');
  svg.setAttribute('height', '48');
  svg.setAttribute('shape-rendering', 'crispEdges');
  svg.setAttribute('aria-hidden', 'true');
  svg.classList.add('tc-critter');
  // Tiny CRT archivist critter: dark bezel, amber/cyan screen face, squinting eyes, stubby legs.
  const prop =
    anim === 'ledger'
      ? '<rect x="11" y="8" width="5" height="6" fill="#000"/><rect x="12" y="9" width="3" height="4" fill="#ebe6d6"/><rect x="13" y="10" width="1" height="2" fill="#8fb7ff"/>'
      : anim === 'wiretap'
        ? '<rect x="7" y="0" width="1" height="3" fill="#8b8598"/><rect x="12" y="6" width="4" height="4" fill="#000"/><rect x="13" y="7" width="2" height="2" fill="#5fd3e0"/>'
        : '';
  svg.innerHTML =
    '<rect x="2" y="3" width="10" height="9" fill="#000"/>' +
    '<rect x="3" y="4" width="8" height="7" fill="#39334a"/>' +
    '<rect x="4" y="5" width="6" height="5" fill="#131118"/>' +
    '<rect class="tc-eye" x="5" y="7" width="2" height="1" fill="#5fd3e0"/>' +
    '<rect class="tc-eye" x="8" y="7" width="2" height="1" fill="#5fd3e0"/>' +
    '<rect class="tc-scan" x="4" y="5" width="6" height="1" fill="#d8ffe4" opacity="0.5"/>' +
    '<rect x="4" y="12" width="2" height="3" fill="#000"/><rect x="4" y="12" width="2" height="2" fill="#8b8598"/>' +
    '<rect x="8" y="12" width="2" height="3" fill="#000"/><rect x="8" y="12" width="2" height="2" fill="#8b8598"/>' +
    prop;
  return svg;
}

/**
 * Rare "Hold on, let me re-read the table" mini-console overlay with background bullet-time,
 * WOMM hourglass, and a 3-variant pixel CRT archivist critter.
 */
export class TableCheck {
  private readonly root: HTMLElement;
  private readonly card: HTMLElement;
  private readonly stage: HTMLElement;
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
      <div class="tc-card panel" role="status" aria-live="polite">
        <div class="tc-top">
          <div class="tc-guess" data-tc="guess"></div>
          <span class="tc-badge" data-tc="badge" hidden></span>
        </div>
        <div class="tc-stage" data-tc="stage"></div>
        <div class="tc-row">
          <span class="tc-hg" data-tc="hg"></span>
          <div class="tc-line" data-tc="line"></div>
        </div>
      </div>`;
    mount.append(wrap);
    this.root = wrap;
    this.card = wrap.querySelector('.tc-card')!;
    this.stage = wrap.querySelector('[data-tc="stage"]')!;
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
    scene?.setTimeScale(still ? 1 : 0.12);

    this.root.hidden = false;
    this.card.dataset.anim = opts.anim;
    this.card.dataset.state = 'checking';
    delete this.card.dataset.outcome;
    this.badge.hidden = true;
    this.guessEl.textContent = opts.guess ? `> ${opts.guess}` : '> lookup';
    this.stage.replaceChildren(critterSvg(opts.anim));

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
      const stepMs = 22;
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

    typeOut(opts.checkLine);
    const checkMs = still ? 750 : 1550;
    const verdictMs = still ? 650 : 1200;

    later(checkMs, () => {
      this.card.dataset.state = 'verdict';
      this.card.dataset.outcome = opts.outcome;
      this.badge.textContent = opts.outcome === 'accept' ? 'OK' : '?';
      this.badge.hidden = false;
      typeOut(opts.verdictLine);
    });

    later(checkMs + verdictMs, () => {
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
      this.getScene()?.setTimeScale(1);
    }
    this.root.hidden = true;
  }
}
