#!/usr/bin/env python3
"""Apply the ART-STYLE.md slate (design/naming/art/slate.json) to design/naming/decisions.json.

Usage: python3 -I scripts/naming-apply-art.py [--undo]

"delete" verdicts become decision {choice: "delete", note: "ART-STYLE rule N: reason", by: "art"}; "rework" verdicts
become {choice: "rework", ..., by: "art"}. Owner decisions (by: "owner") and verified merges are never touched; owner
items are listed instead. Replacement ideas (design/naming/replacements/<layer>.json, run-replacements.sh) are copied
into each deleted record's "replacement" when present. The previous record is kept under "beforeArt"; --undo restores it.
"""
import datetime
import glob
import json
import pathlib
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent / "design" / "naming"
DEC = ROOT / "decisions.json"


def now() -> str:
    return datetime.datetime.now(datetime.timezone.utc).isoformat().replace("+00:00", "Z")


def main() -> None:
    dec = json.loads(DEC.read_text())
    items = dec["items"]
    if "--undo" in sys.argv:
        n = 0
        for rec in items.values():
            if "beforeArt" in rec:
                before = rec.pop("beforeArt")
                rec.clear()
                rec.update(before)
                rec["updatedAt"] = now()
                n += 1
        DEC.write_text(json.dumps(dec, indent=2) + "\n")
        print(f"undid {n} art-slate decisions")
        return
    repl = {}
    for f in sorted(glob.glob(str(ROOT / "replacements" / "*.json"))):
        for r in json.loads(pathlib.Path(f).read_text()).get("replaces", []):
            repl[r["key"]] = r["idea"]
    t = now()
    applied, owner = 0, []
    for s in json.loads((ROOT / "art" / "slate.json").read_text())["items"]:
        rec = items[s["key"]]
        d = rec["decision"]
        if d.get("by") == "owner":
            owner.append(f'{s["key"]} ({s["verdict"]}: {s["reason"]})')
            continue
        if d.get("by") == "verified":
            raise SystemExit(f'{s["key"]} is a verified merge; the slate should only hold survivors (re-run scripts/art-audit.py)')
        if "beforeArt" not in rec:
            rec["beforeArt"] = json.loads(json.dumps(rec))
        rec["decision"] = {"choice": s["verdict"], "target": None, "note": f'ART-STYLE rule {s["rule"]}: {s["reason"]}',
                           "replacement": repl.get(s["key"]), "by": "art"}
        rec["updatedAt"] = t
        applied += 1
    DEC.write_text(json.dumps(dec, indent=2) + "\n")
    print(f"applied {applied} art-slate decisions ({sum(1 for r in items.values() if r["decision"].get("by") == "art" and r["decision"].get("replacement"))} carry a replacement idea)")
    if owner:
        print("left alone because you decided them:\n  " + "\n  ".join(owner))


if __name__ == "__main__":
    main()
