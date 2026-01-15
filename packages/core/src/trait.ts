import { TypeIdSymbol, type Typed } from "./brand";
import { PHANTOM } from "./phantom";

/**
 * Represents a trait with a name, a signature, and supertraits.
 * @since 0.1.0
 */
interface Trait<
  Name extends string,
  Signature,
  Supers extends readonly Trait<string, unknown>[] = readonly never[],
> {
  readonly _name: Name;
  readonly _signature: Signature;
  readonly _supers: Supers;
}

/**
 * A global registry for trait implementations.
 * This interface is meant to be augmented by modules that implement traits for types.
 *
 * @example
 * ```typescript
 * // When implementing a trait for a type, augment this interface:
 * declare module "@atoma/core" {
 *   interface ImplRegistry extends ImplFor<typeof Show, "MyType", MyShowImpl> {}
 * }
 * ```
 * @since 0.1.0
 */
interface ImplRegistry extends Record<string, unknown> {
  readonly _tag?: "ImplRegistry";
}

/**
 * A helper to construct a key for the ImplRegistry in the format `TraitName/TypeName`.
 * @since 0.1.0
 */
type TraitKey<Name extends string, N extends string> = `${Name}/${N}`;

/**
 * Helper type for ergonomic module augmentation of ImplRegistry.
 * Use this when declaring trait implementations for type-level coherence.
 *
 * @example
 * ```typescript
 * declare module "@atoma/core" {
 *   interface ImplRegistry extends ImplFor<typeof Show, "MyType", { show: (a: MyType) => Str }> {}
 * }
 * ```
 * @since 0.1.0
 */
type ImplFor<T extends Trait<string, unknown>, N extends string, I extends T["_signature"]> = {
  readonly [K in TraitKey<T["_name"], N>]: I;
};

/**
 * Extracts the return type of a method from a trait signature.
 * @since 0.1.0
 */
type MethodReturn<
  T extends Trait<string, unknown>,
  K extends keyof T["_signature"],
> = T["_signature"][K] extends (...args: never[]) => infer R ? R : never;

/**
 * Extracts the parameter types of a method from a trait signature.
 * @since 0.1.0
 */
type MethodParams<
  T extends Trait<string, unknown>,
  K extends keyof T["_signature"],
> = T["_signature"][K] extends (...args: infer P) => unknown ? P : never;

/**
 * Extracts the parameter types excluding the first (self) parameter.
 * Used for instance method invocations where self is passed implicitly.
 * @since 0.1.0
 */
type MethodParamsWithoutSelf<
  T extends Trait<string, unknown>,
  K extends keyof T["_signature"],
> = T["_signature"][K] extends (self: unknown, ...args: infer P) => unknown ? P : never;

/**
 * Defines a trait.
 * @param name - The name of the trait.
 * @param options - Optional configuration (supers: parent traits).
 * @returns A trait object with the given name and signature.
 * @since 0.1.0
 */
const makeTrait = <
  Name extends string,
  Signature,
  Supers extends readonly Trait<string, unknown>[] = readonly never[],
>(
  name: Name,
  options: { readonly supers?: Supers } = {},
): Trait<Name, Signature, Supers> => ({
  _name: name,
  _signature: PHANTOM as Signature,
  _supers: options.supers ?? ([] as unknown as Supers),
});

const TRAIT_IMPL_REGISTRY: Record<string, unknown> = {};

/**
 * Checks if a trait implementation exists for a specific type at runtime.
 * @param trait - The trait to check.
 * @param typeName - The name of the type.
 * @returns True if the implementation exists, false otherwise.
 * @since 0.1.0
 */
const hasImpl = <T extends Trait<string, unknown>, N extends string>(
  trait: T,
  typeName: N,
): boolean => {
  const key: TraitKey<T["_name"], N> = `${trait._name}/${typeName}`;
  return key in TRAIT_IMPL_REGISTRY;
};

/**
 * Registers a trait implementation for a specific type.
 * Validates that all supertraits are implemented before registering.
 * @param trait - The trait to implement.
 * @param typeName - The name of the type implementing the trait.
 * @param implementation - The implementation of the trait methods.
 * @throws If a required supertrait is not implemented.
 * @since 0.1.0
 */
const registerImpl = <
  T extends Trait<string, unknown>,
  N extends string,
  I extends T["_signature"],
>(
  trait: T,
  typeName: N,
  implementation: I,
): void => {
  // Validate supertraits are implemented
  for (const superTrait of trait._supers as readonly Trait<string, unknown>[]) {
    if (!hasImpl(superTrait, typeName)) {
      throw new Error(
        `Cannot implement trait "${trait._name}" for "${typeName}": ` +
          `supertrait "${superTrait._name}" is not implemented`,
      );
    }
  }
  const key: TraitKey<T["_name"], N> = `${trait._name}/${typeName}`;
  TRAIT_IMPL_REGISTRY[key] = implementation as unknown;
};

/**
 * Retrieves a trait implementation for a specific type.
 * @param trait - The trait to look up.
 * @param typeName - The name of the type.
 * @returns The trait implementation if found, otherwise undefined.
 * @since 0.1.0
 */
const getImpl = <T extends Trait<string, unknown>, N extends string>(
  trait: T,
  typeName: N,
): T["_signature"] | undefined => {
  const key: TraitKey<T["_name"], N> = `${trait._name}/${typeName}`;
  return TRAIT_IMPL_REGISTRY[key] as T["_signature"] | undefined;
};

/**
 * Type-level check if a type implements a trait.
 * @since 0.1.0
 */
type Implements<N extends string, T extends Trait<string, unknown>> =
  TraitKey<T["_name"], N> extends keyof ImplRegistry ? true : false;

/**
 * Represents a type that is bound by a trait.
 * @since 0.1.0
 */
type Bound<N extends string, T extends Trait<string, unknown>> =
  Implements<N, T> extends true ? N : never;

/**
 * Represents a type that is bound by multiple traits.
 * @since 0.1.0
 */
type Bounds<
  N extends string,
  TS extends readonly Trait<string, unknown>[],
> = TS extends readonly [infer Head, ...infer Tail]
  ? Head extends Trait<string, unknown>
    ? Implements<N, Head> extends true
      ? Tail extends readonly Trait<string, unknown>[]
        ? Bounds<N, Tail>
        : N
      : never
    : N
  : N;

/**
 * Gets the type name from a typed value.
 * @param value - The typed value.
 * @returns The name of the type.
 * @since 0.1.0
 */
const getTypeName = <N extends string>(value: Typed<N>): N => value[TypeIdSymbol]._name;

/**
 * Extracts a type name from either a string or a typed value.
 * If the input is a string, it is returned as-is (assumed to be a type name).
 * If the input is a typed value, the type name is extracted from it.
 * @param value - A string type name or a typed value.
 * @returns The type name.
 * @since 0.1.0
 */
const extractTypeName = <N extends string>(value: string | Typed<N>): N => {
  if (typeof value === "string") {
    return value as N;
  }
  return getTypeName(value);
};

/**
 * Invokes a trait method with a type name (static invocation).
 * All arguments must be provided explicitly.
 * @param trait - The trait.
 * @param typeName - The name of the type.
 * @param method - The method name.
 * @param args - The arguments for the method.
 * @returns The result of the method invocation.
 * @throws Error if the trait implementation is not registered for the type.
 * @since 0.1.0
 */
function invoke<T extends Trait<string, unknown>, K extends keyof T["_signature"]>(
  trait: T,
  typeName: string,
  method: K,
  ...args: MethodParams<T, K>
): MethodReturn<T, K>;

/**
 * Invokes a trait method with a typed value (instance invocation).
 * The value is automatically passed as the first argument (self).
 * @param trait - The trait.
 * @param target - The typed value (self).
 * @param method - The method name.
 * @param args - The remaining arguments (excluding self).
 * @returns The result of the method invocation.
 * @throws Error if the trait implementation is not registered for the type.
 * @since 0.1.0
 */
function invoke<
  T extends Trait<string, unknown>,
  K extends keyof T["_signature"],
  N extends string,
>(
  trait: T,
  target: Typed<N>,
  method: K,
  ...args: MethodParamsWithoutSelf<T, K>
): MethodReturn<T, K>;

function invoke<T extends Trait<string, unknown>, K extends keyof T["_signature"]>(
  trait: T,
  target: string | Typed<string>,
  method: K,
  ...args: unknown[]
): MethodReturn<T, K> {
  const typeName = extractTypeName(target);
  const implementation = getImpl(trait, typeName);
  if (!implementation) {
    throw new Error(`Trait ${trait._name} not implemented for ${typeName}`);
  }
  const fn = (implementation as Record<K, (...args: unknown[]) => MethodReturn<T, K>>)[method];
  if (typeof target === "string") {
    return fn(...args);
  }
  return fn(target, ...args);
}

/**
 * Creates an invoker for a trait method (static invocation).
 * Returns a function that takes a type name and all arguments.
 * @param trait - The trait.
 * @param method - The method name.
 * @returns An invoker function for static calls.
 * @throws Error (from the returned invoker) if the trait implementation is not registered.
 * @since 0.1.0
 */
function makeInvoker<T extends Trait<string, unknown>, K extends keyof T["_signature"]>(
  trait: T,
  method: K,
): (typeName: string, ...args: MethodParams<T, K>) => MethodReturn<T, K>;

/**
 * Creates an invoker for a trait method (instance invocation).
 * Returns a function that takes a typed value and remaining arguments.
 * @param trait - The trait.
 * @param method - The method name.
 * @returns An invoker function for instance calls.
 * @throws Error (from the returned invoker) if the trait implementation is not registered.
 * @since 0.1.0
 */
function makeInvoker<T extends Trait<string, unknown>, K extends keyof T["_signature"]>(
  trait: T,
  method: K,
): <N extends string>(
  target: Typed<N>,
  ...args: MethodParamsWithoutSelf<T, K>
) => MethodReturn<T, K>;

function makeInvoker<T extends Trait<string, unknown>, K extends keyof T["_signature"]>(
  trait: T,
  method: K,
): (target: string | Typed<string>, ...args: unknown[]) => MethodReturn<T, K> {
  return (target: string | Typed<string>, ...args: unknown[]): MethodReturn<T, K> =>
    invoke(trait, target as string, method, ...(args as MethodParams<T, K>));
}

/**
 * Retrieves the trait implementation bound to a specific type.
 * @param trait - The trait.
 * @param typeName - The name of the type.
 * @returns The trait implementation.
 * @throws Error if the trait implementation is not registered for the type.
 * @since 0.1.0
 */
const getBound = <T extends Trait<string, unknown>, N extends string>(
  trait: T,
  typeName: N,
): T["_signature"] => {
  const implementation = getImpl(trait, typeName);
  if (!implementation) {
    throw new Error(`Trait ${trait._name} not implemented for ${typeName}`);
  }
  return implementation;
};

/**
 * Describes the structure of a type for derivation purposes.
 * Used by Derivers to generate trait implementations automatically.
 * @since 0.1.0
 */
interface TypeStructure {
  /**
   * The kind of type: struct (product), sum (coproduct), or newtype (wrapper).
   */
  readonly kind: "struct" | "sum" | "newtype";
  /**
   * The name of the type.
   */
  readonly name: string;
  /**
   * For structs: field names and their type names.
   * For sums: variant names and their payloads.
   * For newtypes: the underlying type name.
   */
  readonly fields?: Record<string, string>;
  readonly variants?: Record<string, TypeStructure | null>;
  readonly underlying?: string;
}

/**
 * A trait deriver that can automatically generate implementations.
 * @since 0.1.0
 */
interface Deriver<T extends Trait<string, unknown>> {
  /**
   * The trait this deriver generates implementations for.
   */
  readonly trait: T;

  /**
   * Checks if this deriver can derive the trait for the given type structure.
   * @param structure - The structure of the type.
   * @returns True if derivation is possible.
   */
  readonly canDerive: (structure: TypeStructure) => boolean;

  /**
   * Derives and registers the trait implementation for a type.
   * @param structure - The structure of the type to derive for.
   * @throws If derivation is not possible for this structure.
   */
  readonly derive: (structure: TypeStructure) => void;
}

/**
 * Creates a deriver for a trait.
 * @param trait - The trait to create a deriver for.
 * @param options - Deriver configuration.
 * @returns A deriver instance.
 * @since 0.1.0
 */
const makeDeriver = <T extends Trait<string, unknown>>(
  trait: T,
  options: {
    readonly canDerive: (structure: TypeStructure) => boolean;
    readonly deriveImpl: (structure: TypeStructure) => T["_signature"];
  },
): Deriver<T> => ({
  trait: trait,
  canDerive: options.canDerive,
  // NOTE: False positive lint warning for require-param
  // oxlint-disable-next-line require-param
  derive: (structure: TypeStructure): void => {
    if (!options.canDerive(structure)) {
      throw new Error(
        `Cannot derive trait "${trait._name}" for type "${structure.name}" with kind "${structure.kind}"`,
      );
    }
    const implementation = options.deriveImpl(structure);
    registerImpl(trait, structure.name, implementation);
  },
});

export {
  makeTrait,
  registerImpl,
  getImpl,
  hasImpl,
  getTypeName,
  invoke,
  makeInvoker,
  getBound,
  makeDeriver,
};
export type {
  Trait,
  ImplRegistry,
  TraitKey,
  ImplFor,
  MethodReturn,
  MethodParams,
  MethodParamsWithoutSelf,
  Implements,
  Bound,
  Bounds,
  Deriver,
  TypeStructure,
};
