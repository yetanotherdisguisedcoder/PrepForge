---
title: "Authentication, Authorization & Security"
category: backend
part: "PART 5 — BACKEND & API FUNDAMENTALS"
number: "5.6"
order: 5.6
priority: P0
status: not-started
source: 00_MASTER_TOPIC_LIST.md
---

- [ ] AuthN vs AuthZ
- [ ] Sessions vs tokens; server-side session stores (Redis); session fixation
- [ ] **JWT** 🔴: structure (header.payload.signature), signing (HS256 vs RS256/ES256), claims (`iss`, `sub`, `aud`, `exp`, `iat`, `jti`), stateless trade-off, **why you can't revoke a JWT** and the workarounds (short TTL + refresh, denylist with `jti`, token versioning), `alg: none` attack, key rotation & JWKS
- [ ] Refresh tokens, rotation, reuse detection, sliding sessions
- [ ] **OAuth 2.0** 🟠: roles, grant types (authorization code + PKCE, client credentials, device code; why implicit & password grants are deprecated), scopes, state parameter (CSRF), redirect URI validation
- [ ] **OIDC**: ID token vs access token, userinfo endpoint, SSO
- [ ] SAML (enterprise SSO awareness — relevant to eLitmus B2B clients)
- [ ] API keys, HMAC request signing, mTLS
- [ ] MFA/TOTP, WebAuthn/passkeys (awareness)
- [ ] Password storage: bcrypt/scrypt/Argon2, salting, peppering, work factor, never MD5/SHA1; timing-safe comparison
- [ ] **Authorization models**: RBAC, ABAC, ReBAC (Zanzibar-style), permission checks at API vs data layer, multi-tenant isolation enforcement, IDOR prevention
- [ ] **OWASP Top 10** 🔴 (2021): Broken Access Control, Cryptographic Failures, Injection, Insecure Design, Security Misconfiguration, Vulnerable Components, Identification & Auth Failures, Software/Data Integrity Failures, Logging & Monitoring Failures, SSRF
- [ ] SQL injection & parameterized queries; ORM injection surfaces
- [ ] XSS (stored/reflected/DOM), output encoding, CSP
- [ ] CSRF, SameSite cookies, anti-CSRF tokens
- [ ] SSRF (and cloud metadata endpoint `169.254.169.254` — **IMDSv2 matters, you run EC2**)
- [ ] Insecure deserialization; path traversal; command injection; XXE
- [ ] Secrets management: env vars vs Vault vs AWS Secrets Manager/Parameter Store, rotation, never in git, `git-secrets`/gitleaks
- [ ] Encryption: at rest (KMS, envelope encryption, TDE) vs in transit (TLS); symmetric vs asymmetric; hashing vs encryption vs encoding
- [ ] **TLS handshake** 🟠 (TLS 1.2 vs 1.3), certificates, CA chain, SNI, mTLS, cert expiry & renewal automation, HSTS. *(You literally debugged an SSL renewal pipeline — great story.)*
- [ ] PII handling, data residency, GDPR/DPDP Act (India) basics, right to erasure, data minimization
- [ ] **Enterprise compliance awareness** 🟡 (SOC2, ISO 27001) — what auditors actually check (access reviews, change management, encryption, logging), why B2B clients ask for these reports. *(Relevant given eLitmus's B2B client base and CloudNap's multi-tenant model.)*
- [ ] Audit logging, tamper-evidence
- [ ] Dependency/supply-chain security: SCA, SBOM, `npm audit`, Dependabot, image scanning (Trivy)
- [ ] Rate limiting as a security control; bot detection; CAPTCHA
- [ ] DDoS mitigation layers (L3/4 vs L7), WAF
- [ ] Security headers: CSP, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy
- [ ] **Anti-cheat / proctoring security** 🟡 — *your differentiator*: process enumeration, remote-access detection, kiosk/lockdown browsers, evasion arms race, false-positive cost
