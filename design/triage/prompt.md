You are triaging draft categories for nullion, a daily computing-trivia game in the style of krillion: each prompt ("Name a type of lock") accepts every named kind of the thing, and rarer answers score more (tiers from obvious to one deep-cut "Bit Flip"). A good prompt has (a) a clear membership rule, (b) obvious first answers ordinary programmers type at once, (c) a long tail of real named deep cuts (from codebases, docs, papers), and (d) answers that are names, not descriptions or API calls.

Read BATCH (draft categories: id, prompt, domain, what it accepts, example answers). Also read ALL (every draft) and APPROVED (categories already live) to spot overlaps.

For EVERY draft in BATCH decide:
- "keep": strong as is.
- "fix": promising but the prompt or membership rule needs a change (say the better prompt in "fix").
- "merge": substantially overlaps another draft or an approved category (give its id in "mergeWith"; the weaker one merges into the stronger).
- "cut": too few real answers (under ~25 nameable kinds), no obvious end, answers are descriptions/APIs, or too niche/too trivial to be fun.
Score 1-5: "obvious" (how many answers a typical developer types within 10 s), "depth" (size and realness of the deep tail), "fun". Give "estAnswers" (rough count of real named kinds), and "wildcard": true if it suits an occasional slot rather than the four regular domains (OS/systems, data structures & algorithms, languages & tools, hardware & security).

Write ONLY a JSON file to OUT: {"items": [{"id": "...", "verdict": "keep|fix|merge|cut", "fix": "<better prompt or null>", "mergeWith": "<id or null>", "obvious": n, "depth": n, "fun": n, "estAnswers": n, "wildcard": bool, "reason": "one sentence"}]} with one item per BATCH draft. Validate: python3 -I -c "import json;print(len(json.load(open('OUT'))['items']))". Reply with only that number.
