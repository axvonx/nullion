// @vitest-environment happy-dom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { Scene } from '../render/scene';
import type { LayerStack } from './layer-stack';
import { REVEAL_HTML, Reveal, TIER_QUIPS } from './reveal';

/** The reveal controller on its own: a stand-in scene, no game, the console's two buttons stubbed in. */

class FakeScene {
  displayDepth = 0;
  uiReserveRightCss = 0;
  vignette: boolean[] = [];
  holds: { on: boolean; unstick?: boolean | undefined }[] = [];
  markCss() {
    return { top: 250, bottom: 320 };
  }
  setVignette(on: boolean) {
    this.vignette.push(on);
  }
  setHold(on: boolean, unstick?: boolean) {
    this.holds.push({ on, unstick });
  }
}

function setup() {
  document.body.innerHTML = `<div id="app">${REVEAL_HTML}<button data-el="rvShow" hidden>show</button><button data-el="rvNext">next</button></div>`;
  const root = document.getElementById('app')!;
  const scene = new FakeScene();
  let now = 0;
  const reveal = new Reveal(root, {
    scene: () => scene as unknown as Scene,
    game: () => undefined,
    layerStack: {} as LayerStack,
    isDemo: () => false,
    isScrollMode: () => false,
    clock: () => now,
  });
  const q = <T extends HTMLElement>(sel: string) => root.querySelector<T>(sel)!;
  return { root, scene, reveal, q, setNow: (n: number) => (now = n) };
}

beforeEach(() => {
  vi.useFakeTimers();
});
afterEach(() => {
  vi.useRealTimers();
});

describe('Reveal', () => {
  it('opens on a tier: name, answer, pips, vignette and hold, and the console becomes Unwind further', () => {
    const t = setup();
    t.reveal.showTier('bitflip', 'Mercator', 13);
    expect(t.reveal.isOpen).toBe(true);
    expect(t.q('.reveal').hidden).toBe(false);
    expect(t.q('.reveal').dataset.tier).toBe('bitflip');
    expect(t.q('.rv-name').textContent).toBe('Bit Flip');
    expect(t.q('.rv-answer').textContent).toBe('Mercator+13 stack frames');
    expect(t.q('.rv-answer .sq-sep')).not.toBeNull();
    expect(t.q('.rv-pips').querySelectorAll('.rv-pip.on')).toHaveLength(7);
    expect(t.root.classList.contains('unwinding')).toBe(true);
    expect(t.scene.vignette.at(-1)).toBe(true);
    expect(t.scene.holds.at(-1)?.on).toBe(true);
  });

  it('lights one pip, in the odd colour, for Works on my machine, and rotates its quips', () => {
    const t = setup();
    t.reveal.showTier('womm', 'x', 1);
    expect(t.q('.rv-pips').querySelectorAll('.rv-pip.on')).toHaveLength(1);
    expect(t.q('.rv-pips').classList.contains('is-womm')).toBe(true);
    const first = t.q('.rv-line').textContent;
    expect(TIER_QUIPS.womm).toContain(first);
    t.reveal.showTier('womm', 'x', 1);
    expect(t.q('.rv-line').textContent).toBe(TIER_QUIPS.womm[1]);
    t.reveal.showTier('womm', 'x', 1, 'a note');
    expect(t.q('.rv-line').textContent).toBe('a note');
  });

  it('a timeout is low-key with no pips', () => {
    const t = setup();
    t.reveal.showTimeout();
    expect(t.q('.reveal').classList.contains('low-key')).toBe(true);
    expect(t.q('.rv-pips').hidden).toBe(true);
    expect(t.q('.rv-name').textContent).toBe('Time’s up');
    expect(t.q('.rv-line').textContent).toBe('No answer, so no frames this round.');
  });

  it('offers hide only after the pop-in settles', () => {
    const t = setup();
    t.reveal.showTier('leak', 'x', 3);
    const hide = t.q<HTMLButtonElement>('.rv-hide');
    t.reveal.update(0);
    t.reveal.update(699);
    expect(hide.hidden).toBe(true);
    t.reveal.update(700);
    expect(hide.hidden).toBe(false);
  });

  it('hide folds the reveal away and lifts the vignette; show brings it back', () => {
    const t = setup();
    t.reveal.showTier('leak', 'x', 3);
    t.q<HTMLButtonElement>('.rv-hide').click();
    expect(t.reveal.isStowed).toBe(true);
    expect(t.q('.reveal').classList.contains('stowed')).toBe(true);
    expect(t.root.classList.contains('reveal-stowed')).toBe(true);
    expect(t.scene.vignette.at(-1)).toBe(false);
    expect(t.q('[data-el="rvShow"]').hidden).toBe(false);
    t.q<HTMLButtonElement>('[data-el="rvShow"]').click();
    expect(t.reveal.isStowed).toBe(false);
    expect(t.q('.reveal').classList.contains('back')).toBe(true);
    expect(t.scene.vignette.at(-1)).toBe(true);
    expect(t.reveal.isOpen).toBe(true);
  });

  it('unwind closes the reveal, runs the demo callback once, and fades the node out', () => {
    const t = setup();
    const then = vi.fn();
    t.reveal.demo('npe', 'x', 2, 2400, then);
    expect(t.reveal.isOpen).toBe(true);
    vi.advanceTimersByTime(2400);
    expect(then).toHaveBeenCalledTimes(1);
    expect(t.reveal.isOpen).toBe(false);
    expect(t.root.classList.contains('unwinding')).toBe(false);
    expect(t.scene.holds.at(-1)).toEqual({ on: false, unstick: true });
    expect(t.q('.reveal').classList.contains('out')).toBe(true);
    vi.advanceTimersByTime(200);
    expect(t.q('.reveal').hidden).toBe(true);
    // A second press with nothing open does nothing.
    t.reveal.unwind(0);
    expect(then).toHaveBeenCalledTimes(1);
  });

  it('the Unwind further button unwinds', () => {
    const t = setup();
    const then = vi.fn();
    t.reveal.demo('npe', 'x', 2, 99999, then);
    t.q<HTMLButtonElement>('[data-el="rvNext"]').click();
    expect(then).toHaveBeenCalledTimes(1);
    expect(t.reveal.isOpen).toBe(false);
  });
});
