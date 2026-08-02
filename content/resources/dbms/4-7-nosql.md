---
title: "NoSQL"
category: dbms
part: "PART 4 — DBMS, SQL & DATA MODELLING"
number: "4.7"
order: 4.7
priority: P1
status: not-started
source: 00_MASTER_TOPIC_LIST.md
---

- [ ] **OLTP vs OLAP** — access pattern difference, row-oriented vs columnar storage, why you don't run analytics on your prod OLTP replica
- [ ] Data warehouse basics: star vs snowflake schema, fact/dimension tables, ETL vs ELT, Redshift/BigQuery/Snowflake (awareness)
- [ ] When NoSQL over SQL (and the honest answer: usually not, unless access patterns demand it)
- [ ] **NewSQL / distributed SQL** 🟡 (CockroachDB, Google Spanner, TiDB, YugabyteDB, Vitess) — Raft/Paxos-replicated relational stores that give horizontal scale without giving up SQL/ACID; know the trade-off vs plain sharded Postgres
- [ ] Types: key-value, document, wide-column, graph, time-series, vector
- [ ] **MongoDB**: documents, collections, embedding vs referencing, schema design for access patterns, indexes (compound, multikey, TTL, text), aggregation pipeline, sharding & shard keys, replica sets, read/write concerns, transactions (4.0+), `$lookup` limits
- [ ] **DynamoDB** 🟠 *(on your resume)*: partition key + sort key, single-table design, GSI vs LSI, hot partitions, RCU/WCU & on-demand, DynamoDB Streams, conditional writes, eventually vs strongly consistent reads, TTL
- [ ] **Cassandra** ⚪: wide column, tunable consistency (R+W>N), partition key design, no joins
- [ ] **Elasticsearch** 🟡: inverted index, analyzers, mapping, relevance/BM25, aggregations, when to use vs SQL full-text
- [ ] **Time-series** (Prometheus TSDB, InfluxDB, Timescale) 🟡 — you run Prometheus, know the data model: metric name + labels, cardinality explosion
- [ ] **Vector DBs** 🟡 (pgvector, Pinecone, Qdrant) — embeddings, ANN/HNSW, cosine vs dot product. **Relevant to your RAG pipeline — expect a question.**
- [ ] Polyglot persistence; CAP applied to specific stores; BASE vs ACID
