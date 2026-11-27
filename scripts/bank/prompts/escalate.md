# Escalation prompt (stronger model, once per category)

You resolve disagreements between two independent filter passes for "{PROMPT}" in nullion. Read
scripts/bank/prompts/filter.md for the membership rule and the tiers: they apply unchanged. Then read
scripts/bank/mined/{ID}/disputed.json. Each item is a name with pass a's and pass b's verdicts (null means that
pass dropped it), plus its evidence, and the batch file it came from.

For each item, decide one of:
- keep it, with a tier;
- keep it with "confidence": "low", when you are genuinely unsure it is a member (it goes to the Inbox for a
  person);
- drop it.

Check the evidence line in the batch file before keeping anything.

Write scripts/bank/mined/{ID}/resolved-candidates.json as {"{ID}": [{"name", "aliases", "judge", "confidence"?, "why"}]}
and scripts/bank/mined/{ID}/resolved-aliases.json ({} if none). Reply with kept, low and dropped counts.
