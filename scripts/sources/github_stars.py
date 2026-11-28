#!/usr/bin/env python3
"""GitHub stars per Repology project: a familiarity signal that is current (unlike Wikipedia and Stack Exchange,
which lag a new tool by years: Ghostty, 2024, has no article and one question, and 64k stars). Stdlib + `gh`.

The project -> repo map is ~/nullion-corpora/repology/github-repos.tsv.gz (fetch-corpora.py repology). Stars,
description and topics come from GitHub's GraphQL API through `gh api graphql` (the logged-in user's token; only
public repository metadata is read), 100 repos per request, cached in ~/nullion-corpora/derived/github-stars.json
with the fetch date; entries older than MAX_AGE_DAYS are refetched. A repo GitHub no longer has is cached as null.

  python3 -I scripts/sources/github_stars.py <owner/repo>...     print the cached or fetched rows
"""
import datetime
import gzip
import json
import pathlib
import subprocess
import sys

CORPORA = pathlib.Path("~/nullion-corpora").expanduser()
MAP = CORPORA / "repology" / "github-repos.tsv.gz"
CACHE = CORPORA / "derived" / "github-stars.json"
MAX_AGE_DAYS = 60
BATCH = 100


def repos_by_effname() -> dict[str, str]:
    if not MAP.exists():
        raise SystemExit(f"no {MAP}: python3 -I scripts/fetch-corpora.py repology")
    out = {}
    with gzip.open(MAP, "rt") as f:
        f.readline()
        for line in f:
            eff, repo, _, _ = line.rstrip("\n").split("\t")
            out[eff] = repo
    return out


def _query(repos: list[str]) -> dict[str, dict | None]:
    parts = []
    for i, r in enumerate(repos):
        owner, name = r.split("/", 1)
        parts.append(f'r{i}: repository(owner: {json.dumps(owner)}, name: {json.dumps(name)}) '
                     '{ nameWithOwner stargazerCount description repositoryTopics(first: 20) { nodes { topic { name } } } }')
    q = "query {\n" + "\n".join(parts) + "\n}"
    p = subprocess.run(["gh", "api", "graphql", "-f", f"query={q}"], capture_output=True, text=True)
    # A missing repo is a per-alias NOT_FOUND error with the other aliases still answered, and gh exits 1 for it;
    # anything else (auth, rate limit, malformed reply) is fatal.
    try:
        d = json.loads(p.stdout)
    except json.JSONDecodeError:
        raise RuntimeError(f"gh api graphql failed (exit {p.returncode}): {p.stderr[:300]}") from None
    errs = [e for e in d.get("errors", []) if e.get("type") != "NOT_FOUND"]
    if errs or "data" not in d:
        raise RuntimeError(f"GitHub GraphQL errors: {json.dumps(errs or d)[:400]}")
    out: dict[str, dict | None] = {}
    for i, r in enumerate(repos):
        v = d["data"].get(f"r{i}")
        out[r] = None if v is None else {
            "stars": v["stargazerCount"], "name": v["nameWithOwner"], "description": v["description"] or "",
            "topics": [n["topic"]["name"] for n in v["repositoryTopics"]["nodes"]]}
    return out


def stars(repos: set[str]) -> dict[str, dict | None]:
    """repo -> {stars, name, description, topics} or None (gone); fetched as needed and cached."""
    cache = json.loads(CACHE.read_text()) if CACHE.exists() else {}
    today = datetime.date.today()
    stale = sorted(r for r in repos if r not in cache or
                   (today - datetime.date.fromisoformat(cache[r]["at"])).days > MAX_AGE_DAYS)
    for i in range(0, len(stale), BATCH):
        got = _query(stale[i:i + BATCH])
        for r, v in got.items():
            cache[r] = {"at": today.isoformat(), "repo": v}
        CACHE.parent.mkdir(parents=True, exist_ok=True)
        tmp = CACHE.with_name(CACHE.name + ".part")
        tmp.write_text(json.dumps(cache, indent=0, sort_keys=True) + "\n")
        tmp.replace(CACHE)
        print(f"  github stars: {min(i + BATCH, len(stale))}/{len(stale)} fetched", flush=True)
    return {r: cache[r]["repo"] for r in repos}


if __name__ == "__main__":
    if len(sys.argv) < 2:
        raise SystemExit(__doc__)
    for r, v in stars(set(sys.argv[1:])).items():
        print(r, v)
