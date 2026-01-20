import * as Bool from "./bool";
import * as Unit from "./unit";
import {
    type Brand,
    BrandSymbol,
    type TypeId,
    TypeIdSymbol,
} from "./brand";

/**
 * A unique symbol used to identify the `Bytes` type.
 * @since 0.1.0
 */
const BytesSymbol: unique symbol =
    Symbol.for("atoma/Bytes");

/**
 * The `Bytes` type represents a mutable byte buffer.
 * It is the idiomatic way to construct strings programmatically
 * and handle binary data.
 * @since 0.1.0
 */
interface Bytes extends Brand<"Bytes"> {
    readonly [TypeIdSymbol]: TypeId<"Bytes">;
    readonly [BytesSymbol]: typeof BytesSymbol;
    /** Internal buffer (buffer.length === capacity) */
    buffer: Uint8Array;
    /** Actual number of bytes stored (length <= capacity) */
    length: number;
}

/** Default initial capacity for empty buffers when they need to grow */
const DEFAULT_INITIAL_CAPACITY = 8;

/** Growth factor for buffer reallocation */
const GROWTH_FACTOR = 2;

/**
 * Creates a new Bytes instance with the given buffer and length.
 * @param buffer - The Uint8Array to use as the internal buffer.
 * @param length - The number of bytes actually stored.
 * @returns A new Bytes instance.
 * @internal
 */
/* NOTE: The cast is safe because we are constructing the branded `Bytes` type
   with all required symbol properties. TypeScript cannot infer this automatically. */
// oxlint-disable-next-line no-unsafe-type-assertion
const make = (buffer: Uint8Array, length: number): Bytes =>
    ({
        [BrandSymbol]: {
            Bytes: "Bytes",
        },
        /* NOTE: Safe cast - `TypeIdSymbol` is the base symbol, `TypeId<"Bytes">` is
           its branded version. We control both and they are structurally identical. */
        // oxlint-disable-next-line no-unsafe-type-assertion
        [TypeIdSymbol]: TypeIdSymbol as TypeId<"Bytes">,
        [BytesSymbol]: BytesSymbol,
        buffer,
        length,
    }) as Bytes;

/**
 * Checks if a value is a `Bytes`.
 * @param u - The value to check.
 * @returns `true` if the value is a `Bytes`, `false` otherwise.
 * @since 0.1.0
 */
const isBytes = (u: unknown): u is Bytes => {
    if (
        typeof u === "object" &&
        u !== null &&
        BytesSymbol in u
    ) {
        /* NOTE: Safe cast - we've verified `u` is a non-null object containing
           `BytesSymbol`. TypeScript doesn't narrow based on symbol `in` checks. */
        // oxlint-disable-next-line no-unsafe-type-assertion
        const candidate = u as Bytes;
        return candidate[BytesSymbol] === BytesSymbol;
    }
    return false;
};

// =============================================================================
// Construction
// =============================================================================

/**
 * Creates an empty `Bytes` buffer with zero capacity.
 * @returns A new empty `Bytes` instance.
 * @since 0.1.0
 */
// TODO(Default): Implement as `impl Default for Bytes` once the Default trait exists.
const empty = (): Bytes => make(new Uint8Array(0), 0);

/**
 * Creates an empty `Bytes` buffer with pre-allocated capacity.
 * @param capacity - The initial capacity to allocate.
 * @returns A new `Bytes` instance with the specified capacity.
 * @since 0.1.0
 */
// TODO(Int): Change `capacity` parameter type to `Int` when Int is implemented.
const withCapacity = (capacity: number): Bytes =>
    make(new Uint8Array(capacity), 0);

/**
 * Creates a `Bytes` from a JavaScript Uint8Array by copying its contents.
 * @param arr - The JavaScript Uint8Array to copy from.
 * @returns A new `Bytes` instance containing a copy of the array data.
 * @since 0.1.0
 */
// TODO(From): Implement as `impl From<JS.Uint8Array> for Bytes` once the From trait exists.
const from = (arr: Uint8Array): Bytes => {
    const buffer = new Uint8Array(arr.length);
    buffer.set(arr);
    return make(buffer, arr.length);
};

/** Cached TextEncoder instance for UTF-8 encoding */
/* NOTE: TextEncoder is a standard Web API available in all modern browsers and Node.js.
   The linter may not recognize it as a global because it's not in the default ES environment. */
// oxlint-disable-next-line no-undef
const textEncoder = new TextEncoder();

/**
 * Creates a `Bytes` from a String by UTF-8 encoding it.
 * @param s - The String to encode.
 * @returns A new `Bytes` instance containing the UTF-8 encoded bytes.
 * @since 0.1.0
 */
// TODO(From): Implement as `impl From<String> for Bytes` once the From trait exists.
// NOTE: This takes a branded String type once String is exported. For now, uses native string.
const fromString = (s: string): Bytes => {
    const encoded = textEncoder.encode(s);
    return make(encoded, encoded.length);
};

// =============================================================================
// Internal Helpers
// =============================================================================

/**
 * Ensures the buffer has capacity for at least `needed` more bytes.
 * Reallocates with exponential growth if necessary.
 * @param b - The Bytes buffer to potentially grow.
 * @param needed - The number of additional bytes needed.
 * @internal
 */
const ensureCapacity = (b: Bytes, needed: number): void => {
    const required = b.length + needed;
    if (required > b.buffer.length) {
        const newCapacity = Math.max(
            required,
            b.buffer.length * GROWTH_FACTOR,
            DEFAULT_INITIAL_CAPACITY,
        );
        const newBuffer = new Uint8Array(newCapacity);
        newBuffer.set(b.buffer.subarray(0, b.length));
        b.buffer = newBuffer;
    }
};

// =============================================================================
// Mutation
// =============================================================================

/**
 * Appends a single byte to the buffer.
 * @param b - The `Bytes` buffer to modify.
 * @param byte - The byte value to append (0-255).
 * @returns `Unit`.
 * @since 0.1.0
 */
// TODO(U8): Change `byte` parameter type to `U8` when U8 is implemented.
// TODO(Extend): This method should be part of `impl Extend<U8> for Bytes` once Extend trait exists.
const push = (b: Bytes, byte: number): Unit.Unit => {
    ensureCapacity(b, 1);
    b.buffer[b.length] = byte;
    b.length += 1;
    return Unit.unit;
};

/**
 * Appends all bytes from another `Bytes` buffer.
 * @param b - The `Bytes` buffer to modify.
 * @param other - The `Bytes` buffer to append from.
 * @returns `Unit`.
 * @since 0.1.0
 */
// TODO(Extend): This method should be part of `impl Extend<Bytes> for Bytes` once Extend trait exists.
const pushAll = (b: Bytes, other: Bytes): Unit.Unit => {
    ensureCapacity(b, other.length);
    b.buffer.set(
        other.buffer.subarray(0, other.length),
        b.length,
    );
    b.length += other.length;
    return Unit.unit;
};

/**
 * Appends a UTF-8 encoded string to the buffer.
 * @param b - The `Bytes` buffer to modify.
 * @param s - The string to append.
 * @returns `Unit`.
 * @since 0.1.0
 */
// TODO(Extend): This method should be part of `impl Extend<String> for Bytes` once Extend trait exists.
// NOTE: This takes a branded String type once String is exported. For now, uses native string.
const pushString = (b: Bytes, s: string): Unit.Unit => {
    const encoded = textEncoder.encode(s);
    ensureCapacity(b, encoded.length);
    b.buffer.set(encoded, b.length);
    b.length += encoded.length;
    return Unit.unit;
};

/**
 * Clears all bytes from the buffer, keeping the capacity.
 * @param b - The `Bytes` buffer to clear.
 * @returns `Unit`.
 * @since 0.1.0
 */
const clear = (b: Bytes): Unit.Unit => {
    b.length = 0;
    return Unit.unit;
};

/**
 * Sets the byte at the given index.
 * @param b - The `Bytes` buffer to modify.
 * @param index - The index at which to set the byte.
 * @param value - The byte value to set (0-255).
 * @returns `Unit`.
 * @since 0.1.0
 */
// TODO(Int): Change `index` parameter type to `Int` when Int is implemented.
// TODO(U8): Change `value` parameter type to `U8` when U8 is implemented.
// TODO(Result): Return `Result<Unit, IndexOutOfBounds>` for bounds checking.
const set = (
    b: Bytes,
    index: number,
    value: number,
): Unit.Unit => {
    if (index >= 0 && index < b.length) {
        b.buffer[index] = value;
    }
    return Unit.unit;
};

// =============================================================================
// Reading
// =============================================================================

/**
 * Returns the number of bytes stored in the buffer.
 * @param b - The `Bytes` buffer to measure.
 * @returns The length of stored bytes.
 * @since 0.1.0
 */
// TODO(Int): Change return type to `Int` when Int is implemented.
const length = (b: Bytes): number => b.length;

/**
 * Returns the current capacity of the buffer.
 * @param b - The `Bytes` buffer to measure.
 * @returns The capacity (total allocated space).
 * @since 0.1.0
 */
// TODO(Int): Change return type to `Int` when Int is implemented.
const capacity = (b: Bytes): number => b.buffer.length;

/**
 * Returns the byte at the given index, or `undefined` if out of bounds.
 * @param b - The `Bytes` buffer to index into.
 * @param index - The index (0-based).
 * @returns The byte value, or `undefined` if out of bounds.
 * @since 0.1.0
 */
// TODO(Int): Change `index` parameter type to `Int` when Int is implemented.
// TODO(U8): Change return type to include `U8` when U8 is implemented.
// TODO(Option): Change return type to `Option<U8>` when Option is implemented.
const at = (
    b: Bytes,
    index: number,
): number | undefined => {
    if (index >= 0 && index < b.length) {
        return b.buffer[index];
    }
    // oxlint-disable-next-line no-undefined
    return undefined;
};

/**
 * Checks if the buffer is empty.
 * @param b - The `Bytes` buffer to check.
 * @returns `Bool.true` if the buffer is empty, `Bool.false` otherwise.
 * @since 0.1.0
 */
const isEmpty = (b: Bytes): Bool.Bool => {
    if (b.length === 0) {
        return Bool.true;
    }
    return Bool.false;
};

/**
 * Returns a new `Bytes` containing a copy of bytes from start to end.
 * @param b - The `Bytes` buffer to slice.
 * @param start - The start index (inclusive).
 * @param end - The end index (exclusive). Defaults to length.
 * @returns A new `Bytes` instance containing the slice.
 * @since 0.1.0
 */
// TODO(Int): Change `start` and `end` parameter types to `Int` when Int is implemented.
/* NOTE: This returns a copy, not a view, because Bytes is mutable with a growable buffer.
   If we returned a view (via Uint8Array.subarray), and the original buffer reallocated
   during growth, the view would point to stale data. For a view-based API, consider using
   the underlying Uint8Array directly via `toJS` when the buffer is known to be stable. */
const slice = (
    b: Bytes,
    start: number,
    end?: number,
): Bytes => {
    const actualEnd = end ?? b.length;
    const clampedStart = Math.max(
        0,
        Math.min(start, b.length),
    );
    const clampedEnd = Math.max(
        clampedStart,
        Math.min(actualEnd, b.length),
    );
    const sliceLength = clampedEnd - clampedStart;
    const buffer = new Uint8Array(sliceLength);
    buffer.set(b.buffer.subarray(clampedStart, clampedEnd));
    return make(buffer, sliceLength);
};

// =============================================================================
// JS Interop & Utilities
// =============================================================================

/**
 * Converts the `Bytes` to a JavaScript Uint8Array (copy).
 * The returned array contains only the stored bytes (length, not capacity).
 * @param b - The `Bytes` to convert.
 * @returns A new Uint8Array containing the stored bytes.
 * @since 0.1.0
 */
// TODO(From): Implement as `impl From<Bytes> for JS.Uint8Array` once the From trait exists.
const toJS = (b: Bytes): Uint8Array => {
    const result = new Uint8Array(b.length);
    result.set(b.buffer.subarray(0, b.length));
    return result;
};

/**
 * Creates a deep copy of a `Bytes` buffer.
 * @param b - The `Bytes` to clone.
 * @returns A new `Bytes` instance with the same content.
 * @since 0.1.0
 */
// TODO(Clone): Implement as `impl Clone for Bytes` once the Clone trait exists.
const clone = (b: Bytes): Bytes => {
    const buffer = new Uint8Array(b.buffer.length);
    buffer.set(b.buffer.subarray(0, b.length));
    return make(buffer, b.length);
};

/**
 * Compares two `Bytes` buffers for equality (byte-by-byte).
 * @param self - The first `Bytes` buffer.
 * @param other - The second `Bytes` buffer.
 * @returns `Bool.true` if equal, `Bool.false` otherwise.
 * @since 0.1.0
 */
// TODO(PartialEq): Implement as `impl PartialEq for Bytes` once the PartialEq trait exists.
const equals = (self: Bytes, other: Bytes): Bool.Bool => {
    if (self.length !== other.length) {
        return Bool.false;
    }
    for (let i = 0; i < self.length; i += 1) {
        if (self.buffer[i] !== other.buffer[i]) {
            return Bool.false;
        }
    }
    return Bool.true;
};

// TODO(Iterator): Add `iter` function once Iterator is implemented.
// oxlint-disable-next-line capitalized-comments
// iter: (b: Bytes) => Iterator<U8>

export {
    BytesSymbol,
    isBytes,
    empty,
    withCapacity,
    from,
    fromString,
    push,
    pushAll,
    pushString,
    clear,
    set,
    length,
    capacity,
    at,
    isEmpty,
    slice,
    toJS,
    clone,
    equals,
};
export type { Bytes };
