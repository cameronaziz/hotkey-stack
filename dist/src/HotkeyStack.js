import Registrations from './Registrations';
import WindowListener from './WindowListener';
class HotkeyStack {
    constructor() {
        if (!HotkeyStack.instance) {
            HotkeyStack.instance = this;
            this._windowListener = new WindowListener(this.registrations);
        }
        return HotkeyStack.instance;
    }
    _windowListener;
    static instance;
    registrations = new Registrations();
    get add() {
        return this.registrations.add;
    }
    get cut() {
        return this.registrations.cut;
    }
    get skip() {
        return this.registrations.skip;
    }
    get pull() {
        return this.registrations.pull;
    }
    get pause() {
        return this.windowListener.pause;
    }
    get start() {
        return this.windowListener.start;
    }
    get windowListener() {
        if (typeof this._windowListener === 'undefined') {
            this._windowListener = new WindowListener(this.registrations);
        }
        return this._windowListener;
    }
}
const instance = new HotkeyStack();
export default instance;
//# sourceMappingURL=HotkeyStack.js.map