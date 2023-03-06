import { Component } from "./Component";
import { Attributes, Data } from "./types/ComponentProps";

export class NotificationBridge {
    private static instance: NotificationBridge | null = null;
    private cb?: (component: Component<Data, Attributes>) => void;
    private constructor() {

    }

    static getInstance() {
        if(!NotificationBridge.instance) {
            NotificationBridge.instance = new NotificationBridge();
        }
        return NotificationBridge.instance;
    }

    notifyChanges(component : Component<Data, Attributes>) {
        if(this.cb) this.cb(component);
    }

    onComponentChange(cb : (component: Component<Data, Attributes>) => void) {
        this.cb = cb;
    }
}