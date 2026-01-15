// oxlint-disable-next-line no-import-type-side-effects
import {
    type Brand,
    type TypeId,
    type TypeIdSymbol,
} from "./brand";

/**
 * A unique symbol used to identify the `Never` type.
 * @since 0.1.0
 */
const NeverSymbol: unique symbol =
    Symbol.for("atoma/Never");

/**
 * The `Never` type is uninhabited - no values of this type exist.
 * It represents computations that never complete or impossible code paths.
 * @since 0.1.0
 */
interface Never extends Brand<"Never"> {
    readonly [TypeIdSymbol]: TypeId<"Never">;
    readonly [NeverSymbol]: typeof NeverSymbol;
}

/**
 * A function that handles a value of type `Never`.
 * Since `Never` is uninhabited, this function can never actually be called.
 * It is useful for exhaustiveness checking in pattern matching.
 * @param _never - A value of type `Never` (which cannot exist).
 * @returns Any type A, since this code is unreachable.
 * @since 0.1.0
 */
const absurd = <A>(_never: Never): A => {
    throw new Error("absurd: Never value encountered");
};

/**
 * Checks if a value is of type `Never`.
 * This always returns false since `Never` is uninhabited.
 * @param _value - The value to check.
 * @returns Always false.
 * @since 0.1.0
 */
const isNever = (_value: unknown): _value is Never => false;

export { NeverSymbol, absurd, isNever };
export type { Never };
