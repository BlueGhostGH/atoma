# Atoma Monorepo

> A complete computational environment built on TypeScript's type system

## Introduction

Welcome to Atoma, a computational environment that replaces JavaScript primitives and runtime semantics with a coherent, type-safe, trait-driven alternative.

Named from Greek ἄτομα ("indivisibles"), Atoma provides irreducible, composable building blocks for computation.

**Core principles:**

- **Type Safety**: If an operation can fail, it says so in the types. No hiding errors.
- **No Generators**: Everything composes through functions. No `function*` or `yield`.
- **Defect Isolation**: Unrecoverable errors stop the program immediately and clean up resources.
- **Performance**: Built for V8. Data structures are tuned for inlining and JIT optimization.
- **Orthogonality**: Each thing does one thing. Effects, errors, dependencies, and defects all stay separate.
- **Completeness**: Build full applications without leaving Atoma's boundaries.

## Monorepo Structure

This is a Bun monorepo with the following structure:

| Package | Description |
| ------- | ----------- |
| `atoma` | Core library with the effect system, primitives, traits, and platform services |

More packages will be added as the project grows (e.g., platform implementations, utilities, wrappers).

## Documentation

For detailed information about the core package, see [`packages/core/README.md`](./packages/core/README.md).

## Getting Started

Install dependencies:

```bash
bun install
```

See [`packages/core/`](./packages/core/) for package-specific instructions on development and building.
