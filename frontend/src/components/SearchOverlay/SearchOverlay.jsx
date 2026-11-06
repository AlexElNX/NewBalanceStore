import styles from "./SearchOverlay.module.css";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Link, useNavigate } from "react-router-dom";
import { getProducts, isInStock } from "../../services/productsService.js";
import { formatPrice } from "../../utils/productFormat.js";
import { searchProducts } from "./searchProducts.js";

const RECOMMENDED_COUNT = 4;
const MAX_RESULTS = 6;

const GENDER_LABELS = {
    men: "Men's",
    women: "Women's",
    kids: "Kids'",
    unisex: "Unisex",
};

function getImage(product) {
    const images = Object.values(product.images ?? {});
    return images[0]?.[0] ?? product.image;
}

function getTopSearches(products, limit = 5) {
    const names = [];
    for (const product of [...products].reverse()) {
        const name = String(product.name ?? "").trim();
        if (name && !names.some(item => item.toLowerCase() === name.toLowerCase())) {
            names.push(name);
        }
        if (names.length === limit) break;
    }
    return names;
}

function getSubtitle(product) {
    const gender = GENDER_LABELS[String(product.gender ?? "").toLowerCase()] ?? product.gender;
    return [gender, product.activity || product.category].filter(Boolean).join(" ");
}

function ProductRow({ product, onSelect }) {
    return (
        <li className={styles.item}>
            <Link to={`/product/${product.id}`} className={styles.product} onClick={onSelect}>
                <div className={styles.imageBox}>
                    <img src={getImage(product)} alt={product.name} />
                </div>
                <div className={styles.info}>
                    <span className={styles.name}>{product.name}</span>
                    <span className={styles.subtitle}>{getSubtitle(product)}</span>
                    <span className={styles.price}>
                        {formatPrice(product.price)}
                        {product.oldPrice != null && (
                            <s className={styles.oldPrice}>{formatPrice(product.oldPrice)}</s>
                        )}
                    </span>
                </div>
            </Link>
        </li>
    );
}

function SearchOverlay({ open, onClose, anchorRef }) {
    const navigate = useNavigate();
    const inputRef = useRef(null);
    const [query, setQuery] = useState("");
    const [products, setProducts] = useState(null);
    const [top, setTop] = useState(0);
    const onCloseRef = useRef(onClose);

    useEffect(() => {
        onCloseRef.current = onClose;
    });

    useEffect(() => {
        if (!open || products) return;
        let cancelled = false;
        getProducts()
            .then(list => { if (!cancelled) setProducts(list.filter(isInStock)); })
            .catch(() => { if (!cancelled) setProducts([]); });
        return () => { cancelled = true; };
    }, [open, products]);

    useLayoutEffect(() => {
        if (!open) return;
        const updateTop = () => {
            const anchor = anchorRef?.current;
            if (!anchor) {
                setTop(0);
                return;
            }
            if (anchor.style.position === "fixed") {
                setTop((parseFloat(anchor.style.top) || 0) + anchor.offsetHeight);
                return;
            }
            setTop(Math.max(anchor.getBoundingClientRect().bottom, 0));
        };
        updateTop();
        const frame = requestAnimationFrame(updateTop);
        window.addEventListener("resize", updateTop);
        return () => {
            cancelAnimationFrame(frame);
            window.removeEventListener("resize", updateTop);
        };
    }, [open, anchorRef]);

    useEffect(() => {
        if (!open) return;
        inputRef.current?.focus();
        const handleKey = (event) => {
            if (event.key === "Escape") {
                setQuery("");
                onCloseRef.current();
            }
        };
        document.addEventListener("keydown", handleKey);
        return () => {
            document.removeEventListener("keydown", handleKey);
        };
    }, [open]);

    if (!open) return null;

    const trimmed = query.trim();
    const results = products ? searchProducts(products, trimmed) : [];
    const recommended = (products ?? []).slice(0, RECOMMENDED_COUNT);
    const topSearches = getTopSearches(products ?? []);

    const close = () => {
        setQuery("");
        onClose();
    };

    const showAll = () => {
        if (!trimmed) return;
        navigate(`/products?q=${encodeURIComponent(trimmed)}`);
        close();
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        showAll();
    };

    return createPortal(
        <div className={styles.overlay} style={{ top }} role="dialog" aria-modal="true" aria-label="Search">
            <div className={styles.backdrop} onClick={close} />

            <div className={styles.panel}>
                <div className={styles.inner}>
                    <form className={styles.form} onSubmit={handleSubmit} role="search">
                        <input
                            ref={inputRef}
                            className={styles.input}
                            type="search"
                            placeholder="Search"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            aria-label="Search products"
                        />
                        <button
                            type="button"
                            className={styles.clearBtn}
                            onClick={() => {
                                setQuery("");
                                inputRef.current?.focus();
                            }}
                        >
                            Clear
                        </button>
                    </form>

                    {!trimmed && (
                        <>
                            {topSearches.length > 0 && (
                                <section className={styles.section}>
                                    <h3 className={styles.heading}>Top Searches</h3>
                                    <ul className={styles.topList}>
                                        {topSearches.map(term => (
                                            <li key={term}>
                                                <button
                                                    type="button"
                                                    className={styles.topBtn}
                                                    onClick={() => setQuery(term)}
                                                >
                                                    {term}
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                </section>
                            )}

                            {recommended.length > 0 && (
                                <section className={styles.section}>
                                    <h3 className={styles.heading}>Recommended for you</h3>
                                    <ul className={styles.products}>
                                        {recommended.map(product => (
                                            <ProductRow key={product.id} product={product} onSelect={close} />
                                        ))}
                                    </ul>
                                </section>
                            )}
                        </>
                    )}

                    {trimmed && products === null && (
                        <p className={styles.message}>Searching...</p>
                    )}

                    {trimmed && products !== null && results.length === 0 && (
                        <p className={styles.message}>No results for “{trimmed}”</p>
                    )}

                    {trimmed && results.length > 0 && (
                        <section className={styles.section}>
                            <h3 className={styles.heading}>Products</h3>
                            <ul className={styles.products}>
                                {results.slice(0, MAX_RESULTS).map(product => (
                                    <ProductRow key={product.id} product={product} onSelect={close} />
                                ))}
                            </ul>
                            <button type="button" className={styles.viewAllBtn} onClick={showAll}>
                                View all results ({results.length})
                            </button>
                        </section>
                    )}
                </div>
            </div>
        </div>,
        document.body
    );
}

export default SearchOverlay;