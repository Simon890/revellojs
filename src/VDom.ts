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
            if(typeof node.children === "string") {
                // console.log(node)
                node.el.appendChild(document.createTextNode(node.children));
            } else {
                node.children.forEach(child => {
                    this.init(node.el, child);
                });
            }
        }

        // if(typeof node === "string") {
        //     element.textContent += node;
        // } else {
        //     if(typeof node.el === "string") {
        //         element.textContent += node.el;
        //     } else {
        //         element.appendChild(node.el);
        //         if(typeof node.children === "string") {
        //             node.el.appendChild(document.createTextNode(node.children));
        //         } else if(Array.isArray(node.children)) {
        //             node.children.forEach(child => {
        //                 if(typeof node.el === "string") {
        //                     element.textContent += node.el
        //                 } else {
        //                     this.init(node.el, child);
        //                 }
        //             });
        //         }
        //     }
        // }
    }

    // private generateElement(tag: HTMLTag) {
    //     if(tag === "text") return tag;
    //     return document.createElement(tag);
    // }

}