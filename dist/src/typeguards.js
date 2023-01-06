import StackItem from './StackItem';
export const isBasicHotkey = (hotkey) => typeof hotkey === 'string';
export const isComboHotkey = (hotkey) => typeof hotkey !== 'string';
export const isListener = (unknown) => typeof unknown !== 'undefined';
export const isStackItem = (unknown) => unknown instanceof StackItem;
//# sourceMappingURL=typeguards.js.map