/**
 * Represents a type-level function.
 * @since 0.1.0
 */
interface Fn {
    readonly args: unknown[];
    readonly return: unknown;
}

/**
 * Applies a type-level function `F` to arguments `Args`.
 * @since 0.1.0
 */
type Apply<F extends Fn, Args extends unknown[]> = (F & {
    readonly args: Args;
})["return"];

/**
 * Applies a type-level function `F` to a single argument `A`.
 * @since 0.1.0
 */
type $<F extends Fn, A> = Apply<
    F,
    [
        A,
    ]
>;

/**
 * Applies a type-level function `F` to two arguments `A` and `B`.
 * @since 0.1.0
 */
type $$<F extends Fn, A, B> = Apply<
    F,
    [
        A,
        B,
    ]
>;

/**
 * Applies a type-level function `F` to three arguments `A`, `B`, and `C`.
 * @since 0.1.0
 */
type $$$<F extends Fn, A, B, C> = Apply<
    F,
    [
        A,
        B,
        C,
    ]
>;

/**
 * Extracts the N-th argument type from a type-level function `F`.
 * @since 0.1.0
 */
type Arg<
    F extends Fn,
    N extends keyof F["args"],
> = F["args"][N];

/**
 * The identity type-level function. Returns its first argument.
 * @since 0.1.0
 */
interface Identity extends Fn {
    readonly return: this["args"][0];
}

/**
 * A constant type-level function. Always returns `T` regardless of arguments.
 * @since 0.1.0
 */
interface Const<T> extends Fn {
    readonly return: T;
}

/**
 * Composes two type-level functions `F` and `G`.
 * `Compose<F, G><A>` is equivalent to `F<G<A>>`.
 * @since 0.1.0
 */
interface Compose<F extends Fn, G extends Fn> extends Fn {
    readonly return: $<F, $<G, this["args"][0]>>;
}

/**
 * Flips the order of the first two arguments of a type-level function `F`.
 * @since 0.1.0
 */
interface Flip<F extends Fn> extends Fn {
    readonly return: $$<
        F,
        this["args"][1],
        this["args"][0]
    >;
}

/**
 * Partially applies the first argument of a type-level function `F` with `A`.
 * @since 0.1.0
 */
interface Partial1<F extends Fn, A> extends Fn {
    readonly return: Apply<
        F,
        [
            A,
            ...this["args"],
        ]
    >;
}

export type {
    Fn,
    Apply,
    $,
    $$,
    $$$,
    Arg,
    Identity,
    Const,
    Compose,
    Flip,
    Partial1,
};
