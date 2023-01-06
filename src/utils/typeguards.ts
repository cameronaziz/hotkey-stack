import { HotkeyComboConfig, HotkeyConfig } from "../../typings";

export const isBasicHotkey = (hotkey: HotkeyConfig): hotkey is string =>
  typeof hotkey === "string";

export const isComboHotkey = (
  hotkey: HotkeyConfig
): hotkey is HotkeyComboConfig => typeof hotkey !== "string";
