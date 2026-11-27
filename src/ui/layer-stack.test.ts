// @vitest-environment happy-dom
import { describe, expect, it, vi } from 'vitest';
import { ALL_LAYER_IDS, DAILY_LAYERS } from '../core/layers';
import { LAYER_THEMES, LayerStack } from './layer-stack';

describe('LayerStack', () => {
  it('defines a valid 9x9 theme and icon for every daily and endless layer', () => {
    for (const id of ALL_LAYER_IDS) {
      const t = LAYER_THEMES[id];
      expect(t).toBeDefined();
      expect(t.icon.length).toBe(9);
      for (const row of t.icon) expect(row.length).toBe(9);
    }
    expect(LAYER_THEMES['ring-2'].anim).toBe('none');
  });

  it('starts with Application and builds top-down with the bottommost block highlighted', () => {
    const stack = new LayerStack();
    stack.sync(0, 'daily', { animate: false, reduced: false });
    let blocks = [...stack.el.querySelectorAll('.ls-block')];
    expect(blocks.length).toBe(1);
    expect(blocks[0]!.getAttribute('data-layer')).toBe('application');
    expect(blocks[0]!.querySelector('.ls-icon')).toBeTruthy();
    expect(blocks[0]!.querySelector('.ls-bitmap rect')).toBeTruthy();
    expect(blocks[0]!.classList.contains('is-current')).toBe(true);
    expect(blocks[0]!.getAttribute('aria-current')).toBe('step');

    // Descend into Libraries (depth 6 -> Application, Runtime, Libraries)
    stack.sync(6, 'daily', { animate: false, reduced: false });
    blocks = [...stack.el.querySelectorAll('.ls-block')];
    expect(blocks.map((b) => b.getAttribute('data-layer'))).toEqual(['application', 'runtime', 'libraries']);
    expect(blocks[0]!.classList.contains('is-passed')).toBe(true);
    expect(blocks[1]!.classList.contains('is-passed')).toBe(true);
    expect(blocks[2]!.classList.contains('is-current')).toBe(true);
    expect(blocks[2]!.getAttribute('aria-current')).toBe('step');
    expect(blocks[0]!.hasAttribute('aria-current')).toBe(false);
  });

  it('plays fly-in and fires crunch callback when descending with animation enabled, and skips under reduced motion', () => {
    vi.useFakeTimers();
    try {
      const crunches: string[] = [];
      const stack = new LayerStack((id) => crunches.push(id));
      stack.sync(0, 'daily', { animate: true, reduced: false });
      expect(crunches).toEqual([]);

      // Descend across Runtime (3) into Libraries (6): 2 staggered blocks
      stack.sync(6, 'daily', { animate: true, reduced: false });
      const blocks = [...stack.el.querySelectorAll('.ls-block')];
      expect(blocks[1]!.classList.contains('ls-enter')).toBe(true);
      expect(blocks[2]!.classList.contains('ls-enter')).toBe(true);

      vi.advanceTimersByTime(600);
      expect(crunches).toEqual(['runtime', 'libraries']);

      // Reduced motion appends without fly-in or crunch
      stack.sync(10, 'daily', { animate: true, reduced: true });
      const userspace = stack.el.querySelector('[data-layer="userspace"]')!;
      expect(userspace.classList.contains('ls-enter')).toBe(false);
      vi.advanceTimersByTime(600);
      expect(crunches).toEqual(['runtime', 'libraries']);
    } finally {
      vi.useRealTimers();
    }
  });

  it('trims cleanly when scrolling upward and compresses old layers in deep Endless runs', () => {
    const stack = new LayerStack();
    stack.sync(15, 'daily', { animate: false, reduced: false });
    expect(stack.el.querySelectorAll('.ls-block').length).toBe(5);
    expect(stack.el.querySelector('[data-layer="kernel"]')?.getAttribute('data-boundary')).toBe('syscall');

    stack.sync(3, 'daily', { animate: false, reduced: false });
    expect(stack.el.querySelectorAll('.ls-block').length).toBe(2);
    expect(stack.el.querySelectorAll('.ls-block')[1]!.getAttribute('data-layer')).toBe('runtime');

    // Endless mode deep run compresses oldest layers into thin strata bars
    stack.sync(1500, 'endless', { animate: false, reduced: false });
    const endlessBlocks = [...stack.el.querySelectorAll('.ls-block')];
    expect(endlessBlocks.length).toBeGreaterThan(10);
    expect(endlessBlocks[0]!.classList.contains('is-strata')).toBe(true);
    expect(endlessBlocks[endlessBlocks.length - 1]!.classList.contains('is-strata')).toBe(false);
    expect(endlessBlocks[endlessBlocks.length - 1]!.classList.contains('is-current')).toBe(true);
    expect(DAILY_LAYERS[0]!.id).toBe('application');
  });
});
