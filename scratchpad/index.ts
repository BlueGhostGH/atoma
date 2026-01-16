import { Bool, Never, Trait, Unit } from "atoma";

// Example: Define a Show trait
interface ShowSignature {
    show: (self: unknown) => string;
}

const Show = Trait.makeTrait<"Show", ShowSignature>("Show");

// Example: Implement Show for a custom type
Trait.registerImpl(Show, "Number", {
    show: (self) => `Number(${self})`,
});

// Example: Use the trait
console.log(Trait.invoke(Show, "Number", "show", 42));

// Example: Unit type
console.log("Unit value:", Unit.unit);
console.log("Is Unit?", Unit.isUnit(Unit.unit));

// Example: `Never` type (`unreachable` can't be called since `Never` is uninhabited)
const handleNever = (n: Never.Never): string =>
    Never.unreachable(n);

// Example: Bool type
console.log("Bool.true:", Bool.true);
console.log("Bool.false:", Bool.false);
console.log("Bool.and(true, false):", Bool.and(Bool.true, Bool.false));
console.log("Bool.or(true, false):", Bool.or(Bool.true, Bool.false));
console.log("Bool.not(true):", Bool.not(Bool.true));
console.log("Bool.xor(true, true):", Bool.xor(Bool.true, Bool.true));
console.log("Bool.implies(true, false):", Bool.implies(Bool.true, Bool.false));
console.log(
    "Bool.match(true, ...):",
    Bool.match(
        Bool.true,
        () => "was true",
        () => "was false",
    ),
);
console.log("Bool.select(false, ...):", Bool.select(Bool.false, "yes", "no"));
console.log("Bool.whenTrue(true, 42):", Bool.whenTrue(Bool.true, 42));
console.log("Bool.whenFalse(true, 42):", Bool.whenFalse(Bool.true, 42));
