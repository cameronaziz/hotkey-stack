import Registrations from "./Registrations";

class WindowListener {
  private started: boolean = false
  private _registrations?: Registrations
  private static instance: WindowListener


  constructor(registrations: Registrations) {
    if(!WindowListener.instance) {
      WindowListener.instance = this;
      this._registrations = registrations
      this.start()
    }
 
    return WindowListener.instance;
  }

  private keypress = (event: KeyboardEvent) => {
    const listener = this.registrations.findListener(event.key)

    if (listener) {
      listener(event)
    }
  }


  public start = () => {
    if (!this.started) {
      this.started = true
      window.addEventListener('keypress', this.keypress)
    }
  }

  public pause = () => {
    if (this.started) {
      this.started = false
      window.removeEventListener('keypress', this.keypress)
    }
  }

  private get registrations() {
    if (!this._registrations) {
      throw new Error('Registrations were not passed to Window Listener')
    }

    return this._registrations
  }
}

export default WindowListener
