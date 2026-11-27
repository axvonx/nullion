# Scoring report

Corpora: kernel, dblp, arxiv. score = Σ weight × min(1, log1p(count)/log1p(reference)) / Σ weight, reference = count ranked 3 in the category; weights {'kernel': 0.5, 'dblp': 1.0, 'arxiv': 1.0}; cut-offs [('off-by-one', 0.88), ('npe', 0.56), ('leak', 0.32), ('race', 0.22)].

Counts only rows that also mention: database.

## database

56 candidates; 14 with no evidence.

| answer | kernel | dblp | arxiv | score | tier | source | judge | bank file |
|---|---|---|---|---|---|---|---|---|
| MySQL | 0 | 50 | 139 | 0.80 | npe | counts | off-by-one | — |
| Oracle Database | 0 | 143 | 205 | 0.80 | npe | counts | off-by-one | — |
| PostgreSQL | 0 | 37 | 222 | 0.79 | npe | counts | off-by-one | — |
| MongoDB | 0 | 41 | 64 | 0.74 | npe | counts | off-by-one | — |
| SQLite | 0 | 23 | 83 | 0.70 | npe | counts | off-by-one | — |
| Microsoft SQL Server | 0 | 32 | 45 | 0.68 | npe | counts | off-by-one | — |
| Amazon Aurora | 0 | 25 | 20 | 0.60 | npe | counts | npe | — |
| Apache Cassandra | 0 | 19 | 23 | 0.58 | npe | counts | npe | — |
| Redis ⚠ counts said leak | 0 | 12 | 31 | 0.56 | off-by-one | judge (override) | off-by-one | — |
| SAP HANA | 0 | 19 | 12 | 0.53 | leak | counts | leak | — |
| DuckDB | 0 | 3 | 51 | 0.47 | womm | pin | npe | — |
| Snowflake | 0 | 3 | 19 | 0.39 | leak | counts | npe | — |
| MariaDB | 0 | 3 | 14 | 0.37 | leak | counts | npe | — |
| OceanBase | 0 | 5 | 7 | 0.36 | race | judge | race | — |
| Google BigQuery | 0 | 2 | 19 | 0.36 | leak | counts | npe | — |
| Vertica | 0 | 9 | 3 | 0.36 | leak | judge | leak | — |
| Greenplum | 0 | 6 | 4 | 0.34 | leak | judge | leak | — |
| MonetDB | 0 | 2 | 14 | 0.34 | leak | counts | race | — |
| Amazon Redshift | 0 | 3 | 9 | 0.33 | npe | judge | npe | — |
| CockroachDB | 0 | 2 | 12 | 0.33 | womm | pin | leak | — |
| IBM Db2 | 0 | 5 | 4 | 0.32 | npe | judge | npe | — |
| Amazon DynamoDB | 0 | 3 | 7 | 0.32 | npe | judge | npe | — |
| Couchbase | 0 | 3 | 6 | 0.31 | leak | judge | leak | — |
| Google Cloud Datastore | 0 | 1 | 15 | 0.30 | race | counts | leak | — |
| Elasticsearch ⚠ counts said race | 0 | 1 | 14 | 0.29 | npe | judge (override) | npe | — |
| Prometheus | 0 | 5 | 2 | 0.28 | npe | judge | npe | — |
| ClickHouse | 0 | 1 | 11 | 0.28 | race | counts | leak | — |
| Apache Phoenix | 0 | 4 | 2 | 0.26 | race | judge | race | — |
| Apache Ignite | 0 | 1 | 8 | 0.25 | race | judge | race | — |
| Apache IoTDB | 0 | 3 | 2 | 0.24 | race | judge | race | — |
| SingleStore | 0 | 4 | 1 | 0.23 | race | judge | race | — |
| Teradata | 0 | 6 | 0 | 0.21 | leak | judge | leak | — |
| TimescaleDB | 0 | 0 | 7 | 0.17 | leak | judge | leak | — |
| Firebird | 0 | 1 | 1 | 0.13 | womm | pin | leak | — |
| StarRocks | 0 | 0 | 3 | 0.11 | race | judge | race | — |
| OpenSearch | 0 | 0 | 3 | 0.11 | leak | judge | leak | — |
| MaxCompute | 0 | 0 | 2 | 0.09 | heisenbug | judge | heisenbug | — |
| Apache Pinot | 0 | 0 | 2 | 0.09 | race | judge | race | — |
| Exasol | 0 | 1 | 0 | 0.07 | race | judge | race | — |
| Ocient | 0 | 1 | 0 | 0.07 | bitflip | pin | heisenbug | — |
| RisingWave | 0 | 1 | 0 | 0.07 | race | judge | race | — |
| Apache Doris | 0 | 0 | 1 | 0.06 | race | judge | race | — |
| Apache Kylin | 0 | 0 | 1 | 0.06 | race | judge | race | — |
| Sybase | 0 | 0 | 1 | 0.06 | leak | judge | leak | — |
| CrateDB ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| Databend ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| Apache Druid ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| Firebolt ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| Hologres ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| Azure Data Explorer ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| IBM Netezza ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| TDengine ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| YDB ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| YugabyteDB ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| Cloudflare D1 ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| Apache Solr ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |

Counts vs judgement disagreed by more than 1 tier (judgement used, please review): Elasticsearch (counts said race, now npe), Redis (counts said leak, now off-by-one)

Your file tier and the scored tier differ by more than one (your file wins; worth a look): none

In the bank file but not scored: none


## Precision sample

20/20 sampled answers are members (100%); 17/20 also have an acceptable tier. Not members: none.

## Pipeline report

Generated 2026-11-27 18:56 UTC by scripts/bank/pipeline.py. Status stays `draft`: approval is the owner's call.

Needs a human look:
- scripts/bank/plans/database.json was DRAFTED BY AN LLM: the owner may veto or edit it (rerun with --from harvest after editing)
- Bit Flip / Works on my machine PINNED BY AN LLM (Ocient; DuckDB, CockroachDB, Firebird): the owner vets them
- scripts/bank/obvious-draft/database.json was drafted by an LLM: glance at it (approval moves it to scripts/bank/obvious/)

### Gates

| gate | result | detail |
|---|---|---|
| obvious coverage | PASS | 32/32 obvious answers accepted |
| duplicates | PASS | 0 likely duplicate pairs |
| link coverage | PASS | 56/66 answers have a verified link (85%); prompt link yes |
| precision | PASS | 20/20 sampled answers are members (100%), 17/20 with acceptable tier |
| answer count | PASS | 66 tiered answers (roadmap admission test: at least 40) |
| picks (owner) | PASS | 1 Bit Flip, 3 Works on my machine in the file; approval needs exactly 1 and at least 1: choose from the shortlists below |

### Tiers

| tier | answers | unconfirmed (auto) |
|---|---|---|
| Off-by-one | 1 | 1 |
| Works on my machine | 3 | 0 |
| Null pointer exception | 24 | 24 |
| Memory leak | 13 | 13 |
| Race condition | 22 | 22 |
| Heisenbug | 2 | 2 |
| Bit Flip | 1 | 0 |

Inbox (never accepted in play): 4.

### Bit Flip / Works on my machine shortlists

Proposed by the filter passes (picks-sheet.py format). Nothing is pinned: choose one of each, pin it in the bank file, then approve.

```
## database
_Name a database_

Works on my machine:
- [ ] DuckDB
- [ ] CockroachDB
- [ ] ClickHouse
- [ ] Firebird
- [ ] MonetDB
- [ ] other: 

Bit Flip:
- [ ] MonetDB
- [ ] TDengine
- [ ] YDB
- [ ] Apache Kylin
- [ ] Ocient
- [ ] Apache Phoenix
- [ ] other: 

```

### Stage timings

| stage | status | seconds |
|---|---|---|
| plan | done | 18 |
| harvest | done | 5 |
| filter | done | 60 |
| compare | done | 0 |
| escalate | done | 24 |
| merge | done | 6 |
| obvious | done | 23 |
| dupes | done | 0 |
| links | done | 19 |
| precision | done | 28 |
| report | running |  |
