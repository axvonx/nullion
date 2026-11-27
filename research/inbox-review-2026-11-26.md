# Inbox review, 2026-11-26: what the mining pipeline gets wrong

These are hand reviews of the first three mined categories. Each ran the same pipeline: source trees → `scripts/mine-heads.py` or a directory listing → a Haiku filter applying the named-kinds rule → `scripts/merge-mined.py` → `scripts/score-candidates.py` into the Inbox. The aim is to find which error classes the automated version must guard against.

## Numbers

| category | source method | raw kept by filter | after my prune | promoted | rejected or folded |
|---|---|---|---|---|---|
| lock | head-noun mining, 5 trees | 18 | 17 | 16 | 1 folded as an alias (SHARE lock → shared lock) |
| data structure | head-noun mining, 11 trees, 5 batches | 101 | 89 (9 pruned, rest merged) | 87 | 2 (TLB, access control list) |
| filesystem | Linux docs, then directory listings of 8 OS trees | 51, then 94 | 94 + 5 from memory (closed source) | 99 filled as a draft | 2 over-short aliases (`dev`, `fd`) dropped; Ceph moved by hand |

The filter's raw precision on kinds is about 89% for data structures: 11 of 101 needed removing. For locks it is about 94%. Tier calls are usually within one tier of mine. I changed roughly 1 in 5, mostly by one step.

## Error classes

1. **Specific instances or types passed off as kinds** (5 in data structures): ProcArray, `vm_map`, `resv_map`, `CM_RESOURCE_LIST`, `IO_RESOURCE_REQUIREMENTS_LIST`. These are named structs of one subsystem, not kinds of thing. The rule's "instances never count" wording catches fields like `mmap_lock` but not whole struct types.
2. **Category drift via generous clauses:**
   - The "hardware tables are allowed" clause let in CPU buffers: the return address stack, store buffer and fill buffer.
   - Another batch, under the same prompt, rejected the BTB and RSB. The same rule is applied inconsistently across batches.
   - Neighbouring-domain concepts got through too: an access control list is a security model, and a TLB is a hardware cache.
3. **Near-homonyms across tiers:** PostgreSQL's "SHARE lock" sits one letter from the generic "shared lock". If it were a separate deep entry, a typo would earn a bonus. A distinct name that differs from a shallower answer only by inflection or punctuation should be its alias.
4. **Inconsistent alias placement across batches:**
   - One batch put `ConcurrentSkipListMap` on skip list, while another proposed "concurrent skip list" as its own kind.
   - The merge also folded "dynamic array" into "array".
   - Batches don't see each other's decisions, so the merge step needs a consistency pass.
5. **Over-strict filtering (recall loss):** the Java batch dropped LinkedHashMap, IdentityHashMap and CopyOnWriteArrayList. ArrayList had no target entry to alias to, so it was dropped too.
6. **Miner blind spots (recall loss):**
   - Lowercase compounds with no separator (ziplist, intset, hlist, kfifo) fail the word-boundary rule.
   - Proper-noun categories (filesystems, languages, OSes) have no head noun at all, so head-noun mining finds nothing. Their source is a *listing*: one directory per filesystem in OS trees, or registries.
7. **Source choice is the biggest recall lever:**
   - The first filesystem pass used Linux docs only. It found no ZFS, APFS, UFS or HAMMER2.
   - FreeBSD man5 was the wrong section: it holds config formats.
   - Directory listings of 8 OS trees, fetched through the GitHub API with no clone, fix most of this.
   - Closed-source names (APFS) appear in no tree, so they need the memory-backed draft examples, flagged as such.
8. **Works on my machine misunderstood:** the filter proposed SquashFS, OverlayFS and Btrfs, which are mid-tier names, not the cliché "I'm being clever" pick. That tier needs an explicit definition with examples in every prompt.

9. **Corpus counts mis-tier short proper nouns:**
   - HFS, AFS, EFS, Coda, Fossil and HAMMER match unrelated words in paper titles. Before the fix, HFS landed in Off-by-one, and 28 filesystem entries disagreed with the familiarity call.
   - The fix: a per-category `_context` makes counts require a category phrase ("file system") in the same row. That cut disagreements to 11.
10. **Counts measure research popularity, not player familiarity:** Ceph went to Off-by-one because papers love it. Counts should never put an entry in the top tier against a shallower-is-wrong judgement. Treat Off-by-one from counts as a flag, not a decision.
11. **Over-short aliases:** the filter proposed `dev` and `fd` as aliases of devfs and fdescfs. Those are too generic for a game. An alias under 3 characters, or any common English word, should need review.
12. **Scorer bug:** an alias repeated in a different case (FAT and fat) slipped past the scorer's de-duplication. The strict grammar caught it in `npm test`. It's fixed in `entry_line`.

13. **Placeholders were approved without the pipeline (my mistake):** the 5 hand-written sample categories went live with 20 to 40 answers each. The owner found BLISS, PL/I, INTERCAL, MACRO-11, PlusCal and PILLAR rejected on day one. The repair:
    - Wikidata class dumps for programming languages (1,853 added), operating systems (2,043) and sorting algorithms (29), tiered by sitelinks the way algillion does it;
    - CWE plus jargon for bug types, filtered by Gemini (74);
    - paper-title mining plus a recall boost for shading (61).
14. **Wikidata's lowercase-label heuristic fails for some classes:** for "software bug" it let in "spiritual fraud", a French place name and a certificate-compromise notice. Wikidata class dumps need a membership filter unless the class is clean, as programming language and operating system are.
15. **The game's normalizer folds more than a naive key:** `#` and `♯` both become "sharp", and names like `///` normalise to nothing. Merge scripts must use the game's exact normalize. `scripts/wikidata-merge.py` ports it.

## Implications for the full version

- **Rule text:** add "a single subsystem's named struct type is an instance, not a kind" and "a name differing from a shallower answer only by inflection is its alias". Drop open-ended allowances like "hardware tables are allowed". Put allowances in the category's `> Accepts:` line instead.
- **Two independent filter passes per batch,** with disagreements escalated to a stronger model. That covers both error 2 (inconsistency) and error 5 (over-strictness).
- **A merge-level consistency pass** that sees all of a category's survivors together, to place aliases across batches (error 4).
- **A source plan per category before mining:** head-noun mining or listings, with named trees. The agent proposes it and a human can veto, because source choice drives recall (errors 6 and 7).
- **Low-confidence accepts score at most Memory leak** until a human confirms them. A wrongly accepted deep entry (error 1) then can't give a big score.
- **Measure precision with a sample** of about 20 accepts per category, and recall with a held-out reference list.
