export declare global {
    declare module globalThis {
        var activeEffect : Function | null;
    }
}