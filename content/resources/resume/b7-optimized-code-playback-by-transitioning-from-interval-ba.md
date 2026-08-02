---
title: "B7. \"Optimized code playback by transitioning from interval-based screenshot capture to DOM tree capture on each keystroke, with efficient storage in S3.\""
category: resume
part: "SECTION B — SOFTWARE DEVELOPER (July 2023 – June 2025)"
order: 102.07
priority: P2
status: not-started
source: 01_RESUME_DEEP_DIVE.md
---

**Nice, concrete performance-engineering story. Under-used on your resume — promote it.**

**They will ask:**
- Screenshots → DOM diffs: what was the storage reduction? Bandwidth reduction? Give the number.
- Per-keystroke capture at 60 concurrent users — what's the write volume? How do you not melt the network or S3?
- Batching, debouncing, compression? Do you store full snapshots or diffs with periodic keyframes? (Keyframe + delta is the right answer — like video encoding.)
- How do you replay? Reconstruct state at time T with O(?) work.
- Storage lifecycle: how long do you keep playback data? S3 storage class transitions?
- Privacy: you're recording everything a candidate types. Consent, retention, access control.
- Did you consider an existing solution (rrweb)? Build vs buy reasoning.

---
