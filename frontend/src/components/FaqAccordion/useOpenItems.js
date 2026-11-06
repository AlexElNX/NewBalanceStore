import { useCallback, useState } from "react";

export function useOpenItems(initialIds = []) {
    const [openIds, setOpenIds] = useState(initialIds);

    const isOpen = useCallback((id) => openIds.includes(id), [openIds]);

    const toggle = useCallback((id) => {
        setOpenIds((current) => (
            current.includes(id) ? current.filter((openId) => openId !== id) : [...current, id]
        ));
    }, []);

    return { isOpen, toggle };
}