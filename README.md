# typescript-throws
A small utility class for Typescript to wrap `throwable` values as return types. This is very similar to Haskell `maybe` and `either`. It is also similar to Rust's `Result` and `Option` return types.

## Usage
To create a safe-by-design function, simply change your return type from `<T>` to `Throws<T>` and call `Throws.apply(returnValue)` on your return values. Finally, replace all `throw new Error` instances with `Throws.apply(new Error)`.
```typescript
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
