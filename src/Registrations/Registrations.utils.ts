import { HotkeyComboConfig, HotkeyConfig } from '../../typings'
import { isComboHotkey } from '../typeguards'

const parseKey = (key: string): string => {
  switch (key) {
    case 'Down':
      return 'ArrowDown'
    case 'Up':
      return 'ArrowUp'
    case 'Left':
      return 'ArrowLeft'
    case 'Right':
      return 'ArrowRight'
    case 'Esc':
      return 'Escape'
    default: {
      if (key.length === 1) {
        return key.toUpperCase()
      }
      return key
    }
  }
}

const buildKeyString = (key: HotkeyComboConfig): string =>
  `\
    key: ${parseKey(key.key)};\
    isCtrlRequired: ${key.isCtrlRequired};\
    isMetaRequired: ${key.isMetaRequired};\
    isShiftRequired: ${key.isShiftRequired};\
    isAltRequired: ${key.isAltRequired};`

export const getKey = (key: HotkeyConfig): string => {
  if (isComboHotkey(key)) {
    return buildKeyString({
      isCtrlRequired: key.isCtrlRequired || false,
      isMetaRequired: key.isMetaRequired || false,
      isShiftRequired: key.isShiftRequired || false,
      isAltRequired: key.isAltRequired || false,
      key: key.key,
    })
  }
  return buildKeyString({
    isCtrlRequired: false,
    isMetaRequired: false,
    isShiftRequired: false,
    isAltRequired: false,
    key,
  })
}
