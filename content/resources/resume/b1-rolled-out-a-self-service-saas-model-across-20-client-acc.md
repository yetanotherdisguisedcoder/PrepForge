---
title: "B1. \"Rolled out a self-service SaaS model across 20+ client accounts… Credits System with REST APIs (Rails, React) for pre-purchased credits that automated payment capture and per-assessment usage tracking.\""
category: resume
part: "SECTION B — SOFTWARE DEVELOPER (July 2023 – June 2025)"
order: 102.01
priority: P2
status: not-started
source: 01_RESUME_DEEP_DIVE.md
---

**This is your best "correctness under concurrency" story. Interviewers love billing systems.**

**They will ask:**
- How do you prevent a client from spending credits they don't have, under concurrent requests? (Row-level lock? Optimistic version? Atomic decrement? `SELECT FOR UPDATE`?)
- How do you make credit deduction **idempotent** if the client retries a request or the network drops after the DB commit but before the response?
- Is your ledger append-only? Do you store balance as a column or derive it from transactions? Trade-off. (Derived = correct but slow; cached balance + ledger = fast but needs reconciliation.)
- Double-entry accounting — do you use it? Why/why not?
- Payment gateway integration: webhook handling, signature verification, out-of-order webhooks, duplicate webhooks, reconciliation job.
- What happens if payment succeeds but your credit-grant fails? (Saga / outbox / reconciliation.)
- Refunds, chargebacks, partial consumption, expiry of credits.
- Audit trail — how do you answer a client who says "you charged me twice"?
- How did you migrate 20+ existing accounts onto the new model with zero billing disruption?
- Rate of disputes before vs after?

**Have ready:** the exact concurrency control you used and *why*, plus the failure mode you designed against. If you didn't use idempotency keys, say what you'd add now — that's a legitimate senior answer.

---
