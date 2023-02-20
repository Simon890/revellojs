import { Component } from "../Component";
import { NodeChildren } from "./NodeChildren";
import { NodeProps } from "./NodeProps";

export type VNode = {
    tag: keyof HTMLElementTagNameMap,
    props: NodeProps,
    children: NodeChildren,
    el?: HTMLElement,
    component: Component
} | {
    tag: "text",
    props: NodeProps,
    children: string,
    el?: Node,
    component: Component
}