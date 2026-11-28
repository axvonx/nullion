#!/usr/bin/env python3
"""Source-first derivation of "Name a Unix daemon". Stdlib only, no LLM, deterministic.

Usage: python3 -I scripts/sources/unix_daemon.py
Needs: python3 -I scripts/fetch-corpora.py debian homebrew stackexchange repology wikidata kernel-src freebsd-daemons macos

Membership (a union; each rule is mechanical, see the report for counts):
  debian:debtags      packages tagged interface::daemon: their daemon-like programs (below)
  debian:service-unit packages shipping a systemd .service unit: their daemon-like programs, and a unit named
                      after the package or one of its programs
  macos:launchd       /System/Library/LaunchDaemons programs; LaunchAgents programs only when daemon-like
  kernel:kthread      names given to kernel threads in the Linux source (kthread_run/kthread_create*'s format
                      string, smpboot's .thread_comm, a fixed comm[] string), cut at the first % or /, kept when
                      they start with "k" or end in "d" (kswapd, ksoftirqd, kthreadd, kauditd) and are not tests
  freebsd:rc.d        the program an rc.d script runs (command=, ${name} resolved), when it is daemon-like or the
                      script has a pidfile
  freebsd:man8        usr.sbin/libexec section-8 pages whose .Nd line says "daemon" or "server"
  curated             scripts/sources/curated/unix-daemon.json: 14 init systems, historical daemons and postgres no dataset
                      holds (each with a reason)
Daemon-like program: its name ends in "d", contains "daemon", or equals its package's name; never a *ctl client,
a unit/socket/config name, or a per-instance name (scope Out rules).
Aliases: the package (and its Repology project) when the package has exactly one daemon, Stack Exchange tag
synonyms, Wikidata aliases (classes daemon, init, web server, message transfer agent, name server) of a name match.
Familiarity: scripts/sources/common.py (se primary; popcon, Homebrew, sitelinks, Repology families, kernel-docs
mentions secondary).
Writes ~/nullion-corpora/derived/unix-daemon.json and design/sources/unix-daemon.md.
"""
import gzip
import json
import lzma
import pathlib
import re
import sys

sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent))
import common as C  # noqa: E402

CID = "unix-daemon"
DEB = C.CORPORA / "debian"
BIN_DIRS = ("usr/sbin/", "usr/bin/", "sbin/", "bin/")
UNIT_RE = re.compile(r"^(?:usr/)?lib/systemd/(?:system|user)/([^/@]+)\.service$")
TIMER_RE = re.compile(r"^(?:usr/)?lib/systemd/(?:system|user)/([^/@]+)\.timer$")
LIBEXEC_RE = re.compile(r"^usr/(?:libexec/[^/]+|lib/[^/]+/[^/]+)$")
SBIN_RE = re.compile(r"^(?:usr/)?sbin/")
HELPER_RE = re.compile(r"^(?:usr/)?lib/systemd/(systemd(?:-[\w-]+d)?)$")
TAILS = ["unix daemon", "daemon", "server", "service", "server daemon"]
WD_SLUGS = ["daemon", "init", "web-server", "message-transfer-agent", "name-server"]


def daemon_like(name: str, pkg: str | None) -> str | None:
    """None when it is a daemon name, else why not."""
    if len(name) < 3:
        return "shorter than 3 characters"
    if re.search(r"ctl$|\.(service|socket|conf)$|@", name):
        return "a client, unit or config name (scope Out)"
    if name == pkg or name.endswith("d") or "daemon" in name:
        return None
    return "not daemon-like (no -d suffix, no 'daemon', not its package's name)"


def debian(rejected: dict) -> tuple[list[C.Candidate], dict[str, set[str]]]:
    text = lzma.open(DEB / "Packages.xz", "rt", errors="replace").read()
    tags: dict[str, set[str]] = {}
    source_of: dict[str, str] = {}
    for block in text.split("\n\n"):
        m = re.search(r"^Package: (\S+)", block, re.M)
        t = re.search(r"^Tag: (.*(?:\n .*)*)", block, re.M)
        if m:
            tags[m.group(1)] = {x.strip() for x in t.group(1).replace("\n", " ").split(",")} if t else set()
            sm = re.search(r"^Source: (\S+)", block, re.M)
            source_of[m.group(1)] = sm.group(1) if sm else m.group(1)
    C.enforce(len(tags) > 50000, f"Debian Packages has only {len(tags)} packages: truncated?")
    progs: dict[str, dict[str, str]] = {}   # package -> program name -> its path
    units: dict[str, set[str]] = {}
    timers: dict[str, set[str]] = {}
    for line in gzip.open(DEB / "Contents-amd64.gz", "rt", errors="replace"):
        path, _, owners = line.rstrip("\n").rpartition(" ")
        path = path.strip()
        u, h = UNIT_RE.match(path), HELPER_RE.match(path)
        if u:
            name = u.group(1)
            for o in owners.split(","):
                units.setdefault(o.rsplit("/", 1)[-1], set()).add(name)
            continue
        tm = TIMER_RE.match(path)
        if tm:
            for o in owners.split(","):
                timers.setdefault(o.rsplit("/", 1)[-1], set()).add(tm.group(1))
            continue
        if h:
            name = h.group(1)
        elif path.startswith(BIN_DIRS) and path.count("/") <= 2 or LIBEXEC_RE.match(path):
            name = path.rsplit("/", 1)[1]
        else:
            continue
        for o in owners.split(","):
            progs.setdefault(o.rsplit("/", 1)[-1], {}).setdefault(name, path)
    C.enforce(len(progs) > 10000 and len(units) > 500, "Contents looks truncated")
    out = []
    # daemon packages: debtags interface::daemon, or "daemon" as a word of the package name (dbus-daemon)
    daemon_pkgs = {p for p, t in tags.items() if "interface::daemon" in t or re.search(r"(^|-)daemon(-|$)", p)}
    # a timer-driven unit is a scheduled job, not a daemon (logrotate.service + logrotate.timer)
    for pkg, ts in timers.items():
        for t in ts & units.get(pkg, set()):
            units[pkg].discard(t)
            rejected.setdefault(C.norm(t), f"Debian {pkg} unit {t}.service is started by {t}.timer: a job, not a daemon")
    by_source: dict[str, list[str]] = {}
    for q, src_ in source_of.items():
        by_source.setdefault(src_, []).append(q)
    for pkg in sorted(daemon_pkgs | set(units)):
        src = "debian:debtags" if pkg in daemon_pkgs else "debian:service-unit"
        stems = {pkg, re.sub(r"-(core|server|daemon|bin)$", "", pkg), pkg.split("-")[0].rstrip("0123456789")}
        mine, names = progs.get(pkg, {}), set()
        my_units = units.get(pkg, set())
        for n, path in mine.items():
            libexec, sbin = bool(LIBEXEC_RE.match(path)), bool(SBIN_RE.match(path) or HELPER_RE.match(path))
            if libexec and not re.fullmatch(r"[a-z][\w-]*(d|daemon)", n):
                continue  # helpers under usr/lib are only daemons when named like one (polkitd, not README.md)
            if (sbin or libexec) and (daemon_like(n, None) is None or C.norm(n) in {C.norm(x) for x in stems}
                                      and daemon_like(n, n) is None):
                names.add(n)  # sbin servers: sshd, nginx (named after its package), exim (exim4-daemon-heavy)
            elif not (sbin or libexec) and (n in my_units or "daemon" in n or
                                            pkg in daemon_pkgs and daemon_like(n, None) is None):
                names.add(n)  # a bin program with its own unit (redis-server, pipewire) or a daemon package's -d
            else:
                rejected.setdefault(C.norm(n), f"Debian {pkg} program {path}: not a daemon by the rules (bin "
                                               "programs need a unit of their own name, 'daemon' in the name, or a "
                                               "daemon-tagged package; sbin ones a -d name or their package's name)")
        own = set(names)  # a unit borrows a sibling package's program only when its package has no daemon of its own
        for u in my_units:
            sib = [] if own else [q for q in by_source.get(source_of.get(pkg, pkg), []) if q != pkg and u in progs.get(q, {})
                                  and "client" not in q
                   and not LIBEXEC_RE.match(progs[q][u])]
            if daemon_like(u, None) is None or u in names:
                names.add(u)  # a unit named like a daemon (mariadb-server's mysqld.service)
            elif sib:
                out.append(C.Candidate(u, src, package=sib[0], evidence={"package": sib[0], "unit_in": pkg,
                                                                         "path": progs[sib[0]][u]}))
            else:
                rejected.setdefault(C.norm(u), f"Debian {pkg} unit {u}.service: not named like a daemon")
        if not names and pkg in daemon_pkgs and pkg in mine and SBIN_RE.match(mine[pkg]):
            names = {pkg}
        for n in sorted(names):
            als = {n[len("systemd-"):]} if n.startswith("systemd-") and daemon_like(n[len("systemd-"):], None) is None else set()
            out.append(C.Candidate(n, src, aliases=als, package=pkg,
                                   evidence={"package": pkg, "path": mine.get(n), "units": sorted(units.get(pkg, ()))[:5]}))
    single: dict[str, list] = {}
    for c in out:
        single.setdefault(c.package, []).append(c)
    for pkg, cs in single.items():
        if len(cs) == 1 and cs[0].name != pkg:
            cs[0].aliases.add(pkg)
    return out, {p: set(v) for p, v in progs.items()}


def macos(rejected: dict) -> list[C.Candidate]:
    out = []
    for r in json.loads((C.CORPORA / "macos" / "launchd-jobs.json").read_text()):
        if not r["program"]:
            continue
        n = r["program"].rstrip("/").rsplit("/", 1)[-1]
        if r["kind"] == "LaunchAgents" and daemon_like(n, None) is not None:
            rejected.setdefault(C.norm(n), "macOS LaunchAgent that is not daemon-like")
            continue
        if re.match(r"^/(usr/)?bin/", r["program"]) and daemon_like(n, None) is not None:
            rejected.setdefault(C.norm(n), "macOS job runs a /bin or /usr/bin tool (a shell or client), not a daemon")
            continue
        if re.search(r"ctl$|\.(sh|py|pl)$|\s", n) or len(n) < 3:
            rejected.setdefault(C.norm(n), "macOS job program is a client/script name")
            continue
        out.append(C.Candidate(n, f"macos:{r['kind']}", evidence={"label": r["label"]}))
    return out


KT_PATTERNS = [
    re.compile(r"\bkthread_(?:run|create)\w*\s*\(([^;]*?)\)\s*;", re.S),
    re.compile(r"\.thread_comm\s*=\s*(\"[^\"]+\")"),
    re.compile(r"\bcomm\s*\[[^\]]*\]\s*=\s*(\"[^\"]+\")"),
    re.compile(r"\bkernel_thread\s*\([^,]+,[^,]+,\s*(\"[^\"]+\")"),
    # a thread name formatted into a buffer first (workqueue's "kworker/%d:%d")
    re.compile(r"\b\w*printf\s*\(\s*\w+\s*,\s*\w+\s*,\s*(\"k\w+/[^\"]*\")"),
]


def kernel(rejected: dict) -> list[C.Candidate]:
    root = C.CORPORA / "kernel" / "linux-src"
    C.enforce((root / "DONE").exists(), "run: python3 -I scripts/fetch-corpora.py kernel-src")
    found: dict[str, str] = {}
    for f in sorted(root.glob("**/*.c")):
        if ".git" in f.parts:
            continue
        text = f.read_text(errors="replace")
        for pat in KT_PATTERNS:
            for m in pat.finditer(text):
                lit = re.search(r"\"([^\"]+)\"", m.group(1))
                if not lit:
                    continue
                n = re.split(r"[%/]", lit.group(1))[0].rstrip("-_.: ")
                if not n:
                    continue
                if not re.fullmatch(r"[A-Za-z][\w.-]*", n) or re.search(r"test|kunit|dummy|bench", n):
                    rejected.setdefault(C.norm(n), "kernel thread name is a test or not an identifier")
                elif not (n.startswith("k") or n.endswith("d")):
                    rejected.setdefault(C.norm(n), "kernel thread not named like a daemon (k- prefix or -d suffix)")
                else:
                    found.setdefault(n, str(f.relative_to(root)))
    C.enforce(all(k in found for k in ("kswapd", "kthreadd", "ksoftirqd", "khugepaged")),
              f"kernel-thread extraction lost a core thread: {sorted(found)[:40]}")
    return [C.Candidate(n, "kernel:kthread", evidence={"file": p}) for n, p in sorted(found.items())]


def freebsd(rejected: dict) -> list[C.Candidate]:
    root = C.CORPORA / "src" / "freebsd-daemons"
    C.enforce((root / "DONE").exists(), "run: python3 -I scripts/fetch-corpora.py freebsd-daemons")
    out = []
    for f in sorted((root / "libexec/rc/rc.d").iterdir()):
        t = f.read_text(errors="replace")
        name = re.search(r'^name="?([\w-]+)"?', t, re.M)
        cmd = re.search(r'^command="?([^"\s]+)"?', t, re.M)
        if not cmd:
            continue
        c = cmd.group(1).replace("${name}", name.group(1) if name else "${name}")
        inline = re.fullmatch(r"\$\{\w+:?[-=]([^}]+)\}", c)  # ${sendmail_program:-/usr/sbin/sendmail}
        if inline:
            c = inline.group(1)
        dflt = re.match(r"\$\{(\w+)\}$", c)
        if dflt:
            m = re.search(r":\s*\$\{%s:=([^}]+)\}" % dflt.group(1), t)
            if not m:
                continue
            c = m.group(1)
        n = c.rsplit("/", 1)[-1]
        if "$" in n:
            continue
        if daemon_like(n, None) is None or ("pidfile=" in t and daemon_like(n, n) is None and not n.endswith("ctl")):
            out.append(C.Candidate(n, "freebsd:rc.d", evidence={"script": f.name}))
        else:
            rejected.setdefault(C.norm(n), f"FreeBSD rc.d {f.name} runs a non-daemon program")
    for f in sorted(list(root.glob("usr.sbin/**/*.8")) + list(root.glob("libexec/**/*.8"))):
        t = f.read_text(errors="replace")
        nd = re.search(r"^\.Nd (.+)$", t, re.M)
        n = f.stem
        # "daemon" in the description is enough. "server" also needs a daemon-like name (ypbind, not ntptrace), or
        # must be the description's head noun with no preposition ("biff server" comsat, not yppoll's "... from NIS server")
        d = nd.group(1) if nd else ""
        if nd and (re.search(r"\bdaemon\b", d, re.I) or
                   re.search(r"\bserver\b", d, re.I) and daemon_like(n, None) is None or
                   re.search(r"\bserver$", d.strip(), re.I) and not re.search(r"\b(from|to|of|for|on|with)\b", d, re.I)):
            out.append(C.Candidate(n, "freebsd:man8", evidence={"nd": nd.group(1)[:80]}))
    return out


def curated() -> list[C.Candidate]:
    rows = json.loads((pathlib.Path(__file__).parent / "curated" / f"{CID}.json").read_text())
    return [C.Candidate(r["name"], "curated", aliases=set(r["aliases"]), evidence={"why": r["why"]}) for r in rows]


def kernel_doc_mentions(names: list[str]) -> dict[str, int]:
    docs = C.CORPORA / "kernel" / "linux" / "Documentation"
    C.enforce(docs.is_dir(), "kernel Documentation clone missing")
    text = "\n".join(p.read_text(errors="replace") for p in docs.rglob("*.rst"))
    return {n: len(re.findall(r"\b%s\b" % re.escape(n), text)) for n in names}


def build() -> tuple[list[C.Entry], dict, dict]:
    rejected: dict[str, str] = {}
    deb, progs = debian(rejected)
    sources = {"debian": deb, "macos": macos(rejected), "kernel": kernel(rejected), "freebsd": freebsd(rejected),
               "curated": curated()}
    counts = {k: len({C.norm(c.name) for c in v}) for k, v in sources.items()}
    entries = C.merge([c for v in sources.values() for c in v], prefer=["curated", "freebsd", "debian", "macos", "kernel"])
    se, pop, brew, rep = C.StackExchange(), C.popcon(), C.homebrew_installs(), C.Repology()
    words = C.dictionary_words()
    wd = C.wikidata(WD_SLUGS)
    wd_idx: dict[str, dict] = {}
    for r in sorted(wd, key=lambda r: -r["sitelinks"]):
        for n in [r["label"] or "", r["enwiki"] or "", *r["aliases"]]:
            if n:
                wd_idx.setdefault(C.norm(n), r)
    deb_repo = debian_repo(rep)
    kdoc = kernel_doc_mentions([e.name for e in entries if "kernel:kthread" in e.sources or e.name in ("pdflush", "bdflush", "kupdated")])
    for e in entries:
        own = C.norm(e.name)
        w = next((wd_idx[k] for k in [own] if k in wd_idx), None)
        if w:
            e.aliases |= {a for a in w["aliases"] if len(a) <= 30 and len(a.split()) <= 3}
            e.evidence["wikidata"] = {"qid": w["qid"], "label": w["label"], "class": w["class"]}
        keys = e.keys()
        e.aliases |= se.synonym_aliases(keys)
        keys = e.keys()
        word_keys = {C.norm(n) for n in [e.name, *e.aliases] if n.lower() in words}
        total, per = se.count(keys - word_keys, C.SE_SITES)
        e.signals["se"] = total
        if per:
            e.evidence["se"] = per
        if word_keys:
            e.evidence["se_word_rule"] = f"dictionary-word names not looked up on Stack Exchange: {sorted(word_keys)}"
        if e.packages:
            best = max(sorted(e.packages), key=lambda p: pop.get(p, 0))
            e.signals["popcon"] = pop.get(best, 0)
            if best != e.name:
                e.signals["popcon_weight"] = 0.5
            eff = deb_repo.get(best)
            if eff:
                e.signals["repology"] = rep.families.get(eff, 0)
                e.evidence["repology"] = eff
                if eff != e.name:
                    e.signals["repology_weight"] = 0.5
        b = [(brew[t], t) for t in sorted({e.name, *e.aliases, *e.packages}) if t in brew]
        if b:
            e.signals["brew"], tok = max(b)
            e.evidence["brew"] = tok
            if tok != e.name and tok not in e.aliases:
                e.signals["brew_weight"] = 0.5
        if w:
            e.signals["sitelinks"] = w["sitelinks"]
        if e.name in kdoc:
            e.signals["kdoc"] = kdoc[e.name]
    C.familiarity(entries, ["popcon", "brew", "sitelinks", "repology", "kdoc"])
    return entries, rejected, {"counts": counts, "progs": progs}


def debian_repo(rep: C.Repology) -> dict[str, str]:
    """Debian stable's binary package name -> Repology project (the dump's debian_<N> repo with the most packages)."""
    debs = sorted((r for r in rep.by_repo if re.fullmatch(r"debian_\d+", r)), key=lambda r: -len(rep.by_repo[r]))
    C.enforce(bool(debs), "no debian_<N> repo in the Repology extract")
    return rep.by_repo[debs[0]]


def main() -> None:
    entries, rejected, info = build()
    bank = C.bank_answers(CID)
    cutoffs, matched = C.calibrate(entries, bank, TAILS)
    out = C.write_derived(CID, entries)
    probe = json.loads((C.REPO / "scripts/bank/runs" / CID / "probe.json").read_text())
    import report  # noqa: E402
    report.write(CID, "Name a Unix daemon", entries, cutoffs, matched, rejected, probe, TAILS, info,
                 sources_doc=__doc__, progs=info["progs"],
                 inputs=["debian/Packages.xz", "debian/Contents-amd64.gz", "macos/launchd-jobs.json",
                         "kernel/linux-src/DONE", "src/freebsd-daemons/DONE", "repology/packages.tsv.gz",
                         "wikidata/class-daemon-Q308980.json", "stackexchange/unix-tags.json"],
                 notes=["The probe was written by Haiku on 2026-11-27 with the scope spec in its prompt; its misses "
                        "were since promoted into the bank, which is why the bank now covers all 60. Without an "
                        "LLM, the derived set covers the probe as listed below."])
    print(f"{len(entries)} entries -> {out}; cut-offs {cutoffs}; {C.agreement(matched)}")


if __name__ == "__main__":
    main()
