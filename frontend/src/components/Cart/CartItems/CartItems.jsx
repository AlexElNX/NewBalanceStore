import styles from './CartItems.module.css';
import CartItem from "../CartItem/CartItem.jsx";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getProducts } from "../../../services/productsService.js";
import { useCart } from "../../../context/useCart.js";

function CartItems({ cart }) {
    const [products, setProducts] = useState([]);
    const { dispatch } = useCart();

    useEffect(() => {
        async function loadProducts() {
            setProducts(await getProducts());
        }

        loadProducts();
    }, []);

    useEffect(() => {
        if (!products.length) return;

        cart.products
            .filter(item => !products.some(product => String(product.id) === String(item.productId)))
            .forEach(item => dispatch({
                type: "REMOVE_PRODUCT",
                payload: {
                    id: item.productId,
                    color: item.color,
                    size: item.size
                }
            }));
    }, [products, cart, dispatch]);

    if (!products.length) {
        return null;
    }

    const cartProducts = cart.getItems(products);

    const productCount = cart.getProductCount();

    return (
        <div className={styles.cartItems}>

            <div className={`${styles.cartHeader} ${cart.isEmpty() ? styles.cartHeaderEmpty : ""}`}>
                <h2>My Bag</h2>

                {!cart.isEmpty() && (
                    <span className={styles.cartItemCount}>
                        {productCount} {productCount === 1 ? "Item" : "Items"}
                    </span>
                )}
            </div>

            { cart.isEmpty() ? (
                <div className={styles.emptyCart}>
                    <p>There are no items in your bag.</p>

                    <Link
                        to="/products"
                        className={styles.continueBtn}
                    >
                        Continue shopping
                    </Link>
                </div>
            ) : (cartProducts.map(item => (
                    <CartItem
                        key={`${item.product.id}-${item.color}-${item.size}`}
                        cartProduct={item}
                    />
                ))
            )}

        </div>
    );
}

export default CartItems