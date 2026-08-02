---
title: "HTTP & The Web"
category: backend
part: "PART 5 — BACKEND & API FUNDAMENTALS"
number: "5.1"
order: 5.1
priority: P0
status: not-started
source: 00_MASTER_TOPIC_LIST.md
---

- [ ] HTTP request/response anatomy; headers that matter (`Content-Type`, `Accept`, `Authorization`, `Cache-Control`, `ETag`, `Location`, `Retry-After`, `X-Request-Id`)
- [ ] Methods & semantics: GET/POST/PUT/PATCH/DELETE/HEAD/OPTIONS — **safe vs idempotent** (know the difference cold: GET/HEAD/OPTIONS are safe; GET/PUT/DELETE are idempotent; POST is neither; PATCH is not necessarily)
- [ ] Status codes: 200/201/202/204, 301/302/304/307/308, 400/401/403/404/405/409/410/415/422/429, 500/502/503/504 — and *when* you'd choose 409 vs 422, 401 vs 403
- [ ] HTTP/1.1 vs HTTP/2 (multiplexing, header compression HPACK, server push) vs HTTP/3 (QUIC over UDP, no head-of-line blocking)
- [ ] Keep-alive, connection reuse, pipelining
- [ ] Content negotiation, compression (gzip/brotli), chunked transfer encoding
- [ ] Cookies: `HttpOnly`, `Secure`, `SameSite` (Lax/Strict/None), domain/path scoping
- [ ] CORS: preflight, `Access-Control-Allow-*`, credentials, why `*` + credentials fails
- [ ] WebSockets: handshake/upgrade, vs SSE vs long polling — when each. **You built PingChat + live coding sessions — own this.**
- [ ] Server-Sent Events; HTTP streaming (relevant to LLM token streaming)
