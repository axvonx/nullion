#!/usr/bin/env python3
"""Build SQLite FTS5 phrase indexes over the local corpora (dblp titles, arXiv cs metadata, kernel docs).

Usage:
  python3 -I scripts/index-corpora.py dblp   ~/nullion-corpora
  python3 -I scripts/index-corpora.py arxiv  ~/nullion-corpora
  python3 -I scripts/index-corpora.py kernel ~/nullion-corpora
  python3 -I scripts/index-corpora.py query  ~/nullion-corpora "fissile lock" ["maple tree" ...]

Each source gets its own table in <root>/index/corpora.sqlite, rebuilt from scratch on each run.
"""
import gzip
import html
import pathlib
import re
import sqlite3
import sys
import time

TAG = re.compile(r"<[^>]+>")
RECORD_START = re.compile(r"^<(article|inproceedings|proceedings|book|incollection|phdthesis|mastersthesis|www|data) ")


def db(root: pathlib.Path) -> sqlite3.Connection:
    (root / "index").mkdir(exist_ok=True)
    con = sqlite3.connect(root / "index" / "corpora.sqlite")
    con.execute("PRAGMA journal_mode=WAL")
    return con


def fresh_table(con: sqlite3.Connection, name: str, cols: str) -> None:
    con.execute(f"DROP TABLE IF EXISTS {name}")
    con.execute(f"CREATE VIRTUAL TABLE {name} USING fts5({cols}, tokenize='porter unicode61 remove_diacritics 2')")


def clean(s: str) -> str:
    return html.unescape(TAG.sub("", s)).strip()


def index_dblp(root: pathlib.Path) -> None:
    src = root / "dblp" / "dblp.xml.gz"
    if not src.exists():
        raise SystemExit(f"missing {src}")
    con = db(root)
    fresh_table(con, "dblp", "title, year UNINDEXED, kind UNINDEXED")
    batch, n, kind, year = [], 0, "", ""
    t0 = time.time()
    with gzip.open(src, "rt", encoding="utf-8", errors="strict") as f:
        for line in f:
            m = RECORD_START.match(line)
            if m:
                kind, year = m.group(1), ""
                if kind == "www":  # person/homepage records, not publications
                    kind = ""
                continue
            if not kind:
                continue
            if line.startswith("<year>"):
                year = clean(line)
            elif line.startswith("<title>"):
                # Titles can span lines in rare cases; collect until the closing tag.
                buf = line
                while "</title>" not in buf:
                    nxt = f.readline()
                    if not nxt:
                        raise RuntimeError("unterminated <title> at end of file")
                    buf += nxt
                batch.append((clean(buf), year, kind))
                n += 1
                if len(batch) >= 50_000:
                    con.executemany("INSERT INTO dblp VALUES (?,?,?)", batch)
                    batch.clear()
                    print(f"dblp: {n:,} titles ({time.time() - t0:.0f}s)", flush=True)
    con.executemany("INSERT INTO dblp VALUES (?,?,?)", batch)
    con.commit()
    if n < 1_000_000:
        raise RuntimeError(f"only {n} dblp titles parsed; the dump format probably changed")
    print(f"dblp done: {n:,} titles")


ARXIV_RECORD = re.compile(r"<record>(.*?)</record>", re.S)


def field(rec: str, name: str) -> str:
    m = re.search(rf"<{name}>(.*?)</{name}>", rec, re.S)
    return clean(re.sub(r"\s+", " ", m.group(1))) if m else ""


def index_arxiv(root: pathlib.Path) -> None:
    pages = sorted((root / "arxiv" / "pages").glob("*.xml"))
    if not pages:
        raise SystemExit("no arXiv pages harvested yet")
    if not (root / "arxiv" / "DONE").exists():
        print("warning: arXiv harvest not finished; indexing the pages present so far", flush=True)
    con = db(root)
    fresh_table(con, "arxiv", "title, abstract, id UNINDEXED, categories UNINDEXED, created UNINDEXED")
    n = 0
    for p in pages:
        rows = []
        for rec in ARXIV_RECORD.findall(p.read_text(encoding="utf-8")):
            rows.append((field(rec, "title"), field(rec, "abstract"), field(rec, "id"), field(rec, "categories"), field(rec, "created")))
        con.executemany("INSERT INTO arxiv VALUES (?,?,?,?,?)", rows)
        n += len(rows)
    con.commit()
    print(f"arxiv done: {n:,} records from {len(pages)} pages")


def index_kernel(root: pathlib.Path) -> None:
    docs = root / "kernel" / "linux" / "Documentation"
    if not docs.is_dir():
        raise SystemExit(f"missing {docs}")
    con = db(root)
    fresh_table(con, "kernel", "body, path UNINDEXED")
    n = 0
    for p in docs.rglob("*"):
        if not p.is_file() or p.suffix not in {".rst", ".txt", ""}:
            continue
        text = p.read_text(encoding="utf-8", errors="replace")
        # One row per paragraph, so counts mean "paragraphs mentioning it", not files.
        rows = [(para, str(p.relative_to(docs))) for para in re.split(r"\n\s*\n", text) if para.strip()]
        con.executemany("INSERT INTO kernel VALUES (?,?)", rows)
        n += len(rows)
    con.commit()
    print(f"kernel done: {n:,} paragraphs")


def query(root: pathlib.Path, terms: list[str]) -> None:
    con = db(root)
    tables = [t for (t,) in con.execute("SELECT name FROM sqlite_master WHERE name IN ('dblp','arxiv','kernel')")]
    for term in terms:
        phrase = '"' + term.replace('"', '""') + '"'
        counts = {t: con.execute(f"SELECT count(*) FROM {t} WHERE {t} MATCH ?", (phrase,)).fetchone()[0] for t in tables}
        print(f"{term!r}: " + ", ".join(f"{t}={c}" for t, c in counts.items()))


def main() -> None:
    if len(sys.argv) < 3:
        raise SystemExit(__doc__)
    cmd, root = sys.argv[1], pathlib.Path(sys.argv[2]).expanduser()
    if cmd == "dblp":
        index_dblp(root)
    elif cmd == "arxiv":
        index_arxiv(root)
    elif cmd == "kernel":
        index_kernel(root)
    elif cmd == "query":
        query(root, sys.argv[3:])
    else:
        raise SystemExit(__doc__)


if __name__ == "__main__":
    main()
