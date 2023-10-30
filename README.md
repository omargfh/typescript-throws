# typescript-throws
A small utility class for Typescript to wrap `throwable` values as return types. This is very similar to Haskell `maybe` and `either`. It is also similar to Rust's `Result` and `Option` return types.

![Coverage](https://img.shields.io/badge/coverage-100%25-green)
![Build](https://img.shields.io/badge/build-passing-green)
![Version 1.01](https://img.shields.io/badge/version-1.01-blue)

## Usage
To create a safe-by-design function, simply change your return type from `<T>` to `Throws<T>` and call `Throws.pure(returnValue)` on your return values. Finally, replace all `throw new Error` instances with `Throws.pure(new Error)`.
```typescript
class DivideByZeroError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "DivideByZero"
    }
}
function divide(a: number, b: number): Throws<number> {
    if (b === 0) {
        return Throws.pure(new DivideByZeroError("Argument b is 0"));
    }
    return Throws.pure(a / b);
}
```

### Opaque types
```typescript
divide(5, 4) //  Throws: { "value": 1.25 }
```
```typescript
divide(3, 0) //  Throws: { "value": { "name" : ... } }
```

### Optional values
```typescript
divide(5, 4).optional() // 1.25
```
```typescript
divide(3, 0).optional() // null
```

### Curried Bindings
```typescript
// Curried
function divBy(b: number) {
    return (a: number) => divide(a, b)
}
divide(50,1).bind(divBy(2)).bind(divBy(2)).bind(divBy(.5)).optional() // 25
divide(50,0).bind(divBy(2)).bind(divBy(2)).bind(divBy(.5)).shouldThrow() // true
divide(50,0).bind(divBy(2)).bind(divBy(2)).bind(divBy(.5)).unwrap() // DivideByZeroError: Argument b is 0
```

### Many-way Bindings
```typescript
divide(5,4).bindMany(divide)(4).optional() // 0.3125
divide(5,0).bindMany(divide)(4).optional() // null
```

### Dangerous Unwrap
```typescript
divide(5, 4).unwrap() // 1.25
divide(3, 0).unwrap() // DivideByZeroError: Argument b is 0
```
## Language
`pure` and `bind` come from the `Haskell Standard Library` `Monad` and `Applicative` interfaces.
