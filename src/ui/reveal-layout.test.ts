import { describe, expect, it } from 'vitest';
import { LAYERS } from '../core/layers';
import { TIERS, TIER_IDS } from '../core/tiers';
import { FORM_BY_LAYER, cursorRow, markExtentY, pixelScale } from '../render/cursor-geom';
import { CHIPS_BOTTOM, overlaps, revealLayout } from './reveal-layout';

// Mirror the HUD's copy without importing it (it builds DOM): the longest lines it can show.
const LONG_ANSWER = 'Mellor-Crummey Scott lock · +13 stack frames';
const LONG_LINE = 'Everyone thinks they’re the only one who knows this.';

const VIEWPORTS = [
  [1280, 800],
  [390, 844],
  [360, 740],
] as const;

describe('reveal layout', () => {
  for (const [vw, vh] of VIEWPORTS)
    for (const railed of [false, true])
      it(`never overlaps at ${vw}×${vh}${railed ? ' with the debug rail' : ''}`, () => {
        const bad: string[] = [];
        const scale = pixelScale(vw);
        for (const layer of LAYERS) {
          const m = markExtentY(FORM_BY_LAYER[layer.id], cursorRow(vw, vh));
          const mark = { top: m.top * scale, bottom: m.bottom * scale };
          const reveals = [
            ...TIER_IDS.map((id) => ({ name: TIERS[id].name, answer: LONG_ANSWER, line: LONG_LINE })),
            { name: 'Time’s up', answer: '', line: 'No answer, so no frames this round.', lowKey: true },
          ];
          for (const t of reveals) {
            const L = revealLayout(vw, vh, mark, t, railed);
            const where = `${layer.id} / ${t.name}`;
            const boxes = { name: L.name, mark: L.mark, body: L.body, console: L.console };
            const keys = Object.keys(boxes) as (keyof typeof boxes)[];
            for (let a = 0; a < keys.length; a++)
              for (let b = a + 1; b < keys.length; b++)
                if (overlaps(boxes[keys[a]!], boxes[keys[b]!])) bad.push(`${where}: ${keys[a]} overlaps ${keys[b]}`);
            // Order top to bottom: name, cursor mark, details, console.
            if (!(L.name.top >= CHIPS_BOTTOM && L.name.bottom <= L.mark.top && L.mark.bottom <= L.body.top && L.body.bottom <= L.console.top))
              bad.push(`${where}: out of order`);
            if (L.namePx < 16 || L.answerPx < 16) bad.push(`${where}: text shrank below 16px`);
          }
        }
        expect(bad).toEqual([]);
      });
});
