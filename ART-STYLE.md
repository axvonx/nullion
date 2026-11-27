# Art style guide (v4 entities, critters, setpieces)

Written 2026-11-27 after a consistency review. The v4 art was made over many sessions by different agents, and the
only rule they all shared was the palette snap. Contact sheets of the review: `python3 -I scripts/art-sheet.py <layer>
…` (it writes PNGs from `design/naming/sprites/`). These rules apply to every new or redrawn sprite. Existing sprites
are brought in line as part of the world cull (`CLAUDE.md`, World cull), not before, so nothing about to be deleted
gets redrawn.

## What already works (keep it)

- **One palette per layer**, snapped by the `Pen` (`v4/kit.ts`). Firmware reads phosphor green, Ring −2 grayscale and
  Drivers neon. Colour identity comes from the layer, never from the sprite.
- **Pixel-exact drawing.** Integer coordinates; `p.glow` is the only thing that dithers.

## The rules

1. **Things, not symbols.** Every prop is a physical object that could sit in that layer's place: a resistor is a
   resistor component, not the schematic zigzag; a flowchart is a whiteboard with a flowchart on it. No free-floating
   UI glyphs, arrows or diagram strokes. Setpieces are places or machines.
   - **GUI layers (Internet, Browser, Application) are looser:** their place is a desktop, so windows, icons and
     widgets count as objects there. Each one still needs a recognisable, distinct shape (a folder, a trash can, a
     calendar, a bell). A generic "panel with coloured bars" is not one, and two widgets that only differ in which
     bars they hold are one widget.
2. **Text is rare and whole.** At most 4 glyphs, from the shared bitmap font, never cut off. A label never stands in
   for the object: a sign with a word on it is fine, a word in a box is not. A prop that needs more text to be read
   needs a different design.
3. **Outline.** One 1 px outline on the silhouette, in the layer palette's darkest ink. No outline inside the shape
   except where two parts meet. No drop shadows. Line-art layers (the silicon and physics layers) still draw filled
   shapes; their style comes from the palette, not from switching to outlines-only.
4. **Light from the top left.** A highlight on the top and left edges, shade on the bottom and right; two tones plus
   the base at most. No gradients.
5. **View.** Front-on with a hint of top (the top face shows at most 2 px). No three-quarter, side-on or top-down
   views mixed in. Circuit boards stand up like signs.
6. **Ground.** Every prop either stands on the band's floor or a ledge (feet, a base or a stand drawn in), or is
   explicitly mounted (wall, pole, ceiling, hanging wire). Nothing floats except critters that fly.
7. **Size classes**, in scene pixels (the longer side): small 8–14, medium 15–26, large 27–40, setpiece 41–64. Nothing
   under 8 px tall or wide. A layer's scatter mixes the classes, about 50% small, 35% medium, 15% large.
8. **Detail density.** One focal detail (the thing that makes it what it is) plus at most 3 supporting details. A
   small prop has one detail.
9. **Critters.**
   - A body at least 6×6 px, with the same outline rule as props.
   - Eyes are 1×1 px in the layer's darkest ink, with no whites, except where the species' design is about its eyes
     (the Ring −1 wisps).
   - Every species has a different silhouette from every other species, colour aside.
   - Colour variants change colour only.
10. **Endless layers** may reuse Daily props, but each layer needs at least 5 props of its own that can't appear
    anywhere else, so the layer reads as a place rather than a recolour.

## Checked in code (when the redraw starts)

These rules can be measured, so they belong in `src/render/v4/place.test.ts` next to `checkLibrary`: size classes and
the 8 px minimum (rule 7), text glyph count (rule 2), each Endless layer's own-prop count (rule 10), and an outline
probe that renders each sprite and checks its silhouette edge is the palette's darkest ink (rule 3). Rules 1, 5, 6 and
8 need eyes; review them on the contact sheets.
