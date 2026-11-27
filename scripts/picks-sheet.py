#!/usr/bin/env python3
"""The Bit Flip / Works on my machine picks sheet: one Markdown file you tick, read back into the pipeline.

  python3 -I scripts/picks-sheet.py write <id> [<id> ...]   (re)writes bank/picks.md from each category's
                                                            scripts/bank/mined/<id>/picks.json proposals
  python3 -I scripts/picks-sheet.py read                    prints {id: {"bitflip": name, "womm": name}} as JSON

In the sheet, tick exactly one box per list ("- [x] name"), or write your own as "- [x] other: name". A
category with no tick in a list, or two, is an error on read, so nothing launches with a half-made pick.
"""
import json
import pathlib
import re
import sys

REPO = pathlib.Path(__file__).resolve().parent.parent
SHEET = REPO / "bank" / "picks.md"
BOX = re.compile(r"^- \[( |x|X)\] (.+)$")


def write(ids: list[str]) -> None:
    out = ["# Bit Flip and Works on my machine picks", "",
           "Tick exactly one box per list (`[x]`). To use an answer that isn't listed, tick `other:` and type it.",
           "Works on my machine is the cliché \"I'm being clever\" pick; Bit Flip is the single most delightful deep cut.", ""]
    for cid in ids:
        picks = json.loads((REPO / "scripts" / "bank" / "mined" / cid / "picks.json").read_text())
        bank = [h for h in (REPO / "bank").glob(f"*/{cid}.md") if h.parent.name != "reports"]
        if len(bank) != 1:
            raise RuntimeError(f"{cid}: expected one bank file, found {len(bank)}")
        prompt = bank[0].read_text().split("\n", 1)[0].removeprefix("# ")
        out += [f"## {cid}", f"_{prompt}_", "", "Works on my machine:"]
        out += [f"- [ ] {n}" for n in picks.get("womm_candidates", [])] + ["- [ ] other: ", "", "Bit Flip:"]
        out += [f"- [ ] {n}" for n in picks.get("bitflip_candidates", [])] + ["- [ ] other: ", ""]
    SHEET.write_text("\n".join(out) + "\n")
    print(f"wrote {SHEET.relative_to(REPO)} with {len(ids)} categories")


def read() -> dict:
    result, cid, kind = {}, None, None
    for n, line in enumerate(SHEET.read_text().split("\n"), 1):
        if line.startswith("## "):
            cid = line[3:].strip()
            result[cid] = {"womm": [], "bitflip": []}
        elif line.strip() == "Works on my machine:":
            kind = "womm"
        elif line.strip() == "Bit Flip:":
            kind = "bitflip"
        elif (m := BOX.match(line)) and m.group(1) in "xX":
            if cid is None or kind is None:
                raise RuntimeError(f"bank/picks.md:{n}: a tick outside any category list")
            name = m.group(2).strip()
            if name.startswith("other:"):
                name = name[len("other:"):].strip()
                if not name:
                    raise RuntimeError(f"bank/picks.md:{n}: 'other:' is ticked but empty")
            result[cid][kind].append(name)
    out = {}
    for cid, kinds in result.items():
        for kind, names in kinds.items():
            if len(names) != 1:
                raise RuntimeError(f"bank/picks.md: {cid} needs exactly one {kind} tick, has {len(names)}")
        out[cid] = {k: v[0] for k, v in kinds.items()}
    return out


if __name__ == "__main__":
    if len(sys.argv) >= 3 and sys.argv[1] == "write":
        write(sys.argv[2:])
    elif sys.argv[1:] == ["read"]:
        print(json.dumps(read(), indent=1, ensure_ascii=False))
    else:
        raise SystemExit(__doc__)
