---
title: "C1. \"Reclaimed 780 idle instance-hours per week across 4 onboarded AWS accounts… Spring Boot scheduler that starts/stops EC2 on cron-driven schedules.\""
category: resume
part: "SECTION C — CLOUDNAP (Personal project, live SaaS)"
order: 103.01
priority: P2
status: not-started
source: 01_RESUME_DEEP_DIVE.md
---

**They will ask:**
- 780 hours/week — how do you measure that? What's the dollar value?
- Who are your users? How did you get them? (Product/founder signal.)
- **Distributed cron:** you have multiple app instances. How do you guarantee a schedule fires exactly once? (Leader election, DB lock, JobRunr's distributed locking.) What if a node dies mid-job?
- Missed executions: instance was down at 9am — do you run late or skip? Policy?
- Timezones and DST — a cron at 9am IST vs a tenant in another zone. How do you store schedules? (**Store timezone + local time, not UTC offset. Classic bug.**)
- What if the EC2 stop fails? Retries, backoff, alerting the tenant.
- What if a user's instance has an attached process mid-work? Graceful shutdown hooks? Safety checks?
- Idempotency: your scheduler fires twice — does the instance get stopped twice? Is that safe?
- How do you scale to 1,000 tenants × 50 instances? Where does it break first?
