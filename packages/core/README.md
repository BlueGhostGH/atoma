# `@atoma/core`

The core Atoma library, providing a complete computational environment built on TypeScript's type system with a fully-fledged effect system and rich standard library.

## Installation

Install the core package using your preferred package manager. For example, with Bun:

```bash
bun add atoma
```

## Overview of Core Modules

The `atoma` package provides a collection of modules designed for functional programming in TypeScript. Below is a brief overview of the planned core modules:

| Module          | Description                                                                                          |
| --------------- | ---------------------------------------------------------------------------------------------------- |
| Effect          | The core abstraction for managing side effects, concurrency, and error handling in a structured way. |
| Program         | A well-defined program structure with explicit defect handling and resource management.              |
| Defect          | Unrecoverable errors that immediately abort computation with guaranteed cleanup.                     |
| Exit            | Program result type (Success or Aborted) with trace information.                                     |
| Fiber           | Lightweight virtual threads with resource-safe cancellation and composition.                         |
| Stream          | A powerful abstraction for handling asynchronous, event-driven data processing.                      |
| Trait           | A trait system for data types and higher-kinded types with automatic derivation.                     |
| Schema          | Type-safe encoding, decoding, and validation of structured data.                                     |
| Service & Layer | Dependency injection and resource lifecycle management.                                              |

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

From this directory:

```bash
# Build
bun run build

# Watch mode
bun run dev

# Test
bun run test

# Lint
bun run lint

# Format
bun run fmt
```

Or from the root of the monorepo:

```bash
bun run --cwd packages/core build
```

## Publishing

Releases are managed via Changesets:

```bash
bun run release
```

See [`.changeset/`](./.changeset/) for more details.
