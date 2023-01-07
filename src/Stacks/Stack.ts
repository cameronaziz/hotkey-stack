import { isListener, isStackItem } from '../typeguards'
import type { EventListener, HotkeyConfig } from '../typings'
import StackItem from './StackItem'

class Stack {
  /**
   * A mapping of listeners to stack items.
   * This allows for constant time lookup of stack items.
   *
   * hotkey - Allows lookups on this.hotkeyMap
   * listener - Allows last added to be retrieved in this.hotkeyMap
   * onHold - Allows hotkeys listening to pause and not lose place in line
   * symbol - Common reference, with different listeners, while returning from on hold
   *
   * @private
   * @memberof Stack
   */
  private stackItemMap: Map<EventListener, StackItem>
  /**
   * A mapping of symbols to listeners
   * This allows for constant time lookup of original listeners.
   * This is used when starting while being on hold.
   *
   * @private
   * @memberof Stack
   */
  private symbolTrash: Map<Symbol, EventListener>
  private items: StackItem[]
  public hotkey: HotkeyConfig

  constructor(hotkey: HotkeyConfig) {
    this.items = []
    this.hotkey = hotkey
    this.stackItemMap = new Map<EventListener, StackItem>()
    this.symbolTrash = new Map<Symbol, EventListener>()
  }

  public findListener = (): EventListener | null => {
    let index = this.items.length || -1

    while (index > -1) {
      index -= 1
      const stackItem = this.items[index]
      if (!stackItem.onHold) {
        break
      }
    }

    return this.items[index]?.listener || null
  }

  public add = (item: StackItem) => {
    this.items.push(item)
    this.stackItemMap.set(item.listener, item)
  }

  public pull = (eventListener: EventListener, _hotkey?: string) => {
    const stackItem = this.findStackItem(eventListener)

    if (!isStackItem(stackItem)) {
      return
    }

    this.stackItemMap.delete(eventListener)
    this.items = this.items.filter((item) => item !== stackItem)
  }

  public skip = (eventListener: EventListener, hotkey?: string) => {
    const stackItem = this.findStackItem(eventListener)
    if (!isStackItem(stackItem)) {
      return
    }

    if (typeof stackItem.symbol !== 'symbol') {
      this.pull(eventListener)
      return
    }

    stackItem.onHold = true
    this.symbolTrash.set(stackItem.symbol, eventListener)
  }

  public cut = (eventListener: EventListener) => {
    const itemIndex = this.items.findIndex((item) => item.listener === eventListener)
    if (itemIndex > -1) {
      const item = this.items[itemIndex]
      this.items.splice(itemIndex, 1)
      this.items = [...this.items, item]
    }
  }

  public enable = (eventListener: EventListener, symbol: Symbol) => {
    const trashListener = this.symbolTrash.get(symbol)

    if (this.symbolTrash.has(symbol)) {
      this.symbolTrash.delete(symbol)
    }

    if (isListener(trashListener)) {
      const stackItem = this.stackItemMap.get(trashListener)

      if (isStackItem(stackItem)) {
        stackItem.listener = eventListener
        stackItem.onHold = false
        return true
      }
    }

    return false
  }

  private findStackItem = (eventListener: EventListener) =>
    this.stackItemMap.get(eventListener) || null
}

export default Stack
