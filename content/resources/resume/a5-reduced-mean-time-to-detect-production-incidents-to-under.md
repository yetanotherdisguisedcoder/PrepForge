---
title: "A5. \"Reduced mean time to detect production incidents to under a minute, by building Prometheus + Grafana observability across Node.js, PostgreSQL, Redis and the EKS cluster — with exporters, custom dashboards and alert rules on latency, error rate and pod saturation.\""
category: resume
part: "SECTION A — CODINFERNO (June 2025 – Present) · \"Software Engineer / Project Lead\""
order: 101.06
priority: P2
status: not-started
source: 01_RESUME_DEEP_DIVE.md
---

**They will ask:**
- MTTD from what to under a minute? How did you measure MTTD before? (**If you can't answer this, the claim is weak. Have a before number or reframe as "alerts fire within 60 seconds of an SLO breach."**)
- Which exporters? (node_exporter, postgres_exporter, redis_exporter, kube-state-metrics, cAdvisor, custom app metrics via prom-client.)
- Show me an alert rule. What's the `for` duration and why?
- How do you avoid alert fatigue? How many pages per week? What's your alert-to-action ratio?
- Symptom-based vs cause-based alerting — which do you page on?
- Do you have SLOs? What are they? Error budget policy?
- What's your cardinality strategy? Have you ever blown up Prometheus with a high-cardinality label? (Very common — a great war story if you have it.)
- How do you store metrics long-term? Retention? Thanos?
- Do you have distributed tracing? If not, how do you debug a slow request across 5 services? (Correlation IDs at minimum — say so.)
- Walk me through the last real incident: detection, triage, mitigation, root cause, follow-up.
- Do you write postmortems? Show me the format.
- What's the difference between p95 and p99 in your system, and why does the gap exist?

**Have ready:** one full incident narrative, timed: **T+0 alert → T+2 acknowledged → T+X mitigated → T+Y root-caused → action items.** Use the SSL certificate renewal failure or an EKS incident. This single story covers detection, debugging, infra depth, and process maturity.

---
