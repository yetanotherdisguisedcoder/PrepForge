---
title: "Transport Layer"
category: networking
part: "PART 7 — COMPUTER NETWORKS"
number: "7.2"
order: 7.2
priority: P0
status: not-started
source: 00_MASTER_TOPIC_LIST.md
---

- [ ] TCP vs UDP — guarantees, overhead, use cases
- [ ] TCP three-way handshake (SYN, SYN-ACK, ACK) and four-way teardown (FIN/ACK ×2)
- [ ] TCP states: LISTEN, SYN_SENT, ESTABLISHED, TIME_WAIT, CLOSE_WAIT — **what a pile of TIME_WAIT or CLOSE_WAIT sockets tells you** (real debugging signal)
- [ ] Flow control (sliding window, receive window) vs congestion control (slow start, congestion avoidance, fast retransmit/recovery, CUBIC/BBR)
- [ ] Head-of-line blocking; Nagle's algorithm & `TCP_NODELAY`
- [ ] Retransmission, RTO, selective ACK
- [ ] Ports, sockets, ephemeral port exhaustion, SO_REUSEADDR
- [ ] Keep-alive at TCP vs HTTP level
