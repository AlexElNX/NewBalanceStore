import styles from './CartItem.module.css'
import { useCart } from "../../../context/useCart.js";
import { MAX_QUANTITY_PER_ITEM } from "../../../entities/Cart.js";
import LoadingOverlay from "../../LoadingOverlay/LoadingOverlay.jsx";
import { useLoadingAction } from "../../LoadingOverlay/useLoadingAction.js";

function CartItem({ cartProduct }) {
    const product = cartProduct.product;

    const { dispatch } = useCart();
    const { loading, run } = useLoadingAction();

    const colorMap = {
        white: "White",
        white1: "White",
        white2: "White",
        black_and_white: "Black & White",
        black: "Black",
        gray: "Gray",
        grey: "Gray",
        tan: "Tan",
        green: "Green",
        blue: "Blue",
        purple: "Purple",
        pink: "Pink",
        red: "Red",
        multi_color: "Multi Color"
    };
    const color = cartProduct.color;
    const stock = typeof product.getAvailableQuantity === "function"
        ? product.getAvailableQuantity(cartProduct.color, cartProduct.size)
        : 0;
    const maxQuantity = typeof product.getAvailableQuantity === "function"
        ? Math.min(MAX_QUANTITY_PER_ITEM, stock)
        : MAX_QUANTITY_PER_ITEM;

    const increaseQuantity = () => {
        if (cartProduct.quantity >= maxQuantity) return;

        run(() => dispatch({
            type: "UPDATE_QUANTITY",
            payload: {
                id: product.id,
                color: cartProduct.color,
                size: cartProduct.size,
                quantity: cartProduct.quantity + 1
            }
        }));
    };

    const qtyDecreaseClick = () => {
        if (cartProduct.quantity <= 1) return;

        run(() => dispatch({
            type: "UPDATE_QUANTITY",
            payload: {
                id: product.id,
                color: cartProduct.color,
                size: cartProduct.size,
                quantity: cartProduct.quantity - 1
            }
        }));
    };


    const removeClick = () => {
        run(() => dispatch({
            type: "REMOVE_PRODUCT",
            payload: {
                id: product.id,
                color: cartProduct.color,
                size: cartProduct.size
            }
        }));
    };

    return (
        <>
            <div className={styles.cartItem}>
                <div className={styles.cartItemImage}>
                    <img
                        src={product.images?.[cartProduct.color]?.[0]}
                        alt={product.name}
                    />
                </div>

                <div className={styles.cartItemInfo}>
                    <h3 className={styles.cartItemTitle}>{product.name}</h3>
                    <p className={styles.cartItemText}>{product.gender}</p>
                    <p className={styles.cartItemText}>Color: {colorMap[color] || color}</p>
                    <p className={styles.cartItemText}>Size: {cartProduct.size}</p>

                    {stock < cartProduct.quantity && typeof product.getAvailableQuantity === "function" && (
                        <p className={styles.stockError}>
                            {stock === 0 ? "This item is out of stock. Please remove it from your bag." : `Only ${stock} left. Please reduce the quantity.`}
                        </p>
                    )}

                    <div className={styles.qtyRow}>
                        <button
                            onClick={qtyDecreaseClick}
                            disabled={cartProduct.quantity <= 1}
                            className={styles.qtyBtn}>
                            -
                        </button>

                        <span>Qty: {cartProduct.quantity}</span>

                        <button
                            onClick={increaseQuantity}
                            disabled={cartProduct.quantity >= maxQuantity}
                            className={styles.qtyBtn}>
                            +
                        </button>
                    </div>
                </div>

                <div className={styles.cartItemActions}>
                    <button
                        onClick={removeClick}
                        className={styles.removeBtn}
                    >
                        ×
                    </button>

                    <div className={styles.cartPrice}>
                        {product.oldPrice && (
                            <span className={styles.oldPrice}>
                                ${(product.oldPrice * cartProduct.quantity).toFixed(2)}
                            </span>
                        )}
                        <span>
                            ${(product.price * cartProduct.quantity).toFixed(2)}
                        </span>
                    </div>
                </div>
            </div>

            <LoadingOverlay visible={loading} />
        </>
    )
}

export default CartItem
