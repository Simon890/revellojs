import { Component } from "../Component";
import { Attributes, Data } from "../types/ComponentProps";

export function notifyChange(component : Component<Data, Attributes>) {
    console.log("Changing...", component)
}