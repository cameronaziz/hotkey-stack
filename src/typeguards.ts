import StackItem from './StackItem'
import { Listener } from './types'

export const isListener = (unknown?: Listener): unknown is Listener =>
  typeof unknown !== 'undefined'

export const isStackItem = (unknown?: StackItem | null): unknown is StackItem =>
  unknown instanceof StackItem
