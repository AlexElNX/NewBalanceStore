import { useCallback, useEffect, useRef, useState } from "react";

export const LOADING_DELAY = 600;

export function useLoadingAction(delay = LOADING_DELAY) {
    const [loading, setLoading] = useState(false);
    const timerRef = useRef(null);

    useEffect(() => () => clearTimeout(timerRef.current), []);

    const run = useCallback((action) => {
        clearTimeout(timerRef.current);
        setLoading(true);
        timerRef.current = setTimeout(() => {
            action();
            setLoading(false);
        }, delay);
    }, [delay]);

    return { loading, run };
}
