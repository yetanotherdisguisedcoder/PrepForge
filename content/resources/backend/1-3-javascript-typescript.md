---
title: "JavaScript / TypeScript"
category: backend
part: "PART 1 — PROGRAMMING & OOP FUNDAMENTALS"
number: "1.3"
order: 1.3
priority: P0
status: not-started
source: 00_MASTER_TOPIC_LIST.md
note: "JD explicitly asks for TS — close this gap"
---

- [ ] `var` / `let` / `const`, TDZ, hoisting
- [ ] Closures — and a real use (memoization, private state, rate limiter)
- [ ] `this` binding: default, implicit, explicit (`call/apply/bind`), `new`, arrow functions
- [ ] Prototypes & prototypal inheritance; `class` as syntactic sugar; `__proto__` vs `prototype`
- [ ] Event loop (browser): call stack, task queue, microtask queue, `Promise` vs `setTimeout` ordering
- [ ] Promises: states, chaining, `Promise.all` / `allSettled` / `race` / `any`; error propagation
- [ ] `async`/`await`, sequential vs parallel await (the classic "make this faster" question)
- [ ] Generators & iterators; `for...of` vs `for...in`; Symbol.iterator
- [ ] Destructuring, spread/rest, optional chaining, nullish coalescing
- [ ] Deep vs shallow copy; `structuredClone`; JSON round-trip pitfalls
- [ ] Debounce vs throttle — implement both from scratch
- [ ] Currying, partial application, function composition
- [ ] Memory leaks in JS: detached DOM, forgotten timers, global refs, closures over big objects
- [ ] Modules: CommonJS vs ESM, circular deps, tree-shaking
- [ ] **TypeScript:** structural typing, `interface` vs `type`, unions/intersections, generics, `keyof`/`typeof`, mapped & conditional types, utility types (`Partial`, `Pick`, `Omit`, `Record`, `Required`, `Readonly`), discriminated unions, narrowing & type guards, `unknown` vs `any` vs `never`, declaration merging, `strict` mode flags, decorators (NestJS uses them heavily)
