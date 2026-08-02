---
title: "Replication, Scaling & Operations"
category: dbms
part: "PART 4 — DBMS, SQL & DATA MODELLING"
number: "4.6"
order: 4.6
priority: P1
status: not-started
source: 00_MASTER_TOPIC_LIST.md
---

- [ ] Replication: synchronous vs asynchronous, physical vs logical, streaming replication, replication lag & read-your-own-writes
- [ ] Read replicas: routing reads, staleness handling
- [ ] Failover: automatic vs manual, split brain, quorum
- [ ] Sharding: key selection, hash vs range vs directory; resharding pain; hotspots; cross-shard joins & transactions
- [ ] Vertical vs horizontal scaling; when to shard (usually later than people think)
- [ ] Backups: full/incremental, PITR, WAL archiving, tested restores (say "an untested backup is not a backup")
- [ ] **Zero-downtime migrations** 🔴 — expand/contract pattern, add-nullable-then-backfill-then-constrain, dual writes, avoiding long locks, `ALTER TABLE` blocking behaviour. *(You've done Rails 7 migrations + a live Credits System — this is a strong story.)*
- [ ] Database DR, RPO/RTO
- [ ] Monitoring: connections, cache hit ratio, replication lag, lock waits, bloat, slow queries
