import type { HotkeyConfig, Listener } from '../typings'
import StackItem from './StackItem'
import { isListener, isStackItem } from './typeguards'

class Hotkey {
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
  private stackItemMap: Map<Listener, StackItem>
  /**
   * A mapping of symbols to listeners
   * This allows for constant time lookup of original listeners.
   * This is used when starting while being on hold.
   *
   * @private
   * @memberof Stack
   */
  private symbolTrash: Map<Symbol, Listener>
  private items: StackItem[]
  public hotkey: HotkeyConfig

  constructor(hotkey: HotkeyConfig) {
    this.items = []
    this.hotkey = hotkey
    this.stackItemMap = new Map<Listener, StackItem>()
    this.symbolTrash = new Map<Symbol, Listener>()
  }

  public findListener = (): Listener | null => {
    let index = this.items.length

    while (index > -1) {
      index -= 1
      const stackItem = this.items.at(index)
      if (stackItem && !stackItem.onHold) {
        break
      }
    }

    return this.items.at(index)?.listener ?? null
  }

  public add = (item: StackItem) => {
    this.items.push(item)
    this.stackItemMap.set(item.listener, item)
  }

  public pull = (listener: Listener, hotkey?: string) => {
    const stackItem = this.findStackItem(listener)

    if (!isStackItem(stackItem)) {
      return
    }

    this.stackItemMap.delete(listener)
    this.items = this.items.filter((item) => item !== stackItem)
  }

  public skip = (listener: Listener, hotkey?: string) => {
    const stackItem = this.findStackItem(listener)
    if (!isStackItem(stackItem)) {
      return
    }

    if (typeof stackItem.symbol !== 'symbol') {
      this.pull(listener)
      return
    }

    stackItem.onHold = true
    this.symbolTrash.set(stackItem.symbol, listener)
  }

  public cut = (listener: Listener) => {
    const itemIndex = this.items.findIndex((item) => item.listener === listener)
    if (itemIndex > -1) {
      const item = this.items[itemIndex]
      this.items.splice(itemIndex, 1)
      this.items = [...this.items, item]
    }
  }

  public enable = (listener: Listener, symbol: Symbol) => {
    const trashListener = this.symbolTrash.get(symbol)

    if (this.symbolTrash.has(symbol)) {
      this.symbolTrash.delete(symbol)
    }

    if (isListener(trashListener)) {
      const stackItem = this.stackItemMap.get(trashListener)

      if (isStackItem(stackItem)) {
        stackItem.listener = listener
        stackItem.onHold = false
        return true
      }
    }

    return false
  }

  private findStackItem = (listener: Listener) =>
    this.stackItemMap.get(listener) || null
}

export default Hotkey
