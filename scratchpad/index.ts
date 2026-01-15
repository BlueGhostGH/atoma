import { Never, Trait, Unit } from "atoma";

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

// Example: Never type (absurd can't be called since Never is uninhabited)
const handleNever = (n: Never.Never): string =>
    Never.absurd(n);
