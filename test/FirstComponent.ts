import { Component } from "../src/Component";

type Data = {
    name: string
}

export class FirstComponent extends Component<Data> {
    constructor() {
        super({
            data: {
                name: "Simon"
            }
        })
    }
    
    logData() {
        console.log(this.data.name);
        this.data.name = "Pepe";
    }
}