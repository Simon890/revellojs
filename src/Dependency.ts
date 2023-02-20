/**
 * Notifies to its subscribers when its value changes.
 */
export class Dependency {

    protected subscribers!: Set<Function>;

    constructor() {
        this.subscribers = new Set();
    }

    /**
     * Subscribe a function.
     */
    public depend() {
        if(globalThis.activeEffect) this.subscribers.add(globalThis.activeEffect);
    }

    /**
     * Notifty subscriber of a dependency change.
     */
    public notify() {
        this.subscribers.forEach(sub => sub());
    }
}