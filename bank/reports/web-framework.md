# Scoring report

Corpora: kernel, dblp, arxiv. score = Σ weight × min(1, log1p(count)/log1p(reference)) / Σ weight, reference = count ranked 3 in the category; weights {'kernel': 0.5, 'dblp': 1.0, 'arxiv': 1.0}; cut-offs [('off-by-one', 0.88), ('npe', 0.56), ('leak', 0.32), ('race', 0.22)].

Counts only rows that also mention: web framework.

## web-framework

94 candidates; 81 with no evidence.

| answer | kernel | dblp | arxiv | score | tier | source | judge | bank file |
|---|---|---|---|---|---|---|---|---|
| Django | 0 | 2 | 3 | 0.80 | off-by-one | judge | off-by-one | — |
| Flask | 0 | 1 | 3 | 0.80 | off-by-one | judge | off-by-one | — |
| FastAPI | 0 | 0 | 1 | 0.40 | off-by-one | judge | off-by-one | — |
| Sanic | 0 | 1 | 0 | 0.40 | leak | judge | leak | — |
| web2py | 0 | 0 | 1 | 0.40 | leak | judge | leak | — |
| Apache Tapestry | 0 | 0 | 1 | 0.40 | leak | judge | leak | — |
| Google Web Toolkit | 0 | 0 | 1 | 0.40 | leak | judge | leak | — |
| Gemini | 0 | 0 | 1 | 0.40 | heisenbug | judge | heisenbug | — |
| React | 0 | 0 | 1 | 0.40 | off-by-one | judge | off-by-one | — |
| aiohttp ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| BlackSheep ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| Bottle ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| CherryPy | 0 | 0 | 0 | 0.00 | womm | pin | leak | — |
| Emmett ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| Eve ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| Falcon ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| Klein | 0 | 0 | 0 | 0.00 | womm | pin | race | — |
| Litestar ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| Microdot ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| mrhttp ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| Panther ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| Pyramid ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| Quart ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| Responder ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| Robyn ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| Tornado ⚠ no evidence | 0 | 0 | 0 | 0.00 | npe | judge | npe | — |
| TurboGears ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| Webware ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| ActiveJ ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| Armeria ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| Avaje Jex ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| Blade ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| Curacao ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| Dropwizard ⚠ no evidence | 0 | 0 | 0 | 0.00 | npe | judge | npe | — |
| Helidon ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| Inverno ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| Javalin ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| Jawn ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| Jooby ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| Light-4j ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| LoveQQ ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| Micronaut ⚠ no evidence | 0 | 0 | 0 | 0.00 | npe | judge | npe | — |
| Minijax ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| MuServer ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| Ninja ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| OfficeFloor ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| Pippo | 0 | 0 | 0 | 0.00 | womm | pin | race | — |
| Play Framework ⚠ no evidence | 0 | 0 | 0 | 0.00 | npe | judge | npe | — |
| Quarkus ⚠ no evidence | 0 | 0 | 0 | 0.00 | npe | judge | npe | — |
| Rapidoid ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| Ratpack ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| RestExpress ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| Revenj ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| Solon ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| Spring ⚠ no evidence | 0 | 0 | 0 | 0.00 | off-by-one | judge | off-by-one | — |
| Eclipse Vert.x ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| Voovan ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| Apache Wicket ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| Angular ⚠ no evidence | 0 | 0 | 0 | 0.00 | off-by-one | judge | off-by-one | — |
| Aurelia ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| Backbone.js ⚠ no evidence | 0 | 0 | 0 | 0.00 | npe | judge | npe | — |
| CanJS ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| Dojo ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| Ember.js ⚠ no evidence | 0 | 0 | 0 | 0.00 | npe | judge | npe | — |
| Exoskeleton ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| Knockout ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| Mithril ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| Polymer ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| Ractive.js ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| Vue.js ⚠ no evidence | 0 | 0 | 0 | 0.00 | off-by-one | judge | off-by-one | — |
| Starlette ⚠ no evidence | 0 | 0 | 0 | 0.00 | npe | judge | npe | — |
| ActFramework ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| HServer ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| Jersey ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| Magician ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| Proteus ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| Spark ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| tio-boot ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| TODAY-Web ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| Wizzardo HTTP ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| Binding.scala | 0 | 0 | 0 | 0.00 | bitflip | pin | heisenbug | — |
| Duel ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| Enyo ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| jsblocks ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| Knockback.js ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| Lavaca ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| Lit ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| Preact ⚠ no evidence | 0 | 0 | 0 | 0.00 | npe | judge | npe | — |
| Reagent ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| Riot.js ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| Svelte ⚠ no evidence | 0 | 0 | 0 | 0.00 | npe | judge | npe | — |
| socketify.py ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| Bayou ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| Redkale ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |

Counts vs judgement disagreed by more than 1 tier (judgement used, please review): none

Your file tier and the scored tier differ by more than one (your file wins; worth a look): none

In the bank file but not scored: none


## Precision sample

19/20 sampled answers are members (95%); 19/20 also have an acceptable tier. Not members: LoveQQ (I cannot confirm a web framework by this name exists, and I can't open the batch file here to check. Strict rule: false when unsure.).

## Pipeline report

Generated 2026-11-27 22:52 UTC by scripts/bank/pipeline.py. Status stays `draft`: approval is the owner's call.

Needs a human look:
- scripts/bank/plans/web-framework.json was DRAFTED BY AN LLM: the owner may veto or edit it (rerun with --from harvest after editing)
- Bit Flip / Works on my machine PINNED BY AN LLM (Binding.scala; CherryPy, Klein, Pippo): the owner vets them
- scripts/bank/obvious-draft/web-framework.json was drafted by an LLM: glance at it (approval moves it to scripts/bank/obvious/)

### Gates

| gate | result | detail |
|---|---|---|
| obvious coverage | PASS | 37/37 obvious answers accepted |
| duplicates | PASS | 0 likely duplicate pairs |
| link coverage | WARN | 59/126 answers have a verified link (47%); prompt link yes |
| precision | PASS | 19/20 sampled answers are members (95%), 19/20 with acceptable tier |
| answer count | PASS | 126 tiered answers (roadmap admission test: at least 40) |
| picks (owner) | PASS | 1 Bit Flip, 3 Works on my machine in the file; approval needs exactly 1 and at least 1: choose from the shortlists below |

### Tiers

| tier | answers | unconfirmed (auto) |
|---|---|---|
| Off-by-one | 14 | 14 |
| Works on my machine | 3 | 0 |
| Null pointer exception | 35 | 35 |
| Memory leak | 24 | 24 |
| Race condition | 24 | 24 |
| Heisenbug | 25 | 25 |
| Bit Flip | 1 | 0 |

Inbox (never accepted in play): 4.

### Bit Flip / Works on my machine shortlists

Proposed by the filter passes (picks-sheet.py format). Nothing is pinned: choose one of each, pin it in the bank file, then approve.

```
## web-framework
_Name a web framework_

Works on my machine:
- [ ] CherryPy
- [ ] Backbone.js
- [ ] Ember.js
- [ ] Webware
- [ ] Klein
- [ ] Pippo
- [ ] other: 

Bit Flip:
- [ ] OfficeFloor
- [ ] Microdot
- [ ] Binding.scala
- [ ] Revenj
- [ ] Redkale
- [ ] other: 

```

### Stage timings

| stage | status | seconds |
|---|---|---|
| plan | done | 11 |
| harvest | done | 1 |
| filter | done | 53 |
| compare | done | 0 |
| escalate | done | 27 |
| merge | done | 6 |
| obvious | done | 18 |
| dupes | done | 0 |
| links | done | 30 |
| precision | done | 27 |
| report | running |  |
