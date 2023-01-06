import { isBasicHotkey } from "./utils/typeguards";
class StackItem {
    listener;
    hotkey;
    isMetaRequired;
    isShiftRequired;
    isCtrlRequired;
    isAltRequired;
    onHold;
    symbol;
    constructor(listener, hotkey, symbol) {
        this.listener = listener;
        this.onHold = false;
        this.symbol = symbol;
        if (isBasicHotkey(hotkey)) {
            this.isMetaRequired = false;
            this.isCtrlRequired = false;
            this.isShiftRequired = false;
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
//# sourceMappingURL=StackItem.js.map