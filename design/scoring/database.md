# Scoring: database (Name a database)

79 answers (Bit Flip and Works on my machine left out); 2 routed to Haiku (Jev confidence < 0.4). Head: familiarity >= {'off-by-one': 4.4, 'npe': 2.0}. Tail by evidence: strong (10000, 100, 15), some (3000, 50, 8) (clicks/month, Stack Exchange questions, distro families).

| tier | new | bank today | of the new, confirmed lines that disagree |
|---|---|---|---|
| off-by-one | 6 (8%) | 1 | 0 |
| npe | 28 (35%) | 24 | 0 |
| leak | 30 (38%) | 16 | 0 |
| race | 2 (3%) | 29 | 0 |
| heisenbug | 13 (16%) | 9 | 0 |

Same tier as today: 32/79 (41%).

## Off-by-one (6)

MySQL 5.5 [12661c 673738q 29f], Oracle Database 5.0 [7707c 152532q 1f], MongoDB 4.8 [10588c 177027q 20f], Microsoft SQL Server 4.5 [5208c 340260q 0f], PostgreSQL 4.5 [21237c 178880q 54f], SQLite 4.5 [11989c 95145q 63f]

## Null pointer exception (28)

Redis 4.3 [10805c 26013q 43f], Microsoft Access 4.0* [9732c 58518q 0f], Elasticsearch 3.6 [28036c 59005q 13f], Amazon DynamoDB 3.5 [1532c 14135q 1f], Snowflake 3.4 [0c 11418q 10f], MariaDB 3.4 [5342c 15565q 48f], Google BigQuery 3.1 [2042c 25959q 0f], Apache Cassandra 3.0 [3060c 21033q 13f], Firestore 3.0* [0c 42542q 0f], Prometheus 2.6 [2121c 7105q 24f], Apache HBase 2.6 [435c 6980q 6f], IBM Db2 2.5 [1742c 12987q 0f], Amazon Redshift 2.5 [683c 8720q 34f], SAP HANA 2.4 [2383c 1979q 6f], Amazon Aurora 2.4 [430c 1604q 0f], LevelDB 2.3 [0c 417q 39f], CouchDB 2.3 [979c 6269q 14f], Cloud Spanner 2.3 [1918c 714q 0f], Azure Cosmos DB 2.3 [1062c 7602q 0f], Neo4j 2.2 [3518c 22929q 8f], RocksDB 2.1 [1130c 492q 26f], etcd 2.1 [0c 614q 22f], Apache Solr 2.1 [0c 20803q 12f], dBase 2.1 [0c 293q 0f], FoxPro 2.1 [0c 850q 0f], ClickHouse 2.1 [6941c 2043q 8f], OpenSearch 2.0 [2695c 1097q 9f], InfluxDB 2.0 [1801c 3034q 21f]

## Memory leak (30)

Teradata 1.9 [1600c 5593q 0f], TiDB 1.9 [3596c 104q 4f], Google Cloud Datastore 1.9 [154c 7313q 0f], Couchbase 1.9 [727c 4066q 0f], Sybase 1.8 [473c 3384q 0f], RethinkDB 1.6 [0c 1436q 5f], Riak 1.6 [0c 791q 1f], Apache Druid 1.5 [233c 622q 3f], Informix 1.4 [0c 2259q 0f], Vertica 1.4 [769c 1429q 0f], Greenplum 1.4 [605c 806q 0f], ScyllaDB 1.4 [0c 366q 0f], Ingres 1.4 [0c 154q 0f], TimescaleDB 1.4 [1635c 723q 16f], ArangoDB 1.3 [0c 1978q 6f], Azure Data Explorer 1.3 [0c 1971q 0f], Apache Derby 1.2 [260c 2650q 7f], CrateDB 1.1 [241c 150q 2f], Apache Kylin 1.1 [42c 160q 1f], Apache Ignite 1.1 [335c 3058q 2f], YugabyteDB 1.1 [0c 345q 0f], IBM Netezza 1.1 [223c 1362q 0f], LMDB 1.1 [0c 261q 51f], Apache Phoenix 1.1 [86c 718q 1f], SingleStore 1.0 [688c 401q 0f], TDengine 1.0 [0c 222q 1f], Datomic 1.0 [0c 434q 1f], VoltDB 0.9 [0c 155q 1f], MonetDB 0.9 [162c 444q 8f], Apache IoTDB 0.5 [0c 469q 0f]

## Race condition (2)

IMS 1.5 [0c 61q 0f], Exasol 1.0 [288c 93q 0f]

## Heisenbug (13)

Firebolt 1.5 [0c 0q 0f], FoundationDB 1.4 [0c 38q 4f], OceanBase 1.3 [0c 0q 0f], StarRocks 1.3 [0c 11q 0f], MaxCompute 1.1 [0c 0q 0f], Apache Doris 1.1 [0c 6q 1f], Apache Pinot 0.9 [0c 26q 1f], Cloudflare D1 0.9 [0c 0q 0f], Databend 0.9 [0c 0q 1f], RisingWave 0.9 [0c 0q 0f], YDB 0.7 [0c 4q 1f], Hologres 0.7 [0c 0q 0f], Umbra 0.7 [0c 0q 0f]

`*` = Haiku's level (Jev's confidence was low). [clicks/month, Stack Exchange questions, distro families]
