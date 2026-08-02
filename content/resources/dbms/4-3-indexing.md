---
title: "Indexing"
category: dbms
part: "PART 4 — DBMS, SQL & DATA MODELLING"
number: "4.3"
order: 4.3
priority: P0
status: not-started
source: 00_MASTER_TOPIC_LIST.md
note: "single most probed DB topic at senior level"
---

- [ ] B-tree index internals; why B+ trees (leaf-linked, disk pages)
- [ ] Clustered vs non-clustered index; heap tables; InnoDB clustered PK
- [ ] Composite indexes & **leftmost prefix rule**; column ordering strategy (equality → range → sort)
- [ ] Covering index / index-only scan; `INCLUDE` columns
- [ ] Partial / filtered indexes; expression / functional indexes
- [ ] Unique indexes; index on FK columns (why it matters for deletes/locks)
- [ ] Hash, GIN, GiST, BRIN indexes (Postgres); full-text search indexes
- [ ] Index selectivity & cardinality; when an index is *not* used (low selectivity, function on column, implicit type cast, leading wildcard LIKE)
- [ ] Write cost of indexes; index bloat; `REINDEX`; `CREATE INDEX CONCURRENTLY`
- [ ] Index-only scans & visibility map (Postgres); VACUUM & autovacuum
