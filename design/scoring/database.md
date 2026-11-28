# Scoring: database (Name a database)

79 answers (Bit Flip and Works on my machine left out); 2 routed to Haiku (Jev confidence < 0.4). Head: familiarity >= {'off-by-one': 4.4, 'npe': 2.0}. Tail by evidence: strong (5000, 30, None), some (1500, 10, 20) (clicks/month, Stack Exchange questions, distro families).

| tier | new | bank today | of the new, confirmed lines that disagree |
|---|---|---|---|
| off-by-one | 6 (8%) | 6 | 0 |
| npe | 34 (43%) | 34 | 0 |
| leak | 27 (34%) | 27 | 0 |
| race | 1 (1%) | 1 | 0 |
| heisenbug | 11 (14%) | 11 | 0 |

Same tier as today: 79/79 (100%).

## Off-by-one (6)

MySQL 5.5 [12661c 673738q 29f 12533s], Oracle Database 5.0 [7707c 142q 1f 0s], MongoDB 4.8 [10588c 177027q 20f 28741s], Microsoft SQL Server 4.5 [5208c 340260q 0f 0s], PostgreSQL 4.5 [21237c 178880q 54f 0s], SQLite 4.5 [11989c 95145q 63f 0s]

## Null pointer exception (34)

Redis 4.3 [10805c 26013q 43f 77668s], Microsoft Access 4.0* [9732c 58518q 0f 0s], Elasticsearch 3.6 [28036c 59005q 13f 0s], Amazon DynamoDB 3.5 [1532c 14135q 1f 0s], Snowflake 3.4 [865c 0q 10f 0s], MariaDB 3.4 [5342c 15565q 48f 8665s], Google BigQuery 3.1 [2042c 25959q 0f 0s], Apache Cassandra 3.0 [3060c 21033q 13f 10164s], Firestore 3.0* [368c 42542q 0f 0s], Prometheus 2.6 [2121c 7105q 24f 67931s], Apache HBase 2.6 [435c 6980q 6f 0s], IBM Db2 2.5 [1742c 12945q 0f 0s], Amazon Redshift 2.5 [683c 8720q 34f 0s], SAP HANA 2.4 [2383c 1979q 6f 0s], Amazon Aurora 2.4 [430c 1604q 0f 0s], LevelDB 2.3 [0c 417q 39f 0s], CouchDB 2.3 [979c 6269q 14f 7021s], Cloud Spanner 2.3 [1918c 714q 0f 0s], Azure Cosmos DB 2.3 [1062c 7602q 0f 0s], Neo4j 2.2 [3518c 22929q 8f 17504s], RocksDB 2.1 [1130c 492q 26f 32346s], etcd 2.1 [0c 614q 22f 52662s], Apache Solr 2.1 [1089c 20803q 12f 0s], dBase 2.1 [2111c 293q 0f 0s], FoxPro 2.1 [0c 850q 0f 0s], ClickHouse 2.1 [6941c 2043q 8f 51216s], OpenSearch 2.0 [2695c 1097q 9f 0s], InfluxDB 2.0 [1801c 3034q 21f 31834s], Teradata 1.9 [1600c 5593q 0f 0s]^, TiDB 1.9 [3596c 104q 4f 40784s]^, RethinkDB 1.6 [132c 1436q 5f 27015s]^, TimescaleDB 1.4 [1635c 723q 16f 23903s]^, ArangoDB 1.3 [621c 1978q 6f 14302s]^, TDengine 1.0 [0c 222q 1f 25214s]^

## Memory leak (27)

Google Cloud Datastore 1.9 [154c 7313q 0f 0s], Couchbase 1.9 [727c 4066q 0f 0s], Sybase 1.8 [473c 3384q 0f 0s], Riak 1.6 [465c 791q 1f 0s], Apache Druid 1.5 [233c 3q 3f 14098s], Informix 1.4 [0c 2259q 0f 0s], FoundationDB 1.4 [0c 38q 4f 0s], Vertica 1.4 [769c 1429q 0f 0s], Greenplum 1.4 [605c 806q 0f 0s], ScyllaDB 1.4 [1238c 366q 0f 0s], Ingres 1.4 [1633c 154q 0f 0s], Azure Data Explorer 1.3 [0c 1971q 0f 0s], Apache Derby 1.2 [260c 2650q 7f 0s], CrateDB 1.1 [241c 139q 2f 0s], Apache Kylin 1.1 [42c 160q 1f 0s], YugabyteDB 1.1 [927c 345q 0f 0s], Apache Ignite 1.1 [335c 3058q 2f 0s], IBM Netezza 1.1 [223c 1362q 0f 0s], LMDB 1.1 [0c 261q 51f 0s], Apache Phoenix 1.1 [86c 704q 1f 1055s], SingleStore 1.0 [688c 401q 0f 0s], Exasol 1.0 [288c 93q 0f 0s], Datomic 1.0 [0c 434q 1f 0s], VoltDB 0.9 [348c 155q 1f 0s], Apache Pinot 0.9 [238c 26q 1f 6175s], MonetDB 0.9 [162c 444q 8f 489s], Apache IoTDB 0.5 [97c 469q 0f 0s]

## Race condition (1)

StarRocks 1.3 [0c 11q 0f 0s]

## Heisenbug (11)

IMS 1.5 [0c 0q 0f 0s], Firebolt 1.5 [0c 0q 0f 0s], OceanBase 1.3 [0c 0q 0f 0s], MaxCompute 1.1 [0c 0q 0f 0s], Apache Doris 1.1 [0c 6q 1f 0s], Cloudflare D1 0.9 [0c 0q 0f 0s], Databend 0.9 [0c 0q 1f 0s], RisingWave 0.9 [0c 0q 0f 0s], YDB 0.7 [167c 0q 0f 0s], Hologres 0.7 [0c 0q 0f 0s], Umbra 0.7 [0c 0q 0f 0s]

`*` = Haiku's level (Jev's confidence was low); `^` = lifted into Null pointer exception by evidence {'clicks': 30000, 'se': 1000, 'stars': 20000}. [clicks/month, Stack Exchange questions, distro families, GitHub stars]
