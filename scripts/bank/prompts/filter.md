# Filter pass prompt (one pass over one batch)

Fill in the placeholders. Run it twice per batch as two independent agents (pass a and pass b). Use
OUT_PREFIX = scripts/bank/mined/<id>/batch-NN.a and .b. Neither pass sees the other's output.

---

You are filtering mined candidate answers for "{PROMPT}" in nullion, a computing trivia game. Players type one
answer per prompt. Deeper answers (more obscure but real) score more.

Inputs:
- BATCH_FILE {BATCH_FILE}: names, phrases and identifiers mined from real source trees and listings, grouped
  under `## source:` headers. Lines are `<files> <phrase>` or bare names. They are noisy: most lines are not answers.
- BANK_FILE {BANK_FILE}: the category's current answers, and its `> Accepts:` line, which states what this
  category accepts. Skip anything already there as a name or alias (ignore case, spaces, hyphens and underscores).

MEMBERSHIP RULE (decided by the project owner; apply it exactly):
- COUNTS: a *named kind* that experts call by that name in a real codebase, its docs or a paper. That covers
  designs (MCS lock, Swiss table) and a system's own named primitive or implementation (Windows ERESOURCE,
  FreeBSD rmlock, Redis listpack, the illumos lofs filesystem). The kind need not be popular.
- ALIAS, NOT A NEW ENTRY:
  - a plain binding of a generic name in some library or API (std::mutex → mutex; ArrayList → dynamic array);
  - an abbreviation or directory name of a kept entry (cd9660 → ISO 9660);
  - any name that differs from an existing answer only by inflection, case or punctuation (PostgreSQL's
    "SHARE lock" → shared lock). Those would otherwise hand out a deep tier for a typo.
- NEVER COUNTS:
  - functions, macros and API calls;
  - specific instances, fields and variables;
  - a single subsystem's own struct type that names one object rather than a kind (ProcArray, vm_map,
    CM_RESOURCE_LIST);
  - config symbols and states;
  - neighbouring-domain concepts that are merely stored in or near the thing (a TLB is a hardware cache, not a
    data structure; an access control list is a security model);
  - prose fragments.
- The `> Accepts:` line can narrow or widen this. No other allowances apply.
- Aliases shorter than 3 characters, or that are common English words, are too generic. Leave them out.
- Never invent anything. Every kept entry must come from a line in the batch file; quote it in "evidence". A
  name you are certain is real but that appears in no source (closed-source products, say) may be kept only
  with "evidence": "memory (no source)".

Familiarity tier (how many working programmers would know this name, not how often papers mention it):
- off-by-one: nearly everyone names it first;
- npe: many know it;
- leak: systems or domain people know it;
- race: specialists in that codebase or field know it;
- heisenbug: deep internals only.

Never use womm or bitflip here.

If BANK_FILE has no tiered answers yet (a fresh draft), also propose:
- "womm_candidates": 3 kept names that are the cliché "I'm being clever" pick. That's the one many players
  reach for, thinking it's obscure: TempleOS for operating systems, RCU for locks, ReiserFS for filesystems.
  It is not merely a mid-tier name;
- "bitflip_candidates": 3 kept names that would make the most delightful single deep cut.

Write OUT_PREFIX-candidates.json:
{"{ID}": [{"name": "...", "aliases": ["..."], "judge": "off-by-one|npe|leak|race|heisenbug", "evidence": "...", "why": "short clause"}], "womm_candidates": [...], "bitflip_candidates": [...]}
and OUT_PREFIX-aliases.json: {"<existing answer exactly as in BANK_FILE>": ["new alias", ...]}, or {} if none.
Validate both with python3 -I -c "import json;json.load(open('PATH'))". Reply with only the kept count.
