import type { Listener, HotkeyComboConfig, HotkeyConfig } from '../typings'
import StackItem from './StackItem'

export const isBasicHotkey = (hotkey: HotkeyConfig): hotkey is string =>
  typeof hotkey === 'string'

export const isComboHotkey = (
  hotkey: HotkeyConfig
): hotkey is HotkeyComboConfig => typeof hotkey !== 'string'

export const isListener = (unknown?: Listener): unknown is Listener =>
  typeof unknown !== 'undefined'

export const isStackItem = (unknown?: StackItem | null): unknown is StackItem =>
  unknown instanceof StackItem
