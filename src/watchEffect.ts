export function watchEffect(fn: Function) {
    globalThis.activeEffect = fn;
    fn();
    globalThis.activeEffect = null;
}