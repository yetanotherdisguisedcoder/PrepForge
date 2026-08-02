---
title: "B4. \".NET-based wrapper over Safe Exam Browser to detect remote access software and suspicious background processes… flagging over 20% of candidates per test.\""
category: resume
part: "SECTION B — SOFTWARE DEVELOPER (July 2023 – June 2025)"
order: 102.04
priority: P2
status: not-started
source: 01_RESUME_DEEP_DIVE.md
---

**Unusual, memorable, and a great "hardest problem" candidate. Interviewers will be curious.**

**They will ask:**
- How does detection actually work? Process enumeration, window titles, driver signatures, network heuristics?
- **False positives**: 20% flagged is a big number. How do you avoid punishing innocent candidates? What's the human-in-the-loop? What's the precision/recall?
- This is an arms race. How do you handle evasion (renamed processes, VMs, second devices)?
- Detecting phone-based AI assistance via image capture — how? Privacy implications? Consent? Data retention? **Expect an ethics question here; have a thoughtful answer.**
- Legal/compliance: recording candidates, PII, DPDP Act, storage and deletion.
- Why .NET and not a cross-platform approach? What about Mac/Linux candidates?
- How do you ship and update the client? Signing, auto-update, tamper resistance.
- What's the tamper story — can a candidate just kill your process?

**Landmine:** "flagging over 20% of candidates" could be read as "your system has a 20% false positive rate." **Reframe proactively:** "20% were flagged for review; of those, X% were confirmed after human review." Get that number or soften the bullet.

---
