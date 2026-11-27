// @vitest-environment happy-dom
import { afterEach, describe, expect, it } from 'vitest';
import { mountVisualViewport } from './viewport';

/** Visual viewport tracking: covers both resizes-visual (Android Chrome / iOS) and resizes-content mobile browsers. */

function makeFakeViewport(height: number, offsetTop = 0) {
  const listeners = new Map<string, Set<() => void>>();
  return {
    height,
    offsetTop,
    addEventListener(type: string, fn: () => void) {
      if (!listeners.has(type)) listeners.set(type, new Set());
      listeners.get(type)!.add(fn);
    },
    removeEventListener(type: string, fn: () => void) {
      listeners.get(type)?.delete(fn);
    },
    emit(type: string) {
      for (const fn of listeners.get(type) ?? []) fn();
    },
  };
}

describe('mountVisualViewport', () => {
  let cleanup: (() => void) | undefined;

  afterEach(() => {
    cleanup?.();
    cleanup = undefined;
    document.body.innerHTML = '';
  });

  it('tracks --kb, --vvh and html.kb-open on resizes-visual browsers (Android Chrome / iOS)', () => {
    const vv = makeFakeViewport(844, 0);
    Object.defineProperty(window, 'innerWidth', { value: 390, configurable: true });
    Object.defineProperty(window, 'innerHeight', { value: 844, configurable: true });
    Object.defineProperty(window, 'visualViewport', { value: vv, configurable: true });

    document.body.innerHTML = '<section class="console"><input id="guess" type="text" /></section>';
    const input = document.getElementById('guess') as HTMLInputElement;
    cleanup = mountVisualViewport();

    expect(document.documentElement.style.getPropertyValue('--vvh')).toBe('844px');
    expect(document.documentElement.style.getPropertyValue('--kb')).toBe('0px');
    expect(document.documentElement.classList.contains('kb-open')).toBe(false);

    // Tap the input without typing: keyboard opens and shrinks visualViewport while innerHeight stays 844.
    input.focus();
    vv.height = 460;
    vv.emit('resize');

    expect(document.documentElement.style.getPropertyValue('--vvh')).toBe('460px');
    expect(document.documentElement.style.getPropertyValue('--kb')).toBe('384px');
    expect(document.documentElement.classList.contains('kb-open')).toBe(true);

    // Keyboard closes.
    input.blur();
    vv.height = 844;
    vv.emit('resize');

    expect(document.documentElement.style.getPropertyValue('--kb')).toBe('0px');
    expect(document.documentElement.classList.contains('kb-open')).toBe(false);
  });

  it('keeps --kb at 0 for a pinch-zoom (visual viewport shrinks with no text field focused)', () => {
    const vv = makeFakeViewport(844, 0);
    Object.defineProperty(window, 'innerWidth', { value: 390, configurable: true });
    Object.defineProperty(window, 'innerHeight', { value: 844, configurable: true });
    Object.defineProperty(window, 'visualViewport', { value: vv, configurable: true });
    cleanup = mountVisualViewport();
    vv.height = 400;
    vv.offsetTop = 100;
    vv.emit('resize');
    expect(document.documentElement.style.getPropertyValue('--kb')).toBe('0px');
    expect(document.documentElement.classList.contains('kb-open')).toBe(false);
  });

  it('also sets html.kb-open on resizes-content browsers where innerHeight shrinks with the keyboard', () => {
    const vv = makeFakeViewport(800, 0);
    Object.defineProperty(window, 'innerWidth', { value: 390, configurable: true });
    Object.defineProperty(window, 'innerHeight', { value: 800, configurable: true });
    Object.defineProperty(window, 'visualViewport', { value: vv, configurable: true });

    document.body.innerHTML = '<section class="console"><input id="guess" type="text" /></section>';
    const input = document.getElementById('guess') as HTMLInputElement;
    cleanup = mountVisualViewport();

    input.focus();
    Object.defineProperty(window, 'innerHeight', { value: 440, configurable: true });
    vv.height = 440;
    vv.emit('resize');

    expect(document.documentElement.style.getPropertyValue('--vvh')).toBe('440px');
    expect(document.documentElement.style.getPropertyValue('--kb')).toBe('0px');
    expect(document.documentElement.classList.contains('kb-open')).toBe(true);
  });

  it('does not set kb-open when a non-text element is focused', () => {
    const vv = makeFakeViewport(800, 0);
    Object.defineProperty(window, 'innerWidth', { value: 390, configurable: true });
    Object.defineProperty(window, 'innerHeight', { value: 800, configurable: true });
    Object.defineProperty(window, 'visualViewport', { value: vv, configurable: true });

    document.body.innerHTML = '<button id="btn" type="button">OK</button>';
    const btn = document.getElementById('btn') as HTMLButtonElement;
    cleanup = mountVisualViewport();

    btn.focus();
    vv.height = 440;
    vv.emit('resize');

    expect(document.documentElement.classList.contains('kb-open')).toBe(false);
  });
});
