import { Component } from "../src/Component";
import html from "./secondComponent.html";

type Data = {
    val1: string
}

type Attributes = {
    firstAttribute: string
}

export class SecondComponent extends Component<Data, Attributes> {
    constructor() {
        super({
            data: {
                val1: "<h1>Hola</h1>"
            },
            attrs: {
                firstAttribute: ""
            },
            html
        })
    }

    handleClick() {
        this.data.val1 = "val2";
        console.log(this.data);
    }
}