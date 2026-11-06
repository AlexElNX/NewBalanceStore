import styles from "./DeliveryOptions.module.css";
import { useCallback, useState } from "react";
import SelectStoreModal from "../../SelectStore/SelectStoreModal.jsx";
import { useSelectedStore } from "../../SelectStore/selectedStore.js";

function DeliveryOptions() {
    const [method, setMethod] = useState("shipping");
    const [storeOpen, setStoreOpen] = useState(false);

    const selectedStore = useSelectedStore();

    const closeStore = useCallback(() => setStoreOpen(false), []);

    return (
        <>
            <div className={styles.options} role="radiogroup" aria-label="Delivery method">
                <button
                    type="button"
                    role="radio"
                    aria-checked={method === "shipping"}
                    className={`${styles.option} ${method === "shipping" ? styles.active : ""}`}
                    onClick={() => setMethod("shipping")}
                >
                    <BoxIcon />
                    <span>Shipping</span>
                </button>

                <button
                    type="button"
                    role="radio"
                    aria-checked={method === "pickup"}
                    aria-haspopup="dialog"
                    className={`${styles.option} ${method === "pickup" ? styles.active : ""}`}
                    onClick={() => setStoreOpen(true)}
                >
                    <StoreIcon />
                    <span className={styles.optionText}>
                        <span>Store pickup</span>
                        {selectedStore && <span className={styles.storeName}>{selectedStore.name}</span>}
                    </span>
                </button>
            </div>

            {storeOpen && <SelectStoreModal onClose={closeStore} onSelect={() => setMethod("pickup")} />}
        </>
    );
}

function BoxIcon() {
    return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M12 3 4 7v10l8 4 8-4V7l-8-4Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
            <path d="m4 7 8 4 8-4M12 11v10M8 5l8 4" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
        </svg>
    );
}

function StoreIcon() {
    return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M4 4h16v4H4zM5 8v12h14V8" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
            <path d="M9 20v-6h6v6M4 8c0 1.5 1.3 2.5 2.7 2.5S9.3 9.5 9.3 8M9.3 8c0 1.5 1.3 2.5 2.7 2.5s2.7-1 2.7-2.5M14.7 8c0 1.5 1.3 2.5 2.6 2.5S20 9.5 20 8" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
        </svg>
    );
}

export default DeliveryOptions;