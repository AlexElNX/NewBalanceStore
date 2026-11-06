import { Cart } from "../entities/Cart.js";

export function cartReducer(state, action) {
    const cart = new Cart(
        state.products.map(item => ({...item}))
    );

    switch (action.type) {
        case 'ADD_PRODUCT': {
            cart.addProduct(
                action.payload.product,
                action.payload.color,
                action.payload.size
            );
            return cart;
        }
        case 'REMOVE_PRODUCT': {
            cart.removeProduct(
                action.payload.id,
                action.payload.color,
                action.payload.size
            );

            return cart;
        }
        case 'UPDATE_QUANTITY': {
            cart.updateQuantity(
                action.payload.id,
                action.payload.color,
                action.payload.size,
                action.payload.quantity
            );

            return cart;
        }
        case 'LOAD_CART': {
            return new Cart(action.payload.map(item => ({...item})));
        }
        case 'CLEAR_CART': {
            return new Cart([]);
        }
        default:
            return state;
    }
}