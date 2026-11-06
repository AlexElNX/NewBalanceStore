import styles from "./BagDrawer.module.css";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";

import { useCart } from "../../context/useCart.js";
import { getProducts } from "../../services/productsService.js";
import { createProductView } from "../../pages/Product/productView.js";
import { formatColorName, formatPrice, formatSizeLabel } from "../../utils/productFormat.js";
import { BAG_DRAWER_EVENT } from "./bagDrawerEvents.js";
import { MAX_QUANTITY_PER_ITEM } from "../../entities/Cart.js";
const HOVER_OPEN_DELAY = 150;

function pickFrequentlyBought(items, products) {
    const inBag = new Set(items.map(item => String(item.product.id)));
    const bagTypes = new Set(items.map(item => item.product.type));
    const others = products.filter(product => !inBag.has(String(product.id)) && product.getMainImage() && product.isAvailable());
    const otherType = others.filter(product => !bagTypes.has(product.type));

    return [...otherType, ...others.filter(product => bagTypes.has(product.type))].slice(0, 2);
}

function BagDrawer({ triggerRef }) {
    const { cart, dispatch } = useCart();
    const [mode, setMode] = useState(null);
    const [closing, setClosing] = useState(false);
    const [top, setTop] = useState(0);
    const [products, setProducts] = useState([]);

    const modeRef = useRef(null);
    const timers = useRef({});
    const count = cart.getProductCount();
    const countRef = useRef(count);

    useEffect(() => {
        modeRef.current = mode;
    }, [mode]);

    useEffect(() => {
        countRef.current = count;
    }, [count]);

    const getHeaderBottom = useCallback(() => {
        const header = triggerRef?.current?.closest("header");
        if (!header) return 0;
        return Math.max(0, Math.round(header.getBoundingClientRect().bottom));
    }, [triggerRef]);

    const open = useCallback(nextMode => {
        setTop(getHeaderBottom());
        setClosing(false);
        setMode(nextMode);
    }, [getHeaderBottom]);

    const close = useCallback(() => {
        clearTimeout(timers.current.open);
        if (modeRef.current) setClosing(true);
    }, []);

    useEffect(() => {
        const handleOpen = event => open(event.detail?.mode === "bag" ? "bag" : "added");

        window.addEventListener(BAG_DRAWER_EVENT, handleOpen);
        return () => window.removeEventListener(BAG_DRAWER_EVENT, handleOpen);
    }, [open]);

    useEffect(() => {
        const trigger = triggerRef?.current;
        if (!trigger) return;

        const canHover = window.matchMedia("(hover: hover) and (min-width: 769px)");
        const allTimers = timers.current;

        const handleEnter = () => {
            if (!canHover.matches || countRef.current === 0 || modeRef.current === "added") return;

            allTimers.open = setTimeout(() => open("bag"), HOVER_OPEN_DELAY);
        };

        const handleLeave = () => clearTimeout(allTimers.open);

        trigger.addEventListener("mouseenter", handleEnter);
        trigger.addEventListener("mouseleave", handleLeave);

        return () => {
            trigger.removeEventListener("mouseenter", handleEnter);
            trigger.removeEventListener("mouseleave", handleLeave);
            clearTimeout(allTimers.open);
        };
    }, [triggerRef, open]);

    useEffect(() => {
        const header = triggerRef?.current?.closest("header");
        if (!mode || !header) return;

        header.classList.add(styles.headerActive);
        return () => header.classList.remove(styles.headerActive);
    }, [mode, triggerRef]);

    useEffect(() => {
        if (!mode) return;

        let frame;
        const follow = () => {
            const bottom = getHeaderBottom();
            setTop(current => (current === bottom ? current : bottom));
            frame = requestAnimationFrame(follow);
        };

        frame = requestAnimationFrame(follow);
        return () => cancelAnimationFrame(frame);
    }, [mode, getHeaderBottom]);

    useEffect(() => {
        if (!mode) return;

        const handleKey = event => {
            if (event.key === "Escape") close();
        };

        window.addEventListener("keydown", handleKey);
        return () => window.removeEventListener("keydown", handleKey);
    }, [mode, close]);

    const missingProduct = cart.products.some(
        entry => !products.some(product => String(product.id) === String(entry.productId))
    );

    useEffect(() => {
        if (!mode || !missingProduct) return;

        let cancelled = false;

        getProducts()
            .then(list => {
                if (!cancelled) setProducts(list.map(createProductView));
            })
            .catch(() => {});

        return () => {
            cancelled = true;
        };
    }, [mode, missingProduct]);

    useEffect(() => {
        if (mode && count === 0) close();
    }, [mode, count, close]);

    if (!mode) return null;

    const items = [...cart.products]
        .reverse()
        .map(entry => ({
            entry,
            product: products.find(product => String(product.id) === String(entry.productId))
        }))
        .filter(item => item.product);

    const subtotal = items.reduce((sum, item) => sum + item.product.price * item.entry.quantity, 0);
    const hasUnavailable = items.some(item => item.product.getAvailableQuantity(item.entry.color, item.entry.size) < item.entry.quantity);
    const frequentlyBought = pickFrequentlyBought(items, products);

    const changeQuantity = (entry, quantity) => {
        dispatch({
            type: "UPDATE_QUANTITY",
            payload: { id: entry.productId, color: entry.color, size: entry.size, quantity }
        });
    };

    const removeItem = entry => {
        dispatch({
            type: "REMOVE_PRODUCT",
            payload: { id: entry.productId, color: entry.color, size: entry.size }
        });
    };

    const handleAnimationEnd = event => {
        if (closing && event.target === event.currentTarget) {
            setClosing(false);
            setMode(null);
        }
    };

    const isAdded = mode === "added";

    return createPortal(
        <>
            <div
                className={`${styles.overlay} ${closing ? styles.overlayClosing : ""}`}
                style={{ top }}
                onClick={close}
                aria-hidden="true"
            />

            <aside
                className={`${styles.drawer} ${closing ? styles.drawerClosing : ""}`}
                style={{ top }}
                role="dialog"
                aria-label={isAdded ? "Added to bag" : "Bag"}
                onAnimationEnd={handleAnimationEnd}
            >
                <div className={styles.header}>
                    <h2 className={styles.title}>
                        {isAdded && (
                            <svg className={styles.check} width="26" height="26" viewBox="0 0 26 26" aria-hidden="true">
                                <circle cx="13" cy="13" r="11.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
                                <path d="M8 13.5l3.3 3.3L18 10" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        )}
                        {isAdded ? "Added to bag" : `Bag (${count})`}
                    </h2>

                    <button type="button" className={styles.close} onClick={close} aria-label="Close">
                        <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
                            <path d="M2 2l12 12M14 2L2 14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                        </svg>
                    </button>
                </div>

                <div className={styles.body}>
                    <ul className={styles.items}>
                        {items.map(({ entry, product }) => {
                            const stock = product.getAvailableQuantity(entry.color, entry.size);
                            const maxQuantity = Math.min(MAX_QUANTITY_PER_ITEM, stock);

                            return (
                                <li key={`${entry.productId}-${entry.color}-${entry.size}`} className={styles.item}>
                                    <Link to={`/product/${product.id}?color=${entry.color}`} className={styles.image} onClick={close}>
                                        {product.getMainImage(entry.color) && (
                                            <img src={product.getMainImage(entry.color)} alt={product.name} />
                                        )}
                                    </Link>

                                    <div className={styles.info}>
                                        <div className={styles.nameRow}>
                                            <Link to={`/product/${product.id}?color=${entry.color}`} className={styles.name} onClick={close}>
                                                {product.name}
                                            </Link>

                                            {!isAdded && (
                                                <button
                                                    type="button"
                                                    className={styles.remove}
                                                    onClick={() => removeItem(entry)}
                                                    aria-label={`Remove ${product.name}`}
                                                >
                                                    <svg width="14" height="14" viewBox="0 0 16 16" aria-hidden="true">
                                                        <path d="M2 2l12 12M14 2L2 14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                                                    </svg>
                                                </button>
                                            )}
                                        </div>

                                        {product.gender && <p className={styles.meta}>{product.gender}</p>}
                                        <p className={styles.meta}>Color: {formatColorName(entry.color)}</p>
                                        <p className={styles.meta}>
                                            Size: {formatSizeLabel(product, entry.size)}
                                            {product.type === "Footwear" && " | Standard"}
                                        </p>

                                        <div className={styles.qtyRow}>
                                            <div className={styles.qty}>
                                                <button
                                                    type="button"
                                                    className={styles.qtyButton}
                                                    onClick={() => changeQuantity(entry, entry.quantity - 1)}
                                                    disabled={entry.quantity <= 1}
                                                    aria-label="Decrease quantity"
                                                >
                                                    <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
                                                        <path d="M1 7h12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                                                    </svg>
                                                </button>

                                                <span className={styles.qtyValue}>Qty {entry.quantity}</span>

                                                <button
                                                    type="button"
                                                    className={styles.qtyButton}
                                                    onClick={() => changeQuantity(entry, entry.quantity + 1)}
                                                    disabled={entry.quantity >= maxQuantity}
                                                    aria-label="Increase quantity"
                                                >
                                                    <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
                                                        <path d="M1 7h12M7 1v12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                                                    </svg>
                                                </button>
                                            </div>

                                            <span className={styles.linePrice}>
                                                {formatPrice(product.price * entry.quantity)}
                                            </span>
                                        </div>

                                        {stock < entry.quantity && (
                                            <p className={styles.stockError}>
                                                {stock === 0 ? "This item is out of stock. Please remove it from your bag." : `Only ${stock} left. Please reduce the quantity.`}
                                            </p>
                                        )}
                                    </div>
                                </li>
                            );
                        })}
                    </ul>

                    <div className={styles.summary}>
                        <span>{count} {count === 1 ? "item" : "items"} in bag</span>
                        <span className={styles.subtotal}>Subtotal&nbsp;&nbsp;{formatPrice(subtotal)}</span>
                    </div>

                    <p className={styles.shipping}>Free shipping</p>

                    <div className={styles.actions}>
                        <Link to="/cart" className={styles.viewBag} onClick={close}>View Bag</Link>
                        {hasUnavailable ? (
                            <span className={`${styles.checkout} ${styles.checkoutDisabled}`} aria-disabled="true">Checkout</span>
                        ) : (
                            <Link to="/checkout" className={styles.checkout} onClick={close}>Checkout</Link>
                        )}
                    </div>

                    {frequentlyBought.length > 0 && (
                        <section className={styles.recommend}>
                            <h3 className={styles.recommendTitle}>Frequently bought with</h3>

                            <div className={styles.recommendGrid}>
                                {frequentlyBought.map(product => (
                                    <Link key={product.id} to={`/product/${product.id}`} className={styles.card} onClick={close}>
                                        <span className={styles.cardImage}>
                                            <img src={product.getMainImage()} alt={product.name} />
                                        </span>
                                        <span className={styles.cardName}>{product.name}</span>
                                        {product.gender && <span className={styles.cardMeta}>{product.gender}</span>}
                                        <span className={styles.cardPrice}>{formatPrice(product.price)}</span>
                                    </Link>
                                ))}
                            </div>
                        </section>
                    )}
                </div>
            </aside>
        </>,
        document.body
    );
}

export default BagDrawer;