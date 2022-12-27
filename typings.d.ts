import HotkeyStack from './src/HotkeyStack'
import StackItem from './src/StackItem'

export type HotkeyConfig = string
export type Listener = (event: KeyboardEvent) => void
export type StackMap = Map<Listener, StackItem>

export default HotkeyStack
