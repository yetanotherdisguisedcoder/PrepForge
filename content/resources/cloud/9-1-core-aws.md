---
title: "Core AWS"
category: cloud
part: "PART 9 — CLOUD (AWS-FIRST, WITH AZURE/GCP AWARENESS)"
number: "9.1"
order: 9.1
priority: P0
status: not-started
source: 00_MASTER_TOPIC_LIST.md
note: "you list EC2, S3, ECS, EKS, ECR, SES, Route53, Lambda, IAM, STS, SSM"
---

- [ ] **IAM** 🔴: users, groups, roles, policies (identity vs resource-based), policy evaluation logic (explicit deny > allow), least privilege, permission boundaries, SCPs, **AssumeRole + STS**, **external ID for cross-account third-party access** (your CloudNap architecture — a genuinely strong differentiator), instance profiles, IRSA (IAM Roles for Service Accounts on EKS)
- [ ] **EC2**: instance families & sizing, Graviton/ARM, spot vs on-demand vs reserved vs savings plans, AMIs, user data, ASGs, launch templates, placement groups, EBS types (gp3 vs io2) & IOPS, snapshots, instance metadata (IMDSv2)
- [ ] **VPC** 🔴: subnets (public/private), route tables, IGW vs NAT gateway (and NAT cost!), security groups (stateful) vs NACLs (stateless), VPC endpoints (gateway vs interface) and why they cut NAT cost, VPC peering vs Transit Gateway, flow logs
- [ ] **S3**: storage classes and lifecycle policies, versioning, presigned URLs, bucket policies vs ACLs, block public access, static website hosting (**your CloudFormation template hosting issue**), S3 event notifications, multipart upload, consistency model, Transfer Acceleration
- [ ] **RDS/Aurora**: Multi-AZ vs read replicas, parameter groups, automated backups and PITR, Aurora storage architecture, failover, Performance Insights, RDS Proxy
- [ ] **ElastiCache** (Redis): cluster mode, failover, sizing
- [ ] **Lambda**: cold starts and mitigation (provisioned concurrency, SnapStart), limits (15 min, memory-CPU coupling), concurrency and reserved concurrency, event sources, VPC-attached Lambda networking, layers, when Lambda is the wrong tool
- [ ] **ECS vs EKS vs Fargate vs EC2 launch type** 🔴 — you chose EKS Fargate; be able to defend it against ECS Fargate and EKS on EC2 (cost, cold start, DaemonSet limitation, privileged-container limits, per-pod billing rounding)
- [ ] **ECR**: image scanning, lifecycle policies, cross-account pull
- [ ] **Route53**: hosted zones, routing policies, health checks, ALIAS records, DNS failover
- [ ] **CloudFront**: origins, behaviours, cache policies, signed URLs/cookies, OAC, invalidation cost
- [ ] **Edge computing / edge functions** 🟡 (Lambda@Edge, CloudFront Functions, Cloudflare Workers, Vercel Edge) — running logic at the CDN POP for auth checks, A/B routing, header rewriting; latency win vs cold-start and runtime limits
- [ ] **WebAssembly (WASM)** 🟡 — as a lightweight, near-instant-startup sandboxing alternative to a full container (Cloudflare Workers/Fermyon run on it); worth mentioning as an alternative you considered/could consider for your own per-candidate sandboxed execution problem
- [ ] **SQS/SNS/EventBridge**: covered in 5.5
- [ ] **SES**: sandbox, verified identities, bounce/complaint handling via SNS, deliverability
- [ ] **CloudWatch**: metrics, custom metrics, logs and Log Insights, alarms, composite alarms, EventBridge rules; cost of logs
- [ ] **Systems Manager (SSM)** 🟠: Session Manager (no SSH), Run Command, Parameter Store, Patch Manager, inventory — **core to CloudNap; own this**
- [ ] **Secrets Manager vs Parameter Store** — cost and rotation trade-off
- [ ] **CloudFormation / Terraform / CDK** 🟠: declarative IaC, stacks, change sets, drift, state file management and locking (Terraform), modules, `terraform plan` in CI, one-click onboarding via CFN template (**you built this**)
- [ ] **KMS**: CMK vs AWS-managed, envelope encryption, key policies, rotation
- [ ] **WAF and Shield**, GuardDuty, Config, CloudTrail (audit), Security Hub
- [ ] **Cost**: Cost Explorer, tagging strategy, budgets and anomaly detection, savings plans vs RIs, Graviton savings, right-sizing, the Fargate billing rounding quirk, NAT and data-transfer as hidden cost centres, S3 storage-class transitions. **You have done a real cost model — this is a rare and valuable interview story.**
- [ ] Well-Architected Framework pillars: Operational Excellence, Security, Reliability, Performance Efficiency, Cost Optimization, Sustainability
- [ ] Regions vs AZs, multi-AZ vs multi-region, DR strategies (backup and restore, pilot light, warm standby, active-active) with RTO/RPO
