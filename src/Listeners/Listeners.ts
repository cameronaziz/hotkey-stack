import Registrations from '../Stacks'

class Listeners {
  private started: boolean = false
  private _registrations?: Registrations
  private static instance: Listeners

  constructor(registrations: Registrations) {
    if (!Listeners.instance) {
      Listeners.instance = this
      this._registrations = registrations
      this.start()
    }

    return Listeners.instance
  }

  private keydown = (event: KeyboardEvent) => {
    const listener = this.registrations.findListener(event)

    if (listener) {
      listener(event)
    }
  }

  public start = () => {
    if (!this.started) {
      this.started = true
      window.addEventListener('keydown', this.keydown)
    }
  }

  public pause = () => {
    if (this.started) {
      this.started = false
      window.removeEventListener('keydown', this.keydown)
    }
  }

  private get registrations() {
    if (!this._registrations) {
      throw new Error('Registrations were not passed to Window Listener')
    }

    return this._registrations
  }
}

export default Listeners
