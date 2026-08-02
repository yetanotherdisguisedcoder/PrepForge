---
title: "Node.js"
category: backend
part: "PART 1 — PROGRAMMING & OOP FUNDAMENTALS"
number: "1.4"
order: 1.4
priority: P0
status: not-started
source: 00_MASTER_TOPIC_LIST.md
note: "your CodInferno backend — expect deep drilling"
---

- [ ] Event loop **phases**: timers → pending callbacks → idle/prepare → poll → check → close. Be able to draw it.
- [ ] `setTimeout` vs `setImmediate` vs `process.nextTick` vs Promise microtasks — exact ordering
- [ ] libuv: thread pool (default 4, `UV_THREADPOOL_SIZE`), what uses it (fs, dns, crypto, zlib) vs what doesn't (network I/O — that's epoll/kqueue)
- [ ] Blocking the event loop: how to detect (event loop lag metric, `clinic.js`, `0x`, flame graphs), how to fix
- [ ] `cluster` module vs `worker_threads` vs `child_process` (`spawn`/`fork`/`exec`/`execFile`) — when each
- [ ] Streams: Readable/Writable/Duplex/Transform, `pipe` vs `pipeline`, backpressure, `highWaterMark`, object mode
- [ ] Buffers vs strings; encoding; binary handling outside V8 heap
- [ ] EventEmitter: memory-leak warning, `once`, error events, max listeners
- [ ] Error handling: `uncaughtException`, `unhandledRejection`, domains (deprecated), centralized error middleware, operational vs programmer errors
- [ ] Graceful shutdown: SIGTERM handling, draining connections, closing DB pools, K8s `preStop` hook + `terminationGracePeriodSeconds`
- [ ] Express: middleware chain, error middleware signature (4 args), `next()`, router mounting, `helmet`, `cors`, `compression`, `morgan`
- [ ] NestJS 🟠 P1 *(named in JD)*: modules, providers, DI container, decorators, guards, interceptors, pipes, filters, custom decorators, `@nestjs/config`, TypeORM/Prisma integration, microservices transport layer
- [ ] Middleware vs guard vs interceptor vs pipe vs filter — the ordering
- [ ] Connection pooling (`pg` Pool), `keepAlive`, pool exhaustion symptoms
- [ ] Caching layers: in-process LRU vs Redis; cache stampede protection
- [ ] Node performance: `--max-old-space-size`, heap snapshots, memory leak hunting, `perf_hooks`
- [ ] `package.json` semver ranges, lockfiles, `npm ci` vs `npm install`, `npm audit`, supply-chain risk
- [ ] Native addons / N-API (awareness only)
- [ ] Node 20/22 features: built-in test runner, `fetch`, watch mode, permission model
