class WindowListener {
    started = false;
    registrations;
    static instance;
    constructor(registrations) {
        if (!WindowListener.instance) {
            WindowListener.instance = this;
            this.registrations = registrations;
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
}
export default WindowListener;
//# sourceMappingURL=WindowListener.js.map