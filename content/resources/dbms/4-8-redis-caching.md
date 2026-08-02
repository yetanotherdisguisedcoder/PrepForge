---
title: "Redis & Caching"
category: dbms
part: "PART 4 — DBMS, SQL & DATA MODELLING"
number: "4.8"
order: 4.8
priority: P0
status: not-started
source: 00_MASTER_TOPIC_LIST.md
note: "you run Redis in production"
---

- [ ] Data types: string, hash, list, set, sorted set, bitmap, hyperloglog, stream, geospatial — and a use case each
- [ ] Sorted sets for leaderboards / rate limiting / delayed queues
- [ ] Expiry & eviction policies: `noeviction`, `allkeys-lru`, `volatile-lru`, `allkeys-lfu`, `volatile-ttl`
- [ ] Persistence: RDB vs AOF, `appendfsync` trade-offs, durability expectations
- [ ] Single-threaded model (+ IO threads in 6.x), why `KEYS` is dangerous, use `SCAN`
- [ ] Pipelining vs transactions (`MULTI/EXEC`) vs Lua scripts (atomicity)
- [ ] Pub/Sub vs Streams (consumer groups, acks, at-least-once)
- [ ] Redis as distributed lock: `SET NX PX`, Redlock, and the **known critiques** of Redlock (mention this — big senior signal)
- [ ] Clustering, hash slots, replication, Sentinel
- [ ] Caching patterns: cache-aside (lazy loading), read-through, write-through, write-behind, refresh-ahead
- [ ] Invalidation strategies: TTL, versioned keys, event-driven bust, tag-based
- [ ] **Cache stampede / thundering herd** — mitigation: jittered TTL, probabilistic early expiry, request coalescing / single-flight, locks
- [ ] **Cache penetration** (queries for non-existent keys) → negative caching, Bloom filter
- [ ] **Cache avalanche** (mass simultaneous expiry) → TTL jitter
- [ ] Hot key problem → local cache tier, key splitting, replicas
- [ ] Multi-level caching: CPU → in-process → Redis → CDN → browser
- [ ] Cache consistency: cache-then-DB vs DB-then-cache ordering; delete vs update on write; double-delete
- [ ] CDN caching: `Cache-Control`, `ETag`, `Last-Modified`, stale-while-revalidate, cache busting via content hash, signed URLs

---
