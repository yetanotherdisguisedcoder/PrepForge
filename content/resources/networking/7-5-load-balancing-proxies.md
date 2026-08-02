---
title: "Load Balancing & Proxies"
category: networking
part: "PART 7 — COMPUTER NETWORKS"
number: "7.5"
order: 7.5
priority: P0
status: not-started
source: 00_MASTER_TOPIC_LIST.md
---

- [ ] L4 (transport) vs L7 (application) load balancing — what each can and can't do
- [ ] Algorithms: round robin, weighted RR, least connections, least response time, IP hash, **consistent hashing**, random with two choices
- [ ] Health checks: active vs passive, shallow vs deep, `/healthz` vs `/readyz` (**your health-check gem is a story here**)
- [ ] Sticky sessions / session affinity — and why stateless is better
- [ ] Forward proxy vs reverse proxy vs load balancer vs API gateway vs service mesh — **know all four boundaries**
- [ ] SSL/TLS termination vs passthrough vs re-encryption
- [ ] Nginx/HAProxy/Envoy; AWS ALB vs NLB vs CLB vs GWLB
- [ ] Global load balancing: GeoDNS, Anycast, CDN edge
- [ ] Connection draining / deregistration delay
- [ ] Can the load balancer be a bottleneck? (yes — CPU on TLS, connection table, bandwidth)

---
