---
title: "A1. \"Led end-to-end development… owning system and database architecture and building REST APIs and full-stack services in Node.js, React and PostgreSQL.\""
category: resume
part: "SECTION A — CODINFERNO (June 2025 – Present) · \"Software Engineer / Project Lead\""
order: 101.02
priority: P2
status: not-started
source: 01_RESUME_DEEP_DIVE.md
---

**They will ask:**
- Draw the full system architecture. What are the 5 services and why those boundaries?
- Walk me through your database schema. Show me the core tables and relationships.
- Why Node.js for this, given eLitmus is a Rails shop? Defend the polyglot decision.
- How do you handle multi-tenancy — data isolation between client companies?
- What's your API versioning strategy? Have you had to break a contract?
- How does a candidate's test session flow through the system, request by request?
- What's the single most expensive query in your system? How did you find it and fix it?
- How do you handle a candidate losing connection mid-assessment? Resume semantics?
- Concurrency: two graders scoring the same submission — how do you prevent a lost update?
- Where's your transaction boundary? Any distributed transaction? How do you avoid one?

**Probing for:** whether you actually designed it or inherited it; whether you can reason about boundaries; data modelling maturity.

**Have ready:**
- A hand-drawable architecture diagram (client → CDN → ALB → API gateway/Node → services → Postgres/Redis → EKS workspace pods → S3).
- An ERD sketch: tenants/companies, tests, questions, candidates, sessions, submissions, scores, credits, events.
- Two concrete schema decisions with trade-offs (e.g. why you chose row-level tenant isolation, why a particular index).
- One query you optimized: before/after plan and timing.

**Landmine:** "System and database architecture" is a big claim at 3 YOE. Be ready with *specific* design decisions and their alternatives, not adjectives.

---
