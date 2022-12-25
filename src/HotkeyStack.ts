import Registrations from './Registrations';
import WindowListener from './WindowListener';

class HotkeyStack {
  constructor() {
    if(!HotkeyStack.instance) {
      HotkeyStack.instance = this;
      this._windowListener = new WindowListener(this.registrations)
    }
 
    return HotkeyStack.instance;
  }
  
  private _windowListener?: WindowListener
  private static instance: HotkeyStack
  private registrations: Registrations = new Registrations()

  /**
   * Add a new listener into the stack
   *
   * @readonly
   * @memberof HotkeyStack
   */
  public get add() {
    return this.registrations.add
  }

  /**
   * Moves the listener to the top of the stack
   *
   * @readonly
   * @memberof HotkeyStack
   */
  public get cut() {
    return this.registrations.cut
  }

  /**
   * Skips the current listener
   * In order to no longer skip, add listener again
   *
   * @readonly
   * @memberof HotkeyStack
   */
  public get skip() {
    return this.registrations.skip
  }

  /**
   * Pull the listener from the stack
   *
   * @readonly
   * @memberof HotkeyStack
   */
  public get pull() {
    return this.registrations.pull
  }

  /**
   * Pause all listeners
   *
   * @readonly
   * @memberof HotkeyStack
   */
  public get pause() {
    return this.windowListener.pause
  }

  /**
   * Start all listeners
   * This is called automatically on instantiation.
   *
   * @readonly
   * @memberof HotkeyStack
   */
  public get start() {
    return this.windowListener.start
  }

  private get windowListener() {
    if (typeof this._windowListener === 'undefined') {
      this._windowListener = new WindowListener(this.registrations)
    }
    return this._windowListener
  }
}

const instance = new HotkeyStack()
export default instance
