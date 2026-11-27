#!/usr/bin/env python3
"""List likely duplicate answers inside each bank category: two entries that are the same answer said two ways.

Usage: python3 -I scripts/bank-dupes.py [--include-draft] [<category id> ...]

Two entries are flagged when one's name, with a plural made singular or the prompt's own noun (or "projection",
"extension", "language", … the generic nouns the matcher strips, src/core/match.ts) dropped off the end, is the
other's name or alias: "Sinusoidal" vs "Sinusoidal projection", RISC-V "M" vs "M extension". The matcher already
lands both phrasings on an answer, but they are separate entries with separate tiers, which the content pass should
merge (one entry, the other as an alias). Read-only: it prints, it never edits a bank file.
Only approved categories are checked unless --include-draft is given (the content pipeline uses it).
"""
import glob
import pathlib
import re
import sys
import unicodedata

ROOT = pathlib.Path(__file__).resolve().parent.parent
GENERIC = ["algorithm", "algo", "language", "lang", "filesystem", "file system", "fs", "format", "file format",
           "protocol", "scheme", "function", "command", "tool", "module", "extension", "license", "licence", "os",
           "operating system", "attack", "cipher", "allocator", "technique", "projection"]


def norm(s: str) -> str:
    s = unicodedata.normalize("NFKD", s)
    s = "".join(ch for ch in s if not unicodedata.combining(ch)).lower().replace("+", "plus").replace("#", "sharp").replace("*", "star")
    return re.sub(r"[\W_]", "", s)


def subject(prompt: str) -> str:
    m = re.match(r"^name (?:an?|the)\s+(?:(?:type|kind|sort|form) of\s+)?(.+?)[.?!]?$", prompt.strip(), re.I)
    return (m.group(1) if m else prompt).lower()


def stripped(name: str, tails: list[str]) -> set[str]:
    words = name.lower().split()
    out = set()
    for t in tails:
        tw = t.split()
        if len(words) > len(tw) and [w.rstrip("s") for w in words[-len(tw):]] == [w.rstrip("s") for w in tw]:
            out.add(norm(" ".join(words[: -len(tw)])))
    last = words[-1] if words else ""
    if len(last) > 3 and last.endswith("s"):
        out.add(norm(" ".join(words[:-1] + [last[:-1]])))
    return out - {""}


def main() -> None:
    drafts = "--include-draft" in sys.argv
    want = set(a for a in sys.argv[1:] if a != "--include-draft")
    total = 0
    for f in sorted(glob.glob(str(ROOT / "bank" / "*" / "*.md"))):
        text = pathlib.Path(f).read_text()
        cid = re.search(r"^id: ([^ ]+)", text, re.M)
        if not cid or (want and cid.group(1) not in want) or ("status: approved" not in text and not drafts):
            continue
        subj = subject(text.splitlines()[0][2:])
        tails = sorted({subj, subj.split()[-1], *GENERIC}, key=len, reverse=True)
        entries = []
        for line in text.split("## Inbox")[0].splitlines():
            if line.startswith("- "):
                names = [p.strip() for p in re.sub(r"\s*\(auto\)\s*$", "", line[2:]).split("|")]
                entries.append((names[0], {norm(n) for n in names}))
        owner = {k: name for name, keys in entries for k in keys}
        for name, _ in entries:
            for s in stripped(name, tails):
                other = owner.get(s)
                if other and other != name:
                    print(f"{cid.group(1)}: '{name}' duplicates '{other}'")
                    total += 1
    print(f"{total} likely duplicates")


if __name__ == "__main__":
    main()
