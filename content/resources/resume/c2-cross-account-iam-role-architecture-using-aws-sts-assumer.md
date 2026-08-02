---
title: "C2. \"Cross-account IAM Role architecture using AWS STS AssumeRole, enabling multi-tenant access without sharing credentials.\""
category: resume
part: "SECTION C — CLOUDNAP (Personal project, live SaaS)"
order: 103.02
priority: P2
status: not-started
source: 01_RESUME_DEEP_DIVE.md
---

**This is genuinely senior-level cloud security design. Milk it.**

**They will ask:**
- Walk me through the trust relationship. Who trusts whom?
- **The confused deputy problem** and why you use an **external ID**. (**If you can explain this unprompted, you will impress. Very few 3-YOE candidates can.**)
- What's the minimum permission set you request, and how do you justify it to a security-conscious customer?
- Credential lifetime, session duration, credential caching, refresh.
- What happens if a tenant revokes the role mid-operation?
- How do you prevent tenant A's job from touching tenant B's account? (Role-per-tenant, session tagging, request-scoped credentials, audit via CloudTrail.)
- Your one-click CloudFormation onboarding: how do you handle template versioning when you need a new permission? Drift?
- GCP equivalent — how does it differ? (Service accounts + custom roles, no external ID equivalent; Workload Identity Federation.) **You built `cloudNapInstanceOperator` — you can answer this.**
- How do you store tenant role ARNs securely?
- If your service is compromised, what's the blast radius across all tenants?
