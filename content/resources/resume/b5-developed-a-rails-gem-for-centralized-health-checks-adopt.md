---
title: "B5. \"Developed a Rails gem for centralized health checks… adopted across 6 interconnected applications.\""
category: resume
part: "SECTION B — SOFTWARE DEVELOPER (July 2023 – June 2025)"
order: 102.05
priority: P2
status: not-started
source: 01_RESUME_DEEP_DIVE.md
---

**They will ask:**
- What's in a health check? Shallow vs deep. Do you check downstream dependencies in your liveness probe? (**Correct answer: no — deep dependency checks belong in readiness/diagnostics, not liveness, or one slow dependency cascades into mass pod restarts. This is a great senior signal.**)
- Timeout and caching on the health endpoint — how do you stop health checks from DDoSing your DB?
- How did you get 6 teams to adopt it? (**Influence-without-authority story — one of your strongest leadership examples. Detail: how you pitched it, how you handled resistance, how you versioned it without breaking consumers.**)
- Versioning and backwards compatibility of an internal gem.
- What did you learn about building for other engineers vs building features?

---
