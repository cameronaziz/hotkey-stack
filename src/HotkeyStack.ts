import Listeners from './Listeners'
import Stacks from './Stacks'

class HotkeyStack {
  constructor() {
    if (!HotkeyStack.instance) {
      HotkeyStack.instance = this
      this._listeners = new Listeners(this.stacks)
    }

    return HotkeyStack.instance
  }

  private _listeners?: Listeners
  private static instance: HotkeyStack
  private stacks: Stacks = new Stacks()

  /**
   * Add a new listener into the stack
   *
   * @readonly
   * @memberof HotkeyStack
   */
  public get add() {
    return this.stacks.add
  }

  /**
   * Moves the listener to the top of the stack
   *
   * @readonly
   * @memberof HotkeyStack
   */
  public get cut() {
    return this.stacks.cut
  }

  /**
   * Skips the current listener
   * In order to no longer skip, add listener again
   *
   * @readonly
   * @memberof HotkeyStack
   */
  public get skip() {
    return this.stacks.skip
  }

  /**
   * Pull the listener from the stack
   *
   * @readonly
   * @memberof HotkeyStack
   */
  public get pull() {
    return this.stacks.pull
  }

  /**
   * Pause all listeners
   *
   * @readonly
   * @memberof HotkeyStack
   */
  public get pause() {
    return this.listeners.pause
  }

  /**
   * Start all listeners
   * This is called automatically on instantiation.
   *
   * @readonly
   * @memberof HotkeyStack
   */
  public get start() {
    return this.listeners.start
  }

  private get listeners() {
    if (typeof this._listeners === 'undefined') {
      this._listeners = new Listeners(this.stacks)
    }
    return this._listeners
  }
}

const hks = new HotkeyStack()
export default hks
