import { Component } from "../src/Component";
import html from "./firstComponent.html";

type Data = {
    name: string,
    password: string
}

export class FirstComponent extends Component<Data> {
    constructor() {
        super({
            data: {
                name: "",
                password: ""
            },
            html
        });
    }
    
    handleClick() {
        if(this.data.name.length < 5) return alert("Name must have at least five characters");
        if(this.data.password.length < 8) return alert("Password must have at least eight characters");
        alert(`Login success for user ${this.data.name}`);
    }

    handleNameChange(e: any) {
        this.data.name = e.target.value;
    }

    handlePasswordChange(e: any) {
        this.data.password = e.target.value;
    }
}