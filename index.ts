import { Parser } from "./src/Parser";
import { VDom } from "./src/VDom";
import { VNode } from "./src/types/VNode";
import { watchEffect } from "./src/watchEffect";
import { FirstComponent } from "./test/FirstComponent";

let previousComponent : VNode | null = null
const vDom = new VDom();

watchEffect(() => {
    if(previousComponent) {
        vDom.unmount(previousComponent);
        vDom.mount(previousComponent, document.getElementById("app")!);
    } else {
        const firstComponent = new FirstComponent();
        firstComponent.setVDom(vDom);
        const parser = new Parser(firstComponent);
        const tree = parser.parse();
        previousComponent = tree;
        vDom.mount(tree, document.getElementById("app")!);
    }
});

// const tree = parser.parse();
// vDom.mount(tree, document.getElementById("app")!);