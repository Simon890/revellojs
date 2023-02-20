/**
 * Notifies to its subscribers when its value changes.
 */
export class Dependency<T> {

    private val!: T;
    protected subscribers!: Set<Function>;

    constructor(value: T) {
        this.val = value;
        this.subscribers = new Set();
    }

    /**
     * Subscribe a function.
     */
    private depend() {
        if(globalThis.activeEffect) this.subscribers.add(globalThis.activeEffect);
    }

    /**
     * Notifty subscriber of a dependency change.
     */
    private notify() {
        this.subscribers.forEach(sub => sub());
    }

    get value() {
        this.depend();
        return this.val;
    }

    set value(newValue : T) {
        this.val = newValue;
        this.notify();
    }
}