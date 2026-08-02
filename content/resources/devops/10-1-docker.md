---
title: "Docker"
category: devops
part: "PART 10 — CONTAINERS, KUBERNETES, DEVOPS AND CI/CD"
number: "10.1"
order: 10.1
priority: P0
status: not-started
source: 00_MASTER_TOPIC_LIST.md
---

- [ ] Containers vs VMs; namespaces (pid, net, mnt, uts, ipc, user) plus cgroups
- [ ] Images, layers, union filesystem, copy-on-write; image caching and layer ordering for fast builds
- [ ] Dockerfile best practices: multi-stage builds, minimal base images (distroless/alpine), non-root user, `.dockerignore`, pinned versions, `COPY` vs `ADD`, `CMD` vs `ENTRYPOINT`, build args vs env, layer count
- [ ] Image size optimization; image scanning (Trivy)
- [ ] Volumes vs bind mounts; data persistence
- [ ] Networking: bridge, host, overlay, port publishing
- [ ] Docker Compose for local dev
- [ ] Container logging (stdout/stderr) and the **12-factor app** principles (know all 12)
- [ ] Health checks, restart policies
- [ ] PID 1, signal handling, zombie reaping
