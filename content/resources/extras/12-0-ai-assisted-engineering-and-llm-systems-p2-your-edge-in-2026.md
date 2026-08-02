---
title: "AI-ASSISTED ENGINEERING AND LLM SYSTEMS 🟡 P2 (YOUR EDGE IN 2026)"
category: extras
part: "PART 12 — AI-ASSISTED ENGINEERING AND LLM SYSTEMS 🟡 P2 (YOUR EDGE IN 2026)"
number: "12.0"
order: 12
priority: P2
status: not-started
source: 00_MASTER_TOPIC_LIST.md
---

You built a RAG-based evaluation pipeline, an AI candidate-summary microservice, custom AI agents for billing reconciliation, and an assessment engine that scores humans on AI-usage judgment. Very few candidates at this band have this. **Make it part of your pitch, not a footnote.**

- [ ] LLM basics: tokens, context window, temperature, top-p, system vs user messages, streaming
- [ ] Prompt engineering: few-shot, chain-of-thought, structured output (JSON/schema-constrained), prompt injection and mitigation
- [ ] **RAG architecture**: chunking strategies, embeddings, vector store, retrieval (dense vs sparse vs hybrid, BM25), reranking, context assembly, citation, evaluation
- [ ] Vector search: cosine/dot/L2, HNSW/IVF, recall vs latency, pgvector
- [ ] **LLM serving/inference infra** 🟡 (awareness) — vLLM/TGI, continuous batching, KV-cache, quantization (INT8/INT4) — why self-hosting a model is an infra problem, not just an API call
- [ ] **Feature store** 🟢 (awareness only) — Feast/Tecton as the ML-platform pattern for sharing features between training and serving; low relevance to this JD but a common 2025-2026 buzzword
- [ ] Agents and tool use: function calling, ReAct loop, orchestration, guardrails, MCP (Model Context Protocol)
- [ ] LLM evaluation: golden datasets, LLM-as-judge and its biases, inter-rater agreement (Cohen's kappa, Krippendorff's alpha), blind scoring protocols, rubric design, rank correlation (Spearman, Kendall tau). **This is exactly what you are doing with Manthan — quantify it.**
- [ ] Production concerns: cost per request, caching (exact and semantic), latency budgets, fallbacks, provider rate limits, model versioning, determinism, PII redaction before sending to a provider, self-hosted vs API
- [ ] Observability for LLM apps: tracing prompts and completions, token accounting, quality drift
- [ ] Fine-tuning vs RAG vs prompt engineering — the decision tree
- [ ] AI in the SDLC: coding assistants in review, test generation, migration automation; **automation bias** and designing evaluations that detect it (your seeded-bug "trap fix" concept is an original talking point)
- [ ] Risks: hallucination, over-reliance, IP and licensing, security of generated code

---
