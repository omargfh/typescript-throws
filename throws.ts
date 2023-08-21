/*   
 *   Omar Ibrahim
 *       github.com/omargfh
 *       www.omar-ibrahim.com
 *   University of Chicago
 * */

class Throws<T> {
    private value: T | Error;
    constructor(value: T | Error) {
        this.value = value
    }
    static apply<T>(value: T | Error) {
        if (value instanceof Error) {
            return new Throws<any>(value); // T will take on value of return type
        }
        return new Throws<any>(value); // T will take on value of return type. Use the constructor for predefined T.
    }
    unwrap(): T | Error {
        if (this.value instanceof Error) {
            throw this.value;
        } else {
            return this.value;
        }
    }
    optional(): T | Error | null {
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
            return (...args: any[]) {
                return Throws.apply(null)
            }
        }
    }
}

// Example
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
    return Throws.apply<number>(a / b);
}

// Object value
console.log("Object values")
console.log(divide(5, 4))    // Throws {value: 1.25}
console.log(divide(3, 0))    // Throws {value: DivideByZeroError {...}}

// Optional
console.log("=============================")
console.log("Optional Values")
console.log(divide(5, 4).optional())             // 1.25
console.log(divide(3, 0).optional())             // null

// Chaining
console.log(`Chained: ${divide(5,4).bindMany(divide)(4).optional()}`)          // Chained: 0.3125
console.log(`Chained: ${divide(5,0).bindMany(divide)(4).optional()}`)          // Chained: null

// Unwrap
console.log("=============================")
console.log("Unwrap")
console.log(divide(5, 4).unwrap()) // 1.24
console.log(divide(3, 0).unwrap()) // Throws new exception: DivideByZero: Argument b is 0
