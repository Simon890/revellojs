import { Component } from "./Component";
import { VDom } from "./VDom";
import { NodeChildren } from "./types/NodeChildren";
import { NodeProps } from "./types/NodeProps";
import { VNode } from "./types/VNode";

export class Parser {
    private vDom!: VDom;
    private html!: Document;
    private htmlStr!: string;
    constructor(private component : Component) {
        this.htmlStr = this.component.render();
        this.vDom = new VDom();
        this.html = new DOMParser().parseFromString(this.htmlStr, "text/html");
    }

    public parse() {
        const {body} = this.html;
        if(body.children.length > 1) throw new Error("HTML template must have a root component");
        const child = body.children[0];
        return this.toVNode(child);
    }

    private toVNode(node : Node) : VNode {
        let vNodeChildren : NodeChildren = [];
        if(node.nodeType === node.TEXT_NODE) {
            return this.vDom.h("text", null, node.textContent!, this.component);
        } else {
            const htmlNode = <HTMLElement>node;
            for (let i = 0; i < node.childNodes.length; i++) {
                const child = node.childNodes[i];
                vNodeChildren.push(this.toVNode(child));
            }
            return this.vDom.h((htmlNode.tagName.toLowerCase() as keyof HTMLElementTagNameMap), this.getAttributes(htmlNode), vNodeChildren, this.component);
        }
    }

    private getAttributes(node : Element) {
        let attrs: NodeProps = {};
        for (let i = 0; i < node.attributes.length; i++) {
            const attr = node.attributes[i];
            attrs[attr.name] = attr.value;
        }
        return attrs;
    }

    // private replaceBrackets(node : Node) {
    //     const regEx = /\{\{(\s*)([a-zA-Z0-9]*)*(\s*)\}\}/;
    //     if(node.textContent) {
    //         node.textContent.replace(regEx, this.)
    //     }
    // }
}