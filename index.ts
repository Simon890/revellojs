import { Parser } from "./src/Parser";
import { VDom } from "./src/VDom";
import { FirstComponent } from "./test/FirstComponent";
import { NotificationBridge } from "./src/NotificationBridge";
// import { VNode } from "./src/types/VNode";
import { Component } from "./src/Component";
import { Attributes, Data } from "./src/types/ComponentProps";
import { VNode } from "./src/types/VNode";

const notifBridge = NotificationBridge.getInstance();
notifBridge.onComponentChange(component => {
    if(typeof tree !== "string") {
        let node = findParser(tree, component);
        if(node) {
            document.querySelector("#app")!.innerHTML = "";
            vDom.init(document.querySelector("#app")!, parser.toVNode());
        }
    }
});

const findParser = (node: VNode, component: Component<Data, Attributes>) : VNode | null | undefined => {
    if(node.parser && node.parser.getComponent() === component) return node;
    // if(typeof node.children === "string") return null;
    for (let i = 0; i < node.children.length; i++) {
        const child = node.children[i];
        if(typeof child === "string") continue;
        const parser = findParser(child, component);
        if(parser) return parser;
        continue;
    }
}

const vDom = new VDom();
const component = new FirstComponent();
let parser = new Parser(component);
let tree = parser.toVNode();


vDom.init(document.querySelector("#app")!, tree);

console.log(tree);