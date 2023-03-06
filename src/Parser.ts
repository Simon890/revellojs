import { Component } from "./Component";
import { NotificationBridge } from "./NotificationBridge";
import { VDom } from "./VDom";
import { Attributes, ComponentDep, Data } from "./types/ComponentProps";
import { HTMLAttributes } from "./types/HTMLAttributes";
import { HTMLTag } from "./types/HTMLTag";
import { Children, VNode, VNodeParser } from "./types/VNode";

export class Parser {

    private htmlDom: Document;
    private vDom!: VDom;
    private htmlStr: string;
    // private notifBridge!: NotificationBridge;

    constructor(private component: Component<Data, Attributes>) {
        // this.notifBridge = NotificationBridge.getInstance();
        this.htmlStr = component.html;
        this.htmlDom = new DOMParser().parseFromString(this.htmlStr, "text/html");
        this.vDom = new VDom();
        if(this.htmlDom.querySelector("parsererror")) throw new Error("Bad syntax in html template");
    }

    toVNode() : VNode | string  {
        const body = this.htmlDom.querySelector("body")!;
        const childElements = Object.values(body.childNodes) as HTMLElement[];
        if(childElements.length > 1) throw new Error("Must have one root component");
        const child = childElements[0];
        const vNodes = this.genVNodeRecursive(child);
        if(vNodes === null) throw new Error("");
        if(typeof vNodes === "string") return vNodes;
        vNodes.parser = this;
        return this.bindValues(vNodes);
    }

    private genVNodeRecursive(element: HTMLElement) : VNode | null | string {
        const isText = element instanceof Text;
        if(isText) {
            if(element.textContent?.trim().length == 0) return null;
            return String(element.textContent?.trim());
        }
        if(this.isComponent(element)) {
            const component = new this.component.components![this.getTag(element) as keyof ComponentDep]();
            const parser = new Parser(component);
            return parser.toVNode();
        }
        const childElements = Object.values(element.childNodes) as HTMLElement[];
        let childElementsVNode : Array<VNode | string> = [];
        childElements.forEach(child => {
            const vNodeChild = this.genVNodeRecursive(child);
            if(vNodeChild) childElementsVNode.push(vNodeChild);
        });
        return this.vDom.createElement(this.getTag(element), this.getAttributes(element), childElementsVNode);
    }

    private getAttributes(node : HTMLElement) : HTMLAttributes {
        if(node instanceof Text) return {};
        let attrs : HTMLAttributes = {};
        for (let i = 0; i < node.attributes.length; i++) {
            let name = node.attributes[i].name;
            let value: string | Function = node.attributes[i].value;
            let funcName: string;
            
            if(name.startsWith("on")) {
                if(!(value in this.component)) throw new Error(`Function ${value} does not exists in ${this.component}`);
                const f = this.component[value as keyof typeof this.component] as unknown;
                if(typeof f === "function") {
                    funcName = value;
                    value = (e: unknown) => {
                        (this.component[funcName as keyof typeof this.component] as unknown as Function)(e);
                    }
                }
            }
            attrs[name] = value;
        }
        return attrs;
    }

    private getTag(element: HTMLElement) : HTMLTag {
        return element.tagName.toLowerCase() as HTMLTag;
    }

    private isComponent(element: HTMLElement) {
        if(!this.component.components) return false;
        return this.getTag(element) in this.component.components;
    }

    public getComponent() {
        return this.component;
    }

    // private bindValues(element : HTMLElement) : HTMLElement {
    //     return element
    //     // const regEx = /(?<=\{\{(\s*))([a-zA-Z0-9]*)*(?=(\s*)\}\})/g;
    //     // const text = String(element.textContent);
    //     // const match = text.match(regEx);
    //     // if(match) {
    //     //     let call = () => {
    //     //         let str = "";
    //     //         match.forEach(value => {
    //     //             if(value in this.component.data) {
    //     //                 str = text.replace(new RegExp("\\{\\{(\\s*)[a-zA-Z0-9]*" + value + "(\\s*)\\}\\}"), this.component.data[value]);
    //     //             }
    //     //         });
    //     //         return str;
    //     //     }
    //     //     const proxy = new Proxy<HTMLElement>(element, {
    //     //         get(target, property) {
    //     //             if(property === "textContent") {
    //     //                 console.log("CALL", target, call());
    //     //                 return call();
    //     //             }
    //     //             return target[property as keyof typeof target];
    //     //         }
    //     //     });
    //     //     console.log(proxy, element);
    //     //     return proxy;
    //     // }
    //     // return element;
    // }

    private bindValues(vNode : VNode) {
        const newVnode = vNode;
        for (let i = 0; i < newVnode.children.length; i++) {
            const child = newVnode.children[i];
            if(typeof child !== "string") newVnode.children[i] = this.bindValues(child);
        }
        return this.proxyNode(vNode);
    }

    private proxyNode(vNode: VNode) {
        const regEx = /(?<=\{\{(\s*))([a-zA-Z0-9]*)*(?=(\s*)\}\})/g;
        const {children} = vNode;
        return new Proxy<VNode>(vNode, {
            get: (target, prop) => {
                const key = prop as keyof typeof target;
                if(prop !== "children") return target[key];
                let arr: Children = [];
                for (const child of children) {
                    if(typeof child === "string") {
                        const match = child.match(regEx);
                        if(match) {
                            let str = child;
                            match.forEach(value => {
                                if(value in this.component.data) {
                                    str = str.replace(new RegExp("\\{\\{(\\s*)[a-zA-Z0-9]*" + value + "(\\s*)\\}\\}"), this.component.data[value]);
                                }
                            });
                            arr.push(str);
                        } else {
                            arr.push(child);
                        }
                    } else {
                        arr.push(child);
                    }
                }
                return arr;
            }
        })
    }
}