import { useSyncExternalStore } from "react";
import { STORES } from "../../data/stores.js";
import { readSelectedStoreId, writeSelectedStoreId } from "../../services/stores/selectedStoreStorage.js";

const listeners = new Set();
let selectedStoreId = readSelectedStoreId();

function subscribe(listener) {
    listeners.add(listener);
    return () => listeners.delete(listener);
}

function getSnapshot() {
    return selectedStoreId;
}

export function setSelectedStore(storeId) {
    selectedStoreId = storeId;
    writeSelectedStoreId(storeId);
    listeners.forEach((listener) => listener());
}

export function useSelectedStore() {
    const storeId = useSyncExternalStore(subscribe, getSnapshot);
    return STORES.find((store) => store.id === storeId) ?? null;
}