---
title: "CI/CD and Release Engineering"
category: devops
part: "PART 10 — CONTAINERS, KUBERNETES, DEVOPS AND CI/CD"
number: "10.3"
order: 10.3
priority: P0
status: not-started
source: 00_MASTER_TOPIC_LIST.md
---

- [ ] Pipeline stages: lint, unit, build, integration, security scan, artifact, deploy, smoke, e2e
- [ ] **GitLab CI** 🟠 *(your stack)*: stages, jobs, runners, caching, artifacts, `rules`/`only`/`except`, DAG via `needs`, matrix builds, environments, manual gates, protected variables
- [ ] GitHub Actions equivalents (many teams use it — know the mapping)
- [ ] Build caching, parallelization, flaky-test quarantine, pipeline duration budget
- [ ] Artifact and image versioning, immutable tags, SHA pinning
- [ ] Deployment strategies: recreate, rolling, blue-green, canary, shadow/dark launch, feature flags; **zero-downtime deploys** (your resume claim — be ready)
- [ ] Database migrations in CI/CD (backwards-compatible, decoupled from app deploy)
- [ ] Rollback strategy and the "can you roll back a migration?" trap
- [ ] Environments: dev/staging/prod parity, ephemeral preview environments
- [ ] Config management: Chef (**yours**), Ansible, Puppet — idempotent resources, LWRPs/custom resources, converge, drift. *(Your Chef LWRP SSL bug is a strong debugging story.)*
- [ ] GitOps: ArgoCD/Flux, declarative desired state, drift reconciliation
- [ ] Secrets in CI; OIDC-based cloud auth from CI (no long-lived keys)
- [ ] Branching: trunk-based vs GitFlow vs GitHub Flow — **have an opinion and a reason**
- [ ] **Monorepo vs polyrepo** 🟡 — build/tooling implications (Nx, Turborepo, Bazel), atomic cross-service commits vs independent deploy cadence, CODEOWNERS at scale
- [ ] Git: rebase vs merge, cherry-pick, bisect, reflog, interactive rebase, conflict resolution, squash policy, commit hygiene, blame for archaeology
- [ ] Code review practice: what you look for, review SLAs, PR size limits, nitpick vs blocker, automated formatting to remove bikeshedding
- [ ] Release cadence and **DORA metrics** (deployment frequency, lead time for changes, MTTR, change failure rate) — quote these in the leadership round
