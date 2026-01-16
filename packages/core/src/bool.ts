import {
    type Brand,
    BrandSymbol,
    type TypeId,
    TypeIdSymbol,
} from "./brand";

/**
 * A unique symbol used to identify the `Bool` type.
 * @since 0.1.0
 */
const BoolSymbol: unique symbol = Symbol.for("atoma/Bool");

/**
 * Base interface for `Bool` values containing branding and type identity.
 * @since 0.1.0
 */
interface BoolBase extends Brand<"Bool"> {
    readonly [TypeIdSymbol]: TypeId<"Bool">;
    readonly [BoolSymbol]: typeof BoolSymbol;
}

/**
 * The `True` variant of `Bool`.
 * @since 0.1.0
 */
interface True extends BoolBase {
    readonly _tag: "True";
}

/**
 * The `False` variant of `Bool`.
 * @since 0.1.0
 */
interface False extends BoolBase {
    readonly _tag: "False";
}

/**
 * The `Bool` type represents a boolean value with two variants: `True` and `False`.
 * @since 0.1.0
 */
type Bool = True | False;

/* NOTE: We use a namespace to hold the singleton values because `true` and
   `false` are reserved words in JavaScript and cannot be used as variable names. */
const internal = {
    /**
     * The singleton `True` value.
     * @since 0.1.0
     */
    /* NOTE: The cast is safe because we are constructing the branded `True` type
       with all required symbol properties. TypeScript cannot infer this automatically. */
    // oxlint-disable-next-line no-unsafe-type-assertion
    true: {
        _tag: "True",
        [BrandSymbol]: {
            Bool: "Bool",
        },
        /* NOTE: Safe cast - `TypeIdSymbol` is the base symbol, `TypeId<"Bool">` is
           its branded version. We control both and they are structurally identical. */
        // oxlint-disable-next-line no-unsafe-type-assertion
        [TypeIdSymbol]: TypeIdSymbol as TypeId<"Bool">,
        [BoolSymbol]: BoolSymbol,
    } as True,

    /**
     * The singleton `False` value.
     * @since 0.1.0
     */
    /* NOTE: The cast is safe because we are constructing the branded `False` type
       with all required symbol properties. TypeScript cannot infer this automatically. */
    // oxlint-disable-next-line no-unsafe-type-assertion
    false: {
        _tag: "False",
        [BrandSymbol]: {
            Bool: "Bool",
        },
        /* NOTE: Safe cast - `TypeIdSymbol` is the base symbol, `TypeId<"Bool">` is
           its branded version. We control both and they are structurally identical. */
        // oxlint-disable-next-line no-unsafe-type-assertion
        [TypeIdSymbol]: TypeIdSymbol as TypeId<"Bool">,
        [BoolSymbol]: BoolSymbol,
    } as False,
};

/**
 * Checks if a value is a `Bool`.
 * @param u - The value to check.
 * @returns `true` if the value is a `Bool`, `false` otherwise.
 * @since 0.1.0
 */
const isBool = (u: unknown): u is Bool => {
    if (
        typeof u === "object" &&
        u !== null &&
        BoolSymbol in u
    ) {
        /* NOTE: Safe cast - we've verified `u` is a non-null object containing
           `BoolSymbol`. TypeScript doesn't narrow based on symbol `in` checks. */
        // oxlint-disable-next-line no-unsafe-type-assertion
        const candidate = u as Bool;
        return candidate[BoolSymbol] === BoolSymbol;
    }
    return false;
};

/**
 * Checks if a `Bool` is `True`.
 * @param b - The `Bool` to check.
 * @returns `true` if the value is `True`, `false` otherwise.
 * @since 0.1.0
 */
const isTrue = (b: Bool): b is True => b._tag === "True";

/**
 * Checks if a `Bool` is `False`.
 * @param b - The `Bool` to check.
 * @returns `true` if the value is `False`, `false` otherwise.
 * @since 0.1.0
 */
const isFalse = (b: Bool): b is False => b._tag === "False";

/**
 * Logical AND of two `Bool` values.
 * @param a - The first `Bool`.
 * @param b - The second `Bool`.
 * @returns `True` if both are `True`, `False` otherwise.
 * @since 0.1.0
 */
const and = (a: Bool, b: Bool): Bool => {
    if (a._tag === "True" && b._tag === "True") {
        return internal.true;
    }
    return internal.false;
};

/**
 * Logical OR of two `Bool` values.
 * @param a - The first `Bool`.
 * @param b - The second `Bool`.
 * @returns `True` if either is `True`, `False` otherwise.
 * @since 0.1.0
 */
const or = (a: Bool, b: Bool): Bool => {
    if (a._tag === "True" || b._tag === "True") {
        return internal.true;
    }
    return internal.false;
};

/**
 * Logical NOT of a `Bool` value.
 * @param a - The `Bool` to negate.
 * @returns `False` if `True`, `True` if `False`.
 * @since 0.1.0
 */
const not = (a: Bool): Bool => {
    if (a._tag === "True") {
        return internal.false;
    }
    return internal.true;
};

/**
 * Logical XOR (exclusive or) of two `Bool` values.
 * @param a - The first `Bool`.
 * @param b - The second `Bool`.
 * @returns `True` if exactly one is `True`, `False` otherwise.
 * @since 0.1.0
 */
const xor = (a: Bool, b: Bool): Bool => {
    if (a._tag === b._tag) {
        return internal.false;
    }
    return internal.true;
};

/**
 * Logical implication (a → b).
 * Returns `False` only when `a` is `True` and `b` is `False`.
 * @param a - The antecedent `Bool`.
 * @param b - The consequent `Bool`.
 * @returns `True` if `a` implies `b`, `False` otherwise.
 * @since 0.1.0
 */
const implies = (a: Bool, b: Bool): Bool => {
    if (a._tag === "False" || b._tag === "True") {
        return internal.true;
    }
    return internal.false;
};

/**
 * Pattern matches on a `Bool` value with lazy evaluation.
 * @param b - The `Bool` to match on.
 * @param onTrue - Function to call if `True`.
 * @param onFalse - Function to call if `False`.
 * @returns The result of the matching function.
 * @since 0.1.0
 */
const match = <A>(
    b: Bool,
    onTrue: () => A,
    onFalse: () => A,
): A => {
    if (b._tag === "True") {
        return onTrue();
    }
    return onFalse();
};

/**
 * Selects between two values based on a `Bool`.
 * @param b - The `Bool` to select on.
 * @param onTrue - Value to return if `True`.
 * @param onFalse - Value to return if `False`.
 * @returns The selected value.
 * @since 0.1.0
 */
const select = <A>(b: Bool, onTrue: A, onFalse: A): A => {
    if (b._tag === "True") {
        return onTrue;
    }
    return onFalse;
};

/**
 * Returns the value if the `Bool` is `True`, otherwise `undefined`.
 * @param b - The `Bool` to check.
 * @param value - The value to return if `True`.
 * @returns The value if `True`, `undefined` otherwise.
 * @since 0.1.0
 */
// TODO: Change return type to `Option<A>` when Option is implemented
const whenTrue = <A>(b: Bool, value: A): A | undefined => {
    if (b._tag === "True") {
        return value;
    }
    // oxlint-disable-next-line no-undefined
    return undefined;
};

/**
 * Returns the value if the `Bool` is `False`, otherwise `undefined`.
 * @param b - The `Bool` to check.
 * @param value - The value to return if `False`.
 * @returns The value if `False`, `undefined` otherwise.
 * @since 0.1.0
 */
// TODO: Change return type to `Option<A>` when Option is implemented
const whenFalse = <A>(b: Bool, value: A): A | undefined => {
    if (b._tag === "False") {
        return value;
    }
    // oxlint-disable-next-line no-undefined
    return undefined;
};

const { true: true_, false: false_ } = internal;

export {
    BoolSymbol,
    true_ as true,
    false_ as false,
    isBool,
    isTrue,
    isFalse,
    and,
    or,
    not,
    xor,
    implies,
    match,
    select,
    whenTrue,
    whenFalse,
};
export type { Bool, True, False };
