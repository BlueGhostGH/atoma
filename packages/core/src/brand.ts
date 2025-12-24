/**
 * A unique symbol used to identify types at the type level.
 * @since 0.0.1
 */
const TypeIdSymbol: unique symbol = Symbol.for("atoma/TypeId");

/**
 * Represents a unique type identity branded with a name.
 * @since 0.0.1
 */
type TypeId<Name extends string> = typeof TypeIdSymbol & {
  readonly _name: Name;
};

/**
 * A string representing a runtime type identifier.
 * @since 0.0.1
 */
type RuntimeId = string;

/**
 * An interface that includes a phantom TypeId for branding.
 * @since 0.0.1
 */
interface Typed<Name extends string> {
  readonly [TypeIdSymbol]: TypeId<Name>;
}

/**
 * A unique symbol used for branding.
 * @since 0.0.1
 */
const BrandSymbol: unique symbol = Symbol.for("atoma/Brand");

/**
 * Represents a brand tag.
 * @since 0.0.1
 */
interface Brand<K extends string> {
  readonly [BrandSymbol]: {
    readonly [P in K]: P;
  };
}

/**
 * Combines a carrier type with a brand tag and a type identity.
 * @since 0.0.1
 */
type Branded<Carrier, Tag extends string> = Carrier & Brand<Tag> & Typed<Tag>;

export { TypeIdSymbol, BrandSymbol };
export type { TypeId, RuntimeId, Typed, Brand, Branded };
