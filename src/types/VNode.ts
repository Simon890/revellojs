import { HTMLAttributes } from "./HTMLAttributes"
import { HTMLTag } from "./HTMLTag"

export type Children = Array<VNode | string> | string;

export type VNode = {
    el: HTMLElement,
    attributes: HTMLAttributes,
    tag: HTMLTag,
    children: Children
} | {
    el: HTMLElement,
    attributes: HTMLAttributes,
    tag: "text",
    children: string
}

export type VNodeOrStr = VNode | string;