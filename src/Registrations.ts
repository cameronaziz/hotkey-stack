import type { HotkeyComboConfig, HotkeyConfig, Listener } from "../typings";
import Hotkey from "./Hotkey";
import StackItem from "./StackItem";
import getKey from "./utils/getKey";

class Registrations {
  private static instance: Registrations;
  private listenerHotkeyMap: Map<Listener, Hotkey> = new Map<
    Listener,
    Hotkey
  >();
  private configHotkeyMap: Map<HotkeyConfig, Hotkey> = new Map<
    HotkeyConfig,
    Hotkey
  >();
  private listenerHotkeysMap: Map<Listener, Hotkey[]> = new Map<
    Listener,
    Hotkey[]
  >();

  constructor() {
    if (!Registrations.instance) {
      Registrations.instance = this;
    }

    return Registrations.instance;
  }

  public findListener = (e: KeyboardEvent): Listener | null => {
    const hotkey: HotkeyComboConfig = {
      key: e.key,
      isCtrlRequired: e.ctrlKey,
      isMetaRequired: e.metaKey,
      isShiftRequired: e.shiftKey,
    };
    const key = getKey(hotkey);
    const stack = this.getStack(key);
    return stack.findListener();
  };

  public add = (hotkey: HotkeyConfig, listener: Listener, symbol?: Symbol) => {
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

  public skip = (listener: Listener, hotkey?: string) => {
    const stacks = this.findHotkeys(listener, hotkey);

    stacks.forEach((stack) => {
      stack.skip(listener);
    });
  };

  public pull = (listener: Listener, hotkey?: string) => {
    const stacks = this.findHotkeys(listener, hotkey);

    stacks.forEach((stack) => {
      stack.pull(listener);
    });
  };

  public cut = (listener: Listener, hotkey?: string) => {
    const stacks = this.findHotkeys(listener, hotkey);

    stacks.forEach((stack) => {
      stack.cut(listener);
    });
  };

  private getStack = (hotkey: HotkeyConfig): Hotkey => {
    if (!this.configHotkeyMap.has(hotkey)) {
      const stack = new Hotkey(hotkey);
      this.configHotkeyMap.set(hotkey, stack);
    }

    return this.configHotkeyMap.get(hotkey) as Hotkey;
  };

  private addToListeners = (listener: Listener, stack: Hotkey) => {
    const hotkeys = this.findHotkeys(listener);
    hotkeys.push(stack);
  };

  private findHotkeys = (listener: Listener, hotkey?: string) => {
    if (!this.listenerHotkeysMap.has(listener)) {
      this.listenerHotkeysMap.set(listener, []);
    }

    const stacks = this.getListenerHotkeys(listener);

    if (hotkey) {
      return Registrations.findHotkeyStack(stacks, hotkey);
    }

    return stacks;
  };

  private getListenerHotkeys = (listener: Listener): Hotkey[] => {
    if (!this.listenerHotkeysMap.has(listener)) {
      const newHotkeys: Hotkey[] = [];
      this.listenerHotkeysMap.set(listener, newHotkeys);
      return newHotkeys;
    }

    return this.listenerHotkeysMap.get(listener) as Hotkey[];
  };

  private static findHotkeyStack = (stacks: Hotkey[], hotkey: string) => {
    const foundStack = stacks.find((stack) => stack.hotkey === hotkey);
    if (!foundStack) {
      return [];
    }
    return [foundStack];
  };
}

export default Registrations;
