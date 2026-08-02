---
title: "Memory Management"
category: os
part: "PART 6 — OPERATING SYSTEMS"
number: "6.2"
order: 6.2
priority: P0
status: not-started
source: 00_MASTER_TOPIC_LIST.md
---

- [ ] Virtual memory, address translation, MMU
- [ ] Paging, page table, multi-level page tables, TLB, TLB miss
- [ ] Page faults (minor/major), demand paging, thrashing, working set
- [ ] Page replacement: FIFO, LRU, LFU, Optimal, Clock; Belady's anomaly
- [ ] Segmentation vs paging
- [ ] Internal vs external fragmentation; compaction
- [ ] Stack vs heap allocation; memory leaks; OOM killer (**why your pod restarted**)
- [ ] `mmap`, copy-on-write, shared libraries
- [ ] Cgroups memory limits vs what the app thinks it has (JVM `-XX:+UseContainerSupport`, Node `--max-old-space-size` in containers)
- [ ] Cache hierarchy, cache lines, false sharing, locality of reference
