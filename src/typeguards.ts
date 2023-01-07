import StackItem from './Stacks/StackItem'
import type { EventListener, HotkeyComboConfig, HotkeyConfig } from './typings'

export const isBasicHotkey = (hotkey: HotkeyConfig): hotkey is string =>
  typeof hotkey === 'string'

export const isComboHotkey = (
  hotkey: HotkeyConfig
): hotkey is HotkeyComboConfig => typeof hotkey !== 'string'

export const isListener = (unknown?: EventListener): unknown is EventListener =>
  typeof unknown !== 'undefined'

export const isStackItem = (unknown?: StackItem | null): unknown is StackItem =>
  unknown instanceof StackItem
