---
title: "Kubernetes"
category: kubernetes
part: "PART 10 — CONTAINERS, KUBERNETES, DEVOPS AND CI/CD"
number: "10.2"
order: 10.2
priority: P0
status: not-started
source: 00_MASTER_TOPIC_LIST.md
note: "you run EKS Fargate — a top differentiator; expect deep questions"
---

- [ ] Architecture: control plane (api-server, etcd, scheduler, controller-manager) plus nodes (kubelet, kube-proxy, container runtime)
- [ ] Objects: Pod, ReplicaSet, Deployment, StatefulSet, DaemonSet, Job, CronJob, Service, Ingress, ConfigMap, Secret, Namespace, PV/PVC/StorageClass, ServiceAccount, HPA/VPA, PDB, NetworkPolicy, ResourceQuota, LimitRange
- [ ] Service types: ClusterIP, NodePort, LoadBalancer, ExternalName; headless services
- [ ] Ingress controllers vs Gateway API; AWS Load Balancer Controller; ALB vs NLB target types (instance vs IP — **Fargate requires IP mode**)
- [ ] Scheduling: requests vs limits, QoS classes (Guaranteed/Burstable/BestEffort), node selectors, affinity/anti-affinity, taints and tolerations, topology spread constraints
- [ ] **Fargate specifics** 🟠: no DaemonSets, no privileged containers, no hostPath, per-pod resource rounding and billing, pod startup latency, logging via FireLens/Fluent Bit, Fargate profiles and selectors
- [ ] Probes: liveness vs readiness vs startup — and the classic mistake of an over-aggressive liveness probe
- [ ] Rollouts: rolling update, maxSurge/maxUnavailable, rollback, blue-green, canary (Argo Rollouts/Flagger)
- [ ] Autoscaling: HPA (metrics server, custom/external metrics via Prometheus Adapter or KEDA), Cluster Autoscaler vs Karpenter
- [ ] Config and secrets: ConfigMap, Secret (base64 is not encryption), External Secrets Operator, Sealed Secrets, IRSA
- [ ] Networking: CNI, pod-to-pod, CoreDNS, kube-proxy iptables vs IPVS, NetworkPolicies
- [ ] Storage: PV/PVC lifecycle, access modes, EBS vs EFS CSI (EBS is single-AZ, RWO — a real design constraint)
- [ ] RBAC: Role/ClusterRole/RoleBinding, service accounts, least privilege
- [ ] **Policy-as-code / admission control** 🟠 — Pod Security Standards (Restricted/Baseline/Privileged, the PSP successor), OPA Gatekeeper, Kyverno — enforcing "no privileged pods," "must have resource limits," "no `:latest` tag" cluster-wide. **Directly extends your own multi-tenant K8s governance story.**
- [ ] **eBPF-based tooling** 🟡 (awareness) — Cilium as a CNI (kernel-level networking/policy without iptables), Falco (runtime security), Pixie (zero-instrumentation observability) — the modern alternative to sidecar-based service mesh/observability
- [ ] Debugging: `kubectl describe`, `logs -p`, `exec`, `port-forward`, `top`, `events`, `get -o yaml`; **CrashLoopBackOff, ImagePullBackOff, OOMKilled, Pending/unschedulable, Evicted** — root causes for each
- [ ] Helm: charts, values, templating, releases, rollback; Kustomize as the alternative
- [ ] Operators and CRDs (awareness)
- [ ] Multi-tenancy in K8s: namespaces vs clusters, quotas, network isolation — **your isolated per-candidate VS Code sessions are exactly this problem**
- [ ] Cost: right-sizing requests, bin packing, spot node groups, idle capacity
