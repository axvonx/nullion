# Structured sources for source-first categories

2026-11-27. The question: which structured datasets let a category's answers come from a stored, deterministic
query, with rarity from a structured familiarity number (the way krillion uses IMDb tags). This goes beyond the
sources already chosen or proposed: Stack Exchange tags, Debian debtags, Contents and popcon, Homebrew, Wikidata
SPARQL, arXiv, dblp, kernel Documentation, CWE, the sparse source trees, NIST DADS, Wikipedia List-of/Comparison-of,
PLDB, Linguist, IANA, SPDX, RFC index, man-pages and POSIX. Prior work: `docs/research/answer-games-and-aliases.md` (Wikidata
classes, redirects, sitelinks, pageviews) and `docs/research/data-sources-and-hosting.md`.

How this was checked: under the owner's rule, nothing was downloaded. **VERIFIED** means I fetched the landing or docs
page (HTTP 200) or sent an HTTP HEAD for a size on 2026-11-27, and read the stated facts there. **INFERRED** means the
claim comes from prior knowledge, or the site blocked automated requests (403/405/timeout), so a person should confirm
it. Category ids are the ones in `bank/index.md`.

## TL;DR

- **Krillion-IMDB-like** sources, where one source gives membership and a popularity number for whole categories:
  **Repology** (package categories plus "packaged by N repos"), **DB-Engines** (database score),
  **State of JS/CSS** (an "awareness %"), the **Stack Overflow Developer Survey** (a "used %"),
  **GitHub topics plus stars**, **crates.io dump** (categories plus downloads), **SteamSpy tags plus owners**,
  **IMDb ratings joined to Wikidata or TMDB keywords**, **MAME software lists** (systems plus library size) and
  **Wikipedia clickstream** (List-of page to clicked article, with click counts).
- **Best impact for effort:** Repology, Wikipedia clickstream, Debian Code Search, OpenAlex and DB-Engines.
  - Repology serves about 15 tool categories at once.
  - Clickstream is CC0 and monthly, and turns the List-of pages already proposed into weighted membership.
  - Debian Code Search is the only familiarity signal I found for identifier categories (syscalls, errnos, ioctls,
    sysctls, CPU flags, ELF sections).
  - OpenAlex is free, CC0 and has keyword counts, so it could replace the dblp and arXiv counts for algorithm
    categories.
  - DB-Engines is one page per database model, with a score.
- **Candor.** Download counts (npm, PyPI, crates) measure *dependency depth*, not recognition. `ms` and
  `serde_derive` would come out as "everyone knows it". Use downloads only inside a hand-picked membership set,
  and prefer human-facing signals: survey awareness, pageviews, clickstream, SE tag counts, HN mentions. Several
  of the best familiarity sources have restrictive terms (IMDb is non-commercial; DB-Engines, TIOBE and SteamDB
  have no data licence), so check before any derived number ships in `bank/`.

## A. Krillion-IMDB-like: membership and popularity from one source

### A1. Repology: cross-distro packages, categories and repo counts (VERIFIED)
- What it is: every package from over 300 repositories (Debian, Arch, AUR, Fedora, Gentoo, FreeBSD ports, nixpkgs,
  Homebrew, MacPorts and more), merged into "projects". The API doc's sample record has `repo`, `srcname`,
  `binname(s)`, `summary`, `categories` (for example `["www"]`), `licenses` and `maintainers`.
- **Membership:** read it from repo categories; Gentoo and FreeBSD categories are a curated taxonomy (mappings INFERRED,
  check them): `x11-wm` window-manager, `app-shells` unix-shell, `app-editors` text-editor, `x11-terms`
  terminal-emulator, `www-servers` web-server, `dev-vcs` version-control-system, `sys-boot` bootloader,
  `app-emulation` hypervisor, `dev-lang` compiler, `net-analyzer` penetration-testing-tool, `dev-util` debugger,
  profiler and build-tool, `app-vim` vim-plugin.
- **Familiarity:** the number of repositories that package a project. It is a clean "how many distributions bothered"
  signal, and it is not inflated by CI.
- **Aliases:** the binary and source names across distributions (`nvim` / `neovim`, `vim-gtk3`).
- **Access:**
  - API: at most 1 request per second; above 1,000 requests a day is "discouraged"; a bulk client MUST send a
    User-Agent linking to its source repository (https://repology.org/api).
  - Daily PostgreSQL dump: about 2.56 GB as `.sql.zst` (https://dumps.repology.org/, HEAD-listed, VERIFIED).
  - Licence: INFERRED, check the dump's README.txt.
- **Categories served:** window-manager, unix-shell, text-editor, terminal-emulator, web-server,
  version-control-system, bootloader, hypervisor, debugger, profiler, fuzzer, penetration-testing-tool,
  static-analysis-tool, build-tool, code-formatter, documentation-generator, parser-generator, package-manager,
  benchmarking-tool, linux-tracing-tool, disassembler, monitoring-system, unix-daemon, unix-command, compiler,
  javascript-engine. **Impact: very high; effort: medium** (one dump and a category map).

### A2. DB-Engines ranking (VERIFIED page; licence INFERRED)
- 442 systems as of November 2026, each with a monthly **score**.
- Separate rankings per model: relational, key-value, document, time series, graph, search engine, vector, wide
  column, RDF, spatial, event store, columnar and others (https://db-engines.com/en/ranking).
- The page is HTML only. I found no download or API, and no data licence (it is owned by Redgate).
- **Categories served:** database, time-series-database, storage-engine (partly). It would also support new prompts:
  *Name a graph database*, *Name a vector database*, *Name a key-value store*.
- One page per model is about 20 fetches a year. Ask Redgate, or use only rank buckets (not scores) as a tier prior.
- **Impact: high; effort: low.**

### A3. State of JS / CSS / HTML (Devographics) (VERIFIED: repo and API endpoint exist; data shape INFERRED)
- For every library in the survey there are "**awareness**" (heard of it) and "usage" percentages. Awareness is
  exactly nullion's familiarity axis.
- Survey configs: https://github.com/Devographics/surveys. Results: https://api.devographics.com/ (GraphQL, INFERRED).
- **Categories served:** frontend-ui-library, css-framework, state-management-library, test-framework,
  build-tool (JS), static-site-generator, template-engine (partly), javascript-engine (runtimes question).
- The set is small (20–40 per question), so it is good for calibrating the common tiers, not for the long tail.
- **Impact: high for calibration; effort: low.**

### A4. Stack Overflow Developer Survey (VERIFIED: survey.stackoverflow.co lists Data & files from 2016 to 2025; 2026 out)
- Respondent-level CSV each year. Licence: ODbL (INFERRED). It has "have worked with" and "want to work with"
  percentages for languages, databases, platforms, web frameworks, other frameworks, IDEs, OS, collaboration tools,
  and (since 2024) AI tools.
- **Categories served:** programming-language, database, web-framework, ide, operating-system, package-manager
  (partly), ci-service (partly), version-control-system (partly).
- It would also support new prompts: *Name a cloud platform*, *Name a developer collaboration tool*.
- The same shallow-list caveat as A3 applies. The JetBrains Developer Ecosystem survey
  (https://www.jetbrains.com/lp/devecosystem-2024/, VERIFIED) is a second opinion with the same shape.

### A5. GitHub topics + stars (VERIFIED)
- For example, `github.com/topics/static-site-generator` shows "5,611 public repositories".
- The Search API (`topic:X`, sort by stars) is documented at https://docs.github.com/en/rest/search/search. Rate
  limits are INFERRED: about 30 search requests a minute with a token.
- **Membership is noisy** (self-tagged; it includes "awesome" lists and starters), so use it as candidates plus a
  star count for a membership set from elsewhere.
- Stars history in bulk: GH Archive (https://www.gharchive.org/, VERIFIED; hourly event JSON, usable via BigQuery) or
  OSS Insight's API (https://ossinsight.io/, VERIFIED).
- **Categories served:** static-site-generator, terminal-emulator, vim-plugin, fuzzer, logging-library, orm,
  dependency-injection-framework, code-formatter, template-engine, web-framework, css-framework, monitoring-system,
  stream-processing-system, game-engine, physics-engine, memory-allocator.

### A6. Language package registries (downloads and dependents)
- **crates.io DB dump** (VERIFIED by HEAD: 2.35 GB `db-dump.tar.gz` at static.crates.io)
  - Has crates, categories, keywords, downloads and dependencies. It is rust-crate wholesale: categories such as
    `parser-implementations` and `command-line-utilities` give membership.
  - Licence: INFERRED, crates.io's data-access policy (that page returned 404, so confirm it).
- **top-pypi-packages** (VERIFIED by HEAD: 789 KB JSON of the top 15,000 PyPI projects by 30-day downloads,
  https://hugovk.github.io/top-pypi-packages/) and pypistats (https://pypistats.org/api/, VERIFIED).
- **npm downloads API** (VERIFIED: the `downloads/point/last-week/<pkg>` endpoint answers).
- **ecosyste.ms** (VERIFIED: "16.6 million packages, 357 million repositories", free API, by the libraries.io
  author)
  - One API across every registry, with downloads, dependents and keywords, plus indexes of awesome lists. It
    supersedes libraries.io (libraries.io/data returned 403; its dumps stopped around 2020, INFERRED).
  - Licence: INFERRED, CC BY-SA per its site footer; check it.
- **deps.dev** BigQuery (VERIFIED docs; needs a GCP account): dependents per package for npm, PyPI, Maven, Cargo,
  NuGet, Go and RubyGems.
- CRAN / cranlogs, Packagist, RubyGems data, NuGet, conda-forge, pkg.go.dev: all VERIFIED as existing, each with
  download counts (pkg.go.dev has importers instead). They are low priority because no current category lives only
  there.
- **Categories served:** rust-crate, logging-library, orm, test-framework, template-engine, web-framework,
  state-management-library, frontend-ui-library, dependency-injection-framework, parser-generator,
  serialization-format (implementations), static-analysis-tool.
- **Caveat:** downloads measure transitive depth (see the TL;DR). Use them within a set. Never let a dependency of a
  dependency become an Off-by-one answer.

### A7. Wikipedia clickstream (VERIFIED: monthly, CC0)
- Monthly (referer, target, count) pairs for enwiki and four other languages, from 2017-11 to now. The enwiki
  2026-10 file is 464 MB gz by HEAD (https://dumps.wikimedia.org/other/clickstream/).
- **Why it matters:** it turns "List of X" / "Comparison of X" pages (already proposed) into *weighted* membership.
  Each article clicked from `Comparison_of_text_editors` is a member, and the click count is how often readers chose
  it from the list. That is closer to "would a player name this" than raw pageviews.
- Pairs below 10 clicks are dropped (INFERRED from the format docs), which limits the long tail. Use pageviews there.
- **Categories served:** any category with a List-of or Comparison-of page: text-editor, version-control-system,
  web-server, filesystem, operating-system, programming-language, ide, debugger, hypervisor, video-codec,
  lossless-compression-algorithm, block-cipher, cryptographic-hash-function, sorting-algorithm, data-structure,
  home-computer-1980s, video-game-console-1990s, malware-family, game-engine, window-manager, unix-shell,
  bootloader, and more.
- **Impact: very high; effort: low** (one file a month, a join on titles you already resolve).

### A8. Games: SteamSpy, IGDB, MAME, TheGamesDB, RetroAchievements
- **SteamSpy** (VERIFIED docs)
  - `request=tag&tag=…` returns games with owner estimates. The limit is 1 request per second, and 1 per 60 seconds
    for `all`; data is refreshed daily. Licence: none stated (INFERRED).
  - Steam user tags such as Programming, Hacking, Cyberpunk and Automation give membership; owners give familiarity.
    That is krillion-like.
- **IGDB** (VERIFIED docs: https://api-docs.igdb.com/)
  - Needs Twitch OAuth (INFERRED: free, 4 requests per second). It has `game_engines`, `platforms` (with a generation
    field), `keywords`, `themes` and `total_rating_count`.
  - **Categories served:** game-engine (the engine → games count is the familiarity), video-game-console-1990s,
    home-computer-1980s.
- **SteamDB tech** (game engine detection with counts per engine) and **PCGamingWiki Cargo** (an engine field per
  game) returned 403 to automated requests (INFERRED; PCGamingWiki is CC BY-NC-SA). They would be the best
  game-engine familiarity source if access were cleared.
- **MAME software lists** (`hash/*.xml`, VERIFIED directory at github.com/mamedev/mame/tree/master/hash)
  - One list per system, so membership comes from the system list. The size of a system's software library is a
    rough familiarity (the C64 and NES lists are huge; obscure machines have dozens).
  - The MAME machine list also covers microprocessor (CPU cores) and dec-computer (partly). Licence: BSD or GPL for the
    XML (INFERRED).
- **TheGamesDB** (https://api.thegamesdb.net/, VERIFIED; API key) and **RetroAchievements** (VERIFIED): platform lists
  with game counts. MobyGames returned 403 (INFERRED: a paid API since 2023).

### A9. Film, TV and books: IMDb, TMDB, Open Library (general sources, new categories)
- **IMDb non-commercial datasets** (VERIFIED)
  - Seven files, refreshed **daily**: `title.basics` (231 MB gz by HEAD), `title.ratings` (8.8 MB), `title.akas`
    (525 MB), `name.basics` (314 MB), plus `crew`, `episode` and `principals` (https://developer.imdb.com/non-commercial-datasets/).
  - `numVotes` is the familiarity number.
  - **No keywords file**, only up to three genres. So "hacker movie" membership must come from **Wikidata**
    (P921 main subject = hacking / computer security / AI; P136 genre = cyberpunk; joined by P345 IMDb ID) or
    **TMDB keywords**.
  - **Licence: personal and non-commercial use only.** nullion is free, but shipping derived tiers is a question for
    the owner.
- **TMDB** (VERIFIED)
  - Keyword pages exist, for example keyword `3355-hacker`; there is a `keyword/{id}/movies` endpoint. It needs a
    free API key. The docs say the legacy limits are off, with an upper bound "around 40 requests per second".
  - It has its own `popularity` and `vote_count`. Attribution is required (INFERRED).
- **Open Library** (VERIFIED: monthly dumps; the subjects API, e.g. `subjects/computer_programming.json`, answers)
  - Subjects give membership; `edition_count` and ratings / want-to-read give familiarity. Licence: CC0 (INFERRED).
- **MusicBrainz** (VERIFIED download doc; core data CC0) with **ListenBrainz** listen counts (VERIFIED site): tags such
  as chiptune and the demoscene. The membership for "computing songs" is weak (speculative).
- **Podcast Index** (VERIFIED; free API key): a Technology category, but popularity is weak. Low.

## B. Familiarity signals that work across categories

- **Debian Code Search** (https://codesearch.debian.net/, VERIFIED; API with optional keys, VERIFIED)
  - A regex search over all of Debian's source. "How many source packages use `EPOLLEXCLUSIVE` / `CAP_SYS_PTRACE` /
    `.init_array` / `ENOTRECOVERABLE`" is the only familiarity number I found for identifier categories, which
    pageviews and SE tags cannot rank.
  - **Categories served:** linux-system-call, linux-errno, linux-capability, linux-ioctl-request, linux-sysctl-key,
    linux-kernel-config-option, linux-perf-event, socket-address-family, unix-signal, elf-section, x86-instruction
    (in asm), x86-cpu-feature-flag, win32-api-function (Wine's source), systemd-directive.
  - About 30 categories × a few hundred terms each. Throttle it, and use a key.
  - **Impact: very high for the os-systems domain.**
- **OpenAlex** (VERIFIED docs)
  - CC0 (INFERRED; the snapshot bucket has a LICENSE.txt). The full snapshot is free on S3: about 745 GB JSONL, 626 M
    records (September 2026). There is a free daily API budget with a key; `llms.txt` and `.md` doc pages exist.
  - It has 4,516 topics and about 1.9 M **keywords** with work counts, and a text-search count per term filtered to
    the Computer Science field.
  - It could replace the arXiv and dblp FTS counts with one call per candidate (`works?search=…&filter=…` →
    `meta.count`) and broader coverage (journals, conferences, patents-adjacent).
  - **Categories served:** every algorithm category in data-graphics-algorithms, cryptographic-hardness-assumption,
    consensus-protocol, concurrency-control-protocol, garbage-collection-algorithm, cache-replacement-policy,
    tcp-congestion-control-algorithm, erasure-code, memory-consistency-model, cpu-side-channel-attack,
    post-quantum-signature-scheme.
  - Semantic Scholar datasets (VERIFIED docs; key needed) overlap and are not needed if OpenAlex is used.
- **Hacker News via Algolia** (https://hn.algolia.com/api, VERIFIED page; about 10,000 requests an hour, INFERRED)
  - `nbHits` for a quoted term in stories and comments. A practitioner-familiarity signal for tools, languages,
    databases, attacks and companies. Noisy for common words; scope it with tags (`story`) and by year.
- **Google Books Ngram v3** (https://storage.googleapis.com/books/ngrams/books/datasetsv3.html, VERIFIED)
  - Phrase frequency by year up to 2019. Best for historical categories, where web signals are thin:
    historical-cipher, home-computer-1980s, dec-computer, supercomputer-pre-2000, defunct-computer-company,
    turing-award-winner, apple-macintosh-model.
  - The bulk files are large; there is no official per-term API (the web viewer's JSON is unofficial, INFERRED).
- **TIOBE** (VERIFIED page: a top 50 shown, no download), **PYPL** (VERIFIED: a language index *and an IDE index*,
  data in the `pypl/pypl.github.io` GitHub repo), **RedMonk** (VERIFIED site; a quarterly chart, no data file):
  calibration for programming-language and ide only.
- **Google Trends** (VERIFIED the site exists): no stable bulk API (pytrends is unofficial and rate-limited; an
  official API was in limited alpha in 2025, INFERRED). **Not recommended.**

## C. Authoritative membership registries (deterministic; familiarity from section B)

- **Linux kernel source beyond Documentation** (VERIFIED: `arch/x86/entry/syscalls/syscall_64.tbl` and
  `arch/x86/include/asm/cpufeatures.h` exist upstream). Add them as sparse paths in the kernel clone you already
  have:
  - syscall tables → linux-system-call; `cpufeatures.h` → x86-cpu-feature-flag; `uapi/asm-generic/errno*.h` →
    linux-errno; `uapi/linux/capability.h` → linux-capability; `**/Kconfig` → linux-kernel-config-option;
    `linux/socket.h` → socket-address-family; `uapi/linux/if_arp.h` and rtnl kinds → linux-network-interface-type;
    `linux/nvme.h` → nvme-command; sysctl tables → linux-sysctl-key; `asm-generic/signal.h` → unix-signal;
    `uapi/linux/elf.h` → elf-section (partly). The per-category paths are INFERRED.
  - Free, exact and versioned. **Effort: very low.**
- **uops.info `instructions.xml`** (VERIFIED: 143 MB by HEAD, version of March 2026, built from Intel XED configs)
  - Every x86 instruction with its ISA extension, and measurements per tested microarchitecture.
  - **Categories served:** x86-instruction, simd-extension, intel-microarchitecture (partly).
  - Related: Intel XED (https://github.com/intelxed/xed, VERIFIED), felixcloutier.com/x86 (VERIFIED, names from the
    SDM), and LLVM `X86.td` (VERIFIED) for feature names.
- **riscv-opcodes** (https://github.com/riscv/riscv-opcodes, VERIFIED) → riscv-extension (extension files plus
  ratification state).
- **MITRE ATT&CK STIX** (https://github.com/mitre-attack/attack-stix-data, VERIFIED; free with attribution)
  - "Software" covers malware and tools with **aliases**.
  - **Categories served:** malware-family, penetration-testing-tool (partly).
  - New prompt: *Name an APT group*; Groups are listed with aliases at attack.mitre.org/groups (VERIFIED).
- **CAPEC** (https://capec.mitre.org/data/downloads.html, VERIFIED) → web-attack, cryptographic-attack.
- **CVE List V5** (github.com/CVEProject/cvelistV5, VERIFIED) and the **NVD API** (VERIFIED): mention counts of an
  attack or malware name as familiarity.
- **Malpedia** (https://malpedia.caad.fkie.fraunhofer.de/, VERIFIED; some data needs an account)
  - Malware families with **synonyms** and reference counts. The best alias source for malware-family. Terms of
    service apply.
- **Kali tools** (https://www.kali.org/tools/, VERIFIED; package sources on GitLab, VERIFIED) →
  penetration-testing-tool, fuzzer, disassembler. Familiarity through Repology or GitHub stars.
- **TOP500** (VERIFIED: lists from 1993/06 to 2026/11)
  - The lists from 1993 to 1999 give membership for supercomputer-pre-2000 (only machines from 1993 on, so the Cray-1
    era needs Wikidata).
  - It also covers interconnect-topology and microprocessor (partly). XLS export needs a free account (INFERRED).
  - New prompt: *Name a #1 supercomputer on the TOP500*.
- **PRONOM / DROID signature files** (VERIFIED), **libmagic `Magdir`** (github.com/file/file, VERIFIED), Gary
  Kessler's file signatures (VERIFIED)
  - Formats with extensions, MIME types and **aliases**.
  - **Categories served:** 3d-model-file-format, serialization-format, texture-compression-format (partly),
    markup-language (partly), video-codec (containers, partly).
- **Bluetooth SIG assigned numbers** (bitbucket.org/bluetooth-SIG/public, VERIFIED) → bluetooth-profile.
- **UEFI and ACPI specifications** (uefi.org/specifications, uefi.org/acpi, VERIFIED) → uefi-protocol, acpi-table.
  The edk2 `MdePkg/Include/Protocol` headers are a cleaner machine source (INFERRED).
- **TCG TPM 2.0 Library spec** (VERIFIED) → tpm2-command; tpm2-tss headers are the machine source (INFERRED).
- **NVMe specifications** (VERIFIED) → nvme-command; use `nvme.h` above.
- **IEEE 802** (https://standards.ieee.org/ieee/802/, VERIFIED) → ieee-802-standard.
- **tldr-pages** (github.com/tldr-pages/tldr, VERIFIED; CC BY 4.0, INFERRED)
  - Pages for `common`, `linux`, `osx` and `windows` (about 6,000+ commands, INFERRED). Membership with a built-in
    "worth documenting" filter, plus aliases (`tldr` alias pages).
  - **Categories served:** unix-command, git-subcommand (`git-*` pages), and partly linux-tracing-tool,
    package-manager and benchmarking-tool. ManKier (VERIFIED API) is an alternative man-page index.
- **Rosetta Code** (VERIFIED; GFDL)
  - Task pages are membership for sorting-algorithm, string-matching-algorithm, graph-algorithm, parsing-algorithm
    and pseudorandom-number-generator.
  - Language categories show **number of tasks solved**, which is a familiarity number for programming-language and
    is krillion-like for the long tail (esolangs included).
- **Chess Programming Wiki** (https://www.chessprogramming.org/, VERIFIED) → game-ai-technique (search, pruning,
  evaluation techniques), with deep long-tail membership.
- **Computer History Museum collections and timeline** (VERIFIED site) → dec-computer, apple-macintosh-model,
  home-computer-1980s, defunct-computer-company. Its API and licence are INFERRED.
- **TechPowerUp GPU/CPU databases** (405 to HEAD) and **WikiChip** (timed out) are INFERRED. They would cover
  gpu-microarchitecture, cpu-socket and microprocessor; WikiChip has been mostly frozen for years. Prefer Wikidata
  for these.
- **ACM CCS 2012** (dl.acm.org/ccs returned 403, INFERRED: SKOS/XML download). It is a taxonomy for *choosing
  prompts*, not an answer source. Low.
- Gentoo (VERIFIED) and Fedora packages (VERIFIED): reach both through Repology rather than directly.
  **AUR metadata** (VERIFIED by HEAD: 15 MB `packages-meta-ext-v1.json.gz`, with votes and popularity) and **Arch
  pkgstats** (VERIFIED API: package popularity by month) are direct familiarity numbers for Linux tools. nixpkgs
  `packages.json.br` (VERIFIED by HEAD: 10.6 MB) has descriptions but no popularity.

## D. Aliases and abbreviations

- **kaikki.org (Wiktextract)** (VERIFIED)
  - Built from the enwiktionary dump of 2026-10-01, updated weekly. The raw JSONL is 24.8 GB (2.9 GB gz); per-language
    extracts are smaller.
  - Has `synonyms`, `abbreviations`, `alt_of` and topic labels such as "computing". Aliases and acronym expansions
    (TLB, ASLR, FFT).
- **FOLDOC** (https://foldoc.org/, VERIFIED: 15,284 entries, updated 2025-08; GFDL, INFERRED)
  - Acronyms and old jargon. Good for the history categories and for aliases that Wikipedia redirects miss.
- **Jargon File** (http://www.catb.org/jargon/, VERIFIED; public domain, INFERRED)
  - Membership for **bug** (heisenbug, bohrbug, mandelbug, schroedinbug) and partly code-smell.
  - New prompt: *Name a piece of hacker jargon*.
- Repology binary names (A1), Malpedia synonyms and ATT&CK aliases (C), IMDb `title.akas` (A9), and PRONOM format
  aliases (C) cover the aliases within their domains.

## E. New category prompts these sources could answer

Each one is written from what the data can answer, with the number used for tiers.

| Prompt | Membership query | Familiarity number |
|---|---|---|
| Name a movie about hackers | Wikidata film, P921 ∈ {hacking, hacker, computer security} or TMDB keyword `hacker` | IMDb `numVotes` (via P345) |
| Name a film with a rogue AI | Wikidata P921 = artificial intelligence, or TMDB keywords `artificial intelligence` / `killer robot` | IMDb `numVotes` |
| Name a TV series about a tech company | Wikidata TV series, P921 ∈ {startup, Silicon Valley, software industry} | IMDb `numVotes` |
| Name a fictional computer or AI | Wikidata instance of fictional computer / fictional AI (class QIDs to confirm) | enwiki pageviews / sitelinks |
| Name a programming game | Steam tag Programming (TIS-100, Shenzhen I/O, Human Resource Machine…) | SteamSpy owners |
| Name a hacking game | Steam tag Hacking (Uplink, Hacknet, Hackmud…) | SteamSpy owners |
| Name a handheld game console | IGDB platforms, category portable console | IGDB rating counts / MAME list size |
| Name a game console from the 1980s | IGDB platforms by generation | MAME software-list size |
| Name a classic programming book | Open Library subject `computer_programming` | `edition_count`, want-to-read |
| Name a cyberpunk novel | Open Library subject `cyberpunk` (VERIFIED endpoint) | ratings / editions |
| Name a computer scientist | Wikidata P106 = computer scientist | sitelinks / pageviews |
| Name a graph database / vector database / key-value store | DB-Engines model page | DB-Engines score |
| Name a cloud platform | SO survey "platform" question | % used |
| Name an APT group | ATT&CK Groups (with aliases) | CVE/HN mentions, pageviews |
| Name a #1 supercomputer | TOP500 rank-1 entries, 1993 onward | pageviews |
| Name a piece of hacker jargon | Jargon File headwords | Ngram / HN hits |
| Name an esoteric programming language | Rosetta Code language categories ∩ esolang wiki | tasks solved |

Caveat: a general-media prompt's Bit Flip still has to be a computing-flavoured deep cut, not just an unpopular
film; IMDb and Steam numbers skew recent and English-language (WarGames and Sneakers still score well).

## F. Ranking by impact for effort

1. **Repology dump**: about 25 tool categories; membership, repo-count familiarity and aliases. *Krillion-like.*
2. **Wikipedia clickstream**: CC0, monthly, weights the List-of pages already proposed. *Krillion-like.*
3. **Debian Code Search counts**: the only familiarity signal for the os-systems identifier categories.
4. **Linux kernel source sparse paths**: exact membership for about 12 os-systems categories, nearly free.
5. **OpenAlex**: replaces and broadens the paper counts for about 35 algorithm and theory categories.
6. **DB-Engines**: a few pages for database, time-series-database and three new prompts (licence question).
7. **State of JS/CSS + SO survey**: awareness and usage % to calibrate common tiers of about 12 tool categories.
8. **uops.info, riscv-opcodes, ATT&CK/Malpedia**: exact membership plus aliases for hardware and security.
9. **GitHub topics + stars, ecosyste.ms, crates.io dump**: library categories; watch the dependency-depth bias.
10. **IMDb + Wikidata/TMDB, SteamSpy, Open Library**: the new general-media prompts (section E); IMDb licence check.
11. **MAME, TOP500, PRONOM/libmagic, tldr, Rosetta Code, Jargon File, kaikki, FOLDOC**: targeted membership/aliases.
12. **Skip**: Google Trends (no API), TIOBE/RedMonk (top-N only), Software Heritage (no popularity), Semantic
    Scholar (redundant with OpenAlex), libraries.io (superseded by ecosyste.ms), DBpedia (redundant with Wikidata).

## Summary table

| Source | Categories served (ids) | M / F / A | Size | Access |
|---|---|---|---|---|
| Repology | window-manager, unix-shell, text-editor, terminal-emulator, web-server, version-control-system, bootloader, hypervisor, debugger, profiler, fuzzer, penetration-testing-tool, static-analysis-tool, build-tool, code-formatter, package-manager, compiler, … | M F A | 2.56 GB/day dump | dump; API 1 req/s, custom UA |
| Wikipedia clickstream | any with a List-of/Comparison-of page (text-editor, filesystem, block-cipher, video-codec, game-engine, …) | M F | ~0.46 GB/month enwiki | bulk dump, CC0 |
| Debian Code Search | linux-system-call, linux-errno, linux-capability, linux-ioctl-request, linux-sysctl-key, linux-kernel-config-option, linux-perf-event, socket-address-family, unix-signal, elf-section, x86-instruction, x86-cpu-feature-flag, win32-api-function, systemd-directive | F | n/a (query) | API, optional key, throttle |
| Linux kernel source paths | the same os-systems ids plus nvme-command, linux-network-interface-type | M | tens of MB sparse | git sparse clone |
| OpenAlex | all data-graphics-algorithms algorithm ids, consensus-protocol, erasure-code, cpu-side-channel-attack, post-quantum-signature-scheme, … | F (A via keywords) | 745 GB full; API per-term | free S3 / API with key, CC0 |
| DB-Engines | database, time-series-database, storage-engine; new graph/vector/KV | M F | 442 systems | HTML, monthly, no licence |
| State of JS/CSS | frontend-ui-library, css-framework, state-management-library, test-framework, build-tool, static-site-generator | F | small | GraphQL API / repo |
| SO Developer Survey | programming-language, database, web-framework, ide, operating-system; new cloud-platform | F | ~100 MB CSV/yr | zip download, ODbL |
| GitHub topics + stars / GH Archive | static-site-generator, terminal-emulator, vim-plugin, logging-library, orm, web-framework, game-engine, physics-engine, … | M(noisy) F | API / BigQuery | token, ~30 search req/min |
| crates.io dump | rust-crate | M F A | 2.35 GB | bulk dump |
| PyPI / npm / ecosyste.ms / deps.dev | logging-library, orm, test-framework, template-engine, dependency-injection-framework, parser-generator | F (biased) | API | free APIs; deps.dev needs GCP |
| AUR meta + Arch pkgstats | Linux tool categories (via Repology names) | F | 15 MB + API | bulk JSON / API |
| SteamSpy | game-engine (via tags); new programming/hacking games | M F | API | 1 req/s, `all` 1/60 s |
| IGDB | game-engine, video-game-console-1990s, home-computer-1980s; new handheld/80s consoles | M F A | API | Twitch OAuth, ~4 req/s |
| MAME software lists | home-computer-1980s, video-game-console-1990s, microprocessor, dec-computer | M F | XML in repo | git |
| IMDb datasets (+ Wikidata P921 / TMDB keywords) | new: hacker movies, AI films, tech TV | F A (M via Wikidata/TMDB) | ~1.1 GB gz | daily TSV; non-commercial |
| Open Library | new: programming books, cyberpunk novels | M F | monthly dumps | dumps / subjects API |
| uops.info XML / XED / felixcloutier | x86-instruction, simd-extension, intel-microarchitecture | M | 143 MB | single file |
| riscv-opcodes | riscv-extension | M | small | git |
| MITRE ATT&CK / CAPEC / CVE | malware-family, penetration-testing-tool, web-attack, cryptographic-attack; new APT group | M A (F via CVE) | tens of MB | git / download, free |
| Malpedia | malware-family | M A F | ~3k families | web / API, ToS, some login |
| Kali tools | penetration-testing-tool, fuzzer, disassembler | M | ~600 tools | web / GitLab |
| TOP500 | supercomputer-pre-2000, interconnect-topology | M F(rank) | 500 × 67 lists | web; XLS with free account |
| PRONOM / libmagic / Kessler | 3d-model-file-format, serialization-format, texture-compression-format, markup-language | M A | small | XML / git |
| Bluetooth SIG / UEFI-ACPI / TCG / NVMe / IEEE 802 | bluetooth-profile, uefi-protocol, acpi-table, tpm2-command, nvme-command, ieee-802-standard | M | small | specs / repos |
| tldr-pages | unix-command, git-subcommand | M A | ~6k pages | git, CC BY |
| Rosetta Code | programming-language, sorting/string/graph algorithms, pseudorandom-number-generator | M F | wiki | MediaWiki API |
| Chess Programming Wiki | game-ai-technique | M | wiki | MediaWiki |
| Hacker News (Algolia) | tools, languages, databases, attacks, companies | F | API | ~10k req/h, no key |
| Google Books Ngram | historical-cipher, home-computer-1980s, dec-computer, supercomputer-pre-2000, defunct-computer-company, turing-award-winner | F | large bulk | bulk files only |
| kaikki / FOLDOC / Jargon File | aliases everywhere; bug, code-smell | A (M for bug) | 2.9 GB gz / 15k / small | bulk / web |
| PYPL / TIOBE / RedMonk | programming-language, ide | F (top-N) | tiny | GitHub repo / HTML |
