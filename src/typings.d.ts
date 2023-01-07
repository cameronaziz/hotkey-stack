import HotkeyStack from './HotkeyStack';
import StackItem from './Stacks/StackItem';

export type HotkeyComboConfig = {
  key: string;
  isMetaRequired?: boolean;
  isShiftRequired?: boolean;
  isCtrlRequired?: boolean;
  isAltRequired?: boolean;
};

export type HotkeyConfig = string | HotkeyComboConfig;
export type EventListener = (event: KeyboardEvent) => void;
export type StackMap = Map<EventListener, StackItem>;

export default HotkeyStack;
