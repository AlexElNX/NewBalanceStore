import { getCookie, setCookie } from "./cookies.js";

const CART_KEY = "cart";

export function getCart() {
  return getCookie(CART_KEY) || [];
}

export function saveCart(cart) {
  setCookie(CART_KEY, cart, 30);
}

export function addToCart(product, color, size) {
  const cart = getCart();

  const existingItem = cart.find(item =>
    item.productId === product.id &&
    item.color === color &&
    item.size === size
  );

  if (existingItem) {
    existingItem.quantity++;
  } else {
    cart.push({
      productId: product.id,
      color,
      size,
      quantity: 1
    });
  }

  saveCart(cart);
}

export function removeFromCart(productId, color, size) {
  let cart = getCart();

  cart = cart.filter(
    item => !(
      item.productId === productId &&
      item.color === color &&
      item.size === size
    )
  );

  saveCart(cart);
}

export function updateCartQuantity(productId, color, size, quantity) {
  const cart = getCart();

  const item = cart.find(item =>
    item.productId === productId &&
    item.color === color &&
    item.size === size
  );

  if (item) {
    item.quantity = quantity;
  }

  saveCart(cart);
}
