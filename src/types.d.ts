import StackItem from "./StackItem"

export type HotkeyConfig = string
export type Listener = (event: KeyboardEvent) => void
export type StackMap = Map<Listener, StackItem>
