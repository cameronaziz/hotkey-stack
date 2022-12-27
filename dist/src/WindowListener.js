class WindowListener {
    started = false;
    _registrations;
    static instance;
    constructor(registrations) {
        if (!WindowListener.instance) {
            WindowListener.instance = this;
            this._registrations = registrations;
            this.start();
        }
        return WindowListener.instance;
    }
    keypress = (event) => {
        const listener = this.registrations.findListener(event.key);
        if (listener) {
            listener(event);
        }
    };
    start = () => {
        if (!this.started) {
            this.started = true;
            window.addEventListener('keypress', this.keypress);
        }
    };
    pause = () => {
        if (this.started) {
            this.started = false;
            window.removeEventListener('keypress', this.keypress);
        }
    };
    get registrations() {
        if (!this._registrations) {
            throw new Error('Registrations were not passed to Window Listener');
        }
        return this._registrations;
    }
}
export default WindowListener;
//# sourceMappingURL=WindowListener.js.map