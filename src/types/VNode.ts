import { Component } from "../Component";
import { Parser } from "../Parser";
import { Attributes, Data } from "./ComponentProps";
import { HTMLAttributes } from "./HTMLAttributes"
import { HTMLTag } from "./HTMLTag"

export type Children = Array<VNode | string>;

export type VNode = {
    el: HTMLElement,
    attributes: HTMLAttributes,
    tag: HTMLTag,
    children: Children,
    parser?: Parser
} | {
    el: HTMLElement,
    attributes: HTMLAttributes,
    tag: "text",
    children: Children,
    parser?: Parser
}

export type VNodeOrStr = VNode | string;

export type VNodeParser = VNode & {parser: Parser}