---
title: "Java / Spring Boot"
category: backend
part: "PART 1 — PROGRAMMING & OOP FUNDAMENTALS"
number: "1.6"
order: 1.6
priority: P1
status: not-started
source: 00_MASTER_TOPIC_LIST.md
note: "CloudNap + JD names Spring Boot"
---

- [ ] JVM: JIT, class loading, heap/stack/metaspace, GC algorithms (G1, ZGC, Shenandoah), GC tuning basics
- [ ] Collections: HashMap internals (buckets → treeify at 8), ConcurrentHashMap, ArrayList vs LinkedList, fail-fast iterators
- [ ] `equals`/`hashCode`/`Comparable`/`Comparator`
- [ ] Concurrency: `synchronized`, `volatile`, `ReentrantLock`, `AtomicInteger`, `ExecutorService`, `CompletableFuture`, `ForkJoinPool`, `ThreadLocal`, happens-before / Java Memory Model
- [ ] **Virtual threads (Project Loom, Java 21)** 🟡 P2 — a 2026 favourite; how they change blocking-IO server design vs reactive
- [ ] Streams API, Optional, records, sealed classes, pattern matching, text blocks
- [ ] Spring core: IoC container, bean lifecycle, scopes (singleton/prototype/request), `@Component`/`@Service`/`@Repository`/`@Configuration`, component scanning
- [ ] Spring Boot: auto-configuration, starters, `application.yml` profiles, `@ConditionalOn*`, Actuator
- [ ] Spring MVC vs WebFlux (reactive, Project Reactor, Mono/Flux, backpressure)
- [ ] Spring Data JPA: repositories, derived queries, JPQL, `@Query`, pagination, projections
- [ ] **JPA/Hibernate deep** 🟠: entity lifecycle (transient/persistent/detached/removed), first & second-level cache, lazy loading + `LazyInitializationException`, N+1, `@Transactional` propagation & isolation, dirty checking, optimistic (`@Version`) vs pessimistic locking, flush modes
- [ ] Spring Security (you used JWT): filter chain, `AuthenticationManager`, `UserDetailsService`, JWT vs session, method-level security, CORS+CSRF
- [ ] JobRunr / Quartz / `@Scheduled` — distributed scheduling, missed-fire policies, leader election for cron in multi-instance deployments 🟠 *(directly your CloudNap design)*
- [ ] Exception handling: `@ControllerAdvice`, `@ExceptionHandler`, problem-detail responses (RFC 7807)
- [ ] Testing: JUnit 5, Mockito, `@SpringBootTest` vs slice tests, Testcontainers
- [ ] Maven vs Gradle, dependency scopes, BOM
