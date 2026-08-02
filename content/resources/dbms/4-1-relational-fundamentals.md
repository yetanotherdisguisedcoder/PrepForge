---
title: "Relational Fundamentals"
category: dbms
part: "PART 4 — DBMS, SQL & DATA MODELLING"
number: "4.1"
order: 4.1
priority: P0
status: not-started
source: 00_MASTER_TOPIC_LIST.md
---

- [ ] DBMS vs RDBMS; relational algebra basics
- [ ] Keys: primary, foreign, candidate, super, composite, unique, surrogate vs natural
- [ ] Constraints: NOT NULL, UNIQUE, CHECK, DEFAULT, referential actions (CASCADE/RESTRICT/SET NULL)
- [ ] ER modelling: entities, relationships, cardinality, weak entities; ER → schema
- [ ] Normalization: 1NF, 2NF, 3NF, BCNF (+ 4NF/5NF awareness); functional dependencies; anomalies
- [ ] **Denormalization** — when and why (read-heavy, counters, derived columns) and how you keep it in sync
- [ ] Data types & storage: fixed vs variable, TEXT vs VARCHAR, numeric precision, UUID vs bigint PKs (and UUID index-fragmentation problem, UUIDv7/ULID as the fix)
- [ ] Schema design for multi-tenancy: shared table + tenant_id vs schema-per-tenant vs DB-per-tenant (**your eLitmus reality — have an opinion**)
- [ ] Soft deletes vs hard deletes; audit tables; temporal data
