import test from 'ava';
import { Throws } from './throws.js';
class DivideByZeroError extends Error {
    constructor(message) {
        super(message);
        this.name = "DivideByZero";
    }
}
function divide(a, b) {
    if (b === 0) {
        return Throws.pure(new DivideByZeroError("Argument b is 0"));
    }
    return Throws.pure(a / b);
}
// Curried
function divBy(b) {
    return (a) => divide(a, b);
}
test('Object values', t => {
    t.deepEqual(divide(5, 4), Throws.pure(1.25));
    t.deepEqual(divide(3, 0), Throws.pure(new DivideByZeroError("Argument b is 0")));
});
test('Optional values', t => {
    t.deepEqual(divide(5, 4).optional(), 5 / 4);
    t.deepEqual(divide(3, 0).optional(), null);
});
test('Chaining (bind many)', t => {
    t.deepEqual(divide(5, 4).bindMany(divide)(4).optional(), (5 / 4) / 4);
    t.deepEqual(divide(5, 0).bindMany(divide)(4).optional(), null);
});
test('Bind Chain', t => {
    t.deepEqual(divide(50, 1).bind(divBy(2)).bind(divBy(2)).bind(divBy(.5)).optional(), 25);
    t.deepEqual(divide(50, 0).bind(divBy(2)).bind(divBy(2)).bind(divBy(.5)).optional(), null);
});
test('Unwrap', t => {
    t.deepEqual(divide(5, 4).unwrap(), 1.25);
    t.throws(() => divide(3, 0).unwrap());
});
test('Should Throws', t => {
    t.false(divide(5, 4).shouldThrow());
    t.true(divide(3, 0).shouldThrow());
});
