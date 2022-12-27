import { useEffect, useRef } from 'react';
import hs from '../HotkeyStack';
const useHotkeyEffect = (hotkey, listener) => {
    const symbolRef = useRef(Symbol());
    useEffect(() => {
        hs.add(hotkey, listener, symbolRef.current);
        return () => {
            hs.skip(listener);
        };
    }, [listener]);
    useEffect(() => {
        hs.pull(listener);
    }, []);
};
export default useHotkeyEffect;
//# sourceMappingURL=useHotkeyEffect.js.map