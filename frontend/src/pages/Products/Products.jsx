import styles from "./Products.module.css";
import Footer from "../../components/Footer/Footer.jsx";
import TopHeader from "../../components/TopHeader/TopHeader.jsx";
import MainHeader from "../../components/MainHeader/MainHeader.jsx";
import ProductCard from "../../components/ProductCard/ProductCard";
import { useSearchParams } from "react-router-dom";
import ProductFilters from "../../components/ProductFilters/ProductFilters.jsx";
import { useEffect, useRef, useState } from "react";
import ProductDrawer from "../../components/ProductDrawer/ProductDrawer.jsx";
import { addToRecentlyViewed } from "../../utils/recentlyViewed.js";
import AddedToBagPopup from "../../components/AddedToBagPopup/AddedToBagPopup.jsx";
import { getProducts, isInStock } from "../../services/productsService.js";
import { createPortal } from "react-dom";
import { flashLoading, useLoadingOnChange } from "../../components/LoadingOverlay/loadingStore.js";
import { matchesSearch } from "../../components/SearchOverlay/searchProducts.js";
import { getProductActivity, matchesActivity, matchesCategory } from "./productTaxonomy.js";

const PAGE_SIZE = 18;

function Products() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function loadProducts() {
            try {
                const data = await getProducts();
                setProducts(data.filter(product => !product.featured && isInStock(product)));
            }
            catch(err){
                setError(err);
            }
            finally{
                setLoading(false);
            }
        }
        loadProducts();
    }, []);

    const [searchParams] = useSearchParams();
    const gender = searchParams.get("gender");
    const sale = searchParams.get("sale");
    const isNew = searchParams.get("new");
    const type = searchParams.get("type");
    const category = searchParams.get("category");
    const activity = searchParams.get("activity");
    const searchQuery = searchParams.get("q");
    const maxPrice = searchParams.get("maxPrice");
    const sizesParam = searchParams.get("sizes");

    const urlFilteredProducts = products.filter(product => {
        const productGender = product.gender.toLowerCase();
        const isUnisex = productGender === "unisex" && (gender === "men" || gender === "women");
        if(gender && !isUnisex && productGender !== gender)
            return false;

        if(type && product.type.toLowerCase() !== type)
            return false;

        if(category && !matchesCategory(product, category))
            return false;

        if(activity && !matchesActivity(product, activity))
            return false;

        if (sale === "true" && !product.hasDiscount())
            return false;

        if (isNew === "true" && !product.isNew)
            return false;

        if (searchQuery && !matchesSearch(product, searchQuery))
            return false;

        if (maxPrice && product.price > Number(maxPrice))
            return false;

        if (sizesParam) {
            const sizes = sizesParam.split(",");
            if (!product.variants.some(variant => sizes.includes(String(variant.size)) && variant.quantity > 0))
                return false;
        }

        return true;
    });

    const initialFilters = {
        category: [],
        footwearSizes: [],
        clothingSizes: [],
        accessoryType: [],
        colors: [],
        gender: [],
        activity: [],
        price: [],
    };
    const [filters, setFilters] = useState(initialFilters);
    const sectionKey = `${gender ?? ""}|${type ?? ""}`;
    const [filtersSection, setFiltersSection] = useState(sectionKey);
    if (filtersSection !== sectionKey) {
        setFiltersSection(sectionKey);
        setFilters(initialFilters);
    }

    const getProductColors = (product) => {
        const colors = product.colors?.length ? product.colors : Object.keys(product.images ?? {});
        return colors.map(color => color.toLowerCase().replace(/\d+$/, "").replace(/^gray$/, "grey"));
    };

    const checkPrice = (productPrice) => {
        if (!filters.price.length) return true;
        return filters.price.some(range => {
            if (range === "200")
                return productPrice >= 200;

            const [min, max] = range.split("-").map(Number);
            return productPrice >= min && productPrice <= max;
        });
    };

    const filteredProducts = urlFilteredProducts.filter(product => {

        if (filters.category.length && !filters.category.includes(product.type.toLowerCase()))
            return false;

        if (filters.footwearSizes.length && !product.variants.some(
            variant => filters.footwearSizes.includes(variant.size) &&
                variant.quantity > 0
        ))

            return false;

        if (filters.clothingSizes.length && !product.variants.some(
            variant => filters.clothingSizes.includes(variant.size) &&
                variant.quantity > 0
        ))
            return false;

        if (filters.accessoryType.length && !filters.accessoryType.includes(product.category))
            return false;

        if (filters.colors.length && !getProductColors(product).some(color => filters.colors.includes(color)))
            return false;

        if (filters.gender.length && !filters.gender.includes(product.gender))
            return false;

        if (filters.activity.length && !filters.activity.includes(getProductActivity(product)))
            return false;

        if (!checkPrice(product.price))
            return false;

        return true;
    });

    const [sortBy, setSortBy] = useState("featured");

    const listKey = JSON.stringify({ filters, sortBy, params: searchParams.toString() });
    useLoadingOnChange(listKey);
    const [page, setPage] = useState({ key: listKey, count: PAGE_SIZE });
    const visibleCount = page.key === listKey ? page.count : PAGE_SIZE;
    const sortedProducts = [...filteredProducts];

    switch (sortBy) {
        case "price-low":
            sortedProducts.sort((a, b) => a.price - b.price);
            break;
        case "price-high":
            sortedProducts.sort((a, b) => b.price - a.price);
            break;
        case "newest":
            sortedProducts.sort((a, b) => Number(b.isNew) - Number(a.isNew));
            break;
        case "available":
            sortedProducts.sort((a, b) => Number(b.isAvailable()) - Number(a.isAvailable()));
            break;
        default:
            break;
    }

    const breadcrumbs = [""];
    if (searchQuery) {
        breadcrumbs.push(`Results for "${searchQuery}"`);
    }
    else if (sale === "true") {
        breadcrumbs.push("Sale");
    }
    else if (isNew === "true") {
        breadcrumbs.push("New Arrivals");
    }
    else if (gender) {
        breadcrumbs.push(gender.charAt(0).toUpperCase() + gender.slice(1));
        if(type) {
            breadcrumbs.push(" / ");
            if(type === "footwear") {
                breadcrumbs.push("Shoes");
            }
            else {
                breadcrumbs.push(type.charAt(0).toUpperCase() + type.slice(1));
            }
        }

        if(category) {
            breadcrumbs.push(" / ");
            if(category === "shoes")
                breadcrumbs.push("All Shoes");
            else
                breadcrumbs.push(category.replace(/\b\w/g, letter => letter.toUpperCase()));

        }
        else if(activity) {
            breadcrumbs.push(" / ");
            breadcrumbs.push(activity.replace(/\b\w/g, letter => letter.toUpperCase()));
        }
    }

    const [selectedProduct, setSelectedProduct] = useState(null);
    const [selectedColor, setSelectedColor] = useState(null);
    const [showAddedPopup, setShowAddedPopup] = useState(false);

    const handleAddedToCart = () => {
        setShowAddedPopup(true);
        setTimeout(() => setShowAddedPopup(false), 2000);
    };

    const [showFilters, setShowFilters] = useState(true);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
    const pageRef = useRef(null);

    useEffect(() => {
        const handleResize = () => {
            const mobile = window.innerWidth <= 768;
            setIsMobile(mobile);
            if (mobile) {
                setShowFilters(false);
            }
        };
        window.addEventListener('resize', handleResize);
        handleResize();
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Disable scrolling when mobile filters are open
    useEffect(() => {
        if (mobileFiltersOpen) {
            document.body.classList.add('menu-open');
            document.documentElement.classList.add('menu-open');
        }
        else {
            document.body.classList.remove('menu-open');
            document.documentElement.classList.remove('menu-open');
        }
        return () => {
            document.body.classList.remove('menu-open');
            document.documentElement.classList.remove('menu-open');
        };
    }, [mobileFiltersOpen]);

    return (
        <>
            <TopHeader />
            <section ref={pageRef} className={`${styles.productsPage} ${styles.hero}`}>
                <MainHeader theme={"light"} containerRef={pageRef} />
            </section>

            <main className={styles.productsMain}>
                <nav className={styles.breadcrumb}>{breadcrumbs}</nav>

                <div className={styles.productsToolbar}>
                    <button
                        className={styles.filtersBtn}
                        onClick={() => {
                            if (isMobile) {
                                setMobileFiltersOpen(true);
                            }
                            else {
                                setShowFilters(prev => !prev);
                            }
                        }}
                    >
                        {isMobile ? "☰ Filters" : (showFilters ? "☰ Hide Filters" : "☰ Show Filters")}
                    </button>

                    <select
                        className={styles.sortSelect}
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                    >
                        <option value="featured">Featured</option>
                        <option value="price-low">Price: Low to High</option>
                        <option value="price-high">Price: High to Low</option>
                        <option value="newest">Newest</option>
                        <option value="available">Available</option>
                    </select>
                </div>

                <div className={`${styles.productsWrapper} ${(!showFilters || isMobile) ? styles.productsWrapperNoFilters : ""}`}>
                    {!isMobile && showFilters && (
                        <ProductFilters
                            filters={filters}
                            setFilters={setFilters}
                            initialFilters={initialFilters}
                            sectionType={type}
                            sectionGender={gender}
                        />
                    )}

                    <div className={styles.productsContent}>
                        <section className={`${styles.productGrid} ${(!showFilters || isMobile) ? styles.productGridWide : ""}`}>
                            {loading && <p>Loading products...</p>}
                            {error && <p>Failed to load products.</p>}
                            {!loading && !error && sortedProducts.length === 0 && <p>No products found.</p>}
                            {!loading && !error &&
                                sortedProducts.slice(0, visibleCount).map(product => (
                                    <ProductCard
                                        key={product.id}
                                        product={product}
                                        onQuickAdd={(product, color) => {
                                            addToRecentlyViewed(product);
                                            setSelectedProduct(product);
                                            setSelectedColor(color);
                                        }}
                                        page={"products"}
                                    />
                                ))
                            }
                        </section>

                        {!loading && !error && sortedProducts.length > 0 && (
                            <div className={styles.loadMore}>
                                <p className={styles.loadMoreText}>
                                    You have viewed {Math.min(visibleCount, sortedProducts.length)} of {sortedProducts.length} results
                                </p>
                                {visibleCount < sortedProducts.length && (
                                    <button
                                        type="button"
                                        className={styles.loadMoreBtn}
                                        onClick={() => {
                                            flashLoading();
                                            setPage({ key: listKey, count: visibleCount + PAGE_SIZE });
                                        }}
                                    >
                                        Load more
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </main>

            {/* Mobile filter overlay via Portal */}
            {isMobile && createPortal(
                <div className={`${styles.mobileFiltersDrawer} ${mobileFiltersOpen ? styles.active : ""}`}>
                    <div className={styles.mobileFiltersHeader}>
                        <h2>Filters</h2>
                        <button
                            className={styles.mobileFiltersClose}
                            onClick={() => setMobileFiltersOpen(false)}
                        >
                            ✕
                        </button>
                    </div>
                    <div className={styles.mobileFiltersBody}>
                        <ProductFilters
                            filters={filters}
                            setFilters={setFilters}
                            initialFilters={initialFilters}
                            sectionType={type}
                            sectionGender={gender}
                        />
                    </div>
                    <div className={styles.mobileFiltersFooter}>
                        <button
                            className={styles.applyFiltersBtn}
                            onClick={() => setMobileFiltersOpen(false)}
                        >
                            See Results ({sortedProducts.length})
                        </button>
                    </div>
                </div>,
                document.body
            )}

            <ProductDrawer
                key={selectedProduct?.id + "-" + selectedColor}
                product={selectedProduct}
                activeColor={selectedColor}
                onClose={() => setSelectedProduct(null)}
                onAddedToCart={handleAddedToCart}
            />

            {showAddedPopup && <AddedToBagPopup />}
            <Footer />
        </>
    );
}

export default Products;