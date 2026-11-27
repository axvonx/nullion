#!/usr/bin/env python3
"""Make every obvious answer (scripts/bank/obvious/<id>.json) accepted, without touching anything else.

Usage: python3 -I scripts/apply-obvious.py <id> [<id> ...]

For each obvious group {name, aliases, tier}:
- if any of its names already matches an answer line, the missing names are appended to THAT line as aliases;
- if none matches, the group becomes a new "(auto)" answer at its tier (off-by-one or npe);
- a name whose key already belongs to a DIFFERENT answer is skipped (it would make matching ambiguous), and
  is printed so a person can decide.
Keys are the game's own normalize() (ported in scripts/wikidata-merge.py). Existing lines are never moved
or removed. Inbox lines don't count as answers.
"""
import json
import pathlib
import re
import sys
import importlib.util

REPO = pathlib.Path(__file__).resolve().parent.parent
_spec = importlib.util.spec_from_file_location("wm", REPO / "scripts" / "wikidata-merge.py")
assert _spec is not None and _spec.loader is not None
wm = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(wm)  # reuse key() (the game's normalize) and the tier headings
key, HEADINGS, HEAD_OF, ORDER = wm.key, wm.HEADINGS, wm.HEAD_OF, wm.ORDER
SUFFIX = re.compile(r"\s+\((?:auto|suggested: [a-z-]+)\)$")


def apply(cid: str) -> None:
    hits = [h for h in (REPO / "bank").glob(f"*/{cid}.md") if h.parent.name != "reports"]
    if len(hits) != 1:
        raise RuntimeError(f"{cid}: expected one bank file, found {len(hits)}")
    path = hits[0]
    groups = json.loads((REPO / "scripts" / "bank" / "obvious" / f"{cid}.json").read_text())
    lines = path.read_text().rstrip("\n").split("\n")

    owner: dict[str, int] = {}  # key -> line index of the answer that owns it (tiered sections only)
    inbox: dict[str, int] = {}  # key -> Inbox line index; an obvious answer found there is promoted
    section = None
    for i, l in enumerate(lines):
        if l.startswith("## "):
            section = l[3:].strip()
        elif l.startswith("- "):
            for n in SUFFIX.sub("", l[2:].strip()).split(" | "):
                if key(n):
                    (inbox if section == "Inbox" else owner)[key(n)] = i
    promoted: set[int] = set()

    appended: dict[int, list[str]] = {}
    new: dict[str, list[str]] = {}
    skipped: list[str] = []
    for g in groups:
        names = [g["name"], *g.get("aliases", [])]
        names = [n.strip() for n in names if n.strip() and "|" not in n and key(n)]
        anchors = {owner[key(n)] for n in names if key(n) in owner}
        if len(anchors) > 1:
            skipped.append(f"{g['name']} (its names match {len(anchors)} different answers)")
            continue
        if anchors:
            i = anchors.pop()
            for n in list(names):  # Inbox lines holding these names fold into the answer and go
                j = inbox.get(key(n))
                if j is not None and j not in promoted:
                    promoted.add(j)
                    names += SUFFIX.sub("", lines[j][2:].strip()).split(" | ")
            for n in names:
                if key(n) not in owner:
                    appended.setdefault(i, []).append(n)
                    owner[key(n)] = i
            continue
        # Inbox lines holding any of these names are promoted: their names join the new answer, the line goes.
        for n in list(names):
            i = inbox.get(key(n))
            if i is not None and i not in promoted:
                promoted.add(i)
                names += SUFFIX.sub("", lines[i][2:].strip()).split(" | ")
        tier = g.get("tier")
        if tier not in ("off-by-one", "npe"):
            raise RuntimeError(f"{cid}: obvious answer {g['name']!r} needs tier off-by-one or npe, got {tier!r}")
        fresh = []
        for n in names:
            if key(n) in owner or key(n) in {key(x) for x in fresh}:
                continue
            fresh.append(n)
        if not fresh:
            continue
        new.setdefault(tier, []).append("- " + " | ".join(fresh) + " (auto)")
        for n in fresh:
            owner[key(n)] = -1  # claimed by the new line

    for i, als in appended.items():
        m = SUFFIX.search(lines[i])
        head, tail = (lines[i][: m.start()], lines[i][m.start():]) if m else (lines[i], "")
        lines[i] = head + "".join(f" | {a}" for a in als) + tail
    for i in sorted(promoted, reverse=True):
        del lines[i]
    if promoted and not any(l.startswith("- ") for l in lines[lines.index("## Inbox") + 1:]):
        k = lines.index("## Inbox")
        del lines[k]
        while k - 1 >= 0 and k - 1 < len(lines) and lines[k - 1] == "":
            del lines[k - 1]
            k -= 1
    for tier, ls in new.items():
        heading = "## " + HEADINGS[tier]
        if heading not in lines:
            pos = len(lines)
            for later in ORDER[ORDER.index(tier) + 1:]:
                if "## " + HEAD_OF[later] in lines:
                    pos = lines.index("## " + HEAD_OF[later])
                    break
            lines[pos:pos] = [heading, ""] if pos < len(lines) else ["", heading]
        j = lines.index(heading) + 1
        while j < len(lines) and (lines[j].startswith("- ") or lines[j].startswith("  note:")):
            j += 1
        lines[j:j] = ls
    path.write_text("\n".join(lines) + "\n")
    print(f"{cid}: {sum(map(len, appended.values()))} aliases, {sum(map(len, new.values()))} new answers, {len(promoted)} promoted from the Inbox"
          + (f"; skipped: {'; '.join(skipped)}" if skipped else ""))


if __name__ == "__main__":
    if len(sys.argv) < 2:
        raise SystemExit(__doc__)
    for cid in sys.argv[1:]:
        apply(cid)
