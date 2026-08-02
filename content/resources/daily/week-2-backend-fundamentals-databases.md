---
title: "WEEK 2 — BACKEND FUNDAMENTALS & DATABASES"
category: daily
part: "6-Week Execution Plan & Tracker"
order: 303
priority: P2
status: not-started
source: 03_STUDY_PLAN_AND_TRACKER.md
---

| Day | Focus | Sections |
|---|---|---|
| Mon | HTTP, REST semantics, status codes, idempotency | 5.1, 5.2 |
| Tue | Rate limiting (all 5 algorithms), retries, backoff, circuit breakers, timeouts | 5.4 |
| Wed | Indexing deep + `EXPLAIN` reading. **Run real EXPLAINs on your own Postgres.** | 4.3, 4.4 |
| Thu | Transactions, isolation levels, anomalies, locking, deadlocks | 4.5 |
| Fri | Caching patterns, Redis data types, stampede/penetration/avalanche | 4.8 |
| Sat | 15 SQL problems: window functions, top-N-per-group, gaps & islands, running totals | Written, not read |
| Sun | Replication, sharding, zero-downtime migrations + review the whole week aloud | 4.6 |

**Week 2 exit test:** explain — without notes — why an index isn't being used, what write skew is, and how you'd rate-limit 10k req/s across 5 app nodes.

---
