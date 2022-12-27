import type { Listener } from '../typings'
import StackItem from './StackItem'

export const isListener = (unknown?: Listener): unknown is Listener =>
  typeof unknown !== 'undefined'

export const isStackItem = (unknown?: StackItem | null): unknown is StackItem =>
  unknown instanceof StackItem
