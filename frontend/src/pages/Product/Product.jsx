import styles from "./Product.module.css";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";

import TopHeader from "../../components/TopHeader/TopHeader.jsx";
import MainHeader from "../../components/MainHeader/MainHeader.jsx";
import Footer from "../../components/Footer/Footer.jsx";
import NotFound from "../NotFound/NotFound.jsx";
import AddedToBagPopup from "../../components/AddedToBagPopup/AddedToBagPopup.jsx";
import ProductCarousel from "../../components/ProductCarousel/ProductCarousel.jsx";
import ProductGallery from "../../components/ProductPage/ProductGallery/ProductGallery.jsx";
import ColorSelector from "../../components/ProductPage/ColorSelector/ColorSelector.jsx";
import SizeSelector from "../../components/ProductPage/SizeSelector/SizeSelector.jsx";
import QuantitySelector from "../../components/ProductPage/QuantitySelector/QuantitySelector.jsx";
import ProductAccordion from "../../components/ProductPage/ProductAccordion/ProductAccordion.jsx";
import StickyAddToBag from "../../components/ProductPage/StickyAddToBag/StickyAddToBag.jsx";
import DeliveryOptions from "../../components/ProductPage/DeliveryOptions/DeliveryOptions.jsx";
import SizeGuide from "../../components/ProductPage/SizeGuide/SizeGuide.jsx";

import { useCart } from "../../context/useCart.js";
import { fetchProduct } from "../../services/api/productsApi.js";
import { getProducts } from "../../services/productsService.js";
import { addToRecentlyViewed, getRecentlyViewed } from "../../utils/recentlyViewed.js";
import { formatColorName, formatPrice, formatSizeLabel, formatTypeLabel } from "../../utils/productFormat.js";
import { createProductView, getCartQuantity, pickRelatedProducts } from "./productView.js";

const MAX_QUANTITY_PER_ITEM = 5;

function Product() {
    const { id } = useParams();
    const pageRef = useRef(null);

    const [reloadKey, setReloadKey] = useState(0);
    const [result, setResult] = useState({ key: null, status: "loading", product: null });
    const [related, setRelated] = useState([]);
    const [recent, setRecent] = useState([]);

    const requestKey = `${id}:${reloadKey}`;
    const status = result.key === requestKey ? result.status : "loading";
    const product = status === "ready" ? result.product : null;

    useEffect(() => {
        let cancelled = false;

        window.scrollTo({ top: 0 });

        const request = /^\d+$/.test(String(id))
            ? fetchProduct(id).then(createProductView)
            : Promise.reject(new Error("API error: 404"));

        request
            .then(data => {
                if (!cancelled) setResult({ key: requestKey, status: "ready", product: data });
            })
            .catch(error => {
                if (!cancelled) {
                    setResult({
                        key: requestKey,
                        status: /\b404\b/.test(error?.message ?? "") ? "notFound" : "error",
                        product: null,
                        message: error?.message ?? ""
                    });
                }
            });

        return () => {
            cancelled = true;
        };
    }, [id, requestKey]);

    useEffect(() => {
        if (!product) return;

        let cancelled = false;

        const recentIds = (getRecentlyViewed() || []).filter(
            recentId => String(recentId) !== String(product.id)
        );
        addToRecentlyViewed(product);

        document.title = `${product.name} | New Balance`;

        getProducts()
            .then(products => {
                if (cancelled) return;
                setRelated(pickRelatedProducts(product, products));
                setRecent(
                    recentIds
                        .map(recentId => products.find(item => String(item.id) === String(recentId)))
                        .filter(Boolean)
                );
            })
            .catch(() => {
                if (cancelled) return;
                setRelated([]);
                setRecent([]);
            });

        return () => {
            cancelled = true;
        };
    }, [product]);

    useEffect(() => () => {
        document.title = "New Balance";
    }, []);

    if (status === "notFound") {
        return <NotFound />;
    }

    return (
        <>
            <TopHeader />

            <section ref={pageRef} className={styles.hero}>
                <MainHeader theme={"light"} containerRef={pageRef} />
            </section>

            <main className={styles.page}>
                {status === "loading" && <ProductSkeleton />}

                {status === "error" && (
                    <div className={styles.errorBox} role="alert">
                        <h1>Something went wrong</h1>
                        <p>We couldn’t load this product. Please check your connection and try again.</p>
                        {import.meta.env.DEV && result.message && (
                            <p className={styles.errorDetails}>{result.message}</p>
                        )}
                        <button type="button" className={styles.primaryButton} onClick={() => setReloadKey(key => key + 1)}>
                            Try again
                        </button>
                    </div>
                )}

                {status === "ready" && product && (
                    <ProductView key={product.id} product={product} />
                )}

                {status === "ready" && (
                    <>
                        <ProductCarousel title="You may also like" products={related} />
                        <ProductCarousel title="Recently viewed" products={recent} />
                    </>
                )}
            </main>

            <Footer />
        </>
    );
}

function ProductView({ product }) {
    const { cart, dispatch } = useCart();
    const [searchParams, setSearchParams] = useSearchParams();

    const sizeRef = useRef(null);
    const addButtonRef = useRef(null);

    const [quantity, setQuantity] = useState(1);
    const [sizeError, setSizeError] = useState(false);
    const [showAddedPopup, setShowAddedPopup] = useState(false);
    const [showSticky, setShowSticky] = useState(false);
    const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
    const closeSizeGuide = useCallback(() => setSizeGuideOpen(false), []);

    const defaultColor = useMemo(
        () => product.colors.find(color => product.isColorAvailable(color)) ?? product.colors[0],
        [product]
    );

    const colorParam = searchParams.get("color");
    const selectedColor = product.colors.includes(colorParam) ? colorParam : defaultColor;

    const sizeParam = searchParams.get("size");
    const selectedSize = sizeParam !== null && product.isAvailable(selectedColor, sizeParam)
        ? product.getVariant(selectedColor, sizeParam).size
        : null;

    const updateParams = (changes) => {
        const next = new URLSearchParams(searchParams);

        Object.entries(changes).forEach(([key, value]) => {
            if (value === null || value === undefined || value === "") next.delete(key);
            else next.set(key, String(value));
        });

        setSearchParams(next, { replace: true, preventScrollReset: true });
    };

    const handleColorSelect = (color) => {
        const keepSize = selectedSize !== null && product.isAvailable(color, selectedSize);
        updateParams({ color, size: keepSize ? selectedSize : null });
        setQuantity(1);
    };

    const handleSizeSelect = (size) => {
        updateParams({ color: selectedColor, size });
        setSizeError(false);
        setQuantity(1);
    };

    const stock = selectedSize !== null ? product.getAvailableQuantity(selectedColor, selectedSize) : 0;
    const inCart = selectedSize !== null ? getCartQuantity(cart, product.id, selectedColor, selectedSize) : 0;
    const canAddMore = Math.max(0, Math.min(MAX_QUANTITY_PER_ITEM, stock) - inCart);
    const colorInStock = product.isColorAvailable(selectedColor);
    const productInStock = product.isAvailable();

    const maxQuantity = selectedSize !== null ? canAddMore : MAX_QUANTITY_PER_ITEM;
    const safeQuantity = Math.min(quantity, Math.max(1, maxQuantity));

    let buttonLabel = "Add to bag";
    let buttonDisabled = false;

    if (!productInStock || !colorInStock) {
        buttonLabel = "Out of stock";
        buttonDisabled = true;
    }
    else if (selectedSize !== null && canAddMore === 0) {
        buttonLabel = inCart > 0 ? "Max quantity in bag" : "Out of stock";
        buttonDisabled = true;
    }

    useEffect(() => {
        const button = addButtonRef.current;
        if (!button || typeof IntersectionObserver === "undefined") return;

        const observer = new IntersectionObserver(([entry]) => {
            setShowSticky(!entry.isIntersecting && entry.boundingClientRect.top < 0);
        });

        observer.observe(button);
        return () => observer.disconnect();
    }, []);

    const handleAddToBag = () => {
        if (buttonDisabled) return;

        if (selectedSize === null) {
            setSizeError(true);
            sizeRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
            return;
        }

        for (let i = 0; i < safeQuantity; i++) {
            dispatch({
                type: "ADD_PRODUCT",
                payload: {
                    product: { id: product.id },
                    productId: product.id,
                    color: selectedColor,
                    size: selectedSize,
                    quantity: safeQuantity
                }
            });
        }

        setQuantity(1);
        setShowAddedPopup(true);
    };

    useEffect(() => {
        if (!showAddedPopup) return;
        const timer = setTimeout(() => setShowAddedPopup(false), 2000);
        return () => clearTimeout(timer);
    }, [showAddedPopup]);

    const images = product.getImages(selectedColor);
    const hasDiscount = product.hasDiscount();
    const breadcrumbs = getBreadcrumbs(product);

    const collection = getCollectionName(product.name);

    const accordionItems = [
        {
            id: "description",
            title: "Description",
            defaultOpen: true,
            content: (
                <div className={styles.description}>
                    {collection && (
                        <p>
                            <strong>
                                Looking for other options? Shop the{" "}
                                <Link className={styles.descriptionLink} to={`/products?collection=${encodeURIComponent(collection)}`}>
                                    {collection}
                                </Link>
                            </strong>
                        </p>
                    )}
                    <p>{product.description || "No description available."}</p>
                </div>
            )
        },
        {
            id: "details",
            title: "Product Details",
            content: (
                <ul>
                    <li>Style #: {product.id}</li>
                    {product.type && <li>Type: {formatTypeLabel(product.type)}</li>}
                    {product.category && <li>Category: {product.category}</li>}
                    {product.activity && <li>Activity: {product.activity}</li>}
                    {product.gender && <li>Gender: {product.gender}</li>}
                    <li>Available colors: {product.colors.map(formatColorName).join(", ")}</li>
                </ul>
            )
        },
        {
            id: "fit",
            title: "Size & Fit",
            content: (
                <ul>
                    {product.type === "Footwear" && (
                        <li>Traditional lace-up closure provides an adjustable fit with a classic look</li>
                    )}
                    <li>
                        <button type="button" className={styles.fitGuideLink} onClick={() => setSizeGuideOpen(true)}>
                            Size &amp; Fit Guide
                        </button>
                    </li>
                </ul>
            )
        }
    ];

    return (
        <>
            <div className={styles.layout}>
                <div className={styles.galleryColumn}>
                    <ProductGallery key={selectedColor} images={images} alt={`${product.name} ${formatColorName(selectedColor)}`} />
                </div>

                <div className={styles.infoColumn}>
                    <nav className={styles.breadcrumbs} aria-label="Breadcrumb">
                        {breadcrumbs.map((crumb, index) => (
                            <span key={crumb.label} className={styles.crumb}>
                                {index > 0 && <span className={styles.crumbSep}>/</span>}
                                <Link to={crumb.to}>{crumb.label}</Link>
                            </span>
                        ))}
                        {String(product.gender).toLowerCase() === "unisex" && (
                            <span className={styles.crumbNote}>• Unisex</span>
                        )}
                    </nav>

                    {product.isNew && <span className={styles.badge}>New</span>}

                    <h1 className={styles.name}>{product.name}</h1>

                    <div className={styles.price}>
                        <span className={hasDiscount ? styles.salePrice : ""}>
                            {formatPrice(product.price)}
                        </span>
                        {hasDiscount && (
                            <>
                                <span className={styles.oldPrice}>
                                    <span className={styles.srOnly}>Original price: </span>
                                    {formatPrice(product.oldPrice)}
                                </span>
                                <span className={styles.discount}>
                                    Save {product.getDiscountPercent()}%
                                </span>
                            </>
                        )}
                    </div>

                    <ColorSelector
                        product={product}
                        selectedColor={selectedColor}
                        onSelect={handleColorSelect}
                    />

                    <SizeSelector
                        ref={sizeRef}
                        product={product}
                        color={selectedColor}
                        selectedSize={selectedSize}
                        onSelect={handleSizeSelect}
                        showError={sizeError}
                    />

                    <QuantitySelector
                        value={safeQuantity}
                        max={maxQuantity}
                        onChange={setQuantity}
                        disabled={buttonDisabled}
                    />

                    <button
                        ref={addButtonRef}
                        type="button"
                        className={styles.addToBag}
                        onClick={handleAddToBag}
                        disabled={buttonDisabled}
                    >
                        {buttonLabel}
                    </button>

                    {selectedSize !== null && !buttonDisabled && (
                        <p className={styles.selection}>
                            {formatColorName(selectedColor)} · Size {formatSizeLabel(product, selectedSize)} · Qty {safeQuantity}
                        </p>
                    )}

                    <p className={styles.payments}>
                        or 4 interest-free payments of <strong>{formatPrice(product.price / 4)}</strong>
                    </p>

                    <DeliveryOptions />

                    <ProductAccordion items={accordionItems} />

                    {sizeGuideOpen && <SizeGuide product={product} onClose={closeSizeGuide} />}
                </div>
            </div>

            <StickyAddToBag
                visible={showSticky}
                product={product}
                image={product.getMainImage(selectedColor)}
                label={buttonLabel}
                disabled={buttonDisabled}
                onClick={handleAddToBag}
            />

            {showAddedPopup && <AddedToBagPopup />}
        </>
    );
}

function getCollectionName(name) {
    return String(name ?? "").trim().split(/\s+/)[0] ?? "";
}

function getBreadcrumbs(product) {
    const gender = String(product.gender || "").toLowerCase();
    const genderParam = gender === "unisex" || !gender ? "men" : gender;
    const genderLabel = genderParam.charAt(0).toUpperCase() + genderParam.slice(1);

    const crumbs = [{ label: genderLabel, to: `/products?gender=${genderParam}` }];

    if (product.type) {
        const type = product.type.toLowerCase();
        crumbs.push({
            label: formatTypeLabel(product.type),
            to: `/products?gender=${genderParam}&type=${type}`
        });

        if (product.activity) {
            crumbs.push({
                label: product.activity,
                to: `/products?gender=${genderParam}&type=${type}&activity=${product.activity.toLowerCase()}`
            });
        }
    }

    return crumbs;
}

function ProductSkeleton() {
    return (
        <div className={styles.layout} aria-busy="true" aria-label="Loading product">
            <div className={styles.galleryColumn}>
                <div className={styles.skeletonGallery}>
                    {[0, 1, 2, 3].map(i => <div key={i} className={styles.skeleton} />)}
                </div>
            </div>
            <div className={styles.infoColumn}>
                <div className={`${styles.skeleton} ${styles.skeletonLine}`} style={{ width: "40%" }} />
                <div className={`${styles.skeleton} ${styles.skeletonTitle}`} />
                <div className={`${styles.skeleton} ${styles.skeletonLine}`} style={{ width: "25%" }} />
                <div className={`${styles.skeleton} ${styles.skeletonBlock}`} />
                <div className={`${styles.skeleton} ${styles.skeletonBlock}`} />
            </div>
        </div>
    );
}

export default Product;