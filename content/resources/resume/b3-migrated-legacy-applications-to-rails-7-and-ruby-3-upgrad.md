---
title: "B3. \"Migrated legacy applications to Rails 7 and Ruby 3, upgrading gem dependencies, resolving compatibility issues.\""
category: resume
part: "SECTION B — SOFTWARE DEVELOPER (July 2023 – June 2025)"
order: 102.03
priority: P2
status: not-started
source: 01_RESUME_DEEP_DIVE.md
---

**They will ask:**
- What broke? Name three specific incompatibilities. (Ruby 3 keyword arguments separation, zeitwerk autoloading, `Psych 4` YAML aliases, deprecated `update_attributes`, gem drops.)
- How did you sequence a multi-app upgrade? Dual-boot with `Gemfile.next`? One app at a time?
- How did you get confidence there were no regressions? Coverage? Canary?
- How long did it take, and how did you sell the business on spending that time? (**Tech-debt-negotiation story — use it in the leadership round.**)
- Any production incident from the upgrade?
- What's your general framework for keeping dependencies current now? (Dependabot, monthly upgrade budget, LTS tracking.)

---
