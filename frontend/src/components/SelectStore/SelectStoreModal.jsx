import styles from "./SelectStoreModal.module.css";
import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import { setSelectedStore, useSelectedStore } from "./selectedStore.js";
import { SEARCH_RADIUS_MILES, searchStoresByZip } from "../../services/stores/storeSearch.js";

function getResultsMessage(status, count) {
    const storesWord = count === 1 ? "store" : "stores";

    if (status === "nearby") {
        return count === 1
            ? `There is 1 store within ${SEARCH_RADIUS_MILES} miles`
            : `There are ${count} ${storesWord} within ${SEARCH_RADIUS_MILES} miles`;
    }

    if (status === "none-nearby") {
        return `There are no stores within ${SEARCH_RADIUS_MILES} miles. Here are the closest stores:`;
    }

    if (status === "unknown-zip") {
        return "We couldn't find this ZIP code. Please check it and try again.";
    }

    if (status === "offline") {
        return "Distance is unavailable right now. Here are the closest stores by ZIP code:";
    }

    return `There are ${count} ${storesWord}`;
}

function SelectStoreModal({ onClose, onSelect }) {
    const [zip, setZip] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState(null);
    const selectedStore = useSelectedStore();
    const closeRef = useRef(null);
    const searchIdRef = useRef(0);
    const inputId = useId();
    const titleId = useId();

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

    async function handleSearch(event) {
        event.preventDefault();

        if (zip.length !== 5) {
            setError("Please enter a valid 5-digit ZIP code.");
            setResults(null);
            return;
        }

        const searchId = searchIdRef.current + 1;
        searchIdRef.current = searchId;
        setError("");
        setLoading(true);

        const found = await searchStoresByZip(zip);

        if (searchIdRef.current !== searchId) return;
        setLoading(false);
        setResults(found);
    }

    function handleSelect(store) {
        setSelectedStore(store.id);
        onSelect?.(store);
        onClose();
    }

    function handleMapsClick() {
        onClose();
        window.scrollTo(0, 0);
    }

    return createPortal(
        <div className={styles.overlay} onClick={onClose}>
            <div
                className={styles.modal}
                role="dialog"
                aria-modal="true"
                aria-labelledby={titleId}
                onClick={event => event.stopPropagation()}
            >
                <div className={styles.header}>
                    <h2 id={titleId} className={styles.title}>Select a store</h2>
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

                <div className={styles.body}>
                    <div className={styles.search}>
                        <form className={`${styles.field} ${error ? styles.fieldError : ""}`} onSubmit={handleSearch} noValidate>
                            <label htmlFor={inputId} className={styles.label}>
                                Search ZIP Code<span className={styles.required}>*</span>
                            </label>
                            <input
                                id={inputId}
                                className={styles.input}
                                type="text"
                                inputMode="numeric"
                                autoComplete="off"
                                maxLength={5}
                                value={zip}
                                aria-invalid={Boolean(error)}
                                onChange={event => {
                                    const numericValue = event.target.value.replace(/\D/g, "").slice(0, 5);
                                    setZip(numericValue);
                                    setError("");
                                }}
                            />
                            <button type="submit" className={styles.searchButton} aria-label="Search stores">
                                <SearchIcon />
                            </button>
                        </form>
                    </div>

                    {error && <p className={styles.error} role="alert">{error}</p>}

                    {loading && <p className={styles.resultsTitle} role="status">Searching stores…</p>}

                    {!loading && results && (
                        <div className={styles.results}>
                            <p className={styles.resultsTitle} role="status">
                                {getResultsMessage(results.status, results.stores.length)}
                            </p>

                            <ul className={styles.storeList}>
                                {results.stores.map((store) => {
                                    const isSelected = selectedStore?.id === store.id;

                                    return (
                                        <li key={store.id} className={styles.storeCard}>
                                            <div className={styles.storeTop}>
                                                <p className={styles.storeName}>{store.name}</p>
                                                {store.distance !== null && (
                                                    <span className={styles.distance}>{store.distance.toFixed(1)} mi</span>
                                                )}
                                            </div>
                                            <Link to="/stores" className={styles.mapsLink} onClick={handleMapsClick}>
                                                Maps &amp; Hours
                                            </Link>
                                            <p className={styles.storeAddress}>{store.city}, {store.stateCode} {store.zip}</p>
                                            <button
                                                type="button"
                                                className={`${styles.selectButton} ${isSelected ? styles.selectButtonActive : ""}`}
                                                onClick={() => handleSelect(store)}
                                                aria-pressed={isSelected}
                                            >
                                                {isSelected ? "Selected store" : "Select store"}
                                            </button>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    )}
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

export default SelectStoreModal;