---
title: "Query Optimization & Performance"
category: dbms
part: "PART 4 — DBMS, SQL & DATA MODELLING"
number: "4.4"
order: 4.4
priority: P0
status: not-started
source: 00_MASTER_TOPIC_LIST.md
---

- [ ] `EXPLAIN` / `EXPLAIN ANALYZE` — read a plan: seq scan vs index scan vs bitmap heap scan; nested loop vs hash join vs merge join; estimated vs actual rows
- [ ] Query planner statistics, `ANALYZE`, stale stats, planner hints/knobs
- [ ] N+1 query problem — detection & fix (eager loading, batching, DataLoader)
- [ ] SELECT * problems; projection pushdown
- [ ] Slow query log, `pg_stat_statements`, top-N by total time
- [ ] Connection pooling: PgBouncer, HikariCP, pool sizing formula, pool exhaustion
- [ ] Batch inserts, `COPY`, bulk updates, chunked backfills
- [ ] Table partitioning: range, list, hash; partition pruning; when partitioning helps vs hurts
- [ ] Archiving & data retention
