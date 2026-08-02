---
title: "A4. \"Containerized deployment across 5 microservices with Docker and AWS, and built GitLab CI/CD pipelines running automated unit, integration and end-to-end tests (Jest, RSpec, Puppeteer) enabling zero-downtime deploys.\""
category: resume
part: "SECTION A — CODINFERNO (June 2025 – Present) · \"Software Engineer / Project Lead\""
order: 101.05
priority: P2
status: not-started
source: 01_RESUME_DEEP_DIVE.md
---

**They will ask:**
- Name the 5 services and justify each boundary. Would you merge any of them today?
- Do they share a database? (If yes — expect pushback. Have the reasoning ready.)
- How do services communicate — sync or async? What happens when one is down?
- Walk me through your pipeline stage by stage. Total duration? Slowest stage? What have you done about it?
- How exactly do you achieve zero downtime? Rolling update + readiness probes + connection draining + backwards-compatible migrations. Say all four.
- How do you handle a schema migration that isn't backwards compatible?
- Your rollback procedure. Have you used it? Tell me about a bad deploy.
- Flaky Puppeteer tests — how do you keep e2e from blocking the pipeline?
- Test pyramid ratio: how many unit vs integration vs e2e?
- How do you manage secrets in GitLab CI?
- Preview/ephemeral environments per MR?
- Do you gate merges on coverage? What's your position on coverage targets?

**Have ready:** one story about a deploy that went wrong, what you learned, and the guardrail you added. Interviewers trust candidates who volunteer failures.

---
