#!/usr/bin/env python3
"""Add Wikidata items (or any name list) to an existing bank category as unconfirmed (auto) answers.

Usage: python3 -I scripts/wikidata-merge.py <id> <source.json> [--lowercase-only] [--default-tier T]
  source.json is either a Wikidata SPARQL JSON result (?label, ?links sitelinks, ?aliases "a|b|c"),
  or a plain list: [{"name": ..., "aliases": [...], "tier": ...}].

- The tier comes from Wikidata sitelinks (how many Wikipedia editions have an article), algillion's
  familiarity signal: SITELINK_TIERS below. Plain-list entries carry their own tier, or --default-tier.
- New answers are appended inside their tier's section as "(auto)", a review label (they play their full
  tier). Existing lines are never moved, edited or deleted (your edits win). Anything whose
  name or alias already exists in the file is skipped.
- Names and aliases are cleaned: Wikipedia-style disambiguators like "(programming language)" are stripped,
  and aliases shorter than 3 characters, or claimed by two new entries, are dropped.
- --lowercase-only keeps only items whose label starts lowercase. Wikidata writes common nouns ("deadlock")
  in lowercase and proper names ("Log4Shell") capitalised, which separates kinds from named instances.
"""
import json
import pathlib
import re
import sys
import unicodedata

REPO = pathlib.Path(__file__).resolve().parent.parent
SITELINK_TIERS = [(100, "off-by-one"), (50, "npe"), (25, "leak"), (8, "race"), (0, "heisenbug")]
HEADINGS = {"off-by-one": "Off-by-one", "npe": "Null pointer exception", "leak": "Memory leak",
            "race": "Race condition", "heisenbug": "Heisenbug"}
ORDER = ["off-by-one", "womm", "npe", "leak", "race", "heisenbug", "bitflip"]
HEAD_OF = {**HEADINGS, "womm": "Works on my machine", "bitflip": "Bit Flip"}
DISAMBIG = re.compile(r"\s*\((?:programming language|operating system|software|computing|computer science|algorithm|language|OS)\)$", re.I)


def key(s: str) -> str:
    """Exactly the game's normalize() (src/core/match.ts), so a collision here is a collision in play."""
    s = "".join(c for c in unicodedata.normalize("NFKD", s) if not unicodedata.category(c).startswith("M"))
    s = s.lower().replace("+", "plus").replace("#", "sharp").replace("*", "star")
    return "".join(c for c in s if unicodedata.category(c)[0] in "LN")


def load(path: pathlib.Path, lowercase_only: bool, default_tier: str | None) -> list[dict]:
    raw = json.loads(path.read_text())
    out = []
    if isinstance(raw, dict):
        for b in raw["results"]["bindings"]:
            label = DISAMBIG.sub("", b["label"]["value"]).strip()
            if not label or re.fullmatch(r"Q\d+", label):
                continue
            if lowercase_only and not label[0].islower():
                continue
            links = int(b["links"]["value"])
            tier = next(t for cut, t in SITELINK_TIERS if links >= cut)
            als = [DISAMBIG.sub("", a).strip() for a in b.get("aliases", {}).get("value", "").split("|") if a.strip()]
            out.append({"name": label, "aliases": als, "tier": tier, "links": links})
    else:
        for e in raw:
            t = e.get("tier", default_tier)
            if t not in HEADINGS:
                raise RuntimeError(f"{path}: {e.get('name')!r} needs a tier (or pass --default-tier)")
            out.append({"name": e["name"], "aliases": e.get("aliases", []), "tier": t, "links": -1})
    return out


def main() -> None:
    args = sys.argv[1:]
    if len(args) < 2:
        raise SystemExit(__doc__)
    cid, src = args[0], pathlib.Path(args[1])
    lowercase_only = "--lowercase-only" in args
    default_tier = args[args.index("--default-tier") + 1] if "--default-tier" in args else None
    hits = [h for h in (REPO / "bank").glob(f"*/{cid}.md") if h.parent.name != "reports"]
    if len(hits) != 1:
        raise RuntimeError(f"{cid}: expected one bank file, found {len(hits)}")
    path = hits[0]
    lines = path.read_text().rstrip("\n").split("\n")
    taken = set()
    for l in lines:
        if l.startswith("- "):
            body = re.sub(r"\s+\((?:auto|suggested: [a-z-]+)\)$", "", l[2:].strip())
            taken |= {key(n) for n in body.split(" | ")}

    items = sorted(load(src, lowercase_only, default_tier), key=lambda e: -e["links"])  # better-known items win ties
    claims: dict[str, int] = {}
    for e in items:
        for n in [e["name"], *e["aliases"]]:
            claims[key(n)] = claims.get(key(n), 0) + 1
    added: dict[str, list[str]] = {t: [] for t in HEADINGS}
    for e in items:
        # Names that normalise to nothing (the esolang "///") can't be typed into a match at all.
        if not key(e["name"]) or key(e["name"]) in taken or len(e["name"]) < 2 or "|" in e["name"]:
            continue
        als = []
        for a in e["aliases"]:
            k = key(a)
            if not k or len(a) < 3 or "|" in a or k in taken or claims.get(k, 0) > 1 or k == key(e["name"]) or k in {key(x) for x in als}:
                continue
            als.append(a)
        for n in [e["name"], *als]:
            taken.add(key(n))
        added[e["tier"]].append("- " + " | ".join([e["name"], *als]) + " (auto)")

    # Insert each tier's additions at the end of its section, creating the section in order if it's missing.
    for t, new in added.items():
        if not new:
            continue
        heading = "## " + HEADINGS[t]
        if heading not in lines:
            pos = len(lines)
            for later in ORDER[ORDER.index(t) + 1:]:
                h = "## " + HEAD_OF[later]
                if h in lines:
                    pos = lines.index(h)
                    break
            lines[pos:pos] = [heading, ""] if pos < len(lines) else ["", heading]
        j = lines.index(heading) + 1
        while j < len(lines) and (lines[j].startswith("- ") or lines[j].startswith("  note:")):
            j += 1
        lines[j:j] = new
    path.write_text("\n".join(lines) + "\n")
    print(f"{cid}: added {sum(map(len, added.values()))} ({', '.join(f'{t} {len(v)}' for t, v in added.items())})")


if __name__ == "__main__":
    main()
