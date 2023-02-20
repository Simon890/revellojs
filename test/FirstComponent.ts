import { Component } from "../src/Component";
import firstComponent from "./firstComponent.html";

export class FirstComponent extends Component {

    constructor() {
        super({count: 1, name: "User"});
    }

    handleClick() {
        this.reactives.count++;
    }

    render(): string {
        return firstComponent;
    }
}