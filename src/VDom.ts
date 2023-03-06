import { HTMLAttributes } from "./types/HTMLAttributes";
import { HTMLTag } from "./types/HTMLTag";
import { Children, VNode } from "./types/VNode";

export class VDom {

    createElement(tag : HTMLTag, attributes : HTMLAttributes, children?: Children) : VNode {
        const el = document.createElement(tag);
        Object.keys(attributes).forEach(key => {
            if(key.startsWith("on")) {
                let func = attributes[key];
                if(typeof func === "string") {
                    func = Function(func);
                }
                (el as HTMLElement).addEventListener(key.replace("on", ""), func);
            } else {
                (el as HTMLElement).setAttribute(key, attributes[key]);
            }
        });
        return {
            tag,
            attributes,
            el,
            children: children ?? []
        }
    }

    init(element: HTMLElement, node: VNode | string) {
        if(typeof node === "string") {
            element.appendChild(document.createTextNode(node));
        } else {
            element.appendChild(node.el);
            // if(typeof node.children === "string") {
            //     node.el.appendChild(document.createTextNode(node.children));
            // } else {
            // }
            for (let i = 0; i < node.children.length; i++) {
                const child = node.children[i];
                this.init(node.el, child);
            }
        }
    }

    update(vNode: VNode) {
        vNode.el.textContent = "";
        // if(typeof vNode.children === "string") {
        //     vNode.el.append(document.createTextNode(vNode.children));
        // } else {
        // }
        vNode.children.forEach(child => {
            if(typeof child !== "string") {
                console.log("CHILD", child.el)
                // vNode.el.appendChild(child.el);
                // console.log("CHILD INSIDE FOR", child)
                // child.el.textContent = child.el.textContent + "CHANGED";
            }
            // child.textContent = vNode.el.textContent;
            // this.init(vNode.el, child);
        });
    }

}