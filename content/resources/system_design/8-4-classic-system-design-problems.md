---
title: "Classic System Design Problems"
category: system_design
part: "PART 8 — DISTRIBUTED SYSTEMS & HIGH-LEVEL SYSTEM DESIGN"
number: "8.4"
order: 8.4
priority: P0
status: not-started
source: 00_MASTER_TOPIC_LIST.md
---

**Tier 1 (must do):**
- [ ] URL shortener (TinyURL) — ID generation, base62, redirect (301 vs 302), analytics
- [ ] Rate limiter (distributed)
- [ ] **Online coding assessment / IDE platform** ← *design your own product; you will be asked to*
- [ ] Chat / messaging system (WebSockets, presence, fan-out, offline delivery, read receipts)
- [ ] News feed / timeline (fan-out on write vs read, celebrity problem, ranking)
- [ ] Notification service (multi-channel, dedup, throttling, templating, delivery tracking)
- [ ] File storage / Dropbox (chunking, dedup, sync, conflict resolution)
- [ ] Web crawler (politeness, dedup via Bloom filter, frontier, DNS caching)

**Tier 2:**
- [ ] YouTube/Netflix (upload, transcoding pipeline, CDN, adaptive bitrate)
- [ ] Uber/food delivery (geospatial index, geohash/quadtree/S2, matching, driver state machine)
- [ ] Ticket booking / BookMyShow (seat locking, inventory, overselling prevention, payment saga)
- [ ] Payment system (idempotency, ledger, double-entry, reconciliation, PCI awareness)
- [ ] Search autocomplete (trie, top-k, prefix caching)
- [ ] Distributed job scheduler / cron (**you built one — CloudNap**)
- [ ] Metrics & monitoring system (**you built one — Prometheus stack**)
- [ ] Log aggregation & search
- [ ] Leaderboard (Redis sorted sets)
- [ ] Ad click aggregation / analytics counters (approximate counting, HLL)
- [ ] Multi-tenant SaaS platform (**your daily job — nail this one**)
- [ ] Live streaming / video call
- [ ] E-commerce checkout & inventory
- [ ] Distributed cache (design Redis)
- [ ] Object storage (design S3)
- [ ] Key-value store (design DynamoDB)
- [ ] CI/CD pipeline system
- [ ] Feature flag service
- [ ] **LLM-backed evaluation / RAG service** 🟡 (**your AI summary microservice — a 2026 differentiator**)
