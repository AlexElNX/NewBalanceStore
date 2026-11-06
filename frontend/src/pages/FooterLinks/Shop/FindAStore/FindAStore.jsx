import { useMemo, useRef, useState } from "react";
import styles from "./FindAStore.module.css";
import TopHeader from "../../../../components/TopHeader/TopHeader.jsx";
import MainHeader from "../../../../components/MainHeader/MainHeader.jsx";
import Footer from "../../../../components/Footer/Footer.jsx";
import { STORES } from "../../../../data/stores.js";
import { setSelectedStore, useSelectedStore } from "../../../../components/SelectStore/selectedStore.js";

function SearchIcon() {
    return (
        <svg className={styles.icon} viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <circle cx="8.5" cy="8.5" r="6" stroke="currentColor" strokeWidth="1.8" />
            <path d="m13 13 5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
    );
}

function PinIcon() {
    return (
        <svg className={styles.pin} viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M12 21.5s7-6.6 7-12a7 7 0 0 0-14 0c0 5.4 7 12 7 12Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
            <circle cx="12" cy="9.5" r="2.6" stroke="currentColor" strokeWidth="1.6" />
        </svg>
    );
}

function matchesQuery(store, query) {
    const text = query.trim().toLowerCase();
    if (!text) return true;
    return [store.name, store.city, store.state, store.stateCode, store.zip]
            .some((value) => value.toLowerCase().includes(text))
        || store.zip.startsWith(text);
}

function FindAStore() {
    const pageRef = useRef(null);
    const [query, setQuery] = useState("");
    const [submittedQuery, setSubmittedQuery] = useState("");
    const [openStoreId, setOpenStoreId] = useState(null);
    const selectedStore = useSelectedStore();

    const results = useMemo(
        () => STORES.filter((store) => matchesQuery(store, submittedQuery)),
        [submittedQuery]
    );

    const handleSubmit = (event) => {
        event.preventDefault();
        setSubmittedQuery(query);
    };

    const handleClear = () => {
        setQuery("");
        setSubmittedQuery("");
    };

    const resultsTitle = submittedQuery.trim()
        ? `Results for “${submittedQuery.trim()}”`
        : "All stores";

    return (
        <>
            <TopHeader />
            <section ref={pageRef} className={`${styles.storePage} ${styles.hero}`}>
                <MainHeader theme={"light"} containerRef={pageRef} />
            </section>

            <main className={styles.container}>
                <div className={styles.layout}>
                    <section className={styles.panel}>
                        <div className={styles.searchBlock}>
                            <h1 className={styles.title}>Find a New Balance Store</h1>
                            <p className={styles.hint}>Search by Address, Province and State, Postal Code</p>

                            <form className={styles.searchForm} onSubmit={handleSubmit} role="search">
                                <button type="submit" className={styles.iconButton} aria-label="Search">
                                    <SearchIcon />
                                </button>
                                <input
                                    className={styles.searchInput}
                                    type="search"
                                    value={query}
                                    onChange={(event) => setQuery(event.target.value)}
                                    placeholder="Search here"
                                    aria-label="Search by address, state or postal code"
                                />
                            </form>
                        </div>
                    </section>

                    <section className={styles.results} aria-live="polite">
                        <div className={styles.resultsHeader}>
                            <h2 className={styles.resultsTitle}>{resultsTitle}</h2>
                            <span className={styles.resultsCount}>
                                {results.length} {results.length === 1 ? "store" : "stores"}
                            </span>
                            {submittedQuery && (
                                <button type="button" className={styles.clearButton} onClick={handleClear}>
                                    Show all stores
                                </button>
                            )}
                        </div>

                        {results.length === 0 ? (
                            <div className={styles.empty}>
                                <p>No stores found. Try another city, state or postal code.</p>
                            </div>
                        ) : (
                            <ul className={styles.storeList}>
                                {results.map((store) => (
                                    <li key={store.id} className={styles.storeCard}>
                                        <PinIcon />
                                        <div className={styles.storeInfo}>
                                            <h3 className={styles.storeName}>{store.name}</h3>
                                            <p className={styles.storeCity}>
                                                {store.city}, {store.stateCode} {store.zip}
                                            </p>
                                            <button
                                                type="button"
                                                className={styles.storeLink}
                                                aria-expanded={openStoreId === store.id}
                                                onClick={() => setOpenStoreId(id => id === store.id ? null : store.id)}
                                            >
                                                Store details
                                            </button>
                                            {openStoreId === store.id && (
                                                <div className={styles.storeDetails}>
                                                    <p>{store.name}</p>
                                                    <p>{store.city}, {store.state} {store.zip}</p>
                                                    <button
                                                        type="button"
                                                        className={styles.storeLink}
                                                        onClick={() => setSelectedStore(store.id)}
                                                        disabled={selectedStore?.id === store.id}
                                                    >
                                                        {selectedStore?.id === store.id ? "This is your store" : "Make this my store"}
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </section>
                </div>
            </main>

            <Footer />
        </>
    );
}

export default FindAStore;