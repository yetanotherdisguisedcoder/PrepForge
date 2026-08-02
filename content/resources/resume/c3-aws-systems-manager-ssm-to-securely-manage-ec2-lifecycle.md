---
title: "C3. \"AWS Systems Manager (SSM) to securely manage EC2 lifecycle and execute remote commands without SSH.\""
category: resume
part: "SECTION C — CLOUDNAP (Personal project, live SaaS)"
order: 103.03
priority: P2
status: not-started
source: 01_RESUME_DEEP_DIVE.md
---

**They will ask:**
- Why SSM over SSH? (No open port 22, no key management, IAM-based access, full audit trail in CloudTrail, works in private subnets without a bastion.) **Give all five.**
- What does SSM require on the instance? (Agent + instance profile + network path to the SSM endpoints — VPC endpoints if fully private.)
- What happens if the agent isn't running or the instance has no role?
- Run Command idempotency and output capture.
- Audit: how do you prove to a customer what you ran on their instance?

---
