#!/usr/bin/env python3
"""Apply the culling pass (design/naming/cull/<layer>.json, design/naming/run-cull.sh) to design/naming/decisions.json.

Usage: python3 -I scripts/naming-apply-cull.py [--undo]

Every "delete" verdict becomes decision {choice: "delete", target: <similarTo or null>, note, replacement,
by: "cull"}. The owner asked for this pass to override their own decisions too; each previous record is kept under
"beforeCull", and --undo restores them exactly. Verified merges are left alone: a merged copy follows its target.

It then reports each layer's scatter-prop count after the cull. v4 placement needs at least 20 prop types per
layer (checkLibrary in src/render/v4/place.test.ts), so a layer below 20 needs replacement art before the cull can
reach the game; such layers are listed loudly.
"""
import datetime
import glob
import json
import pathlib
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent / "design" / "naming"
DEC = ROOT / "decisions.json"
MIN_TYPES = 20


def now() -> str:
    return datetime.datetime.now(datetime.timezone.utc).isoformat().replace("+00:00", "Z")


def main() -> None:
    dec = json.loads(DEC.read_text())
    items = dec["items"]
    if "--undo" in sys.argv:
        n = 0
        for rec in items.values():
            if "beforeCull" in rec:
                before = rec.pop("beforeCull")
                rec.clear()
                rec.update(before)
                rec["updatedAt"] = now()
                n += 1
        DEC.write_text(json.dumps(dec, indent=2) + "\n")
        print(f"undid {n} cull deletions")
        return

    inv = json.loads((ROOT / "inventory.json").read_text())
    keys = {i["key"] for i in inv["items"]}
    verdicts = {}
    for f in sorted(glob.glob(str(ROOT / "cull" / "*.json"))):
        for r in json.loads(pathlib.Path(f).read_text())["items"]:
            if r["key"] not in keys:
                raise SystemExit(f"{f}: unknown key {r['key']}")
            if r["verdict"] not in ("keep", "delete"):
                raise SystemExit(f"{f}: {r['key']} has verdict {r['verdict']!r}")
            verdicts[r["key"]] = r

    t = now()
    deleted = overrode = 0
    for key, r in verdicts.items():
        if r["verdict"] != "delete":
            continue
        rec = items[key]
        if rec["decision"].get("by") == "verified":
            continue  # a merged copy follows its target
        if rec["decision"].get("by") == "cull":
            continue  # already applied
        if rec["decision"].get("by") == "owner" or rec["name"].get("by") == "owner":
            overrode += 1
        sim = r.get("similarTo")
        rec["beforeCull"] = json.loads(json.dumps(rec))
        rec["decision"] = {
            "choice": "delete",
            "target": sim if sim in keys and sim != key else None,
            "note": r["reason"],
            "replacement": r.get("replacement"),
            "by": "cull",
        }
        rec["updatedAt"] = t
        deleted += 1
    DEC.write_text(json.dumps(dec, indent=2) + "\n")
    print(f"marked {deleted} for deletion ({overrode} of them overrode your decisions); {len(verdicts)} items had a verdict")

    # What survives in the world, per layer: scatter props not deleted, counting reused copies whose target survives.
    gone = {k for k, v in items.items() if v["decision"]["choice"] == "delete"}
    def alive(it) -> bool:
        rec = items[it["key"]]
        if it["key"] in gone:
            return False
        if rec["decision"].get("by") == "verified" and rec["decision"]["target"] in gone:
            return False
        return True
    print(f"\n{'layer':<16}{'props':>6}{'left':>6}")
    short = []
    for layer in inv["layers"]:
        props = [it for it in inv["items"] if it["kind"] == "prop" and it["appearances"][0]["layer"] == layer["id"]]
        left = sum(alive(it) for it in props)
        flag = "  ← below 20: needs replacement art" if left < MIN_TYPES else ""
        if flag:
            short.append(layer["id"])
        print(f"{layer['id']:<16}{len(props):>6}{left:>6}{flag}")
    if short:
        print(f"\n{len(short)} layers would drop below {MIN_TYPES} prop types: {', '.join(short)}")


if __name__ == "__main__":
    main()
