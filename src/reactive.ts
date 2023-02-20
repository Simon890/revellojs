import { Dependency } from "./Dependency";

export function reactive<T extends object>(obj: T) : T {
    (Object.keys(obj) as (keyof typeof obj)[]).forEach((key) => {
        const dep = new Dependency();
        let value = obj[key];
        Object.defineProperty(obj, key, {
            get() {
                dep.depend();
                return value;
            },
            set(newValue) {
                if(newValue !== value) {
                    value = newValue;
                    dep.notify();
                }
            }
        })
    });
    return obj;
}