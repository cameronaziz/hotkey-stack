import type { EventListener, HotkeyComboConfig, HotkeyConfig } from '../typings'
import Stack from './Stack'
import StackItem from './StackItem'
import { getKey } from './Stacks.utils'

class Stacks {
  private static instance: Stacks
  private listenerHotkeyMap: Map<EventListener, Stack> = new Map<EventListener, Stack>()
  private configStackMap: Map<HotkeyConfig, Stack> = new Map<
    HotkeyConfig,
    Stack
  >()
  private listenerStacksMap: Map<EventListener, Stack[]> = new Map<
  EventListener,
    Stack[]
  >()

  constructor() {
    if (!Stacks.instance) {
      Stacks.instance = this
    }

    return Stacks.instance
  }

  public findListener = (event: KeyboardEvent): EventListener | null => {
    const hotkey: HotkeyComboConfig = {
      key: event.key,
      isCtrlRequired: event.ctrlKey,
      isMetaRequired: event.metaKey,
      isShiftRequired: event.shiftKey,
    }
    const key = getKey(hotkey)
    const stack = this.getStack(key)
    return stack.findListener()
  }

  public add = (hotkey: HotkeyConfig, eventListener: EventListener, symbol?: Symbol) => {
    const key = getKey(hotkey)
    const stack = this.getStack(key)

    if (typeof symbol === 'symbol') {
      const success = stack.enable(eventListener, symbol)
      if (success) {
        return
      }
    }

    this.listenerHotkeyMap.set(eventListener, stack)
    this.addToListeners(eventListener, stack)
    const item = new StackItem(eventListener, key, symbol)
    stack.add(item)
  }

  public skip = (eventListener: EventListener, hotkey?: string) => {
    const stacks = this.findHotkeys(eventListener, hotkey)

    stacks.forEach((stack) => {
      stack.skip(eventListener)
    })
  }

  public pull = (eventListener: EventListener, hotkey?: string) => {
    const stacks = this.findHotkeys(eventListener, hotkey)

    stacks.forEach((stack) => {
      stack.pull(eventListener)
    })
  }

  public cut = (eventListener: EventListener, hotkey?: string) => {
    const stacks = this.findHotkeys(eventListener, hotkey)

    stacks.forEach((stack) => {
      stack.cut(eventListener)
    })
  }

  private getStack = (hotkey: HotkeyConfig): Stack => {
    if (!this.configStackMap.has(hotkey)) {
      const stack = new Stack(hotkey)
      this.configStackMap.set(hotkey, stack)
    }

    return this.configStackMap.get(hotkey) as Stack
  }

  private addToListeners = (eventListener: EventListener, stack: Stack) => {
    const hotkeys = this.findHotkeys(eventListener)
    hotkeys.push(stack)
  }

  private findHotkeys = (eventListener: EventListener, hotkey?: string) => {
    if (!this.listenerStacksMap.has(eventListener)) {
      this.listenerStacksMap.set(eventListener, [])
    }

    const stacks = this.getListenerHotkeys(eventListener)

    if (hotkey) {
      return Stacks.findHotkeyStack(stacks, hotkey)
    }

    return stacks
  }

  private getListenerHotkeys = (eventListener: EventListener): Stack[] => {
    if (!this.listenerStacksMap.has(eventListener)) {
      const newHotkeys: Stack[] = []
      this.listenerStacksMap.set(eventListener, newHotkeys)
      return newHotkeys
    }

    return this.listenerStacksMap.get(eventListener) as Stack[]
  }

  private static findHotkeyStack = (stacks: Stack[], hotkey: string) => {
    const foundStack = stacks.find((stack) => stack.hotkey === hotkey)
    if (!foundStack) {
      return []
    }
    return [foundStack]
  }
}

export default Stacks
