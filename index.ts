import { Component } from "./src/Component";
import { Parser } from "./src/Parser";
import { VDom } from "./src/VDom";
import { FirstComponent } from "./test/FirstComponent";
import html from "./test/htmlTemplate.html";

const vDom = new VDom();

const tree = vDom.createElement("div", {
    style: "width: 90%",
    class: "mt-5",
}, [
    vDom.createElement("div", {
        class: "card"
    }, [
        vDom.createElement("h1", {
            class: "card-header"
        }, "Card Title"),
        vDom.createElement("div", {
            class: "card-body"
        }, [
            vDom.createElement("h5", {
                class: "card-title"
            }, "SubTitle"),
            vDom.createElement("button", {
                class: "btn btn-primary",
                onclick: () => console.log("Clicked")
            }, "Click me"),
        ])
    ]),
    "text 2"
])


const parser = new Parser(html);
// const nodes = parser
console.log("node", tree, parser.toVNode());
vDom.init(document.querySelector("#app")!, parser.toVNode());

// const component = new FirstComponent();
// component.logData();