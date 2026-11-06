import { useCallback, useState } from "react";

export function usePromoRotation(count) {
    const [index, setIndex] = useState(0);

    const next = useCallback(() => {
        if (count < 2) return;
        setIndex((current) => (current + 1) % count);
    }, [count]);

    return { index, next };
}