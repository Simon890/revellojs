import { NotificationBridge } from "./NotificationBridge";
import { Attributes, ComponentDep, ComponentProps, Data } from "./types/ComponentProps";

export abstract class Component<D extends Data, A extends Attributes> {
    public readonly data!: D;
    public readonly attrs?: A;
    public readonly html!: string;
    public readonly components?: ComponentDep;
    private notifBridge!: NotificationBridge;

    constructor(private props: ComponentProps<D, A>) {
        this.notifBridge = NotificationBridge.getInstance();
        this.props = props;
        this.components = this.lowerComponentsKeys(this.props.components);
        this.data = new Proxy<D>(this.props.data, {
            get: (target, property) => {
                return target[property as keyof typeof target];
            },
            set: (target, property, newVal) => {
                let key = property as keyof typeof target;
                let old = target[key];
                target[key] = newVal;
                if(old !== newVal)
                    this.notifBridge.notifyChanges(this);
                return true;
            }
        });
        this.attrs = this.props.attrs;
        this.html = this.props.html;
    }

    private lowerComponentsKeys(components?: ComponentDep) {
        if(!components) return {};
        let obj : ComponentDep = {};
        (Object.keys(components) as Array<keyof typeof components>).forEach(key => {
            obj[String(key).toLowerCase()] = components![key];
        });
        return obj;
    }
}