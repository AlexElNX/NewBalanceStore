import styles from "./StoreModal.module.css";
import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";

function StoreModal({ onClose }) {
    const [zip, setZip] = useState("");
    const closeRef = useRef(null);
    const inputId = useId();

    useEffect(() => {
        const onKey = (event) => {
            if (event.key === "Escape") onClose();
        };

        document.addEventListener("keydown", onKey);
        document.body.style.overflow = "hidden";
        closeRef.current?.focus();

        return () => {
            document.removeEventListener("keydown", onKey);
            document.body.style.overflow = "";
        };
    }, [onClose]);

    return createPortal(
        <div className={styles.overlay} onClick={onClose}>
            <div
                className={styles.modal}
                role="dialog"
                aria-modal="true"
                aria-labelledby="store-modal-title"
                onClick={event => event.stopPropagation()}
            >
                <div className={styles.header}>
                    <h2 id="store-modal-title" className={styles.title}>Select a store</h2>
                    <button
                        ref={closeRef}
                        type="button"
                        className={styles.close}
                        onClick={onClose}
                        aria-label="Close"
                    >
                        ✕
                    </button>
                </div>

                <div className={styles.search}>
                    <form className={styles.field} onSubmit={event => event.preventDefault()} noValidate>
                        <label htmlFor={inputId} className={styles.label}>
                            Search ZIP Code<span className={styles.required}>*</span>
                        </label>
                        <input
                            id={inputId}
                            className={styles.input}
                            type="text"
                            inputMode="numeric"
                            autoComplete="postal-code"
                            maxLength={5}
                            value={zip}
                            onChange={event => {
                                const numericValue = event.target.value.replace(/\D/g, "").slice(0, 5);
                                setZip(numericValue);
                            }}                        />
                        <button type="submit" className={styles.searchButton} aria-label="Search stores">
                            <SearchIcon />
                        </button>
                    </form>

                    <div className={styles.or} aria-hidden="true">
                        <span className={styles.line} />
                        <span>Or</span>
                        <span className={styles.line} />
                    </div>

                    <button type="button" className={styles.nearMe}>
                        <PinIcon />
                        <span>Near me</span>
                    </button>
                </div>

            </div>
        </div>,
        document.body
    );
}

function SearchIcon() {
    return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle cx="10.5" cy="10.5" r="6.5" stroke="currentColor" strokeWidth="1.8" />
            <path d="m15.5 15.5 5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
    );
}

function PinIcon() {
    return (
        <svg width="20" height="24" viewBox="0 0 20 24" fill="none" aria-hidden="true">
            <path d="M10 22s7-6.6 7-12.2A7 7 0 0 0 3 9.8C3 15.4 10 22 10 22Z" stroke="currentColor" strokeWidth="1.8" />
            <circle cx="10" cy="9.8" r="2.6" stroke="currentColor" strokeWidth="1.8" />
        </svg>
    );
}

export default StoreModal;