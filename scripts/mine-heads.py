#!/usr/bin/env python3
"""Recall miner: find candidate answers in real source trees by head noun ("<modifier> lock", "<x>_mutex").

Usage: python3 -I scripts/mine-heads.py <bank-file.md> <head,head,...> <dir> [<dir> ...]
Prints phrases ending in one of the head nouns, with how many files mention them, skipping names (and aliases)
already in the bank file. It is a recall source only: output is noisy and needs a membership judgement.
"""
import collections
import os
import pathlib
import re
import sys

EXTS = {".rst", ".txt", ".md", ".9", ".3", ".2", ".h", ".c", ".hpp", ".cpp", ".cc", ".java", ".rs", ".py", ".yml", ".sgml", ".xml", ".html"}
STOP = {"the", "a", "an", "this", "that", "of", "to", "and", "or", "is", "be", "in", "on", "for", "with", "no", "any",
        "each", "same", "its", "their", "one", "new", "per", "which", "from", "as", "by", "it", "not", "such", "all",
        "same", "other", "own", "your", "our", "his", "her", "if", "when", "then", "so", "can", "may", "must", "will",
        # verbs and quantifiers that precede a head noun in prose ("hold the lock", "two locks"), not kinds of it
        "hold", "holds", "holding", "held", "take", "takes", "taking", "took", "acquire", "acquires", "acquiring",
        "acquired", "release", "releases", "releasing", "released", "get", "gets", "grab", "drop", "drops", "need",
        "needs", "use", "uses", "using", "have", "has", "had", "require", "requires", "does", "do", "without",
        "after", "before", "while", "until", "these", "those", "two", "three", "single", "first", "only", "because",
        "number", "specific", "lock", "unlock", "try", "t", "s", "multiple", "several", "some", "every", "more",
        "less", "lot", "whole", "corresponding", "appropriate", "relevant", "necessary", "same", "given", "proper"}


def known(bank: pathlib.Path) -> set[str]:
    out = set()
    for line in bank.read_text().split("\n"):
        if line.startswith("- "):
            body = re.sub(r"\s+\(suggested: [a-z-]+\)$", "", line[2:].strip())
            out |= {n.strip().lower() for n in body.split(" | ")}
    return out


def main() -> None:
    if len(sys.argv) < 4:
        raise SystemExit(__doc__)
    have = known(pathlib.Path(sys.argv[1]))
    heads = [h.strip().lower() for h in sys.argv[2].split(",")]
    hp = "|".join(map(re.escape, heads))
    # "push lock", "read-mostly lock", "ERESOURCE"-style tokens are handled by the caller's heads;
    # identifiers like rm_rlock / lck_mtx / KeAcquireQueuedSpinLock are caught by the camel/snake rule.
    phrase = re.compile(rf"\b((?:[A-Za-z][\w+-]*\s+){{1,2}})({hp})s?\b", re.I)
    # Identifiers that end in a head noun: rm_rlock, lck_mtx_lock, EX_PUSH_LOCK, KeAcquireQueuedSpinLock.
    token = re.compile(r"\b[A-Za-z_][A-Za-z0-9_]{2,31}\b")
    heads_l = tuple(heads)
    files = collections.Counter()
    for root in sys.argv[3:]:
        for dp, _, fs in os.walk(root):
            for f in fs:
                if pathlib.Path(f).suffix.lower() not in EXTS:
                    continue
                try:
                    text = open(os.path.join(dp, f), errors="ignore").read()
                except OSError:
                    continue
                seen = set()
                for m in phrase.finditer(text):
                    words = [w for w in m.group(1).split() if w.lower() not in STOP]
                    if not words:
                        continue
                    seen.add((" ".join(words[-2:]) + " " + m.group(2)).lower())
                    seen.add((words[-1] + " " + m.group(2)).lower())
                for m in token.finditer(text):
                    t = m.group(0)
                    tl = t.lower()
                    # The head must start at a word boundary inside the identifier: rm_rlock, KeAcquireSpinLock,
                    # EX_PUSH_LOCK, but not block/clock/O_NONBLOCK's "lock".
                    for h in heads:
                        if not tl.endswith(h) or tl == h:
                            continue
                        cut = len(t) - len(h)
                        if t[cut - 1] == "_" or (t[cut].isupper() and (t[cut - 1].islower() or t.isupper() is False)):
                            if not tl.endswith("block") and not tl.endswith("clock"):
                                seen.add(t)
                            break
                files.update(seen)
    for p, n in files.most_common():
        if n < 2:
            break
        if p.lower() in have:
            continue
        print(f"{n:6d}  {p}")


if __name__ == "__main__":
    main()
