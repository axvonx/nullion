#!/usr/bin/env python3
"""Measure every surviving naming-desk entity against ART-STYLE.md's measurable rules.

Usage: python3 -I scripts/art-audit.py [-o design/naming/art-audit.json] [--sheets DIR]

"Surviving" means not deleted and not a verified merge in design/naming/decisions.json. For each survivor's first
appearance sprite (design/naming/sprites/, rendered at an integer scale of the scene size) it reports:
  size      opaque bounding box in scene px, its size class, and `tiny` when a side is under 8 px (rule 7)
  outline   share of silhouette-edge pixels drawn in the sprite's darkest ink (rule 3; flagged below 0.6)
  ground    share of the bounding box's bottom row that is opaque (rule 6; flagged below 0.25, mounted props
            are legitimate so this is a prompt to look, not a verdict)
  colours   distinct opaque colours (rule 8's detail density, roughly)
  twin      the most similar other survivor by silhouette and tone at 16x16 (rules 9 and 10; flagged at >= 0.9)
  text      the entity draws text (rule 2)
Per Endless layer it also counts props of its own (rule 10, at least 5).
--sheets writes one labelled contact sheet per layer of survivors (flags in red) for the rules that need eyes.
"""
import json
import pathlib
import sys

from PIL import Image, ImageDraw

ROOT = pathlib.Path(__file__).resolve().parent.parent / "design" / "naming"
GRID = 16


def classify(long_side: int) -> str:
    if long_side < 8:
        return "under"
    if long_side <= 14:
        return "small"
    if long_side <= 26:
        return "medium"
    if long_side <= 40:
        return "large"
    if long_side <= 64:
        return "setpiece"
    return "over"


def lum(c: tuple[int, ...]) -> float:
    return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]


def scene_pixels(img: Image.Image, size: list[int]) -> Image.Image:
    k = img.width // size[0]
    assert k >= 1 and img.width == size[0] * k and img.height == size[1] * k, (img.size, size)
    return img.resize((size[0], size[1]), Image.Resampling.NEAREST) if k > 1 else img


def measure(img: Image.Image) -> dict:
    w, h = img.size
    data: list[tuple[int, ...]] = list(img.get_flattened_data())  # pyright: ignore[reportAssignmentType]

    def px(x: int, y: int) -> tuple[int, ...]:
        return data[y * w + x]

    opaque = [[px(x, y)[3] > 0 for x in range(w)] for y in range(h)]
    pts = [(x, y) for y in range(h) for x in range(w) if opaque[y][x]]
    assert pts, "empty sprite"
    x0, x1 = min(p[0] for p in pts), max(p[0] for p in pts)
    y0, y1 = min(p[1] for p in pts), max(p[1] for p in pts)
    bw, bh = x1 - x0 + 1, y1 - y0 + 1
    colours = {px(x, y)[:3] for x, y in pts}
    darkest = min(lum(c) for c in colours)
    edge = []
    for x, y in pts:
        if any(not (0 <= x + dx < w and 0 <= y + dy < h) or not opaque[y + dy][x + dx] for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1))):
            edge.append((x, y))
    inked = sum(lum(px(x, y)[:3]) <= darkest + 12 for x, y in edge)
    bottom = sum(opaque[y1][x] for x in range(x0, x1 + 1))
    # silhouette + tone signature for twin detection, palette-independent (luminance rank, not colour)
    crop = img.crop((x0, y0, x1 + 1, y1 + 1)).resize((GRID, GRID), Image.Resampling.NEAREST)
    cdata: list[tuple[int, ...]] = list(crop.get_flattened_data())  # pyright: ignore[reportAssignmentType]

    def cp(x: int, y: int) -> tuple[int, ...]:
        return cdata[y * GRID + x]

    sig = [(cp(x, y)[3] > 0, round(lum(cp(x, y)[:3]) / 64) if cp(x, y)[3] > 0 else -1) for y in range(GRID) for x in range(GRID)]
    return {
        "bbox": [bw, bh],
        "class": classify(max(bw, bh)),
        "tiny": min(bw, bh) < 8,
        "outline": round(inked / len(edge), 2),
        "ground": round(bottom / bw, 2),
        "colours": len(colours),
        "_sig": sig,
        "_aspect": bw / bh,
    }


def similarity(a: dict, b: dict) -> float:
    if not 0.8 <= a["_aspect"] / b["_aspect"] <= 1.25:
        return 0.0
    sa, sb = a["_sig"], b["_sig"]
    union = sum(x[0] or y[0] for x, y in zip(sa, sb))
    same = sum(x[0] and y[0] and abs(x[1] - y[1]) <= 0 for x, y in zip(sa, sb))
    return same / union if union else 0.0


def main() -> None:
    args = sys.argv[1:]
    out = pathlib.Path(args[args.index("-o") + 1]) if "-o" in args else ROOT / "art-audit.json"
    sheets = pathlib.Path(args[args.index("--sheets") + 1]) if "--sheets" in args else None
    inv = json.loads((ROOT / "inventory.json").read_text())
    dec = json.loads((ROOT / "decisions.json").read_text())["items"]

    def survives(key: str) -> bool:
        d = dec[key]["decision"]
        return d["choice"] != "delete" and not (d["choice"] == "merge" and d.get("by") == "verified")

    layers = {l["id"]: l for l in inv["layers"]}
    rows = []
    for it in inv["items"]:
        if not survives(it["key"]):
            continue
        a = it["appearances"][0]
        img = scene_pixels(Image.open(ROOT / "sprites" / a["img"]).convert("RGBA"), a["size"])
        m = measure(img)
        rec = dec[it["key"]]
        name = rec["name"].get("writeIn") or rec["name"].get("proposal") or it["entityId"] if "entityId" in it else it["key"]
        rows.append({"key": it["key"], "kind": it["kind"], "layer": a["layer"], "daily": layers[a["layer"]]["daily"],
                     "name": name, "description": rec.get("description", ""), "text": bool(it.get("flags", {}).get("text")),
                     "img": a["img"], "layers": sorted({x["layer"] for x in it["appearances"]}), **m})

    for r in rows:
        best, who = 0.0, None
        for o in rows:
            if o is r or o["kind"] != r["kind"]:
                continue
            s = similarity(r, o)
            if s > best:
                best, who = s, o["key"]
        r["twin"] = {"key": who, "score": round(best, 2)}
        flags = []
        if r["tiny"]:
            flags.append("tiny")
        if r["class"] == "over" and r["kind"] == "prop":
            flags.append("oversize")
        if r["outline"] < 0.6:
            flags.append("outline")
        if r["kind"] == "prop" and r["ground"] < 0.25:
            flags.append("float?")
        if r["text"]:
            flags.append("text")
        if best >= 0.9:
            flags.append("twin")
        r["flags"] = flags

    own = {}
    for lid, l in layers.items():
        if l["daily"]:
            continue
        own[lid] = sum(1 for r in rows if r["kind"] == "prop" and r["layers"] == [lid])
    clean = [{k: v for k, v in r.items() if not k.startswith("_")} for r in rows]
    out.write_text(json.dumps({"survivors": len(clean), "endlessOwnProps": own, "items": clean}, indent=1) + "\n")
    flagged = [r for r in clean if r["flags"]]
    print(f"{len(clean)} survivors, {len(flagged)} flagged → {out}")
    from collections import Counter
    print(Counter(f for r in clean for f in r["flags"]))
    print("Endless layers under 5 own props:", {k: v for k, v in own.items() if v < 5})

    if sheets:
        sheets.mkdir(parents=True, exist_ok=True)
        cell, cols = (120, 96), 8
        for lid in layers:
            its = [r for r in clean if r["layer"] == lid]
            if not its:
                continue
            img = Image.new("RGB", (cols * cell[0], -(-len(its) // cols) * cell[1] + 16), (24, 22, 30))
            d = ImageDraw.Draw(img)
            d.text((4, 2), lid, fill=(220, 220, 220))
            for n, r in enumerate(its):
                row, col = divmod(n, cols)
                sp = Image.open(ROOT / "sprites" / r["img"]).convert("RGBA")
                k = max(1, min(4, (cell[0] - 8) // sp.width * 2, (cell[1] - 26) // sp.height * 2))
                sp = sp.resize((sp.width * k // 2, sp.height * k // 2), Image.Resampling.NEAREST)
                ox, oy = col * cell[0], 16 + row * cell[1]
                img.paste(sp, (ox + (cell[0] - sp.width) // 2, oy + 2 + (cell[1] - 26 - sp.height) // 2), sp)
                d.text((ox + 3, oy + cell[1] - 24), f"{n} {r['key'].split(':', 1)[1][:17]}", fill=(200, 200, 200))
                if r["flags"]:
                    d.text((ox + 3, oy + cell[1] - 12), ",".join(r["flags"])[:19], fill=(255, 90, 90))
            img.save(sheets / f"{lid}.png")
        print(f"sheets → {sheets}")


if __name__ == "__main__":
    main()
