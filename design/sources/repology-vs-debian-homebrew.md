# Repology vs the direct Debian and Homebrew fetches

Generated 2026-11-27 by `python3 -I scripts/sources/repology_coverage.py` from `~/nullion-corpora/repology` (dump of 2026-11-28), `debian/Packages.xz` (stable main, amd64) and `homebrew/{formula,cask}.json`.

## Coverage

Repology has 285 repositories; Debian stable is `debian_13` (38,754 rows).

| what | covered by Repology |
|---|---|
| Debian stable main binary packages (amd64 Packages), by binary name | 68784/68824 (99.9%) |
| Debian stable main source packages, by source name | 37467/37478 (100.0%) |
| Homebrew formulae (`homebrew` repo) | 8744/8745 (100.0%) |
| Homebrew casks (`homebrew_casks` repo) | 7803/7855 (99.3%) |

Missing samples. Debian: base-files, build-essential, crossbuild-essential-amd64, crossbuild-essential-arm64, crossbuild-essential-armel, crossbuild-essential-armhf, crossbuild-essential-i386, crossbuild-essential-powerpc, crossbuild-essential-ppc64el, crossbuild-essential-riscv64, crossbuild-essential-s390x, lxde, lxde-core, lxqt, lxqt-core. Formulae: fetch. Casks: alfred, alfred@4, alfred@5, ammonite, base, burn, cinder, dash, dash@6, deco, espresso, fluid, fork, fork@dev, freeze.

## Fields per repository in the dump (share of rows with a value)

| repo | srcname | binname | binnames | category | comment (summary) |
|---|---|---|---|---|---|
| debian_13 | 100% | 0% | 100% | 100% | 0% |
| homebrew | 100% | 0% | 0% | 0% | 100% |
| homebrew_casks | 100% | 0% | 0% | 0% | 66% |

Debian's Repology `category` is the archive section (top: misc 24102, perl 2560, golang 1506, javascript 952, libs 903, utils 734), not debtags.

## What dropping each direct fetch would lose

| field | in Repology? | used by |
|---|---|---|
| popcon install counts (Debian) | **no**: Repology has no usage numbers, only how many repositories package a project | familiarity (secondary) |
| Homebrew 365-day install analytics | **no**, same reason | familiarity (secondary) |
| debtags (`interface::daemon`, `role::program`, ...) | **no**: the dump keeps the archive section only | unix-daemon membership |
| Contents (package -> files: programs, systemd units) | **no**: `binnames` are binary *package* names, not files | unix-daemon names and the service-unit rule |
| Homebrew `desc` and cask display `name` | yes: `comment` holds the desc, a cask's `visiblename` its display name (Sublime Text) | text-editor membership and names |
| Homebrew formula `aliases` / `oldnames` | **no** | aliases |
| Debian package descriptions | **no**: `comment` is empty for every debian_13 row | (not used yet) |
| Debian per-binary-package data (section, popcon, tags) | **no**: Repology's Debian rows are per *source* package, binary packages only as the `binnames` list | unix-daemon (package -> daemon program) |
| package names, versions, summaries, cross-distro project grouping | yes (that is what Repology is) | |

## Recommendation

**Keep both direct fetches.** By name Repology contains Debian stable main (99.9% of binary packages, 100.0% of source packages) and Homebrew (100.0% of formulae, 99.3% of casks), so membership by package name and repo-count familiarity could come from Repology alone. But every field the combiners actually read from the direct fetches is absent from the dump: popcon and Homebrew install counts (the secondary familiarity signals), debtags and Contents (the unix-daemon membership rules). The direct fetches are also small (Debian 25 MB, Homebrew 57 MB) against Repology's 2.6 GB. What Repology adds that neither has: projects grouped across 285 repositories (cross-distro aliases, family counts) and the Gentoo/FreeBSD category taxonomy.
