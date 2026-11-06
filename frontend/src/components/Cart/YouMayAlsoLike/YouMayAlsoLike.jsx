import styles from "./YouMayAlsoLike.module.css";
import { useEffect, useState } from "react";
import ProductCarousel from "../../ProductCarousel/ProductCarousel.jsx";
import { getProducts } from "../../../services/productsService.js";

const MAX_PRODUCTS = 12;

function YouMayAlsoLike() {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        let cancelled = false;
        getProducts()
            .then(list => {
                if (!cancelled) setProducts(list.filter(product => product.variants?.some(variant => variant.quantity > 0)).slice(0, MAX_PRODUCTS));
            })
            .catch(() => {
                if (!cancelled) setProducts([]);
            });
        return () => { cancelled = true; };
    }, []);

    if (products.length === 0) return null;

    return (
        <div className={styles.wrapper}>
            <ProductCarousel title="You may also like" products={products} wide />
        </div>
    );
}

export default YouMayAlsoLike;
