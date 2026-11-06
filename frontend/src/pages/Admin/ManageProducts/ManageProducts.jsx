import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "./ManageProducts.module.css";
import TopHeader from "../../../components/TopHeader/TopHeader.jsx";
import MainHeader from "../../../components/MainHeader/MainHeader.jsx";
import Footer from "../../../components/Footer/Footer.jsx";
import ConfirmModal from "../../../components/ConfirmModal/ConfirmModal.jsx";
import { deleteProduct, fetchProducts } from "../../../services/api/productsApi.js";
import Notice from "../../../components/Notice/Notice.jsx";

function getCoverImage(product) {
    const images = product.images || {};
    const colors = [...(product.colors || []), ...Object.keys(images)];

    for (const color of colors) {
        const list = images[color];
        if (list && list.length > 0) return list[0];
    }

    return "";
}

function getColorCount(product) {
    const colors = new Set([
        ...(product.colors || []),
        ...Object.keys(product.images || {})
    ]);

    return colors.size;
}

const TYPE_FILTERS = [
    { value: "all", label: "All" },
    { value: "footwear", label: "Shoes" },
    { value: "clothing", label: "Clothing" },
    { value: "accessories", label: "Accessories" }
];

const GENDER_FILTERS = ["Men", "Women", "Unisex", "Kids"];

function formatPrice(value) {
    const number = Number(value);
    return Number.isNaN(number) ? "" : `$${number.toFixed(2)}`;
}

function ManageProducts() {
    const pageRef = useRef(null);
    const navigate = useNavigate();
    const location = useLocation();

    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [loadError, setLoadError] = useState("");
    const [search, setSearch] = useState("");
    const [typeFilter, setTypeFilter] = useState("all");
    const [genderFilter, setGenderFilter] = useState("all");
    const [productToDelete, setProductToDelete] = useState(null);
    const [deletingId, setDeletingId] = useState(null);
    const [notice, setNotice] = useState(() =>
        location.state?.notice ? { type: "success", text: location.state.notice } : null
    );

    useEffect(() => {
        let cancelled = false;

        async function loadProducts() {
            try {
                const data = await fetchProducts();
                if (!cancelled) setProducts(data || []);
            }
            catch (error) {
                console.error("Load products error:", error);
                if (!cancelled) setLoadError("Failed to load products.");
            }
            finally {
                if (!cancelled) setIsLoading(false);
            }
        }

        loadProducts();

        return () => {
            cancelled = true;
        };
    }, []);

    const query = search.trim().toLowerCase();
    const matchesGender = (product) =>
        genderFilter === "all" || String(product.gender || "").toLowerCase() === genderFilter.toLowerCase();
    const matchesType = (product, type) =>
        type === "all" || String(product.type || "").toLowerCase() === type;
    const matchesSearch = (product) =>
        !query ||
        String(product.name || "").toLowerCase().includes(query) ||
        String(product.id).includes(query);

    const visibleProducts = products.filter((product) =>
        matchesType(product, typeFilter) && matchesGender(product) && matchesSearch(product)
    );
    const countForType = (type) =>
        products.filter((product) => matchesType(product, type) && matchesGender(product) && matchesSearch(product)).length;
    const hasFilters = query || typeFilter !== "all" || genderFilter !== "all";

    const confirmDelete = async () => {
        const product = productToDelete;
        setProductToDelete(null);
        if (!product) return;

        setDeletingId(product.id);
        setNotice(null);
        try {
            await deleteProduct(product.id);
            setProducts((prev) => prev.filter((item) => item.id !== product.id));
            setNotice({ type: "success", text: `"${product.name}" was deleted.` });
        }
        catch (error) {
            console.error("Delete product error:", error);
            setNotice({ type: "error", text: "Failed to delete product. Please log in again as admin and try once more." });
        }
        finally {
            setDeletingId(null);
        }
    };

    return (
        <>
            <TopHeader />
            <section ref={pageRef} className={`${styles.manageProducts} ${styles.hero}`}>
                <MainHeader theme={"light"} containerRef={pageRef} />
            </section>

            <main className={styles.container}>
                <div className={styles.wrapper}>
                    <div className={styles.pageHeader}>
                        <h1 className={styles.pageTitle}>Manage Products</h1>

                        <button
                            type="button"
                            className={styles.backBtn}
                            onClick={() => navigate("/admin")}
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="19" y1="12" x2="5" y2="12"></line>
                                <polyline points="12 19 5 12 12 5"></polyline>
                            </svg>
                            Back to Dashboard
                        </button>
                    </div>

                    <Notice type={notice?.type} onClose={() => setNotice(null)} className={styles.notice}>{notice?.text}</Notice>

                    <div className={styles.card}>
                        <div className={styles.cardHeader}>
                            <h2 className={styles.cardTitle}>
                                Products
                                {!isLoading && !loadError && (
                                    <span className={styles.count}>{visibleProducts.length}</span>
                                )}
                            </h2>

                            <input
                                type="text"
                                className={styles.searchInput}
                                placeholder="Search by name or ID"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>

                        {!isLoading && !loadError && products.length > 0 && (
                            <div className={styles.filters}>
                                <div className={styles.typeTabs}>
                                    {TYPE_FILTERS.map((item) => (
                                        <button
                                            key={item.value}
                                            type="button"
                                            className={`${styles.typeTab} ${typeFilter === item.value ? styles.typeTabActive : ""}`}
                                            onClick={() => setTypeFilter(item.value)}
                                        >
                                            {item.label}
                                            <span className={styles.typeCount}>{countForType(item.value)}</span>
                                        </button>
                                    ))}
                                </div>

                                <select
                                    className={styles.genderSelect}
                                    value={genderFilter}
                                    onChange={(e) => setGenderFilter(e.target.value)}
                                    aria-label="Filter by gender"
                                >
                                    <option value="all">All genders</option>
                                    {GENDER_FILTERS.map((item) => (
                                        <option key={item} value={item}>{item}</option>
                                    ))}
                                </select>
                            </div>
                        )}

                        {isLoading && <p className={styles.statusText}>Loading...</p>}
                        {loadError && <p className={styles.statusText}>{loadError}</p>}

                        {!isLoading && !loadError && visibleProducts.length === 0 && (
                            <p className={styles.statusText}>
                                {hasFilters ? "No products match your filters." : "There are no products yet."}
                            </p>
                        )}

                        {!isLoading && !loadError && visibleProducts.length > 0 && (
                            <ul className={styles.list}>
                                {visibleProducts.map((product) => {
                                    const cover = getCoverImage(product);
                                    const colorCount = getColorCount(product);

                                    return (
                                        <li key={product.id} className={styles.row}>
                                            <div className={styles.thumb}>
                                                {cover && <img src={cover} alt={product.name} />}
                                            </div>

                                            <div className={styles.info}>
                                                <span className={styles.name}>{product.name}</span>
                                                <span className={styles.meta}>
                                                    ID {product.id} · {product.gender} · {product.category || product.type}
                                                    {colorCount > 0 && ` · ${colorCount} ${colorCount === 1 ? "color" : "colors"}`}
                                                </span>
                                            </div>

                                            <div className={styles.price}>
                                                <span>{formatPrice(product.price)}</span>
                                                {product.oldPrice && (
                                                    <span className={styles.oldPrice}>{formatPrice(product.oldPrice)}</span>
                                                )}
                                            </div>

                                            <div className={styles.actions}>
                                                <button
                                                    type="button"
                                                    className={styles.editBtn}
                                                    onClick={() => navigate(`/edit-product/${product.id}`)}
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    type="button"
                                                    className={styles.deleteBtn}
                                                    onClick={() => setProductToDelete(product)}
                                                    disabled={deletingId === product.id}
                                                >
                                                    {deletingId === product.id ? "Deleting..." : "Delete"}
                                                </button>
                                            </div>
                                        </li>
                                    );
                                })}
                            </ul>
                        )}
                    </div>
                </div>
            </main>

            <ConfirmModal
                isOpen={Boolean(productToDelete)}
                title="Delete product?"
                message={productToDelete ? `"${productToDelete.name}" will be removed from the store. This cannot be undone.` : ""}
                onConfirm={confirmDelete}
                onCancel={() => setProductToDelete(null)}
            />

            <Footer />
        </>
    );
}

export default ManageProducts;