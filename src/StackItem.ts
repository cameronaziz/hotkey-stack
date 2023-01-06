import type { HotkeyConfig, Listener } from "../typings";
import { isBasicHotkey } from "./utils/typeguards";

class StackItem {
  public listener: Listener;
  public hotkey: string;
  public isMetaRequired: boolean;
  public isShiftRequired: boolean;
  public isCtrlRequired: boolean;
  public isAltRequired: boolean;
  public onHold: boolean;
  public symbol?: Symbol;

  constructor(listener: Listener, hotkey: HotkeyConfig, symbol?: Symbol) {
    this.listener = listener;
    this.onHold = false;
    this.symbol = symbol;
    if (isBasicHotkey(hotkey)) {
      this.isMetaRequired = false;
      this.isCtrlRequired = false;
      this.isShiftRequired = false;
      this.isAltRequired = false;
      this.hotkey = hotkey;

      return;
    }

    this.hotkey = hotkey.key;
    this.isMetaRequired = hotkey.isMetaRequired || false;
    this.isCtrlRequired = hotkey.isCtrlRequired || false;
    this.isShiftRequired = hotkey.isShiftRequired || false;
    this.isAltRequired = hotkey.isAltRequired || false;
  }
}

export default StackItem;
