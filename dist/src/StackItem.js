class StackItem {
    listener;
    hotkey;
    onHold;
    symbol;
    constructor(listener, hotkey, symbol) {
        this.listener = listener;
        this.hotkey = hotkey;
        this.onHold = false;
        this.symbol = symbol;
    }
}
export default StackItem;
//# sourceMappingURL=StackItem.js.map