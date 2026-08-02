---
title: "Transactions & Concurrency"
category: dbms
part: "PART 4 — DBMS, SQL & DATA MODELLING"
number: "4.5"
order: 4.5
priority: P0
status: not-started
source: 00_MASTER_TOPIC_LIST.md
---

- [ ] ACID — explain each with a bank-transfer example
- [ ] Isolation levels: Read Uncommitted, Read Committed, Repeatable Read, Serializable
- [ ] Anomalies: dirty read, non-repeatable read, phantom read, **write skew**, lost update
- [ ] MVCC (Postgres) vs locking (traditional); snapshot isolation; Postgres SSI
- [ ] Locks: row vs table, shared vs exclusive, `SELECT FOR UPDATE`, `FOR UPDATE SKIP LOCKED` (queue pattern!), advisory locks
- [ ] Deadlocks: how they occur, detection, prevention (consistent lock ordering, short transactions), retry logic
- [ ] Optimistic locking with version columns; compare-and-swap
- [ ] Long-running transactions and why they're dangerous (bloat, replication lag, lock holding)
- [ ] Two-phase commit; distributed transactions and why we avoid them → Saga
- [ ] Idempotency keys at the DB level (unique constraint on request id)
