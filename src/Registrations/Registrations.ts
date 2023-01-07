import type { HotkeyComboConfig, HotkeyConfig, Listener } from '../../typings'
import Stack from './Stack'
import StackItem from './StackItem'
import { getKey } from './Registrations.utils'

class Registrations {
  private static instance: Registrations
  private listenerHotkeyMap: Map<Listener, Stack> = new Map<Listener, Stack>()
  private configStackMap: Map<HotkeyConfig, Stack> = new Map<
    HotkeyConfig,
    Stack
  >()
  private listenerStacksMap: Map<Listener, Stack[]> = new Map<
    Listener,
    Stack[]
  >()

  constructor() {
    if (!Registrations.instance) {
      Registrations.instance = this
    }

    return Registrations.instance
  }

  public findListener = (e: KeyboardEvent): Listener | null => {
    const hotkey: HotkeyComboConfig = {
      key: e.key,
      isCtrlRequired: e.ctrlKey,
      isMetaRequired: e.metaKey,
      isShiftRequired: e.shiftKey,
    }
    const key = getKey(hotkey)
    const stack = this.getStack(key)
    return stack.findListener()
  }

  public add = (hotkey: HotkeyConfig, listener: Listener, symbol?: Symbol) => {
    const key = getKey(hotkey)
    const stack = this.getStack(key)

    if (typeof symbol === 'symbol') {
      const success = stack.enable(listener, symbol)
      if (success) {
        return
      }
    }

    this.listenerHotkeyMap.set(listener, stack)
    this.addToListeners(listener, stack)
    const item = new StackItem(listener, key, symbol)
    stack.add(item)
  }

  public skip = (listener: Listener, hotkey?: string) => {
    const stacks = this.findHotkeys(listener, hotkey)

    stacks.forEach((stack) => {
      stack.skip(listener)
    })
  }

  public pull = (listener: Listener, hotkey?: string) => {
    const stacks = this.findHotkeys(listener, hotkey)

    stacks.forEach((stack) => {
      stack.pull(listener)
    })
  }

  public cut = (listener: Listener, hotkey?: string) => {
    const stacks = this.findHotkeys(listener, hotkey)

    stacks.forEach((stack) => {
      stack.cut(listener)
    })
  }

  private getStack = (hotkey: HotkeyConfig): Stack => {
    if (!this.configStackMap.has(hotkey)) {
      const stack = new Stack(hotkey)
      this.configStackMap.set(hotkey, stack)
    }

    return this.configStackMap.get(hotkey) as Stack
  }

  private addToListeners = (listener: Listener, stack: Stack) => {
    const hotkeys = this.findHotkeys(listener)
    hotkeys.push(stack)
  }

  private findHotkeys = (listener: Listener, hotkey?: string) => {
    if (!this.listenerStacksMap.has(listener)) {
      this.listenerStacksMap.set(listener, [])
    }

    const stacks = this.getListenerHotkeys(listener)

    if (hotkey) {
      return Registrations.findHotkeyStack(stacks, hotkey)
    }

    return stacks
  }

  private getListenerHotkeys = (listener: Listener): Stack[] => {
    if (!this.listenerStacksMap.has(listener)) {
      const newHotkeys: Stack[] = []
      this.listenerStacksMap.set(listener, newHotkeys)
      return newHotkeys
    }

    return this.listenerStacksMap.get(listener) as Stack[]
  }

  private static findHotkeyStack = (stacks: Stack[], hotkey: string) => {
    const foundStack = stacks.find((stack) => stack.hotkey === hotkey)
    if (!foundStack) {
      return []
    }
    return [foundStack]
  }
}

export default Registrations
