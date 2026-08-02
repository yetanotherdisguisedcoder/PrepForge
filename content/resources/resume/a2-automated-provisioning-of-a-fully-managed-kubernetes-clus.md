---
title: "A2. \"Automated provisioning of a fully managed Kubernetes cluster on AWS EKS using Fargate… isolated VS Code environments scaling to 60+ concurrent live sessions, validated by progressive load testing from 20 to 100 users.\""
category: resume
part: "SECTION A — CODINFERNO (June 2025 – Present) · \"Software Engineer / Project Lead\""
order: 101.03
priority: P2
status: not-started
source: 01_RESUME_DEEP_DIVE.md
---

**This is your best differentiator and your biggest interrogation risk. Over-prepare it.**

**They will ask:**
- Why EKS Fargate over ECS Fargate, EKS on EC2, or plain EC2 + Docker? Cost, cold start, ops burden — quantify.
- What are the Fargate limitations you hit? (no DaemonSets → how do you ship logs? no privileged containers → how do you run a container-in-container IDE? no hostPath → how do you persist workspace state?)
- Pod-per-candidate: how is a pod provisioned, how long does it take, and what happens if provisioning fails mid-request?
- How do you isolate one candidate from another — network policies, RBAC, resource limits, escaping the container?
- What stops a candidate from mining crypto / calling out to the internet / attacking your cluster from inside their pod?
- How do you reclaim pods when a candidate abandons a session? TTL, controller, finalizers?
- What are your resource requests/limits and how did you arrive at them?
- **The load test:** describe the methodology. Open or closed model? Ramp profile? What broke first at 60–100 users? What was the actual bottleneck?
- You say "workspace provisioning is the bottleneck" — what specifically? Image pull? Fargate scheduling latency? ENI attachment? API server throttling? What did you do about it (pre-warmed pool, image caching, smaller image)?
- What's your scaling strategy: HPA on what metric? Cluster Autoscaler / Karpenter? How fast can you scale to a burst of 200?
- What happens if the EKS control plane is degraded during a live test? Is there a graceful degradation path?
- How do you do zero-downtime deploys of the workspace service without killing live sessions?
- Cost per candidate-hour? Where does the money go?
- `kubectl` scripts for orchestration — why scripts and not an operator/Helm/GitOps? Would you do it differently now?

**Have ready:**
- The exact bottleneck story with a before/after number. This is your single best technical narrative.
- A crisp answer on **why Fargate**: no node management, per-pod isolation boundary, no capacity planning — traded against per-pod cost premium, ~30–60s pod start, and the DaemonSet/privileged restrictions.
- A "what I'd do differently" answer: e.g. warm pool of pre-provisioned pods, migrate to Karpenter on EC2 for cost at steady state while keeping Fargate for burst, move orchestration from kubectl scripts to a controller/CRD.
- Your load test artifact: tool used, ramp, metrics captured, the graph shape, where the knee was.

**Landmine:** "fully managed Kubernetes cluster… automated provisioning" invites "show me the IaC." If it's shell + kubectl, say so plainly and explain the trade-off (speed vs reproducibility) and your migration plan. Honesty here reads as senior; bluffing reads as junior.

---
