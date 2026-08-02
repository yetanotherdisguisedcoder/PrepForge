---
title: "Ruby / Rails"
category: backend
part: "PART 1 — PROGRAMMING & OOP FUNDAMENTALS"
number: "1.5"
order: 1.5
priority: P1
status: not-started
source: 00_MASTER_TOPIC_LIST.md
note: "2 of your 3 years — they WILL ask, even if the role isn't Ruby"
---

- [ ] MVC, convention over configuration, Rails request lifecycle (Rack → router → controller → view)
- [ ] ActiveRecord: associations, `includes`/`preload`/`eager_load`/`joins`, N+1 detection (Bullet), `find_each`, scopes, callbacks (and why callbacks are a design smell)
- [ ] Migrations: reversibility, zero-downtime column changes, `strong_migrations`, backfills, index creation `algorithm: :concurrently`
- [ ] ActiveJob + Sidekiq: retries, idempotency, dead set, queue prioritization
- [ ] Caching: fragment, Russian-doll, low-level `Rails.cache`, `cache_key_with_version`
- [ ] Rack middleware; writing a gem (you did — the health-check gem)
- [ ] Metaprogramming: `method_missing`, `define_method`, `send`, refinements, monkey-patching risk
- [ ] Modules/mixins, `include` vs `extend` vs `prepend`, ancestors chain
- [ ] Blocks, procs, lambdas — return semantics difference
- [ ] GVL/GIL, threads vs processes in MRI, Puma workers vs threads
- [ ] Rails 7 / Ruby 3 upgrade specifics you did: zeitwerk autoloading, Ractor/Fiber awareness, keyword-args change in Ruby 3
- [ ] RSpec: doubles/mocks/stubs, `let` vs `let!`, shared examples, factories vs fixtures
- [ ] Multi-tenancy patterns in Rails (row-level, schema-level, DB-level) — you live this at eLitmus
