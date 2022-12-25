function debounce(func, timeout) {
    const timeoutLength = typeof timeout === 'undefined' ? 100 : timeout;
    let timer;
    return ((...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => {
            func.apply(this, args);
        }, timeoutLength);
    });
}
export default debounce;
//# sourceMappingURL=debounce.js.map