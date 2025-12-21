# atoma

A complete computational environment built on TypeScript's type system, replacing JavaScript primitives and runtime semantics with a coherent, type-safe, trait-driven alternative.

Named from Greek ἄτομα ("indivisibles"), Atoma provides irreducible, composable building blocks for computation.

## Design Principles

- **Type Safety**: If an operation can fail, it says so in the types. No hiding errors.
- **No Generators**: Everything composes through functions. No `function*` or `yield`.
- **Defect Isolation**: Unrecoverable errors stop the program immediately and clean up resources.
- **Performance**: Built for V8. Data structures are tuned for inlining and JIT optimization.
- **Orthogonality**: Each thing does one thing. Effects, errors, dependencies, and defects all stay separate.
- **Completeness**: Build full applications without stepping outside Atoma's boundaries.

## Todo

- [ ] Type System Foundation (HKT, branding, traits)
- [ ] Primitive Types (Unit, Bool, Int, Float, Str, Bytes)
- [ ] Data Traits & Algebraic Data Types (Option, Result, List, Dict, Set)
- [ ] Defects, Exit, Effect Core, Resources & Fibers
- [ ] Concurrency (Ref, Queue, Hub, Semaphore, Mutex, Deferred)
- [ ] Services, Layers, Program Model
- [ ] Time types, Platform Services
- [ ] Streams and Sinks
- [ ] JSON handling
- [ ] Schema & Validation
- [ ] ADT Builders and Trait Derivation
- [ ] Testing framework (property testing, assertions)
- [ ] Node and Browser platform implementations
- [ ] Polish and documentation

## Development

This is a Bun monorepo. To get started:

```bash
bun install
```

To run the core package:

```bash
cd packages/core
bun run src/index.ts
```

Or from the root:

```bash
bun run --cwd packages/core src/index.ts
```

This project was created using `bun init` in bun v1.3.4. [Bun](https://bun.com) is a fast all-in-one JavaScript runtime.
