---
title: "Microservices vs Monolith"
category: system_design
part: "PART 8 — DISTRIBUTED SYSTEMS & HIGH-LEVEL SYSTEM DESIGN"
number: "8.5"
order: 8.5
priority: P0
status: not-started
source: 00_MASTER_TOPIC_LIST.md
---

- [ ] Monolith → modular monolith → microservices; **when NOT to split** (small team, unclear domain boundaries, premature)
- [ ] Service boundary definition via DDD bounded contexts
- [ ] Database-per-service; the distributed data problem; no cross-service joins
- [ ] Inter-service communication: sync (REST/gRPC) vs async (events); chatty services & latency amplification
- [ ] Patterns: API Gateway, BFF, Service Registry/Discovery, Circuit Breaker, Bulkhead, Retry, Sidecar, Ambassador, Strangler Fig, Saga, Outbox, CQRS, Event Sourcing, Aggregator, Anti-Corruption Layer
- [ ] Distributed tracing & correlation IDs (mandatory once you split)
- [ ] Deployment independence, versioning, contract testing (Pact)
- [ ] Service mesh (Istio/Linkerd): mTLS, traffic shifting, retries at the mesh layer, observability, and the added complexity cost
- [ ] Data consistency across services; eventual consistency UX implications
- [ ] Microservices anti-patterns: distributed monolith, shared database, nanoservices, chatty APIs
- [ ] **Your story**: 5 microservices at CodInferno — be able to justify each boundary

---
