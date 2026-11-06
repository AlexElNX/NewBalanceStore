import  { useEffect, useReducer, useRef, useState } from "react";
import {
    CART_CLEARED_EVENT,
    clearGuestCart,
    getCart,
    getCartKey,
    getGuestCart,
    isGuestCartKey,
    mergeCarts,
    saveCart
} from "../utils/cartStorage.js";
import { AUTH_CHANGE_EVENT } from "../services/api/authService.js";
import { Cart } from "../entities/Cart.js";
import { cartReducer } from "../reducers/cartReducer.js";
import { CartContext } from "./CartContext.jsx";

function loadCart(key) {
    if (isGuestCartKey(key)) return new Cart(getCart(key));
    return new Cart(mergeCarts(getCart(key), getGuestCart()));
}

export function CartProvider({ children }) {
    const [cartKey, setCartKey] = useState(getCartKey);
    const [cart, dispatch] = useReducer(cartReducer, cartKey, loadCart);
    const cartKeyRef = useRef(cartKey);

    useEffect(() => {
        saveCart(cart.products, cartKey);
        if (!isGuestCartKey(cartKey)) clearGuestCart();
    }, [cart, cartKey]);

    useEffect(() => {
        const handleAuthChange = () => {
            const nextKey = getCartKey();
            if (nextKey === cartKeyRef.current) return;

            cartKeyRef.current = nextKey;
            setCartKey(nextKey);
            dispatch({ type: "LOAD_CART", payload: loadCart(nextKey).products });
        };

        const handleCartCleared = () => dispatch({ type: "CLEAR_CART" });

        window.addEventListener(AUTH_CHANGE_EVENT, handleAuthChange);
        window.addEventListener(CART_CLEARED_EVENT, handleCartCleared);

        return () => {
            window.removeEventListener(AUTH_CHANGE_EVENT, handleAuthChange);
            window.removeEventListener(CART_CLEARED_EVENT, handleCartCleared);
        };
    }, []);

    return (
        <CartContext.Provider value={{ cart, dispatch }}>
            {children}
        </CartContext.Provider>
    );
}
