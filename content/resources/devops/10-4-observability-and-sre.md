---
title: "Observability and SRE"
category: devops
part: "PART 10 — CONTAINERS, KUBERNETES, DEVOPS AND CI/CD"
number: "10.4"
order: 10.4
priority: P0
status: not-started
source: 00_MASTER_TOPIC_LIST.md
note: "you built the stack — make this a highlight, not a footnote"
---

- [ ] Three pillars: metrics, logs, traces (plus profiles as the fourth)
- [ ] Monitoring vs observability; known-unknowns vs unknown-unknowns
- [ ] **Prometheus**: pull model, exporters, scrape config, service discovery, metric types (counter, gauge, histogram, summary), labels and **cardinality explosion**, PromQL (`rate`, `irate`, `histogram_quantile`, `increase`, aggregation operators), recording rules, alerting rules, Alertmanager (grouping, inhibition, silences, routing), remote write, Thanos/Cortex/Mimir for long-term storage and HA
- [ ] **Grafana**: dashboards, variables, panels, alerting, annotations
- [ ] **Four Golden Signals** (latency, traffic, errors, saturation); **RED** (Rate, Errors, Duration) vs **USE** (Utilization, Saturation, Errors)
- [ ] Percentiles: why p50 lies, p95/p99/p99.9, why you cannot average percentiles, histogram bucket design
- [ ] Logging: structured JSON logs, log levels, correlation/request IDs, PII scrubbing, sampling, log volume cost, ELK/Loki/CloudWatch
- [ ] Distributed tracing: OpenTelemetry, spans, context propagation (W3C traceparent), head vs tail sampling, Jaeger/Tempo/X-Ray
- [ ] Alerting philosophy: alert on symptoms not causes, page only on user-facing impact, runbooks, alert fatigue, on-call rotation
- [ ] SLI/SLO/error budget; burn-rate alerts (multi-window, multi-burn-rate)
- [ ] Incident management: severity levels, incident commander, comms cadence, MTTD/MTTA/MTTR (**your "MTTD under a minute" claim — be ready to prove it**), status page
- [ ] **Blameless postmortems**: timeline, contributing factors, action items with owners, 5 Whys vs systems thinking. *(Prepare one real postmortem to narrate.)*
- [ ] Synthetic monitoring, RUM, health checks
- [ ] Capacity planning and **load testing** (**you did 20 to 100 users**): k6/JMeter/Locust/Gatling, open vs closed models, ramp profiles, finding the knee of the curve, isolating the bottleneck component, headroom targets
