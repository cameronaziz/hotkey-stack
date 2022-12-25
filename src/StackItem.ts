import { HotkeyConfig, Listener } from './types'

class StackItem {
  public listener: Listener
  public hotkey: HotkeyConfig
  public onHold: boolean
  public symbol?: Symbol

  constructor(listener: Listener, hotkey: HotkeyConfig, symbol?: Symbol) {
    this.listener = listener
    this.hotkey = hotkey
    this.onHold = false
    this.symbol = symbol
  }
}

export default StackItem
