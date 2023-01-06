import { isListener, isStackItem } from "./typeguards";
class Hotkey {
    stackItemMap;
    symbolTrash;
    items;
    hotkey;
    constructor(hotkey) {
        this.items = [];
        this.hotkey = hotkey;
        this.stackItemMap = new Map();
        this.symbolTrash = new Map();
    }
    findListener = () => {
        let index = this.items.length || -1;
        while (index > -1) {
            index -= 1;
            const stackItem = this.items[index];
            if (!stackItem.onHold) {
                break;
            }
        }
        return this.items[index]?.listener || null;
    };
    add = (item) => {
        this.items.push(item);
        this.stackItemMap.set(item.listener, item);
    };
    pull = (listener, hotkey) => {
        const stackItem = this.findStackItem(listener);
        if (!isStackItem(stackItem)) {
            return;
        }
        this.stackItemMap.delete(listener);
        this.items = this.items.filter((item) => item !== stackItem);
    };
    skip = (listener, hotkey) => {
        const stackItem = this.findStackItem(listener);
        if (!isStackItem(stackItem)) {
            return;
        }
        if (typeof stackItem.symbol !== "symbol") {
            this.pull(listener);
            return;
        }
        stackItem.onHold = true;
        this.symbolTrash.set(stackItem.symbol, listener);
    };
    cut = (listener) => {
        const itemIndex = this.items.findIndex((item) => item.listener === listener);
        if (itemIndex > -1) {
            const item = this.items[itemIndex];
            this.items.splice(itemIndex, 1);
            this.items = [...this.items, item];
        }
    };
    enable = (listener, symbol) => {
        const trashListener = this.symbolTrash.get(symbol);
        if (this.symbolTrash.has(symbol)) {
            this.symbolTrash.delete(symbol);
        }
        if (isListener(trashListener)) {
            const stackItem = this.stackItemMap.get(trashListener);
            if (isStackItem(stackItem)) {
                stackItem.listener = listener;
                stackItem.onHold = false;
                return true;
            }
        }
        return false;
    };
    findStackItem = (listener) => this.stackItemMap.get(listener) || null;
}
export default Hotkey;
//# sourceMappingURL=Hotkey.js.map