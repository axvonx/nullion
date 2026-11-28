#!/usr/bin/env python3
"""Promote a category's Inbox lines into their suggested tiers, as unconfirmed `(auto)` answers.

Usage: python3 -I scripts/bank/promote-inbox.py <category id>... | --approved [--dry-run]

Each `- name | alias (suggested: <tier>)` line in `## Inbox` moves to the end of its tier's section as
`- name | alias (auto)` (an `(auto)` answer plays its full tier; deleting the marker confirms it). A line stays in the
Inbox, and the run says why, when:
  - it suggests Bit Flip or Works on my machine (those are hand-picked, never auto);
  - it has no suggested tier;
  - any of its names is already a name or alias elsewhere in the file (a duplicate key is a load error: merge by hand).
Prints what moved and what stayed, then regenerates bank/index.md. Never deletes a line.
"""
import pathlib
import re
import subprocess
import sys

HERE = pathlib.Path(__file__).resolve().parent
REPO = HERE.parent.parent
sys.path.insert(0, str(HERE))
import misses  # noqa: E402  # pyright: ignore[reportMissingImports]  (norm = the game's normalize)

HEADINGS = {"off-by-one": "Off-by-one", "npe": "Null pointer exception", "leak": "Memory leak",
            "race": "Race condition", "heisenbug": "Heisenbug"}
ORDER = ["Off-by-one", "Works on my machine", "Null pointer exception", "Memory leak", "Race condition", "Heisenbug",
         "Bit Flip"]
SUGGESTED = re.compile(r"^- (.*?)\s+\(suggested: ([a-z-]+)\)$")


def promote(path: pathlib.Path, dry: bool) -> tuple[int, list[str]]:
    lines = path.read_text().split("\n")
    inbox_at = lines.index("## Inbox") if "## Inbox" in lines else None
    if inbox_at is None:
        return 0, []
    head, inbox = lines[:inbox_at], lines[inbox_at + 1:]
    taken = misses.playable_keys("\n".join(head))
    moved: dict[str, list[str]] = {}
    kept, notes = [], []
    for line in inbox:
        if not line.startswith("- "):
            kept.append(line)
            continue
        m = SUGGESTED.match(line)
        if not m:
            kept.append(line)
            notes.append(f"stays (no suggested tier): {line}")
            continue
        body, tier = m.group(1), m.group(2)
        if tier not in HEADINGS:
            kept.append(line)
            notes.append(f"stays ({tier} is hand-picked, never auto): {line}")
            continue
        keys = {misses.norm(p.strip()) for p in body.split("|") if p.strip()}
        clash = keys & taken
        if clash:
            kept.append(line)
            notes.append(f"stays (already in the bank as {sorted(clash)}: merge by hand): {line}")
            continue
        taken |= keys
        moved.setdefault(HEADINGS[tier], []).append(f"- {body} (auto)")
    if not moved:
        return 0, notes
    out = list(head)
    for heading, new in moved.items():
        if f"## {heading}" not in out:  # a tier with no answers yet: add its section in tier order
            later = [h for h in ORDER[ORDER.index(heading) + 1:] if f"## {h}" in out]
            at = out.index(f"## {later[0]}") if later else len(out)
            while at > 0 and out[at - 1] == "":
                at -= 1
            out[at:at] = ["", f"## {heading}"]
        i = out.index(f"## {heading}") + 1
        while i < len(out) and not out[i].startswith("## "):
            i += 1
        while out[i - 1] == "":  # insert after the section's last line, before its trailing blank lines
            i -= 1
        out[i:i] = new
    rest = [l for l in kept if l.strip()]
    text = "\n".join(out).rstrip("\n") + "\n" + ("\n## Inbox\n" + "\n".join(rest) + "\n" if rest else "")
    if not dry:
        path.write_text(text)
    return sum(map(len, moved.values())), notes


def main() -> None:
    args = [a for a in sys.argv[1:] if a != "--dry-run"]
    dry = "--dry-run" in sys.argv
    if args == ["--approved"]:
        ids = [p.stem for p in sorted((REPO / "bank").glob("*/*.md"))
               if p.parent.name != "reports" and re.search(r"· status: approved\b", p.read_text())]
    elif args and "--approved" not in args:
        ids = args
    else:
        raise SystemExit(__doc__)
    total = 0
    for cid in ids:
        n, notes = promote(misses.bank_file(cid), dry)
        total += n
        if n or notes:
            print(f"{cid}: {n} promoted")
            for x in notes:
                print(f"  {x}")
    print(f"{total} Inbox lines promoted{' (dry run: nothing written)' if dry else ''}")
    if not dry and total:
        subprocess.run(["npm", "run", "-s", "bank:index"], cwd=REPO, check=True, capture_output=True)


if __name__ == "__main__":
    main()
