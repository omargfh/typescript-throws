class Throws<T> {
    private value: T | Error;
    constructor(value: T | Error) {
        this.value = value
    }
    static apply<T>(value: T | Error) {
        if (value instanceof Error) {
            return new Throws<any>(value); // T will take on value of return type
        }
        return new Throws<any>(value);
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
            return Throws.apply(this.value);
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
                return Throws.apply(this.value)
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
console.log(divide(5, 4)) //  Throws: { "value": 1.25 }
console.log(divide(3, 0)) //  Throws: { "value": { "name" : ... } } 

// Optional
console.log("=============================")
console.log("Optional Values")
console.log(divide(5, 4).optional()) // 1.25
console.log(divide(3, 0).optional()) // null

// Chaining (bind many)
console.log(`Chained: ${divide(5,4).bindMany(divide)(4).optional()}`)  // Chained: 0.3125
console.log(`Chained: ${divide(5,0).bindMany(divide)(4).optional()}`) // Chained: null

// Chaining (bind)
console.log(`Bind Chain: ${divide(50,1).bind(divBy(2)).bind(divBy(2)).bind(divBy(.5)).optional()}`) // Bind Chain: 25
console.log(`Bind Chain: ${divide(50,0).bind(divBy(2)).bind(divBy(2)).bind(divBy(.5)).optional()}`) // Bind Chain: null

// Unwrap
console.log("=============================")
console.log("Unwrap")
console.log(divide(5, 4).unwrap()) // 1.25
console.log(divide(3, 0).unwrap()) // DivideByZeroError: Argument b is 0
