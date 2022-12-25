const getKey = (key) => {
    switch (key) {
        case 'Down':
            return 'ArrowDown';
        case 'Up':
            return 'ArrowUp';
        case 'Left':
            return 'ArrowLeft';
        case 'Right':
            return 'ArrowRight';
        case 'Esc':
            return 'Escape';
        default: {
            if (key.length === 1) {
                return key.toUpperCase();
            }
            return key;
        }
    }
};
export default getKey;
//# sourceMappingURL=getKey.js.map