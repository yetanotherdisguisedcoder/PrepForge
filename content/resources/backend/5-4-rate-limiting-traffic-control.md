---
title: "Rate Limiting & Traffic Control"
category: backend
part: "PART 5 — BACKEND & API FUNDAMENTALS"
number: "5.4"
order: 5.4
priority: P0
status: not-started
source: 00_MASTER_TOPIC_LIST.md
note: "you asked for this specifically"
---

- [ ] **Token bucket** — burst-friendly; refill rate; the default answer
- [ ] **Leaky bucket** — smooths output; queue-based
- [ ] **Fixed window counter** — simple; the boundary-burst flaw (2× at window edge)
- [ ] **Sliding window log** — accurate, memory-heavy
- [ ] **Sliding window counter** — the practical compromise (weighted previous window)
- [ ] Distributed rate limiting: Redis `INCR`+`EXPIRE` atomicity, Lua script, sorted-set sliding window, race conditions, clock skew
- [ ] Local vs global limits; per-node approximation; sync overhead
- [ ] Dimensions: per-IP, per-user, per-API-key, per-tenant, per-endpoint, per-cost-unit
- [ ] Where to enforce: edge/CDN → gateway → service → DB
- [ ] Response behaviour: 429, `Retry-After`, soft limits, shadow mode, quota vs rate
- [ ] Throttling vs rate limiting vs load shedding vs backpressure vs admission control
- [ ] Concurrency limiting (max in-flight) vs request-rate limiting
- [ ] Bulkheads & isolation pools; priority queues for premium tenants
- [ ] Circuit breaker: closed/open/half-open, failure threshold, cooldown; **Circuit Breaker vs Retry** — retries are for transient blips, circuit breakers are for sustained failure (interviewers love this distinction)
- [ ] Retries: exponential backoff **with jitter** (full/equal/decorrelated), retry budgets, retry amplification / retry storms, only retry idempotent operations
- [ ] Timeouts: connect vs read vs total; timeout budgets across a call chain; the "timeout must decrease down the stack" rule
- [ ] Graceful degradation & fallbacks; feature flags as a kill switch
- [ ] Load shedding, queue depth limits, `503` with `Retry-After`
