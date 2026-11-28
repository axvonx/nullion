#!/usr/bin/env python3
"""Contact sheets for art-consistency review (docs/art-style.md): every entity of the given layers on one dark sheet.

Usage: python3 -I scripts/art-sheet.py <layer> [<layer> ...] [-o out.png]
Reads design/naming/inventory.json and design/naming/sprites/ (rebuild them with scripts/naming-inventory.mjs).
Sprites are shown at the same scale so sizes compare honestly; each row is one layer.
"""
import json
import pathlib
import sys

from PIL import Image, ImageDraw

ROOT = pathlib.Path(__file__).resolve().parent.parent / "design" / "naming"
CELL = (110, 80)
SCALE = 3


def main() -> None:
    args = sys.argv[1:]
    out = pathlib.Path(args[args.index("-o") + 1]) if "-o" in args else pathlib.Path("art-sheet.png")
    layers = [a for i, a in enumerate(args) if a != "-o" and (i == 0 or args[i - 1] != "-o")]
    if not layers:
        raise SystemExit(__doc__)
    inv = json.loads((ROOT / "inventory.json").read_text())
    known = {l["id"] for l in inv["layers"]}
    for l in layers:
        if l not in known:
            raise SystemExit(f"unknown layer {l!r}; layers: {', '.join(sorted(known))}")
    rows = [(l, [i for i in inv["items"] if i["appearances"][0]["layer"] == l]) for l in layers]
    cols = min(16, max(len(r[1]) for r in rows))
    height = sum(-(-len(r[1]) // cols) * CELL[1] for r in rows)
    img = Image.new("RGB", (cols * CELL[0] + 120, height), (24, 22, 30))
    draw = ImageDraw.Draw(img)
    y = 0
    for layer, its in rows:
        draw.text((4, y + 4), layer, fill=(200, 200, 200))
        for n, it in enumerate(its):
            r, c = divmod(n, cols)
            a = it["appearances"][0]
            sw, sh = a["size"]
            sp = Image.open(ROOT / "sprites" / a["img"]).convert("RGBA")
            k = max(1, min(SCALE, (CELL[0] - 8) // sw, (CELL[1] - 8) // sh))
            sp = sp.resize((sw * k, sh * k), Image.NEAREST)
            img.paste(sp, (120 + c * CELL[0] + (CELL[0] - sp.width) // 2, y + r * CELL[1] + (CELL[1] - sp.height) // 2), sp)
        y += -(-len(its) // cols) * CELL[1]
    img.save(out)
    print(out)


if __name__ == "__main__":
    main()
