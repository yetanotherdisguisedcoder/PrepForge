---
title: "REST API Design"
category: backend
part: "PART 5 — BACKEND & API FUNDAMENTALS"
number: "5.2"
order: 5.2
priority: P0
status: not-started
source: 00_MASTER_TOPIC_LIST.md
---

- [ ] Resource naming, plural nouns, nesting depth, avoiding verbs in URLs
- [ ] Richardson Maturity Model; HATEOAS (know it, know why nobody does it)
- [ ] Statelessness and why it matters for horizontal scaling
- [ ] **Versioning**: URL path (`/v1`), header, media type, query param — trade-offs; deprecation policy; sunset headers
- [ ] **Pagination**: offset/limit, cursor/keyset, page tokens; total counts and why they're expensive
- [ ] Filtering, sorting, sparse fieldsets, search params
- [ ] **Idempotency** 🔴: idempotency keys, request fingerprinting, storing responses, TTL on keys, what happens on concurrent retry. *(Payment/credits systems — your Credits System is a perfect story here.)*
- [ ] Bulk / batch endpoints; partial failure semantics (207 Multi-Status)
- [ ] Long-running operations: 202 + status polling, callback URLs, job resources
- [ ] Error response contract: consistent envelope, machine-readable code, human message, correlation id, RFC 7807 Problem Details
- [ ] Rate limit headers (`X-RateLimit-*`, `Retry-After`)
- [ ] Request validation & schema (JSON Schema, Zod, Pydantic, dry-validation)
- [ ] API documentation: OpenAPI/Swagger, contract-first vs code-first
- [ ] API gateways: routing, auth offload, throttling, transformation (Kong, AWS API Gateway, Nginx)
- [ ] BFF (Backend for Frontend) pattern
- [ ] File uploads: multipart, direct-to-S3 presigned URLs (**you do this**), chunked/resumable uploads, virus scanning
- [ ] Webhooks: delivery guarantees, retries with backoff, signature verification (HMAC), replay protection, consumer idempotency, dead-lettering
