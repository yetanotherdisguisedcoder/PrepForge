---
title: "Process & Thread Management"
category: os
part: "PART 6 — OPERATING SYSTEMS"
number: "6.1"
order: 6.1
priority: P0
status: not-started
source: 00_MASTER_TOPIC_LIST.md
---

- [ ] Process vs thread vs program; PCB; address space (text/data/heap/stack)
- [ ] Process states & transitions (new, ready, running, waiting, terminated)
- [ ] Context switching — cost, what gets saved, TLB flush
- [ ] fork/exec, zombie & orphan processes, `init` reparenting, PID 1 problem in containers (**why you need `--init` / tini in Docker**)
- [ ] User mode vs kernel mode; system calls; interrupts vs traps
- [ ] CPU scheduling: FCFS, SJF, SRTF, Round Robin, priority, multilevel feedback queue; preemptive vs non-preemptive; CFS in Linux
- [ ] Starvation & aging; convoy effect
- [ ] IPC: pipes, named pipes/FIFOs, message queues, shared memory, sockets, signals
- [ ] Signals: SIGTERM vs SIGKILL vs SIGINT vs SIGHUP — **directly relevant to graceful shutdown in K8s**
