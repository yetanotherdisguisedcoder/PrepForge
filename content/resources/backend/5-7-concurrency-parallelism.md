---
title: "Concurrency & Parallelism"
category: backend
part: "PART 5 — BACKEND & API FUNDAMENTALS"
number: "5.7"
order: 5.7
priority: P0
status: not-started
source: 00_MASTER_TOPIC_LIST.md
---

- [ ] Concurrency vs parallelism (Rob Pike's distinction — say it precisely)
- [ ] Processes vs threads vs coroutines/fibers/green threads
- [ ] Race conditions, critical sections, mutual exclusion
- [ ] Mutex, semaphore (counting vs binary), spinlock, monitor, condition variable, barrier, latch
- [ ] Deadlock (Coffman conditions: mutual exclusion, hold-and-wait, no preemption, circular wait), livelock, starvation, priority inversion
- [ ] Atomic operations, CAS, ABA problem, lock-free & wait-free structures
- [ ] Memory visibility, memory barriers, `volatile`, happens-before
- [ ] Thread pools: sizing (CPU-bound ≈ cores, IO-bound ≈ higher), queue types, rejection policies
- [ ] Async models: callbacks → promises → async/await; event loop vs thread-per-request
- [ ] Reactive programming & backpressure
- [ ] Distributed locking: Redis, ZooKeeper, etcd, DB advisory locks; fencing tokens; lease expiry hazards
- [ ] Optimistic vs pessimistic concurrency at application level
- [ ] Idempotency as a concurrency-safety tool
- [ ] Common concurrency bugs in your stacks: Node (shared module state across requests), Rails (thread-unsafe class variables), Java (non-thread-safe `SimpleDateFormat`, HashMap in multithreaded context)

---
