import Hotkey from "./Hotkey";
import StackItem from "./StackItem";
import getKey from "./utils/getKey";
class Registrations {
    static instance;
    listenerHotkeyMap = new Map();
    configHotkeyMap = new Map();
    listenerHotkeysMap = new Map();
    constructor() {
        if (!Registrations.instance) {
            Registrations.instance = this;
        }
        return Registrations.instance;
    }
    findListener = (e) => {
        const hotkey = {
            key: e.key,
            isCtrlRequired: e.ctrlKey,
            isMetaRequired: e.metaKey,
            isShiftRequired: e.shiftKey,
        };
        const key = getKey(hotkey);
        const stack = this.getStack(key);
        return stack.findListener();
    };
    add = (hotkey, listener, symbol) => {
        const key = getKey(hotkey);
        const stack = this.getStack(key);
        if (typeof symbol === "symbol") {
            const success = stack.enable(listener, symbol);
            if (success) {
                return;
            }
        }
        this.listenerHotkeyMap.set(listener, stack);
        this.addToListeners(listener, stack);
        const item = new StackItem(listener, key, symbol);
        stack.add(item);
    };
    skip = (listener, hotkey) => {
        const stacks = this.findHotkeys(listener, hotkey);
        stacks.forEach((stack) => {
            stack.skip(listener);
        });
    };
    pull = (listener, hotkey) => {
        const stacks = this.findHotkeys(listener, hotkey);
        stacks.forEach((stack) => {
            stack.pull(listener);
        });
    };
    cut = (listener, hotkey) => {
        const stacks = this.findHotkeys(listener, hotkey);
        stacks.forEach((stack) => {
            stack.cut(listener);
        });
    };
    getStack = (hotkey) => {
        if (!this.configHotkeyMap.has(hotkey)) {
            const stack = new Hotkey(hotkey);
            this.configHotkeyMap.set(hotkey, stack);
        }
        return this.configHotkeyMap.get(hotkey);
    };
    addToListeners = (listener, stack) => {
        const hotkeys = this.findHotkeys(listener);
        hotkeys.push(stack);
    };
    findHotkeys = (listener, hotkey) => {
        if (!this.listenerHotkeysMap.has(listener)) {
            this.listenerHotkeysMap.set(listener, []);
        }
        const stacks = this.getListenerHotkeys(listener);
        if (hotkey) {
            return Registrations.findHotkeyStack(stacks, hotkey);
        }
        return stacks;
    };
    getListenerHotkeys = (listener) => {
        if (!this.listenerHotkeysMap.has(listener)) {
            const newHotkeys = [];
            this.listenerHotkeysMap.set(listener, newHotkeys);
            return newHotkeys;
        }
        return this.listenerHotkeysMap.get(listener);
    };
    static findHotkeyStack = (stacks, hotkey) => {
        const foundStack = stacks.find((stack) => stack.hotkey === hotkey);
        if (!foundStack) {
            return [];
        }
        return [foundStack];
    };
}
export default Registrations;
//# sourceMappingURL=Registrations.js.map