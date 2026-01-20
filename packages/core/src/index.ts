// =============================================================================
// Data Types (namespace exports)
// =============================================================================

export * as Unit from "./unit";
export * as Never from "./never";
export * as Bool from "./bool";
export * as Bytes from "./bytes";

// =============================================================================
// Utilities (individual exports)
// =============================================================================

// Brand utilities
export { BrandSymbol, TypeIdSymbol } from "./brand";
export type {
    Brand,
    Branded,
    RuntimeId,
    TypeId,
    Typed,
} from "./brand";

// HKT (Higher-Kinded Types) utilities
export type {
    $,
    $$,
    $$$,
    Apply,
    Arg,
    Compose,
    Const,
    Flip,
    Fn,
    Identity,
    Partial1,
} from "./hkt";

// Trait utilities
export {
    getBound,
    getImpl,
    getTypeName,
    hasImpl,
    invoke,
    makeDeriver,
    makeInvoker,
    makeTrait,
    registerImpl,
} from "./trait";
export type {
    Bound,
    Bounds,
    Deriver,
    ImplFor,
    ImplRegistry,
    Implements,
    MethodParams,
    MethodParamsWithoutSelf,
    MethodReturn,
    Trait,
    TraitKey,
    TypeStructure,
} from "./trait";
