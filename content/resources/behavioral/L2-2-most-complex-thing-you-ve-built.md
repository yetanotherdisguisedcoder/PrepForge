---
title: "\"Most Complex Thing You've Built\""
category: behavioral
part: "PART 2 — THE QUESTION BANK"
number: "L2.2"
order: 202.2
priority: P2
status: not-started
source: 02_LEADERSHIP_STORY_BANK.md
---

13. What's the most technically complex problem you've solved?
14. What's the most complex *system* you've designed?
15. Tell me about a project you're most proud of and why.
16. What's the hardest bug you've ever debugged?
17. Describe a problem where the obvious solution was wrong.
18. Tell me about a time you had to learn a technology fast to solve something.
19. What's the largest scale you've operated at?
20. Describe a performance problem you diagnosed and fixed end to end.
21. Tell me about a design decision you agonized over.
22. What's a system you built that you'd architect completely differently today?

**How to answer #13 (your default: EKS Fargate + load testing):**
> *Situation:* Candidates need a full isolated VS Code IDE during a live assessment — not a sandboxed code runner. Multi-tenant, secure, and it has to survive a client running a test with 60+ candidates simultaneously.
> *Task:* I owned the architecture and the provisioning layer.
> *Action:* Chose EKS on Fargate for per-pod isolation without node management — I'll walk through why over ECS and EKS-on-EC2. Built automated provisioning, load balancer config, pod orchestration. Then ran progressive load testing from 20 to 100 concurrent users rather than assuming it worked.
> *Result:* Found saturation between 60 and 100 users, and isolated the bottleneck to **workspace provisioning**, not the application tier — which is where I'd have wasted effort otherwise. Validated 60+ concurrent live sessions.
> *Learning:* Two things. First, I'd have load tested earlier — I built the whole thing before I knew where it broke. Second, the fix direction is a pre-warmed pod pool, because the cost is in cold-start, not steady state.

**Why this works:** it has a decision with rejected alternatives, real measurement, a counter-intuitive finding, and a self-critique. That's a senior answer.
