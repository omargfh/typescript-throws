export declare class Throws<T> {
    private value;
    constructor(value: T | Error);
    static pure<T>(value: T | Error): Throws<any>;
    unwrap(): T | Error;
    optional(): T | null;
    shouldThrow(): boolean;
    bind(fn: ((input: NonNullable<T>) => Throws<T>)): Throws<any>;
    bindMany<T>(fn: (input: NonNullable<T>, ...args: any[]) => Throws<T>, ...args: any[]): (...args: any[]) => Throws<T>;
}
