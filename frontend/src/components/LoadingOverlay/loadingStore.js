import { useEffect, useRef, useSyncExternalStore } from "react";

export const LOADING_DURATION = 600;

const listeners = new Set();
let activeCount = 0;

function emit() {
    listeners.forEach(listener => listener());
}

function subscribe(listener) {
    listeners.add(listener);
    return () => listeners.delete(listener);
}

function getSnapshot() {
    return activeCount > 0;
}

export function flashLoading(duration = LOADING_DURATION) {
    activeCount += 1;
    emit();
    setTimeout(() => {
        activeCount = Math.max(0, activeCount - 1);
        emit();
    }, duration);
}

export function withLoading(action, duration = LOADING_DURATION) {
    flashLoading(duration);
    setTimeout(action, duration);
}

export function useGlobalLoading() {
    return useSyncExternalStore(subscribe, getSnapshot);
}

export function useLoadingOnChange(key) {
    const previousKey = useRef(key);

    useEffect(() => {
        if (previousKey.current === key) return;
        previousKey.current = key;
        flashLoading();
    }, [key]);
}
