import { isBasicHotkey } from '../typeguards'
import type { EventListener, HotkeyConfig } from '../typings'

class StackItem {
  public listener: EventListener
  public hotkey: string
  public isMetaRequired: boolean
  public isShiftRequired: boolean
  public isCtrlRequired: boolean
  public isAltRequired: boolean
  public onHold: boolean
  public symbol?: Symbol

  constructor(eventListener: EventListener, hotkey: HotkeyConfig, symbol?: Symbol) {
    this.listener = eventListener
    this.onHold = false
    this.symbol = symbol
    if (isBasicHotkey(hotkey)) {
      this.isMetaRequired = false
      this.isCtrlRequired = false
      this.isShiftRequired = false
      this.isAltRequired = false
      this.hotkey = hotkey

      return
    }

    this.hotkey = hotkey.key
    this.isMetaRequired = hotkey.isMetaRequired || false
    this.isCtrlRequired = hotkey.isCtrlRequired || false
    this.isShiftRequired = hotkey.isShiftRequired || false
    this.isAltRequired = hotkey.isAltRequired || false
  }
}

export default StackItem
