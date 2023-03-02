import { Component } from "../src/Component";
import htmlTemplate from "./htmlTemplate.html";

type Data = {
    name: string
}

export class FirstComponent extends Component<Data> {
    constructor() {
        super({
            data: {
                name: "Simon"
            },
            html: htmlTemplate
        });
    }
    
    handleClick() {
        console.log("CLICKED FROM COMPONENT", this.data.name);
    }
}