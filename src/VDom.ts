import { Component } from "./Component";
import { NodeChildren } from "./types/NodeChildren";
import { NodeProps } from "./types/NodeProps";
import { VNode } from "./types/VNode";

/**
 * Creates a virtual dom and mount it to the real dom.
 */
export class VDom {

    private tree!: VNode;
    private container!: Node;

    /**
     * 
     * @param tag Element tag.
     * @param props Properties.
     * @param children Children nodes.
     * @returns Virtual Dom tree.
     */
    public h(tag: keyof HTMLElementTagNameMap | "text", props: NodeProps, children : NodeChildren, component : Component) : VNode {
        return {
            tag,
            props,
            children,
            component
        } as VNode;
    }

    /**
     * Recursive function that mount a virtual dom to the real dom.
     * @param vnode Node to be mounted.
     * @param container HTML Container
     */
    public mount(vnode: VNode, container: Node) {
        this.tree = vnode;
        if(vnode.tag === "text") {
            const regEx = /(?<=\{\{(\s*))([a-zA-Z0-9]*)*(?=(\s*)\}\})/g;
            let text = vnode.children;
            const match = text.match(regEx);
            if(match) {
                match.forEach(value => {
                    const exp = new RegExp("\\{\\{(\\s*)[a-zA-Z0-9]*" + value + "(\\s*)\\}\\}");
                    text = text.replace(exp, vnode.component.getReactiveValue(value));
                });
            }
            const el = (vnode.el = document.createTextNode(text));
            container.appendChild(el);
        } else {
            const el = (vnode.el = document.createElement(vnode.tag))
            for(const key in vnode.props) {
                if(key.startsWith(":")) {
                    const event = key.replace(":on", "") as keyof typeof el;
                    el.addEventListener(event, () => {
                        (vnode.component[vnode!.props![key] as keyof Component] as Function)()
                    });
                } else {
                    el.setAttribute(key, vnode.props[key]);
                }
            }
            if(typeof vnode.children === 'string') {
                el.textContent = vnode.children;
            } else {
                vnode.children.forEach(child => {
                    this.mount(child, el);
                });
            }
            container.appendChild(el);
        }
    }

    /**
     * VNode to be unmounted.
     * @param vnode VNode to unmount.
     */
    public unmount(vnode: VNode) {
        vnode.el?.parentNode?.removeChild(vnode.el);
    }

    /**
     * Repalce a node with the new one.
     * @param n1 Old VNode.
     * @param n2 New VNode.
     */
    public patch(n1: VNode, n2: VNode) {
        const el = (n2.el = n1.el);
        if(!el) throw new Error("No element found");
        if(n1.tag !== n2.tag) {
            //Replace node
            this.mount(n2, el.parentNode!);
            this.unmount(n1);
        } else {
            if(typeof n2.children === "string") {
                el.textContent = n2.children;
            } else {
                const c1 = n1.children;
                const c2 = n2.children;
                if(typeof c1 === "string") {
                    c2.forEach(child => this.patch(n1, child));
                } else {
                    const commonLength = Math.min(c1.length, c2.length);
                    for(let i = 0; i < commonLength; i++) {
                        this.patch(c1[i], c2[i]);
                    }
                    if(c1.length > c2.length) {
                        //Remove unneeded children
                        c1.slice(c2.length).forEach(child => this.unmount(child));
                    } else if(c2.length > c1.length) {
                        //add aditional children to the dom.
                        c2.slice(c1.length).forEach(child => this.mount(child, el));
                    }
                }
            }
        }
    }

    /**
     * Renders a message.
     * @param mesage Message.
     */
    public render(mesage : string) {

    }

    public getTree() {
        return this.tree;
    }
}