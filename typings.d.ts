import HotkeyStack from "./src/HotkeyStack";
import StackItem from "./src/StackItem";

export type HotkeyComboConfig = {
  key: string;
  isMetaRequired?: boolean;
  isShiftRequired?: boolean;
  isCtrlRequired?: boolean;
  isAltRequired?: boolean;
};

export type HotkeyConfig = string | HotkeyComboConfig;
export type Listener = (event: KeyboardEvent) => void;
export type StackMap = Map<Listener, StackItem>;

export default HotkeyStack;
