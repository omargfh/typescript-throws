export class Throws {
    constructor(value) {
        this.value = value;
    }
    static pure(value) {
        if (value instanceof Error) {
            return new Throws(value); // T will take on value of return type
        }
        return new Throws(value);
    }
    unwrap() {
        if (this.value instanceof Error) {
            throw this.value;
        }
        else {
            return this.value;
        }
    }
    optional() {
        if (this.value instanceof Error) {
            return null;
        }
        return this.value;
    }
    shouldThrow() {
        return this.value instanceof Error;
    }
    bind(fn) {
        const optionalValue = this.optional();
        if (optionalValue) {
            return fn(optionalValue);
        }
        else {
            return Throws.pure(this.value);
        }
    }
    bindMany(fn, ...args) {
        const optionalValue = this.optional();
        if (optionalValue) {
            return (...args) => {
                return fn(optionalValue, ...args);
            };
        }
        else {
            return (...args) => {
                return Throws.pure(this.value);
            };
        }
    }
}
