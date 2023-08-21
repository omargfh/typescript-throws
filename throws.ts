class Throws<T> {
    private value: T | Error;
    constructor(value: T | Error) {
        this.value = value
    }
    static apply<T>(value: T | Error) {
        if (value instanceof Error) {
            return new Throws<any>(value); // T will take on value of return type
        }
        return new Throws<T>(value);
    }
    unwrap(): T | Error {
        if (this.value instanceof Error) {
            throw this.value;
        } else {
            return this.value;
        }
    }
    optional(): T | null {
        if (this.value instanceof Error) {
            return null
        }
        return this.value;
    }
    bind(fn: ((input: NonNullable<T>) => Throws<T>)) {
        const optionalValue = this.optional();
        if (optionalValue) {
            return fn(optionalValue as NonNullable<T>);
        } else {
            return Throws.apply(null);
        }
    }
    bindMany<T>(fn: (input: NonNullable<T>, ...args: any[]) => Throws<T>, ...args: any[]) {
        const optionalValue = this.optional();
        if (optionalValue) {
            return (...args: any[]) => {
                return fn(optionalValue as unknown as NonNullable<T>, ...args)
            }
        } else {
            return (...args: any[]) => {
                return Throws.apply(null)
            }
        }
    }
}

class DivideByZeroError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "DivideByZero"
    }
}
function divide(a: number, b: number): Throws<number> {
    if (b === 0) {
        return Throws.apply(new DivideByZeroError("Argument b is 0"));
    }
    return Throws.apply(a / b);
}

// Curried
function divBy(b: number) {
    return (a: number) => divide(a, b)
}

// Object value
console.log("Object values")
console.log(divide(5, 4))
console.log(divide(3, 0))

// Optional
console.log("=============================")
console.log("Optional Values")
console.log(divide(5, 4).optional())
console.log(divide(3, 0).optional())

// Chaining (bind many)
console.log(`Chained: ${divide(5,4).bindMany(divide)(4).optional()}`)
console.log(`Chained: ${divide(5,0).bindMany(divide)(4).optional()}`)

// Chaining (bind)
console.log(`Bind Chain: ${divide(50,1).bind(divBy(2)).bind(divBy(2)).bind(divBy(.5)).optional()}`)
console.log(`Bind Chain: ${divide(50,0).bind(divBy(2)).bind(divBy(2)).bind(divBy(.5)).optional()}`)

// Unwrap
console.log("=============================")
console.log("Unwrap")
console.log(divide(5, 4).unwrap())
console.log(divide(3, 0).unwrap()) // Will throw
