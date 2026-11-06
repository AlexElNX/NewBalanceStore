import { getStorage, setStorage, removeStorage } from "./localStorage.js";
import { getCurrentUser } from "../services/api/authService.js";
import { MAX_QUANTITY_PER_ITEM } from "../entities/Cart.js";

const GUEST_CART_KEY = "cart";

export const CART_CLEARED_EVENT = "cart-cleared";

export function getCartKey() {
  const email = getCurrentUser()?.email?.trim().toLowerCase();
  return email ? `cart_${email}` : GUEST_CART_KEY;
}

export function isGuestCartKey(key) {
  return key === GUEST_CART_KEY;
}

export function getCart(key = getCartKey()) {
  return getStorage(key) || [];
}

export function saveCart(cart, key = getCartKey()) {
  setStorage(key, cart);
}

export function getGuestCart() {
  return getCart(GUEST_CART_KEY);
}

export function clearGuestCart() {
  removeStorage(GUEST_CART_KEY);
}

export function mergeCarts(baseItems, extraItems) {
  const merged = baseItems.map(item => ({ ...item }));

  for (const item of extraItems) {
    const existing = merged.find(entry =>
        String(entry.productId) === String(item.productId) &&
        entry.color === item.color &&
        String(entry.size) === String(item.size)
    );

    if (existing) {
      existing.quantity = Math.min(existing.quantity + item.quantity, MAX_QUANTITY_PER_ITEM);
    }
    else {
      merged.push({ ...item });
    }
  }

  return merged;
}

export function clearCart() {
  removeStorage(getCartKey());
  clearGuestCart();
  window.dispatchEvent(new Event(CART_CLEARED_EVENT));
}