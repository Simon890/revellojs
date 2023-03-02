import { ComponentProps, Data } from "./types/ComponentProps";

export abstract class Component<D extends Data> {
    protected data!: D;
    public readonly html!: string;
    constructor(private props: ComponentProps<D>) {
        this.props = props;
        this.data = new Proxy<D>(this.props.data, {
            get(target, property) {
                return target[property as keyof typeof target];
            },
            set(target, property, newVal) {
                console.log("Render...")
                target[property as keyof typeof target] = newVal;
                return true;
            }
        });
        this.html = this.props.html;
    }
}