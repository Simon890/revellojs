import { VDom } from "./VDom";
import { HTMLAttributes } from "./types/HTMLAttributes";
import { HTMLTag } from "./types/HTMLTag";
import { VNode } from "./types/VNode";

export class Parser {

    private htmlDom: Document;
    private vDom!: VDom;

    constructor(private htmlStr: string) {
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
        return vNodes;
    }

    private genVNodeRecursive(element: HTMLElement) : VNode | null | string {
        const isText = element instanceof Text;
        if(isText) {
            if(element.textContent?.trim().length == 0) return null;
            return String(element.textContent?.trim());
        }
        
        const childElements = Object.values(element.childNodes) as HTMLElement[];
        let childElementsVNode : Array<VNode | string> = [];
        childElements.forEach(child => {
            const vNodeChild = this.genVNodeRecursive(child);
            if(vNodeChild) childElementsVNode.push(vNodeChild);
        });
        return this.vDom.createElement(this.getTag(element), this.getAttributes(element), childElementsVNode);
        // return {
        //     el: this.vDom.createElement(),
        //     children: isText ? element.textContent! : childElementsVNode,
        //     attributes: this.getAttributes(element),
        //     tag: this.getTag(element)
        // };
    }

    private getAttributes(node : HTMLElement) : HTMLAttributes {
        if(node instanceof Text) return {};
        let attrs : HTMLAttributes = {};
        for (let i = 0; i < node.attributes.length; i++) {
            const attr = node.attributes[i];
            attrs[attr.name] = attr.value
        }
        return attrs;
    }

    private getTag(element: HTMLElement) : HTMLTag {
        return element.tagName.toLowerCase() as HTMLTag;
    }
}