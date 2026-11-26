#!/usr/bin/env python3
"""Harvest arXiv cs.* metadata (titles + abstracts) via the official OAI-PMH endpoint.

Writes each page of raw XML to <out>/pages/NNNNN.xml and the resumption token to <out>/token,
so an interrupted run resumes where it stopped. Honors 503 Retry-After as the arXiv docs require.

Usage: python3 -I scripts/harvest-arxiv.py ~/nullion-corpora/arxiv
"""
import pathlib
import re
import sys
import time
import urllib.error
import urllib.parse
import urllib.request

BASE = "https://oaipmh.arxiv.org/oai"
UA = "nullion-research/0.1"
PAUSE_S = 4  # be polite between pages


def fetch(url: str) -> str:
    for attempt in range(8):
        req = urllib.request.Request(url, headers={"User-Agent": UA})
        try:
            with urllib.request.urlopen(req, timeout=120) as r:
                return r.read().decode("utf-8")
        except urllib.error.HTTPError as e:
            if e.code == 503:
                wait = int(e.headers.get("Retry-After", "30"))
                print(f"503, retry after {wait}s", flush=True)
                time.sleep(wait)
                continue
            raise  # anything else is unexpected: stop loudly
        except (urllib.error.URLError, TimeoutError) as e:
            print(f"network error ({e}), attempt {attempt + 1}", flush=True)
            time.sleep(30)
    raise RuntimeError(f"giving up on {url}")


def main() -> None:
    if len(sys.argv) != 2:
        sys.exit(__doc__)
    out = pathlib.Path(sys.argv[1]).expanduser()
    pages = out / "pages"
    pages.mkdir(parents=True, exist_ok=True)
    token_file = out / "token"

    done_file = out / "DONE"
    if done_file.exists():
        print("harvest already complete")
        return
    n = len(list(pages.glob("*.xml")))
    token = token_file.read_text().strip() if token_file.exists() else None
    if n and not token:
        raise RuntimeError("pages exist but no resumption token and no DONE marker: state is inconsistent, inspect before rerunning")

    while True:
        if token:
            url = f"{BASE}?verb=ListRecords&resumptionToken={urllib.parse.quote(token)}"
        else:
            url = f"{BASE}?verb=ListRecords&set=cs&metadataPrefix=arXiv"
        xml = fetch(url)
        if "<error" in xml:
            raise RuntimeError(f"OAI-PMH error: {xml[:500]}")
        (pages / f"{n:05d}.xml").write_text(xml)
        n += 1
        m = re.search(r"<resumptionToken([^>]*)>([^<]*)</resumptionToken>", xml)
        size = re.search(r"completeListSize=['\"](\d+)['\"]", m.group(1)) if m else None
        print(f"page {n} saved; list size {size.group(1) if size else '?'}", flush=True)
        token = m.group(2).strip() if m else ""
        if not token:
            token_file.unlink(missing_ok=True)
            done_file.write_text("complete\n")
            print("done")
            return
        token_file.write_text(token)
        time.sleep(PAUSE_S)


if __name__ == "__main__":
    main()
