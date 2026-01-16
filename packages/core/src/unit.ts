import {
    type Brand,
    BrandSymbol,
    type TypeId,
    TypeIdSymbol,
} from "./brand";

/**
 * A unique symbol used to identify the `Unit` type.
 * @since 0.1.0
 */
const UnitSymbol: unique symbol = Symbol.for("atoma/Unit");

/**
 * The `Unit` type represents a single value, replacing `void`.
 * It is used when a computation completes successfully but produces no meaningful value.
 * @since 0.1.0
 */
interface Unit extends Brand<"Unit"> {
    readonly [TypeIdSymbol]: TypeId<"Unit">;
    readonly [UnitSymbol]: typeof UnitSymbol;
}

/**
 * The singleton `Unit` value.
 * @since 0.1.0
 */
/* NOTE: The cast is safe because we are constructing the branded `Unit` type
   with all required symbol properties. TypeScript cannot infer this automatically. */
// oxlint-disable-next-line no-unsafe-type-assertion
const unit: Unit = {
    [BrandSymbol]: {
        Unit: "Unit",
    },
    /* NOTE: Safe cast - `TypeIdSymbol` is the base symbol, `TypeId<"Unit">` is
       its branded version. We control both and they are structurally identical. */
    // oxlint-disable-next-line no-unsafe-type-assertion
    [TypeIdSymbol]: TypeIdSymbol as TypeId<"Unit">,
    [UnitSymbol]: UnitSymbol,
} as Unit;

/**
 * Checks if a value is the `Unit` value.
 * @param u - The value to check.
 * @returns True if the value is `Unit`.
 * @since 0.1.0
 */
const isUnit = (u: unknown): u is Unit => {
    if (
        typeof u === "object" &&
        u !== null &&
        UnitSymbol in u
    ) {
        /* NOTE: Safe cast - we've verified `u` is a non-null object containing
           `UnitSymbol`. TypeScript doesn't narrow based on symbol `in` checks. */
        // oxlint-disable-next-line no-unsafe-type-assertion
        const unitCandidate = u as Unit;
        return unitCandidate[UnitSymbol] === UnitSymbol;
    }
    return false;
};

export { UnitSymbol, unit, isUnit };
export type { Unit };
