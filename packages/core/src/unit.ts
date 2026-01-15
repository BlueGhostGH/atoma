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
const unit: Unit = {
    [BrandSymbol]: {
        Unit: "Unit",
    },
    [TypeIdSymbol]: TypeIdSymbol as TypeId<"Unit">,
    [UnitSymbol]: UnitSymbol,
} as Unit;

/**
 * Checks if a value is the `Unit` value.
 * @param u - The value to check.
 * @returns True if the value is `Unit`.
 * @since 0.1.0
 */
const isUnit = (u: unknown): u is Unit =>
    typeof u === "object" &&
    u !== null &&
    UnitSymbol in u &&
    (u as Unit)[UnitSymbol] === UnitSymbol;

export { UnitSymbol, unit, isUnit };
export type { Unit };
