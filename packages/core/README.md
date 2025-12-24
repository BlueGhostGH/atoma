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

### Part I: Program Model
- [ ] Defect type and built-in defect tags
- [ ] Exit type (Success, Aborted, Trace, Frame)
- [ ] Program type and core operations
- [ ] Main entry point with exit handling

### Part II: Effect System
- [ ] Effect core (succeed, succeedLazy, suspend)
- [ ] Effect functor/monad operations (map, flatMap, zip)
- [ ] Effect conditionals and loops
- [ ] Do-notation support
- [ ] Effect async primitives (async, fromPromise, sleep)
- [ ] Result handling in effects
- [ ] Defect operations in effects
- [ ] Resource safety (acquireRelease, bracket, ensuring, scoped)
- [ ] Fiber type and operations
- [ ] Interruption handling
- [ ] Parallel execution (allPar, race, forEachPar)
- [ ] Timing operations (timed, timeout, delay, retry, repeat)

### Part III: Type System
- [x] Higher-kinded types (HKT, Fn, Apply, $, $$, $$$)
- [x] Type identity and branding (TypeId, Brand, Branded)
- [ ] Trait system (Trait, ImplRegistry, impl, getImpl)

### Part IV: Primitive Types
- [ ] Unit and Never types
- [ ] Bool type with operations
- [ ] Ordering type
- [ ] Int type (53-bit signed)
- [ ] I32 and U32 types
- [ ] Float type with subtypes
- [ ] Str type with subtypes
- [ ] Bytes type

### Part V: Data Traits
- [ ] Eq, Ord, Hash traits
- [ ] Show, Debug, Clone traits
- [ ] Default, Semigroup, Monoid traits
- [ ] Implement traits for primitives

### Part VI: Algebraic Data Types
- [ ] Option (None, Some)
- [ ] Result (Ok, Err)
- [ ] Pair and Triple
- [ ] List (immutable array-backed)
- [ ] NonEmptyList
- [ ] Dict (immutable hash map)
- [ ] Set (immutable hash set)

### Part VII: Higher-Kinded Traits
- [ ] Functor trait
- [ ] Apply, Applicative traits
- [ ] FlatMap, Monad traits
- [ ] Foldable, Traversable traits
- [ ] Filterable trait

### Part VIII: Concurrency Primitives
- [ ] Ref (mutable reference with atomic updates)
- [ ] Deferred (single-value async variable)
- [ ] Queue (concurrent FIFO)
- [ ] Hub (pub/sub broadcast)
- [ ] Semaphore and Mutex

### Part IX: Services & Dependency Injection
- [ ] ServiceTag type
- [ ] Layer type and operations
- [ ] Console service
- [ ] Clock service
- [ ] Random service
- [ ] Env service
- [ ] Args service with argument parsing
- [ ] FileSystem service with Path type
- [ ] Network service (HTTP client/server)

### Part X: Time Types
- [ ] Duration type and operations
- [ ] Instant type and operations
- [ ] TimeZone type

### Part XI: Streams
- [ ] Stream core (empty, succeed, unfold, iterate, repeat, range)
- [ ] Stream transformation (map, flatMap, filter, take, drop, scan)
- [ ] Stream combination (concat, zip, merge, interleave, flattenPar)
- [ ] Stream aggregation (fold, collect, count, sum, reduce)
- [ ] Stream chunking (chunks, grouped, sliding)
- [ ] Stream running (runCollect, runForEach, runHead, runDrain)
- [ ] Sink type and operations

### Part XII: JSON
- [ ] Json type (Null, Bool, Number, String, Array, Object)
- [ ] Json parsing and stringification
- [ ] Json access helpers

### Part XIII: Schema & Validation
- [ ] Schema core (Schema<I, O>, decode, encode)
- [ ] Schema primitives (unknown, string, number, boolean, int, float, null, undefined, literal)
- [ ] Schema combinators (struct, partial, record, tuple, list, union, tagged, optional, nullable, lazy)
- [ ] Schema refinements (refine, nonEmpty, positive, negative, min, max, range, pattern, email, uuid, url)
- [ ] Schema derivation (typeOf, inputOf, encoder, decoder, arbitrary)

### Part XIV: ADT Builders & Derivation
- [ ] Struct builder
- [ ] ADT (sum type) builder
- [ ] Newtype builder
- [ ] Automatic trait derivation for struct, sum, newtype

### Part XV: Testing
- [ ] Arbitrary type and generators
- [ ] Property testing (forAll, check, CheckResult)
- [ ] Assertions (equal, isTrue, isFalse, isSome, isNone, isOk, isErr, throws, contains, hasLength)

### Part XVI: Platform Implementations
- [ ] Bun platform (Console, Clock, Random, Env, Args, FileSystem, Network)
- [ ] Browser platform (Console, Clock, Random, Network)

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
