import { Component } from "../Component"

export type Data = {
    [key: string]: any
}

export type Attributes = {
    [key: string]: any
}

export type ComponentDep = {
    [key: string]: {new() : Component<Data, Attributes>}
}

export type ComponentProps<Data, Attributes> = {
    readonly data: Data,
    readonly html: string,
    readonly components?: ComponentDep,
    readonly attrs?: Attributes
}