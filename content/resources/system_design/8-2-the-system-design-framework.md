---
title: "The System Design Framework"
category: system_design
part: "PART 8 — DISTRIBUTED SYSTEMS & HIGH-LEVEL SYSTEM DESIGN"
number: "8.2"
order: 8.2
priority: P0
status: not-started
source: 00_MASTER_TOPIC_LIST.md
---

1. **Clarify** (5 min): functional requirements, out-of-scope, non-functional (scale, latency, consistency, availability), who are the users
2. **Estimate** (5 min): DAU → QPS (peak = 2–3× avg), read:write ratio, payload size → storage/day/year, bandwidth, memory for cache (80/20 rule)
3. **API contract** (5 min): 3–5 endpoints with request/response shapes
4. **Data model** (5–10 min): entities, chosen store per entity + *why*, indexes, partition key
5. **High-level architecture** (10 min): client → CDN → LB → API → services → cache → DB → queue → workers
6. **Deep dive** (15 min): whichever component the interviewer picks or the hardest bottleneck
7. **Scale & failure** (10 min): bottlenecks, sharding, caching, replicas, async, hot spots, single points of failure, degradation
8. **Operations** (5 min): monitoring, alerting, deployment, cost
9. **Trade-offs & what you'd do differently** — always close with this

**Rules:** drive the conversation, state assumptions loudly, never silently draw, always give the *reason* for a choice, and explicitly reject an alternative ("I'd not use Kafka here because…").
