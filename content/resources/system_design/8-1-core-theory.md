---
title: "Core Theory"
category: system_design
part: "PART 8 — DISTRIBUTED SYSTEMS & HIGH-LEVEL SYSTEM DESIGN"
number: "8.1"
order: 8.1
priority: P0
status: not-started
source: 00_MASTER_TOPIC_LIST.md
---

- [ ] **CAP theorem** — precise statement (during a *partition*, choose C or A); why "CA" doesn't exist in a distributed system; examples of CP (etcd, ZooKeeper, HBase) vs AP (Cassandra, Dynamo, Riak)
- [ ] **PACELC** 🟡 — the better model (else: Latency vs Consistency). Mentioning this is a senior signal.
- [ ] Consistency models: strong/linearizable, sequential, causal, read-your-writes, monotonic reads, eventual
- [ ] Fallacies of distributed computing (network is reliable, latency is zero, bandwidth is infinite, …) — name three
- [ ] Failure modes: crash-stop, crash-recovery, omission, Byzantine; partial failure; gray failure
- [ ] Idempotency, at-least-once + dedup as the practical exactly-once
- [ ] Clocks: wall clock vs monotonic, NTP drift, **logical clocks**, Lamport timestamps, vector clocks, TrueTime/hybrid logical clocks
- [ ] Consensus: Raft (leader election, log replication, safety), Paxos (awareness), quorum (R + W > N), split brain, fencing tokens
- [ ] Leader election, ZooKeeper/etcd/Consul, service registry & discovery
- [ ] Gossip protocols, anti-entropy, Merkle trees, read repair, hinted handoff
- [ ] Replication: leader-follower, multi-leader, leaderless; conflict resolution (LWW, CRDTs, application merge)
- [ ] Partitioning/sharding: hash, range, consistent hashing + virtual nodes, rebalancing
- [ ] Cascading failures, retry storms, metastable failures, thundering herd
- [ ] Chaos engineering, game days, failure injection
- [ ] SLI / SLO / SLA / error budgets; the nines table (99.9% = 43 min/month down)
