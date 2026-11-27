#!/usr/bin/env python3
"""Apply the provable merges from design/naming/dedup.json (scripts/naming-dedup.py) to design/naming/decisions.json.

Usage: python3 -I scripts/naming-apply-dedup.py [--undo]

Only verdict "same-entity" is applied (code-proven donor reuse, or pixel-identical sprites): the item becomes
decision {choice: "merge", target, by: "verified"} and takes its target's name, so the naming desk folds it into the
target's appearances. Anything the owner decided (by: "owner") is never touched. The previous record is kept under
"beforeMerge", so --undo restores every verified merge exactly.
"""
import datetime
import json
import pathlib
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent / "design" / "naming"
DEC = ROOT / "decisions.json"


def main() -> None:
    dec = json.loads(DEC.read_text())
    if "--undo" in sys.argv:
        n = 0
        for rec in dec["items"].values():
            if "beforeMerge" in rec:
                before = rec.pop("beforeMerge")
                rec.clear()
                rec.update(before)
                rec["updatedAt"] = datetime.datetime.now(datetime.timezone.utc).isoformat().replace("+00:00", "Z")
                n += 1
        DEC.write_text(json.dumps(dec, indent=2) + "\n")
        print(f"undid {n} verified merges")
        return

    dedup = json.loads((ROOT / "dedup.json").read_text())
    inv = {i["key"] for i in json.loads((ROOT / "inventory.json").read_text())["items"]}
    same = {r["key"]: r for r in dedup["items"] if r["verdict"] == "same-entity"}
    applied, kept_owner, already = 0, [], 0
    now = datetime.datetime.now(datetime.timezone.utc).isoformat().replace("+00:00", "Z")
    for key, r in same.items():
        target = r["target"]
        if key not in inv or target not in inv:
            raise SystemExit(f"dedup.json: {key} → {target}: unknown key (re-run scripts/naming-dedup.py)")
        if target == key or target in same:
            raise SystemExit(f"dedup.json: {key} → {target} is a self-merge or an unresolved chain")
        rec = dec["items"][key]
        if rec["name"].get("by") == "owner" or rec["decision"].get("by") == "owner":
            kept_owner.append(key)
            continue
        if rec["decision"].get("by") == "verified":
            already += 1
            continue
        rec["beforeMerge"] = json.loads(json.dumps({k: v for k, v in rec.items()}))
        rec["decision"] = {"choice": "merge", "target": target, "note": f'{r["proof"]}: {r["evidence"]}', "by": "verified"}
        rec["name"] = {"choice": "open", "proposal": None, "writeIn": "", "by": "verified"}
        rec["updatedAt"] = now
        applied += 1
    # Gemini's LLM-default merge/variant that the check disproved becomes "keep" (still an LLM default, with the reason).
    disproved = 0
    for r in dedup["items"]:
        if r["verdict"] != "not-duplicate":
            continue
        rec = dec["items"][r["key"]]
        if rec["decision"].get("by") == "llm" and rec["decision"]["choice"] in ("merge", "variant"):
            rec["decision"] = {"choice": "keep", "target": None, "note": f'not a duplicate ({r["proof"]}): {r["evidence"]}', "by": "llm"}
            rec["updatedAt"] = now
            disproved += 1
    DEC.write_text(json.dumps(dec, indent=2) + "\n")
    print(f"disproved Gemini merges reset to keep: {disproved}")
    print(f"applied {applied} verified merges ({already} already applied); left alone because you decided them: {kept_owner or 'none'}")


if __name__ == "__main__":
    main()
