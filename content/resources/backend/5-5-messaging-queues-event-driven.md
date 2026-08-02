---
title: "Messaging, Queues & Event-Driven"
category: backend
part: "PART 5 — BACKEND & API FUNDAMENTALS"
number: "5.5"
order: 5.5
priority: P0
status: not-started
source: 00_MASTER_TOPIC_LIST.md
---

- [ ] Sync vs async communication — when to introduce a queue
- [ ] Queue (point-to-point, competing consumers) vs **Pub/Sub** (fan-out, one event → many subscribers)
- [ ] **Fan-out** patterns: fan-out on write (push, precompute) vs fan-out on read (pull, compute at query) vs hybrid — the Twitter timeline / celebrity problem. **Know this cold, you asked for it.**
- [ ] Fan-in / aggregation; scatter-gather
- [ ] Delivery semantics: at-most-once, at-least-once, exactly-once (and why true exactly-once is a myth — it's at-least-once + idempotent consumer + dedup)
- [ ] Ordering: global vs partition-level; why global ordering doesn't scale; ordering keys
- [ ] Consumer groups, partitions, rebalancing (and cooperative rebalancing), consumer lag
- [ ] Dead letter queues, poison messages, retry topics, max delivery attempts
- [ ] Message durability, acks, replication factor, ISR
- [ ] Backpressure in streaming systems
- [ ] **Kafka** 🟠 *(on your resume — be careful, either learn it properly or downgrade the claim)*: topics, partitions, offsets, consumer groups, log compaction, retention, replication & ISR, exactly-once semantics (idempotent producer + transactions), Kafka Connect, Kafka Streams, when Kafka is overkill
- [ ] **Schema registry & schema evolution** 🟠 — Avro/Protobuf/JSON Schema, backward vs forward vs full compatibility, why producers/consumers need independent deploy cadence, breaking-change prevention. *(A classic Kafka deep-dive follow-up — expect it given Kafka is already on your resume.)*
- [ ] **RabbitMQ**: exchanges (direct/topic/fanout/headers), queues, bindings, acks, prefetch, TTL, DLX
- [ ] **AWS SQS/SNS**: standard vs FIFO, visibility timeout, long polling, message deduplication ID, SNS fan-out to SQS, EventBridge
- [ ] **Redis Streams**, **Sidekiq**, **JobRunr**, **Celery**, **BullMQ** — job queue semantics you've actually used
- [ ] **Outbox pattern** 🟠 — the dual-write problem (DB commit + publish event atomically); transactional outbox + CDC
- [ ] **Change Data Capture** (Debezium, WAL/binlog tailing)
- [ ] **Saga pattern**: choreography vs orchestration; compensating transactions; when to use over 2PC
- [ ] Event sourcing + CQRS: event store, projections/read models, replay, snapshots, eventual consistency in the read model, when it's overkill
- [ ] Idempotent consumers: dedup store, natural idempotency, upserts
- [ ] Scheduled/delayed jobs: cron in a distributed system, leader election, missed executions, drift, timezone/DST bugs. **Directly your CloudNap scheduler.**
