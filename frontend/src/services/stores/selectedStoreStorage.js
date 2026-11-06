const STORAGE_KEY = "nb-selected-store";

export function readSelectedStoreId() {
    try {
        return localStorage.getItem(STORAGE_KEY);
    } catch {
        return null;
    }
}

export function writeSelectedStoreId(storeId) {
    try {
        if (storeId) {
            localStorage.setItem(STORAGE_KEY, storeId);
        } else {
            localStorage.removeItem(STORAGE_KEY);
        }
    } catch {
        return;
    }
}