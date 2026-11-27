import { describe, expect, it } from 'vitest';
import { layersFor } from '../../core/layers';
import { layoutName, lineWidth } from './watermark';

describe('layer-name watermark', () => {
  // The narrowest real scene is a 320px phone at 2 px per scene pixel: 160 wide.
  it('has a glyph for every layer name and fits it at phone and desktop widths', () => {
    for (const mode of ['daily', 'endless'] as const)
      for (const l of layersFor(mode))
        for (const maxW of [160, 195, 330, 640]) {
          const lay = layoutName(l.name, Math.round(maxW * 0.9));
          for (const line of lay.lines) expect(lineWidth(line) * lay.scale).toBeLessThanOrEqual(Math.round(maxW * 0.9));
          expect(lay.lines.length).toBeLessThanOrEqual(3);
        }
  });

  it('is large on a desktop-width scene and wraps on a phone to stay legible', () => {
    expect(layoutName('Application', 300).scale).toBeGreaterThanOrEqual(4);
    const phone = layoutName('OS userspace', 175);
    expect(phone.lines.length).toBeGreaterThan(1);
    expect(phone.scale).toBeGreaterThanOrEqual(2);
  });

  it('fails loudly on a character with no glyph', () => {
    expect(() => layoutName('Ünknown', 300)).toThrow();
  });
});
