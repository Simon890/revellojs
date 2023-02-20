import { Dependency } from "./Dependency";
import { VDom } from "./VDom";
import { ReactiveType } from "./types/ReactiveType";

export abstract class Component {
    public reactives : ReactiveType = {};
    private dependency!: Dependency;
    private vDom!: VDom;

    constructor(private initialState: ReactiveType) {
        this.reactives = this.initialState;
        this.dependency = new Dependency();
        this.reactivate();
    }

    private reactivate() {
        this.reactives = new Proxy(this.reactives, {
            get: (target, prop) => {
                this.dependency.depend();
                return target[prop as keyof ReactiveType];
            },
            set: (target, prop, newValue) => {
                const old = target[prop as keyof ReactiveType];
                target[prop as keyof ReactiveType] = newValue;
                if(old !== newValue) {
                    this.dependency.notify();
                }
                return true;
            }
        });
    }

    public getReactiveValue(key: string) {
        return this.reactives[key];
    }

    public notify(callback : Function) {
        callback();
    }

    abstract render() : string;

    public setVDom(vDom: VDom) {
        this.vDom = vDom;
    }
}